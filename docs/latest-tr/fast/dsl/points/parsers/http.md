[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded]:      form-urlencoded.md
[link-multipart]:           multipart.md
[link-xml]:                 xml.md
[link-json]:                json.md

[link-get-array]:           array.md#the-example-of-using-the-get-filter-with-the-array-filter
[link-get-hash]:            hash.md#the-example-of-using-the-get-filter-and-the-hash-filter
[link-header-array]:        array.md#the-example-of-using-the-header-filter-with-the-array-filter

[anchor1]:      #uri-filter
[anchor2]:      #path-filter
[anchor3]:      #action_name-filter
[anchor4]:      #action_ext-filter
[anchor5]:      #get-filter
[anchor6]:      #header-filter
[anchor7]:      #post-filter

# HTTP Ayrıştırıcısı

Açık **HTTP ayrıştırıcısı**, yıllık istek işlemeyi gerçekleştirir. Adı, tarafından sağlanan filtreleri kullanırken bir noktada belirtilmemelidir.

HTTP ayrıştırıcısı, temel talebe dayalı karmaşık bir veri yapısı oluşturur. Bu veri yapısının öğelerine ulaşmak için aşağıdaki filtreleri kullanabilirsiniz:

* [URI][anchor1];
* [Path][anchor2];
* [Action_name][anchor3];
* [Action_ext][anchor4];
* [Get][anchor5];
* [Header][anchor6];
* [Post][anchor7].

!!! info "Noktalarda filtre kullanma"
    Filtreyi noktada kullanmak için filtrenin adını büyük harfle ekleyin.

## URI Filtresi

**URI** filtresi, talep hedefine olan mutlak yolu ifade eder. Mutlak yol, hedefin alan adını veya IP adresini izleyen `/` sembolüyle başlar.

URI filtresi, bir dize değerine başvurur. Bu filtre, karmaşık veri yapılarına (diziler veya karma tablolar gibi) başvuramaz.

**Örnek:** 

`URI_value` noktası, `GET http://example.com/login/index.php` isteğindeki `/login/index.php` dizesine başvurur.


## Path Filtresi

**Path** filtresi, URI yolu parçalarını içeren bir diziye başvurur. Bu dizinin öğelerine endekslerini kullanarak başvurulması gerekiyor. Dizi indeksleme, `0` ile başlar.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.

**Örnek:** 

`GET http://example.com/main/login/index.php HTTP/1.1` talebi için Path filtresi aşağıdaki diziyi ifade eder:

| İndeks  | Değer   |
|--------|----------|
| 0      | main     |
| 1      | login    |

* `PATH_0_value` noktası, Path filtresinin `0` indeksindeki dizide yer alan `main` değerine başvurur.
* `PATH_1_value` noktası, Path filtresinin `1` indeksindeki dizide yer alan `login` değerine başvurur.

Eğer talep URI'si yalnızca bir parça içeriyorsa, Path filtresi boş bir diziye başvurur.

**Örnek:**

`GET http://example.com/ HTTP/1.1` talebi için, Path filtresi boş bir diziye başvurur.

## Action_name Filtresi

**Action_name** filtresi, URI'nin son `/` sembolünden başlayan ve noktayla biten kısmına başvurur.

Action_name filtresi, bir dize değerine başvurur. Bu filtre karmaşık veri yapılarına (diziler veya karma tablolar gibi) başvuramaz.

**Örnek:** 
* `ACTION_NAME_value` noktası, `GET http://example.com/login/index.php` isteği için `index` değerine başvurur.
* `ACTION_NAME_value` noktası, `GET http://example.com/login/` isteği için boş değere başvurur.


## Action_ext Filtresi

**Action_ext** filtresi, URI'nin son `/` sembolünü takiben gelen ilk noktadan sonra başlar. Eğer URI'nin bu kısmı talepten eksikse, Action_ext filtresi noktada kullanılamaz.

Action_ext filtresi, bir dize değerine başvurur. Bu filtre karmaşık veri yapılarına (diziler veya karma tablolar gibi) başvuramaz.

**Örnek:** 

* `ACTION_EXT_value` noktası, `GET http://example.com/main/login/index.php` isteği için 'PHP' değerine başvurur.
* Action_ext filtresi, `GET http://example.com/main/login/` talebini başvuran noktada kullanılamaz.

