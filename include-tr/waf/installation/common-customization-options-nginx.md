Yaygın özelleştirme seçenekleri:

* [Filtreleme modunun yapılandırılması][waf-mode-instr]
* [Wallarm düğüm değişkenlerinin günlüğe kaydedilmesi][logging-instr]
* [Filtreleme düğümünün arkasındaki proxy sunucunun yük dengeleyicisinin kullanılması][proxy-balancer-instr]
* [Tek bir isteğin işlenme süresinin `wallarm_process_time_limit` yönergesinde sınırlandırılması][process-time-limit-instr]
* [NGINX yönergesi `proxy_read_timeout` ile sunucu yanıtı bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönergesi `client_max_body_size` ile en büyük istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX’te dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]
* [Saldırıların **libdetection** ile çift tespiti][enable-libdetection-docs]