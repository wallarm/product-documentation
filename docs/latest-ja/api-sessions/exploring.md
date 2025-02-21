[link-attacks]:                 ../user-guides/events/check-attack.md
[link-incidents]:               ../user-guides/events/check-incident.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# APIセッションの探索 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmの[API Sessions](overview.md)がアプリケーションに関連するユーザーセッションを特定すると、Wallarm Consoleの**API Sessions**セクションでそれらのセッションを確認できます。本稿では、発見されたデータの確認方法について解説します。

## 脅威アクターの活動全体像

--8<-- "../include/request-full-context.md"

## 特定の時間内の活動

指定された時間間隔内に何が起こったかを調査できます。これを行うには、日付/時間フィルタを設定してください。指定された時間に実行されたリクエストを含むセッションのみが表示され、各セッション内ではその時間間隔のリクエストのみが表示されます。

![!API Sessions - 特定の時間内の活動](../images/api-sessions/api-sessions-timeframe.png)

ヒント：ご自身のブラウザで[セッションへのリンク](#sharing-session-information)を使用し、**その後**タイムインターバルを設定して、選択したセッション内の選択された時間のリクエストのみを表示してください。

## セッション内の特定の活動

セッションには、POST、GETなどのさまざまなタイプのリクエスト、異なるレスポンスコード、異なるIP、正当なものと悪意あるもの、さまざまな攻撃タイプのリクエストが多数含まれている場合があります。

セッションの詳細では、さまざまな基準によるリクエストの分布に関する包括的な統計情報が表示されます。特定のリクエストのみを表示するために、セッション内フィルタ（1つまたは複数）を適用できます。

![!API Sessions - セッション内フィルタ](../images/api-sessions/api-sessions-inline-filters.png)

セッション内フィルタは、**API Sessions**セクションの一般フィルタと連携しています：

* 一般フィルタが適用された後に開かれたセッションは、それらのフィルタを共有します（セッション内で**Show all requests**をクリックしてキャンセルできます）。
* 現在のセッション内に一般フィルタを適用するには、**Apply filters**ボタンを使用してください。

## 影響を受けたエンドポイントの確認

セッションリクエストの詳細で**API Discovery insights**を使用して、影響を受けたエンドポイントを確認します。エンドポイントがリスクにさらされているか、そのリスクがエンドポイントが[rogue](../api-discovery/rogue-api.md)である（具体的には、シャドウまたはゾンビAPI）ことに起因しているか、またそれがどの程度およびどのような対策により保護されているかを即座に把握できます。

![!API Sessions - APIDエンドポイントインサイト](../images/api-sessions/api-sessions-apid-insight.png)

エンドポイント情報を[**API Discovery**](../api-discovery/overview.md)セクションで確認するには、**Explore in API Discovery**をクリックしてください。

## パフォーマンス問題の特定

セッションリクエストの詳細にある**Time,ms**および**Size,bytes**の列を使用して、提示されたデータと平均期待値を比較できます。大幅に超過する値は、潜在的なパフォーマンス問題やボトルネック、ユーザーエクスペリエンスの最適化の可能性を示唆します。

## 機微なビジネスフロー

[API Discovery](../api-discovery/overview.md)では、[sensitive business flow](../api-discovery/sbf.md)機能（NGINX Node 5.2.11またはネイティブNode 0.10.1以上が必要）により、認証、アカウント管理、請求などの重要な機能やビジネスフローに不可欠なエンドポイントを自動および手動で特定できます。

セッションのリクエストが、API Discoveryで重要とタグ付けされたエンドポイントに影響を与えた場合、そのセッションは自動的に当該ビジネスフローに影響を与えたものとしてタグ付けされます。

セッションに機微なビジネスフローのタグが付与されると、特定のビジネスフローでフィルタリングすることが可能となり、分析すべき重要なセッションを選定しやすくなります。

![!API Sessions - 機微なビジネスフロー](../images/api-sessions/api-sessions-sbf-no-select.png)

Wallarmはビジネスフローを一覧表示し、全セッションリクエストに対するリクエスト数および割合を表示します。

セッションは、以下のいずれかの機微なビジネスフローに関連付けられる可能性があります：

--8<-- "../include/default-sbf.md"

特定のフローに影響を与えるすべてのセッションを迅速に分析するには、**Business flow**フィルタを使用してください。

## ユーザーとロールによるセッション

[設定済み](setup.md#users-and-roles)の場合、ユーザーおよびそのロールに関する情報を取得するためにAPI Sessionsを利用して、セッションをユーザーやロールでフィルタリングできます。

![!API Sessions - ユーザーおよびユーザーロール表示](../images/api-sessions/api-sessions-user-role-display.png)

## API悪用検出の精度の検証

--8<-- "../include/bot-attack-full-context.md"

## 攻撃検出の調整

セッション内の悪意あるリクエストから、Wallarmが攻撃検出に関してどのように動作するかを直接調整できます：

* 攻撃が[false-positive](../about-wallarm/protecting-against-attacks.md#false-positives)としてマークされると、フィルタリングノードは将来そのようなリクエストを攻撃として認識しなくなります。
* [rule](../user-guides/rules/rules.md)が作成されると、有効化されるとルールはリクエストの解析およびその後の処理時にデフォルトのWallarmの動作を変更します。

![!API Sessions - リクエスト詳細 - 利用可能なアクション](../images/api-sessions/api-sessions-request-details-actions.png)

## セッション情報の共有

セッション内で疑わしい動作が見つかり、同僚とインサイトを共有し、今後の分析のためにセッションを保存したい場合は、セッション詳細内の**Copy link**または**Download CSV**を使用してください。

![!API Sessions - セッション情報の共有](../images/api-sessions/api-sessions-share.png)