Sık kullanılan özelleştirme seçenekleri:

* [Filtreleme modunun yapılandırılması][waf-mode-instr]
* [Wallarm düğümü değişkenlerinin günlüğe kaydedilmesi][logging-instr]
* [Filtreleme düğümünün arkasındaki proxy sunucusunun yük dengeleyicisinin kullanılması][proxy-balancer-instr]
* [`block` filtreleme modunda Wallarm'ın zafiyet tarama IP'lerinin izin listesine eklenmesi][scanner-allowlisting-instr]
* [Tek bir isteğin işleme süresinin `wallarm_process_time_limit` yönergesinde sınırlandırılması][process-time-limit-instr]
* [NGINX `proxy_read_timeout` yönergesinde sunucu yanıtı için bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX `client_max_body_size` yönergesinde en büyük istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX'te dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]
* [**libdetection** ile saldırıların çifte tespiti][enable-libdetection-docs]