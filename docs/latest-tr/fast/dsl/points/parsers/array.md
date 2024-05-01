[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-formurlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xmltag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-json_obj-filter-and-the-array-filter


# Dizi Filtresi

**Dizi** filtresi, diziler içerebilecek olan temel istek öğelerinin değer dizisine atıfta bulunur.

Dizi filtresi, aşağıdaki filtreler ve ayrıştırıcılarla birlikte noktada kullanılabilir:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

Bu dizinin öğeleri, indeksleri kullanarak anılmalıdır. Dizi indekslemesi `0` ile başlar.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir.

## Get Filtresinin Dizi Filtresi ile Kullanımına Dair Örnek

Aşağıdaki

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

istek için, Dizi filtresi `id` sorgu dizesi parametresine aşağıdaki diziye atıfta bulunur:

| İndeks  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `GET_id_ARRAY_0_value`, Dizi filtresine adreslenen `id` sorgu dizesi parametre değerleri dizisinden `0` indeksine karşılık gelen `01234` değerine atıfta bulunur.
* `GET_id_ARRAY_1_value`, Dizi filtresine adreslenen `id` sorgu dizesi parametre değerleri dizisinden `1` indeksine karşılık gelen `56789` değerine atıfta bulunur.

## Header Filtresinin Dizi Filtresi ile Kullanımına Dair Örnek

Aşağıdaki

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

istek için, Dizi filtresi `X-Identifier` başlığına aşağıdaki diziye atıfta bulunur:

| İndeks  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `HEADER_X-Identifier_ARRAY_0_value`, Dizi filtresine adreslenen `X-Identifier` başlık değerleri dizisinden `0` indeksine karşılık gelen `01234` değerine atıfta bulunur.
* `HEADER_X-Identifier_ARRAY_1_value`, Dizi filtresine adreslenen `X-Identifier` başlık değerleri dizisinden `1` indeksine karşılık gelen `56789` değerine atıfta bulunur.

## Form_urlencoded Ayrıştırıcısının ve Dizi Filtresinin Kullanımına Dair Örnek

Aşağıdaki

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

istek için, aşağıdaki

```
id[]=01234&id[]=56789
```

vücutla, Dizi filtresi form-urlencoded formatında istek gövdesindeki `id` parametresine aşağıdaki diziye atıfta bulunur:

| İndeks  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_FORM_URLENCODED_id_ARRAY_0_value`, Dizi filtresine adreslenen `id` parametre değerleri dizisinden `0` indeksine karşılık gelen `01234` değerine atıfta bulunur.
* `POST_FORM_URLENCODED_id_ARRAY_1_value`, Dizi filtresine adreslenen `id` parametre değerleri dizisinden `1` indeksine karşılık gelen `56789` değerine atıfta bulunur.

## Multipart Ayrıştırıcısının ve Dizi Filtresinin Kullanımına Dair Örnek

Aşağıdaki

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

istek için, Dizi filtresi multipart formatındaki istek gövdesindeki `id` parametresine aşağıdaki diziye atıfta bulunur:

| İndeks  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_MULTIPART_id_ARRAY_0_value`, Dizi filtresine adreslenen `id` parametre değerleri dizisinden `0` indeksine karşılık gelen `01234` değerine atıfta bulunur.
* `POST_MULTIPART_id_ARRAY_1_value`, Dizi filtresine adreslenen `id` parametre değerleri dizisinden `1` indeksine karşılık gelen `56789` değerine atıfta bulunur.

## Xml_tag Filtresinin ve Dizi Filtresinin Kullanımına Dair Örnek

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

istek için, aşağıdaki

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

vücutla, Dizi filtresi XML formatındaki istek gövdesinden `text` etiketine aşağıdaki diziye atıfta bulunur:

| İndeks  | Değer        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_ARRAY_0_value` noktası, Dizi filtresi tarafından adreslenen `text` etiketi değerleri dizisinden `0` indeksine karşılık gelen `Sample text.` değerine atıfta bulunur.
* `POST_XML_XML_TAG_text_ARRAY_1_value` noktası, Dizi filtresi tarafından adreslenen `text` etiketi değerleri dizisinden `1` indeksine karşılık gelen `aaaa` değerine atıfta bulunur.

## Json_obj Filtresinin ve Dizi Filtresinin Kullanımına Dair Örnek

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

istek için, aşağıdaki

```
{
    "username": "user",
    "rights":["read","write"]
}
```

vücutla, Dizi filtresi, Json_doc ayrıştırıcısı ve Json_obj filtresi ile birlikte istek gövdesinden `rights` JSON nesnesine aşağıdaki diziye atıfta bulunur:

| İndeks  | Değer    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value` noktası, Dizi filtresince adreslenen `rights` JSON nesnesi değerleri dizisinden `0` indeksine karşılık gelen `read` değerine atıfta bulunur.
* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value` noktası, Dizi filtresince adreslenen `rights` JSON nesnesi değerleri dizisinden `1` indeksine karşılık gelen `write` değerine atıfta bulunur.