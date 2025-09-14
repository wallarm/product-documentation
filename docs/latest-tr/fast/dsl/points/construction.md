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
[link-jsonobj]:                 parsers/json.md#json_obj-filter
[link-jsonarray]:               parsers/json.md#json_array-filter
[link-array]:                   parsers/array.md
[link-hash]:                    parsers/hash.md
[link-gzip]:                    parsers/gzip.md
[link-base64]:                  parsers/base64.md

# Bir Nokta Nasıl Oluşturulur
Noktada kullanıma uygun FAST DSL ayrıştırıcıları ve filtrelerinin listesini hatırlayalım.
* [HTTP ayrıştırıcısı][link-http]:
    * [URI filtresi][link-uri];
    * [Yol (Path) filtresi][link-path];
    * [Action_name filtresi][link-actionname];
    * [Action_ext filtresi][link-actionext];
    * [GET filtresi][link-get];
    * [Header filtresi][link-header];
    * [Post filtresi][link-post];
* [Form_urlencoded ayrıştırıcısı][link-formurlencoded];
* [Multipart ayrıştırıcısı][link-multipart];
* [Cookie ayrıştırıcısı][link-cookie];
* [XML ayrıştırıcısı][link-xml]:
    * [Xml_comment filtresi][link-xmlcomment];
    * [Xml_dtd filtresi][link-xmldtd];
    * [Xml_dtd_entity filtresi][link-xmldtdentity];
    * [Xml_pi filtresi][link-xmlpi];
    * [Xml_tag filtresi][link-xmltag];
    * [Xml_tag_array filtresi][link-xmltagarray];
    * [Xml_attr filtresi][link-xmlattr];
* [Json_doc ayrıştırıcısı][link-jsondoc]:
    * [Json_obj filtresi][link-jsonobj];
    * [Json_array filtresi][link-jsonarray];
* [GZIP ayrıştırıcısı][link-gzip];
* [Base64 ayrıştırıcısı][link-base64];
* [Array filtresi][link-array];
* [Hash filtresi][link-hash].

Hangi ayrıştırıcı ve filtrelerin noktaya dahil edilmesi gerektiğini daha kolay anlamak için noktaların sağdan sola oluşturulması önerilir. Bir nokta oluştururken istek parçalarının küçüğünden büyüğüne doğru ilerleyin.

!!! info "Nokta parçaları ayırıcı"
    Noktanın parçaları `_` sembolü kullanılarak ayrılmalıdır.

## Örnek 1 

Aşağıdaki istekte `uid` parametresinin çözülmüş değerine atıfta bulunan bir nokta oluşturmanız gerektiğini varsayalım:

```
GET http://example.com/main/login/?uid=MDEyMzQ=
```

burada `MDEyMzQ=` Base64 ile kodlanmış `01234` dizgesidir.

1.   Nokta, istek öğesinin değeri­ne atıfta bulunmalıdır; bu nedenle noktaya `value` hizmet sözcüğünü dahil etmemiz gerekir.

    Noktanın mevcut durumu: `value`.

2.   Nokta çözümlenmiş değere atıfta bulunmalıdır; ancak istenen değer istek içinde *Base64* ile kodlanmıştır. Değeri çözmek için noktanın soluna `BASE64` ayrıştırıcısının adı eklenmelidir.
       
    Noktanın mevcut durumu: `BASE64_value`.

3.   Nokta, *`uid`* parametresinin değerine atıfta bulunmalıdır. İstenen parametre değerine atıfta bulunmak için noktanın soluna `uid` parametresinin adını ekleyin. 
    
    Noktanın mevcut durumu: `uid_BASE64_value`.

4.   Nokta, temel isteğin *sorgu dizesinde* geçirilen parametrenin değerine atıfta bulunmalıdır. Sorgu dizesi parametre değerine atıfta bulunmak için noktanın soluna `GET` filtresinin adını ekleyin. 
    
    Noktanın mevcut durumu: `GET_uid_BASE64_value`.



Örneğin koşullarını karşılamak için, dördüncü adımda elde edilen nokta uzantıya aşağıdaki yollardan biriyle eklenebilir:
* herhangi bir hizmet sembolü ile çevrelenmeden.
* tek tırnak işaretleriyle çevrelenmiş (`'GET_uid_BASE64_value'`).
* çift tırnak işaretleriyle çevrelenmiş (`"GET_uid_BASE64_value"`).



