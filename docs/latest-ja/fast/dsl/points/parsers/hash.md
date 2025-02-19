[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-and-the-hash-filter
[anchor2]:      #the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter
[anchor3]:      #the-example-of-using-the-multipart-filter-and-the-hash-filter
[anchor4]:      #the-example-of-using-the-json_doc-parser-and-the-hash-filter
[anchor5]:      #the-example-of-using-the-json_obj-filter-and-the-hash-filter
[anchor6]:      #the-example-of-using-the-json_array-filter-and-the-hash-filter

# ハッシュフィルター

**Hash**フィルターは、ハッシュテーブルを含む可能性がある基本リクエスト要素内の値のハッシュテーブルを参照します。

ハッシュフィルターは、以下のフィルターおよびパーサーと併せてpointで使用できます:
* [Get][anchor1];
* [Form_urlencoded][anchor2];
* [Multipart][anchor3];
* [Json_doc][anchor4];
* [Json_obj][anchor5];
* [Json_array][anchor6].

ハッシュフィルターで指定されるハッシュテーブルの要素を参照するために、キーを使用します.

!!! info "ポイントにおける正規表現"
    point内のキーは、[Rubyプログラミング言語の正規表現][link-ruby]で指定することができます.

## Getフィルターとハッシュフィルターの使用例

以下の

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

リクエストに対し、`id`クエリ文字列パラメーターに適用されたハッシュフィルターは、以下のハッシュテーブルを参照します:

| キー  | 値     |
|-------|--------|
| user  | 01234  |
| group | 56789  |

* `GET_id_HASH_user_value` pointは、`id`クエリ文字列パラメーターの値のハッシュテーブル内の`user`キーに対応する`01234`の値を参照します.
* `GET_id_HASH_group_value` pointは、`id`クエリ文字列パラメーターの値のハッシュテーブル内の`group`キーに対応する`56789`の値を参照します.

## Form_urlencodedパーサーとハッシュフィルターの使用例

以下の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストに、以下の

```
id[user]=01234&id[group]=56789
```

本文が含まれる場合、form-urlencoded形式の`id`パラメーターに適用されたハッシュフィルターは、以下のハッシュテーブルを参照します:

| キー  | 値     |
|-------|--------|
| user  | 01234  |
| group | 56789  |

* `POST_FORM_URLENCODED_id_HASH_user_value` pointは、リクエスト本文パラメーターのハッシュテーブル内の`user`キーに対応する`01234`の値を参照します.
* `POST_FORM_URLENCODED_id_HASH_group_value` pointは、リクエスト本文パラメーターのハッシュテーブル内の`group`キーに対応する`56789`の値を参照します.

## Multipartフィルターとハッシュフィルターの使用例

以下の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 
```

リクエストに対し、Multipartパーサーと併せてリクエスト本文の`id`パラメーターに適用されたハッシュフィルターは、以下のハッシュテーブルを参照します:

| キー  | 値     |
|-------|--------|
| user  | 01234  |
| group | 56789  |

* `POST_MULTIPART_id_HASH_user_value` pointは、リクエスト本文パラメーターのハッシュテーブル内の`user`キーに対応する`01234`の値を参照します.
* `POST_MULTIPART_id_HASH_group_value` pointは、リクエスト本文パラメーターのハッシュテーブル内の`group`キーに対応する`56789`の値を参照します.

## Json_docパーサーとハッシュフィルターの使用例

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストに、以下の

```
{
    "username": "user",
    "rights": "read"
}
```

本文が含まれる場合、JSON形式のリクエスト本文にJson_docパーサーと併せて適用されたハッシュフィルターは、以下のハッシュテーブルを参照します:

| キー      | 値   |
|-----------|------|
| username  | user |
| rights    | read |

* `POST_JSON_DOC_HASH_username_value` pointは、リクエスト本文パラメーターのハッシュテーブル内の`username`キーに対応する`user`の値を参照します.
* `POST_JSON_DOC_HASH_rights_value` pointは、リクエスト本文パラメーターのハッシュテーブル内の`rights`キーに対応する`read`の値を参照します.

## Json_objフィルターとハッシュフィルターの使用例

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストに、以下の

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

本文が含まれる場合、JSON形式のリクエスト本文にJson_docパーサーおよびJson_objフィルターと併せて適用されたハッシュフィルターは、以下のハッシュテーブルを参照します:

| キー    | 値     |
|---------|--------|
| status  | active |
| rights  | read   |

* `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` pointは、info JSONオブジェクトの子オブジェクトのハッシュテーブル内の`status`キーに対応する`active`の値を参照します.
* `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` pointは、info JSONオブジェクトの子オブジェクトのハッシュテーブル内の`rights`キーに対応する`read`の値を参照します.

## Json_arrayフィルターとハッシュフィルターの使用例

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストに、以下の

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

本文が含まれる場合、JSON形式のリクエスト本文にJson_docパーサーおよびJson_obj,Json_arrayフィルターと併せて適用されたハッシュフィルターは、`posts` JSONオブジェクト配列の最初の要素に対して、以下のハッシュテーブルを参照します:

| キー   | 値       |
|--------|----------|
| title  | Greeting |
| length | 256      |

* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` pointは、JSONオブジェクトのハッシュテーブル内の`title`キーに対応する`Greeting`の値を参照します.
* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` pointは、JSONオブジェクトのハッシュテーブル内の`length`キーに対応する`256`の値を参照します.