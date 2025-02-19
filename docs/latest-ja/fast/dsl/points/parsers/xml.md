[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-xmltag-array]:        array.md#the-example-of-using-the-xml_tag-filter-and-the-array-filter
[link-array]:               array.md

[anchor1]:      #xml_comment-filter
[anchor2]:      #xml_dtd-filter
[anchor3]:      #xml_dtd_entity-filter
[anchor4]:      #xml_pi-filter
[anchor5]:      #xml_tag-filter
[anchor6]:      #xml_tag_array-filter
[anchor7]:      #xml_attr-filter

# XMLパーサー

XMLパーサーは、リクエスト内の任意の場所に存在するXML形式のデータを扱うために使用されます。提供されるフィルターを利用する際には、パーサーの名前をpointに指定する必要があります。

XMLパーサー名は、パーサーが提供するフィルターを使用せずにpointで、トップレベルのXMLデータコンテナの内容を生データ形式で扱うためにも利用できます。

**例:**

例えば、次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストと、以下の

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

ボディの場合、`POST_XML_value` pointは、以下の生データを参照します:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

XMLパーサーは、入力データに基づいて複雑なデータ構造を構築します。以下のフィルターを使用して、このデータ構造の各要素にアクセスできます:
* [Xml_commentフィルター][anchor1];
* [Xml_dtdフィルター][anchor2];
* [Xml_dtd_entityフィルター][anchor3];
* [Xml_piフィルター][anchor4];
* [Xml_tagフィルター][anchor5];
* [Xml_tag_arrayフィルター][anchor6];
* [Xml_attrフィルター][anchor7].

フィルターをpointで使用する際、XMLパーサーおよびフィルターの名前を大文字でpointに追加します.

## Xml_commentフィルター

Xml_commentフィルターは、XML形式のデータに含まれるコメントの配列を参照します。これらの配列要素は、インデックスを使用して参照する必要があり、配列のインデックスは`0`から開始します.

!!! info "ポイントにおける正規表現"
    ポイント内のインデックスは[Ruby programming language][link-ruby]の正規表現で指定できます.

Xml_commentフィルターは、XMLパーサーと共にのみpointで使用可能です.

**例:**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストと、以下の

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
<!-- second -->
```

ボディの場合、XMLパーサーと共に適用されたXml_commentフィルターは、以下の配列を参照します:

| Index  | Value    |
|--------|----------|
| 0      | first    |
| 1      | second   |

* `POST_XML_XML_COMMENT_0_value` pointは、Xml_commentフィルターで参照された配列の`0`番目のインデックスに対応する`first`の値を参照します.
* `POST_XML_XML_COMMENT_1_value` pointは、Xml_commentフィルターで参照された配列の`1`番目のインデックスに対応する`second`の値を参照します.

## Xml_dtdフィルター

Xml_dtdフィルターは、XMLデータで使用される外部DTDスキーマを参照します。このフィルターは、XMLパーサーと併せてpointでのみ使用できます.

Xml_dtdフィルターは文字列値を参照します。このフィルターは、配列やハッシュテーブルなどの複雑なデータ構造を参照することはできません.

**例:**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストと、以下の

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
```

ボディの場合、`POST_XML_DTD_value` pointは、`example.dtd`の値を参照します.

## Xml_dtd_entityフィルター

Xml_dtd_entityフィルターは、XMLデータに定義されたDTDスキーマディレクティブを含む配列を参照します。これらの配列要素は、インデックスを使用して参照する必要があり、配列のインデックスは`0`から開始します.

!!! info "ポイントにおける正規表現"
    ポイント内のインデックスは[Ruby programming language][link-ruby]の正規表現で指定できます.

Xml_dtd_entityフィルターは、XMLパーサーと共にのみpointで使用可能です.

**例:**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストと、以下の

```
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY xxe "aaaa">
<!ENTITY sample "This is sample text.">
]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    &xxe;
</text>
<text>
    &sample;
</text>
```

ボディの場合、XMLパーサーと共に適用されたXml_dtd_entityフィルターは、以下の配列を参照します:

| Index  | Name   | Value                |
|--------|--------|----------------------|
| 0      | xxe    | aaaa                 |
| 1      | sample | This is sample text. |

この配列では、それぞれのインデックスがDTDスキーマの名前と値に対応する名前-値ペアを表します.
* Xml_dtd_entityフィルターを使用してスキーマディレクティブの名前を参照するpointでは、末尾に`_name`を追加します.
* Xml_dtd_entityフィルターを使用してスキーマディレクティブの値を参照するpointでは、末尾に`_value`を追加します.

* `POST_XML_XML_DTD_ENTITY_0_name` pointは、Xml_dtd_entityフィルターで参照された配列の`0`番目のインデックスに対応する`xxe`ディレクティブの名前を参照します.
* `POST_XML_XML_DTD_ENTITY_1_value` pointは、Xml_dtd_entityフィルターで参照された配列の`1`番目のインデックスに対応する`This is sample text.`ディレクティブの値を参照します.

## Xml_piフィルター

Xml_piフィルターは、XMLデータに定義されたプロセッシング命令の配列を参照します。これらの配列要素は、インデックスを使用して参照する必要があり、配列のインデックスは`0`から開始します.

