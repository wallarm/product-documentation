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

# HTTP Ayrıştırıcı

Örtük **HTTP ayrıştırıcı** istek işlemeyi gerçekleştirir. Bu ayrıştırıcının sağladığı filtreler kullanılırken, adının bir noktada belirtilmesi gerekmez.

HTTP ayrıştırıcı, temel isteğe dayanarak karmaşık bir veri yapısı oluşturur. Bu veri yapısının öğelerine erişmek için aşağıdaki filtreleri kullanabilirsiniz:

* [URI][anchor1];
* [Path][anchor2];
* [Action_name][anchor3];
* [Action_ext][anchor4];
* [Get][anchor5];
* [Header][anchor6];
* [Post][anchor7].

!!! info "Noktalarda filtre kullanımı"
    Bir noktada filtre kullanmak için, filtrenin adını büyük harflerle noktaya ekleyin.

## URI Filtresi

**URI** filtresi, istek hedefinin mutlak yoluna atıfta bulunur. Mutlak yol, hedefin alan adını veya IP adresini takip eden `/` sembolüyle başlar.

URI filtresi bir dize değerine atıfta bulunur. Bu filtre, diziler veya hash tabloları gibi karmaşık veri yapılarına atıfta bulunamaz.

**Örnek:** 

`URI_value` noktası, `GET http://example.com/login/index.php` isteğinde `/login/index.php` dizgesine atıfta bulunur.


## Path Filtresi

**Path** filtresi, URI yol parçalarını içeren bir diziye atıfta bulunur. Bu dizinin öğelerine, indeksleri kullanılarak atıfta bulunulmalıdır. Dizi indekslemesi `0` ile başlar.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dilinin][link-ruby] düzenli ifadesi olabilir.  

**Örnek:** 

`GET http://example.com/main/login/index.php HTTP/1.1` isteği için Path filtresi aşağıdaki diziye atıfta bulunur:

| Index  | Değer    |
|--------|----------|
| 0      | main     |
| 1      | login    |

* `PATH_0_value` noktası, Path filtresi tarafından `0` indeksiyle adreslenen dizide bulunan `main` değerine atıfta bulunur.
* `PATH_1_value` noktası, Path filtresi tarafından `1` indeksiyle adreslenen dizide bulunan `login` değerine atıfta bulunur.

İstek URI’si yalnızca bir parça içeriyorsa, Path filtresi boş bir diziyi adresler.

**Örnek:**

`GET http://example.com/ HTTP/1.1` isteği için Path filtresi boş bir diziye atıfta bulunur.

## Action_name Filtresi

**Action_name** filtresi, URI’nin son `/` sembolünden sonra başlayan ve bir nokta ile biten bölümüne atıfta bulunur.

Action_name filtresi bir dize değerine atıfta bulunur. Bu filtre, diziler veya hash tabloları gibi karmaşık veri yapılarına atıfta bulunamaz.


**Örnek:** 
* `GET http://example.com/login/index.php` isteği için `ACTION_NAME_value` noktası `index` değerine atıfta bulunur.

* `GET http://example.com/login/` isteği için `ACTION_NAME_value` noktası boş değere atıfta bulunur.


## Action_ext Filtresi

**Action_ext** filtresi, son `/` sembolünü takip eden ilk noktadan sonra başlayan URI bölümüne atıfta bulunur. URI’nin bu bölümü istekten eksikse, Action_ext filtresi noktada kullanılamaz.

Action_ext filtresi bir dize değerine atıfta bulunur. Bu filtre, diziler veya hash tabloları gibi karmaşık veri yapılarına atıfta bulunamaz.

**Örnek:** 

* `GET http://example.com/main/login/index.php` isteği için `ACTION_EXT_value` noktası `php` değerine atıfta bulunur.
* `GET http://example.com/main/login/` isteğine atıfta bulunan noktada Action_ext filtresi kullanılamaz.

## Get Filtresi

