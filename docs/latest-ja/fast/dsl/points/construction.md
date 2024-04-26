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
[link-jsonobj]:                 parsers/json.md#jsonobj-filter
[link-jsonarray]:               parsers/json.md#jsonarray-filter
[link-array]:                   parsers/array.md
[link-hash]:                    parsers/hash.md
[link-gzip]:                    parsers/gzip.md
[link-base64]:                  parsers/base64.md

# ポイントの作り方
FAST DSLのパーサーとフィルターのリストを確認して、ポイントで使用可能なものを挙げてみましょう。
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

ポイントを組み立てる際には、どのパーサーとフィルターがポイントに含まれるべきかを理解しやすくするため、右から左に組み立てることをお勧めします。ポイントの作成時には、リクエストの小さな部分から大きな部分へと移動します。

!!! info "Point parts divider"
    ポイントの各部分は、`_`記号で分割する必要があります。

## 例1 

次のリクエストの `uid` パラメータのデコードされた値を示すポイントを作成する必要があるとします：

```
GET http://example.com/main/login/?uid=MDEyMzQ=
```

ここで、`MDEyMzQ=` は Base64でエンコードされた `01234` 文字列です。

1.   ポイントはリクエスト要素の *値* を参照す必要があるため、ポイントに `value` サービスワードを含める必要があります。

    現在のポイントの状態：`value`。

2.   ポイントはデコードされた値を参照する必要がありますが、リクエストでは該当する値が *Base64* エンコーディングでエンコードされています。値をデコードするためにポイントの左側に `BASE64` パーサーの名前を追加します。
       
    現在のポイントの状態：`BASE64_value`。

3.   ポイントは、*`uid`* パラメータの値を参照する必要があります。該当するパラメータの値を参照するために、ポイントの左側に `uid` パラメータ名を追加します。 
    
    現在のポイントの状態：`uid_BASE64_value`。

4.   ポイントは、基本リクエストの *クエリ文字列* で渡されるパラメータの値を参照する必要があります。クエリストリングのパラメータ値を参照するために、ポイントの左側に `GET` フィルター名を追加します。 
    
    現在のポイントの状態：`GET_uid_BASE64_value`。



例の条件を満たすために、4手順目で得られたポイントは、以下の方法のいずれかで拡張子に追加することができます：
* サービス記号で囲まれていない状態。
* アポストロフィで囲んだ状態(`'GET_uid_BASE64_value'`)。
* クオーテーションマークで囲んだ状態(`"GET_uid_BASE64_value"`)。



## 例2

次のリクエストの `passwd` パラメータの `01234` 値を示すポイントを作成する必要があるとします：

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストには、次のボディが含まれています：

```
username=admin&passwd=01234.
```

1.   ポイントはリクエストの要素の *値* を参照する必要があるため、ポイントに `value` サービスワードを含める必要があります。
    
    現在のポイントの状態：`value`。

2.   ポイントは、*`passwd`* パラメータの値を参照する必要があります。該当するパラメータ値を参照するために、ポイントの左側に `passwd` パラメータ名を追加します。 
    
    現在のポイントの状態：`passwd_value`.

3.   ポイントは、*form-urlencoded形式*で渡されるパラメータの値を参照する必要があります。これは、基本リクエストのContent-Typeヘッダの値から導出されます。form-urlencodedの値で渡されるパラメータの値を参照するために、Form_urlencodedパーサーの名前を大文字でポイントの左側に追加します。 
    
    現在のポイントの状態：`FORM_URLENCODED_passwd_value`.

4.   ポイントは、*リクエストボディ*で渡されるパラメータの値を参照する必要があります。リクエストボディのパラメータ値を参照するために、ポイントの左側に `POST` パーサーの名前を追加します。
    
    現在のポイントの状態：`POST_FORM_URLENCODED_passwd_value`。



例の条件を満たすために、4手順目で得られたポイントは、以下の方法のいずれかで拡張子に追加することができます：
* サービス記号で囲まれていない状態。
* アポストロフィで囲んだ状態(`'POST_FORM_URLENCODED_passwd_value'`)。
* クオーテーションマークで囲んだ状態(`"POST_FORM_URLENCODED_passwd_value"`)。



## 例3

次のリクエストの `secret-word` クッキーの `abcde` 値を示すポイントを作成する必要があるとします：

```
GET /main/index.php HTTP/1.1
Host: example.com
Cookie: username=John. secret-word=abcde.
```

1.    ポイントはリクエストの要素の *値* を示す必要があるため、ポイントに `value` サービスワードを含める必要があります。

    現在のポイントの状態：`value`。

2.    ポイントは *`secret-word`* クッキーの値を参照する必要があります。該当するクッキーの値を参照するために、ポイントの左側に `secret-word` クッキーの名前を追加します。
    
    現在のポイントの状態：`secret-word_value`.

3.    ポイントは *クッキー* の値を参照する必要があります。クッキーの値を参照するために、ポイントの左側に `COOKIE` パーサーの名前を追加します。
    
    現在のポイントの状態：`COOKIE_secret-word_value`.

4.    ポイントは *Cookie header* で渡される値を参照する必要があります。Cookieという名前のヘッダーを参照するために、ポイントの左側に `Cookie` ヘッダーの名前を追加します。 
    
    現在のポイントの状態：`Cookie_COOKIE_secret-word_value`.

5.    The point must refer to the value that is passed in the *header*. Add the name of the `HEADER` filter to the left side of the point to refer to the header value.
    
    現在のポイントの状態：`HEADER_Cookie_COOKIE_secret-word_value`.



例の条件を満たすために、4手順目で得られたポイントは、以下の方法のいずれかで拡張子に追加することができます：
* サービス記号で囲まれていない状態。
* アポストロフィで囲んだ状態(`'HEADER_Cookie_COOKIE_secret-word_value'`)。
* クオーテーションマークで囲んだ状態(`"HEADER_Cookie_COOKIE_secret-word_value"`).