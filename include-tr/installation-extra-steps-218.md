##   Ek Ayarlar

Filtreleme düğümü, kurulumdan sonra bazı ek konfigürasyonlar gerektirebilir.

Aşağıdaki belge, ihtiyaç duyulması durumunda uygulayabileceğiniz birkaç tipik kurulumu listeler.

Diğer kullanılabilir ayarlar hakkında daha fazla bilgi almak için, [Yönetici Kılavuzu](admin-intro-en.md) bölümündeki **Konfigürasyon** bölgesine ilerleyin.

### Müşterinin gerçek IP'sinin görüntülenmesinin ayarlanması

Filtreleme düğümü, proxy sunucusunun veya yük dengeleyicinin arkasına herhangi bir ek konfigürasyon olmadan konuşlandırılırsa, istek kaynak adresi müşterinin gerçek IP adresine eşit olmayabilir. Bunun yerine, proxy sunucusunun veya yük dengeleyicinin IP adreslerinden birine eşit olabilir.

Bu durumda, filtreleme düğümünün istek kaynak adresi olarak müşterinin IP adresini almasını istiyorsanız, proxy sunucusunun veya yük dengeleyicinin [ek konfigürasyonunu](using-proxy-or-balancer-en.md) gerçekleştirmeniz gerekmektedir.

### Wallarm Tarayıcı adreslerinin izin listesine eklenmesi

Wallarm Tarayıcı, şirketinizin kaynaklarını açıklıklar için kontrol eder. Tarama, kullanılan Wallarm Bulut türüne bağlı olarak aşağıdaki listelerden birindeki IP adreslerini kullanarak yapılır:

* [ABD Bulut kullanıcıları için ABD Tarayıcı adresleri](scanner-addresses.md)
* [AB Bulut kullanıcıları için AB Tarayıcı adresleri](scanner-addresses.md)

Wallarm Tarayıcısını kullanıyorsanız, ağ kapsamındaki güvenlik yazılımınızda (örneğin, güvenlik duvarları, istila tespit sistemleri vb.) Wallarm Tarayıcı IP adreslerini içerecek şekilde izin listelerini yapılandırmanız gerekmektedir.

Örneğin, varsayılan ayarlarıyla bir Wallarm filtreleme düğümü, engelleme moduna yerleştirilir, bu da Wallarm Tarayıcısının, filtreleme düğümünün arkasındaki kaynakları tarayamamasına neden olur.

Tarayıcının tekrar çalışır hale gelmesi için, bu filtreleme düğümünde Tarayıcının IP adreslerini [izin listesine alın](scanner-ips-allowlisting.md).

### Tek isteğin işlem süresinin sınırlanması

Tek bir isteğin filtreleme düğümü tarafından işlenme süresinin sınırlanması için [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarm yönergesini kullanın.

İstek işlemi, yönergede belirtilenden daha fazla zaman alırsa, hata hakkındaki bilgiler log dosyasına girilir ve istek `overlimit_res` saldırısı olarak işaretlenir.

### Sunucu yanıt beklemesinin zaman sınırlaması

Proxy sunucu yanıtını okuma zaman aşımını belirtmek için [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINX yönergesini kullanın.

Eğer sunucu bu süre zarfında hiçbir şey göndermezse, bağlantı kapatılır.

### Maksimum istek boyutunun sınırlanması

Müşterinin isteğinin gövdesinin maksimum boyutu için sınır belirtmek için [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINX yönergesini kullanın.

Bu sınır aşıldığında, NGINX, müşteriye `413` (`Yük Kapasitesi Çok Büyük`) kodunu, aynı zamanda `İstek Birimi Çok Büyük` mesajını iletecektir.