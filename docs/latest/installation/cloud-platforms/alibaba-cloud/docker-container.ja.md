[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[mount-config-instr]:               #deploying-the-wallarm-node-docker-container-configured-through-the-mounted-file
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/graylist.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md

# WallarmノードDockerイメージのAlibaba Cloudへのデプロイ

このクイックガイドでは、[Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs)を使用して、[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)をAlibaba Cloudプラットフォームにデプロイする手順を説明します。

!!! warning "これらの手順の制約"
    これらの手順では、ロードバランシングとノードのオートスケーリングの設定についてはカバーされていません。これらのコンポーネントを自分で設定する場合は、適切な[Alibaba Cloudドキュメント](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka)を参照することをお勧めします。

## 要件

* [Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm)へのアクセス
* Wallarm Consoleでの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)の**管理者**ロールのアカウントへのアクセス

## WallarmノードDockerコンテナの構成オプション

--8<-- "../include-ja/waf/installation/docker-running-options.md"

## 環境変数を介して構成されたWallarmノードDockerコンテナのデプロイ

環境変数のみを介して構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、Alibaba Cloudインスタンスを作成し、このインスタンスでDockerコンテナを実行する必要があります。これらの手順はAlibaba Cloud Consoleまたは[Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm)を介して実行できます。これらの手順では、Alibaba Cloud Consoleが使用されます。

1. Wallarm Console → [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)の**ノード**を開き、**Wallarmノード**タイプのノードを作成します。

    ![!Wallarmノードの作成](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. Alibaba Cloud Console → サービスのリスト → **Elastic Compute Service** → **Instances**を開きます。
1. [Alibaba Cloudの手順](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX)と以下のガイドラインに従ってインスタンスを作成します。

    * インスタンスは任意のオペレーティングシステムのイメージに基づいて作成できます。
    * インスタンスが外部リソースに利用可能である必要があるため、インスタンス設定でパブリックIPアドレスまたはドメインが設定されている必要があります。
    * インスタンス設定は、[インスタンスへの接続方法](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)を反映する必要があります。
1. [Alibaba Cloudドキュメント](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)で説明されている方法のいずれかでインスタンスに接続します。
1. [適切なオペレーティングシステムの手順](https://docs.docker.com/engine/install/#server)に従って、インスタンスにDockerパッケージをインストールします。
1. Wallarm Cloudにインスタンスを接続するために使用されるWallarmノードトークンを持つインスタンス環境変数を設定します。

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. 環境変数とマウントされた設定ファイルを渡した`docker run`コマンドを使って、WallarmノードDockerコンテナを実行します。

    === "Wallarm US Cloudのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.4.5-1
        ```
    === "Wallarm EU Cloudのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -p 80:80 wallarm/node:4.4.5-1
        ```
        
    * `-p`: フィルタリングノードがリッスンするポート。値はインスタンスポートと同じである必要があります。
    * `-e`: フィルタリングノードの設定を持つ環境変数（利用可能な変数は以下の表に示すようにされています）。`WALLARM_API_TOKEN`の値を直接渡すことはお勧めできません。

        --8<-- "../include-ja/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [フィルタリングノードの操作をテストします](#testing-the-filtering-node-operation)。## マウントされたファイルを通じて設定された Wallarm ノード Docker コンテナのデプロイ

環境変数とマウントされたファイルを介して設定されたコンテナ化された Wallarm フィルタリングノードをデプロイするには、Alibaba Cloud インスタンスを作成し、このインスタンスのファイルシステムにフィルタリングノードの設定ファイルを配置し、このインスタンスで Docker コンテナを実行する必要があります。これらの手順は、Alibaba Cloud Console または [Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm) を使用して実行できます。これらの手順では、Alibaba Cloud Console を使用しています。

1. Wallarm Console を開き、[US Cloud](https://us1.my.wallarm.com/nodes) または [EU Cloud](https://my.wallarm.com/nodes) の **Nodes** に移動し、 **Wallarm node** 型のノードを作成します。

    ![!Wallarm node creation](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. Alibaba Cloud Console を開いて、サービスの一覧 → **Elastic Compute Service** → **Instances** に移動します。
1. [Alibaba Cloud の手順](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX)と以下のガイドラインに従ってインスタンスを作成します：

    * インスタンスは、任意のオペレーティングシステムのイメージに基づくことができます。
    * インスタンスは外部リソースから利用可能である必要があるため、インスタンスの設定でパブリック IP アドレスまたはドメインを設定する必要があります。
    * インスタンスの設定は、[インスタンスへの接続方法](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)を反映する必要があります。
1. [Alibaba Cloud のドキュメント](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)に記載されている方法のいずれかでインスタンスに接続します。
1. [適切なオペレーティングシステムの手順](https://docs.docker.com/engine/install/#server)に従って、インスタンスに Docker パッケージをインストールします。
1. Wallarm ノードトークンを使用して、インスタンスを Wallarm Cloud に接続するためのインスタンス環境変数を設定します：

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. インスタンスで、フィルタリングノードの設定を含むファイル `default` を含むディレクトリを作成します（例えば、ディレクトリは `configs` という名前にできます）。最小限の設定を持つファイルの例：

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

    [設定ファイルで指定できるフィルタリングノードディレクティブのセット →](../../../admin-en/configure-parameters-en.md)
1. 環境変数とマウントされた設定ファイルが渡された `docker run` コマンドを使用して、Wallarm ノード Docker コンテナを実行します：

    === "Wallarm US Cloud のコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.4.5-1
        ```
    === "Wallarm EU Cloud のコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.4.5-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: 前のステップで作成した設定ファイルへのパス。例えば、`configs` です。
    * `<DIRECTORY_FOR_MOUNTING>`: 設定ファイルをマウントするコンテナのディレクトリ。設定ファイルは、NGINX で使用される次のコンテナディレクトリにマウントできます：

        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/sites-enabled` — バーチャルホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードディレクティブは、`/etc/nginx/sites-enabled/default` ファイルに記述する必要があります。
    
    * `-p`: フィルタリングノードがリッスンするポート。値はインスタンスのポートと同じである必要があります。
    * `-e`: フィルタリングノードの設定を持つ環境変数（利用可能な変数は以下の表に記載されています）。`WALLARM_API_TOKEN` の値を明示的に渡すことはお勧めできません。

        --8<-- "../include-ja/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [フィルタリングノードの操作をテストする](#フィルタリングノードの操作をテストする)。

## フィルタリングノードの操作をテストする

1. Alibaba Cloud Console を開いて、サービスの一覧 → **Elastic Compute Service** → **Instances** に移動し、 **IP address** 列からインスタンスのパブリック IP アドレスをコピーします。

    ![!Settig up container instance](../../../images/waf-installation/alibaba-cloud/container-copy-ip.png)

    IP アドレスが空の場合は、インスタンスが **Running** ステータスにあることを確認してください。

2. コピーしたアドレスにテスト [Path Traversal](../../../attacks-vulns-list.md#path-traversal) 攻撃を含むリクエストを送信します：

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. [US Cloud](https://us1.my.wallarm.com/search) または [EU Cloud](https://my.wallarm.com/search) の Wallarm Console → **Events** を開き、攻撃がリストに表示されていることを確認します。
    ![!Attacks in UI](../../../images/admin-guides/test-attacks-quickstart.png)

コンテナのデプロイ中に発生したエラーの詳細を表示するには、[メソッドのいずれかでインスタンスに接続](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)して、[コンテナのログ](../../../admin-en/configure-logging.md)を確認してください。インスタンスが利用できない場合は、コンテナに正しい値で必要なフィルタリングノードパラメータが渡されていることを確認してください。