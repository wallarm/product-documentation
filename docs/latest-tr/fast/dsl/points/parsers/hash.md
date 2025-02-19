[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-and-the-hash-filter
[anchor2]:      #the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter
[anchor3]:      #the-example-of-using-the-multipart-filter-and-the-hash-filter
[anchor4]:      #the-example-of-using-the-json_doc-parser-and-the-hash-filter
[anchor5]:      #the-example-of-using-the-json_obj-filter-and-the-hash-filter
[anchor6]:      #the-example-of-using-the-json_array-filter-and-the-hash-filter

# Hash Filter

**Hash** filtresi, hash tabloları içerebilen herhangi bir temel istek öğesindeki değerlerin hash tablosuna atıfta bulunur.

Hash filtresi, aşağıdaki filtreler ve çözücülerle birlikte nokta içinde kullanılabilir:
* [Get][anchor1];
* [Form_urlencoded][anchor2];
* [Multipart][anchor3];
* [Json_doc][anchor4];
* [Json_obj][anchor5];
* [Json_array][anchor6].

Hash filtresinin ele aldığı hash tablosundaki ögelere erişmek için anahtarlar kullanılır.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki anahtar, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir.  

## Get Filtresi ve Hash Filtresi Kullanım Örneği

Aşağıdaki 

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

isteği için, `id` sorgu dizesi parametresine uygulanan Hash filtresi aşağıdaki hash tablosuna atıfta bulunur:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* `GET_id_HASH_user_value` noktası, Hash filtresinin adreslediği `id` sorgu dizesi parametreleri hash tablosundaki `user` anahtarına karşılık gelen `01234` değerini ifade eder.
* `GET_id_HASH_group_value` noktası, Hash filtresinin adreslediği `id` sorgu dizesi parametreleri hash tablosundaki `group` anahtarına karşılık gelen `56789` değerini ifade eder.

## Form_urlencoded Çözücüsü ile Hash Filtresi Kullanım Örneği

Aşağıdaki

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

isteği ve

```
id[user]=01234&id[group]=56789
```

gövdesi için, form-urlencoded formatındaki istek gövdesinden `id` parametresine uygulanan Hash filtresi aşağıdaki diziye atıfta bulunur:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* `POST_FORM_URLENCODED_id_HASH_user_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `user` anahtarına karşılık gelen `01234` değerini ifade eder.
* `POST_FORM_URLENCODED_id_HASH_group_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `group` anahtarına karşılık gelen `56789` değerini ifade eder.

## Multipart Filtresi ve Hash Filtresi Kullanım Örneği

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

isteği için, Multipart çözücü ile birlikte istek gövdesinden `id` parametresine uygulanan Hash filtresi aşağıdaki hash tablosuna atıfta bulunur:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* `POST_MULTIPART_id_HASH_user_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `user` anahtarına karşılık gelen `01234` değerini ifade eder.
* `POST_MULTIPART_id_HASH_group_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `group` anahtarına karşılık gelen `56789` değerini ifade eder.

## Json_doc Çözücüsü ve Hash Filtresi Kullanım Örneği

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteği ve

```
{
    "username": "user",
    "rights": "read"
}
```

gövdesi için, JSON formatındaki istek gövdesine, Json_doc çözücüsü ile birlikte uygulanan Hash filtresi aşağıdaki hash tablosuna atıfta bulunur:

| Key      | Value    |
|----------|----------|
| username | user     |
| rights   | read     |

* `POST_JSON_DOC_HASH_username_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `username` anahtarına karşılık gelen `user` değerini ifade eder.
* `POST_JSON_DOC_HASH_rights_value` noktası, Hash filtresinin adreslediği istek gövdesi parametreleri hash tablosundaki `rights` anahtarına karşılık gelen `read` değerini ifade eder.

## Json_obj Filtresi ve Hash Filtresi Kullanım Örneği

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteği ve

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

gövdesi için, JSON formatındaki istek gövdesine, Json_doc çözücüsü ve Json_obj filtresi ile birlikte uygulanan Hash filtresi aşağıdaki hash tablosuna atıfta bulunur:

| Key    | Value    |
|--------|----------|
| status | active   |
| rights | read     |

* `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` noktası, Hash filtresinin adreslediği info JSON nesnesinin çocuk nesneleri hash tablosundaki `status` anahtarına karşılık gelen `active` değerini ifade eder.
* `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` noktası, Hash filtresinin adreslediği info JSON nesnesinin çocuk nesneleri hash tablosundaki `rights` anahtarına karşılık gelen `read` değerini ifade eder.

## Json_array Filtresi ve Hash Filtresi Kullanım Örneği

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteği ve

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

gövdesi için, Json_doc çözücüsü ile birlikte Json_obj ve Json_array filtreleri kullanılarak istek gövdesindeki `posts` JSON nesneleri dizisinin ilk elemanına uygulanan Hash filtresi aşağıdaki hash tablosuna atıfta bulunur:

| Key    | Value    |
|--------|----------|
| title  | Greeting |
| length | 256      |

* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` noktası, Hash filtresinin adreslediği JSON nesneleri hash tablosundaki `title` anahtarına karşılık gelen `Greeting` değerini ifade eder.
* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` noktası, Hash filtresinin adreslediği JSON nesneleri hash tablosundaki `length` anahtarına karşılık gelen `256` değerini ifade eder.