# 脆弱性の管理

脆弱性とは、インフラストラクチャに存在するセキュリティ上の欠陥であり、攻撃者に悪用されるとシステムに対して不正な悪意ある操作を実行されるおそれがあります。Wallarm Consoleでは、Wallarmがお客様のシステムで検出したセキュリティ上の欠陥を以下で分析・管理できます:


* **Vulnerabilities**セクションで
* **AASM** → **Security Issues**セクションで

Wallarmは、セキュリティ上の弱点を[発見](../about-wallarm/detecting-vulnerabilities.md)するために、次のさまざまな手法を用います:

* **受動的検出**: リクエストとレスポンスを含む実トラフィックを分析して脆弱性が見つかった場合です。これは、実際の欠陥が悪用されているセキュリティインシデントの最中に発生することもあれば、欠陥を直接悪用していなくても、侵害されたJWTのようにリクエストに脆弱性の兆候が表れている場合にも発生します。
* **Threat Replay Testing**: Wallarmが実行する[攻撃リプレイのセキュリティテスト](../vulnerability-detection/threat-replay-testing/overview.md)中に脆弱性が見つかった場合です。
* **API Attack Surface Management (AASM)**: 外部ホストとそのAPIを[検出](../api-attack-surface/overview.md)し、それぞれについて不足しているWAF/WAAPソリューションを特定し、脆弱性を見つけます。
* **API Discovery insights**: GETリクエストのクエリパラメータでPIIが送信されていることを[API Discovery](../api-discovery/overview.md)モジュールが検知したことにより、脆弱性が見つかった場合です。

Wallarmは、検出されたすべての脆弱性の履歴を**Vulnerabilities**セクションに保存します:

![Vulnerabilitiesタブ](../images/user-guides/vulnerabilities/check-vuln.png)

## 脆弱性のライフサイクル

脆弱性のライフサイクルには、評価、修復、検証の各段階があります。各段階で、Wallarmは課題に的確に対処しシステムを強化するために必要なデータを提供します。さらに、Wallarm Consoleでは、**Active**と**Closed**のステータスを活用して、脆弱性の状態を容易に監視・管理できます。

* **Active**ステータスは、脆弱性がインフラストラクチャに存在していることを示します。
* **Closed**ステータスは、脆弱性がアプリケーション側で解消された場合、または誤検知と判断された場合に使用します。

    [誤検知](../about-wallarm/detecting-vulnerabilities.md#false-positives)とは、正当な対象が誤って脆弱性として識別されることです。誤検知と思われる脆弱性に遭遇した場合は、脆弱性メニューの該当オプションを使用して報告できます。これはWallarmの脆弱性検出の精度向上に役立ちます。Wallarmは当該脆弱性を誤検知として再分類し、ステータスを**Closed**に変更して、以後の[再確認](#verifying-vulnerabilities)の対象外にします。

脆弱性を管理する際は、ステータスを手動で切り替えることができます。加えて、Wallarmは定期的に脆弱性を[再確認](#verifying-vulnerabilities)し、結果に応じて自動的にステータスを変更します。

![脆弱性のライフサイクル](../images/user-guides/vulnerabilities/vulnerability-lifecycle.png)

脆弱性のライフサイクルの変更は、脆弱性の変更履歴に反映されます。

## 脆弱性の評価と修復

Wallarmは各脆弱性に対し、リスクレベルの評価やセキュリティ課題への対処に役立つ詳細情報を提供します:

* Wallarmシステムにおける脆弱性の一意の識別子
* 脆弱性が悪用された場合の影響の危険度を示すリスクレベル

    Wallarmは、共通脆弱性評価システム（CVSS）フレームワーク、脆弱性が悪用される可能性、システムへの潜在的影響などに基づいて、脆弱性のリスクを自動的に示します。固有のシステム要件やセキュリティの優先順位に基づき、リスクレベルを任意の値に変更できます。
* [脆弱性のタイプ](../attacks-vulns-list.md)（当該脆弱性を悪用する攻撃のタイプにも対応）
* 脆弱性が存在するドメインとパス
* 脆弱性の悪用に使用され得る悪意あるペイロードを渡すためのパラメータ
* 脆弱性が[検出](../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)された方法
* 脆弱性が悪用された場合に影響を受け得る対象コンポーネント（**Server**、**Client**、**Database**）
* 脆弱性が検出された日時
* 直近の[検証日](#verifying-vulnerabilities)
* 脆弱性の詳細な説明、悪用例、および推奨される修復手順
* 関連インシデント
* 脆弱性ステータスの変更履歴

脆弱性は、[検索文字列](search-and-filters/use-search.md)や事前定義済みフィルターを使用して絞り込めます。

![脆弱性の詳細情報](../images/user-guides/vulnerabilities/vuln-info.png)

すべての脆弱性は、システムを悪意ある行為に対してより脆弱にしてしまうため、アプリケーション側で修正する必要があります。脆弱性を修正できない場合は、[virtual patch](rules/vpatch-rule.md)ルールを使用することで関連する攻撃をブロックし、インシデントのリスクを排除できます。

## 脆弱性の検証 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarmは、ActiveとClosedの両方の脆弱性を定期的に再確認します。これは、以前に発見されたセキュリティ問題についてインフラストラクチャを再度テストすることを意味します。再確認の結果、脆弱性がもはや存在しないと示された場合、Wallarmはそのステータスを**Closed**に変更します。これはサーバーが一時的に利用できない場合にも発生することがあります。逆に、既にClosedにした脆弱性の再確認でアプリケーションに依然として存在すると示された場合、Wallarmはそのステータスを**Active**に戻します。

Activeの脆弱性および1か月以内に修正された脆弱性は、1日1回再確認します。1か月以上前に修正された脆弱性は、週1回再確認します。

初回の検出方法に応じて、テストは**API Attack Surface Management (AASM)**または**Threat Replay Testing**モジュールによって実行されます。

受動的に検出された脆弱性は再確認できません。

脆弱性を手動で再確認する必要がある場合は、脆弱性メニューの該当オプションから再確認プロセスを開始できます:

![再確認可能な脆弱性](../images/user-guides/vulnerabilities/recheck-vuln.png)

## 脆弱性レポートのダウンロード

UIの該当ボタンを使用して、脆弱性データをPDFまたはCSVレポートにエクスポートできます。Wallarmは、指定したアドレスにレポートをメールで送付します。

PDFは、脆弱性やインシデントの概要を含む視覚的にリッチなレポートの提示に適しています。一方、CSVは各脆弱性の詳細情報を提供でき、技術的な用途に適しています。CSVは、ダッシュボードの作成、最も脆弱なAPIホスト/アプリケーションの一覧作成などに活用できます。

## 脆弱性を取得するAPI呼び出し

脆弱性の詳細を取得するには、Wallarm ConsoleのUIに加えて、[Wallarm APIを直接呼び出す](../api/overview.md)こともできます。以下は対応するAPI呼び出しの例です。

直近24時間以内でステータスが**Active**の最初の50件の脆弱性を取得するには、次のリクエストを使用し、`TIMESTAMP`を24時間前の日付を[Unixタイムスタンプ](https://www.unixtimestamp.com/)形式に変換した値に置き換えてください:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"