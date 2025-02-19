# AzureへのWallarm Dockerイメージのデプロイ

このクイックガイドでは、[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)を[Azure **Container Instances** サービス](https://docs.microsoft.com/en-us/azure/container-instances/)を使用してMicrosoft Azureクラウドプラットフォームへデプロイする手順を示します。

!!! warning "手順の制限事項"
    これらの手順では、ロードバランシングおよびノードの自動スケーリングの設定は対象外です。これらのコンポーネントを自分で設定する場合は、[Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview)のドキュメントをお読みになることを推奨します。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## 要件

* 有効なAzureサブスクリプション
* [Azure CLI installed](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* Wallarm Consoleで二要素認証が無効化された[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)の**Administrator**ロールを持つアカウントへのアクセス
* 以下のIPアドレスへのアクセス（攻撃検知ルールおよび[API仕様][api-policy-enf-docs]の更新ダウンロード、ならびに[allowlisted, denylisted, or graylisted][graylist-docs]された国、地域、またはデータセンターの正確なIP取得のため）

    --8<-- "../include/wallarm-cloud-ips.md"

## WallarmノードDockerコンテナの構成オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数によって構成されたWallarmノードDockerコンテナのデプロイ

環境変数のみを使用して構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、次のツールを使用できます。

* [Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [ARM template](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

本手順では、Azure CLIを使用してコンテナをデプロイします。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login)コマンドを使用してAzure CLIにサインインします。

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create)コマンドを使用してリソースグループを作成します。例えば、East USリージョンに`myResourceGroup`グループを以下のコマンドで作成します。

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Wallarm Cloudへ接続するために使用するWallarmノードのトークンをローカル環境変数に設定します。

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create)コマンドを使用してWallarmノードDockerコンテナからAzureリソースを作成します。

    === "Wallarm US Cloud向けのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:5.3.0 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Wallarm EU Cloud向けのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:5.3.0 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_LABELS='group=<GROUP>'
         ```
        
    * `--resource-group`: 2番目の手順で作成したリソースグループの名前です。
    * `--name`: コンテナの名前です。
    * `--dns-name-label`: コンテナのDNSネームラベルです。
    * `--ports`: フィルタリングノードが待ち受けるポートです。
    * `--image`: WallarmノードDockerイメージの名前です。
    * `--environment-variables`: フィルタリングノードの構成を含む環境変数です（使用可能な変数は下記表に記載されています）。なお、`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨されません。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Azure portal](https://portal.azure.com/)を開き、作成されたリソースがリソース一覧に表示されていることを確認します。
1. [フィルタリングノードの動作テスト](#testing-the-filtering-node-operation)を実施します。

## マウントされたファイルによって構成されたWallarmノードDockerコンテナのデプロイ

環境変数とマウントされたファイルによって構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)のみが使用可能です。

環境変数とマウントされた構成ファイルを使用してコンテナをデプロイするには:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login)コマンドを使用してAzure CLIにサインインします。

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create)コマンドを使用してリソースグループを作成します。例えば、East USリージョンに`myResourceGroup`グループを以下のコマンドで作成します。

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. ローカルでフィルタリングノードの設定を記述した構成ファイルを作成します。最低限の設定例として、以下のようなファイルを作成します。

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
1. Azureでのデータボリュームのマウントに適した方法のいずれかで構成ファイルを配置します。すべての方法は、[Azureドキュメントの**Mount data volumes**セクション](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files)に記載されています。

    本手順では、Gitリポジトリから構成ファイルをマウントします。
1. Wallarm Cloudへ接続するために使用するWallarmノードのトークンをローカル環境変数に設定します。

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create)コマンドを使用してWallarmノードDockerコンテナからAzureリソースを作成します。

    === "Wallarm US Cloud向けのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:5.3.0 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Wallarm EU Cloud向けのコマンド"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:5.3.0 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_LABELS='group=<GROUP>'
         ```

    * `--resource-group`: 2番目の手順で作成したリソースグループの名前です。
    * `--name`: コンテナの名前です。
    * `--dns-name-label`: コンテナのDNSネームラベルです。
    * `--ports`: フィルタリングノードが待ち受けるポートです。
    * `--image`: WallarmノードDockerイメージの名前です。
    * `--gitrepo-url`: 構成ファイルを含むGitリポジトリのURLです。ファイルがリポジトリのルートにある場合は、このパラメータのみを渡します。ファイルが別のディレクトリにある場合は、`--gitrepo-dir`パラメータにディレクトリパスも渡して下さい（例：<br>`--gitrepo-dir ./dir1`）。
    * `--gitrepo-mount-path`: 構成ファイルをマウントするコンテナ内のディレクトリです。構成ファイルは、NGINXが使用する以下のディレクトリにマウントできます:

        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/sites-enabled` — 仮想ホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードディレクティブは、`/etc/nginx/sites-enabled/default`ファイルに記述してください。
    
    * `--environment-variables`: フィルタリングノードおよびWallarm Cloud接続の設定を含む環境変数です（使用可能な変数は下記表に記載されています）。なお、`WALLARM_API_TOKEN`の値を明示的に渡すことは推奨されません。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Azure portal](https://portal.azure.com/)を開き、作成されたリソースがリソース一覧に表示されていることを確認します。
1. [フィルタリングノードの動作テスト](#testing-the-filtering-node-operation)を実施します。

## フィルタリングノードの動作テスト

1. Azure portalで作成されたリソースを開き、**FQDN**の値をコピーします。

    ![Settig up container instance][copy-container-ip-azure-img]

    **FQDN**フィールドが空の場合は、コンテナが**Running**ステータスであることを確認して下さい。

2. コピーしたドメインに対して、テスト[Path Traversal][ptrav-attack-docs]攻撃のリクエストを送信します:

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. Wallarm Consoleで、[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**を開き、攻撃が一覧に表示されていることを確認します。
    ![Attacks in UI][attacks-in-ui-image]

コンテナのデプロイ中に発生したエラーの詳細は、Azure portalのリソース詳細内の**Containers** → **Logs**タブに表示されます。リソースが利用できない場合は、必要なフィルタリングノードパラメータが正しい値でコンテナに渡されているか確認して下さい。