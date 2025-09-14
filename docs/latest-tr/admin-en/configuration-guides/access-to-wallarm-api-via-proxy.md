# Proxy aracılığıyla Wallarm API'ye erişim

Bu talimatlar, proxy sunucusu aracılığıyla Wallarm API'ye erişimi yapılandırma adımlarını açıklar.

* EU Cloud için `https://api.wallarm.com/`
* US Cloud için `https://us1.api.wallarm.com/`

Talimatlar hem [NGINX](../../installation/nginx-native-node-internals.md#nginx-node) hem de [Native](../../installation/nginx-native-node-internals.md#native-node) düğümleri için geçerlidir.

## Kurulum sırasında ve sonrasında erişim

Aşağıdaki durumlarda erişimi yapılandırmanız gerekir:

* Düğüm kurulmadan önce - `/etc/environment` dosyasında; bu, düğüm kurulum işleminin gerekli kaynaklara proxy üzerinden erişmesine olanak tanır.
* Düğüm kurulduktan sonra - `/opt/wallarm/env.list` dosyasında; bu, kurulmuş düğümün proxy aracılığıyla Wallarm API'ye erişebilmesini sağlar. Bu dosya, düğüm kurulana kadar mevcut değildir. 

Her iki durumda da erişimi yapılandırmak için, proxy sunucusunu tanımlayan ortam değişkenlerine yeni değerler atayın:

* `https_proxy` HTTPS protokolü için proxy'yi tanımlamak için
* `http_proxy` HTTP protokolü için proxy'yi tanımlamak için
* `no_proxy` proxy kullanılmaması gereken kaynakların listesini tanımlamak için

## `https_proxy` ve `http_proxy` değerleri

`https_proxy` ve `http_proxy` değişkenlerine `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` dize değerlerini atayın:

* `<scheme>` kullanılan protokolü tanımlar. Mevcut ortam değişkeninin proxy ayarladığı protokolle eşleşmelidir
* `<proxy_user>` proxy yetkilendirmesi için kullanıcı adını tanımlar
* `<proxy_pass>` proxy yetkilendirmesi için parolayı tanımlar
* `<host>` proxy sunucusunun ana bilgisayarını tanımlar
* `<port>` proxy sunucusunun portunu tanımlar

## `no_proxy` değeri

Proxy'nin kullanılmaması gereken kaynakların IP adreslerini ve/veya alan adlarını `no_proxy` değişkenine dizi olarak atayın:

* Wallarm düğümünün doğru çalışması için `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost`
* şu biçimde ek adresler: `"<res_1>, <res_2>, <res_3>, <res_4>, ..."` burada `<res_1>`, `<res_2>`, `<res_3>` ve `<res_4>` IP adresleri ve/veya alan adlarıdır

## Yapılandırma dosyalarına örnek

Aşağıdaki `/etc/environment` ve `/opt/wallarm/env.list` dosyası örnekleri şu yapılandırmayı göstermektedir:

* HTTPS ve HTTP istekleri, proxy sunucusunda yetkilendirme için `admin` kullanıcı adı ve `01234` parolası kullanılarak, `1234` portuyla `1.2.3.4` ana bilgisayarındaki proxy'ye yönlendirilir.
* `127.0.0.1`, `127.0.0.8`, `127.0.0.9` ve `localhost` adreslerine gönderilen istekler için proxy devre dışıdır.

```bash
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```

## all-in-one betiğini çalıştırma

[all-in-one](../../installation/nginx/all-in-one.md) yükleyicisiyle bir filtreleme düğümü kurarken, betiği çalıştıran komuta `--preserve-env=https_proxy,no_proxy` bayrağını eklediğinizden emin olun, örn.:

```
sudo --preserve-env=https_proxy,no_proxy env WALLARM_LABELS='group=<GROUP>' sh wallarm-<VERSION>.<ARCH>-glibc.sh
```

Bu, kurulum sürecinde proxy ayarlarının (`https_proxy`, `no_proxy`) doğru şekilde uygulanmasını garanti eder.

## Kurulumdan sonra erişim

Düğüm kurulur kurulmaz, `/opt/wallarm/env.list` dosyasında proxy aracılığıyla Wallarm API'ye erişimini yapılandırmanız gerekir. Değişkenler ve değerler, kurulum sırasında kullanılanlarla aynıdır.

!!! info "Yapılandırma dosyasının kullanılabilirliği"
    `/opt/wallarm/env.list` dosyası, düğüm kurulana kadar mevcut değildir.

Yapılandırma dosyasını değiştirdikten sonra wallarm servisini yeniden başlatın:

```
sudo systemctl restart wallarm
```