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

この手順はAWSまたはGCPでデプロイされたクラウドノードイメージ4.xを4.6までアップグレードする手順を説明します。

エンド・オブ・ライフノード（3.6以下）をアップグレードする場合は、[別の手順](older-versions/cloud-image.md)を使用してください。

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

## ステップ1：フィルタリングノード4.6を含む新しいインスタンスを起動する

1. クラウドプラットフォームマーケットプレイスでWallarmフィルタリングノードイメージを開き、イメージの起動に進みます：
    * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
    * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. ランチステップで、以下の設定を行います：

    * イメージバージョン `4.6.x`を選択します
    * AWSの場合は、フィールド **セキュリティグループ設定**で[作成したセキュリティグループ](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group)を選択します
    * AWSの場合は、フィールド **キーペア設定**で[作成したキーペアの名前](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys)を選択します
3. インスタンスの起動を確認します。
4. GCPの場合は、[指示](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance)に従ってインスタンスを設定します。

## ステップ2：フィルタリングノードをWallarm Cloudに接続する

1. SSHを通じてフィルタリングノードインスタンスに接続します。インスタンスへの接続に関する詳細な手順は、クラウドプラットフォームのドキュメンテーションで利用できます：
    * [AWSドキュメンテーション](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
    * [GCPドキュメンテーション](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. 新たにWallarmノードを作成し、生成されたトークンを使用してそのノードをWallarm Cloudに接続します。詳細な手順はクラウドプラットフォームの指示にあります：
    * [AWS](../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
    * [GCP](../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## ステップ3：フィルタリングノードの設定を前のバージョンから新しいバージョンにコピーする

1. 以下の前のWallarmノードバージョンの設定ファイルからフィルタリングノード4.6のファイルへ、処理とプロキシリクエストの設定をコピーします：

     * `/etc/nginx/nginx.conf`およびその他のNGINX設定ファイル
     * `/etc/nginx/conf.d/wallarm.conf`フィルタリングノードのグローバル設定
     * `/etc/nginx/conf.d/wallarm-status.conf`フィルタリングノード監視サービスの設定
     * `/etc/environment`環境変数
     * `/etc/default/wallarm-tarantool` Tarantool設定
     * 処理とプロキシリクエストのカスタム設定が含まれるその他のファイル
1. `&/usr/share/nginx/html/wallarm_blocked.html`ページがブロックされたリクエストに返される場合は、その[新しいバージョンをコピーし、カスタマイズ](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)します。

    新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更](what-is-new.md#new-blocking-page)されました。ページ上のロゴとサポートメールはデフォルトで空になっています。

NGINX設定ファイルの取り扱いに関する詳細な情報は、[公式NGINXドキュメンテーション](https://nginx.org/docs/beginners_guide.html)で利用できます。

フィルタリングノードディレクティブのリストは[こちら](../admin-en/configure-parameters-en.md)で確認できます。

## ステップ4：NGINXを再起動する

設定を適用するために、NGINXを再起動します：

```bash
sudo systemctl restart nginx
```

## ステップ5：Wallarmノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## ステップ6：AWSまたはGCPでフィルタリングノード4.6に基づく仮想マシンイメージを作成する

フィルタリングノード4.6に基づく仮想マシンイメージを作成するには、[AWS](../admin-en/installation-guides/amazon-cloud/create-image.md)または[GCP](../admin-en/installation-guides/google-cloud/create-image.md)の指示に従ってください。

## ステップ7：前のWallarmノードインスタンスを削除する

新しいフィルタリングノードのバージョンが正常に設定され、テストされている場合、AWSまたはGCP管理コンソールを使用して、前のフィルタリングノードバージョンのインスタンスおよび仮想マシンイメージを削除します。
