[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-json_obj-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-json_obj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-json_array-filter-and-the-hash-filter

[anchor1]:          #json_obj-filter
[anchor2]:          #json_array-filter


# Json_doc Ayrıştırıcı

**Json_doc** ayrıştırıcısı, isteğin herhangi bir bölümünde bulunabilen JSON biçimindeki verilerle çalışmak için kullanılır. Json_doc ayrıştırıcısı, üst düzey JSON veri kapsayıcısının içeriğine ham biçimde başvurur.

Json_doc ayrıştırıcısı, giriş verileri temelinde karmaşık bir veri yapısı oluşturur. Bu veri yapısının öğelerine başvurmak için aşağıdaki filtreleri kullanabilirsiniz:
* [Json_obj filtresi][anchor1];
* [Json_array filtresi][anchor2].

Noktada filtreyi kullanmak için, Json_doc ayrıştırıcısının ve onun sağladığı filtrenin adlarını büyük harflerle noktaya ekleyin.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteği ve şu

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

gövdesi için, isteğin gövdesine uygulanan Json_doc ayrıştırıcısı aşağıdaki verilere başvurur:

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

<a name="json_obj-filter"></a>
## Json_obj Filtresi

**Json_obj** filtresi, JSON nesnelerinin hash tablosuna başvurur. Bu hash tablosunun elemanlarına, JSON nesnelerinin adları kullanılarak başvurulmalıdır.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki JSON nesnesinin adı, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir.  

JSON verilerine uygulanan [Hash][link-hash] filtresi, Json_obj ile benzer şekilde çalışır.

JSON biçimindeki hash tablolardan gelen değerler ayrıca şu karmaşık veri yapılarını da içerebilir: diziler ve hash tabloları. Bu yapılardaki öğelere başvurmak için aşağıdaki filtreleri kullanın:
* Diziler için [Array][link-jsonobj-array] filtresi veya [Json_array][anchor2] filtresi
* Hash tabloları için [Hash][link-jsonobj-hash] filtresi veya [Json_obj][anchor1] filtresi

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteği ve şu

```
{
    "username": "user",
    "rights": "read"
}
```

gövdesi için, Json_doc ayrıştırıcısı ile birlikte isteğin gövdesine uygulanan Json_obj filtresi aşağıdaki tabloya başvurur:

| Anahtar  | Değer    |
|----------|----------|
| username | user     |
| rights   | read     |

* `POST_JSON_DOC_JSON_OBJ_username_value` noktası, `user` değerine başvurur.
* `POST_JSON_DOC_JSON_OBJ_rights_value` noktası, `read` değerine başvurur.

<a name="json_array-filter"></a>
## Json_array Filtresi

**Json_array** filtresi, JSON nesne değerlerinin dizisine başvurur. Bu dizinin elemanlarına indeksler kullanılarak başvurulmalıdır. Dizi indekslemesi `0` ile başlar.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir. 

JSON verilerine uygulanan [Array][link-array] filtresi, Json_array filtresiyle benzer şekilde çalışır.

JSON biçimindeki dizilerden gelen değerler ayrıca hash tablolarını da içerebilir. [Hash][link-jsonarray-hash] veya [Json_obj][anchor1] kullanın.

Örnek:

Şu

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

isteği ve şu

```
{
    "username": "user",
    "rights":["read","write"]
}
```

gövdesi için, Json_doc ayrıştırıcısı ve Json_obj filtresi ile birlikte `rights` JSON nesnesine uygulanan Json_array filtresi aşağıdaki diziye başvurur:

| Dizin  | Değer    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value` noktası, Json_array filtresiyle başvurulan `rights` JSON nesnesi değerleri dizisindeki `0` indeksine karşılık gelen `read` değerine başvurur.
* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value` noktası, Json_array filtresiyle başvurulan `rights` JSON nesnesi değerleri dizisindeki `1` indeksine karşılık gelen `write` değerine başvurur.