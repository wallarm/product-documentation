## 要件

* GCPアカウント
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com:444`、またはEU Wallarm Cloudで作業するための`https://api.wallarm.com:444`へのアクセス。アクセスをプロキシサーバー経由でのみ構成できる場合は、[手順][wallarm-api-via-proxy]を使用します
* 以下のIPアドレスへのアクセス。これは、攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録した国、地域、またはデータセンターの正確なIPを取得するために必要です

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarmインスタンス上でスーパーユーザー（例：`root`）としてすべてのコマンドを実行できること

## 1. フィルタリングノードインスタンスの起動

### Google Cloud UI経由でのインスタンス起動

Google Cloud UI経由でフィルタリングノードインスタンスを起動するには、[Google Cloud MarketplaceのWallarm node image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックします。

インスタンスは、フィルタリングノードが事前インストールされた状態で起動します。Google Cloudでのインスタンス起動の詳細については、[公式のGoogle Cloud Platformドキュメント][link-launch-instance]をご覧ください。

### Terraformなどのツール経由でのインスタンス起動

WallarmのGCPイメージを使用してTerraformなどのツールでフィルタリングノードインスタンスを起動する場合、Terraform構成でこのイメージ名を指定する必要がある場合があります。

* イメージ名の形式は次のとおりです。

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードのバージョン5.xでインスタンスを起動するには、次のイメージ名を使用します。

    ```bash
    wallarm-node-195710/wallarm-node-5-3-15-20250605-140709
    ```

イメージ名は、次の手順でも取得できます。

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 次のパラメータでコマンド[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)を実行します。

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-5-3-*'" --no-standard-images
    ```
3. 利用可能な最新のイメージ名からバージョン値をコピーし、提示したイメージ名の形式に貼り付けます。たとえば、フィルタリングノードのバージョン4.10のイメージは次の名前になります。

    ```bash
    wallarm-node-195710/wallarm-node-5-3-15-20250605-140709
    ```

## 2. フィルタリングノードインスタンスの設定

起動したフィルタリングノードインスタンスを設定するには、次の操作を実行します。

1. メニューの**Compute Engine**セクションにある**VM instances**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. **Firewalls**設定で該当するチェックボックスをオンにして、必要な種類の受信トラフィックを許可します。
4. 必要に応じて、プロジェクトのSSHキーによるこのインスタンスへの接続を制限し、このインスタンスへの接続にカスタムのSSHキーペアを使用できます。これを行うには、次の操作を実行します。
    1. **SSH Keys**設定で**Block project-wide**チェックボックスをオンにします。
    2. **SSH Keys**設定で**Show and edit**ボタンをクリックし、SSHキーを入力するフィールドを展開します。
    3. 公開鍵と秘密鍵のSSHキーペアを生成します。たとえば、`ssh-keygen`や`PuTTYgen`ユーティリティを使用できます。
       
        ![PuTTYgenを使用したSSHキーの生成][img-ssh-key-generation]

    4. 使用している鍵生成ツールのインターフェースからOpenSSH形式の公開鍵をコピーし（この例では、PuTTYgenインターフェースの**Public key for pasting into OpenSSH authorized_keys file**領域から生成された公開鍵をコピーします）、ヒント**Enter entire key data**が表示されているフィールドに貼り付けます。
    5. 秘密鍵を保存します。これは、今後この設定済みインスタンスに接続する際に必要になります。
5. ページ下部の**Save**ボタンをクリックして変更を適用します。 

## 3. SSH経由でフィルタリングノードインスタンスに接続

インスタンスへの接続方法の詳細については、こちらの[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご覧ください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. インスタンスをWallarm Cloudに接続するトークンの生成

ローカルのWallarmフィルタリングノードは、適切な種類のWallarmトークンを使用してWallarm Cloudに接続する必要があります。APIトークンを使用すると、Wallarm Console UIでノードグループを作成でき、ノードインスタンスを効果的に整理できます。

![グループ化されたノード][img-grouped-nodes]

トークンは次の手順で生成します。

=== "APIトークン"

    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のWallarm Console → **Settings** → **API tokens**を開きます。
    1. 使用タイプが`Node deployment/Deployment`のAPIトークンを見つけるか作成します。
    1. このトークンをコピーします。
=== "ノードトークン"

    1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**を開きます。
    1. 次のいずれかを実行します: 
        * タイプが**Wallarm node**のノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用する場合は、ノードのメニュー → **Copy token**を使用してトークンをコピーします。