[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[mount-config-instr]:               #deploying-the-wallarm-node-docker-container-configured-through-the-mounted-file
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.ja.md
[graylist-docs]:                    ../../../user-guides/ip-lists/graylist.ja.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.ja.md
[application-configuration]:        ../../../user-guides/settings/applications.ja.md
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.ja.md

# Wallarm の GCP へのノード Docker イメージの展開

[NGINX ベースの Wallarm ノードの Docker イメージ](https://hub.docker.com/r/wallarm/node) を [Google Compute Engine（GCE）コンポーネント](https://cloud.google.com/compute) を使用して Google Cloud Platform に展開する手順を説明する迅速なガイドです。

!!! warning "インストラクションの制限"
    これらの手順は、ロードバランシングとノードの自動スケーリングの設定はカバーしていません。これらのコンポーネントを自分で設定する場合は、適切な [GCP ドキュメント](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling) を参照することをお勧めします。

## 要件

* アクティブな GCP アカウント
* [作成された GCP プロジェクト](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [Compute Engine API が有効](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d)
* [インストールおよび設定された Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/quickstart)
* Wallarm Console の [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) で **管理者** 役割を持つアカウントへのアクセス

## Wallarm ノード Docker コンテナ設定のオプション

--8<-- "../include/waf/installation/docker-running-options.ja.md"

## 環境変数を通じて設定された Wallarm ノード Docker コンテナの展開

環境変数のみを通じて設定されたコンテナ化された Wallarm フィルタリングノードをデプロイするには、 [GCP コンソールまたは gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers) を使用できます。この手順では、gcloud CLI を使用します。

1. Wallarm Console → [US クラウド](https://us1.my.wallarm.com/nodes)または[EU クラウド](https://my.wallarm.com/nodes)の**ノード**を開き、「**Wallarm ノード**」タイプのノードを作成します。

    ![!Wallarm ノードの作成](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. Wallarm Cloud にインスタンスを接続するために使用される Wallarm ノードトークンのローカル環境変数を設定します。

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) コマンドを使用して、実行中の Docker コンテナを持つインスタンスを作成します。

    === "Wallarm US クラウド用コマンド"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:4.4.5-1
        ```
    === "Wallarm EU クラウド用コマンド"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:4.4.5-1
        ```

    * `<INSTANCE_NAME>`: インスタンスの名前。例：`wallarm-node`。
    * `--zone`: インスタンスをホストする[ゾーン](https://cloud.google.com/compute/docs/regions-zones)。
    * `--tags`: インスタンスタグ。タグは、インスタンスが他のリソースに利用可能かどうかを設定するために使用されます。この場合、ポート80を開くタグ `http-server` がインスタンスに割り当てられています。
    * `--container-image`: フィルタリングノードの Docker イメージへのリンク。
    * `--container-env`: フィルタリングノードの設定を持つ環境変数（使用可能な変数は下の表にリストされています）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨されていません。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.ja.md"

    * `gcloud compute instances create-with-container` コマンドのすべてのパラメーターは、[GCP ドキュメント](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container)で説明されています。
1. [GCP コンソール → **Compute Engine** → VM インスタンス](https://console.cloud.google.com/compute/instances) を開き、インスタンスがリストに表示されることを確認します。
1. [フィルタリングノードの動作をテストします](#testing-the-filtering-node-operation)。## マウントされたファイルを介して設定されたWallarmノードDockerコンテナのデプロイ

環境変数とマウントされたファイルを介して設定されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、インスタンスを作成し、このインスタンスのファイルシステムにフィルタリングノードの設定ファイルを配置し、このインスタンスでDockerコンテナを起動する必要があります。これらの手順は、[GCPコンソールまたはgcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers) を使用して行うことができます。これらの手順では、gcloud CLIが使用されます。

1. Wallarmコンソールを開く → [US Cloud](https://us1.my.wallarm.com/nodes) または [EU Cloud](https://my.wallarm.com/nodes) の **Nodes** で、**Wallarm node** タイプのノードを作成します。

    ![!Wallarmノードの作成](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) コマンドを使って、Compute Engineレジストリの任意のオペレーティングシステムイメージに基づくインスタンスを作成します：

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: インスタンスの名前。
    * `--image`: Compute Engine レジストリのオペレーティングシステムイメージの名前。このイメージを元に作成されたインスタンスは、後で Docker コンテナを実行するために使用されます。このパラメータを省略すると、インスタンスは Debian 10 イメージに基づいて作成されます。
    * `--zone`: インスタンスをホストする[ゾーン](https://cloud.google.com/compute/docs/regions-zones)。
    * `--tags`: インスタンスタグ。タグは、インスタンスを他のリソースに利用可能にするかどうかを設定するために使用されます。この場合、ポート80を開放するタグ `http-server` がインスタンスに割り当てられます。
    * `gcloud compute instances create` コマンドのすべてのパラメータは、[GCP のドキュメント](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create)で説明されています。
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) を開き、インスタンスがリストに表示され、**RUNNING** ステータスであることを確認します。
1. [GCPの手順](https://cloud.google.com/compute/docs/instances/ssh) に従って、SSH経由でインスタンスに接続します。
1. インスタンスにDockerパッケージを[適切なオペレーティングシステム用の手順](https://docs.docker.com/engine/install/#server)に従ってインストールします。
1. Wallarm Cloudにインスタンスを接続するために使用されるWallarmノードトークンのローカル環境変数を設定します：

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. インスタンスで、フィルタリングノードの設定ファイル（例えば、ディレクトリ名を `configs` にすることができます）のディレクトリを作成します。最小の設定を持つファイルの例:

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

    [設定ファイルで指定できるフィルタリングノードディレクティブのセット →](../../../admin-en/configure-parameters-en.ja.md)
1. 環境変数とマウントされた設定ファイルを渡して `docker run` コマンドを使用して Wallarm ノード Docker コンテナを実行します:

    === "Wallarm USクラウドのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.4.5-1
        ```
    === "Wallarm EUクラウドのコマンド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.4.5-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: 前の手順で作成された設定ファイルへのパス。例えば、`configs`。
    * `<DIRECTORY_FOR_MOUNTING>`: 設定ファイルをマウントするためのコンテナのディレクトリ。設定ファイルは、以下のNGINXで使用されるコンテナディレクトリにマウントできます:

        * `/etc/nginx/conf.d` — 一般的な設定
        * `/etc/nginx/sites-enabled` — 仮想ホストの設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは、`/etc/nginx/sites-enabled/default`ファイルに記述する必要があります。
    
    * `-p`: フィルタリングノードがリッスンするポート。値はインスタンスポートと同じでなければなりません。
    * `-e`: フィルタリングノードの設定を持つ環境変数（利用可能な変数は下の表にリストされています）。`WALLARM_API_TOKEN` の値を明示的に渡すことはお勧めしません。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.ja.md"
1. [フィルタリングノードの動作をテストする](#フィルタリングノードの動作をテストする)。

## フィルタリングノードの動作をテストする

1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) を開き、**External IP**列からインスタンスのIPアドレスをコピーします。

    ![!コンテナインスタンスの設定](../../../images/waf-installation/gcp/container-copy-ip.png)

    IPアドレスが空の場合、インスタンスが **RUNNING** ステータスであることを確認してください。

2. コピーしたアドレスにテスト [Path Traversal](../../../attacks-vulns-list.ja.md#path-traversal) 攻撃を含むリクエストを送信します：

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console → [US Cloud](https://us1.my.wallarm.com/search) または [EU Cloud](https://my.wallarm.com/search) の **Events** を開いて、攻撃がリストに表示されていることを確認します。
    ![!UIの攻撃](../../../images/admin-guides/test-attacks-quickstart.png)

コンテナのデプロイ中に発生したエラーの詳細は、**View logs** インスタンスメニューに表示されます。インスタンスが利用できない場合、コンテナに正しい値の必要なフィルタリングノードパラメータが渡されていることを確認してください。