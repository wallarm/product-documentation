デフォルトでは、デプロイされたWallarmノードは着信トラフィックを分析しません。

選択したWallarmのデプロイメント手法（[インライン][inline-docs]または[Out-of-Band][oob-docs]）により、Wallarmをプロキシトラフィック、またはトラフィックミラーを処理するように設定します。

インストールされたノードのマシン上の`/etc/nginx/conf.d/default.conf`ファイルで以下の設定を行います：

=== "In-line"
    1. Wallarmが正当なトラフィックをプロキシするIPアドレスを設定します。アプリケーションインスタンス、ロードバランサー、DNS名など、アーキテクチャに応じたIPが考えられます。
    
        それを行うには、`proxy_pass`の値を編集します。例えば、Wallarmは正当なリクエストを`http://10.80.0.5`に送るべきです：

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
    1. Wallarmノードが着信トラフィックを分析するように、`wallarm_mode`ディレクティブを`monitoring`に設定します：

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        モニタリングモードは、初回のデプロイメントおよびソリューションテストに推奨されるものです。Wallarmは、安全なブロックモードとブロックモードも提供します。[詳細はこちら][waf-mode-instr]。
=== "Out-of-Band"
    1. Wallarmノードがミラーリングされたトラフィックを受け入れるように、`server` NGINXブロックに以下の設定を行います：

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

        * `set_real_ip_from`と`real_ip_header`ディレクティブは、Wallarmコンソールで[攻撃者のIPアドレスを表示するため][proxy-balancer-instr]に必要です。
        * `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受け取ったコピーを除くすべてのリクエストの分析を無効化するために必要です。
    1. Wallarmノードがミラーリングされたトラフィックを分析するように、`wallarm_mode`ディレクティブを`monitoring`に設定します：

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意のあるリクエストは[ブロックできないため][oob-advantages-limitations]、Wallarmが受け入れる唯一の[モード][waf-mode-instr]はモニタリングです。インラインデプロイメントの場合、安全なブロックモードおよびブロックモードがありますが、`wallarm_mode`ディレクティブをモニタリングと異なる値に設定したとしても、ノードは続けてトラフィックを監視し、悪意のあるトラフィックのみを記録します（モードをオフに設定している場合を除く）。
