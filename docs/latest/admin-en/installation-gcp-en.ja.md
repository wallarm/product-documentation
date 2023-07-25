[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace
[img-ssh-key-generation]:       ../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../updating-migrating/versioning-policy.ja.md#version-list
[installation-instr-latest]:    /admin-en/installation-gcp-en/
[img-wl-console-users]:         ../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:    ../installation/supported-deployment-options.ja.md

# Google Cloud Platform（GCP）でのデプロイ

Google Cloud Platformでフィルタリングノードをデプロイするには、以下の手順を実行してください。

1. Google Cloud Platformアカウントにログインします。
2. フィルタリングノードインスタンスを起動します。
3. フィルタリングノードインスタンスを設定します。
4. SSH経由でフィルタリングノードインスタンスに接続します。
5. フィルタリングノードをWallarm Cloudに接続します。
6. プロキシサーバーを使用するためにフィルタリングノードを設定します。
7. フィルタリングおよびプロキシングルールを設定します
8. Wallarmノード用により多くのメモリを割り当てます。
9. ロギングを設定します。
10. NGINXを再起動します。

## 1. Google Cloud Platformアカウントにログインする

[console.cloud.google.com](https://console.cloud.google.com/) にログインします。

## 2. フィルタリングノードインスタンスを起動する

### Google Cloud UIを介してインスタンスを起動する

Google Cloud UIを経由してフィルタリングノードインスタンスを起動するには、[Google Cloud MarketplaceのWallarmノード画像](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) を開いて、**LAUNCH** をクリックしてください。

インスタンスは、予めフィルタリングノードがインストールされている状態で起動されます。 Google Cloudでインスタンスを起動する方法の詳細については、[公式Google Cloud Platformのドキュメント][link-launch-instance]を参照してください。

### Terraformやその他のツールを介してインスタンスを起動する

Wallarm GCP画像を使用して、Terraformなどのツールを使ってフィルタリングノードインスタンスを起動する場合は、Terraform設定でこの画像の名前を指定する必要があります。

* 画像名には以下の形式があります：

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* フィルタリングノードバージョン4.4でインスタンスを起動する場合は、以下の画像名を使用してください：

    ```bash
    wallarm-node-195710/wallarm-node-4-4-20230131-154432
    ```

画像名を取得するには、次の手順も実行できます：

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) をインストールします。
2. [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) コマンドを以下のパラメータで実行します：

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-4-*'" --no-standard-images
    ```
3. 最新の利用可能な画像の名前からバージョン値をコピーし、提供された画像名の形式にコピーした値を貼り付けます。 例えば、フィルタリングノードバージョン4.4の画像は次の名前を持ちます：

    ```bash
    wallarm-node-195710/wallarm-node-4-4-20230131-154432
    ```

## 3. フィルタリングノードインスタンスを設定する

起動したフィルタリングノードインスタンスを設定するには、以下の操作を実行します：

1. メニューの**Compute Engine**セクションの**VM instances**ページに移動します。
2. 起動したフィルタリングノードインスタンスを選択し、**Edit**ボタンをクリックします。
3. **Firewalls**設定で対応するチェックボックスにチェックを入れて、必要なタイプの受信トラフィックを許可します。
4. 必要に応じて、プロジェクトのSSHキーでインスタンスへの接続を制限し、このインスタンスへの接続用にカスタムSSHキーペアを使用できます。 これを行うには、次の操作を行います：
    1. **SSH Keys**設定で**Block project-wide**チェックボックスにチェックを入れます。
    2. **SSH Keys**設定で**Show and edit**ボタンをクリックして、SSHキーを入力するフィールドを展開します。
    3. 公開キーと秘密キーのペアを生成します。 たとえば、`ssh-keygen`および`PuTTYgen`ユーティリティを使用できます。
       
        ![！PuTTYgenを使用してSSHキーを生成する][img-ssh-key-generation]
    4. 使用したキージェネレータのインターフェイスから、OpenSSH形式で公開キーをコピーします（現在の例では、PuTTYgenインターフェイスの**Public key for pasting into OpenSSH authorized_keys file**エリアから生成された公開キーをコピーする必要があります）。そして、**Enter entire key data**ヒントが表示されるフィールドに貼り付けます。
    5. 秘密キーを保存します。 今後、設定済みのインスタンスに接続するために必要になります。
5. ページの下部にある**Save**ボタンをクリックして、変更を適用します。

## 4. SSH経由でフィルタリングノードインスタンスに接続する

インスタンスへの接続方法の詳細については、この[リンク](https://cloud.google.com/compute/docs/instances/connecting-to-instance)を参照してください。

--8<-- "../include/gcp-autoscaling-connect-ssh.ja.md"

## 5. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.0-only-with-postanalytics.ja.md"

## 6. プロキシサーバーを使用するためにフィルタリングノードを設定する

--8<-- "../include/setup-proxy.ja.md"

## 7. フィルタリングおよびプロキシングルールを設定する

--8<-- "../include/setup-filter-nginx-en-latest.ja.md"

## 8. Wallarmノード用により多くのメモリを割り当てる

Wallarmノードは、セキュリティルールの自動調整に必要なトラフィックメトリックを計算するために、オープンソースインメモリデータベースであるTarantoolを使用します。

デフォルトでは、Tarantoolに割り当てられるRAMの量は、インスタンスメモリの合計の40%です。

Tarantoolに割り当てるRAM量を変更することができます。 インスタンスのRAMをTarantoolに割り当てるには：

1. Tarantoolの設定ファイルを開きます：

    ```
    sudo vim /etc/default/wallarm-tarantool
    ```

2. `SLAB_ALLOC_ARENA`で割り当てられたRAMの量をGBで設定します。 値は整数または浮動小数点数（小数点区切り記号はドット`.`）になります。
    
    本番環境では、postanalyticsモジュールに割り当てる推奨RAM量は、サーバーメモリの合計の75%です。 Wallarmノードをテストするか、インスタンスサイズが小さい場合は、少ない量で十分です（例：メモリの合計の25％）。

    例：

    === "ノードをテストする場合"
        ```bash
        SLAB_ALLOC_ARENA=0.5
        ```
    === "本番環境にノードをデプロイする場合"
        ```bash
        SLAB_ALLOC_ARENA=24
        ```
3. 変更を適用するには、Tarantoolデーモンを再起動します：

    ```
    sudo systemctl restart wallarm-tarantool
    ```

## 9. ロギングを設定する

--8<-- "../include/installation-step-logging.ja.md"

## 10. NGINXを再起動する

以下のコマンドを実行して、NGINXを再起動します：

```bash
sudo systemctl restart nginx
```

## インストールが完了しました

インストールが完了しました。

--8<-- "../include/check-setup-installation-en.ja.md"

--8<-- "../include/filter-node-defaults.ja.md"

--8<-- "../include/installation-extra-steps.ja.md"