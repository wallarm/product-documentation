# Wallarm Docker ImageのGCPへのデプロイ

このクイックガイドでは、[Google Compute Engine（GCE）](https://cloud.google.com/compute)を使用して、[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)をGoogle Cloud Platformにデプロイする手順を提供します。

!!! warning "指示の制限"
    これらの指示は、ロードバランシングとノードの自動スケーリングの設定をカバーしていません。自身でこれらのコンポーネントを設定する場合は、適切な[GCPのドキュメント](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling)を読むことをお勧めします。

## 要件

* アクティブなGCPアカウント
* [作成済みのGCPプロジェクト](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [Compute Engine APIが有効化](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d)
* [Google Cloud SDK（gcloud CLI）がインストールおよび設定済み](https://cloud.google.com/sdk/docs/quickstart)
* Wallarm Consoleの[USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)における**管理者**ロールを持つアカウントへのアクセス

## WallarmノードDockerコンテナ設定のオプション

--8<-- "../include-ja/waf/installation/docker-running-options.md"

## 環境変数を通じて設定されたWallarmノードDockerコンテナのデプロイ

環境変数だけを通じて設定されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、[GCPコンソールまたはgcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers)を使用できます。これらの指示では、gcloud CLIを使用します。

--8<-- "../include-ja/waf/installation/get-api-or-node-token.md"

1. Wallarm Cloudにインスタンスを接続するために使用されるWallarmノードトークンのローカル環境変数を設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. 実行中のDockerコンテナとともにインスタンスを作成します。[`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) コマンドを使用します:

    === "Wallarm USクラウド用のコマンド"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:4.6.2-1
        ```
    === "Wallarm EUクラウド用のコマンド"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:4.6.2-1
        ```

    * `<INSTANCE_NAME>`: インスタンスの名前、例: `wallarm-node`。
    * `--zone`: インスタンスがホストされる[ゾーン](https://cloud.google.com/compute/docs/regions-zones)。
    * `--tags`: インスタンスのタグ。タグは他のリソースへのインスタンスの可用性を設定するために使用されます。今回のケースでは、ポート80を開放するタグ`http-server`がインスタンスに割り当てられます。
    * `--container-image`: フィルタリングノードのDockerイメージのリンク。
    * `--container-env`: フィルタリングノードの設定の環境変数（利用可能な変数は以下の表に記載されています）。`WALLARM_API_TOKEN`の値を明示的にパスすることは推奨されていません。

        --8<-- "../include-ja/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * `gcloud compute instances create-with-container` コマンドのすべてのパラメータは、[GCPのドキュメント](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container)で説明されています。
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances)を開いて、インスタンスがリストに表示されていることを確認します。
1. [フィルタリングノードの動作をテストします](#フィルタリングノードの動作のテスト)。

## マウントされたファイルを通じて設定されたWallarmノードDockerコンテナのデプロイ

環境変数とマウントされたファイルを通じて設定されたコンテナ化されたWallarmフィルタリングノードをデプロイするためには、インスタンスを作成し、このインスタンスのファイルシステムにフィルタリングノードの設定ファイルを配置し、このインスタンスでDockerコンテナを実行する必要があります。これらの手順は、[GCP Consoleまたはgcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers)を経由で実行できます。これらの指示では、gcloud CLIが使用されます。

--8<-- "../include-ja/waf/installation/get-api-or-node-token.md"

1. [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) コマンドを使用して、Compute Engineレジストリからの任意のオペレーティングシステムイメージに基づいたインスタンスを作成します:

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: インスタンスの名前。
    * `--image`: Compute Engineレジストリからのオペレーティングシステムイメージの名前。作成されたインスタンスはこのイメージに基づいて、後でDockerコンテナを実行するために使用されます。このパラメータが省略されると、インスタンスはDebian 10イメージに基づいて作成されます。
    * `--zone`: インスタンスがホストされる[ゾーン](https://cloud.google.com/compute/docs/regions-zones)。
    * `--tags`: インスタンスのタグ。タグは他のリソースへのインスタンスの可用性を設定するために使用されます。今回のケースでは、ポート80を開放するタグ`http-server`がインスタンスに割り当てられます。
    * `gcloud compute instances create` コマンドのすべてのパラメータは、[GCPのドキュメント](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create)で説明されています。
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances)を開いて、インスタンスがリストに表示され、**RUNNING** ステータスであることを確認します。
1. [GCPの指示](https://cloud.google.com/compute/docs/instances/ssh)に従ってSSH経由でインスタンスに接続します。
1. [適切なオペレーティングシステムの指示](https://docs.docker.com/engine/install/#server)に従って、インスタンスにDockerパッケージをインストールします。
1. Wallarm Cloudにインスタンスを接続するために使用されるWallarmノードトークンのローカル環境変数を設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. インスタンスで、フィルタリングノードの設定を含むファイル`default`を含むディレクトリを作成します。このディレクトリは、たとえば`configs`と名前付けられます。最小設定のファイルの例：

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

    [設定ファイルに指定できるフィルタリングノードディレクティブのセット →][nginx-waf-directives]
1. `docker run` コマンドを使用して、環境変数とマウントされた設定ファイルを渡してWallarmノードDockerコンテナを実行します:

    === "Wallarm USクラウド用のコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.6.2-1
        ```
    === "Wallarm EUクラウド用のコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.6.2-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: 前のステップで作成された設定ファイルへのパス。例えば、`configs`。
    * `<DIRECTORY_FOR_MOUNTING>`: 設定ファイルをマウントするためのコンテナのディレクトリ。設定ファイルは、NGINXが使用する以下のコンテナディレクトリにマウントできます：

        * `/etc/nginx/conf.d` — 全般的な設定
        * `/etc/nginx/sites-enabled` — 仮想ホストの設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは、`/etc/nginx/sites-enabled/default` ファイルに記述するべきです。
    
    * `-p`: フィルタリングノードがリッスンするポート。値はインスタンスのポートと同じであるべきです。
    * `-e`: フィルタリングノードの設定の環境変数（利用可能な変数は以下の表に記載されています）。`WALLARM_API_TOKEN`の値を明示的にパスすることは推奨されていません。

        --8<-- "../include-ja/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [フィルタリングノードの動作をテストします](#フィルタリングノードの動作のテスト)。

## フィルタリングノードの動作のテスト

1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances)を開き、**External IP**列からインスタンスのIPアドレスをコピーします。

    ![!コンテナインスタンスの設定][copy-container-ip-gcp-img]

    IPアドレスが空白の場合、インスタンスが**RUNNING**状態であることを確認してください。

2. テスト[Path Traversal][ptrav-attack-docs]攻撃をコピーしたアドレスに送信します：

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. [USクラウド](https://us1.my.wallarm.com/search)または[EUクラウド](https://my.wallarm.com/search)のWallarm Console → **Events**を開いて、攻撃がリストに表示されていることを確認します。
    ![!UI内の攻撃][attacks-in-ui-image]

コンテナのデプロイ中に発生したエラーの詳細は、**View logs**インスタンスメニューに表示されます。インスタンスが利用できない場合、必須のフィルタリングノードパラメータが正しい値でコンテナに渡されていることを確認してください。