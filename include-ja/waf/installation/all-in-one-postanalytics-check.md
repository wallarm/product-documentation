NGINX‑Wallarmモジュールと個別のpostanalyticsモジュールの連携を確認するには、保護対象アプリケーションのアドレスにテスト攻撃を含むリクエストを送信します:

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarmモジュールと個別のpostanalyticsモジュールが正しく構成されている場合、攻撃はWallarm Cloudにアップロードされ、Wallarm Consoleの**Attacks**セクションに表示されます:

![インターフェースのAttacks][img-attacks-in-interface]

攻撃がWallarm Cloudにアップロードされなかった場合は、サービスの動作にエラーがないか確認します:

* postanalyticsモジュールのログを確認します

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    そのログに`SystemError binary: failed to bind: Cannot assign requested address`のような記録がある場合は、サーバーが指定されたアドレスとポートで接続を受け付けていることを確認します。
* NGINX‑Wallarmモジュールがインストールされているサーバーで、NGINXのログを確認します:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    そのログに`[error] wallarm: <address> connect() failed`のような記録がある場合は、NGINX‑Wallarmモジュールの設定ファイルで個別のpostanalyticsモジュールのアドレスが正しく指定されていること、また個別のpostanalyticsサーバーが指定されたアドレスとポートで接続を受け付けていることを確認します。
* NGINX‑Wallarmモジュールがインストールされているサーバーで、以下のコマンドを使用して処理済みリクエストの統計を取得し、`tnt_errors`の値が0であることを確認します

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [統計サービスが返すすべてのパラメーターの説明→][statistics-service-all-parameters]