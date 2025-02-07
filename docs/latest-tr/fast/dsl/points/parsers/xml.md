```markdown
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

# XML Ayrıştırıcı

**XML** ayrıştırıcı, isteğin herhangi bir bölümünde yer alabilecek XML formatındaki verilerle çalışmak için kullanılır. Kullanılan filtrelerin bulunduğu noktada, bu ayrıştırıcının adı belirtilmelidir.

XML ayrıştırıcı adını, kendisine ait herhangi bir filtre kullanılmadan, ham formatta üst düzey XML veri konteyneri içeriğiyle çalışmak için nokta içerisinde kullanabilirsiniz.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği için

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

gövdesinde, `POST_XML_value` noktası ham formatta aşağıdaki veriye işaret eder:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

XML ayrıştırıcı, girdi verisine dayanarak karmaşık bir veri yapısı oluşturur. Bu veri yapısının elemanlarına ulaşmak için aşağıdaki filtreleri kullanabilirsiniz:
* [Xml_comment filter][anchor1];
* [Xml_dtd filter][anchor2];
* [Xml_dtd_entity filter][anchor3];
* [Xml_pi filter][anchor4];
* [Xml_tag filter][anchor5];
* [Xml_tag_array filter][anchor6];
* [Xml_attr filter][anchor7].

XML ayrıştırıcı ve onun tarafından sağlanan filtreleri kullanırken, filtreyi nokta içerisinde kullanmak için isimlerin büyük harflerle eklenmesi gerekir.


## Xml_comment Filter
 
**Xml_comment** filtresi, XML formatındaki veriden alınan yorumları içeren diziyi ifade eder. Bu dizinin elemanlarına, indeksleri kullanarak erişilmesi gerekir. Dizi indekslemesi `0` ile başlar.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programming language][link-ruby]'nin düzenli ifadesi olabilir.  

Xml_comment filtresi yalnızca XML ayrıştırıcıyla birlikte noktada kullanılabilir.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği için

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

gövdesinde, XML ayrıştırıcıyla birlikte uygulanan Xml_comment filtresi aşağıdaki diziye işaret eder:

| Index  | Value    |
|--------|----------|
| 0      | first    |
| 1      | second   |

* `POST_XML_XML_COMMENT_0_value` noktası, Xml_comment filtresiyle erişilen dizide `0` indeksine karşılık gelen `first` değerine işaret eder.
* `POST_XML_XML_COMMENT_1_value` noktası, Xml_comment filtresiyle erişilen dizide `1` indeksine karşılık gelen `second` değerine işaret eder.

## Xml_dtd Filter

**Xml_dtd** filtresi, XML verisinde kullanılan dış DTD şemasına işaret eder. Bu filtre yalnızca XML ayrıştırıcıyla birlikte noktada kullanılabilir.

Xml_dtd filtresi, bir dize (string) değerini ifade eder. Bu filtre, diziler veya hash tabloları gibi karmaşık veri yapılarıyla işaret edemez.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği için

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
```

gövdesinde, `POST_XML_DTD_value` noktası `example.dtd` değerine işaret eder.

## Xml_dtd_entity Filter

**Xml_dtd_entity** filtresi, XML verisinde tanımlı DTD şema yönergelerini içeren diziyi ifade eder. Bu dizinin elemanlarına, indeksler kullanılarak erişilmesi gerekir. Dizi indekslemesi `0` ile başlar.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programming language][link-ruby]'nin düzenli ifadesi olabilir.  

Xml_dtd_entity filtresi yalnızca XML ayrıştırıcıyla birlikte noktada kullanılabilir.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği için 

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

gövdesinde, XML ayrıştırıcıyla birlikte uygulanan Xml_dtd_entity filtresi aşağıdaki diziye işaret eder:

| Index  | Name   | Value                |
|--------|--------|----------------------|
| 0      | xxe    | aaaa                 |
| 1      | sample | This is sample text. |

Bu dizide, her indeks, DTD şemasının adıyla değeri arasında eşleşen ad-değer çiftine karşılık gelir.
* Xml_dtd_entity filtresi kullanılarak adı ifade eden noktaya `_name` öneki ekleyin.
* Xml_dtd_entity filtresi kullanılarak değeri ifade eden noktaya `_value` öneki ekleyin.

* `POST_XML_XML_DTD_ENTITY_0_name` noktası, Xml_dtd_entity filtresiyle erişilen dizide `0` indeksine karşılık gelen `xxe` yönerge adına işaret eder.
* `POST_XML_XML_DTD_ENTITY_1_value` noktası, Xml_dtd_entity filtresiyle erişilen dizide `1` indeksine karşılık gelen `This is sample text.` yönerge değerine işaret eder.

## Xml_pi Filter

**Xml_pi** filtresi, XML verisi için tanımlanan işleme yönergelerinin dizisine işaret eder. Bu dizinin elemanlarına, indeksler kullanılarak erişilmesi gerekir. Dizi indekslemesi `0` ile başlar.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programming language][link-ruby]'nin düzenli ifadesi olabilir.  

Xml_pi filtresi yalnızca XML ayrıştırıcıyla birlikte noktada kullanılabilir.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği için

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

