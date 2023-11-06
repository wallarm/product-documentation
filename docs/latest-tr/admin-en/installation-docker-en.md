# Docker Üzerinde NGINX Temelli Image Çalıştırma

Wallarm NGINX tabanlı filtreleme düğümü bir Docker konteyneri olarak dağıtılabilir. Docker konteyneri şişman bir yapıdadır ve filtreleme düğümünün tüm alt sistemlerini içerir.

Docker konteyneri içinde kurulu filtreleme düğümünün işlevselliği, diğer dağıtım seçeneklerinin işlevselliğiyle tamamen aynıdır.

--8<-- "../include-tr/waf/installation/info-about-nginx-version-in-docker-container.md"

## Kullanım Senaryoları

--8<-- "../include-tr/waf/installation/docker-images/nginx-based-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/requirements-docker-nginx-4.0.md"

## Konteyneri çalıştırma seçenekleri

--8<-- "../include-tr/waf/installation/docker-running-options.md"

## Konteyneri, ortam değişkenlerini geçirerek çalıştırın 

Konteyneryi çalıştırmak için:

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. Node ile konteyneri çalıştırın:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.8.1-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.8.1-1
        ```

Aşağıdaki temel filtreleme düğüm ayarlarını `-e` seçeneği ile konteynere iletebilirsiniz:

--8<-- "../include-tr/waf/installation/nginx-docker-all-env-vars-latest.md"

Komut, aşağıdakileri yapar:

* `default` adında minimum NGINX yapılandırması olan bir dosya oluşturur ve filtreleme düğümü yapılandırmasını `/etc/nginx/sites-enabled` konteyner dizinine iletir.
* Wallarm Bulutuna erişim için filtreleme düğümü kimlik bilgilerini içeren dosyaları `/etc/wallarm` konteyner dizininde oluşturur:
    * Filtreleme düğümü UUID'si ve gizli anahtarı olan `node.yaml`
    * Wallarm özel anahtarı ile `private.key`
* Kaynağı `http://NGINX_BACKEND:80` korur.

## Konteyneri, yapılandırma dosyasını monte ederek çalıştırın

Hazırlanmış yapılandırma dosyayısını Docker konteynere `-v` seçeneği aracılığıyla monte edebilirsiniz. Dosyanın aşağıdaki ayarları içermesi gerekmektedir:

* [Filtering node directives][nginx-directives-docs]
* [NGINX settings](https://nginx.org/en/docs/beginners_guide.html)

Konteyneryi çalıştırmak için:

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. Node ile konteyneri çalıştırın:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.8.1-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.8.1-1
        ```

    * `-e` seçeneği, gerekli ortam değişkenlerini konteynere geçirir:

        --8<-- "../include-tr/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * `-v` seçeneği, `default` yapılandırma dosyası olan dizini `/etc/nginx/sites-enabled` konteyner dizinine monte eder.

        ??? info "Minimum ayarları olan monte edilmiş dosyanın bir örneğini görün"
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
                # wallarm_application 1;

                location / {
                        proxy_pass http://example.com;
                        include proxy_params;
                }
            }
            ```

        !!! info "Diğer yapılandırma dosyalarının montajı"
            NGINX tarafından kullanılan konteyner dizinleri:

            * `/etc/nginx/conf.d` — ortak ayarlar
            * `/etc/nginx/sites-enabled` — sanal ev sahibi ayarları
            * `/var/www/html` — statik dosyalar

            Gerekirse, listedeki konteyner dizinlerine herhangi bir dosyayı monte edebilirsiniz. Filtreleme düğümü yönergeleri, `/etc/nginx/sites-enabled/default` dosyasında açıklanmış olmalıdır.

Komut, aşağıdakileri yapar:

* `default` dosyasını `/etc/nginx/sites-enabled` konteyneri dizinine monte eder.
* Wallarm Bulutuna erişim için filtreleme düğümü kimlik bilgilerini içeren dosyaları `/etc/wallarm` konteyner dizininde oluşturur:
    * Filtreleme düğümü UUID'si ve gizli anahtarı olan `node.yaml`
    * Wallarm özel anahtarı ile `private.key`
* `http://example.com` kaynağını korur.

## Loglama Yapılandırması

Loglama varsayılan olarak etkindir. Log dizinleri:

* `/var/log/nginx` — NGINX logları
* `/var/log/wallarm` — Wallarm düğüm logları

Filtreleme düğümü değişkenlerinin genişletilmiş loglama ayarını yapmak için lütfen bu [instructions][logging-instr] önerilerini kullanın.

Varsayılan olarak, loglar her 24 saatte bir döner. Log dönüşümünü ayarlamak için, `/etc/logrotate.d/` içindeki yapılandırma dosyalarını değiştirin. Dönüşüm parametrelerini ortam değişkenleri aracılığıyla değiştirmek mümkün değildir.

## İzleme Yapılandırması

Filtreleme düğümünü izlemek için konteyner içinde Nagios ile uyumlu scriptler bulunmaktadır. Detaylar için [Monitoring the filtering node][doc-monitoring] bölümüne bakın.

Script'leri çalıştırma örneği:

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>` çalışan Wallarm Docker konteynerinin ID'sidir. ID'yi almak için `docker ps` komutunu çalıştırın ve uygun ID'yi kopyalayın.

## Wallarm düğüm işlemlerini test etme

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## Kullanım senaryolarının yapılandırılması

Docker konteynerine monte edilmiş yapılandırma dosyası, filtreleme düğümü yapılandırmasını [available directive][nginx-directives-docs] bölümünde tanımlamalıdır. İşte bazı yaygın kullanılan filtreleme düğümü yapılandırma seçenekleri:

--8<-- "../include-tr/waf/installation/common-customization-options-docker-4.4.md"