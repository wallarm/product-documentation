##   Ek Ayarlar

Filtreleme düğümü, kurulum sonrasında bazı ek yapılandırmalar gerektirebilir.

Aşağıdaki belge, gerekirse uygulayabileceğiniz bazı tipik yapılandırmaları listeler.

Diğer mevcut ayarlar hakkında daha fazla bilgi edinmek için [Yönetici Kılavuzu](admin-intro-en.md) içerisindeki **Yapılandırma** bölümüne geçin.

### İstemcinin Gerçek IP'sinin Görüntülenmesini Yapılandırma

Filtreleme düğümü, ek yapılandırma olmaksızın bir proxy sunucusu veya yük dengeleyicisi arkasında dağıtıldıysa, istek kaynağı adresi, istemcinin gerçek IP adresiyle aynı olmayabilir. Bunun yerine, proxy sunucusu veya yük dengeleyicisinin IP adreslerinden biri olabilir.

Bu durumda, filtreleme düğümünün istek kaynağı adresi olarak istemcinin IP adresini almasını istiyorsanız, proxy sunucusu veya yük dengeleyici için [ek yapılandırma](using-proxy-or-balancer-en.md) yapmanız gerekir.

### Wallarm Scanner Adreslerinin Beyaz Listeye Eklenmesi

Wallarm Scanner, şirketinizin kaynaklarını güvenlik açıkları açısından kontrol eder. Tarama, kullandığınız Wallarm Cloud türüne bağlı olarak aşağıdaki listelerden birinde yer alan IP adresleri kullanılarak gerçekleştirilir:

* [US Scanner addresses for US Cloud users](scanner-address-us-cloud.md)
* [EU Scanner addresses for EU Cloud users](scanner-address-eu-cloud.md)

Wallarm Scanner kullanıyorsanız, ağ kapsamlı güvenlik yazılımınızda (örneğin: güvenlik duvarları, saldırı tespit sistemleri vb.) Wallarm Scanner IP adreslerinin yer aldığı beyaz liste yapılandırmalarını gerçekleştirmeniz gerekir.

Örneğin, varsayılan ayarlarla yapılandırılmış bir Wallarm filtreleme düğümü engelleme modunda konumlandırıldığından, Wallarm Scanner bu düğüm arkasındaki kaynakları tarayamaz.

Wallarm Scanner'ı tekrar çalışır hale getirmek için, bu filtreleme düğümünde [Scanner IP adreslerini beyaz listeye ekleyin](scanner-ips-allowlisting.md).

### Tek İstek İşlem Süresini Sınırlama

Tek bir isteğin filtreleme düğümü tarafından işlenme süresi sınırını belirtmek için [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarm yönergesini kullanın.

Eğer isteğin işlenmesi, yönergede belirtilen süreden daha uzun sürerse, hata bilgisi log dosyasına kaydedilir ve istek `overlimit_res` saldırısı olarak işaretlenir.

### Sunucu Yanıt Bekleme Süresini Sınırlama

Proxy sunucu yanıtını okuma zaman aşımını belirtmek için [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINX yönergesini kullanın.

Bu süre içinde sunucudan hiçbir şey gönderilmezse, bağlantı kapatılır.

### Maksimum İstek Boyutunu Sınırlama

İstemcinin isteğinin gövdesinin maksimum boyut sınırını belirtmek için [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINX yönergesini kullanın.

Bu sınır aşılırsa, NGINX istemciye `413` (`Payload Too Large`) kodu, diğer adıyla `Request Entity Too Large` mesajıyla yanıt verir.