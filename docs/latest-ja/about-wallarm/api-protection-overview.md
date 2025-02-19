# Wallarm API Protection <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

WallarmのAPI Protectionは、基本的な[cloud-native WAAP](../about-wallarm/waap-overview.md)保護を拡張するための先進的な機能群です。基本保護にはすでにすべてのAPIプロトコルへの対応、攻撃検査、L7 DDoS攻撃への防御などが含まれていますが、モダンなアプリケーションやAPIはさらなるリスクにさらされており、先進的な保護対策が必要です。API Protectionバンドルはそれらのツールを提供します。

API Protectionには以下が含まれます:

* [API Specification Enforcement](#api-specification-enforcement) は、アップロードした仕様書をもとにAPIにセキュリティポリシーを適用するように設計されています。仕様書に記載されたエンドポイントの説明と実際のREST APIへのリクエストとの不一致を検出し、不一致が見つかった場合にあらかじめ定義されたアクションを実行します。
* [Automatic BOLA Protection](#automatic-bola-protection) は、OWASP API Top 10で最も重要な脅威とされたBOLA攻撃に対して自動的に保護します。Wallarmは脆弱なエンドポイントを自動的に検出し、列挙攻撃から保護します。
* [API Abuse Prevention](#api-abuse-prevention) は、credential stuffing、偽アカウント作成、コンテンツスクレイピングなど、APIに対するさまざまな自動化攻撃を防止します。動作解析に基づき、スクレーパー、セキュリティクローラー等の悪意あるボットを容易に識別し、ブロックします。
* [Credential Stuffing Detection](#credential-stuffing-detection) は、アカウント乗っ取り攻撃に対するもう一層の防御を提供します。Wallarmは、低頻度で長時間にわたるCredential Stuffing攻撃を特定するため、1回でも使用された危殆化した認証情報の利用を認識します。
* [GraphQL API Protection](#graphql-api-protection) は、バッチ処理、ネストクエリ、イントロスペクションなど、プロトコル固有の機能を悪用する特殊な攻撃からGraphQL APIを保護します。これにより、リソース枯渇、サービス拒否(DoS)、過度の情報漏洩などの攻撃を防ぐことができます.

<!--Diagram for API Protection bundle of Wallarm products, being prepared by Iskandar-->

基本のCloud Native WAAPサブスクリプションでWAAPが利用可能な一方、API Protectionバンドルのツールは[Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)サブスクリプションの一部です。

## API Specification Enforcement

**API Specification Enforcement**は、アップロードした仕様書をもとにAPIにセキュリティポリシーを適用するように設計されています。その主な機能は、仕様書に記載されたエンドポイントの説明と実際のREST APIへのリクエストとの不一致を検出することです。不整合が確認された場合、システムはあらかじめ定義されたアクションを実行します.

![Specification - use for applying security policies](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

[詳細な説明と設定に進む→](../api-specification-enforcement/overview.md)

## Automatic BOLA Protection

WallarmのAPI Discoveryモジュールを使用して、broken object level authorization(BOLA)脅威に脆弱なエンドポイントを検出し、この脆弱性を悪用しようとする攻撃から自動的に保護します.

![BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

Automatic BOLA保護は、[手動作成](../admin-en/configuration-guides/protecting-against-bola-trigger.md)のBOLA保護ルールの優れた拡張または代替として機能します。自動BOLA保護を設定することで、Wallarmの動作を組織のセキュリティプロファイルに合わせることができます.

[詳細な説明と設定に進む→](../admin-en/configuration-guides/protecting-against-bola.md)

## API Abuse Prevention

**API Abuse Prevention**は、credential stuffing、偽アカウント作成、コンテンツスクレイピングなど、APIに対する不正利用を行うボットの検出と軽減を提供します.

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

API Abuse Preventionは、MLベースの手法に加え、統計的および数学的な異常検知手法や直接的な不正利用の事例を組み合わせた複雑なボット検出モデルを用います。このモジュールは通常のトラフィックプロファイルを自己学習し、著しく異なる動作を異常として識別します.

[詳細な説明と設定に進む→](../api-abuse-prevention/overview.md)

## Credential Stuffing Detection

Wallarmの**Credential Stuffing Detection**は、危殆化または弱い認証情報を使用してアプリケーションへアクセスしようとする試行のリアルタイムな情報を収集・表示し、そのような試行に対して即時に通知を行います。また、アプリケーションへのアクセスに用いられるすべての危殆化または弱い認証情報のダウンロード可能なリストを作成します.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

危殆化および弱いパスワードを識別するために、Wallarmは公共の[HIBP](https://haveibeenpwned.com/)危殆化認証情報データベースから収集された**850 million records**以上のレコードを含む包括的なデータベースを活用します.

[詳細な説明と設定に進む→](credential-stuffing.md)

## GraphQL API Protection

Wallarmは、基本の[WAAP](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)サブスクリプションプランでも、GraphQL内で定常的な攻撃（SQLi、RCE、[など](../attacks-vulns-list.md)）を検出します。しかし、プロトコルの一部の特性により、過度の情報漏洩やDoSに関連する[GraphQL固有](../attacks-vulns-list.md#graphql-attacks)の攻撃が実施される可能性があります.

Wallarmはこれらの攻撃からAPIを保護するため、GraphQLリクエストに対する制限のセットである**GraphQL policy**を設定します.

![GraphQL thresholds](../images/user-guides/rules/graphql-rule.png)

[詳細な説明と設定に進む→](../api-protection/graphql-rule.md)