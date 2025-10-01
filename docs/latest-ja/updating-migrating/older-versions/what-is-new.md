# EOLノードをアップグレードする場合のWallarmノードの新機能

このページでは、旧バージョン（3.6以下）のノードを5.0にアップグレードした際に利用可能になる変更点を一覧で紹介します。記載の変更は、通常（クライアント）ノードとマルチテナントノードの両方に適用されます。

!!! warning "Wallarmノード3.6およびそれ以前は非推奨です"
    Wallarmノード3.6およびそれ以前は[非推奨](../versioning-policy.md#version-list)のため、アップグレードを推奨します。

    バージョン5.xのWallarmノードでは、ノード構成とトラフィックのフィルタリングが大幅に簡素化されています。5.xの一部の設定は旧バージョンのノードと**互換性がありません**。モジュールのアップグレード前に、変更点のリストと[一般的な推奨事項](../general-recommendations.md)を必ず確認してください。

## All-in-oneインストーラーとDEB/RPMパッケージの非推奨化

さまざまな環境でNGINXの動的モジュールとしてWallarmノードをインストール・アップグレードする際は、導入プロセスの効率化と標準化のために設計された**All-in-oneインストーラー**を使用します。このインストーラーは、OSとNGINXのバージョンを自動検出し、必要な依存関係をすべてインストールします。

インストーラーは以下を自動で実行し、作業を簡素化します:

1. OSとNGINXのバージョン確認
1. 検出したOSとNGINXのバージョンに対応するWallarmリポジトリの追加
1. それらのリポジトリからのWallarmパッケージのインストール
1. インストールされたWallarmモジュールのNGINXへの接続
1. 提供されたトークンを用いたWallarm Cloudへのフィルタリングノードの接続

[All-in-oneインストーラーでのノードアップグレードの詳細 →](nginx-modules.md)

ノードインストール用のDEB/RPMパッケージは現在「非推奨」です。

## collectdの廃止

これまで全フィルタリングノードにインストールされていたcollectdサービスおよび関連プラグインは削除されました。メトリクスはWallarmの組み込みメカニズムで収集・送信され、外部ツールへの依存が低減されます。

PrometheusおよびJSON形式で同等のメトリクスを提供する、collectdの代替である[`/wallarm-status`エンドポイント](../../admin-en/configure-statistics-service.md)を使用してください。

この変更の結果、設定ルールにも以下の変更があります:

* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf`のcollectd設定ファイルは使用されなくなりました。
* 以前にcollectdのネットワークプラグインでメトリクスを転送していた場合、例えば:

    ```
    LoadPlugin network

    <Plugin "network">
        Server "<Server IPv4/v6 address or FQDN>" "<Server port>"
    </Plugin>
    ```

    これからはPrometheusで`/wallarm-status`をスクレイプする方式に切り替えてください。

## API Sessions

API経済に特化したユニークなセキュリティ機能 — [API Sessions](../../api-sessions/overview.md)を導入しました。これにより、API全体での攻撃、異常、ユーザー行動の可視性が得られ、ユーザーがAPIやアプリケーションとどのようにやり取りしているかの透明性が向上します。

![!API Sessionsセクション - 監視中のセッション](../../images/api-sessions/api-sessions.png)

攻撃者は、正規ユーザーの行動に紛れて脆弱なエンドポイントを悪用することがよくあります。セッション全体のコンテキストがなければ、パターンや脅威の特定は、複数のツールやシステムをまたいだ時間のかかる作業になります。多くの組織はAPIレベルでの適切な可視性を持っていません。

API Sessionsにより、セキュリティチームはユーザーセッションごとに関連アクティビティをまとめて確認でき、攻撃シーケンス、ユーザーの異常、通常の行動をこれまでにない可視性で把握できます。これまで数時間から数日かかっていた調査は、Wallarm Consoleから数分で実行できるようになります。

主な特長:

* 攻撃、異常、ユーザー行動の可視化: セッション内のすべてのリクエストを表示・分析し、攻撃ベクターや不審なパターンを追跡します。
* レガシーおよびモダンなセッションの両方をサポート: アプリケーションがCookieベースのセッションやJWT/OAuthに依存していても、Wallarm API Sessionsは完全な互換性と可視性を確保します。
* 個々の攻撃とそれに紐づくセッション間をシームレスに行き来できます。

API Sessionsにより、セキュリティチームは次のことを容易に行えます:

* 脅威行為者の全活動を調査し、潜在的な攻撃経路や侵害されたリソースを把握します。
* シャドーAPIやゾンビAPIへのアクセス方法を特定し、未文書や古いAPIによるリスクを軽減します。
* セキュリティ調査時に同僚と主要な洞察を共有し、コラボレーションを促進します。

[詳細を読む](../../api-sessions/overview.md)

## API Sessionsのレスポンスパラメータ

!!! tip ""
    [NGINX Node 5.3.0以上](../node-artifact-versions.md)および[Native Node 0.12.0以上](../native-node/node-artifact-versions.md)

Wallarmの[API Sessions](../../api-sessions/overview.md)は、ユーザーの一連のアクティビティを可視化します。今回の拡張により、各セッションでリクエストだけでなくレスポンス情報も利用可能になりました:

* 任意のレスポンスヘッダーやパラメータを、対応するリクエスト内に表示するよう設定でき、ユーザーアクティビティの明確で完全な全体像を得られます。
* レスポンスパラメータをセッションのグルーピングキーとして使用できます（[例](../../api-sessions/setup.md#grouping-keys-example)参照）。これにより、リクエストのセッショングルーピング精度が向上します。

![!API Sessions - グルーピングキーの動作例](../../images/api-sessions/api-sessions-grouping-keys.png)

## レート制限

適切なレート制限がないことはAPIセキュリティにおける重大な課題でした。攻撃者は大量リクエストを発生させてサービス拒否（DoS）やシステム過負荷を引き起こし、正規ユーザーに悪影響を与えます。

Wallarmのレート制限機能により、セキュリティチームはサービス負荷を効果的に管理し、誤検知を防ぎ、正規ユーザーに対してサービスの可用性と安全性を確保できます。この機能では、従来のIPベースのレート制限に加え、JSONフィールド、base64エンコードデータ、Cookie、XMLフィールドなど、リクエストやセッションのパラメータに基づく多様な接続制限を提供します。

例えば、ユーザーごとのAPI接続数を制限し、1ユーザーが1分間に何千ものリクエストを行うことを防げます。これはサーバーへの大きな負荷となり、サービス障害につながり得ます。レート制限を実装することで、サーバーの過負荷を防ぎ、全ユーザーに公平なAPIアクセスを保証します。

レート制限はWallarm Console UI → **Rules** → **Advanced rate limiting**で、スコープ、レート、バースト、遅延、レスポンスコードをユースケースに合わせて指定するだけで簡単に設定できます。

[レート制限の設定ガイド →](../../user-guides/rules/rate-limiting.md)

推奨はレート制限ルールの使用ですが、新しいNGINXディレクティブでも設定できます:

* [`wallarm_rate_limit`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit)
* [`wallarm_rate_limit_enabled`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_enabled)
* [`wallarm_rate_limit_log_level`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_log_level)
* [`wallarm_rate_limit_status_code`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_status_code)
* [`wallarm_rate_limit_shm_size`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_shm_size)

## Credential stuffing detection <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmはクレデンシャルスタッフィング試行のリアルタイム検出と通知を提供します。クレデンシャルスタッフィングとは、盗まれた/弱いユーザー名・メールアドレスとパスワードの組み合わせをWebサイトのログインフォームに自動投入し、不正にアカウントへアクセスする手口です。本機能により、漏えいした認証情報を持つアカウントを特定し、アカウント所有者への通知や一時的なアクセス停止などの対処が可能です。

[Credential Stuffing Detectionの設定方法](../../about-wallarm/credential-stuffing.md)

![Attacks - クレデンシャルスタッフィング](../../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

!!! info "クレデンシャルスタッフィング検出をサポートする選択済みアーティファクト"
    All-in-oneインストーラー、NGINX Ingress Controller、NGINXベースのDockerイメージ、クラウドイメージ（AMI、GCP Image）など、限定的なアーティファクトで新しいクレデンシャルスタッフィング検出機能がサポートされます。

## GraphQL API protection <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

WallarmはデフォルトでGraphQL内の一般的な攻撃（SQLi、RCE、[など](../../attacks-vulns-list.md)）を検出します。しかし、プロトコルの特性により、過度な情報露出やDoSに関連する[GraphQL特有](../../attacks-vulns-list.md#graphql-attacks)の攻撃が可能です。

これらの攻撃への保護を導入しました。保護は、組織のGraphQLポリシー（GraphQLリクエストに対する制限のセット）を設定することで行います。設定された制限を超えるリクエストは、アクティブなフィルタリングモードに従ってフィルタリングノードが処理し、ポリシー違反として記録のみ、または記録してブロックします。

本機能の利用を開始するには、Wallarm Consoleで少なくとも1つの[**Detect GraphQL attacks**ルール](../../api-protection/graphql-rule.md#)を作成する必要があります。

[GraphQL API Protectionの設定方法](../../api-protection/graphql-rule.md)

![GraphQLのしきい値](../../images/user-guides/rules/graphql-rule.png)

## Mitigation Controls

すべてのWallarm攻撃緩和設定を一元管理する管理センター — [**Mitigation Controls**](../../about-wallarm/mitigation-controls-overview.md)を導入しました。Mitigation Controlsにより、次のことが可能です:

* すべてのWallarm緩和設定を1か所で表示・管理できます。
* 統一的に管理できます（すべてのコントロールは類似の設定UIとオプションを備えます）。
* 各コントロールの現在のモードを容易に把握できます: 有効か、監視のみか、ブロックもするか。
* 各コントロールで捕捉された攻撃をすばやく俯瞰できます。

![UI内のMitigation Controlsページ](../../images/user-guides/mitigation-controls/mc-main-page.png)

## ファイルアップロード制限ポリシー

Wallarmはアップロードファイルサイズを直接制限するためのツールを提供します。これは、[OWASP API Top 10 2023](../../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)に含まれる最も重大なAPIセキュリティリスクの1つである[unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)を防ぐための一連の対策の一部です。

サブスクリプションプランにより、アップロード制限はミティゲーションコントロールまたはルールで適用されます。リクエスト全体または選択したポイントに対してファイルサイズの制限を設定できます。

![File upload restriction MC - 例](../../images/api-protection/mitigation-controls-file-upload-1.png)

### 列挙攻撃保護

!!! tip ""
    [NGINX Node 6.1.0以上](../node-artifact-versions.md)および[Native Node 0.14.1以上](../native-node/node-artifact-versions.md)

[列挙攻撃](../../attacks-vulns-list.md#enumeration-attacks)に対する新たな保護レベルとして、以下の列挙ミティゲーションコントロールを提供します:

* [Enumeration attack protection](../../api-protection/enumeration-attack-protection.md)
* [BOLA enumeration protection](../../api-protection/enumeration-attack-protection.md)
* [Forced browsing protection](../../api-protection/enumeration-attack-protection.md)
* [Brute force protection](../../api-protection/enumeration-attack-protection.md)

従来のトリガーと比較して、ミティゲーションコントロールは次を可能にします:

* 列挙試行の監視対象パラメータを選択できます。
* カウント対象とするリクエストを高度に絞り込めます。
* [API Sessions](../../api-sessions/overview.md)と深く統合されます: 検出された攻撃は対応するセッション内に表示され、何が起きてなぜそのセッションの活動が攻撃としてマークされ、ブロックされたのか、完全なコンテキストを提供します。

![BOLA保護ミティゲーションコントロール - 例](../../images/user-guides/mitigation-controls/mc-bola-example-01.png)

### DoS保護

!!! tip ""
    [NGINX Node 6.1.0以上](../node-artifact-versions.md)および[Native Node 0.14.1以上](../native-node/node-artifact-versions.md)

[unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)は、[OWASP API Top 10 2023](../../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)に含まれる重大なAPIセキュリティリスクです。これは（過負荷によるサービスの遅延・停止という）脅威自体であるだけでなく、列挙攻撃などさまざまな攻撃の土台にもなります。同時刻に許容しすぎるリクエストは、これらのリスクの主因の1つです。

Wallarmは、APIへの過剰なトラフィックを防ぐための新しいミティゲーションコントロール[**DoS protection**](../../api-protection/dos-protection.md)を提供します。

![DoS protection - JWTの例](../../images/api-protection/mitigation-controls-dos-protection-jwt.png)

### 既定のコントロール

有効化するとWallarmプラットフォームの検出能力を大幅に強化する[既定のミティゲーションコントロール](../../about-wallarm/mitigation-controls-overview.md#default-controls)を提供します。これらは一般的な攻撃パターンに対し堅牢な保護を提供するよう事前設定されています。現在の既定コントロールは以下のとおりです:

* [GraphQL protection](../../api-protection/graphql-rule.md)
* ユーザーID、オブジェクトID、ファイル名に対する[BOLA（Broken Object Level Authorization）列挙保護](../../api-protection/enumeration-attack-protection.md#bola)
* パスワード、OTP、認証コードに対する[Brute force protection](../../api-protection/enumeration-attack-protection.md#brute-force)
* [Forced browsing protection](../../api-protection/enumeration-attack-protection.md#forced-browsing)（404プロービング）
* [Enumeration attack protection](../../api-protection/enumeration-attack-protection.md#generic-enumeration)（以下を含む）:
    
    * ユーザー/メールアドレス列挙
    * SSRF（Server-Side Request Forgery）列挙
    * ユーザーエージェントのローテーション

## unrestricted resource consumptionからの保護

!!! tip ""
    [NGINX Node 6.3.0以上](../node-artifact-versions.md)、[Native Node](../../installation/nginx-native-node-internals.md#native-node)は現時点では非対応です。

Wallarmの[API Abuse Prevention](../../api-abuse-prevention/overview.md)は、[unrestricted resource consumption](../../attacks-vulns-list.md#unrestricted-resource-consumption)（自動化クライアントが適切な制限なく過剰にAPIやアプリケーションのリソースを消費する濫用行為）を防止する機能を提供します。これには、非悪意の大量リクエスト送信、計算資源・メモリ・帯域の枯渇、正規ユーザー向けサービス品質の低下などが含まれます。

![API Abuse prevention profile](../../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

この種の自動化された脅威を検出するため、API Abuse Preventionは次の3つの新しい[検出器](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)を提供します:

* **Response time anomaly**: APIレスポンス遅延の異常パターンを特定し、自動化された濫用やバックエンドの悪用の兆候を検知します。
* **Excessive request consumption**: 異常に大きいリクエストペイロードを送信するクライアントを特定し、バックエンド処理資源の濫用・誤用を示唆します。
* **Excessive response consumption**: セッション全体でのレスポンスデータ総量に基づき、疑わしいセッションをフラグします。個々のリクエストに着目する検出器とは異なり、セッション全体でレスポンスサイズを集計して、スロードリップ型や分散型スクレイピング攻撃を特定します。

## API Specification Enforcement

このアップデートでは、API Specification Enforcement機能を導入しました。これは受信トラフィックをフィルタリングし、API仕様に準拠したリクエストのみを許可します。クライアントとアプリケーションの間に配置されたWallarmノードが、仕様のエンドポイント記述と実際のAPIリクエストを比較します。未定義のエンドポイントや未許可パラメータを含むリクエストなどの不一致は、設定に応じてブロックまたは監視されます。

これは潜在的な攻撃試行を阻止してセキュリティを強化するだけでなく、過負荷や不適切な利用を回避することでAPIのパフォーマンスを最適化します。

また、一部のデプロイメントオプション向けに技術的な制御を可能にする新しいパラメータも追加しました:

* All-in-oneインストーラー向け: [`wallarm_enable_apifw`](../../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINXディレクティブ
* NGINX Ingress Controller向け: [`controller.wallarm.apifirewall`](../../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall)の値グループ
* NGINXベースのDockerイメージ向け: 環境変数`WALLARM_APIFW_ENABLE`

[API Specification Enforcementの設定方法](../../api-specification-enforcement/setup.md)

![Specification - セキュリティポリシー適用に使用](../../images/api-specification-enforcement/api-specification-enforcement-events.png)

## 新しい攻撃タイプの検出

Wallarmは新しい攻撃タイプを検出します:

* [Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)（BOLA、Insecure Direct Object ReferencesまたはIDORとも呼ばれます）は、最も一般的なAPIの脆弱性の1つになりました。アプリケーションにIDOR / BOLAの脆弱性がある場合、攻撃者に機密情報やデータを露出する可能性が高くなります。攻撃者は、自身のリソースIDをAPI呼び出し内で他ユーザーのリソースIDに置き換えるだけで済みます。適切な認可確認がないと、攻撃者はそのリソースにアクセスできます。したがって、オブジェクトIDを受け取り何らかの操作を行うすべてのAPIエンドポイントは攻撃対象になり得ます。

    この脆弱性の悪用を防ぐため、WallarmノードにはエンドポイントをBOLA攻撃から保護できる[新しいトリガー](../../admin-en/configuration-guides/protecting-against-bola.md)が追加されています。トリガーは特定エンドポイントへのリクエスト数を監視し、しきい値を超えた際にBOLA攻撃イベントを作成します。
* [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)

    Mass Assignment攻撃では、攻撃者はHTTPリクエストパラメータをプログラムコードの変数やオブジェクトにバインドしようとします。APIが脆弱でバインドを許容している場合、公開を意図しないオブジェクトの機密プロパティを変更され、特権昇格やセキュリティ機構の回避などにつながる可能性があります。
* [SSRF](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)

    SSRF攻撃が成功すると、攻撃対象のWebサーバーになりすましてリクエストを発行でき、使用中のネットワークポートの露呈、内部ネットワークのスキャン、認可の回避につながる可能性があります。

## API DiscoveryとAPI Sessionsのセンシティブなビジネスフロー

!!! tip ""
    [NGINX Node 5.3.0以上](../node-artifact-versions.md)および[Native Node 0.10.1以上](../native-node/node-artifact-versions.md)

センシティブなビジネスフロー機能により、Wallarmの[API Discovery](../../api-discovery/overview.md)は、認証、アカウント管理、課金など特定のビジネスフローや機能にとって重要なエンドポイントを自動的に特定できます。

これにより、センシティブなビジネスフローに関連するエンドポイントの、脆弱性や侵害に対する定期監視・監査、および開発・保守・セキュリティ対応の優先順位付けが可能になります。

![API Discovery - センシティブなビジネスフロー](../../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

特定されたセンシティブなビジネスフローはWallarmの[API Sessions](../../api-sessions/overview.md)にも反映されます。API Discoveryでセンシティブなビジネスフローに重要とタグ付けされたエンドポイントに影響するセッションのリクエストがある場合、そのセッションにも自動的にそのビジネスフロータグが[付与](../../api-sessions/exploring.md#sensitive-business-flows)されます。

セッションにセンシティブなビジネスフロータグが付与されると、特定のビジネスフローでフィルタリングできるようになり、分析対象として最も重要なセッションを絞り込みやすくなります。

![!API Sessions - センシティブなビジネスフロー](../../images/api-sessions/api-sessions-sbf-no-select.png)

## フル機能のGraphQLパーサー

!!! tip ""
    [NGINX Node 5.3.0以上](../node-artifact-versions.md)および[Native Node 0.12.0以上](../native-node/node-artifact-versions.md)

フル機能の[GraphQLパーサー](../../user-guides/rules/request-processing.md#gql)は、GraphQLリクエスト内の入力検証攻撃（例: SQLインジェクション）の検出を大幅に向上させ、**精度向上と誤検知の最小化**を実現します。

主な利点:

* 入力検証攻撃（例: SQLインジェクション）の**検出精度向上**
* **詳細なパラメータの可視化**: GraphQLリクエストパラメータの値を抽出してAPI Sessionsに表示し、セッションのコンテキストパラメータとして活用できます。

    ![!API Sessions設定 - GraphQLリクエストパラメータ](../../images/api-sessions/api-sessions-graphql.png)

* **精緻な攻撃検索**: 引数、ディレクティブ、変数など、特定のGraphQLリクエスト要素における攻撃を正確に特定します。
* **高度なルール適用**: GraphQLリクエストの特定部分に粒度の細かい保護ルールを適用できます。これにより、GraphQLリクエストの定義済み部分における特定攻撃タイプの除外など、きめ細かい調整が可能です。

    ![GraphQLリクエストポイントに適用されたルールの例"](../../images/user-guides/rules/rule-applied-to-graphql-point.png)

## JSON Web Tokenの強度チェック

[JSON Web Token（JWT）](https://jwt.io/)は、APIなどのリソース間でデータを安全に交換するための一般的な認証標準です。JWTの侵害は、認証機構を破られることでアプリケーションやAPIに完全アクセスされるため、攻撃者の主要な標的となります。JWTが弱いほど、侵害される可能性は高まります。

現在、Wallarmは次のJWTの弱点を[検出](../../attacks-vulns-list.md#weak-jwt)します:

* 暗号化されていないJWT
* 秘密鍵が漏えいした状態で署名されたJWT

## JSON Web Tokenに対する攻撃の検査

JSON Web Token（JWT）は最も一般的な認証方式の1つです。そのため、JWTは攻撃（例えばSQLiやRCE）の格好の手段にもなります。JWT内のデータはエンコードされ、リクエスト内のどこにでも存在し得るため、発見が非常に困難です。

Wallarmノードはリクエスト内のどこにあるJWTでも[検出してデコード](../../user-guides/rules/request-processing.md#jwt)し、適切な[フィルタリングモード](../../admin-en/configure-wallarm-mode.md)に従って、この認証方式を悪用する攻撃をブロックします。

## サポートされるインストールオプション

* Community Ingress NGINX Controller 1.11.5に基づくWallarm Ingress controller。

    [最新のWallarm Ingress controllerへの移行手順 →](ingress-controller.md)
* [非推奨](https://www.centos.org/centos-linux-eol/)となったCentOS 8.xの代替として、AlmaLinux、Rocky Linux、Oracle Linux 8.xをサポートしました。

    代替OS向けのWallarmノードパッケージはCentOS 8.xリポジトリに格納されます。 
* Debian 11 Bullseyeをサポートしました
* Ubuntu 22.04 LTS（jammy）をサポートしました
* CentOS 6.x（CloudLinux 6.x）のサポートを終了しました
* Debian 9.xのサポートを終了しました
* Ubuntu 16.04 LTS（xenial）のサポートを終了しました

[サポートされるインストールオプションの全一覧 →](../../installation/supported-deployment-options.md)

## フィルタリングノードインストールのシステム要件

* Wallarmノードインスタンスは、攻撃検出ルールや[API仕様](../../api-specification-enforcement/overview.md)の更新をダウンロードし、[許可/拒否/グレーリスト](../../user-guides/ip-lists/overview.md)に登録された国、地域、データセンターの正確なIPを取得するため、以下のIPアドレスへのアクセスが必要になりました。

    --8<-- "../include/wallarm-cloud-ips.md"
* フィルタリングノードがクラウドにデータをアップロードする宛先は、`us1.api.wallarm.com:444`および`api.wallarm.com:444`から、`us1.api.wallarm.com:443`（US Cloud）と`api.wallarm.com:443`（EU Cloud）に変更されました。

    ノードをデプロイしたサーバーが外部リソースへの接続を個別に許可している場合、アップグレード後にフィルタリングノードとクラウド間の同期が停止します。新しいポートのAPIエンドポイントへのアクセスを許可する必要があります。

## APIトークンによるWallarm Cloudへのノード登録の統一

新しいWallarmノードのリリースでは、メール・パスワードによるクラウドへのノード登録は廃止されました。新しいAPIトークンベースのノード登録方式への移行が必須です。

新リリースでは、[サポートされる任意のプラットフォーム](../../installation/supported-deployment-options.md)で**APIトークン**によるWallarm Cloudへのノード登録が可能になり、以下のとおりより安全かつ迅速にWallarm Cloudへ接続できます:

* ノードのインストールだけが可能な**Deploy**ロールの専用ユーザーアカウントは不要です。
* ユーザーデータはWallarm Cloudに安全に保存されます。
* ユーザーアカウントで二要素認証を有効化していても、ノード登録を妨げません。
* 別サーバーにデプロイした初期トラフィック処理モジュールとリクエストポストアナリティクスモジュールを、1つのノードトークンでクラウド登録できます。

登録方式の変更に伴い、ノードタイプにも更新があります:

* サーバーで実行する登録スクリプト名は`register-node`です。以前、**cloud node**はトークンによる登録をサポートしていましたが、スクリプト名は`addcloudnode`でした。

    cloud nodeは新しいデプロイ手順への移行は不要です。
* `addnode`スクリプトに渡す「メール・パスワード」での登録に対応していた**regular node**は非推奨です。

現在のノード登録手順は次のとおりです:

1. Wallarm Console → **Settings** → **API tokens**に進みます。
1. **Node deployment/Deployment**の使用タイプで[トークンを生成](../../user-guides/settings/api-tokens.md)します。
1. 必要なノードのデプロイアーティファクトを、該当パラメータにAPIトークンを渡して実行します。

!!! info "通常ノードのサポート"
    regular nodeタイプは非推奨であり、将来のリリースで削除されます。

## AWSでWallarmをデプロイするTerraformモジュール

[Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を用いたInfrastructure as Code（IaC）環境から、[AWS](https://aws.amazon.com/)へWallarmを容易にデプロイできるようになりました。

Wallarm Terraformモジュールは、セキュリティとフェイルオーバーの業界ベストプラクティスに準拠したスケーラブルなソリューションで、**プロキシ**としてWallarmをデプロイするために設計されています。

[WallarmのAWS向けTerraformモジュールのドキュメント](../../installation/cloud-platforms/aws/terraform-module/overview.md)

## 拒否リストソースからのブロックリクエスト統計の収集

WallarmのNGINXベースのフィルタリングノードは、ソースが拒否リストにあるためにブロックされたリクエストの統計を収集できるようになり、攻撃の強度評価能力が強化されました。これにはブロックされたリクエストの統計とそのサンプルへのアクセスが含まれ、見落としを最小化できます。Wallarm Console UIの**Attacks**セクションで確認できます。

自動IPブロッキング（例: ブルートフォーストリガーを設定）を使用している場合、初回にトリガーを発動させたリクエストと、その後にブロックされたリクエストのサンプルの両方を分析できます。ソースの手動拒否リスト登録によりブロックされたリクエストについても、新機能によりブロックソースのアクション可視性が向上します。

**Attacks**セクションに新しい[検索タグとフィルター](../../user-guides/search-and-filters/use-search.md#search-by-attack-type)を導入し、新データへ容易にアクセスできます:

* `blocked_source`検索で、IPアドレス、サブネット、国、VPNなどの手動拒否リスト登録によりブロックされたリクエストを特定できます。
* `multiple_payloads`検索で、**Number of malicious payloads**トリガーによりブロックされたリクエストを特定できます。このトリガーは、複数のペイロードを含む悪意のあるリクエストを発するソースを拒否リストに追加する設計です。これはマルチアタック加害者の一般的特徴です。
* さらに、`api_abuse`、`brute`、`dirbust`、`bola`検索タグは、それぞれの攻撃タイプに対応するWallarmトリガーによりソースが自動で拒否リストに追加されたリクエストも包含します。

この変更に伴い、デフォルトで`on`（有効）に設定され、必要に応じて`off`（無効）にできる新しい設定パラメータも導入しました:

* [`wallarm_acl_export_enable`](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) NGINXディレクティブ
* NGINX Ingress controllerチャート用の値[`controller.config.wallarm-acl-export-enable`](../../admin-en/configure-kubernetes-en.md#global-controller-settings)
* Sidecar Controller向けHelmチャートの値[`config.wallarm.aclExportEnable`](../../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable)と、Podアノテーション[`sidecar.wallarm.io/wallarm-acl-export-enable`](../../installation/kubernetes/sidecar-proxy/pod-annotations.md)

## `cloud-init.py`スクリプト同梱のWallarm AWSイメージ

Infrastructure as Code（IaC）アプローチに従う場合、[`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html)スクリプトを使用してAWSへWallarmノードをデプロイする必要があるかもしれません。WallarmはAWSクラウドイメージに、すぐに使える`cloud-init.py`スクリプトを同梱しています。

