デフォルトでは、デプロイ済みのWallarmノードは受信トラフィックを解析しません。

トラフィックの解析を開始するには、Wallarmインスタンス上の`/etc/nginx/sites-enabled/default`ファイルを次のように変更します:

1. Wallarmノードがミラーリングされたトラフィックを受け入れるようにするには、NGINXのserverブロックに次の設定を行います:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # 222.222.222.22をミラーリングサーバのアドレスに置き換えます
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleで[攻撃者のIPアドレスを表示する][real-ip-docs]ために必要です。
    * `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受信したコピーを除くすべてのリクエストの解析を無効にするために必要です。
1. Wallarmノードがミラーリングされたトラフィックを解析するようにするには、`wallarm_mode`ディレクティブを`monitoring`に設定します:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    悪意のあるリクエストは[ブロックできません][oob-advantages-limitations]ので、Wallarmが受け付ける唯一の[モード][wallarm-mode]はmonitoringです。インラインデプロイでは、safe blockingモードとblockingモードもありますが、`wallarm_mode`ディレクティブをmonitoring以外の値に設定しても、ノードは引き続きトラフィックを監視し、悪意のあるトラフィックのみを記録します（offに設定したモードは除きます）。
1. ローカルファイルの干渉なしにトラフィックがWallarmに向けられるようにするため、存在する場合はNGINXのlocationブロックから`try_files`ディレクティブを削除します:
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```