[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-json_obj-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-json_obj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-json_array-filter-and-the-hash-filter

[anchor1]:          #json_obj-filter
[anchor2]:          #json_array-filter


# Json_docパーサ

Json_docパーサは、リクエストの任意の部分に存在しうるJSON形式のデータを扱うために使用します。Json_docパーサは、トップレベルのJSONデータコンテナの内容をそのままの形式で参照します。

Json_docパーサは入力データに基づいて複雑なデータ構造を構築します。このデータ構造の要素を参照するには、次のフィルタを使用できます:
* [Json_objフィルタ][anchor1]
* [Json_arrayフィルタ][anchor2]

ポイントでフィルタを使用するには、Json_docパーサおよびそれが提供するフィルタの名称を大文字でポイントに追加します。

例: 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストで

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

の本文が送信された場合、リクエスト本文に適用されたJson_docパーサは次のデータを参照します。

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```


## Json_objフィルタ

Json_objフィルタはJSONオブジェクトのハッシュテーブルを参照します。このハッシュテーブルの要素はJSONオブジェクトの名前を用いて参照する必要があります。

!!! info "ポイントにおける正規表現"
    ポイント内のJSONオブジェクト名には[Rubyプログラミング言語の正規表現][link-ruby]を使用できます。  

JSONデータに適用される[Hashフィルタ][link-hash]はJson_objフィルタと同様に動作します。

JSON形式のハッシュテーブル中の値は、配列やハッシュテーブルといった次のような複雑なデータ構造を含む場合があります。これらの構造内の要素を参照するには、次のフィルタを使用します。
* 配列には[Arrayフィルタ][link-jsonobj-array]または[Json_arrayフィルタ][anchor2]
* ハッシュテーブルには[Hashフィルタ][link-jsonobj-hash]または[Json_objフィルタ][anchor1]

例: 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストで

```
{
    "username": "user",
    "rights": "read"
}
```

の本文が送信された場合、Json_docパーサと併用してリクエスト本文に適用されたJson_objフィルタは次の表を参照します。

| キー      | 値      |
|----------|----------|
| username | user     |
| rights   | read     |

* `POST_JSON_DOC_JSON_OBJ_username_value`ポイントは`user`という値を参照します。
* `POST_JSON_DOC_JSON_OBJ_rights_value`ポイントは`read`という値を参照します。

## Json_arrayフィルタ

Json_arrayフィルタはJSONオブジェクトの値の配列を参照します。この配列の要素はインデックスで参照する必要があります。配列のインデックスは`0`から始まります。

!!! info "ポイントにおける正規表現"
    ポイント内のインデックスには[Rubyプログラミング言語の正規表現][link-ruby]を使用できます。 

JSONデータに適用される[Arrayフィルタ][link-array]はJson_arrayフィルタと同様に動作します。

JSON形式の配列中の値はハッシュテーブルを含む場合もあります。[Hashフィルタ][link-jsonarray-hash]または[Json_objフィルタ][anchor1]を使用します。

例: 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストで

```
{
    "username": "user",
    "rights":["read","write"]
}
```

の本文が送信された場合、Json_docパーサおよびJson_objフィルタと併用して`rights`というJSONオブジェクトに適用されたJson_arrayフィルタは次の配列を参照します。

| インデックス  | 値      |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value`ポイントは、Json_arrayフィルタが参照する`rights`というJSONオブジェクトの値の配列のインデックス`0`に対応する`read`という値を参照します。
* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value`ポイントは、Json_arrayフィルタが参照する`rights`というJSONオブジェクトの値の配列のインデックス`1`に対応する`write`という値を参照します。