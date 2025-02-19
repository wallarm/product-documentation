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
Noktada kullanıma hazır FAST DSL ayrıştırıcıları ve filtrelerinin listesini hatırlayalım.
* [HTTP parser][link-http]:
    * [URI filter][link-uri];
    * [Path filter][link-path];
    * [Action_name filter][link-actionname];
    * [Action_ext filter][link-actionext];
    * [Get filter][link-get];
    * [Header filter][link-header];
    * [Post filter][link-post];
* [Form_urlencoded parser][link-formurlencoded];
* [Multipart parser][link-multipart];
* [Cookie parser][link-cookie];
* [XML parser][link-xml]:
    * [Xml_comment filter][link-xmlcomment];
    * [Xml_dtd filter][link-xmldtd];
    * [Xml_dtd_entity filter][link-xmldtdentity];
    * [Xml_pi filter][link-xmlpi];
    * [Xml_tag filter][link-xmltag];
    * [Xml_tag_array filter][link-xmltagarray];
    * [Xml_attr filter][link-xmlattr];
* [Json_doc parser][link-jsondoc]:
    * [Json_obj filter][link-jsonobj];
    * [Json_array filter][link-jsonarray];
* [GZIP parser][link-gzip];
* [Base64 parser][link-base64];
* [Array filter][link-array];
* [Hash filter][link-hash].

Noktaların, hangi ayrıştırıcı ve filtrelerin noktaya dahil edilmesi gerektiğini daha iyi anlayabilmek için sağdan sola monte edilmesi önerilir. Bir nokta oluştururken, isteğin küçük bölümlerinden başlayıp daha büyük bölümlerine doğru ilerleyin.

!!! info "Nokta Parçalarının Ayırıcı Sembolü"
    Noktanın parçaları `_` sembolü kullanılarak ayrılmalıdır.

## Örnek 1 

Aşağıdaki istekteki `uid` parametresinin çözülen değerine atıfta bulunan bir nokta oluşturmanız gerektiğini varsayalım:

```
GET http://example.com/main/login/?uid=MDEyMzQ=
```

burada `MDEyMzQ=` Base64 ile kodlanmış `01234` dizgisidir.

1.   Noktanın istek öğesinin *değerine* atıfta bulunması gerektiğinden, noktaya `value` servis kelimesini eklememiz gerekir.

    Noktanın mevcut durumu: `value`.

2.   Nokta, çözülen değere atıfta bulunmalıdır; ancak istenen değer istekte *Base64* kodlamasıyla kodlanmıştır. Değeri çözmek için noktanın sol tarafına `BASE64` ayrıştırıcısının adı eklenmelidir.
       
    Noktanın mevcut durumu: `BASE64_value`.

3.   Nokta, *`uid`* parametre değerine atıfta bulunmalıdır. İstenen parametre değerine atıfta bulunmak için sol tarafa `uid` parametre adını ekleyin.
    
    Noktanın mevcut durumu: `uid_BASE64_value`.

4.   Nokta, temel istekte iletilen *sorgu dizesi* parametre değerine atıfta bulunmalıdır. Sorgu dizesi parametre değerine atıfta bulunmak için noktanın sol tarafına `GET` filtresi adını ekleyin.
    
    Noktanın mevcut durumu: `GET_uid_BASE64_value`.



Örnekte belirtilen koşulları karşılamak için, dördüncü adımda elde edilen nokta aşağıdaki şekillerden biriyle uzantıya eklenebilir:
* servis sembollerinden hiçbirinin çevrelemesinde olmadan.
* apostrof işaretleriyle çevrelenerek (`'GET_uid_BASE64_value'`).
* tırnak işaretleriyle çevrelenerek (`"GET_uid_BASE64_value"`).


## Örnek 2

Aşağıdaki istekteki `passwd` parametresinin `01234` değerine atıfta bulunan bir nokta oluşturmanız gerektiğini varsayalım:

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

gövdesi ile;

