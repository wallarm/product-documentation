[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## IPリストオブジェクトの取得・登録・削除のためのAPI呼び出し

IPリストオブジェクトの取得、登録、削除には、Wallarm Console UIの利用に加えて[Wallarm APIを直接呼び出す](../../api/overview.md)こともできます。以下に、対応するAPI呼び出しの例を示します。

### APIリクエストパラメータ

IPリストの読み取りおよび変更のためにAPIリクエストで渡すパラメータ:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### `.csv`ファイルのエントリをリストに追加

`.csv`ファイルからIPまたはサブネットをリストに追加するには、以下のbashスクリプトを使用します:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### 単一のIPまたはサブネットをリストに追加

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### 複数の国をリストに追加

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### 複数のプロキシサービスをリストに追加

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IPリストからオブジェクトを削除

オブジェクトはそのIDによってIPリストから削除されます。

オブジェクトIDを取得するには、IPリストの内容をリクエストし、レスポンスから必要なオブジェクトの`objects.id`をコピーしてください:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

オブジェクトIDが取得できたら、以下のリクエストを送信し、リストから削除します:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

削除リクエストにIDの配列を渡すことによって、複数のオブジェクトを一度に削除可能です。