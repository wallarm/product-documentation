# AzureへのWallarm Dockerイメージのデプロイ

このクイックガイドでは、[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)を[Azure **Container Instances**サービス](https://docs.microsoft.com/en-us/azure/container-instances/)を使用してMicrosoft Azureクラウドプラットフォームにデプロイする手順を説明します。

!!! warning "この手順の制限事項"
    本手順には負荷分散およびノードの自動スケーリングの設定は含まれていません。これらのコンポーネントを自身で設定する場合は、[Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview)のドキュメントを参照することをおすすめします。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## 前提条件

* 有効なAzureサブスクリプション
* [Azure CLIがインストールされていること](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* 攻撃検出ルールや[API仕様][api-policy-enf-docs]の更新をダウンロードし、さらに[allowlisted、denylisted、graylisted][graylist-docs]の国・地域・データセンターの正確なIPを取得するために、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"

## WallarmノードDockerコンテナーの構成オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数で構成されたWallarmノードDockerコンテナーのデプロイ

環境変数のみで構成されたコンテナ化Wallarmフィルタリングノードをデプロイするには、以下のツールを使用できます:

* [Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [ARMテンプレート](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

本手順では、Azure CLIを使用してコンテナーをデプロイします。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login)コマンドでAzure CLIにサインインします:

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create)コマンドでリソースグループを作成します。例えば、以下のコマンドでEast USリージョンに`myResourceGroup`グループを作成します:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. インスタンスをWallarm Cloudに接続するために使用するWallarmノードトークンをローカル環境変数に設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create)コマンドを使用して、WallarmノードDockerコンテナーからAzureリソースを作成します:

    === "Wallarm US Cloud向けのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.4.1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Wallarm EU Cloud向けのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.4.1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_LABELS='group=<GROUP>'
         ```
        
    * `--resource-group`: 2番目の手順で作成したリソースグループ名。
    * `--name`: コンテナー名。
    * `--dns-name-label`: コンテナーのDNS名ラベル。
    * `--ports`: フィルタリングノードが待ち受けるポート。
    * `--image`: WallarmノードDockerイメージ名。
    * `--environment-variables`: フィルタリングノードの構成を含む環境変数（利用可能な変数は以下の表に記載しています）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨しません。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Azure portal](https://portal.azure.com/)を開き、作成したリソースがリソース一覧に表示されていることを確認します。
1. [フィルタリングノードの動作をテスト](#testing-the-filtering-node-operation)します。

## マウントしたファイルで構成されたWallarmノードDockerコンテナーのデプロイ

環境変数とマウントしたファイルで構成されたコンテナ化Wallarmフィルタリングノードをデプロイするには、[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)のみを使用できます。

環境変数とマウント済みの構成ファイルを使ってコンテナーをデプロイするには:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login)コマンドでAzure CLIにサインインします:

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create)コマンドでリソースグループを作成します。例えば、以下のコマンドでEast USリージョンに`myResourceGroup`グループを作成します:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. フィルタリングノードの設定を記述した構成ファイルをローカルに作成します。最小設定の例:

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

    [構成ファイルに指定できるフィルタリングノードディレクティブの一覧→][nginx-waf-directives]
1. Azureでデータボリュームをマウントするのに適したいずれかの方法で構成ファイルを配置します。すべての方法はAzureドキュメントの[**データボリュームのマウント**セクション](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files)に記載されています。

    本手順では、構成ファイルをGitリポジトリからマウントします。
1. インスタンスをWallarm Cloudに接続するために使用するWallarmノードトークンをローカル環境変数に設定します:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create)コマンドを使用して、WallarmノードDockerコンテナーからAzureリソースを作成します:

    === "Wallarm US Cloud向けのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.4.1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/http.d \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Wallarm EU Cloud向けのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.4.1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/http.d \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_LABELS='group=<GROUP>'
         ```

    * `--resource-group`: 2番目の手順で作成したリソースグループ名。
    * `--name`: コンテナー名。
    * `--dns-name-label`: コンテナーのDNS名ラベル。
    * `--ports`: フィルタリングノードが待ち受けるポート。
    * `--image`: WallarmノードDockerイメージ名。
    * `--gitrepo-url`: 構成ファイルを含むGitリポジトリのURL。ファイルがリポジトリのルートにある場合はこのパラメータのみを渡します。ファイルがGitリポジトリ内の別ディレクトリにある場合は、`--gitrepo-dir`パラメータにディレクトリへのパスも渡してください（例:<br>`--gitrepo-dir ./dir1`）。
    * `--gitrepo-mount-path`: 構成ファイルをマウントするコンテナー内のディレクトリ。構成ファイルは、NGINXが使用する次のコンテナーディレクトリにマウントできます:

        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/http.d` — 仮想ホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは`/etc/nginx/http.d/default.conf`ファイルに記述します。
    
    * `--environment-variables`: フィルタリングノードおよびWallarm Cloud接続の設定を含む環境変数（利用可能な変数は以下の表に記載しています）。`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨しません。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Azure portal](https://portal.azure.com/)を開き、作成したリソースがリソース一覧に表示されていることを確認します。
1. [フィルタリングノードの動作をテスト](#testing-the-filtering-node-operation)します。

## フィルタリングノードの動作テスト {#testing-the-filtering-node-operation}

1. Azure portalで作成済みリソースを開き、**FQDN**の値をコピーします。

    ![コンテナーインスタンスの設定][copy-container-ip-azure-img]

    **FQDN**フィールドが空の場合は、コンテナーが**Running**ステータスであることを確認してください。

2. コピーしたドメインにテスト用の[Path Traversal][ptrav-attack-docs]攻撃を含むリクエストを送信します:

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. Wallarm Console → **Attacks**を[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃が一覧に表示されていることを確認します。
    ![UIのAttacks][attacks-in-ui-image]
1. 任意で、ノードの他の動作も[テスト][link-docs-check-operation]します。

コンテナーのデプロイ中に発生したエラーの詳細は、Azure portalのリソース詳細の**Containers** → **Logs**タブに表示されます。リソースにアクセスできない場合は、必要なフィルタリングノードのパラメーターが正しい値でコンテナーに渡されていることを確認してください。