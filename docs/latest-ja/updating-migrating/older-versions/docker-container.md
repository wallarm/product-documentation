[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../../api-specification-enforcement/overview.md

# EOLのDocker NGINXベースイメージのアップグレード

本ドキュメントでは、稼働中のサポート終了（EOL）のDocker NGINXベースイメージ（バージョン3.6以下）を6.xにアップグレードする手順を説明します。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## 要件

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## 手順1: フィルタリングノードモジュールをアップグレードすることをWallarmテクニカルサポートに連絡します（ノード2.18以下をアップグレードする場合のみ）

ノード2.18以下をアップグレードする場合は、フィルタリングノードモジュールを6.xにアップグレードする旨を[Wallarmテクニカルサポート](mailto:support@wallarm.com)に連絡し、Wallarmアカウントに対して新しいIPリストロジックの有効化を依頼してください。新しいIPリストロジックが有効になったら、Wallarm Consoleの[**IP lists**](../../user-guides/ip-lists/overview.md)セクションが利用可能であることを確認してください。

## 手順2: Threat Replay Testingモジュールを無効化します（ノード2.16以下をアップグレードする場合のみ）

Wallarmノード2.16以下をアップグレードする場合は、Wallarm Console→**Vulnerabilities**→**Configure**で[Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールを無効化してください。

アップグレードの過程でこのモジュールの動作により[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生する可能性があります。モジュールを無効化すると、このリスクを最小化できます。

## 手順3: APIポートを更新します

--8<-- "../include/waf/upgrade/api-port-443.md"

## 手順4: 更新済みのフィルタリングノードイメージをダウンロードします

``` bash
docker pull wallarm/node:6.4.1
```

## 手順5: Wallarm Cloudへのトークンベース接続に切り替えます

Wallarm Cloudにコンテナを接続する方法は次のように更新されました。

* [「email and password」ベースの方法は非推奨になりました](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens)。この方法では、`DEPLOY_USER`および`DEPLOY_PASSWORD`変数に正しい認証情報を指定してコンテナを起動すると、ノードは自動的にWallarm Cloudに登録されていました。
* トークンベースの方法が追加されました。コンテナをCloudに接続するには、Wallarm ConsoleのUIからコピーしたWallarm APIトークンを含む`WALLARM_API_TOKEN`変数を指定してコンテナを実行します。

6.xのイメージの実行には新しい方法を使用することを推奨します。「email and password」ベースの方法は将来のリリースで削除されますので、事前に移行してください。

新しいWallarmノードを作成してトークンを取得するには次のとおりです。

1. Wallarm Console→**Settings**→**API Tokens**を開き、使用タイプに**Node deployment/Deployment**を選択してトークンを生成します。
1. 生成したトークンをコピーします。

## 手順6: 以前のWallarmノードバージョンから6.xへallowlist/denylistを移行します（ノード2.18以下をアップグレードする場合のみ）

ノード2.18以下をアップグレードする場合は、以前のWallarmノードバージョンのallowlist/denylist設定を6.xへ[移行](../migrate-ip-lists-to-node-3.md)してください。

## 手順7: 非推奨の設定オプションから切り替えます

以下の設定オプションは非推奨です。

* `WALLARM_ACL_ENABLE`環境変数は非推奨になりました。

    IPリストを新しいノードバージョンに[移行](../migrate-ip-lists-to-node-3.md)した場合は、この変数を`docker run`コマンドから削除してください。
* `TARANTOOL_MEMORY_GB`環境変数でpostanalyticsのメモリ量を設定している場合は、変数名を`SLAB_ALLOC_ARENA`に変更してください。
* 以下のNGINXディレクティブは名称が変更されました。

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    変更はディレクティブ名のみであり、動作は同じです。旧名称のディレクティブは間もなく非推奨になりますので、事前に名称を変更することを推奨します。
    
    マウントしている設定ファイル内で旧名称のディレクティブを明示的に指定していないか確認してください。指定している場合は名称を変更してください。
* `wallarm_request_time`[ログ変数](../../admin-en/configure-logging.md#filter-node-variables)は`wallarm_request_cpu_time`に名称変更されました。

    変更は変数名のみであり、動作は同じです。旧名称も当面はサポートされますが、変数の名称は変更することを推奨します。

## 手順8: Wallarmのブロッキングページを更新します（NGINXベースイメージをアップグレードする場合）

新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更されました](what-is-new.md#new-blocking-page)。ページ上のロゴとサポート用メールアドレスはデフォルトで空になっています。

Dockerコンテナがブロック対象のリクエストに対して`&/usr/share/nginx/html/wallarm_blocked.html`ページを返すように設定されている場合は、次のように設定を変更してください。

1. サンプルページの新しいバージョンを[コピーしてカスタマイズ](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)します。
1. 次の手順で、新しいDockerコンテナにカスタマイズしたページとNGINXの設定ファイルを[マウント](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)します。

## 手順9: 直近のアーキテクチャ変更を確認します（NGINXベースのDockerイメージ向け）

最新のアップデートでは、[イメージの最適化](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image)や[Postanalytics向けのTarantoolのwstoreへの置き換え](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)に伴うアーキテクチャの変更が導入されています。特定のファイルのパスが変更されたため、特にコンテナ起動時にカスタム設定ファイルをマウントしているユーザーに影響する可能性があります。新しいイメージを正しく設定・利用できるよう、これらの変更点を把握してください。

## 手順10: `overlimit_res`攻撃検出の設定をディレクティブからルールへ移行します

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## 手順11: 稼働中のコンテナを停止します

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## 手順12: 更新済みイメージを使用してコンテナを起動します

更新済みイメージを使用してコンテナを起動し、[イメージの最適化](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image)や[置き換え](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)による最近の変更がある場合は、マウントするファイルのパスを必要に応じて調整してください。

更新済みイメージでコンテナを実行する方法は2つあります。

* [環境変数を使用する方法](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
* [設定ファイルをマウントする方法](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## 手順13: 最新バージョンでの変更に合わせてWallarmノードのフィルタリングモード設定を調整します（ノード2.18以下をアップグレードする場合のみ）

1. 以下の設定について、期待する挙動が[`off`および`monitoring`フィルタリングモードの変更されたロジック](what-is-new.md#filtration-modes)と一致していることを確認してください。
      * NGINXベースのDockerコンテナの環境変数[`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)またはディレクティブ[`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで構成した全体フィルタリングルール](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Consoleで構成したエンドポイント対象のフィルタリングルール](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
2. 期待する挙動が変更後のフィルタリングモードのロジックと一致しない場合は、[手順](../../admin-en/configure-wallarm-mode.md)に従って設定を変更内容に合わせて調整してください。

## 手順14: フィルタリングノードの動作をテストします

--8<-- "../include/waf/installation/test-after-node-type-upgrade.md"

## 手順15: 以前のバージョンのフィルタリングノードを削除します

デプロイした6.xのイメージが正しく動作していることを確認できたら、Wallarm Console→**Nodes**セクションで以前のバージョンのフィルタリングノードを削除できます。

## 手順16: Threat Replay Testingモジュールを再度有効化します（ノード2.16以下をアップグレードする場合のみ）

[Threat Replay Testingモジュールの設定に関する推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md)を確認し、必要に応じて再度有効化してください。

しばらく運用した後、このモジュールの動作によって誤検知が発生していないことを確認してください。誤検知が発生する場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にお問い合わせください。