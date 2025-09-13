デフォルトでは、デプロイ済みのWallarmノードは受信トラフィックを解析しません。トラフィック解析を開始するには、Wallarmインスタンス上の`/etc/nginx/sites-enabled/default`ファイルでWallarmがトラフィックをプロキシするように設定します:

1. Wallarmが正規のトラフィックをプロキシする宛先IPアドレスを設定します。アーキテクチャに応じて、アプリケーションインスタンスやロードバランサーのIP、またはDNS名などを指定できます。

    これを行うには、`proxy_pass`の値を編集します。例えば、Wallarmが正規のリクエストを`http://10.80.0.5`に転送する場合:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;

        ...

        location / {
            proxy_pass http://10.80.0.5; 
            ...
        }
    }
    ```
1. Wallarmノードが受信トラフィックを解析するには、`wallarm_mode`ディレクティブを`monitoring`に設定します:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    monitoringモードは、初回のデプロイおよびソリューションのテストに推奨されます。Wallarmはsafe blockingモードおよびblockingモードも提供しています。[詳細][wallarm-mode]を参照してください。