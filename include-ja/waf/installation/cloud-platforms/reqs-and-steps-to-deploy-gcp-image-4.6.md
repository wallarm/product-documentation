```markdown
## 要件

* GCPアカウント
* Wallarm Consoleで二要素認証が無効になっている**Administrator**ロールを持つアカウントへのアクセス（[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)）
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com:444`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com:444`へのアクセス。また、アクセスがプロキシサーバー経由でのみ設定できる場合は、[instructions][wallarm-api-via-proxy]をご利用ください。
* Wallarmインスタンス上で全てのコマンドをスーパーユーザー（例：`root`）として実行してください。

## 1. フィルタリングノードインスタンスを起動する

### Google Cloud UI経由でインスタンスを起動する

Google Cloud UI経由でフィルタリングノードインスタンスを起動するには、[Google Cloud Marketplace上のWallarmノードイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックしてください。

インスタンスはあらかじめフィルタリングノードがインストールされた状態で起動されます。Google Cloudのインスタンス起動に関する詳細な情報は[公式Google Cloud Platformドキュメント][link-launch-instance]をご参照ください。

### Terraformやその他のツールによるインスタンスの起動

Terraformなどのツールを使用してWallarm GCPイメージからフィルタリングノードインスタンスを起動する場合、Terraform設定内でこのイメージの名前を指定する必要があるかもしれません。

* イメージ名は以下の形式です:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン4.6でインスタンスを起動するには、次のイメージ名を使用してください:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

また、イメージ名を取得するためには以下の手順を実行してください:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールしてください。
2. 以下のパラメーターで[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)コマンドを実行してください:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. 最新の利用可能なイメージ名からバージョンの値をコピーし、その値を指定されたイメージ名の形式に貼り付けてください。例えば、フィルタリングノードバージョン4.6のイメージは次のような名前になります:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. フィルタリングノードインスタンスを構成する

起動されたフィルタリングノードインスタンスを構成するため、以下の手順を実行してください:

1. メニューの【Compute Engine】セクションにある**VM instances**ページに移動してください。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックしてください。
3. **Firewalls**設定で該当するチェックボックスにチェックを入れて、必要な種類の着信トラフィックを許可してください。
4. 必要に応じて、プロジェクトのSSHキーでの接続を制限し、このインスタンスに接続するためにカスタムSSHキーペアを使用することができます。そのために、以下の手順を実行してください:
    1. **SSH Keys**設定で**Block project-wide**チェックボックスにチェックを入れてください。
    2. **SSH Keys**設定で**Show and edit**ボタンをクリックして、SSHキーを入力するフィールドを展開してください。
    3. 公開SSHキーと秘密SSHキーのペアを生成してください。例えば、`ssh-keygen`や`PuTTYgen`ユーティリティを使用できます。
       
        ![Generating SSH keys using PuTTYgen][img-ssh-key-generation]

    4. 使用したキー生成ツールのインターフェースからOpenSSH形式の公開鍵をコピーし、**Enter entire key data**のヒントが記載されているフィールドに貼り付けてください。（本例では、生成された公開鍵はPuTTYgenインターフェースの**Public key for pasting into OpenSSH authorized_keys file**エリアからコピーしてください。）
    5. 秘密鍵を保存してください。今後、構成されたインスタンスに接続する際に必要となります。
5. ページ下部の**Save**ボタンをクリックして変更を適用してください。

## 3. SSH経由でフィルタリングノードインスタンスに接続する

インスタンスへの接続方法に関する詳細情報については、この[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)を参照してください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"
```