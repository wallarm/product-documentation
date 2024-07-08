# HTTP proxy veya yük dengeleyici (NGINX) kullanılıyorsa orijinal istemci IP adresini belirleme

Bu talimatlar, HTTP proxy veya yük dengeleyici üzerinden sunucularınıza bağlanan bir istemcinin köken IP adresinin tanımlanması için gerekli NGINX yapılandırmasını açıklar.

* Eğer Wallarm düğümü DEB / RPM paketlerinden kurulmuşsa, AWS / GCP imajlarından veya NGINX tabanlı Docker imajından, lütfen **şimdiki talimatları** kullanın.
* Eğer Wallarm düğümü K8s Ingress denetleyicisi olarak dağıtılmışsa, lütfen [bu talimatları](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md) kullanınız.

## Wallarm düğümü bir isteğin IP adresini nasıl belirler

Wallarm düğümü, bir isteğin kaynak IP adresini NGINX değişkeni `$remote_addr`dan okur. Eğer istek bir proxy sunucusundan veya yük dengeleyiciden geçtiyse ve düğüme gönderilmeden önce, `$remote_addr` değişkeni proxy sunucusu veya yük dengeleyici IP adresini korur.

![Using balancer](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

Wallarm düğümünün belirlediği istek kaynak IP adresi, Wallarm Konsolu'nda [saldırı detaylarında](../user-guides/events/check-attack.md#attacks) görüntülenir.

## Bir proxy sunucusu veya yük dengeleyici IP adresini bir istek kaynak adresi olarak kullanmanın olası sorunları

Eğer Wallarm düğümü proxy sunucusu veya yük dengeleyici IP adresini isteğin kaynak IP adresi olarak kabul ederse, aşağıdaki Wallarm özellikleri yanlış çalışabilir:

* [IP adreslerine göre uygulamalara erişimi kontrol etme](../user-guides/ip-lists/overview.md), örneğin:

	Eğer orijinal istemci IP adresleri engellenmişse, Wallarm düğümü hâlâ yük dengeleyici IP adresini isteğin kaynak IP adresi olarak kabul ettiği için onlardan kaynaklanan istekleri engellemez.
* [Kaba kuvvet saldırısına karşı koruma](configuration-guides/protecting-against-bruteforce.md), örneğin:

	Eğer istekler yük dengeleyiciden geçtiyse ve kaba kuvvet saldırı belirtileri varsa, Wallarm bu yük dengeleyici IP adresini engeller ve bu düğün üzerinden geçen tüm diğer istekleri engeller.
* [Aktif tehdit doğrulama](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) modülü ve [Güvenlik Açığı Tarayıcı](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner), örneğin:

	Wallarm, Aktif tehdit doğrulama modülü ve Güvenlik Açığı Tarayıcı tarafından oluşturulan [test saldırılarının köken olan IP adresini](scanner-addresses.md) yük dengeleyici IP adresi olarak kabul eder. Böylece, test saldırıları, Wallarm Konsolu'nda yük dengeleyici IP adresinden kaynaklanan saldırılar olarak görüntülenir ve Wallarm tarafından ekstra bir yük oluşturacak şekilde ek olarak kontrol edilir.

Eğer Wallarm düğümü [IPC soketi](https://en.wikipedia.org/wiki/Unix_domain_socket) üzerinden bağlanıyorsa, `0.0.0.0` bir istek kaynağı olarak kabul edilir.

## Orijinal istemci IP adresi tanımlama için yapılandırma

Orijinal istemci IP adresini yapılandırmak için, [**ngx_http_realip_module** NGINX modülünü](https://nginx.org/en/docs/http/ngx_http_realip_module.html) kullanabilirsiniz. Bu modül, Wallarm düğümü tarafından bir istemci IP adresini almak için [kullanılan](#how-wallarm-node-identifies-an-ip-address-of-a-request) `$remote_addr` değerinin yeniden tanımlanmasına izin verir.

**ngx_http_realip_module** NGINX modülünü aşağıdaki yollardan birini seçerek kullanabilirsiniz:

* Bir yük dengeleyici veya proxy sunucusu tarafından isteğe eklenen belirli bir başlıktan (`genellikle, [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)) orijinal istemci IP adresini okumak için.
* Eğer bir yük dengeleyici veya proxy sunucusu [PROXY protokolünü](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) destekliyorsa, `PROXY` başlığından orijinal istemci IP adresini okumak için.

### Başlık `X-Forwarded-For` (`X-Real-IP` veya benzeri) okuyacak şekilde NGINX'i yapılandırma

Eğer bir yük dengeleyici veya proxy sunucusu, orijinal istemci IP adresini içeren `X-Forwarded-For` (`X-Real-IP` veya benzeri) başlığını eklerse, NGINX modülünün **ngx_http_realip_module** bu başlığı aşağıdaki gibi okuması için yapılandırın:

1. Wallarm düğümüyle kurulan NGINX'in aşağıdaki yapılandırma dosyasını açın:

    * Wallarm düğümü DEB / RPM paketlerinden kurulmuşsa `/etc/nginx/conf.d/default.conf`.
    * Wallarm düğümü AWS / GCP imajından dağıtılmışsa `/etc/nginx/nginx.conf`.
    * Eğer Wallarm düğümü NGINX tabanlı Docker imajından dağıtılmışsa, NGINX yapılandırma dosyasını yerel olarak oluşturmalı ve düzenlemeli ve ardından Docker konteynırına `/etc/nginx/sites-enabled/default` yolunda bağlamalısınız. Başlangıç NGINX yapılandırma dosyasını kopyalayabilir ve dosyanın konteynıra nasıl bağlanacağını [Wallarm'ın NGINX tabanlı Docker talimatlarından](installation-docker-en.md#run-the-container-mounting-the-configuration-file) alabilirsiniz.
2. NGINX context `location` veya daha yüksek birinde, bir proxy sunucusu veya yük dengeleyici IP adresiyle `set_real_ip_from` yönergesini ekleyin. Eğer bir proxy sunucusu veya yük dengeleyici birden fazla IP adresine sahipse, lütfen uygun sayıda ayrı yönerge ekleyin. Örneğin:

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```

2. Kullandığınız yük dengeleyicinin belgelerinde, bu yük dengeleyicinin orijinal istemci IP adresini geçirmek için eklediği başlığın adını bulun. En sık, başlık `X-Forwarded-For` olarak adlandırılır.
3. NGINX context `location` veya daha yüksek birinde, önceki adımda bulunan başlık adıyla `real_ip_header` yönergesini ekleyin. Örneğin:

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
        real_ip_header X-Forwarded-For;
    }
    ...
    ```
4. NGINX'i yeniden başlatın:

    --8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

    NGINX, `real_ip_header` yönergesinde belirtilen başlığın değerini `$remote_addr` değişkenine atar, böylece Wallarm düğümü bu değişkenden orijinal istemci IP adreslerini okur.
5. [Yapılandırmayı test edin](#testing-the-configuration).

### Başlık `PROXY` okuyacak şekilde NGINX'i yapılandırma

Eğer bir yük dengeleyici veya proxy sunucusu [PROXY protokolünü](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) destekliyorsa, NGINX modülünün *ngx_http_realip_module* `PROXY` başlığını aşağıdaki şekilde okuması için yapılandırabilirsiniz:

1. Wallarm düğümüyle kurulan NGINX'in aşağıdaki yapılandırma dosyasını açın:

    * Wallarm düğümü DEB / RPM paketlerinden kurulmuşsa `/etc/nginx/conf.d/default.conf`.
    * Wallarm düğümü AWS / GCP imajından dağıtılmışsa `/etc/nginx/nginx.conf`.
    * Eğer Wallarm düğümü NGINX tabanlı Docker imajından dağıtılmışsa, NGINX yapılandırma dosyasını yerel olarak oluşturmalı ve düzenlemeli ve ardından Docker konteynırına `/etc/nginx/sites-enabled/default` yolunda bağlamalısınız. Başlangıç NGINX yapılandırma dosyasını kopyalayabilir ve dosyanın konteynıra nasıl bağlanacağını [Wallarm'ın NGINX tabanlı Docker talimatlarından](installation-docker-en.md#run-the-container-mounting-the-configuration-file) alabilirsiniz.
2. NGINX context `server`da, `listen` yönergesine `proxy_protocol` parametresini ekleyin.
3. NGINX context `location` veya daha yüksek birinde, bir proxy sunucusu veya yük dengeleyici IP adresiyle `set_real_ip_from` yönergesini ekleyin. Eğer bir proxy sunucusu veya yük dengeleyici birden fazla IP adresine sahipse, lütfen uygun sayıda ayrı yönerge ekleyin. Örneğin:
4. NGINX context `location` veya daha yüksek birinde, `proxy_protocol` değeriyle `real_ip_header` yönergesini ekleyin.

    Tüm yönergelerin eklenmiş olduğu bir NGINX yapılandırma dosyası örneği:

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * NGINX, gelen bağlantıları 80 portunda dinler.
    * Eğer `PROXY` başlığı gelen istekte geçmiyorsa, NGINX bu talebi kabul etmez çünkü geçerli olarak kabul edilmez.
    * `<IP_ADDRESS_OF_YOUR_PROXY>` adresindeki istekler için, NGINX `PROXY` başlığına geçirilen kaynak adresini `$remote_addr` adlı değişkene atar, böylece Wallarm düğümü bu değişkenden orijinal istemci IP adreslerini okur.
5. NGINX'i yeniden başlatın:

    --8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"
6. [Yapılandırmayı test edin](#testing-the-configuration).

Orijinal istemci IP adresini günlüklere eklemek için, NGINX yapılandırmasında `proxy_set_header` yönergesini eklemeli ve `log_format` yönergesindeki değişken listesini [NGINX günlük talimatlarında](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address) olduğu gibi düzenlemelisiniz.

`PROXY` başlığına dayalı olarak orijinal istemci IP adresini belirleme hakkında daha fazla ayrıntıya [NGINX belgelerinde](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address) ulaşabilirsiniz.

### Yapılandırmanın test edilmesi

1. Korunan uygulama adresine bir test saldırısı gönderin:

    === "cURL Kullanarak"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "printf ve Netcat Kullanarak (Başlık `PROXY` için)"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. Wallarm Konsolunu açın ve orijinal istemci IP adresinin saldırı detaylarında görüntülendiğinden emin olun:

    ![Istegin kökenli IP adresi](../images/request-ip-address.png)

    Eğer NGINX orijinal adresi başlık `X-Forwarded-For` (`X-Real-IP` veya benzeri) başlığından okuduysa, ham saldırıda da başlık değeri gösterilir.

    ![Header X-Forwarded-For](../images/x-forwarded-for-header.png)


## Yapılandırma örnekleri

Aşağıda, popüler yük dengeleyiciler üzerinden sunucularınıza bağlanan bir istemcinin köken IP adresini belirlemek için gerekli NGINX yapılandırmanın örneklerini bulacaksınız.

### Cloudflare CDN

Cloudflare CDN kullanılıyorsa, orijinal istemci IP adreslerini belirlemek için [NGINX modülü **ngx_http_realip_module**'u yapılandırabilirsiniz](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar).

```bash
...
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 104.16.0.0/12;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2c0f:f248::/32;
set_real_ip_from 2a06:98c0::/29;

real_ip_header CF-Connecting-IP;
#real_ip_header X-Forwarded-For;
real_ip_recursive on;
...
```

* Yapılandırmayı kaydetmeden önce, lütfen yukarıdaki yapılandırmada belirtilen Cloudflare IP adreslerinin [Cloudflare belgelerindekilerle](https://www.cloudflare.com/ips/) eşleştiğinden emin olun.
* `real_ip_header` yönergesinin değerinde `CF-Connecting-IP` veya `X-Forwarded-For` belirtilebilir. Cloudflare CDN her iki başlığını ekler ve NGINX hangisini okuyacağını yapılandırabilir. [Cloudflare CDN'de daha fazla ayrıntı](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs)

### Fastly CDN

Fastly CDN kullanılıyorsa, orijinal istemci IP adreslerini belirlemek için [NGINX modülü **ngx_http_realip_module**'u yapılandırabilirsiniz](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar).

```bash
...
set_real_ip_from 23.235.32.0/20;
set_real_ip_from 43.249.72.0/22;
set_real_ip_from 103.244.50.0/24;
set_real_ip_from 103.245.222.0/23;
set_real_ip_from 103.245.224.0/24;
set_real_ip_from 104.156.80.0/20;
set_real_ip_from 146.75.0.0/16;
set_real_ip_from 151.101.0.0/16;
set_real_ip_from 157.52.64.0/18;
set_real_ip_from 167.82.0.0/17;
set_real_ip_from 167.82.128.0/20;
set_real_ip_from 167.82.160.0/20;
set_real_ip_from 167.82.224.0/20;
set_real_ip_from 172.111.64.0/18;
set_real_ip_from 185.31.16.0/22;
set_real_ip_from 199.27.72.0/21;
set_real_ip_from 199.232.0.0/16;
set_real_ip_from 2a04:4e40::/32;
set_real_ip_from 2a04:4e42::/32;

real_ip_header X-Forwarded-For;
real_ip_recursive on;
...
```

Yapılandırmayı kaydetmeden önce, lütfen yapılandırmada belirtilen Fastly IP adreslerinin [Fastly belgelerindekilerle](https://api.fastly.com/public-ip-list) eşleştiğinden emin olunız.

### HAProxy

HAProxy kullanılıyorsa, hem HAProxy hem de Wallarm düğümü tarafı orijinal istemci IP adreslerini belirlemek için uygun şekilde yapılandırılmalıdır:

* `/etc/haproxy/haproxy.cfg` yapılandırma dosyasına, HAProxy'yi Wallarm düğümüne bağlamak için sorumlu olan `backend` yönerge bloğuna `option forwardfor header X-Client-IP` satırını ekleyin.

	`option forwardfor` yönergesi, istemcinin IP adresiyle birlikte bir başlığın isteğe eklenmesi gerektiğini, HAProxy dengeleyicisine söyler. [HAProxy belgelerinde daha fazla bilgi](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

	Yapılandırma örneği:

    ```
    ...
    # Herkese açık IP adresi, istekleri almak için
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # Wallarm düğümü ile birlikte 'backend'
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

    *   `<HAPROXY_IP>` müşteri isteklerini almak için HAProxy sunucusunun IP adresidir.
    *   `<WALLARM_NODE_IP>` HAProxy sunucusundan gelen istekleri almak için Wallarm düğümünün IP adresidir.

* Wallarm düğümüyle kurulan NGINX’in yapılandırma dosyasında, aşağıdaki şekilde [**ngx_http_realip_module** modülünü yapılandırın](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) :

```bash
    ...
    location / {
        wallarm_mode block;

        proxy_pass http://<APPLICATION_IP>; 
        set_real_ip_from <HAPROXY_IP1>;
        set_real_ip_from <HAPROXY_IP2>;
        real_ip_header X-Client-IP;
    }
    ...
    ```

    *   `<APPLICATION_IP>` Wallarm düğümünden istekler için korunan uygulamanın IP adresidir.
    *   `<HAPROXY_IP1>` ve `<HAPROXY_IP2>` Wallarm düğümüne istekler geçiren HAProxy dengeleyicilerin IP adresleridir.
