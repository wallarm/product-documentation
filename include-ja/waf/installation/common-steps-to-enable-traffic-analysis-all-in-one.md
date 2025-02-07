デフォルトでは、デプロイされたWallarm Nodeは受信するトラフィックの解析を行いません。

トラフィック解析を有効にするには、以下の設定を行ってください。

=== "インライン"
    Wallarm Nodeを[in-line][inline-docs]トラフィック解析と正当なトラフィックのプロキシングに使用する場合は、通常`/etc/nginx/sites-available/default`にある[NGINX設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)を更新してください。
    
    以下の最小限の設定変更が必要です：
    
    1. Wallarm Nodeを`wallarm_mode monitoring;`に設定します。このモードは初期デプロイおよびテスト時に推奨します。
    
        Wallarmはblockingやsafe blockingなどの他のモードもサポートします。詳細は[こちら][waf-mode-instr]をご参照ください。
    1. 必要な箇所に`proxy_pass`ディレクティブを追加して、Wallarm Nodeが正当なトラフィックを転送すべき先を指定します。転送先はアプリケーションサーバのIP、ロードバランサ、またはDNS名となり得ます。
    1. もし存在する場合は、修正した箇所から`try_files`ディレクティブを削除し、ローカルファイルの干渉なくトラフィックがWallarmに向かうようにしてください。
    
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
    Wallarm Nodeを[out-of-band][oob-docs]トラフィック解析に使用する場合は、通常`/etc/nginx/sites-available/default`にある[NGINX設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)を更新してください。
    
    以下の最小限の設定変更が必要です：
    
    1. Wallarm Nodeがミラーリングされたトラフィックを受信できるよう、`server` NGINXブロック内に以下の設定を追加してください：
    
        ```
        server {
            listen 80;
            ...
        
            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # 222.222.222.22をミラー用サーバのアドレスに変更してください
            #set_real_ip_from  222.222.222.22;
            #real_ip_header    X-Forwarded-For;
            #real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;
        }
        ```
    
        * Wallarm Consoleが攻撃者のIPアドレスを表示できるように、`set_real_ip_from`および`real_ip_header`ディレクティブが必要です。[詳細はこちら][proxy-balancer-instr]
        * ミラーリングされたトラフィックから受信したコピー以外のすべてのリクエストの解析を無効にするために、`wallarm_force_response_*`ディレクティブが必要です。
    1. Wallarm Nodeがミラーリングされたトラフィックを解析できるよう、`wallarm_mode`ディレクティブを`monitoring`に設定してください：
    
        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;
        
            ...
        }
        ```
    
        悪意のあるリクエストは[ブロックできません][oob-advantages-limitations]ため、Wallarmが受け入れる唯一の[モード][waf-mode-instr]はmonitoringです。インラインデプロイではsafe blockingおよびblockingモードも用意されていますが、`wallarm_mode`ディレクティブをmonitoring以外の値に設定しても、ノードはトラフィックの監視を継続し、悪意のあるトラフィックのみ記録します（オフに設定した場合を除く）。
    1. ローカルファイルの干渉なくトラフィックがWallarmに向かうよう、NGINXの各ロケーションから`try_files`ディレクティブが存在する場合は削除してください：
        
        ```diff
        server {
            ...
            location / {
        -        # try_files $uri $uri/ =404;
            }
            ...
        }
        ```
    
特定のトラフィックルーティングルールや要件に応じて、[NGINX](https://nginx.org/en/docs/dirindex.html)および[Wallarm configurations][waf-directives-instr]をさらにカスタマイズしてください。