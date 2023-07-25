[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## リストに追加されたオブジェクトの分析

Wallarm Consoleは、リストに追加された各オブジェクトについて以下のデータを表示します。

* **オブジェクト** - リストに追加されたIPアドレス、サブネット、国/地域、またはIPソース。
* **アプリケーション** - オブジェクトのアクセス設定が適用されるアプリケーション。
* **ソース** - 単一のIPアドレスまたはサブネットのソース：
    * 単一のIPアドレスまたはサブネットが登録されている国/地域（IP2Locationなどのデータベースで見つかった場合）
    * ソースタイプ（**Public proxy**、**Web proxy**、**Tor**、IPが登録されているクラウドプラットフォームなど）（IP2Locationなどのデータベースで見つかった場合）
* **理由** - IPアドレスまたはIPアドレス群をリストに追加する理由。理由は、リストにオブジェクトを追加するときに手動で指定するか、[トリガー](../triggers/triggers.md)でIPがリストに追加されるときに自動的に生成されます。
* **追加日** - オブジェクトがリストに追加された日時。
* **削除** - オブジェクトがリストから削除されるまでの期間。

## リストのフィルタリング

リスト内のオブジェクトを以下の条件でフィルタリングできます。

* 検索文字列で指定されたIPアドレスまたはサブネット
* リストのステータスを取得する期間
* IPアドレスやサブネットが登録されている国/地域
* IPアドレスやサブネットが属するソース

## リストにあるオブジェクトの時間を変更する

リストにあるIPアドレスの時間を変更するには：

1. リストからオブジェクトを選択します。
2. 選択したオブジェクトのメニューで、**Change time period**をクリックします。
3. リストからオブジェクトを削除する新しい日付を選択し、アクションを確認します。

## リストからオブジェクトを削除する

リストからオブジェクトを削除するには：

1. リストから1つまたは複数のオブジェクトを選択します。
2. **Delete**をクリックします。

!!! warning "削除したIPアドレスの再追加"
    [トリガー](../triggers/triggers.md)でリストに追加されたIPアドレスを手動で削除した後、トリガーが再度実行されるのは、IPアドレスがリストにあった前回の時間の半分が経過した後です。
    
    例：

    1. IPアドレスが、3時間以内に4つの異なる攻撃ベクターを受け取ったため、1時間の間グレイリストに自動的に追加されました（[トリガー](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)で設定されています）。
    2. ユーザーがWallarm Console経由でこのIPアドレスをグレイリストから削除しました。
    3. このIPアドレスから30分以内に4つの異なる攻撃ベクターが送信されても、このIPアドレスはグレイリストに追加されません。

## IPリストオブジェクトの取得、追加、削除のAPI呼び出し

IPリストオブジェクトの取得、追加、削除については、Wallarm Console UIを使用するほかに、Wallarm APIを[直接呼び出すこともできます](../../api/overview.md)。以下に、それぞれのAPI呼び出しの例を示します。

### APIリクエストパラメーター

APIリクエストでIPリストの読み取りと変更に渡すパラメーター：

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### `.csv`ファイルからのエントリをリストに追加する

`.csv`ファイルからIPまたはサブネットをリストに追加するには、次のbashスクリプトを使用します：

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### リストに単一のIPまたはサブネットを追加する

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### リストに複数の国を追加する

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### リストに複数のプロキシサービスを追加する

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IPリストからオブジェクトを削除する

オブジェクトは、IDによってIPリストから削除されます。

オブジェクトIDを取得するには、IPリストの内容を要求して、必要なオブジェクトの`objects.id` をレスポンスからコピーします：

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

オブジェクトIDを取得したら、次のリクエストを送信してリストから削除します：

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

削除リクエストでIDを配列として渡すことで、一度に複数のオブジェクトを削除できます。