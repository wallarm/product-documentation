# NGINXが無効と見なすヘッダーの処理

既定では、NGINXは名前に`.`や`_`を含むヘッダーなど、無効と見なしたヘッダーを破棄します。これによりWallarmはこれらのヘッダーを認識および解析できず、セキュリティのカバレッジが低下します。お使いの環境でこのようなヘッダーを有効と見なす場合は、本記事に従って許可してください。

## 問題の概要

[RFC 7230](https://www.rfc-editor.org/rfc/rfc7230?utm_source=chatgpt.com#section-3.2.6)によれば、`.`や`_`などの文字はHTTPヘッダーフィールド名として有効です。ただし既定では、NGINXはそのようなヘッダーを破棄します。

APIでこれらのヘッダーを正当に使用している場合、削除されると次のようなWallarmの制限が発生します:

* [API Discovery](../../api-discovery/overview.md)はドロップされたヘッダーを認識できず、インベントリに含めません
* [攻撃検知](../../user-guides/events/check-attack.md)はこれらのヘッダーに適用されません

これらの問題を回避するには、NGINXがそれらを受け入れて転送するように設定してください。

## 解決策

NGINXで次のディレクティブを有効にします:

* [`underscores_in_headers on;`](https://nginx.org/en/docs/http/ngx_http_core_module.html#underscores_in_headers)
* [`ignore_invalid_headers off;`](https://nginx.org/en/docs/http/ngx_http_core_module.html#ignore_invalid_headers)

これらの設定により、NGINXが`.`や`_`を含むものも含めてすべてのヘッダーを保持し、Wallarmが検査できるようになります。

## 各種デプロイメント形態での適用方法

### All-in-oneインストーラー、AWS AMIおよびGCPマシンイメージ

[All-in-oneインストーラー](../../installation/nginx/all-in-one.md)、[AWS AMI](../../installation/packages/aws-ami.md)または[GCPマシンイメージ](../../installation/packages/gcp-machine-image.md)からWallarm Nodeをインストールする場合:

1. `/etc/nginx/nginx.conf`を編集します。
1. `http {}`ブロック内に次を追加します:

    ```
    underscores_in_headers on;
    ignore_invalid_headers off;
    ```
1. NGINXをリロードします:

    ```
    sudo nginx -s reload
    ```

### Dockerイメージ

[DockerでWallarm Nodeを実行する場合](../installation-docker-en.md)、これらのディレクティブを含む設定ファイルをマウントします:

1. Nodeの設定を含む`/etc/nginx/nginx.conf`を作成します。

    以下は、Nodeの動作に必要な最小構成の内容です:

    ```hl_lines="15-16"
    #user  wallarm;
    worker_processes  auto;
    pid        /run/nginx.pid;
    include /etc/nginx/modules/*.conf;

    events {
        worker_connections  768;
        # multi_accept on;
    }

    http {
        # serverブロックへのapifwの自動インクルード
        wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;

        underscores_in_headers on;
        ignore_invalid_headers off;

        upstream wallarm_wstore {
            server localhost:3313 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
        wallarm_wstore_upstream wallarm_wstore;
        ##
        # 基本設定
        ##

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL設定
        ##

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # SSLv3を無効化、参考: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # ログ設定
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip設定
        ##

        gzip on;

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;


        ##
        # バーチャルホスト設定 - Wallarm
        ##

        include /etc/nginx/conf.d/*.conf;

        ##
        # バーチャルホスト設定 - ユーザー
        ##

        include /etc/nginx/http.d/*;
    }
    ```
1. `wallarm-apifw-loc.conf`ファイルを`/etc/nginx/wallarm-apifw-loc.conf`パスにマウントします。内容は次のとおりです:

    ```
    location ~ ^/wallarm-apifw(.*)$ {
            wallarm_mode off;
            proxy_pass http://127.0.0.1:8088$1;
            error_page 404 431         = @wallarm-apifw-fallback;
            error_page 500 502 503 504 = @wallarm-apifw-fallback;
            allow 127.0.0.8/8;
            deny all;
    }

    location @wallarm-apifw-fallback {
            wallarm_mode off;
            return 500 "API FW fallback";
    }
    ```
1. 下記の内容で`/etc/nginx/conf.d/wallarm-status.conf`ファイルをマウントします。提供された設定の行を変更しないことが極めて重要です。変更すると、Wallarm cloudへのノードメトリクスの正常なアップロードに支障をきたす可能性があります。

    ```
    server {
        listen 127.0.0.8:80;

        server_name localhost;

        allow 127.0.0.0/8;
        deny all;

        wallarm_mode off;
        disable_acl "on";
        wallarm_enable_apifw off;
        access_log off;

        location ~/wallarm-status$ {
        wallarm_status on;
        }
    }
    ```
1. NGINXの設定ファイル内で、`/wallarm-status`エンドポイントに対して次の設定を行います:

    ```
    location /wallarm-status {
        # 許可するアドレスはWALLARM_STATUS_ALLOW変数の値と一致させてください
        allow xxx.xxx.x.xxx;
        allow yyy.yyy.y.yyy;
        deny all;
        wallarm_status on format=prometheus;
        wallarm_mode off;
    }
    ```
1. [これらのファイルを所定のパスにマウントしてコンテナを実行します](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)。

### NGINX Ingress Controller

[Wallarm NGINXベースのIngress Controller](../installation-kubernetes-en.md)の場合、サポートされているConfigMapキーを使用します:

1. 次の内容で[ConfigMapを作成します](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files):

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: nginx-configuration
      namespace: ingress-nginx
    data:
      enable-underscores-in-headers: "true"
      ignore-invalid-headers: "false"
    ```
1. `values.yaml`でConfigMapのパスを指定します。

### Sidecar Proxy

[Wallarm Sidecar Proxy](../../installation/kubernetes/sidecar-proxy/deployment.md)を使用する場合、アノテーションを使用して必要なアプリケーションPodのレベルでディレクティブを挿入します:

```yaml hl_lines="8-10"
apiVersion: apps/v1
kind: Deployment
...
spec:
  template:
    metadata:
      annotations:
        sidecar.wallarm.io/nginx-http-snippet: |
          underscores_in_headers on;
          ignore_invalid_headers off;
```

### Security Edge

[Wallarm Security Edge](../../installation/security-edge/overview.md)で`.`および`_`を含むヘッダーのサポートを有効化するには、[support@wallarm.com](mailto:support@wallarm.com)までご連絡ください。