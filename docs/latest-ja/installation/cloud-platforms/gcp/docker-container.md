# GCPへのWallarm Dockerイメージの展開

本クイックガイドは、[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)を[Google Compute Engine (GCE)](https://cloud.google.com/compute)を使用してGoogle Cloud Platformにデプロイするための手順を説明します。

!!! warning "手順の制限事項"
    これらの手順は、ロードバランシングおよびノードの自動スケーリングの設定を対象としておりません。これらのコンポーネントを独自にセットアップする場合は、適切な[GCPドキュメント](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling)をお読みになることを推奨します。

## 使用例

--8<-- "../include/waf/installation/cloud-platforms/google-gce-use-cases.md"

## 要件

* 有効なGCPアカウント
* [GCPプロジェクトが作成済み](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d)が有効になっている
* [Google Cloud SDK (gcloud CLI)がインストールされ設定済み](https://cloud.google.com/sdk/docs/quickstart)
* Wallarm Console上で[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)の**Administrator**ロールが付与され、二要素認証が無効になっているアカウントへのアクセス
* 攻撃検知ルールおよび[API仕様][api-policy-enf-docs]のアップデートのダウンロード、並びに[許可リスト、拒否リスト、またはグレイリスト][graylist-docs]に登録された国、地域、またはデータセンターに対する正確なIPを取得するために、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"

## WallarmノードDockerコンテナの構成オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数で構成されたWallarmノードDockerコンテナの展開

環境変数のみを使用して構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、[GCP Consoleまたはgcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers)を使用できます。本手順ではgcloud CLIを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. インスタンスをWallarm Cloudに接続するために使用するWallarmノードトークンを含むローカル環境変数を設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container)コマンドを使用して、Dockerコンテナが稼働するインスタンスを作成します:

    === "Wallarm US Cloud向けコマンド"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:5.3.0
        ```
    === "Wallarm EU Cloud向けコマンド"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:5.3.0
        ```

    * `<INSTANCE_NAME>`：インスタンスの名称です。例：`wallarm-node`。
    * `--zone`：インスタンスをホストする[ゾーン](https://cloud.google.com/compute/docs/regions-zones)です。
    * `--tags`：インスタンスタグです。タグは他のリソースのインスタンス利用可否を設定するために使用されます。本ケースでは、ポート80を開放するタグ`http-server`がインスタンスに割り当てられます。
    * `--container-image`：フィルタリングノードのDockerイメージのリンクです。
    * `--container-env`：フィルタリングノードの構成情報を持つ環境変数です（利用可能な変数は以下の表に記載されています）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨しませんのでご注意ください。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * `gcloud compute instances create-with-container`コマンドのすべてのパラメータについては、[GCPドキュメント](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container)に記載されています。
1. [GCP Console→**Compute Engine**→VM instances](https://console.cloud.google.com/compute/instances)を開き、インスタンスがリストに表示されていることをご確認ください。
1. [フィルタリングノードの動作テスト](#testing-the-filtering-node-operation)を行います。

## マウントされたファイルを使用して構成されたWallarmノードDockerコンテナの展開

環境変数とマウントされたファイルを使用して構成されたコンテナ化されたWallarmフィルタリングノードを展開するには、インスタンスを作成し、このインスタンスのファイルシステム上にフィルタリングノードの構成ファイルを配置して、Dockerコンテナを実行する必要があります。これらの操作は[GCP Consoleまたはgcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers)を使用して実行できます。本手順ではgcloud CLIを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create)コマンドを使用して、Compute Engineレジストリから任意のオペレーティングシステムイメージに基づくインスタンスを作成します:

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`：インスタンスの名称です。
    * `--image`：Compute Engineレジストリからのオペレーティングシステムイメージの名称です。作成されたインスタンスはこのイメージに基づいており、後でDockerコンテナの実行に使用されます。このパラメータが省略された場合、インスタンスはDebian 10イメージに基づきます。
    * `--zone`：インスタンスをホストする[ゾーン](https://cloud.google.com/compute/docs/regions-zones)です。
    * `--tags`：インスタンスタグです。タグは他のリソースのインスタンス利用可否を設定するために使用されます。本ケースでは、ポート80を開放するタグ`http-server`がインスタンスに割り当てられます。
    * `gcloud compute instances create`コマンドのすべてのパラメータについては、[GCPドキュメント](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create)に記載されています。
1. [GCP Console→**Compute Engine**→VM instances](https://console.cloud.google.com/compute/instances)を開き、インスタンスがリストに表示され、**RUNNING**状態であることをご確認ください。
1. SSHを使用してインスタンスに接続します。詳細は[GCPの手順](https://cloud.google.com/compute/docs/instances/ssh)をご参照ください。
1. 適切なオペレーティングシステム向けの[手順](https://docs.docker.com/engine/install/#server)に従って、インスタンスにDockerパッケージをインストールします。
1. インスタンスをWallarm Cloudに接続するために使用するWallarmノードトークンを含むローカル環境変数を設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. インスタンス上で、フィルタリングノードの構成が含まれるファイル`default`を含むディレクトリ（例として、ディレクトリ名を`configs`とすることが可能です）を作成します。以下は最小限の設定が記載されたファイルの例です:

    ```nginx
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        #443番ポートでssl通信する場合

        server_name localhost;

        #ssl_certificateにはcert.pem
        #ssl_certificate_keyにはcert.key

        root /usr/share/nginx/html;

        index index.html index.htm;

        wallarm_mode monitoring;
        #wallarm_applicationは1;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [構成ファイルに記載可能なフィルタリングノードのディレクティブ一覧 →][nginx-waf-directives]
1. 環境変数とマウントされた構成ファイルを渡して、`docker run`コマンドを使用してWallarmノードDockerコンテナを実行します:

    === "Wallarm US Cloud向けコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:5.3.0
        ```
    === "Wallarm EU Cloud向けコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:5.3.0
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`：前の手順で作成した構成ファイルへのパスです。例：`configs`。
    * `<DIRECTORY_FOR_MOUNTING>`：構成ファイルをマウントするコンテナ内のディレクトリです。構成ファイルはNGINXが使用する以下のコンテナディレクトリにマウント可能です:
    
        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/sites-enabled` — 仮想ホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは`/etc/nginx/sites-enabled/default`ファイルに記述する必要があります。
    
    * `-p`：フィルタリングノードが待ち受けるポートです。この値はインスタンスのポートと同一である必要があります。
    * `-e`：フィルタリングノードの構成情報を持つ環境変数です（利用可能な変数は以下の表に記載されています）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨しませんのでご注意ください。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [フィルタリングノードの動作テスト](#testing-the-filtering-node-operation)を行います。

## フィルタリングノードの動作テスト

1. [GCP Console→**Compute Engine**→VM instances](https://console.cloud.google.com/compute/instances)を開き、**External IP**列からインスタンスのIPアドレスをコピーします。

    ![コンテナインスタンスの設定][copy-container-ip-gcp-img]

    もしIPアドレスが空の場合は、インスタンスが**RUNNING**状態であることをご確認ください。

2. コピーしたアドレスに対して、テスト用の[Path Traversal][ptrav-attack-docs]攻撃を送信します:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)にて**Attacks**を開き、攻撃がリストに表示されていることをご確認ください.
    ![UI上の攻撃][attacks-in-ui-image]

コンテナデプロイメント中に発生したエラーの詳細は、**View logs**インスタンスメニューに表示されます。インスタンスが利用できない場合は、必要なフィルタリングノードパラメーターが正しい値でコンテナに渡されているかをご確認ください.