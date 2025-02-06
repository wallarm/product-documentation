[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-json_obj-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-json_obj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-json_array-filter-and-the-hash-filter

[anchor1]:          #json_obj-filter
[anchor2]:          #json_array-filter

# Json_doc Parser

Json_doc ayrıştırıcısı, isteğin herhangi bir bölümünde yer alabilen JSON formatındaki verilerle çalışmak için kullanılır. Json_doc ayrıştırıcısı, üst düzey JSON veri konteynerinin içeriğine ham formatında atıfta bulunur.

Json_doc ayrıştırıcısı, giriş verilerine dayanarak karmaşık bir veri yapısı oluşturur. Bu veri yapısının elemanlarına ulaşmak için aşağıdaki filtreleri kullanabilirsiniz: 
* [Json_obj filter][anchor1];
* [Json_array filter][anchor2].

Filtrenin kullanıldığı noktaya, Json_doc ayrıştırıcısının ve onun tarafından sağlanan filtrenin adlarını büyük harflerle ekleyin.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

istek için, aşağıdaki

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

gövdeye uygulanan Json_doc ayrıştırıcısı, aşağıdaki veriye karşılık gelir:

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```


## Json_obj Filter

Json_obj filtresi, JSON nesnelerinin hash tablosuna atıfta bulunur. Bu hash tablosunun elemanlarına, JSON nesnelerinin adlarını kullanarak ulaşılır.

!!! info "Noktalarındaki düzenli ifadeler"
    Noktadaki JSON nesnesinin adı, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir.  

JSON verilerine uygulanan [Hash][link-hash] filtresi, Json_obj filtresine benzer şekilde çalışır.

JSON formatındaki hash tablolardaki değerler, ayrıca aşağıdaki karmaşık veri yapılarını içerebilir: diziler ve hash tabloları. Bu yapılardaki elemanlara ulaşmak için aşağıdaki filtreleri kullanın:
* Diziler için [Array][link-jsonobj-array] filtresi veya [Json_array][anchor2] filtresi
* Hash tabloları için [Hash][link-jsonobj-hash] filtresi veya [Json_obj][anchor1] filtresi

**Örnek:** 

Aşağıdaki

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

istek için, aşağıdaki

```
{
    "username": "user",
    "rights": "read"
}
```

gövdeye uygulanan Json_doc ayrıştırıcısı ile birlikte Json_obj filtresi, aşağıdaki tabloya karşılık gelir:

| Key      | Value    |
|----------|----------|
| username | user     |
| rights   | read     |

* `POST_JSON_DOC_JSON_OBJ_username_value` noktası, `user` değerine karşılık gelir.
* `POST_JSON_DOC_JSON_OBJ_rights_value` noktası, `read` değerine karşılık gelir.

## Json_array Filter

Json_array filtresi, JSON nesne değerlerinin dizisine atıfta bulunur. Bu dizinin elemanlarına, indeksleri kullanılarak ulaşılır. Dizi indekslemesi `0`'dan başlar.

!!! info "Noktalarındaki düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dilinin düzenli ifadesi][link-ruby] olabilir. 

JSON verilerine uygulanan [Array][link-array] filtresi, Json_array filtresine benzer şekilde çalışır.

JSON formatındaki dizilerdeki değerler ayrıca hash tabloları içerebilir. [Hash][link-jsonarray-hash] veya [Json_obj][anchor1] filtresini kullanın.

**Örnek:** 

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

gövdeye uygulanan, Json_doc ayrıştırıcısı, Json_obj filtresi ve `rights` JSON nesnesine uygulanan Json_array filtresi, aşağıdaki diziye karşılık gelir:

| Index  | Value    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value` noktası, `rights` JSON nesnesi değerlerinin dizisindeki `0` indeksine karşılık gelen `read` değerine atıfta bulunur.
* `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value` noktası, `rights` JSON nesnesi değerlerinin dizisindeki `1` indeksine karşılık gelen `write` değerine atıfta bulunur.