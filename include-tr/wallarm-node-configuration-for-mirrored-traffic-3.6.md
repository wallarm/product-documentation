Wallarm düğümünün aynalanmış trafiği işleyebilmesi için aşağıdaki yapılandırmayı ayarlayın:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#222.222.222.22'yi aynalama sunucusunun adresiyle değiştirin
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [`real_ip_header`](../../using-proxy-or-balancer-en.md) direktifi, Wallarm Konsolunun saldırganların IP adreslerini gösterebilmesi için gereklidir.
* `wallarm_force_response_*` direktifleri, yalnızca aynalanan trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için gereklidir.
* Kötü niyetli istekler [engellenemez](overview.md#limitations-of-mirrored-traffic-filtration), bu nedenle Wallarm düğümü, `wallarm_mode` direktifi veya Wallarm Bulut güvenli veya düzenli engelleme modunu ayarlasa bile istekleri her zaman izleme [modu](../../configure-wallarm-mode.md)'nda analiz eder (kapalı olarak ayarlanan mod dışında).

Aynı trafik işlemi yalnızca NGINX tabanlı düğümler tarafından desteklenir. Verilen yapılandırmayı aşağıdaki şekillerden birinde ayarlayabilirsiniz:

* DEB/RPM paketlerinden düğümü yüklerken - `/etc/nginx/conf.d/default.conf` NGINX yapılandırma dosyasında.
* [AWS](../../installation-ami-en.md) veya [GCP](../../installation-gcp-en.md) bulut görüntüsünden düğümü dağıtırken - `/etc/nginx/nginx.conf` NGINX yapılandırma dosyasında.
* [Docker image](../../installation-docker-en.md) dosyasından düğümü dağıtırken - sağlanan yapılandırmayı içeren dosyayı konteynıra monte edin.
* Düğümü [Ingress controller](../../installation-kubernetes-en.md) olarak çalıştırırken - sağlanan yapılandırma ile ConfigMap'ı pod'a monte edin.