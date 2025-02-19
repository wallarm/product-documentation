[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-modify]:           ../../images/fast/dsl/common/phases/modify.png

# Modifyフェーズ

!!! info "フェーズの範囲"
    このフェーズは変更系拡張機能で使用され、その動作は任意です（YAMLファイルに`modify`セクションが存在する場合と存在しない場合があります）。

    このフェーズは変更を行わない拡張機能のYAMLファイルには含めない必要があります。
    
    拡張機能のタイプについての詳細は[こちら][link-ext-logic]をご覧ください。

!!! info "リクエスト要素の記述構文"
    FAST拡張機能を作成する際は、アプリケーションに送信されるHTTPリクエストの構造およびアプリケーションから受信されるHTTPレスポンスの構造を理解し、pointsを使用して操作する必要のあるリクエスト要素を正しく記述できるようにする必要があります。

    詳細については、この[リンク][link-points]をご覧ください。
 
このフェーズは、必要に応じてベースラインリクエストのパラメータの値を変更します。なお、Modifyフェーズを使用して、ベースラインリクエストに存在しない新しい要素を追加することはできません。例えば、ベースラインリクエストに`Cookie` HTTPヘッダーが含まれていない場合、そのヘッダーを追加することはできません。

拡張機能のYAMLファイル内の`modify`セクションには、<key: value> ペアの配列が含まれています。各ペアは、特定のリクエスト要素（キー）と、その要素に挿入すべきデータ（値）を記述しています。キーには、[Ruby正規表現形式][link-ruby-regexp]の正規表現を含めることができます。キーの値に正規表現を適用することはできません。

Modifyフェーズでは、要素に新しい値を割り当てたり、要素のデータを削除したりできます。

* キーの値が設定されている場合、その値が対応するベースラインリクエスト要素に割り当てられます。もしベースラインリクエストにキーに対応する要素が存在しない場合、新たな要素の挿入は行われません。
    
    ??? info "例 1"
        `'HEADER_COOKIE_value': 'C=qwerty123'`

        ![Modifyフェーズ](../../images/fast/dsl/en/phases/modify.png)

* キーの値が設定されていない場合、対応するベースラインリクエスト要素の値はクリアされます。
    
    ??? info "例"
        `'HEADER_COOKIE_value': ""`

??? info "例"
    以下の例では、ベースラインリクエストが以下の方法で変更されます:

    1.  `Content-Type`ヘッダーの値が`application/xml`に置き換えられます。
    2.  `uid` GETパラメータの値がクリアされます（パラメータ自体は削除されません）。

    ```
    modify:
    - "HEADER_CONTENT-TYPE_value": "application/xml"
    - "GET_uid_value": ""
    ```