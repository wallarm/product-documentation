[link-http]:                    parsers/http.md
[link-uri]:                     parsers/http.md#uri-filter
[link-path]:                    parsers/http.md#path-filter
[link-actionname]:              parsers/http.md#action_name-filter
[link-actionext]:               parsers/http.md#action_ext-filter
[link-get]:                     parsers/http.md#get-filter
[link-header]:                  parsers/http.md#header-filter
[link-post]:                    parsers/http.md#post-filter
[link-formurlencoded]:          parsers/form-urlencoded.md
[link-multipart]:               parsers/multipart.md
[link-cookie]:                  parsers/cookie.md
[link-xml]:                     parsers/xml.md
[link-xmlcomment]:              parsers/xml.md#xml_comment-filter
[link-xmldtd]:                  parsers/xml.md#xml_dtd-filter
[link-xmldtdentity]:            parsers/xml.md#xml_dtd_entity-filter
[link-xmlpi]:                   parsers/xml.md#xml_pi-filter
[link-xmltag]:                  parsers/xml.md#xml_tag-filter
[link-xmltagarray]:             parsers/xml.md#xml_tag_array-filter
[link-xmlattr]:                 parsers/xml.md#xml_attr-filter
[link-jsondoc]:                 parsers/json.md
[link-jsonobj]:                 parsers/json.md#jsonobj-filter
[link-jsonarray]:               parsers/json.md#jsonarray-filter
[link-array]:                   parsers/array.md
[link-hash]:                    parsers/hash.md
[link-gzip]:                    parsers/gzip.md
[link-base64]:                  parsers/base64.md

# Nasıl bir Nokta Oluşturulur
FAST DSL parserlarının ve filtrelerinin kullanıma sunulduğu listeyi anımsayalım.
* [HTTP parserı][link-http]:
    * [URI filtresi][link-uri];
    * [Yol filtresi][link-path];
    * [Eylem_adı filtresi][link-actionname];
    * [Eylem_uzantısı filtresi][link-actionext];
    * [Get filtresi][link-get];
    * [Header filtresi][link-header];
    * [Post filtresi][link-post];
* [Form_urlencoded parserı][link-formurlencoded];
* [Çok parçalı parser][link-multipart];
* [Kurabiye parserı][link-cookie];
* [XML parserı][link-xml]:
    * [Xml_yorum filtresi][link-xmlcomment];
    * [Xml_dtd filtresi][link-xmldtd];
    * [Xml_dtd_varlık filtresi][link-xmldtdentity];
    * [Xml_pi filtresi][link-xmlpi];
    * [Xml_etiket filtresi][link-xmltag];
    * [Xml_etiket_dizisi filtresi][link-xmltagarray];
    * [Xml_attr filtresi][link-xmlattr];
* [Json_doc parserı][link-jsondoc]:
    * [Json_obj filtresi][link-jsonobj];
    * [Json_dizi filtresi][link-jsonarray];
* [GZIP parserı][link-gzip];
* [Base64 parserı][link-base64];
* [Dizi filtresi][link-array];
* [Hash filtresi][link-hash].

Söz konusu noktaların, hangi parserların ve filtrelerin noktanın içine dahil edilmesi gerektiğine daha kolay anlam sağlamak amacıyla, sağdan sola toplanması önerilir. Nokta oluştururken, talebin daha küçük parçalarından daha büyük parçalarına doğru hareket edin.

!!! bilgi "Nokta parçaları ayırıcı"
    Noktanın parçalarının `_` sembolü kullanılarak ayrılması gereklidir.

## Örnek 1 

Aşağıdaki istekte `uid` parametresinin kodlanmış değerine yönlendiren bir nokta oluşturmanız gerektiğini varsayalım:

```
GET http://example.com/main/login/?uid=MDEyMzQ=
```

`MDEyMzQ=` ise Base64-encoded `01234` stringini ifade eder.

1.   Noktanın talep öğesinin *değerine* yönlendirilmesi gerektiği için, noktada `değer` hizmet kelimesini içermeliyiz.

    Noktanın hali şu anda: `değer`.

2.   Noktanın kodlanmış değere yönlendirilmesi gereklidir, ancak istenen değer talepte *Base64* kodlaması ile kodlanmıştır. Değerin kodunu çözebilmek için `BASE64` parser adını noktanın sol tarafına eklemeliyiz.

    Noktanın hali şu anda: `BASE64_değer`.

3.   Noktanın *`uid`* parametre değerine yönlendirilmesi gerekmektedir. İstenen parametre değerine yönlendirebilmek için `uid` parametre adını noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `uid_BASE64_değer`.

