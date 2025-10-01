[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter

# Form_urlencoded Ayrıştırıcı

**Form_urlencoded** ayrıştırıcısı, form-urlencoded biçimindeki istek gövdesi ile çalışmak için kullanılır. Bu ayrıştırıcı, istek gövdesi parametrelerinin adlarının anahtar ve karşılık gelen parametre değerlerinin değer olduğu bir hash tablosu oluşturur. Bu hash tablosunun öğelerine, parametre adları kullanılarak başvurulmalıdır.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki parametre adı, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.

!!! warning "Noktada Form_urlencoded ayrıştırıcısının kullanımı"
    Form_urlencoded ayrıştırıcısı yalnızca temel istek gövdesine başvuran Post filter ile birlikte noktada kullanılabilir.

Form-urlencoded biçimindeki istek gövdesi ayrıca diziler ve hash tabloları gibi şu karmaşık veri yapılarını da içerebilir. Bu yapılardaki öğelere erişmek için sırasıyla [Dizi][link-formurlencoded-array] ve [Hash][link-formurlencoded-hash] filtrelerini kullanın.

**Örnek:** 

Şu

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

isteğinde, şu

```
id=01234&username=John
```

gövdesiyle, istek gövdesine uygulanan Form_urlencoded ayrıştırıcısı aşağıdaki hash tablosunu oluşturur:

| Anahtar  | Değer    |
|----------|----------|
| id       | 01234    |
| username | John     |

* `POST_FORM_URLENCODED_id_value` noktası, Form_urlencoded ayrıştırıcısı tarafından oluşturulan hash tablosundaki `id` anahtarına karşılık gelen `01234` değerine başvurur.
* `POST_FORM_URLENCODED_username_value` noktası, Form_urlencoded ayrıştırıcısı tarafından oluşturulan hash tablosundaki `username` anahtarına karşılık gelen `John` değerine başvurur.