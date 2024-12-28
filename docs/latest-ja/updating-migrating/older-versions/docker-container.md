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
[graylist-docs]:                     ../../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]:    ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block

# Docker NGINXもしくはEnvoyベースイメージのEOLアップグレード

これらの指示事項は、動作している Docker NGINX もしくは Envoy ベースのイメージ (バージョン 3.6 と以前のもの) をバージョン 4.6 にアップグレードするための手順を説明しています。

--8<-- "../include-ja/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

## Step 1: Wallarm テクニカルサポートにフィルタリングノードモジュールをアップグレードすることを伝える (ノード2.18以下をアップグレードする場合のみ)

ノード2.18以下をアップグレードする場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にフィルタリングノードモジュールを4.6までアップグレードすると通知し、あなたの Wallarm アカウント用の新しい IP リストロジックを有効にするよう依頼してください。新しい IP リストロジックが有効になったら、Wallarm Console の [**IP lists**](../../user-guides/ip-lists/overview.md) セクションが利用可能であることを確認してください。

## Step 2: アクティブな脅威確認モジュールを無効化する (ノード2.16以下をアップグレードする場合のみ)

Wallarm ノード 2.16 以下をアップグレードする場合、Wallarm Console → **Vulnerabilities** → **Configure** で [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) モジュールを無効にしてください。

