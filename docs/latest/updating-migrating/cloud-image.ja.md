[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.ja.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# クラウドノードイメージのアップグレード

これらの指示は、AWSまたはGCPにデプロイされたクラウドノードイメージ4.xを4.6までアップグレードする手順を説明しています。

エンドオブライフノード（3.6以下）をアップグレードするには、[異なる指示](older-versions/cloud-image.md)を使用してください。

## 必要条件

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## ステップ1：フィルタリングノード4.6とともに新しいインスタンスを起動する

1. クラウドプラットフォームマーケットプレイスでWallarmフィルタリングノードイメージを開き、イメージの起動に進みます：
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. 起動ステップで、次の設定を設定します：

      * イメージバージョン`4.6.x`を選択
      * AWSの場合、フィールド**Security Group Settings**で[作成済みのセキュリティグループ](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group)を選択します
      * AWSの場合、フィールド**Key Pair Settings**で[作成済みのキーペア](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys)の名前を選択します
3. インスタンスの起動を確認します。
4. GCPの場合、次の[指示](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance)に従ってインスタンスを設定します。

## ステップ2：フィルタリングノードをWallarm Cloudに接続する

1. SSHを介してフィルタリングノードインスタンスに接続します。インスタンスへの接続に関するより詳しい指示は、クラウドプラットフォームのドキュメンテーションにあります：
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. 新しいWallarmノードを作成し、生成されたトークンを使用してWallarm Cloudに接続します。クラウドプラットフォームの指示に従ってください：
      * [AWS](../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## ステップ3：前のバージョンから新しいバージョンへフィルタリングノードの設定をコピーする

1. 前のWallarmノードバージョンの次の設定ファイルからフィルタリングノード4.6のファイルへリクエストの処理とプロキシ設定をコピーします：

      * `/etc/nginx/nginx.conf`や他のNGINX設定ファイル
      * `/etc/nginx/conf.d/wallarm.conf`と全体のフィルタリングノード設定のある
      * `/etc/nginx/conf.d/wallarm-status.conf`とフィルタリングノードのモニタリングサービス設定のある
      * `/etc/environment`と環境変数のある
      * `/etc/default/wallarm-tarantool`とTarantool設定のある
      * リクエストの処理とプロキシ設定のある他のカスタム設定ファイル
1. ページ`&/usr/share/nginx/html/wallarm_blocked.html`がブロックされたリクエストに戻されている場合、その新しいバージョンを[コピーしてカスタマイズ](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)します。

      新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更され](what-is-new.md#new-blocking-page)ました。ページ上のロゴとサポートメールは、デフォルトでは空白になっています。

NGINX設定ファイルを操作する詳細情報は、[公式NGINXドキュメンテーション](https://nginx.org/docs/beginners_guide.html)で利用可能です。

フィルタリングノード指令のリストは[ここ](../admin-en/configure-parameters-en.ja.md)で利用可能です。

## ステップ4：NGINXをリスタートする

設定を有効にするため、NGINXを再起動します：

```bash
sudo systemctl restart nginx
```

## ステップ5：Wallarmノード動作のテスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ステップ6：AWSまたはGCPでフィルタリングノード4.6をベースに仮想マシンイメージを作成する

フィルタリングノード4.6をベースに仮想マシンイメージを作成するには、[AWS](../admin-en/installation-guides/amazon-cloud/create-image.md)または[GCP](../admin-en/installation-guides/google-cloud/create-image.md)の指示に従ってください。

## ステップ7：前のWallarmノードインスタンスを削除する

新しいバージョンのフィルタリングノードが正常に設定されてテストされたら、前のバージョンのフィルタリングノードがあるインスタンスと仮想マシンイメージをAWSまたはGCP管理コンソールを使用して削除します。