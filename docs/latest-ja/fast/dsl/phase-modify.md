[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-modify]:           ../../images/fast/dsl/common/phases/modify.png

# 修正フェーズ

!!! info "フェーズの範囲"
    このフェーズは、修正拡張で使用され、その操作にはオプショナルです（YAMLファイル内に `modify`項目があってもなくてもよい）。

    このフェーズは、非修正拡張のYAMLファイルから除外するべきです。

    拡張機能のタイプについては、[こちら][link-ext-logic]で詳しく読んでください。

!!! info "リクエスト要素記述構文"
    FAST拡張機能を作成する際には、アプリケーションに送信されるHTTPリクエストの構造と、アプリケーションから受信したHTTPレスポンスの構造を理解し、適切に記述する必要があります。

    詳細情報は、[こちら][link-points]のリンク先でご覧ください。

 このフェーズでは、必要に応じて基準リクエストのパラメータの値を変更します。なお、Modifyフェーズを使用して、基準リクエストに存在しない新しい要素を追加することはできません。たとえば、基準リクエストに`Cookie` HTTPヘッダが含まれていない場合は、それを追加することはできません。

拡張YAMLファイルの`modify`セクションには、`<キー：値>`のペアの配列が含まれています。各ペアは特定のリクエスト要素（キー）と、その要素に挿入されるデータ（値）を記述しています。キーは[Ruby正規表現フォーマット][link-ruby-regexp]で正規表現を含むことができます。ただし、キーの値に対して正規表現を適用することはできません。

Modifyフェーズでは、要素に新しい値を割り当てるか、要素のデータを削除することができます。

* キーの値が設定されている場合、その値は対応する基準リクエスト要素に割り当てられます。基準リクエストにキーに対応する要素がない場合、新しい要素の挿入は行われません。

     ??? info "例1"
        `'HEADER_COOKIE_value': 'C=qwerty123'`

         ![Modify phase](../../images/fast/dsl/en/phases/modify.png)

* キーの値が設定されていない場合、対応する基準リクエスト要素の値がクリアされます。

    ??? info "例"
        `'HEADER_COOKIE_value': ""`

??? info "例"
    以下の例では、基準リクエストが次のように変更されます：

    1.  `Content-Type`ヘッダーの値が`application/xml`に置換されます。
    2.  `uid` GETパラメータの値がクリアされます（パラメータ自体は削除されません）。

    ```
    modify:
    - "HEADER_CONTENT-TYPE_value": "application/xml"
    - "GET_uid_value": ""
    ```