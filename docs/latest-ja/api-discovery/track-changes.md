# APIの変更追跡 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

もしAPIに変更が発生した場合、[API Discovery](overview.md)はビルトインのAPIインベントリを更新し、変更箇所を強調表示し、いつ何が変更されたのかの情報を提供します。また、すべてもしくは一部の変更に対する通知を設定することができます。

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

企業では複数のチームや異なるプログラミング言語、さまざまな言語フレームワークが存在する場合があります。したがって、APIへの変更は異なるソースからいつでも発生する可能性があり、管理が困難となります。セキュリティ担当者にとって、変更をできるだけ早く検出し、分析することが重要です。見逃すと、以下のようなリスクが生じる可能性があります:

* 開発チームが別のAPIを持つサードパーティライブラリを使用し始め、セキュリティ専門家に通知しない場合があります。この結果、企業は監視されず脆弱性検査されないエンドポイントを持つことになり、潜在的な攻撃経路となる可能性があります。
* 個人識別情報（PII）がエンドポイントに転送され始める場合があります。計画外のPII転送は、規制当局の要求事項への準拠違反および信用リスクにつながる可能性があります。
* ビジネスロジック上重要なエンドポイント（例：`/login`、`/order/{order_id}/payment/`）が呼び出されなくなる場合があります。
* 転送すべきでないその他のパラメータ（例：`is_admin`―エンドポイントにアクセスして管理者権限で操作を試みる際のもの）が転送され始める場合があります。

## APIの変更点の強調表示

API Discoveryセクションを開くたびに、**Changes since**フィルターは`Last week`状態となり、直近1週間以内の変更が強調表示されます。表示期間を変更するには、**Changes since**フィルターで日付を再設定してください。

エンドポイント一覧では、次のマークでAPIの変更が強調表示されます:

* **New** ― 期間内に一覧に追加されたエンドポイント
* **Changed** ― 期間内に新たに発見されたパラメータまたは`Unused`ステータスが付与されたパラメータを持つエンドポイント  
    * 期間内に発見されたパラメータは`New`ステータスとなります。
    * 7日間データが送信されないパラメータは`Unused`ステータスとなります。
    * その後、`Unused`ステータスのパラメータが再びデータを送信すると、`Unused`ステータスは解除されます。
* **Unused** ― 期間内に`Unused`ステータスが付与されたエンドポイント  
    * 7日間（200のレスポンスコード）リクエストされなかったエンドポイントは`Unused`ステータスとなります。
    * その後、`Unused`ステータスのエンドポイントが再びリクエストされる（200のレスポンスコードを受け取る）と、`Unused`ステータスは解除されます。

どの期間を選択しても、**New**、**Changed**、**Unused**のマークが一切表示されない場合、その期間中にAPIの変更がなかったことを意味します。

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

エンドポイントに表示されるクイックヒント:

* **New**、**Changed**または**Unused**ラベルにマウスオーバーして、変更が発生した日時を確認してください。
* **Changed**エンドポイントの詳細に移動して、このステータスの理由を確認してください。新規のパラメータおよび`Unused`ステータスになったパラメータについては、ラベルにマウスオーバーすると、パラメータ変更の日時が表示されます。
* 直近7日間のすべての変更のカウントは[API Discovery Dashboard](dashboard.md)に表示されます。

## APIの変更のフィルタリング

**API Discovery**セクションでは、**Changes since**フィルターを使用することで、選択した期間内に変更があったエンドポイントのみを強調表示しますが、変更のないエンドポイントはフィルタリングされません。

**Changes in API**フィルターは挙動が異なり、選択した期間内に変更があったエンドポイントのみを表示し、その他のエンドポイントはすべてフィルタリングします。

<a name="example"></a>例を考えます: 例えば、今日あなたのAPIには10個のエンドポイントが存在します（以前は12個ありましたが、10日前に3個がUnusedとしてマークされました）。この10個のうち1個は昨日追加され、2個はそれぞれ5日前と10日前にパラメータの変更が発生しているとします:

* 今日、**API Discovery**セクションを開くたびに、**Changes since**フィルターは`Last week`状態となり、ページには10個のエンドポイントが表示され、**Changes**列には、そのうち1個に**New**マーク、1個に**Changed**マークが表示されます。
* **Changes since**を`Last 2 weeks`に切り替えると、13個のエンドポイントが表示され、**Changes**列には、1個に**New**マーク、2個に**Changed**マーク、3個に**Unused**マークが表示されます。
* **Changes in API**を`Unused endpoints`に設定すると、3個のエンドポイントが表示され、すべてに**Unused**マークが付きます。
* **Changes in API**を`New endpoints + Unused endpoints`に変更すると、4個のエンドポイントが表示され、うち3個に**Unused**マーク、1個に**New**マークが付きます。
* **Changes since**を再び`Last week`に切り替えると、1個のエンドポイントが表示され、**New**マークが付きます。

## 通知の受信方法

APIの変更に関する即時通知をメールまたはメッセンジャーで受け取るには、**Changes in API**条件を設定した[triggers](../user-guides/triggers/triggers.md)を構成してください。

新しい、変更された、またはUnusedになったエンドポイントについて、あるいはこれらすべての変更についてのメッセージを受け取ることができます。また、監視したいアプリケーションやホスト、表示されるセンシティブデータの種類によって通知を絞り込むことも可能です。

**トリガー例: Slackにおける新規エンドポイント通知**

この例では、API Discoveryモジュールによって`example.com` APIホストの新規エンドポイントが検出された場合、その通知があなたが設定したSlackチャンネルに送信されます。

![Changes in API trigger](../images/user-guides/triggers/trigger-example-changes-in-api.png)

**トリガーのテスト方法:**

1. Wallarm Console → **Integrations**に移動し、[US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウドで[Slackとの連携](../user-guides/settings/integrations/slack.md)を設定してください。
2. **Triggers**セクションで、上記のようにトリガーを作成してください。
3. `example.com/users`エンドポイントに対して複数のリクエストを送信し、`200`（`OK`）レスポンスを受け取ってください。
4. **API Discovery**セクションで、エンドポイントが**New**マーク付きで追加されたことを確認してください。
5. Slackチャンネル内のメッセージを以下のように確認してください:
    ```
    [wallarm] API内で新しいエンドポイントが検出されました

    通知タイプ: api_structure_changed

    API内で新規のGET example.com/usersエンドポイントが検出されました。

        Client: Client 001
        Cloud: US

        詳細:

          application: Application 1802
          domain: example.com
          endpoint_path: /users
          http_method: GET
          change_type: added
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```