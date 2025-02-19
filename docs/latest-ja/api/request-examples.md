```markdown
[access-wallarm-api-docs]: overview.md#your-own-api-client
[application-docs]:        ../user-guides/settings/applications.md

# Wallarm APIリクエスト例

以下はWallarm API使用例の一部です。US cloud [US Cloud](https://apiconsole.us1.wallarm.com/)またはEU cloud [EU Cloud](https://apiconsole.eu1.wallarm.com/)向けのAPI Reference UIよりコード例を生成することもできます。経験豊富なユーザーはブラウザのDeveloper console（「Network」タブ）を使用して、WallarmアカウントのUIがpublic APIよりデータを取得する際にどのAPIエンドポイントとリクエストが使用されているかを迅速に確認することができます。Developer consoleの起動方法についての詳細は、公式ブラウザドキュメント（[Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac)、[Chrome](https://developers.google.com/web/tools/chrome-devtools/)、[Firefox](https://developer.mozilla.org/en-US/docs/Tools)、[Vivaldi](https://help.vivaldi.com/article/developer-tools/)）をご参照ください。

## 過去24時間以内に検出された最初の50件の攻撃の取得

`TIMESTAMP`を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換した24時間前の日付に置き換えてください。

--8<-- "../include/api-request-examples/get-attacks-en.md"

## 多数の攻撃（100件以上）の取得

攻撃およびヒットのレコードが100件以上含まれる場合、大規模なデータセットを一度に取得するのではなく、より小さな部分に分けて取得する方がパフォーマンスの最適化に有効です。該当するWallarm APIエンドポイントは100件ずつのカーソルベースのページネーションに対応しています。

この手法では、データセット内の特定のアイテムを指すポインタを返し、続くリクエストではサーバーがそのポインタ以降の結果を返す形となります。カーソルページネーションを有効にするには、リクエストパラメータに`"paging": true`を含めてください。

以下はカーソルページネーションを使用して`<TIMESTAMP>`以降に検出された全ての攻撃を取得するAPI呼び出しの例です：

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

このリクエストは、最新の100件の攻撃情報を新しい順から古い順に並べて返します。さらに、レスポンスには次の100件の攻撃の取得開始位置を示す`cursor`パラメータが含まれています。

次の100件の攻撃を取得するには、同様のリクエストに前回のレスポンスからコピーしたポインタ値を持つ`cursor`パラメータを追加してください。例えば：

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

さらに結果のページを取得するには、前回のレスポンスから取得した`cursor`パラメータの値を含めたリクエストを実行してください。

以下はカーソルページネーションを使用して攻撃を取得するPythonコード例です：

=== "EU Cloud"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

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
    ts = <TIMESTAMP>  # UNIX time

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

## 過去24時間以内に確認された最初の50件のインシデントの取得

このリクエストは攻撃一覧の取得例と非常に類似していますが、リクエストに`"!vulnid": null`が追加されています。この項目は、脆弱性IDが指定されていない全ての攻撃を無視するようAPIに指示し、これによりシステムは攻撃とインシデントを区別します。

`TIMESTAMP`を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換した24時間前の日付に置き換えてください。

--8<-- "../include/api-request-examples/get-incidents-en.md"

## 過去24時間以内にステータス「active」の最初の50件の脆弱性の取得

`TIMESTAMP`を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換した24時間前の日付に置き換えてください。

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## 全ての設定済みルールの取得

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

## すべてのルールの条件のみの取得

--8<-- "../include/api-request-examples/get-conditions.md"

## 特定の条件に紐付くルールの取得

特定の条件を指すには、そのIDを使用してください。すべてのルールの条件をリクエストする際に取得できます（上記参照）。

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

## `/my/api/*`への全リクエストをブロックするためのバーチャルパッチの作成

--8<-- "../include/api-request-examples/create-rule-en.md"

## 特定のapplication instance IDに対して`/my/api/*`への全リクエストをブロックするバーチャルパッチの作成

このリクエストを送信する前にapplicationが[設定](../user-guides/settings/applications.md)されている必要があります。`action.point[instance].value`に既存のapplicationのIDを指定してください。

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

## 特定の`X-FORWARDED-FOR`ヘッダーの値を持つリクエストを攻撃と見なすルールの作成

以下のリクエストは、正規表現に基づく[カスタムアタックインジケータ](../user-guides/rules/regex-rule.md) `^(~(44[.]33[.]22[.]11))$`を作成します。

もし`MY.DOMAIN.COM`ドメインへのリクエストに`X-FORWARDED-FOR: 44.33.22.11`のHTTPヘッダーが含まれている場合、Wallarmノードはこれらをスキャナー攻撃と見なし、該当する[filtration mode](../admin-en/configure-wallarm-mode.md)が設定されていれば攻撃をブロックします。

--8<-- "../include/api-request-examples/create-rule-scanner.md"

## 特定のapplicationに対してfiltration modeをmonitoringに設定するルールの作成

以下のリクエストは、IDが`3`の[application](../user-guides/settings/applications.md)向けに、ノードがトラフィックをフィルタリングする[ルールの作成](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)をmonitoringモードで実施します。

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## ルールIDによるルールの削除

削除するルールIDは[全ての設定済みルールの取得](#get-all-configured-rules)時にコピーできます。また、ルール作成リクエストのレスポンスパラメータ`id`にもルールIDが返されます。

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

## IPリストオブジェクトの取得、追加、削除のためのAPI呼び出し

以下は[IPリスト](../user-guides/ip-lists/overview.md)オブジェクトを取得、追加、削除するAPI呼び出しの例です。

### APIリクエストパラメータ

IPリストの読み取りおよび変更のためにAPIリクエストに渡すパラメータ：

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### `.csv`ファイルからのエントリをリストに追加

`.csv`ファイルからIPまたはサブネットをリストに追加するには、以下のbashスクリプトを使用してください：

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### 単一のIPまたはサブネットをリストに追加

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### 複数の国をリストに追加

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### 複数のプロキシサービスをリストに追加

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IPリストからオブジェクトの削除

オブジェクトはそのIDによってIPリストから削除されます。

オブジェクトのIDを取得するには、IPリスト内容をリクエストして、レスポンスから該当オブジェクトの`objects.id`をコピーしてください：

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

オブジェクトIDを取得したら、以下のリクエストを送信してリストから削除してください：

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

複数のオブジェクトを一度に削除する際は、削除リクエストの中でIDを配列として渡すことが可能です。
```