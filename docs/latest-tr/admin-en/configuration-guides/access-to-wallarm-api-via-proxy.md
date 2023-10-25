# Proxy Üzerinden Wallarm API'ye Erişim

Bu talimatlar, proxy sunucusu üzerinden Wallarm API'ye erişimi yapılandırma adımlarını anlatmaktadır.

* `https://api.wallarm.com/` AB Bulutu için
* `https://us1.api.wallarm.com/` ABD Bulutu için

Erişimi yapılandırmak için, proxy sunucusunu belirleyen ortam değişkenlerine yeni değerler atayın. Bu değerleri "/etc/environment" dosyasında tanımlarız:

* `https_proxy` HTTPS protokolü için bir proxy belirtmek için
* `http_proxy` HTTP protokolü için bir proxy belirtmek için
* `no_proxy` proxy'nin kullanılmaması gereken kaynakların listesini tanımlamak için

## https_proxy ve http_proxy değerleri

`https_proxy` ve `http_proxy` değişkenlerine `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` dize değerleri atayın:

* `<scheme>` kullanılan protokolü tanımlar. Mevcut ortam değişkeninin proxy'si için kurduğu protokolle eşleşmelidir
* `<proxy_user>` proxy yetkilendirmesi için kullanıcı adını tanımlar
* `<proxy_pass>` proxy yetkilendirmesi için şifreyi tanımlar
* `<host>` proxy sunucusunun konak bilgisini tanımlar
* `<port>` proxy sunucusunun port bilgisini tanımlar

## no_proxy değeri

`no_proxy` değişkenine, proxy'nin kullanılmaması gereken kaynakların IP adreslerini ve/veya alan adlarını içeren bir dizi atayın:

* `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost` düzgün bir Wallarm düğüm operasyonu için
* Ek adresler bu şekildedir: `"<res_1>, <res_2>, <res_3>, <res_4>, ..."` burada `<res_1>`, `<res_2>`, `<res_3>`, ve `<res_4>` IP adreslerini ve/veya alan adlarını temsil eder

## /etc/environment dosyasının örneği

Aşağıdaki `/etc/environment` dosyasının örneği, aşağıdaki yapılandırmayı gösterir:

* HTTPS ve HTTP istekleri, `admin` kullanıcı adı ve `01234` şifresi kullanılarak proxy sunucusunda yetki veriliyor ve `1.2.3.4` ana bilgisayara `1234` portuyla birlikte yönlendirilir.
* `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost` adreslerine gönderilen istekler için proxy'leme devre dışı bırakılmıştır.

```bash
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```