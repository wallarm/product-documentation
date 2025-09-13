# GCPへのWallarm Dockerイメージのデプロイ

このクイックガイドでは、[NGINXベースのWallarm nodeのDockerイメージ](https://hub.docker.com/r/wallarm/node)を[Google Compute Engine (GCE)コンポーネント](https://cloud.google.com/compute)を使用してGoogle Cloud Platformへデプロイする手順を説明します。

!!! warning "手順の制限事項"
    本手順では、ロードバランシングおよびノードのオートスケーリングの構成は対象外です。これらのコンポーネントを設定する場合は、該当する[GCPのドキュメント](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling)を参照してください。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/google-gce-use-cases.md"

## 要件

* 有効なGCPアカウント
* [GCPプロジェクトが作成済み](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d)が有効化済み
* [Google Cloud SDK (gcloud CLI)のインストールおよび設定が完了](https://cloud.google.com/sdk/docs/quickstart)
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス権
* 以下のIPアドレスへのアクセス。攻撃検知ルールおよび[API仕様][api-policy-enf-docs]の更新をダウンロードし、ならびにお使いの[許可リスト、拒否リスト、またはグレーリスト][graylist-docs]対象の国、地域、またはデータセンターの正確なIPを取得するため

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm nodeのDockerコンテナ構成のオプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数で構成されたWallarm nodeのDockerコンテナをデプロイする

環境変数のみで構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、[GCP Consoleまたはgcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers)を使用できます。本手順ではgcloud CLIを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. インスタンスをWallarm Cloudに接続するために使用するWallarm nodeトークンをローカル環境変数に設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container)コマンドを使用して、Dockerコンテナを実行した状態でインスタンスを作成します:

    === "Wallarm US Cloud向けのコマンド"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:6.4.1
        ```
    === "Wallarm EU Cloud向けのコマンド"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:6.4.1
        ```

    * `<INSTANCE_NAME>`: インスタンス名です。例: `wallarm-node`。
    * `--zone`: インスタンスをホストする[ゾーン](https://cloud.google.com/compute/docs/regions-zones)です。
    * `--tags`: インスタンスタグです。タグは、他のリソースからのインスタンスへの到達性を構成するために使用します。本例では、ポート80を開放する`http-server`タグをインスタンスに割り当てます。
    * `--container-image`: フィルタリングノードのDockerイメージへのリンクです。
    * `--container-env`: フィルタリングノードの構成に用いる環境変数です（利用可能な変数は下記の表に記載しています）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨しません。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * `gcloud compute instances create-with-container`コマンドのすべてのパラメータは[GCPのドキュメント](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container)に記載されています。
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances)を開き、インスタンスが一覧に表示されていることを確認します。
1. [フィルタリングノードの動作をテストします](#testing-the-filtering-node-operation)。

## マウントしたファイルで構成したWallarm nodeのDockerコンテナをデプロイする

環境変数およびマウントしたファイルで構成されたコンテナ化Wallarmフィルタリングノードをデプロイするには、インスタンスを作成し、このインスタンスのファイルシステムにフィルタリングノードの構成ファイルを配置し、このインスタンスでDockerコンテナを実行します。これらの手順は[GCP Consoleまたはgcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers)で実行できます。本手順ではgcloud CLIを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create)コマンドを使用して、Compute Engineレジストリの任意のOSイメージを基にインスタンスを作成します:

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: インスタンス名です。
    * `--image`: Compute EngineレジストリのOSイメージ名です。作成されるインスタンスはこのイメージを基にし、後でDockerコンテナの実行に使用します。このパラメータを省略すると、インスタンスはDebian 10イメージを基にします。
    * `--zone`: インスタンスをホストする[ゾーン](https://cloud.google.com/compute/docs/regions-zones)です。
    * `--tags`: インスタンスタグです。タグは、他のリソースからのインスタンスへの到達性を構成するために使用します。本例では、ポート80を開放する`http-server`タグをインスタンスに割り当てます。
    * `gcloud compute instances create`コマンドのすべてのパラメータは[GCPのドキュメント](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create)に記載されています。
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances)を開き、インスタンスが一覧に表示され、**RUNNING**ステータスであることを確認します。
1. [GCPの手順](https://cloud.google.com/compute/docs/instances/ssh)に従ってSSHでインスタンスに接続します。
1. 該当するOS向けの[手順](https://docs.docker.com/engine/install/#server)に従って、インスタンスにDockerパッケージをインストールします。
1. インスタンスをWallarm Cloudに接続するために使用するWallarm nodeトークンをローカル環境変数に設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. インスタンス内で、フィルタリングノードの構成を含むファイル`default`を配置するディレクトリを作成します（例えば、ディレクトリ名は`configs`とできます）。最小設定のファイル例:

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

    [構成ファイルで指定できるフィルタリングノードのディレクティブの一覧 →][nginx-waf-directives]
1. 環境変数とマウントした構成ファイルを指定して、`docker run`コマンドでWallarm nodeのDockerコンテナを実行します:

    === "Wallarm US Cloud向けのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:6.4.1
        ```
    === "Wallarm EU Cloud向けのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:6.4.1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: 前の手順で作成した構成ファイルへのパスです。例: `configs`。
    * `<DIRECTORY_FOR_MOUNTING>`: 構成ファイルをマウントするコンテナ内のディレクトリです。構成ファイルは、NGINXが使用する次のコンテナディレクトリにマウントできます:

        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/http.d` — 仮想ホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは`/etc/nginx/http.d/default.conf`ファイルに記述する必要があります。
    
    * `-p`: フィルタリングノードがリッスンするポートです。値はインスタンスのポートと同一にします。
    * `-e`: フィルタリングノードの構成に用いる環境変数です（利用可能な変数は下記の表に記載しています）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨しません。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [フィルタリングノードの動作をテストします](#testing-the-filtering-node-operation)。

## フィルタリングノードの動作テスト

1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances)を開き、**External IP**列からインスタンスのIPアドレスをコピーします。

    ![コンテナインスタンスの設定][copy-container-ip-gcp-img]

    IPアドレスが空の場合は、インスタンスが**RUNNING**ステータスであることを確認してください。

2. コピーしたアドレスにテスト用の[パストラバーサル][ptrav-attack-docs]攻撃リクエストを送信します:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. [US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)のWallarm Console → **Attacks**を開き、攻撃が一覧に表示されていることを確認します。
    ![UIのAttacks][attacks-in-ui-image]
1. 任意で、ノードの他の動作面も[テスト][link-docs-check-operation]します。

コンテナのデプロイ時に発生したエラーの詳細は、インスタンスの**View logs**メニューに表示されます。インスタンスにアクセスできない場合は、必要なフィルタリングノードのパラメータが正しい値でコンテナに渡されていることを確認してください。