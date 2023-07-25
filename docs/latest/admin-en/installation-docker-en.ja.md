Wallarmのドキュメントの次の部分を英語から日本語に翻訳してください：
					[doc-wallarm-mode]:           configure-parameters-en.ja.md#wallarm_mode
[doc-config-params]:          configure-parameters-en.ja.md
[doc-monitoring]:             monitoring/intro.ja.md
[waf-mode-instr]:                   configure-wallarm-mode.ja.md
[logging-instr]:                    configure-logging.ja.md
[proxy-balancer-instr]:             using-proxy-or-balancer-en.ja.md
[process-time-limit-instr]:         configure-parameters-en.ja.md#wallarm_process_time_limit
[allocating-memory-guide]:          configuration-guides/allocate-resources-for-node.ja.md
[nginx-waf-directives]:             configure-parameters-en.ja.md
[mount-config-instr]:               #run-the-container-mounting-the-configuration-file
[graylist-docs]:                    ../user-guides/ip-lists/graylist.ja.md
[filtration-modes-docs]:            configure-wallarm-mode.ja.md
[application-configuration]:        ../user-guides/settings/applications.ja.md
[ptrav-attack-docs]:                ../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:                ../updating-migrating/versioning-policy.ja.md#version-list
[node-status-docs]:                 configure-statistics-service.ja.md

# Docker NGINXベースのイメージの実行

Wallarm NGINXベースのフィルタリングノードは、Dockerコンテナとしてデプロイできます。Dockerコンテナは脂肪であり、フィルタリングノードのすべてのサブシステムが含まれています。

Dockerコンテナ内にインストールされたフィルタリングノードの機能は、他のデプロイオプションの機能と完全に同じです。

--8<-- "../include/waf/installation/info-about-nginx-version-in-docker-container.ja.md"

## 要件

--8<-- "../include/waf/installation/requirements-docker-4.0.ja.md"

## コンテナの実行オプション

--8<-- "../include/waf/installation/docker-running-options.ja.md"

## 環境変数を渡してコンテナを実行する

コンテナを実行するには：

1. Wallarm Console → **Nodes** を開き、[US Cloud](https://us1.my.wallarm.com/nodes) または [EU Cloud](https://my.wallarm.com/nodes) で **Wallarm node** タイプのノードを作成します。

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. 作成したノードでコンテナを実行します。

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.4.5-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.4.5-1
        ```

`-e` オプションを使用して、次の基本的なフィルタリングノード設定をコンテナに渡すことができます。

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.ja.md"

コマンドは以下を実行します。

* 最小限のNGINX設定で `default` ファイルを作成し、`/etc/nginx/sites-enabled` コンテナディレクトリにフィルタリングノード設定を渡します。
* `/etc/wallarm` コンテナディレクトリにフィルタリングノード資格情報を含むファイルを作成し、Wallarm Cloudにアクセスします。
    * フィルタリングノードUUIDとシークレットキーを含む`node.yaml`
    * Wallarmプライベートキーを含む `private.key`
* リソース `http://NGINX_BACKEND:80` を保護します。

## 設定ファイルをマウントしてコンテナを実行する

`-v` オプションを使用して、準備された設定ファイルをDockerコンテナにマウントできます。ファイルには次の設定が含まれている必要があります。

* [フィルタリングノードディレクティブ](configure-parameters-en.ja.md)
* [NGINX設定](https://nginx.org/en/docs/beginners_guide.html)

コンテナを実行するには：

1. Wallarm Console → **Nodes**を開き、[US Cloud](https://us1.my.wallarm.com/nodes) または [EU Cloud](https://my.wallarm.com/nodes) で **Wallarm node** タイプのノードを作成します。

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. 作成したノードでコンテナを実行します。

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.4.5-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.4.5-1
        ```

    * `-e` オプションは、次の必須環境変数をコンテナに渡します。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.ja.md"
    
    * `-v` オプションは、設定ファイル `default` が含まれるディレクトリを `/etc/nginx/sites-enabled` コンテナディレクトリにマウントします。

        ??? info "最小限の設定でマウントされたファイルの例を見る"
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
            * `/etc/nginx/sites-enabled` — 仮想ホスト設定
            * `/var/www/html` — 静的ファイル

            必要に応じて、リストされたコンテナディレクトリに任意のファイルをマウントできます。フィルタリングノードディレクティブは、`/etc/nginx/sites-enabled/default` ファイルに記述する必要があります。

コマンドは以下を実行します。

* ファイル `default` を `/etc/nginx/sites-enabled` コンテナディレクトリにマウントします。
* `/etc/wallarm` コンテナディレクトリにフィルタリングノード資格情報を含むファイルを作成し、Wallarm Cloudにアクセスします。
    * フィルタリングノードUUIDとシークレットキーを含む `node.yaml`
    * Wallarmプライベートキーを含む `private.key`
* リソース `http://example.com` を保護します。

## ロギングの設定

ロギングはデフォルトで有効になっています。ログディレクトリは次のとおりです。

* `/var/log/nginx` — NGINXログ
* `/var/log/wallarm` — Wallarmノードログ

フィルタリングノード変数の拡張ロギングを設定するには、これらの[手順](configure-logging.ja.md)を使用してください。

デフォルトでは、ログは24時間ごとに1回ローテートされます。ログローテーションを設定するには、`/etc/logrotate.d/` の設定ファイルを変更してください。環境変数を介してローテーションパラメータを変更することはできません。

## モニタリングの設定

フィルタリングノードを監視するには、コンテナ内にNagios互換のスクリプトがあります。[フィルタリングノードの監視] [doc-monitoring]の詳細を参照してください。

スクリプトの実行例：

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>` は、実行中のWallarm DockerコンテナのIDです。IDを取得するには、`docker ps`を実行して適切なIDをコピーします。

## Wallarmノード操作のテスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.ja.md"

## 使用ケースの設定

Dockerコンテナにマウントされた設定ファイルには、[使用可能なディレクティブ]（configure-parameters-en.ja.md）でフィルタリングノードの設定が記述されている必要があります。以下は、フィルタリングノードの設定オプションの一般的な使用例です。

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.ja.md"