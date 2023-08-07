[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #getフィルタと配列フィルタの使用例
[anchor2]:      #ヘッダーフィルタと配列フィルタの使用例
[anchor3]:      #form_urlencodedパーサと配列フィルタの使用例
[anchor4]:      #multipartパーサと配列フィルタの使用例
[anchor5]:      #xml_tagフィルタと配列フィルタの使用例
[anchor6]:      #json_objフィルタと配列フィルタの使用例

# 配列フィルタ

**配列**フィルタは、配列を含む可能性のある基準リクエスト要素の値の配列を指します。

配列フィルタは次のフィルタとパーサと一緒にポイントで使用することができます：
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

配列の要素はインデックスを使用して参照する必要があります。配列のインデックスは`0`から始まります。

!!! info "ポイントの正規表現"
    ポイントのインデックスは[Rubyプログラミング言語の正規表現][link-ruby]であることができます。 

## Getフィルタと配列フィルタの使用例

以下のレコードに対して

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

`id`クエリストリングパラメータに適用された配列フィルタは次の配列を参照します：

| インデックス  | 値    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `GET_id_ARRAY_0_value`は`0`インデックスと一致する`01234`の値を参照します。この値は配列フィルタによってアドレス指定された`id`クエリストリングパラメータ値の配列から取得されます。
* `GET_id_ARRAY_1_value`は`1`インデックスと一致する`56789`の値を参照します。この値も配列フィルタによってアドレス指定された`id`クエリストリングパラメータ値の配列から取得されます。

## ヘッダーフィルタと配列フィルタの使用例

以下のレコードに対して

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

`X-Identifier`ヘッダに適用された配列フィルタは次の配列を参照します：

| インデックス  | 値    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `HEADER_X-Identifier_ARRAY_0_value`は`0`インデックスと一致する`01234`の値を参照します。 この値は配列フィルタによってアドレス指定された`X-Identifier`ヘッダ値の配列から取得されます。
* `HEADER_X-Identifier_ARRAY_1_value`は`1`インデックスと一致する`56789`の値を参照します。 この値も配列フィルタによってアドレス指定された`X-Identifier`ヘッダ値の配列から取得されます。

## Form_urlencodedパーサと配列フィルタの使用例

以下のレコードに対して

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

```
id[]=01234&id[]=56789
```

というボディがあります。 これにより、form-urlencoded形式のリクエストボディからの`id`パラメータに適用された配列フィルタは次の配列を参照します：

| インデックス  | 値    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_FORM_URLENCODED_id_ARRAY_0_value`は`0`インデックスと一致する`01234`の値を参照します。この値は配列フィルタによってアドレス指定された`id`パラメータ値の配列から取得されます。
* `POST_FORM_URLENCODED_id_ARRAY_1_value`は`1`インデックスと一致する`56789`の値を参照します。この値も配列フィルタによってアドレス指定された`id`パラメータ値の配列から取得されます。

## Multipartパーサと配列フィルタの使用例

以下のレコードに対して

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[]"

56789
```

multipart形式のリクエストボディからの`id`パラメータに適用された配列フィルタは次の配列を参照します：

| インデックス  | 値    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_MULTIPART_id_ARRAY_0_value`は`0`インデックスと一致する`01234`の値を参照します。この値は配列フィルタによってアドレス指定された`id`パラメータ値の配列から取得されます。
* `POST_MULTIPART_id_ARRAY_1_value`は`1`インデックスと一致する`56789`の値を参照します。この値も配列フィルタによってアドレス指定された`id`パラメータ値の配列から取得されます。

## Xml_tagフィルタと配列フィルタの使用例

以下のレコードに対して

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
Sample text.
</text>
<text>
    &eee;
</text>
```

XML形式のリクエストボディからの`text`タグに適用された配列フィルタは次の配列を参照します：

| インデックス  | 値           |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_ARRAY_0_value`ポイントは`0`インデックスと一致する`Sample text.`の値を参照します。この値は配列フィルタによってアドレス指定された`text`タグ値の配列から取得されます。
* `POST_XML_XML_TAG_text_ARRAY_1_value`ポイントは`1`インデックスと一致する`aaaa`の値を参照します。この値も配列フィルタによってアドレス指定された`text`タグ値の配列から取得されます。

## Json_objフィルタと配列フィルタの使用例

以下のレコードに対して

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

```
{
    "username": "user",
    "rights":["read","write"]
}
```

というボディがあります。 これにより、Json_docパーサとJson_objフィルタと一緒にリクエストボディからの`rights`JSONオブジェクトに適用された配列フィルタは次の配列を参照します：

| インデックス | 値     |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value`ポイントは`0`インデックスと一致する`read`の値を参照します。この値は配列フィルタによってアドレス指定された`rights`JSONオブジェクト値の配列から取得されます。
* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value`ポイントは`1`インデックスと一致する`write`の値を参照します。この値も配列フィルタによってアドレス指定された`rights`JSONオブジェクト値の配列から取得されます。