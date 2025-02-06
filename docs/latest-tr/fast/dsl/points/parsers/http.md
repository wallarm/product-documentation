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

Varsayılan **HTTP ayrıştırıcısı**, isteğin yıllık işlenmesini gerçekleştirir. Sağladığı filtreleri kullanırken, nokta üzerinde ismi belirtilmemelidir.

HTTP ayrıştırıcısı, temel istek esasına dayalı olarak karmaşık bir veri yapısı oluşturur. Bu veri yapısının öğelerine erişmek için aşağıdaki filtreleri kullanabilirsiniz:

* [URI][anchor1];
* [Path][anchor2];
* [Action_name][anchor3];
* [Action_ext][anchor4];
* [Get][anchor5];
* [Header][anchor6];
* [Post][anchor7].

!!! info "Noktalarda filtre kullanımı"
    Nokta üzerinde filtreyi kullanmak için filtre adını büyük harflerle ekleyin.

## URI Filtre

**URI** filtresi, istek hedefinin mutlak yoluna atıfta bulunur. Mutlak yol, hedefin alan adı veya IP adresini takip eden `/` sembolü ile başlar.

URI filtresi bir dize değerine atıfta bulunur. Bu filtre, karmaşık veri yapıları (diziler veya hash tabloları gibi) ile ilgili değildir.

**Örnek:**

`URI_value` noktası, `GET http://example.com/login/index.php` isteğinde yer alan `/login/index.php` dizisine atıfta bulunur.

## Path Filtre

**Path** filtresi, URI yol parçalarını içeren bir diziye atıfta bulunur. Bu dizinin elemanlarına, ilgili indeksleri kullanarak erişmeniz gerekir. Dizi indekslemesi `0` dan başlar.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki indeks, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.

**Örnek:**

`GET http://example.com/main/login/index.php HTTP/1.1` isteği için, Path filtresi aşağıdaki diziye atıfta bulunur:

| Index  | Değer    |
|--------|----------|
| 0      | main     |
| 1      | login    |

* `PATH_0_value` noktası, Path filtresi ile `0` indeksli adreste bulunan `main` değerine atıfta bulunur.
* `PATH_1_value` noktası, Path filtresi ile `1` indeksli adreste bulunan `login` değerine atıfta bulunur.

Eğer istek URI'si yalnızca bir parçadan oluşuyorsa, Path filtresi boş diziyi adresler.

**Örnek:**

`GET http://example.com/ HTTP/1.1` isteği için, Path filtresi boş diziyi adresler.

## Action_name Filtre

**Action_name** filtresi, URI'nin son `/` sembolünden sonraki ve nokta ile biten kısmına atıfta bulunur.

Action_name filtresi, bir dize değerine atıfta bulunur. Bu filtre, karmaşık veri yapıları (diziler veya hash tabloları gibi) ile ilgili değildir.

**Örnek:**
* `ACTION_NAME_value` noktası, `GET http://example.com/login/index.php` isteğinde `index` değerine atıfta bulunur.
* `ACTION_NAME_value` noktası, `GET http://example.com/login/` isteğinde boş değere atıfta bulunur.

## Action_ext Filtre

**Action_ext** filtresi, URI'nin, son `/` sembolünü takiben gelen ilk noktadan sonra başlayan kısmına atıfta bulunur. Eğer bu URI kısmı istekten eksikse, Action_ext filtresi noktada kullanılamaz.

Action_ext filtresi, bir dize değerine atıfta bulunur. Bu filtre, karmaşık veri yapıları (diziler veya hash tabloları gibi) ile ilgili değildir.

**Örnek:**

* `ACTION_EXT_value` noktası, `GET http://example.com/main/login/index.php` isteğinde `php` değerine atıfta bulunur.
* Action_ext filtresi, `GET http://example.com/main/login/` isteğine atıfta bulunan noktada kullanılamaz.

## Get Filtre

**Get** filtresi, istek sorgu dizesinden gelen parametreleri içeren hash tablosuna atıfta bulunur. Bu hash tablosunun elemanlarına, parametre adları kullanılarak erişilmesi gerekir.

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki parametre adı, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.

