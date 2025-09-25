セキュリティテストを実施するには、次の手順に従ってワークフローに対応する個別のステップを追加します:

1. テストアプリケーションが実行されていない場合は、アプリケーションを実行するコマンドを追加します。
2. アプリケーションを実行するコマンドの__後に__、`CI_MODE=testing`モードおよびその他の必須[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)を指定してFASTのDockerコンテナを起動するコマンドを追加します。

    !!! info "記録済みベースラインリクエストセットの使用"
        別のパイプラインでベースラインリクエストのセットが記録されている場合は、[TEST_RECORD_ID][fast-ci-mode-test]変数にレコードIDを指定します。そうでない場合は、最後に記録されたセットが使用されます。

    コマンド例:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Dockerネットワーク"
    セキュリティテストの前に、FASTノードとテストアプリケーションが同じネットワーク上で実行されていることを確認してください。