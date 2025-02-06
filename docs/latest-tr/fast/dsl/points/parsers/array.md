[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xml_tag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-json_obj-filter-and-the-array-filter


# Dizi Filtresi

**Dizi** filtresi, dizi içerebilen herhangi bir temel istek öğesindeki değerler dizisine atıfta bulunur.

Dizi filtresi, aşağıdaki filtreler ve ayrıştırıcılar ile birlikte nokta içinde kullanılabilir:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

Bu dizinin elemanlarına, indeksler kullanılarak başvurulmalıdır. Dizi indekslemesi `0` ile başlar.

!!! info "Noktadaki düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir.  

## Get Filtresi ile Dizi Filtresinin Kullanım Örneği

Aşağıdaki

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

isteği için, Get sorgu dizesi parametresi `id`'ye uygulanan Dizi filtresi aşağıdaki diziye atıfta bulunmaktadır:

| Index  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `GET_id_ARRAY_0_value`, Dizi filtresiyle ele alınan `id` sorgu dizesi parametre değerleri dizisindeki `0` indeksine karşılık gelen `01234` değerine atıfta bulunur.
* `GET_id_ARRAY_1_value`, Dizi filtresiyle ele alınan `id` sorgu dizesi parametre değerleri dizisindeki `1` indeksine karşılık gelen `56789` değerine atıfta bulunur.

## Header Filtresi ile Dizi Filtresinin Kullanım Örneği

Aşağıdaki

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

isteği için, `X-Identifier` başlığına uygulanan Dizi filtresi aşağıdaki diziye atıfta bulunmaktadır:

| Index  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `HEADER_X-Identifier_ARRAY_0_value`, Dizi filtresiyle ele alınan `X-Identifier` başlık değerleri dizisindeki `0` indeksine karşılık gelen `01234` değerine atıfta bulunur.
* `HEADER_X-Identifier_ARRAY_1_value`, Dizi filtresiyle ele alınan `X-Identifier` başlık değerleri dizisindeki `1` indeksine karşılık gelen `56789` değerine atıfta bulunur.

## Form_urlencoded Ayrıştırıcısı ve Dizi Filtresi Kullanım Örneği

Aşağıdaki

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

isteği ile birlikte

```
id[]=01234&id[]=56789
```

gövdesi için, form-urlencoded formatındaki istek gövdesindeki `id` parametresine uygulanan Dizi filtresi aşağıdaki diziye atıfta bulunmaktadır:

| Index  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_FORM_URLENCODED_id_ARRAY_0_value`, Dizi filtresiyle ele alınan `id` parametre değerleri dizisindeki `0` indeksine karşılık gelen `01234` değerine atıfta bulunur.
* `POST_FORM_URLENCODED_id_ARRAY_1_value`, Dizi filtresiyle ele alınan `id` parametre değerleri dizisindeki `1` indeksine karşılık gelen `56789` değerine atıfta bulunur.

## Multipart Ayrıştırıcısı ve Dizi Filtresi Kullanım Örneği

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

isteği için, multipart formatındaki istek gövdesindeki `id` parametresine uygulanan Dizi filtresi aşağıdaki diziye atıfta bulunmaktadır:

| Index  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_MULTIPART_id_ARRAY_0_value`, Dizi filtresiyle ele alınan `id` parametre değerleri dizisindeki `0` indeksine karşılık gelen `01234` değerine atıfta bulunur.
* `POST_MULTIPART_id_ARRAY_1_value`, Dizi filtresiyle ele alınan `id` parametre değerleri dizisindeki `1` indeksine karşılık gelen `56789` değerine atıfta bulunur.

## Xml_tag Filtresi ve Dizi Filtresi Kullanım Örneği

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteği ile birlikte

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

gövdesi için, XML formatındaki istek gövdesindeki `text` etiketine uygulanan Dizi filtresi aşağıdaki diziye atıfta bulunmaktadır:

| Index  | Değer        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_ARRAY_0_value`, Dizi filtresiyle ele alınan `text` etiket değerleri dizisindeki `0` indeksine karşılık gelen `Sample text.` değerine atıfta bulunur.
* `POST_XML_XML_TAG_text_ARRAY_1_value`, Dizi filtresiyle ele alınan `text` etiket değerleri dizisindeki `1` indeksine karşılık gelen `aaaa` değerine atıfta bulunur.

## Json_obj Filtresi ve Dizi Filtresi Kullanım Örneği

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteği ile birlikte

```
{
    "username": "user",
    "rights":["read","write"]
}
```

gövdesi için, Json_doc ayrıştırıcısı ve Json_obj filtresiyle birlikte istek gövdesindeki `rights` JSON nesnesine uygulanan Dizi filtresi aşağıdaki diziye atıfta bulunmaktadır:

| Index  | Değer    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value`, Dizi filtresiyle ele alınan `rights` JSON nesnesi değerleri dizisindeki `0` indeksine karşılık gelen `read` değerine atıfta bulunur.
* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value`, Dizi filtresiyle ele alınan `rights` JSON nesnesi değerleri dizisindeki `1` indeksine karşılık gelen `write` değerine atıfta bulunur.