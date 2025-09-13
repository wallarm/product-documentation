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

**XML**パーサーは、リクエストの任意の部分に存在し得るXML形式のデータを扱うために使用します。提供されるフィルターを使用する際には、その名前をポイントに指定する必要があります。

提供されるフィルターを併用せずにポイントでXMLパーサー名のみを使用して、トップレベルのXMLデータコンテナの内容を生の形式で扱うこともできます。

**例:** 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストで、ボディが

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- テスト -->
<text>
    Sample text.
</text>
```

の場合、`POST_XML_value`ポイントは生の形式で次のデータを参照します:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- テスト -->
<text>
    Sample text.
</text>
```

XMLパーサーは入力データに基づいて複雑なデータ構造を構築します。次のフィルターを使用して、このデータ構造の要素を参照できます:
* [Xml_commentフィルター][anchor1];
* [Xml_dtdフィルター][anchor2];
* [Xml_dtd_entityフィルター][anchor3];
* [Xml_piフィルター][anchor4];
* [Xml_tagフィルター][anchor5];
* [Xml_tag_arrayフィルター][anchor6];
* [Xml_attrフィルター][anchor7].

ポイントでフィルターを使用するには、ポイントにXMLパーサー名と提供されるフィルター名を大文字で追加します。


## Xml_commentフィルター
 
**Xml_comment**フィルターは、XML形式のデータに含まれるコメントの配列を参照します。この配列の要素はインデックスで参照する必要があります。配列のインデックスは`0`から始まります。

