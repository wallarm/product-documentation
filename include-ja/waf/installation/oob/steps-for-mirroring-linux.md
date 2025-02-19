デフォルトでは、展開済みのWallarmノードは着信トラフィックを分析しません。

インストール済みのノードが稼働しているマシンの`/etc/nginx/conf.d/default.conf`ファイルに以下の設定を行い、Wallarmがトラフィックミラーを処理するよう設定します：

1. Wallarmノードがミラーされたトラフィックを受け入れるために、`server` NGINXブロック内に次の設定を記述します：

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

    * Wallarm Consoleが攻撃者のIPアドレスを表示するためには、`set_real_ip_from`および`real_ip_header`ディレクティブが必要です[攻撃者のIPアドレスを表示する][proxy-balancer-instr]。
    * ミラーされたトラフィックから受信したコピー以外のすべてのリクエストの分析を無効にするには、`wallarm_force_response_*`ディレクティブが必要です。

1. Wallarmノードがミラーされたトラフィックを分析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

悪意のあるリクエストはブロックできません[ブロックできません][oob-advantages-limitations]、そのためWallarmが受け入れる唯一の[モード][waf-mode-instr]はmonitoringです。インライン展開においては、safe blockingやblockingモードも存在しますが、`wallarm_mode`ディレクティブにmonitoring以外の値を設定しても、ノードはトラフィックを監視し、悪意のあるトラフィックのみを記録し続けます（offモードを除きます）。