Sorgu dizesi parametreleri, diziler ve hash tabloları gibi aşağıdaki karmaşık veri yapılarını da içerebilir. Bu yapılardaki öğelere erişmek için sırasıyla [Array][link-get-array] ve [Hash][link-get-hash] filtrelerini kullanın.

**Örnek:**

`POST http://example.com/login?id=01234&username=admin` isteği için, Get filtresi aşağıdaki hash tablosuna atıfta bulunur:

| Parametre adı | Değer  |
|---------------|--------|
| id            | 01234  |
| username      | admin  |

* `GET_id_value` noktası, Get filtresi ile adreslenen hash tablosunda `id` parametresine karşılık gelen `01234` değerine atıfta bulunur.
* `GET_username_value` noktası, Get filtresi ile adreslenen hash tablosunda `username` parametresine karşılık gelen `admin` değerine atıfta bulunur.

## Header Filtre

**Header** filtresi, başlık adları ve değerlerini içeren hash tablosuna atıfta bulunur. Bu hash tablosunun elemanlarına, başlık adlarını kullanarak erişmeniz gerekir.

!!! info "Noktada bir başlık adı"
    Bir başlık adı nokta üzerinde şu şekillerde belirtilebilir:

    * Büyük harflerle
    * İstekte belirtildiği şekilde

!!! info "Noktalarda düzenli ifadeler"
    Noktadaki başlık adı, [Ruby programlama dili][link-ruby] düzenli ifadesi olabilir.

Başlık adı, ayrıca bir değer dizisini de içerebilir. Bu dizinin elemanlarına erişmek için [Array][link-header-array] filtresini kullanın.

**Örnek:**

Aşağıdaki istek için

```
GET /login/index.php HTTP/1.1
Connection: keep-alive
Host: example.com
Accept-encoding: gzip
```

Header filtresi, aşağıdaki hash tablosuna atıfta bulunur:

| Başlık adı      | Değer       |
|-----------------|-------------|
| Connection      | keep-alive  |
| Host            | example.com |
| Accept-Encoding | gzip        |

* `HEADER_Connection_value` noktası, Header filtresi ile adreslenen hash tablosunda `Connection` başlığına karşılık gelen `keep-alive` değerine atıfta bulunur.
* `HEADER_Host_value` noktası, Header filtresi ile adreslenen hash tablosunda `Host` başlığına karşılık gelen `example.com` değerine atıfta bulunur.
* `HEADER_Accept-Encoding_value` noktası, Header filtresi ile adreslenen hash tablosunda `Accept-Encoding` başlığına karşılık gelen `gzip` değerine atıfta bulunur.

## Post Filtre

**Post** filtresi, istek gövdesi içeriğine atıfta bulunur.

İstek gövdesi içeriği üzerinde ham formatta çalışmak için, noktada Post filtresinin adını kullanabilirsiniz.

**Örnek:**

Aşağıdaki istek için

```
POST http://example.com/main/index.php HTTP/1.1
Content-Type: text/plain
Content-Length: 28
```

ve

```
This is a simple body text.
```

gövdesi ile, `POST_value` noktası, istek gövdesindeki `This is a simple body text.` değerine atıfta bulunur.

Ayrıca, karmaşık veri yapıları içeren bir istek gövdesi ile de çalışabilirsiniz. İlgili veri yapılarına erişmek için, Post filtresinden sonra noktada aşağıdaki filtreleri ve ayrıştırıcıları kullanın:
* **form-urlencoded** formatındaki istek gövdesi için [Form_urlencoded][link-formurlencoded] ayrıştırıcısı
* **multipart** formatındaki istek gövdesi için [Multipart][link-multipart] ayrıştırıcısı
* **XML** formatındaki istek gövdesi için [XML ayrıştırıcısının sağladığı filtreler][link-xml]
* **JSON** formatındaki istek gövdesi için [Json_doc ayrıştırıcısının sağladığı filtreler][link-json]