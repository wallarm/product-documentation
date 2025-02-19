# 脆弱性の管理

脆弱性とは、攻撃者が悪用することにより、システムにおいて不正な悪意ある操作を実行する可能性のあるインフラストラクチャ上のセキュリティ上の欠陥のことです。Wallarm Consoleの**Vulnerabilities**セクションでは、Wallarmがシステム上で検出したセキュリティ上の欠陥を分析および管理できます。

Wallarmは、セキュリティの脆弱性を発見するために、様々な手法を使用しています。手法は以下の通りです:

* **Passive detection**: リアルトラフィック（リクエストとレスポンスの両方）を解析することで脆弱性が発見される手法です。この状況は、実際のセキュリティインシデント中に脆弱性が悪用された場合や、リクエストに改竄されたJWTsなど直接的な脆弱性悪用がなくとも脆弱性の兆候が見られる場合に発生します。
* **Threat Replay Testing**: 脆弱性が攻撃の検証プロセス中に発見された手法です。
* **Vulnerability Scanner**: 脆弱性が[exposed asset](scanner.md)スキャンプロセス中に発見された手法です。
* **API Discovery insights**: 脆弱性がGETリクエストのクエリパラメータにおけるPII転送を原因として、[API Discovery](../api-discovery/overview.md)モジュールによって発見された手法です。

Wallarmは**Vulnerabilities**セクションに、検出されたすべての脆弱性の履歴を保存します:

![Vulnerabilities tab](../images/user-guides/vulnerabilities/check-vuln.png)

## 脆弱性のライフサイクル

脆弱性のライフサイクルには、評価、修正、検証の各段階が含まれており、各段階においてWallarmは問題を徹底的に解決し、システムを強化するために必要なデータを提供します。さらに、Wallarm Consoleでは**Active**および**Closed**のステータスを利用することで、脆弱性の状況を容易に監視および管理できます。

