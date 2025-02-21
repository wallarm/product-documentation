To implement the security testing, add the corresponding separate step to your workflow following these instructions:
セキュリティテストを実装するには、以下の手順に従い、ワークフローに対応する独立したステップを追加してください：

1. If the test application is not running, add the command to run the application.
　テストアプリケーションが実行されていない場合は、アプリケーションを起動するコマンドを追加してください。

2. Add the command running FAST Docker container in the `CI_MODE=testing` mode with other required [variables](../ci-mode-testing.md#environment-variables-in-testing-mode) __after__ the command running the application.
　アプリケーション起動コマンドの__後__に、他の必要な[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)と共に`CI_MODE=testing`モードでFAST Dockerコンテナを起動するコマンドを追加してください。

    !!! info "Using the recorded set of baseline requests"
        他のパイプラインでベースラインリクエストセットが記録されている場合は、[TEST_RECORD_ID][fast-ci-mode-test]変数にレコードIDを指定してください。そうでない場合は、最後に記録されたセットが使用されます。

    Example of the command:
    コマンドの例：

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker Network"
    セキュリティテストを実行する前に、FASTノードとテストアプリケーションが同じネットワーク上で実行されていることを確認してください。