!!! info "ポイントでの正規表現"
    ポイント内のインデックスには[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。  

Xml_commentフィルターはXMLパーサーと併用したポイントでのみ使用できます。

**例:** 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストで、ボディが

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- 1つ目 -->
<text>
    Sample text.
</text>
<!-- 2つ目 -->
```

の場合、XMLパーサーと併用したXml_commentは次の配列を参照します:

| インデックス | 値      |
|--------|----------|
| 0      | 1つ目    |
| 1      | 2つ目    |

* `POST_XML_XML_COMMENT_0_value`ポイントは、Xml_commentフィルターで参照される配列のインデックス`0`に対応する値`1つ目`を参照します。
* `POST_XML_XML_COMMENT_1_value`ポイントは、Xml_commentフィルターで参照される配列のインデックス`1`に対応する値`2つ目`を参照します。

## Xml_dtdフィルター

**Xml_dtd**フィルターは、XMLデータで使用されている外部DTDスキーマを参照します。このフィルターはXMLパーサーと併用したポイントでのみ使用できます。

Xml_dtdフィルターは文字列値を参照します。このフィルターは配列やハッシュテーブルなどの複雑なデータ構造を参照できません。


**例:** 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストで、ボディが

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- 1つ目 -->
<text>
    Sample text.
</text>
```

の場合、`POST_XML_DTD_value`ポイントは`example.dtd`という値を参照します。

## Xml_dtd_entityフィルター

**Xml_dtd_entity**フィルターは、XMLデータで定義されたDTDスキーマのディレクティブを含む配列を参照します。この配列の要素はインデックスで参照する必要があります。配列のインデックスは`0`から始まります。 

!!! info "ポイントでの正規表現"
    ポイント内のインデックスには[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。  

Xml_dtd_entityフィルターはXMLパーサーと併用したポイントでのみ使用できます。

**例:** 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストで、ボディが 

```
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY xxe "aaaa">
<!ENTITY sample "This is sample text.">
]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- 1つ目 -->
<text>
    &xxe;
</text>
<text>
    &sample;
</text>
```

の場合、XMLパーサーと併用してリクエストボディに適用されたXml_dtd_entityフィルターは次の配列を参照します:

| インデックス | 名前   | 値                    |
|--------|--------|----------------------|
| 0      | xxe    | aaaa                 |
| 1      | sample | This is sample text. |

この配列では、各インデックスがDTDスキーマの名前と値に対応する名前と値のペアを参照します。
* スキーマディレクティブの名前を参照するには、Xml_dtd_entityフィルターを使用するポイントの末尾に`_name`接尾辞を付けます。
* スキーマディレクティブの値を参照するには、Xml_dtd_entityフィルターを使用するポイントの末尾に`_value`接尾辞を付けます。



* `POST_XML_XML_DTD_ENTITY_0_name`ポイントは、Xml_dtd_entityフィルターで参照される配列のインデックス`0`に対応するディレクティブ名`xxe`を参照します。
* `POST_XML_XML_DTD_ENTITY_1_value`ポイントは、Xml_dtd_entityフィルターで参照される配列のインデックス`1`に対応するディレクティブ値`This is sample text.`を参照します。

## Xml_piフィルター

**Xml_pi**フィルターは、XMLデータに定義された処理命令の配列を参照します。この配列の要素はインデックスで参照する必要があります。配列のインデックスは`0`から始まります。 

!!! info "ポイントでの正規表現"
    ポイント内のインデックスには[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。  

Xml_piフィルターはXMLパーサーと併用したポイントでのみ使用できます。

**例:** 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストで、ボディが

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<?last-edit user="John" date="2019-05-11"?>
<!-- 1つ目 -->
<text>
    Sample text.
</text>
```

の場合、XMLパーサーと併用してリクエストボディに適用されたXml_piフィルターは次の配列を参照します:

| インデックス | 名前           | 値                              |
|--------|----------------|----------------------------------|
| 0      | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1      | last-edit      | user="John" date="2019-05-11"    |

この配列では、各インデックスがデータ処理命令の名前と値に対応する名前と値のペアを参照します。
* 処理命令の名前を参照するには、Xml_piフィルターを使用するポイントの末尾に`_name`接尾辞を付けます。
* 処理命令の値を参照するには、Xml_piフィルターを使用するポイントの末尾に`_value`接尾辞を付けます。



* `POST_XML_XML_PI_0_name`ポイントは、Xml_piフィルターで参照される配列のインデックス`0`に対応する命令名`xml-stylesheet`を参照します。
* `POST_XML_XML_PI_1_value`ポイントは、Xml_piフィルターで参照される配列のインデックス`1`に対応する命令値`user="John" date="2019-05-11"`を参照します。

## Xml_tagフィルター

**Xml_tag**フィルターは、XMLデータに含まれるXMLタグのハッシュテーブルを参照します。このハッシュテーブルの要素はタグ名で参照する必要があります。このフィルターはXMLパーサーと併用したポイントでのみ使用できます。 

!!! info "ポイントでの正規表現"
    ポイント内のタグ名には[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。  

XMLデータのタグは値の配列を含む場合があります。これらの配列の値を参照するには、[Array][link-xmltag-array]または[Xml_tag_array][anchor6]フィルターを使用します。

**例:** 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストで、ボディが

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- 1つ目 -->
<text>
    Sample text.
</text>
<sample>
    &eee;
</sample>
```

の場合、XMLパーサーと併用してリクエストボディに適用されたXml_tagフィルターは次のハッシュテーブルを参照します:

| キー    | 値            |
|--------|--------------|
| text   | Sample text. |
| sample | aaaa         |

* `POST_XML_XML_TAG_text_value`ポイントは、Xml_tagフィルターで参照されるハッシュテーブルのキー`text`に対応する値`Sample text.`を参照します。
* `POST_XML_XML_TAG_sample_value`ポイントは、Xml_tagフィルターで参照されるハッシュテーブルのキー`sample`に対応する値`aaaa`を参照します。

## Xml_tag_arrayフィルター

**Xml_tag_array**フィルターは、XMLデータからのタグ値の配列を参照します。この配列の要素はインデックスで参照する必要があります。配列のインデックスは`0`から始まります。このフィルターはXMLパーサーと併用したポイントでのみ使用できます。 

!!! info "ポイントでの正規表現"
    ポイント内のインデックスには[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。  

XMLデータに適用される[Array][link-array]フィルターは、Xml_tag_arrayと同様に動作します。

!!! info "タグ内容の参照方法"
    XMLパーサーは、タグの値とタグ値配列の先頭要素を区別しません。

たとえば、`POST_XML_XML_TAG_myTag_value`ポイントと`POST_XML_XML_TAG_myTag_ARRAY_0_value`ポイントは同じ値を参照します。

**例:** 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストで、ボディが

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- 1つ目 -->
<text>
    Sample text.
</text>
<text>
    &eee;
</text>
```

の場合、リクエストボディ内の`text`タグに適用されたXml_tag_arrayは次の配列を参照します:

| インデックス | 値            |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value`ポイントは、Xml_tag_arrayフィルターで参照されるtextタグの値配列のインデックス`0`に対応する値`Sample text.`を参照します。
* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value`ポイントは、Xml_tag_arrayフィルターで参照されるtextタグの値配列のインデックス`1`に対応する値`aaaa`を参照します。

## Xml_attrフィルター

**Xml_attr**フィルターは、XMLデータのタグ属性のハッシュテーブルを参照します。このハッシュテーブルの要素は属性名で参照する必要があります。

!!! info "ポイントでの正規表現"
    ポイント内の属性名には[Rubyプログラミング言語][link-ruby]の正規表現を使用できます。  

このフィルターはXml_tagフィルターと併用したポイントでのみ使用できます。

**例:** 

次の

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

リクエストで、ボディが

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- 1つ目 -->
<text category="informational" font="12">
    Sample text.
</text>
```

の場合、XMLパーサーとXml_tagフィルターと併用してリクエストボディの`text`タグに適用されたXml_attrフィルターは次のハッシュテーブルを参照します:

| キー      | 値             |
|----------|---------------|
| category | informational |
| font     | 12            |

* `POST_XML_XML_TAG_text_XML_ATTR_category_value`ポイントは、Xml_attrフィルターで参照される`text`タグ属性のハッシュテーブルのキー`category`に対応する値`informational`を参照します。
* `POST_XML_XML_TAG_text_XML_ATTR_font_value`ポイントは、Xml_attrフィルターで参照される`text`タグ属性のハッシュテーブルのキー`font`に対応する値`12`を参照します。