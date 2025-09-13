# APIの変更の追跡 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

APIに変更が発生すると、[API Discovery](overview.md)は構築済みのAPIインベントリを更新し、変更点を強調表示し、いつ何が変更されたかの情報を提供します。さらに、これらの変更のすべてまたは一部について通知を設定できます。

![API Discovery - 変更の追跡](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

企業には複数のチーム、異なるプログラミング言語、さまざまなフレームワークが存在する場合があります。このため、変更はさまざまなソースからいつでもAPIに入り込み、管理が難しくなります。セキュリティ担当者にとっては、変更を可能な限り早く検知して分析することが重要です。見逃すと、例えば次のようなリスクが生じる可能性があります。

* 開発チームが別個のAPIを持つサードパーティライブラリを使い始めても、セキュリティ担当者に通知しない場合があります。その結果、監視されず脆弱性チェックも行われていないエンドポイントが生まれ、攻撃経路となり得ます。
* エンドポイントにPIIデータが送られ始めます。計画外のPII転送は、規制要件へのコンプライアンス違反や評判上のリスクにつながる可能性があります。
* ビジネスロジック上で重要なエンドポイント（例：`/login`、`/order/{order_id}/payment/`）が呼び出されなくなります。
* `is_admin`のような、本来送るべきではないパラメータ（誰かがエンドポイントへアクセスし、管理者権限での操作を試みている）がエンドポイントに送られ始めます。

## APIの変更の強調表示

**API Discovery**セクションを開くたびに、**Changes since**フィルターは`Last week`に設定され、直近1週間に発生した変更が強調表示されます。期間を変更するには、**Changes since**フィルターで日付を再設定します。

エンドポイント一覧では、次のラベルでAPIの変更が強調表示されます。

- 期間内に一覧へ追加されたエンドポイントには**New**が表示されます。
- 期間内に新規に検出されたパラメータがある、または`Unused`ステータスになったパラメータがあるエンドポイントには**Changed**が表示されます。エンドポイントの詳細では、そのようなパラメータに対応するラベルが表示されます。

    * パラメータは、期間内に検出された場合、`New`ステータスになります。
    * パラメータは、7日間データを一切受け渡さない場合、`Unused`ステータスになります。
    * その後`Unused`ステータスのパラメータが再びデータを受け渡した場合は、`Unused`ステータスが解除されます。

- 期間内に`Unused`ステータスになったエンドポイントには**Unused**が表示されます。

    * エンドポイントは、7日間リクエストされない（応答コード200が返らない）場合、`Unused`ステータスになります。
    * その後`Unused`ステータスのエンドポイントに再びリクエストがあり（応答コード200が返る）、`Unused`ステータスが解除されます。

どの期間を選択しても、**New**、**Changed**、**Unused**のいずれのマークも表示されない場合は、その期間にAPIの変更はありません。

![API Discovery - 変更の追跡](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

rogueとしてマークされたエンドポイント向けの簡単なヒント：

* **New**、**Changed**、**Unused**ラベルにマウスオーバーすると、変更が発生した時期を確認できます。
* **Changed**のエンドポイントの詳細に移動すると、このステータスの理由（**New**になったパラメータや**Unused**ステータスになったパラメータ）を確認できます。ラベルにマウスオーバーすると、パラメータの変更が発生した時期を確認できます。
* 直近7日間のすべての種類の変更のカウンターは[API Discovery Dashboard](dashboard.md)に表示されます。

## APIの変更のフィルタリング

**API Discovery**セクションで**Changes since**フィルターを使用すると、選択した期間に変更されたエンドポイントのみが強調表示されますが、変更のないエンドポイントは除外されません。

**Changes in API**フィルターは動作が異なり、選択した期間に変更されたエンドポイントのみを表示し、それ以外はすべて除外します。

<a name="example"></a>例を考えます。今日時点でAPIには10個のエンドポイントがあります（以前は12個ありましたが、そのうち3個は10日前にUnusedとしてマークされました）。この10個のうち1つは昨日追加され、2つはパラメータに変更があり、1つは5日前、もう1つは10日前に発生しました。

* 今日**API Discovery**セクションを開くたびに、**Changes since**フィルターは`Last week`に設定されます。ページには10個のエンドポイントが表示され、**Changes**列では1つに**New**、1つに**Changed**マークが表示されます。
* **Changes since**を`Last 2 weeks`に切り替えると、13個のエンドポイントが表示され、**Changes**列では1つに**New**、2つに**Changed**、3つに**Unused**マークが表示されます。
* **Changes in API**を`Unused endpoints`に設定すると、3個のエンドポイントのみが表示され、すべて**Unused**マークが付きます。
* **Changes in API**を`New endpoints + Unused endpoints`に変更すると、4個のエンドポイントが表示され、3つに**Unused**、1つに**New**マークが付きます。
* **Changes since**を`Last week`に戻すと、1個のエンドポイントのみが表示され、**New**マークが付きます。

## 通知の受信

APIの変更についてメッセンジャー、SIEM、またはログ管理システムに即時通知を送るには、**Changes in API**条件を持つ[triggers](../user-guides/triggers/triggers.md)を構成します。

新規、変更あり、または未使用のエンドポイントに関するメッセージ、あるいはそれらすべての変更に関するメッセージを受け取ることができます。監視したいアプリケーションやホスト、および含まれる機密データの種類で通知を絞り込むこともできます。

**Triggerの例: Slackでの新規エンドポイント通知**

この例では、API Discoveryモジュールが`example.com`のAPIホストで新規エンドポイントを検出した場合、設定済みのSlackチャンネルにその旨の通知が送信されます。

![Changes in APIトリガー](../images/user-guides/triggers/trigger-example-changes-in-api.png)

**トリガーをテストするには：**

1. [US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウドのWallarm Console → **Integrations**に移動し、[Slackとの連携](../user-guides/settings/integrations/slack.md)を構成します。
1. **Triggers**セクションで、上記のとおりTriggerを作成します。
1. `example.com/users`エンドポイントに対して、`200`（`OK`）の応答が得られるように複数のリクエストを送信します。
1. **API Discovery**セクションで、エンドポイントが**New**マーク付きで追加されたことを確認します。
1. Slackチャンネルに次のようなメッセージが届いていることを確認します：
    ```
    [wallarm] APIに新しいエンドポイントが検出されました

    Notification type: api_structure_changed

    APIで新しいGET example.com/usersエンドポイントが検出されました。

        Client: Client 001
        Cloud: US

        Details:

          application: Application 1802
          domain: example.com
          endpoint_path: /users
          http_method: GET
          change_type: added
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```