[Wallarmの`cloud-init`スクリプト仕様](../../installation/cloud-platforms/cloud-init.md)

## マルチテナントノード構成の簡素化

[マルチテナントノード](../../installation/multi-tenant/overview.md)では、テナントとアプリケーションをそれぞれ専用のディレクティブで定義します:

* テナントの一意識別子を設定するために[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) NGINXディレクティブを追加しました。
* [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) NGINXディレクティブの挙動を変更しました。現在はアプリケーションIDの設定に**のみ**使用します。

[マルチテナントノードのアップグレード手順](../multi-tenant.md)

## フィルタリングモード

* 新しい**safe blocking**フィルタリングモード。

    このモードは、[グレーリストIPアドレス](../../user-guides/ip-lists/overview.md)からの悪意あるリクエストのみをブロックすることで、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)の大幅な削減を可能にします。
* リクエストソースの分析は、`safe_blocking`および`block`モードでのみ実行されます。
    
    * `off`または`monitoring`モードで動作するWallarmノードが、[拒否リスト](../../user-guides/ip-lists/overview.md)のIPからのリクエストを検出しても、このリクエストはブロックしません。
    * `monitoring`モードで動作するWallarmノードは、[許可リストIPアドレス](../../user-guides/ip-lists/overview.md)からのすべての攻撃をWallarm Cloudにアップロードします。

