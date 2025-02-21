For the Wallarm node to process mirrored traffic, set the following configuration:  
Wallarm düğümünün yansıtılan trafiği işlemesi için aşağıdaki konfigürasyonu ayarlayın:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#Change 222.222.222.22 to the address of the mirroring server
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* Wallarm Console'un saldırganların IP adreslerini göstermesi için [`real_ip_header`](../../using-proxy-or-balancer-en.md) yönergesi gereklidir.  
* Yansıtılan trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için `wallarm_force_response_*` yönergeleri gereklidir.  
* Kötü amaçlı istekler [engellenemez](overview.md#limitations-of-mirrored-traffic-filtration) olduğundan, Wallarm düğümü, wallarm_mode yönergesi veya Wallarm Cloud güvenli ya da normal engelleme modunu (kapalı mod hariç) ayarlasa dahi istekleri her zaman [izleme modunda](../../configure-wallarm-mode.md) analiz eder.

Yansıtılan trafik işlemi yalnızca NGINX tabanlı düğümler tarafından desteklenmektedir. Sağlanan konfigürasyonu aşağıdaki şekilde ayarlayabilirsiniz:

* Düğümleri DEB/RPM paketlerinden kuruyorsanız - `/etc/nginx/conf.d/default.conf` NGINX konfigürasyon dosyasında.  
* Düğümleri [AWS](../../installation-ami-en.md) veya [GCP](../../installation-gcp-en.md) bulut imajından dağıtıyorsanız - `/etc/nginx/nginx.conf` NGINX konfigürasyon dosyasında.  
* Düğümleri [Docker image](../../installation-docker-en.md) üzerinden dağıtıyorsanız - sağlanan konfigürasyon dosyasını konteynıra monte edin.  
* Düğümleri [Ingress controller](../../installation-kubernetes-en.md) olarak çalıştırıyorsanız - sağlanan konfigürasyonu içeren ConfigMap'i bir pod'a monte edin.