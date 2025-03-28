[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md

# Docker NGINXベースイメージの実行

WallarmのNGINXベースのフィルタリングノードは[Dockerイメージ](https://hub.docker.com/r/wallarm/node)を使用してデプロイできます。このノードはx86_64アーキテクチャとARM64アーキテクチャの両方をサポートしており、インストール中に自動で識別されます。本記事はDockerイメージからのノード実行方法について説明します。

DockerイメージはAlpine LinuxとAlpineが提供するNGINXバージョンをベースにしています。現在、最新のイメージはAlpine Linuxバージョン3.20を使用し、NGINX stable 1.26.2が含まれています。

## 利用事例

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## 必要条件

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## コンテナ実行時のオプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数を渡してコンテナを実行

以下の手順でコンテナを実行します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノード付きでコンテナを実行:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:5.3.0
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:5.3.0
        ```

以下の基本的なフィルタリングノード設定を`-e`オプションでコンテナに渡せます:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

このコマンドは以下を実行します:

* 最小限のNGINX設定を含む`default`ファイルを作成し、フィルタリングノードの設定をコンテナ内の`/etc/nginx/sites-enabled`ディレクトリに渡します。
* Wallarm Cloudにアクセスするためのフィルタリングノードの認証情報ファイルをコンテナ内の`/opt/wallarm/etc/wallarm`ディレクトリに作成します:
    * フィルタリングノードUUIDとシークレットキーを含む`node.yaml`
    * Wallarmの秘密鍵を含む`private.key`
* リソース`http://NGINX_BACKEND:80`を保護します。

## 設定ファイルをマウントしてコンテナを実行

事前に作成した設定ファイルを`-v`オプションでDockerコンテナにマウントできます。ファイルには以下の設定が含まれている必要があります:

* [フィルタリングノードディレクティブ][nginx-directives-docs]
* [NGINX設定](https://nginx.org/en/docs/beginners_guide.html)

以下の手順でコンテナを実行します:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノード付きでコンテナを実行:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.0
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.0
        ```

    * `-e`オプションはコンテナに以下の必須環境変数を渡します:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

    * `-v`オプションは設定ファイル`default`が配置されたディレクトリをコンテナ内の`/etc/nginx/sites-enabled`ディレクトリにマウントします。

        ??? info "例 `/etc/nginx/sites-enabled` 最小限の内容を参照"
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

        ??? info "他の設定ファイルのマウント"
            NGINXが使用するコンテナ内ディレクトリ:

            * `/etc/nginx/nginx.conf` - メインのNGINX設定ファイルです。このファイルをマウントする場合、Wallarmの正常な動作のために追加の手順が必要です:

                1. `nginx.conf`のトップレベルに以下の設定を追加します:

                    ```
                    include /etc/nginx/modules-enabled/*.conf;
                    ```
                1. `nginx.conf`の`http`ブロック内に`wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;`ディレクティブを追加します。これは[API Specification Enforcement][api-policy-enf-docs]の設定ファイルへのパスを指定します。
                1. `wallarm-apifw-loc.conf`ファイルを指定パスにマウントします。内容は以下のとおりです:

                    ```
                    location ~ ^/wallarm-apifw(.*)$ {
                            wallarm_mode off;
                            proxy_pass http://127.0.0.1:8088$1;
                            error_page 404 431         = @wallarm-apifw-fallback;
                            error_page 500 502 503 504 = @wallarm-apifw-fallback;
                            allow 127.0.0.0/8;
                            deny all;
                    }

                    location @wallarm-apifw-fallback {
                            wallarm_mode off;
                            return 500 "API FW fallback";
                    }
                    ```
                1. `/etc/nginx/conf.d/wallarm-status.conf`ファイルを以下の内容でマウントします。ノードメトリクスをWallarm Cloudに正しくアップロードするため、提供された設定のいずれの行も変更しないことが重要です。

                    ```
                    server {
                      # ポートはNGINX_PORT変数の値と一致する必要があります
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
                1. NGINX設定ファイル内で、`/wallarm-status`エンドポイントに以下の設定を行います:

                    ```
                    location /wallarm-status {
                        # 許可するアドレスはWALLARM_STATUS_ALLOW変数の値と一致する必要があります
                        allow xxx.xxx.x.xxx;
                        allow yyy.yyy.y.yyy;
                        deny all;
                        wallarm_status on format=prometheus;
                        wallarm_mode off;
                    }
                    ```
            * `/etc/nginx/conf.d` — 共通の設定
            * `/etc/nginx/sites-enabled` — バーチャルホストの設定
            * `/opt/wallarm/usr/share/nginx/html` — 静的ファイル

            必要に応じて、上記のコンテナ内ディレクトリに任意のファイルをマウントできます。フィルタリングノードディレクティブは`/etc/nginx/sites-enabled/default`ファイルに記述する必要があります。

このコマンドは以下を実行します:

* ファイル`default`をコンテナ内の`/etc/nginx/sites-enabled`ディレクトリにマウントします。
* Wallarm Cloudにアクセスするためのフィルタリングノード認証情報ファイルをコンテナ内の`/opt/wallarm/etc/wallarm`ディレクトリに作成します:
    * フィルタリングノードUUIDとシークレットキーを含む`node.yaml`
    * Wallarmの秘密鍵を含む`private.key`
* リソース`http://example.com`を保護します。

## ログ設定

ログはデフォルトで有効になっています。ログディレクトリは以下のとおりです:

* `/var/log/nginx` — NGINXログ
* `/opt/wallarm/var/log/wallarm` — [Wallarmノードログ][logging-instr]

## Wallarmノード動作のテスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 利用事例の構成

Dockerコンテナにマウントされる設定ファイルには、[利用可能なディレクティブ][nginx-directives-docs]に記載のフィルタリングノード構成を示す必要があります。以下は一般的に使用されるフィルタリングノード構成オプションの例です:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"