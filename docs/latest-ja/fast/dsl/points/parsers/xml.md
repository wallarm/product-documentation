[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-xmltag-array]:        array.md#the-example-of-using-the-xmltag-filter-and-the-array-filter
[link-array]:               array.md

[anchor1]:      #xml_comment-filter
[anchor2]:      #xml_dtd-filter
[anchor3]:      #xml_dtd_entity-filter
[anchor4]:      #xml_pi-filter
[anchor5]:      #xml_tag-filter
[anchor6]:      #xml_tag_array-filter
[anchor7]:      #xml_attr-filter

# XML パーサー

**XML** パーサーは、リクエストの任意の部分に存在する XML 形式のデータを扱うために使用されます。その名前は、それによって提供されるフィルターを利用する際にポイントで特定しなければなりません。

XML パーサーの名前を、その提供するフィルターなしでポイントに使用して、最上位の XML データコンテナの内容をその生の形式で扱うことができます。

**例：** 

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

というリクエストと、

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

というボディの場合、`POST_XML_value` ポイントは以下の生データを参照します：

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

XML パーサーは、入力データに基づいて複雑なデータ構造を構築します。このデータ構造の要素にアクセスするために以下のフィルターを使用することができます：
* [Xml_comment フィルター][anchor1];
* [Xml_dtd フィルター][anchor2];
* [Xml_dtd_entity フィルター][anchor3];
* [Xml_pi フィルター][anchor4];
* [Xml_tag フィルター][anchor5];
* [Xml_tag_array フィルター][anchor6];
* [Xml_attr フィルター][anchor7].

ポイントでフィルターを使用するためには、XML パーサーとそれによって提供されるフィルターの名前をポイントに大文字で追加します。


## Xml_comment フィルター

**Xml_comment** フィルターは、XML形式のデータからのコメントを含む配列を参照します。この配列の要素はそのインデックスを使用して参照する必要があります。配列のインデックスは `0` から始まります。

!!! info "ポイントの正規表現"
    ポイントのインデックスは [Rubyプログラミング言語][link-ruby]の正規表現であることができます。

Xml_comment フィルターは、XML パーサーと一緒にポイントでのみ使用できます。

**例：** 

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

というリクエストと、

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

というボディの場合、XML パーサーと一緒に適用された Xml_comment は次の配列を参照します：

| インデックス  | 値      |
|--------|----------|
| 0      | first    |
| 1      | second   |

* `POST_XML_XML_COMMENT_0_value` ポイントは、Xml_comment フィルターによって指定された配列から `0` インデックスに対応する `first` 値を参照します。
* `POST_XML_XML_COMMENT_1_value` ポイントは、Xml_comment フィルターによって指定された配列から `1` インデックスに対応する `second` 値を参照します。

## Xml_dtd フィルター

**Xml_dtd** フィルターは、XMLデータに使用される外部DTDスキーマを参照します。このフィルターは、XMLパーサーと一緒にポイントでのみ使用することができます。

Xml_dtd フィルターは文字列値を参照します。このフィルターは、複雑なデータ構造（配列やハッシュテーブルなど）を参照することはできません。


**例：**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