4.   Noktanın, temel talepte *sorgu stringinde* geçen parametrenin değerine yönlendirilmesi gerekmektedir. Sorgu stringi parametre değerine yönlendirebilmek için `GET` filtre adını noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `GET_uid_BASE64_değer`.



Örneğin koşullarını yerine getirebilmek için, alınan dördüncü adımdaki nokta eklentiye aşağıdaki yollardan biriyle eklenir:
* hizmet sembolleri olmaksızın.
* kesme işaretleriyle çevrili biçimde (`'GET_uid_BASE64_değer'`).
* tırnak işaretleriyle çevrili biçimde (`"GET_uid_BASE64_değer"`).



## Örnek 2

Aşağıda belirtilen 

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

istekte `passwd` parametresinin `01234` değerine yönlendiren bir nokta oluşturmanız gerektiğini varsayalım. Bu istekteki 
```
username=admin&passwd=01234.
```
body bulunmaktadır.

1.   Noktanın talep öğesinin *değerine* yönlendirilmesi gerektiği için, noktada `değer` hizmet kelimesini içermeliyiz.

    Noktanın hali şu anda: `değer`.

2.   Noktanın *`passwd`* parametre değerine yönlendirilmesi gerekmektedir. İstenen parametre değerine yönlendirebilmek için `passwd` parametre adını noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `passwd_değer`.

3.   Noktanın, *form-urlencoded formatında* geçen parametrenin değerine yönlendirilmesi gerekmektedir. Bu, temel talepteki Content-Type başlığının değerinden çıkarılabilir. Form_urlencoded parserın adını büyük harflerle form-urlencoded değerindeki parametrenin değerine yönlendirebilmek için noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `FORM_URLENCODED_passwd_değer`.

4.   Noktanın *talep body'sinde* geçen parametrenin değerine yönlendirilmesi gerekmektedir. Talep body'sindeki parametrenin değerine yönlendirebilmek için `POST` parserın adını noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `POST_FORM_URLENCODED_passwd_değer`.



Örneğin koşullarını yerine getirebilmek için, alınan dördüncü adımdaki nokta eklentiye aşağıdaki yollardan biriyle eklenir:
* hizmet sembolleri olmaksızın.
* kesme işaretleriyle çevrili biçimde (`'POST_FORM_URLENCODED_passwd_değer'`).
* tırnak işaretleriyle çevrili biçimde (`"POST_FORM_URLENCODED_passwd_değer"`).



## Örnek 3

Aşağıdaki istekte `secret-word` kurabiye değerinin `abcde` olması durumunda bir nokta oluşturmanız gerektiğini varsayalım:

```
GET /main/index.php HTTP/1.1
Host: example.com
Cookie: username=John. secret-word=abcde.
```

1.   Noktanın talep öğesinin *değerine* yönlendirilmesi gerektiği için, noktada `değer` hizmet kelimesini dahil etmeliyiz.

    Noktanın hali şu anda: `değer`.

2.   Noktanın *`secret-word`* kurabiye değerine yönlendirilmesi gerekmektedir. İstenen kurabiye değerine yönlendirebilmek için `secret-word` kurabiye adını noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `secret-word_değer`.

3.   Noktanın *kurabiye* değerine yönlendirilmesi gerekmektedir. Kurabiye değerine yönlendirebilmek için `COOKIE` parser adını noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `COOKIE_secret-word_değer`.

4.   Noktanın *Kurabiye başlığında* geçen değere yönlendirilmesi gerekmektedir. Kurabiye adına sahip başlığa yönlendirebilmek için `Kurabiye` başlığının adını noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `Kurabiye_COOKIE_secret-word_değer`.

5.   Noktanın *başlıkta* geçen değere yönlendirilmesi gerekmektedir. Başlık değerine yönlendirebilmek için `HEADER` filtre adını noktanın sol tarafına ekleyin.

    Noktanın hali şu anda: `HEADER_Kurabiye_COOKIE_secret-word_değer`.



Örneğin koşullarını yerine getirebilmek için, dördüncü adımda elde edilen nokta eklentiye aşağıdaki yollardan biriyle eklenir:
* hizmet sembolleri olmaksızın.
* kesme işaretleriyle çevrili biçimde (`'HEADER_Kurabiye_COOKIE_secret-word_değer'`).
* tırnak işaretleriyle çevrili biçimde (`"HEADER_Kurabiye_COOKIE_secret-word_değer"`).
