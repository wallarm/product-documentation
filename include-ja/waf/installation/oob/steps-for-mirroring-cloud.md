デフォルトでは、デプロイされたWallarmノードは受信トラフィックを分析しません。

トラフィック分析を開始するには、Wallarmインスタンスの `/etc/nginx/sites-enabled/default` ファイルを以下のように変更します：

1. Wallarmノードがミラーリングされたトラフィックを受け入れるように、`server` NGINXブロックで以下の設定を行います：

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # ミラーリングサーバのアドレスを222.222.222.22に変更
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * `set_real_ip_from` と `real_ip_header` の指示は、Wallarm Consoleが[攻撃者のIPアドレスを表示する][real-ip-docs]ために必要です。
    * `wallarm_force_response_*` の指示は、ミラーリングされたトラフィックから受信したコピーを除くすべてのリクエストの分析を無効にするために必要です。
1. Wallarmノードがミラーリングされたトラフィックを分析するように、`wallarm_mode` 指示を `monitoring` に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[モード][wallarm-mode]はモニタリングです。インラインデプロイメントのためには、安全なブロックとブロックモードもありますが、`wallarm_mode` 指示をモニタリング以外の値に設定しても、ノードは引き続きトラフィックをモニタリングし、設定されたモードをオフにすること以外では悪意のあるトラフィックのみを記録します。