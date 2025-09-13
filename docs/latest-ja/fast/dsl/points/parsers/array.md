[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xml_tag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-json_obj-filter-and-the-array-filter


# Arrayフィルター

**Array**フィルターは、配列を含む可能性があるベースラインリクエスト要素内の値配列を参照します。

Arrayフィルターは、ポイント内で次のフィルターやパーサーと併用できます:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

この配列の要素はインデックスで参照する必要があります。配列のインデックスは`0`から始まります。

!!! info "ポイントにおける正規表現"
    ポイント内のインデックスには[Rubyプログラミング言語の正規表現][link-ruby]を使用できます。  

## GetフィルターとArrayフィルターを併用する例 {#the-example-of-using-the-get-filter-with-the-array-filter}

次の

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

リクエストに対して、クエリ文字列パラメータ`id`に適用されたArrayフィルターは、以下の配列を参照します:

| Index  | Value    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `GET_id_ARRAY_0_value`は、Arrayフィルターで対象となるクエリ文字列パラメータ`id`の値配列におけるインデックス`0`に対応する値`01234`を指します。
* `GET_id_ARRAY_1_value`は、Arrayフィルターで対象となるクエリ文字列パラメータ`id`の値配列におけるインデックス`1`に対応する値`56789`を指します。

## HeaderフィルターとArrayフィルターを併用する例 {#the-example-of-using-the-header-filter-with-the-array-filter}

次の

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

リクエストに対して、ヘッダー`X-Identifier`に適用されたArrayフィルターは、以下の配列を参照します:

| Index  | Value    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `HEADER_X-Identifier_ARRAY_0_value`は、Arrayフィルターで対象となるヘッダー`X-Identifier`の値配列におけるインデックス`0`に対応する値`01234`を指します。
* `HEADER_X-Identifier_ARRAY_1_value`は、Arrayフィルターで対象となるヘッダー`X-Identifier`の値配列におけるインデックス`1`に対応する値`56789`を指します。

## Form_urlencodedパーサーとArrayフィルターを併用する例 {#the-example-of-using-the-form_urlencoded-parser-and-the-array-filter}

次の

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

リクエストの本文

```
id[]=01234&id[]=56789
```

に対して、form-urlencoded形式のリクエスト本文内のパラメータ`id`に適用されたArrayフィルターは、以下の配列を参照します:

| Index  | Value    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_FORM_URLENCODED_id_ARRAY_0_value`は、Arrayフィルターで対象となるパラメータ`id`の値配列におけるインデックス`0`に対応する値`01234`を指します。
* `POST_FORM_URLENCODED_id_ARRAY_1_value`は、Arrayフィルターで対象となるパラメータ`id`の値配列におけるインデックス`1`に対応する値`56789`を指します。

## MultipartパーサーとArrayフィルターを併用する例 {#the-example-of-using-the-multipart-parser-and-the-array-filter}

次の

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

リクエストに対して、multipart形式のリクエスト本文内のパラメータ`id`に適用されたArrayフィルターは、以下の配列を参照します:

| Index  | Value    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_MULTIPART_id_ARRAY_0_value`は、Arrayフィルターで対象となるパラメータ`id`の値配列におけるインデックス`0`に対応する値`01234`を指します。
* `POST_MULTIPART_id_ARRAY_1_value`は、Arrayフィルターで対象となるパラメータ`id`の値配列におけるインデックス`1`に対応する値`56789`を指します。

## Xml_tagフィルターとArrayフィルターを併用する例 {#the-example-of-using-the-xml_tag-filter-and-the-array-filter}

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストの本文

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

に対して、XML形式のリクエスト本文内のタグ`text`に適用されたArrayフィルターは、以下の配列を参照します:

| Index  | Value        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_ARRAY_0_value`ポイントは、Arrayフィルターで対象となるタグ`text`の値配列におけるインデックス`0`に対応する値`Sample text.`を指します。
* `POST_XML_XML_TAG_text_ARRAY_1_value`ポイントは、Arrayフィルターで対象となるタグ`text`の値配列におけるインデックス`1`に対応する値`aaaa`を指します。

## Json_objフィルターとArrayフィルターを併用する例 {#the-example-of-using-the-json_obj-filter-and-the-array-filter}

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

リクエストの本文

```
{
    "username": "user",
    "rights":["read","write"]
}
```

に対して、Json_docパーサーとJson_objフィルターを併用し、リクエスト本文のJSONオブジェクト`rights`に適用されたArrayフィルターは、以下の配列を参照します:

| Index  | Value    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value`ポイントは、Arrayフィルターで対象となるJSONオブジェクト`rights`の値配列におけるインデックス`0`に対応する値`read`を指します。
* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value`ポイントは、Arrayフィルターで対象となるJSONオブジェクト`rights`の値配列におけるインデックス`1`に対応する値`write`を指します。