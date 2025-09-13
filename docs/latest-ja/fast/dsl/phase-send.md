[link-ext-logic]:       logic.md

# Sendフェーズ

!!! info "フェーズの適用範囲"
    このフェーズは、変更を行わない拡張が動作するために必須です（YAMLファイルには`send`セクションを含める必要があります）。
    
    なお、変更を行う拡張ではこのフェーズは存在しません。というのも、Sendフェーズを他のフェーズと組み合わせると、他のフェーズ（Detectフェーズと暗黙のCollectフェーズを除く）が使用できなくなるためです。
    
    拡張の種類の詳細は[こちら][link-ext-logic]をご覧ください。

 このフェーズは、事前定義されたテストリクエストを送信して、対象アプリケーションに脆弱性がないかをテストします。テストリクエストの送信先ホストは、受信したベースラインリクエストの`Host`ヘッダー値によって決定されます。

`send`セクションは次の構造です。

```
send:
  - method: <HTTP method>
    url: <URI>
    headers:
    - header 1: value
    ...
    - header N: value
    body: <the request body>
  ...
  - method: <HTTP method>
    ...
```

拡張のYAMLファイル内の`send`セクションには、1つ以上のパラメーターセットが含まれます。各パラメーターは`<key: value>`ペアで指定します。各パラメーターセットは、テストリクエストとして送信される1件のHTTPリクエストを記述します。セットには次のパラメーターが含まれます。

* `method`：リクエストで使用するHTTPメソッドです。

    これは必須パラメーターです。すべてのパラメーターセットに含める必要があります。
    
    ??? info "許可されるパラメーター値の一覧"

        * `GET`
        * `POST`
        * `PUT`
        * `HEAD`
        * `OPTIONS`
        * `PATCH`
        * `COPY`
        * `DELETE`
        * `LOCK`
        * `UNLOCK`
        * `MOVE`
        * `TRACE`

    ??? info "例"
        `method: 'POST'`

* `url`：URL文字列です。リクエストはこのURIに送信されます。

    これは必須パラメーターです。すべてのパラメーターセットに含める必要があります。
    
    ??? info "例"
        `url: '/en/login.php'`

* `headers`：`header name: header value`形式のHTTPヘッダーを1つ以上含む配列です。

    作成されるHTTPリクエストでヘッダーを使用しない場合は、このパラメーターを省略できます。
    
    FASTは、結果として生成されるHTTPリクエストが正しくなるために必要なヘッダーを自動的に追加します（`headers`配列に存在しない場合でも）。例えば、`Host`や`Content-Length`です。
    
    ??? info "例"
        ```
        headers:
        - 'Accept-Language': 'en-US,en;q=0.9'
        - 'Content-Type': 'application/xml'
        ```
      
    !!! info "`Host`ヘッダーの扱い"
        必要に応じて、ベースラインリクエストから抽出されたものとは異なる`Host`ヘッダーをテストリクエストに追加できます。 
        
        例えば、Sendセクションでテストリクエストに`Host: demo.com`ヘッダーを追加できます。
    
        対応する拡張が稼働中でFASTノードが`Host: example.com`ヘッダー付きのベースラインリクエストを受信した場合、`Host: demo.com`ヘッダーを持つテストリクエストは`example.com`ホストに送信されます。結果のリクエストは次のようになります。

        ```
        curl -k -g -X POST -L -H "Host: demo.com" -H "Content-Type: application/json" "http://example.com/app" --data "{"field":"value"}"
        ```
    
* `body`：リクエストのボディを含む文字列です。必要なリクエストボディを指定できますが、最終的な文字列内に特殊文字がある場合はエスケープしてください。

    これは必須パラメーターです。すべてのパラメーターセットに含める必要があります。
    
    ??? info "例"
        `body: 'field1=value1&field2=value2`

もし`send`セクションに`N`個のパラメーターセット（`N`個のHTTPリクエストを記述）が設定されている場合、1件のベースラインリクエストにつき、FASTノードはベースラインリクエストの`Host`ヘッダーで指定されたホスト上の対象アプリケーションに`N`件のテストリクエストを送信します。