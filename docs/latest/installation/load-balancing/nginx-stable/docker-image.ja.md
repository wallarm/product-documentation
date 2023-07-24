[doc-wallarm-mode]:           ../../../admin-ja/configure-parameters-ja.md#wallarm_mode
[doc-config-params]:          ../../../admin-ja/configure-parameters-ja.md
[doc-monitoring]:             ../../../admin-ja/monitoring/intro.md
[waf-mode-instr]:             ../../../admin-ja/configure-wallarm-mode.md
[logging-instr]:              ../../../admin-ja/configure-logging.md
[proxy-balancer-instr]:       ../../../admin-ja/using-proxy-or-balancer-ja.md
[process-time-limit-instr]:   ../../../admin-ja/configure-parameters-ja.md#wallarm_process_time_limit
[allocating-memory-guide]:    ../../../admin-ja/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:       ../../../admin-ja/configure-parameters-ja.md
[mount-config-instr]:         #run-the-container-mounting-the-configuration-file
[graylist-docs]:              ../../../user-guides/ip-lists/graylist.md
[filtration-modes-docs]:      ../../../admin-ja/configure-wallarm-mode.md
[application-configuration]:  ../../../user-guides/settings/applications.md
[ptrav-attack-docs]:          ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:        ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:          ../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:           ../../../admin-ja/configure-statistics-service.md
[node-token]:                 ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                  ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:        ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                   ../../../installation/supported-deployment-options.md

# Docker NGINXベースのイメージの実行

Wallarm NGINXベースのフィルタリングノードは、Dockerコンテナとしてデプロイできます。Dockerコンテナはファットで、フィルタリングノードのすべてのサブシステムを含んでいます。

Dockerコンテナ内にインストールされたフィルタリングノードの機能は、他のデプロイメントオプションの機能と全く同一です。

--8<-- "../include/waf/installation/info-about-nginx-version-in-docker-container.md"

## 要件

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## コンテナを実行するためのオプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数を渡してコンテナを実行する

コンテナを実行するには：

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノードと共にコンテナを実行します：

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.6.2-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.6.2-1
        ```

以下の基本的なフィルタリングノード設定を、オプション`-e`を介してコンテナに渡すことができます：

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

このコマンドは以下の操作を行います：

* 最小限のNGINX設定を持つ`default`ファイルを作成し、フィルタリングノードの設定をコンテナディレクトリ`/etc/nginx/sites-enabled`に渡します。
* フィルタリングノードのクレデンシャルファイルを作成し、それをコンテナディレクトリ`/etc/wallarm`に渡して、Wallarm Cloudにアクセスします：
    * フィルタリングノードのUUIDと秘密鍵を持つ`node.yaml`
    * Wallarmのプライベートキーを持つ`private.key`
* リソース`http://NGINX_BACKEND:80`を保護します。

## 設定ファイルをマウントしてコンテナを実行する

準備済みの設定ファイルを、`-v`オプションを使ってDockerコンテナにマウントすることができます。ファイルには以下の設定が含まれている必要があります：

* [フィルタリングノードのディレクティブ](../../../admin-ja/configure-parameters-ja.md)
* [NGINXの設定](https://nginx.org/en/docs/beginners_guide.html)

コンテナを実行するには：

コンテナを実行するには：

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノードと共にコンテナを実行します：

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.6.2-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.6.2-1
        ```

    * `-e`オプションは、必要な環境変数をコンテナに渡します：

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * `-v`オプションは、設定ファイル`default`を含むディレクトリをコンテナディレクトリ`/etc/nginx/sites-enabled`にマウントします。

        ??? info "最小限の設定を持ったマウントファイルの例を見る"
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
            NGINXが使用するコンテナディレクトリ：

            * `/etc/nginx/conf.d` — 共通設定
            * `/etc/nginx/sites-enabled` — 仮想ホストの設定
            * `/var/www/html` — 静的ファイル

            必要に応じて、任意のファイルを上記のコンテナディレクトリにマウントできます。フィルタリングノードのディレクティブは`/etc/nginx/sites-enabled/default`ファイルに記述する必要があります。

このコマンドは以下の操作を行います：

* ファイル`default`をコンテナディレクトリ`/etc/nginx/sites-enabled`にマウントします。
* フィルタリングノードのクレデンシャルファイルを作成し、それをコンテナディレクトリ`/etc/wallarm`に渡して、Wallarm Cloudにアクセスします：
    * フィルタリングノードのUUIDと秘密鍵を持つ`node.yaml`
    * Wallarmのプライベートキーを持つ`private.key`
* リソース`http://example.com`を保護します。

## ロギング設定

ロギングはデフォルトで有効になっています。ログディレクトリは次のとおりです：

* `/var/log/nginx` — NGINXのログ
* `/var/log/wallarm` — Wallarmノードのログ

フィルタリングノード変数の詳細なログを設定するには、これらの[手順](../../../admin-ja/configure-logging.md)を使用してください。

デフォルトでは、ログは24時間ごとに1回ローテーションします。ログのローテーションを設定するには、`/etc/logrotate.d/`の設定ファイルを変更します。環境変数を通じてローテーションパラメータを変更することはできません。

## モニタリング設定

フィルタリングノードを監視するために、コンテナ内にはNagios互換のスクリプトがあります。詳細は[フィルタリングノードの監視][doc-monitoring]をご覧ください。

スクリプトを実行する例：

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>`は、実行中のWallarm DockerコンテナのIDです。IDを取得するには、`docker ps`を実行し、適切なIDをコピーします。

## Wallarmノードの動作のテスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ユースケースの設定

Dockerコンテナにマウントされた設定ファイルには、[利用可能なディレクティブ](../../../admin-ja/configure-parameters-ja.md)でフィルタリングノードの設定を記述する必要があります。以下に一般的に使用されるフィルタリングノード設定オプションのいくつかを示します：

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"