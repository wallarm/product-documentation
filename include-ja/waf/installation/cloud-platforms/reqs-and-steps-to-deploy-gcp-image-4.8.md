## 要件

* GCPアカウント
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)向けのWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com:444`へのアクセス、またはEU Wallarm Cloudで作業するための`https://api.wallarm.com:444`へのアクセス。アクセスをプロキシサーバー経由でしか構成できない場合は、[手順][wallarm-api-via-proxy]に従います
* すべてのコマンドはスーパーユーザー（例: `root`）としてWallarmインスタンス上で実行します

## 1. フィルタリングノードインスタンスを起動する

### Google Cloud UIでインスタンスを起動する

Google Cloud UIでフィルタリングノードインスタンスを起動するには、[Google Cloud MarketplaceのWallarm nodeイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックします。

インスタンスはフィルタリングノードがプリインストールされた状態で起動します。Google Cloudでのインスタンス起動に関する詳細情報は、[公式Google Cloud Platformドキュメント][link-launch-instance]を参照します。

### Terraformまたは他のツールでインスタンスを起動する

Wallarm GCPイメージを使用してフィルタリングノードインスタンスを起動する際にTerraformなどのツールを使用する場合、Terraformの設定でこのイメージの名前を指定する必要がある場合があります。

* イメージ名は次の形式です:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン4.8でインスタンスを起動するには、次のイメージ名を使用します:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

イメージ名を取得するには、次の手順に従うこともできます:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 次のパラメータでコマンド[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)を実行します:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-8-*'" --no-standard-images
    ```
3. 利用可能な最新のイメージ名からバージョン値をコピーし、提供されたイメージ名の形式に貼り付けます。例えば、フィルタリングノードバージョン4.8のイメージ名は次のようになります:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

## 2. フィルタリングノードインスタンスを設定する

起動したフィルタリングノードインスタンスを設定するには、次の操作を実行します:

1. メニューの**Compute Engine**セクションにある**VM instances**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. 必要な種類の受信トラフィックを許可するには、**Firewalls**設定で該当するチェックボックスをオンにします。
4. 必要に応じて、プロジェクトのSSHキーでこのインスタンスへの接続を制限し、このインスタンスへの接続にカスタムSSHキーのペアを使用できます。これを行うには、次の操作を実行します:
    1. **SSH Keys**設定で**Block project-wide**チェックボックスをオンにします。
    2. **SSH Keys**設定の**Show and edit**ボタンをクリックして、SSHキーを入力するフィールドを展開します。
    3. 公開鍵と秘密鍵のSSHキーのペアを生成します。例えば、`ssh-keygen`や`PuTTYgen`ユーティリティを使用できます。
       
        ![PuTTYgenを使用したSSH鍵の生成][img-ssh-key-generation]

    4. 使用している鍵生成ツールのインターフェースからOpenSSH形式の公開鍵をコピーし（この例では、PuTTYgenのインターフェースの**Public key for pasting into OpenSSH authorized_keys file**エリアから生成された公開鍵をコピーします）、**Enter entire key data**ヒントが表示されているフィールドに貼り付けます。
    5. 秘密鍵を保存します。これは今後、構成したインスタンスへの接続に必要です。
5. ページ下部の**Save**ボタンをクリックして変更を適用します。 

## 3. SSHでフィルタリングノードインスタンスに接続する

インスタンスへの接続方法の詳細は、この[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)を参照します。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"