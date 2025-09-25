Dağıtım artık tamamlandı. Filtreleme düğümü, dağıtımdan sonra bazı ek yapılandırmalar gerektirebilir.

Wallarm ayarları [NGINX direktifleri][wallarm-nginx-directives] veya Wallarm Console UI kullanılarak tanımlanır. Direktifler, Wallarm örneğinde aşağıdaki dosyalarda ayarlanmalıdır:

* `/etc/nginx/sites-enabled/default` NGINX yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm.conf` Wallarm filtreleme düğümünün genel yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm-status.conf` filtreleme düğümü izleme servisi yapılandırmasını tanımlar
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` Tarantool veritabanı ayarlarını içerir

Listelenen dosyaları değiştirebilir veya NGINX ve Wallarm'ın çalışma şeklini tanımlamak için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken her etki alanı grubu için `server` bloğu bulunan ayrı bir yapılandırma dosyası oluşturmanız önerilir (örn. `example.com.conf`). NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi için [resmi NGINX dokümantasyonuna](https://nginx.org/en/docs/beginners_guide.html) bakın.

!!! info "Yapılandırma dosyası oluşturma"
    Özel bir yapılandırma dosyası oluştururken, NGINX’in gelen bağlantıları kullanılmayan bir portta dinlediğinden emin olun.

Aşağıda, gerekirse uygulayabileceğiniz tipik ayarlardan bazıları bulunmaktadır:

* [Wallarm düğümü için otomatik ölçeklendirme][autoscaling-docs]
* [İstemcinin gerçek IP’sinin görüntülenmesi][real-ip-docs]
* [Wallarm düğümleri için kaynak tahsisi][allocate-memory-docs]
* [Tek bir isteğin işlenme süresini sınırlandırma][limiting-request-processing]
* [Sunucu yanıtı bekleme süresini sınırlandırma](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Maksimum istek boyutunu sınırlandırma](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarm düğümünde günlükleme][logs-docs]