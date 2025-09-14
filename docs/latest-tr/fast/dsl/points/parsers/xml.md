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

**XML** ayrıştırıcı, isteğin herhangi bir bölümünde bulunabilen XML formatındaki verilerle çalışmak için kullanılır. Sağladığı filtreler kullanılırken, adının bir noktada belirtilmesi gerekir.

XML ayrıştırıcısının adını, sağladığı filtreler olmadan noktada kullanarak, en üst düzey XML veri kapsayıcısının içeriğiyle ham biçimde çalışabilirsiniz.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinin şu gövdesi ile

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

`POST_XML_value` noktası aşağıdaki ham veriye karşılık gelir:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

XML ayrıştırıcı, giriş verilerine dayanarak karmaşık bir veri yapısı oluşturur. Bu veri yapısının öğelerine erişmek için şu filtreleri kullanabilirsiniz:
* [Xml_comment filtresi][anchor1];
* [Xml_dtd filtresi][anchor2];
* [Xml_dtd_entity filtresi][anchor3];
* [Xml_pi filtresi][anchor4];
* [Xml_tag filtresi][anchor5];
* [Xml_tag_array filtresi][anchor6];
* [Xml_attr filtresi][anchor7].

Filtreyi noktada kullanmak için, XML ayrıştırıcının ve onun sağladığı filtrenin adlarını büyük harflerle noktaya ekleyin.


## Xml_comment Filtresi
 
**Xml_comment** filtresi, XML formatındaki verilerden gelen yorumları içeren diziye karşılık gelir. Bu dizinin öğelerine indeksleri kullanılarak başvurulmalıdır. Dizi indekslemesi `0` ile başlar.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.  

Xml_comment filtresi yalnızca XML ayrıştırıcı ile birlikte noktada kullanılabilir.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinin şu gövdesi ile

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- birinci -->
<text>
    Sample text.
</text>
<!-- ikinci -->
```

Xml_comment filtresi XML ayrıştırıcı ile birlikte uygulandığında aşağıdaki diziye karşılık gelir:

| Dizin | Değer    |
|------|----------|
| 0    | birinci  |
| 1    | ikinci   |

* `POST_XML_XML_COMMENT_0_value` noktası, Xml_comment filtresinin başvurduğu dizideki `0` indeksine karşılık gelen `birinci` değerine karşılık gelir.
* `POST_XML_XML_COMMENT_1_value` noktası, Xml_comment filtresinin başvurduğu dizideki `1` indeksine karşılık gelen `ikinci` değerine karşılık gelir.

## Xml_dtd Filtresi

**Xml_dtd** filtresi, XML verilerinde kullanılan harici DTD şemasına karşılık gelir. Bu filtre yalnızca XML ayrıştırıcı ile birlikte noktada kullanılabilir.

Xml_dtd filtresi bir dize değerine karşılık gelir. Bu filtre karmaşık veri yapılarına (diziler veya hash tablolar gibi) karşılık gelemez.


Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinin şu gövdesi ile

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
```

`POST_XML_DTD_value` noktası `example.dtd` değerine karşılık gelir.

## Xml_dtd_entity Filtresi

**Xml_dtd_entity** filtresi, XML verilerinde tanımlanan DTD şeması yönergelerini içeren diziye karşılık gelir. Bu dizinin öğelerine indeksleri kullanılarak başvurulmalıdır. Dizi indekslemesi `0` ile başlar. 

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.  

Xml_dtd_entity filtresi yalnızca XML ayrıştırıcı ile birlikte noktada kullanılabilir.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinin şu gövdesi ile 

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

Xml_dtd_entity filtresi XML ayrıştırıcı ile birlikte istek gövdesine uygulandığında aşağıdaki diziye karşılık gelir:

| Dizin | Ad     | Değer                |
|-------|--------|----------------------|
| 0     | xxe    | aaaa                 |
| 1     | sample | This is sample text. |

Bu dizide, her indeks, DTD şemasının adı ve değeriyle eşleşen ad-değer çiftine karşılık gelir.
* Şema yönergesinin adına başvurmak için, Xml_dtd_entity filtresini kullanan noktanın sonuna `_name` soneki ekleyin.
* Şema yönergesinin değerine başvurmak için, Xml_dtd_entity filtresini kullanan noktanın sonuna `_value` soneki ekleyin.



* `POST_XML_XML_DTD_ENTITY_0_name` noktası, Xml_dtd_entity filtresinin başvurduğu dizideki `0` indeksine karşılık gelen `xxe` yönerge adına karşılık gelir.
* `POST_XML_XML_DTD_ENTITY_1_value` noktası, Xml_dtd_entity filtresinin başvurduğu dizideki `1` indeksine karşılık gelen `This is sample text.` yönerge değerine karşılık gelir.

## Xml_pi Filtresi

**Xml_pi** filtresi, XML verileri için tanımlanan işlem talimatlarının dizisine karşılık gelir. Bu dizinin öğelerine indeksleri kullanılarak başvurulmalıdır. Dizi indekslemesi `0` ile başlar. 

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.  

Xml_pi filtresi yalnızca XML ayrıştırıcı ile birlikte noktada kullanılabilir.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinin şu gövdesi ile

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

Xml_pi filtresi XML ayrıştırıcı ile birlikte istek gövdesine uygulandığında aşağıdaki diziye karşılık gelir:

