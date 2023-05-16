# Wallarmノードの新機能（EOLノードのアップグレード時）

このページでは、非推奨バージョンのノード（バージョン3.6以下）からバージョン4.4へのアップグレード時に利用可能な変更点をリストアップしています。リストアップされた変更点は、通常（クライアント）用およびマルチテナントWallarmノードの両方で利用可能です。

!!! warning "Wallarmノード 3.6およびそれ以下のバージョンは非推奨です"
    Wallarmノード 3.6およびそれ以下のバージョンは、非推奨であるため、アップグレードが推奨されています[deprecated](../versioning-policy.md#version-list)。

    ノードの設定とトラフィックフィルタリングは、バージョン 4.x の Wallarm ノードで大幅に簡略化されています。ノード 4.x のいくつかの設定は、旧バージョンのノードと**互換性がありません**。モジュールのアップグレード前に、変更点と[一般的な推奨事項](../general-recommendations.md)をよく確認してください。

## 削除されたメトリックスによる破壊的変更

バージョン4.0から、Wallarmノードは以下のcollectdメトリックスを収集しません：

* `curl_json-wallarm_nginx/gauge-requests` - 代わりに、[`curl_json-wallarm_nginx/gauge-abnormal`](../../admin-en/monitoring/available-metrics.md#number-of-requests)メトリックを使用できます
* `curl_json-wallarm_nginx/gauge-attacks`
* `curl_json-wallarm_nginx/gauge-blocked`
* `curl_json-wallarm_nginx/gauge-time_detect`
* `curl_json-wallarm_nginx/derive-requests`
* `curl_json-wallarm_nginx/derive-attacks`
* `curl_json-wallarm_nginx/derive-blocked`
* `curl_json-wallarm_nginx/derive-abnormal`
* `curl_json-wallarm_nginx/derive-requests_lost`
* `curl_json-wallarm_nginx/derive-tnt_errors`
* `curl_json-wallarm_nginx/derive-api_errors`
* `curl_json-wallarm_nginx/derive-segfaults`
* `curl_json-wallarm_nginx/derive-memfaults`
* `curl_json-wallarm_nginx/derive-softmemfaults`
* `curl_json-wallarm_nginx/derive-time_detect`

## 新しい攻撃タイプの検出

Wallarmは新しい攻撃タイプを検出します：

* [Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) (BOLA)は、[Insecure Direct Object References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References) (IDOR)とも呼ばれ、APIの脆弱性として非常に一般的になっています。アプリケーションにIDOR / BOLAの脆弱性が含まれている場合、攻撃者に機密情報やデータが漏洩する可能性が高くなります。攻撃者は、API呼び出しで自身のリソースIDを他のユーザーのリソースIDと交換するだけで済みます。適切な認証チェックがないため、攻撃者は指定されたリソースにアクセスできます。そのため、オブジェクトのIDを受け取り、オブジェクトに対して何らかのアクションを実行するすべてのAPIエンドポイントが攻撃対象になります。

    この脆弱性を悪用されないようにするために、Wallarmノード 4.2 以降には、BOLA攻撃からエンドポイントを保護するために使用できる[新しいトリガー](../../admin-en/configuration-guides/protecting-against-bola.md)が含まれています。トリガーは、指定されたエンドポイントへのリクエスト数を監視し、トリガーからの閾値を超えるとBOLA攻撃イベントを生成します。
* [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)

    Mass Assignment 攻撃では、攻撃者は HTTP リクエストパラメータをプログラムコード変数やオブジェクトにバインドしようと試みます。API が脆弱でバインドを許可している場合、攻撃者は公開されることを意図していない機密オブジェクトプロパティを変更する可能性があり、これにより権限昇格、セキュリティ機構のバイパスなどが発生する可能性があります。
* [SSRF](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)

    成功したSSRF攻撃により、攻撃者は攻撃されたWebサーバーに代わってリクエストを送信することができます。これにより、Webアプリケーションの使用中のネットワークポートを明らかにし、内部ネットワークをスキャンし、認証をバイパスする可能性があります。

## JSON Web Token の強度の確認

[JSON Web Token (JWT)](https://jwt.io/)は、APIのようなリソース間で安全にデータを交換するために使用される人気のある認証標準です。JWT の割れやすさは攻撃者の一般的な目的であり、認証機構を破ることで Web アプリケーションや API への完全なアクセスが可能になります。JWTが弱いほど、割れる可能性が高くなります。

バージョン4.4から、Wallarmを有効にすることで、以下のJWTの弱点を検出できます：

* 暗号化されていない JWT
* 侵害された秘密鍵を使用して署名された JWT

有効にするには、[**Weak JWT** トリガー](../../user-guides/triggers/trigger-examples.md#detect-weak-jwts)を使用してください。

## JSON Web Tokensを攻撃対象として確認する

JSON Web Token (JWT)は、最も一般的な認証方法の1つです。これにより、SQLiやRCEなどの攻撃に使用されるツール、リクエスト内のどこにでもJWTを検出し、データが暗号化され、バージョン4.2以上のWallarmノードが入っています。

Wallarmノード 4.2 以降では、リクエスト内のどこにでも JWT を見つけ、[デコード](../../user-guides/rules/request-processing.md#jwt)し、適切な[フィルタリングモード](../../admin-en/configure-wallarm-mode.md)でこの認証方法を通じた攻撃試行をブロックします。

## サポートされているインストールオプション

* Wallarm Ingress コントローラは、最新バージョンのCommunity Ingress NGINX Controller、1.6.4をベースにしています。

    [Wallarm Ingress コントローラへの移行方法 →](ingress-controller.md)
* [廃止された](https://www.centos.org/centos-linux-eol/) CentOS 8.xを代わりに、AlmaLinux、Rocky Linux、およびOracle Linux 8.xがサポートされました。

    代替オペレーティングシステム用のWallarmノードパッケージは、CentOS 8.xリポジトリに格納されます。
* Debian 11 Bullseyeへのサポートが追加されました
* Ubuntu 22.04 LTS（jammy）に対応しました
* CentOS 6.x（CloudLinux 6.x）のサポートが削除されました
* Debian 9.xのサポートが削除されました
* Debian 10.x は、Wallarm を NGINX 安定版または NGINX Plus のモジュールとしてインストールするのに対応しなくなりました
* Ubuntu 16.04 LTS （xenial）のサポートが削除されました
* [Wallarm Envoy-based Dockerイメージ](../../admin-en/installation-guides/envoy/envoy-docker.md)で使用されるEnvoyのバージョンが[1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)に上がりました。

[サポートされているインストールオプションの完全なリストを参照 →](../../installation/supported-deployment-options.md)

## サーバーレスWallarmノード展開の新しい方法

新しい展開方法では、Wallarm CDNノードをインフラ外で15分で設定することができます。保護するドメインを指定し、ドメインのDNSレコードにWallarm CNAMEレコードを追加するだけです。

[CDNノード展開の手順](../../installation/cdn-node.md)

## フィルタリングノードのインストールに必要なシステム要件

* フィルタリングノードは、IPアドレスの[許可リスト、拒否リスト、およびグレイリスト](../../user-guides/ip-lists/overview.md)に対応しています。Wallarm Consoleでは、許可リスト、拒否リスト、またはグレイリストにIPを1つずつ追加するだけでなく、**国**や**データセンター**も追加できます。

    Wallarmノードは、許可された、拒否された、またはグレイリスト化された国、地域、またはデータセンターから登録されたIPアドレスの実際のリストをGCPストレージからダウンロードします。デフォルトでは、このストレージへのアクセスはシステムで制限されています。GCPストレージへのアクセスを許可することが、仮想マシンにフィルタリングノードをインストールするための新しい要件です。

    [許可すべきGCP IPアドレスの範囲 →](https://www.gstatic.com/ipranges/goog.json)
* フィルタリングノードは、現在、`us1.api.wallarm.com:443`（USクラウド）と`api.wallarm.com:443`（EUクラウド）を使用して、`us1.api.wallarm.com:444`および`api.wallarm.com:444`でクラウドへデータをアップロードしています。

    展開済みノードを持つサーバーが限定された外部リソースへのアクセスを持ち、各リソースへのアクセスが個別に許可される場合、バージョン4.xへのアップグレード後、フィルタリングノードとクラウド間の同期が停止します。アップグレードされたノードには、新しいポートとともにAPIエンドポイントへのアクセスが許可される必要があります。## Wallarm Cloud でのノードの統一登録トークン

リリース 4.x では、[対応しているどのプラットフォーム](../../installation/supported-deployment-options.md)でも、**トークン**によって Wallarm ノードを Wallarm Cloud に登録できるようになります。以前のバージョンの Wallarm ノードは、いくつかのプラットフォームで「メールアドレス-パスワード」のユーザー認証情報が必要でした。

トークンでのノードの統一登録により、Wallarm Cloud への接続がより安全で高速になります。例えば、

* ノードのインストールのみを許可する**Deploy**ロールの専用ユーザーアカウントは不要になります。
* ユーザーのデータは Wallarm Cloud で安全に保管され続けます。
* ユーザーアカウントで二要素認証が有効になっていても、ノードが Wallarm Cloud に登録されることを妨げません。
* 初期トラフィック処理とリクエストポストアナリティクスモジュールが別のサーバーにデプロイされている場合、1つのノードトークンで Cloud に登録できます。

ノード登録方法の変更により、ノードタイプのいくつかのアップデートがあります。

* トークンでの統一登録をサポートするノードは、**Wallarm ノード**タイプです。ノードを登録するためにサーバーで実行するスクリプトの名前は `register-node` です。

    以前は、Wallarm ノードは [** クラウドノード **](/2.18/user-guides/nodes/cloud-node/) と呼ばれていました。これもトークンによる登録をサポートしていましたが、異なるスクリプト名の `addcloudnode` でした。

    クラウドノードは新しいノードタイプにマイグレーションする必要はありません。
* 「メールアドレス-パスワード」を `addnode` スクリプトに渡すことで登録をサポートする [** 通常ノード **](/2.18/user-guides/nodes/regular-node/) は非推奨となりました。

    バージョン 4.0 から、NGINX、NGINX Plus モジュール、または Docker コンテナとしてデプロイされたノードの登録は以下のようになります。

    1. Wallarmのコンソールで**Wallarmノード**を作成し、生成されたトークンをコピーします。
    1. ノードトークンが渡された `register-node` スクリプトを実行するか、`WALLARM_API_TOKEN` 変数が定義された Docker コンテナを実行します。

    !!! info "Regular node support"
        リリース 4.x で定期的なノードタイプは非推奨となり、今後のリリースで削除される予定です。

        通常タイプが削除される前に、通常ノードを **Wallarmノード**に置き換えることをお勧めします。ノードのアップグレードガイドで適切な手順が見つかります。

## AWS に Wallarm を展開するための Terraform モジュール

リリース 4.0 から、[AWS](https://aws.amazon.com/) に [Wallarm Terraform モジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/) を使用して Infrastructure as Code（IaC）ベースの環境から簡単に Wallarm を展開できるようになります。

Wallarm Terraform モジュールは、セキュリティおよびフェイルオーバーの最高の業界標準を満たすスケーラブルなソリューションです。その展開中、トラフィックフローに対する要件に基づいて、**プロキシ**または**ミラー**の展開オプションを選択できます。

また、AWS VPC Traffic Mirroring などのソリューションと互換性のある基本的な展開構成と上級構成の両方の展開オプションについて使用例も用意しました。

[AWS の Wallarm Terraform モジュールに関するドキュメント](../../installation/cloud-platforms/aws/terraform-module/overview.md)

## `cloud-init.py`スクリプトがすぐに使える状態で配布される Wallarm AWS イメージ

Infrastructure as Code（IaC）アプローチに従っている場合、Wallarm ノードを AWS にデプロイするために [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) スクリプトを使用する必要があるかもしれません。リリース 4.0 から、Wallarm は準備ができた状態の `cloud-init.py` スクリプトが付属している AWS クラウドイメージを配布しています。

[Wallarm `cloud-init` スクリプトの仕様](../../installation/cloud-platforms/cloud-init.md)

## 簡略化されたマルチテナントノードの構成

[マルチテナントノード](../../installation/multi-tenant/overview.md)の場合、テナントとアプリケーションがそれぞれ独自のディレクティブで定義されるようになりました。

* テナントの一意識別子を設定するための [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) NGINX ディレクティブと [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param) Envoy パラメータが追加されました。
* [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) NGINX ディレクティブと [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#application_param) Envoy パラメータの動作が変更されました。これで、アプリケーション ID を構成するために**のみ**使用されます。

[マルチテナントノードのアップグレードに関する手順](../multi-tenant.md)

## フィルタリングモード

* 新しい **安全なブロッキング**フィルタリングモード。

    このモードでは、[グレーリストに登録された IP アドレス](../../user-guides/ip-lists/graylist.md)から発信される悪意のあるリクエストのみをブロックすることで、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)の数を大幅に減らすことができます。
* リクエストの送信元の分析は、現在 `safe_blocking` および `block` モードでのみ実行されます。

    * `off`または`monitoring`モードで動作するWallarmノードが、[denylisted](../../user-guides/ip-lists/denylist.md) IP由来のリクエストに気づいた場合でも、そのリクエストをブロックしません。
    * `monitoring`モードで動作する Wallarm ノードは、[許可リストに登録された IP アドレス](../../user-guides/ip-lists/allowlist.md)から発信されるすべての攻撃を Wallarm Cloud にアップロードします。

[Wallarm ノードモードの詳細 →](../../admin-en/configure-wallarm-mode.md)

## リクエスト送信元の制御

以下のパラメータがリクエストの送信元の制御について非推奨になりました：

* IP アドレスの denylist を構成するために使用されるすべての `acl` NGINX ディレクティブ、Envoy パラメータ、および環境変数。IP denylisting の手動構成は不要になります。

    [denylist の構成の移行の詳細 →](../migrate-ip-lists-to-node-3.md)

リクエスト送信元の制御に関して以下の新機能があります

* IP アドレスの許可リスト、拒否リスト、およびグレーリストを完全に制御するための Wallarm コンソールセクション。
* 新しい [フィルタリングモード](../../admin-en/configure-wallarm-mode.md) `safe_blocking` および [IP アドレスのグレーリスト](../../user-guides/ip-lists/graylist.md) のサポート。

    **安全なブロッキング**モードでは、グレーリストに登録された IP アドレスから発信される悪意のあるリクエストをブロックするだけで、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)の数を大幅に減らすことができます。

    自動 IP アドレスのグレーリストには、新しい [トリガー **グレーリストに追加**](../../user-guides/triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) がリリースされています。
* [Wallarm 脆弱性スキャナー](../../about-wallarm/detecting-vulnerabilities.md#vunerability-scanner) IP アドレスの自動許可リスト化。スキャナー IP アドレスの手動許可リスト化は不要になります。
* サブネット、Tor ネットワーク IP、VPN IP、特定の国、地域、またはデータセンターに登録されている IP アドレスのグループを許可リスト、拒否リスト、またはグレーリストに登録する機能。
* 特定のアプリケーションに対してリクエスト送信元を許可リスト、拒否リスト、またはグレーリストに登録する機能。
* `disable_acl` という新しい NGINX ディレクティブと Envoy パラメータ。これにより、リクエスト元の分析を無効にできます。

    [`disable_acl` NGINX ディレクティブの詳細 →](../../admin-en/configure-parameters-en.md#disable_acl)

    [`disable_acl` Envoy パラメータの詳細 →](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

[許可リスト、拒否リスト、およびグレーリストに IP を追加する方法の詳細 →](../../user-guides/ip-lists/overview.md)

## 新しい API インベントリ発見モジュール

新しい Wallarm ノードでは、アプリケーション API を自動的に識別する**API Discovery**というモジュールが付属しています。このモジュールはデフォルトでは無効になっています。

[API Discovery モジュールの詳細 →](../../about-wallarm/api-discovery.md)## libdetection ライブラリを使用した強化された攻撃分析

Wallarm によって実行された攻撃分析は、追加の攻撃検証レイヤーを含めることで強化されました。Wallarm ノード 4.4 以降のすべての形態 (Envoy を含む) は、デフォルトで libdetection ライブラリが有効になっています。このライブラリは、すべての [SQLi](../../attacks-vulns-list.md#sql-injection) の攻撃に対して二次的な完全に文法ベースの検証を実行し、SQL インジェクションの間に検出された誤検出の数を減らします。

!!! warning "メモリ消費量増加"
    **libdetection** ライブラリが有効になっていると、NGINX/Envoy および Wallarm プロセスによって消費されるメモリ量が約 10% 増加する場合があります。

[Wallarm が攻撃を検出する方法の詳細 →](../../about-wallarm/protecting-against-attacks.md)

## `overlimit_res` 攻撃検出の微調整を有効にするルール

新しい [ルールを導入して `overlimit_res` 攻撃検出の微調整を許可する](../../user-guides/rules/configure-overlimit-res-detection.md) 。

`overlimit_res` 攻撃検出の微調整は、NGINX と Envoy の設定ファイルを介して行うことが非推奨とされています。

* このルールでは、`wallarm_process_time_limit` NGINX ディレクティブおよび `process_time_limit` Envoy パラメータが以前行っていたように、単一のリクエスト処理時間制限を設定できます。
* このルールは、`wallarm_process_time_limit_block` NGINX ディレクティブおよび `process_time_limit_block` Envoy パラメータの設定の代わりに、[ノードのフィルタリングモード](../../admin-en/configure-wallarm-mode.md) に従って `overlimit_res` の攻撃をブロックまたは渡すことができます。

これらのディレクティブとパラメータは非推奨とされ、今後のリリースで削除される予定です。それ以前に、ディレクティブからのルールへの `overlimit_res` 攻撃検出設定の移行が推奨されます。それぞれの [ノード展開オプション](../general-recommendations.md#update-process) に関連する指示が提供されます。

リストに記載されたパラメータが設定ファイルに明示的に指定されており、ルールがまだ作成されていない場合、ノードは設定ファイルに設定されているようにリクエストを処理します。

## 新しいブロックページ

サンプルのブロックページ `/usr/share/nginx/html/wallarm_blocked.html` が更新されました。新しいノードバージョンでは、新しいレイアウトが追加され、ロゴとサポートメールのカスタマイズがサポートされています。

新しいブロックページは、デフォルトで以下のように新しいレイアウトで表示されます。

![!Wallarm ブロックページ](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[ブロックページの設定に関する詳細 →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## 基本的なノード設定の新しいパラメータ

* Wallarm NGINX ベースの Docker コンテナに渡す新しい環境変数：
    * Wallarm Cloud で使用される保護対象アプリケーションの識別子を設定するための `WALLARM_APPLICATION` 。
    * Docker コンテナ内で NGINX が使用するポートを設定するための `NGINX_PORT` 。

    [Wallarm NGINX ベースの Docker コンテナの展開手順 →](../../admin-en/installation-docker-en.md)

* Wallarm Cloud とフィルタリングノードの同期を設定するためのファイル `node.yaml` の新しいパラメータ：`api.local_host` および `api.local_port`。新しいパラメータでは、Wallarm API へのリクエストを送信するためのネットワークインターフェイスのローカル IP アドレスとポートを指定できます。

    [Wallarm Cloud およびフィルタリングノードとの同期設定のための `node.yaml` パラメータの完全なリストを見る →](../../admin-en/configure-cloud-node-synchronization-en.md#credentials-to-access-the-wallarm-cloud)

## NGINX ベースの Wallarm Docker コンテナの IPv6 接続の無効化

NGINX ベースの Wallarm Docker イメージ 4.2 以降では、新しい環境変数 `DISABLE_IPV6` がサポートされています。この変数を使用すると、NGINX が IPv6 接続処理を防止し、IPv4 接続のみを処理できます。

## パラメータ、ファイル、およびメトリックの名前変更

* 以下の NGINX ディレクティブおよび Envoy パラメータの名前が変更されました：
    * NGINX: `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * NGINX: `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
    * Envoy: `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * Envoy: `tsets` セクション → `rulesets`、このセクションの `tsN` エントリ → `rsN`
    * Envoy: `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)

    これらの古い名前のパラメータはまだサポートされていますが、今後のリリースで非推奨となります。パラメーターのロジックは変わりません。
* Ingress [アノテーション](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance` の名前が `nginx.ingress.kubernetes.io/wallarm-application` に変更されました。

    以前の名前のアノテーションはまだサポートされていますが、今後のリリースで非推奨となります。アノテーションのロジックは変わりません。
* カスタム ルールセット ビルドのファイル `/etc/wallarm/lom` の名前が `/etc/wallarm/custom_ruleset` に変更されました。新しいノード バージョンのファイル システムには、新しい名前のファイルのみがあります。

    NGINX ディレクティブ [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) および Envoy パラメータ [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) のデフォルト値が適切に変更されました。新しいデフォルト値は `/etc/wallarm/custom_ruleset` です。
* プライベート キー ファイル `/etc/wallarm/license.key` の名前が `/etc/wallarm/private.key` に変更されました。ノード バージョン 4.0 以降では、新しい名前がデフォルトで使用されます。
* collectd メトリック `gauge-lom_id` の名前が `gauge-custom_ruleset_id` に変更されました。

    新しいノード バージョンでは、collectd サービスは廃止されたメトリックと新しいメトリックの両方を収集します。廃止されたメトリックの収集は、今後のリリースで停止されます。

    [すべての collectd メトリック →](../../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)
* Docker コンテナの [ログ ファイル](../../admin-en/configure-logging.md) `/var/log/wallarm/addnode_loop.log` の名前が `/var/log/wallarm/registernode_loop.log` に変更されました。

## 統計サービスのパラメータ

* denylisted IP からのリクエスト数が、新しいパラメータ `blocked_by_acl` および既存のパラメータ `requests`, `blocked` に、統計サービスの出力に表示されるようになりました。
* サービスは、Wallarm ノードによって使用される [カスタムルールセット](../../glossary-en.md#custom-ruleset-the-former-term-is-lom) の形式を指す新しいパラメータ `custom_ruleset_ver` を返します。
* 以下のノード統計パラメータの名前が変更されました：

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    新しいノードバージョンでは、`http://127.0.0.8/wallarm-status` エンドポイントは、一時的に廃止されたパラメータと新しいパラメータの両方を返します。廃止されたパラメータは、今後のリリースでサービス出力から削除されます。

[統計サービスの詳細 →](../../admin-en/configure-statistics-service.md)ノードのログ形式を設定するための新しい変数

以下の[ノードログ変数](../../admin-en/configure-logging.md#filter-node-variables)が変更されました：

* `wallarm_request_time`は、`wallarm_request_cpu_time`に名前が変更されました

    この変数は、CPUがリクエストの処理にかかった時間を秒単位で表します。

    以前の名前の変数は非推奨となり、今後のリリースで削除されます。変数のロジックは変更されていません。
* `wallarm_request_mono_time`が追加されました

    この変数は、CPUがリクエスト処理にかかった時間 + キュー内の時間を秒単位で表します。

## デニーリストにあるIPからのリクエストにおいて、攻撃の検索を省略することでパフォーマンスを向上させる

新しい[`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase)ディレクティブにより、[デニーリスト](../../user-guides/ip-lists/denylist.md)内のIPからのリクエストの解析中に攻撃検索ステージを省略することで、Wallarmノードのパフォーマンスを向上させることができます。この設定オプションは、多数のデニーリストIP（全国を対象とした場合など）が高負荷のトラフィックを発生させ、稼働するCPUを大幅に負荷がかかる場合に有用です。

## アップグレードプロセス

1. [モジュールのアップグレードに関する推奨事項](../general-recommendations.md)を確認してください。
2. Wallarmノードの展開方法に従ってインストール済みのモジュールをアップグレードしてください：

      * [NGINX、NGINX Plus用のモジュールをアップグレードする](nginx-modules.md)
      * [NGINXまたはEnvoy用のDockerコンテナでモジュールをアップグレードする](docker-container.md)
      * [Wallarmモジュールが統合されたNGINX Ingressコントローラーをアップグレードする](ingress-controller.md)
      * [クラウドノードイメージ](cloud-image.md)
      * [マルチテナントノード](multi-tenant.md)
      * [CDNノード](../cdn-node.md)
3. 以前のWallarmノードのバージョンから4.4への許可リストとデニーリストの設定を[移行](../migrate-ip-lists-to-node-3.md)してください。

----------

[Wallarm製品とコンポーネントのその他の更新 →](https://changelog.wallarm.com/)