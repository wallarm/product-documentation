[wallarm-status-instr]: ../../admin-ja/configure-statistics-service.md
[memory-instr]: ../../admin-ja/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]: ../../admin-ja/configure-parameters-ja.md
[ptrav-attack-docs]: ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]: ../../admin-ja/configure-parameters-ja.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-ja/configure-parameters-ja.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../../user-guides/ip-lists/graylist.md
[waf-mode-instr]: ../../admin-ja/configure-wallarm-mode.md

# EOLクラウドノードイメージのアップグレード

これらの手順では、AWSまたはGCPでデプロイされた、ライフサイクルが終了したクラウドノードイメージ（バージョン3.6以前）を4.4にアップグレードする方法について説明しています。

--8<-- "../include-ja/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-4.0.md"

## ステップ1: フィルタリングノードモジュールのアップグレードをWallarm技術サポートに通知（ノード2.18以前の場合のみ）

ノード2.18以前をアップグレードする場合は、[Wallarm技術サポート](mailto:support@wallarm.com)にフィルタリングノードモジュールを最新バージョンにアップグレードすることを通知し、Wallarmアカウント用に新しいIPリストロジックを有効にしてもらってください。新しいIPリストロジックが有効になったら、Wallarm Console の [**IPリスト** セクション] (../../user-guides/ip-lists/overview.md) が利用可能かどうか確認してください。

## ステップ2: アクティブ脅威検証モジュールを無効にする（ノード2.16以前をアップグレードする場合のみ）

ノード2.16以前をアップグレードする場合は、Wallarm Console → **スキャナ** → **設定** で [Active threat verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) モジュールを無効にしてください。

このモジュールの動作が、アップグレードプロセス中に [誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives) を引き起こす可能性があります。モジュールを無効にすることで、このリスクを最小限に抑えることができます。

## ステップ3: APIポートを更新する

--8<-- "../include-ja/waf/upgrade/api-port-443.md"

## ステップ4: フィルタリングノード4.4を搭載した新しいインスタンスを起動する

