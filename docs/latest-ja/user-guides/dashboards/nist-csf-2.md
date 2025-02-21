# NIST CSF 2.0 ダッシュボード (Beta)

[NISTサイバーセキュリティフレームワーク (CSF)](https://www.nist.gov/cyberframework)は、米国国立標準技術研究所により作成され、効果的なセキュリティ戦略のための主要な柱を定義します。WallarmのサービスはNISTの大部分の柱に準拠しており、顧客に包括的な保護を提供します。本ダッシュボードはその整合性を示し、プラットフォームの機能設定を支援します。

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4rynq5qejumh" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## 識別

Wallarmは、企業のビジネス環境、資源、潜在的なセキュリティ脆弱性を把握するためのツールを提供します。これらのツールは攻撃対象領域を明らかにし、リスクスコアに基づいて資産の優先順位付けを支援します:

* [API攻撃面管理](../../api-attack-surface/overview.md)は、APIが公開する攻撃対象領域を列挙し、評価し、管理できる機能のセットです。
* [API Discovery](../../api-discovery/overview.md)は、実際の使用状況に基づいてアプリケーションのREST APIの正確な資産一覧を作成し、ゾンビAPI、孤立API、およびシャドウAPIを効果的に識別します。
* [API risk scoring](../../api-discovery/risk-score.md)：Wallarmは、データ露出や脆弱性の存在などの要因に基づいてAPIエンドポイントに自動でリスクスコアを割り当てますが、これらの要因の重要性を調整できるカスタマイズも提供します。

## 保護

Wallarmは、既知および新たに発生する多様な脅威に対して堅牢な保護を提供します:

* [Application and API Protection (WAAP)](../../about-wallarm/waap-overview.md)は、さまざまな環境においてアプリケーションおよびAPIに高度なセキュリティを提供します。REST、SOAP、GraphQLなどの各種APIプロトコルに対応し、ディープパケットインスペクションを活用してOWASP Top 10をはじめとする脅威に対処します。
* API Threat Preventionは、[悪意あるボットのブロック](../../api-abuse-prevention/overview.md)により不正なアクセスやAPIの悪用を防ぎ、[クレデンシャルスタッフィング](../../about-wallarm/credential-stuffing.md)および偽アカウントの作成から保護し、正当なユーザーのみがアクセスできるようにします。
* API Specification Enforcementは、エンドポイントの説明と実際のREST APIリクエストとの不一致を検出することで、APIがOpenAPI仕様に準拠していることを保証します。不一致が確認された場合、あらかじめ定義されたセキュリティ対策を自動的に適用します.

## 検出

異常、攻撃の兆候、その他の潜在的な悪影響事象を特定するため、Wallarmは資産の継続的な監視を重視します:

* [Vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md)：Wallarmは実際のインターネットトラフィックを活用し、積極的にセキュリティ脆弱性を特定し報告します。攻撃者の試行を分析し、脆弱性の悪用テストを実施することで、即時および潜在的な弱点を明らかにし、リアルタイムのセキュリティ監視を実現します.
* [API leaks](../../api-attack-surface/security-issues.md#api-leaks)：WallarmのSecurity Issues Detectionモジュールは、パブリックリポジトリをスキャンしてAPIトークンの露出を特定します。露出が検知された場合、Wallarmは警告を発し、迅速な分析と対応を可能にします.
* [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md)：WallarmのThreat Replay Testingは、攻撃者を自身のペネトレーションテスターとして活用します。初期の攻撃試行を分析し、同一の攻撃が悪用される他の方法を検討することで、元の攻撃者ですら発見できなかった環境内の脆弱な部分を明らかにします.
<!--* [OpenAPI Security Testing](../../fast/openapi-security-testing.md) automates API security checks within the software development lifecycle by seamlessly integrating with CI/CD pipelines via Docker. It creates test requests to expose vulnerabilities in endpoints, as defined in your OpenAPI specification, allowing you to address security issues before the API goes into production.-->

## 対応

Wallarmのアーセナルは、特定されたセキュリティ脅威に適切に対応できるよう支援します:

* [Active blocking](../../admin-en/configure-wallarm-mode.md)により、悪意ある活動がAPIに到達するのを防ぎます.
* API risk management：Wallarmは検出された脆弱性を迅速に[脆弱性ステータスの更新](../vulnerabilities.md#vulnerability-lifecycle)することで、セキュリティ管理の効率化を可能にします.
* [統合とアラート](../settings/integrations/integrations-intro.md)により、セキュリティアラートをSIEM、SOAR、その他のシステムに作成し、ルーティングできます.