!!! info "ポイントにおける正規表現"
    ポイント内のインデックスは[Ruby programming language][link-ruby]の正規表現で指定できます.

Xml_piフィルターは、XMLパーサーと共にのみpointで使用可能です.

**例:**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストと、以下の

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<?last-edit user="John" date="2019-05-11"?>
<!-- first -->
<text>
    Sample text.
</text>
```

ボディの場合、XMLパーサーと共に適用されたXml_piフィルターは、以下の配列を参照します:

| Index  | Name           | Value                            |
|--------|----------------|----------------------------------|
| 0      | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1      | last-edit      | user="John" date="2019-05-11"    |

この配列では、それぞれのインデックスがプロセッシング命令の名前と値に対応する名前-値ペアを表します.
* Xml_piフィルターを使用してプロセッシング命令の名前を参照するpointでは、末尾に`_name`を追加します.
* Xml_piフィルターを使用してプロセッシング命令の値を参照するpointでは、末尾に`_value`を追加します.

* `POST_XML_XML_PI_0_name` pointは、Xml_piフィルターで参照された配列の`0`番目のインデックスに対応する`xml-stylesheet`命令の名前を参照します.
* `POST_XML_XML_PI_1_value` pointは、Xml_piフィルターで参照された配列の`1`番目のインデックスに対応する`user="John" date="2019-05-11"`命令の値を参照します.

## Xml_tagフィルター

Xml_tagフィルターは、XMLデータから取得されたXMLタグのハッシュテーブルを参照します。これらのハッシュテーブルの要素は、タグ名を用いて参照する必要があり、このフィルターはXMLパーサーと共にのみpointで使用可能です.

!!! info "ポイントにおける正規表現"
    ポイント内のタグ名は[Ruby programming language][link-ruby]の正規表現で指定できます.

XMLデータのタグには、値の配列が含まれている場合もあります。これらの配列内の値にアクセスするには、[Array][link-xmltag-array]または[Xml_tag_arrayフィルター][anchor6]を使用してください.

**例:**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストと、以下の

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
<sample>
    &eee;
</sample>
```

ボディの場合、XMLパーサーと共に適用されたXml_tagフィルターは、以下のハッシュテーブルを参照します:

| Key    | Value        |
|--------|--------------|
| text   | Sample text. |
| sample | aaaa         |

* `POST_XML_XML_TAG_text_value` pointは、Xml_tagフィルターで参照されたハッシュテーブル内の`text`キーに対応する`Sample text.`の値を参照します.
* `POST_XML_XML_TAG_sample_value` pointは、Xml_tagフィルターで参照されたハッシュテーブル内の`sample`キーに対応する`aaaa`の値を参照します.

## Xml_tag_arrayフィルター

Xml_tag_arrayフィルターは、XMLデータから取得されたタグ値の配列を参照します。これらの配列要素は、インデックスを使用して参照する必要があり、配列のインデックスは`0`から開始します。このフィルターは、XMLパーサーと共にのみpointで使用可能です.

!!! info "ポイントにおける正規表現"
    ポイント内のインデックスは[Ruby programming language][link-ruby]の正規表現で指定できます.

[Arrayフィルター][link-array]をXMLデータに適用した場合も、Xml_tag_arrayと同様に動作します.

!!! info "タグ内容へのアクセス方法"
    XMLパーサーは、タグ値とタグ値配列の最初の要素を区別しません.

例えば、`POST_XML_XML_TAG_myTag_value` pointと`POST_XML_XML_TAG_myTag_ARRAY_0_value` pointは同じ値を参照します.

**例:**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストと、以下の

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

ボディの場合、XMLパーサーと共に適用されたXml_tag_arrayフィルターは、`text`タグの値の配列として、以下を参照します:

| Index  | Value        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` pointは、Xml_tag_arrayフィルターで参照された`text`タグの値の配列の`0`番目のインデックスに対応する`Sample text.`の値を参照します.
* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` pointは、Xml_tag_arrayフィルターで参照された`text`タグの値の配列の`1`番目のインデックスに対応する`aaaa`の値を参照します.

## Xml_attrフィルター

Xml_attrフィルターは、XMLデータから取得されたタグ属性のハッシュテーブルを参照します。これらのハッシュテーブルの要素は、属性名を用いて参照する必要があります.

!!! info "ポイントにおける正規表現"
    ポイント内の属性名は[Ruby programming language][link-ruby]の正規表現で指定できます.

このフィルターは、Xml_tagフィルターと共にのみpointで使用可能です.

**例:**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストと、以下の

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text category="informational" font="12">
    Sample text.
</text>
```

ボディの場合、XMLパーサーとXml_tagフィルター、さらにXml_attrフィルターを適用すると、`text`タグの属性のハッシュテーブルとして、以下を参照します:

| Key      | Value         |
|----------|---------------|
| category | informational |
| font     | 12            |

* `POST_XML_XML_TAG_text_XML_ATTR_category_value` pointは、Xml_attrフィルターで参照された`text`タグ属性のハッシュテーブル内の`category`キーに対応する`informational`の値を参照します.
* `POST_XML_XML_TAG_text_XML_ATTR_font_value` pointは、Xml_attrフィルターで参照された`text`タグ属性のハッシュテーブル内の`font`キーに対応する`12`の値を参照します.