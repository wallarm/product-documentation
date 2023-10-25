[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# Çoklu Parça Ayrıştırıcı

**Çoklu Parça** ayrıştırıcısı, talep gövdesi ile çoklu parça formatında çalışmak için kullanılır. Bu ayrıştırıcı, talep gövdesinin parametre isimlerinin anahtarlar ve karşılık gelen parametrelerin değerlerinin hash tablosu değerleri olduğu bir hash tablosu oluşturur. Bu hash tablosunun öğelerine parametrelerin isimleri kullanılarak başvurulmalıdır.


!!! bilgi "Noktalardaki düzenli ifadeler"
    Noktadaki parametre ismi [Ruby programlama dili][link-ruby]'nin bir düzenli ifadesi olabilir.  

!!! uyarı "Noktada Çoklu Parça ayrıştırıcısının kullanımı"
    Çoklu Parça ayrıştırıcısı, sadece temel talep gövdesine atıfta bulunan Post filtresi ile birlikte noktada kullanılabilir.


**Örnek:** 

Aşağıdaki

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

talebi için, talep gövdesine uygulanan Çoklu Parça ayrıştırıcısı aşağıdaki hash tablosunu oluşturur:

| Anahtar   | Değer    |
|-----------|----------|
| id        | 01234    |
| username  | admin    |

* `POST_MULTIPART_id_value` noktası, Çoklu Parça ayrıştırıcısının oluşturduğu hash tablosundaki `id` anahtarına karşılık gelen `01234` değerine başvurur.
* `POST_MULTIPART_username_value` noktası, Çoklu Parça ayrıştırıcısının oluşturduğu hash tablosundaki `username` anahtarına karşılık gelen `admin` değerine başvurur.

Çoklu parça formatındaki talep gövdesi ayrıca aşağıdaki karmaşık veri yapılarını da içerebilir: diziler ve hash tabloları. Bu yapıların öğelerine başvurmak için sırasıyla [Dizi][link-multipart-array] ve [Hash][link-multipart-hash] filtrelerini kullanın.