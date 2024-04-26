[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-formurlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter

# Form_urlencoded Ayrıştırıcı

**Form_urlencoded** ayrıştırıcı, istek gövdesiyle form-urlencoded formatında çalışma amacıyla kullanılır. Bu ayrıştırıcı, istek gövdesi parametrelerinin isimlerinin anahtarlar ve karşılık gelen parametrelerin değerlerinin ise hash tablo değerleri olduğu bir hash tablosu oluşturur. Bu hash tablonun öğelerine parametrelerinin isimleri kullanılarak başvurulmalıdır.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki parametre ismi [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.

!!! warning "Noktada Form_urlencoded ayrıştırıcının kullanımı"
    Form_urlencoded ayrıştırıcı sadece temel istek gövdesine başvuran Post filtresiyle birlikte noktada kullanılabilir.

Form-urlencoded formatındaki istek gövdesi de şu karmaşık veri yapılarını içerebilir: diziler ve hash tablolar. Bu yapıların öğelerine başvurmak için ilgili olarak [Dizi][link-formurlencoded-array] ve [Hash][link-formurlencoded-hash] filtrelerini kullanın.

**Örnek:** 

Şu

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

istek için

```
id=01234&username=John
```

gövdesiyle, Form_urlencoded ayrıştırıcı istek gövdesine uygulandığında aşağıdaki hash tablosunu oluşturur:

| Anahtar  | Değer    |
|----------|----------|
| id       | 01234    |
| username | John     |

* `POST_FORM_URLENCODED_id_value` noktası, Form_urlencoded ayrıştırıcısı tarafından oluşturulan hash tablodaki `id` anahtarına karşılık gelen `01234` değerine başvurur.
* `POST_FORM_URLENCODED_username_value` noktası, Form_urlencoded ayrıştırıcısı tarafından oluşturulan hash tablodaki `username` anahtarına karşılık gelen `John` değerine başvurur.