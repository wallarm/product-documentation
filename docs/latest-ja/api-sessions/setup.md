# API Sessionsのセットアップ <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Sessions](overview.md)にはセッション識別のための組み込みルールが含まれており、有効化されたWallarm[node](../about-wallarm/overview.md#how-wallarm-works)があるだけで動作し始めます。必要に応じて、本記事で説明する方法でAPI Sessionsを細かく調整できます。

## セッションコンテキスト

API Sessionsにおけるコンテキストとは、リクエストデータを論理的なセッションにグループ化し、レスポンスデータやメタデータを付与して、セッションアクティビティに関するより深い洞察を提供するための情報です。コンテキストを構成すると、各セッションと関連付けて追跡すべき側面や追加データを指定できます。

追加のリクエスト/レスポンスパラメータを加え、セッションを機微なビジネスフローに関連付け、ユーザーおよびユーザーロールの識別に使用できるパラメータを強調表示することで、セッションコンテキストを設定します。

!!! info "セッションコンテキストパラメータの許容数"
    セッションコンテキストや[グルーピング](#session-grouping)に使用するセッションコンテキストパラメータは最大20個まで追加できます。

### 追加パラメータ

**API Sessions**では、セッション内のリクエスト詳細にデフォルトで次が含まれます:

* [セッショングルーピング](#session-grouping)に有効だったリクエストまたはレスポンスのパラメータ―独自のもの、または組み込みセットのもの（**API session ID parameters**グループで強調表示されます）。
* Mitigation controlsにより[追加](#mitigation-controls)されたパラメータ（存在する場合）。
* 悪意のあるリクエストの場合―リクエスト内容全体。

セッションの内容（アクターが何をどの順序で実行し、どのようなレスポンスが返ったか）を把握するために必要であれば、リクエストとそれに関連するレスポンスの両方に任意の追加（コンテキスト）[パラメータ](../user-guides/rules/request-processing.md)を追加できます。追加するには、Wallarm Console → **API Sessions** → **Session context parameters**でこれらのパラメータを追加します。追加後、WallarmはそれらをWallarm Cloudにエクスポートし、セッションリクエストの詳細（**API session parameters**グループ）に[表示](#data-protection)します。

![!API Sessions - コンテキストパラメータ](../images/api-sessions/api-sessions-context-parameters.png)

いくつかの例を示します。

リクエストの`jwt_payload`からユーザー名を取得する場合:

```
{
  "token_type": "access",
  "exp": 1741774186,
  "iat": 1741773706,
  "jti": "jti_value",
  "user_id": 932,
  "details": {
    "username": "john-doe@company-001.com",
    "rnd": "some_data",
    "contact": {
      "contactId": 438,
      "contactUUID": "contact_UUID_value",
      "firstName": "John",
      "lastName": "Doe",
      "portalSecurityLevel": 3,
      "companyId": 255,
      "companyName": "Company 001",
      "companyUUID": "company_UUID_value"
    }
  }
}
```

...は次のように表示されます:

![!API Sessions - コンテキストパラメータ - 例 - JWT](../images/api-sessions/api-sessions-context-parameters-example-jwt.png)

リクエストボディから`email`パラメータを取得する場合:

![!API Sessions - コンテキストパラメータ - 例 - リクエスト](../images/api-sessions/api-sessions-context-parameters-example-request.png)

レスポンスボディから`product_id`パラメータを取得する場合:

![!API Sessions - コンテキストパラメータ - 例 - レスポンス](../images/api-sessions/api-sessions-context-parameters-example-response.png)

リクエストヘッダーからJWTトークンを取得する場合:

![!API Sessions - コンテキストパラメータ - 例 - ヘッダー](../images/api-sessions/api-sessions-context-parameters-example-header.png)

<!--### Sensitive business flows

You can associate sessions with sensitive business flows. To do so, in Wallarm Console → **API Sessions** → **Session context parameters**, add your parameter and select **Context** for it.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-select.png)
-->

### ユーザーとロール

セッションのユーザー名およびそのロールの命名に使用すべきセッションパラメータを強調表示できます。そのためには、Wallarm Console → **API Sessions** → **Session context parameters**でパラメータを追加し、**Type**から`User`または`Role`を選択します。

![!API Sessions - ユーザーおよびユーザーロールの設定](../images/api-sessions/api-sessions-user-role-select.png)

ユーザーおよびそのロールの識別に使用するパラメータを構成すると、以降、セッションに対してこれらのパラメータが設定されるようになります。ユーザーとロールでセッションをフィルタリングできます。

![!API Sessions - ユーザーおよびユーザーロールの表示](../images/api-sessions/api-sessions-user-role-display.png)

<a name="mitigation-controls"></a>
### Mitigation controls

[Mitigation controls](../about-wallarm/mitigation-controls-overview.md)はセッションコンテキストにさらなるパラメータを追加できます。例えば、**BOLA protection**のMitigation controlは、`object_id`パラメータを[列挙対象パラメータ](../api-protection/enumeration-attack-protection.md#enumerated-parameters)として、または[スコープのフィルター](../api-protection/enumeration-attack-protection.md#scope-filters)として使用したい場合があります。このようなパラメータが**API Sessions** → **Session context parameters**に追加されていない場合は、Mitigation controlの設定内で直接追加できます。API Sessionでは非表示として追加されます。つまり、リクエストに存在する場合はセッション詳細にこれらのパラメータが表示されますが、**Session context parameters**の設定画面には表示されません。

非表示で追加されたパラメータは20個のパラメータ枠を消費しません。これらのパラメータは、誤って削除されることを防ぐために非表示になっています。削除するとMitigation controlによる保護が停止する可能性があるためです。

<a name="session-grouping"></a>
## セッションのグルーピング

Wallarmは、選択されたリクエストおよび/またはレスポンスのヘッダー/パラメータの**同一の値**に基づいて、アプリケーションのトラフィックに含まれるリクエストをユーザーセッションにグループ化します。設定では、グルーピングキーとしてマークされたパラメータがこれに該当します。グルーピングキーの動作は[例](#grouping-keys-example)をご覧ください。

デフォルトでは、そのようなパラメータの**組み込みセット**でセッションを識別します（Wallarm Consoleには表示されません）。ロジックとしては、`PHPSESSID`や`SESSION-ID`ヘッダーなどの一般的な識別パラメータを試行し、それが機能しない場合は、`リクエスト送信元IPとuser-agent`の組み合わせ（またはuser-agentが存在しない場合は少なくともIP）に基づいてセッションを形成します。

アプリケーションのロジックに基づく独自の識別パラメータを追加できます。追加するには、Wallarm Console → **API Sessions** → **Session context parameters**でリクエストまたはレスポンスのパラメータを追加し、そのパラメータに対して**Group sessions by this key**を選択します。

!!! info "`API Abuse prevention`によるボット検出への影響"
    WallarmのAPI Abuse Preventionは、悪意のあるボットの検出にセッションを使用します。アプリケーションのロジックに基づく独自のセッション識別パラメータを追加すると、セッション検出とAPI Abuse Preventionのボット検出の両方の精度が向上します。詳細は[こちら](overview.md#api-sessions-and-api-abuse-prevention)をご覧ください。

![!API Sessions - 設定](../images/api-sessions/api-sessions-settings.png)

複数のグルーピングキーを追加できます。指定した順序で試行され、前のキーが機能しなかった場合にのみ次が試されます。ドラッグして順序を変更できます。独自のキーは常に組み込みのキーより先に試されます。

!!! info "`Mask sensitive data`ルールからの影響"
    パラメータをグルーピングキーとして機能させるには、そのパラメータが[Mask sensitive data](../user-guides/rules/sensitive-data-rule.md)ルールの影響を受けていない必要があります。

<a name="grouping-keys-example"></a>**グルーピングキーの動作例**

loginというルートがあり、レスポンスの`response_body →` `json_doc → hash → token`パラメータに特定の`<TOKEN>`を返すとします。以降のリクエストでは、この`<TOKEN>`が`get → token`または`post → json_doc → hash → token`のどこかで使用されます。

グルーピングキーとして使用する3つのパラメータ（レスポンスボディ、GETおよびPOSTリクエスト用）を構成できます。次の順序で試行されます（前のキーが機能しなかった場合にのみ次が試されます）。

1. `response_body → json_doc → hash → token`
2. `get → token`
3. `post → json_doc → hash → token`
4. （組み込みセット。上記がいずれも機能しない場合に使用されます）

![!API Sessions - グルーピングキーの動作例](../images/api-sessions/api-sessions-grouping-keys.png)

リクエスト:

* curl `example.com -d '{in: 'bbb'}'`、レスポンス `'{token: aaa}'` → セッション「A」（**グルーピングキー#1が機能**）
* curl `example.com -d '{in: 'ccc'}' '{token: 'aaa'}'`、トークンなしのレスポンス → セッション「A」（**グルーピングキー#3が機能**）

同じパラメータ値`aaa`により、これらのリクエストは1つのセッションにグループ化されます。

<a name="data-protection"></a>
## データ保護

API Sessionsでは、nodeからCloudへのエクスポート対象は、皆さまが選択したパラメータのみに限定されます。それらに機微なデータが含まれる場合は、エクスポート前に必ずハッシュ化してください。ハッシュ化すると実際の値は判読不能に変換されます。つまり、パラメータの存在と特定だが不明な値が、分析のための限定的な情報のみを提供します。

機微なパラメータをハッシュ化するには、Wallarm Console → **API Sessions** → **Session context parameters**で追加した後、それらに対して**Hashing (secret)**オプションを選択します。

Wallarmは選択したパラメータをエクスポート前にハッシュ化します。

## 解析対象トラフィック

API Sessionsは、Wallarm nodeが保護するように有効化されているすべてのトラフィックを解析し、セッションに編成します。特定のアプリケーション/ホストに解析を限定したい場合は、[Wallarmサポートチーム](mailto:support@wallarm.com)までご連絡ください。

## 保存期間

**API Sessions**セクションには直近1週間のセッションが保存・表示されます。より古いセッションは、最適なパフォーマンスとリソース消費のために削除されます。