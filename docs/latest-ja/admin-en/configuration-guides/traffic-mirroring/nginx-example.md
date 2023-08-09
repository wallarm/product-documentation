# トラフィックミラーリングのためのNGINX設定の例

NGINX 1.13からは、追加のバックエンドにトラフィックをミラーリングすることができます。この記事では、NGINXが[トラフィックをミラーリング](overview.md)するために必要な設定の例と、ミラーリングされたトラフィックを処理するノードの設定について説明します。

## ステップ1: NGINX でトラフィックをミラーリングする設定

NGINXでトラフィックをミラーリングするためには：

1. [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) モジュールを設定し、`location`や`server`ブロックの`mirror`ディレクティブを設定します。

    以下の例では、 `location /`で受信したリクエストを`location /mirror-test`にミラーリングします。
1. ミラーリングされたトラフィックをWallarmノードに送信するために、ミラーリングするヘッダーのリストを作成し、ノードが存在するマシンのIPアドレスを、`mirror`ディレクティブが指す`location`内に指定します。

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

## ステップ2: ミラーリングされたトラフィックをフィルターするためのWallarmノードの設定

--8<-- "../include-ja/wallarm-node-configuration-for-mirrored-traffic.md"