## Örnek 2

Aşağıdaki istekte `passwd` parametresinin `01234` değerine atıfta bulunan bir nokta oluşturmanız gerektiğini varsayalım: 

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

ve aşağıdaki gövde ile:

```
username=admin&passwd=01234.
```

1.   Nokta, istek öğesinin *değeri*ne atıfta bulunmalıdır; bu nedenle noktaya `value` hizmet sözcüğünü dahil etmemiz gerekir.
    
    Noktanın mevcut durumu: `value`.

2.   Nokta, *`passwd`* parametresinin değerine atıfta bulunmalıdır. İstenen parametre değerine atıfta bulunmak için noktanın soluna `passwd` parametresinin adını ekleyin. 
    
    Noktanın mevcut durumu: `passwd_value`.

3.   Nokta, *form-urlencoded formatında* iletilen parametrenin değerine atıfta bulunmalıdır. Bu, temel istekteki Content-Type üstbilgisinin değerinden anlaşılabilir. Form-urlencoded değerinde iletilen parametrenin değerine atıfta bulunmak için, noktanın soluna büyük harflerle Form_urlencoded ayrıştırıcısının adını ekleyin. 
    
    Noktanın mevcut durumu: `FORM_URLENCODED_passwd_value`.

4.   Nokta, *istek gövdesinde* iletilen parametrenin değerine atıfta bulunmalıdır. İstek gövdesi parametresinin değerine atıfta bulunmak için noktanın soluna `POST` ayrıştırıcısının adını ekleyin.
    
    Noktanın mevcut durumu: `POST_FORM_URLENCODED_passwd_value`.



Örneğin koşullarını karşılamak için, dördüncü adımda elde edilen nokta uzantıya aşağıdaki yollardan biriyle eklenebilir:
* herhangi bir hizmet sembolü ile çevrelenmeden.
* tek tırnak işaretleriyle çevrelenmiş (`'POST_FORM_URLENCODED_passwd_value'`).
* çift tırnak işaretleriyle çevrelenmiş (`"POST_FORM_URLENCODED_passwd_value"`).



## Örnek 3

Aşağıdaki istekte `secret-word` çerezinin `abcde` değerine atıfta bulunan bir nokta oluşturmanız gerektiğini varsayalım:

```
GET /main/index.php HTTP/1.1
Host: example.com
Cookie: username=John. secret-word=abcde.
```

1.   Nokta, istek öğesinin *değeri*ne atıfta bulunmalıdır; bu nedenle noktaya `value` hizmet sözcüğünü dahil etmemiz gerekir.

    Noktanın mevcut durumu: `value`.

2.   Nokta, *`secret-word`* çerezinin değerine atıfta bulunmalıdır. İstenen çerez değerine atıfta bulunmak için noktanın soluna çerezin adı olan `secret-word` ekleyin.
    
    Noktanın mevcut durumu: `secret-word_value`.

3.   Nokta, *çerez* değerine atıfta bulunmalıdır. Çerez değerine atıfta bulunmak için noktanın soluna `COOKIE` ayrıştırıcısının adını ekleyin.
    
    Noktanın mevcut durumu: `COOKIE_secret-word_value`.

4.   Nokta, *Cookie üstbilgisinde* iletilen değere atıfta bulunmalıdır. Cookie adlı üstbilgiye atıfta bulunmak için noktanın soluna `Cookie` üstbilgisinin adını ekleyin. 
    
    Noktanın mevcut durumu: `Cookie_COOKIE_secret-word_value`.

5.   Nokta, *üstbilgide* iletilen değere atıfta bulunmalıdır. Üstbilgi değerine atıfta bulunmak için noktanın soluna `HEADER` filtresinin adını ekleyin.
    
    Noktanın mevcut durumu: `HEADER_Cookie_COOKIE_secret-word_value`.



Örneğin koşullarını karşılamak için, dördüncü adımda elde edilen nokta uzantıya aşağıdaki yollardan biriyle eklenebilir:
* herhangi bir hizmet sembolü ile çevrelenmeden.
* tek tırnak işaretleriyle çevrelenmiş (`'HEADER_Cookie_COOKIE_secret-word_value'`).
* çift tırnak işaretleriyle çevrelenmiş (`"HEADER_Cookie_COOKIE_secret-word_value"`).