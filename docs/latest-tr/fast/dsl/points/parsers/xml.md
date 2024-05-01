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

# XML Ayrıştırıcı

**XML** ayrıştırıcısı, veriyi isteğin herhangi bir bölümünde bulunabilecek XML formatında işlemek için kullanılır. İsim, sağlanan filtreleri kullanırken bir noktada belirtilmelidir.

XML ayrıştırıcı adını, sağladığı filtreler olmadan, ham formatındaki üst seviye XML veri container içeriğiyle çalışmak için noktada kullanabilirsiniz.

**Örnek:** 

Aşağıdakiler için

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Örnek metin.
</text>
```

body, the `POST_XML_value` point, ham formattaki aşağıdaki veriyi ifade eder:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Örnek metin.
</text>
```

XML ayrıştırıcı, giriş verilerine dayalı karmaşık bir veri yapısı oluşturur. Bu veri yapısının öğelerine ulaşmak için aşağıdaki filtreleri kullanabilirsiniz:
* [Xml_comment filtresi][anchor1];
* [Xml_dtd filtresi][anchor2];
* [Xml_dtd_entity filtresi][anchor3];
* [Xml_pi filtresi][anchor4];
* [Xml_tag filtresi][anchor5];
* [Xml_tag_array filtresi][anchor6];
* [Xml_attr filtresi][anchor7].

Filtreyi noktada kullanmak için XML ayrıştırıcısının ve onun tarafından sağlanan filtrenin isimlerini büyük harfle point'e ekleyin.


## Xml_comment Filtresi
 
**Xml_comment** filtresi, XML formatındaki verilerden gelen yorumları içeren bir diziye işaret eder. Bu dizinin öğelerine endeksleri kullanarak başvurulmalıdır. Dizi endekslemesi `0` ile başlar.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki endeks, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.  

Xml_comment filtresi sadece XML ayrıştırıcısı ile birlikte noktada kullanılabilir.

**Örnek:** 

Aşağıdakiler için

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- ilk -->
<text>
    Örnek metin.
</text>
<!-- ikinci -->
```

body, the Xml_comment, XML ayrıştırıcısı ile birlikte kullanıldığında aşağıdaki diziye işaret eder:

| Endeks  | Değer    |
|--------|----------|
| 0      | ilk    |
| 1      | ikinci   |

* `POST_XML_XML_COMMENT_0_value` noktası, `ilk` değerine işaret eder, bu değer Xml_comment filtresi ile adreslendirilen dizideki `0` endeksine karşılık gelir.
* `POST_XML_XML_COMMENT_1_value` noktası, `ikinci` değerine işaret eder, bu değer Xml_comment filtresi ile adreslendirilen dizideki `1` endeksine karşılık gelir.

## Xml_dtd Filtresi

**Xml_dtd** filtresi, XML verilerinde kullanılan dış DTD şemasına işaret eder. Bu filtre sadece XML ayrıştırıcısı ile birlikte noktada kullanılabilir.

Xml_dtd filtresi bir string değerine işaret eder. Bu filtre karmaşık veri yapılarına (diziler veya hash tabloları gibi) işaret edemez.


**Örnek:** 

Aşağıdakiler için

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Örnek metin.
</text>
```

body, the `POST_XML_DTD_value` point, `example.dtd` değerine işaret eder.

## Xml_dtd_entity Filtresi

**Xml_dtd_entity** filtresi, XML verilerinde tanımlanan DTD şema yönergelerini içeren bir diziye işaret eder. Bu dizinin öğelerine endeksleri kullanarak başvurulmalıdır. Dizi endekslemesi `0` ile başlar. 

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki endeks, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.  

Xml_dtd_entity filtresi sadece XML ayrıştırıcısı ile birlikte noktada kullanılabilir.

**Örnek:** 

Aşağıdakiler için

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the 

```
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY xxe "aaaa">
<!ENTITY sample "Bu bir örnek metindir.">
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

body, the Xml_dtd_entity filter, XML ayrıştırıcısı ile birlikte istek gövdesine uygulandığında aşağıdaki diziye işaret eder:

| Endeks  | İsim   | Değer                |
|--------|--------|----------------------|
| 0      | xxe    | aaaa                 |
| 1      | sample | Bu bir örnek metin.  |

Bu dizide, her endeks DTD şemasının ismi ve değeri ile eşleşen isim-değer çiftine işaret eder.
* Şema yönergesinin ismine işaret etmek için Xml_dtd_entity filtresini kullanan noktanın sonuna `_name` ekleyin.
* Şema yönergesinin değerine işaret etmek için Xml_dtd_entity filtresini kullanan noktanın sonuna `_value` ekleyin.



* `POST_XML_XML_DTD_ENTITY_0_name` noktası, `xxe` yönergesi ismine işaret eder, bu isim Xml_dtd_entity filtresi ile adreslendirilen dizideki `0` endeksine karşılık gelir. 
* `POST_XML_XML_DTD_ENTITY_1_value` noktası, `Bu bir örnek metin.` yönergesi değerine işaret eder, bu değer Xml_dtd_entity filtresi ile adreslendirilen dizideki `1` endeksine karşılık gelir.

## Xml_pi Filtresi

**Xml_pi** filtresi, XML verileri için tanımlanmış işlem talimatlarının bir dizisine işaret eder. Bu dizinin öğelerine endeksleri kullanarak başvurulmalıdır. Dizi endekslemesi `0` ile başlar. 

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki endeks, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.  

Xml_pi filtresi sadece XML ayrıştırıcısı ile birlikte noktada kullanılabilir.

**Örnek:** 

Aşağıdakiler için

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<?son-duzenleme kullanici="John" tarih="2019-05-11"?>
<!-- first -->
<text>
    Örnek metin.
</text>
```

