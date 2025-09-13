## 要件

* GCPアカウントが必要です。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス権が必要です。
* USのWallarm Cloudを使用するために`https://us1.api.wallarm.com:444`、EUのWallarm Cloudを使用するために`https://api.wallarm.com:444`へアクセスできる必要があります。アクセスがプロキシサーバー経由でのみ構成できる場合は、[手順][wallarm-api-via-proxy]に従ってください。
* 以下のIPアドレスへアクセスできる必要があります。これは、攻撃検出ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、さらに[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録された国、地域、またはデータセンターの正確なIPを取得するために必要です。

    --8<-- "../include/wallarm-cloud-ips.md"
* すべてのコマンドをスーパーユーザー（例：`root`）としてWallarmインスタンス上で実行できる必要があります。

## 1. フィルタリングノードインスタンスを起動します

### Google CloudのUIからインスタンスを起動します

Google CloudのUIからフィルタリングノードインスタンスを起動するには、[Google Cloud MarketplaceのWallarm nodeイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックしてください。

インスタンスはフィルタリングノードがプリインストールされた状態で起動します。Google Cloudでのインスタンス起動に関する詳細は、[公式Google Cloud Platformドキュメント][link-launch-instance]をご参照ください。

### Terraformまたはその他のツールでインスタンスを起動します

TerraformなどのツールでWallarmのGCPイメージを使用してフィルタリングノードインスタンスを起動する場合、Terraformの設定にこのイメージ名を指定する必要がある場合があります。

* イメージ名の形式は次のとおりです。

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードのバージョン4.10でインスタンスを起動するには、次のイメージ名を使用してください。

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

イメージ名を取得するには、次の手順でも可能です。

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 次のパラメータでコマンド[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)を実行します。

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-10-*'" --no-standard-images
    ```
3. 最新の利用可能なイメージ名からバージョンの値をコピーし、提供されているイメージ名の形式に貼り付けます。例えば、フィルタリングノードのバージョン4.10のイメージは次の名前になります。

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

## 2. フィルタリングノードインスタンスを構成します

起動したフィルタリングノードインスタンスを構成するには、次の操作を実行します。

1. メニューの**Compute Engine**セクションにある**VM instances**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. **Firewalls**設定で該当するチェックボックスにチェックを入れ、必要な種類の受信トラフィックを許可します。
4. 必要に応じて、プロジェクトのSSHキーによるこのインスタンスへの接続を制限し、このインスタンスへの接続にカスタムのSSHキーペアを使用できます。そのためには、次の操作を実行します。
    1. **SSH Keys**設定で**Block project-wide**チェックボックスにチェックを入れます。
    2. **SSH Keys**設定で**Show and edit**ボタンをクリックし、SSHキーの入力フィールドを展開します。
    3. SSHの公開鍵と秘密鍵のペアを生成します。例えば、`ssh-keygen`やPuTTYgenユーティリティを使用できます。
       
        ![PuTTYgenを使用したSSHキーの生成][img-ssh-key-generation]

    4. 使用した鍵生成ツールのインターフェイスからOpenSSH形式の公開鍵をコピーし（この例では、PuTTYgenのインターフェイスにある「Public key for pasting into OpenSSH authorized_keys file」領域から生成された公開鍵をコピーします）、「Enter entire key data」というヒントが表示されているフィールドに貼り付けます。
    5. 秘密鍵を保存します。今後、構成済みインスタンスへの接続に必要になります。
5. ページ下部の**Save**ボタンをクリックして、変更を適用します。 

## 3. SSHでフィルタリングノードインスタンスに接続します

インスタンスへの接続方法に関する詳細は、こちらの[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご参照ください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. インスタンスをWallarm Cloudに接続するトークンを生成します

ローカルのWallarmフィルタリングノードは、適切な種類のWallarmトークンを使用してWallarm Cloudに接続する必要があります。APIトークンを使用すると、Wallarm Console UIでノードグループを作成でき、ノードインスタンスを効果的に整理できます。

![グループ化されたノード][img-grouped-nodes]

トークンは次の手順で生成します。

=== "APIトークン"

    1. Wallarm Console → **Settings** → **API tokens**を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. 使用目的が`Node deployment/Deployment`のAPIトークンを見つけるか作成します。
    1. このトークンをコピーします。
=== "ノードトークン"

    1. Wallarm Console → **Nodes**を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます。
    1. 次のいずれかを実行します。 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用する - ノードのメニュー → **Copy token**を使用してトークンをコピーします。