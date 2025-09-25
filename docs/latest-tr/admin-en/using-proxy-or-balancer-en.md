# HTTP proxy veya bir yük dengeleyici (NGINX) kullanıyorsanız orijinal istemci IP adresini belirleme

Bu talimatlar, HTTP proxy veya yük dengeleyici üzerinden sunucularınıza bağlanan bir istemcinin orijinal IP adresini belirlemek için gerekli NGINX yapılandırmasını açıklar. Bu, self-hosted NGINX tabanlı düğümler için geçerlidir.

* Self-hosted Wallarm node all-in-one installer, AWS / GCP imajları veya NGINX tabanlı Docker imajından kurulduysa, lütfen mevcut talimatları kullanın.
* Self-hosted Wallarm node K8s Ingress controller olarak dağıtıldıysa, lütfen [bu talimatları](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md) kullanın.

## Wallarm node, bir isteğin IP adresini nasıl belirler

Wallarm node, isteğin kaynak IP adresini NGINX değişkeni `$remote_addr` üzerinden okur. İstek, node’a gönderilmeden önce bir proxy sunucusu veya yük dengeleyiciden geçerse, `$remote_addr` değişkeni proxy sunucusu veya yük dengeleyicinin IP adresini korur.

![Yük dengeleyici kullanımı](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

Wallarm node tarafından belirlenen istek kaynak IP adresi, Wallarm Console içindeki [saldırı ayrıntılarında](../user-guides/events/check-attack.md#attack-analysis) görüntülenir.

## İstek kaynak adresi olarak bir proxy sunucusu veya yük dengeleyici IP adresinin kullanılmasının olası sorunları

Wallarm node, proxy sunucusu veya yük dengeleyicinin IP adresini isteğin kaynak IP adresi olarak kabul ederse, aşağıdaki Wallarm özellikleri hatalı çalışabilir:

* [Uygulamalara IP adresleriyle erişimi kontrol etme](../user-guides/ip-lists/overview.md), örneğin:

	Eğer orijinal istemci IP adresleri reddedilen listeye eklendiyse, Wallarm node yine de bu adreslerden gelen istekleri engellemeyecektir; çünkü yük dengeleyicinin IP adresini isteğin kaynak IP adresi olarak kabul eder.
* [Brute force koruması](configuration-guides/protecting-against-bruteforce.md), örneğin:

	Yük dengeleyiciden geçen isteklerde brute force saldırı işaretleri varsa, Wallarm bu yük dengeleyicinin IP adresini reddedilen listeye ekleyecek ve sonuç olarak bu yük dengeleyiciden geçen tüm sonraki istekleri engelleyecektir.
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülü, örneğin:

    Wallarm, Threat Replay Testing modülü tarafından oluşturulan [test saldırılarını başlatan IP adresi](../admin-en/scanner-addresses.md) olarak yük dengeleyicinin IP adresini kabul edecektir. Böylece, test saldırıları Wallarm Console’da yük dengeleyicinin IP adresinden kaynaklanmış gibi görüntülenecek ve Wallarm tarafından ayrıca kontrol edilerek uygulama üzerinde ek yük oluşturacaktır.

Wallarm node bir [IPC soketi](https://en.wikipedia.org/wiki/Unix_domain_socket) üzerinden bağlıysa, istek kaynağı olarak `0.0.0.0` kabul edilecektir.

## Orijinal istemci IP adresinin belirlenmesi için yapılandırma

Orijinal istemci IP adresini belirlemek için, [NGINX modülü **ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html) kullanılabilir. Bu modül, Wallarm node’un istemci IP adresini almak için [kullandığı](#how-wallarm-node-identifies-an-ip-address-of-a-request) `$remote_addr` değişkeninin değerini yeniden tanımlamaya olanak tanır.

NGINX modülü **ngx_http_realip_module** aşağıdaki şekillerde kullanılabilir:

* Orijinal istemci IP adresini, yük dengeleyici veya proxy sunucusu tarafından isteğe eklenen belirli bir başlıktan (genellikle, [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)) okumak için.
* Yük dengeleyici veya proxy sunucusu [PROXY protokolünü](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) destekliyorsa, orijinal istemci IP adresini `PROXY` başlığından okumak için.

### NGINX’in `X-Forwarded-For` (`X-Real-IP` veya benzeri) başlığını okumasını yapılandırma

Yük dengeleyici veya proxy sunucusu, orijinal istemci IP adresini içeren `X-Forwarded-For` (`X-Real-IP` veya benzeri) başlığını ekliyorsa, NGINX modülü **ngx_http_realip_module**’ü bu başlığı okuması için aşağıdaki gibi yapılandırın:

1. Wallarm node ile kurulu NGINX’in aşağıdaki yapılandırma dosyasını açın:

    * Wallarm node all-in-one installer veya AWS / GCP imajından kurulduysa `/etc/nginx/sites-enabled/default`.
    * Wallarm node NGINX tabanlı Docker imajından dağıtıldıysa, NGINX yapılandırma dosyasını yerel olarak oluşturup düzenlemeli ve Docker konteynerine `/etc/nginx/http.d/default.conf` yoluna mount etmelisiniz. İlk NGINX yapılandırma dosyasını kopyalayabilir ve dosyayı konteynere mount etme talimatlarını [Wallarm NGINX tabanlı Docker talimatlarından](installation-docker-en.md#run-the-container-mounting-the-configuration-file) alabilirsiniz.
2. NGINX’in `location` bağlamında veya daha üstünde, `set_real_ip_from` direktifini proxy sunucusu veya yük dengeleyicinin IP adresiyle ekleyin. Proxy sunucusu veya yük dengeleyicinin birden fazla IP adresi varsa, uygun sayıda ayrı direktif ekleyin. Örneğin:

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```
2. Kullanılan yük dengeleyicinin belgelerinde, bu yük dengeleyici tarafından orijinal istemci IP adresini iletmek için eklenen başlığın adını bulun. Çoğunlukla başlığın adı `X-Forwarded-For`’dur.
3. NGINX’in `location` bağlamında veya daha üstünde, önceki adımda bulunan başlık adını içeren `real_ip_header` direktifini ekleyin. Örneğin:

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
4. NGINX’i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

    NGINX, `real_ip_header` direktifinde belirtilen başlığın değerini `$remote_addr` değişkenine atayacaktır; böylece Wallarm node orijinal istemci IP adreslerini bu değişkenden okuyacaktır.
5. [Yapılandırmayı test edin](#testing-the-configuration).

### NGINX’in `PROXY` başlığını okumasını yapılandırma

Yük dengeleyici veya proxy sunucusu [PROXY protokolünü](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) destekliyorsa, NGINX modülü **ngx_http_realip_module**’ü `PROXY` başlığını okuması için aşağıdaki gibi yapılandırabilirsiniz:

1. Wallarm node ile kurulu NGINX’in aşağıdaki yapılandırma dosyasını açın:

    * Wallarm node all-in-one installer veya AWS / GCP imajından kurulduysa `/etc/nginx/sites-enabled/default`.
    * Wallarm node NGINX tabanlı Docker imajından dağıtıldıysa, NGINX yapılandırma dosyasını yerel olarak oluşturup düzenlemeli ve Docker konteynerine `/etc/nginx/http.d/default.conf` yoluna mount etmelisiniz. İlk NGINX yapılandırma dosyasını kopyalayabilir ve dosyayı konteynere mount etme talimatlarını [Wallarm NGINX tabanlı Docker talimatlarından](installation-docker-en.md#run-the-container-mounting-the-configuration-file) alabilirsiniz.
2. NGINX’in `server` bağlamında, `listen` direktifine `proxy_protocol` parametresini ekleyin.
3. NGINX’in `location` bağlamında veya daha üstünde, `set_real_ip_from` direktifini proxy sunucusu veya yük dengeleyicinin IP adresiyle ekleyin. Proxy sunucusu veya yük dengeleyicinin birden fazla IP adresi varsa, uygun sayıda ayrı direktif ekleyin. Örneğin:
4. NGINX’in `location` bağlamında veya daha üstünde, `real_ip_header` direktifini `proxy_protocol` değeriyle ekleyin.

    Tüm direktiflerin eklendiği örnek NGINX yapılandırma dosyası:

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * NGINX, 80 numaralı portta gelen bağlantıları dinler.
    * Gelen istekte `PROXY` başlığı iletilmezse, NGINX bu isteği geçerli olmadığı için kabul etmez.
    * `<IP_ADDRESS_OF_YOUR_PROXY>` adresinden gelen istekler için, NGINX `PROXY` başlığında iletilen kaynak adresi `$remote_addr` değişkenine atar; böylece Wallarm node orijinal istemci IP adreslerini bu değişkenden okuyacaktır.
5. NGINX’i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
6. [Yapılandırmayı test edin](#testing-the-configuration).

Orijinal istemci IP adresini log’lara dahil etmek için, NGINX yapılandırmasında `proxy_set_header` direktifini eklemeli ve `log_format` direktifindeki değişkenler listesini [NGINX loglama talimatlarında](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address) açıklandığı gibi düzenlemelisiniz.

`PROXY` başlığına dayanarak orijinal istemci IP adresini belirleme hakkında daha fazla ayrıntı [NGINX belgelerinde](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address) mevcuttur.

### Yapılandırmayı test etme

1. Test saldırısını korunan uygulamanın adresine gönderin:

    === "cURL kullanarak"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "printf ve Netcat kullanarak (`PROXY` başlığı için)"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. Wallarm Console’u açın ve orijinal istemci IP adresinin saldırı ayrıntılarında görüntülendiğinden emin olun:

    ![İsteği başlatan IP adresi](../images/request-ip-address.png)

    NGINX orijinal adresi `X-Forwarded-For` (`X-Real-IP` veya benzeri) başlığından okuduysa, başlık değeri ham saldırıda da görüntülenecektir.

    ![X-Forwarded-For başlığı](../images/x-forwarded-for-header.png)

## Yapılandırma örnekleri

Aşağıda, popüler yük dengeleyiciler üzerinden sunucularınıza bağlanan bir istemcinin orijinal IP adresini belirlemek için gereken NGINX yapılandırması örnekleri yer almaktadır.

### Cloudflare CDN

Cloudflare CDN kullanıyorsanız, orijinal istemci IP adreslerini belirlemek için [NGINX modülü **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) yapılandırılabilir.

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

* Yapılandırmayı kaydetmeden önce, yukarıdaki yapılandırmada belirtilen Cloudflare IP adreslerinin [Cloudflare belgelerindeki](https://www.cloudflare.com/ips/) adreslerle eşleştiğinden emin olun. 
* `real_ip_header` direktifi değerinde `CF-Connecting-IP` veya `X-Forwarded-For` belirtilebilir. Cloudflare CDN her iki başlığı da ekler ve NGINX’i bunlardan herhangi birini okuyacak şekilde yapılandırabilirsiniz. [Cloudflare CDN’de daha fazla ayrıntı](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs)

### Fastly CDN

Fastly CDN kullanıyorsanız, orijinal istemci IP adreslerini belirlemek için [NGINX modülü **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) yapılandırılabilir.

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

Yapılandırmayı kaydetmeden önce, yukarıdaki yapılandırmada belirtilen Fastly IP adreslerinin [Fastly belgelerindeki](https://api.fastly.com/public-ip-list) adreslerle eşleştiğinden emin olun. 

### HAProxy

HAProxy kullanıyorsanız, orijinal istemci IP adreslerini belirlemek için hem HAProxy hem de Wallarm node taraflarının doğru şekilde yapılandırılması gerekir:

* `/etc/haproxy/haproxy.cfg` yapılandırma dosyasında, HAProxy’nin Wallarm node’a bağlanmasından sorumlu `backend` direktifi bloğuna `option forwardfor header X-Client-IP` satırını ekleyin.

	`option forwardfor` direktifi, HAProxy yük dengeleyicisine istemcinin IP adresini içeren bir başlığın isteğe eklenmesi gerektiğini bildirir. [HAProxy belgelerinde daha fazla ayrıntı](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

	Yapılandırma örneği:

    ```
    ...
    # İstekleri almak için genel IP adresi
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # Wallarm node içeren backend
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

    *   `<HAPROXY_IP>`, istemci isteklerini almak için HAProxy sunucusunun IP adresidir.
    *   `<WALLARM_NODE_IP>`, HAProxy sunucusundan gelen istekleri almak için Wallarm node’un IP adresidir.

* Wallarm node ile kurulu NGINX’in yapılandırma dosyasında, [**ngx_http_realip_module** modülünü](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) aşağıdaki gibi yapılandırın:
    
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

    *   `<APPLICATION_IP>`, Wallarm node’dan gelen istekler için korunan uygulamanın IP adresidir.
    *   `<HAPROXY_IP1>` ve `<HAPROXY_IP2>`, istekleri Wallarm node’a ileten HAProxy yük dengeleyicilerinin IP adresleridir.