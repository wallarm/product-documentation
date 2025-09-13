# Alibaba CloudへのWallarm Dockerイメージのデプロイ

このクイックガイドでは、[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)を[Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs)を使用してAlibaba Cloudプラットフォームへデプロイする手順を説明します。

!!! warning "手順の制限事項"
    本手順には、ロードバランシングおよびノードのオートスケーリングの設定は含まれていません。これらを自身で設定する場合は、該当する[Alibaba Cloudのドキュメント](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka)をお読みになることを推奨します。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## 要件

* [Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm)へのアクセス
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* 攻撃検知ルールや[API仕様][api-policy-enf-docs]の更新をダウンロードし、さらに[許可リスト・拒否リスト・グレーリスト][graylist-docs]に登録した国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへアクセスできること

    --8<-- "../include/wallarm-cloud-ips.md"

## WallarmノードDockerコンテナの設定オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数で設定したWallarmノードDockerコンテナのデプロイ

環境変数のみで設定したコンテナ化されたWallarmフィルタリングノードをデプロイするには、Alibaba Cloudインスタンスを作成し、そのインスタンス内でDockerコンテナを実行します。これらの手順はAlibaba Cloud Consoleまたは[Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm)で実行できます。本手順ではAlibaba Cloud Consoleを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Alibaba Cloud Console→サービスの一覧→**Elastic Compute Service**→**Instances**を開きます。
1. [Alibaba Cloudの手順](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX)および以下のガイドラインに従ってインスタンスを作成します:

    * インスタンスは任意のOSイメージに基づいて作成できます。
    * インスタンスを外部リソースから利用できるようにするため、インスタンス設定でパブリックIPアドレスまたはドメインを構成する必要があります。
    * インスタンスの設定は、[インスタンスへの接続方法](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)を反映している必要があります。
1. [Alibaba Cloudのドキュメント](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)に記載のいずれかの方法でインスタンスに接続します。
1. 該当OSの[インストール手順](https://docs.docker.com/engine/install/#server)に従って、インスタンスにDockerパッケージをインストールします。
1. コピーしたWallarmトークンをインスタンスの環境変数に設定し、Wallarm Cloudへの接続に使用します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. 環境変数を渡し、設定ファイルをマウントして`docker run`コマンドでWallarmノードDockerコンテナを起動します:

    === "Wallarm US Cloud向けのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:6.4.1
        ```
    === "Wallarm EU Cloud向けのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -p 80:80 wallarm/node:6.4.1
        ```
        
    * `-p`: フィルタリングノードが待ち受けるポート。値はインスタンスのポートと同一にします。
    * `-e`: フィルタリングノードの設定を行う環境変数（利用可能な変数は下表を参照）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨しません。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [フィルタリングノードの動作をテスト](#testing-the-filtering-node-operation)します。

## マウントしたファイルで設定したWallarmノードDockerコンテナのデプロイ

環境変数とマウントしたファイルで設定したコンテナ化されたWallarmフィルタリングノードをデプロイするには、Alibaba Cloudインスタンスを作成し、そのインスタンスのファイルシステムにフィルタリングノードの設定ファイルを配置して、インスタンス内でDockerコンテナを実行します。これらの手順はAlibaba Cloud Consoleまたは[Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm)で実行できます。本手順ではAlibaba Cloud Consoleを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"
            
1. Alibaba Cloud Console→サービスの一覧→**Elastic Compute Service**→**Instances**を開きます。
1. [Alibaba Cloudの手順](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX)および以下のガイドラインに従ってインスタンスを作成します:

    * インスタンスは任意のOSイメージに基づいて作成できます。
    * インスタンスを外部リソースから利用できるようにするため、インスタンス設定でパブリックIPアドレスまたはドメインを構成する必要があります。
    * インスタンスの設定は、[インスタンスへの接続方法](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)を反映している必要があります。
1. [Alibaba Cloudのドキュメント](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)に記載のいずれかの方法でインスタンスに接続します。
1. 該当OSの[インストール手順](https://docs.docker.com/engine/install/#server)に従って、インスタンスにDockerパッケージをインストールします。
1. コピーしたWallarmトークンをインスタンスの環境変数に設定し、Wallarm Cloudへの接続に使用します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. インスタンス内に、フィルタリングノードの設定を含む`default`ファイルを配置したディレクトリを作成します（例: ディレクトリ名は`configs`）。最小設定の例:

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

    [設定ファイルで指定できるフィルタリングノードのディレクティブ一式→][nginx-waf-directives]
1. 環境変数を渡し、設定ファイルをマウントして`docker run`コマンドでWallarmノードDockerコンテナを起動します:

    === "Wallarm US Cloud向けのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:6.4.1
        ```
    === "Wallarm EU Cloud向けのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:6.4.1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: 直前の手順で作成した設定ファイルへのパス。例: `configs`。
    * `<DIRECTORY_FOR_MOUNTING>`: 設定ファイルをマウントするコンテナ内のディレクトリ。設定ファイルは、NGINXが使用する以下のコンテナディレクトリにマウントできます:

        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/http.d` — バーチャルホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは`/etc/nginx/http.d/default.conf`ファイルに記述してください。
    
    * `-p`: フィルタリングノードが待ち受けるポート。値はインスタンスのポートと同一にします。
    * `-e`: フィルタリングノードの設定を行う環境変数（利用可能な変数は下表を参照）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨しません。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [フィルタリングノードの動作をテスト](#testing-the-filtering-node-operation)します。

## フィルタリングノードの動作テスト {#testing-the-filtering-node-operation}

1. Alibaba Cloud Console→サービスの一覧→**Elastic Compute Service**→**Instances**を開き、**IP address**列からインスタンスのパブリックIPアドレスをコピーします。

    ![コンテナインスタンスの設定][copy-container-ip-alibaba-img]

    IP addressが空の場合は、インスタンスが**Running**ステータスであることを確認してください。

2. コピーしたアドレスに、テスト用の[パストラバーサル][ptrav-attack-docs]攻撃のリクエストを送信します:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console→**Attacks**（[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)）を開き、攻撃が一覧に表示されていることを確認します。
    ![UIのAttacks][attacks-in-ui-image]
1. 必要に応じて、ノードの他の動作も[テスト][link-docs-check-operation]します。

コンテナのデプロイ中に発生したエラーの詳細を確認するには、[いずれかの方法でインスタンスに接続](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l)して[コンテナログ][logging-docs]を確認します。インスタンスにアクセスできない場合は、フィルタリングノードの必須パラメータが正しい値でコンテナに渡されていることを確認してください。