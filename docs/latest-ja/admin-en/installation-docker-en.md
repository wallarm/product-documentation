# DockerのNGINXベースイメージの実行

WallarmのNGINXベースのフィルタリングノードは、[Dockerイメージ](https://hub.docker.com/r/wallarm/node)を使用してデプロイできます。このノードはx86_64およびARM64アーキテクチャの両方をサポートしており、インストール時に自動的に判別されます。この記事では、[インライントラフィックフィルタリング][inline-docs]のためにDockerイメージからノードを実行する方法を説明します。

このDockerイメージはAlpine LinuxおよびAlpineが提供するNGINXのバージョンに基づいています。現在、最新のイメージはAlpine Linux 3.22を使用しており、NGINX stable 1.28.0が含まれています。

## ユースケース

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## 要件

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## コンテナの実行オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数を渡してコンテナを実行する

コンテナを実行するには:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノードを含むコンテナを実行します:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:6.4.1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:6.4.1
        ```

オプション`-e`で、次の基本的なフィルタリングノード設定をコンテナに渡せます:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

このコマンドは次の処理を行います:

* 最小限のNGINX構成を含む`default.conf`を作成し、フィルタリングノードの設定をコンテナの`/etc/nginx/http.d`ディレクトリに配置します。
* Wallarm Cloudへのアクセスに必要なフィルタリングノードの認証情報ファイルをコンテナの`/opt/wallarm/etc/wallarm`ディレクトリに作成します:
    * フィルタリングノードのUUIDとシークレットキーを含む`node.yaml`
    * Wallarmの秘密鍵を含む`private.key`
* リソース`http://NGINX_BACKEND:80`を保護します。

## 設定ファイルをマウントしてコンテナを実行する

準備済みの設定ファイルは、`-v`オプションでDockerコンテナにマウントできます。ファイルには次の設定が含まれている必要があります:

* [フィルタリングノードのディレクティブ][nginx-directives-docs]
* [NGINX設定](https://nginx.org/en/docs/beginners_guide.html)

コンテナを実行するには:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノードを含むコンテナを実行します:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/http.d/default.conf -p 80:80 wallarm/node:6.4.1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/http.d/default.conf -p 80:80 wallarm/node:6.4.1
        ```

    * オプション`-e`は、次の必須環境変数をコンテナに渡します:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * オプション`-v`は、設定ファイル`default.conf`を含むディレクトリをコンテナの`/etc/nginx/http.d`ディレクトリにマウントします。

        ??? info "例: `/etc/nginx/http.d/default.conf`の最小構成"
            ```bash
            server {
                    listen 80 default_server;
                    listen [::]:80 default_server ipv6only=on;
                    #listen 443 ssl;

                    server_name localhost;

                    #ssl_certificate cert.pem;
                    #ssl_certificate_key cert.key;

                    root /usr/share/nginx/html;

                    index index.html index.htm;

                    wallarm_mode monitoring;

                    location / {
                            
                            proxy_pass http://example.com;
                            include proxy_params;
                    }
            }
            ```

        ??? info "その他の設定ファイルをマウントする"
            NGINXが使用するコンテナ内のディレクトリ:

            * `/etc/nginx/nginx.conf` - これはNGINXのメイン設定ファイルです。このファイルをマウントする場合は、Wallarmを正しく動作させるために追加の手順が必要です:

                1. `nginx.conf`のトップレベルに次の設定を追加します:

                    ```
                    include /etc/nginx/modules/*.conf;
                    ```
                1. `nginx.conf`の`http`ブロックに`wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;`ディレクティブを追加します。これは[API仕様の適用][api-policy-enf-docs]用の設定ファイルへのパスを指定します。
                1. 指定のパスに`wallarm-apifw-loc.conf`ファイルをマウントします。内容は次のとおりです:

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
                1. 下記の内容で`/etc/nginx/conf.d/wallarm-status.conf`ファイルをマウントします。提供された設定の行は変更しないことが重要です。変更すると、ノードメトリクスのWallarm Cloudへの正常なアップロードに支障をきたす可能性があります。

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
            * `/etc/nginx/conf.d` — 共通設定
            * `/etc/nginx/http.d` — 仮想ホストの設定
            * `/opt/wallarm/usr/share/nginx/html` — 静的ファイル

            必要に応じて、上記のコンテナディレクトリへ任意のファイルをマウントできます。フィルタリングノードのディレクティブは`/etc/nginx/http.d/default.conf`ファイルに記述してください。

このコマンドは次の処理を行います:

* `default.conf`ファイルを`/etc/nginx/http.d`コンテナディレクトリにマウントします。
* Wallarm Cloudへのアクセスに必要なフィルタリングノードの認証情報ファイルをコンテナの`/opt/wallarm/etc/wallarm`ディレクトリに作成します:
    * フィルタリングノードのUUIDとシークレットキーを含む`node.yaml`
    * Wallarmの秘密鍵を含む`private.key`
* リソース`http://example.com`を保護します。

## ログ設定

ログはデフォルトで有効です。ログディレクトリは次のとおりです:

* `/var/log/nginx` — NGINXのログ
* `/opt/wallarm/var/log/wallarm` — [Wallarmノードのログ][logging-instr]

## Wallarmノードの動作テスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ユースケースの設定

Dockerコンテナにマウントする設定ファイルには、[利用可能なディレクティブ][nginx-directives-docs]でフィルタリングノードの設定を記述する必要があります。以下は、よく使用されるフィルタリングノードの設定オプションです:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"