[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

# Cookie Parser

Cookie parser, temel istekteki Cookie üstbilgisinin içeriklerine dayanarak bir hash tablosu oluşturur. Bu hash tablosunun öğelerine çerezlerin adlarını kullanarak başvurulması gerekir.

!!! info "Point'lerde düzenli ifadeler"
    Point içindeki çerez adı, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.

!!! warning "Point içinde Cookie parser kullanımı"
    Cookie parser yalnızca point içinde, temel isteğin Cookie üstbilgisine başvuran Header filter ile birlikte kullanılabilir.
 
**Örnek:** 

Şu

```
GET /login/index.php HTTP/1.1
Host: example.com
Cookie: id=01234; username=admin
```

istek için, HTTP parser ve Cookie parser ilgili üstbilgi verileriyle hash tabloları oluşturur.

Header filter aşağıdaki hash tablosuna başvurur:

| Üstbilgi adı | Üstbilgi değeri           |
|--------------|---------------------------|
| Host         | example.com               |
| Cookie       | id=01234; username=admin |

Bu hash tablosunda, üstbilgi adları anahtarlardır ve karşılık gelen üstbilgilerin değerleri hash tablosunun değerleridir.

Cookie ile bir dizge değeri olarak çalışmak için `HEADER_Cookie_value` point'ini kullanın. Mevcut örnekte bu point, `id=01234; username=admin` dizgesine başvurur.

Cookie parser aşağıdaki hash tablosunu oluşturur:

| Çerez adı | Çerez değeri |
|-----------|--------------|
| id        | 01234        |
| username  | admin        |

Cookie parser, Header filter tarafından adreslenen hash tablosundan alınan Cookie üstbilgisi verilerine dayanarak bir hash tablosu oluşturur. Bu hash tablosunda, çerez adları anahtarlardır ve karşılık gelen çerezlerin değerleri hash tablosunun değerleridir.

* `HEADER_Cookie_COOKIE_id_value` point, Cookie parser tarafından oluşturulan hash tablosundaki `id` anahtarına karşılık gelen `01234` değerine başvurur.
* `HEADER_Cookie_COOKIE_username_value` point, Cookie parser tarafından oluşturulan hash tablosundaki `username` anahtarına karşılık gelen `admin` değerine başvurur.