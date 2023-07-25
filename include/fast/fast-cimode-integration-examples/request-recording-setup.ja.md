リクエストの記録を実装するには、自動化されたアプリケーションテストのステップに次の設定を適用します：

1. 自動化テストの実行コマンドの__前に__、FAST Dockerコンテナーを`CI_MODE=recording`モードで実行するコマンドを追加し、その他の必要な[変数](../ci-mode-recording.ja.md#environment-variables-in-recording-mode)を指定します。例えば：

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. 自動化テストをFASTノード経由でプロキシする設定を行います。例えば：

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Dockerネットワーク"
    リクエストを記録する前に、FASTノードと自動テストツールが同じネットワーク上で実行されていることを確認してください。