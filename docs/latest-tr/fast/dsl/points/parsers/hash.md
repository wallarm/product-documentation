[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-and-the-hash-filter
[anchor2]:      #the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter
[anchor3]:      #the-example-of-using-the-multipart-filter-and-the-hash-filter
[anchor4]:      #the-example-of-using-the-json_doc-parser-and-the-hash-filter
[anchor5]:      #the-example-of-using-the-json_obj-filter-and-the-hash-filter
[anchor6]:      #the-example-of-using-the-json_array-filter-and-the-hash-filter


# Hash Filtresi

Hash filtresi, hash tabloları içerebilen temel istek öğelerindeki değerlerin hash tablosuna başvurur.

Hash filtresi, noktada aşağıdaki filtreler ve ayrıştırıcılarla birlikte kullanılabilir:
* [Get][anchor1];
* [Form_urlencoded][anchor2];
* [Multipart][anchor3];
* [Json_doc][anchor4];
* [Json_obj][anchor5];
* [Json_array][anchor6].

Hash filtresi tarafından adreslenen hash tablosunun öğelerine başvurmak için anahtarları kullanın.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki anahtar, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir.  

## Get Filtresi ve Hash Filtresinin Kullanımına Örnek

Aşağıdaki 

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

isteğinde, `id` sorgu dizesi parametresine uygulanan Hash filtresi aşağıdaki hash tablosuna başvurur:

| Anahtar | Değer    |
|--------|----------|
| user   | 01234    |
| group  | 56789    |

* `GET_id_HASH_user_value` noktası, Hash filtresinin adreslediği `id` sorgu dizesi parametresi değerleri hash tablosundaki `user` anahtarına karşılık gelen `01234` değerine başvurur.
* `GET_id_HASH_group_value` noktası, Hash filtresinin adreslediği `id` sorgu dizesi parametresi değerleri hash tablosundaki `group` anahtarına karşılık gelen `56789` değerine başvurur.


## Form_urlencoded Ayrıştırıcısı ile Hash Filtresinin Kullanımına Örnek

Aşağıdaki

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

isteğinin

```
id[user]=01234&id[group]=56789
```

gövdesi için, istek gövdesinde form-urlencoded biçimindeki `id` parametresine uygulanan Hash filtresi aşağıdaki diziye başvurur:

| Anahtar | Değer    |
|--------|----------|
| user   | 01234    |
| group  | 56789    |

* `POST_FORM_URLENCODED_id_HASH_user_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `user` anahtarına karşılık gelen `01234` değerine başvurur.
* `POST_FORM_URLENCODED_id_HASH_group_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `group` anahtarına karşılık gelen `56789` değerine başvurur. 

## Multipart Filtresi ve Hash Filtresinin Kullanımına Örnek

Aşağıdaki

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[user]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[group]"

56789
```

isteğinde, istek gövdesindeki `id` parametresine uygulanan Hash filtresi, Multipart ayrıştırıcı ile birlikte aşağıdaki hash tablosuna başvurur:

| Anahtar | Değer    |
|--------|----------|
| user   | 01234    |
| group  | 56789    |

* `POST_MULTIPART_id_HASH_user_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `user` anahtarına karşılık gelen `01234` değerine başvurur.
* `POST_MULTIPART_id_HASH_group_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `group` anahtarına karşılık gelen `56789` değerine başvurur.

## Json_doc Ayrıştırıcısı ve Hash Filtresinin Kullanımına Örnek

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteğinin

```
{
    "username": "user",
    "rights": "read"
}
```

gövdesi için, JSON biçimindeki istek gövdesine Json_doc ayrıştırıcısı ile birlikte uygulanan Hash filtresi aşağıdaki hash tablosuna başvurur:

| Anahtar  | Değer    |
|----------|----------|
| username | user     |
| rights   | read     |

* `POST_JSON_DOC_HASH_username_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `username` anahtarına karşılık gelen `user` değerine başvurur.
* `POST_JSON_DOC_HASH_rights_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `rights` anahtarına karşılık gelen `read` değerine başvurur.

## Json_obj Filtresi ve Hash Filtresinin Kullanımına Örnek

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteğinin

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

gövdesi için, JSON biçimindeki istek gövdesine Json_doc ayrıştırıcısı ve Json_obj filtresi ile birlikte uygulanan Hash filtresi aşağıdaki hash tablosuna başvurur:

| Anahtar | Değer    |
|--------|----------|
| status | active   |
| rights | read     |

* `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` noktası, Hash filtresinin adreslediği info JSON nesnesinin alt nesneleri hash tablosundaki `status` anahtarına karşılık gelen `active` değerine başvurur.
* `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` noktası, Hash filtresinin adreslediği info JSON nesnesinin alt nesneleri hash tablosundaki `rights` anahtarına karşılık gelen `read` değerine başvurur.

## Json_array Filtresi ve Hash Filtresinin Kullanımına Örnek

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteğinin

```
{
    "username": "user",
    "posts": [{
            "title": "Greeting",
            "length": "256"
        },
        {
            "title": "Hello World!",
            "length": "32"
        }
    ]
}
```

gövdesi için, istek gövdesindeki `posts` JSON nesneleri dizisinin ilk öğesine Json_doc ayrıştırıcısı ve Json_obj ile Json_array filtreleri ile birlikte uygulanan Hash filtresi aşağıdaki hash tablosuna başvurur:

| Anahtar | Değer     |
|--------|-----------|
| title  | Greeting  |
| length | 256       |

* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` noktası, Hash filtresinin adreslediği JSON nesneleri hash tablosundaki `title` anahtarına karşılık gelen `Greeting` değerine başvurur.
* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` noktası, Hash filtresinin adreslediği JSON nesneleri hash tablosundaki `length` anahtarına karşılık gelen `256` değerine başvurur.