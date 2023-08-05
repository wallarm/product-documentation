# Docker NGINXベースの画像の実行

WallarmのNGINXベースのフィルタリングノードは、Dockerコンテナーとしてデプロイできます。 Dockerコンテナーは大きく、フィルタリングノードのすべてのサブシステムが含まれています。

Dockerコンテナー内にインストールされたフィルタリングノードの機能は、他のデプロイメントオプションの機能と完全に同一です。

--8<-- "../include/waf/installation/info-about-nginx-version-in-docker-container.md"

## 要件

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## コンテナの実行オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数を渡してコンテナを実行する

コンテナを実行するには：

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノード付きのコンテナーを実行します：

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.6.2-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.6.2-1
        ```

次の基本的なフィルタリングノード設定をオプション `-e` 経由でコンテナーに渡すことができます：

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

このコマンドは次のように動作します：

* ファイル `default` を最小限のNGINX設定で作成し、フィルタリングノードの設定をコンテナディレクトリ `/etc/nginx/sites-enabled` に渡します。
* フィルタリングノードの資格情報ファイルを作成し、Wallarm Cloudへのアクセスのためのコンテナディレクトリ `/etc/wallarm` に配置します：
    * フィルタリングノードUUIDおよびシークレットキーを含む `node.yaml`
    * Wallarmの秘密鍵を含む `private.key`
* リソース `http://NGINX_BACKEND:80` を保護します。

## 設定ファイルをマウントしてコンテナを実行する

準備された設定ファイルをオプション `-v` を通じてDockerコンテナーにマウントすることができます。以下の設定がファイルに含まれていなければなりません：

* [フィルタリングノードの指示][nginx-directives-docs]
* [NGINX設定](https://nginx.org/en/docs/beginners_guide.html)

コンテナを実行するには：

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノード付きのコンテナーを実行します：

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.6.2-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.6.2-1
        ```

    * `-e` オプションは、コンテナーに必要な環境変数を渡します：

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * `-v` オプションは、設定ファイル `default` があるディレクトリをコンテナディレクトリ `/etc/nginx/sites-enabled` にマウントします。

        ??? info "最小設定のマウントされたファイルの例を見る"
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
                # wallarm_application 1;

                location / {
                        proxy_pass http://example.com;
                        include proxy_params;
                }
            }
            ```

        !!! info "他の設定ファイルのマウント"
            NGINXで使用されるコンテナディレクトリ：

            * `/etc/nginx/conf.d` — 共通設定
            * `/etc/nginx/sites-enabled` — バーチャルホストの設定
            * `/var/www/html` — 静的ファイル

            必要に応じて、リストされたコンテナディレクトリに任意のファイルをマウントできます。 フィルタリングノードの指示は `/etc/nginx/sites-enabled/default` ファイルに記述するべきです。

このコマンドは次のように動作します：

* ファイル `default` をコンテナディレクトリ `/etc/nginx/sites-enabled` にマウントします。
* フィルタリングノードの資格情報ファイルを作成し、Wallarm Cloudへのアクセスのためのコンテナディレクトリ `/etc/wallarm` に配置します：
    * フィルタリングノードUUIDおよびシークレットキーを含む `node.yaml`
    * Wallarmの秘密鍵を含む `private.key`
* リソース `http://example.com` を保護します。

## ロギング設定

ログはデフォルトで有効化されています。 ログディレクトリは次のとおりです：

* `/var/log/nginx` — NGINXのログ
* `/var/log/wallarm` — Wallarmノードのログ

フィルタリングノード変数の拡張ログを設定するには、これらの [指示][logging-instr] を使用してください。

デフォルトでは、ログは24時間ごとに1回ローテートします。 ログローテーションを設定するには、 `/etc/logrotate.d/` の設定ファイルを変更します。 環境変数を通じてローテーションパラメータを変更することはできません。 

## モニタリング設定

フィルタリングノードを監視するには、コンテナ内部にNagios互換のスクリプトがあることがあります。 [フィルタリングノードの監視][doc-monitoring]の詳細をご覧ください。

スクリプトの実行例：

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>`は、実行中のWallarm DockerコンテナのIDです。 IDを取得するには、 `docker ps` を実行し、適切なIDをコピーします。

## Wallarmノード操作のテスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ユースケースの設定

Dockerコンテナにマウントされた設定ファイルは、[使用可能な指示][nginx-directives-docs]のフィルタリングノード設定を記述するべきです。以下はよく使用されるフィルタリングノードの設定オプションのいくつかです：

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"