1. クラウドプラットフォームマーケットプレイスでWallarmフィルタリングノードイメージを開き、イメージの起動に進んでください：
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. 起動ステップで次の設定を行ってください:

      * イメージバージョン`4.4.x`を選択
      * AWSの場合は、[作成したセキュリティグループ](../../admin-ja/installation-ami-ja.md#3-create-a-security-group) を **Security Group Settings** フィールドで選択
      * AWSの場合は、 [作成したキーペア](../../admin-ja/installation-ami-ja.md#2-create-a-pair-of-ssh-keys) の名前を **Key Pair Settings** フィールドで選択
3. インスタンスの起動を確認します。
4. GCPの場合は、[こちらの手順](../../admin-ja/installation-gcp-ja.md#3-configure-the-filtering-node-instance) に従ってインスタンスを設定します。

## ステップ5: ノード2.18以前をアップグレードする場合のみ、Wallarmノードのフィルタリングモード設定を最新バージョンの変更に調整する

1. 下記の設定の期待される動作が、 [`off` および `monitoring` フィルタリングモードの変更されたロジック](what-is-new.md#filtration-modes) に対応していることを確認してください:
      * [ディレクティブ `wallarm_mode`](../../admin-ja/configure-parameters-ja.md#wallarm_mode)
      * [Wallarm Consoleで設定された一般的なフィルタリングルール](../../user-guides/settings/general.md)
      * [Wallarm Consoleで設定された低レベルのフィルタリングルール](../../user-guides/rules/wallarm-mode-rule.md)
2. 期待される動作が変更されたフィルタリングモードのロジックに対応していない場合は、[この手順](../../admin-ja/configure-wallarm-mode.md) を使って、リリースされた変更にフィルタリングモードの設定を調整してください。

## ステップ6: フィルタリングノードをWallarm Cloudに接続する

1. SSHを使ってフィルタリングノードインスタンスに接続します。インスタンスへの接続方法に関する詳細な手順は、クラウドプラットフォームのドキュメントにあります：
      * [AWS ドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP ドキュメント](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. 生成されたトークンを使用して、新しいWallarmノードを作成し、Wallarm Cloudに接続します。各クラウドプラットフォームの手順に従ってください：
      * [AWS](../../admin-ja/installation-ami-ja.md#6-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../../admin-ja/installation-gcp-ja.md#5-connect-the-filtering-node-to-the-wallarm-cloud)

## ステップ7: 前のバージョンから新しいバージョンにフィルタリングノードの設定をコピーする

1. 前のWallarmノードバージョンの以下の設定ファイルから、フィルタリングノード4.4のファイルにリクエスト処理およびプロキシ設定をコピーしてください：
      * `/etc/nginx/nginx.conf` およびその他のNGINX設定ファイル
      * `/etc/nginx/conf.d/wallarm.conf` でグローバルフィルタリングノード設定
      * `/etc/nginx/conf.d/wallarm-status.conf` でフィルタリングノード監視サービス設定

        コピーされたファイルの内容が [推奨される安全な構成](../../admin-ja/configure-statistics-service.md#configuring-the-statistics-service) に対応していることを確認してください。

      * `/etc/environment` で環境変数
      * `/etc/default/wallarm-tarantool` で Tarantool 設定
      * リクエストの処理およびプロキシ設定用の他のカスタム設定ファイル
1. 明示的に設定ファイルで指定されている以下のNGINXディレクティブの名前を変更してください：

    * `wallarm_instance` → [`wallarm_application`](../../admin-ja/configure-parameters-ja.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-ja/configure-parameters-ja.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-ja/configure-parameters-ja.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-ja/configure-parameters-ja.md#wallarm_general_ruleset_memory_limit)

    ディレクティブの名前だけを変更し、ロジックは変わっていません。間もなく従来の名前のディレクティブは廃止される予定なので、それまでに名前を変更しておくことをお勧めします。
1. [拡張ログ形式](../../admin-ja/configure-logging.md#filter-node-variables)が設定されている場合は、`wallarm_request_time` 変数が明示的に設定で指定されているかどうか確認してください。

      そうであれば、それを `wallarm_request_cpu_time` に変更してください。

      変数名だけが変更され、ロジックは変わっていません。古い名前も一時的にサポートされていますが、やはり変数名を変更することをお勧めします。
1. ノード2.18以前をアップグレードする場合は、許可リストと拒否リストの設定を前のWallarmノードバージョンから4.4に [移行] (../migrate-ip-lists-to-node-3.md) してください。
1. ページ `&/usr/share/nginx/html/wallarm_blocked.html` がブロックされたリクエストに返される場合は、[新しいバージョンをコピーしてカスタマイズ](../../admin-ja/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) してください。

      新しいノードバージョンでは、Wallarmのサンプルブロックページが [変更されました](what-is-new.md#new-blocking-page) 。ページ上のロゴとサポートメールはデフォルトで空になっています。

NGINX設定ファイルの操作に関する詳細情報は [公式NGINXドキュメント](https://nginx.org/docs/beginners_guide.html) で入手できます。

フィルタリングノードディレクティブのリストは [ここ](../../admin-ja/configure-parameters-ja.md) で入手できます。## ステップ8: 攻撃検出設定 `overlimit_res` をディレクティブからルールに転送する

--8<-- "../include-ja/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## ステップ9: NGINX を再起動する

設定を適用するには、NGINX を再起動します：

```bash
sudo systemctl restart nginx
```

## ステップ10: Wallarmノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## ステップ11: AWS か GCP でフィルタリングノード 4.4 をベースにした仮想マシンイメージを作成する

フィルタリングノード 4.4 をベースにした仮想マシンイメージを作成するには、[AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md) または [GCP](../../admin-en/installation-guides/google-cloud/create-image.md) の手順に従ってください。

## ステップ12: 前回の Wallarm ノードインスタンスを削除する

新しいバージョンのフィルタリングノードが正常に設定され、テストされた場合、AWS または GCP 管理コンソールを使用して、前のバージョンのフィルタリングノードが含まれるインスタンスと仮想マシンイメージを削除します。

## ステップ13: アクティブ脅威検証モジュールを再度有効にする（ノード 2.16 以下をアップグレードする場合のみ）

[アクティブ脅威検証モジュールの設定に関する推奨事項](../../admin-en/attack-rechecker-best-practices.md) を参照し、必要に応じて再度有効にしてください。

しばらくして、モジュールの動作が誤検知を引き起こさないことを確認してください。誤検知が発見された場合は、[Wallarm の技術サポート](mailto:support@wallarm.com)に連絡してください。