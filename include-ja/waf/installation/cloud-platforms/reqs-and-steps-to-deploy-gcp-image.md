## 必要条件

* GCPアカウント
* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で、**Administrator**ロールを持ち二要素認証が無効化されたアカウントへのアクセス
* US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com:444`、EU Wallarm Cloudを利用する場合は`https://api.wallarm.com:444`へのアクセス．プロキシサーバー経由のみでアクセスが設定可能な場合は、[instructions][wallarm-api-via-proxy]の指示を使用してください
* 攻撃検出ルールの更新および[API仕様書][api-spec-enforcement-docs]のダウンロード、さらに[allowlisted, denylisted, or graylisted][ip-lists-docs]の国、地域、またはデータセンターの正確なIPを取得するため、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarmインスタンス上で全てのコマンドをスーパーユーザー（例：`root`）として実行すること

## 1. フィルタリングノードインスタンスの起動

### Google Cloud UIを使用してインスタンスを起動

Google Cloud UIを使用してフィルタリングノードインスタンスを起動するには、[Google Cloud Marketplace上のWallarm nodeイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックしてください．

インスタンスはあらかじめフィルタリングノードがインストールされた状態で起動します．Google Cloudにおけるインスタンスの起動方法の詳細については、[公式Google Cloud Platformのドキュメント][link-launch-instance]をご参照ください．

### Terraform等を使用してインスタンスを起動

Terraformなどのツールを使用してWallarm GCPイメージを利用しフィルタリングノードインスタンスを起動する場合、Terraform設定にこのイメージの名前を指定する必要があることがあります．

* イメージ名は次のフォーマットです:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン5.xでインスタンスを起動する場合、以下のイメージ名を使用してください:

    ```bash
    wallarm-node-195710/wallarm-node-5-3-20250129-150255
    ```

イメージ名を取得するには、次の手順に従うこともできます:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします．
2. 次のパラメータと共に[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)コマンドを実行します:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-5-2-*'" --no-standard-images
    ```
3. 最新の利用可能なイメージの名前からバージョン値をコピーし、そのコピーした値を指定のイメージ名フォーマットに貼り付けます．例えば、フィルタリングノードバージョン4.10のイメージは、次の名前になります:

    ```bash
    wallarm-node-195710/wallarm-node-5-3-20250129-150255
    ```

## 2. フィルタリングノードインスタンスの設定

起動したフィルタリングノードインスタンスを設定するには、次の手順に従ってください:

1. メニューの**Compute Engine**セクションにある**VM instances**ページに移動します．
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします．
3. **Firewalls**設定内の該当するチェックボックスをオンにすることで、必要な受信トラフィックの種類を許可します．
4. 必要に応じて、プロジェクトSSHキーを用いた接続を制限し、このインスタンスへの接続にはカスタムSSHキーペアを使用することができます．この操作を行うには、以下の手順に従ってください:
    1. **SSH Keys**設定で**Block project-wide**チェックボックスにチェックを入れます．
    2. **SSH Keys**設定内の**Show and edit**ボタンをクリックし、SSHキーを入力するフィールドを展開します．
    3. 公開SSHキーと秘密SSHキーのペアを生成します．例えば、`ssh-keygen`や`PuTTYgen`ユーティリティを使用できます．
       
        ![PuTTYgenを使用したSSHキー生成][img-ssh-key-generation]

    4. 使用したキージェネレーターのインターフェイスからOpenSSHフォーマットの公開キーをコピーし（本例では、生成された公開キーはPuTTYgenインターフェイスの**Public key for pasting into OpenSSH authorized_keys file**領域からコピーします）、それを**Enter entire key data**ヒントが表示されるフィールドに貼り付けます．
    5. 秘密キーを保存してください．今後、設定済みインスタンスへの接続に必要となります．
5. ページ下部の**Save**ボタンをクリックして変更を適用します． 

## 3. SSHを使用してフィルタリングノードインスタンスに接続

インスタンスへの接続方法の詳細情報については、こちらの[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご参照ください．

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. インスタンスをWallarm Cloudに接続するためのトークンを生成

ローカルのWallarmフィルタリングノードは、[適切なタイプ][wallarm-token-types]のWallarmトークンを使用してWallarm Cloudに接続する必要があります．APIトークンを使用するとWallarm Console UI内でノードグループを作成でき、ノードインスタンスを効果的に整理するのに役立ちます．

![グループ化されたノード][img-grouped-nodes]

以下の手順でトークンを生成してください:

=== "APIトークン"

    1. Wallarm Console → **Settings** → **API tokens**ページを[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます．
    1. `Deploy`ソースロールを持つAPIトークンを探すか作成します．
    1. このトークンをコピーします．
=== "ノードトークン"

    1. Wallarm Console → **Nodes**ページを[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます．
    1. 以下のいずれかの操作を行います: 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします．
        * 既存のノードグループを使用する場合は、ノードのメニューの**Copy token**からトークンをコピーします．