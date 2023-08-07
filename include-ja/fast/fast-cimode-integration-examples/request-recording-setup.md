リクエストの記録を実装するには、自動アプリケーションテストのステップに以下の設定を適用します：

1. 自動テストを実行するコマンド__の前__に、FAST Docker コンテナを `CI_MODE=recording` モードで実行するコマンドと他の必要な[変数](../ci-mode-recording.md#environment-variables-in-recording-mode)を追加します。例えば：

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. 自動テストのプロキシングをFASTノード経由で設定します。例えば：

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! 警告 "Docker Network"
    リクエストを記録する前に、FAST ノードと自動テスト用のツールが同じネットワーク上で実行されていることを確認してください。