gövdesinde, XML ayrıştırıcıyla birlikte uygulanan Xml_pi filtresi aşağıdaki diziye işaret eder:

| Index  | Name           | Value                            |
|--------|----------------|----------------------------------|
| 0      | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1      | last-edit      | user="John" date="2019-05-11"    |

Bu dizide, her indeks, işleme yönergesinin adı ile değeri arasında eşleşen ad-değer çiftine karşılık gelir.
* Xml_pi filtresi kullanılarak yönerge adını ifade eden noktaya `_name` öneki ekleyin.
* Xml_pi filtresi kullanılarak yönerge değerini ifade eden noktaya `_value` öneki ekleyin.

* `POST_XML_XML_PI_0_name` noktası, Xml_pi filtresiyle erişilen dizide `0` indeksine karşılık gelen `xml-stylesheet` yönerge adına işaret eder.
* `POST_XML_XML_PI_1_value` noktası, Xml_pi filtresiyle erişilen dizide `1` indeksine karşılık gelen `user="John" date="2019-05-11"` yönerge değerine işaret eder.

## Xml_tag Filter

**Xml_tag** filtresi, XML verisindeki XML etiketlerinin hash tablosuna işaret eder. Bu hash tablosunun elemanlarına, etiket isimleri kullanılarak erişilir. Bu filtre yalnızca XML ayrıştırıcıyla birlikte noktada kullanılabilir.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki etiket ismi, [Ruby programming language][link-ruby]'nin düzenli ifadesi olabilir.  

XML verisindeki etiketler, değer dizilerini de içerebilir. Bu dizilerden değerlere ulaşmak için [Array][link-xmltag-array] veya [Xml_tag_array][anchor6] filtresini kullanın.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği için

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

gövdesinde, XML ayrıştırıcıyla birlikte uygulanan Xml_tag filtresi aşağıdaki hash tablosuna işaret eder:

| Key    | Value        |
|--------|--------------|
| text   | Sample text. |
| sample | aaaa         |

* `POST_XML_XML_TAG_text_value` noktası, Xml_tag filtresiyle erişilen hash tablosunda `text` anahtarına karşılık gelen `Sample text.` değerine işaret eder.
* `POST_XML_XML_TAG_sample_value` noktası, Xml_tag filtresiyle erişilen hash tablosunda `sample` anahtarına karşılık gelen `aaaa` değerine işaret eder.

## Xml_tag_array Filter

**Xml_tag_array** filtresi, XML verisindeki etiket değerlerinin dizisine işaret eder. Bu dizinin elemanlarına, indeksler kullanılarak erişilmesi gerekir. Dizi indekslemesi `0` ile başlar. Bu filtre yalnızca XML ayrıştırıcıyla birlikte noktada kullanılabilir.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programming language][link-ruby]'nin düzenli ifadesi olabilir.  

XML verisine uygulanan [Array][link-array] filtresi, Xml_tag_array filtresiyle benzer şekilde çalışır.

!!! info "Etiket içeriğine erişim yöntemleri"
    XML ayrıştırıcı, etiket değeri ile etiket değerleri dizisinin ilk elemanı arasında ayrım yapmaz.

Örneğin, `POST_XML_XML_TAG_myTag_value` ve `POST_XML_XML_TAG_myTag_ARRAY_0_value` noktaları aynı değere işaret eder.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği için

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

gövdesinde, XML ayrıştırıcıyla birlikte `text` etiketine uygulanan Xml_tag_array filtresi aşağıdaki diziye işaret eder:

| Index  | Value        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` noktası, Xml_tag_array filtresiyle erişilen text etiket değerleri dizisinde `0` indeksine karşılık gelen `Sample text.` değerine işaret eder.
* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` noktası, Xml_tag_array filtresiyle erişilen text etiket değerleri dizisinde `1` indeksine karşılık gelen `aaaa` değerine işaret eder.

## Xml_attr Filter

**Xml_attr** filtresi, XML verisindeki etiket özniteliklerinin hash tablosuna işaret eder. Bu hash tablosunun elemanlarına, öznitelik isimleri kullanılarak erişilir.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki öznitelik ismi, [Ruby programming language][link-ruby]'nin düzenli ifadesi olabilir.  

Bu filtre, yalnızca Xml_tag filtresiyle birlikte aynı noktada kullanılabilir.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği için

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text category="informational" font="12">
    Sample text.
</text>
```

gövdesinde, XML ayrıştırıcıyla birlikte Xml_tag filtresine uygulanan Xml_attr filtresi, `text` etiketine ait öznitelikler hash tablosuna aşağıdaki gibi işaret eder:

| Key      | Value         |
|----------|---------------|
| category | informational |
| font     | 12            |

* `POST_XML_XML_TAG_text_XML_ATTR_category_value` noktası, Xml_attr filtresiyle erişilen `text` etiket öznitelikleri hash tablosunda `category` anahtarına karşılık gelen `informational` değerine işaret eder.
* `POST_XML_XML_TAG_text_XML_ATTR_font_value` noktası, Xml_attr filtresiyle erişilen `text` etiket öznitelikleri hash tablosunda `font` anahtarına karşılık gelen `12` değerine işaret eder.
```