モジュールの動作は、アップグレードプロセス中に [False Positives](../../about-wallarm/protecting-against-attacks.md#false-positives) を引き起こす可能性があります。モジュールを無効にすることで、このリスクを最小限に抑えられます。

## Step 3: API ポートをアップデートする

--8<-- "../include-ja/waf/upgrade/api-port-443.md"

## Step 4: 更新されたフィルタリングノードイメージをダウンロードする

=== "NGINX-based image"
    ``` bash
    docker pull wallarm/node:4.6.2-1
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:4.6.2-1
    ```

## Step 5: Wallarm Cloudへのトークンベースの接続に切り替える

バージョン4.xのリリースに伴い、コンテナがWallarm Cloudに接続する手法が以下のようにアップグレードされました：

* [「メールアドレスとパスワード」を使用した手法は廃止されました](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens)。この手法では、コンテナは`DEPLOY_USER`と`DEPLOY_PASSWORD`の変数に正しい資格情報が渡された状態で起動すると自動的にWallarm Cloudに登録されました。
* トークンベースのアプローチが導入されました。コンテナがクラウドに接続するには、Wallarm Console UIからコピーしたWallarmのノードトークンを含む`WALLARM_API_TOKEN`変数を使用してコンテナを実行します。

新しいアプローチを使用してイメージ4.6を実行することを推奨します。「メールアドレスとパスワード」を使用したアプローチは将来的なリリースで削除される予定であるため、それまでに移行してください。

新しいWallarmノードを作成し、そのトークンを取得するには：

1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。

    ![Wallarm ノードの作成](../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。

## Step 6: 前のバージョンのWallarmノードから4.6への許可リストと拒否リストを移行する (ノード2.18以下をアップグレードする場合のみ)

ノード2.18以下をアップグレードする場合は、前のバージョンのWallarmノードから4.6までの許可リストと拒否リストの設定を [移行](../migrate-ip-lists-to-node-3.md) します。

## Step 7: 非推奨の設定オプションから切り替える

以下の非推奨を設定オプションがあります：

* `WALLARM_ACL_ENABLE` 環境変数は非推奨となっています。IPリストを新しいノードバージョンに [移行](../migrate-ip-lists-to-node-3.md) した場合、この変数を `docker run` コマンドから削除してください。
* 次の NGINX ディレクティブが変更されました：

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    ディレクティブの名前だけを変更しました、そのロジックはそのままです。以前の名前のディレクティブはすぐに非推奨となる予定なので、それ以前に名前を変更することをお勧めします。
    
    マウントされた設定ファイルで以前の名前のディレクティブが明示的に指定されているかどうかを確認してください。指定されている場合は、それらをリネームしてください。
* `wallarm_request_time` [ログ変数](../../admin-en/configure-logging.md#filter-node-variables) が `wallarm_request_cpu_time` にリネームされました。

    変数名だけを変更しました、そのロジックはそのままです。しかし、以前の名前も一時的にサポートされていますが、それでも変数の名前を変更することを推奨します。
* 次の Envoy パラメータがリネームされました：

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * `tsets` セクション → `rulesets`、そしてそれに対応する `tsN` エントリーはこのセクションで → `rsN`
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

    パラメータの名前だけを変更しました、そのロジックはそのままです。以前の名前のパラメータはすぐに非推奨となる予定なので、それ以前に名前を変更することをお勧めします。
    
    マウントされた設定ファイルで以前の名前のパラメータが明示的に指定されているかどうか確認してください。指定されている場合は、それらをリネームしてください。

## Step 8: Wallarmブロッキングページを更新する (NGINXベースイメージをアップグレードする場合)

新しいノードバージョンでは、Wallarmのサンプルブロッキングページが [変更されました](what-is-new.md#new-blocking-page)。ページ上のロゴとサポートメールはデフォルトで空になっています。

Dockerコンテナが設定されていたブロックリクエストに対して`&/usr/share/nginx/html/wallarm_blocked.html`ページを返すように設定されていた場合は、次のように設定を変更します：

1. [サンプルページの新しいバージョンをコピーしてカスタマイズします](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)。
1. 次のステップで新しいDockerコンテナに [カスタマイズされたページとNGINX設定ファイルをマウントします](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)。

## Step 9: `overlimit_res` 攻撃検出設定をディレクティブからルールへ転送する

--8<-- "../include-ja/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## Step 10: 動作しているコンテナを停止する

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 11: 更新されたイメージを使用してコンテナを実行する

更新されたイメージを使用してコンテナを実行します。 以前のイメージバージョンを実行するときに渡された同じ設定パラメータを渡すことができますが、前のステップでリストされたパラメータを除きます。

更新されたイメージを使用してコンテナを実行するための２つのオプションがあります：

* **環境変数を使用して**基本的なフィルタリングノード設定を指定する
    * [NGINX ベースの Docker コンテナに対する指示事項 →](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Envoy ベースの Docker コンテナに対する指示事項 →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **マウンティドの設定ファイルに含まれる**詳細なフィルタリングノード設定を指定する
    * [NGINX ベースの Docker コンテナに対する指示事項 →](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [Envoy ベースの Docker コンテナに対する指示事項 →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Step 12: Wallarm ノードのフィルタリングモード設定を最新バージョンでリリースされた変更に合わせて調整する (ノード2.18以下をアップグレードする場合のみ)

1. 以下にリストされている設定の期待される動作が['off'と'monitoring'フィルタリングモードの変更したロジック](what-is-new.md#filtration-modes)に対応していることを確認します：
      * 環境変数[`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)またはNGINXベースのDockerコンテナのディレクティブ[`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * 環境変数[`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)またはEnvoyベースのDockerコンテナのディレクティブ[`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
      * [Wallarm Consoleで設定された一般的なフィルタリングルール](../../admin-en/configure-wallarm-mode.md)
      * [Wallarm Consoleで設定された低レベルのフィルタリングルール](../../admin-en/configure-wallarm-mode.md)
2. 期待される動作が変更されたフィルタリングモードのロジックに対応していない場合は、以下の [指示事項](../../admin-en/configure-wallarm-mode.md) を使用して、フィルタリングモードの設定をリリースされた変更に合わせて調整してください。

## Step 13: フィルタリングノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-after-node-type-upgrade.md"

## Step 14: 前のバージョンのフィルタリングノードを削除する

バージョン4.6のデプロイされたイメージが正常に動作することが確認できたら、Wallarm Console → **Nodes**セクションで前のバージョンのフィルタリングノードを削除できます。

## Step 15: アクティブな脅威確認モジュールを再度有効にする (ノード2.16以下をアップグレードする場合のみ)

[アクティブな脅威確認モジュールの設定に関する推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md) を確認し、必要に応じて再度有効にしてください。

しばらくしてから、モジュールの動作が偽陽性を引き起こさないことを確認してください。偽陽性が発見された場合は、[Wallarm テクニカルサポート](mailto:support@wallarm.com)にご連絡ください。