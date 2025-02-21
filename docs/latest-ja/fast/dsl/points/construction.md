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
ポイントで使用できるFAST DSLパーサーとフィルターの一覧を振り返ります。
* [HTTPパーサー][link-http]:
    * [URIフィルター][link-uri];
    * [Pathフィルター][link-path];
    * [Action_nameフィルター][link-actionname];
    * [Action_extフィルター][link-actionext];
    * [Getフィルター][link-get];
    * [Headerフィルター][link-header];
    * [Postフィルター][link-post];
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

ポイントに含めるべきパーサーとフィルターがどれかを理解しやすくするために、ポイントは右から左に組み立てることを推奨します。リクエストの部分が小さいものから大きいものへと移動させながらポイントを構築してください。

!!! info "ポイント部分の区切り記号"
    ポイントの各部分は`_`記号を使用して区切る必要があります。

## 例1

次のリクエストにおける`uid`パラメータのデコードされた値を参照するポイントを構築する必要があると仮定します:

```
GET http://example.com/main/login/?uid=MDEyMzQ=
```

ここで`MDEyMzQ=`はBase64エンコードされた`01234`という文字列です。

1. ポイントがリクエスト要素の*値*を参照する必要があるため、ポイントに`value`サービスワードを含める必要があります。  
   現在のポイントの状態: `value`.

2. ポイントはデコードされた値を参照する必要がありますが、リクエストでは目的の値が*Base64*エンコーディングでエンコードされています。値をデコードするために、ポイントの左側に`BASE64`パーサー名を追加する必要があります。  
   現在のポイントの状態: `BASE64_value`.

3. ポイントは*`uid`*パラメータの値を参照する必要があります。目的のパラメータの値を参照するために、ポイントの左側に`uid`パラメータ名を追加してください。  
   現在のポイントの状態: `uid_BASE64_value`.

4. ポイントはベースラインリクエストの*クエリ文字列*で渡されたパラメータの値を参照する必要があります。クエリ文字列のパラメータ値を参照するために、ポイントの左側に`GET`フィルター名を追加してください。  
   現在のポイントの状態: `GET_uid_BASE64_value`.

この例の条件を満たすために、4番目のステップで得られたポイントは、次のいずれかの方法でエクステンションに追加できます:
* いずれのサービス記号にも囲まれていない。
* アポストロフィで囲まれている（`'GET_uid_BASE64_value'`）。
* 二重引用符で囲まれている（`"GET_uid_BASE64_value"`）。

## 例2

次のリクエストにおける`passwd`パラメータの`01234`の値を参照するポイントを構築する必要があると仮定します:

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストボディ:

```
username=admin&passwd=01234.
```

1. ポイントがリクエスト要素の*値*を参照する必要があるため、ポイントに`value`サービスワードを含める必要があります。  
   現在のポイントの状態: `value`.

2. ポイントは*`passwd`*パラメータの値を参照する必要があります。目的のパラメータの値を参照するために、ポイントの左側に`passwd`パラメータ名を追加してください。  
   現在のポイントの状態: `passwd_value`.

3. ポイントは*form-urlencoded形式*で渡されたパラメータの値を参照する必要があります。これはベースラインリクエストのContent-Typeヘッダーの値から判別できます。form-urlencodedで渡されたパラメータの値を参照するために、ポイントの左側に大文字のForm_urlencodedパーサー名を追加してください。  
   現在のポイントの状態: `FORM_URLENCODED_passwd_value`.

4. ポイントは*リクエストボディ*で渡されたパラメータの値を参照する必要があります。リクエストボディのパラメータ値を参照するために、ポイントの左側に`POST`パーサー名を追加してください。  
   現在のポイントの状態: `POST_FORM_URLENCODED_passwd_value`.

この例の条件を満たすために、4番目のステップで得られたポイントは、次のいずれかの方法でエクステンションに追加できます:
* いずれのサービス記号にも囲まれていない。
* アポストロフィで囲まれている（`'POST_FORM_URLENCODED_passwd_value'`）。
* 二重引用符で囲まれている（`"POST_FORM_URLENCODED_passwd_value"`）。

## 例3

次のリクエストにおける`secret-word`クッキーの`abcde`の値を参照するポイントを構築する必要があると仮定します:

```
GET /main/index.php HTTP/1.1
Host: example.com
Cookie: username=John. secret-word=abcde.
```

1. ポイントがリクエスト要素の*値*を参照する必要があるため、ポイントに`value`サービスワードを含める必要があります。  
   現在のポイントの状態: `value`.

2. ポイントは*`secret-word`*クッキーの値を参照する必要があります。目的のクッキー値を参照するために、ポイントの左側に`secret-word`を追加してください。  
   現在のポイントの状態: `secret-word_value`.

3. ポイントは*クッキー*の値を参照する必要があります。クッキーの値を参照するために、ポイントの左側に`COOKIE`パーサー名を追加してください。  
   現在のポイントの状態: `COOKIE_secret-word_value`.

4. ポイントは*Cookieヘッダー*で渡された値を参照する必要があります。Cookieというヘッダー名を参照するために、ポイントの左側に`Cookie`ヘッダー名を追加してください。  
   現在のポイントの状態: `Cookie_COOKIE_secret-word_value`.

5. ポイントは*ヘッダー*で渡された値を参照する必要があります。ヘッダー値を参照するために、ポイントの左側に`HEADER`フィルター名を追加してください。  
   現在のポイントの状態: `HEADER_Cookie_COOKIE_secret-word_value`.

この例の条件を満たすために、4番目のステップで得られたポイントは、次のいずれかの方法でエクステンションに追加できます:
* いずれのサービス記号にも囲まれていない。
* アポストロフィで囲まれている（`'HEADER_Cookie_COOKIE_secret-word_value'`）。
* 二重引用符で囲まれている（`"HEADER_Cookie_COOKIE_secret-word_value"`）。