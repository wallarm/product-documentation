# Docker NGINX‑tabanlı İmajı Çalıştırma

Wallarm NGINX tabanlı filtreleme düğümü bir [Docker imajı](https://hub.docker.com/r/wallarm/node) kullanılarak dağıtılabilir. Bu düğüm hem x86_64 hem de ARM64 mimarilerini destekler ve kurulum sırasında otomatik olarak belirlenir. Bu makale, [inline trafik filtreleme][inline-docs] için düğümün Docker imajından nasıl çalıştırılacağını açıklar.

Docker imajı Alpine Linux’a ve Alpine’in sağladığı NGINX sürümüne dayanır. Şu anda en güncel imaj, NGINX stable 1.28.0 içeren Alpine Linux 3.22 sürümünü kullanır.

## Kullanım senaryoları

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## Gereksinimler

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Konteyneri çalıştırma seçenekleri

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam değişkenlerini geçirerek konteyneri çalıştırma

Konteyneri çalıştırmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Düğüm ile konteyneri çalıştırın:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:6.5.1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:6.5.1
        ```

Aşağıdaki temel filtreleme düğümü ayarlarını `-e` seçeneği ile konteynere iletebilirsiniz:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

Komut şunları yapar:

* `/etc/nginx/http.d` konteyner dizininde minimal NGINX yapılandırmasına sahip `default.conf` dosyasını oluşturur ve filtreleme düğümü yapılandırmasını iletir.
* Wallarm Cloud’a erişim için filtreleme düğümü kimlik bilgilerini içeren dosyaları `/opt/wallarm/etc/wallarm` konteyner dizininde oluşturur:
    * Filtreleme düğümü UUID’si ve gizli anahtarıyla `node.yaml`
    * Wallarm özel anahtarını içeren `private.key`
* `http://NGINX_BACKEND:80` kaynağını korur.

## Yapılandırma dosyasını bağlayarak konteyneri çalıştırma

Hazırlanmış yapılandırma dosyasını `-v` seçeneğiyle Docker konteynerine bağlayabilirsiniz. Dosya aşağıdaki ayarları içermelidir:

* [Filtreleme düğümü yönergeleri][nginx-directives-docs]
* [NGINX ayarları](https://nginx.org/en/docs/beginners_guide.html)

Konteyneri çalıştırmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Düğüm ile konteyneri çalıştırın:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/http.d/default.conf -p 80:80 wallarm/node:6.5.1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/http.d/default.conf -p 80:80 wallarm/node:6.5.1
        ```

    * `-e` seçeneği, aşağıdaki zorunlu ortam değişkenlerini konteynere iletir:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * `-v` seçeneği, `default.conf` yapılandırma dosyasını içeren dizini `/etc/nginx/http.d` konteyner dizinine bağlar.

        ??? info "Örnek `/etc/nginx/http.d/default.conf` minimal içeriği için bakın"
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

            * `/etc/nginx/nginx.conf` - Bu, ana NGINX yapılandırma dosyasıdır. Bu dosyayı bağlamaya karar verirseniz, Wallarm’ın düzgün çalışması için ek adımlar gereklidir:

                1. `nginx.conf` dosyasında, en üst düzeye aşağıdaki ayarı ekleyin:

                    ```
                    include /etc/nginx/modules/*.conf;
                    ```
                1. `nginx.conf` içinde, `http` bloğuna `wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;` yönergesini ekleyin. Bu, [API Spesifikasyonu Zorlaması][api-policy-enf-docs] için yapılandırma dosyasının yolunu belirtir.
                1. `wallarm-apifw-loc.conf` dosyasını belirtilen yola bağlayın. İçeriği şu şekilde olmalıdır:

                    ```
                    location ~ ^/wallarm-apifw(.*)$ {
                            wallarm_mode off;
                            proxy_pass http://127.0.0.1:8088$1;
                            error_page 404 431         = @wallarm-apifw-fallback;
                            error_page 500 502 503 504 = @wallarm-apifw-fallback;
                            allow 127.0.0.8/8;
                            deny all;
                    }

                    location @wallarm-apifw-fallback {
                            wallarm_mode off;
                            return 500 "API FW fallback";
                    }
                    ```
                1. Aşağıdaki içerikle `/etc/nginx/conf.d/wallarm-status.conf` dosyasını bağlayın. Sağlanan yapılandırmadaki herhangi bir satırı değiştirmemek kritik önemdedir; aksi halde düğüm metriklerinin Wallarm Cloud’a başarılı şekilde yüklenmesini engelleyebilir.

                    ```
                    server {
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
                1. NGINX yapılandırma dosyanız içinde, `/wallarm-status` uç noktası için aşağıdaki yapılandırmayı oluşturun:

                    ```
                    location /wallarm-status {
                        # İzin verilen adresler, WALLARM_STATUS_ALLOW değişkeninin değeriyle eşleşmelidir
                        allow xxx.xxx.x.xxx;
                        allow yyy.yyy.y.yyy;
                        deny all;
                        wallarm_status on format=prometheus;
                        wallarm_mode off;
                    }
                    ```
            * `/etc/nginx/conf.d` — genel ayarlar
            * `/etc/nginx/http.d` — sanal ana bilgisayar ayarları
            * `/opt/wallarm/usr/share/nginx/html` — statik dosyalar

            Gerekirse, listelenen konteyner dizinlerine herhangi bir dosyayı bağlayabilirsiniz. Filtreleme düğümü yönergeleri `/etc/nginx/http.d/default.conf` dosyasında tanımlanmalıdır.

Komut şunları yapar:

* `default.conf` dosyasını `/etc/nginx/http.d` konteyner dizinine bağlar.
* Wallarm Cloud’a erişim için filtreleme düğümü kimlik bilgilerini içeren dosyaları `/opt/wallarm/etc/wallarm` konteyner dizininde oluşturur:
    * Filtreleme düğümü UUID’si ve gizli anahtarıyla `node.yaml`
    * Wallarm özel anahtarını içeren `private.key`
* `http://example.com` kaynağını korur.

## Günlükleme yapılandırması

Günlükleme varsayılan olarak etkindir. Günlük dizinleri şunlardır:

* `/var/log/nginx` — NGINX günlükleri
* `/opt/wallarm/var/log/wallarm` — [Wallarm düğüm günlükleri][logging-instr]

## Wallarm düğümünün çalışmasını test etme

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Kullanım senaryolarını yapılandırma

Docker konteynerine bağlanan yapılandırma dosyası, filtreleme düğümü yapılandırmasını [mevcut yönergelerde][nginx-directives-docs] tanımlamalıdır. Aşağıda yaygın olarak kullanılan bazı filtreleme düğümü yapılandırma seçenekleri verilmiştir:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"