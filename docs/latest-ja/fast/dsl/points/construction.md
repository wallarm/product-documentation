[link-http]:                    parsers/http.md
[link-uri]:                     parsers/http.md#uri-filter
[link-path]:                    parsers/http.md#path-filter
[link-actionname]:              parsers/http.md#action_name-filter
[link-actionext]:               parsers/http.md#action_ext-filter
[link-get]:                     parsers/http.md#get-filter
[link-header]:                  parsers/http.md#header-filter
[link-post]:                    parsers/http.md#post-filter
[link-formurlencoded]:          parsers/form-urlencoded.md
[link-multipart]:               parsers/multipart.md
[link-cookie]:                  parsers/cookie.md
[link-xml]:                     parsers/xml.md
[link-xmlcomment]:              parsers/xml.md#xml_comment-filter
[link-xmldtd]:                  parsers/xml.md#xml_dtd-filter
[link-xmldtdentity]:            parsers/xml.md#xml_dtd_entity-filter
[link-xmlpi]:                   parsers/xml.md#xml_pi-filter
[link-xmltag]:                  parsers/xml.md#xml_tag-filter
[link-xmltagarray]:             parsers/xml.md#xml_tag_array-filter
[link-xmlattr]:                 parsers/xml.md#xml_attr-filter
[link-jsondoc]:                 parsers/json.md
[link-jsonobj]:                 parsers/json.md#json_obj-filter
[link-jsonarray]:               parsers/json.md#json_array-filter
[link-array]:                   parsers/array.md
[link-hash]:                    parsers/hash.md
[link-gzip]:                    parsers/gzip.md
[link-base64]:                  parsers/base64.md

# ポイントの作成方法
ポイントで使用可能なFAST DSLのパーサーとフィルターの一覧を再確認します。
* [HTTPパーサー][link-http]:
    * [URIフィルター][link-uri];
    * [Pathフィルター][link-path];
    * [Action_nameフィルター][link-actionname];
    * [Action_extフィルター][link-actionext];
    * [GETフィルター][link-get];
    * [HEADERフィルター][link-header];
    * [POSTフィルター][link-post];
* [Form_urlencodedパーサー][link-formurlencoded];
* [Multipartパーサー][link-multipart];
* [Cookieパーサー][link-cookie];
* [XMLパーサー][link-xml]:
    * [Xml_commentフィルター][link-xmlcomment];
    * [Xml_dtdフィルター][link-xmldtd];
    * [Xml_dtd_entityフィルター][link-xmldtdentity];
    * [Xml_piフィルター][link-xmlpi];
    * [Xml_tagフィルター][link-xmltag];
    * [Xml_tag_arrayフィルター][link-xmltagarray];
    * [Xml_attrフィルター][link-xmlattr];
* [Json_docパーサー][link-jsondoc]:
    * [Json_objフィルター][link-jsonobj];
    * [Json_arrayフィルター][link-jsonarray];
* [GZIPパーサー][link-gzip];
* [Base64パーサー][link-base64];
* [Arrayフィルター][link-array];
* [Hashフィルター][link-hash].

どのパーサーとフィルターをポイントに含めるべきかを理解しやすくするため、ポイントは右から左へ組み立てることを推奨します。ポイントを作成する際は、リクエストの小さい部分から大きい部分へと進みます。

!!! info "ポイントの要素の区切り"
    ポイントの各要素は`_`記号で区切る必要があります。

## 例1 

次のリクエストにおける`uid`パラメータのデコード後の値を参照するポイントを作成する必要があるとします。

```
GET http://example.com/main/login/?uid=MDEyMzQ=
```

ここで、`MDEyMzQ=`は`01234`文字列をBase64エンコードしたものです。

1.   ポイントはリクエスト要素の*値*を参照する必要があるため、ポイントにサービスワード`value`を含める必要があります。

    現在のポイントの状態: `value`。

2.   ポイントはデコード後の値を参照する必要がありますが、対象の値はリクエスト内で*Base64*エンコードされています。値をデコードするため、ポイントの左側に`BASE64`パーサー名を追加します。
       
    現在のポイントの状態: `BASE64_value`。

