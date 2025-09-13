# Threat Managementの概要

Wallarmの**Threat Management**は、セキュリティ態勢の全体像をリアルタイムに把握でき、使用している保護ツールを制御できます。本記事ではThreat Managementのコンポーネント、その目的、および主な機能について概説します。

## 概要

Threat Managementは、何が起きているかの全体像を提供します: 

* 攻撃、エンドポイント、稼働中の保護ツールの可視化されたインタラクティブなサマリーが必要ですか？[dashboards](#dashboards)を使用してください。
* 発生している攻撃、実施された対策、その対策を提供したツールを確認したいですか？[attacks](#attacks)で確認し、ツールを簡単に[調整](check-attack.md#responding-to-attacks)できます。
* 同様に[incidents](#incidents)でも作業できます。
* 個々の攻撃だけでは状況を十分に把握できませんか？その攻撃が属する[session](#sessions)に切り替えると、ユーザーのそれ以前および以後のすべてのアクティビティを確認できます。
* セッションが特定のエンドポイントに関連していますか？Wallarmが自動検出したエンドポイントの完全な情報に切り替えてください（[API Discovery](../../api-discovery/overview.md)が必要です）。ここからエンドポイント用のrulesをすばやく作成できます。
* 攻撃、インシデント、または脆弱性に関する有益なドキュメントが必要ですか？任意のフィルターを適用したデータでPDFまたはCSVの[reports](#reports)を生成できます。

![Threat Management](../../images/user-guides/events/tm-diagram.png)

Threat Managementのすべてのコンポーネントには、高度な検索およびフィルタリング機能が含まれています。攻撃やインシデントについて、選択したフィルターを適用した内容でPDFおよびCSVのレポートを作成することもできます。Wallarmは、リクエストを論理的に攻撃やセッションにまとめる高度なグルーピング機構を用いており、アプリケーションロジックに完全に合致させるためにSessionsの検出方法を変更できるようにします。

## Dashboards

Threat ManagementのDashboardsは、セキュリティペリメータおよび態勢の可視化されたサマリーを提供します。すべてがインタラクティブで、システム内のさまざまな部分の詳細やデータ、構成ツールへ素早くアクセスできます。

![Threat Management - dashboards](../../images/user-guides/events/tm-overview-dashboards.png)

* [**Threat Prevention**](../../user-guides/dashboards/threat-prevention.md)ダッシュボードで、悪意あるトラフィック量と、その攻撃タイプ、ソース、プロトコル、認証方式などによる分布を明確に把握できます。
* [**API Discovery**](../../user-guides/dashboards/api-discovery.md)ダッシュボードで、WallarmのAPI Discoveryが収集したAPIに関するデータを確認できます。
* [**NIST Cyber Security Framework 2.0**](../../user-guides/dashboards/nist-csf-2.md)ダッシュボードで、WallarmのサービスがNISTのサイバーセキュリティフレームワークにどのように整合しているかを把握できます。
* [**OWASP API Security Top 10 - 2023**](../../user-guides/dashboards/owasp-api-top-ten.md)ダッシュボードで、OWASP API Security Top 10 2023のカバレッジを確認し、セキュリティコントロールをプロアクティブに実装できます。

## Attacks

Wallarmはアプリケーショントラフィックを継続的に分析し、攻撃をリアルタイムに検知・緩和します。Wallarm Consoleの[**Attacks**](check-attack.md)セクションは、セキュリティペリメータへの侵入を試みる最新の攻撃を分析し、それらからの保護状況を把握するための中核ハブであり、追加のセキュリティ対策を構成するためのツールでもあります。

![Threat Management - Attacks](../../images/user-guides/events/filter-for-falsepositive.png)

**Attacks**セクションでは、次のことができます:

* 現在の攻撃とWallarmが講じた対策を確認し、表示内容を次の条件で絞り込めます:

    * 特定のタイプの攻撃
    * 特定のIPまたは地理的ロケーションからのもの
    * 特定の時間に発生したもの
    * 特定のアプリケーションまたはドメイン宛てのもの
    * など

* 同じ情報を異なる期間で表示できます（直近3か月まで）
* 将来の類似攻撃に対応するための[rules](../../user-guides/rules/rules.md#what-you-can-do-with-rules)を作成または変更できます
* [false positives](check-attack.md#false-positives)としてマークして、Wallarmの判断を調整できます

## Incidents

インシデントは、確認済みの脆弱性を標的とする攻撃です。Wallarm Consoleの[**Incidents**](check-incident.md)セクションは、共通の攻撃データを、それが悪用しようとしている脆弱性と関連付けます。これにより、次のことができます:

* **Attacks**で利用できるすべての情報とツールにアクセスできます
* 関連する脆弱性データとその詳細情報を取得できます

![Threat Management - Incidents](../../images/user-guides/events/incident-vuln.png)

## Sessions

[**API Sessions**](../../api-sessions/overview.md)が対処する主な課題は、Wallarmが検出した個々の攻撃だけを見ても完全なコンテキストが得られないことです。各セッション内のリクエストとレスポンスの論理的なシーケンスを捕捉することで、API Sessionsはより広範な攻撃パターンへの洞察を提供し、セキュリティ対策がビジネスロジックのどの領域に影響するかの特定に役立ちます。

![!API Sessionsセクション - 監視中のセッション](../../images/api-sessions/api-sessions.png)

## Reports

攻撃、インシデント、または脆弱性について、PDFまたはCSVの[reports](../../user-guides/search-and-filters/custom-report.md)を生成できます。選択したデータだけが必要ですか？フィルターを適用すると、フィルター後のデータのみがレポートに含まれます。

![Attacks - レポートの作成](../../images/user-guides/search-and-filters/custom-report.png)