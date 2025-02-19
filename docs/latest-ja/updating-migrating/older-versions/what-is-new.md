# Wallarmノードの新機能（EOLノードをアップグレードする際）

このページでは、非推奨のバージョン（3.6以下）のノードをバージョン5.0にアップグレードする際に適用される変更点を記載しております。記載の変更点は、通常（client）ノードとマルチテナントWallarmノードの双方で適用されます。

!!! warning "Wallarmノード3.6以下は非推奨です"
    Wallarmノード3.6以下は、[deprecated](../versioning-policy.md#version-list)であるため、アップグレードすることが推奨されています。

    ノードのバージョン5.xでは、ノード設定およびトラフィックのフィルトレーションが大幅に簡素化されています。ノード5.xの一部設定は、旧バージョンのノードと**互換性がありません**。モジュールをアップグレードする前に、変更点の一覧と[一般的な推奨事項](../general-recommendations.md)を十分に確認してください。

## オールインワンインストーラーおよびDEB/RPMパッケージの非推奨

現在、さまざまな環境においてNGINXのダイナミックモジュールとしてWallarmノードをインストール・アップグレードする際、インストールプロセスを効率化・標準化するために設計された**オールインワンインストーラー**を使用します。このインストーラーは、利用中のOSおよびNGINXのバージョンを自動的に検出し、必要な依存関係をすべてインストールします。

インストーラーは以下の処理を自動的に実行し、プロセスを簡素化します：

1. OSおよびNGINXのバージョンをチェックします。
1. 検出されたOSおよびNGINXのバージョン向けにWallarmリポジトリを追加します。
1. これらのリポジトリからWallarmパッケージをインストールします。
1. インストールされたWallarmモジュールをNGINXに接続します。
1. 提供されたトークンを使用して、フィルタリングノードをWallarm Cloudに接続します。

[オールインワンインストーラーを使用したノードのアップグレード方法の詳細 →](nginx-modules.md)

ノードインストール用のDEB/RPMパッケージは、現在「非推奨」の状態です。

## 削除されたメトリクスによるブレイキングチェンジ

Wallarmノードは、以下のcollectdメトリクスの収集を行いません：

* `wallarm_nginx/gauge-requests` - 代わりに[`wallarm_nginx/gauge-abnormal`](../../admin-en/monitoring/available-metrics.md#number-of-requests)メトリクスをご利用ください
* `wallarm_nginx/gauge-attacks`
* `wallarm_nginx/gauge-blocked`
* `wallarm_nginx/gauge-time_detect`
* `wallarm_nginx/derive-requests`
* `wallarm_nginx/derive-attacks`
* `wallarm_nginx/derive-blocked`
* `wallarm_nginx/derive-abnormal`
* `wallarm_nginx/derive-requests_lost`
* `wallarm_nginx/derive-tnt_errors`
* `wallarm_nginx/derive-api_errors`
* `wallarm_nginx/derive-segfaults`
* `wallarm_nginx/derive-memfaults`
* `wallarm_nginx/derive-softmemfaults`
* `wallarm_nginx/derive-time_detect`

## API Sessions

APIエコノミー向けに特化したユニークなセキュリティ機能、[API Sessions](../../api-sessions/overview.md)を導入しました。この機能により、APIにおける攻撃、不審な動作、ユーザーの挙動を把握でき、ユーザーがAPIやアプリケーションとどのようにやり取りしているかの透明性が向上します。

![!API Sessions section - monitored sessions](../../images/api-sessions/api-sessions.png)

攻撃者は、正当なユーザーの挙動に混じるように脆弱なエンドポイントを悪用することがよくあります。セッションの全体像が分からないと、パターンや脅威の特定には複数のツールやシステムを用いる手間がかかります。組織では、APIレベルで十分な可視性が得られていませんでした。

API Sessionsにより、セキュリティチームはユーザーセッション毎にグループ化されたすべての関連アクティビティを確認でき、攻撃の連鎖、不審な挙動、通常の動作について比類なき可視性が得られます。従来数時間または数日かかっていた調査を、Wallarm Console上で数分で実施できるようになります。

主な機能：

* 攻撃、不審な動作、ユーザー挙動の可視性：各セッション内で行われたリクエストをすべて確認・解析し、攻撃手法や不審なパターンを追跡できます。
* 従来型および最新のセッションの両方に対応：アプリケーションがCookieベースまたはJWT/OAuthベースのセッションに依存している場合でも、Wallarm API Sessionsは完全な互換性と可視性を保証します。
* 個々の攻撃とそれに紐づくセッション間をシームレスに遷移できます。

API Sessionsにより、セキュリティチームは以下の対応が容易になります：

* 脅威アクターの全活動を調査し、潜在的な攻撃経路や侵害された資源を把握する。
* シャドウまたはゾンビAPIへのアクセス状況を特定し、未文書化や旧式のAPIからのリスクを軽減する。
* セキュリティ調査中に同僚と重要な情報を共有する。

[詳細はこちら](../../api-sessions/overview.md)

## API Sessionsにおけるレスポンスパラメータ

!!! tip ""
    現時点では[NGINX Node 5.3.0以上](../node-artifact-versions.md)が対応しており、[Native Node](../native-node/node-artifact-versions.md)では未対応です

Wallarmの[API Sessions](../../api-sessions/overview.md)は、ユーザーの活動シーケンスの可視性を提供します。この機能により、各セッション内ではリクエストのみならずレスポンス情報も利用可能となります：

* 各リクエストに対して、対応するレスポンスの任意のヘッダーやパラメータを表示するように設定でき、ユーザーの活動を完全に把握できます。
* レスポンスパラメータをセッションのグループ化キーとして利用できるため（[例](../../api-sessions/setup.md#grouping-keys-example)参照）、リクエストのセッションごとのグループ化がより正確になります。

![!API Sessions - example of grouping keys in work](../../images/api-sessions/api-sessions-grouping-keys.png)

## レートリミット

適切なレートリミットがないと、攻撃者が大量のリクエストを送信してDoS攻撃やシステムの過負荷を引き起こし、正当なユーザーに影響を及ぼすという重大な問題が生じます。

Wallarmのレートリミット機能により、セキュリティチームはサービスの負荷を効果的に管理し、誤検知を防止しながら、正当なユーザー向けにサービスの継続的な可用性とセキュリティを維持できます。この機能は、従来のIPベースのレートリミットに加え、JSONフィールド、base64エンコードデータ、Cookie、XMLフィールドなど、リクエストやセッションパラメータに基づくさまざまな接続制限を提供します。

例えば、ユーザー毎のAPI接続を制限することで、1分間に数千件のリクエストが送信されるのを防ぎ、サーバーへの過負荷やサービスクラッシュのリスクを回避できます。レートリミットを実装することで、サーバーの過負荷から保護し、すべてのユーザーがフェアにAPIへアクセスできる状態を確保できます。

Wallarm Console UIの→ **Rules** → **Set rate limit**から、使用ケースに応じたレートリミットのスコープ、レート、バースト、ディレイ、レスポンスコードを指定し、簡単にレートリミットを設定できます。

[レートリミット設定の手順 →](../../user-guides/rules/rate-limiting.md)

レートリミットルールは機能の設定に推奨される方法ですが、新たなNGINXディレクティブを用いてレートリミットを設定することも可能です：

* [`wallarm_rate_limit`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit)
* [`wallarm_rate_limit_enabled`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_enabled)
* [`wallarm_rate_limit_log_level`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_log_level)
* [`wallarm_rate_limit_status_code`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_status_code)
* [`wallarm_rate_limit_shm_size`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_shm_size)

## クレデンシャルスタッフィング検出 <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmは、リアルタイムでクレデンシャルスタッフィング攻撃の検出と通知を行います。クレデンシャルスタッフィングは、盗まれたまたは弱いユーザー名／メールアドレスとパスワードの組み合わせをWebサイトのログインフォームに自動で送信し、不正にユーザーアカウントへアクセスする攻撃です。この機能により、クレデンシャルが侵害されたアカウントを特定し、アカウント所有者への通知や一時的なアカウントアクセスの停止などの対策を講じることができます。

[クレデンシャルスタッフィング検出の設定方法を学ぶ](../../about-wallarm/credential-stuffing.md)

![Attacks - credential stuffing](../../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

!!! info "クレデンシャルスタッフィング検出をサポートする一部のアーティファクト"
    オールインワンインストーラー、NGINX Ingress Controller、NGINXベースのDockerイメージ、クラウドイメージ（AMI、GCP Image）など、一部のアーティファクトが、新たに導入されたクレデンシャルスタッフィング検出機能をサポートしています。

## GraphQL API保護 <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmは、GraphQLにおいて、既定でSQLiやRCEなどの通常の攻撃を検出します。しかし、プロトコルの特性上、過度な情報露出やDoSに関連する[GraphQL特有の](../../attacks-vulns-list.md#graphql-attacks)攻撃が実行される可能性もあります。

Wallarmは、これらの攻撃から保護するための対策を導入しました。保護は、組織のGraphQLポリシー（GraphQLリクエストの各種リミットの設定）の構成により実施されます。セットされたリミットを超えるリクエストがある場合、フィルタリングノードは、アクティブなフィルトレーションモードに従い、違反として記録するかブロックします。

この機能を使用開始するには、Wallarm Consoleで少なくとも1つの[**Detect GraphQL attacks**ルール](../../api-protection/graphql-rule.md#creating-and-applying-the-rule)を作成する必要があります。

[GraphQL API保護の設定方法を学ぶ](../../api-protection/graphql-rule.md)

![GraphQL thresholds](../../images/user-guides/rules/graphql-rule.png)

## API Specification Enforcement

今回のアップデートでは、API Specification Enforcement機能を導入しました。これは、API仕様に準拠したリクエストのみを許可するため、着信トラフィックをフィルタリングします。クライアントとアプリケーションの間に位置するWallarmノードが、API仕様書上のエンドポイント記述と実際のAPIリクエストを比較します。未定義のエンドポイントリクエストや、不正なパラメータを含むリクエストは、設定に応じてブロックまたはモニタリングされます。

この機能により、潜在的な攻撃試行を防ぐとともに、APIの過負荷や悪用を回避し、パフォーマンスが最適化されます。

さらに、いくつかのデプロイオプション向けに新たなパラメータが導入され、機能運用の技術的制御が可能となりました：

* オールインワンインストーラーの場合：NGINXディレクティブ[`wallarm_enable_apifw`](../../admin-en/configure-parameters-en.md#wallarm_enable_apifw)
* NGINX Ingress Controllerの場合：値グループ[`controller.wallarm.apifirewall`](../../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall)
* NGINXベースのDockerイメージの場合：環境変数`WALLARM_APIFW_ENABLE`

[API Specification Enforcementの設定方法を学ぶ](../../api-specification-enforcement/setup.md)

![Specification - use for applying security policies](../../images/api-specification-enforcement/api-specification-enforcement-events.png)

## 新たな攻撃タイプの検出

Wallarmは、新たな攻撃タイプを検出します：

* [Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)（BOLA）  
  Insecure Direct Object References（またはIDOR）としても知られるこの脆弱性は、APIにおいて最も一般的な脆弱性の一つとなっています。アプリケーションにIDOR/BOLAの脆弱性が存在する場合、敏感な情報やデータが攻撃者に露出する可能性が非常に高くなります。攻撃者は、自身のリソースのIDを、他のユーザーに属するリソースのIDと置き換えるだけで、指定されたリソースにアクセスすることが可能となります。適切な認可チェックがなければ、攻撃者はそのリソースにアクセスできます。

    この脆弱性の悪用を防ぐために、Wallarmノードには[新しいトリガー](../../admin-en/configuration-guides/protecting-against-bola.md)が実装されており、指定されたエンドポイントへのリクエスト数がトリガーの閾値を超えた場合にBOLA攻撃イベントを作成し、エンドポイントを保護します。
* [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)

    Mass Assignment攻撃では、攻撃者がHTTPリクエストパラメータをコード内の変数やオブジェクトにバインドしようと試みます。もしAPIが脆弱でバインドを許可している場合、攻撃者は意図せず公開される敏感なオブジェクトプロパティを変更し、権限昇格やセキュリティ機構の回避などを引き起こす可能性があります。
* [SSRF](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)

    SSRF攻撃が成功すると、攻撃者は対象のWebサーバーに代わってリクエストを送信できるようになり、Webアプリケーションで使用されているネットワークポートを明らかにしたり、内部ネットワークのスキャンを行ったり、認可を回避したりする可能性があります。

## API DiscoveryおよびAPI SessionsにおけるSensitive Business Flows

!!! tip ""
    [NGINX Node 5.3.0以上](../node-artifact-versions.md)および[Native Node 0.10.1以上](../native-node/node-artifact-versions.md)

Sensitive Business Flow機能により、Wallarmの[API Discovery](../../api-discovery/overview.md)は、認証、アカウント管理、課金などの重要なビジネスフローに関わるエンドポイントを自動的に特定します。

これにより、重要なビジネスフローに関連するエンドポイントを定期的に監視・監査し、脆弱性や侵害の検出、さらに開発、保守、セキュリティ対策の優先順位決定が容易になります。

![API Discovery - Sensitive business flows](../../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

特定されたSensitive Business Flowは、Wallarmの[API Sessions](../../api-sessions/overview.md)に伝播されます。すなわち、もしセッション内のリクエストがAPI Discoveryで重要とタグ付けされたエンドポイントに影響を与える場合、そのセッションも自動的に[タグ付け](../../api-sessions/exploring.md#sensitive-business-flows)され、該当するビジネスフローに影響を与えたことが明示されます。

一度セッションにSensitive Business Flowタグが付与されると、特定のビジネスフローでフィルタリングすることが可能になり、最も解析すべきセッションを選択しやすくなります。

![!API Sessions - sensitive business flows](../../images/api-sessions/api-sessions-sbf-no-select.png)

## 高度なGraphQLパーサ

!!! tip ""
    現時点では[NGINX Node 5.3.0以上](../node-artifact-versions.md)が対応しており、[Native Node](../native-node/node-artifact-versions.md)では未対応です

完全な機能を備えた[GraphQLパーサ](../../user-guides/rules/request-processing.md#gql)は、GraphQLリクエスト内の入力検証攻撃（例：SQLインジェクション）の検出精度を大幅に向上させ、**より高い精度と最小限の誤検知**を実現します。

主な利点：

* **入力検証攻撃の検出精度向上**（例：SQLインジェクション）
* **詳細なパラメータ解析**：GraphQLリクエストパラメータの値を抽出・表示し、API Sessionsにおいてセッションコンテキストパラメータとして利用できます。

    ![!API Sessions configuration - GraphQL request parameter](../../images/api-sessions/api-sessions-graphql.png)

* **正確な攻撃検索**：GraphQLリクエストの特定部分（引数、ディレクティブ、変数など）における攻撃を正確に特定できます。
* **高度なルール適用**：GraphQLリクエストの特定部分に対して、細やかな保護ルールを適用可能です。これにより、攻撃タイプごとに特定部分の除外設定など、詳細なチューニングが実現できます。

    ![Example of the rule applied to GraphQL request point"](../../images/user-guides/rules/rule-applied-to-graphql-point.png)

## JSON Web Tokenの強度チェック

[JSON Web Token (JWT)](https://jwt.io/)は、API間で安全にデータを交換するためによく用いられる認証標準です。JWTが侵害されると、攻撃者が認証機構を突破してアプリケーションやAPIに対するフルアクセスが可能となるため、弱いJWTほど侵害されるリスクが高まります。

現在、Wallarmは以下のJWTの弱点を検出します：[weak jwt](../../attacks-vulns-list.md#weak-jwt)

* 暗号化されていないJWT
* 侵害された秘密鍵で署名されたJWT

## JWTに対する攻撃検知

JSON Web Token (JWT)は、最も一般的な認証手法の一つです。このことから、JWTは、リクエスト内のどこにでも存在し、エンコードされたデータであるため、SQLインジェクションやRCEなどの検出が非常に困難な攻撃に利用されることが多いです。

Wallarmノードはリクエスト内のどこにあってもJWTを検出し、[デコード](../../user-guides/rules/request-processing.md#jwt)して、適切な[filtration mode](../../admin-en/configure-wallarm-mode.md)に基づき攻撃試行をブロックします。

## サポートされるインストールオプション

* 最新バージョンのCommunity Ingress NGINX Controller（1.11.3）に基づくWallarm Ingress controller。

    [最新のWallarm Ingress controllerへの移行手順 →](ingress-controller.md)
* CentOS 8.xの[非推奨](https://www.centos.org/centos-linux-eol/)に代わり、AlmaLinux、Rocky Linux、Oracle Linux 8.xに対応を追加しました。

    代替OS向けのWallarmノードパッケージは、CentOS 8.xリポジトリに格納されます。
* Debian 11 Bullseyeに対応を追加しました。
* Ubuntu 22.04 LTS (jammy)に対応を追加しました。
* CentOS 6.x（CloudLinux 6.x）への対応を廃止しました。
* Debian 9.xへの対応を廃止しました。
* Ubuntu 16.04 LTS (xenial)への対応を廃止しました。
* [Wallarm EnvoyベースのDockerイメージ](../../admin-en/installation-guides/envoy/envoy-docker.md)で使用されるEnvoyのバージョンが[1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)に引き上げられました。

[サポートされるインストールオプションの全リスト →](../../installation/supported-deployment-options.md)

## フィルタリングノードインストールのシステム要件

* Wallarmノードインスタンスは、攻撃検知ルールや[API specifications](../../api-specification-enforcement/overview.md)のアップデートをダウンロードするため、また[allowlisted, denylisted, or graylisted](../../user-guides/ip-lists/overview.md)国、地域、データセンターの正確なIP取得のため、以下のIPアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"
* フィルタリングノードは、`us1.api.wallarm.com:443`（US Cloud）および`api.wallarm.com:443`（EU Cloud）を用いてクラウドへのデータアップロードを行います。これにより、従来の`us1.api.wallarm.com:444`および`api.wallarm.com:444`から変更されています。

    サーバーでノードがデプロイされている環境で外部リソースへのアクセスが制限され、各リソースへの個別のアクセス許可が必要な場合、アップグレード後はフィルタリングノードとクラウド間の同期が停止します。アップグレードされたノードには、新しいポートを持つAPIエンドポイントへのアクセス許可が必要です。

## Wallarm CloudにおけるAPIトークンによるノードの一元登録

新リリースのWallarmノードでは、従来のメールとパスワードによるWallarm Cloudへのノード登録が廃止され、新しいAPIトークンベースのノード登録方式に切り替えることが必須となりました。

この新リリースにより、[サポートされるプラットフォーム](../../installation/supported-deployment-options.md)で、**APIトークン**を使用してWallarmノードをWallarm Cloudに登録でき、より安全かつ迅速な接続が実現されます：

* ノードのインストール専用の**Deploy**ロールを持つ専用ユーザーアカウントはもはや必要ありません。
* ユーザーデータはWallarm Cloud上に安全に保管されます。
* 2要素認証が有効なユーザーアカウントでも、ノードのWallarm Cloudへの登録が可能です。
* 初期のトラフィック処理およびリクエストのポストアナリティクスモジュールが、別のサーバーにデプロイされている場合でも、1つのノードトークンで登録が可能です。

ノード登録方式の変更に伴い、ノードタイプにいくつかの更新が生じました：

* ノード登録時にサーバー上で実行するスクリプトは`register-node`と命名されています。従来、[**cloud node**](/2.18/user-guides/nodes/cloud-node/)はトークンによる登録をサポートしていましたが、スクリプト名は`addcloudnode`でした。

    Cloud nodeは新しいデプロイプロセスに移行する必要はありません。
* `addnode`スクリプトにメールとパスワードを渡して登録していた[**regular node**](/2.18/user-guides/nodes/regular-node/)は非推奨です。

現在のノード登録手順は以下の通りです：

1. Wallarm Consoleの→ **Settings** → **API tokens**に進みます。
1. **Deploy**ロールの[トークンを生成](../../user-guides/settings/api-tokens.md)します。
1. 該当パラメータにAPIトークンを渡して、必要なデプロイメントアーティファクトを実行します。

!!! info "Regular nodeサポート"
    Regular nodeタイプは非推奨であり、将来的に削除される予定です。

## AWSへのWallarmデプロイ用Terraformモジュール

インフラストラクチャ as Code (IaC)環境から[AWs](https://aws.amazon.com/)へのWallarmのデプロイが、[Wallarm Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用して容易になりました。

Wallarm Terraform moduleは、セキュリティとフェイルオーバーの最適な業界標準を満たすスケーラブルなソリューションです。デプロイ時には、トラフィックフローの要件に応じて**proxy**または**mirror**のどちらかのデプロイオプションを選択できます。

基本的なデプロイ構成から、AWS VPC Traffic Mirroringなどの先進的なソリューションに対応した高度な例まで、両方のデプロイオプションの使用例もご用意しております。

[AWS向けWallarm Terraform moduleのドキュメント →](../../installation/cloud-platforms/aws/terraform-module/overview.md)

## Denylistソースからのブロックリクエスト統計の収集

NGINXベースのWallarmフィルタリングノードは、denylistに該当する送信元からのリクエストがブロックされた統計情報を収集し、攻撃の強度評価を向上させます。これにより、ブロックされたリクエストの統計およびそのサンプルにアクセスでき、見落とされがちな活動を最小限に抑えることが可能です。これらのデータは、Wallarm Console UIの**Attacks**セクションから確認できます。

自動IPブロッキング（例：ブルートフォーストリガーの設定）を使用している場合、初回のトリガーリクエストと、その後のブロックリクエストのサンプルの両方を解析できます。手動でdenylistに追加された送信元の場合も、新機能により送信元ごとのブロックアクションの可視性が向上します。

新たに[検索タグおよびフィルター](../../user-guides/search-and-filters/use-search.md#search-by-attack-type)が**Attacks**セクションに追加され、これらの新規データへ容易にアクセスできます：

* `blocked_source`検索を利用して、IPアドレス、サブネット、国、VPNなどが手動でdenylistに追加されたリクエストを特定できます。
* `multiple_payloads`検索を使用して、**Number of malicious payloads**トリガーによってブロックされたリクエストを特定できます。このトリガーは、複数の悪意あるペイロードを含む攻撃発信元をdenylistに追加するために設計されています。
* さらに、`api_abuse`、`brute`、`dirbust`、`bola`の各検索タグには、該当する攻撃タイプ用のWallarmトリガーによって自動追加されたdenylist送信元のリクエストも含まれます。

この変更により、以下の新たな設定パラメータが導入され、デフォルトでは`on`に設定されていますが、必要に応じて`off`に切り替えることが可能です：

* NGINXディレクティブ[`wallarm_acl_export_enable`](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable)
* NGINX Ingress controllerチャートの値[`controller.config.wallarm-acl-export-enable`](../../admin-en/configure-kubernetes-en.md#global-controller-settings)
* Sidecar Controllerソリューション用のチャート値[`config.wallarm.aclExportEnable`]およびPodのアノテーション[`sidecar.wallarm.io/wallarm-acl-export-enable`](../../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable)

## ready-to-useの`cloud-init.py`スクリプト付きで配布されるWallarm AWSイメージ

IaCアプローチに従う場合、AWSへのWallarmノードのデプロイに[`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html)スクリプトが必要になることがあります。Wallarmは、AWSクラウドイメージにすぐに使用可能な`cloud-init.py`スクリプトを同梱しています。

[Wallarm `cloud-init`スクリプトの仕様 →](../../installation/cloud-platforms/cloud-init.md)

## 簡易化されたマルチテナントノードの設定

[マルチテナントノード](../../installation/multi-tenant/overview.md)では、テナントおよびアプリケーションがそれぞれ専用のディレクティブとして定義されるようになりました：

* テナントの固有識別子を設定するためのNGINXディレクティブ[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)およびEnvoyパラメータ[`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param)が追加されました。
* アプリケーションIDの設定にのみ使用されるよう、NGINXディレクティブ[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)およびEnvoyパラメータ[`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#application_param)の動作が変更されました。

[マルチテナントノードのアップグレード手順 →](../multi-tenant.md)

## フィルトレーションモード

* 新たに**safe blocking**フィルトレーションモードが追加されました。

    このモードでは、[false positive](../../about-wallarm/protecting-against-attacks.md#false-positives)の発生件数を大幅に削減し、[graylisted IP addresses](../../user-guides/ip-lists/overview.md)から送信された悪意あるリクエストのみをブロックします。
* リクエスト送信元の解析は、`safe_blocking`および`block`モードの場合にのみ実施されます。
    
    * `off`または`monitoring`モードで動作するWallarmノードは、[denylisted](../../user-guides/ip-lists/overview.md)IPからのリクエストを検出してもブロックしません。
    * `monitoring`モードで動作するWallarmノードは、[allowlisted IP addresses](../../user-guides/ip-lists/overview.md)からの攻撃もすべてWallarm Cloudにアップロードします。

[Wallarmノードのモードに関する詳細 →](../../admin-en/configure-wallarm-mode.md)

## リクエスト送信元の制御

リクエスト送信元の制御用として、これまで使用されていたすべての`acl` NGINXディレクティブ、Envoyパラメータ、環境変数は非推奨となりました。IPアドレスのdenylistの手動設定はもはや必要ありません。

新機能として以下が追加されました：

* Wallarm ConsoleでのIPアドレスのallowlist、denylist、graylistの一元管理。
* 新たな[filtration mode](../../admin-en/configure-wallarm-mode.md)である`safe_blocking`および[IP address graylists](../../user-guides/ip-lists/overview.md)のサポート。

    **safe blocking**モードでは、[false positive](../../about-wallarm/protecting-against-attacks.md#false-positives)の発生件数を大幅に削減し、graylisted IPからの悪意あるリクエストのみをブロックします。

    自動的なIPアドレスのgraylistingには、新たにリリースされた[**Number of malicious payloads**トリガー]（../../admin-en/configuration-guides/protecting-with-thresholds.md）が利用可能です。
* Wallarm Vulnerability ScannerのIPアドレスの自動allowlist化。Scanner IPの手動allowlistは不要になりました。
* 特定のアプリケーション向けに、送信元のallowlist、denylist、graylistを設定する機能。
* リクエスト送信元解析を無効にするための新NGINXディレクティブおよびEnvoyパラメータ`disable_acl`が追加されました。

    [`disable_acl` NGINXディレクティブの詳細 →](../../admin-en/configure-parameters-en.md#disable_acl)

    [`disable_acl` Envoyパラメータの詳細 →](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

[allowlist、denylist、graylistへのIP追加に関する詳細 →](../../user-guides/ip-lists/overview.md)

## APIインベントリ検出用の新モジュール

新たなWallarmノードには、アプリケーションAPIを自動的に識別する**API Discovery**モジュールが同梱されています。このモジュールはデフォルトで無効になっています。

[API Discoveryモジュールの詳細 →](../../api-discovery/overview.md)

## libdetectionライブラリによる攻撃解析の強化

Wallarmによる攻撃解析は、追加の攻撃検証層を導入することで強化されました。すべてのWallarmノード（Envoyを含む）は、libdetectionライブラリをデフォルトで有効にして配布され、このライブラリは[SQLi](../../attacks-vulns-list.md#sql-injection)攻撃の二次的な文法ベース検証を実施し、SQLインジェクションにおける誤検知件数を削減します。

!!! warning "メモリ使用量の増加"
    **libdetection**ライブラリを有効にすると、NGINX/EnvoyおよびWallarmプロセスのメモリ使用量が約10%増加する可能性があります。

[Wallarmによる攻撃検知の詳細 →](../../about-wallarm/protecting-against-attacks.md)

## `overlimit_res`攻撃検知微調整を有効にするルール

新たに[ルールにより`overlimit_res`攻撃検知の微調整が可能](../../user-guides/rules/configure-overlimit-res-detection.md)となりました。

NGINXおよびEnvoyの設定ファイルを通じた`overlimit_res`攻撃検知の微調整は、非推奨の方法とされています：

* このルールにより、以前`wallarm_process_time_limit` NGINXディレクティブと`process_time_limit` Envoyパラメータで設定していた、単一のリクエスト処理時間制限を設定できます。
* このルールは、設定ファイル内の`wallarm_process_time_limit_block` NGINXディレクティブおよび`process_time_limit_block` Envoyパラメータの設定に代わり、[node filtration mode](../../admin-en/configure-wallarm-mode.md)に従って`overlimit_res`攻撃をブロックまたは許可します。

記載のディレクティブおよびパラメータは非推奨となっており、将来的に削除される予定です。これらのパラメータからルールへの設定移行を推奨します。設定ファイルに明示的に指定され、ルールが未作成の場合、ノードは設定ファイルに従ってリクエストを処理します。

## 最適化され、より安全なNGINXベースのDockerイメージ

[NGINXベースのWallarmフィルタリングノードのDockerイメージ](../../admin-en/installation-docker-en.md)は、セキュリティと最適化の向上のために刷新されました。主な更新内容は以下の通りです：

* Dockerイメージは、従来のDebianに代わりAlpine Linux上で構築され、より安全で軽量なアーティファクトを提供します。なお、従来含まれていた`auth-pam`および`subs-filter` NGINXモジュールは、Dockerイメージに含まれていません。
* NGINXの最新安定版である1.26.2にアップグレードされ、従来の1.14.xから置き換えられました。1.14.xの多くの脆弱性はDebianチームによりパッチが当てられていましたが、1.26.2へのアップグレードにより、残る脆弱性が解消され、セキュリティが向上します。

      NGINXのアップグレードとAlpine Linuxへの変更により、Alpine特有のパッチが実装されたNGINX 1.26.2でHTTP/2 Rapid Reset Vulnerability (CVE-2023-44487)が解消されます。

* ARM64アーキテクチャのプロセッサへのサポートが追加され、インストール時に自動で識別されます。
* Dockerコンテナ内では、従来の`root`ユーザーではなく非特権ユーザー`wallarm`が使用され、NGINXプロセスにも適用されます。
* [`/wallarm-status`](../../admin-en/configure-statistics-service.md)エンドポイントが、JSONではなくPrometheus形式でメトリクスを出力するよう更新されました。この機能は、Dockerコンテナ外部からエンドポイントにアクセスする場合に適用されます。なお、この機能を利用するには、[`WALLARM_STATUS_ALLOW`](../../admin-en/installation-docker-en.md#wallarm-status-allow-env-var)環境変数を適切に設定する必要があります。
* Dockerイメージは、[オールインワンインストーラー](../../installation/nginx/all-in-one.md)を使用して構築され、内部ディレクトリ構造が変更されました：

      * ログファイルディレクトリ：`/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`
      * WallarmノードがCloudに接続するための認証情報ファイル群のディレクトリ：`/etc/wallarm` → `/opt/wallarm/etc/wallarm`
* `/usr/share`ディレクトリのパスが`/opt/wallarm/usr/share`に変更されました。
      
      これにより、[sample blocking page](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)の新パスが`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`となります。

新機能は、新形式のNGINXベースDockerイメージでもサポートされています。

## 最適化されたクラウドイメージ

[Amazon Machine Image (AMI)](../../installation/cloud-platforms/aws/ami.md)および[Google Cloud Machine Image](../../installation/cloud-platforms/gcp/machine-image.md)は最適化されました。主な内容は以下の通りです：

* クラウドイメージは、セキュリティ強化のため、非推奨となったDebian 10.x (buster)に代わり、最新の安定版であるDebian 12.x (bookworm)を使用します。
* 従来の1.14.xから、NGINX 1.22.1にアップグレードされました。
* ARM64アーキテクチャのプロセッサへのサポートが追加され、インストール時に自動で識別されます。
* クラウドイメージは、[オールインワンインストーラー](../../installation/nginx/all-in-one.md)を使用して構築され、内部ディレクトリ構造が変更されました：

      * ノード登録スクリプト：`/usr/share/wallarm-common/register-node` → `/opt/wallarm/usr/share/wallarm-common/cloud-init.py`
      * ログファイルディレクトリ：`/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`
      * WallarmノードがCloudに接続するための認証情報ファイル群のディレクトリ：`/etc/wallarm` → `/opt/wallarm/etc/wallarm`
      * `/usr/share`ディレクトリのパス：`/opt/wallarm/usr/share`
      
          これにより、[sample blocking page](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)の新パスが`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`となります。
      
      * グローバルなWallarmフィルタリングノード設定が記載された`/etc/nginx/conf.d/wallarm.conf`ファイルは削除されました。

新機能は、新形式のクラウドイメージでもサポートされています。

## 新しいブロッキングページ

サンプルブロッキングページ`/usr/share/nginx/html/wallarm_blocked.html`が更新されました。新ノードバージョンでは、新たなレイアウトとなり、ロゴとサポート用メールアドレスのカスタマイズが可能です。
    
新レイアウトのブロッキングページは、デフォルトで以下のように表示されます：

![Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[ブロッキングページ設定の詳細 →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## 基本的なノードセットアップ用の新パラメータ

* Wallarm NGINX‑ベースのDockerコンテナに渡す新たな環境変数：

    * `WALLARM_APPLICATION`：Wallarm Cloudで使用する保護対象アプリケーションの識別子を設定します。
    * `NGINX_PORT`：Dockerコンテナ内でNGINXが使用するポートを設定します。

    [Wallarm NGINX‑ベースDockerコンテナのデプロイ手順 →](../../admin-en/installation-docker-en.md)
* Wallarm Cloudとフィルタリングノード間の同期を設定するため、ファイル`node.yaml`の新パラメータ`api.local_host`および`api.local_port`が追加されました。これらのパラメータにより、Wallarm APIへリクエストを送信するためのローカルIPアドレスおよびポートを指定できます。

    [Wallarm Cloudとフィルタリングノード間の同期設定の全`node.yaml`パラメータ一覧 →](../../admin-en/configure-cloud-node-synchronization-en.md#access-parameters)

## NGINXベースのWallarm DockerコンテナでIPv6接続を無効化する

NGINXベースのWallarm Dockerイメージは、新たな環境変数`DISABLE_IPV6`をサポートします。この環境変数を使用することで、NGINXがIPv6接続の処理を行わず、IPv4接続のみを処理するように設定できます。

## パラメータ、ファイル、メトリクスの名称変更

* 以下のNGINXディレクティブおよびEnvoyパラメータの名称が変更されました：

    * NGINX: `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * NGINX: `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
    * Envoy: `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * Envoy: `tsets`セクション → `rulesets`、およびこのセクション内の`tsN`エントリ → `rsN`
    * Envoy: `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)

    旧名称のパラメータも引き続きサポートされますが、将来的に非推奨となります。パラメータのロジックは変更されていません。
* Ingressの[annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance`は`nginx.ingress.kubernetes.io/wallarm-application`に名称変更されました。

    旧名称のannotationも引き続きサポートされますが、将来的に非推奨となります。annotationのロジックに変更はありません。
* カスタムルールセットをビルドしたファイル`/etc/wallarm/lom`は、`/etc/wallarm/custom_ruleset`に名称変更されました。新ノードバージョンのファイルシステムには、新名称のファイルのみが存在します。

    NGINXディレクティブ[`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)およびEnvoyパラメータ[`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)のデフォルト値もそれに応じ変更されています。新デフォルト値は`/etc/wallarm/custom_ruleset`です。
* 秘密鍵ファイル`/etc/wallarm/license.key`は`/etc/wallarm/private.key`に名称変更されました。新名称がデフォルトで使用されます。
* collectdメトリクス`gauge-lom_id`は`gauge-custom_ruleset_id`に名称変更されました。

    新ノードバージョンでは、collectdサービスが旧メトリクスと新メトリクスの両方を収集します。旧メトリクスの収集は将来的に停止されます。

    [すべてのcollectdメトリクス →](../../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)
* Dockerコンテナ内の`/var/log/wallarm/addnode_loop.log` [ログファイル](../../admin-en/configure-logging.md)は、`/var/log/wallarm/registernode_loop.log`に名称変更されました。

## 統計サービスのパラメータ

* Prometheusメトリクス`wallarm_custom_ruleset_id`は、`format`属性が追加され、カスタムルールセットの形式を示します。同時に、主要な値はカスタムルールセットビルドバージョンを表します。例：

    ```
    wallarm_custom_ruleset_id{format="51"} 386
    ```
* Wallarm統計サービスは、[Wallarmレートリミット](#レートリミット)モジュールのデータとして新たに`rate_limit`パラメータを返します。新パラメータは、拒否されたリクエストおよび遅延リクエストに関する情報、ならびにモジュールの動作上の問題を示します。
* denylisted IPからのリクエスト数は、新パラメータ`blocked_by_acl`および既存パラメータ`requests`、`blocked`にて表示されます。
* 新たに`custom_ruleset_ver`パラメータが追加され、Wallarmノードで使用される[custom ruleset](../../glossary-en.md#custom-ruleset-the-former-term-is-lom)の形式を示します。
* 以下のノード統計パラメータが名称変更されました：

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    新ノードバージョンでは、`http://127.0.0.8/wallarm-status` エンドポイントは、旧パラメータと新パラメータの両方を一時的に返します。旧パラメータは将来的に削除されます。

[統計サービスの詳細 →](../../admin-en/configure-statistics-service.md)

## ノードログ形式の設定用新変数

以下の[ノードログ変数](../../admin-en/configure-logging.md#filter-node-variables)が変更されました：

* `wallarm_request_time`は`wallarm_request_cpu_time`に名称変更されました。

    この変数は、リクエスト処理に要したCPU時間（秒）を意味します。

    旧名称の変数は非推奨であり、将来的に削除されます。変数のロジックに変更はありません。
* `wallarm_request_mono_time`が新たに追加されました。

    この変数は、リクエスト処理に要したCPU時間に加え、キュー内での待機時間（秒）を意味します。

## Denylisted IPからのリクエストにおける攻撃探索の省略によるパフォーマンス向上

新たなディレクティブ[`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase)により、Denylisted IPからのリクエスト解析時に攻撃探索ステージを省略することで、Wallarmノードのパフォーマンスを向上させることが可能となりました。この設定は、多数のdenylisted IP（例：国全体）のトラフィックが存在し、マシンのCPU負荷が高くなる場合に有用です。

## ノードインスタンスの容易なグループ化

今後は、**Deploy**ロールの[API token](../../user-guides/settings/api-tokens.md)と`WALLARM_LABELS`変数の`group`ラベルを使用することで、ノードインスタンスを簡単にグループ化できます。

例：

```bash
docker run -d -e WALLARM_API_TOKEN='<API TOKEN WITH DEPLOY ROLE>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_LABELS='group=<GROUP>' -p 80:80 wallarm/node:5.3.0
```
...は、ノードインスタンスを`<GROUP>`グループに配置します（既存の場合はそのグループに、存在しない場合は新たに作成されます）。

## 対応された脆弱性

新リリースでは、[CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)、[CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)を含む、複数の高および重大な脆弱性が対策され、以前の脆弱なコンポーネントが置き換えられ、ソフトウェアのセキュリティ体制が強化されています。

## HTTP/2ストリーム長制御ディレクティブ

HTTP/2ストリームの最大長を制御するためのディレクティブ[`wallarm_http_v2_stream_max_len`](../../admin-en/configure-parameters-en.md#wallarm_http_v2_stream_max_len)が導入されました。これにより、長時間維持されるgRPC接続での過剰なメモリ消費を防止できます。

Dockerコンテナ内でこの変数を使用する場合、NGINX設定ファイルに指定し、そのファイルをコンテナ内にマウントしてください。

## Account Takeover、Scraping、Security Crawlers用の個別検索タグ

`account_takeover`、`scraping`、`security_crawlers`攻撃タイプ用の個別[検索タグ](../../user-guides/search-and-filters/use-search.md)が導入され、従来の一般的な`api_abuse`タグに比べ、特定性が向上しました。

## コネクタとTCPトラフィックミラー用のNative Node

NGINXに依存しない新たなWallarmノードとして、Native Nodeを導入しました。NGINXが不要な環境や、プラットフォームに依存しないアプローチを求める環境向けに開発されています。

現時点では、以下のデプロイに特化しています：

* MuleSoft、Cloudflare、CloudFront、Broadcom Layer7 API Gateway、Fastlyコネクタ（リクエストおよびレスポンス解析付き）
* Kong API GatewayおよびIstio Ingressコネクタ
* TCPトラフィックミラー解析

[詳細はこちら](../../installation/nginx-native-node-internals.md#native-node)

## アップグレード手順

1. [モジュールアップグレードのための推奨事項](../general-recommendations.md)を確認してください。
2. ご利用のWallarmノードデプロイオプションに合わせた手順に従い、インストール済みのモジュールをアップグレードしてください：

      * [NGINX、NGINX Plus向けモジュールのアップグレード](nginx-modules.md)（**オールインワンインストーラー**を使用）

        アップグレードプロセスの簡素化と効率化のため、すべてのノードバージョンのアップグレードは、Wallarmのオールインワンインストーラーを使用して実施されます。個別のLinuxパッケージによる手動アップグレードはサポートされなくなりました。

      * [NGINXまたはEnvoy向けモジュールを含むDockerコンテナのアップグレード](docker-container.md)
      * [Wallarmモジュール統合済みのNGINX Ingress controllerのアップグレード](ingress-controller.md)
      * [Cloud nodeイメージのアップグレード](cloud-image.md)
      * [マルチテナントノードのアップグレード](multi-tenant.md)
3. 旧Wallarmノードバージョンから最新バージョンへのallowlistおよびdenylist設定の[マイグレーション](../migrate-ip-lists-to-node-3.md)を実施してください。

----------

[Wallarm製品およびコンポーネントのその他のアップデート →](https://changelog.wallarm.com/)