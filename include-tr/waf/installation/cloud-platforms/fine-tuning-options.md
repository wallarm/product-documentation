Dağıtım şimdi tamamlandı. Filtreleme düğümü, dağıtımdan sonra bazı ek yapılandırmalar gerektirebilir.

Wallarm ayarları [NGINX yönergeleri][wallarm-nginx-directives] veya Wallarm Console UI kullanılarak tanımlanır. Yönergeler, Wallarm örneğinde aşağıdaki dosyalarda ayarlanmalıdır:

* `/etc/nginx/sites-enabled/default` NGINX yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm.conf` Wallarm filtreleme düğümünün genel yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm-status.conf` filtreleme düğümü izleme hizmeti yapılandırmasını tanımlar
* `/opt/wallarm/wstore/wstore.yaml` postanalytics hizmeti (wstore) ayarlarını içerir

Listelenen dosyaları değiştirebilir veya NGINX ve Wallarm’ın çalışma şeklini tanımlamak için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken her bir etki alanı grubu için `server` bloğu içeren ayrı bir yapılandırma dosyası oluşturmanız önerilir (ör. `example.com.conf`). NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi için [resmi NGINX belgelerine](https://nginx.org/en/docs/beginners_guide.html) bakın.

!!! info "Yapılandırma dosyası oluşturma"
    Özel bir yapılandırma dosyası oluştururken, NGINX’in gelen bağlantıları kullanılmayan bir porttan dinlediğinden emin olun.

Aşağıda, gerektiğinde uygulayabileceğiniz bazı tipik ayarlar bulunmaktadır:

* [Wallarm düğümünün otomatik ölçeklendirilmesi][autoscaling-docs]
* [İstemcinin gerçek IP adresinin gösterilmesi][real-ip-docs]
* [Wallarm düğümleri için kaynakların ayrılması][allocate-memory-docs]
* [Tek bir isteğin işlenme süresinin sınırlandırılması][limiting-request-processing]
* [Sunucu yanıtı için bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Maksimum istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarm düğümü günlük kaydı][logs-docs]