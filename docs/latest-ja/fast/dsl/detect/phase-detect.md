[link-points]:      ../points/intro.md
[link-ext-logic]:   ../logic.md

[anchor1]:      parameters.md#oob
[anchor2]:      parameters.md#response
[anchor3]:      parameters.md#checking-the-http-statuses
[anchor4]:      parameters.md#checking-the-http-headers
[anchor5]:      parameters.md#checking-the-body-of-the-http-response
[anchor6]:      parameters.md#checking-the-html-markup


# ディテクトフェーズ

!!! info "フェーズの範囲"
    このフェーズは、任意のFAST拡張タイプが動作するために必須であり（YAMLファイルには `detect` セクションを含める必要があります）。
  
    拡張タイプの詳細については、[こちら][link-ext-logic]をご覧ください。

!!! info "リクエスト要素の記述方法"
    FAST拡張を作成する際、アプリケーションへ送信されるHTTPリクエストの構造と、アプリケーションから受信されるHTTPレスポンスの構造を理解し、ポイントを使用して作業する必要のあるリクエスト要素を正しく記述する必要があります。

    詳細な情報については、[こちら][link-points]のリンクをご覧ください。

このフェーズでは、サーバーのレスポンスで探すパラメータを指定し、テスト要求が脆弱性を成功裏に悪用したかどうかを判断します。

`detect` セクションの構造は次のとおりです：

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

このセクションには、パラメータのセットが含まれています。各パラメータは、レスポンスの一つの要素を記述します。パラメータの一部は、値として他のパラメータの配列を含むことが可能で、階層を生成します。

パラメータは次の特性を持つ可能性があります：
* 任意（パラメータはリクエストに存在することも、存在しないこともあります）。 `detect` セクションのすべてのパラメータがこの特性を満たします。

    !!! warning "`detect`セクションで必要なパラメータについて"
        `oob`と`response`のパラメータが任意であるにもかかわらず、どちらか一つが `detect` セクションに存在しなければなりません。もしそうでない場合、ディテクトフェーズは動作できません。 `detect`セクションにはこれらのパラメータの両方が含まれることもあります。

* 割り当てられた値を持っていません。
    
    ??? info "例"
        ```
        - response
        ```    

* 文字列または数値として指定された単一の値を持ちます。
    
    ??? info "例"
        ```
        - status: 500
        ```

* 文字列または数値の配列として指定された複数の割り当てられた値のうちの一つを持ちます。
    
    ??? info "例"
        ```
            - status: 
                - 404
                - 500
        ```

* 値として他のパラメータを含みます（パラメータは配列として指定されます）。
    
    ??? info "例"
        ```
            - headers: 
                - "Cookie": "example"
                - "User-Agent":
                    - "Mozilla"
                    - "Chrome"
        ```

detectセクションのパラメータの許容値は、以下のセクションで説明されています：
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