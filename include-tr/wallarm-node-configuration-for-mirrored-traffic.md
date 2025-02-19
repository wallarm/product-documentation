For the Wallarm düğümünün yansıtılmış trafiği işlemesi için aşağıdaki yapılandırmayı ayarlayın:

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

* [`real_ip_header`](../../using-proxy-or-balancer-en.md) yönergesi, Wallarm Console'un saldırganların IP adreslerini göstermesi için gereklidir.
* Yansıtılmış trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için `wallarm_force_response_*` yönergeleri gereklidir.
* Kötü niyetli istekler [engellenemediği](overview.md#limitations-of-mirrored-traffic-filtration) için, Wallarm düğümü, `wallarm_mode` yönergesi veya Wallarm Cloud güvenli ya da normal engelleme modunu (kapalı mod hariç) ayarlasa dahi, istekleri izleme [modunda](../../configure-wallarm-mode.md) analiz eder.

Yansıtılmış trafiğin işlenmesi yalnızca NGINX tabanlı düğümler tarafından desteklenir. Sağlanan yapılandırmayı aşağıdaki gibi ayarlayabilirsiniz:

* Düğümü all-in-one yükleyicisinden, [AWS](../../installation-ami-en.md) veya [GCP](../../installation-gcp-en.md) bulut görüntüsünden dağıtıyorsanız - `/etc/nginx/nginx.conf` NGINX yapılandırma dosyasında.
* Düğümü [Docker image](../../installation-docker-en.md) üzerinden dağıtıyorsanız - sağlanan yapılandırma dosyasını konteynıra monte edin.
* Düğümü [Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md) veya [Ingress controller](../../installation-kubernetes-en.md) olarak çalıştırıyorsanız - sağlanan yapılandırmaya sahip ConfigMap'i bir pod'a monte edin.