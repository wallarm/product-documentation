デフォルトでは、デプロイ済みのWallarmノードは受信トラフィックを解析しません。

選択したWallarmのデプロイ方式（[インライン][inline-docs]または[アウトオブバンド][oob-docs]）に応じて、Wallarmがトラフィックをプロキシするか、トラフィックのミラーを処理するように設定します。

ノードがインストールされているマシン上の`/etc/nginx/conf.d/default.conf`ファイルで、以下の設定を行います:

=== "インライン"
    1. Wallarmが正当なトラフィックをプロキシ先として転送するIPアドレスを設定します。アーキテクチャに応じて、アプリケーションインスタンスやロードバランサのIP、またはDNS名などを指定できます。
    
        そのためには、`proxy_pass`の値を編集します。例えば、Wallarmは正当なリクエストを`http://10.80.0.5`に送信します:

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
    
        monitoringモードは、初回のデプロイおよびソリューションのテストに推奨されます。Wallarmはsafe blockingおよびblockingモードも提供しています。詳細は[こちら][waf-mode-instr]をご覧ください。
=== "アウトオブバンド"
    1. Wallarmノードがミラーされたトラフィックを受け入れるように、NGINXの`server`ブロックに以下の設定を行います:

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

        * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleに[攻撃者のIPアドレスを表示する][proxy-balancer-instr]ために必要です。
        * `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受信したコピー以外のすべてのリクエストの解析を無効にするために必要です。
    1. Wallarmノードがミラーされたトラフィックを解析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意のあるリクエストは[ブロックできません][oob-advantages-limitations]ので、Wallarmが受け付ける[モード][waf-mode-instr]はmonitoringのみです。インラインデプロイではsafe blockingおよびblockingモードもありますが、`wallarm_mode`ディレクティブをmonitoring以外の値に設定しても、ノードは引き続きトラフィックを監視し、悪意のあるトラフィックのみを記録します（offに設定した場合を除きます）。