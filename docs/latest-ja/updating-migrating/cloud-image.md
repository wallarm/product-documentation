```markdown
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

# クラウドノードイメージのアップグレード

以下の手順は、AWSまたはGCPに展開された4.xのクラウドノードイメージを5.0までアップグレードする手順を説明しています。

エンドオブライフノード（3.6以下）のアップグレードについては、[こちらの手順](older-versions/cloud-image.md)をご参照ください。

## 必要条件

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## 手順1: フィルタリングノード5.0で新しいインスタンスを起動する

1. クラウドプラットフォームのマーケットプレイスでWallarmフィルタリングノードイメージを開き、イメージの起動を進めます:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. 起動手順では、次の設定を行います:

      * イメージバージョンとして `5.x.x` を選択します
      * AWSの場合、**Security Group Settings**欄に[作成済みのセキュリティグループ](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group)を選択します
      * AWSの場合、**Key Pair Settings**欄に[作成済みのキーペア](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws)の名前を選択します
3. インスタンスの起動を確認します。
4. GCPの場合、[こちらの手順](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance)に従いインスタンスを構成します。

## 手順2: Wallarm Cloudにフィルタリングノードを接続する

1. SSHを使用してフィルタリングノードインスタンスに接続します。インスタンスへの接続に関する詳細な手順は、各クラウドプラットフォームのドキュメントに記載されています:
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. 新しいWallarmノードを作成し、生成されたトークンを使用してWallarm Cloudに接続します。各クラウドプラットフォームの指示に従ってください:
      * [AWS](../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-instance-to-the-wallarm-cloud)

## 手順3: 既存バージョンから新バージョンへフィルタリングノードの設定をコピーする

前のWallarmノードバージョンの以下の設定ファイルから、フィルタリングノード5.0のファイルへリクエストの処理およびプロキシ設定をコピーしてください:

* `/etc/nginx/nginx.conf` およびその他のNGINX設定ファイル
* フィルタリングノードの監視サービス設定が記載された `/etc/nginx/conf.d/wallarm-status.conf`
* 環境変数が記載された `/etc/environment`
* リクエスト処理およびプロキシに関するその他のカスタム設定ファイル

NGINX設定ファイルの取り扱いに関する詳細は、[公式NGINXドキュメント](https://nginx.org/docs/beginners_guide.html)をご確認ください。

フィルタリングノードディレクティブの一覧は[こちら](../admin-en/configure-parameters-en.md)からご確認いただけます。

## 手順4: NGINXを再起動する

設定を反映するためにNGINXを再起動します:

```bash
sudo systemctl restart nginx
```

## 手順5: Wallarmノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 手順6: AWSまたはGCPでフィルタリングノード5.0を基に仮想マシンイメージを作成する

フィルタリングノード5.0を基に仮想マシンイメージを作成するには、[AWS](../admin-en/installation-guides/amazon-cloud/create-image.md)または[GCP](../admin-en/installation-guides/google-cloud/create-image.md)の手順に従ってください。

## 手順7: 以前のWallarmノードインスタンスを削除する

新しいバージョンのフィルタリングノードが正常に構成およびテストされた場合、AWSまたはGCPの管理コンソールを使用して、以前のバージョンのフィルタリングノードを搭載したインスタンスおよび仮想マシンイメージを削除してください。
```