body, the Xml_pi filtresi, XML ayrıştırıcısı ile birlikte istek gövdesine uygulandığında aşağıdaki diziye işaret eder:

| Endeks  | İsim           | Değer                            |
|--------|----------------|----------------------------------|
| 0      | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1      | last-edit      | user="John" date="2019-05-11"    |

Bu dizide, her endeks veri işleme talimatının ismi ve değeri ile eşleşen isim-değer çiftine işaret eder.
* İşleme talimatının ismine işaret etmek için Xml_pi filtresini kullanan noktanın sonuna `_name` ekleyin.
* İşleme talimatının değerine işaret etmek için Xml_pi filtresini kullanan noktanın sonuna `_value` ekleyin.


* `POST_XML_XML_PI_0_name` noktası, `xml-stylesheet` talimat ismine işaret eder, bu isim Xml_pi filtresi ile adreslendirilen dizideki `0` endeksine karşılık gelir.
* `POST_XML_XML_PI_1_value` noktası, `kullanici="John" tarih="2019-05-11"` talimat değerine işaret eder, bu değer Xml_pi filtresi ile adreslendirilen dizideki `1` endeksine karşılık gelir.

## Xml_tag Filtresi

**Xml_tag** filtresi, XML verilerinden XML etiketlerinin hash tablosuna işaret eder. Bu hash tablosunun öğelerine etiketlerin isimlerini kullanarak başvurulmalıdır. Bu filtre sadece XML ayrıştırıcısı ile birlikte noktada kullanılabilir. 

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki etiket ismi, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.  

XML verilerinden elde edilen etiketler ayrıca değerler dizisi de içerebilir. Bu dizilerden gelen değerlere başvurmak için [Dizi][link-xmltag-array] veya [Xml_tag_array][anchor6] filtresini kullanın.

**Örnek:** 

Aşağıdakiler için

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Örnek metin.
</text>
<sample>
    &eee;
</sample>
```

body, the Xml_tag filtresi, XML ayrıştırıcısı ile birlikte istek gövdesine uygulandığında aşağıdaki hash tablosuna işaret eder:

| Anahtar | Değer        |
|--------|--------------|
| text   | Örnek metin. |
| sample | aaaa         |

* `POST_XML_XML_TAG_text_value` noktası, `text` anahtarına karşılık gelen `Örnek metin.` değerine işaret eder, Xml_tag filtresi ile adreslendirilen hash tablodaki bu değer.
* `POST_XML_XML_TAG_sample_value` noktası, `sample` anahtarına karşılık gelen `aaaa` değerine işaret eder, Xml_tag filtresi ile adreslendirilen hash tablodaki bu değer.

## Xml_tag_array Filtresi

**Xml_tag_array** filtresi, XML verilerinden elde edilen etiket değerlerinin bir dizisine işaret eder. Bu dizinin öğelerine endeksleri kullanarak başvurulmalıdır. Dizi endekslemesi `0` ile başlar. Bu filtre sadece XML ayrıştırıcısı ile birlikte noktada kullanılabilir. 

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki endeks, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.  

XML verilere uygulanan [Dizi][link-array] filtresi Xml_tag_array'ye benzer bir şekilde çalışır.

!!! info "Etiket içeriğine atıfta bulunma yolları"
    XML ayrıştırıcı, etiket değeri ile etiket değerler dizisindeki ilk öğe arasında ayrım yapmaz.

Örneğin, `POST_XML_XML_TAG_myTag_value` ve `POST_XML_XML_TAG_myTag_ARRAY_0_value` noktaları aynı değere işaret eder.

**Örnek:** 

Aşağıdakiler için

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Örnek metin.
</text>
<text>
    &eee;
</text>
```

body, the Xml_tag_array filtresi, `text` etiketine uygulandığında aşağıdaki diziye işaret eder:

| Endeks  | Değer        |
|--------|--------------|
| 0      | Örnek metin. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` noktası, `Örnek metin.` değerine işaret eder, bu değer Xml_tag_array filtresi ile adreslendirilen text etiket değerleri dizisindeki `0` endeksine karşılık gelir.
* `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` noktası, `aaaa` değerine işaret eder, bu değer Xml_tag_array filtresi ile adreslendirilen text etiket değerleri dizisindeki `1` endeksine karşılık gelir.

## Xml_attr Filtresi

**Xml_attr** filtresi, XML verilerinden elde edilen etiket özelliklerinin hash tablosuna işaret eder. Bu hash tablosunun öğelerine özelliklerin isimleri kullanarak başvurulmalıdır.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki özellik ismi, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.  

Bu filtre sadece Xml_tag filtresi ile birlikte noktada kullanılabilir.

**Örnek:** 

Aşağıdakiler için

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text category="bilgi" font="12">
    Örnek metin.
</text>
```

body, the Xml_attr filtresi, istek gövdesindeki `text` etiketine uygulandığında XML ayrıştırıcısı ve Xml_tag filtresi ile birlikte aşağıdaki hash tablosuna işaret eder:

| Anahtar | Değer         |
|----------|---------------|
| category | bilgi |
| font     | 12            |

* `POST_XML_XML_TAG_text_XML_ATTR_category_value` noktası, `bilgi` değerine işaret eder, bu değer `text` etiket özellikleri hash tablosunda `category` anahtara karşılık gelir ve Xml_attr filtresi ile adreslendirilmiştir.
* `POST_XML_XML_TAG_text_XML_ATTR_font_value` noktası, `12` değerine işaret eder, bu değer `text` etiket özellikleri hash tablosunda `font` anahtara karşılık gelir ve Xml_attr filtresi ile adreslendirilmiştir.