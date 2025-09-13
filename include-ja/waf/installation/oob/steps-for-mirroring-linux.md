デフォルトでは、デプロイ済みのWallarm nodeは受信トラフィックを解析しません。

Wallarmがミラーされたトラフィックを処理できるように、Wallarm nodeがインストールされているマシンの`/etc/nginx/conf.d/default.conf`ファイルで次の設定を行います:

1. Wallarm nodeがミラーされたトラフィックを受け入れるには、NGINXの`server`ブロックに次の設定を行います:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # 222.222.222.22をミラーリングサーバーのアドレスに変更してください
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * `set_real_ip_from`と`real_ip_header`ディレクティブは、Wallarm Consoleが[攻撃者のIPアドレスを表示する][proxy-balancer-instr]ために必要です。
    * `wallarm_force_response_*`ディレクティブは、ミラーされたトラフィックから受け取ったコピー以外のすべてのリクエストの解析を無効にするために必要です。
1. Wallarm nodeがミラーされたトラフィックを解析するには、`wallarm_mode`ディレクティブを`monitoring`に設定します:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    悪意のあるリクエストは[ブロックできません][oob-advantages-limitations]ので、Wallarmがサポートする唯一の[モード][waf-mode-instr]はmonitoringです。インラインデプロイメントでは、safe blockingおよびblockingのモードもありますが、`wallarm_mode`ディレクティブをmonitoring以外の値に設定しても、ノードは引き続きトラフィックを監視し、悪意のあるトラフィックのみを記録します（モードをoffに設定した場合を除きます）。