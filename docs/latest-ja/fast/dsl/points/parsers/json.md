[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-jsondoc-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-json_obj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-jsonarray-filter-and-the-hash-filter

[anchor1]:          #jsonobj-filter
[anchor2]:          #jsonarray-filter

# Json_docパーサー

**Json_doc**パーサーは、リクエストの任意の部分に配置できるJSON形式のデータを操作するために使用されます。Json_docパーサーは、その生形式で最上位のJSONデータコンテナの内容を参照します。

Json_docパーサーは入力データを基に複雑なデータ構造を構築します。次のフィルターを使用して、このデータ構造の要素にアクセスすることができます：
* [Json_objフィルター][anchor1];
* [Json_arrayフィルター][anchor2]。

フィルターを使用する場所に、Json_docパーサーとその提供するフィルターの名前を大文字で追加してください。

**例：** 
```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

でのリクエストに対して、

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

といった内容がある場合、Json_docパーサーはリクエストボディに対して次のデータを参照します：

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

**Json_obj**フィルターはJSONオブジェクトのハッシュテーブルを参照します。このハッシュテーブルの要素は、JSONオブジェクトの名前を使用して参照する必要があります。

!!! info "ポイント内の正規表現"
    ポイント内のJSONオブジェクトの名前は、[Rubyプログラミング言語の正規表現][link-ruby]になることができます。

[ハッシュ][link-hash]フィルターをJSONデータに適用すると、Json_objと同様に動作します。

JSON形式のハッシュテーブルの値は、配列やハッシュテーブルといった複雑なデータ構造も含むことができます。これらの構造の要素にアクセスするために次のフィルターを使用します：
* 配列のための[配列][link-jsonobj-array]フィルターまたは[Json_array][anchor2]フィルター
* ハッシュテーブルのための[ハッシュ][link-jsonobj-hash]フィルターまたは[Json_obj][anchor1]フィルター

**例：** 
```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

でのリクエストに対して、

```
{
    "username": "user",
    "rights": "read"
}
```

といった内容がある場合、Json_docパーサーと一緒にリクエストボディに適用されたJson_objフィルターは次のテーブルを参照します：

| キー      | 値    |
|----------|----------|
| username | user     |
| rights   | read     |

* `POST_JSON_DOC_JSON_OBJ_username_value` のポイントは `user` の値を参照します。
* `POST_JSON_DOC_JSON_OBJ_rights_value` のポイントは `read` の値を参照します。

## Json_arrayフィルター

**Json_array**フィルターはJSONオブジェクト値の配列を参照します。この配列の要素は、インデックスを使用して参照する必要があります。配列のインデックスは `0`から始まります。

!!! info "ポイント内の正規表現"
    ポイント内のインデックスは、[Rubyプログラミング言語の正規表現][link-ruby]になることができます。

[配列][link-array]フィルターをJSONデータに適用すると、Json_arrayフィルターと同様に動作します。

JSON形式の配列の値はハッシュテーブルも含むことができます。それを利用するためには [ハッシュ][link-jsonarray-hash] または [Json_obj][anchor1] を使用します。

**例：** 

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

でのリクエストに対して、

```
{
    "username": "user",
    "rights":["read","write"]
}
```

といった内容がある場合、Json_docパーサーとJson_objフィルターと一緒に`rights` JSONオブジェクトに適用されたJson_arrayフィルターは次の配列を参照します：

| インデックス  | 値    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value` のポイントは `read` の値を参照します。これは、Json_arrayフィルターでアドレス指定された `rights` JSONオブジェクト値の配列からの `0` インデックスに対応します。
* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value` のポイントは `write` の値を参照します。これは、Json_arrayフィルターでアドレス指定された `rights` JSONオブジェクト値の配列からの `1` インデックスに対応します。