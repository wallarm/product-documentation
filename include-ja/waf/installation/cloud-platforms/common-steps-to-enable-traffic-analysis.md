デフォルトでは、展開されたWallarmノードは、受信トラフィックを解析しません。

選択したWallarm展開方式（[in-line][inline-docs]または[Out-of-Band][oob-docs]）に応じて、Wallarmをトラフィックをプロキシするか、ミラーリングされたトラフィックを処理するように設定します。

Wallarmインスタンスの`/etc/nginx/sites-enabled/default`ファイルに以下の設定を実施します。

=== "インライン"
    1. Wallarmが正当なトラフィックをプロキシするためのIPアドレスを設定します。アーキテクチャに応じて、アプリケーションインスタンス、ロードバランサ、またはDNS名などのIPを指定できます。
    
        そのためには、`proxy_pass`の値を編集します。例えば、Wallarmは正当なリクエストを`http://10.80.0.5`に送信するように設定します:

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
    1. Wallarmノードが受信トラフィックを解析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        モニタリングモードは、初回の展開およびソリューションのテストに推奨のモードです。Wallarmは、安全ブロッキングモードおよびブロッキングモードも提供しており、[詳細はこちら][wallarm-mode]をご参照ください。

=== "アウト・オブ・バンド"
    1. Wallarmノードがミラーリングされたトラフィックを受け取るようにするには、`server` NGINXブロックに以下の設定を追加します:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # 222.222.222.22をミラーリングサーバのアドレスに変更します
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * Wallarm Consoleが攻撃者のIPアドレスを表示するために、`set_real_ip_from`および`real_ip_header`ディレクティブは必須です。
        * ミラーリングされたトラフィックから受信したコピー以外の全てのリクエストの解析を無効にするには、`wallarm_force_response_*`ディレクティブが必要です。
    1. Wallarmノードがミラーリングされたトラフィックを解析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意のあるリクエストはブロックできないため、Wallarmが受け入れる唯一のモードはmonitoringのみです。インライン展開の場合は、安全ブロッキングモードおよびブロッキングモードも存在しますが、`wallarm_mode`ディレクティブにmonitoring以外の値を設定しても、ノードはトラフィックの監視を続け、悪意のあるトラフィックのみを記録します（offに設定されたモードは除きます）。