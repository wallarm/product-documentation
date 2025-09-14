Wallarm düğümünün yansıtılan trafiği işlemesi için aşağıdaki yapılandırmayı ayarlayın:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#222.222.222.22 değerini yansıtma sunucusunun adresiyle değiştirin
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* Saldırganların IP adreslerinin Wallarm Console'da görüntülenebilmesi için [`real_ip_header`](../../using-proxy-or-balancer-en.md) yönergesi gereklidir.
* Yansıtılan trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için `wallarm_force_response_*` yönergeleri gereklidir.
* Kötü amaçlı istekler [engellenemez](overview.md#limitations-of-mirrored-traffic-filtration) olduğundan, `wallarm_mode` yönergesi veya Wallarm Cloud safe ya da regular blocking mode'u ayarlasa bile (off olarak ayarlanan mod dışında), Wallarm düğümü istekleri her zaman monitoring [mode](../../configure-wallarm-mode.md)'da analiz eder.

Yansıtılan trafiğin işlenmesi yalnızca NGINX tabanlı düğümler tarafından desteklenir. Verilen yapılandırmayı aşağıdaki şekilde uygulayabilirsiniz:

* Düğümü DEB/RPM paketlerinden kuruyorsanız - NGINX yapılandırma dosyası `/etc/nginx/conf.d/default.conf` içinde.
* Düğümü [AWS](../../installation-ami-en.md) veya [GCP](../../installation-gcp-en.md) bulut imajından dağıtıyorsanız - NGINX yapılandırma dosyası `/etc/nginx/nginx.conf` içinde.
* Düğümü [Docker imajı](../../installation-docker-en.md) ile dağıtıyorsanız - verilen yapılandırmayı içeren dosyayı konteynere bağlayın.
* Düğümü [Ingress controller](../../installation-kubernetes-en.md) olarak çalıştırıyorsanız - sağlanan yapılandırmayı içeren ConfigMap'i bir pod'a bağlayın.