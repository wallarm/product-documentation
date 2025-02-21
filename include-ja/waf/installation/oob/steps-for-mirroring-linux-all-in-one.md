デフォルトでは、展開済みのWallarmノードは受信トラフィックを解析しません。

インストール済みノードが存在するマシンのNGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) に、Wallarmがトラフィックミラーを処理できるように、以下の設定を行います:

1. Wallarmノードがミラーされたトラフィックを受け入れるために、NGINXの`server`ブロック内に以下の設定を追加します:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # 222.222.222.22 をミラーサーバーのアドレスに変更します
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * `set_real_ip_from` および `real_ip_header` ディレクティブは、Wallarm Consoleが[攻撃者のIPアドレスを表示する][proxy-balancer-instr]ために必要です。
    * `wallarm_force_response_*` ディレクティブは、ミラーされたトラフィックからのコピー以外のすべてのリクエストの解析を無効にするために必要です。
1. Wallarmノードがミラーされたトラフィックを解析するために、`wallarm_mode`ディレクティブを`monitoring`に設定します:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;
    
        ...
    }
    ```

    悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[モード][waf-mode-instr]はmonitoringです。インラインデプロイメントの場合、safe blockingおよびblockingモードも存在しますが、`wallarm_mode`ディレクティブにmonitoring以外の値を設定しても、ノードはトラフィックを監視し続け、悪意のあるトラフィックのみを記録します（offモードを除く）。
1. 存在する場合、NGINXのlocationから`try_files`ディレクティブを削除し、ローカルのファイル干渉なしにトラフィックをWallarmへ転送できるようにします:
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```