既定では、デプロイされたWallarmノードは、受信トラフィックを分析しません。

選択したWallarmのデプロイ方法（[インライン][inline-docs]か[アウト・オブ・バンド][oob-docs]）に応じて、Wallarmにトラフィックをプロキシするか、トラフィックミラーを処理するように設定します。

インストールされたノードがあるマシンのNGINX[設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)で次の設定を実行します：

=== "インライン"
    1. 正当なトラフィックをプロキシするためにWallarmのIPアドレスを設定します。これは、アプリケーションインスタンス、ロードバランサー、DNS名など、アーキテクチャによって異なります。
    
        これを行うには、`proxy_pass`の値を編集します。例えば、Wallarmは正当なリクエストを`http://10.80.0.5`に送信する必要があります：

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
    1. Wallarmノードが受信トラフィックを分析するために、`wallarm_mode`ディレクティブを`monitoring`に設定します：

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        モニタリングモードは、最初のデプロイメントとソリューションテストに推奨されるモードです。Wallarmは安全なブロッキングモードとブロッキングモードも提供しています。[詳細はこちら][waf-mode-instr]をお読みください。
=== "アウト・オブ・バンド"
    1. Wallarmノードがミラーリングされたトラフィックを受け入れるようにするには、`server` NGINXブロックに以下の設定をします：

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # ミラーリングサーバーのアドレスを222.222.222.22に変更します
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarmコンソールに攻撃者のIPアドレスを[表示させる][proxy-balancer-instr]ために必要です。
        * `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受け取ったコピーを除き、すべてのリクエストの分析を無効にするために必要です。
    1. Wallarmノードがミラーリングされたトラフィックを分析するために、`wallarm_mode`ディレクティブを`monitoring`に設定します：

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[モード][waf-mode-instr]はモニタリングです。インラインデプロイメントの場合にも、安全なブロッキングモードとブロッキングモードがありますが、`wallarm_mode`ディレクティブをモニタリング以外の値に設定しても、ノードはトラフィックを監視し続け、悪意のあるトラフィックのみを記録します（モードがオフに設定されている場合を除く）。