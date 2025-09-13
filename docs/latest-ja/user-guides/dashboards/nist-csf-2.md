# NIST CSF 2.0ダッシュボード（ベータ）

米国国立標準技術研究所（NIST）が策定した[NISTサイバーセキュリティフレームワーク（CSF）](https://www.nist.gov/cyberframework)は、効果的なセキュリティ戦略の主要な柱を定義しています。WallarmのサービスはNISTの柱の大部分に整合しており、お客様に包括的な保護を提供します。このダッシュボードはこの整合性を示し、プラットフォームの機能設定を支援します。

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4rynq5qejumh" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## 識別

Wallarmは、お客様のビジネス環境、リソース、および潜在的なセキュリティ脆弱性を把握するために設計されたツールを提供します。これらのツールは攻撃面を可視化し、資産をリスクスコアに基づいて順位付けするのに役立ちます。具体的には次のとおりです。

* [API攻撃面管理](../../api-attack-surface/overview.md)は、APIが外部に露出する攻撃面を列挙・評価・管理できる機能群です。
* [APIディスカバリー](../../api-discovery/overview.md)は、リアルタイムの利用状況に基づきアプリケーションのREST APIの正確なインベントリを作成し、ゾンビAPI、オーファンAPI、シャドーAPIを効果的に特定します。
* [APIリスクスコアリング](../../api-discovery/risk-score.md)：Wallarmは、データの露出や脆弱性の有無といった要因に基づいてAPIエンドポイントにリスクスコアを自動的に付与します。また、これらの要因の重要度を調整できるようカスタマイズも可能です。

## 保護

Wallarmは既知および新種の幅広い脅威に対して堅牢な保護を提供します。

* [アプリケーションおよびAPI保護（WAAP）](../../about-wallarm/waap-overview.md)は、あらゆる環境でアプリケーションとAPIに高度なセキュリティを提供します。REST、SOAP、GraphQLなどの各種APIプロトコルをサポートし、ディープパケットインスペクションを用いてOWASP Top 10への対策をはじめ、さらに広範な脅威に対応します。
* API脅威防止は、[悪意あるボットのブロック](../../api-abuse-prevention/overview.md)、[クレデンシャルスタッフィング](../../about-wallarm/credential-stuffing.md)や偽アカウント作成からの保護、正当なユーザーのみにアクセスを許可することで、APIへの不正アクセスと不正使用の阻止に注力します。
* API仕様の強制は、エンドポイントの記述と実際のREST APIリクエストの不一致を検出することで、APIがOpenAPI仕様に準拠していることを保証します。不一致を特定すると、事前定義されたセキュリティ対策を自動的に適用します。

## 検知

異常、侵害の兆候、その他の潜在的な不測事象を特定するため、Wallarmは以下のとおり資産の継続的な監視を重視します。

* [脆弱性検知](../../api-attack-surface/security-issues.md)：Wallarmは外部ホストやAPIに脆弱性がないか検査して報告し、差し迫った弱点と潜在的な弱点の双方を明らかにすることで、リアルタイムのセキュリティ監視を可能にします。
* [API漏えい](../../api-attack-surface/security-issues.md#api-leaks)：WallarmのSecurity Issues Detectionモジュールは公開リポジトリをスキャンして露出したAPIトークンを特定します。漏えいを検知するとWallarmが通知し、迅速な分析と対応が可能になります。
* [脅威リプレイテスト](../../vulnerability-detection/threat-replay-testing/overview.md)：Wallarmの脅威リプレイテストは、攻撃者をお客様自身のペネトレーションテスターに変えます。最初の攻撃試行を分析し、同じ攻撃が悪用され得る他の方法を探ります。これにより、元の攻撃者でさえ見つけられなかったお客様の環境の弱点が明らかになります。
<!--* [OpenAPI Security Testing](../../fast/openapi-security-testing.md) automates API security checks within the software development lifecycle by seamlessly integrating with CI/CD pipelines via Docker. It creates test requests to expose vulnerabilities in endpoints, as defined in your OpenAPI specification, allowing you to address security issues before the API goes into production.-->

## 対応

Wallarmの各種機能により、特定されたセキュリティ脅威に適切に対応できます。

* [アクティブブロッキング](../../admin-en/configure-wallarm-mode.md)により、悪意あるアクティビティがAPIに到達するのを防ぎます。
* APIリスク管理：Wallarmは、検出された脆弱性の管理を効率化できるよう、[脆弱性ステータスの更新](../vulnerabilities.md#vulnerability-lifecycle)を迅速に行えるようにし、セキュリティの可視性を高めます。
* [インテグレーションとアラート](../settings/integrations/integrations-intro.md)により、セキュリティアラートを作成してSIEM、SOAR、その他のシステムへルーティングできます。