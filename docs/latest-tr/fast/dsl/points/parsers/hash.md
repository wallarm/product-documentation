[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[bağlantı1]:      #the-example-of-using-the-get-filter-and-the-hash-filter
[bağlantı2]:      #the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter
[bağlantı3]:      #the-example-of-using-the-multipart-filter-and-the-hash-filter
[bağlantı4]:      #the-example-of-using-the-jsondoc-parser-and-the-hash-filter
[bağlantı5]:      #the-example-of-using-the-json_obj-filter-and-the-hash-filter
[bağlantı6]:      #the-example-of-using-the-jsonarray-filter-and-the-hash-filter


# Hash Filtresi

**Hash** filtresi, hash tabloları içerebilecek olan temel istek elemanlarının değerlerinin hash tablosuna işaret eder.

Aşağıdaki filtreler ve parser'lar ile birlikte Hash filtresi kullanılabilir:
* [Get][bağlantı1];
* [Form_urlencoded][bağlantı2];
* [Multipart][bağlantı3];
* [Json_doc][bağlantı4];
* [Json_obj][bağlantı5];
* [Json_array][bağlantı6].

Elemanlara işaret etmek için anahtarları kullanın.

!!! bilgi "Noktalarda düzenli ifadeler"
    Noktadaki anahtar, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir.  

## Get Filtresinin ve Hash Filtresinin Kullanım Örneği

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

işlemi için, `id` sorgu dizesi parametresine uygulanan Hash filtresi aşağıdaki hash tablosuna işaret eder:

| Anahtar   | Değer    |
|-------|----------|
| kullanıcı  | 01234    |
| grup | 56789    |

* `GET_id_HASH_user_value` noktası, Hash filtresi tarafından belirtilen `id` sorgu dizesi parametresi değerleri hash tablosundaki `kullanıcı` anahtarına karşılık gelen `01234` değerini ifade eder.
* `GET_id_HASH_group_value` noktası, Hash filtresi tarafından belirtilen `id` sorgu dizesi parametresi değerleri hash tablosundaki `grup` anahtarına karşılık gelen `56789` değerini ifade eder.


## Form_urlencoded Parserin ve Hash Filtresinin Kullanım Örneği

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

işlemi için,

```
id[user]=01234&id[group]=56789
```

gövdesiyle, Form-urlencoded formatındaki istek gövdesinden `id` parametresine uygulanan Hash filtresi aşağıdaki diziye işaret eder:

| Anahtar   | Değer    |
|-------|----------|
| kullanıcı  | 01234    |
| grup | 56789    |

* `POST_FORM_URLENCODED_id_HASH_user_value` noktası, Hash filtresi tarafından belirtilen istek gövdesi parametreleri hash tablosundaki `kullanıcı` anahtarına karşılık gelen `01234` değerini ifade eder.
* `POST_FORM_URLENCODED_id_HASH_group_value` noktası, Hash filtresi tarafından belirtilen istek gövdesi parametreleri hash tablosundaki `grup` anahtarına karşılık gelen `56789` değerini ifade eder.

## Multipart Filtresinin ve Hash Filtresinin Kullanım Örneği

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

işlemi için, request body'deki `id` parametresine uygulanan Hash filtresi ve Multipart parser'ı aşağıdaki hash tablosuna işaret eder:

| Anahtar   | Değer    |
|-------|----------|
| kullanıcı  | 01234    |
| grup | 56789    |

* `POST_MULTIPART_id_HASH_user_value` noktası, Hash filtresi tarafından belirtilen istek gövdesi parametreleri hash tablosundaki `kullanıcı` anahtarına karşılık gelen `01234` değerini ifade eder.
* `POST_MULTIPART_id_HASH_group_value` noktası, Hash filtresi tarafından belirtilen istek gövdesi parametreleri hash tablosundaki `grup` anahtarına karşılık gelen `56789` değerini ifade eder.

## Json_doc Parserin ve Hash Filtresinin Kullanım Örneği

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

işlemi için,

```
{
    "username": "user",
    "rights": "read"
}
```

gövdesiyle, istek gövdesine uygulanan Hash filtresi ve Json_doc parser'ı aşağıdaki hash tablosuna işaret eder:

| Anahtar      | Değer    |
|----------|----------|
| kullanıcıadı | kullanıcı     |
| haklar   | okuma     |

* `POST_JSON_DOC_HASH_username_value` noktası, Hash filtresi tarafından adreslenen istek gövdesi parametreleri hash tablosundaki `kullanıcıadı` anahtarına karşılık gelen `kullanıcı` değerini ifade eder.
* `POST_JSON_DOC_HASH_rights_value` noktası, Hash filtresi tarafından adreslenen istek gövdesi parametreleri hash tablosundaki `haklar` anahtarına karşılık gelen `okuma` değerini ifade eder.

## Json_obj Filtresinin ve Hash Filtresinin Kullanım Örneği

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

işlemi için,

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

gövdesiyle, istek gövdesine uygulanan Hash filtresi, Json_doc parser'ı ve Json_obj filtresi aşağıdaki hash tablosuna işaret eder:

| Anahtar    | Değer    |
|--------|----------|
| durum | aktif   |
| haklar | okuma     |

* `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` noktası, Hash filtresi tarafından adreslenen info JSON nesnesi alt nesne hash tablosu `durum` anahtarına karşılık olan `aktif` değerini ifade eder.
* `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` noktası, Hash filtresi tarafından adreslenen info JSON nesnesi alt nesne hash tablosu `haklar` anahtarına karşılık olan `okuma` değerini ifade eder.

## Json_array Filtresinin ve Hash Filtresinin Kullanım Örneği

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

işlemi için,

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

gövdesiyle, istek gövdesinden `posts` JSON nesneleri dizisinin ilk elemanına uygulanan Hash filtresi, Json_doc parser'ı, Json_obj ve Json_array filtreleri aşağıdaki hash tablosuna işaret eder:

| Anahtar    | Değer    |
|--------|----------|
| başlık  | Selamlama |
| uzunluk | 256      |

* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` noktası, `Selamlama` değerini ifade eder ki bu değer, Hash filtresi tarafından belirtilen JSON nesneleri hash tablosundaki `başlık` anahtara karşılık gelir.
* `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` noktası, `256` değerini ifade eder ki bu değer, Hash filtresi tarafından belirtilen JSON nesneleri hash tablosundaki `uzunluk` anahtara karşılık gelir.