デフォルトでは、デプロイされたWallarmノードは受信トラフィックを分析しません。

トラフィックミラーを処理するようにWallarmを設定するために、インストールされたノードを持つマシン上の`/etc/nginx/conf.d/default.conf`ファイルで以下の設定を行います：

1. Wallarmノードがミラーされたトラフィックを受け入れるようにするには、`server` NGINXブロックで以下の設定を設定します：

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

    * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarmコンソールが攻撃者のIPアドレスを[表示する][proxy-balancer-instr]ために必要です。
    * `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受け取ったコピー以外のすべてのリクエストの分析を無効にするために必要です。
1. Wallarmノードがミラーされたトラフィックを分析するようにするには、`wallarm_mode`ディレクティブを`monitoring`に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    不正なリクエストは[ブロックすることができません][oob-advantages-limitations]ので、Wallarmが受け入れる唯一の[モード][waf-mode-instr]はモニタリングです。インライン展開の場合は、安全なブロックモードとブロックモードもありますが、`wallarm_mode`ディレクティブをモニタリングと異なる値に設定しても、ノードはトラフィックを監視し続け、不正なトラフィックのみを記録します（モードがオフに設定されている場合を除く）。