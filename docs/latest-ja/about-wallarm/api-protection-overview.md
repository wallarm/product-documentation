# Wallarm API保護 <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

WallarmのAPI保護は、APIおよびAIを保護する高度な機能セットです。基本的な[クラウドネイティブWAAP](../about-wallarm/waap-overview.md)保護には、すべてのAPIプロトコルのサポートと攻撃検査、L7 DDoS対策などがすでに含まれますが、現代のAPIは自動化された脅威、APIの不正使用、AIの悪用など、追加のリスクにもさらされています。Advanced API Securityバンドルは、より完全なリスク低減のための高度な機能を提供します。

API保護には以下が含まれます：

* [API仕様の強制](#api-specification-enforcement)は、アップロードした仕様に基づいてAPIにセキュリティポリシーを適用するために設計されています。仕様に記載されたエンドポイントの説明と、REST APIに対して実際に行われたリクエストとの不一致を検知し、不一致が見つかった場合はあらかじめ定義されたアクションを実行します。
* [自動BOLA保護](#automatic-bola-protection)は、OWASP API Top 10で脅威の第1位として挙げられているBOLA攻撃からの自動保護を提供します。Wallarmは脆弱なエンドポイントを自動的に特定し、列挙から保護します。
* [API不正利用防止](#api-abuse-prevention)は、さまざまな種類の自動化された脅威からアプリケーションとAPIを保護します。行動分析に基づき、Wallarmは  スクレイパー、セキュリティクローラーなどの悪意あるボットを容易に特定してブロックできます。  
* [クレデンシャルスタッフィング検知](#credential-stuffing-detection)は、アカウント乗っ取り攻撃に対する保護をさらに1層追加します。Wallarmは侵害済みクレデンシャルが単一回だけ使用された場合でも検知でき、低頻度かつ長時間にわたるクレデンシャルスタッフィング攻撃の特定に役立ちます。
* [GraphQL API保護](#graphql-api-protection)は、バッチング、ネストしたオブジェクト、イントロスペクションなど、プロトコル固有の仕組みを悪用する専門的な攻撃からGraphQL APIを保護します。これにより、リソース枯渇、サービス拒否（DoS）、過度な情報露出などの攻撃を防止できます。

<!--Diagram for API Protection bundle of Wallarm products, being prepared by Iskandar-->

WAAPは基本のCloud Native WAAPサブスクリプションで利用可能ですが、API保護バンドルのツールは[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションの一部です。

## API仕様の強制

**API仕様の強制**は、アップロードした仕様に基づいてAPIにセキュリティポリシーを適用するために設計されています。主な機能は、仕様に記載されたエンドポイントの説明と、REST APIに対して実際に行われたリクエストとの不一致を検出することです。このような不整合が特定された場合、システムはそれに対処するためにあらかじめ定義されたアクションを実行できます。

![仕様 - セキュリティポリシー適用への利用](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

[詳細な説明と設定に進む→](../api-specification-enforcement/overview.md)

## 自動BOLA保護

WallarmのAPI Discoveryモジュールを使用して、Broken Object Level Authorization（BOLA）脅威に対して脆弱なエンドポイントを特定し、この脆弱性を悪用しようとする攻撃から自動的に保護します。

![BOLAトリガー](../images/user-guides/bola-protection/trigger-enabled-state.png)

自動BOLA保護は、[手動で作成した](../admin-en/configuration-guides/protecting-against-bola-trigger.md)BOLA保護ルールの優れた拡張または代替として機能します。自動BOLA保護を構成して、Wallarmの挙動が組織のセキュリティプロファイルに合致するようにできます。

[詳細な説明と設定に進む→](../admin-en/configuration-guides/protecting-against-bola.md)

## API不正利用防止

**API不正利用防止**は、クレデンシャルスタッフィング、不正アカウント作成、コンテンツスクレイピングなど、APIを狙った悪意のあるボットによる行為を検知・緩和します。

![API不正利用防止の統計](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

**API不正利用防止**は、機械学習（ML）ベースの手法に加え、統計的・数理的な異常探索手法や直接的な不正のケースを取り入れた複合的なボット検知モデルを使用します。本モジュールは通常のトラフィックプロファイルを自己学習し、著しく異なる挙動を異常として特定します。

[詳細な説明と設定に進む→](../api-abuse-prevention/overview.md)

## クレデンシャルスタッフィング検知

Wallarmの**クレデンシャルスタッフィング検知**は、侵害済みまたは弱いクレデンシャルを使用してアプリケーションへアクセスしようとする試行に関するリアルタイム情報を収集・表示し、そのような試行について即時通知を有効化します。また、アプリケーションへのアクセスに使用された侵害済みまたは弱いクレデンシャルの一覧をダウンロード可能な形で作成します。

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

侵害済みおよび弱いパスワードを特定するために、Wallarmは、公開された[HIBP](https://haveibeenpwned.com/)の侵害クレデンシャルデータベースから収集した**8億5,000万件以上**の包括的なデータベースを使用します。

[詳細な説明と設定に進む→](credential-stuffing.md)

## GraphQL API保護

Wallarmは、基本の[WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションプランであっても、GraphQL内の通常の攻撃（SQLi、RCE、[など](../attacks-vulns-list.md)）をデフォルトで検知します。ただし、プロトコルのいくつかの側面により、過度な情報露出やDoSに関連する[GraphQL特有](../attacks-vulns-list.md#graphql-attacks)の攻撃が成立し得ます。

Wallarmは、**GraphQLポリシー**を設定することでこれらの攻撃からAPIを保護します - GraphQLリクエストに対する制限の集合です。

![GraphQLの閾値](../images/user-guides/rules/graphql-rule.png)

[詳細な説明と設定に進む→](../api-protection/graphql-rule.md)