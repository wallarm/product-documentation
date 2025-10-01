[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-and-the-hash-filter
[anchor2]:      #the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter
[anchor3]:      #the-example-of-using-the-multipart-filter-and-the-hash-filter
[anchor4]:      #the-example-of-using-the-json_doc-parser-and-the-hash-filter
[anchor5]:      #the-example-of-using-the-json_obj-filter-and-the-hash-filter
[anchor6]:      #the-example-of-using-the-json_array-filter-and-the-hash-filter


# Hashフィルター

**Hash**フィルターは、ハッシュテーブルを含む可能性があるベースラインのリクエスト要素に含まれる値のハッシュテーブルを参照します。

Hashフィルターは、以下のフィルターおよびパーサーと組み合わせてポイントで使用できます:
* [Getフィルター][anchor1];
* [Form_urlencodedパーサー][anchor2];
* [Multipartフィルター][anchor3];
* [Json_docパーサー][anchor4];
* [Json_objフィルター][anchor5];
* [Json_arrayフィルター][anchor6].

Hashフィルターで対象となるハッシュテーブルの要素を参照するには、キーを使用します。

!!! info "ポイントにおける正規表現"
    ポイント内のキーには、Rubyプログラミング言語の[正規表現][link-ruby]を使用できます。  

## GetフィルターとHashフィルターを使用する例

次の

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

リクエストの場合、クエリ文字列パラメータ`id`に適用されたHashフィルターは、次のハッシュテーブルを参照します。

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* `GET_id_HASH_user_value`ポイントは、Hashフィルターで対象となる`id`クエリ文字列パラメータの値のハッシュテーブルにおける`user`キーに対応する値`01234`を参照します。
* `GET_id_HASH_group_value`ポイントは、Hashフィルターで対象となる`id`クエリ文字列パラメータの値のハッシュテーブルにおける`group`キーに対応する値`56789`を参照します。


## Form_urlencodedパーサーとHashフィルターを使用する例

次の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

というリクエストで、次の

```
id[user]=01234&id[group]=56789
```

というボディの場合、form-urlencoded形式のリクエストボディのパラメータ`id`に適用されたHashフィルターは、次の配列を参照します。

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* `POST_FORM_URLENCODED_id_HASH_user_value`ポイントは、Hashフィルターで対象となるリクエストボディのパラメータのハッシュテーブルにおける`user`キーに対応する値`01234`を参照します。
* `POST_FORM_URLENCODED_id_HASH_group_value`ポイントは、Hashフィルターで対象となるリクエストボディのパラメータのハッシュテーブルにおける`group`キーに対応する値`56789`を参照します。 

## MultipartフィルターとHashフィルターを使用する例

次の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[user]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[group]"

56789
```

リクエストでは、Multipartパーサーと共にリクエストボディの`id`パラメータに適用されたHashフィルターは、次のハッシュテーブルを参照します。

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* `POST_MULTIPART_id_HASH_user_value`ポイントは、Hashフィルターで対象となるリクエストボディのパラメータのハッシュテーブルにおける`user`キーに対応する値`01234`を参照します。
* `POST_MULTIPART_id_HASH_group_value`ポイントは、Hashフィルターで対象となるリクエストボディのパラメータのハッシュテーブルにおける`group`キーに対応する値`56789`を参照します。

## Json_docパーサーとHashフィルターを使用する例

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

というリクエストで、次の

```
{
    "username": "user",
    "rights": "read"
}
```

というボディの場合、Json_docパーサーと共にJSON形式のリクエストボディに適用されたHashフィルターは、次のハッシュテーブルを参照します。

| Key      | Value    |
|----------|----------|
| username | user     |
| rights   | read     |

* `POST_JSON_DOC_HASH_username_value`ポイントは、Hashフィルターで対象となるリクエストボディのパラメータのハッシュテーブルにおける`username`キーに対応する値`user`を参照します。
* `POST_JSON_DOC_HASH_rights_value`ポイントは、Hashフィルターで対象となるリクエストボディのパラメータのハッシュテーブルにおける`rights`キーに対応する値`read`を参照します。

## Json_objフィルターとHashフィルターを使用する例

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

というリクエストで、次の

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

というボディの場合、Json_docパーサーおよびJson_objフィルターと共にJSON形式のリクエストボディに適用されたHashフィルターは、次のハッシュテーブルを参照します。

| Key    | Value    |
|--------|----------|
| status | active   |
| rights | read     |

* `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value`ポイントは、Hashフィルターで対象となるinfo JSONオブジェクトの子オブジェクトのハッシュテーブルにおける`status`キーに対応する値`active`を参照します。
* `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value`ポイントは、Hashフィルターで対象となるinfo JSONオブジェクトの子オブジェクトのハッシュテーブルにおける`rights`キーに対応する値`read`を参照します。

## Json_arrayフィルターとHashフィルターを使用する例

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

というリクエストで、次の

```
{
    "username": "user",
    "posts": [{
            "title": "Greeting",
            "length": "256"
        },
        {
            "title": "Hello World!",
            "length": "32"
        }
    ]
}
```

というボディの場合、Json_docパーサーおよびJson_objフィルターとJson_arrayフィルターと共に、リクエストボディ中の`posts`JSONオブジェクト配列の最初の要素に適用されたHashフィルターは、次のハッシュテーブルを参照します。

| Key    | Value    |
|--------|----------|
| title  | Greeting |
| length | 256      |

* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value`ポイントは、Hashフィルターで対象となるJSONオブジェクトのハッシュテーブルにおける`title`キーに対応する値`Greeting`を参照します。
* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value`ポイントは、Hashフィルターで対象となるJSONオブジェクトのハッシュテーブルにおける`length`キーに対応する値`256`を参照します。