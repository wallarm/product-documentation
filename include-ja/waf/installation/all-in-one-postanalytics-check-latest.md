NGINX‑Wallarmと別個のpostanalyticsモジュールの連携を確認するには、保護対象アプリケーションのアドレスにテスト攻撃を含むリクエストを送信できます:

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarmと別個のpostanalyticsモジュールが正しく構成されている場合、攻撃はWallarm Cloudにアップロードされ、Wallarm Consoleの**Attacks**セクションに表示されます:

![インターフェイスのAttacks][img-attacks-in-interface]

攻撃がWallarm Cloudにアップロードされなかった場合は、各サービスの動作にエラーがないか確認してください:

* postanalyticsモジュールのログを確認します

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/wstore-out.log
    ```

    `SystemError binary: failed to bind: Cannot assign requested address`のような記録がある場合は、サーバーが指定のアドレスとポートで接続を受け付けることを確認してください。
* NGINX‑Wallarmモジュールを搭載したサーバーで、NGINXのログを確認します。

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    `[error] wallarm: <address> connect() failed`のような記録がある場合は、NGINX‑Wallarmモジュールの設定ファイルで別個のpostanalyticsモジュールのアドレスが正しく指定されていること、また別個のpostanalyticsサーバーが指定のアドレスとポートで接続を受け付けていることを確認してください。
* NGINX‑Wallarmモジュールを搭載したサーバーで、以下のコマンドを使用して処理済みリクエストの統計を取得し、`tnt_errors`の値が0であることを確認します

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [統計サービスが返すすべてのパラメータの説明→][statistics-service-all-parameters]