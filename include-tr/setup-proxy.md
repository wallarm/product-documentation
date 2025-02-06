!!! info
    Bu kurulum adımı, korunan web uygulamalarının çalışması için kendi proxy sunucusunu kullanan kullanıcılar içindir.
    
    Bir proxy sunucusu kullanmıyorsanız, bu kurulum adımını atlayın.

Wallarm node'u, proxy sunucunuzu kullanmak üzere yapılandırmak için, kullanılan proxy sunucusunu tanımlayan ortam değişkenlerine yeni değerler atamanız gerekmektedir.

Yeni ortam değişkeni değerlerini `/etc/environment` dosyasına ekleyin:
*   HTTPS protokolü için bir proxy tanımlamak amacıyla `https_proxy` ekleyin.
*   HTTP protokolü için bir proxy tanımlamak amacıyla `http_proxy` ekleyin.
*   Proxy kullanılmaması gereken kaynakların listesini tanımlamak için `no_proxy` ekleyin.

`https_proxy` ve `http_proxy` değişkenlerine `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` string değerlerini atayın.
* `<scheme>`, kullanılan protokolü tanımlar. Bu, mevcut ortam değişkeninin proxy ayarını yaptığı protokolle eşleşmelidir.
* `<proxy_user>`, proxy yetkilendirmesi için kullanıcı adını tanımlar.
* `<proxy_pass>`, proxy yetkilendirmesi için şifreyi tanımlar.
* `<host>`, proxy sunucusunun ana bilgisayarını tanımlar.
* `<port>`, proxy sunucusunun portunu tanımlar.

`no_proxy` değişkenine, `<res_1>, <res_2>, <res_3>, <res_4>, ...` şeklinde dizisel bir değer atayın; burada `<res_1>`, `<res_2>`, `<res_3>` ve `<res_4>` IP adresleri ve/veya alan adlarıdır. Bu dizi, sadece IP adreslerinden ve/veya alan adlarından oluşmalıdır.

!!! warning "Proxy olmaksızın adreslenmesi gereken kaynaklar"
    Sistemin doğru çalışması için proxy kullanılmadan adreslenmesi gereken kaynaklar listesine aşağıdaki IP adresleri ve alan adını ekleyin: `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost`.
    `127.0.0.8` ve `127.0.0.9` IP adresleri, Wallarm filtreleme düğümünün çalışması için kullanılır.

Aşağıdaki örnek, doğru `/etc/environment` dosya içeriği yapılandırmasını göstermektedir:
*   HTTPS ve HTTP istekleri, proxy sunucusunda yetkilendirme için `admin` kullanıcı adı ve `01234` şifresi kullanılarak, `1.2.3.4` ana bilgisayarı ile `1234` portuna proxy üzerinden iletilmektedir.
*   Proxy, `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost` adreslerine gönderilen istekler için devre dışı bırakılmıştır.

```
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```