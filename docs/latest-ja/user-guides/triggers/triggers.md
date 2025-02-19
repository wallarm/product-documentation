# トリガーの操作

トリガーはWallarmが各種イベントに対応するために用いるツールです。トリガーは、システムが反応できる多数のイベントと各種の反応を組み合わせることができます。このコンストラクター風のプロセスにより、企業独自のセキュリティ要件に合わせた複雑な動作を設定できます。

トリガーの設定は[US](https://us1.my.wallarm.com/triggers)または[EU](https://my.wallarm.com/triggers) Cloudの**Triggers**セクションで行います。

![トリガー設定セクション](../../images/user-guides/triggers/triggers-section.png)

## 仕組み

各トリガーは以下の構成要素から構成され、それぞれ設定できます:

* **Condition**: Wallarmが反応すべきイベントです。例えば、一定数の攻撃が検出された場合、denylisted IPアドレス、アカウントに新たなユーザーが追加された場合などです。
* [**Filters**](#understanding-filters): 条件の詳細です。例えば、条件が「1日あたり10,000件を超える攻撃」の場合、**Type**フィルターを「SQLi」に、**Response status**フィルターを「200」に設定すると、1日あたり10,000件以上のSQLi攻撃で200の応答を得た場合にアクションを実行するという意味になります。
* **Reaction**: 指定された条件およびフィルターが満たされた場合に実行されるアクションです。例えば、Slackや別のシステムに通知を送信する[integration](../settings/integrations/integrations-intro.md)を利用したり、IPアドレスをブロックしたり、要求をブルートフォース攻撃として識別したりします。

## トリガーでできること

トリガーを使用することで、以下が可能です:

* アプリケーションおよびAPIに対して、以下の保護措置を提供できます:

    * [複数攻撃実行者からの保護](../../admin-en/configuration-guides/protecting-with-thresholds.md)
    * [ブルートフォース攻撃からの保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
    * [Forced browsingからの保護](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
    * [BOLA攻撃からの保護](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)

* 各種[integrations](../../user-guides/settings/integrations/integrations-intro.md)に対して拡張アラートを設定できます。
* [grouping hits](../../user-guides/events/grouping-sampling.md#grouping-of-hits)により、攻撃とインシデントの表示を最適化できます。

## フィルターの理解

フィルターは、[条件](#how-it-works)の詳細を設定するために使用します。例えば、ブルートフォース攻撃、SQLインジェクションなど、特定のタイプの攻撃に対する反応を設定できます。Wallarm Consoleインターフェースで1つ以上のフィルターを追加し、その値を設定できます。

![利用可能なフィルター](../../images/user-guides/triggers/trigger-filters.png)

利用可能なフィルターは以下の通りです:

* **URI**（**ブルートフォース**、**Forced browsing**および**BOLA**条件のみ）: リクエストが送信された完全なURIです。URIは[URI constructor](../../user-guides/rules/rules.md#uri-constructor)または[advanced edit form](../../user-guides/rules/rules.md#advanced-edit-form)を通じて設定できます.
* **Type**は、リクエストで検出された攻撃の[タイプ](../../attacks-vulns-list.md)またはリクエストが対象とする脆弱性のタイプです.
* **Application**は、リクエストを受信する[アプリケーション](../settings/applications.md)です.
* **IP**は、リクエストが送信されたIPアドレスです.

    このフィルターでは単一のIPのみを対象とし、サブネット、ロケーション、ソースタイプは許可されません.
* **Domain**は、リクエストを受信するドメインです.
* **Response status**は、リクエストに対して返された応答コードです.
* **Target**は、攻撃の対象となるか、インシデントが検出されたアプリケーションアーキテクチャの部分です。値として`Server`、`Client`、`Database`が使用できます.
* **User's role**は、追加されたユーザーの[ロール](../../user-guides/settings/users.md#user-roles)です。値として`Deploy`、`Analyst`、`Administrator`、`Read only`、`API developer`、および[multitenancy](../../installation/multi-tenant/overview.md)機能が有効な場合は`Global Administrator`、`Global Analyst`、`Global Read Only`が使用できます.

## デフォルトトリガー

新しい企業アカウントには、以下のデフォルト（プリコンフィグ済み）のトリガーが備わっています:

* 同一IPからのヒットを1つの攻撃としてグループ化

    このトリガーは、同一IPアドレスから送信されたすべての[ヒット](../../glossary-en.md#hit)を1つの攻撃としてイベントリストにグループ化します。これにより、イベントリストが最適化され、攻撃の分析が迅速になります.

    このトリガーは、単一IPアドレスから15分以内に50件以上のヒットが送信されたときに作動します。閾値を超えた後に送信されたヒットのみが攻撃としてグループ化されます.

    ヒットは、異なる攻撃タイプ、悪意あるペイロード、およびURLを持つ場合があります。これらの攻撃パラメーターは、イベントリスト内で`[multiple]`タグが付与されます.

    グループ化されたヒットが異なるパラメータ値を持つため、攻撃全体に対して[Mark as false positive](../events/check-attack.md#false-positives)ボタンが使用できなくなりますが、特定のヒットについてはfalse positiveとしてマークできます。[Active verification of the attack](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)も利用できなくなります.
    
    ブルートフォース、Forced browsing、Resource overlimit、Data bomb、またはVirtual patch攻撃タイプのヒットは、このトリガーの対象外です.
* 1時間以内に3種類以上の異なる[malicious payloads](../../glossary-en.md#malicious-payload)を送信した場合、IPを1時間グレイリストに登録

    [Graylist](../ip-lists/overview.md)は、ノードが処理する疑わしいIPアドレスのリストです。グレイリストに登録されたIPが悪意あるリクエストを送信した場合、ノードは正当なリクエストを許可しつつ、それらをブロックします。一方、[denylist](../ip-lists/overview.md)は、アプリケーションへのアクセスが完全に制限されるIPアドレスを示し、denylistに登録されたソースからの正当なトラフィックもブロックします。IPのグレイリスト化は、[false positives](../../about-wallarm/protecting-against-attacks.md#false-positives)の削減を目的としたオプションの一つです.

    このトリガーは、いかなるノードフィルトレーションモードでも作動するため、ノードモードに関係なくIPをグレイリストに登録します.

    ただし、ノードは**safe blocking**モードのみでグレイリストを分析します。グレイリストに登録されたIPからの悪意あるリクエストをブロックするには、事前にその機能について学習した後、ノードの[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)をsafe blockingに切り替える必要があります.

    ブルートフォース、Forced browsing、Resource overlimit、Data bomb、またはVirtual patch攻撃タイプのヒットは、このトリガーの対象外です.

デフォルトトリガーは一時的に無効化できます。また、デフォルトトリガーの提供する動作を変更することも可能です。その場合、同じタイプのカスタムトリガーを作成します。カスタムトリガーを作成するとデフォルトトリガーは削除され、すべてのカスタムトリガーを削除するとデフォルトトリガーが復元されます.

## トリガー処理の優先順位

同一の条件（例えば、**Brute force**、**Forced browsing**、**BOLA**）を持つトリガーが複数存在し、そのうちの一部にURIのネスティングレベルが設定されている場合、低いネスティングレベルのURIフィルターを持つトリガーでのみリクエストがカウントされます.

URIフィルターがないトリガーは、高いネスティングレベルとみなされます.

**例:**

* 1つ目の同じ条件のトリガーにはURIフィルターがないため、あらゆるアプリケーションまたはその一部へのリクエストがこのトリガーでカウントされます.
* 2つ目の同じ条件のトリガーにはURIフィルター`example.com/api`が設定されています.

`example.com/api`へのリクエストは、URIフィルターが`example.com/api`に設定された2つ目のトリガーでのみカウントされます.

## トリガーの無効化と削除

* イベントに対する通知および反応の送信を一時的に停止するには、トリガーを無効化できます。無効化されたトリガーは**All**および**Disabled**トリガーのリストに表示されます。通知および反応の送信を再度有効にするには、**Enable**オプションを使用します.
* イベントへの通知および反応の送信を永続的に停止するには、トリガーを削除できます。トリガーの削除は取り消しできず、トリガーリストから完全に削除されます.

トリガーを無効化または削除するには、トリガーメニューから該当するオプションを選択し、必要に応じて操作を確認してください.