[doc-wallarm-mode]:             ../../../admin-en/configure-parameters-en.ja.md#wallarm_mode
[doc-config-params]:            ../../../admin-en/configure-parameters-en.ja.md
[doc-monitoring]:               ../../../admin-en/monitoring/intro.ja.md
[waf-mode-instr]:               ../../../admin-en/configure-wallarm-mode.ja.md
[logging-instr]:                ../../../admin-en/configure-logging.ja.md
[proxy-balancer-instr]:         ../../../admin-en/using-proxy-or-balancer-en.ja.md
[process-time-limit-instr]:     ../../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[allocating-memory-guide]:      ../../../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[nginx-waf-directives]:         ../../../admin-en/configure-parameters-en.ja.md
[graylist-docs]:                ../../../user-guides/ip-lists/graylist.ja.md
[filtration-modes-docs]:        ../../../admin-en/configure-wallarm-mode.ja.md
[application-configuration]:    ../../../user-guides/settings/applications.ja.md
[ptrav-attack-docs]:            ../../../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]:          ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.ja.md#version-list
[node-status-docs]:             ../../../admin-en/configure-statistics-service.ja.md
[node-token]:                   ../../../quickstart.ja.md#deploy-the-wallarm-filtering-node
[api-token]:                    ../../../user-guides/settings/api-tokens.ja.md
[wallarm-token-types]:          ../../../user-guides/nodes/nodes.ja.md#api-and-node-tokens-for-node-creation
[platform]:                     ../../supported-deployment-options.ja.md
[oob-advantages-limitations]:   ../overview.ja.md#advantages-and-limitations
[web-server-mirroring-examples]:overview.ja.md#examples-of-web-server-configuration-for-traffic-mirroring
[memory-instr]:                 ../../../admin-en/configuration-guides/allocate-resources-for-node.ja.md

# DockerイメージからのWallarm OOBのデプロイ

この記事では、[Wallarm OOB](overview.ja.md)を[NGINXベースのDockerイメージ](https://hub.docker.com/r/wallarm/node)を使用してデプロイするための手順を提供します。ここで説明するソリューションは、Webサーバまたはプロキシサーバによってミラーリングされたトラフィックを分析するためのものです。

--8<-- "../include/waf/installation/info-about-nginx-version-in-docker-container.ja.md"

## 必要条件

--8<-- "../include/waf/installation/requirements-docker-4.0.ja.md"

## 1. トラフィックのミラーリングを設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.ja.md"

## 2. ミラーリングされたトラフィック分析用の設定ファイルを準備し、その他の設定を行う

Wallarmノードがミラーリングされたトラフィックを分析できるようにするためには、別のファイルで追加設定を行う必要があります。これをDockerコンテナにマウントする必要があります。修正が必要なデフォルトの設定ファイルは、Dockerイメージ内の`/etc/nginx/sites-enabled/default`にあります。

このファイルでは、ミラーリングされたトラフィックを処理するためのWallarmノード設定と、それ以外の必要な設定を指定する必要があります。次の手順に従って設定してください：

1. 内容が以下のような、`default`という名前のローカルNGINX設定ファイルを作成します：

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

    * `set_real_ip_from`と`real_ip_header`というディレクティブは、Wallarmコンソールで攻撃者のIPアドレス[表示][proxy-balancer-instr]するために必要です。
    * `wallarm_force_response_*`というディレクティブは、ミラーリングされたトラフィックから受信したコピーを除くすべてのリクエストの分析を無効にするために必要です。
    * `wallarm_mode`というディレクティブは、トラフィック分析[モード][waf-mode-instr]です。悪意のあるリクエストは[ブロックできない][oob-advantages-limitations]ため、Wallarmが受け入れる唯一のモードはモニタリングです。インラインデプロイメントでは、安全なブロックとブロックのモードもありますが、`wallarm_mode`ディレクティブをモニタリングとは異なる値に設定しても、ノードは引き続きトラフィックを監視し、悪意のあるトラフィックのみを記録します（モードがオフに設定されている場合を除く）。
1. 必要に応じて他のWallarmディレクティブを指定します。[Wallarm設定パラメータ](../../../admin-en/configure-parameters-en.ja.md)のドキュメンテーションと[設定事例の利用](#configuring-the-use-cases)を参照して、どの設定が役立つかを理解します。
1. 必要であれば、その他のNGINX設定を変更して振る舞いをカスタマイズします。[NGINXのドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

必要に応じて、他のファイルを以下のコンテナディレクトリにマウントすることもできます：

* `/etc/nginx/conf.d` — 共通設定
* `/etc/nginx/sites-enabled` — 仮想ホスト設定
* `/var/www/html` — 静的ファイル

## 3. ノードをクラウドに接続するためのトークンを取得する

[適切なタイプ][wallarm-token-types]のWallarmトークンを取得します：

=== "APIトークン"

    1. Wallarmコンソール → **設定** → **APIトークン**を開きます（[USクラウド](https://us1.my.wallarm.com/settings/api-tokens)または[EUクラウド](https://my.wallarm.com/settings/api-tokens)）。
    1. `Deploy`ソースロールを持つAPIトークンを探すか新規作成します。
    1. そのトークンをコピーします。

=== "ノードトークン"

    1. Wallarmコンソール → **ノード**を開きます（[USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)）。
    1. 次のいずれかを行います： 
        * **Wallarmノード**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用します - ノードのメニュー → **トークンをコピー**からトークンをコピーします。

## 4. ノードと共にDockerコンテナを起動する

あなたが作成した設定ファイルを[マウント](https://docs.docker.com/storage/volumes/)した状態でDockerコンテナを起動します。

=== "USクラウド"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.6.2-1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.6.2-1
    ```

以下の環境変数をコンテナにパスする必要があります：

--8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.ja.md"

## 5. Wallarmノードの動作確認

--8<-- "../include/waf/installation/test-waf-operation-no-stats.ja.md"

## ロギング設定

ロギングはデフォルトで有効になっています。ログディレクトリは次のとおりです：

* `/var/log/nginx` — NGINXログ
* `/var/log/wallarm` — Wallarmノードログ

フィルタリングノード変数の詳細なログを設定するには、これらの[指示](../../../admin-en/configure-logging.ja.md)を使用します。

デフォルトでは、ログは24時間ごとにローテーションします。ログローテーションを設定するには、`/etc/logrotate.d/`内の設定ファイルを変更します。環境変数を介したローテーションパラメータの変更はできません。

## モニタリング設定

フィルタリングノードを監視するためには、コンテナ内部にNagios互換のスクリプトが存在します。詳細は[フィルタリングノードのモニタリング][doc-monitoring]を参照してください。

スクリプトの実行例：

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>`は、実行中のWallarm DockerコンテナのIDです。IDを取得するには、`docker ps`を実行し、適切なIDをコピーします。

## ユースケースの設定

Dockerコンテナにマウントされた設定ファイルは、[利用可能なディレクティブ](../../../admin-en/configure-parameters-en.ja.md)でフィルタリングノードの設定を説明している必要があります。以下は一般的に使用されるフィルタリングノード設定オプションの例です:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.ja.md"