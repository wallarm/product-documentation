```markdown
[link-points]:      ../points/intro.md
[link-ext-logic]:   ../logic.md

[anchor1]:      parameters.md#oob
[anchor2]:      parameters.md#response
[anchor3]:      parameters.md#checking-the-http-statuses
[anchor4]:      parameters.md#checking-the-http-headers
[anchor5]:      parameters.md#checking-the-body-of-the-http-response
[anchor6]:      parameters.md#checking-the-html-markup

# 検出フェーズ

!!! info "フェーズの範囲"
    このフェーズは、任意のFAST拡張タイプが動作するために必須です（YAMLファイルには`detect`セクションが含まれている必要があります）。
  
    拡張タイプの詳細については[こちら][link-ext-logic]をお読みください。

!!! info "HTTPリクエスト要素記述の構文"
    FAST拡張を作成する際には、アプリケーションに送信されるHTTPリクエストの構造と、アプリケーションから受信されるHTTPレスポンスの構造を理解し、ポイントを使用して作業する必要があるリクエスト要素を正しく記述する必要があります。

    詳細な情報については、この[リンク][link-points]をご参照ください。

このフェーズでは、テストリクエストによって脆弱性が正常に悪用されたかどうかを判断するために、サーバーレスポンス内で探すべきパラメーターを指定します。

`detect`セクションは次の構造になっています:

```
detect:
  - oob:
    - dns
  - response:
    - status:
      - value 1
      - …
      - value S
    - headers:
      - header 1: 
        - value 1
        - …
        - value T
      - header …
      - header N:
        - value 1
        - …
        - value U
    - body:
      - html:
        - tag:
          - value 1
          - …
          - value V
        - attr:
          - value 1
          - …
          - value W
        - attribute:
          - value 1
          - …
          - value X
        - js:
          - value 1
          - …
          - value Y
        - href:
          - value 1
          - …
          - value Z
```

このセクションには、一連のパラメーターが含まれています。それぞれのパラメーターはレスポンスの単一要素を記述しており、一部のパラメーターは値として他のパラメーターの配列を含むことができ、階層構造を作り出します。

パラメーターは次の特徴を持つ場合があります:
* オプションである（パラメーターはリクエストに存在しても存在しなくてもかまいません）。`detect`セクション内のすべてのパラメーターはこの特徴を満たします。
 
    !!! warning "「detect」セクションで必須とされるパラメーターについての注意"
        `oob`と`response`の両パラメーターはオプションですが、どちらか一方は`detect`セクション内に必ず存在しなければなりません。そうでなければ、検出フェーズが動作しなくなります。`detect`セクションには両方のパラメーターが含まれていても構いません。

* 値が割り当てられていない場合がある。  
    
    ??? info "例"
        ```
        - response
        ```    

* 文字列または数字として指定された単一の値を持つ場合がある。
    
    ??? info "例"
        ```
        - status: 500
        ```

* 文字列または数字の配列として指定された、複数の候補値のいずれかを持つ場合がある。 
    
    ??? info "例"
        ```
            - status: 
                - 404
                - 500
        ```

* 値として他のパラメーターを含む場合がある（パラメーターは配列として指定されます）。
    
    ??? info "例"
        ```
            - headers: 
                - "Cookie": "example"
                - "User-Agent":
                    - "Mozilla"
                    - "Chrome"
        ```

`detect`セクションのパラメーターで許容される値については、以下のセクションに記載されています:
* [oob][anchor1],
* [response][anchor2],
    * [status][anchor3],
    * [headers][anchor4],
    * [body][anchor5],
        * [html][anchor6],
            * attr,
            * attribute,
            * href,
            * js,
            * tag.
```