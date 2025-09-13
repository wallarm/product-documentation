リクエストの記録を実装するには、自動アプリケーションテストのステップに以下の設定を適用します:

1. 自動テストを実行するコマンドの__前に__、CI_MODE=recordingモードおよびその他の必要な[変数](../ci-mode-recording.md#environment-variables-in-recording-mode)を指定してFASTのDockerコンテナを起動するコマンドを追加します。例:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. FASTノード経由で自動テストをプロキシするように設定します。例:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Dockerネットワーク"
    リクエストを記録する前に、FASTノードと自動テスト用ツールが同一ネットワーク上で稼働していることを確認してください。