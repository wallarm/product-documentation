[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.ja.md
[blocking-page-instr]: ../../admin-en/configuration-guides/configure-block-page-and-code.ja.md
[logging-instr]: ../../admin-en/configure-logging.ja.md
[proxy-balancer-instr]: ../../admin-en/using-proxy-or-balancer-en.ja.md
[process-time-limit-instr]: ../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[allocating-memory-guide]: ../../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[ptrav-attack-docs]: ../../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]: ../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.ja.md
[graylist-docs]: ../../user-guides/ip-lists/graylist.ja.md
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.ja.md
[envoy-process-time-limit-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.ja.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.ja.md#process_time_limit_block

# EOL Docker NGINX もしくは Envoy ベースのイメージのアップグレード

これらの手順は、実行中の終了間近の Docker NGINX または Envoy ベースのイメージ（バージョン 3.6 およびそれ以前）をバージョン 4.4 にアップグレードする手順を説明しています。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.ja.md"

## 要件

--8<-- "../include/waf/installation/requirements-docker-4.0.ja.md"

## ステップ1: Wallarm技術サポートにフィルタリングノードモジュールをアップグレードしていることを報告する（アップグレードノード2.18以下の場合のみ）

ノード2.18以下をアップグレードする場合、[Wallarm技術サポート](mailto:support@wallarm.com)にフィルタリングノードモジュールを4.4にアップグレードしていますことを報告し、Wallarmアカウントの新しいIPリストロジックを有効にしてもらってください。新しいIPリストロジックが有効になったら、Wallarmコンソールの[**IPリスト**](../../user-guides/ip-lists/overview.ja.md)セクションを確認してください。

## ステップ2: アクティブな脅威検証モジュールを無効にする（アップグレードノード2.16以下の場合のみ）

Wallarmノード2.16以下をアップグレードする場合、Wallarmコンソール→**スキャナー**→**設定**で、[アクティブな脅威検証](../../about-wallarm/detecting-vulnerabilities.ja.md#active-threat-verification)モジュールを無効にしてください。

モジュールの動作は、アップグレードプロセス中に[誤検知](../../about-wallarm/protecting-against-attacks.ja.md#false-positives)を引き起こす可能性があります。モジュールを無効にすることでこのリスクが最小限になります。

## ステップ3: APIポートの更新

--8<-- "../include/waf/upgrade/api-port-443.ja.md"

## ステップ4: 更新されたフィルタリングノードイメージをダウンロードする

=== "NGINXベースのイメージ"
    ``` bash
    docker pull wallarm/node:4.4.5-1
    ```
=== "Envoyベースのイメージ"
    ``` bash
    docker pull wallarm/envoy:4.4.4-1
    ```

## ステップ5: トークンベースの接続でWallarmクラウドに切り替える

バージョン4.xのリリースに伴い、コンテナをWallarmクラウドに接続する方法が次のようにアップグレードされました。

* [「メールアドレスとパスワード」を使用するアプローチが非推奨となりました](what-is-new.ja.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens)。このアプローチでは、ノードは正しい資格情報が `DEPLOY_USER` および `DEPLOY_PASSWORD`変数に渡されているコンテナが起動されると、Wallarmクラウドに自動登録されました。
* トークンベースのアプローチが追加されました。コンテナをクラウドに接続するには、Wallarm Console UIからコピーしたWallarmノードトークンが含まれる `WALLARM_API_TOKEN` 変数でコンテナを実行してください。

バージョン4.4のイメージを実行するには、新しいアプローチを使用することをお勧めします。「メールアドレスとパスワード」に基づくアプローチは、今後のリリースで削除される予定ですので、それまでに移行してください。

新しいWallarmノードを作成し、そのトークンを取得するには：

1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarmコンソール→**ノード**を開き、**Wallarmノード**タイプのノードを作成します。

    ![!Wallarmノードの作成](../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。

## ステップ6：許可リストと拒否リストを以前のWallarmノードバージョンから4.4に移行する（ノード2.18以下をアップグレードする場合のみ）

ノード2.18以下をアップグレードする場合は、許可リストと拒否リストの設定を以前のWallarmノードバージョンから4.4に[移行](../migrate-ip-lists-to-node-3.ja.md)してください。

## ステップ7: 廃止予定の設定オプションから切り替える

次の設定オプションが廃止予定となりました。

* `WALLARM_ACL_ENABLE` 環境変数は廃止予定です。IPリストが新しいノードバージョンに[移行](../migrate-ip-lists-to-node-3.ja.md)されている場合、この変数を`docker run`コマンドから削除してください。
* 以下の NGINX ディレクティブが変更されました：

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.ja.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.ja.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.ja.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.ja.md#wallarm_general_ruleset_memory_limit)

    これらのディレクティブの名前だけが変更されており、ロジックは変わっていません。近日中に旧名のディレクティブが廃止予定になりますので、事前に名前を変更することをお勧めします。

    マウントされた設定ファイルに旧名のディレクティブが明示的に指定されている場合は、それらを変更してください。
* `wallarm_request_time` [ログ変数](../../admin-en/configure-logging.ja.md#filter-node-variables) の名前が `wallarm_request_cpu_time` に変更されました。

    変数の名前だけが変更されており、ロジックは変わっていません。古い名前は一時的にサポートされますが、それでも変数の名前を変更することをお勧めします。
* 以下の Envoy パラメーターの名前が変更されました：

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.ja.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.ja.md#basic-settings)
    * `tsets` セクション → `rulesets` 、それに伴い、このセクションの `tsN` エントリ → `rsN`
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.ja.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.ja.md#request-filtering-settings)

    パラメーターの名前だけが変更されており、ロジックは変わっていません。近日中に旧名のパラメーターが廃止予定になりますので、事前に名前を変更することをお勧めします。

    マウントされた設定ファイルに旧名のパラメーターが明示的に指定されている場合は、それらを変更してください。

## ステップ8: Wallarmブロックページを更新する（NGINXベースのイメージをアップグレードする場合）

新しいノードバージョンでは、Wallarm のサンプルブロックページが[変更](what-is-new.ja.md#new-blocking-page)されています。ページ上のロゴとサポートメールがデフォルトで空になりました。

Docker コンテナがブロックされたリクエストに `&/usr/share/nginx/html/wallarm_blocked.html` ページを返すように設定されていた場合、次の手順でこの設定を変更します。

1. [新しいサンプルページのバージョン](../../admin-en/configuration-guides/configure-block-page-and-code.ja.md#customizing-sample-blocking-page)をコピーしてカスタマイズする。
1. [次のステップで新しいDockerコンテナにカスタマイズされたページとNGINX設定ファイルをマウント](../../admin-en/configuration-guides/configure-block-page-and-code.ja.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)する。以下は Wallarm のドキュメントの一部を英語から日本語に翻訳したものです。

## ステップ 9：`overlimit_res` 攻撃検出設定をディレクティブからルールへ転送

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-docker.ja.md"

## ステップ 10：実行中のコンテナを停止

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## ステップ 11：更新されたイメージを使用してコンテナを実行

更新されたイメージを使用してコンテナを実行します。 以前のイメージバージョンの実行時に渡された同じ設定パラメーターを渡すことができます（前のステップでリストされているものを除く）。

更新されたイメージを使用してコンテナを実行する方法は次の2つがあります。

* **環境変数で** 基本的なフィルタリングノードの設定を指定
    * [NGINX ベースの Docker コンテナ用の手順 →](../../admin-en/installation-docker-en.ja.md#run-the-container-passing-the-environment-variables)
    * [Envoy ベースの Docker コンテナ用の手順 →](../../admin-en/installation-guides/envoy/envoy-docker.ja.md#run-the-container-passing-the-environment-variables)
* **マウントされた設定ファイルで** 高度なフィルタリングノードの設定を指定
    * [NGINX ベースの Docker コンテナ用の手順 →](../../admin-en/installation-docker-en.ja.md#run-the-container-mounting-the-configuration-file)
    * [Envoy ベースの Docker コンテナ用の手順 →](../../admin-en/installation-guides/envoy/envoy-docker.ja.md#run-the-container-mounting-envoyyaml)

## ステップ 12：最新バージョンでリリースされた変更に対して Wallarm ノードのフィルタリングモード設定を調整（ノード 2.18 以下をアップグレードする場合のみ）

1. 以下の設定の期待される動作が、[`off`]と[`monitoring`]フィルタリングモードの[変更されたロジック](what-is-new.ja.md#filtration-modes)に対応していることを確認してください。
      * NGINX ベースの Docker コンテナの環境変数 [`WALLARM_MODE`](../../admin-en/installation-docker-en.ja.md#run-the-container-passing-the-environment-variables) またはディレクティブ [`wallarm_mode`](../../admin-en/configure-parameters-en.ja.md#wallarm_mode)
      * Envoy  ベースの Docker コンテナの環境変数 [`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.ja.md#run-the-container-passing-the-environment-variables) またはディレクティブ [`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.ja.md#basic-settings)
      * Wallarm コンソールで設定する一般的なフィルタリングルール
      * Wallarm コンソールで設定する低レベルのフィルタリングルール
2. 期待される動作が変更されたフィルタリングモードのロジックに対応していない場合は、[手順](../../admin-en/configure-wallarm-mode.ja.md)に従ってフィルタリングモードの設定をリリースされた変更に適合させてください。

## ステップ 13：フィルタリングノードの動作をテスト

--8<-- "../include/waf/installation/test-after-node-type-upgrade.ja.md"

## ステップ 14：前のバージョンのフィルタリングノードを削除

バージョン 4.4 のデプロイイメージが正しく動作している場合は、Wallarm コンソールの **Nodes** セクションで前のバージョンのフィルタリングノードを削除できます。

## ステップ 15：アクティブな脅威検証モジュールを再度有効にする（ノード 2.16 以下をアップグレードする場合のみ）

アクティブな脅威検証モジュールの設定に関する[推奨事項](../../admin-en/attack-rechecker-best-practices.ja.md)を確認し、必要に応じてそれを再度有効にしてください。

しばらくして、モジュールの動作が誤検知を引き起こさないことを確認してください。 誤検出が発見された場合、[Wallarm の技術サポート](mailto:support@wallarm.com)にお問い合わせください。