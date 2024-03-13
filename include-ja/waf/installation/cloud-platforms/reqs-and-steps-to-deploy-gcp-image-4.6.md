## 必要条件

* GCPアカウント
* [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)向けWallarmコンソールで**管理者**ロールが付与され、二要素認証が無効にされているアカウントへのアクセス
* US Wallarmクラウドと連携するためには`https://us1.api.wallarm.com:444`へのアクセス、またはEU Wallarmクラウドと連携するためには`https://api.wallarm.com:444`へのアクセスが必要です。アクセスがプロキシサーバー経由でのみ設定可能である場合は、[instructions][wallarm-api-via-proxy]を使用してください
* Wallarmインスタンス上でのすべてのコマンドをスーパーユーザー（例：`root`）として実行

## 1. フィルタリングノードインスタンスの起動

### Google CloudのUIを介してインスタンスを起動する

Google CloudのUIを介してフィルタリングノードインスタンスを起動するには、[Google Cloud Marketplace上のWallarmノードイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**開始**をクリックしてください。

インスタンスは、プリインストールされたフィルタリングノードと共に起動します。Google Cloudでインスタンスを起動する手順の詳細については、[公式Google Cloud Platformのドキュメント][link-launch-instance]に進んでください。

### Terraformまたはその他のツールを介してインスタンスを起動する

Terraformのようなツールを使用してWallarm GCPイメージを使用してフィルタリングノードインスタンスを起動する場合、Terraformの設定でこのイメージの名前を提供する必要があります。

* イメージ名は以下のフォーマットを持ちます：

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードのバージョン4.6でインスタンスを起動する場合、以下のイメージ名を使用してください：

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

イメージ名を取得するには、次の手順に従ってください：

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 次のパラメータを持つコマンド[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)を実行します：

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. 最新の利用可能なイメージの名前からバージョンの値をコピーし、提供されたイメージ名フォーマットにコピーした値を貼り付けます。例えば、フィルタリングノードバージョン4.6のイメージは次の名前を持っています：

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. フィルタリングノードインスタンスの設定

起動したフィルタリングノードインスタンスを設定するために、以下の操作を実行します：

1.  メニューの**Compute Engine**セクションにある**VMインスタンス**ページに移動します。
2.  起動されたフィルタリングノードインスタンスを選択し、**編集**ボタンをクリックします。
3.  **Firewalls**設定で、対応するチェックボックスにチェックを入れることで必要なタイプの着信トラフィックを許可します。
4.  必要に応じて、プロジェクトSSHキーでのインスタンスへの接続を制限し、このインスタンスに接続するためにカスタムSSHキーペアを使用することができます。これを行うには、以下の操作を実行します：
    1.  **SSH Keys**設定の**Block project-wide**チェックボックスにチェックを入れます。
    2.  **SSH Keys**設定の**Show and edit**ボタンをクリックして、SSHキーを入力するためのフィールドを展開します。
    3.  たとえば、`ssh-keygen`や`PuTTYgen`ユーティリティを使用して、公開キーと秘密キーのペアを生成します。
       
        ![PuTTYgenを使用したSSHキーの生成][img-ssh-key-generation]

    4.  使用したキージェネレータのインターフェースからOpenSSH形式の公開キーをコピー（現在の例では、生成された公開キーをPuTTYgenインターフェイスの**OpenSSH authorized_keysファイルに貼り付けるための公開キー**エリアからコピーする必要がある）し、**Enter entire key data**のヒントが含まれるフィールドに貼り付けます。
    5.  私的なキーを保存します。これは将来、設定されたインスタンスに接続するために必要になります。
5.  ページの下部にある**保存**ボタンをクリックして、変更を適用します。

## 3. SSH経由でフィルタリングノードインスタンスに接続

インスタンスに接続する方法についての詳細情報は、この[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)に進んでください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. フィルタリングノードをWallarmクラウドに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"