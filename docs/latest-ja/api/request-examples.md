[access-wallarm-api-docs]: #your-own-client
[application-docs]:        ../user-guides/settings/applications.md

# Wallarm APIリクエストの例

以下は、Wallarm APIの使用例です。またAPIリファレンスUIからコード例を生成することもできます。[USクラウド](https://apiconsole.us1.wallarm.com/)または[EUクラウド](https://apiconsole.eu1.wallarm.com/)で利用可能です。経験豊富なユーザーは、ブラウザーの開発者コンソール("Network"タブ)を使って、UIが公開APIからデータを取得するためにどのAPIエンドポイントとリクエストを使用しているかをすばやく把握することも出来ます。開発者コンソールを開く方法については、公式のブラウザードキュメンテーションをご覧ください。([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/))。

## 過去24時間で検出された最初の50件の攻撃を取得する

`TIMESTAMP`は、24時間前の日付を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換して指定してください。

--8<-- "../include-ja/api-request-examples/get-attacks-en.md"

## 大量の攻撃を取得する (100件以上)

100件以上の攻撃やヒットセットは、一度に大量のデータセットを取得するよりも、小さな部分で取得する方がパフォーマンスを最適化するため、おすすめです。対応するWallarm APIエンドポイントは、ページごとに100件のレコードでカーソルベースのページネーションをサポートします。

このテクニックは、データセットの特定の項目へのポインタを返すことで、次回のリクエストでそのポインタ以降の結果をサーバーが返すようになります。カーソルページネーションを有効にするには、リクエストパラメータに`"paging": true` を含めます。

次に、カーソルページネーションを使用して、`<TIMESTAMP>`以降に検出されたすべての攻撃を取得するAPI呼び出しの例を示します：

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

このリクエストは、最も新しいものから最も古いものまでの順序で、最新の100件の攻撃に関する情報を返します。さらに、応答には、次の100件の攻撃セットへのポインタを含む`cursor`パラメータが含まれます。

次の100件の攻撃を取得するには、前回と同じリクエストを使用し、前回の応答からコピーしたポインタ値を`cursor`パラメータに含めます。これにより、APIは次の100件の攻撃をどこから返し始めるかを知ることができます。例えば：

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

引き続き結果のページを取得するには、前回の応答からコピーした値を使用した`cursor`パラメータを含むリクエストを実行します。

以下は、Pythonのコード例で、カーソルページングを使用して攻撃を取得します：

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

## 過去24時間で確認された最初の50件のインシデントを取得する

このリクエストは攻撃リストの前回の例と非常に似ています。ただし、このリクエストには`"!vulnid": null`項目が追加されています。この項目により、APIは特定の脆弱性IDが指定されていないすべての攻撃を無視し、これによりシステムは攻撃とインシデントを区別します。

`TIMESTAMP`は、24時間前の日付を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換して指定してください。

--8<-- "../include-ja/api-request-examples/get-incidents-en.md"

## 過去24時間でステータスが "active" の最初の50件の脆弱性を取得する

`TIMESTAMP` は、24時間前の日付を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換して指定してください。

--8<-- "../include-ja/api-request-examples/get-vulnerabilities.md"

## すべての構成ルールを取得する

--8<-- "../include-ja/api-request-examples/get-all-configured-rules.md"

## すべてのルールの条件のみを取得する

--8<-- "../include-ja/api-request-examples/get-conditions.md"

## 特定の条件に添付されたルールを取得する

特定の条件を指定するには、そのIDを使用します - すべてのルールの条件をリクエストするときに取得できます（上記をご覧ください）。

--8<-- "../include-ja/api-request-examples/get-rules-by-condition-id.md"

## すべてのリクエストをブロックする仮想パッチを作成する`/my/api/*`

--8<-- "../include-ja/api-request-examples/create-rule-en.md"

## 特定のアプリケーションインスタンスのIDに対して、すべてのリクエストをブロックする仮想パッチを作成する `/my/api/*`

このリクエストを送信する前に、アプリケーションは[設定](../user-guides/settings/applications.md)されている必要があります。`action.point[instance].value`には、既存のアプリケーションのIDを指定します。

--8<-- "../include-ja/api-request-examples/create-rule-for-app-id.md"

## `X-FORWARDED-FOR`ヘッダーの特定の値を持つリクエストを攻撃とみなすルールを作成する

次のリクエストは、正規表現`^(~(44[.]33[.]22[.]11))$`に基づいて[カスタム攻撃インジケータを作成します](../user-guides/rules/regex-rule.md)。

もしリクエストが`MY.DOMAIN.COM`というドメインに`X-FORWARDED-FOR: 44.33.22.11`というHTTPヘッダーを持っていた場合、Wallarm nodeはそれをスキャナ攻撃とみなし、対応する[フィルタモード](../admin-en/configure-wallarm-mode.md)が設定されていれば攻撃をブロックします。

--8<-- "../include-ja/api-request-examples/create-rule-scanner.md"

## 特定のアプリケーションのフィルタリングモードを監視に設定するルールを作成する

次のリクエストは、 [アプリケーション](../user-guides/settings/applications.md) ID `3`へのトラフィックをフィルタリングする[ノードの設定ルール](../admin-en/configure-wallarm-mode.md)を作成します。

--8<-- "../include-ja/api-request-examples/create-filtration-mode-rule-for-app.md"

## IDによるルールの削除

削除するルールのIDは[すべての構成ルールを取得](#get-all-configured-rules)するときにコピーできます。また、ルールの作成のリクエストに対する応答で、 `id` 応答パラメータにルールIDが返されます。

--8<-- "../include-ja/api-request-examples/delete-rule-by-id.md"

## IPリストオブジェクトを取得、追加、削除するAPIコール

以下は、IPリストオブジェクトを取得、追加、削除するためのAPI呼び出しの例です。

### APIリクエストパラメータ

IPリストを読み込み変更するためのAPIリクエストに渡すパラメータ：

--8<-- "../include-ja/api-request-examples/ip-list-request-params.md"

### `.csv`ファイルからリストにエントリを追加する

`.csv`ファイルからIPまたはサブネットをリストに追加するには、次のbashスクリプトを使用します：

--8<-- "../include-ja/api-request-examples/add-ips-to-lists-from-file.md"

### リストに単一のIPまたはサブネットを追加する

--8<-- "../include-ja/api-request-examples/add-some-ips-to-lists.md"

### リストに複数の国を追加する

--8<-- "../include-ja/api-request-examples/add-some-countries-to-lists.md"

### リストに複数のプロキシサービスを追加する

--8<-- "../include-ja/api-request-examples/add-some-proxies-to-lists.md"

### IPリストからオブジェクトを削除する

オブジェクトは、それらのIDによってIPリストから削除されます。

オブジェクトIDを取得するには、IPリストの内容をリクエストし、必要なオブジェクトの`objects.id`をレスポンスからコピーします：

--8<-- "../include-ja/api-request-examples/get-ip-list-contents.md"

オブジェクトIDを持っていれば、次のリクエストを送信してリストからそれを削除します：

--8<-- "../include-ja/api-request-examples/delete-object-from-ip-list.md"

削除リクエストの配列内にIDを渡すことで一度に複数のオブジェクトを削除することができます。