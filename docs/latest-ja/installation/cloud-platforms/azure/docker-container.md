# AzureへのWallarm Dockerイメージのデプロイ

このクイックガイドでは、[Azure **Container Instances** サービス](https://docs.microsoft.com/en-us/azure/container-instances/)を使用して、Microsoft Azureクラウドプラットフォームに[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)をデプロイする手順を提供します。

!!! warning "手順の制限"
    これらの手順は、負荷分散とノードの自動スケーリングの設定をカバーしていません。これらのコンポーネントを自分で設定する場合は、[Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview)のドキュメンテーションをお読みください。

## 必要条件

* アクティブなAzureサブスクリプション
* [Azure CLIがインストールされている](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* Wallarm Consoleの[USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)における**管理者**ロールのアカウントへのアクセス

## WallarmノードのDockerコンテナ設定のオプション

--8<-- "../include-ja/waf/installation/docker-running-options.md"

## 環境変数を通じて設定したWallarmノードのDockerコンテナのデプロイ

環境変数のみを通じて設定したコンテナ化されたWallarmフィルタリングノードをデプロイするには、以下のツールを使用することができます。

* [Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [ARMテンプレート](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

これらの手順では、Azure CLIを使用してコンテナをデプロイします。

--8<-- "../include-ja/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login)コマンドを使用してAzure CLIにサインインします：

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) コマンドを使ってリソースグループを作成します。たとえば、以下のコマンドで東部米国地域に`myResourceGroup`というグループを作成します：

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Wallarm Cloudに接続するために使用するWallarmノードトークンでローカル環境変数を設定します：

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) コマンドを使用して、WallarmノードのDockerコンテナからAzureリソースを作成します：

    === "Wallarm US Cloudを対象としたコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.6.2-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com'
         ```
    === "Wallarm EU Cloudを対象としたコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.6.2-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com'
         ```
        
    * `--resource-group`: 2つ目のステップで作成したリソースグループの名前。
    * `--name`: コンテナの名前。
    * `--dns-name-label`: コンテナのDNS名ラベル。
    * `--ports`: フィルタリングノードが待ち受けるポート。
    * `--image`: WallarmノードDockerイメージの名前。
    * `--environment-variables`: フィルタリングノードの設定およびWallarm Cloudへの接続を含む環境変数（利用可能な変数は以下のテーブルに記載されています）。なお、`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨されていません。

        --8<-- "../include-ja/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Azureポータル](https://portal.azure.com/)を開き、作成したリソースがリソースの一覧に表示されていることを確認します。
1. [フィルタリングノードの動作テスト](#testing-the-filtering-node-operation)を行います。

## マウントファイルを通じて設定したWallarmノードのDockerコンテナのデプロイ

環境変数とマウントファイルを通じて設定したコンテナ化されたWallarmフィルタリングノードをデプロイするには、[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)のみを使用できます。

環境変数とマウント設定ファイルでコンテナをデプロイするには：

--8<-- "../include-ja/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login)コマンドを使用してAzure CLIにサインインします：
   
    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) コマンドを使ってリソースグループを作成します。たとえば、以下のコマンドで東部米国地域に`myResourceGroup`というグループを作成します：

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. フィルタリングノードの設定を含む設定ファイルをローカルに作成します。最小限の設定を含むファイルの例：

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

    [設定ファイル内で指定できるフィルタリングノードディレクティブのセット →][nginx-waf-directives]
1. Azureでデータボリュームをマウントするために適した方法の一つで設定ファイルを配置します。すべての方法は[Azure documentationの**Mount data volumes**セクション](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files)に記述されています。

    これらの手順では、設定ファイルはGitリポジトリからマウントされます。
1. Wallarm Cloudに接続するために使用するWallarmノードトークンでローカル環境変数を設定します：

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) コマンドを使用して、WallarmノードのDockerコンテナからAzureリソースを作成します：

    === "Wallarm US Cloudを対象としたコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.6.2-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com'
         ```
    === "Wallarm EU Cloudを対象としたコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.6.2-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN}
         ```

    * `--resource-group`: 2つ目のステップで作成したリソースグループの名前。
    * `--name`: コンテナの名前。
    * `--dns-name-label`: コンテナのDNS名ラベル。
    * `--ports`: フィルタリングノードが待ち受けるポート。
    * `--image`: WallarmノードDockerイメージの名前。
    * `--gitrepo-url`: 設定ファイルが含まれるGitリポジトリのURL。ファイルがリポジトリのルートにある場合は、このパラメーターのみを渡す必要があります。ファイルがGitリポジトリの別のディレクトリにある場合は、`--gitrepo-dir`パラメーターにディレクトリへのパスも渡してください（例：`--gitrepo-dir ./dir1`）。
    * `--gitrepo-mount-path`: 設定ファイルをマウントするコンテナのディレクトリ。設定ファイルはNGINXが使用する次のコンテナディレクトリにマウントできます：

        * `/etc/nginx/conf.d` — 一般的な設定
        * `/etc/nginx/sites-enabled` — バーチャルホストの設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは `/etc/nginx/sites-enabled/default` ファイルに記述するべきです。
    
    * `--environment-variables`: フィルタリングノードとWallarm Cloud接続の設定を含む環境変数（利用可能な変数は以下のテーブルに記載されています）。なお、`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨されていません。
    
        --8<-- "../include-ja/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Azureポータル](https://portal.azure.com/)を開き、作成したリソースがリソースの一覧に表示されていることを確認します。
1. [フィルタリングノードの操作テスト](#testing-the-filtering-node-operation)を行います。

## フィルタリングノードの操作テスト

1. Azureポータル上で作成したリソースを開き、**FQDN**の値をコピーします。

    ![Settig up container instance][copy-container-ip-azure-img]

    **FQDN**フィールドが空の場合、コンテナが**Running**状態にあることを確認してください。

2. テスト用の[Path Traversal][ptrav-attack-docs]攻撃リクエストをコピーしたドメインに送信します：

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. [US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)のWallarm Console → **Events**を開き、攻撃がリストに表示されていることを確認します。
    ![Attacks in UI][attacks-in-ui-image]

コンテナデプロイ中に発生したエラーの詳細は、Azureポータルのリソース詳細の**Containers** → **Logs**タブに表示されます。リソースが利用できない場合は、必要なフィルタリングノードのパラメーターとその正しい値がコンテナに渡されていることを確認してください。