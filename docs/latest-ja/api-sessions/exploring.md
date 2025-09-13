[link-attacks]:                 ../user-guides/events/check-attack.md
[link-incidents]:               ../user-guides/events/check-incident.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# API Sessionsの探索 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmの[API Sessions](overview.md)がお使いのアプリケーションに関連するユーザーセッションを特定すると、Wallarm Consoleの**API Sessions**セクションでそれらを確認できます。本記事では、検出されたデータをどのように確認するかを説明します。

## 脅威アクターの活動の全体像

--8<-- "../include/request-full-context.md"

## 特定期間内のアクティビティ

指定した時間範囲内に何が起きたかを調査できます。そのためには、日付/時刻フィルターを設定します。指定した時間に発生したリクエストを含むセッションのみが表示され、各セッション内でもその時間範囲のリクエストのみが表示されます。

![!API Sessions - 特定期間内のアクティビティ](../images/api-sessions/api-sessions-timeframe.png)

ヒント: ご自身のブラウザーで[セッションへのリンク](#sharing-session-information)を使用し、**その後**時間範囲を設定して、選択した時間内の選択したセッションからのリクエストのみを表示します。

## セッション内の特定のアクティビティ

セッションには、POSTやGETなどのさまざまな種類の多数のリクエスト、異なるレスポンスコード、異なるIPからのもの、正当なものとさまざまな攻撃タイプの悪意のあるものが含まれる場合があります。

セッション詳細では、さまざまな基準によるリクエスト分布の包括的な統計を確認できます。セッション内フィルターを1つまたは複数適用して、特定のリクエストのみを表示できます。

![!API Sessions - セッション内のフィルター](../images/api-sessions/api-sessions-inline-filters.png)

セッション内フィルターは**API Sessions**セクションの全体フィルターと連動します:

* 全体フィルターを適用した後に開いた任意のセッションはこれらのフィルターを共有します（セッション内で**Show all requests**をクリックすると解除できます）。
* **Apply filters**ボタンを使用して、現在のセッション内に全体フィルターを適用します。

## 影響を受けたエンドポイントの確認

セッションのリクエスト詳細の**API Discovery insights**を使用して、影響を受けたエンドポイントを確認します。エンドポイントにリスクがあるか、そのリスクがエンドポイントが[ローグ](../api-discovery/rogue-api.md)（具体的にはシャドウまたはゾンビAPI）であることに起因するか、どの程度どの対策で保護されているかをすぐに把握できます。

![!API Sessions - APIDエンドポイントインサイト](../images/api-sessions/api-sessions-apid-insight.png)

[**API Discovery**](../api-discovery/overview.md)セクションのエンドポイント情報に切り替えるには、**Explore in API Discovery**をクリックします。

## パフォーマンス問題の特定

セッションのリクエスト詳細にある**Time,ms**および**Size,bytes**列を使用して、表示されたデータを平均的な想定値と比較できます。大幅に超過している値は、パフォーマンス問題やボトルネックの可能性、ならびにユーザー体験を最適化できる可能性を示します。

## 機微なビジネスフロー

[API Discovery](../api-discovery/overview.md)では、[機微なビジネスフロー](../api-discovery/sbf.md)機能（NGINX Node 5.2.11またはネイティブNode 0.10.1以上が必要）により、認証、アカウント管理、課金などの特定のビジネスフローや機能にとって重要なエンドポイントを自動および手動で特定できます。

セッションのリクエストが、API Discoveryで特定の機微なビジネスフローに重要とタグ付けされたエンドポイントに影響する場合、そのセッションにもそのビジネスフローに影響していることを示すタグが自動的に付与されます。

セッションに機微なビジネスフローのタグが付与されると、特定のビジネスフローでフィルタリングできるようになり、分析で最も重要なセッションを選びやすくなります。

![!API Sessions - 機微なビジネスフロー](../images/api-sessions/api-sessions-sbf-no-select.png)

Wallarmはビジネスフローを一覧表示し、セッションの総リクエスト数に対する当該フロー関連のリクエスト数と割合を表示します。

セッションは次のいずれかの機微なビジネスフローに関連付けられる場合があります:

--8<-- "../include/default-sbf.md"

**Business flow**フィルターを使用して、特定のフローに影響するすべてのセッションを迅速に分析することができます。

## ユーザーとロール別のセッション

API Sessionsでユーザーとそのロールに関する情報を取得するように[設定](setup.md#users-and-roles)している場合、ユーザーおよびロールでセッションをフィルタリングできます。

![!API Sessions - ユーザーおよびユーザーロールの表示](../images/api-sessions/api-sessions-user-role-display.png)

## API不正使用検知の精度の検証

--8<-- "../include/bot-attack-full-context.md"

## 攻撃検知の調整

セッションの悪意のあるリクエストから直接、攻撃検知に関するWallarmの動作を調整できます:

* 攻撃を[誤検知](../about-wallarm/protecting-against-attacks.md#false-positives)としてマークできます。フィルタリングノードは今後そのようなリクエストを攻撃として認識しません。
* [ルール](../user-guides/rules/rules.md)を作成できます。アクティブになると、そのルールはリクエストの分析およびその後の処理におけるWallarmのデフォルト動作を変更します。

![!API Sessions - リクエスト詳細 - 利用可能なアクション](../images/api-sessions/api-sessions-request-details-actions.png)

## セッション情報の共有 {#sharing-session-information}

セッションで不審な挙動を見つけ、洞察を同僚と共有したり、さらなる分析のためにセッションを保存したい場合は、セッション詳細の**Copy link**または**Download CSV**を使用します。

![!API Sessions - セッション情報の共有](../images/api-sessions/api-sessions-share.png)