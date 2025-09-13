# FASTとBambooの統合

CI MODEでのFASTのBambooワークフローへの統合は、以下のいずれかの方法で設定できます。

* [YAML仕様](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html)を使用して
* [JAVA仕様](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html)を使用して
* [Bamboo UI](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html)を使用して

以下の例では、YAML仕様を使用して統合を設定します。

## FASTノードトークンの受け渡し

[FASTノードトークン](../../operations/create-node.md)を安全に使用するには、その値を[Bambooのグローバル変数](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html)で渡します。

![Bambooグローバル変数の受け渡し](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## リクエスト記録ステップの追加

リクエスト記録を実装するには、自動アプリケーションテストのジョブに次の設定を適用します。

1. 自動テストを実行するコマンドの__前に__、必要な[変数](../ci-mode-recording.md#environment-variables-in-recording-mode)とともに`CI_MODE=recording`モードでFASTのDockerコンテナを起動するコマンドを追加します。例:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. FASTノード経由で自動テストをプロキシするように設定します。例:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Dockerネットワーク"
    リクエストを記録する前に、FASTノードと自動テスト用ツールが同じネットワーク上で動作していることを確認してください。

??? info "記録モードでFASTノードを実行する自動テストステップの例"
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

    この例には次のステップが含まれます:

    1. Dockerネットワーク`my-network`を作成します。
    2. テストアプリ`dvwa`を`my-network`ネットワーク上で実行します。
    3. 記録モードでFASTノードを`my-network`ネットワーク上で実行します。
    4. 自動テスト用ツールSeleniumを、FASTノードをプロキシとして`my-network`ネットワーク上で実行します。
    5. `my-network`ネットワーク上で自動テストを実行します。
    6. 自動テスト用ツールSeleniumと記録モードのFASTノードを停止します。

## セキュリティテストステップの追加

セキュリティテストを実施するには、次の手順に従ってワークフローに対応する独立したステップを追加します。

1. テストアプリケーションが起動していない場合は、アプリケーションを起動するコマンドを追加します。
2. アプリケーションを実行するコマンドの__後に__、必要な[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)とともに`CI_MODE=testing`モードでFASTのDockerコンテナを起動するコマンドを追加します。

    !!! info "記録済みのベースラインリクエストセットの使用"
        ベースラインリクエストのセットが別のパイプラインで記録されている場合は、[TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode)変数にレコードIDを指定します。そうでない場合は、最後に記録されたセットが使用されます。

    コマンド例:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! warning "Dockerネットワーク"
    セキュリティテストの前に、FASTノードとテストアプリケーションが同じネットワーク上で動作していることを確認してください。

??? info "セキュリティテストステップの例"
    コマンドは、リクエスト記録ステップで作成した`my-network`ネットワーク上で実行されます。テストアプリ`app-test`もリクエスト記録ステップで実行されています。

    1. `stages`の一覧に`security_testing`を追加します。例では、このステップがワークフローを終了します。

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
    2. 新しいジョブ`security_test`の本体を定義します。

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

    この例には次のステップが含まれます:

    1. テストモードでFASTノードを`my-network`ネットワーク上で実行します。ベースラインリクエストのセットは現在のパイプラインで作成され最新の記録であるため、`TEST_RECORD_ID`変数は省略します。テストが終了するとFASTノードは自動的に停止します。
    2. テストアプリケーション`dvwa`を停止します。
    3. `my-network`ネットワークを削除します。

## テスト結果の取得

セキュリティテストの結果はBamboo UIのbuild logsに表示されます。また、Bambooでは完全な`.log`ファイルをダウンロードできます。

![テストモードでFASTノードを実行した結果](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## その他の例

FASTをBambooワークフローに統合するさらなる例は、当社の[GitHub](https://github.com/wallarm/fast-examples)で確認できます。

!!! info "その他のご質問"
    FASTの統合に関するご質問がある場合は、[お問い合わせ](mailto:support@wallarm.com)ください。