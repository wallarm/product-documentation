[doc-wallarm-mode]:           ../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../admin-en/configure-parameters-en.md
[doc-monitoring]:             ../../../admin-en/monitoring/intro.md
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/graylist.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md
[node-token]:                       ../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../supported-deployment-options.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md

# DockerイメージからのWallarm OOBのデプロイ

この記事では、[NGINXベースのDockerイメージ](https://hub.docker.com/r/wallarm/node)を使用して[Wallarm OOB](overview.md)をデプロイするための指示を提供します。このここで説明されているソリューションは、Webサーバーまたはプロキシサーバーによってミラーリングされたトラフィックを分析するために設計されています。

--8<-- "../include-ja/waf/installation/info-about-nginx-version-in-docker-container.md"

## 必要条件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

## 1. トラフィックミラーリングの設定

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-oob.md"

## 2. ミラーリングされたトラフィックの分析に対する設定ファイルの準備とその他

Wallarmノードがミラーリングされたトラフィックを分析できるようにするためには、別のファイルに設定を追加してDockerコンテナにマウントする必要があります。修正が必要なデフォルトの設定ファイルは、Dockerイメージ内の`/etc/nginx/sites-enabled/default`にあります。

このファイルでは、ミラーリングされたトラフィックを処理するためのWallarmノードの設定と、その他の必要な設定を指定する必要があります。それを行うための手順は以下の通りです:

1. 次の内容を持つローカルのNGINX設定ファイル`default`を作成します:

    ```
    server {
            listen 80 default_server;
            listen [::]:80 default_server ipv6only=on;
            #listen 443 ssl;

            server_name localhost;

            #ssl_certificate cert.pem;
            #ssl_certificate_key cert.key;

            root /usr/share/nginx/html;

            index index.html index.htm;

            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # Change 222.222.222.22 to the address of the mirroring server
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
            real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;

            wallarm_mode monitoring;
            # wallarm_application 1;

            location / {
                    proxy_pass http://127.0.0.1:8080;
                    include proxy_params;
            }
    }
    ```

    * `set_real_ip_from`や`real_ip_header`のディレクティブは、侵入者のIPアドレスを[Wallarm Consoleに表示する][proxy-balancer-instr]ために必要です。
    * `wallarm_force_response_*`のディレクティブは、ミラーリングされたトラフィックから受け取ったコピーリクエスト以外の全てのリクエストの分析を無効にするために必要です。
    * `wallarm_mode`ディレクティブは、トラフィック分析の[モード][waf-mode-instr]です。悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一のモードはモニタリングです。インラインデプロイメントの場合、セーフブロッキングとブロッキングのモードも存在しますが、`wallarm_mode`ディレクティブをモニタリング以外の値に設定したとしても、ノードはトラフィックを続けてモニタリングし、悪意のあるトラフィックのみを記録します（モードがオフに設定されている場合を除く）。
1. 必要な他のWallarmディレクティブを指定します。必要な設定を理解するために、[Wallarmの設定パラメータ](../../../admin-en/configure-parameters-en.md)のドキュメンテーションと[使用例の設定](#使用例の設定)を参照できます。
1. 必要に応じて、他のNGINXの設定を変更してその挙動をカスタム化します。[NGINXのドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

必要に応じて、他のファイルを以下のコンテナディレクトリにマウントすることもできます:

* `/etc/nginx/conf.d` — 共通設定
* `/etc/nginx/sites-enabled` — 仮想ホスト設定
* `/var/www/html` — 静的ファイル

## 3. ノードをクラウドに接続するためのトークンの取得

[適切な種類の][wallarm-token-types]Wallarmトークンを取得します:

=== "APIトークン"

    1. [USクラウド](https://us1.my.wallarm.com/settings/api-tokens)または[EUクラウド](https://my.wallarm.com/settings/api-tokens)のWallarm Console → **設定** → **APIトークン**を開きます。
    1. `Deploy`ソースロールを持つAPIトークンを見つけるか、作成します。
    1. このトークンをコピーします。

=== "ノードトークン"

    1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarm Console → **ノード**を開きます。
    1. 次のいずれかの操作を行います： 
        * **Wallarmノード**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用します - ノードのメニュー → **トークンをコピー**でトークンをコピーします。

## 4. ノードを含むDockerコンテナの実行

作成した設定ファイルを[マウント](https://docs.docker.com/storage/volumes/)してノードを含むDockerコンテナを実行します。

=== "USクラウド"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.6.2-1
    ```
=== "EUクラウド"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.6.2-1
    ```

以下の環境変数をコンテナに渡す必要があります:

--8<-- "../include-ja/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

## 5. Wallarmノードの操作テスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## ログ設定

デフォルトでロギングが有効になっています。ログディレクトリは以下の通りです:

* `/var/log/nginx` — NGINXのログ
* `/var/log/wallarm` — Wallarmノードのログ

フィルタリングノードの変数の詳細ログを設定するには、[こちらの指示][logging-instr]をご覧ください。

デフォルトでは、ログは24時間ごとにローテーションします。ログローテーションを設定するには、`/etc/logrotate.d/`の設定ファイルを変更します。環境変数を用いてローテーションのパラメータを変更することはできません。

## モニタリング設定

フィルタリングノードを監視するために、コンテナ内に Nagios互換のスクリプトがあります。[フィルタリングノードの監視][doc-monitoring]で詳細を確認してください。

スクリプトの実行例：

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>`は、実行中のWallarm DockerコンテナのIDです。IDを取得するには、`docker ps`を実行し、該当するIDをコピーします。

## 使用例の設定

Dockerコンテナにマウントする設定ファイルは、[使用可能なディレクティブ](../../../admin-en/configure-parameters-en.md)にフィルタリングノード設定を記述する必要があります。以下に、一般的に使用されるフィルタリングノード設定のオプションを示します:

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"
