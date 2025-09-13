[access-wallarm-api-docs]: overview.md#your-own-api-client
[application-docs]:        ../user-guides/settings/applications.md

# Wallarm APIリクエスト例

以下はWallarm APIの使用例です。コード例は[US cloud](https://apiconsole.us1.wallarm.com/)または[EU cloud](https://apiconsole.eu1.wallarm.com/)向けのAPI Reference UIでも生成できます。経験豊富なユーザーは、ブラウザのDeveloper console（“Network”タブ）を使用して、WallarmアカウントのUIがパブリックAPIからデータを取得するためにどのAPIエンドポイントとリクエストを使用しているかを素早く把握できます。Developer consoleの開き方は、公式ブラウザドキュメント（[Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac)、[Chrome](https://developers.google.com/web/tools/chrome-devtools/)、[Firefox](https://developer.mozilla.org/en-US/docs/Tools)、[Vivaldi](https://help.vivaldi.com/article/developer-tools/)）を参照してください。

## 直近24時間に検出された攻撃の先頭50件を取得する

`TIMESTAMP`は、24時間前の日付を[UNIXタイムスタンプ](https://www.unixtimestamp.com/)形式に変換した値に置き換えてください。

--8<-- "../include/api-request-examples/get-attacks-en.md"

## 大量の攻撃（100件以上）を取得する

100件以上のレコードを含む攻撃やヒットの集合は、パフォーマンスを最適化するため、一度に大きなデータセットを取得するのではなく、小さな単位に分割して取得するのが最適です。該当するWallarm APIエンドポイントは、1ページあたり100件のカーソルベースページネーションをサポートします。

この手法では、データセット内の特定の項目を指すポインタを返し、後続のリクエストではそのポインタ以降の結果をサーバーが返します。カーソルページネーションを有効にするには、リクエストパラメータに"paging": trueを含めてください。

以下は、カーソルページネーションを使用して<TIMESTAMP>以降に検出されたすべての攻撃を取得するAPI呼び出し例です。

=== "EU Cloud"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "US Cloud"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

このリクエストは、最新から古い順に並べられた最新100件の攻撃情報を返します。加えて、レスポンスには次の100件へのポインタを含む`cursor`パラメータが含まれます。

次の100件の攻撃を取得するには、前回と同じリクエストを使用し、前回のレスポンスからコピーしたポインタ値を`cursor`パラメータとして含めてください。これにより、APIは次の100件の返却開始位置を把握できます。例:

=== "EU Cloud"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "US Cloud"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

さらに続きのページを取得するには、前回のレスポンスからコピーした値を`cursor`パラメータに含めたリクエストを実行してください。

以下は、カーソルページングを使用して攻撃を取得するPythonコード例です。

=== "EU Cloud"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX時刻

    url = "https://api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmApi-Token": "<YOUR_TOKEN>",
        "Content-Type": "application/json",
    }
    payload = {
        "paging": True,
        "filter": {
            "clientid": [client_id],
            "vulnid": None,
            "time": [[ts, None]],
            "!state": "falsepositive",
        },
    }


    while True:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        cursor = data.get("cursor")
        if not cursor:
            break

        pp(data)
        payload["cursor"] = cursor
    ```
=== "US Cloud"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX時刻

    url = "https://us1.api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmApi-Token": "<YOUR_TOKEN>",
        "X-WallarmAPI-Secret": "<YOUR_SECRET_KEY>",
        "Content-Type": "application/json",
    }
    payload = {
        "paging": True,
        "filter": {
            "clientid": [client_id],
            "vulnid": None,
            "time": [[ts, None]],
            "!state": "falsepositive",
        },
    }


    while True:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        cursor = data.get("cursor")
        if not cursor:
            break

        pp(data)
        payload["cursor"] = cursor
    ```

## 直近24時間に確定したインシデントの先頭50件を取得する

このリクエストは直前の攻撃一覧の例と非常によく似ていますが、このリクエストには"`!vulnid`: null"の項目が追加されています。この項目は、脆弱性IDが指定されていない攻撃をすべて無視するようAPIに指示します。システムはこれによって攻撃とインシデントを区別します。

`TIMESTAMP`は、24時間前の日付を[UNIXタイムスタンプ](https://www.unixtimestamp.com/)形式に変換した値に置き換えてください。

--8<-- "../include/api-request-examples/get-incidents-en.md"

## 直近24時間におけるステータス"active"の脆弱性の先頭50件を取得する

`TIMESTAMP`は、24時間前の日付を[UNIXタイムスタンプ](https://www.unixtimestamp.com/)形式に変換した値に置き換えてください。

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## 構成済みのルールをすべて取得する

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

## すべてのルールの条件のみを取得する

--8<-- "../include/api-request-examples/get-conditions.md"

## 特定の条件に紐づくルールを取得する

特定の条件を指し示すにはそのIDを使用します。IDはすべてのルールの条件をリクエストするときに取得できます（上記参照）。

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

## `/my/api/*`に送信されるすべてのリクエストをブロックする仮想パッチを作成する

--8<-- "../include/api-request-examples/create-rule-en.md"

## 特定のアプリケーションインスタンスID向けに`/my/api/*`に送信されるすべてのリクエストをブロックする仮想パッチを作成する

このリクエストを送信する前に、アプリケーションを[構成](../user-guides/settings/applications.md)しておく必要があります。既存のアプリケーションのIDを`action.point[instance].value`に指定してください。

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

## `X-FORWARDED-FOR`ヘッダーの特定の値を持つリクエストを攻撃として扱うルールを作成する

次のリクエストは、[正規表現に基づくカスタム攻撃インジケーター](../user-guides/rules/regex-rule.md) `^(~(44[.]33[.]22[.]11))$`を作成します。

MY.DOMAIN.COMへのリクエストに`X-FORWARDED-FOR: 44.33.22.11`というHTTPヘッダーがある場合、Wallarmノードはそれらをスキャナー攻撃と見なし、対応する[フィルタリングモード](../admin-en/configure-wallarm-mode.md)が設定されていれば攻撃をブロックします。

--8<-- "../include/api-request-examples/create-rule-scanner.md"

## 特定のアプリケーションに対してフィルタリングモードをmonitoringに設定するルールを作成する

次のリクエストは、IDが`3`の[アプリケーション](../user-guides/settings/applications.md)宛てのトラフィックをmonitoringモードで[フィルタリングするようノードを設定するルール](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)を作成します。

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## IDでルールを削除する

[構成済みのルールをすべて取得する](#get-all-configured-rules)際に、削除したいルールIDをコピーできます。また、ルール作成リクエストのレスポンスにも、`id`レスポンスパラメータとしてルールIDが返されています。

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

## IPリストオブジェクトの取得・追加・削除のためのAPI呼び出し

以下に、[IPリスト](../user-guides/ip-lists/overview.md)オブジェクトを取得、追加、削除するためのAPI呼び出し例を示します。

### APIリクエストパラメータ

IPリストを読み取り・変更するAPIリクエストに渡すパラメータ:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### `.csv`ファイルからのエントリをリストに追加する

`.csv`ファイル内のIPまたはサブネットをリストに追加するには、次のbashスクリプトを使用してください。

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### 単一のIPまたはサブネットをリストに追加する

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### 複数の国をリストに追加する

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### 複数のプロキシサービスをリストに追加する

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IPリストからオブジェクトを削除する

オブジェクトはIDでIPリストから削除します。

オブジェクトIDを取得するには、IPリストの内容をリクエストし、レスポンスから対象オブジェクトの`objects.id`をコピーしてください。

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

オブジェクトIDが分かったら、次のリクエストを送信してリストから削除してください。

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

削除リクエストでIDの配列を渡すことで、複数のオブジェクトを一度に削除できます。