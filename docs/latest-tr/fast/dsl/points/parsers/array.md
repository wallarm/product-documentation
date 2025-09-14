[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xml_tag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-json_obj-filter-and-the-array-filter


# Array Filtresi

**Array** filtresi, diziler içerebilecek temel istek öğelerinin herhangi birindeki değerler dizisine atıfta bulunur.

Array filtresi, bir noktada aşağıdaki filtreler ve ayrıştırıcılarla birlikte kullanılabilir:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

Bu dizinin öğelerine indeksler kullanılarak başvurulmalıdır. Dizi indeksleme `0` ile başlar.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks bir [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir.  

## Array Filtresi ile Get Filtresinin Kullanım Örneği

Şu

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

isteğinde, `id` sorgu dizesi parametresine uygulanan Array filtresi aşağıdaki diziye başvurur:

| Dizin  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `GET_id_ARRAY_0_value`, Array filtresinin işaret ettiği `id` sorgu dizesi parametresi değerleri dizisindeki `0` indekse karşılık gelen `01234` değerine başvurur.
* `GET_id_ARRAY_1_value`, Array filtresinin işaret ettiği `id` sorgu dizesi parametresi değerleri dizisindeki `1` indekse karşılık gelen `56789` değerine başvurur.

## Array Filtresi ile Header Filtresinin Kullanım Örneği

Şu

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

isteğinde, `X-Identifier` üstbilgisine uygulanan Array filtresi aşağıdaki diziye başvurur:

| Dizin  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `HEADER_X-Identifier_ARRAY_0_value`, Array filtresinin işaret ettiği `X-Identifier` üstbilgisi değerleri dizisindeki `0` indekse karşılık gelen `01234` değerine başvurur.
* `HEADER_X-Identifier_ARRAY_1_value`, Array filtresinin işaret ettiği `X-Identifier` üstbilgisi değerleri dizisindeki `1` indekse karşılık gelen `56789` değerine başvurur.

## Array Filtresi ile Form_urlencoded Ayrıştırıcısının Kullanım Örneği

Şu

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

isteğinde, şu

```
id[]=01234&id[]=56789
```

gövdesi ile, form-urlencoded biçimindeki istek gövdesindeki `id` parametresine uygulanan Array filtresi aşağıdaki diziye başvurur:

| Dizin  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_FORM_URLENCODED_id_ARRAY_0_value`, Array filtresinin işaret ettiği `id` parametresi değerleri dizisindeki `0` indekse karşılık gelen `01234` değerine başvurur.
* `POST_FORM_URLENCODED_id_ARRAY_1_value`, Array filtresinin işaret ettiği `id` parametresi değerleri dizisindeki `1` indekse karşılık gelen `56789` değerine başvurur.

## Array Filtresi ile Multipart Ayrıştırıcısının Kullanım Örneği

Şu

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

isteğinde, multipart biçimindeki istek gövdesindeki `id` parametresine uygulanan Array filtresi aşağıdaki diziye başvurur:

| Dizin  | Değer    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* `POST_MULTIPART_id_ARRAY_0_value`, Array filtresinin işaret ettiği `id` parametresi değerleri dizisindeki `0` indekse karşılık gelen `01234` değerine başvurur.
* `POST_MULTIPART_id_ARRAY_1_value`, Array filtresinin işaret ettiği `id` parametresi değerleri dizisindeki `1` indekse karşılık gelen `56789` değerine başvurur.

## Array Filtresi ile Xml_tag Filtresinin Kullanım Örneği

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

isteğinde, şu

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- ilk -->
<text>
Sample text.
</text>
<text>
    &eee;
</text>
```

gövdesi ile, XML biçimindeki istek gövdesindeki `text` etiketine uygulanan Array filtresi aşağıdaki diziye başvurur:

| Dizin  | Değer        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* `POST_XML_XML_TAG_text_ARRAY_0_value` noktası, Array filtresinin işaret ettiği `text` etiketinin değerleri dizisindeki `0` indekse karşılık gelen `Sample text.` değerine başvurur.
* `POST_XML_XML_TAG_text_ARRAY_1_value` noktası, Array filtresinin işaret ettiği `text` etiketinin değerleri dizisindeki `1` indekse karşılık gelen `aaaa` değerine başvurur.

## Array Filtresi ile Json_obj Filtresinin Kullanım Örneği

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteğinde, şu

```
{
    "username": "user",
    "rights":["read","write"]
}
```

gövdesi ile, Json_doc ayrıştırıcısı ve Json_obj filtresi ile birlikte istek gövdesindeki `rights` JSON nesnesine uygulanan Array filtresi aşağıdaki diziye başvurur:

| Dizin  | Değer    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value` noktası, Array filtresinin işaret ettiği `rights` JSON nesnesinin değerleri dizisindeki `0` indekse karşılık gelen `read` değerine
başvurur.
* `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value` noktası, Array filtresinin işaret ettiği `rights` JSON nesnesinin değerleri dizisindeki `1` indekse karşılık gelen `write` değerine başvurur.