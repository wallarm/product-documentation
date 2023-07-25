デフォルトでは、デプロイされたWallarmノードは受信トラフィックを分析しません。

トラフィック分析を開始するには、Wallarmインスタンス上の`/etc/nginx/sites-enabled/default` ファイルを以下のように変更します：

1. Wallarmノードがミラーリングされたトラフィックを受け入れるように、`server` NGINXブロックに以下の設定を行います：

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

    * `set_real_ip_from` と `real_ip_header` のディレクティブは、Wallarmコンソールが攻撃者のIPアドレスを[表示するため][real-ip-docs]に必要です。
    * `wallarm_force_response_*`のディレクティブは、ミラーリングされたトラフィックから受け取ったコピー以外のすべてのリクエストの分析を無効にするために必要です。
1. Wallarmノードがミラーリングされたトラフィックを分析するように、`wallarm_mode` ディレクティブを `monitoring` に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[モード][wallarm-mode]は監視です。インライン展開のためには、安全なブロックモードとブロックモードもありますが、 `wallarm_mode` ディレクティブを監視とは異なる値に設定しても、ノードはトラフィックの監視を続け、悪意のあるトラフィックのみを記録します（オフに設定されているモードを除く）。