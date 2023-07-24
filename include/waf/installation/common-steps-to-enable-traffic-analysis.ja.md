デフォルトで、デプロイされたWallarmノードは、受信トラフィックを解析しません。

選択されたWallarmのデプロイメントアプローチ（インラインまたは[バンド外][oob-docs]）に応じて、Wallarmをプロキシトラフィックや、トラフィックミラーを処理するように設定します。

以下の設定をインストールされたノードがあるマシンの`/etc/nginx/conf.d/default.conf`ファイルで行います:

=== "In-line"
    1. Wallarmが合法的なトラフィックをプロクシするためのIPアドレスを設定します。これはアプリケーションインスタンス、ロードバランサー、またはDNS名など、アーキテクチャーに応じたIPになります。

        これを行うには、`proxy_pass`の値を編集します。たとえば、Wallarmには合法的なリクエストを `http://10.80.0.5` に送信するよう指示する必要があります：

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
    1. Wallarmノードが受信トラフィックを解析するためには、`wallarm_mode`ディレクティブを`monitoring`に設定します：

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        モニタリングモードは、最初のデプロイメントとソリューションのテストに推奨されます。Wallarmは、安全なブロッキングとブロッキングモードも提供します。[詳しく読む][waf-mode-instr]。
=== "Out-of-Band"
    1. Wallarmノードがミラーリングされたトラフィックを受け入れるようにするためには、`server` NGINXブロックで以下の設定を行います：

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

        * Wallarm Consoleが攻撃者のIPアドレスを[表示][proxy-balancer-instr]するためには、`set_real_ip_from` と `real_ip_header`ディレクティブが必要です。
        * `wallarm_force_response_*`指令は、ミラーリングされたトラフィックから受け取ったコピー以外のすべてのリクエストの解析を無効にするために必要です。
    1. Wallarmノードがミラーリングされたトラフィックを解析するようにするためには、`wallarm_mode`ディレクティブを`monitoring`に設定します：

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意あるリクエストは[ブロックできません][oob-advantages-limitations]ので、Wallarmが受け入れる唯一の[モード][waf-mode-instr]はモニタリングです。インラインデプロイメントでは、安全なブロッキングとブロッキングモードもありますが、`wallarm_mode`ディレクティブをモニタリング以外の値に設定しても、ノードは引き続きトラフィックを監視し、悪意のあるトラフィックだけを記録します（モードがオフに設定されている場合を除く）。