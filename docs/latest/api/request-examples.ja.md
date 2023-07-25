[access-wallarm-api-docs]: #your-own-client
[application-docs]:        ../user-guides/settings/applications.ja.md

# Wallarm APIリクエスト例

以下は、Wallarm APIの使用例です。[米国クラウド](https://apiconsole.us1.wallarm.com/)または[EUクラウド](https://apiconsole.eu1.wallarm.com/)のAPI Reference UIからコード例を生成することもできます。経験豊富なユーザーは、ブラウザの開発者コンソール（「ネットワーク」タブ）を使用して、WallarmアカウントのUIが公開APIからデータを取得するために使用するAPIエンドポイントとリクエストをすばやく確認することができます。開発者コンソールを開く方法については、公式ブラウザのドキュメント([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/))を参照してください。

## 過去24時間で検出された最初の50件の攻撃を取得

`TIMESTAMP`を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換された24時間前の日付に置き換えてください。

--8<-- "../include/api-request-examples/get-attacks-en.ja.md"

## 大量の攻撃（100以上）を取得する

攻撃やヒットセットに含まれるレコードが100件以上の場合、パフォーマンスを最適化するために、一度に大量のデータセットを取得するのではなく、小さな部分で取得することが最善です。対応するWallarm APIエンドポイントは、ページごとに100件のレコードでカーソルベースのページネーションをサポートしています。

この技術は、データセット内の特定のアイテムにポインタを返すことで、ページングが可能になります。カーソルページネーションを有効にするには、リクエストパラメータに`"paging": true`を含めます。

以下は、カーソルページネーションを使用して`<TIMESTAMP>`以降に検出されたすべての攻撃を取得するAPI呼び出しの例です。

=== "EUクラウド"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
      -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "USクラウド"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
      -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

このリクエストは、最初の100件の攻撃に関する情報を最新から古い順に返します。また、`cursor`パラメータも含めて、次の100件の攻撃セットへのポインタが含まれます。

次の100件の攻撃を取得するには、前のリクエストと同じリクエストを使用して、前回のレスポンスからコピーしたポインタ値で`cursor`パラメータを含めます。これにより、APIが次の100件の攻撃セットを返す開始位置を識別できます。例えば:

=== "EUクラウド"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
      -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "USクラウド"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
      -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

さらなるページの結果を取得するには、前回の応答からコピーした値で`cursor`パラメータを含むリクエストを実行します。

以下は、カーソルページングを使用して攻撃を取得するためのPythonコード例です。

=== "EUクラウド"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

    url = "https://api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmAPI-UUID": "<YOUR_UUID>",
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
=== "USクラウド"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

    url = "https://us1.api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmAPI-UUID": "<YOUR_UUID>",
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

このリクエストは、攻撃のリストの前の例に非常に似ています。`"!vulnid": null`項がこのリクエストに追加されます。この項目は、APIに特定の脆弱性IDが指定されていないすべての攻撃を無視するよう指示し、これによりシステムは攻撃とインシデントを区別します。

`TIMESTAMP`を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換された24時間前の日付に置き換えてください。

--8<-- "../include/api-request-examples/get-incidents-en.ja.md"

## 過去24時間以内にステータスが「アクティブ」である最初の50件の脆弱性を取得する

`TIMESTAMP`を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換された24時間前の日付に置き換えてください。

--8<-- "../include/api-request-examples/get-vulnerabilities.ja.md"

## すべての設定済みルールを取得する

--8<-- "../include/api-request-examples/get-all-configured-rules.ja.md"

## すべてのルールの条件のみを取得する

--8<-- "../include/api-request-examples/get-conditions.ja.md"

## 特定の条件に関連付けられたルールを取得する

特定の条件を指定するには、そのIDを使用します。すべてのルールの条件を要求するときにそれを取得することができます（上記参照）。

--8<-- "../include/api-request-examples/get-rules-by-condition-id.ja.md"

## `/my/api/*`に送信されるすべてのリクエストをブロックする仮想パッチを作成する

--8<-- "../include/api-request-examples/create-rule-en.ja.md"

## 特定のアプリケーションインスタンスIDに対して `/my/api/*` に送信されるすべてのリクエストをブロックする仮想パッチを作成する

アプリケーションは、このリクエストを送信する前に[設定](../user-guides/settings/applications.ja.md)する必要があります。`action.point[instance].value`に既存のアプリケーションのIDを指定します。

--8<-- "../include/api-request-examples/create-rule-for-app-id.ja.md"`X-FORWARDED-FOR` ヘッダーの特定の値を持つリクエストを攻撃として考慮するルールを作成する

次のリクエストは、正規表現 `^(~(44[.]33[.]22[.]11))$` に基づく[カスタム攻撃指標](../user-guides/rules/regex-rule.ja.md)を作成します。

ドメイン `MY.DOMAIN.COM` へのリクエストが HTTP ヘッダー `X-FORWARDED-FOR: 44.33.22.11` を持っている場合、Wallarm ノードはそれらをスキャナー攻撃とみなし、対応する[フィルタリングモード](../admin-en/configure-wallarm-mode.ja.md)が設定されている場合、攻撃をブロックします。

--8<-- "../include/api-request-examples/create-rule-scanner.ja.md"

特定のアプリケーションに対してフィルタリングモードを監視に設定するルールを作成する

次のリクエストは、ID `3` の [アプリケーション](../user-guides/settings/applications.ja.md) に対して [トラフィックのフィルタリングを行うノードの設定](../user-guides/rules/wallarm-mode-rule.ja.md)をするルールを作成します。

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.ja.md"

IDでルールを削除する

削除するルールのIDを[すべての設定済みルールを取得する](#get-all-configured-rules)ことでコピーできます。また、ルール作成リクエストに対する返答の `id` レスポンスパラメータにもルールIDが入っています。

--8<-- "../include/api-request-examples/delete-rule-by-id.ja.md"

IP リストオブジェクトを取得し、追加、削除するための API コール

以下は、 [IP リスト](../user-guides/ip-lists/overview.ja.md) オブジェクトを取得、追加、削除する API コールの例です。

### API リクエストパラメータ

IP リストを読み取り、変更する API リクエストで渡すパラメータ：

--8<-- "../include/api-request-examples/ip-list-request-params.ja.md"

### `.csv` ファイルからリストにエントリを追加する

`.csv` ファイルから IP やサブネットをリストに追加するには、次の bash スクリプトを使用してください：

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.ja.md"

### リストに単一の IP またはサブネットを追加する

--8<-- "../include/api-request-examples/add-some-ips-to-lists.ja.md"

### リストに複数の国を追加する

--8<-- "../include/api-request-examples/add-some-countries-to-lists.ja.md"

### リストに複数のプロキシサービスを追加する

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.ja.md"

### IP リストからオブジェクトを削除する

オブジェクトは、ID によって IP リストから削除されます。

オブジェクト ID を取得するには、IP リストの内容を要求し、レスポンスから必要なオブジェクトの `objects.id` をコピーしてください：

--8<-- "../include/api-request-examples/get-ip-list-contents.ja.md"

オブジェクト ID を持っていれば、次のリクエストを使用してリストから削除できます：

--8<-- "../include/api-request-examples/delete-object-from-ip-list.ja.md"

削除リクエストにおいて、ID を配列として渡すことで複数のオブジェクトを一度に削除できます。