* **Active**ステータスは、脆弱性がインフラストラクチャ上に存在することを示します。
* **Closed**ステータスは、アプリケーション側で脆弱性が解決された場合、または誤検知であると判断された場合に使用されます。

    正確な対象が脆弱性として誤って判断される場合に[false positive](../about-wallarm/detecting-vulnerabilities.md#false-positives)が発生します。誤検知だと考えられる脆弱性に遭遇した場合は、脆弱性メニューから適切なオプションを使用して報告できます。これにより、Wallarmの脆弱性検出の精度向上に寄与します。Wallarmは脆弱性を誤検知として再分類し、ステータスを**Closed**に変更し、以降は[rechecking](#verifying-vulnerabilities)の対象にしません。

脆弱性を管理する際には、脆弱性のステータスを手動で切り替えることができます。さらに、Wallarmは脆弱性を定期的に[rechecks](#verifying-vulnerabilities)し、結果に応じて脆弱性のステータスを自動的に変更します。

![Vulnerability lifecycle](../images/user-guides/vulnerabilities/vulnerability-lifecycle.png)

脆弱性のライフサイクルにおける変更は、脆弱性の変更履歴に反映されます。

## 脆弱性の評価と修正

Wallarmは、各脆弱性に対して、リスクレベルの評価やセキュリティ問題に対処するための措置を講じるのに役立つ詳細情報を提供します:

* Wallarmシステム内での脆弱性の一意の識別子
* 脆弱性の悪用による影響の危険度を示すリスクレベル

    WallarmはCommon Vulnerability Scoring System (CVSS)フレームワークを用いて、脆弱性悪用の可能性やシステムへの潜在的影響などに基づき、自動的に脆弱性のリスクを表示します。お客様独自のシステム要件やセキュリティ優先事項に基づき、リスクレベルを独自の値に変更できます。
* 脆弱性を悪用する攻撃のタイプに対応する[Type of the vulnerability](../attacks-vulns-list.md)
* 脆弱性が存在するドメインとパス
* 脆弱性を悪用するために悪意あるペイロードを渡す際に使用されるパラメータ
* 脆弱性が[検出](../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)された手法
* 脆弱性が悪用された場合に影響を受ける可能性のある対象コンポーネント。**Server**、**Client**、**Database**のいずれかとなります。
* 脆弱性が検出された日時
* 脆弱性の最終[verification date](#verifying-vulnerabilities)
* 脆弱性の詳細な説明、悪用の例、および推奨される修正手順
* 関連するインシデント
* 脆弱性ステータスの変更履歴

脆弱性は[search string](search-and-filters/use-search.md)や事前定義されたフィルターを使用して絞り込みができます。

![Vulnerability detailed information](../images/user-guides/vulnerabilities/vuln-info.png)

すべての脆弱性は、システムが悪意のある行動に対してより脆弱になるため、アプリケーション側で修正する必要があります。脆弱性が修正できない場合は、[virtual patch](rules/vpatch-rule.md)ルールを使用することで、関連する攻撃をブロックし、インシデントのリスクを排除する手助けとなります。

## 脆弱性の検証 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarmは、activeおよびclosedな脆弱性を定期的に再チェックします。これは、以前に検出されたセキュリティ上の問題に対してインフラストラクチャの再テストを実施することを意味します。再チェックの結果、脆弱性がもはや存在しないことが示された場合、Wallarmはそのステータスを**Closed**に変更します。サーバが一時的に利用できない場合にも同様のことが発生する可能性があります。逆に、closedな脆弱性の再チェックがアプリケーション上で依然として存在することを示した場合、Wallarmはステータスを**Active**に戻します。

Activeな脆弱性および1か月以内に修正された脆弱性は1日1回再チェックされます。1か月以上前に修正された脆弱性は1週間に1回再チェックされます。

初期の脆弱性検出手法に応じて、テストは**Vulnerability Scanner**または**Threat Replay Testing**モジュールのいずれかによって実施されます。自動再チェックプロセスの構成設定は、[**Configure**](#configuring-vulnerability-detection)ボタンにより制御できます。

Passive detectionで検出された脆弱性は再チェックできません。

脆弱性を手動で再チェックする必要がある場合は、脆弱性メニューの該当オプションを使用して再チェックプロセスを実行できます:

![A vulnerability that can be rechecked](../images/user-guides/vulnerabilities/recheck-vuln.png)

## 脆弱性検出の構成

**Configure**ボタンを使用して、脆弱性検出の構成を次のオプションで詳細に調整できます:

* Vulnerability Scannerを使用して検出する特定の脆弱性タイプを選択できます。デフォルトでは、Scannerは利用可能なすべての脆弱性タイプを対象とするように設定されています。
* 脆弱性および[exposed asset](scanner.md)検出プロセスの両方を含む**Basic Scanner functionality**の有効化／無効化が可能です。デフォルトでは、この機能は有効になっています。

    **Scanner**セクションでも同じトグルスイッチが表示され、片方のセクションでスイッチを変更すると、もう一方も自動的に更新されます。
* **Recheck vulnerabilities**オプションを使用して、Scannerによる脆弱性の再チェックを有効または無効にできます。
* 脆弱性検出および再チェックのために、**Threat Replay Testing**モジュールを有効または無効にできます。このオプションは再チェックプロセスだけでなく、モジュール自体を制御することに注意してください。

    デフォルトでは、このモジュールは無効になっています。有効化する前に、[best practices](../vulnerability-detection/threat-replay-testing/setup.md)による構成について確認してください。

![Vuln scan settings](../images/user-guides/vulnerabilities/vuln-scan-settings.png)

さらに、UIの[**Scanner**](scanner.md)セクションでは、Vulnerability Scannerがどのexposed assetをスキャンするか、および各アセットに許可されるScannerによって生成されるRPS/RPMを制御できます。

## 脆弱性レポートのダウンロード

UI内の該当ボタンを使用して、脆弱性データをPDFまたはCSVレポートにエクスポートできます。Wallarmは指定されたアドレスにレポートをメールで送信します。

PDFは、脆弱性およびインシデントの要約を含む視覚的に豊かなレポートの提示に適しており、CSVは各脆弱性に関する詳細情報を提供するため、技術的な目的に適しています。CSVは、ダッシュボードの作成や最も脆弱なAPIホスト/アプリケーションのリスト作成などに利用できます。

## API呼び出しによる脆弱性取得

脆弱性の詳細を取得するために、Wallarm Console UIのほかに[Wallarm APIを直接呼び出す](../api/overview.md)こともできます。以下は該当するAPI呼び出しの例です。

過去24時間以内の**Active**ステータスの脆弱性から最初の50件を取得するには、以下のリクエストを使用してください。`TIMESTAMP`は24時間前の日付を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換した値に置き換えます:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"