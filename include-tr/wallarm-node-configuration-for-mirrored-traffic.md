Wallarm düğümünün aynalanan trafikleri işleyebilmesi için aşağıdaki konfigürasyonu ayarlayın:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
# 222.222.222.22'yi aynalama sunucusunun adresiyle değiştirin
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [`real_ip_header`](../../using-proxy-or-balancer-en.md) yönergesi, Wallarm Konsolunun saldırganların IP adreslerini göstermesi için gereklidir.
*  `wallarm_force_response_*` yönergeleri, aynalanan trafikten alınan kopyalar dışında tüm taleplerin analizini devre dışı bırakmak için gereklidir.
* Zararlı talepler [engellenemez](overview.md#limitations-of-mirrored-traffic-filtration), bu yüzden Wallarm düğümü, her zaman `wallarm_mode` yönergesinin veya Wallarm Bulut'un güvenli veya normal engelleme modunu ayarladığı izleme [modunda](../../configure-wallarm-mode.md) talepleri analiz eder (kapalıya ayarlanmış mod dışında).

Aynalanan trafiğin işlenmesi yalnızca NGINX tabanlı düğümler tarafından desteklenir. Verilen konfigürasyonu aşağıdakiler gibi ayarlayabilirsiniz:

* Düğümü DEB/RPM paketlerinden kuruyorsanız - `/etc/nginx/conf.d/default.conf` NGINX konfigürasyon dosyasında.
* Düğümü [AWS](../../installation-ami-en.md) veya [GCP](../../installation-gcp-en.md) bulut görüntüsünden dağıtıyorsanız - `/etc/nginx/nginx.conf` NGINX konfigürasyon dosyasında.
* Düğümü [Docker image](../../installation-docker-en.md)'dan dağıtıyorsanız - sağlanan konfigürasyonla bir dosyayı  konteınere bağlayın.
* Düğümü bir [Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md) veya [Ingress controller](../../installation-kubernetes-en.md) olarak çalıştırıyorsanız - konfikürasyonla bir ConfigMap dosyasını bir pod'a monte edin.