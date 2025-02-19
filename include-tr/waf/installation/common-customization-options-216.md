Genel özelleştirme seçenekleri:

* [Filtreleme modunun yapılandırılması][waf-mode-instr]
* [Wallarm node değişkenlerinin loglanması][logging-instr]
* [Filtreleme node'un arkasındaki proxy sunucusundaki yük dengeleyicisinin kullanılması][proxy-balancer-instr]
* [`block` filtreleme modunda Wallarm Scanner adreslerinin izin listesine eklenmesi][scanner-allowlisting-instr]
* [`wallarm_process_time_limit` yönergesinde tek bir isteğin işlenme süresinin sınırlandırılması][process-time-limit-instr]
* [NGINX yönergesi `proxy_read_timeout` ile sunucu yanıt bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönergesi `client_max_body_size` ile maksimum istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [**libdetection** ile saldırıların çift tespiti][enable-libdetection-docs]