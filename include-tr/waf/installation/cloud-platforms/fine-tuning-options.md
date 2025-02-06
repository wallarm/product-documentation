The deployment is now complete. The filtering node may require some additional configuration after deployment.
Dağıtım artık tamamlandı. Filtreleme düğümünün dağıtımdan sonra ek yapılandırmaya ihtiyaç duyması mümkündür.

Wallarm settings are defined using the [NGINX directives][wallarm-nginx-directives] or the Wallarm Console UI. Directives should be set in the following files on the Wallarm instance:
Wallarm ayarları, [NGINX directives][wallarm-nginx-directives] veya Wallarm Console UI kullanılarak tanımlanır. Yönergeler, Wallarm örneği üzerindeki aşağıdaki dosyalarda ayarlanmalıdır:

* `/etc/nginx/sites-enabled/default` NGINX yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm.conf` Wallarm filtreleme düğümünün genel yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm-status.conf` Filtreleme düğümü izleme servisi yapılandırmasını tanımlar
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` Tarantool veritabanı ayarlarını içerir

You can modify the listed files or create your own configuration files to define the operation of NGINX and Wallarm. It is recommended to create a separate configuration file with the `server` block for each group of the domains that should be processed in the same way (e.g. `example.com.conf`). To see detailed information about working with NGINX configuration files, proceed to the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
NGINX ve Wallarm’ın çalışma şeklini tanımlamak için listelenen dosyaları değiştirebilir veya kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken her domain grubu için `server` bloğu içeren ayrı bir yapılandırma dosyası oluşturmanız önerilir (örneğin, `example.com.conf`). NGINX yapılandırma dosyalarıyla çalışma hakkında daha ayrıntılı bilgi için [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html)’a göz atın.

!!! info "Creating a configuration file"
    When creating a custom configuration file, make sure that NGINX listens to the incoming connections on the free port.
    
!!! info "Bir yapılandırma dosyası oluşturma"
    Özel bir yapılandırma dosyası oluştururken, NGINX'in gelen bağlantıları boşta olan port üzerinden dinlediğinden emin olun.

Below there are a few of the typical settings that you can apply if needed:
Aşağıda, gerekirse uygulayabileceğiniz bazı tipik ayarlar bulunmaktadır:

* [Wallarm node auto-scaling][autoscaling-docs]
* [Displaying the client's real IP][real-ip-docs]
* [Allocating resources for Wallarm nodes][allocate-memory-docs]
* [Limiting the single request processing time][limiting-request-processing]
* [Limiting the server reply waiting time](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limiting the maximum request size](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarm node logging][logs-docs]