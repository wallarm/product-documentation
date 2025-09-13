[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

#   Detectフェーズのパラメータ説明

!!! warning "Detectフェーズでの脆弱性の検出"
    サーバーのレスポンスを用いてDetectフェーズで脆弱性を検出するには、レスポンスが`response`パラメータで説明されているレスポンス要素のいずれかを含むか、`oob`パラメータで説明されているOut-of-Band DNSマーカーのいずれかがトリガーされる必要があります（アウトオブバンドマーカーの詳細は[下記][anchor1]を参照してください）。それ以外の場合は、脆弱性は見つからなかったと見なします。

!!! info "マーカーの動作ロジック"
    Detectフェーズがサーバーのレスポンス内で任意のペイロードのマーカーを検出した場合、攻撃は成功、つまり脆弱性の悪用に成功したと見なします。マーカーを用いたDetectフェーズの動作の詳細は、この[リンク][link-markers]を参照してください。

##  OOB

`oob`パラメータは、テストリクエストによってOut-of-Bandマーカーがトリガーされたかどうかを確認します。 

![`oob`パラメータの構造][img-oob]

!!! info "サーバー応答でのOOBマーカーの検出"
    サーバーのレスポンスでOOBマーカーが検出された場合、対象アプリケーションに脆弱性が見つかったと見なします。 

* `oob`のみを指定した場合、少なくとも1つのOut-of-Bandマーカーがトリガーされることを想定します。
    
    ```
    - oob 
    ```

* トリガーを確認するOut-of-Bandマーカーの種類を明示的に指定することもできます。
    
    少なくとも`DNS_MARKER`マーカーが1回トリガーされることを想定します:
    
    ```
    - oob:
      - dns
    ```

    !!! info "利用可能なOOBマーカー"
        現在利用可能なOut-of-Bandマーカーは1種類のみで、`DNS_MARKER`です。

!!! info "Out-of-Band攻撃メカニズム"
    Out-of-Band（リソース読み込み）攻撃メカニズムは、その名称が示すとおりの動作です。攻撃の実行時、攻撃者はサーバーに外部ソースから悪意のあるコンテンツをダウンロードさせます。
    
    例えば、OOB DNS攻撃を行う場合、攻撃者は次のように`<img>`タグにドメイン名を埋め込むことができます: `<img src=http://vulnerable.example.com>`。
    
    サーバーがこの悪意のあるリクエストを受け取ると、DNSを使用してドメイン名を解決し、攻撃者が制御するリソースにアクセスします。

##  Response

このパラメータは、テストリクエストに対するサーバーのレスポンスに必要な要素が含まれているかどうかを確認します。これらの要素の少なくとも1つが見つかった場合、脆弱性が検出されたと見なします。

![`response`パラメータの構造][img-response]

* レスポンスは何らかのマーカーを含んでいる必要があります。
    
    ```
    - response
    ```

### HTTPステータスのチェック

![`HTTPステータス`パラメータの構造][img-http-status]

* レスポンスは特定のHTTPステータスを含んでいる必要があります。
    ```
    - response:
      - status: value
    ```
    
    ??? info "例"
        `- status: 500` — ステータスは`500`である必要があります。
            
        `- status: '5\d\d'` — この正規表現は`5xx`のすべてのステータスをカバーします。

* レスポンスは、リストのいずれかのHTTPステータスを含んでいる必要があります。
    
    ```
    - response:
      - status:
        - value 1
        - …
        - value S
    ```
    
    ??? info "例"
        HTTPステータスは次の値のいずれかである必要があります: `500`、`404`、または任意の`2xx`ステータス。
            
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```    

### HTTPヘッダーのチェック

![`headers`パラメータの構造][img-headers]

* レスポンスヘッダーは何らかのマーカーを含んでいる必要があります。
    
    ```
    - response:
      - headers
    ```

* レスポンスヘッダーは特定のデータを含んでいる必要があります（`value`は正規表現でもかまいません）。
    
    ```
    - response:
      - headers: value
    ```
    
    ??? info "例"
        * HTTPヘッダーのうち少なくとも1つが`qwerty`を部分文字列として含んでいる必要があります。
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * この正規表現は数値の値を持つ任意のヘッダーをカバーします。
                
            ```
                - response:
                  - headers: '\d+'
            ```    
    
* 特定のレスポンスヘッダーが特定のデータを含んでいる必要があります（`header_#`および`header_#_value`は正規表現でもかまいません）。
    
    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "例"
        `Cookie`ヘッダーは`uid=123`というデータを含んでいる必要があります。`X-`で始まるすべてのヘッダーはいかなるデータも含まない必要があります。
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    
    
* 特定のレスポンスヘッダーが、指定されたリストのデータのいずれかを含んでいる必要があります（`header_#`および`header_#_value_#`は正規表現でもかまいません）。

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
        `Cookie`ヘッダーは次のいずれかのデータを含んでいる必要があります: `"test=qwerty"`、`"uid=123"`。`X-`で始まるすべてのヘッダーはいかなるデータも含まない必要があります。
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* Detectフェーズは、特定のヘッダーがサーバーのレスポンスに存在しないことをチェックすることもできます。そのためには、そのヘッダーの値に`null`を設定します。
    
    ```
    - response:
      - headers:
        - header_X: null
    ```

### HTTPレスポンスボディのチェック

![`body`パラメータの構造][img-body]

* レスポンスボディは何らかのマーカーを含んでいる必要があります。
    
    ```
    - response:
      - body
    ```

* レスポンスボディは特定のデータを含んでいる必要があります（`value`は正規表現でもかまいません）。
    
    ```
    - response:
      - body: value
    ```
    
    ??? info "例"
        レスポンスボディは`STR_MARKER`または`demo_string`のいずれかの部分文字列を含んでいる必要があります。
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### HTMLマークアップのチェック

![`html`パラメータの構造][img-html]

* HTMLマークアップは`STR_MARKER`を含んでいる必要があります。
    
    ```
    - response:
      - body:
        - html
    ```

* レスポンス内のHTMLタグは`STR_MARKER`を含んでいる必要があります。
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* レスポンス内のHTMLタグは特定のデータを含んでいる必要があります（`value`は正規表現でもかまいません）。
    
    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "例"
        レスポンスのHTMLマークアップは`a`タグを含んでいる必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* レスポンス内のHTMLタグは、指定されたリストのいずれかのデータを含んでいる必要があります（`value_#`は正規表現でもかまいません）。
    
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
        レスポンスのHTMLマークアップは次のいずれかのタグを含んでいる必要があります: `a`、`img`、`tr`。
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* レスポンスのHTML属性は`STR_MARKER`を含んでいる必要があります。
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* HTML属性は特定のデータを含んでいる必要があります（`value`は正規表現でもかまいません）。
    
    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "例"
        レスポンスのHTML属性は、部分文字列として`abc`か、計算マーカーのいずれかを含んでいる必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* レスポンスのHTML属性は、指定されたリストのいずれかのデータを含んでいる必要があります（`value_#`は正規表現でもかまいません）:
    
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
        HTMLマークアップは次のいずれかの属性を含んでいる必要があります: `src`、`id`、`style`。
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "`attribute`パラメータの短縮形"
    `attribute`パラメータの代わりに、短縮形 — `attr`を使用できます。

* レスポンスのHREFリンクは`STR_MARKER`を含んでいる必要があります。
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* レスポンスのHREFリンクは特定のデータを含んでいる必要があります（`value`は正規表現でもかまいません）。
    
    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "例"
        HREFリンクはDNSマーカーを含んでいる必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    
    
* レスポンスのHREFリンクは、指定されたリストのいずれかのデータを含んでいる必要があります（`value_#`は正規表現でもかまいません）。
    
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
        レスポンスのHREFリンクは、部分文字列として`google`または`cloudflare`を含んでいる必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* レスポンスのJavaScriptトークンは`STR_MARKER`を含んでいる必要があります。
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "JavaScriptトークン"
        JavaScriptトークンとは、`<script>`と`</script>`タグ内にある任意のJavaScriptコード片を指します。
        
        例えば、次のスクリプトには`wlrm`という値を持つトークンが含まれます:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* レスポンスのJavaScriptトークンは特定のデータを含んでいる必要があります（値は正規表現でもかまいません）。
    
    ```
    - response:
      - body:
        - html:
          - js: value
    ```
    
    ??? info "例"
        JavaScriptトークンは`wlrm`という値を含んでいる必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```

* レスポンスのJavaScriptトークンは、指定されたリストのいずれかのデータを含んでいる必要があります（`value_#`は正規表現でもかまいません）。
    
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
        JavaScriptトークンは`wlrm`または`test`という値を含んでいる必要があります。
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```