**Get** filtresi, istek sorgu dizesindeki parametreleri içeren hash tablosuna atıfta bulunur. Bu hash tablosunun öğelerine, parametre adları kullanılarak atıfta bulunulmalıdır.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki parametre adı, [Ruby programlama dilinin][link-ruby] düzenli ifadesi olabilir.

Sorgu dizesi parametreleri ayrıca şu karmaşık veri yapılarını da içerebilir: diziler ve hash tabloları. Bu yapılardaki öğelere erişmek için sırasıyla [Array][link-get-array] ve [Hash][link-get-hash] filtrelerini kullanın.

**Örnek:** 

`POST http://example.com/login?id=01234&username=admin` isteği için Get filtresi aşağıdaki hash tablosuna atıfta bulunur:

| Parametre adı | Değer |
|---------------|-------|
| id            | 01234 |
| username      | admin |

* `GET_id_value` noktası, Get filtresi tarafından adreslenen hash tablosundaki `id` parametresine karşılık gelen `01234` değerine atıfta bulunur.
* `GET_username_value` noktası, Get filtresi tarafından adreslenen hash tablosundaki `username` parametresine karşılık gelen `admin` değerine atıfta bulunur.


## Header Filtresi

**Header** filtresi, başlık adlarını ve değerlerini içeren hash tablosuna atıfta bulunur. Bu hash tablosunun öğelerine, başlık adları kullanılarak atıfta bulunulmalıdır.

!!! info "Bir noktadaki başlık adı"
    Bir başlık adı noktada aşağıdaki yollardan biriyle belirtilebilir:

    * Büyük harflerle
    * İstekte belirtildiği şekilde

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki başlık adı, [Ruby programlama dilinin][link-ruby] düzenli ifadesi olabilir.


Bir başlığın değeri bir dizi de içerebilir. Bu dizideki öğelere erişmek için [Array][link-header-array] filtresini kullanın.

**Örnek:** 

Şu

```
GET /login/index.php HTTP/1.1
Connection: keep-alive
Host: example.com
Accept-encoding: gzip
```

isteği için Header filtresi aşağıdaki hash tablosuna atıfta bulunur:

| Başlık adı      | Değer       |
|-----------------|-------------|
| Connection      | keep-alive  |
| Host            | example.com |
| Accept-Encoding | gzip        |

* `HEADER_Connection_value` noktası, Header filtresi tarafından adreslenen hash tablosundaki `Connection` başlığına karşılık gelen `keep-alive` değerine atıfta bulunur.
* `HEADER_Host_value` noktası, Header filtresi tarafından adreslenen hash tablosundaki `Host` başlığına karşılık gelen `example.com` değerine atıfta bulunur.
* `HEADER_Accept-Encoding_value` noktası, Header filtresi tarafından adreslenen hash tablosundaki `Accept-Encoding` başlığına karşılık gelen `gzip` değerine atıfta bulunur.



## Post Filtresi

**Post** filtresi, istek gövdesinin içeriğine atıfta bulunur.

İstek gövdesi içeriğiyle ham biçimde çalışmak için noktada Post filtresinin adını kullanabilirsiniz.

**Örnek:** 

Şu

```
POST http://example.com/main/index.php HTTP/1.1
Content-Type: text/plain
Content-Length: 28
```

isteğinde, şu gövde ile

```
This is a simple body text.
```

`POST_value` noktası istek gövdesindeki `This is a simple body text.` değerine atıfta bulunur.

Ayrıca karmaşık veri yapıları içeren bir istek gövdesiyle de çalışabilirsiniz. İlgili veri yapılarının öğelerine erişmek için, noktada Post filtresinden sonra aşağıdaki filtre ve ayrıştırıcıları kullanın: 
* İstek gövdesi **form-urlencoded** biçimindeyse [Form_urlencoded][link-formurlencoded] ayrıştırıcısı
* İstek gövdesi **multipart** biçimindeyse [Multipart][link-multipart] ayrıştırıcısı
* İstek gövdesi **XML** biçimindeyse [XML ayrıştırıcısının sağladığı filtreler][link-xml]
* İstek gövdesi **JSON** biçimindeyse [Json_doc ayrıştırıcısının sağladığı filtreler][link-json]