```markdown
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
[envoy-process-time-limit-docs]:    ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../../api-specification-enforcement/overview.md

# 終了サポートのDocker NGINXベースイメージのアップグレード

本手順では、稼働中の終了サポートとなったDocker NGINXベースイメージ（バージョン3.6以下）をバージョン5.0にアップグレードするための手順を説明します。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## 要件

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## ステップ1: フィルタリングノードモジュールのアップグレードについてWallarm技術サポートに連絡する（ノード2.18以下の場合のみ）

ノード2.18以下をアップグレードする場合、[Wallarm技術サポート](mailto:support@wallarm.com)に対して、フィルタリングノードモジュールをバージョン5.0までアップグレードする旨と、Wallarmアカウントに新しいIPリストロジックを有効にするよう依頼してください。新しいIPリストロジックが有効になった場合、Wallarm Consoleの[**IP lists**](../../user-guides/ip-lists/overview.md)セクションが利用可能であることを確認してください。

## ステップ2: Threat Replay Testingモジュールの無効化（ノード2.16以下の場合のみ）

ノード2.16以下をアップグレードする場合、Wallarm Console → **Vulnerabilities** → **Configure**にて[Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールを無効化してください。

モジュールの動作により、アップグレードプロセス中に[false positives](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生する可能性があります。モジュールを無効化することで、このリスクを最小限に抑えます。

## ステップ3: APIポートの更新

--8<-- "../include/waf/upgrade/api-port-443.md"

## ステップ4: 更新されたフィルタリングノードイメージのダウンロード

``` bash
docker pull wallarm/node:5.3.0
```

## ステップ5: Wallarm Cloudへのトークンベース接続へ切り替える

コンテナをWallarm Cloudに接続する手法が以下のようにアップグレードされました。

* [「email and password」ベースの手法は廃止されました](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens)。従来、この手法では、`DEPLOY_USER`および`DEPLOY_PASSWORD`変数に正しい認証情報を渡すことでコンテナ起動時に自動的にWallarm Cloudへノードが登録されました。
* トークンベースの手法が導入されました。コンテナをCloudに接続するには、Wallarm Console UIからコピーしたWallarm APIトークンを含む`WALLARM_API_TOKEN`変数を使用してコンテナを起動してください。

イメージ5.0の実行には新しい手法の使用を推奨します。「email and password」ベースの手法は今後のリリースで削除されるため、早めに移行してください。

新しいWallarmノードの作成とトークンの取得方法:

1. Wallarm Console → **Settings** → **API Tokens**を開き、**Deploy**ロールを持つトークンを生成します。
1. 生成されたトークンをコピーします。

## ステップ6: 以前のWallarmノードバージョンからのallowlistおよびdenylistの移行（ノード2.18以下の場合のみ）

ノード2.18以下をアップグレードする場合、以前のWallarmノードバージョンからのallowlistおよびdenylistの設定をバージョン5.0へ[移行](../migrate-ip-lists-to-node-3.md)してください。

## ステップ7: 非推奨の設定オプションからの切り替え

以下の非推奨の設定オプションがあります:

* `WALLARM_ACL_ENABLE`環境変数は非推奨です。IPリストが新しいノードバージョンに[移行](../migrate-ip-lists-to-node-3.md)された場合、この変数を`docker run`コマンドから削除してください。
* 以下のNGINXディレクティブが名称変更されました:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    ディレクティブの名称のみ変更され、ロジックは同一です。旧名称のディレクティブはまもなく非推奨となりますので、早めに名称を変更することを推奨します。
    
    マウントされた設定ファイルに旧名称のディレクティブが明示的に指定されている場合、名称を変更してください。
* `wallarm_request_time`という[ログ変数](../../admin-en/configure-logging.md#filter-node-variables)が`wallarm_request_cpu_time`に変更されました。

    変数名のみ変更され、ロジックは同一です。旧名称は一時的にサポートされていますが、名称変更を推奨します。

<!-- * 以下のEnvoyパラメータが名称変更されました:

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * `tsets`セクション → `rulesets`、およびこのセクション内の`tsN`エントリ → `rsN`
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

    パラメータ名のみ変更され、ロジックは同一です。旧名称のパラメータはまもなく非推奨となりますので、早めに名称を変更することを推奨します。
    
    マウントされた設定ファイルに旧名称のパラメータが明示的に指定されている場合、名称を変更してください。 -->

## ステップ8: Wallarmブロッキングページの更新（NGINXベースイメージの場合）

新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更](what-is-new.md#new-blocking-page)されました。ページ上のロゴおよびサポートメールアドレスはデフォルトで空になっています。

Dockerコンテナがブロックされたリクエストに対して`&/usr/share/nginx/html/wallarm_blocked.html`ページを返すように設定されている場合、以下の手順で設定を変更してください:

1. 新しいサンプルページの[コピーとカスタマイズ](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)を行います。
1. カスタマイズしたページおよびNGINX設定ファイルを、新しいDockerコンテナに[マウント](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)してください。

## ステップ9: 最近のアーキテクチャ変更の確認（NGINXベースのDockerイメージの場合）

最新のアップデートにより、特定のファイルのパス変更に起因して、特にコンテナ起動時にカスタム設定ファイルをマウントしているユーザーに影響を及ぼす[アーキテクチャの変更](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image)が導入されました。新しいイメージの正しい設定および使用方法を確保するため、これらの変更点に精通してください。

## ステップ10: `overlimit_res`攻撃検出設定をディレクティブからルールへ移行する

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## ステップ11: 稼働中のコンテナを停止する

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## ステップ12: 更新されたイメージを使用してコンテナを起動する

必要に応じてマウントファイルのパスの調整を行い、更新されたイメージを使用してコンテナを起動してください。これは[最新のイメージに関する変更](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image)に基づくものです。

更新されたイメージを使用してコンテナを起動する方法は2通りあります:

* [環境変数を利用する場合](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
* [マウントされた設定ファイルを利用する場合](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## ステップ13: 最新バージョンでリリースされた変更に合わせてWallarmノードのフィルトレーションモード設定を調整する（ノード2.18以下の場合のみ）

1. 以下の設定項目について、期待される動作が[offおよびmonitoringフィルトレーションモードの変更されたロジック](what-is-new.md#filtration-modes)に対応していることを確認してください:
      * Dockerコンテナの環境変数[`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)またはNGINXベースコンテナのディレクティブ[`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      <!-- * Envoyベースコンテナの環境変数[`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)またはディレクティブ[`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) -->
      * Wallarm Consoleにて設定された[一般的なフィルトレーションルール](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * Wallarm Consoleにて設定された[エンドポイント対象フィルトレーションルール](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
2. 期待される動作と変更後のフィルトレーションモードのロジックが一致しない場合、[手順](../../admin-en/configure-wallarm-mode.md)に従いフィルトレーションモード設定を調整してください。

## ステップ14: フィルタリングノードの動作をテストする

--8<-- "../include/waf/installation/test-after-node-type-upgrade.md"

## ステップ15: 以前バージョンのフィルタリングノードを削除する

イメージ5.0が正しく動作していることを確認したら、Wallarm Console → **Nodes**セクションにて以前のフィルタリングノードを削除してください。

## ステップ16: Threat Replay Testingモジュールの再有効化（ノード2.16以下の場合のみ）

[Threat Replay Testingモジュールの設定に関する推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md)を確認し、必要に応じて再度有効化してください。

しばらく運用し、モジュールの動作がfalse positivesを引き起こさないことを確認してください。false positivesが発生した場合は、[Wallarm技術サポート](mailto:support@wallarm.com)へご連絡ください。
```