トラフィックミラーリングの NGINX 設定例

NGINX 1.13 以降では、追加のバックエンドにトラフィックをミラーリングすることができます。この記事では、NGINX が[トラフィックをミラーリングする](overview.ja.md)ために必要な設定例と、ミラーリングされたトラフィックを処理するノードの設定例を提供します。

## ステップ1：トラフィックをミラーリングするために NGINX を設定する

NGINX でトラフィックをミラーリングするには:

1. `location` または `server` ブロック内で `mirror` ディレクティブを設定することで [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) モジュールを設定します。

    以下の例では、`location /` で受信されたリクエストを `location /mirror-test` にミラーリングします。
1. ミラーリングされたトラフィックを Wallarm ノードに送信するには、ミラーリングされるべきヘッダーをリストし、`mirror` ディレクティブが指す `location` 内でノードがあるマシンの IP アドレスを指定します。

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

## ステップ2：Wallarm ノードのミラーリングされたトラフィックをフィルタリングするように設定する

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.ja.md"