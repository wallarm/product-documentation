Genel özelleştirme seçenekleri:

* [Filtrasyon modunun konfigürasyonu][waf-mode-instr]
* [Wallarm düğüm değişkenlerinin kaydedilmesi][logging-instr]
* [Filtreleme düğümünün arkasında proxy sunucunun dengeleyicinin kullanılması][proxy-balancer-instr]
* [`Block` filtrasyon modunda Wallarm Tarayıcı adreslerinin izin listesine eklenmesi][scanner-allowlisting-instr]
* [`wallarm_process_time_limit` direktifinde tek bir isteğin işlenme süresinin sınırlanması][process-time-limit-instr]
* [NGINX diretifinde `proxy_read_timeout` olan sunucu yanıt bekleme süresinin sınırlanması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX direktifinde `client_max_body_size` olan maksimum istek boyutunun sınırlanması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX'te dinamik DNS çözünürlüğünün konfigüre edilmesi][dynamic-dns-resolution-nginx]
* [**libdetection** ile saldırıların çift tespiti][enable-libdetection-docs]