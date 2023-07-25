セキュリティテストを実装するために、以下の指示に従い、ワークフローに対応する別のステップを追加します：

1. テストアプリケーションが実行されていない場合は、アプリケーションを実行するコマンドを追加します。
2. アプリケーションを実行するコマンドの__後__に、`CI_MODE=testing` モードと他の必要な[変数](../ci-mode-testing.ja.md#environment-variables-in-testing-mode)とともにFAST Docker コンテナを実行するコマンドを追加します。

    !!! info "録画したベースラインリクエストのセットの使用"
        もしベースラインリクエストのセットが別のパイプラインで記録されていた場合、レコードIDを [TEST_RECORD_ID][fast-ci-mode-test] 変数に指定します。そうでなければ、最後に記録されたセットが使用されます。

    コマンドの例：

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker Network"
    セキュリティテストを始める前に、FAST ノードとテストアプリケーションが同じネットワーク上で稼働していることを確認してください。