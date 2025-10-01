Wallarm düğümünün yansıtılan trafiği işlemesi için aşağıdaki yapılandırmayı ayarlayın:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#Yansıtma sunucusunun adresiyle 222.222.222.22 değerini değiştirin
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [real_ip_header](../../using-proxy-or-balancer-en.md) yönergesi, Wallarm Console'un saldırganların IP adreslerini görüntüleyebilmesi için gereklidir.
* `wallarm_force_response_*` yönergeleri, yansıtılan trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için gereklidir.
* Kötü amaçlı istekler [engellenemez](overview.md#limitations-of-mirrored-traffic-filtration) olduğundan, `wallarm_mode` yönergesi veya Wallarm Cloud güvenli ya da normal engelleme modunu ayarlamış olsa bile (off olarak ayarlanan mod dışında), Wallarm düğümü istekleri her zaman izleme [modu](../../configure-wallarm-mode.md)nda analiz eder.

Yansıtılan trafiğin işlenmesi yalnızca NGINX tabanlı düğümler tarafından desteklenir. Sağlanan yapılandırmayı şu şekilde ayarlayabilirsiniz:

* Düğümü hepsi-bir-arada yükleyici, [AWS](../../installation-ami-en.md) veya [GCP](../../installation-gcp-en.md) bulut imajından dağıtıyorsanız - `/etc/nginx/nginx.conf` NGINX yapılandırma dosyasında.
* Düğümü [Docker image](../../installation-docker-en.md) ile dağıtıyorsanız - sağlanan yapılandırmayı içeren dosyayı konteynere bağlayın.
* Düğümü [Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md) veya [Ingress controller](../../installation-kubernetes-en.md) olarak çalıştırıyorsanız - sağlanan yapılandırmayı içeren ConfigMap'i bir pod'a bağlayın.