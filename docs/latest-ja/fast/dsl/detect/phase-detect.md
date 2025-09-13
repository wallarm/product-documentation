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
    このフェーズは、どのFAST拡張タイプでも動作させるために必須です（YAMLファイルには`detect`セクションを含める必要があります）。
  
    拡張タイプの詳細は[こちら][link-ext-logic]をご覧ください。

!!! info "リクエスト要素の記述構文"
    FAST拡張を作成する際に、ポイントを用いて操作する必要があるリクエスト要素を正しく記述するためには、アプリケーションに送信されるHTTPリクエストの構造と、アプリケーションから受信するHTTPレスポンスの構造を理解しておく必要があります。 

    詳細情報はこの[リンク][link-points]をご確認ください。

このフェーズでは、テストリクエストによって脆弱性が正常に悪用されたかどうかを判断するために、サーバーレスポンスで確認するパラメータを指定します。

`detect`セクションは次の構造です:

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

このセクションにはパラメータの集合が含まれます。各パラメータはレスポンスの単一要素を記述します。いくつかのパラメータは値として他のパラメータの配列を含むことができ、階層を形成します。

パラメータには次の特性があり得ます:
* オプションである（リクエストに存在しても存在しなくてもかまいません）。`detect`セクション内のすべてのパラメータはこの特性を満たします。
 
    !!! warning "`detect`セクションで必要とされるパラメータに関する注意"
        `oob`と`response`の両パラメータはオプションですが、`detect`セクションには少なくとも一方が存在している必要があります。そうでない場合、検出フェーズは動作できません。`detect`セクションには両方のパラメータを含めることもできます。

* 値が割り当てられていない場合があります。  
    
    ??? info "例"
        ```
        - response
        ```    

* 文字列または数値として単一の値を持つ場合があります。
    
    ??? info "例"
        ```
        - status: 500
        ```

* 文字列または数値の配列として指定された複数の候補値のいずれかを持つ場合があります。 
    
    ??? info "例"
        ```
            - status: 
                - 404
                - 500
        ```

* 値として他のパラメータを含む場合があります（そのパラメータは配列として指定します）。
    
    ??? info "例"
        ```
            - headers: 
                - "Cookie": "example"
                - "User-Agent":
                    - "Mozilla"
                    - "Chrome"
        ```

`detect`セクションのパラメータに許容される値は、以下のセクションで説明します:
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