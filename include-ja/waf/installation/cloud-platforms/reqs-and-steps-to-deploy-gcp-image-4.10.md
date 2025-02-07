```markdown
## 要件

* GCPアカウント
* Wallarm Consoleで[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)を使用する際に、2段階認証が無効になっている**Administrator**ロールを持つアカウントへのアクセス
* US Wallarm Cloudで作業するためは`https://us1.api.wallarm.com:444`、EU Wallarm Cloudで作業するためは`https://api.wallarm.com:444`へのアクセス。もしアクセスがプロキシサーバ経由でのみ構成可能な場合は、[この手順][wallarm-api-via-proxy]を使用してください
* 攻撃検知ルールおよび[API仕様書][api-spec-enforcement-docs]の更新をダウンロードするため、また[ホワイトリスト、ブラックリスト、またはグレイリスト][ip-lists-docs]にある国、地域、データセンターの正確なIPアドレスを取得するために、下記のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarmのインスタンス上で全てのコマンドをスーパーユーザー（例：`root`）として実行

## 1. フィルタリングノードインスタンスの起動

### Google Cloud UI経由でインスタンスを起動

Google Cloud UI経由でフィルタリングノードインスタンスを起動するには、[Google Cloud Marketplace上のWallarmノードイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックしてください。

このインスタンスはあらかじめフィルタリングノードがインストールされた状態で起動します。Google Cloudでのインスタンス起動に関する詳細情報については、[公式Google Cloud Platformドキュメント][link-launch-instance]をご参照ください。

### Terraformやその他ツールを使用してインスタンスを起動

Terraformのようなツールを使用してWallarm GCPイメージを利用してフィルタリングノードインスタンスを起動する場合、Terraformの設定内でこのイメージ名を指定する必要があります。

* イメージ名は以下の形式になります:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン4.10でインスタンスを起動するには、以下のイメージ名を使用してください:

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

イメージ名を取得するには、以下の手順もご利用いただけます:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストール
2. 以下のパラメータを使用して[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)コマンドを実行

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-10-*'" --no-standard-images
    ```
3. 利用可能な最新イメージの名前からバージョンの値をコピーし、その値を先に示したイメージ名フォーマットに貼り付けます。たとえば、フィルタリングノードバージョン4.10のイメージは以下の名前となります:

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

## 2. フィルタリングノードインスタンスの設定

起動したフィルタリングノードインスタンスを設定するには、以下の操作を実行してください:

1. メニューの**Compute Engine**セクション内の**VM instances**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. **Firewalls**設定内で、必要な種類の着信トラフィックを許可するために、該当するチェックボックスにチェックを入れます。
4. 必要に応じて、プロジェクトSSHキーを使用してインスタンスへの接続を制限し、このインスタンスに接続するためにカスタムSSHキーペアを利用できます。これを行うには、以下の操作を実行してください:
    1. **SSH Keys**設定内の**Block project-wide**チェックボックスにチェックを入れます。
    2. **SSH Keys**設定内の**Show and edit**ボタンをクリックし、SSHキーを入力するためのフィールドを展開します。
    3. 公開SSHキーと秘密SSHキーのペアを生成します。たとえば、`ssh-keygen`や`PuTTYgen`ユーティリティを使用できます。
       
        ![PuTTYgenを使用してSSHキーを生成][img-ssh-key-generation]

    4. 使用しているキー生成ツールのインターフェースからOpenSSH形式の公開キーをコピーし（本例では、PuTTYgenインターフェースの**Public key for pasting into OpenSSH authorized_keys file**エリアからコピーします）、**Enter entire key data**のヒントが表示されているフィールドに貼り付けます。
    5. 秘密キーを保存します。これは将来、設定されたインスタンスに接続する際に必要になります。
5. ページ下部にある**Save**ボタンをクリックし、変更を適用します。

## 3. SSH経由でフィルタリングノードインスタンスに接続

インスタンスへの接続方法の詳細情報については、こちらの[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご参照ください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Wallarm Cloudにインスタンスを接続するためのトークン生成

ローカルのWallarmフィルタリングノードは、Wallarm Cloudと接続するために適切な種類のWallarmトークンを使用する必要があります。[API token][wallarm-token-types]を使うと、Wallarm Console UI内でノードグループを作成でき、ノードインスタンスの効果的な管理に役立ちます。

![グループ化されたノード][img-grouped-nodes]

トークンは以下の手順で生成します:

=== "APIトークン"

    1. Wallarm Console → **Settings** → **API tokens**を開き、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)にアクセスします。
    2. `Deploy`ソースロールのAPIトークンを見つけるか、生成します。
    3. このトークンをコピーします。
=== "ノードトークン"

    1. Wallarm Console → **Nodes**を開き、[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)にアクセスします。
    2. 次のいずれかの操作を行います:
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用し、ノードのメニューから**Copy token**を選択してトークンをコピーします。
```