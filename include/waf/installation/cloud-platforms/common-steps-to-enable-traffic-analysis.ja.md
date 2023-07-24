デフォルトでは、デプロイされたWallarmノードは、着信トラフィックを分析しません。

選択したWallarmデプロイメント手法によって（インラインまたは[外部帯域][oob-docs]）、Wallarmをプロキシトラフィックに設定するか、またはトラフィックミラーを処理するように設定します。

以下の設定をWallarmインスタンス上の`/etc/nginx/sites-enabled/default`ファイルで行います：

=== "インライン"
    1. Wallarmが正当なトラフィックをプロキシするIPアドレスを設定します。これは: アプリケーションインスタンス、ロードバランサー、またはDNS名等のIPアドレスで、あなたのアーキテクチャによります。
    
        その手段は`proxy_pass`値を編集することで、例えば、Wallarmは正当なリクエストを`http://10.80.0.5`に送らなければなりません:

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
    1. Wallarmノードが受信トラフィックを分析するようにするには、`wallarm_mode`ディレクティブを`monitoring`に設定します:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        モニタリングモードは、最初のデプロイメントとソリューションテストに最適です。Wallarmは安全なブロッキングとブロッキングのモードも用意しています、[詳細を読む][wallarm-mode]。
=== "外部帯域"
    1. Wallarmノードがミラーリングされたトラフィックを受け入れるようにするには、次の設定を`server` NGINXブロック内で設定します:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # Change 222.222.222.22 to the address of the mirroring server
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * `set_real_ip_from`と`real_ip_header`ディレクティブはWallarmコンソールで[攻撃者のIPアドレスを表示][real-ip-docs]するために必要です。
        * `wallarm_force_response_*`ディレクティブはミラーリングされたトラフィックから受け取ったコピー以外のすべてのリクエストの解析を無効にするために必要です。
    1. Wallarmノードがミラーリングされたトラフィックを分析するようにするには、`wallarm_mode`ディレクティブを`monitoring`に設定します:
        
        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが許容する唯一の[モード][wallarm-mode]はモニタリングです。インラインのデプロイメントには安全なブロッキングとブロッキングのモードもありますが、`wallarm_mode`ディレクティブをモニタリングと異なる値に設定しても、ノードはトラフィックの監視を続け、悪意のあるトラフィックだけを記録します（モードがオフに設定されている場合を除く）。