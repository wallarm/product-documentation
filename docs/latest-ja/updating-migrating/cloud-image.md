[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md
[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md

# クラウドノードイメージのアップグレード

この手順では、AWSまたはGCPにデプロイされたクラウドノードイメージを最新の6.xにアップグレードする方法を説明します。

サポート終了ノード（3.6以下）をアップグレードするには、[別の手順](older-versions/cloud-image.md)を使用してください。

## 要件

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## 手順1：フィルタリングノード6.xを搭載した新しいインスタンスを起動します

1. クラウドプラットフォームのマーケットプレイスでWallarmフィルタリングノードのイメージを開き、イメージの起動に進みます。
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. 起動時に、以下の設定を行います。

      * イメージのバージョン`6.x.x`を選択します
      * AWSの場合、フィールド**Security Group Settings**で、[作成済みのセキュリティグループ](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group)を選択します
      * AWSの場合、フィールド**Key Pair Settings**で、[作成済みのキーペアの名前](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws)を選択します
3. インスタンスの起動を確定します。
4. GCPの場合は、これらの[手順](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance)に従ってインスタンスを構成します。

## 手順2：フィルタリングノードをWallarm Cloudに接続します

1. SSHでフィルタリングノードのインスタンスに接続します。インスタンスへの接続に関する詳細な手順は、各クラウドプラットフォームのドキュメントにあります。
      * [AWSドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCPドキュメント](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. 新しいWallarmノードを作成し、生成されたトークンを使用してWallarm Cloudに接続します。手順はクラウドプラットフォームごとに以下を参照してください。
      * [AWS](../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-filtering-node-to-the-wallarm-cloud)

## 手順3：前のバージョンから新しいバージョンへフィルタリングノードの設定をコピーします

前のWallarmノードバージョンの以下の設定ファイルから、リクエストの処理およびプロキシの設定をフィルタリングノード6.xのファイルへコピーします。

* `/etc/nginx/nginx.conf` およびその他のNGINXの設定ファイル
* フィルタリングノードの監視サービスの設定を含む `/etc/nginx/wallarm-status.conf`（または`/etc/nginx/conf.d/wallarm-status.conf`）
* 環境変数の設定を含む `/etc/environment`
* リクエストの処理やプロキシに関するその他のカスタム設定ファイル（例：`/etc/nginx/sites-available/default`）

NGINXの設定ファイルに関する詳細情報は、[公式NGINXドキュメント](https://nginx.org/docs/beginners_guide.html)にあります。

フィルタリングノードのディレクティブ一覧は[こちら](../admin-en/configure-parameters-en.md)です。

## 手順4：NGINXを再起動します

設定を適用するためにNGINXを再起動します。

```bash
sudo systemctl restart nginx
```

## 手順5：Wallarmノードの動作をテストします

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 手順6：AWSまたはGCPでフィルタリングノード6.xを基に仮想マシンイメージを作成します

フィルタリングノード6.xを基に仮想マシンイメージを作成するには、[AWS](../admin-en/installation-guides/amazon-cloud/create-image.md)または[GCP](../admin-en/installation-guides/google-cloud/create-image.md)の手順に従います。

## 手順7：以前のWallarmノードインスタンスを削除します

新しいバージョンのフィルタリングノードが正常に構成およびテストできた場合は、AWSまたはGCPの管理コンソールを使用して、以前のバージョンのフィルタリングノードのインスタンスと仮想マシンイメージを削除します。