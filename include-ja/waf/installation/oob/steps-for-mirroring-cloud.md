By default、デプロイされたWallarmノードは着信トラフィックを解析しません。

トラフィック解析を開始するには、Wallarmインスタンス上の`/etc/nginx/sites-enabled/default`ファイルを以下のように変更します：

1. Wallarmノードがミラーリングされたトラフィックを受け入れるには、`server` NGINXブロックに以下の構成を指定します：

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

    * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleが[攻撃者のIPアドレスを表示する][real-ip-docs]ために必要です。
    * `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受信したコピー以外のすべてのリクエスト解析を無効にするために必要です。
1. Wallarmノードがミラーリングされたトラフィックを解析するには、`wallarm_mode`ディレクティブを`monitoring`に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[mode][wallarm-mode]はmonitoringです。in-line展開の場合、safe blockingおよびblockingモードも存在しますが、`wallarm_mode`ディレクティブをmonitoring以外の値に設定しても、ノードはトラフィックの監視を継続し、悪意のあるトラフィックのみを記録します（offモードを除く）。
1. 存在する場合、NGINXのlocationから`try_files`ディレクティブを削除し、ローカルファイルによる干渉なしにトラフィックがWallarmに向けられるようにします：
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```