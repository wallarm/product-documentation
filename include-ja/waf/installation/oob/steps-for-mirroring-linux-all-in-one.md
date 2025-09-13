デフォルトでは、デプロイ済みのWallarmノードは受信トラフィックを解析しません。

ミラーされたトラフィックをWallarmで処理できるよう、ノードをインストールしたマシン上のNGINX[設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)で次の設定を行います:

1. Wallarmノードがミラーされたトラフィックを受け付けるよう、NGINXの`server`ブロックに以下を設定します:

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

    * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleが[攻撃者のIPアドレスを表示][proxy-balancer-instr]するために必要です。
    * `wallarm_force_response_*`ディレクティブは、ミラーされたトラフィックから受け取ったコピーを除くすべてのリクエストの解析を無効化するために必要です。
1. Wallarmノードがミラーされたトラフィックを解析できるよう、`wallarm_mode`ディレクティブを`monitoring`に設定します。

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け付ける[モード][waf-mode-instr]はmonitoringのみです。インラインデプロイメントではsafe blockingおよびblockingモードも利用できますが、`wallarm_mode`ディレクティブをmonitoring以外の値に設定しても、ノードは引き続きトラフィックを監視し、悪意のあるトラフィックのみを記録します（offに設定したモードを除く）。
1. ローカルファイルによる干渉なくトラフィックがWallarmにルーティングされるよう、存在する場合はNGINXのlocationブロックから`try_files`ディレクティブを削除します:
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```