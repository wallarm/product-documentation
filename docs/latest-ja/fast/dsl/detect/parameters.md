[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

# 検知フェーズのパラメータ説明

!!! warning "検知フェーズにおける脆弱性の検知"
    サーバのレスポンスから検知フェーズにおける脆弱性を検知するには、レスポンス内に`response`パラメータで記述された要素の1つが存在するか、もしくは`oob`パラメータで記述されたOut-of-Band DNSマーカーの1つがトリガーされる必要があります（詳細な情報は下記[以下][anchor1]を参照してください）。どちらも該当しない場合、脆弱性は検知されなかったと判断されます。

!!! info "マーカーの動作ロジック"
    検知フェーズが任意のペイロードからマーカーを検出した場合、攻撃は成功したとみなされ、つまり脆弱性が正常に悪用されたことになります。検知フェーズがマーカーを使用して動作する詳細情報は、この[リンク][link-markers]を参照してください。

## OOB

`oob`パラメータは、テストリクエストによってOut-of-Bandマーカーがトリガーされたかどうかを確認します。

![`oob` parameter structure][img-oob]

!!! info "サーバレスポンス内でのOOBマーカー検知"
    サーバのレスポンス内でOOBマーカーが検出されれば、対象アプリケーションに脆弱性が存在すると判断されます。

* `oob`のみが指定されている場合、少なくとも1つ以上のOut-of-Bandマーカーのトリガーが必要です。
    
    ```
    - oob 
    ```

* トリガーを確認するために、Out-of-Bandマーカーの具体的なタイプを指定することも可能です。
    
    少なくとも1つ以上の`DNS_MARKER`マーカーのトリガーが必要です:
    
    ```
    - oob:
      - dns
    ```

    !!! info "利用可能なOOBマーカー"
        現在、利用可能なOut-of-Bandマーカーは`DNS_MARKER`のみです。

!!! info "Out-of-Band攻撃メカニズム"
    Out-of-Band（リソースロード）攻撃メカニズムはその名称の通りの動作をします。攻撃を実行する際、攻撃者はサーバに外部ソースから悪意あるコンテンツをダウンロードさせます。
    
    例えば、OOB DNS攻撃を実行する際、攻撃者は`<img>`タグ内にドメイン名を埋め込むことが可能です：`<img src=http://vulnerable.example.com>`。
    
    悪意あるリクエストを受信すると、サーバはDNSを使用してドメイン名を解決し、攻撃者が制御するリソースにアクセスします。

## レスポンス

このパラメータは、テストリクエストに対するサーバのレスポンスに必要な要素が存在するか確認します。1つ以上の要素が見つかった場合、脆弱性が検知されたと判断されます。

![`response` parameter structure][img-response]

* レスポンスには任意のマーカーが含まれている必要があります。
    
    ```
    - response
    ```

### HTTPステータスの確認

![`HTTP Status` parameter structure][img-http-status]

* レスポンスには特定のHTTPステータスが含まれている必要があります。
    ```
    - response:
      - status: value
    ```
    
    ??? info "例"
        `- status: 500` — ステータスは`500`の値である必要があります。
            
        `- status: '5\d\d'` — この正規表現はすべての`5xx`ステータスに対応します。

* レスポンスには、リスト内のいずれかのHTTPステータスが含まれている必要があります。
    
    ```
    - response:
      - status:
        - value 1
        - …
        - value S
    ```
    
    ??? info "例"
        HTTPステータスは、`500`、`404`、もしくは任意の`2xx`ステータスのいずれかを含む必要があります。
            
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```    

### HTTPヘッダーの確認

![`headers` parameter structure][img-headers]

* レスポンスヘッダーには任意のマーカーが含まれている必要があります。
    
    ```
    - response:
      - headers
    ```

* レスポンスヘッダーは特定のデータを含む必要があります（`value`は正規表現の場合もあります）。
    
    ```
    - response:
      - headers: value
    ```
    
    ??? info "例"
        * 少なくとも1つのHTTPヘッダーは部分文字列として`qwerty`を含む必要があります。
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * この正規表現は、数値を値とする任意のヘッダーに対応します。
                
            ```
                - response:
                  - headers: '\d+'
            ```    
    
* 特定のレスポンスヘッダーは一定のデータを含む必要があります（`header_#`および`header_#_value`は正規表現の場合もあります）。
    
    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "例"
        `Cookie`ヘッダーは`uid=123`データを含む必要があります。`X-`で始まるすべてのヘッダーはデータを含んではいけません。
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    
    
* 特定のレスポンスヘッダーは、指定されたリスト内のデータを含む必要があります（`header_#`および`header_#_value_#`は正規表現の場合もあります）。

    ```
    - response:
      - headers:
        - header_1:
          - header_1_value_1
          - …
          - header_1_value_K
        - …
        - header_N: 
          - header_N_value_1
          - …
          - header_N_value_K
    ```
    
    ??? info "例"
        `Cookie`ヘッダーは、以下のデータオプションのいずれかを含む必要があります：`"test=qwerty"`、`"uid=123"`。また、`X-`で始まるすべてのヘッダーはデータを含んではいけません。
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* 検知フェーズは、サーバレスポンスに特定のヘッダーが存在しないことを確認することも可能です。この場合は、該当ヘッダーの値に`null`を指定します。
    
    ```
    - response:
      - headers:
        - header_X: null
    ```

### HTTPレスポンスの本文の確認

![`body` parameter structure][img-body]

* レスポンスの本文は任意のマーカーを含む必要があります。
    
    ```
    - response:
      - body
    ```

* レスポンスの本文は特定のデータを含む必要があります（`value`は正規表現の場合もあります）。
    
    ```
    - response:
      - body: value
    ```
    
    ??? info "例"
        レスポンスの本文は`STR_MARKER`または`demo_string`の部分文字列のいずれかを含む必要があります。
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### HTMLマークアップの確認

![`html` parameter structure][img-html]

* HTMLマークアップには`STR_MARKER`が含まれる必要があります。
    
    ```
    - response:
      - body:
        - html
    ```

* レスポンス内のHTMLタグには`STR_MARKER`が含まれる必要があります。
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* レスポンス内のHTMLタグは特定のデータを含む必要があります（`value`は正規表現の場合もあります）。
    
    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "例"
        レスポンスのHTMLマークアップは`a`タグを含む必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* レスポンス内のHTMLタグは、指定されたリスト内のいずれかのデータを含む必要があります（`value_#`は正規表現の場合もあります）。
    
    ```
    - response:
      - body:
        - html:
          - tag: 
            - value_1
            - …
            - value_R
    ```
    
    ??? info "例"
        レスポンスのHTMLマークアップは、`a`、`img`、または`tr`タグのいずれかを含む必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* レスポンスのHTML属性には`STR_MARKER`が含まれる必要があります。
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* HTML属性は特定のデータを含む必要があります（`value`は正規表現の場合もあります）。
    
    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "例"
        レスポンスのHTML属性は、部分文字列として`abc`または計算マーカーのいずれかを含む必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* レスポンスのHTML属性は、指定されたリスト内のいずれかのデータを含む必要があります（`value_#`は正規表現の場合もあります）。
    
    ```
    - response:
      - body:
        - html:
          - attribute: 
            - value_1
            - …
            - value_F
    ```
    
    ??? info "例"
        HTMLマークアップは、`src`、`id`、または`style`のいずれかの属性を含む必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "`attribute`パラメータの省略形"
    `attribute`パラメータの代わりに、省略形の`attr`を使用可能です。

* レスポンス内のHREFリンクには`STR_MARKER`が含まれる必要があります。
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* レスポンス内のHREFリンクは特定のデータを含む必要があります（`value`は正規表現の場合もあります）。
    
    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "例"
        HREFリンクはDNSマーカーを含む必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    
    
* レスポンス内のHREFリンクは、指定されたリスト内のいずれかのデータを含む必要があります（`value_#`は正規表現の場合もあります）。
    
    ```
    - response:
      - body:
        - html:
          - href: 
            - value_1
            - …
            - value_J
    ```
    
    ??? info "例"
        レスポンス内のHREFリンクは、部分文字列として`google`または`cloudflare`のいずれかを含む必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* レスポンス内のJavaScriptトークンには`STR_MARKER`が含まれる必要があります。
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "JavaScriptトークン"
        JavaScriptトークンとは、`<script>`タグと`</script>`タグに挟まれた任意のJavaScriptコードを指します。
        
        例えば、次のスクリプトは`wlrm`の値を含むトークンを含みます:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* レスポンス内のJavaScriptトークンは、特定のデータを含む必要があります（値は正規表現の場合もあります）。
    
    ```
    - response:
      - body:
        - html:
          - js: value
    ```
    
    ??? info "例"
        JavaScriptトークンは`wlrm`の値を含む必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```

* レスポンス内のJavaScriptトークンは、指定されたリスト内のいずれかのデータを含む必要があります（`value_#`は正規表現の場合もあります）。
    
    ```
    - response:
      - body:
        - html:
          - js: 
            - value_1
            - …
            - value_H
    ```
    
    ??? info "例"
        JavaScriptトークンは、`wlrm`または`test`のいずれかの値を含む必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```    
