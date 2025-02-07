```markdown
[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-json_obj-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-json_obj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-json_array-filter-and-the-hash-filter

[anchor1]:          #json_obj-filter
[anchor2]:          #json_array-filter

# Json_docパーサ

**Json_doc**パーサは、リクエストの任意の場所に存在するJSON形式のデータを操作するために使用します。Json_docパーサは、トップレベルのJSONデータコンテナの内容を生の形式で参照します。

Json_docパーサは、入力データに基づいて複雑なデータ構造を構築します。このデータ構造の要素にアクセスするには、次のフィルターを使用できます:
* [Json_objフィルター][anchor1];
* [Json_arrayフィルター][anchor2].

フィルターをポイントで使用する際には、Json_docパーサおよび提供されるフィルターの名前を大文字で追加してください。

**例:**

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストと

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

本文の場合、リクエスト本文に適用されたJson_docパーサは、次のデータを参照します:

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

## Json_objフィルター

**Json_obj**フィルターは、JSONオブジェクトのハッシュテーブルを参照します。このハッシュテーブルの要素は、JSONオブジェクトの名前を使用して参照します。

!!! info "ポイント内の正規表現"
    ポイント内のJSONオブジェクトの名前には、[Rubyプログラミング言語の正規表現][link-ruby]を使用できます.

JSONデータに適用される[Hash][link-hash]フィルターも、Json_objと同様に動作します.

JSON形式のハッシュテーブルの値には、以下の複雑なデータ構造も含まれる場合があります: 配列およびハッシュテーブル. これらの構造内の要素にアクセスするには、次のフィルターを使用します:
* 配列には[Array][link-jsonobj-array]フィルターまたは[Json_array][anchor2]フィルターを使用します
* ハッシュテーブルには[Hash][link-jsonobj-hash]フィルターまたは[Json_obj][anchor1]フィルターを使用します

**例:**

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストと

```
{
    "username": "user",
    "rights": "read"
}
```

本文の場合、リクエスト本文に適用されたJson_docパーサとJson_objフィルターは、次の表を参照します:

| Key      | Value    |
|----------|----------|
| username | user     |
| rights   | read     |

* ポイント`POST_JSON_DOC_JSON_OBJ_username_value`は、`user`値を参照します。
* ポイント`POST_JSON_DOC_JSON_OBJ_rights_value`は、`read`値を参照します。

## Json_arrayフィルター

**Json_array**フィルターは、JSONオブジェクト値の配列を参照します。この配列の要素にはインデックスを使用してアクセスし、インデックスは`0`から始まります.

!!! info "ポイント内の正規表現"
    ポイント内のインデックスには、[Rubyプログラミング言語の正規表現][link-ruby]を使用できます.

JSONデータに適用される[Array][link-array]フィルターも、Json_arrayフィルターと同様に動作します.

JSON形式の配列の値にはハッシュテーブルが含まれる場合もあります。[Hash][link-jsonarray-hash]または[Json_obj][anchor1]を使用します.

**例:**

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストと

```
{
    "username": "user",
    "rights":["read","write"]
}
```

本文の場合、`rights`JSONオブジェクトに適用されたJson_arrayフィルターとJson_docパーサおよびJson_objフィルターは、次の配列を参照します:

| Index  | Value    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* ポイント`POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value`は、Json_arrayフィルターにより`rights`JSONオブジェクトの値の配列の`0`インデックスに対応する`read`値を参照します。
* ポイント`POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value`は、Json_arrayフィルターにより`rights`JSONオブジェクトの値の配列の`1`インデックスに対応する`write`値を参照します.
```