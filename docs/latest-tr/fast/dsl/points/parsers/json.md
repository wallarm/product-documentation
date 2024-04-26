[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-jsondoc-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-json_obj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-jsonarray-filter-and-the-hash-filter

[anchor1]:          #jsonobj-filter
[anchor2]:          #jsonarray-filter


# Json_doc Çözümleyici

**Json_doc** çözümleyicisi, isteğin herhangi bir bölümünde bulunabilecek JSON formatındaki verilerle çalışmak için kullanılır. Json_doc çözümleyicisi, ham formatlarındaki üst seviye JSON veri konteynırının içeriğine atıfta bulunur.

Json_doc çözümleyicisi, giriş verilerine dayanarak karmaşık bir veri yapısı oluşturur. Bu veri yapısının öğelerine hitap etmek için aşağıdaki filtreleri kullanabilirsiniz: 
* [Json_obj filtresi][anchor1];
* [Json_array filtresi][anchor2].

Filtreyi noktada kullanmak için Json_doc çözümleyicisi ve onun tarafından sağlanan filtrenin adlarını büyük harflerle ekleyin.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

istekle 

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

gövdesi, Json_doc çözümleyicisi istek gövdesine uygulandığında aşağıdaki verilere atıfta bulunur:

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```


## Json_obj Filtresi

**Json_obj** filtresi, JSON nesnelerinin hash tablosuna atıfta bulunur. Bu hash tablosunun öğelerine JSON nesnelerinin isimlerini kullanarak başvurulmalıdır.

!!! bilgi "Noktalardaki düzenli ifadeler"
    Noktadaki JSON nesnesinin adı, [Ruby programlama dilinin düzenli bir ifadesi][link-ruby] olabilir.  

[Hash][link-hash] filtresi, JSON verilerine uygulandığında Json_obj'a benzer şekilde çalışır.

JSON biçimindeki hash tablolarından gelen değerler de aşağıdaki karmaşık veri yapılarını içerebilir: diziler ve hash tabloları. Bu yapıların öğelerine başvurmak için aşağıdaki filtreleri kullanın:
* Diziler için [Dizi][link-jsonobj-array] filtresi veya [Json_array][anchor2] filtresi
* Hash tabloları için [Hash][link-jsonobj-hash] filtresi veya [Json_obj][anchor1] filtresi

**Örnek:** 

Aşağıdaki

```
POST www.example.com/main/login HTTP/1.1
Content-type: application/json
```

istekle 

```
{
    "username": "user",
    "rights": "read"
}
```

gövdesi, Json_obj filtresi istek gövdesine uygulanırken, Json_doc çözümleyicisi ile birlikte aşağıdaki tabloya başvurur:

| Anahtar      | Değer    |
|----------|----------|
| username | user     |
| rights   | read     |

* `POST_JSON_DOC_JSON_OBJ_username_value` noktası, `user` değerini belirtir.
* `POST_JSON_DOC_JSON_OBJ_rights_value` noktası, `read` değerini belirtir.


## Json_array Filtresi

**Json_array** filtresi, JSON nesnesi değerlerinin dizisine atıfta bulunur. Bu dizinin öğelerine indeksleri kullanarak başvurulmalıdır. Dizi indekslemesi `0` ile başlar.

!!!  bilgi "Noktalardaki düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dilinin düzenli bir ifadesi][link-ruby] olabilir. 

[Array][link-array] filtresi, JSON verilerine uygulandığında Json_array filtresi gibi çalışır.

JSON formatındaki dizilerden gelen değerler de hash tabloları içerebilir. [Hash][link-jsonarray-hash] veya [Json_obj][anchor1] kullanın.

**Örnek:** 

Aşağıdaki 

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

istekle 

```
{
    "username": "user",
    "rights":["read","write"]
}
```

gövdesi, Json_array filtresi `rights` JSON nesnesine uygulanırken, Json_doc çözümleyicisi ve Json_obj filtresi ile birlikte aşağıdaki diziye başvurur:

| Index  | Değer   |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value` noktası, Json_array filtresi tarafından başvurulan `rights` JSON nesne değerlerinin dizisinin `0` indeksine karşılık gelen `read` değerini belirtir.
* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value` noktası, Json_array filtresi tarafından başvurulan `rights` JSON nesne değerlerinin dizisinin `1` indeksine karşılık gelen `write` değerini belirtir.