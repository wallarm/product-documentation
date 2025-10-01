Yaygın özelleştirme seçenekleri:

* [Filtreleme modunun yapılandırılması][waf-mode-instr]
* [Wallarm düğüm değişkenlerinin günlüğe kaydedilmesi][logging-instr]
* [Filtreleme düğümünün arkasındaki proxy sunucusunun yük dengeleyicisinin kullanılması][proxy-balancer-instr]
* [`block` filtreleme modunda Wallarm'ın güvenlik açığı tarama IP’lerinin izin listesine eklenmesi][scanner-allowlisting-instr]
* [`wallarm_process_time_limit` yönergesinde tek bir isteğin işlenme süresinin sınırlandırılması][process-time-limit-instr]
* [NGINX yönergesi `proxy_read_timeout` içinde sunucu yanıtı bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönergesi `client_max_body_size` içinde azami istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [**libdetection** ile saldırıların çift tespiti][enable-libdetection-docs]