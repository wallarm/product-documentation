[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter

# Form_urlencoded Ayrıştırıcı

**Form_urlencoded** ayrıştırıcısı, form-urlencoded formatındaki istek gövdesiyle çalışmak için kullanılır. Bu ayrıştırıcı, istek gövdesi parametrelerinin adlarını anahtar, karşılık gelen parametre değerlerini ise hash tablosu değerleri olarak içeren bir hash tablosu oluşturur. Bu hash tablosundaki elemanlara, parametre adları kullanılarak başvurulmalıdır.

!!! info "Noktadaki düzenli ifadeler"
    Noktadaki parametre adı, [Ruby programming language][link-ruby] dilindeki bir düzenli ifade olabilir.

!!! warning "Noktada Form_urlencoded ayrıştırıcısının kullanılması"
    Form_urlencoded ayrıştırıcısı, yalnızca temel istek gövdesine başvuran Post filtresi ile birlikte noktada kullanılabilir.

Form-urlencoded formatındaki istek gövdesi, aşağıdaki karmaşık veri yapılarını da içerebilir: diziler ve hash tablolar. Bu yapılardaki elemanlara erişmek için sırasıyla [Array][link-formurlencoded-array] ve [Hash][link-formurlencoded-hash] filtrelerini kullanın.

**Örnek:** 

Aşağıdaki

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

başlığına sahip istek için, 

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