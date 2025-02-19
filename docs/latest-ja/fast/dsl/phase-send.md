```markdown
# 送信フェーズ

!!! info "フェーズの範囲"
    このフェーズは変更を伴わない拡張機能が機能するために必須です（YAMLファイルには`send`セクションが含まれている必要があります）。
    
    変更を伴う拡張機能にはこのフェーズが存在しません。なぜなら、Sendフェーズと他のフェーズ（Detectフェーズおよび暗黙のCollectフェーズを除く）を組み合わせた場合、他のフェーズが使用できなくなるためです。
    
    拡張タイプの詳細については[こちら][link-ext-logic]をお読みください。

このフェーズは、事前に定義されたテストリクエストを送信し、脆弱性に対してターゲットアプリケーションをテストします。テストリクエストを送信するホストは、受信したベースラインリクエストの`Host`ヘッダーの値によって決定されます。

`send`セクションは以下の構造になっています：

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

拡張機能YAMLファイル内の`send`セクションには、1つ以上のパラメータセットが含まれています。各パラメータは`<key: value>`のペアで指定されます。特定のパラメータセットは、テストリクエストとして送信される単一のHTTPリクエストを記述します。次のパラメータがセットの一部です：

* `method`: リクエストで使用されるHTTPメソッドです。

    これは必須パラメータです：すべてのパラメータセットに含まれている必要があります。
    
    ??? info "許可されるパラメータの値"
    
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

* `url`: URL文字列です。このURIにリクエストが送信されます。

    これは必須パラメータです：すべてのパラメータセットに含まれている必要があります。
    
    ??? info "例"
        `url: '/en/login.php'`

* `headers`: `header name: header value`形式の1つ以上のHTTPヘッダーを含む配列です。

    構築されたHTTPリクエストがヘッダーを使用しない場合は、このパラメータを省略できます。
    
    FASTは、たとえ`headers`配列に存在しなくても、正しいHTTPリクエストが送信されるために必要なヘッダー（例えば`Host`と`Content-Length`）を自動的に追加します。
    
    ??? info "例"
        ```
        headers:
        - 'Accept-Language': 'en-US,en;q=0.9'
        - 'Content-Type': 'application/xml'
        ```
      
    !!! info "Hostヘッダーの扱い"
        必要に応じて、ベースラインリクエストから抽出されるものと異なる`Host`ヘッダーをテストリクエストに追加できます。
        
        例えば、Sendセクションでテストリクエストに`Host: demo.com`ヘッダーを追加することが可能です。
    
        該当の拡張機能が動作しており、FASTノードが`Host: example.com`ヘッダーを含むベースラインリクエストを受け取った場合、`Host: demo.com`ヘッダーを持つテストリクエストが`example.com`ホストに送信されます。結果として、リクエストは以下のようになります：
    
        ```
        curl -k -g -X POST -L -H "Host: demo.com" -H "Content-Type: application/json" "http://example.com/app" --data "{"field":"value"}"
        ```

* `body`: リクエストの本文を含む文字列です。必要に応じて特殊文字があればエスケープした任意のリクエスト本文を指定できます。

    これは必須パラメータです：すべてのパラメータセットに含まれている必要があります。
    
    ??? info "例"
        `body: 'field1=value1&field2=value2`

もし`send`セクションに`N`個のパラメータセットが含まれており、それぞれが`N`個のHTTPリクエストを記述している場合、単一の受信ベースラインリクエストに対して、FASTノードはベースラインリクエストの`Host`ヘッダーに指定されたホストに`N`個のテストリクエストを送信します。
```