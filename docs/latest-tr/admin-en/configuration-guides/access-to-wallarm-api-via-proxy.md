# Proxy Üzerinden Wallarm API'ye Erişim

Bu talimatlar, proxy sunucusu aracılığıyla Wallarm API'ye erişim yapılandırmasını gerçekleştirmek için gereken adımları açıklamaktadır.

* EU Cloud için: `https://api.wallarm.com/`
* US Cloud için: `https://us1.api.wallarm.com/`

Erişim yapılandırması için, `/etc/environment` dosyasında kullanılan proxy sunucusunu tanımlayan ortam değişkenlerine yeni değerler atayın:

* `https_proxy` – HTTPS protokolü için bir proxy tanımlar
* `http_proxy` – HTTP protokolü için bir proxy tanımlar
* `no_proxy` – Proxy'nin kullanılmaması gereken kaynakların listesini tanımlar

## https_proxy ve http_proxy Değerleri

`https_proxy` ve `http_proxy` değişkenlerine `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` biçimindeki string değerlerini atayın:

* `<scheme>` kullanılan protokolü tanımlar. Geçerli ortam değişkeni için kurulan proxy protokolü ile eşleşmelidir
* `<proxy_user>` proxy yetkilendirmesi için kullanıcı adını tanımlar
* `<proxy_pass>` proxy yetkilendirmesi için şifreyi tanımlar
* `<host>` proxy sunucusunun ana bilgisayarını tanımlar
* `<port>` proxy sunucusunun portunu tanımlar

## no_proxy Değeri

`no_proxy` değişkenine, proxy'nin kullanılmaması gereken kaynakların IP adresleri ve/veya alan adlarının listesini atayın:

* Wallarm node'un doğru çalışması için `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost`
* Ek biçimde, `<res_1>`, `<res_2>`, `<res_3>`, `<res_4>` gibi IP adresleri ve/veya alan adlarını `" <res_1>, <res_2>, <res_3>, <res_4>, ..."` formatında ekleyebilirsiniz

## /etc/environment Dosyası Örneği

Aşağıdaki `/etc/environment` dosyası örneği, şu yapılandırmayı göstermektedir:

* HTTPS ve HTTP istekleri, proxy sunucusunda yetkilendirme için `admin` kullanıcı adı ile `01234` şifresini kullanarak `1.2.3.4` ana bilgisayarına ve `1234` portuna yönlendirilir.
* `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost` adreslerine gönderilen istekler için proxy devre dışı bırakılmıştır.

```bash
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```

## all-in-one Betiğinin Çalıştırılması

[all-in-one](../../installation/nginx/all-in-one.md) yükleyicisi ile filtering node kurulurken, betiği çalıştıran komuta `--preserve-env=https_proxy,no_proxy` bayrağını eklediğinizden emin olun, örneğin:

```
sudo --preserve-env=https_proxy,no_proxy env WALLARM_LABELS='group=<GROUP>' sh wallarm-<VERSION>.<ARCH>-glibc.sh
```

Bu, kurulum işlemi sırasında proxy ayarlarının (`https_proxy`, `no_proxy`) doğru şekilde uygulanmasını garanti eder.