[Wallarmノードのモードの詳細 →](../../admin-en/configure-wallarm-mode.md)

## リクエストソース制御

以下のリクエストソース制御パラメータは非推奨です:

* IPアドレス拒否リストの設定に使用されるすべての`acl` NGINXディレクティブと環境変数。IPの手動拒否リスト登録は不要になりました。

    [拒否リスト設定の移行詳細 →](../migrate-ip-lists-to-node-3.md)

リクエストソース制御には以下の新機能があります:

* IPアドレスの許可リスト・拒否リスト・グレーリストを完全に管理するためのWallarm Consoleセクション
* 新しい[フィルタリングモード](../../admin-en/configure-wallarm-mode.md)`safe_blocking`と[IPアドレスのグレーリスト](../../user-guides/ip-lists/overview.md)のサポート

    **safe blocking**モードは、グレーリストIPアドレスからの悪意あるリクエストのみをブロックすることで、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)の大幅な削減を可能にします。

    自動グレーリスト化には、新たに提供された[**Number of malicious payloads**トリガー](../../admin-en/configuration-guides/protecting-with-thresholds.md)を使用できます。
* 企業リソースの脆弱性スキャンや追加のセキュリティテストに使用する[WallarmのスキャナーIP](../../admin-en/scanner-addresses.md)の自動許可リスト登録。これらのアドレスの手動許可は不要です。
* サブネット、TorネットワークIP、VPN IP、特定の国・地域・データセンターに登録されたIPグループを許可・拒否・グレーリスト化可能
* 特定のアプリケーションに対して、リクエストソースを許可・拒否・グレーリスト化可能
* リクエストの発信元分析を無効化するための新しいNGINXディレクティブ`disable_acl`

    [`disable_acl` NGINXディレクティブの詳細 →](../../admin-en/configure-parameters-en.md#disable_acl)

[許可リスト・拒否リスト・グレーリストへのIP追加の詳細 →](../../user-guides/ip-lists/overview.md)

## APIインベントリ検出のための新モジュール

新しいWallarmノードには、アプリケーションAPIを自動識別するモジュール**API Discovery**が同梱されています。モジュールはデフォルトで無効です。

[API Discoveryモジュールの詳細 →](../../api-discovery/overview.md)

## libdetectionライブラリによる攻撃分析の強化

Wallarmによる攻撃分析は、追加の攻撃検証レイヤーを導入して強化されました。すべてのフォームファクターのWallarmノードには、デフォルトでlibdetectionライブラリが有効になっています。このライブラリは、すべての[SQLi](../../attacks-vulns-list.md#sql-injection)攻撃に対して、完全な文法ベースの二次検証を実行し、SQLインジェクションにおける誤検知を削減します。

!!! warning "メモリ消費量の増加"
    **libdetection**ライブラリを有効にすると、NGINXおよびWallarmプロセスのメモリ消費量が約10%増加する可能性があります。

[Wallarmの攻撃検出方法の詳細 →](../../about-wallarm/protecting-against-attacks.md)

## `overlimit_res`攻撃検出の微調整を可能にするルール

[`overlimit_res`攻撃検出を微調整する新しいルール](../../user-guides/rules/configure-overlimit-res-detection.md)を導入しました。

NGINX設定ファイルによる`overlimit_res`攻撃検出の微調整は非推奨の方法となります:

* このルールでは、以前の`wallarm_process_time_limit` NGINXディレクティブと同様に、単一のリクエスト処理時間の上限を設定できます。
* このルールでは、`wallarm_process_time_limit_block` NGINXディレクティブの代わりに、[ノードのフィルタリングモード](../../admin-en/configure-wallarm-mode.md)に従って`overlimit_res`攻撃をブロックまたは許可できます。

上記のディレクティブおよびパラメータは非推奨となり、将来のリリースで削除されます。それまでに、ディレクティブからルールへの`overlimit_res`攻撃検出の設定移行を推奨します。該当する[ノードのデプロイオプションごとの手順](../general-recommendations.md#update-process)を参照してください。

設定ファイルに上記のパラメータが明示的に指定されており、ルールがまだ作成されていない場合、ノードは設定ファイルの内容に従ってリクエストを処理します。

## 最適化され、よりセキュアになったNGINXベースのDockerイメージ

[WallarmのNGINXベースのフィルタリングノード用Dockerイメージ](../../admin-en/installation-docker-en.md)は、セキュリティと最適化のために刷新されました。主な更新点は次のとおりです:

* DockerイメージはDebianからAlpine Linuxベースに変更され、より安全で軽量なアーティファクトになりました。以前同梱されていた`auth-pam`および`subs-filter` NGINXモジュールはDockerイメージには含まれなくなりました。
* NGINXの最新安定版1.28.0へ更新（以前は1.14.x）。1.14.xの多くの脆弱性はDebian（旧イメージはDebian 10.xベース）によりパッチ適用済みでしたが、1.28.0への更新で残存する脆弱性も解消し、セキュリティが向上します。

      NGINXの更新とAlpine Linuxへの移行により、NGINX 1.28.0に実装されたAlpine固有のパッチによってHTTP/2 Rapid Reset脆弱性（CVE-2023-44487）が解消されます。

* ARM64アーキテクチャのプロセッサーをサポートし、インストール時に自動検出します。
* Dockerコンテナ内のすべての操作は、以前の`root`ユーザーではなく、非rootユーザー`wallarm`で実行されるようになりました。これはNGINXプロセスにも適用されます。
* [`/wallarm-status`](../../admin-en/configure-statistics-service.md)エンドポイントは、Dockerコンテナ外からアクセスする場合に、JSONではなくPrometheus形式でメトリクスをエクスポートするよう更新されました。この機能には、環境変数[`WALLARM_STATUS_ALLOW`](../../admin-en/installation-docker-en.md#wallarm-status-allow-env-var)の適切な設定が必要です。
* Dockerイメージは[All-in-oneインストーラー](../../installation/nginx/all-in-one.md)でビルドされるようになり、内部ディレクトリ構造が変更されました:

      * ログディレクトリ: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`
      * クラウド接続用の資格情報ファイル格納ディレクトリ: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`
* `/usr/share`ディレクトリのパス → `/opt/wallarm/usr/share`
      
      これにより、[サンプルブロックページ](../../admin-en/configuration-guides/configure-block-page-and-code.md)の新しいパスは`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`になります。

新機能は新フォーマットのNGINXベースDockerイメージでもサポートされます。

## クラウドイメージの最適化

[Amazon Machine Image（AMI）](../../installation/cloud-platforms/aws/ami.md)と[Google Cloud Machine Image](../../installation/cloud-platforms/gcp/machine-image.md)を最適化しました。主な更新点は次のとおりです:

* クラウドイメージは、セキュリティの向上のため、旧Debian 10.x（buster）から最新安定版Debian 12.x（bookworm）に変更しました。
* NGINX 1.22.1へ更新（以前は1.14.x）。
* ARM64アーキテクチャのプロセッサーをサポートし、インストール時に自動検出します。
* クラウドイメージは[All-in-oneインストーラー](../../installation/nginx/all-in-one.md)でビルドされるようになり、内部ディレクトリ構造が変更されました:

      * ノード登録スクリプト: `/usr/share/wallarm-common/register-node` → `/opt/wallarm/usr/share/wallarm-common/cloud-init.py`
      * ログディレクトリ: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`
      * クラウド接続用の資格情報ファイル格納ディレクトリ: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`
      * `/usr/share`ディレクトリのパス → `/opt/wallarm/usr/share`
      
          これにより、[サンプルブロックページ](../../admin-en/configuration-guides/configure-block-page-and-code.md)の新しいパスは`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`になります。
      
      * グローバルなWallarmフィルタリングノード設定を含む`/etc/nginx/conf.d/wallarm.conf`ファイルは削除されました。

新機能は新フォーマットのクラウドイメージでもサポートされます。

## 新しいブロックページ

サンプルブロックページ`/usr/share/nginx/html/wallarm_blocked.html`を更新しました。新しいノードバージョンではレイアウトが刷新され、ロゴとサポートメールのカスタマイズに対応しました。
    
新しいレイアウトのブロックページは、デフォルトで以下のとおりです:

![Wallarmブロックページ](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[ブロックページ設定の詳細 →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## 基本的なノード設定の新パラメータ

* WallarmのNGINXベースDockerコンテナに渡す新しい環境変数:

    * `WALLARM_APPLICATION`: Wallarm Cloudで使用する保護対象アプリケーションの識別子を設定します。
    * `NGINX_PORT`: Dockerコンテナ内でNGINXが使用するポートを設定します。

    [WallarmのNGINXベースDockerコンテナのデプロイ手順 →](../../admin-en/installation-docker-en.md)
* Wallarm Cloudとフィルタリングノードの同期設定用に、`node.yaml`ファイルへ新パラメータ`api.local_host`と`api.local_port`を追加しました。これらにより、Wallarm APIへのリクエスト送信に用いるネットワークインターフェイスのローカルIPアドレスとポートを指定できます。

    [Wallarm Cloudとフィルタリングノードの同期設定に関する`node.yaml`パラメータの全一覧 →](../../admin-en/configure-cloud-node-synchronization-en.md#access-parameters)

## NGINXベースのWallarm DockerコンテナでのIPv6接続の無効化

NGINXベースのWallarm Dockerイメージは、新しい環境変数`DISABLE_IPV6`をサポートします。この変数により、NGINXがIPv6接続を処理しないようにし、IPv4接続のみを処理させることができます。

## パラメータ、ファイル、メトリクスの名称変更

* 次のNGINXディレクティブの名称を変更しました:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    旧名称のパラメータも引き続きサポートしますが、将来のリリースで非推奨になります。パラメータのロジックに変更はありません。
* Ingressの[アノテーション](../../admin-en/configure-kubernetes-en.md#ingress-annotations)`nginx.ingress.kubernetes.io/wallarm-instance`を`nginx.ingress.kubernetes.io/wallarm-application`に変更しました。

    旧名称のアノテーションも引き続きサポートしますが、将来のリリースで非推奨になります。アノテーションのロジックに変更はありません。
* カスタムルールセットビルドのファイル`/etc/wallarm/lom`を`/etc/wallarm/custom_ruleset`に変更しました。新しいノードバージョンのファイルシステムには新名称のファイルのみが存在します。

    NGINXディレクティブ[`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)のデフォルト値もこれに合わせて変更され、新しいデフォルト値は`/etc/wallarm/custom_ruleset`です。
* 秘密鍵ファイル`/etc/wallarm/license.key`を`/etc/wallarm/private.key`に変更しました。新しい名称がデフォルトで使用されます。

## 統計サービスのパラメータ

* Prometheusメトリクス`wallarm_custom_ruleset_id`に`format`属性を追加しました。この属性はカスタムルールセットのフォーマットを表します。主値は引き続きカスタムルールセットのビルドバージョンです。更新後の`wallarm_custom_ruleset_id`値の例:

    ```
    wallarm_custom_ruleset_id{format="51"} 386
    ```
* Wallarm統計サービスは、新しい[Wallarmのレート制限](#レート制限)モジュールのデータとともに新パラメータ`rate_limit`を返します。新パラメータは、拒否されたリクエストや遅延されたリクエスト、ならびにモジュールの動作に関する問題を示します。
* 拒否リストIPからのリクエスト数は、統計サービス出力の新パラメータ`blocked_by_acl`および既存の`requests`、`blocked`にも表示されます。
* サービスは新パラメータ`custom_ruleset_ver`も返し、Wallarmノードが使用している[カスタムルールセット](../../glossary-en.md#custom-ruleset-the-former-term-is-lom)のフォーマットを示します。
* 次のノード統計パラメータの名称を変更しました:

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    新しいノードバージョンでは、一時的に`http://127.0.0.8/wallarm-status`エンドポイントが非推奨および新パラメータの両方を返します。非推奨パラメータは将来のリリースでサービス出力から削除されます。

[統計サービスの詳細 →](../../admin-en/configure-statistics-service.md)

## ノードのログ形式を設定するための新変数

次の[ノードのロギング変数](../../admin-en/configure-logging.md#filter-node-variables)を変更しました:

* `wallarm_request_time`を`wallarm_request_cpu_time`に変更

    この変数は、リクエスト処理にCPUが費やした時間（秒）を意味します。

    旧名称の変数は非推奨であり、将来のリリースで削除されます。変数のロジックに変更はありません。
* `wallarm_request_mono_time`を追加

    この変数は、リクエスト処理にCPUが費やした時間（秒）＋キュー待ちの時間を意味します。

## 拒否リストIPからのリクエストで攻撃探索を省略して性能を向上

新しいディレクティブ[`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase)により、[拒否リスト](../../user-guides/ip-lists/overview.md)IPからのリクエスト分析時に攻撃探索ステージを省略して、Wallarmノードの性能を向上できます。多数の拒否リストIP（例: 国全体）からの高トラフィックによりCPU負荷が高い環境で有用です。

## ノードインスタンスの簡単なグルーピング

`Node deployment/Deployment`使用タイプの[**APIトークン**](../../user-guides/settings/api-tokens.md)と、`group`ラベルを含む`WALLARM_LABELS`変数を併用することで、ノードインスタンスを簡単にグルーピングできるようになりました。

例: 

```bash
docker run -d -e WALLARM_API_TOKEN='<API TOKEN WITH DEPLOY ROLE>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_LABELS='group=<GROUP>' -p 80:80 wallarm/node:6.4.1
```
…により、ノードインスタンスは`<GROUP>`インスタンスグループに配置されます（既存の場合はそこへ、存在しない場合は作成されます）。

## 対応済みの脆弱性

新リリースでは、Wallarmのデプロイアーティファクトに含まれていた重大・高リスクの複数の脆弱性に対応し、脆弱なコンポーネントを置き換えることでソフトウェアのセキュリティ体制を強化しました。

対応済みの脆弱性には、[CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)、[CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)などが含まれます。

## HTTP/2ストリーム長制御ディレクティブ

HTTP/2ストリームの最大長を制御するディレクティブ[`wallarm_http_v2_stream_max_len`](../../admin-en/configure-parameters-en.md#wallarm_http_v2_stream_max_len)を導入しました。長寿命のgRPC接続での過剰なメモリ消費を防止するのに役立ちます。

この変数を[Dockerコンテナ](../../admin-en/installation-docker-en.md)で使用するには、NGINX設定ファイルに指定し、そのファイルをコンテナにマウントしてください。

## Account Takeover、Scraping、Security Crawlers用の個別検索タグ

`account_takeover`、`scraping`、`security_crawlers`攻撃タイプ向けの個別の[検索タグ](../../user-guides/search-and-filters/use-search.md)を導入し、従来の一般的な`api_abuse`タグよりも特異性が向上しました。

## コネクタおよびTCPトラフィックミラー向けNative Node

NGINXに依存しない新しいWallarmノードのデプロイオプション、Native Nodeを紹介します。このソリューションは、NGINXが不要な環境や、プラットフォーム非依存のアプローチが望まれる環境向けに開発されました。 

現在、以下のデプロイに対応しています:

* MuleSoft、Cloudflare、CloudFront、Broadcom Layer7 API Gateway、Fastlyコネクタ（リクエスト・レスポンスの両方を分析）
* Kong API GatewayおよびIstio Ingressコネクタ
* TCPトラフィックミラー分析

[詳細を読む](../../installation/nginx-native-node-internals.md#native-node)

## ポストアナリティクスでTarantoolをwstoreに置換

Wallarmノードは、ローカルのポストアナリティクス処理に、Tarantoolの代わりに**Wallarm開発のサービスwstore**を使用します。結果として以下の変更があります:

* [All-in-oneインストーラー](../../installation/nginx/all-in-one.md)、[AWS](../../installation/cloud-platforms/aws/ami.md)/[GCP](../../installation/cloud-platforms/gcp/machine-image.md)イメージ:

    * ポストアナリティクスモジュールを他のNGINXサービスと分離してデプロイする場合のサーバーアドレスを定義するNGINXディレクティブ`wallarm_tarantool_upstream`は、[`wallarm_wstore_upstream`](../../admin-en/configure-parameters-en.md#wallarm_wstore_upstream)に名称変更されました。

        後方互換性は警告付きで維持されます:

        ```
        2025/03/04 20:43:04 [warn] 3719#3719: "wallarm_tarantool_upstream" directive is deprecated, use "wallarm_wstore_upstream" instead in /etc/nginx/nginx.conf:19
        ```
    * [ログファイル](../../admin-en/configure-logging.md)の名称変更: `/opt/wallarm/var/log/wallarm/tarantool-out.log` → `/opt/wallarm/var/log/wallarm/wstore-out.log`
    * 新しいwstore設定ファイル`/opt/wallarm/wstore/wstore.yaml`が、`/etc/default/wallarm-tarantool`や`/etc/sysconfig/wallarm-tarantool`などの旧Tarantool設定ファイルを置き換えます。
    * `/opt/wallarm/etc/wallarm/node.yaml`内の`tarantool`セクションは`wstore`になりました。後方互換性は警告付きで維持されます。
* [Dockerイメージ](../../admin-en/installation-docker-en.md):

    * 上記の変更はコンテナ内にも適用されています。
    * 以前は環境変数`TARANTOOL_MEMORY_GB`でTarantoolのメモリを割り当てていましたが、同じ原則で新しい変数を使用します: `TARANTOOL_MEMORY_GB` → `SLAB_ALLOC_ARENA`
    * Alpine Linuxの慣例に合わせてコンテナのディレクトリ構造を調整しました。具体的には:

        * `/etc/nginx/modules-available`および`/etc/nginx/modules-enabled`の内容を`/etc/nginx/modules`に移動しました。
        * `/etc/nginx/sites-available`および`/etc/nginx/sites-enabled`の内容を`/etc/nginx/http.d`に移動しました。
    
    * `/wallarm-status`サービスに許可されたIPアドレスを指定する既定の`allow`値は、127.0.0.8/8から127.0.0.0/8になりました。
* [Kubernetes Ingress Controller](../../admin-en/installation-kubernetes-en.md):
    
    * Tarantoolは別Podではなくなり、wstoreはメインの`<CHART_NAME>-wallarm-ingress-controller-xxx` Pod内で動作します。
    * Helmの値名を変更: `controller.wallarm.tarantool` → `controller.wallarm.postanalytics`
* [Kubernetes Sidecar Controller](../../installation/kubernetes/sidecar-proxy/deployment.md):

    * Helmの値名を変更: `postanalytics.tarantool.*` → [`postanalytics.wstore.*`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L625)
    * Sidecarデプロイ用Helmチャートから以下のDockerイメージを削除しました:

        * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
        * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
        * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
        * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
        
        これらは現在、関連サービスを実行する[wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)イメージに置き換えられています。

以下の変更は、この後に記載するノードアップグレード手順に組み込まれています。

## アップグレード手順

1. [モジュールのアップグレードに関する推奨事項](../general-recommendations.md)を確認します。
2. 使用中のWallarmノードのデプロイオプションに応じた手順に従って、インストール済みモジュールをアップグレードします:

      * **All-in-oneインストーラー**による[NGINX、NGINX Plus向けモジュールのアップグレード](nginx-modules.md)

        アップグレードプロセスの改善と簡素化のため、すべてのノードバージョンのアップグレードはWallarmのAll-in-oneインストーラーで実施します。個別のLinuxパッケージによる手動アップグレードはサポートしません。

      * [NGINXモジュール入りDockerコンテナのアップグレード](docker-container.md)
      * [Wallarmモジュール統合済みNGINX Ingress controllerのアップグレード](ingress-controller.md)
      * [クラウドノードイメージ](cloud-image.md)
      * [マルチテナントノード](multi-tenant.md)
3. 以前のWallarmノードバージョンの許可リスト・拒否リスト設定を、最新バージョンへ[移行](../migrate-ip-lists-to-node-3.md)します。

----------

[Wallarm製品およびコンポーネントのその他の更新情報 →](https://changelog.wallarm.com/)