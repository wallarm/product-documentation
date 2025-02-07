# API Sessionsの設定 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Sessions](overview.md)はセッション識別用の組み込みルールを含み、有効なWallarm [node](../about-wallarm/overview.md#how-wallarm-works)があるだけで動作を開始します。必要に応じて、本記事で説明するようにAPI Sessionsの微調整を行うことができます。

## セッションコンテキスト

API Sessionsにおけるコンテキストは、リクエストデータを論理的なセッションにグループ化し、レスポンスデータやメタデータを追加することで、セッションの動作に関するより深い洞察を得るための情報です。コンテキストの設定により、どの側面や追加データを追跡し、各セッションに関連付けるかを指定できます。

追加のリクエストおよびレスポンスパラメータを加え、セッションを機微なビジネスフローに関連付け、ユーザーおよびユーザーロールの識別に利用できるパラメータを強調することで、セッションコンテキストを設定します。

### 追加パラメータ

API Sessionsでは、デフォルトでセッション内のリクエスト詳細には以下が含まれます: 

* [セッショングルーピング](#session-grouping)に利用されたリクエストまたはレスポンスのパラメータ―独自のものまたは組み込みセットのいずれか。
* 悪意のあるリクエストについては、リクエストの完全な内容。

セッションの内容、すなわちアクターが何をどの順番で実行したのかおよびレスポンスが何であったかを把握するために必要な追加の（コンテキスト）[パラメータ](../user-guides/rules/request-processing.md)を、リクエストおよび関連するレスポンスの両方に追加できます。そのためには、Wallarm Console → **API Sessions** → **Session context parameters**でこれらのパラメータを追加してください。追加されると、WallarmはそれらをWallarm Cloudへエクスポートし、セッションリクエストの詳細においてWallarm Consoleに[表示](#data-protection)します。

![API Sessions - コンテキストパラメータ](../images/api-sessions/api-sessions-context-parameters.png)

<!--### 機微なビジネスフロー

セッションを機微なビジネスフローに関連付けることができます。そのためには、Wallarm Console → **API Sessions** → **Session context parameters**において、パラメータを追加し、**Context**を選択してください。

![API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-select.png)
-->

### ユーザーとロール

セッションのユーザーおよびそのロールの識別に用いるパラメータを強調できます。そのためには、Wallarm Console → **API Sessions** → **Session context parameters**においてパラメータを追加し、**Type**から`User`または`Role`を選択してください。

![API Sessions - ユーザーおよびユーザーロールの設定](../images/api-sessions/api-sessions-user-role-select.png)

ユーザーとそのロールの識別に用いるパラメータを設定すると、これらのパラメータはセッションに記録され始めます。ユーザーおよびロールでセッションをフィルタリングできます。

![API Sessions - ユーザーとユーザーロールの表示](../images/api-sessions/api-sessions-user-role-display.png)

## セッショングルーピング

Wallarmは、アプリケーションのトラフィックのリクエストを、リクエストおよび/またはレスポンスの選択されたヘッダー／パラメータの**同一の値**に基づいてユーザーセッションにグループ化します。設定上、これらはグルーピングキーとしてマークされたパラメータです。グルーピングキーの動作方法については[例](#grouping-keys-example)を参照してください。

デフォルトでは、セッションはそのようなパラメータの**組み込みセット**（Wallarm Consoleに表示されません）により識別されます。このロジックは、`PHPSESSID`や`SESSION-ID`ヘッダーのような一般的な識別パラメータを試み、機能しない場合は`request source IP and user-agent`（またはuser-agentが存在しない場合は少なくともIP）の組み合わせに基づいてセッションを形成します。

アプリケーションのロジックに基づき、独自の識別パラメータを追加できます。そのためには、Wallarm Console → **API Sessions** → **Session context parameters**に移動し、ご自身のリクエストまたはレスポンスのパラメータを追加して、**Group sessions by this key**を選択してください。

!!! info " `API Abuse prevention`によるボット検出への影響"
    WallarmのAPI Abuse Preventionは、悪意のあるボット検出のためにセッションを使用します。アプリケーションのロジックに基づいた独自のセッション識別パラメータを追加することで、セッション検出およびAPI Abuse Preventionによるボット検出の精度が向上します。[詳細](overview.md#api-sessions-and-api-abuse-prevention)を参照してください。

![API Sessions - 設定](../images/api-sessions/api-sessions-settings.png)

複数のグルーピングキーを追加でき、指定した順序で試行されます―前のキーが機能しなかった場合のみ次が試されます。順序はドラッグして変更できます。独自のキーは常に組み込みキーよりも先に試されます。

!!! info " `Mask sensitive data`ルールの影響"
    グルーピングキーとして機能するためには、そのパラメータが[Mask sensitive data](../user-guides/rules/sensitive-data-rule.md)ルールの影響を受けない必要があります。

<a name="grouping-keys-example"></a>**グルーピングキーの動作例**

例として、ログインルートがレスポンスの`response_body → json_doc → hash → token`パラメータで特定の`<TOKEN>`を返すとします。その後のリクエストでは、この`<TOKEN>`が`get → token`または`post → json_doc → hash → token`のいずれかで使用されます。

レスポンスボディ、getおよびpostリクエストに対して、グルーピングキーとして使用されるパラメータを3つ設定できます。それらは以下の順序で試行されます（前のキーが機能しなかった場合のみ次が試されます）:

1. `response_body → json_doc → hash → token`
2. `get → token`
3. `post → json_doc → hash → token`
4. （組み込みセット―上記がすべて機能しなかった場合に使用）

![API Sessions - グルーピングキーの動作例](../images/api-sessions/api-sessions-grouping-keys.png)

リクエスト:

* curl `example.com -d '{in: 'bbb'}'` のレスポンスが `'{token: aaa}'`の場合 → session "A"（グルーピングキー#1が機能しました）
* curl `example.com -d '{in: 'ccc'}' '{token: 'aaa'}'` のレスポンスにトークンが含まれていない場合 → session "A"（グルーピングキー#3が機能しました）

同じパラメータ値`aaa`により、これらのリクエストは1つのセッションにグループ化されます。

## データ保護

API Sessionsにおいて、nodeからCloudへは、Wallarmは選択されたパラメータのみをエクスポートします。これらに機微なデータが含まれる場合は、エクスポート前に必ずハッシュ化してください。なお、ハッシュ化することで実際の値は読めない状態に変換され、パラメータの存在および特定できないが不明な値が分析に対して限定的な情報しか提供しなくなります。

機微なパラメータをハッシュ化するには、Wallarm Console → **API Sessions** → **Session context parameters**でパラメータを追加後、該当パラメータに対して**Hashing (secret)**オプションを選択してください。

Wallarmはエクスポート前に選択されたパラメータをハッシュ化します。

## 分析対象トラフィック

API Sessionsは、Wallarm nodeが保護するように有効になっているすべてのトラフィックを分析し、セッションに整理します。対象のアプリケーションまたはホストに分析を限定するよう、[Wallarmサポートチーム](mailto:support@wallarm.com)までお問い合わせください。

## 保存期間

**API Sessions**セクションは、過去1週間のセッションを保存および表示します。より古いセッションは、最適なパフォーマンスおよびリソース消費を実現するために削除されます。