デフォルトでは、デプロイされたWallarmノードは受信トラフィックを解析しません。トラフィック分析を開始するために、Wallarmインスタンス上の`/etc/nginx/sites-enabled/default`ファイルを使用して、Wallarmをトラフィックプロキシとして設定します：

1. Wallarmが正当なトラフィックをプロキシするためのIPアドレスを設定します。これはアプリケーションのインスタンス、ロードバランサー、またはDNS名など、アーキテクチャに応じたIPとすることができます。

    そのためには、`proxy_pass` の値を編集します。例えば、Wallarmが正当なリクエストを `http://10.80.0.5`に送るように設定します：

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
1. Wallarmノードが受信トラフィックを分析するために、`wallarm_mode` ディレクティブを `monitoring`に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    モニタリングモードは、最初のデプロイメントとソリューションのテストに推奨されるモードです。Wallarmは、安全なブロッキングとブロッキングモードも提供しています。[詳しく読む][wallarm-mode]。