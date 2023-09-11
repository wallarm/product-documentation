NGINX-Wallarmと個別のpostanalyticsモジュールのインタラクションをチェックするために、テスト攻撃のリクエストを保護されたアプリケーションのアドレスに送信することができます：

```bash
curl http://localhost/etc/passwd
```

NGINX-Wallarmと個別のpostanalyticsモジュールが正しく設定されていれば、攻撃はWallarm Cloudにアップロードされ、Wallarm Consoleの**事件**セクションに表示されます：

![インターフェースの攻撃][img-attacks-in-interface]

攻撃がクラウドにアップロードされなかった場合、サービスの操作にエラーがないか確認してください：

* postanalyticsサービス `wallarm-tarantool`が`active`のステータスであることを確認します

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![wallarm-tarantool のステータス][tarantool-status]
* postanalyticsモジュールのログを分析します

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

   `SystemError binary: failed to bind: Cannot assign requested address`というレコードがある場合、指定されたアドレスとポートでサーバが接続を受け入れていることを確認してください。
* NGINX-Wallarmモジュールのサーバ上で、NGINXのログを分析します：

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

   `[error] wallarm: <address> connect() failed`というレコードがある場合、NGINX-Wallarmモジュールの設定ファイルと個別のpostanalyticsサーバで、個別のpostanalyticsモジュールのアドレスが正しく指定されていることを確認し、指定されたアドレスとポートで接続を受け入れていることを確認してください。
* NGINX-Wallarmモジュールのサーバ上で、以下のコマンドを使用して処理済みリクエストの統計情報を取得し、 `tnt_errors`の値が0であることを確認してください：

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [統計サービスが返すすべてのパラメータの説明 →][statistics-service-all-parameters]