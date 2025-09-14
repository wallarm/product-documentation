Yaygın özelleştirme seçenekleri:

* [Filtreleme modunun yapılandırılması][waf-mode-instr]
* [Wallarm düğüm değişkenlerinin günlüğe kaydedilmesi][logging-instr]
* [Filtreleme düğümünün arkasındaki proxy sunucusunun yük dengeleyicisinin kullanılması][proxy-balancer-instr]
* [`wallarm_process_time_limit` yönergesinde tek bir isteğin işlenme süresinin sınırlandırılması][process-time-limit-instr]
* [NGINX `proxy_read_timeout` yönergesinde sunucu yanıtı bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX `client_max_body_size` yönergesinde maksimum istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [**libdetection** ile saldırıların çift tespiti][enable-libdetection-docs]