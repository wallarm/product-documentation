デフォルトでは、デプロイされたWallarmノードは、受信トラフィックを分析しません。

インストールされたノードがあるマシンのNGINX[設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)で以下の設定を行い、Wallarmがトラフィックミラーを処理するように設定してください：

1. Wallarmノードがミラーリングされたトラフィックを受け入れるために、`server` NGINXブロックで以下の設定をセットします：

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # ミラーリングサーバーのアドレスに222.222.222.22を変更します
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * 攻撃者のIPアドレスをWallarmコンソールで[表示する][proxy-balancer-instr]ためには、`set_real_ip_from`および`real_ip_header`指示が必要です。
    * `wallarm_force_response_*`指示は、ミラーリングされたトラフィックから受信したコピーを除く、すべてのリクエストの分析を無効にするために必要です。
1. Wallarmノードがミラーリングされたトラフィックを分析するために、`wallarm_mode`指示を`monitoring`に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[モード][waf-mode-instr]は監視です。インライン展開では、安全なブロッキングモードとブロッキングモードもありますが、`wallarm_mode`指示を監視以外の値に設定しても、ノードはトラフィックを監視し続け、悪意のあるトラフィックのみを記録します（オフに設定されたモードを除く）。