# BambooとのFAST統合

CI MODEでのFASTの統合をBambooのワークフローに構成するには、以下のいずれかの方法を使用します:

* [YAML specification](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html)を経由して
* [JAVA specification](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html)を経由して
* [Bamboo UI](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html)を経由して

以下の例では、統合を構成するためにYAML specificationを使用しています。

## FASTノードトークンの渡し方

[FASTノードトークン](../../operations/create-node.md)を安全に使用するため、[Bambooグローバル変数](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html)にその値を渡してください。

![Passing Bamboo global variable](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## リクエスト記録ステップの追加

リクエスト記録を実装するには、自動アプリケーションテストのジョブに次の設定を適用してください:

1. 自動テストを実行するコマンドの前に、その他必要な[変数](../ci-mode-recording.md#environment-variables-in-recording-mode)と共に`CI_MODE=recording`モードでFAST Dockerコンテナを実行するコマンドを追加してください。例:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. FASTノードを経由して自動テストのプロキシ設定をしてください。例:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Dockerネットワーク"
    リクエスト記録を開始する前に、FASTノードと自動テストツールが同じネットワーク上で実行されていることを確認してください。

??? info "記録モードで実行中のFASTノードを用いた自動テストステップの例"
    ```
    test:
    key: TST
    tasks:
        - script:
            interpreter: /bin/sh
            scripts:
            - docker network create my-network
            - docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
            - docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
            - docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
            - docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
            - docker stop selenium fast
    ```

    以下のステップが含まれています:

    1. Dockerネットワーク`my-network`を作成します。
    2. `my-network`ネットワーク上でテストアプリ`dvwa`を実行します。
    3. `my-network`ネットワーク上で記録モードでFASTノードを実行します。
    4. `my-network`ネットワーク上でFASTノードをプロキシとして自動テストツールSeleniumを実行します。
    5. `my-network`ネットワーク上で自動テストを実行します。
    6. 自動テストツールSeleniumおよび記録モードで実行したFASTノードを停止します。

## セキュリティテストステップの追加

セキュリティテストを実装するには、以下の手順に従ってワークフローに対応する別のステップを追加してください:

1. テストアプリケーションが実行されていない場合、アプリケーションを実行するコマンドを追加してください。
2. アプリケーションの実行コマンドの後に、その他必要な[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)と共に`CI_MODE=testing`モードでFAST Dockerコンテナを実行するコマンドを追加してください。

    !!! info "記録済みのベースラインリクエストセットの使用"
        もしベースラインリクエストセットが他のパイプラインで記録されたものである場合、[TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode)変数に記録IDを指定してください。そうでなければ、最後に記録されたセットが使用されます。

    コマンドの例:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! warning "Dockerネットワーク"
    セキュリティテストを開始する前に、FASTノードとテストアプリケーションが同じネットワーク上で実行されていることを確認してください。

??? info "セキュリティテストステップの例"
    コマンドは、リクエスト記録ステップで作成した`my-network`ネットワーク上で実行されています。テストアプリケーション`app-test`もリクエスト記録ステップで実行されています。

    1. `stages`リストに`security_testing`を追加してください。この例では、このステップでワークフローが完了します。

        ```
        stages:
        - testing:
            manual: false
            jobs:
                - test
        - security_testing:
            final: true
            jobs:
                - security_test
        ```
    2. 新しいジョブ`security_test`の内容を定義してください。

        ```
        security_test:
        key: SCTST
        tasks:
            - script:
                interpreter: /bin/sh
                scripts:
                - docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
                - docker stop dvwa
                - docker network rm my-network
        ```

    以下のステップが含まれています:

    1. `my-network`ネットワーク上でテストモードでFASTノードを実行します。ベースラインリクエストセットは現在のパイプラインで作成され最後に記録されたため、`TEST_RECORD_ID`変数は省略します。テスト完了時にFASTノードは自動で停止されます。
    2. テストアプリケーション`dvwa`を停止します。
    3. `my-network`ネットワークを削除します。

## テスト結果の取得

セキュリティテストの結果は、Bamboo UIのビルドログに表示されます。また、Bambooでは完全な.logファイルのダウンロードも可能です。

![The result of running the FAST node in testing mode](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## さらなる例

FASTをBambooワークフローに統合する例については、弊社の[GitHub](https://github.com/wallarm/fast-examples)にてご確認ください。

!!! info "その他のご質問"
    FAST統合に関するご質問がある場合は、[お問い合わせください](mailto:support@wallarm.com).