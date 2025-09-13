## 要件

* GCPアカウント
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* USのWallarm Cloudで作業するための`https://us1.api.wallarm.com:444`へのアクセス、またはEUのWallarm Cloudで作業するための`https://api.wallarm.com:444`へのアクセス。アクセスをプロキシサーバー経由でのみ構成できる場合は、[手順][wallarm-api-via-proxy]を使用します
* 攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、さらに[Allowlist、Denylist、Graylist][ip-lists-docs]に登録した国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"
* すべてのコマンドをWallarmインスタンス上でスーパーユーザー（例：`root`）として実行します

## 1. フィルタリングノードインスタンスを起動する

### Google Cloud UIからインスタンスを起動する

Google Cloud UIからフィルタリングノードインスタンスを起動するには、[Google Cloud MarketplaceのWallarm nodeイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックします。

このインスタンスはフィルタリングノードがプリインストールされた状態で起動します。Google Cloudでのインスタンス起動に関する詳細は、[公式のGoogle Cloud Platformドキュメント][link-launch-instance]をご覧ください。

### Terraformやその他のツールでインスタンスを起動する

TerraformなどのツールでWallarmのGCPイメージを使用してフィルタリングノードインスタンスを起動する場合、Terraformの構成でこのイメージ名を指定する必要があります。

* イメージ名の形式は次のとおりです：

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードのバージョン5.xでインスタンスを起動するには、次のイメージ名を使用します。

    ```bash
    wallarm-node-195710/wallarm-node-6-4-0-20250730-083353
    ```

イメージ名を取得するには、次の手順を実行することもできます。

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 次のパラメータで[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)コマンドを実行します。

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-6-4-*'" --no-standard-images
    ```
3. 利用可能な最新のイメージ名からバージョン値をコピーし、提供されたイメージ名の形式に貼り付けます。例として、フィルタリングノードのバージョン4.10のイメージは次の名前になります。

    ```bash
    wallarm-node-195710/wallarm-node-6-4-0-20250730-083353
    ```

## 2. フィルタリングノードインスタンスを構成する

起動済みのフィルタリングノードインスタンスを構成するには、次の操作を実行します。

1. メニューの**Compute Engine**セクションにある**VM instances**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. **Firewalls**設定で該当するチェックボックスをオンにして、必要な種類の受信トラフィックを許可します。
4. 必要に応じて、プロジェクトのSSHキーによるこのインスタンスへの接続を制限し、このインスタンスへの接続にカスタムのSSH鍵ペアを使用できます。これを行うには、次の操作を実行します。
    1. **SSH Keys**設定で**Block project-wide**チェックボックスをオンにします。
    2. **SSH Keys**設定で**Show and edit**ボタンをクリックし、SSH鍵を入力するフィールドを展開します。
    3. SSHの公開鍵と秘密鍵のペアを生成します。たとえば、`ssh-keygen`やPuTTYgenユーティリティを使用できます。
       
        ![PuTTYgenを使用したSSH鍵の生成][img-ssh-key-generation]

    4. 使用している鍵生成ツールのインターフェイスからOpenSSH形式の公開鍵をコピーし（この例では、PuTTYgenのインターフェイス上の「Public key for pasting into OpenSSH authorized_keys file」エリアから生成された公開鍵をコピーします）、ヒントが「Enter entire key data」と表示されているフィールドに貼り付けます。
    5. 秘密鍵を保存します。これは、今後この構成済みインスタンスに接続する際に必要です。
5. ページ下部の**Save**ボタンをクリックして、変更を適用します。 

## 3. SSHでフィルタリングノードインスタンスに接続する

インスタンスへの接続方法の詳細は、次の[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご覧ください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. インスタンスをWallarm Cloudに接続するためのトークンを生成する

ローカルのWallarmフィルタリングノードは、適切な種類のWallarmトークンを使用してWallarm Cloudに接続する必要があります。API tokenを使用すると、Wallarm Console UIでnode groupを作成でき、ノードインスタンスを効果的に整理できます。

![グループ化されたノード][img-grouped-nodes]

トークンは次の手順で生成します。

=== "APIトークン"

    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)でWallarm Console → Settings → API tokensを開きます。
    1. 使用タイプが`Node deployment/Deployment`のAPI tokenを見つけるか作成します。
    1. このトークンをコピーします。
=== "ノードトークン"

    1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)でWallarm Console → Nodesを開きます。
    1. 次のいずれかを実行します。 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のnode groupを使用する場合は、ノードのメニュー → **Copy token**でトークンをコピーします。