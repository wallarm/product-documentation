```markdown
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

# 終了ライフサイクルになったクラウドノードイメージのアップグレード

これらの手順では、AWSまたはGCP上に展開された終了ライフサイクルのクラウドノードイメージ（バージョン3.6以下）を5.0までアップグレードする手順を説明します。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## 必要条件

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## 手順 1: filtering nodeモジュールをアップグレードする旨をWallarm technical supportに通知する（ノード2.18以下のアップグレードの場合のみ）

ノード2.18以下をアップグレードする場合、最新バージョンまでfiltering nodeモジュールをアップグレードする旨を[Wallarm technical support](mailto:support@wallarm.com)に通知し、Wallarmアカウント用に新しいIPリストロジックを有効にするよう依頼してください。新しいIPリストロジックが有効になった場合は、Wallarm Consoleの[**IP lists**](../../user-guides/ip-lists/overview.md)セクションが利用可能であることを確認してください。

## 手順 2: Threat Replay Testingモジュールを無効にする（ノード2.16以下のアップグレードの場合のみ）

Wallarm node 2.16以下をアップグレードする場合、Wallarm Console内の[Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールを、Console → **Vulnerabilities** → **Configure**から無効にしてください。

アップグレード作業中に、このモジュールの動作が[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)を引き起こす可能性があります。モジュールを無効にすることで、このリスクを最小限に抑えます。

## 手順 3: APIポートの更新

--8<-- "../include/waf/upgrade/api-port-443.md"

## 手順 4: 最近のアーキテクチャの更新を確認する

最新のアップデートでは、ユーザーに影響を及ぼす可能性のある[アーキテクチャ変更](what-is-new.md#optimized-cloud-images)が導入されました。特に、ノードのデフォルト構成ファイルを変更するユーザーは、これらの変更点を十分に理解し、新しいイメージの正しい構成および使用を確保してください。

## 手順 5: filtering node 5.0を用いて新しいインスタンスを起動する

前のWallarm nodeバージョンの以下の構成ファイルから、リクエスト処理およびプロキシ設定をfiltering node 5.0のファイルにコピーしてください：

1. クラウドプラットフォームのマーケットプレイスでWallarm filtering nodeイメージを開き、イメージの起動を進めます：
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. 起動時の手順において、以下の設定を行います：
      * イメージバージョン `5.0.x` を選択します
      * AWSの場合、**Security Group Settings**フィールドに[作成済みのセキュリティグループ](../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group)を選択します
      * AWSの場合、**Key Pair Settings**フィールドに[作成済みのキーペア](../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws)の名前を選択します
3. インスタンスの起動を確認します。
4. GCPの場合、これらの[手順](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance)に従いインスタンスを構成します。

## 手順 6: 最新バージョンでリリースされた変更に合わせてWallarm nodeのfiltration mode設定を調整する（ノード2.18以下のアップグレードの場合のみ）

1. 以下に記載されている設定の期待動作が、[`off`および`monitoring` filtration modesの変更されたロジック](what-is-new.md#filtration-modes)に対応していることを確認します：
      * [ディレクティブ `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで構成された一般的なfiltrationルール](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Wallarm Consoleで構成されたエンドポイント対象のfiltrationルール](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
2. 期待される動作が変更されたfiltration modeロジックに対応していない場合は、[手順](../../admin-en/configure-wallarm-mode.md)に従いfiltration mode設定を変更された内容に調整してください。

## 手順 7: filtering nodeをWallarm Cloudに接続する

1. SSH経由でfiltering nodeインスタンスに接続します。インスタンスへの接続に関する詳細な手順はクラウドプラットフォームのドキュメントで確認できます：
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. 新しいWallarm nodeを作成し、生成されたトークンを使用してWallarm Cloudに接続します。詳細は各クラウドプラットフォームの手順に記載されています：
      * [AWS](../../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud)
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-instance-to-the-wallarm-cloud)

## 手順 8: 既存バージョンから新しいバージョンへfiltering node設定をコピーする

1. 前のWallarm nodeバージョンの以下の構成ファイルからリクエスト処理およびプロキシ設定を、filtering node 5.0のファイルにコピーします：
      * `/etc/nginx/nginx.conf`およびその他のNGINX設定ファイル
      * filtering nodeの監視サービス設定が含まれる`/etc/nginx/conf.d/wallarm-status.conf`

        コピーされたファイルの内容が[推奨される安全な構成](../../admin-en/configure-statistics-service.md#setup)に対応していることを確認してください。

      * 環境変数を含む`/etc/environment`
      * リクエスト処理およびプロキシのためのその他のカスタム構成ファイル（最近の[アーキテクチャ変更](what-is-new.md#optimized-cloud-images)を考慮したもの）
1. 構成ファイルで明示的に指定されている場合、以下のNGINXディレクティブの名前を変更してください：
    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    ディレクティブの名前のみ変更しており、ロジックはそのままです。従来の名前のディレクティブは近い将来非推奨になるため、事前に名称を変更することを推奨します。
1. もし[extended logging format](../../admin-en/configure-logging.md#filter-node-variables)が設定されている場合、構成内で `wallarm_request_time` 変数が明示的に指定されているか確認してください。

      もし指定されている場合は、`wallarm_request_cpu_time` に名称を変更してください。

      変数名のみ変更しており、ロジックはそのままです。旧名称も一時的にサポートされていますが、引き続き名称の変更を推奨します。
1. ノード2.18以下をアップグレードする場合、前のWallarm nodeバージョンから5.0への[allowlistおよびdenylist構成の移行](../migrate-ip-lists-to-node-3.md)を行ってください。
1. ブロックリクエストに対してページ `&/usr/share/nginx/html/wallarm_blocked.html` が返される場合は、新しいバージョンを[コピーしてカスタマイズ](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)してください。

      新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更され](what-is-new.md#new-blocking-page)、ロゴおよびサポート用のメールアドレスはデフォルトで空になっています。

NGINX構成ファイルの扱いに関する詳細情報は、[公式NGINXドキュメント](https://nginx.org/docs/beginners_guide.html)を参照してください。

filtering nodeディレクティブの一覧は[こちら](../../admin-en/configure-parameters-en.md)で確認できます。

## 手順 8: ディレクティブからルールへ `overlimit_res`攻撃検出構成を移行する

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## 手順 9: NGINXの再起動

設定を適用するためにNGINXを再起動します：

```bash
sudo systemctl restart nginx
```

## 手順 10: Wallarm nodeの動作テスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 手順 11: AWSまたはGCP上でfiltering node 5.0に基づいた仮想マシンイメージを作成する

filtering node 5.0に基づいた仮想マシンイメージを作成するため、[AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md)または[GCP](../../admin-en/installation-guides/google-cloud/create-image.md)の手順に従ってください。

## 手順 12: 以前のWallarm nodeインスタンスを削除する

新しいfiltering nodeのバージョンが正しく構成されテストされた場合、AWSまたはGCPの管理コンソールを使用して、以前のバージョンのインスタンスおよび仮想マシンイメージを削除してください。

## 手順 13: Threat Replay Testingモジュールを再有効化する（ノード2.16以下のアップグレードの場合のみ）

Threat Replay Testingモジュールの設定に関する[推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md)を確認し、必要に応じて再有効化してください。

しばらく経過後、モジュールの動作が誤検知を引き起こさないことを確認してください。もし誤検知が発見された場合は、[Wallarm technical support](mailto:support@wallarm.com)に連絡してください。
```