| Dizin | Ad             | Değer                            |
|-------|----------------|----------------------------------|
| 0     | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1     | last-edit      | user="John" date="2019-05-11"    |

Bu dizide, her indeks, veri işleme talimatının adı ve değeriyle eşleşen ad-değer çiftine karşılık gelir.
* İşleme talimatının adına başvurmak için, Xml_pi filtresini kullanan noktanın sonuna `_name` soneki ekleyin.
* İşleme talimatının değerine başvurmak için, Xml_pi filtresini kullanan noktanın sonuna `_value` soneki ekleyin.



* `POST_XML_XML_PI_0_name` noktası, Xml_pi filtresinin başvurduğu dizideki `0` indeksine karşılık gelen `xml-stylesheet` talimat adına karşılık gelir.
* `POST_XML_XML_PI_1_value` noktası, Xml_pi filtresinin başvurduğu dizideki `1` indeksine karşılık gelen `user="John" date="2019-05-11"` talimat değerine karşılık gelir.

## Xml_tag Filtresi

**Xml_tag** filtresi, XML verilerindeki XML etiketlerinin hash tablosuna karşılık gelir. Bu hash tablosundaki öğelere etiket adları kullanılarak başvurulmalıdır. Bu filtre yalnızca XML ayrıştırıcı ile birlikte noktada kullanılabilir. 

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki etiket adı, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.  

XML verilerindeki etiketler değer dizileri de içerebilir. Bu dizilerdeki değerlere başvurmak için [Array][link-xmltag-array] veya [Xml_tag_array][anchor6] filtresini kullanın.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinin şu gövdesi ile

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

Xml_tag filtresi XML ayrıştırıcı ile birlikte istek gövdesine uygulandığında aşağıdaki hash tablosuna karşılık gelir:

| Anahtar | Değer        |
|--------|--------------|
| text   | Sample text. |
| sample | aaaa         |

* `POST_XML_XML_TAG_text_value` noktası, Xml_tag filtresinin başvurduğu hash tablosundaki `text` anahtarına karşılık gelen `Sample text.` değerine karşılık gelir.
* `POST_XML_XML_TAG_sample_value` noktası, Xml_tag filtresinin başvurduğu hash tablosundaki `sample` anahtarına karşılık gelen `aaaa` değerine karşılık gelir.

## Xml_tag_array Filtresi

**Xml_tag_array** filtresi, XML verilerindeki etiket değerlerinin dizisine karşılık gelir. Bu dizinin öğelerine indeksleri kullanılarak başvurulmalıdır. Dizi indekslemesi `0` ile başlar. Bu filtre yalnızca XML ayrıştırıcı ile birlikte noktada kullanılabilir. 

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.  

XML verilerine uygulanan [Array][link-array] filtresi, Xml_tag_array ile benzer şekilde çalışır.

!!! info "Etiket içeriğine erişim yolları"
    XML ayrıştırıcı, etiket değeri ile etiket değerleri dizisindeki ilk öğe arasında ayrım yapmaz.

Örneğin, `POST_XML_XML_TAG_myTag_value` ve `POST_XML_XML_TAG_myTag_ARRAY_0_value` noktaları aynı değere karşılık gelir.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinin şu gövdesi ile

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- birinci -->
<text>
    Sample text.
</text>
<text>
    &eee;
</text>
```

Xml_tag_array, istek gövdesindeki `text` etiketine uygulandığında aşağıdaki diziye karşılık gelir:

| Dizin | Değer        |
|-------|--------------|
| 0     | Sample text. |
| 1     | aaaa         |

* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` noktası, Xml_tag_array filtresinin başvurduğu text etiketinin değer dizisindeki `0` indeksine karşılık gelen `Sample text.` değerine karşılık gelir.
* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` noktası, Xml_tag_array filtresinin başvurduğu text etiketinin değer dizisindeki `1` indeksine karşılık gelen `aaaa` değerine karşılık gelir.

## Xml_attr Filtresi

**Xml_attr** filtresi, XML verilerindeki etiket özniteliklerinin hash tablosuna karşılık gelir. Bu hash tablosundaki öğelere öznitelik adları kullanılarak başvurulmalıdır.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki öznitelik adı, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.  

Bu filtre yalnızca Xml_tag filtresi ile birlikte noktada kullanılabilir.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinin şu gövdesi ile

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- birinci -->
<text category="informational" font="12">
    Sample text.
</text>
```

Xml_attr filtresi, XML ayrıştırıcı ve Xml_tag filtresiyle birlikte istek gövdesindeki `text` etiketine uygulandığında aşağıdaki hash tablosuna karşılık gelir:

| Anahtar  | Değer         |
|----------|---------------|
| category | informational |
| font     | 12            |

* `POST_XML_XML_TAG_text_XML_ATTR_category_value` noktası, Xml_attr filtresinin başvurduğu `text` etiketinin öznitelik hash tablosundaki `category` anahtarına karşılık gelen `informational` değerine karşılık gelir.
* `POST_XML_XML_TAG_text_XML_ATTR_font_value` noktası, Xml_attr filtresinin başvurduğu `text` etiketinin öznitelik hash tablosundaki `font` anahtarına karşılık gelen `12` değerine karşılık gelir.