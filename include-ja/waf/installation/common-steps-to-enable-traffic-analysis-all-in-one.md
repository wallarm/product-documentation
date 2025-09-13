デフォルトでは、デプロイされたWallarm Nodeは受信トラフィックを解析しません。

トラフィック解析を有効にするには、次の設定を行います:

=== "インライン"
    正規トラフィックのプロキシおよび[インライン][inline-docs]でのトラフィック解析のためにWallarm Nodeをデプロイする場合は、通常は`/etc/nginx/sites-available/default`にある[NGINXの設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)を更新します。
    
    必要な最小限の設定変更は次のとおりです:

    1. Wallarm Nodeを`wallarm_mode monitoring;`に設定します。このモードは初期デプロイおよびテストに推奨されます。
    
        Wallarmはブロッキングやセーフブロッキングなど、他のモードにも対応しており、詳細は[こちら][waf-mode-instr]をご覧ください。
    1. 必要なlocationに`proxy_pass`ディレクティブを追加して、ノードが正規トラフィックをどこに転送すべきかを指定します。転送先はアプリケーションサーバーのIP、ロードバランサー、またはDNS名などです。
    1. 該当するlocationに`try_files`ディレクティブが含まれている場合は削除し、ローカルファイルの影響を受けずにトラフィックがWallarmに渡るようにします。

    ```diff
    server {
        ...
    +   wallarm_mode monitoring;
        location / { 
    +        proxy_pass http://example.com;
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```
=== "アウトオブバンド"
    Wallarm Nodeを[アウトオブバンド][oob-docs]のトラフィック解析用にデプロイする場合は、通常は`/etc/nginx/sites-available/default`にある[NGINXの設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)を更新します。

    必要な最小限の設定変更は次のとおりです:

    1. Wallarm Nodeがミラーリングされたトラフィックを受け付けるよう、NGINXのserverブロックに次の設定を行います:

        ```
        server {
            listen 80;
            ...

            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # 222.222.222.22をミラーリングサーバーのアドレスに置き換えます
            #set_real_ip_from  222.222.222.22;
            #real_ip_header    X-Forwarded-For;
            #real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;
        }
        ```

        * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleで攻撃者のIPアドレスを[表示する][proxy-balancer-instr]ために必要です。
        * `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受け取ったコピー以外のすべてのリクエストの解析を無効化するために必要です。
    1. Wallarm Nodeがミラーリングされたトラフィックを解析できるよう、`wallarm_mode`ディレクティブを`monitoring`に設定します:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        悪意のあるリクエストはブロック[できません][oob-advantages-limitations]ので、Wallarmが受け付ける唯一の[モード][waf-mode-instr]はモニタリングです。インラインデプロイではセーフブロッキングおよびブロッキングのモードもありますが、`wallarm_mode`ディレクティブをモニタリング以外の値に設定しても、ノードは引き続きトラフィックを監視して悪意のあるトラフィックのみを記録します（offに設定した場合を除きます）。
    1. ローカルファイルによる処理を介さずにトラフィックがWallarmに渡るよう、NGINXのlocationに`try_files`ディレクティブが含まれている場合は削除します:
        
        ```diff
        server {
            ...
            location / {
        -        # try_files $uri $uri/ =404;
            }
            ...
        }
        ```

特定のトラフィックルーティングのルールや要件に応じて、必要に応じて[NGINX](https://nginx.org/en/docs/dirindex.html)および[Wallarmの設定][waf-directives-instr]をさらにカスタマイズします。