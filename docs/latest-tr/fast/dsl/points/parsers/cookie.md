[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

# Çerez Ayrıştırıcı

**Çerez** ayrıştırıcısı, temel istekteki Çerez başlığı içeriğine dayanarak bir karma tablo oluşturur. Bu karma tablonun elemanlarına çerezlerin adlarını kullanarak başvurmanız gerekmektedir.

!!! bilgi "Noktalardaki düzenli ifadeler"
    Noktadaki çerez adı, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.

!!! uyarı "Noktada Çerez ayrıştırıcısını kullanma"
    Çerez ayrıştırıcısı, yalnızca temel isteğin Çerez başlığına başvuran Header filtresi ile birlikte noktada kullanılabilir.
 
**Örnek:** 

Aşağıdaki durum için

```
GET /login/index.php HTTP/1.1
Host: example.com
Cookie: id=01234; username=admin
```

istek, HTTP ayrıştırıcısı ve Çerez ayrıştırıcısı ilgili başlık verileri ile karma tablolar oluşturur.

Header filtresi aşağıdaki karma tabloya başvurur:

| Header adı    | Header değeri            |
|---------------|--------------------------|
| Host          | example.com              |
| Cookie        | id=01234; username=admin |

Bu karma tabloda, başlık adları anahtarlar ve ilgili başlıkların değerleri karma tablo değerleridir.

`HEADER_Cookie_value` noktasını Çerez'i bir string değeri olarak çalıştırmak için kullanın. Mevcut örnekte bu nokta `id=01234; username=admin` stringine başvuruyor.

Çerez ayrıştırıcısı aşağıdaki karma tabloyu oluşturur:

| Çerez adı | Çerez değeri  |
|-------------|---------------|
| id          | 01234         |
| username    | admin         |

Çerez ayrıştırıcısı, Header filtresi tarafından adreslenen karma tablodan alınan Çerez başlığı verilerine dayanarak bir karma tablo oluşturur. Bu karma tabloda, çerez isimleri anahtarlar ve ilgili çerezlerin değerleri, karma tablo değerleridir.

* `HEADER_Cookie_COOKIE_id_value` noktası, Çerez ayrıştırıcısı tarafından oluşturulan karma tablodaki `id` anahtarına karşılık gelen `01234` değerine başvurur.
* `HEADER_Cookie_COOKIE_username_value` noktası, Çerez ayrıştırıcısı tarafından oluşturulan karma tablodaki `username` anahtarına karşılık gelen `admin` değerine başvurur.