```markdown
[doc-wallarm-mode]:           ../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../admin-en/configure-parameters-en.md
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/overview.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../supported-deployment-options.md
[oob-advantages-limitations]:       ../overview.md#limitations
[web-server-mirroring-examples]:    overview.md#configuration-examples-for-traffic-mirroring
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[aws-ecs-docs]:                     ../../cloud-platforms/aws/docker-container.md
[gcp-gce-docs]:                     ../../cloud-platforms/gcp/docker-container.md
[azure-container-docs]:             ../../cloud-platforms/azure/docker-container.md
[alibaba-ecs-docs]:                 ../../cloud-platforms/alibaba-cloud/docker-container.md
[api-policy-enf-docs]:              ../../../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../../../admin-en/uat-checklist-en.md

# DockerイメージからWallarm OOBをデプロイする

この記事では、[Wallarm OOB](overview.md)を[NGINXベースのDockerイメージ](https://hub.docker.com/r/wallarm/node)を使用してデプロイする手順を案内します。ここで説明するソリューションは、Webサーバまたはプロキシサーバからミラーされたトラフィックの解析を目的としております。

## ユースケース

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## 動作要件

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## 1. トラフィックミラーリングの設定

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 2. ミラーリングされたトラフィック解析等のための設定ファイルを用意する

Wallarmノードがミラーリングされたトラフィックを解析できるように、別途ファイルに追加設定を行い、Dockerコンテナにマウントする必要があります。変更が必要なデフォルトの設定ファイルは、Dockerイメージ内の`/etc/nginx/sites-enabled/default`に配置されております。

このファイル内で、ミラーリングされたトラフィックを処理するためのWallarmノードの設定およびその他必要な設定を指定する必要があります。以下の手順に従ってください。

1. 以下の内容で`default`という名前のローカルNGINX設定ファイルを作成します。

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

            location / {
                    
                    proxy_pass http://example.com;
                    include proxy_params;
            }
    }
    ```

    * `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleが[攻撃者のIPアドレスを表示][proxy-balancer-instr]するために必要です。
    * `wallarm_force_response_*`ディレクティブは、ミラーされたトラフィックから受け取ったコピー以外の全リクエストの解析を無効にするために必要です。
    * `wallarm_mode`ディレクティブはトラフィック解析の[モード][waf-mode-instr]です。悪意のあるリクエストを遮断できないため、Wallarmが受け入れる唯一のモードはmonitoringです。インライン展開の場合、安全ブロッキングおよびブロッキングモードも存在しますが、`wallarm_mode`ディレクティブにmonitoring以外の値を設定しても、ノードはトラフィックの監視を続け、悪意のあるトラフィックのみを記録します（offに設定した場合を除く）。
1. その他必要なWallarmディレクティブを指定します。[Wallarm設定パラメーター](../../../admin-en/configure-parameters-en.md)のドキュメントや[設定ユースケース](#configuring-the-use-cases)を参照して、利用に適した設定を確認してください。
1. 必要に応じて、他のNGINX設定を変更して動作をカスタマイズしてください。サポートが必要な場合は、[NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご参照ください。

以下のコンテナディレクトリに他のファイルをマウントすることも可能です。

* `/etc/nginx/conf.d` — 共通の設定
* `/etc/nginx/sites-enabled` — 仮想ホストの設定
* `/opt/wallarm/usr/share/nginx/html` — 静的ファイル

## 3. Cloudへのノード接続用トークンを取得する

[該当タイプのWallarmトークン][wallarm-token-types]を取得します。

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens**を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. `Deploy`ソースロールを持つAPI tokenを見つけるか作成します。
    1. このトークンをコピーします。

=== "Node token"

    1. Wallarm Console → **Nodes**を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます。
    1. 以下のいずれかを実行します: 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを利用 – ノードのメニュー → **Copy token**でトークンをコピーします。

## 4. ノード付きのDockerコンテナを実行する

先ほど作成した設定ファイルを[マウント](https://docs.docker.com/storage/volumes/)して、ノード付きのDockerコンテナを実行します。

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.0
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.0
    ```

以下の環境変数をコンテナに渡す必要があります:

--8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

## 5. Wallarmノードの動作確認

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ログ設定

ログはデフォルトで有効になっております。ログディレクトリは以下の通りです:

* `/var/log/nginx` — NGINXログ
* `/opt/wallarm/var/log/wallarm` — [Wallarmノードのログ][logging-instr]

## 設定ユースケースの設定

Dockerコンテナにマウントされた設定ファイルは、[利用可能なディレクティブ](../../../admin-en/configure-parameters-en.md)に基づくフィルタリングノードの設定を記述する必要があります。以下は、よく使用されるフィルタリングノードの設定オプションの例です:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"
```