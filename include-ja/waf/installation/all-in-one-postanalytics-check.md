NGINX‑Wallarmと個別postanalyticsモジュールの連携を確認するには、保護対象アプリケーションのアドレスにテスト攻撃付きのリクエストを送信します:

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarmと個別postanalyticsモジュールが正しく構成されている場合、攻撃はWallarm Cloudにアップロードされ、Wallarm Consoleの**Attacks**セクションに表示されます:

![Attacks in the interface][img-attacks-in-interface]

攻撃がCloudにアップロードされなかった場合、サービスの運用中にエラーがないかを確認してください:

* postanalyticsモジュールのログを解析します

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    `SystemError binary: failed to bind: Cannot assign requested address`という記録がある場合、指定されたアドレスとポートでサーバが接続を受け入れているかを確認してください。
* NGINX‑Wallarmモジュールがあるサーバで、NGINXログを解析します:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    `[error] wallarm: <address> connect() failed`という記録がある場合、NGINX‑Wallarmモジュールの構成ファイルで個別postanalyticsモジュールのアドレスが正しく指定され、個別postanalyticsサーバが指定されたアドレスとポートで接続を受け入れているかを確認してください。
* NGINX‑Wallarmモジュールがあるサーバで、下記のコマンドを使って処理されたリクエストの統計を取得し、`tnt_errors`の値が0であることを確認します:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [統計サービスで返されるすべてのパラメータの説明→][statistics-service-all-parameters]