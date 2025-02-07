[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

# Çerez Ayrıştırıcı

**Cookie** ayrıştırıcısı, temel istek içerisindeki Cookie başlığı içeriğine dayalı olarak bir hash tablosu oluşturur. Bu hash tablosunun elemanlarına, çerezlerin isimleri kullanılarak referans verilmesi gerekmektedir.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki çerez adı, [Ruby programming language][link-ruby] düzenli ifadesi olabilir.

!!! warning "Noktalarda Cookie ayrıştırıcısının kullanılması"
    Cookie ayrıştırıcısı, yalnızca temel isteğin Cookie başlığına referans veren Header filtresi ile birlikte noktalarda kullanılabilir.
 
**Örnek:** 

Aşağıdaki

```
GET /login/index.php HTTP/1.1
Host: example.com
Cookie: id=01234; username=admin
```

isteği için, HTTP ayrıştırıcısı ve Cookie ayrıştırıcısı ilgili başlık verileriyle hash tabloları oluşturur.

Header filtresi aşağıdaki hash tablosuna referans verir:

| Header name   | Header value             |
|---------------|--------------------------|
| Host          | example.com              |
| Cookie        | id=01234; username=admin |

Bu hash tablosunda, başlık adları anahtar, ilgili başlık değerleri ise hash tablosu değerleridir.

Cookie'yi bir dize değeri olarak işlemek için `HEADER_Cookie_value` noktasını kullanın. Mevcut örnekte bu nokta, `id=01234; username=admin` dizesine referans vermektedir.

Cookie ayrıştırıcısı, Header filtresi tarafından adreslenen hash tablosundan alınan Cookie başlık verilerine dayanarak aşağıdaki hash tablosunu oluşturur:

| Cookie name | Cookie value  |
|-------------|---------------|
| id          | 01234         |
| username    | admin         |

Cookie ayrıştırıcısı, Cookie başlık verilerine dayalı olarak bir hash tablosu oluşturur; bu hash tablosunda çerez isimleri anahtarlar, ilgili çerez değerleri ise hash tablosu değerleridir.

* `HEADER_Cookie_COOKIE_id_value` noktası, Cookie ayrıştırıcısı tarafından oluşturulan hash tablosundaki `id` anahtarına karşılık gelen `01234` değerine referans verir.
* `HEADER_Cookie_COOKIE_username_value` noktası, Cookie ayrıştırıcısı tarafından oluşturulan hash tablosundaki `username` anahtarına karşılık gelen `admin` değerine referans verir.