要求の記録を実装するには、自動アプリケーションテストのステップに以下の設定を適用します：

1. 自動テスト実行コマンドの__前__に、他の必要な[変数](../ci-mode-recording.md#environment-variables-in-recording-mode)とともに`CI_MODE=recording`モードでFAST Dockerコンテナを実行するコマンドを追加します。例えば:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. FASTノードを介して自動テストのプロキシを構成します。例えば:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Dockerネットワーク"
    要求を記録する前に、FASTノードと自動テストツールが同じネットワーク上で実行されていることを確認します。