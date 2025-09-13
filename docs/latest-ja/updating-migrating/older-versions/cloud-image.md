[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# サポート終了(EOL)クラウドノードイメージのアップグレード

本書では、AWSまたはGCPにデプロイされたサポート終了のクラウドノードイメージ(バージョン3.6以下)を6.xにアップグレードする手順を説明します。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## 要件

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## 手順1: フィルタリングノードモジュールをアップグレードすることをWallarmテクニカルサポートに連絡します(ノード2.18以下をアップグレードする場合のみ)

ノード2.18以下をアップグレードする場合は、フィルタリングノードモジュールを最新バージョンにアップグレードする旨を[Wallarmテクニカルサポート](mailto:support@wallarm.com)に連絡し、お使いのWallarmアカウントに対して新しいIPリストロジックの有効化を依頼してください。新しいIPリストロジックが有効化されたら、Wallarm Consoleの[**IP lists**](../../user-guides/ip-lists/overview.md)セクションにアクセスできることを確認してください。

## 手順2: Threat Replay Testingモジュールを無効化します(ノード2.16以下をアップグレードする場合のみ)

Wallarmノード2.16以下をアップグレードする場合は、Wallarm Console → **Vulnerabilities** → **Configure**で[Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールを無効化してください。

アップグレード中に当該モジュールの動作が誤検知を引き起こす可能性があります。無効化することでこのリスクを最小化できます。

## 手順3: APIポートを更新する

--8<-- "../include/waf/upgrade/api-port-443.md"

## 手順4: 直近のアーキテクチャ更新を確認する

最新のアップデートでは、特にノードのデフォルト設定ファイルを変更しているユーザーに影響する可能性のある[アーキテクチャの変更](what-is-new.md#optimized-cloud-images)が導入されています。新しいイメージを正しく構成・利用できるよう、これらの変更点を必ず把握してください。

## 手順5: フィルタリングノード6.xの新規インスタンスを起動する

以前のWallarmノードバージョンの次の設定ファイルから、要求の処理とプロキシの設定をフィルタリングノード6.xのファイルにコピーしてください:

1. クラウドプラットフォームのマーケットプレイスでWallarmフィルタリングノードのイメージを開き、イメージの起動に進みます:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. 起動時の手順で、以下を設定します:

      * イメージバージョン`6.x`を選択します
      * AWSの場合、**Security Group Settings**フィールドで[作成済みのセキュリティグループ](../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group)を選択します
      * AWSの場合、**Key Pair Settings**フィールドで[作成済みのキーペア](../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws)の名前を選択します
3. インスタンスの起動を確定します。
4. GCPの場合、これらの[手順](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance)に従ってインスタンスを構成します。

## 手順6: 最新バージョンでの変更に合わせてWallarmノードのフィルタリングモード設定を調整する(ノード2.18以下をアップグレードする場合のみ)

1. 以下の設定の想定どおりの動作が、[`off`および`monitoring`フィルタリングモードの変更されたロジック](what-is-new.md#filtration-modes)に合致していることを確認してください:
      * [ディレクティブ`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで構成された全体フィルタリングルール](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Consoleで構成されたエンドポイント対象のフィルタリングルール](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
2. 想定動作が変更後のフィルタリングモードロジックに合致していない場合は、[手順](../../admin-en/configure-wallarm-mode.md)に従って設定を最新の変更内容に合わせて調整してください。

## 手順7: フィルタリングノードをWallarm Cloudに接続する

1. SSHでフィルタリングノードのインスタンスに接続します。インスタンスへの接続に関する詳細な手順は各クラウドプラットフォームのドキュメントをご参照ください:
      * [AWSのドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCPのドキュメント](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. クラウドプラットフォーム別の手順に従い、生成したトークンを使用して新しいWallarmノードを作成し、Wallarm Cloudに接続します:
      * [AWS](../../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud)
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-filtering-node-to-the-wallarm-cloud)

## 手順8: 以前のバージョンから新バージョンへフィルタリングノードの設定をコピーする

1. 以前のWallarmノードバージョンの次の設定ファイルから、要求の処理とプロキシの設定をフィルタリングノード6.xのファイルにコピーします:
      * `/etc/nginx/nginx.conf`およびその他のNGINX設定ファイル
      * フィルタリングノードの監視サービス設定を含む`/etc/nginx/conf.d/wallarm-status.conf`

        コピーしたファイル内容が[推奨される安全な構成](../../admin-en/configure-statistics-service.md#setup)に準拠していることを確認してください。

      * 環境変数を含む`/etc/environment`
      * 最近の[アーキテクチャの変更](what-is-new.md#optimized-cloud-images)を踏まえ、`/etc/nginx/sites-available/default`など、要求の処理やプロキシに関するその他のカスタム設定ファイル
1. 設定ファイルで明示的に指定している場合、以下のNGINXディレクティブをリネームしてください:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    ディレクティブは名前のみ変更され、ロジックは同一です。旧名称のディレクティブはまもなく非推奨となるため、事前にリネームすることを推奨します。
1. [拡張ログ形式](../../admin-en/configure-logging.md#filter-node-variables)を設定している場合、設定内で`wallarm_request_time`変数を明示的に指定していないか確認してください。

      指定している場合は、`wallarm_request_cpu_time`にリネームしてください。

      変数は名称のみ変更され、ロジックは同一です。旧名称も一時的にサポートされていますが、リネームを推奨します。
1. ノード2.18以下をアップグレードする場合、以前のWallarmノードバージョンの許可リストと拒否リストの設定を6.xに[移行](../migrate-ip-lists-to-node-3.md)してください。
1. ブロックされたリクエストに対してページ`&/usr/share/nginx/html/wallarm_blocked.html`を返している場合は、その新しいバージョンを[コピーしてカスタマイズ](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)してください。

      新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更されています](what-is-new.md#new-blocking-page)。ページ上のロゴとサポートメールはデフォルトで空になりました。

NGINX設定ファイルの取り扱いに関する詳細は、[公式NGINXドキュメント](https://nginx.org/docs/beginners_guide.html)をご参照ください。

フィルタリングノードのディレクティブ一覧は[こちら](../../admin-en/configure-parameters-en.md)です。

## 手順8: `overlimit_res`攻撃検出の設定をディレクティブからルールへ移行する

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## 手順9: NGINXを再起動する

設定を適用するため、NGINXを再起動します:

```bash
sudo systemctl restart nginx
```

## 手順10: Wallarmノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 手順11: AWSまたはGCPでフィルタリングノード6.xをベースに仮想マシンイメージを作成する

フィルタリングノード6.xをベースに仮想マシンイメージを作成するには、[AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md)または[GCP](../../admin-en/installation-guides/google-cloud/create-image.md)の手順に従ってください。

## 手順12: 前のWallarmノードインスタンスを削除する

新バージョンのフィルタリングノードが正常に構成・テストできたら、AWSまたはGCPの管理コンソールを使用して、旧バージョンのフィルタリングノードのインスタンスと仮想マシンイメージを削除してください。

## 手順13: Threat Replay Testingモジュールを再度有効化する(ノード2.16以下をアップグレードする場合のみ)

[Threat Replay Testingモジュールの設定に関する推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md)を確認し、必要に応じて再度有効化してください。

しばらく運用した後、当該モジュールの動作が誤検知を引き起こしていないことを確認してください。誤検知が発生する場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にご連絡ください。