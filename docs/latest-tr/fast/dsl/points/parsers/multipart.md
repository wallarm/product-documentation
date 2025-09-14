[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# Multipart Ayrıştırıcı

**Multipart** ayrıştırıcı, multipart biçimindeki istek gövdesiyle çalışmak için kullanılır. Bu ayrıştırıcı, istek gövdesi parametrelerinin adlarının anahtar ve ilgili parametrelerin değerlerinin de değer olduğu bir hash tablosu oluşturur. Bu hash tablosundaki öğelere, parametre adları kullanılarak başvurulmalıdır.


!!! info "Noktalarda düzenli ifadeler"
    Noktadaki parametre adı, [Ruby programlama dili][link-ruby]nin bir düzenli ifadesi olabilir.  

!!! warning "Noktada Multipart ayrıştırıcının kullanımı"
    Multipart ayrıştırıcı yalnızca, temel istek gövdesine başvuran Post filtresiyle birlikte noktada kullanılabilir.


**Örnek:** 

Şu istek için

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id" 

01234 
--boundary 
Content-Disposition: form-data; name="username"

admin 
```

Multipart ayrıştırıcı istek gövdesine uygulandığında aşağıdaki hash tablosunu oluşturur:

| Anahtar   | Değer    |
|-----------|----------|
| id        | 01234    |
| username  | admin    |

* `POST_MULTIPART_id_value` noktası, Multipart ayrıştırıcısı tarafından oluşturulan hash tablosundaki `id` anahtarına karşılık gelen `01234` değerine atıfta bulunur.
* `POST_MULTIPART_username_value` noktası, Multipart ayrıştırıcısı tarafından oluşturulan hash tablosundaki `username` anahtarına karşılık gelen `admin` değerine atıfta bulunur.

Multipart biçimindeki istek gövdesi ayrıca aşağıdaki karmaşık veri yapılarını da içerebilir: diziler ve hash tabloları. Bu yapılardaki öğelere erişmek için sırasıyla [Array][link-multipart-array] ve [Hash][link-multipart-hash] filtrelerini kullanın.