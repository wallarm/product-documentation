# トラフィックミラーリングのためのNGINX設定例

NGINX 1.13以降、追加バックエンドへトラフィックをミラーリングできます。本記事では、NGINXで[トラフィックをミラーリングする](overview.md)ためおよびノードがミラーリングされたトラフィックを処理するために必要な設定例を示します。

## ステップ1: NGINXにトラフィックのミラーリングを設定します

NGINXにトラフィックをミラーリングさせるには、以下の手順を実施してください:

1. [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)モジュールを設定し、`location`または`server`ブロック内に`mirror`ディレクティブを指定します。

    以下の例では、`location /`で受信したリクエストを`location /mirror-test`へミラーリングします.
1. ミラーリングされたトラフィックをWallarmノードに送信するため、ミラーリング対象となるヘッダーを列挙し、`mirror`ディレクティブが指す`location`内でノードが設置されているマシンのIPアドレスを指定します.

```
location / {
        mirror /mirror-test;
        mirror_request_body on;
        root   /usr/share/nginx/html;
        index  index.html index.htm; 
    }
    
location /mirror-test {
        internal;
        #proxy_pass http://111.11.111.1$request_uri;
        proxy_pass http://222.222.222.222$request_uri;
        proxy_set_header X-SERVER-PORT $server_port;
        proxy_set_header X-SERVER-ADDR $server_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $realip_remote_addr;
        proxy_set_header X-Forwarded-Port $realip_remote_port;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Request-ID $request_id;
    }
```

## ステップ2：ミラーリングされたトラフィックをフィルタリングするためのWallarmノードの設定

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"