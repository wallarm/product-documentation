# トリガーの利用方法

トリガーは、カスタム通知とイベントへの反応を設定するために使用されるツールです。トリガーを使用することで、次のことが可能になります。

* 企業のメッセンジャーやインシデント管理システムなど、日々の業務で使用するツールを通じて、重要なイベントに対する警告を受け取る。
* 特定の数のリクエストや攻撃ベクトルが送信されたIPアドレスをブロックする。
* [行動パターン攻撃](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)を特定のAPIエンドポイントへのリクエスト数によって識別する。
* 同じIPアドレスから来る[hitsをグループ化](../../about-wallarm/protecting-against-attacks.md#attack)して一つの攻撃にすることで、イベントリストを最適化する。

全てのトリガーのコンポーネントは設定可能です。

* **条件**：通知が必要なシステムイベント。例えば、特定の数の攻撃の発生、ブロックリストに登録されたIPアドレス、アカウントに新しいユーザーが追加された場合などがあります。
* **フィルタ**：条件の詳細な情報。例えば、攻撃のタイプなどです。
* **反応**：指定された条件とフィルタが満たされた場合に実行するべきアクション。例えば、通知をSlackや他の[統合](../settings/integrations/integrations-intro.md)されたシステムに送信したり、IPアドレスをブロックしたり、リクエストをブルートフォース攻撃としてマークすることが可能です。

トリガーは、Wallarm Consoleの「トリガー」セクションで設定します。このセクションは、「**管理者**」 [ロール](../settings/users.md)を持つユーザーのみが利用可能です。

![トリガーの設定箇所](../../images/user-guides/triggers/triggers-section.png)

## トリガーの作成

1. **トリガーを作成** ボタンをクリックします。
2. 条件を[選択](#step-1-choosing-a-condition)します。
3. [フィルタを追加](#step-2-adding-filters)します。
4. [反応を追加](#step-3-adding-reactions)します。
5. トリガーを[保存](#step-4-saving-the-trigger)します。

### ステップ1: 条件の選択

条件とは、通知が必要なシステムイベントのことです。次のような通知可能な条件があります。

* [Brute force](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA](../../admin-en/configuration-guides/protecting-against-bola.md)
* [Weak JWT](trigger-examples.md#detect-weak-jwts)
* [攻撃ベクトル（悪意のあるペイロード）](../../glossary-en.md#malicious-payload)の数（[カスタム正規表現](../rules/regex-rule.md)ベースの実験ペイロードはカウントされません）
* [攻撃](../../glossary-en.md#attack)の数（[カスタム正規表現](../rules/regex-rule.md)ベースの実験攻撃はカウントされません）
* [ヒット](../../glossary-en.md#hit)の数を除く：

    * [カスタム正規表現](../rules/regex-rule.md)に基づいて検出された実験的なヒット。非実験的なヒットは数えられます。
    * [サンプル](../events/analyze-attack.md#sampling-of-hits)に保存されていないヒット。
* インシデント数
* ブロックリストIP
* [APIインベントリの変更](../../api-discovery/track-changes.md)
* 同じIPからのヒット、ただし、Brute force, Forced browsing, BOLA(IDOR), Resource overlimit, Data bomb、Virtual patchの攻撃タイプは除く
* ユーザー追加された数

![利用可能な条件](../../images/user-guides/triggers/trigger-conditions.png)

Wallarm Consoleインターフェースで条件を選択し、それに応じて反応の下限閾値を設定します（設定可能な場合）。

### ステップ2: フィルタの追加

フィルタは、条件を詳細化するために使用されます。たとえば、特定のタイプの攻撃（ブルートフォース攻撃やSQLインジェクションなど）に反応する設定を行うことができます。

次のフィルタが利用可能です：

* **URI**（条件が **Brute force**、**Forced browsing**、**BOLA**の場合のみ）:リクエストが送信された完全なURI。URIは、[URI constructor](../../user-guides/rules/rules.md#uri-constructor)や[advanced edit form](../../user-guides/rules/rules.md#advanced-edit-form)を通じて設定可能です。
* **Type**：リクエストで検出された攻撃の[type](../../attacks-vulns-list.md)、またはリクエストが向けられた脆弱性のタイプ。
* **Application**：リクエストを受け取る[application](../settings/applications.md)またはインシデントが検出される場所。
* **IP**：リクエストが送信されたIPアドレス。

    このフィルターは単一のIPを期待し、サブネットやロケーション、ソースタイプは許可されません。
* **Domain**：リクエストを受け取るドメインまたはインシデントが検出されるドメイン。
* **Response status**：リクエストに対して返されたレスポンスコード。
* **Target**：攻撃が向けられたアプリケーションアーキテクチャの部分、またはインシデントが検出された箇所。次の値をとることができます： `Server`、 `Client`、 `Database`。
* **User's role**：追加されたユーザーの役割。以下のいずれかの値を取ることができます： `Deploy`、 `Analyst`、 `Admin`。

Wallarm Console インターフェースで1つ以上のフィルタを選択し、その値を設定します。

![利用可能なフィルタ](../../images/user-guides/triggers/trigger-filters.png)

### ステップ3: 反応の追加

反応は、指定した条件とフィルタが満たされた場合に行うべきアクションです。利用可能な反応のセットは、選択された条件によります。反応には次のタイプがあります：

* [リクエストをブルートフォース攻撃または強制ブラウジング攻撃としてマークする](../../admin-en/configuration-guides/protecting-against-bruteforce.md)。リクエストはイベントリスト内で攻撃としてマークされますが、ブロックはされません。リクエストをブロックするには、追加の反応としてIPアドレスを[denylist](../ip-lists/denylist.md)に登録することができます。
* [リクエストをBOLA攻撃としてマークします](../../admin-en/configuration-guides/protecting-against-bola.md)。リクエストはイベントリスト内で攻撃としてマークされますが、ブロックはされません。リクエストをブロックするには、追加の反応としてIPアドレスを[denylist](../ip-lists/denylist.md)に登録することができます。
* [JWTの脆弱性を記録します](trigger-examples.md#detect-weak-jwts)。
* IPを[denylist](../ip-lists/denylist.md)に追加します。
* IPを[graylist](../ip-lists/graylist.md)に追加します。
* [統合](../settings/integrations/integrations-intro.md)で設定されたSIEM システムまたはWebhook URLに通知を送ります。
* [統合](../settings/integrations/integrations-intro.md)で設定されたメッセンジャーに通知を送ります。

    !!! warning "メッセンジャー経由でのブロックリストIPの通知"
        トリガーはブロックリストIPに関する通知をSIEMシステムまたはWebhook URLにのみ送信できます。**ブロックリストIP** トリガー条件に対するメッセンジャーは利用できません。
* トリガー条件が **同じIPからのヒット** の場合、次の[ヒットを一つの攻撃にグループ化](trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack)します。

    これらの攻撃に対する[**false positiveとしてマークする**](../events/false-attack.md#mark-an-attack-as-a-false-positive)ボタンと [active verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)オプションは利用できません。

Wallarm Consoleインターフェースで1つ以上の反応を選択します。利用可能な反応は、条件によって位置が異なります。**攻撃の数**に存在します。

![統合の選択](../../images/user-guides/triggers/select-integration.png)

### ステップ4: トリガーの保存

1. トリガー作成モーダルダイアログで **Create** ボタンをクリックします。
2. 必要に応じてトリガーの名前と説明を指定し、 **完了** ボタンをクリックします。

トリガーの名前と説明が指定されていない場合、トリガーの名前は「New trigger by <username>, <creation_date>」とし、説明は空にされます。

## 事前設定されたトリガー（デフォルトトリガー）

新しい企業アカウントには、次の事前設定されたトリガー（デフォルトトリガー）が設定されています：

* 同じIPから来るヒットを一つの攻撃にグループ化

    このトリガーは、同じIPアドレスから送信された全ての[ヒット](../../glossary-en.md#hit)をイベントリスト内で一つの攻撃にグループ化します。これにより、イベントリストが最適化され、攻撃分析が迅速に行えるようになります。

    このトリガーは、単一のIPアドレスが15分以内に50以上のヒットを発生させたときにリリースされます。閾値を超えた後に送信されたヒットのみが攻撃にグループ化されます。

    ヒットは、異なる攻撃タイプ、悪意のあるペイロード、URLを持つことができます。これらの攻撃パラメータは、イベントリスト内で[複数選択]タグとしてマークされます。

    グループ化されたヒットのパラメータの値が異なるため、全体の攻撃に対する[false positiveとしてマークする](../events/false-attack.md#mark-an-attack-as-a-false-positive)ボタンは利用できませんが、特定のヒットをfalse positiveとしてマークすることは依然として可能です。[攻撃のアクティブな検証](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)も利用できません。

    このトリガーでは、Brute force, Forced browsing, Resource overlimit, Data bomb、Virtual patchの攻撃タイプを持つヒットは考慮されません。
* 1時間以内に3つ以上の異なる[悪意のあるペイロード](../../glossary-en.md#malicious-payload)を生成した場合、そのIPを1時間[graylist](../ip-lists/graylist.md)に登録

    [Graylist](../ip-lists/graylist.md)は、ノードが次のように処理する疑わしいIPアドレスのリストです： graylisted IPが悪意のあるリクエストを生成する場合、ノードはそれらをブロックしながら、正当なリクエストは許可します。graylistとは対照的に、[denylist](../ip-lists/denylist.md)は、ノードがdenylistedソースから生成されたさらに正当なトラフィックまでブロックする、全くアプリケーションに到達しないIPアドレスを指します。IPのgraylistingは、[false positive](../../about-wallarm/protecting-against-attacks.md#false-positives)の削減を目指したオプションの一つです

    このトリガーは、任意のノードフィルタモードでリリースされるため、ノードモードに関係なくIPをgraylistに登録します。

    しかし、ノードは**安全ブロッキング**モードでのみgraylistを分析します。graylisted IPからの悪意のあるリクエストをブロックするには、まずその特性を学び、ノードの[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を安全ブロッキングに切り替えます。

    このトリガーでは、Brute force, Forced browsing, Resource overlimit, Data bomb、Virtual patchの攻撃タイプを持つヒットは考慮されません。
* 弱いJWTの検出

    [JSON Web Token (JWT)](https://jwt.io/)は、APIなどのリソース間でデータを安全に交換するために使用される一般的な認証標準です。JWTの妥協は、攻撃者の一般的な目標であり、これにより認証メカニズムを突破すると、攻撃者はWebアプリケーションやAPIへの完全なアクセス権を得ることができます。JWTが弱ければ、妥協する可能性が高まります。

    このトリガーは、Wallarmが着信リクエスト内の弱いJWTを自動的に検出し、対応する[脆弱性](../vulnerabilities.md)を記録するようにします。

トリガーはデフォルトでは会社アカウント内の全トラフィックで動作しますが、任意のトリガー設定を変更することができます。

## トリガーの無効化と削除

* 一時的にイベントへの通知や反応を停止するには、トリガーを無効にすることができます。無効化されたトリガーは、「全て」と「無効化」のトリガーリストに表示されます。イベントへの通知と反応を再開するには、「有効化」オプションを使用します。
* 恒久的にイベントへの通知と反応を停止するには、トリガーを削除することができます。トリガーの削除は元に戻すことはできません。トリガーはトリガーリストから完全に削除されます。

トリガーを無効化または削除するには、トリガーメニューから適切なオプションを選択し、必要に応じてそのアクションを確認してください。

<!-- ## デモビデオ

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/ODHh-die9tY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->