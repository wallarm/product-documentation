## Ek Ayarlar

Filtreleme düğümü, kurulumdan sonra ek bir konfigürasyon gerektirebilir.

Aşağıdaki belge, gerektiğinde uygulayabileceğiniz tipik ayarların birkaçını listeler.

Diğer kullanılabilir ayarlar hakkında daha fazla bilgi almak için, Yönetici kılavuzunun **Konfigürasyon** bölümüne devam edin.

### Müşterinin gerçek IP'sinin gösterilmesinin yapılandırılması

Filtreleme düğümü ek bir konfigürasyon olmaksızın bir proxy sunucusu veya yük dengeleyicinin arkasında konuşlandırılırsa, isteğin kaynak adresi müşterinin gerçek IP adresine eşit olmayabilir. Bunun yerine, proxy sunucusunun veya yük dengeleyicinin IP adreslerinden birine eşit olabilir.

Bu durumda, filtreleme düğümünün bir istek kaynak adresi olarak müşterinin IP adresini almasını istiyorsanız, proxy sunucusunun veya yük dengeleyicinin [ek bir konfigürasyonunu](using-proxy-or-balancer-en.md) gerçekleştirmeniz gerekmektedir.

### Tek istek işleme süresini sınırlama

Filtreleme düğümü tarafından tek bir isteğin işlenme süresinin sınırını belirtmek için [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarm yönergesini kullanın.

İsteğin işlenmesi, yönergede belirtilenden daha fazla zaman alırsa, hata bilgileri günlük dosyasına girilir ve istek `overlimit_res` saldırısı olarak işaretlenir.

### Sunucu yanıt bekleme süresini sınırlama

Proxy sunucusunun yanıtını okuma için zamanaşımını belirtmek için [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINX yönergesini kullanın.

Eğer sunucu bu süre zarfında hiçbir şey göndermezse, bağlantı kapanır.

### Maksimum istek boyutunu sınırlama

Müşterinin isteğinin gövdesinin maksimum boyutu için sınırı belirtmek için [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINX yönergesini kullanın.

Bu sınır aşıldığında, NGINX müşteriye `413` (`Yük Çok Büyük`) koduyla yanıt verir, ayrıca `İstek Varlığı Çok Büyük` mesajı olarak da bilinir.