!!! bilgi
    Bu kurulum adımı, korumalı web uygulamalarının işlemesi için kendi proxy sunucusunu kullanan kullanıcılar içindir.
    
    Proxy sunucu kullanmıyorsanız, bu kurulum adımını atlayın.

Proxy sunucusunu tanımlayan ortam değişkenlerine yeni değerler atamanız gerekmektedir, Wallarm düğümünün proxy sunucunuzu kullanacak şekilde yapılandırılması için.

Ortam değişkenlerinin yeni değerlerini `/etc/environment` dosyasına ekleyin:
*   Https protokolü için bir proxy tanımlamak için `https_proxy` ekleyin.
*   Http protokolü için bir proxy tanımlamak için `http_proxy` ekleyin.
*   Proxy'nin kullanılmaması gereken kaynakların listesini tanımlamak için `no_proxy` ekleyin.

`https_proxy` ve `http_proxy` değişkenlerine `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` dizesi değerlerini atayın.
* `<scheme>` kullanılan protokolü tanımlar. Mevcut ortam değişkeninin proxy'si için ayar kurduğu protokol ile aynı olmalıdır.
* `<proxy_user>` proxy yetkilendirmesi için kullanıcı adını tanımlar.
* `<proxy_pass>` proxy yetkilendirmesi için şifreyi tanımlar.
* `<host>` proxy sunucusunun host'unu tanımlar.
* `<port>` proxy sunucusunun portunu tanımlar.

Proxy'nin kullanılmaması gereken kaynakların listesini tanımlamak için, `<res_1>`, `<res_2>`, `<res_3>` ve `<res_4>` IP adresleri ve/veya alan adları olmak üzere, `no_proxy` değişkenine `"<res_1>, <res_2>, <res_3>, <res_4>, ..."` dizi değeri atayın. Bu dizi IP adresleri ve/veya alan adlarından oluşmalıdır.

!!! uyarı "Proxy olmadan ele alınması gereken kaynaklar"
    Sistemin doğru bir şekilde çalışabilmesi için, aşağıdaki IP adreslerini ve alan adını, bir proxy olmadan ele alınması gereken kaynakların listesine ekleyin: `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost`.
    `127.0.0.8` ve `127.0.0.9` IP adresleri Wallarm filtreleme düğümünün işlevi için kullanılır.

Aşağıda doğru `/etc/environment` dosyası içeriğinin örneği, aşağıdaki yapılandırmayı gösterir:
*   HTTPS ve HTTP istekleri, proxy sunucusunda yetkilendirme için `admin` kullanıcı adını ve `01234` şifresini kullanarak `1.2.3.4` hostuna ve `1234` portuna yönlendirilir.
*   `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost`a gönderilen istekler için proxy yapma devre dışı bırakılır.

```
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```