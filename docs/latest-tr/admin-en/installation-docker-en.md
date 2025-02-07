```markdown
# Docker NGINX‑tabanlı Görüntüyü Çalıştırma

Wallarm NGINX‑tabanlı filtreleme düğümü, [Docker image](https://hub.docker.com/r/wallarm/node) kullanılarak dağıtılabilir. Bu düğüm, kurulum sırasında otomatik olarak tanımlanan hem x86_64 hem de ARM64 mimarilerini destekler. Bu makale, Docker görüntüsünden düğümün nasıl çalıştırılacağı konusunda yol gösterir.

Docker görüntüsü, Alpine Linux üzerine kuruludur ve Alpine tarafından sağlanan NGINX sürümünü içerir. Şu anda, en son görüntü Alpine Linux sürüm 3.20 kullanır; bu sürümde NGINX stable 1.26.2 yer alır.

## Kullanım Durumları

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## Gereksinimler

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Konteyneri Çalıştırma Seçenekleri

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam Değişkenlerini Geçirerek Konteyneri Çalıştırma

Konteyneri çalıştırmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Düğüm ile konteyneri çalıştırın:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:5.3.0
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:5.3.0
        ```

Konteynerin içine `-e` seçeneğiyle aşağıdaki temel filtreleme düğümü ayarlarını geçirebilirsiniz:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

Komut şunları yapar:

* Minimal NGINX yapılandırması bulunan `default` dosyasını oluşturur ve filtreleme düğümü yapılandırmasını konteynerdeki `/etc/nginx/sites-enabled` dizinine aktarır.
* Wallarm Cloud'a erişim için filtreleme düğümü kimlik bilgilerini içeren dosyaları konteynerdeki `/opt/wallarm/etc/wallarm` dizininde oluşturur:
    * Filtreleme düğümü UUID'si ve gizli anahtarı içeren `node.yaml`
    * Wallarm özel anahtarını içeren `private.key`
* `http://NGINX_BACKEND:80` kaynağını korur.

## Yapılandırma Dosyasını Bağlayarak Konteyneri Çalıştırma

Hazırlanan yapılandırma dosyasını Docker konteynerine `-v` seçeneği ile bağlayabilirsiniz. Dosya aşağıdaki ayarları içermelidir:

