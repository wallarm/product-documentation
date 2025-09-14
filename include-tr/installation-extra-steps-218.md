##   Ek ayarlar

Filtreleme düğümü, kurulumdan sonra bazı ek yapılandırmalar gerektirebilir.

Aşağıdaki belge, gerekirse uygulayabileceğiniz birkaç tipik kurulumu listeler.

Diğer kullanılabilir ayarlar hakkında daha fazla bilgi için, [Yönetici kılavuzunun](admin-intro-en.md) **Yapılandırma** bölümüne ilerleyin.

### İstemcinin gerçek IP’sinin görüntülenmesini yapılandırma

Filtreleme düğümü bir proxy sunucusu veya yük dengeleyicinin arkasına ek bir yapılandırma olmadan yerleştirilirse, isteğin kaynak adresi, istemcinin gerçek IP adresine eşit olmayabilir. Bunun yerine, proxy sunucusunun veya yük dengeleyicinin IP adreslerinden birine eşit olabilir.

Bu durumda, filtreleme düğümünün istemcinin IP adresini istek kaynağı adresi olarak almasını istiyorsanız, proxy sunucusunu veya yük dengeleyiciyi [ek yapılandırma](using-proxy-or-balancer-en.md) ile ayarlamanız gerekir.

### Wallarm Scanner adreslerini izin listesine ekleme

Wallarm Scanner, şirketinizin kaynaklarını güvenlik açıkları için kontrol eder. Tarama, kullandığınız Wallarm Cloud türüne bağlı olarak aşağıdaki listelerden birindeki IP adresleri kullanılarak yapılır:

* [US Cloud kullanıcıları için US Scanner adresleri](scanner-address-us-cloud.md)
* [EU Cloud kullanıcıları için EU Scanner adresleri](scanner-address-eu-cloud.md)

Wallarm Scanner’ı kullanıyorsanız, ağınızdaki güvenlik yazılımlarında (güvenlik duvarları, saldırı tespit sistemleri vb. gibi) Wallarm Scanner IP adreslerini içerecek şekilde izin listelerini yapılandırmanız gerekir.

Örneğin, varsayılan ayarlarla bir Wallarm filtreleme düğümü engelleme modunda çalışır ve bu da Wallarm Scanner’ın filtreleme düğümünün arkasındaki kaynakları tarayamamasına neden olur.

Scanner’ın tekrar çalışabilmesi için, bu filtreleme düğümünde [Scanner’ın IP adreslerini izin listesine alın](scanner-ips-allowlisting.md).

### Tek bir isteğin işlenme süresini sınırlama

Filtreleme düğümünün tek bir isteği işlemesi için süre sınırını belirtmek üzere [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarm yönergesini kullanın.

İsteğin işlenmesi yönergede belirtilenden daha uzun sürerse, hataya ilişkin bilgiler günlük dosyasına yazılır ve istek bir `overlimit_res` saldırısı olarak işaretlenir.

### Sunucu yanıtını bekleme süresini sınırlama

Proxy sunucusunun yanıtını okuma zaman aşımını belirtmek için [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINX yönergesini kullanın.

Sunucu bu süre boyunca hiçbir şey göndermezse, bağlantı kapatılır.

### Azami istek boyutunu sınırlama

İstemcinin isteğinin gövdesi için azami boyut sınırını belirtmek üzere [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINX yönergesini kullanın.

Bu sınır aşılırsa, NGINX istemciye `413` (`Payload Too Large`) kodu ile yanıt verir; bu aynı zamanda `Request Entity Too Large` iletisi olarak da bilinir.