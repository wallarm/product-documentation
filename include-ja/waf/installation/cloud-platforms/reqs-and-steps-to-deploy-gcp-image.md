## 前提条件

* GCPアカウント
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で、**管理者**ロールと2要素認証が無効化されているアカウントへのアクセス
* US Wallarm Cloudと連携するための `https://us1.api.wallarm.com:444`のアクセス権またはEU Wallarm Cloudと連携するための `https://api.wallarm.com:444`へのアクセス。アクセスはプロキシサーバー経由でのみ設定できる場合、[この手順][wallarm-api-via-proxy]を使用します。
* Wallarmのインスタンス上で全てのコマンドをスーパーユーザー（例：`root`）として実行

## 1. フィルターノードのインスタンスを起動する

### Google Cloud UIを介してインスタンスを起動する

Google Cloud UIを介してフィルター ノードのインスタンスを起動するには、[Google Cloud MarketplaceのWallarm node image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、** LAUNCH **をクリックしてください。

このインスタンスはフィルタリングノードが事前インストールされて起動します。Google Cloudでインスタンスを起動する詳細情報については、[公式Google Cloud Platformドキュメンテーション][link-launch-instance]に進んで確認してください。

### Terraformまたは他のツールを介してインスタンスを起動する

WallarmのGCPイメージを使用してTerraformなどのツールからフィルタリング ノードを起動する場合、Terraformの設定にこのイメージの名前を提供する必要があります。

* 画像名は次の形式に従います：

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン4.6でインスタンスを起動するには、次の画像名を使用してください：

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

画像名を取得するには、次の手順を参照してください：

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールする。
2. 次のパラメータで[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)コマンドを実行します：

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. 利用可能な最新のイメージの名前からバージョン値をコピーし、提供されたイメージ名の形式に貼り付けます。例えば、フィルタリングノードバージョン4.6の画像は以下の名前になります：

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. フィルタリング ノードの設定

起動したフィルタリングノードのインスタンスを設定するための以下の操作を行います：

1.  メニューの **Compute Engine** セクションにある **VM instances** ページに移動します。
2.  起動したフィルタリング ノードのインスタンスを選択し、**編集** ボタンをクリックします。
3.  **Firewalls** 設定で対応するチェックボックスをチェックすることで、必要なタイプの着信トラフィックを許可します。
4.  必要に応じて、プロジェクトのSSHキーでインスタンスに接続することを制限し、このインスタンスに接続するためにカスタムSSHキーペアを使用することができます。これには、以下の操作を行います：
    1.  **SSH Keys** 設定で **Block project-wide** チェックボックスをチェックします。
    2.  SSHキーを入力するためのフィールドを拡張するために、 **SSH Keys** 設定で **Show and edit** ボタンをクリックします。
    3.  公開キーと秘密キーのペアを生成します。例えば、 `ssh-keygen` と `PuTTYgen` のユーティリティを使用することができます。
       
        ![!PuTTYgenを使用してSSHキーを生成する][img-ssh-key-generation]

    4.  使用したキージェネレータのインターフェースからOpenSSH形式の公開キーをコピーします（現在の例では、生成された公開キーはPuTTYgenインターフェースの **Public key for pasting into OpenSSH authorized_keys file** エリアからコピーする必要があります）し、"**Enter entire key data**"のヒントがあるフィールドにペーストします。
    5.  秘密キーを保存します。これは、今後設定したインスタンスに接続するために必要になります。
5.  ページ下部の **Save** ボタンをクリックして変更を適用します。 

## 3. SSHを使用してフィルタリングノードのインスタンスに接続する

インスタンスへの接続方法の詳細情報については、[このリンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご覧ください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"