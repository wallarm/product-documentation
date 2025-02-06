The deployment is now complete. The filtering node may require some additional configuration after deployment.
Dağıtım artık tamamlandı. Dağıtım sonrasında filtreleme düğümünde ek yapılandırmalara ihtiyaç duyulabilir.

Wallarm settings are defined using the [NGINX directives][wallarm-nginx-directives] or the Wallarm Console UI. Directives should be set in the following files on the Wallarm instance:
Wallarm ayarları, [NGINX directives][wallarm-nginx-directives] veya Wallarm Console UI kullanılarak tanımlanır. Yönergeler, Wallarm örneğinde aşağıdaki dosyalarda ayarlanmalıdır:

* `/etc/nginx/sites-enabled/default` defines the configuration of NGINX  
  `/etc/nginx/sites-enabled/default`, NGINX yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm.conf` defines the global configuration of Wallarm filtering node  
  `/etc/nginx/conf.d/wallarm.conf`, Wallarm filtreleme düğümünün genel yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm-status.conf` defines the filtering node monitoring service configuration  
  `/etc/nginx/conf.d/wallarm-status.conf`, filtreleme düğümü izleme hizmeti yapılandırmasını tanımlar
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings  
  Tarantool veritabanı ayarları ile birlikte `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`

You can modify the listed files or create your own configuration files to define the operation of NGINX and Wallarm. It is recommended to create a separate configuration file with the `server` block for each group of the domains that should be processed in the same way (e.g. `example.com.conf`). To see detailed information about working with NGINX configuration files, proceed to the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
Belirtilen dosyaları değiştirebilir veya NGINX ve Wallarm’ın çalışma şeklini tanımlamak için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken domain gruplarının her biri için `server` bloğu içeren ayrı bir yapılandırma dosyası oluşturmanız tavsiye edilir (ör. `example.com.conf`). NGINX yapılandırma dosyalarıyla ilgili detaylı bilgi için [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html) sayfasına göz atın.

!!! info "Creating a configuration file"
    When creating a custom configuration file, make sure that NGINX listens to the incoming connections on the free port.
    
    !!! info "Bir yapılandırma dosyası oluşturma"
        Özel bir yapılandırma dosyası oluştururken, NGINX’nin boşta olan port üzerinden gelen bağlantıları dinlediğinden emin olun.

Below there are a few of the typical settings that you can apply if needed:
Aşağıda, ihtiyaç duyulması halinde uygulayabileceğiniz tipik ayarlardan bazıları yer almaktadır:

* [Wallarm node auto-scaling][autoscaling-docs]
* [Displaying the client's real IP][real-ip-docs]
* [Allocating resources for Wallarm nodes][allocate-memory-docs]
* [Limiting the single request processing time][limiting-request-processing]
* [Limiting the server reply waiting time](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limiting the maximum request size](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarm node logging][logs-docs]