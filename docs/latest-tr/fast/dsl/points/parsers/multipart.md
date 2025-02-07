```markdown
[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# Multipart Parser

**Multipart** ayrıştırıcısı, çok parçalı formatta olan istek gövdesiyle çalışmak için kullanılır. Bu ayrıştırıcı, istek gövdesi parametrelerinin adlarını anahtar, ilgili parametre değerlerini ise hash tablosu değerleri olarak içeren bir hash tablosu oluşturur. Bu hash tablosunun öğelerine, parametre adları kullanılarak erişilmelidir.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki parametre adı, [Ruby programming language][link-ruby] için düzenli ifade olabilir.

!!! warning "Noktalarda Multipart ayrıştırıcısının kullanılması"
    Multipart ayrıştırıcısı, yalnızca temel istek gövdesine başvuran Post filtresi ile birlikte noktalarda kullanılabilir.

**Örnek:**

Aşağıdaki istek için

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

Multipart ayrıştırıcısının istek gövdesine uygulanması, aşağıdaki hash tablosunu oluşturur:

| Key       | Value    |
|-----------|----------|
| id        | 01234    |
| username  | admin    |

* `POST_MULTIPART_id_value` noktası, Multipart ayrıştırıcısı tarafından oluşturulan hash tablosunda `id` anahtarına karşılık gelen `01234` değerine atıfta bulunur.
* `POST_MULTIPART_username_value` noktası, Multipart ayrıştırıcısı tarafından oluşturulan hash tablosunda `username` anahtarına karşılık gelen `admin` değerine atıfta bulunur.

Çok parçalı formatta olan istek gövdesi, ayrıca şu karmaşık veri yapılarından bazılarını içerebilir: diziler ve hash tabloları. Bu yapıların öğelerine erişmek için sırasıyla [Array][link-multipart-array] ve [Hash][link-multipart-hash] filtrelerini kullanın.
```