```
username=admin&passwd=01234.
```

1.   Noktanın istek öğesinin *değerine* atıfta bulunması gerektiğinden, noktaya `value` servis kelimesini eklememiz gerekir.
    
    Noktanın mevcut durumu: `value`.

2.   Nokta, *`passwd`* parametre değerine atıfta bulunmalıdır. İstenen parametre değerine atıfta bulunmak için sol tarafa `passwd` parametre adını ekleyin.
    
    Noktanın mevcut durumu: `passwd_value`.

3.   Nokta, *form-urlencoded formatında* iletilen parametre değerine atıfta bulunmalıdır. Bu, temel istekteki Content-Type başlığının değerinden türetilebilir. Form_urlencoded ayrıştırıcısının adını büyük harflerle, form-urlencoded olarak iletilen parametre değerine atıfta bulunmak için noktanın sol tarafına ekleyin.
    
    Noktanın mevcut durumu: `FORM_URLENCODED_passwd_value`.

4.   Nokta, *istek gövdesinde* iletilen parametre değerine atıfta bulunmalıdır. İstek gövdesi parametre değerine atıfta bulunmak için noktanın sol tarafına `POST` ayrıştırıcısının adını ekleyin.
    
    Noktanın mevcut durumu: `POST_FORM_URLENCODED_passwd_value`.



Örnekte belirtilen koşulları karşılamak için, dördüncü adımda elde edilen nokta aşağıdaki şekillerden biriyle uzantıya eklenebilir:
* servis sembollerinden hiçbirinin çevrelemesinde olmadan.
* apostrof işaretleriyle çevrelenerek (`'POST_FORM_URLENCODED_passwd_value'`).
* tırnak işaretleriyle çevrelenerek (`"POST_FORM_URLENCODED_passwd_value"`).


## Örnek 3

Aşağıdaki istekteki `secret-word` çerezinin `abcde` değerine atıfta bulunan bir nokta oluşturmanız gerektiğini varsayalım:

```
GET /main/index.php HTTP/1.1
Host: example.com
Cookie: username=John. secret-word=abcde.
```

1.   Noktanın istek öğesinin *değerine* atıfta bulunması gerektiğinden, noktaya `value` servis kelimesini eklememiz gerekir.

    Noktanın mevcut durumu: `value`.

2.   Nokta, *`secret-word`* çerez değerine atıfta bulunmalıdır. İstenen çerez değerine atıfta bulunmak için sol tarafa `secret-word` çerez adını ekleyin.
    
    Noktanın mevcut durumu: `secret-word_value`.

3.   Nokta, *çerezin* değerine atıfta bulunmalıdır. Çerez değerine atıfta bulunmak için noktanın sol tarafına `COOKIE` ayrıştırıcısının adını ekleyin.
    
    Noktanın mevcut durumu: `COOKIE_secret-word_value`.

4.   Nokta, *Cookie başlığında* iletilen değere atıfta bulunmalıdır. Cookie adlı başlığa atıfta bulunmak için noktanın sol tarafına `Cookie` başlığının adını ekleyin.
    
    Noktanın mevcut durumu: `Cookie_COOKIE_secret-word_value`.

5.   Nokta, *başlıkta* iletilen değere atıfta bulunmalıdır. Başlık değerine atıfta bulunmak için noktanın sol tarafına `HEADER` filtresi adını ekleyin.
    
    Noktanın mevcut durumu: `HEADER_Cookie_COOKIE_secret-word_value`.



Örnekte belirtilen koşulları karşılamak için, dördüncü adımda elde edilen nokta aşağıdaki şekillerden biriyle uzantıya eklenebilir:
* servis sembollerinden hiçbirinin çevrelemesinde olmadan.
* apostrof işaretleriyle çevrelenerek (`'HEADER_Cookie_COOKIE_secret-word_value'`).
* tırnak işaretleriyle çevrelenerek (`"HEADER_Cookie_COOKIE_secret-word_value"`).