というリクエストと、 

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
```

というボディの場合、`POST_XML_DTD_value` ポイントは `example.dtd` 値を参照します。

## Xml_dtd_entity フィルター

**Xml_dtd_entity** フィルターは、XMLデータに定義されたDTDスキーマディレクティブを含む配列を参照します。この配列の要素はそのインデックスを使用して参照する必要があります。配列のインデックスは `0` から始まります。

!!! info "ポイントの正規表現"
    ポイントのインデックスは [Rubyプログラミング言語][link-ruby]の正規表現であることができます。

Xml_dtd_entity フィルターは、XML パーサーと一緒にポイントでのみ使用できます。

**例：**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

というリクエストと、

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

というボディの場合、リクエストボディに適用された Xml_dtd_entity フィルターとXML パーサーは次の配列を参照します： 

| インデックス  | 名前    | 値                   |
|--------|--------|----------------------|
| 0      | xxe    | aaaa                 |
| 1      | sample | This is sample text. |

この配列では、各インデックスは、DTDスキーマの名前と値に対応する名前-値ペアを参照します。

* スキーマ指令の名前を参照するには、Xml_dtd_entity フィルターを使用するポイントの末尾に `_name` サフィックスを追加します。
* スキーマ指令の値を参照するには、Xml_dtd_entity フィルターを使用するポイントの末尾に `_value` サフィックスを追加します。



* `POST_XML_XML_DTD_ENTITY_0_name` ポイントは、Xml_dtd_entity フィルターによって指定された配列から `0` インデックスに対応する `xxe` ディレクティブ名を参照します。
* `POST_XML_XML_DTD_ENTITY_1_value` ポイントは、Xml_dtd_entity フィルターによって指定された配列から `1` インデックスに対応する `This is sample text.` ディレクティブ値を参照します。

## Xml_pi フィルター

**Xml_pi** フィルターは、XMLデータの処理命令の配列を参照します。この配列の要素はそのインデックスを使用して参照する必要があります。配列のインデックスは `0` から始まります。

!!! info "ポイントの正規表現"
    ポイントのインデックスは [Rubyプログラミング言語][link-ruby]の正規表現であることができます。

Xml_pi フィルターは、XML パーサーと一緒にポイントでのみ使用できます。

**例：**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

というリクエストと、

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

というボディの場合、リクエストボディに適用された Xml_piフィルターとXMLパーサーは、次の配列を参照します：

| インデックス  | 名前            | 値                               |
|--------|----------------|----------------------------------|
| 0      | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1      | last-edit      | user="John" date="2019-05-11"    |

この配列では、各インデックスは、データ処理命令の名前と値に対応する名前-値ペアを参照します。

* 処理指示の名前を参照するには、Xml_pi フィルターを使用するポイントの末尾に `_name` サフィックスを追加します。
* 処理指示の値を参照するには、Xml_pi フィルターを使用するポイントの末尾に `_value` サフィックスを追加します。



* `POST_XML_XML_PI_0_name` ポイントは、Xml_pi フィルターによって指定された配列から `0` インデックスに対応する `xml-stylesheet` 命令名を参照します。
* `POST_XML_XML_PI_1_value` ポイントは、Xml_pi フィルターによって指定された配列から `1` インデックスに対応する `user="John" date="2019-05-11"` 命令値を参照します。

## Xml_tag フィルター

**Xml_tag** フィルターは、XMLデータのXMLタグのハッシュテーブルを参照します。このハッシュテーブルの要素はタグの名前を使用して参照する必要があります。このフィルターは、XMLパーサーと一緒にポイントでのみ使用できます。

!!! info "ポイントの正規表現"
    ポイントのタグ名は [Rubyプログラミング言語][link-ruby]の正規表現であることができます。

XMLデータのタグは、値の配列も含むことがあります。これらの配列の値にアクセスするためには、[Array][link-xmltag-array] フィルターまたは [Xml_tag_array][anchor6] フィルターを使用してください。

**例：**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

というリクエストと、

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

というボディの場合、リクエストボディに適用された Xml_tag フィルターとXML パーサーは、次のハッシュテーブルを参照します：

| キー   | 値           |
|--------|--------------|
| text   | Sample text. |
| sample | aaaa         |

* `POST_XML_XML_TAG_text_value` ポイントは、Xml_tag フィルターによって指定されたハッシュテーブルから `text` キーに対応する `Sample text.` 値を参照します。
* `POST_XML_XML_TAG_sample_value` ポイントは、Xml_tag フィルターによって指定されたハッシュテーブルから `sample` キーに対応する `aaaa` 値を参照します。

## Xml_tag_array フィルター

**Xml_tag_array** フィルターは、XMLデータのタグ値の配列を参照します。この配列の要素はそのインデックスを使用して参照する必要があります。配列のインデックスは `0` から始まります。このフィルターは、XMLパーサーと一緒にポイントでのみ使用できます。

!!! info "ポイントの正規表現"
    ポイントのインデックスは [Rubyプログラミング言語][link-ruby]の正規表現であることができます。

XMLデータに適用される [Array][link-array] フィルターは、Xml_tag_arrayと同様に機能します。

!!! info "タグのコンテンツの参照方法"
    XMLパーサーは、タグ値とタグ値配列の最初の要素を区別しません。

例えば、`POST_XML_XML_TAG_myTag_value` ポイントと `POST_XML_XML_TAG_myTag_ARRAY_0_value` ポイントは同じ値を参照します。

**例：**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

というリクエストと、

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

というボディの場合、リクエストボディの `text` タグに適用された Xml_tag_array は、次の配列を参照します：

| インデックス  | 値           |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` ポイントは、Xml_tag_array フィルターによって指定されたテキストタグ値配列から `0` インデックスに対応する `Sample text.` 値を参照します。
* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` ポイントは、Xml_tag_array フィルターによって指定されたテキストタグ値配列から `1` インデックスに対応する `aaaa` 値を参照します。

## Xml_attr フィルター

**Xml_attr** フィルターは、XMLデータのタグ属性のハッシュテーブルを参照します。このハッシュテーブルの要素は属性の名前を使用して参照する必要があります。

!!! info "ポイントの正規表現"
    ポイントの属性名は [Rubyプログラミング言語][link-ruby]の正規表現であることができます。

このフィルターは、Xml_tag フィルターと一緒にポイントでのみ使用できます。

**例：**

以下の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

というリクエストと、

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text category="informational" font="12">
    Sample text.
</text>
```

というボディの場合、リクエストボディの `text` タグに適用された Xml_attr フィルターとXMLパーサーとXml_tag フィルターは、次のハッシュテーブルを参照します：

| キー      | 値             |
|----------|---------------|
| category | informational |
| font     | 12            |

* `POST_XML_XML_TAG_text_XML_ATTR_category_value` ポイントは、Xml_attr フィルターによって指定された `text` タグ属性ハッシュテーブルから `category` キーに対応する `informational` 値を参照します。
* `POST_XML_XML_TAG_text_XML_ATTR_font_value` ポイントは、Xml_attr フィルターによって指定された `text` タグ属性ハッシュテーブルから `font` キーに対応する `12` 値を参照します。