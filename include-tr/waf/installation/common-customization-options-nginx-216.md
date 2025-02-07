Common özelleştirme seçenekleri:

* [Filtreleme modunun yapılandırılması][waf-mode-instr]
* [Wallarm node değişkenlerinin günlük kaydı][logging-instr]
* [Filtreleme düğümünün arkasındaki proxy sunucusunun dengeleyicisinin kullanılması][proxy-balancer-instr]
* [Wallarm Scanner adreslerini `block` filtreleme modunda izin listesine ekleme][scanner-allowlisting-instr]
* [Tek istek işleme süresinin `wallarm_process_time_limit` yönergesinde sınırlandırılması][process-time-limit-instr]
* [NGINX yönergesi `proxy_read_timeout` içinde sunucu yanıt bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönergesi `client_max_body_size` içinde maksimum istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX'de dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]
* [**libdetection** ile saldırıların çift tespit edilmesi][enable-libdetection-docs]