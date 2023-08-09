## 前提条件

* GCPアカウント
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**管理者**ロールと二要素認証が無効になっているアカウントへのアクセス
* US Wallarm Cloudでの作業の場合は`https://us1.api.wallarm.com:444`への、EU Wallarm Cloudでの作業の場合は`https://api.wallarm.com:444`へのアクセス。プロキシサーバー経由でのみアクセスが可能な場合は、[この手順][wallarm-api-via-proxy]を使用してください。
* スーパーユーザー（例：`root`）としてWallarmインスタンス上で全てのコマンドを実行すること

## 1. フィルタリングノードインスタンスを開始する

### Google Cloud UI経由でインスタンスを開始する

Google Cloud UI 経由でフィルタリングノードインスタンスを開始するには、[Google Cloud MarketplaceのWallarmノードイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**LAUNCH**をクリックしてください。

事前にフィルタリングノードがインストールされたインスタンスが開始されます。Google Cloudでインスタンスを開始する詳細については、[公式Google Cloud Platformドキュメンテーション][link-launch-instance]をご覧ください。

### Terraformなどのツールを使用してインスタンスを開始する

Terraformのようなツールを使用して、Wallarm GCPイメージを使用してフィルタリングノードインスタンスを開始する場合、Terraformの設定にこのイメージの名前を提供する必要があるかもしれません。

* イメージ名は以下の形式になります：

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードのバージョン4.6でインスタンスを開始する場合は、以下のイメージ名を使用してください：

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

イメージ名を取得するには、以下の手順に従ってください：

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 以下のパラメータで[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)コマンドを実行します：

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. 利用可能な最新のイメージの名前からバージョン値をコピーし、提供されたイメージ名形式に貼り付けます。例えば、フィルタリングノードのバージョン4.6のイメージは以下の名前になります：

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. フィルタリングノードインスタンスの設定

開始したフィルタリングノードインスタンスを設定するために、以下の操作を行います：

1. メニューの**Compute Engine**セクションにある**VMインスタンス**ページに移動します。
2. 開始したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. **Firewalls**設定で対応するチェックボックスをチェックすることにより、必要なタイプの受信トラフィックを許可します。
4. 必要に応じて、プロジェクトのSSHキーでインスタンスに接続することを制限し、このインスタンスに接続するためにカスタムSSHキーペアを使用することができます。これを行うには、以下の操作を実行します：
   1. **SSH Keys**設定の**Block project-wide**チェックボックスをチェックします。
   2. **SSH Keys**設定の**Show and edit**ボタンをクリックして、SSHキーを入力するフィールドを拡張します。
   3. 公開キーと秘密キーのペアを生成します。例えば、`ssh-keygen`や`PuTTYgen`のようなユーティリティを使用することができます。

        ![!PuTTYgenを使用してSSHキーを生成する][img-ssh-key-generation]

   4. 使用したキージェネレータのインターフェイスからOpenSSH形式の公開キーをコピー（この例では、生成した公開キーはPuTTYgenインターフェイスの**Public key for pasting into OpenSSH authorized_keys file**エリアからコピーする）し、**Enter entire key data**のヒントが表示されるフィールドに貼り付けます。
   5. 秘密キーを保存します。これは将来、設定されたインスタンスに接続するために必要となります。
5. ページの下部にある**Save**ボタンをクリックして変更を適用します。

## 3. SSH経由でフィルタリングノードインスタンスに接続する

インスタンスへの接続方法の詳細については、[このリンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご覧ください。

--8<-- "../include-ja/gcp-autoscaling-connect-ssh.md"

## 4. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include-ja/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"
