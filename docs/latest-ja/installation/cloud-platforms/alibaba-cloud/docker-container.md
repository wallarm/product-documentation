# Alibaba CloudへのWallarm Docker画像のデプロイ

このクイックガイドでは、[NGINXベースのWallarmノードのDocker画像](https://hub.docker.com/r/wallarm/node)を[Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs)を使用してAlibaba Cloudプラットフォームにデプロイする手順を説明します。

!!! warning "手順の制限事項"
    本手順では、ロードバランシングやノードの自動スケーリングの構成については扱っておりません。これらのコンポーネントをご自身で設定する場合は、適切な[Alibaba Cloudのドキュメント](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka)をお読みになることを推奨します。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## 必要条件

* [Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm)へのアクセス
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールが与えられており、二要素認証が無効化されたアカウントへのアクセス
* 下記のIPアドレスへ、攻撃検出ルールおよび[API仕様][api-policy-enf-docs]のアップデートのダウンロード、ならびに[allowlisted, denylisted, or graylisted][graylist-docs]の国、地域、またはデータセンターの正確なIP取得のためのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"

## WallarmノードDockerコンテナの構成オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数によって構成されたWallarmノードDockerコンテナのデプロイ

環境変数のみで構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、Alibaba Cloudインスタンスを作成し、このインスタンス上でDockerコンテナを実行します。これらの手順はAlibaba Cloud Consoleまたは[Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm)を使用して実行できます。本手順ではAlibaba Cloud Consoleを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Alibaba Cloud Consoleを開き、サービス一覧から**Elastic Compute Service**→**Instances**に進みます。
1. 以下のガイドラインおよび[Alibaba Cloudの手順](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX)に従ってインスタンスを作成します:

    * インスタンスは、任意のオペレーティングシステムのイメージに基づいて構築可能です。
    * インスタンスは外部リソースからアクセス可能である必要があるため、パブリックIPアドレスまたはドメインがインスタンス設定に構成される必要があります。
    * インスタンス設定は、[インスタンスに接続するために使用される方法](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)を反映する必要があります。
1. [Alibaba Cloudのドキュメント](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)に記載されているいずれかの方法でインスタンスに接続します。
1. [該当するオペレーティングシステムの手順](https://docs.docker.com/engine/install/#server)に従って、インスタンスにDockerパッケージをインストールします。
1. Wallarm Cloudにインスタンスを接続するために使用する、コピー済みのWallarmトークンを使用してインスタンスの環境変数を設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. 環境変数を渡し、構成ファイルをマウントして、`docker run`コマンドを使用してWallarmノードDockerコンテナを実行します:

    === "Command for the Wallarm US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:5.3.0
        ```
    === "Command for the Wallarm EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -p 80:80 wallarm/node:5.3.0
        ```
        
    * `-p`: フィルタリングノードがリッスンするポートです。値はインスタンスのポートと同じである必要があります。
    * `-e`: フィルタリングノードの構成を含む環境変数です（使用可能な変数は以下の表に記載されています）。なお、`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨されません。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [フィルタリングノードの稼働確認](#testing-the-filtering-node-operation)を行います。

## 構成ファイルをマウントして構成されたWallarmノードDockerコンテナのデプロイ

環境変数および構成ファイルのマウントによって構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、Alibaba Cloudインスタンスを作成し、このインスタンスのファイルシステム上にフィルタリングノードの構成ファイルを配置した上で、インスタンス上でDockerコンテナを実行します。これらの手順はAlibaba Cloud Consoleまたは[Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm)を使用して実行できます。本手順ではAlibaba Cloud Consoleを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"
            
1. Alibaba Cloud Consoleを開き、サービス一覧から**Elastic Compute Service**→**Instances**に進みます。
1. 以下のガイドラインおよび[Alibaba Cloudの手順](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX)に従ってインスタンスを作成します:

    * インスタンスは、任意のオペレーティングシステムのイメージに基づいて構築可能です。
    * インスタンスは外部リソースからアクセス可能である必要があるため、パブリックIPアドレスまたはドメインがインスタンス設定に構成される必要があります。
    * インスタンス設定は、[インスタンスに接続するために使用される方法](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)を反映する必要があります。
1. [Alibaba Cloudのドキュメント](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)に記載されているいずれかの方法でインスタンスに接続します。
1. [該当するオペレーティングシステムの手順](https://docs.docker.com/engine/install/#server)に従って、インスタンスにDockerパッケージをインストールします。
1. Wallarm Cloudにインスタンスを接続するために使用する、コピー済みのWallarmトークンを使用してインスタンスの環境変数を設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. インスタンス内で、フィルタリングノードの構成を含む`default`ファイルを配置したディレクトリを作成します（例：ディレクトリ名を`configs`とします）。最小限の設定を記述したファイルの例は以下の通りです:

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

    [構成ファイルに指定可能なフィルタリングノードディレクティブのセット →][nginx-waf-directives]
1. 環境変数を渡し、構成ファイルをマウントして`docker run`コマンドを使用し、WallarmノードDockerコンテナを実行します:

    === "Command for the Wallarm US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:5.3.0
        ```
    === "Command for the Wallarm EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:5.3.0
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: 前の手順で作成した構成ファイルのパスです。例：`configs`
    * `<DIRECTORY_FOR_MOUNTING>`: コンテナ内で構成ファイルをマウントするディレクトリです。構成ファイルはNGINXが使用する以下のコンテナディレクトリにマウントできます:

        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/sites-enabled` — 仮想ホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードディレクティブは、`/etc/nginx/sites-enabled/default`ファイルに記述する必要があります。
    
    * `-p`: フィルタリングノードがリッスンするポートです。値はインスタンスのポートと同じである必要があります。
    * `-e`: フィルタリングノードの構成を含む環境変数です（使用可能な変数は以下の表に記載されています）。なお、`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨されません。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [フィルタリングノードの稼働確認](#testing-the-filtering-node-operation)を行います。

## フィルタリングノードの稼働確認

1. Alibaba Cloud Consoleを開き、サービス一覧から**Elastic Compute Service**→**Instances**に進み、**IP address**欄からインスタンスのパブリックIPアドレスをコピーします。

    ![Settig up container instance][copy-container-ip-alibaba-img]

    もしIPアドレスが空の場合は、インスタンスが**Running**状態であることをご確認ください。

2. コピーしたアドレスに対して、テストの[Path Traversal][ptrav-attack-docs]攻撃のリクエストを送信します:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**にアクセスし、攻撃がリストに表示されていることを確認します。
    ![Attacks in UI][attacks-in-ui-image]

コンテナのデプロイ中に発生したエラーの詳細を表示するには、[Alibaba Cloudのドキュメント](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)に記載されているいずれかの方法でインスタンスに接続し、[コンテナログ][logging-docs]を確認してください。インスタンスが利用できない場合は、必要なフィルタリングノードパラメータが正しい値でコンテナに渡されていることをご確認ください。