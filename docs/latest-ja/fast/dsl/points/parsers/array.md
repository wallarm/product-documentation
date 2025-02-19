[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xml_tag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-json_obj-filter-and-the-array-filter

# 配列フィルター

**Array**フィルターとは、配列を含む可能性のある任意の基本リクエスト要素内の値の配列を指します。

配列フィルターは、次のフィルターおよびパーサーと共にポイント内で使用できます:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

この配列の要素は、インデックスを使用して参照する必要があります。配列のインデックスは`0`から始まります.

!!! info "ポイント内の正規表現"
    ポイント内のインデックスには、[Rubyプログラミング言語の正規表現][link-ruby]を使用できます.

## Getフィルターと配列フィルターを使用した例

以下の

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

リクエストでは、クエリ文字列パラメータ`id`に適用された配列フィルターは、次の配列を参照します:

| インデックス | 値     |
|--------------|--------|
| 0            | 01234  |
| 1            | 56789  |

* `GET_id_ARRAY_0_value`は、配列フィルターによって参照される`id`クエリ文字列パラメータ値の配列の`0`番目のインデックスに対応する`01234`の値を指します.
* `GET_id_ARRAY_1_value`は、配列フィルターによって参照される`id`クエリ文字列パラメータ値の配列の`1`番目のインデックスに対応する`56789`の値を指します.

## Headerフィルターと配列フィルターを使用した例

以下の

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

リクエストでは、ヘッダー`X-Identifier`に適用された配列フィルターは、次の配列を参照します:

| インデックス | 値     |
|--------------|--------|
| 0            | 01234  |
| 1            | 56789  |

* `HEADER_X-Identifier_ARRAY_0_value`は、配列フィルターによって参照される`X-Identifier`ヘッダー値の配列の`0`番目のインデックスに対応する`01234`の値を指します.
* `HEADER_X-Identifier_ARRAY_1_value`は、配列フィルターによって参照される`X-Identifier`ヘッダー値の配列の`1`番目のインデックスに対応する`56789`の値を指します.

## Form_urlencodedパーサーと配列フィルターを使用した例

以下の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストにおいて、

```
id[]=01234&id[]=56789
```

というボディの場合、form-urlencoded形式のリクエストボディ内の`id`パラメータに適用された配列フィルターは、次の配列を参照します:

| インデックス | 値     |
|--------------|--------|
| 0            | 01234  |
| 1            | 56789  |

* `POST_FORM_URLENCODED_id_ARRAY_0_value`は、配列フィルターによって参照される`id`パラメータ値の配列の`0`番目のインデックスに対応する`01234`の値を指します.
* `POST_FORM_URLENCODED_id_ARRAY_1_value`は、配列フィルターによって参照される`id`パラメータ値の配列の`1`番目のインデックスに対応する`56789`の値を指します.

## Multipartパーサーと配列フィルターを使用した例

以下の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 
```

リクエストでは、multipart形式のリクエストボディ内の`id`パラメータに適用された配列フィルターは、次の配列を参照します:

| インデックス | 値     |
|--------------|--------|
| 0            | 01234  |
| 1            | 56789  |

```
--boundary 
Content-Disposition: form-data; name="id[]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[]"

56789
```

* `POST_MULTIPART_id_ARRAY_0_value`は、配列フィルターによって参照される`id`パラメータ値の配列の`0`番目のインデックスに対応する`01234`の値を指します.
* `POST_MULTIPART_id_ARRAY_1_value`は、配列フィルターによって参照される`id`パラメータ値の配列の`1`番目のインデックスに対応する`56789`の値を指します.

## Xml_tagフィルターと配列フィルターを使用した例

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストにおいて、

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

というボディの場合、XML形式のリクエストボディ内の`text`タグに適用された配列フィルターは、次の配列を参照します:

| インデックス | 値             |
|--------------|----------------|
| 0            | サンプルテキスト. |
| 1            | aaaa           |

* `POST_XML_XML_TAG_text_ARRAY_0_value`は、配列フィルターによって参照される`text`タグ値の配列の`0`番目のインデックスに対応する「サンプルテキスト.」の値を指します.
* `POST_XML_XML_TAG_text_ARRAY_1_value`は、配列フィルターによって参照される`text`タグ値の配列の`1`番目のインデックスに対応する`aaaa`の値を指します.

## Json_objフィルターと配列フィルターを使用した例

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストにおいて、

```
{
    "username": "user",
    "rights":["read","write"]
}
```

というボディの場合、Json_docパーサーおよびJson_objフィルターと共にリクエストボディ内の`rights` JSONオブジェクトに適用された配列フィルターは、次の配列を参照します:

| インデックス | 値    |
|--------------|-------|
| 0            | read  |
| 1            | write |

* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value`は、配列フィルターによって参照される`rights` JSONオブジェクト値の配列の`0`番目のインデックスに対応する`read`の値を指します.
* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value`は、配列フィルターによって参照される`rights` JSONオブジェクト値の配列の`1`番目のインデックスに対応する`write`の値を指します.