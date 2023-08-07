[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #getフィルタおよびhashフィルタの使用例
[anchor2]:      #form_urlencodedパーサとhashフィルタの使用例
[anchor3]:      #multipartフィルタおよびhashフィルタの使用例
[anchor4]:      #json_docパーサとhashフィルタの使用例
[anchor5]:      #json_objフィルタとhashフィルタの使用例
[anchor6]:      #json_arrayフィルタとhashフィルタの使用例

# Hashフィルタ

**Hash** フィルタは、hashテーブルを含む可能性があるベースライン要求の要素のいずれかの値のhashテーブルを指さします。

Hashフィルタは、以下のフィルタおよびパーサと一緒にポイントで使用できます：
* [Get][anchor1];
* [Form_urlencoded][anchor2];
* [Multipart][anchor3];
* [Json_doc][anchor4];
* [Json_obj][anchor5];
* [Json_array][anchor6].

Hashフィルタでアドレス指定されたhashテーブルの要素を参照するためのキーを使用します。

!!! info "ポイントの正規表現"
    ポイントのキーは[Rubyプログラミング言語の正規表現][link-ruby]です。

## GetフィルタおよびHashフィルタの使用例

次のような

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

リクエストにおいて、`id`クエリ文字列パラメーターに適用されたHashフィルタは次のhashテーブルを指します：

| キー | 値 |
|------|-------|
| user  | 01234    |
| group | 56789    |

* `GET_id_HASH_user_value` ポイントは、Hashフィルタによってアドレス指定された`id`クエリ文字列パラメータ値のhashテーブルからの`user`キーに対応する`01234`値を指します。
* `GET_id_HASH_group_value` ポイントは、Hashフィルタによってアドレス指定された`id`クエリ文字列パラメータ値のhashテーブルからの`group`キーに対応する`56789`値を指します。

## Form_urlencodedパーサとHashフィルタの使用例

次のような

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストで、次のような

```
id[user]=01234&id[group]=56789
```

ボディがある場合、form-urlエンコード形式のリクエストボディから`id`パラメータに適用されたHashフィルタは次の配列を指します：

| キー    | 値    |
|--------|--------|
| user  | 01234  |
| group | 56789  |

* `POST_FORM_URLENCODED_id_HASH_user_value` ポイントは、Hashフィルタによってアドレス指定されたリクエスト本文パラメータhashテーブルからの`user`キーに対応する`01234`値を指します。
* `POST_FORM_URLENCODED_id_HASH_group_value` ポイントは、Hashフィルタによってアドレス指定されたリクエスト本文パラメータhashテーブルからの`group`キーに対応する`56789`値を指します。

## MultipartフィルタおよびHashフィルタの使用例

次のような

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

リクエストにおいて、Multipartパーサと一緒にリクエストボディの`id`パラメータに適用されたHashフィルタは次のhashテーブルを指します：

| キー   | 値    |
|-------|--------|
| user  | 01234  |
| group | 56789  |

* `POST_MULTIPART_id_HASH_user_value` ポイントは、Hashフィルタによってアドレス指定されたリクエスト本文パラメータhashテーブルからの`user`キーに対応する`01234`値を指します。
* `POST_MULTIPART_id_HASH_group_value` ポイントは、Hashフィルタによってアドレス指定されたリクエスト本文パラメータhashテーブルからの`group`キーに対応する`56789`値を指します。

## Json_docパーサとHashフィルタの使用例

次のような

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストで、次のような

```
{
    "username": "user",
    "rights": "read"
}
```

ボディがある場合、Json_docパーサと一緒にJSON形式のリクエストボディに適用されたHashフィルタは次のhashテーブルを指します：

| キー       | 値   |
|---------|-------|
| username | user  |
| rights   | read  |

* `POST_JSON_DOC_HASH_username_value` ポイントは、Hashフィルタによってアドレス指定されたリクエストボディパラメータhashテーブルからの`username`キーに対応する`user`値を指します。
* `POST_JSON_DOC_HASH_rights_value` ポイントは、Hashフィルタによってアドレス指定されたリクエストボディパラメータhashテーブルからの`rights`キーに対応する`read`値を指します。

## Json_objフィルタとHashフィルタの使用例

次のような

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストで、次のような

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

ボディがある場合、Json_docパーサとJson_objフィルタと一緒にJSON形式のリクエストボディに適用されたHashフィルタは次のhashテーブルを指します：

| キー | 値 |
|-----|-------|
| status | active |
| rights | read   |

* `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` ポイントは、Hashフィルタによってアドレス指定されたinfo JSONオブジェクトの子オブジェクトのhashテーブルからの`status`キーに対応する`active`値を指します。
* `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` ポイントは、Hashフィルタによってアドレス指定されたinfo JSONオブジェクトの子オブジェクトのhashテーブルからの`rights`キーに対応する`read`値を指します。

## Json_arrayフィルタとHashフィルタの使用例

次のような

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストで、次のような

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

ボディがある場合、Json_docパーサ，Json_objフィルタとJson_arrayフィルタと一緒にリクエストボディの`posts`JSONオブジェクト配列の最初の要素に適用されたHashフィルタは次のhashテーブルを指します：

| キー | 値 |
|-----|-------|
| title  | Greeting |
| length | 256      |

* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` ポイントは、Hashフィルタによってアドレス指定されたJSONオブジェクトhashテーブルからの`title`キーに対応する`Greeting`値を指します。
* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` ポイントは、Hashフィルタによってアドレス指定されたJSONオブジェクトhashテーブルからの`length`キーに対応する`256`値を指します。