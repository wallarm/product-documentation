[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## IPリストオブジェクトの取得・追加・削除のためのAPI呼び出し

IPリストオブジェクトを取得・追加・削除するには、Wallarm Console UIの使用に加えて、[Wallarm APIを直接呼び出す](../../api/overview.md)こともできます。以下に対応するAPI呼び出しの例を示します。

### APIリクエストパラメータ

IPリストを読み取り・変更するためのAPIリクエストに渡すパラメータです：

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### `.csv`ファイルのエントリをリストに追加

`.csv`ファイル内のIPまたはサブネットをリストに追加するには、次のbashスクリプトを使用します：

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### 単一のIPまたはサブネットをリストに追加

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### 複数の国をリストに追加

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### 複数のプロキシサービスをリストに追加

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IPリストからオブジェクトを削除

オブジェクトはIDによってIPリストから削除されます。

オブジェクトIDを取得するには、IPリストの内容をリクエストし、レスポンスから対象オブジェクトの`objects.id`をコピーします：

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

オブジェクトIDが分かったら、次のリクエストを送信してリストから削除します：

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

削除リクエストでIDを配列として渡すことで、複数のオブジェクトを一度に削除できます。