* [Filtering node directives][nginx-directives-docs]
* [NGINX settings](https://nginx.org/en/docs/beginners_guide.html)

Konteyneri çalıştırmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Düğüm ile konteyneri çalıştırın:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.0
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.0
        ```

    * `-e` seçeneği, konteynere aşağıdaki gerekli ortam değişkenlerini geçirir:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * `-v` seçeneği, yapılandırma dosyası `default`'ın bulunduğu dizini konteynerdeki `/etc/nginx/sites-enabled` dizinine bağlar.

        ??? info "Örnek `/etc/nginx/sites-enabled` minimal içeriğini görün"
            ```bash
            server {
                    listen 80 default_server;
                    listen [::]:80 default_server ipv6only=on;
                    #listen 443 ssl;

                    server_name localhost;

                    #ssl_certificate cert.pem;
                    #ssl_certificate_key cert.key;

                    root /usr/share/nginx/html;

                    index index.html index.htm;

                    wallarm_mode monitoring;

                    location / {
                            
                            proxy_pass http://example.com;
                            include proxy_params;
                    }
            }
            ```

        ??? info "Diğer yapılandırma dosyalarını bağlama"
            NGINX tarafından kullanılan konteyner dizinleri:

            * `/etc/nginx/nginx.conf` - Bu, ana NGINX yapılandırma dosyasıdır. Bu dosyayı bağlamaya karar verirseniz, Wallarm’ın doğru çalışması için ek adımlar gereklidir:

                1. `nginx.conf` dosyasının en üst seviyesine aşağıdaki ayarı ekleyin:

                    ```
                    include /etc/nginx/modules-enabled/*.conf;
                    ```
                1. `nginx.conf` dosyasında, `http` bloğu içerisinde [API Specification Enforcement][api-policy-enf-docs] yapılandırma dosyasına işaret eden `wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;` yönergesini ekleyin.
                1. `wallarm-apifw-loc.conf` dosyasını belirtilen yola bağlayın. İçeriği şu şekilde olmalıdır:

                    ```
                    location ~ ^/wallarm-apifw(.*)$ {
                            wallarm_mode off;
                            proxy_pass http://127.0.0.1:8088$1;
                            error_page 404 431         = @wallarm-apifw-fallback;
                            error_page 500 502 503 504 = @wallarm-apifw-fallback;
                            allow 127.0.0.0/8;
                            deny all;
                    }

                    location @wallarm-apifw-fallback {
                            wallarm_mode off;
                            return 500 "API FW fallback";
                    }
                    ```
                1. `/etc/nginx/conf.d/wallarm-status.conf` dosyasını aşağıdaki içerikle bağlayın. Verilen yapılandırmadaki her hangi bir satırın değiştirilmemesi, düğüm metriklerinin Wallarm Cloud’a başarılı bir şekilde yüklenmesi için çok önemlidir:

                    ```
                    server {
                      # Port, NGINX_PORT değişkeni değeriyle eşleşmelidir
                      listen 127.0.0.8:80;

                      server_name localhost;

                      allow 127.0.0.0/8;
                      deny all;

                      wallarm_mode off;
                      disable_acl "on";
                      wallarm_enable_apifw off;
                      access_log off;

                      location ~/wallarm-status$ {
                        wallarm_status on;
                      }
                    }
                    ```
                1. NGINX yapılandırma dosyanız içerisinde, `/wallarm-status` uç noktası için aşağıdaki yapılandırmayı ayarlayın:

                    ```
                    location /wallarm-status {
                        # İzin verilen adresler WALLARM_STATUS_ALLOW değişkeni değeriyle eşleşmelidir
                        allow xxx.xxx.x.xxx;
                        allow yyy.yyy.y.yyy;
                        deny all;
                        wallarm_status on format=prometheus;
                        wallarm_mode off;
                    }
                    ```
            * `/etc/nginx/conf.d` — ortak ayarlar
            * `/etc/nginx/sites-enabled` — sanal sunucu ayarları
            * `/opt/wallarm/usr/share/nginx/html` — statik dosyalar

            Gerekirse, listelenen konteyner dizinlerine herhangi bir dosya bağlayabilirsiniz. Filtreleme düğümü yönergeleri, `/etc/nginx/sites-enabled/default` dosyasında tanımlanmalıdır.

Komut şunları yapar:

* `default` dosyasını konteynerdeki `/etc/nginx/sites-enabled` dizinine bağlar.
* Wallarm Cloud’a erişmek için filtreleme düğümü kimlik bilgilerini içeren dosyaları konteynerdeki `/opt/wallarm/etc/wallarm` dizininde oluşturur:
    * Filtreleme düğümü UUID'si ve gizli anahtarı içeren `node.yaml`
    * Wallarm özel anahtarını içeren `private.key`
* `http://example.com` kaynağını korur.

## Günlük Kaydı Yapılandırması

Günlük kaydı varsayılan olarak etkindir. Günlük dizinleri şunlardır:

* `/var/log/nginx` — NGINX günlükleri
* `/opt/wallarm/var/log/wallarm` — [Wallarm node günlükleri][logging-instr]

## İzleme Yapılandırması

Filtreleme düğümünü izlemek için, konteyner içerisinde Nagios‑uyumlu betikler bulunmaktadır. Ayrıntılar için [Filtering node'un izlenmesi][doc-monitoring] belgesine bakın.

Betiklerin çalıştırılması örneği:

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>`, çalışan Wallarm Docker konteynerinin ID'sidir. ID'yi almak için `docker ps` komutunu çalıştırın ve uygun ID'yi kopyalayın.

## Wallarm Düğüm İşleyişinin Test Edilmesi

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Kullanım Durumlarının Yapılandırılması

Docker konteynerine bağlanan yapılandırma dosyası, [mevcut yönerge][nginx-directives-docs] içerisindeki filtreleme düğümü yapılandırmasını tanımlamalıdır. Aşağıda, yaygın olarak kullanılan bazı filtreleme düğümü yapılandırma seçenekleri bulunmaktadır:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"
```