3.   ポイントは*`uid`*パラメータの値を参照する必要があります。目的のパラメータ値を参照するため、ポイントの左側に`uid`パラメータ名を追加します。 
    
    現在のポイントの状態: `uid_BASE64_value`。

4.   ポイントはベースラインリクエストの*クエリ文字列*で渡されるパラメータの値を参照する必要があります。クエリ文字列のパラメータ値を参照するため、ポイントの左側に`GET`フィルター名を追加します。 
    
    現在のポイントの状態: `GET_uid_BASE64_value`。



この例の条件を満たすため、手順4で得たポイントは、拡張に次のいずれかの方法で追加できます:
* いずれのサービス記号でも囲まない。
* アポストロフィで囲む（`'GET_uid_BASE64_value'`）。
* 二重引用符で囲む（`"GET_uid_BASE64_value"`）。



## 例2

次のリクエストで`passwd`パラメータの値`01234`を参照するポイントを作成する必要があるとします。

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストで次の

```
username=admin&passwd=01234.
```

ボディです。

1.   ポイントはリクエスト要素の*値*を参照する必要があるため、ポイントにサービスワード`value`を含める必要があります。
    
    現在のポイントの状態: `value`。

2.   ポイントは*`passwd`*パラメータの値を参照する必要があります。目的のパラメータ値を参照するため、ポイントの左側に`passwd`パラメータ名を追加します。 
    
    現在のポイントの状態: `passwd_value`。

3.   ポイントは*form-urlencoded形式*で渡されるパラメータの値を参照する必要があります。これはベースラインリクエストのContent-Typeヘッダーの値から分かります。form-urlencodedで渡されたパラメータの値を参照するため、ポイントの左側にForm_urlencodedパーサー名を大文字で追加します。 
    
    現在のポイントの状態: `FORM_URLENCODED_passwd_value`。

4.   ポイントは*リクエストボディ*で渡されるパラメータの値を参照する必要があります。リクエストボディのパラメータ値を参照するため、ポイントの左側に`POST`パーサー名を追加します。
    
    現在のポイントの状態: `POST_FORM_URLENCODED_passwd_value`。



この例の条件を満たすため、手順4で得たポイントは、拡張に次のいずれかの方法で追加できます:
* いずれのサービス記号でも囲まない。
* アポストロフィで囲む（`'POST_FORM_URLENCODED_passwd_value'`）。
* 二重引用符で囲む（`"POST_FORM_URLENCODED_passwd_value"`）。



## 例3

次のリクエストで`secret-word`クッキーの値`abcde`を参照するポイントを作成する必要があるとします。

```
GET /main/index.php HTTP/1.1
Host: example.com
Cookie: username=John. secret-word=abcde.
```

1.   ポイントはリクエスト要素の*値*を参照する必要があるため、ポイントにサービスワード`value`を含める必要があります。

    現在のポイントの状態: `value`。

2.   ポイントは*`secret-word`*クッキーの値を参照する必要があります。目的のクッキー値を参照するため、ポイントの左側にクッキー名`secret-word`を追加します。
    
    現在のポイントの状態: `secret-word_value`。

3.   ポイントは*Cookie*の値を参照する必要があります。Cookie値を参照するため、ポイントの左側に`COOKIE`パーサー名を追加します。
    
    現在のポイントの状態: `COOKIE_secret-word_value`。

4.   ポイントは*Cookieヘッダー*で渡される値を参照する必要があります。Cookieという名前のヘッダーを参照するため、ポイントの左側に`Cookie`ヘッダー名を追加します。 
    
    現在のポイントの状態: `Cookie_COOKIE_secret-word_value`。

5.   ポイントは*ヘッダー*で渡される値を参照する必要があります。ヘッダー値を参照するため、ポイントの左側に`HEADER`フィルター名を追加します。
    
    現在のポイントの状態: `HEADER_Cookie_COOKIE_secret-word_value`。



この例の条件を満たすため、手順4で得たポイントは、拡張に次のいずれかの方法で追加できます:
* いずれのサービス記号でも囲まない。
* アポストロフィで囲む（`'HEADER_Cookie_COOKIE_secret-word_value'`）。
* 二重引用符で囲む（`"HEADER_Cookie_COOKIE_secret-word_value"`）。