デフォルトでは、デプロイされたWallarmノードは受信トラフィックを分析しません。

トラフィックミラーを処理するようにWallarmを設定するには、インストールされたノードとともに`/etc/nginx/conf.d/default.conf`ファイルで以下の設定を行います。

1. Wallarmノードがミラーリングされたトラフィックを受け入れるようにするには、次の設定を`server` NGINXブロックに設定します：

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # 222.222.222.22をミラーリングサーバのアドレスに変更してください
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * `set_real_ip_from` および `real_ip_header` ディレクティブは、Wallarm Consoleが[攻撃者のIPアドレスを表示するため][proxy-balancer-instr]に必要です。
    * `wallarm_force_response_*` ディレクティブは、ミラーリングされたトラフィックから受け取ったコピー以外のすべてのリクエストの分析を無効にするために必要です。
1. Wallarmノードがミラーリングされたトラフィックを分析するには、`wallarm_mode` ディレクティブを `monitoring` に設定します:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    悪意のあるリクエストは[ブロックできません][oob-advantages-limitations]ので、Wallarmが受け入れる唯一の[モード][waf-mode-instr]はモニタリングです。インライン展開の場合、安全なブロックとブロックモードもありますが、`wallarm_mode` ディレクティブをモニタリングと異なる値に設定しても、ノードはトラフィックを監視し続け、悪意のあるトラフィックのみを記録します（モードがオフに設定されている場合を除く）。
