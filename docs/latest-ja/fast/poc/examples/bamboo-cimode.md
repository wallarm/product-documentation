# FASTとBambooの統合

CIモードのFASTをBambooワークフローに統合するには、以下の方法のいずれかを使用して設定できます：

* [YAML仕様](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html)を経由して
* [JAVA仕様](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html)を経由して
* [Bamboo UI](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html)を経由して

以下の例はYAML仕様を使用して統合を設定しています。

## FASTノードトークンの渡し

安全に[FASTノードトークン](../../operations/create-node.md)を使用するには、その値を[Bamboo全体変数](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html)として渡します。

![Bamboo全体変数の渡し](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## リクエスト記録ステップの追加

リクエストの記録を実装するには、以下の設定を自動化されたアプリケーションテストのジョブに適用します：

1. `CI_MODE=recording`モードで他の必要な[変数](../ci-mode-recording.md#environment-variables-in-recording-mode)と共にFAST Dockerコンテナを稼働させるコマンドを、自動テストを実行するコマンドの__前__に追加します。例：

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. 自動テストをFASTノード経由でプロキシ設定します。例：

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Dockerネットワーク"
    リクエストの記録を開始する前に、FASTノードと自動テストツールが同じネットワーク上で稼働していることを確認してください。

??? info "記録モードでFASTノードを稼働させている自動テストステップの例"
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

    例に含まれるステップ：

    1. Dockerネットワーク`my-network`を作成します。
    2. テストアプリ`dvwa`を`my-network`ネットワーク上で稼働させます。
    3. ネットワーク`my-network`上で記録モードのFASTノードを稼働させます。
    4. ネットワーク`my-network`上で自動テストツールSeleniumをプロキシとして利用するFASTノードを稼働させます。
    5. ネットワーク`my-network`上で自動テストを稼働させます。
    6. 自動テストツールSeleniumと記録モードのFASTノードを停止します。

## セキュリティテストのステップの追加

セキュリティテストを実装するには、以下の手順に従ってワークフローに対応する別のステップを追加します：

1. テストアプリケーションが稼働していない場合、アプリケーションを稼働させるコマンドを追加します。
2. アプリケーションを稼働させるコマンドの__後__に、`CI_MODE=testing`モードで他の必要な[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)と共にFAST Dockerコンテナを稼働させるコマンドを追加します。

    !!! info "記録されたベースラインリクエストセットの使用"
        ベースラインリクエストのセットが別のパイプラインで記録された場合、[TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode)変数にレコードIDを指定します。そうでない場合、最後に記録されたセットが使用されます。

    コマンドの例：

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! warning "Dockerネットワーク"
    セキュリティテストを開始する前に、FASTノードとテストアプリケーションが同じネットワーク上で稼働していることを確認してください。

??? info "セキュリティテストステップの例"
    コマンドはリクエスト記録ステップで作成された`my-network`ネットワーク上で実行されています。テストアプリ`app-test`もリクエスト記録ステップで稼働しています。

    1. `stages`のリストに`security_testing`を追加します。この例では、このステップがワークフローを終了します。

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
    2. 新しいジョブ`security_test`の本文を定義します。

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

    例に含まれるステップ：

    1. `my-network`ネットワーク上でテストモードのFASTノードを稼働させます。ベースラインリクエストのセットは現在のパイプラインで作成され、最後に記録されたものですので、`TEST_RECORD_ID`変数は省略されています。テストが完了するとFASTノードは自動的に停止します。
    2. テストアプリケーション`dvwa`を停止します。
    3. `my-network`ネットワークを削除します。

## テスト結果の取得

セキュリティテストの結果は、Bamboo UIのビルドログに表示されます。また、Bambooでは完全な`.log`ファイルをダウンロードすることもできます。

![テストモードでFASTノードを実行する結果](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## その他の例

我々の[GitHub](https://github.com/wallarm/fast-examples)でFASTをBambooワークフローに統合するさらなる例を見つけることができます。

!!! info "その他の質問"
    FAST統合に関連する質問がある場合は、[お問い合わせ](mailto:support@wallarm.com)ください。