デフォルトでは、展開されたWallarmノードは着信トラフィックを解析しません。

選択したWallarmの展開方式（[in-line][inline-docs]または[Out-of-Band][oob-docs]）に応じて、Wallarmを設定し、トラフィックのプロキシまたはトラフィックミラーの処理を行います。

ノードがインストールされたマシンの`/etc/nginx/conf.d/default.conf`ファイルで、以下の設定を実行します:

=== "インライン"
    1. Wallarmが正当なトラフィックのプロキシ先として使用するIPアドレスを設定します。アーキテクチャに応じて、アプリケーションインスタンス、ロードバランサ、DNS名などになる可能性があります。
    
        そのために、`proxy_pass`の値を編集します。例えば、Wallarmは正当なリクエストを`http://10.80.0.5`に送信すべきです:

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
    1. Wallarmノードが着信トラフィックを解析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        monitoringモードは、初回の展開とソリューションテストに推奨されます。Wallarmはsafe blockingおよびblockingモードも提供しています、[詳しくはこちら][waf-mode-instr].
=== "アウトオブバンド"
    1. Wallarmノードがミラーされたトラフィックを受け入れるために、`server` NGINXブロック内に以下の設定を行います:

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

        * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleが[攻撃者のIPアドレスを表示する][proxy-balancer-instr]ために必要です。
        * `wallarm_force_response_*`ディレクティブは、ミラーされたトラフィックから受信されたコピー以外のすべてのリクエストの解析を無効にするために必要です.
    1. Wallarmノードがミラーされたトラフィックを解析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[モード][waf-mode-instr]はmonitoringです。インライン展開の場合はsafe blockingおよびblockingモードも存在しますが、`wallarm_mode`ディレクティブをmonitoring以外の値に設定しても、ノードはトラフィックを継続して監視し、悪意のあるトラフィックのみを記録します（offに設定された場合を除きます）.