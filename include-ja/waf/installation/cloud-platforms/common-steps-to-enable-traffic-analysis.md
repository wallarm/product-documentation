デフォルトでは、デプロイ済みのWallarmノードは受信トラフィックを解析しません。

選択したWallarmのデプロイ方法（[インライン][inline-docs]または[アウトオブバンド][oob-docs]）に応じて、Wallarmがトラフィックをプロキシするか、トラフィックミラーを処理するように設定します。

Wallarmインスタンス上の`/etc/nginx/sites-enabled/default`ファイルで次の設定を行います。

=== "インライン"
    1. Wallarmが正当なトラフィックをプロキシ先として転送するIPアドレスを設定します。アーキテクチャに応じて、アプリケーションインスタンス、ロードバランサーのIP、またはDNS名などを指定できます。
    
        これを行うには、`proxy_pass`の値を編集します。例えば、Wallarmが正当なリクエストを`http://10.80.0.5`に送信する場合は次のとおりです。
    
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
    1. Wallarmノードが受信トラフィックを解析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します。
    
        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;
    
            ...
        }
        ```
    
        初回のデプロイおよびソリューションのテストにはmonitoringモードを推奨します。Wallarmにはsafe blockingモードやblockingモードもあります。詳細は[こちら][wallarm-mode]をご覧ください。
=== "アウトオブバンド"
    1. Wallarmノードがミラーリングされたトラフィックを受け入れられるよう、NGINXの`server`ブロックに次の設定を追加します。
    
        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # 222.222.222.22をミラーリングサーバーのアドレスに変更します
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```
    
        * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleで[攻撃者のIPアドレスを表示する][real-ip-docs]ために必要です。
        * `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受け取ったコピー以外のすべてのリクエストの解析を無効化するために必要です。
    1. Wallarmノードがミラーリングされたトラフィックを解析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します。
    
        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;
    
            ...
        }
        ```
    
        悪意のあるリクエストはブロック[できません][oob-advantages-limitations]ので、Wallarmが受け付ける[モード][wallarm-mode]はmonitoringのみです。インラインデプロイではsafe blockingモードとblockingモードも利用できますが、`wallarm_mode`ディレクティブをmonitoring以外に設定しても、ノードは引き続きトラフィックを監視し、悪意のあるトラフィックのみを記録します（offに設定した場合を除きます）。