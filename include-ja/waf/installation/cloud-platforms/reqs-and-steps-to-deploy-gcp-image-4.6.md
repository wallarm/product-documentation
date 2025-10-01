## 要件

* GCPアカウント
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* USのWallarm Cloudを使用する場合は`https://us1.api.wallarm.com:444`、EUのWallarm Cloudを使用する場合は`https://api.wallarm.com:444`へのアクセス。アクセスをプロキシサーバー経由でのみ構成できる場合は[手順][wallarm-api-via-proxy]を使用します
* Wallarmインスタンス上でスーパーユーザー（例：`root`）としてすべてのコマンドを実行すること

## 1. フィルタリングノードインスタンスの起動

### Google Cloud UIでのインスタンス起動

Google Cloud UIからフィルタリングノードインスタンスを起動するには、[Google Cloud MarketplaceのWallarm nodeイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックします。

インスタンスはフィルタリングノードがプリインストールされた状態で起動します。Google Cloudでのインスタンス起動の詳細は[公式のGoogle Cloud Platformドキュメント][link-launch-instance]を参照してください。

### Terraformやその他のツールでのインスタンス起動

TerraformなどのツールでWallarmのGCPイメージを使用してフィルタリングノードインスタンスを起動する場合、Terraformの構成でこのイメージ名を指定する必要がある場合があります。

* イメージ名の形式は次のとおりです。

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン4.6でインスタンスを起動するには、次のイメージ名を使用します。

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

イメージ名を取得するには、次の手順に従います。

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 次のパラメータで[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)コマンドを実行します。

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. 最新の利用可能なイメージの名前からバージョン値をコピーし、上記のイメージ名の形式に貼り付けます。たとえば、フィルタリングノードバージョン4.6のイメージ名は次のとおりです。

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. フィルタリングノードインスタンスの構成

起動済みのフィルタリングノードインスタンスを構成するには、次の操作を実行します。

1. メニューの**Compute Engine**セクションにある**VM instances**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. 必要な種類の受信トラフィックを許可するには、**Firewalls**設定で該当するチェックボックスをオンにします。
4. 必要に応じて、プロジェクトのSSHキーを使用したこのインスタンスへの接続を制限し、このインスタンスへの接続にカスタムのSSH鍵ペアを使用できます。これを行うには、次の操作を実行します。
    1. **SSH Keys**設定で**Block project-wide**のチェックボックスをオンにします。
    2. **SSH Keys**設定で**Show and edit**ボタンをクリックし、SSHキーを入力するフィールドを展開します。
    3. SSH公開鍵と秘密鍵のペアを生成します。たとえば、`ssh-keygen`や`PuTTYgen`ユーティリティを使用できます。
       
        ![PuTTYgenを使用したSSH鍵の生成][img-ssh-key-generation]

    4. 使用している鍵生成ツールのインターフェイスからOpenSSH形式の公開鍵をコピーし（この例では、PuTTYgenのインターフェイスにある「Public key for pasting into OpenSSH authorized_keys file」領域から生成済み公開鍵をコピーします）、**Enter entire key data**のヒントが表示されているフィールドに貼り付けます。
    5. 秘密鍵を保存します。これは、今後構成済みインスタンスに接続する際に必要です。
5. ページ下部の**Save**ボタンをクリックして、変更を適用します。 

## 3. SSHでのフィルタリングノードインスタンスへの接続

インスタンスへの接続方法の詳細は、[こちら](https://cloud.google.com/compute/docs/instances/connecting-to-instance)を参照してください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. フィルタリングノードのWallarm Cloudへの接続

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"