Genel özelleştirme seçenekleri:

* [Filtrasyon modunun konfigürasyonu][waf-mode-instr]
* [Wallarm node değişkenlerini günlüğe kaydetme][logging-instr]
* [Filtreleme düğümünün arkasında proxy sunucunun dengeleyicisini kullanma][proxy-balancer-instr]
* [`block` filtrasyon modunda Wallarm Tarayıcı adreslerini izin listesine ekleme][scanner-allowlisting-instr]
* [`wallarm_process_time_limit` yönergesinde tek bir talebin işlenme süresini sınırlama][process-time-limit-instr]
* [NGINX yönergesi `proxy_read_timeout`'da sunucu yanıt bekleme süresini sınırla](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönergesi `client_max_body_size`'da maksimum istek boyutunu sınırla](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [**libdetection** ile saldırıların çift tespiti][enable-libdetection-docs]