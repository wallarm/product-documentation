[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# クラウドノードイメージのアップグレード

この手順では、AWSまたはGCPでデプロイされた4.xのクラウドノードイメージを4.4にアップグレードする方法を説明しています。

サポート期限切れのノード（3.6以下）をアップグレードする場合は、[別の手順](older-versions/cloud-image.md)を使用してください。

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-4.0.md"

## ステップ 1: フィルタリングノード 4.4 を使用した新しいインスタンスの起動

1. クラウドプラットフォームのマーケットプレイスで Wallarm フィルタリングノードイメージを開き、イメージの起動に進みます。
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. 起動ステップで、以下の設定を行います:

      * 画像バージョン `4.4.x` を選択
      * AWS の場合、**Security Group Settings**フィールドで[作成されたセキュリティグループ](../admin-en/installation-ami-en.md#3-create-a-security-group)を選択
      * AWS の場合、**Key Pair Settings**フィールドで[作成されたキーペアの名前](../admin-en/installation-ami-en.md#2-create-a-pair-of-ssh-keys)を選択
3. インスタンスの起動を確認します。
4. GCP の場合、[手順](../admin-en/installation-gcp-en.md#3-configure-the-filtering-node-instance)に従ってインスタンスを設定します。

## Step 2: フィルタリングノードを Wallarm クラウドに接続する

1. SSH を使用してフィルタリングノードインスタンスに接続します。インスタンスへの接続方法に関する詳細な手順は、クラウドプラットフォームのドキュメントで利用可能です。
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. 新しい Wallarm ノードを作成し、生成されたトークンを使用して Wallarm クラウドに接続します。これは、クラウドプラットフォームの指示に従って行われます。
      * [AWS](../admin-en/installation-ami-en.md#6-connect-the-filtering-node-to-wallarm-cloud)
      * [GCP](../admin-en/installation-gcp-en.md#5-connect-the-filtering-node-to-wallarm-cloud)

## Step 3: 以前のバージョンから新しいバージョンへのフィルタリングノードの設定をコピーする

以前の Wallarm ノードバージョンの以下の設定ファイルから、フィルタリングノード 4.4 のファイルにリクエストの処理およびプロキシ設定をコピーします。

* `/etc/nginx/nginx.conf` および NGINX 設定のその他のファイル
* `/etc/nginx/conf.d/wallarm.conf` でのグローバルフィルタリングノード設定
* `/etc/nginx/conf.d/wallarm-status.conf` でのフィルタリングノード監視サービス設定
* `/etc/environment` の環境変数
* `/etc/default/wallarm-tarantool` のタランチュール設定
* 他のリクエストの処理およびプロキシ設定をしたカスタム設定ファイル

NGINX 設定ファイルの使用に関する詳細情報は、[公式の NGINX ドキュメント](https://nginx.org/docs/beginners_guide.html)で利用可能です。

フィルタリングノードディレクティブの一覧は[こちら](../admin-en/configure-parameters-en.md)で利用できます。

## ステップ 4: NGINX を再起動する

設定を適用するためにNGINXを再起動します。

```bash
sudo systemctl restart nginx
```

## ステップ 5: Wallarm ノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## Step 6: AWS または GCP でフィルタリングノード 4.4 を元にした仮想マシンイメージを作成する

フィルタリングノード 4.4 を元にした仮想マシンイメージを作成するには、[AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) または [GCP](../admin-en/installation-guides/google-cloud/create-image.md) の手順に従ってください。

## Step 7: 以前の Wallarm ノードインスタンスを削除する

新しいフィルタリングノードバージョンが正常に設定およびテストされた場合、AWS または GCP 管理コンソールを使用して、以前のフィルタリングノードバージョンを持つインスタンスおよび仮想マシンイメージを削除してください。