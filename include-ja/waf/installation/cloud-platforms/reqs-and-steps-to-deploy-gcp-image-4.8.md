```markdown
## 要件

* GCPアカウント
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleにおいて**Administrator**ロールでのアクセスが可能であり、2段階認証が無効になっているアカウントへのアクセス
* US Wallarm Cloudを使用する場合は`https://us1.api.wallarm.com:444`に、EU Wallarm Cloudを使用する場合は`https://api.wallarm.com:444`にアクセスできること。もしアクセスがプロキシサーバー経由でのみ構成できる場合は、[instructions][wallarm-api-via-proxy]を使用してください
* Wallarmインスタンスで全てのコマンドをスーパーユーザー（例: `root`）として実行すること

## 1. フィルタリングノードインスタンスの起動

### Google Cloud UI経由でインスタンスを起動する

Google Cloud UI経由でフィルタリングノードインスタンスを起動するには、[Google Cloud Marketplace上のWallarmノードイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックしてください。

インスタンスは、あらかじめインストールされたフィルタリングノードと共に起動します。Google Cloudでのインスタンス起動の詳細情報については、[公式Google Cloud Platformドキュメント][link-launch-instance]をご参照ください。

### Terraform等のツールを使用してインスタンスを起動する

Wallarm GCPイメージを使用してTerraform等のツール経由でフィルタリングノードインスタンスを起動する際は、Terraformの構成内にこのイメージ名を指定する必要があります。

* イメージ名は以下の形式です:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン4.8でインスタンスを起動するには、以下のイメージ名を使用してください:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

イメージ名を取得するには、以下の手順も実行できます:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 以下のパラメータを指定してコマンド[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)を実行します:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-8-*'" --no-standard-images
    ```
3. 利用可能な最新イメージの名前からバージョン値をコピーし、提供されたイメージ名の形式に貼り付けます。例えば、フィルタリングノードバージョン4.8のイメージは以下の名前になります:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

## 2. フィルタリングノードインスタンスの設定

起動したフィルタリングノードインスタンスを設定するために、次の操作を実行してください:

1. メニューのCompute Engineセクション内の**VMインスタンス**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. **Firewalls**設定内の該当するチェックボックスをオンにして、必要な着信トラフィックのタイプを許可します。
4. 必要に応じて、プロジェクトSSHキーでの接続を制限し、このインスタンスへの接続にカスタムSSHキーのペアを使用することができます。これを実行するには、次の操作を行ってください:
    1. **SSH Keys**設定内の**Block project-wide**チェックボックスをオンにします。
    2. **SSH Keys**設定内の**Show and edit**ボタンをクリックして、SSHキー入力用フィールドを展開します。
    3. 公開鍵と秘密鍵のSSHキーのペアを生成します。例えば、`ssh-keygen`や`PuTTYgen`ユーティリティを使用できます。
       
        ![Generating SSH keys using PuTTYgen][img-ssh-key-generation]

    4. 使用したキー生成ツールのインターフェースからOpenSSH形式の公開鍵をコピーし、**Enter entire key data**ヒントが表示されているフィールドに貼り付けます（この例では、生成された公開鍵をPuTTYgenインターフェースの**Public key for pasting into OpenSSH authorized_keys file**領域からコピーしてください）。
    5. 秘密鍵を保存します。将来、設定したインスタンスへの接続に必要となります。
5. ページ下部にある**Save**ボタンをクリックして変更を適用します。

## 3. SSH経由でフィルタリングノードインスタンスに接続する

インスタンスへの接続方法の詳細情報については、[こちらのリンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご参照ください.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"
```