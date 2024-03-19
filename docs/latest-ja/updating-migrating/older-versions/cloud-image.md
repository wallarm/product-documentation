[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md

# EOLクラウドノードイメージのアップグレード

これらの指示は、AWSまたはGCPにデプロイされた製品寿命の終わりのクラウドノードイメージ（バージョン3.6以下）を4.6までアップグレードする手順を説明しています。

--8<-- "../include-ja/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

## ステップ1：フィルタリングノードモジュールをアップグレードすることをWallarm技術サポートに通知します（ノード2.18以下をアップグレードする場合のみ）

ノード2.18以下をアップグレードする場合は、最新バージョンまでフィルタリングノードモジュールをアップグレードすることを[Wallarm技術サポート](mailto:support@wallarm.com)に伝え、Wallarmアカウントの新しいIPリストロジックを有効にするように依頼してください。新しいIPリストロジックが有効になったら、Wallarmコンソールの[**IPリスト**](../../user-guides/ip-lists/overview.md)セクションが利用可能であることを確認してください。

## ステップ2：アクティブな脅威検証モジュールを無効にします（ノード2.16以下をアップグレードする場合のみ）

Wallarmノード2.16以下をアップグレードする場合は、Wallarmコンソール→ **脆弱性** → **設定** で[アクティブな脅威検証](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)モジュールを無効にしてください。

モジュールの操作により、アップグレードプロセス中に[偽陽性](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生する可能性があります。モジュールを無効にすることで、このリスクを最小限に抑えることができます。

## ステップ3：APIポートを更新します

--8<-- "../include-ja/waf/upgrade/api-port-443.md"

## ステップ4：フィルタリングノード4.6を使った新しいインスタンスを開始します

1. クラウドプラットフォームマーケットプレイスでWallarmのフィルタリングノードイメージを開き、イメージの起動に進みます。
      * [Amazonマーケットプレイス](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCPマーケットプレイス](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. 起動ステップでは、次の設定を行います：

      * イメージバージョン`4.6.x`を選択します
      * AWSの場合、フィールド**Security Group Settings**では[作成したセキュリティグループ](../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group)を選択します
      * AWSの場合、フィールド**Key Pair Settings**では、[作成したキーペア](../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys)の名前を選択します
3. インスタンスの起動を確認します。
4. GCPの場合は、次の[指示](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance)に従ってインスタンスを設定します。

## ステップ5：Wallarmノードのフィルトレーションモード設定を最新バージョンでリリースされた変更に合わせて調整します（ノード2.18以下をアップグレードする場合のみ）

1. 以下の設定が、[`off`と`monitoring`フィルトレーションモードの変更されたロジック](what-is-new.md#filtration-modes)に対応する期待される動作であることを確認します：
      * [`wallarm_mode`ディレクティブ](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarmコンソールで設定された一般的なフィルタリングルール](../../admin-en/configure-wallarm-mode.md)
      * [Wallarmコンソールで設定された低レベルのフィルタリングルール](../../admin-en/configure-wallarm-mode.md)
2. 期待される動作が変更されたフィルトレーションモードのロジックに対応していない場合は、[指示](../../admin-en/configure-wallarm-mode.md)を使用して、フィルトレーションモードの設定をリリースされた変更に調整してください。

## ステップ6：フィルタリングノードをWallarm Cloudに接続します

1. SSHを使用してフィルタリングノードインスタンスに接続します。インスタンスへの接続に関する詳細な指示は、クラウドプラットフォームのドキュメンテーションで利用可能です：
      * [AWSドキュメンテーション](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCPドキュメンテーション](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. 生成されたトークンを使用して新しいWallarmノードを作成し、クラウドプラットフォームの指示に従ってWallarm Cloudに接続します：
      * [AWS](../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## ステップ7：フィルタリングノードの設定を前のバージョンから新しいバージョンにコピーします

1. 前のWallarmノードバージョンの以下の設定ファイルからフィルタリングノード4.6のファイルにリクエストの処理とプロキシ設定をコピーします：
      * `/etc/nginx/nginx.conf`およびその他のNGINX設定ファイル
      * グローバルなフィルタリングノード設定を含む`/etc/nginx/conf.d/wallarm.conf`
      * フィルタリングノードの監視サービス設定を含む`/etc/nginx/conf.d/wallarm-status.conf`

        コピーしたファイルの内容が、[推奨されるセキュアな設定](../../admin-en/configure-statistics-service.md#configuring-the-statistics-service)に対応していることを確認してください。

      * 環境変数を含む`/etc/environment`
      * Tarantool設定を含む`/etc/default/wallarm-tarantool`
      * その他のリクエストの処理とプロキシ設定を含むファイル
1. 次のNGINXディレクティブの名前を変更します（設定ファイルで明示的に指定されている場合）：

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    これらのディレクティブの名前だけが変更されたので、そのロジックは同じままです。以前の名前のディレクティブは近いうちに非推奨になる予定なので、その前に名前を変更することをお勧めします。
1. [拡張ロギングフォーマット](../../admin-en/configure-logging.md#filter-node-variables)が設定されている場合は、`wallarm_request_time`変数が設定で明示的に指定されているかどうかを確認してください。

      もし指定されている場合は、それを`wallarm_request_cpu_time`に変更してください。

      変数名だけが変更されたので、そのロジックは同じままです。古い名前も一時的にサポートされていますが、それでも変数の名前を変更することをお勧めします。
1. ノード2.18以下をアップグレードする場合は、許可リストと拒否リストの設定を前のWallarmノードバージョンから4.6へ[移行](../migrate-ip-lists-to-node-3.md)します。
1. ページ`&/usr/share/nginx/html/wallarm_blocked.html`がブロックされたリクエストに返される場合は、その[新しいバージョンをコピーしてカスタマイズ](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)します。

      新しいノードバージョンでは、Wallarm のサンプルブロックページが[変更され](what-is-new.md#new-blocking-page)ました。ページ上のロゴとサポートメールは、デフォルトでは空になっています。

NGINX設定ファイルの使用に関する詳細な情報は、[公式のNGINXドキュメンテーション](https://nginx.org/docs/beginners_guide.html)で利用可能です。

フィルタリングノードディレクティブのリストは、[こちら](../../admin-en/configure-parameters-en.md)で利用可能です。

## ステップ8： `overlimit_res`攻撃検出設定をディレクティブからルールに転送します

--8<-- "../include-ja/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## ステップ9：NGINXを再起動します

設定を適用するためにNGINXを再起動します：

```bash
sudo systemctl restart nginx
```

## ステップ10：Wallarmノードの動作をテストします

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"
## ステップ11：AWSまたはGCPでフィルタリングノード4.6に基づく仮想マシンのイメージを作成する

フィルタリングノード4.6に基づく仮想マシンイメージを作成するには、[AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md)または[GCP](../../admin-en/installation-guides/google-cloud/create-image.md)の指示に従ってください。

## ステップ12：以前のWallarmノードインスタンスを削除する

フィルタリングノードの新バージョンが正常に設定およびテストされた場合、AWSまたはGCP管理コンソールを使用して以前のフィルタリングノードのバージョンを含むインスタンスと仮想マシンイメージを削除します。

## ステップ13：アクティブな脅威検証モジュールを再有効化する（ノード2.16またはそれ以下をアップグレードする場合のみ）

[アクティブな脅威検証モジュールの設定に関する推奨事項](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md)を学び、必要に応じて再有効化します。

しらべて、モジュールの操作が偽の陽性を引き起こさないことを確認します。偽の陽性を発見した場合、[Wallarm技術サポート](mailto:support@wallarm.com)にご連絡ください。
