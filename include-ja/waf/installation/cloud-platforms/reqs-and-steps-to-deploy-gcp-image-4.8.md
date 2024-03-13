## 必要条件

* GCPアカウント
* [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)で**管理者**ロールへのアクセスとWallarmコンソールでの二要素認証が無効になっていること
* US Wallarmクラウドとの作業では `https://us1.api.wallarm.com:444` へのアクセス、EU Wallarmクラウドとの作業では `https://api.wallarm.com:444` へのアクセスが可能であること。アクセスがプロキシサーバ経由でのみ設定できる場合は、[instructions][wallarm-api-via-proxy]をお使いください
* Wallarmインスタンス上でのすべてのコマンドをスーパーユーザー（例：`root`）として実行

## 1. フィルタリングノードインスタンスの起動

### Google Cloud UIを通じてインスタンスを起動する

Google Cloud UIを通じてフィルタリングノードインスタンスを起動するには、[Google Cloud Marketplace上のWallarmノードのイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を開き、**GET STARTED**をクリックしてください。

インスタンスは、プリインストールされたフィルタリングノードで起動します。Google Cloudでのインスタンスの詳細な起動方法については、[公式Google Cloud Platformのドキュメント][link-launch-instance]をご覧ください。

### Terraformやその他のツールを通じてインスタンスを起動する

Terraformのようなツールを使用してWallarm GCPイメージを利用してフィルタリングノードインスタンスを起動する際、Terraformの設定でこのイメージの名前を提供する必要があります。

* イメージ名には次のフォーマットが使用されます：

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン4.8でインスタンスを起動する場合は、次のイメージ名を使用してください：

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

イメージ名を取得するには、以下の手順に従ってください：

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします。
2. 以下のパラメータを使用してコマンド[`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list)を実行します：

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-8-*'" --no-standard-images
    ```
3. 最新の利用可能なイメージの名前からバージョン値をコピーし、提供されたイメージ名のフォーマットにコピーした値を貼り付けます。例えば、フィルタリングノードバージョン4.8のイメージは次の名前になります：

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

## 2. フィルタリングノードインスタンスの構成

起動したフィルタリングノードインスタンスを構成するには、次の操作を行ってください：

1. メニューの**Compute Engine**セクションにある**VMインスタンス**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**編集**ボタンをクリックします。
3. **Firewalls**設定で対応するチェックボックスにチェックを入れ、必要なタイプの受信トラフィックを許可します。
4. 必要に応じて、プロジェクトのSSHキーを使ってインスタンスへの接続を制限し、カスタムSSHキーペアを使用してこのインスタンスに接続することができます。これを行うには、次の操作を行います：
    1. **SSH Keys**設定で**Block project-wide**チェックボックスにチェックを入れます。
    2. **SSH Keys**設定で**表示および編集**ボタンをクリックし、SSHキーを入力するためのフィールドを展開します。
    3. 例えば`ssh-keygen`や`PuTTYgen`ユーティリティを使って、SSHキーの公開キーと秘密キーのペアを生成します。
       
        ![PuTTYgenを使ったSSHキーの生成][img-ssh-key-generation]

    4. 使用したキージェネレータのインターフェースからOpenSSHフォーマットの公開キーをコピーします（この例では、PuTTYgenインターフェースの**OpenSSH認可キーファイルに貼り付けるための公開キー**エリアから生成された公開キーをコピーします）そして、**キーデータ全体を入力**というヒントが含まれているフィールドに貼り付けます。
    5. 私的キーを保存します。これは、将来、構成されたインスタンスに接続するために必要になります。
5. ページの下部にある**保存**ボタンをクリックして変更を適用します。

## 3. SSHを介してフィルタリングノードインスタンスに接続する

インスタンスに接続する方法に関する詳細情報については、この[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)をご覧ください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"