## Get Filtresi

**Get** filtresi, talep sorgu dizesinden parametreler içeren bir karma tabloya başvurur. Bu karma tablonun öğelerine parametrelerin adlarını kullanarak başvurulmalıdır.

!!! info "Noktalardaki düzenli ifadeler"
    Noktadaki parametre adı, [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.

Sorgu dizesi parametreleri ayrıca aşağıdaki karmaşık veri yapılarını da içerebilir: diziler ve karma tablolar. Bu yapıların öğelerine başvurmak için sırasıyla [Array][link-get-array] ve [Hash][link-get-hash] filtrelerini kullanın.

**Örnek:** 

`POST http://example.com/login?id=01234&username=admin` talebi için Get filtresi aşağıdaki karma tabloya başvurur:

| Parametre Adı | Değer   |
|---------------|---------|
| id            | 01234   |
| username      | admin   |

* `GET_id_value` noktası, Get filtresi tarafından başvurulan karma tablodan `id` parametresine karşılık gelen `01234` değerine başvurur.
* `GET_username_value` noktası, Get filtresi tarafından başvurulan karma tablodan `username` parametresine karşılık gelen `admin` değerine başvurur.


## Header Filtresi

**Header** filtresi, başlık adları ve değerlerini içeren bir karma tabloya başvurur. Bu karma tablonun öğelerine başlıkların adlarını kullanarak başvurulmalıdır.

!!! info "Bir noktadaki bir başlık adı"
    Bir başlık adı noktada aşağıdaki şekillerden birinde belirtilebilir:

    * Büyük harflerle
    * Talepteki olduğu gibi

!!! info "Noktalardaki düzenli ifadeler"
    Başlık adı, noktada [Ruby programlama dilinin][link-ruby] bir düzenli ifadesi olabilir.


Başlık adı ayrıca bir dizi değerler de içerebilir. Bu dizinin öğelerine başvurmak için [Array][link-header-array] filtresini kullanın.

**Örnek:** 

```
GET /login/index.php HTTP/1.1
Connection: keep-alive
Host: example.com
Accept-encoding: gzip
```

talebi için, Header filtresi aşağıdaki karma tabloya başvurur:

| Başlık Adı      | Değer        |
|-----------------|-------------|
| Connection      | keep-alive  |
| Host            | example.com |
| Accept-Encoding | gzip        |

* `HEADER_Connection_value` noktası, Header filtresi tarafından başvurulan karma tablodan `Connection` başlığına karşılık gelen `keep-alive` değerine başvurur.
* `HEADER_Host_value` noktası, Header filtresi tarafından başvurulan karma tablodan `Host` başlığına karşılık gelen `example.com` değerine başvurur.
* `HEADER_Accept-Encoding_value` noktası, Header filtresi tarafından başvurulan karma tablodan `Accept-Encoding` başlığına karşılık gelen `gzip` değerine başvurur.



## Post Filtresi

**Post** filtresi, talep gövde içeriğine başvurur.

İsteğin gövde içeriğiyle ham formatında çalışmak için noktada Post filtresinin adını kullanabilirsiniz.

**Örnek:** 

```
POST http://example.com/main/index.php HTTP/1.1
Content-Type: text/plain
Content-Length: 28
```

talebi ve

```
Bu basit bir gövde metnidir.
```

gövdesi için, `POST_value` noktası, istek gövdesinden `Bu basit bir gövde metnidir.` değerine başvurur.

Ayrıca karmaşık veri yapıları içeren bir istek gövdesiyle de çalışabilirsiniz. İlgili veri yapılarının öğelerine başvurmak için Post filtreden sonra noktada aşağıdaki filtreleri ve ayrıştırıcıları kullanın: 
* İsteğin gövde içeriği **form-urlencoded** formatında ise [Form_urlencoded][link-formurlencoded] ayrıştırıcı
* İsteğin gövde içeriği **multipart** formatında ise [Multipart][link-multipart] ayrıştırıcı
* İsteğin gövde içeriği **XML** formatında ise [XML ayrıştırıcısı tarafından sağlanan filtreler][link-xml] 
* İsteğin gövde içeriği **JSON** formatında ise [Json_doc ayrıştırıcısı tarafından sağlanan filtreler][link-json] 
