デフォルトでは、デプロイされたWallarmノードは着信トラフィックの解析を行いません。着信トラフィックの解析を開始するには、Wallarmインスタンス上の`/etc/nginx/sites-enabled/default`ファイルを介してトラフィックをプロキシするようWallarmを設定します。

1. Wallarmが正規のトラフィックをプロキシするためのIPアドレスを設定します。これは、アーキテクチャに応じてアプリケーションインスタンス、ロードバランサー、またはDNS名などで構いません。

    これを行うには、`proxy_pass`の値を編集します。たとえば、Wallarmは正規のリクエストを`http://10.80.0.5`に送信するように設定します。

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
1. Wallarmノードが着信トラフィックを解析するために、`wallarm_mode`ディレクティブを`monitoring`に設定します。

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    監視モードは、最初のデプロイおよびソリューションテストに推奨されます。Wallarmはセーフブロッキングおよびブロッキングモードも提供しており、[詳しくはこちら][wallarm-mode]を参照してください。