# NGINX Tarafından Geçersiz Kabul Edilen Başlıkların (Header) İşlenmesi

Varsayılan olarak, NGINX adında `.` veya `_` bulunanlar gibi geçersiz saydığı başlıkları düşürür. Bu durum Wallarm'ın bu başlıkları görmesini ve analiz etmesini engeller, güvenlik kapsamını azaltır. Bu tür başlıklar ortamınızda geçerli kabul ediliyorsa, onları kabul etmek için bu makaleyi izleyin.

## Soruna genel bakış

[RFC 7230](https://www.rfc-editor.org/rfc/rfc7230?utm_source=chatgpt.com#section-3.2.6) uyarınca, `.` ve `_` gibi karakterler HTTP başlık alanı adlarında geçerlidir. Ancak, varsayılan olarak NGINX bu tür başlıkları düşürür.

API'niz bu başlıkları meşru olarak kullanıyorsa, bunların kaldırılması Wallarm'da aşağıdaki kısıtlamalara neden olur:

* [API Discovery](../../api-discovery/overview.md) düşürülen başlıkları göremez ve envantere dahil etmez
* [Saldırı tespiti](../../user-guides/events/check-attack.md) bu başlıklara uygulanmaz

Bu sorunlardan kaçınmak için NGINX'i bunları kabul edip iletecek şekilde yapılandırın.

## Çözüm

NGINX'te aşağıdaki direktifleri etkinleştirin:

* [`underscores_in_headers on;`](https://nginx.org/en/docs/http/ngx_http_core_module.html#underscores_in_headers)
* [`ignore_invalid_headers off;`](https://nginx.org/en/docs/http/ngx_http_core_module.html#ignore_invalid_headers)

Bu ayarlar, NGINX'in `.` ve `_` içerenler dahil tüm başlıkları korumasını sağlar; böylece Wallarm bunları inceleyebilir.

## Farklı dağıtım biçimlerinde nasıl uygulanır

### Tümleşik yükleyici, AWS AMI ve GCP makine imajı

[all-in-one installer](../../installation/nginx/all-in-one.md), [AWS AMI](../../installation/packages/aws-ami.md) veya [GCP machine image](../../installation/packages/gcp-machine-image.md) ile Wallarm Node'u kurduğunuzda:

1. `/etc/nginx/nginx.conf` dosyasını düzenleyin.
1. `http {}` bloğunun içine şunları ekleyin:

    ```
    underscores_in_headers on;
    ignore_invalid_headers off;
    ```
1. NGINX'i yeniden yükleyin:

    ```
    sudo nginx -s reload
    ```

### Docker imajı

[Wallarm Node'u Docker'da](../installation-docker-en.md) çalıştırırken, bu direktifleri içeren bir yapılandırma dosyasını bağlayın:

1. Node yapılandırmanızla `/etc/nginx/nginx.conf` dosyasını oluşturun.

    Aşağıda, Node'un çalışması için gereken asgari dosya içeriği verilmiştir:

    ```hl_lines="15-16"
    #user  wallarm;
    worker_processes  auto;
    pid        /run/nginx.pid;
    include /etc/nginx/modules/*.conf;

    events {
        worker_connections  768;
        # multi_accept on;
    }

    http {
        # apifw'nin sunucu bloklarına otomatik dahil edilmesi
        wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;

        underscores_in_headers on;
        ignore_invalid_headers off;

        upstream wallarm_wstore {
            server localhost:3313 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
        wallarm_wstore_upstream wallarm_wstore;
        ##
        # Temel Ayarlar
        ##

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Ayarları
        ##

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # SSLv3 kaldırılıyor, bkz: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Günlükleme Ayarları
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Ayarları
        ##

        gzip on;

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;


        ##
        # Sanal Ana Makine Yapılandırmaları - Wallarm
        ##

        include /etc/nginx/conf.d/*.conf;

        ##
        # Sanal Ana Makine Yapılandırmaları - Kullanıcı
        ##

        include /etc/nginx/http.d/*;
    }
    ```
1. `wallarm-apifw-loc.conf` dosyasını `/etc/nginx/wallarm-apifw-loc.conf` yoluna bağlayın. İçeriği şu şekilde olmalıdır:

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
1. Aşağıdaki içerikle `/etc/nginx/conf.d/wallarm-status.conf` dosyasını bağlayın. Sağlanan yapılandırmadaki herhangi bir satırı değiştirmemek kritik önemdedir; aksi takdirde düğüm metriklerinin Wallarm cloud üzerine başarılı yüklenmesini engelleyebilir.

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
1. NGINX yapılandırma dosyanızda, `/wallarm-status` uç noktası için aşağıdaki yapılandırmayı ayarlayın:

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
1. [Bu dosyaları beklenen yollarına bağlayarak konteyneri çalıştırın](../installation-docker-en.md#run-the-container-mounting-the-configuration-file).

### NGINX Ingress Controller

[Wallarm NGINX-based Ingress controller](../installation-kubernetes-en.md) için, desteklenen ConfigMap anahtarlarını kullanın:

1. Aşağıdaki içerikle [ConfigMap oluşturun](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files):

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: nginx-configuration
      namespace: ingress-nginx
    data:
      enable-underscores-in-headers: "true"
      ignore-invalid-headers: "false"
    ```
1. `values.yaml` dosyanızda ConfigMap yolunu belirtin.

### Sidecar Proxy

[Wallarm Sidecar Proxy](../../installation/kubernetes/sidecar-proxy/deployment.md) kullanıyorsanız, gerekli uygulama pod seviyesinde bir açıklama (annotation) aracılığıyla direktifleri ekleyin:

```yaml hl_lines="8-10"
apiVersion: apps/v1
kind: Deployment
...
spec:
  template:
    metadata:
      annotations:
        sidecar.wallarm.io/nginx-http-snippet: |
          underscores_in_headers on;
          ignore_invalid_headers off;
```

### Security Edge

[Wallarm Security Edge](../../installation/security-edge/overview.md) içinde `.` ve `_` içeren başlıklara destek vermeyi etkinleştirmek için lütfen [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.