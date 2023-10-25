Dağıtım artık tamamlandı. Filtreleme düğümü, dağıtımdan sonra ek bir yapılandırmayı gerektirebilir.

Wallarm ayarları, [NGINX yönergeleri][wallarm-nginx-directives] veya Wallarm Konsol UI aracılığıyla belirlenir. Yönergeler, Wallarm örneğindeki aşağıdaki dosyalara ayarlanmalıdır:

* `/etc/nginx/sites-enabled/default` NGINX yapılandırmasını belirtir.
* `/etc/nginx/conf.d/wallarm.conf` Wallarm filtreleme düğümünün genel yapılandırmasını belirtir.
* `/etc/nginx/conf.d/wallarm-status.conf` filtreleme düğümü izleme hizmeti yapılandırmasını belirtir.
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` Tarantool veritabanı ayarlarıyla birlikte gelir.

Yukarıda listelenen dosyaları değiştirebilir veya NGINX ve Wallarm'ın işleyişini belirlemek için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken alan adları grubu için her biri `server` bloğuyla ayrı bir yapılandırma dosyası oluşturmanız önerilir (örneğin `example.com.conf`). NGINX yapılandırma dosyalarıyla çalışma hakkında detaylı bilgi için, [resmi NGINX belgelerine](https://nginx.org/en/docs/beginners_guide.html) başvurun.

!!! bilgi "Yapılandırma dosyası oluşturma"
    Özel bir yapılandırma dosyası oluştururken, NGINX'in boşta olan portta gelen bağlantıları dinlediğinden emin olun.

Aşağıda, gerektiğinde uygulayabileceğiniz tipik ayarların birkaçı bulunmaktadır:

* [Wallarm düğümünün otomatik ölçeklendirme][autoscaling-docs]
* [İstemcinin gerçek IP'sini gösterme][real-ip-docs]
* [Wallarm düğümleri için kaynak tahsis etme][allocate-memory-docs]
* [Tek istek işleme süresini sınırlama][limiting-request-processing]
* [Sunucu yanıt bekleme süresini sınırlama](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Maksimum istek boyutunu sınırlama](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarm düğüm seviyesinde günlük tutma][logs-docs]