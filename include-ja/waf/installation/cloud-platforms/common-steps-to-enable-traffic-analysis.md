デフォルトでは、デプロイされたWallarmノードは、受信トラフィックを分析しません。

選択されたWallarmのデプロイ方法（[インライン][inline-docs]または[アウトオブバンド][oob-docs]）によって、Wallarmをプロキシトラフィックするか、またはトラフィックミラーを処理するように設定します。

Wallarmインスタンスの`/etc/nginx/sites-enabled/default`ファイルで以下の設定を行います：

=== "インライン"
    1. Wallarmが正当なトラフィックをプロキシするためのIPアドレスを設定します。これは、アプリケーションインスタンス、ロードバランサ、DNS名など、あなたのアーキテクチャに依存するIPです。
    
        そのためには、`proxy_pass`の値を編集します。例えば、Wallarmは正当なリクエストを`http://10.80.0.5`に送るように設定します：

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
    1. Wallarmノードが受信トラフィックを分析するためには、`wallarm_mode`ディレクティブを`monitoring`に設定します：

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        モニタリングモードは、最初のデプロイメントとソリューションテストに推奨されています。Wallarmは安全ブロッキングとブロッキングモードも提供しています。[詳細はこちら][wallarm-mode]をご覧ください。
=== "アウトオブバンド"
    1. Wallarmノードがミラードトラフィックを受け入れるために、`server` NGINXブロックで以下の設定を行います：

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # 222.222.222.22をミラーリングサーバのアドレスに変更する
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleが攻撃者のIPアドレスを[表示する][real-ip-docs]ために必要です。
        * `wallarm_force_response_*`ディレクティブは、ミラードトラフィックから受け取ったコピー以外のすべてのリクエストの分析を無効化するために必要です。
    1. Wallarmノードがミラードトラフィックを分析するためには、`wallarm_mode`ディレクティブを`monitoring`に設定します：

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[モード][wallarm-mode]はモニタリングです。インラインデプロイメントでは、安全ブロックモードとブロックモードもありますが、`wallarm_mode`ディレクティブをモニタリングとは異なる値に設定しても、ノードはトラフィックを監視し、悪意のあるトラフィックのみを記録します（モードがオフに設定されている場合を除く）。