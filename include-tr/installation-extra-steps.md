##   Ek ayarlar

Filtreleme düğümü, kurulumdan sonra ek yapılandırma gerektirebilir.

Aşağıdaki belge, gerektiğinde uygulayabileceğiniz tipik yapılandırmalardan birkaçını listeler.

Diğer mevcut ayarlar hakkında daha fazla bilgi edinmek için Yönetici kılavuzunun **Yapılandırma** bölümüne geçin.

### İstemcinin gerçek IP adresinin gösterimini yapılandırma

Filtreleme düğümü, ek yapılandırma yapılmadan bir proxy sunucusu veya yük dengeleyici arkasında konuşlandırılmışsa, istek kaynağı adresi, istemcinin gerçek IP adresine eşit olmayabilir. Bunun yerine, proxy sunucusunun veya yük dengeleyicinin IP adreslerinden biriyle eşleşebilir.

Bu durumda, filtreleme düğümünün istek kaynağı adresi olarak istemcinin IP adresini almasını istiyorsanız, proxy sunucusu veya yük dengeleyici için [ek yapılandırma](using-proxy-or-balancer-en.md) gerçekleştirmeniz gerekir.

### Tek isteğin işlenme süresini sınırlama

Filtreleme düğümünün tek bir isteği işleme süresini sınırlamak için [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarm yönergesini kullanın.

Eğer isteğin işlenmesi, yönergede belirtilen süreden daha fazla zaman alırsa, hata bilgisi günlük dosyasına kaydedilir ve istek `overlimit_res` saldırısı olarak işaretlenir.

### Sunucu yanıt bekleme süresini sınırlama

Proxy sunucusu yanıtını okuma zaman aşımını belirtmek için [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINX yönergesini kullanın.

Bu süre zarfında sunucu hiçbir şey göndermezse, bağlantı kapatılır.

### Maksimum istek boyutunu sınırlama

İstemcinin isteğinin gövdesinin maksimum boyutu sınırını belirtmek için [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINX yönergesini kullanın.

Bu sınır aşıldığında, NGINX istemciye `413` (`Payload Too Large`) koduyla yanıt verir, ki bu durum `Request Entity Too Large` mesajı olarak da bilinir.