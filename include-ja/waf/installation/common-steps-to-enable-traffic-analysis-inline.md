デフォルトでは、デプロイされたWallarmノードは収入トラフィックを分析しません。分析を開始するには、`/etc/nginx/conf.d/default.conf` ファイルを使用して、インストールされたノードのマシンでWallarmをプロキシトラフィックに設定します。

1. Wallarmが正当なトラフィックをプロキシするためのIPアドレスを設定します。これは、アプリケーションインスタンス、ロードバランサー、またはDNS名など、アーキテクチャに応じたIPとなります。

     これを行うには、`proxy_pass` の値を編集します。例えば、Wallarmは正当なリクエストを `http://10.80.0.5` に送る必要があります：

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
1. Wallarmノードが収入トラフィックを分析するためには、`wallarm_mode` ディレクティブを `monitoring` に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    モニタリングモードは、最初のデプロイメントとソリューションのテストに推奨されます。Wallarmは安全なブロッキングとブロッキングモードも提供します、[詳しく読む][waf-mode-instr]。