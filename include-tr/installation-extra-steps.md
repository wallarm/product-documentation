##   Ek ayarlar

Filtreleme düğümü, kurulumdan sonra bazı ek yapılandırmalar gerektirebilir.

Aşağıdaki belge, gerekirse uygulayabileceğiniz birkaç tipik yapılandırmayı listeler.

Diğer mevcut ayarlar hakkında daha fazla bilgi için Yönetici kılavuzunun **Yapılandırma** bölümüne gidin.

### İstemcinin gerçek IP adresinin görüntülenmesini yapılandırma

Filtreleme düğümü, herhangi bir ek yapılandırma olmadan bir proxy sunucusu veya yük dengeleyicinin arkasına konuşlandırılırsa, istek kaynak adresi istemcinin gerçek IP adresine eşit olmayabilir. Bunun yerine, proxy sunucusu veya yük dengeleyicinin IP adreslerinden birine eşit olabilir.

Bu durumda, filtreleme düğümünün istemcinin IP adresini istek kaynak adresi olarak almasını istiyorsanız, proxy sunucusu veya yük dengeleyici için [ek yapılandırma](using-proxy-or-balancer-en.md) yapmanız gerekir.

### Tek bir isteğin işlenme süresini sınırlandırma

Filtreleme düğümünün tek bir isteği işlemesi için süre sınırını belirtmek amacıyla [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarm yönergesini kullanın.

İsteğin işlenmesi yönergede belirtilenden daha fazla zaman alırsa, hataya ilişkin bilgi günlük dosyasına yazılır ve istek bir `overlimit_res` saldırısı olarak işaretlenir.

### Sunucu yanıtı bekleme süresini sınırlandırma

Proxy sunucusunun yanıtını okuma zaman aşımını belirtmek için [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINX yönergesini kullanın.

Sunucu bu süre boyunca hiçbir şey göndermezse, bağlantı kapatılır.

### Azami istek boyutunu sınırlandırma

İstemci isteğinin gövdesinin azami boyutu için sınırı belirtmek üzere [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINX yönergesini kullanın.

Bu sınır aşıldığında, NGINX istemciye `413` (`Payload Too Large`) koduyla, diğer adıyla `Request Entity Too Large` mesajıyla yanıt verir.