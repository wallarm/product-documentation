[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

#   検出フェーズのパラメーターの説明

!!! warning "検出フェーズでの脆弱性の検出"
    検出フェーズでサーバーの応答を使用して脆弱性を検出するには、応答に`response`パラメータで説明されている応答要素の一つが含まれているか、または`oob`パラメータで説明されているバンド外のDNSマーカーの一つがトリガーされる必要があります（バンド外マーカーに関する詳細情報は[下に][anchor1]参照してください）。それ以外の場合、脆弱性は見つからなかったと考えられます。

!!! info "マーカーの動作ロジック"
    検出フェーズでサーバーの応答にペイロードからマーカーが検出されると、攻撃が成功したことを意味し、脆弱性が正常に利用されたことになります。マーカーの動作に関する詳細な情報を見るには、この[リンク][link-markers]に進んでください。

##  OOB

`oob`パラメータは、テストリクエストによるバンド外マーカーのトリガーをチェックします。

![!`oob` パラメータの構造][img-oob]

!!! info "サーバーの応答でのOOBマーカーの検出"
    サーバーの応答でOOBマーカーが検出された場合、ターゲットアプリケーションに脆弱性が見つかったと考えられます。

* `oob`のみが指定されている場合、バンド外のマーカーのトリガーが最低でも１つ期待されます。
    
    ```
    - oob 
    ```

* 特定の種類のバンド外マーカーがトリガーされることをチェックするために指定することもできます。

    `DNS_MARKER`マーカーのトリガーが最低でも1つ期待されます。
    
    ```
    - oob:
      - dns
    ```

    !!! info "利用可能なOOBマーカー"
        現在、利用可能なバンド外マーカーは `DNS_MARKER`のみです。

!!! info "バンド外攻撃メカニズム"
    バンド外（リソースロード）攻撃メカニズムはその名のとおりで、攻撃を行う際に悪意のある者がサーバーに外部源から悪意のあるコンテンツをダウンロードさせます。

    例えば、OOB DNS攻撃を行う際、悪意のある者はドメイン名を以下のように`<img>`タグに埋め込むことができます：`<img src=http://vulnerable.example.com>`。

    悪意のあるリクエストを受け取ったサーバーは、DNSを使用してドメイン名を解決し、悪意のある者が制御するリソースにアクセスします。

##  Response

このパラメータは、サーバーのテストリクエストへの応答に必要な要素が存在するかどうかをチェックします。これらの要素のうち少なくとも1つが見つかれば、脆弱性が検出されたとされます。

![!`response` パラメータの構造][img-response]

* 応答は任意のマーカーを含むべきです。
    
    ```
    - response
    ```

### HTTPステータスのチェック

![!`HTTP Status` パラメータの構造][img-http-status]

* 応答には特定のHTTPステータスが含まれているべきです。
    ```
    - response:
      - status: value
    ```
    
    ??? info "例"
        `- status: 500` — ステータスは値が `500` であるべきです。
            
        `- status: '5\d\d'` — この正規表現は全ての `5xx` ステータスを含みます。

* 応答にはリストからの任意のHTTPステータスが含まれているべきです。

    ```
    - response:
      - status:
        - value 1
        - …
        - value S
    ```
    
    ??? info "例"
        HTTPステータスは次の値のうち一つを含むべきです： `500`、`404`、いずれかの`2xx`ステータス。
            
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```    

### HTTPヘッダーのチェック

![!`headers` パラメータの構造][img-headers]

* 応答ヘッダーは任意のマーカーを含むべきです。
    
    ```
    - response:
      - headers
    ```

* 応答ヘッダーは特定のデータを含むべきです（`value`は正規表現であってもよい）。
    
    ```
    - response:
      - headers: value
    ```
    
    ??? info "例"
        * HTTPヘッダーの少なくとも一つが `qwerty` を部分文字列として含むべきです。
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * この正規表現は数値である全てのヘッダーを含みます。
                
            ```
                - response:
                  - headers: '\d+'
            ```    
    
* 特定の応答ヘッダーは特定のデータを含むべきです（`header_#`と`header_#_value`は正規表現であってもよい）。

    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "例"
        `Cookie`ヘッダーは`uid=123`のデータを含むべきです。全ての`X-`で始まるヘッダーは何もデータを含んではいけません。
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    
    
* 特定の応答ヘッダーは指定されたリストからのデータを含むべきです（`header_#`と`header_#_value_#`は正規表現であってもよい）。

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
        `Cookie`ヘッダーは次のデータオプションのうち一つを含むべきです： "test=qwerty"、`uid=123`。全ての`X-`で始まるヘッダーは何もデータを含んではいけません。
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* 検出フェーズは特定のヘッダーがサーバーの応答から欠けているかどうかもチェックできます。これを行うには、特定のヘッダーの値に `null` を代入します。
    
    ```
    - response:
      - headers:
        - header_X: null
    ```

### HTTP応答のボディのチェック

![!`body` パラメータの構造][img-body]

* 応答のボディは任意のマーカーを含むべきです。
    
    ```
    - response:
      - body
    ```

* 応答のボディは特定のデータを含むべきです（`value`は正規表現であってもよい）。
    
    ```
    - response:
      - body: value
    ```
    
    ??? info "例"
        応答のボディは `STR_MARKER` または `demo_string` の部分文字列を含むべきです。
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### HTMLマークアップのチェック

![!`html` パラメータの構造][img-html]

* HTMLマークアップは `STR_MARKER` を含むべきです。
    
    ```
    - response:
      - body:
        - html
    ```

* 応答のHTMLタグは `STR_MARKER` を含むべきです。
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* 応答のHTMLタグは特定のデータを含むべきです（`value`は正規表現であってもよい）。
    
    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "例"
        応答のHTMLマークアップは `а` タグを含むべきです。
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* 応答のHTMLタグは指定されたリストからの任意のデータを含むべきです（`value_#`は正規表現であってもよい）。
    
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
        応答のHTMLマークアップは次のタグのうち一つを含むべきです：`а`、`img`、または`tr`。
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* 応答のHTML属性は `STR_MARKER` を含むべきです。
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* HTML属性は特定のデータを含むべきです（`value`は正規表現であってもよい）。
    
    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "例"
        応答のHTML属性は `abc` を部分文字列として含むか、または計算マーカーを含むべきです。
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* 応答のHTML属性は指定されたリストからの任意のデータを含むべきです（`value_#`は正規表現であってもよい）：
    
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
        HTMLマークアップは次の属性の一つを含むべきです：`src`、`id`、または`style`。
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "`attribute`パラメータの省略版"
    `attribute`パラメータを使用する代わりに、省略版の `attr` を使用できます。

* 応答のHREFリンクは `STR_MARKER` を含むべきです。
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* 応答のHREFリンクは特定のデータを含むべきです（`value`は正規表現であってもよい）。
    
    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "例"
        HREFリンクはDNSマーカーを含むべきです。
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    
    
* 応答のHREFリンクは指定されたリストからの任意のデータを含むべきです（`value_#`は正規表現であってもよい）。
    
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
        応答のHREFリンクは `google` または `cloudflare` を部分文字列として含むべきです。
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* 応答のJavaScriptトークンは `STR_MARKER` を含むべきです。
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "JavaScriptのトークン"
        JavaScriptのトークンは、`<script>` タグと `</script>` タグの間にある任意のJavaScriptコードスクリプトを指します。
        
        例えば、次のスクリプトは `wlrm` 値を持つトークンを含んでいます：
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* 応答のJavaScriptトークンは特定のデータを含むべきです（値は正規表現でもよい）。
    
    ```
    - response:
      - body:
        - html:
          - js: value
    ```
    
    ??? info "例"
        JavaScriptトークンは `wlrm` の値を含むべきです。
            
        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```

* 応答のJavaScriptトークンは指定されたリストからの任意のデータを含むべきです（`value_#`は正規表現であってもよい）。
    
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
        JavaScriptトークンは `wlrm` または `test` の値を含むべきです。
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```