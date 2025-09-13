# トリガーの操作

トリガーは、さまざまなイベントに対するWallarmの応答を設定するためのツールです。トリガーは、システムが反応できる多数のイベントと、取り得る多様なリアクションを組み合わせます。このコンストラクタのような仕組みにより、貴社固有のセキュリティ要件に合致する複雑な挙動を構成できます。

トリガーは、[US](https://us1.my.wallarm.com/triggers)または[EU](https://my.wallarm.com/triggers)のCloudの**Triggers**セクションで設定します。

![トリガーの設定セクション](../../images/user-guides/triggers/triggers-section.png)

## 動作の仕組み

各トリガーは次の構成要素で成り立っており、設定できます。

* **Condition**: Wallarmが反応すべきイベントです。例: 一定数の攻撃の発生、denylistに登録されたIPアドレス、アカウントに新しいユーザーが追加された、など。
* [**フィルター**](#understanding-filters): 条件の詳細です。例: 条件が「1日に10,000件を超える攻撃」の場合、**Type**フィルターを「SQLi」、**Response status**を「200」に設定すると、「1日に10,000件を超えるSQLi攻撃が発生し、レスポンスが200だった場合に動作する」トリガーになります。
* **Reaction**: 指定した条件とフィルターに合致した場合に実行するアクションです。例: Slackへの通知送信や、[インテグレーション](../settings/integrations/integrations-intro.md)として設定済みの他システムへの通知、IPアドレスのブロック、リクエストをブルートフォース攻撃としてマークする、など。

## トリガーでできること

トリガーを使用すると、次のことができます。

* アプリケーションやAPIに対して次の保護を提供します。

    * [複数攻撃を行う加害者からの保護](../../admin-en/configuration-guides/protecting-with-thresholds.md)
    * [ブルートフォース対策](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
    * [強制ブラウジング対策](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
    * [BOLA対策](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)

* さまざまな[Integrations](../../user-guides/settings/integrations/integrations-intro.md)向けに拡張アラートを設定します。
* [hitsのグループ化](../../user-guides/events/grouping-sampling.md#grouping-of-hits)によって攻撃やインシデントの表示を最適化します。

## フィルターの概要

フィルターは[条件](#how-it-works)を詳細化するために使用します。例えば、ブルートフォース攻撃、SQLインジェクションなど特定タイプの攻撃に対するリアクションを設定できます。Wallarm Consoleインターフェイスで1つ以上のフィルターを追加し、それぞれの値を設定できます。

![利用可能なフィルター](../../images/user-guides/triggers/trigger-filters.png)

利用できるフィルターは次のとおりです。

* **URI** (条件が**Brute force**、**Forced browsing**、**BOLA**の場合のみ): リクエストが送信された完全なURIです。URIは[URI constructor](../../user-guides/rules/rules.md#uri-constructor)または[advanced edit form](../../user-guides/rules/rules.md#advanced-edit-form)で構成できます。
* **Type** は、リクエストで検出された攻撃の[タイプ](../../attacks-vulns-list.md)またはリクエストが向けられた脆弱性のタイプです。
* **Application** は、リクエストを受け取る[アプリケーション](../settings/applications.md)です。
* **IP** は、リクエストの送信元IPアドレスです。

    このフィルターは単一IPのみを受け付けます。サブネット、ロケーション、ソースタイプは使用できません。
* **Domain** は、リクエストを受け取るドメインです。
* **Response status** は、リクエストに返されたレスポンスコードです。
* **Target** は、攻撃の対象またはインシデントが検出されたアプリケーションアーキテクチャの部位です。取り得る値は次のとおりです: `Server`、`Client`、`Database`。
* **User's role** は、追加されたユーザーの[ロール](../../user-guides/settings/users.md#user-roles)です。取り得る値は次のとおりです: `Deploy`、`Analyst`、`Administrator`、`Read only`、`API developer`。また、[マルチテナンシー](../../installation/multi-tenant/overview.md)機能が有効な場合は、`Global Administrator`、`Global Analyst`、`Global Read Only`も使用できます。

## デフォルトトリガー

新しい会社アカウントには、以下のデフォルト(事前設定済み)トリガーが用意されています。

* 同一IPからのhitsを1つの攻撃にグループ化

    このトリガーは、同一IPアドレスから送信されたすべての[hits](../../glossary-en.md#hit)をイベントリスト上で1つの攻撃にまとめます。これによりイベントリストが最適化され、攻撃分析が迅速になります。

    このトリガーは、単一のIPアドレスが15分以内に50件を超えるhitsを発生させたときに発動します。しきい値を超えた後に送信されたhitsのみが攻撃としてグループ化されます。

    hitsは攻撃タイプ、悪意のあるペイロード、URLが異なる場合があります。これらの攻撃パラメータはイベントリストで`[multiple]`タグとして表示されます。

    グループ化されたhitsのパラメータ値が異なるため、攻撃全体に対する[Mark as false positive](../events/check-attack.md#false-positives)ボタンは使用できませんが、特定のhitsを誤検知としてマークすることはできます。[攻撃のアクティブ検証](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)も利用できません。
    
    Brute force、Forced browsing、Resource overlimit、Data bomb、Virtual patchの各攻撃タイプのhitsは、このトリガーでは対象外です。
* 1時間以内に3種類を超える[悪意のあるペイロード](../../glossary-en.md#malicious-payload)を発生させたIPを1時間Graylistに登録

    [Graylist](../ip-lists/overview.md)は疑わしいIPアドレスのリストで、ノードは次のように処理します: Graylistに登録されたIPが悪意のあるリクエストを送信した場合、ノードはそれらをブロックし、正当なリクエストは許可します。Graylistと対照的に、[denylist](../ip-lists/overview.md)はアプリケーションに到達すること自体を許可しないIPアドレスを示し、denylistに登録された送信元からの正当なトラフィックでさえノードはブロックします。IPのGraylistingは、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)の低減を目的とした選択肢の1つです。

    このトリガーはノードのどのフィルタリングモードでも発動するため、ノードモードに関わらずIPをGraylistに登録します。

    ただし、ノードがGraylistを解析するのは**safe blocking**モードのときだけです。Graylistに登録されたIPからの悪意のあるリクエストをブロックするには、まずその特性を理解した上で、ノードの[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)をsafe blockingに切り替えてください。

    Brute force、Forced browsing、Resource overlimit、Data bomb、Virtual patchの各攻撃タイプのhitsは、このトリガーでは対象外です。

デフォルトトリガーは一時的に無効化できます。デフォルトトリガーの挙動を変更することもできます。その場合は、同種のカスタムトリガーを作成してください。いずれかのカスタムトリガーを作成するとデフォルトトリガーは削除されます。すべてのカスタムトリガーを削除すると、デフォルトトリガーが復元されます。

## トリガー処理の優先順位

同一の条件(例: **Brute force**、**Forced browsing**、**BOLA**)を持つトリガーが複数あり、かつ一部でURIのネストレベルが設定されている場合、より低いネストレベルのURIへのリクエストは、そのより低いネストレベルのURIでフィルターしているトリガーでのみカウントされます。

URIフィルターのないトリガーは、より上位のネストレベルと見なされます。

**例:**

* ある条件を持つ最初のトリガーにはURIによるフィルターがありません(任意のアプリケーションまたはその一部へのリクエストがこのトリガーでカウントされます)。
* 同じ条件を持つ2つ目のトリガーには、`example.com/api`というURIのフィルターがあります。

`example.com/api`へのリクエストは、`example.com/api`でフィルターしている2つ目のトリガーでのみカウントされます。

## トリガーの無効化と削除

* イベントへの通知やリアクションを一時的に停止するには、トリガーを無効化できます。無効化されたトリガーは、**All**および**Disabled**トリガーのリストに表示されます。イベントへの通知やリアクションを再度有効にするには、**Enable**オプションを使用します。
* イベントへの通知やリアクションを恒久的に停止するには、トリガーを削除できます。トリガーの削除は元に戻せません。トリガーはトリガーリストから完全に削除されます。

トリガーを無効化または削除するには、トリガーメニューから該当するオプションを選択し、必要に応じて操作を確認してください。