# HTTP proxy veya load balancer (NGINX) kullanıyorsanız orijinal istemci IP adresinin belirlenmesi

Bu talimatlar, sunucularınıza bir HTTP proxy veya load balancer aracılığıyla bağlanan bir istemcinin, orijinal IP adresini belirlemek için gerekli olan NGINX yapılandırmasını açıklamaktadır. Bu, self-hosted NGINX tabanlı düğümler için geçerlidir.

* Eğer self-hosted Wallarm node, all-in-one installer, AWS / GCP images veya NGINX-based Docker image'den kurulmuşsa, lütfen **mevcut talimatları** kullanın.
* Eğer self-hosted Wallarm node, K8s Ingress Controller olarak dağıtıldıysa, lütfen [bu talimatları](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md) kullanın.

## Wallarm node, bir isteğin IP adresini nasıl belirler?

Wallarm node, isteğin kaynak IP adresini NGINX değişkeni `$remote_addr`'den okur. Eğer istek, node'a gönderilmeden önce bir proxy sunucu veya load balancer üzerinden geçtiyse, `$remote_addr` değişkeni proxy sunucu veya load balancer'ın IP adresini içermeye devam eder.

![Using balancer](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

Wallarm node tarafından belirlenen istek kaynağı IP adresi, Wallarm Console'daki [attack details](../user-guides/events/check-attack.md#attack-analysis) bölümünde görüntülenir.

## Proxy sunucusu veya load balancer IP adresinin, istek kaynağı adresi olarak kullanılmasının olası problemleri

Eğer Wallarm node, proxy sunucu veya load balancer IP adresini istek kaynağı IP adresi olarak kabul ederse, aşağıdaki Wallarm özellikleri doğru çalışmayabilir:

* [IP adreslerine göre uygulamalara erişimin kontrolü](../user-guides/ip-lists/overview.md), örneğin:

	Orijinal istemci IP adresleri denylisted ise, Wallarm node load balancer IP adresini istek kaynağı olarak kabul ettiğinden, bu adreslerden gelen istekleri engellemez.
* [Brute force koruması](configuration-guides/protecting-against-bruteforce.md), örneğin:

	Load balancer üzerinden gelen isteklerde brute force saldırısı belirtileri varsa, Wallarm bu load balancer IP adresini denylist'e ekler ve dolayısıyla bu load balancer üzerinden gelen tüm istekleri engeller.
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülü ve [Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner), örneğin:

	Wallarm, load balancer IP adresini, Threat Replay Testing modülü ve Vulnerability Scanner tarafından üretilen [test saldırılarını başlatan IP adresi](../admin-en/scanner-addresses.md) olarak kabul eder. Böylece test saldırıları Wallarm Console'da load balancer IP adresinden gelmiş olarak görüntülenir ve Wallarm tarafından ek yük oluşturacak şekilde ilave kontrol edilir.

Eğer Wallarm node, [IPC socket](https://en.wikipedia.org/wiki/Unix_domain_socket) üzerinden bağlıysa, `0.0.0.0` istek kaynağı olarak kabul edilir.

## Orijinal istemci IP adresi belirleme yapılandırması

Orijinal istemci IP adresi belirlemesini yapılandırmak için, [NGINX module **ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html)'ü kullanabilirsiniz. Bu modül, Wallarm node tarafından kullanılan `$remote_addr` değerinin, istemci IP adresini almak üzere yeniden tanımlanmasına olanak tanır.

NGINX module **ngx_http_realip_module** aşağıdaki yollardan biriyle kullanılabilir:

* Belirli bir başlıktan (genellikle, [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)) orijinal istemci IP adresini okuma; bu başlık load balancer veya proxy sunucu tarafından isteğe eklenir.
* Eğer load balancer veya proxy sunucu [PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)'ü destekliyorsa, `PROXY` başlığından orijinal istemci IP adresini okuma.

### `X-Forwarded-For` (`X-Real-IP` veya benzeri) başlığını okumak için NGINX yapılandırması

Load balancer veya proxy sunucu, orijinal istemci IP adresini içeren `X-Forwarded-For` (`X-Real-IP` veya benzeri) başlığını ekliyorsa, lütfen NGINX module **ngx_http_realip_module**’ü bu başlığı okuyacak şekilde yapılandırın:

1. Wallarm node ile kurulmuş NGINX'in aşağıdaki yapılandırma dosyasını açın:

    * Wallarm node, all-in-one installer veya AWS / GCP image'den kurulmuşsa, `/etc/nginx/sites-enabled/default`.
    * Eğer Wallarm node, NGINX-based Docker image'den dağıtıldıysa, NGINX yapılandırma dosyasını yerel olarak oluşturup, Docker konteynerine `/etc/nginx/sites-enabled/default` yolunda monte etmelisiniz. İlk NGINX yapılandırma dosyasını kopyalayabilir ve dosyanın konteynere monte edilmesine ilişkin talimatları [Wallarm NGINX-based Docker instructions](installation-docker-en.md#run-the-container-mounting-the-configuration-file) belgesinden edinebilirsiniz.
2. NGINX'in `location` veya daha üst bir kontekstinde, proxy sunucu veya load balancer IP adresini belirten `set_real_ip_from` direktifini ekleyin. Eğer proxy sunucu veya load balancer'ın birden fazla IP adresi varsa, lütfen her biri için ayrı direktif ekleyin. Örneğin:

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```
2. Kullanılan load balancer'a ait belgelerde, orijinal istemci IP adresini iletmek için eklenen başlık adını tespit edin. Çoğu durumda, başlık adı `X-Forwarded-For`'dur.
3. NGINX'in `location` veya daha üst bir kontekstinde, daha önce tespit edilen başlık adını kullanarak `real_ip_header` direktifini ekleyin. Örneğin:

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

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

    NGINX, `real_ip_header` direktifinde belirtilen başlık değerini `$remote_addr` değişkenine atacaktır; böylece Wallarm node, orijinal istemci IP adreslerini bu değişkenden okuyacaktır.
5. [Yapılandırmayı test edin](#testing-the-configuration).

### `PROXY` başlığını okumak için NGINX yapılandırması

Load balancer veya proxy sunucu, [PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)'ü destekliyorsa, NGINX module **ngx_http_realip_module**’ü `PROXY` başlığını okuyacak şekilde yapılandırabilirsiniz:

1. Wallarm node ile kurulmuş NGINX'in aşağıdaki yapılandırma dosyasını açın:

    * Wallarm node, all-in-one installer veya AWS / GCP image'den kurulmuşsa, `/etc/nginx/sites-enabled/default`.
    * Eğer Wallarm node, NGINX-based Docker image'den dağıtıldıysa, yapılandırma dosyasını yerel olarak oluşturup, Docker konteynerine `/etc/nginx/sites-enabled/default` yolunda monte etmelisiniz. İlk NGINX yapılandırma dosyasını kopyalayabilir ve dosyanın konteynere monte edilmesine ilişkin talimatları [Wallarm NGINX-based Docker instructions](installation-docker-en.md#run-the-container-mounting-the-configuration-file) belgesinden edinebilirsiniz.
2. NGINX'in `server` kontekstinde, `listen` direktifine `proxy_protocol` parametresini ekleyin.
3. NGINX'in `location` veya daha üst bir kontekstinde, proxy sunucu veya load balancer IP adresini belirten `set_real_ip_from` direktifini ekleyin. Eğer proxy sunucu veya load balancer'ın birden çok IP adresi varsa, lütfen her biri için ayrı direktif ekleyin.
4. NGINX'in `location` veya daha üst bir kontekstinde, `real_ip_header` direktifine `proxy_protocol` değerini ekleyin.

    Aşağıda, tüm direktiflerin eklenmiş örnek bir NGINX yapılandırma dosyası bulunmaktadır:

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * NGINX, port 80'de gelen bağlantıları dinler.
    * Gelen istekte `PROXY` başlığı yoksa, NGINX isteği geçerli kabul etmez.
    * `<IP_ADDRESS_OF_YOUR_PROXY>` adresinden gelen istekler için, NGINX `PROXY` başlığında gönderilen kaynak adresini `$remote_addr` değişkenine atar; böylece Wallarm node, orijinal istemci IP adreslerini bu değişkenden okur.
5. NGINX'i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
6. [Yapılandırmayı test edin](#testing-the-configuration).

Orijinal istemci IP adresini loglara dahil etmek için, lütfen `proxy_set_header` direktifini ekleyin ve NGINX yapılandırmasındaki `log_format` direktifinde yer alan değişken listesini [NGINX loglama talimatlarındaki](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address) yönergeler doğrultusunda düzenleyin.

`PROXY` başlığına dayalı orijinal istemci IP adresinin belirlenmesi hakkında daha fazla bilgi, [NGINX belgesinde](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address) mevcuttur.

### Yapılandırmayı Test Etme

1. Korunan uygulama adresine test saldırısı gönderin:

    === "Using cURL"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "Using printf and Netcat (for the header `PROXY`)"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. Wallarm Console'u açın ve saldırı ayrıntılarında orijinal istemci IP adresinin görüntülendiğinden emin olun:

    ![IP address originated the request](../images/request-ip-address.png)

    Eğer NGINX, `X-Forwarded-For` (`X-Real-IP` veya benzeri) başlığından orijinal adresi okuduysa, başlık değeri ham saldırıda da görüntülenecektir.

    ![Header X-Forwarded-For](../images/x-forwarded-for-header.png)

## Yapılandırma Örnekleri

Aşağıda, popüler load balancer'lar aracılığıyla sunucularınıza bağlanan bir istemcinin orijinal kaynak IP adresini belirlemek için gerekli olan NGINX yapılandırma örneklerini bulacaksınız.

### Cloudflare CDN

Cloudflare CDN kullanıyorsanız, orijinal istemci IP adreslerini belirlemek için [NGINX module **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)’ü yapılandırabilirsiniz.

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

* Yapılandırmayı kaydetmeden önce, yukarıda belirtilen Cloudflare IP adreslerinin [Cloudflare belgelerinde](https://www.cloudflare.com/ips/) yer alanlarla eşleştiğinden emin olun.
* `real_ip_header` direktifinde, `CF-Connecting-IP` veya `X-Forwarded-For` değeri kullanılabilir. Cloudflare CDN her iki başlığı da ekler ve NGINX, herhangi birini okuyacak şekilde yapılandırılabilir. [Cloudflare CDN hakkında daha fazla detay](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs)

### Fastly CDN

Fastly CDN kullanıyorsanız, orijinal istemci IP adreslerini belirlemek için [NGINX module **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)’ü yapılandırabilirsiniz.

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

Yapılandırmayı kaydetmeden önce, yukarıda belirtilen Fastly IP adreslerinin [Fastly belgeleri](https://api.fastly.com/public-ip-list) ile eşleştiğinden emin olun.

### HAProxy

HAProxy kullanıyorsanız, hem HAProxy hem de Wallarm node tarafında orijinal istemci IP adreslerini belirlemek için uygun yapılandırma yapılmalıdır:

* `/etc/haproxy/haproxy.cfg` yapılandırma dosyasında, HAProxy'nin Wallarm node ile bağlantı kurduğu `backend` bloğuna `option forwardfor header X-Client-IP` satırını ekleyin.

	The `option forwardfor` direktifi, HAProxy load balancer'ın, isteğe istemci IP adresini içeren bir başlık eklemesi gerektiğini belirtir. [Daha fazla bilgi için HAProxy belgelerine bakınız](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

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

    *   `<HAPROXY_IP>`, HAProxy sunucusunun istemci isteklerini almak için kullandığı IP adresidir.
    *   `<WALLARM_NODE_IP>`, HAProxy sunucusundan gelen isteklerin Wallarm node'a iletileceği IP adresidir.

* Wallarm node ile kurulmuş NGINX yapılandırma dosyasında, [NGINX module **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) aşağıdaki şekilde yapılandırılmalıdır:
    
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

    *   `<APPLICATION_IP>`, Wallarm node üzerinden gelen isteklerin hedefi olan korunan uygulamanın IP adresidir.
    *   `<HAPROXY_IP1>` ve `<HAPROXY_IP2>`, Wallarm node'a istekleri ileten HAProxy load balancer'larının IP adresleridir.
