[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[mount-config-instr]:               #deploying-the-wallarm-node-docker-container-configured-through-the-mounted-file
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/graylist.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md

# WallarmノードDockerイメージをAzureにデプロイ

このクイックガイドでは、[Azure **Container Instances** サービス](https://docs.microsoft.com/ja-jp/azure/container-instances/)を使用して、[DockerイメージであるNGINXベースのWallarmノード](https://hub.docker.com/r/wallarm/node) を Microsoft Azure クラウドプラットフォームにデプロイする手順を提供します。

!!! warning "注意事項"
    この手順は、ロードバランシングとノードの自動スケールの設定には対応していません。これらのコンポーネントを独自に設定する場合は、[Azure Application Gateway](https://docs.microsoft.com/ja-jp/azure/application-gateway/overview)に関するドキュメントを参照してください。

## 要件

* アクティブなAzureサブスクリプション
* [Azure CLIがインストールされている](https://docs.microsoft.com/ja-jp/cli/azure/install-azure-cli)
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/) のWallarm Consoleで**管理者**ロールのアカウントへのアクセス

## WallarmノードDockerコンテナ設定のオプション

--8<-- "../include-ja/waf/installation/docker-running-options.md"

## 環境変数で設定されたWallarmノードDockerコンテナをデプロイする

環境変数だけで設定されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、次のツールを使用できます。

* [Azure CLI](https://docs.microsoft.com/ja-jp/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/ja-jp/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/ja-jp/azure/container-instances/container-instances-quickstart-powershell)
* [ARM template](https://docs.microsoft.com/ja-jp/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/ja-jp/azure/container-instances/quickstart-docker-cli)

これらの手順では、Azure CLIを使用してコンテナをデプロイします。

1. [US Cloud](https://us1.my.wallarm.com/nodes) または [EU Cloud](https://my.wallarm.com/nodes) の Wallarm Console → **Nodes** を開き、**Wallarm node** タイプのノードを作成します。

    ![!Wallarmノードの作成](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたtokenをコピーします。
1. [`az login`](https://docs.microsoft.com/ja-jp/cli/azure/reference-index?view=azure-cli-latest#az_login) コマンドを使用して Azure CLI にサインインします。

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/ja-jp/cli/azure/group?view=azure-cli-latest#az_group_create) コマンドを使用してリソースグループを作成します。例えば、次のコマンドでEast USリージョンに `myResourceGroup` を作成します。

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Wallarmノードトークンを使ってインスタンスを Wallarm Cloud に接続するために使用するローカル環境変数を設定します。

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/ja-jp/cli/azure/container?view=azure-cli-latest#az_container_create) コマンドを使用して、WallarmノードDockerコンテナからAzureリソースを作成します。

    === "米国のWallarmに対するコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name waf-node \
            --dns-name-label wallarm-waf \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.4.5-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com'
         ```
    === "欧州のWallarmに対するコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name waf-node \
            --dns-name-label wallarm-waf \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.4.5-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com'
         ```
        
    * `--resource-group`: 2つめの手順で作成したリソースグループの名前です。
    * `--name`: コンテナの名前です。
    * `--dns-name-label`: コンテナのDNS名ラベルです。
    * `--ports`: フィルタリングノードがリッスンするポートです。
    * `--image`: WallarmノードDockerイメージの名前です。
    * `--environment-variables`: フィルタリングノードの設定に使用される環境変数（使用可能な変数は下の表に記載されています）。ただし、 `WALLARM_API_TOKEN` の値は明示的に渡すことはお勧めしません。

        --8<-- "../include-ja/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Azureポータル](https://portal.azure.com/)を開き、作成したリソースがリソースリストに表示されることを確認します。
1. [フィルタリングノードの動作をテスト](#testing-the-filtering-node-operation).## マウントされたファイルを介して設定されたWallarmノードDockerコンテナーの展開

環境変数およびマウントされたファイルを介して設定されたコンテナ化されたWallarmフィルタリングノードを展開するには、[Azure CLI](https://docs.microsoft.com/ja-jp/cli/azure/install-azure-cli)のみ使用できます。

環境変数とマウントされた設定ファイルでコンテナを展開するには：

1. Wallarm Console → **Nodes** を開き、[米国クラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)で **Wallarmノード** タイプのノードを作成します。

   ![!Wallarmノードの作成](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. [`az login`](https://docs.microsoft.com/ja-jp/cli/azure/reference-index?view=azure-cli-latest#az_login)コマンドを使用してAzure CLIにサインインします。

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/ja-jp/cli/azure/group?view=azure-cli-latest#az_group_create)コマンドを使用してリソースグループを作成します。例えば、以下のコマンドで東部米国リージョンに `myResourceGroup` という名前のグループを作成します。

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. フィルタリングノードの設定を持つローカルの設定ファイルを作成します。最小限の設定を持つファイルの例：

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
                proxy_pass http://例.com;
                include proxy_params;
        }
    }
    ```

    [設定ファイルで指定できるフィルタリングノードディレクティブのセット →](../../../admin-en/configure-parameters-en.md)
1. Azureでデータボリュームをマウントするために適している方法のいずれかで設定ファイルを配置します。すべての方法は[Azureドキュメントの**データボリュームのマウント**セクション](https://docs.microsoft.com/ja-jp/azure/container-instances/container-instances-volume-azure-files)に説明されています。

    この手順では、構成ファイルはGitリポジトリからマウントされます。
1. Wallarm Cloudにインスタンスを接続するために使用されるWallarmノードトークンのローカル環境変数を設定します。

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/ja-jp/cli/azure/container?view=azure-cli-latest#az_container_create)コマンドを使用して、WallarmノードDockerコンテナからAzureリソースを作成します。

    === "Wallarm US Cloud のコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name waf-node \
            --dns-name-label wallarm-waf \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.4.5-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com'
         ```
    === "Wallarm EU Cloudのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name waf-node \
            --dns-name-label wallarm-waf \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.4.5-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN}
         ```

    * `--resource-group`：ステップ2で作成したリソースグループの名前。
    * `--name`：コンテナの名前。
    * `--dns-name-label`：コンテナのDNS名ラベル。
    * `--ports`：フィルタリングノードがリッスンするポート。
    * `--image`：WallarmノードDockerイメージの名前。
    * `--gitrepo-url`：設定ファイルを含むGitリポジトリのURL。ファイルがリポジトリルートにある場合は、このパラメータのみを渡す必要があります。ファイルがGitリポジトリの別のディレクトリにある場合、`--gitrepo-dir`パラメータもディレクトリへのパスを指定して渡してください（例：<br>`--gitrepo-dir ./dir1`）。
    * `--gitrepo-mount-path`：設定ファイルをマウントするコンテナのディレクトリ。設定ファイルは、NGINXで使用される以下のコンテナディレクトリにマウントできます。

        * `/etc/nginx/conf.d` — 一般設定
        * `/etc/nginx/sites-enabled` — 仮想ホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードディレクティブは `/etc/nginx/sites-enabled/default` ファイルに記述されるべきです。

    * `--environment-variables`：フィルタリングノードおよびWallarm Cloud接続の設定を含む環境変数（利用可能な変数は以下の表に記載されています）。`WALLARM_API_TOKEN`の値を明示的に渡すことはお勧めしません。

        --8<-- "../include-ja/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Azureポータル](https://portal.azure.com/)を開き、作成されたリソースがリソースのリストに表示されることを確認します。
1. [フィルタリングノードの動作をテストします](#フィルタリングノードの動作のテスト)。

## フィルタリングノードの動作のテスト

1. Azureポータルで作成されたリソースを開き、**FQDN** の値をコピーします。

   ![!コンテナインスタンスのセットアップ](../../../images/waf-installation/azure/container-copy-domain-name.png)

   **FQDN** フィールドが空の場合は、コンテナが **Running** ステータスであることを確認してください。

2. コピーしたドメインにテスト[Path Traversal](../../../attacks-vulns-list.md#path-traversal)攻撃を含むリクエストを送信します。
   
    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. [US Cloud](https://us1.my.wallarm.com/search) または [EU Cloud](https://my.wallarm.com/search) の Wallarm Console →**イベント** を開き、攻撃がリストに表示されていることを確認します。
    ![!UIの攻撃](../../../images/admin-guides/test-attacks-quickstart.png)

コンテナの展開中に発生したエラーの詳細は、Azureポータルのリソース詳細の**コンテナ** → **ログ**タブに表示されます。リソースが利用できない場合は、コンテナに必要なフィルタリングノードパラメーターと正しい値が渡されていることを確認してください。