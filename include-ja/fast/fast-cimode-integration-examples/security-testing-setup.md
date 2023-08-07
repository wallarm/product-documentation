セキュリティテストを実装するためには、次の手順に従ってワークフローに対応する別のステップを追加します：

1. テストアプリケーションが実行されていない場合は、アプリケーションの実行コマンドを追加します。
2. アプリケーションの実行コマンドの__後__に、`CI_MODE=testing` モードとその他必要な[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)を用いたFAST Dockerコンテナの実行コマンドを追加します。

    !!! info "録画されたベースラインリクエストセットの使用"
        ベースラインリクエストのセットが別のパイプラインで記録されていた場合は、[TEST_RECORD_ID][fast-ci-mode-test] 変数で記録IDを指定します。それ以外の場合、最後に記録されたセットが使用されます。

    コマンドの例：

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker Network"
    セキュリティテストを行う前に、FASTノードとテストアプリケーションが同じネットワーク上で実行されていることを確認してください。