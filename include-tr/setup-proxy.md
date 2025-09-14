!!! info
    Bu kurulum adımı, korunan web uygulamaları ve API'lerin çalışması için kendi proxy sunucusunu kullanan kullanıcılar içindir.
    
    Bir proxy sunucusu kullanmıyorsanız, kurulumun bu adımını atlayın.

Wallarm node'u kendi proxy sunucunuzu kullanacak şekilde yapılandırmak için, kullanılan proxy sunucusunu tanımlayan ortam değişkenlerine yeni değerler atamanız gerekir.

Ortam değişkenlerinin yeni değerlerini `/etc/environment` dosyasına ekleyin:
*   https protokolü için proxy tanımlamak üzere `https_proxy` ekleyin.
*   http protokolü için proxy tanımlamak üzere `http_proxy` ekleyin.
*   Proxy’nin kullanılmaması gereken kaynakların listesini tanımlamak için `no_proxy` ekleyin.

`https_proxy` ve `http_proxy` değişkenlerine `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` biçimindeki dize değerini atayın.
* `<scheme>` kullanılan protokolü tanımlar. Geçerli ortam değişkeninin proxy’yi ayarladığı protokolle eşleşmelidir.
* `<proxy_user>` proxy yetkilendirmesi için kullanıcı adını tanımlar.
* `<proxy_pass>` proxy yetkilendirmesi için parolayı tanımlar.
* `<host>` proxy sunucusunun ana bilgisayarını tanımlar.
* `<port>` proxy sunucusunun portunu tanımlar.

Proxy’nin kullanılmaması gereken kaynakların listesini tanımlamak için, `no_proxy` değişkenine `"<res_1>, <res_2>, <res_3>, <res_4>, ..."` biçiminde bir dizi değeri atayın; burada `<res_1>`, `<res_2>`, `<res_3>` ve `<res_4>` IP adresleri ve/veya alan adlarıdır. Bu dizi IP adreslerinden ve/veya alan adlarından oluşmalıdır.

!!! warning "Proxy olmadan erişilmesi gereken kaynaklar"
    Sistemin doğru şekilde çalışması için, proxy olmadan erişilmesi gereken kaynaklar listesine şu IP adreslerini ve alan adını ekleyin: `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost`.
    `127.0.0.8` ve `127.0.0.9` IP adresleri Wallarm filtering node’un çalışması için kullanılır.

Aşağıdaki doğru `/etc/environment` dosya içeriği örneği şu yapılandırmayı göstermektedir:
*   HTTPS ve HTTP istekleri, proxy sunucusunda yetkilendirme için `admin` kullanıcı adı ve `01234` parolası kullanılarak, `1.2.3.4` ana bilgisayarındaki `1234` porta proxy üzerinden yönlendirilir.
*   `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost` hedeflerine gönderilen istekler için proxy kullanımı devre dışıdır.

```
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```