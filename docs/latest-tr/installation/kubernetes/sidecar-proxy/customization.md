# Wallarm Sidecar'ı Özelleştirme

Bu makale, bazı yaygın özelleştirme kullanım durumları için örnekler sağlayarak [Wallarm Kubernetes Sidecar çözümünün](deployment.md) güvenli ve etkili şekilde özelleştirilmesi konusunda rehberlik eder.

## Yapılandırma alanı

Wallarm Sidecar çözümü standart Kubernetes bileşenlerine dayanır, dolayısıyla çözümün yapılandırması büyük ölçüde Kubernetes yığını yapılandırmasına benzer. Wallarm Sidecar çözümünü küresel ölçekte `values.yaml` ile ve uygulama podu bazında annotation'lar ile yapılandırabilirsiniz.

### Genel ayarlar

Genel yapılandırma seçenekleri Wallarm denetleyicisi tarafından oluşturulan tüm sidecar kaynaklarına uygulanır ve [varsayılan Helm chart değerlerinde](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) ayarlanır. `helm install` veya `helm upgrade` sırasında özel `values.yaml` sağlayarak bunları geçersiz kılabilirsiniz.

Mevcut genel yapılandırma seçeneklerinin sayısı sınırsızdır. Çözüm, ortaya çıkan Pod'u tamamen değiştirmeye ve bunun sonucunda çözümün yanlış çalışmasına izin verdiğinden, özelleştirme yapılırken dikkatli olunmalıdır. Genel ayarları değiştirirken lütfen Helm ve Kubernetes dokümantasyonuna güvenin.

[Wallarm'a özgü chart değerlerinin listesi burada](helm-chart-for-wallarm.md)

### Pod bazlı ayarlar

Pod bazlı ayarlar, belirli uygulamalar için çözüm davranışının özelleştirilmesine olanak tanır.

Uygulama podu ayarları, uygulama Pod'unun annotation'ları aracılığıyla ayarlanır. Annotation'lar, genel ayarlara göre önceliklidir. Aynı seçenek hem genel hem de annotation ile belirtilirse, annotation'daki değer uygulanır.

Desteklenen annotation seti sınırlıdır ancak `nginx-*-include` ve `nginx-*-snippet` annotation'ları, çözüm tarafından herhangi bir [özel NGINX yapılandırmasının kullanılmasına](#using-custom-nginx-configuration) izin verir.

[Desteklenen pod bazlı annotation'ların listesi burada](pod-annotations.md)

## Yapılandırma kullanım senaryoları

Yukarıda belirtildiği gibi, çözümü altyapınıza ve güvenlik çözümüne yönelik gereksinimlerinize uyacak şekilde birçok yolla özelleştirebilirsiniz. En yaygın özelleştirme seçeneklerinin uygulanmasını kolaylaştırmak için bunları ilgili en iyi uygulamaları göz önünde bulundurarak açıkladık.

### Kapsayıcıların tekli ve bölünmüş dağıtımı

Wallarm, Wallarm kapsayıcılarının bir Pod'a dağıtımı için iki seçenek sunar:

* Tekli dağıtım (varsayılan)
* Bölünmüş dağıtım

![Tekli ve bölünmüş kapsayıcılar][single-split-containers-img]

Kapsayıcı dağıtım seçeneklerini hem genel hem de pod bazında ayarlayabilirsiniz:

* Genel olarak Helm chart değeri `config.injectionStrategy.schema`yı `single` (varsayılan) veya `split` olarak ayarlayarak.
* Pod bazında uygun uygulama Pod annotation'ı `sidecar.wallarm.io/sidecar-injection-schema`yı `"single"` veya `"split"` olarak ayarlayarak.

!!! info "Postanalytics modülü"
    Lütfen postanalytics modülü kapsayıcısının [ayrı](deployment.md#solution-architecture) çalıştığını, açıklanan dağıtım seçeneklerinin yalnızca diğer kapsayıcılarla ilgili olduğunu unutmayın.

#### Tekli dağıtım (varsayılan)

Wallarm kapsayıcılarının tekli dağıtımıyla, isteğe bağlı **iptables** init kapsayıcısı dışında bir Pod'da yalnızca bir kapsayıcı çalışır.

Sonuç olarak iki kapsayıcı çalışır:

* `sidecar-init-iptables`, iptables çalıştıran init kapsayıcıdır. Varsayılan olarak bu kapsayıcı başlatılır ancak [devre dışı bırakabilirsiniz](#capturing-incoming-traffic-port-forwarding).
* `sidecar-proxy`, Wallarm modülleri ve bazı yardımcı servislerle NGINX proxy'yi çalıştırır. Bu süreçlerin tümü [supervisord](http://supervisord.org/) tarafından çalıştırılır ve yönetilir.

#### Bölünmüş dağıtım

Wallarm kapsayıcılarının bölünmüş dağıtımıyla, iki init kapsayıcıya ek olarak bir Pod'da iki ek kapsayıcı çalışır.

Bu seçenek, tüm yardımcı servisleri `sidecar-proxy` kapsayıcısından çıkarır ve kapsayıcı tarafından yalnızca NGINX servislerinin başlatılmasını sağlar.

Bölünmüş kapsayıcı dağıtımı, NGINX ve yardımcı servislerin tükettiği kaynaklar üzerinde daha ayrıntılı kontrol sağlar. CPU/Memory/Storage ad alanlarının Wallarm ve yardımcı kapsayıcılar arasında bölünmesinin gerekli olduğu yüksek yüklü uygulamalar için önerilen seçenektir.

Sonuç olarak dört kapsayıcı çalışır:

* `sidecar-init-iptables`, iptables çalıştıran init kapsayıcıdır. Varsayılan olarak bu kapsayıcı başlatılır ancak [devre dışı bırakabilirsiniz](#capturing-incoming-traffic-port-forwarding).
* `sidecar-init-helper`, Wallarm düğümünü Wallarm Cloud'a bağlamakla görevli yardımcı servisleri içeren init kapsayıcıdır.
* `sidecar-proxy`, NGINX servislerini içeren kapsayıcıdır.
* `sidecar-helper`, diğer bazı yardımcı servisleri içeren kapsayıcıdır.

### Uygulama kapsayıcısı portunun otomatik keşfi

Korumalı uygulama portu birçok şekilde yapılandırılabilir. Gelen trafiği doğru şekilde işlemek ve yönlendirmek için Wallarm sidecar'ın uygulama kapsayıcısının gelen istekleri kabul ettiği TCP portunu bilmesi gerekir.

Varsayılan olarak, sidecar denetleyicisi portu aşağıdaki öncelik sırasına göre otomatik olarak keşfeder:

1. Port `sidecar.wallarm.io/application-port` pod annotation'ı ile tanımlanmışsa, Wallarm denetleyicisi bu değeri kullanır.
1. `name: http` uygulama kapsayıcısı ayarında port tanımlıysa, Wallarm denetleyicisi bu değeri kullanır.
1. `name: http` ayarı altında port tanımlı değilse, Wallarm denetleyicisi uygulama kapsayıcısı ayarlarında ilk bulunan port değerini kullanır.
1. Uygulama kapsayıcısı ayarlarında hiç port tanımlı değilse, Wallarm denetleyicisi Wallarm Helm chart'ındaki `config.nginx.applicationPort` değerini kullanır.

Uygulama kapsayıcısı portu otomatik keşfi beklendiği gibi çalışmıyorsa, portu 1. veya 4. seçeneği kullanarak açıkça belirtin.

### Gelen trafiğin yakalanması (port yönlendirme) {#capturing-incoming-traffic-port-forwarding}

Varsayılan olarak, Wallarm sidecar denetleyicisi trafiği aşağıdaki gibi yönlendirir:

1. Bağlı Pod'un IP'sine ve uygulama kapsayıcısı portuna gelen trafiği yakalar.
1. Bu trafiği yerleşik iptables özelliklerini kullanarak sidecar kapsayıcısına yönlendirir.
1. Sidecar, kötü amaçlı istekleri engeller ve meşru trafiği uygulama kapsayıcısına iletir.

Gelen trafik yakalama, otomatik port yönlendirme için en iyi uygulama olan iptables çalıştıran init kapsayıcı kullanılarak uygulanmıştır. Bu kapsayıcı ayrıcalıklı olarak, `NET_ADMIN` yeteneğiyle çalıştırılır.

![iptables ile varsayılan port yönlendirme][port-forwarding-with-iptables-img]

Ancak bu yaklaşım, Istio gibi servis mesh'leriyle uyumlu değildir çünkü Istio zaten iptables tabanlı trafik yakalama uygular. Bu durumda iptables'ı devre dışı bırakabilirsiniz ve port yönlendirme aşağıdaki gibi çalışacaktır:

![iptables olmadan port yönlendirme][port-forwarding-without-iptables-img]

!!! info "Korunmayan uygulama kapsayıcısı"
    iptables devre dışı bırakılırsa, dışa açık bir uygulama kapsayıcısı Wallarm tarafından korunmayacaktır. Sonuç olarak, IP adresi ve portu bir saldırgan tarafından biliniyorsa, kötü amaçlı "doğu-batı" trafiği uygulama kapsayıcısına ulaşabilir.

    Doğu/batı trafiği, Kubernetes kümesi etrafında akan trafiktir (örn. servisler arası).

Varsayılan davranışı şu şekilde değiştirebilirsiniz:

1. iptables'ı şu yollarla devre dışı bırakın:

    * Genel olarak Helm chart değeri `config.injectionStrategy.iptablesEnable`ı `"false"` olarak ayarlayarak
    * Pod bazında Pod annotation'ı `sidecar.wallarm.io/sidecar-injection-iptables-enable`ı `"false"` olarak ayarlayarak
2. Service manifestinizde `spec.ports.targetPort` ayarını `proxy` portunu gösterecek şekilde güncelleyin.

    iptables tabanlı trafik yakalama devre dışıysa, Wallarm sidecar kapsayıcısı `proxy` adlı bir port yayımlayacaktır. Gelen trafiğin Kubernetes servisinden `proxy` portuna gelmesi için, Service manifestinizdeki `spec.ports.targetPort` ayarı bu portu göstermelidir:

```yaml hl_lines="16-17 34"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/sidecar-injection-iptables-enable: "false"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
  namespace: default
spec:
  ports:
    - port: 80
      targetPort: proxy
      protocol: TCP
      name: http
  selector:
    app: myapp
```

### SSL/TLS sonlandırma

Varsayılan olarak, Sidecar çözümü yalnızca HTTP trafiğini kabul eder ve düz HTTP trafiğini uygulama pod'larına iletir. SSL/TLS sonlandırmanın sidecar çözümünden önce konumlanan bir altyapı bileşeni (ör. Ingress/Application Gateway) tarafından gerçekleştirildiği varsayılır; bu, sidecar çözümünün düz HTTP'yi işlemesine olanak tanır.

Bununla birlikte, mevcut altyapının SSL/TLS sonlandırmayı desteklemediği durumlar olabilir. Bu gibi durumlarda, SSL/TLS sonlandırmayı Wallarm sidecar düzeyinde etkinleştirebilirsiniz. Bu özellik Helm chart 4.6.1 sürümünden itibaren desteklenir.

!!! warning "Sidecar çözümü ya SSL/TLS ya da düz HTTP trafiğini destekler"
    Wallarm Sidecar çözümü ya SSL/TLS ya da düz HTTP trafiğini işler. SSL/TLS sonlandırmayı etkinleştirmek, sidecar çözümünün düz HTTP trafiğini işlemeyeceği; SSL/TLS sonlandırmayı devre dışı bırakmak ise yalnızca HTTPS trafiğinin işleneceği anlamına gelir.

SSL/TLS sonlandırmayı etkinleştirmek için:

1. Sidecar'ın SSL/TLS'yi sonlandıracağı sunucuya ait sunucu sertifikasını (genel anahtar) ve özel anahtarı edinin.
1. Uygulama podunun namespace'inde, sunucu sertifikası ve özel anahtarını içeren bir [TLS secret](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) oluşturun.
1. Secret'ı mount etmek için `values.yaml` dosyasına `config.profiles` bölümünü ekleyin. Aşağıdaki örnek, birden çok sertifika mount etme yapılandırmasını gösterir.

    İhtiyaçlarınıza uyacak şekilde yorumlara göre kodu özelleştirin. Yalnızca bir sertifikaya ihtiyacınız varsa gereksiz sertifika mount etme yapılandırmalarını kaldırın.

    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com" # EU Cloud kullanıyorsanız boş string bırakın
        # Diğer Wallarm ayarları https://docs.wallarm.com/installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm/
      profiles:
        tls-profile: # Buraya istenen herhangi bir TLS profil adını girin
          sidecar:
            volumeMounts:
              - name: nginx-certs-example-com # example.com anahtarlarını içeren volume adı
                mountPath: /etc/nginx/certs/example.com # example.com anahtarlarının kapsayıcıya mount edileceği yol
                readOnly: true
              - name: nginx-certs-example-io # example.io anahtarlarını içeren volume adı
                mountPath: /etc/nginx/certs/example.io # example.io anahtarlarının kapsayıcıya mount edileceği yol
                readOnly: true
            volumes:
              - name: nginx-certs-example-com # example.com anahtarlarını içeren volume adı
                secret:
                  secretName: example-com-certs # example.com backend'i için oluşturulmuş, genel ve özel anahtarları içeren secret adı
              - name: nginx-certs-example-io # example.io anahtarlarını içeren volume adı
                secret:
                  secretName: example-io-certs # example.io backend'i için oluşturulmuş, genel ve özel anahtarları içeren secret adı
          nginx:
            # TLS/SSL sonlandırma prosedürünüze özgü NGINX SSL modülü yapılandırması.
            # Bkz. https://nginx.org/en/docs/http/ngx_http_ssl_module.html.
            # Sidecar'ın trafik sonlandırması yapabilmesi için bu yapılandırma gereklidir.
            servers:
              - listen: "ssl http2"
                include:
                  - "server_name example.com www.example.com"
                  - "ssl_protocols TLSv1.3"
                  - "ssl_certificate /etc/nginx/certs/example.com/tls.crt"
                  - "ssl_certificate_key /etc/nginx/certs/example.com/tls.key"
                  - "ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384"
                  - "ssl_conf_command Ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256"
              - listen: "ssl"
                include:
                  - "server_name example.io www.example.io"
                  - "ssl_protocols TLSv1.2 TLSv1.3"
                  - "ssl_certificate /etc/nginx/certs/example.io/tls.crt"
                  - "ssl_certificate_key /etc/nginx/certs/example.io/tls.key"
    ```
1. `values.yaml` içindeki değişiklikleri aşağıdaki komutla Sidecar çözümüne uygulayın:

    ```bash
    helm upgrade <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f values.yaml
    ```
1. Uygulama poduna `sidecar.wallarm.io/profile: tls-profile` annotation'ını [uygulayın](pod-annotations.md#how-to-use-annotations).
1. Yapılandırma uygulandıktan sonra, [buradaki](deployment.md#step-4-test-the-wallarm-sidecar-operation) adımları izleyerek, HTTP yerine HTTPS protokolünü kullanıp çözümü test edebilirsiniz.

Sidecar çözümü TLS/SSL trafiğini kabul edecek, sonlandıracak ve düz HTTP trafiğini uygulama poduna iletecektir.

### Admission webhook için sertifikalar

4.10.7 sürümünden başlayarak, admission webhook için kendi sertifikalarınızı çıkarma ve kullanma seçeneğiniz vardır.

Varsayılan olarak, çözüm admission webhook sertifikalarını [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) kullanarak otomatik olarak üretir.

Kendi sertifikalarınızı kullanmak için aşağıdaki seçenekler mevcuttur:

* cert-manager kullanma: Kümenizde [`cert-manager`](https://cert-manager.io/) kullanıyorsanız ve admission webhook sertifikasını üretmek için onu tercih ediyorsanız, `values.yaml` dosyanızı aşağıdaki gibi güncelleyin.

    Bu, `certgen`i otomatik olarak devre dışı bırakacaktır.

    ```yaml
    controller:
      admissionWebhook:
        certManager:
          enabled: true
    ```
* Manuel sertifika yükleme: Aşağıdaki yapılandırmayı `values.yaml` dosyasına ekleyerek sertifikaları manuel olarak yükleyebilirsiniz. Bu, `certgen`i otomatik olarak devre dışı bırakacaktır.

    ```yaml
    controller:
      admissionWebhook:
        secret:
          enabled: true
          ca: <base64-encoded-CA-certificate>
          crt: <base64-encoded-certificate>
          key: <base64-encoded-private-key>
    ```

4.10.6 veya öncesi sürümden yükseltiyorsanız lütfen [özel yükseltme talimatlarını][sidecar-upgrade-docs] izleyin. Bu güncelleme, çözümün yeniden kurulmasını gerektiren kırıcı bir değişiklik içerir.

### Ek NGINX modüllerini etkinleştirme

Wallarm sidecar'ın Docker imajı, varsayılan olarak devre dışı bırakılmış aşağıdaki ek NGINX modülleri ile dağıtılır:

* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)

Ek modülleri yalnızca pod bazında Pod annotation'ı `sidecar.wallarm.io/nginx-extra-modules` ayarlanarak etkinleştirebilirsiniz.

Annotation değerinin formatı bir dizidir. Ek modüllerin etkin olduğu örnek:

```yaml hl_lines="16-17"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/nginx-extra-modules: "['ngx_http_brotli_filter_module.so','ngx_http_brotli_static_module.so', 'ngx_http_opentracing_module.so']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Özel NGINX yapılandırmasının kullanılması {#using-custom-nginx-configuration}

Bazı NGINX ayarları için özel [pod annotation'ları](pod-annotations.md) yoksa, bunları pod bazında **snippet** ve **include** aracılığıyla belirtebilirsiniz.

#### Snippet

Snippet'ler, NGINX yapılandırmasına tek satırlık değişiklikler eklemenin uygun bir yoludur. Daha karmaşık değişiklikler için [include](#include) önerilen seçenektir.

Özel ayarları snippet'lerle belirtmek için aşağıdaki pod bazlı annotation'ları kullanın:

| NGINX config bölümü | Annotation                                  | 
|----------------------|---------------------------------------------|
| http                 | `sidecar.wallarm.io/nginx-http-snippet`     |
| server               | `sidecar.wallarm.io/nginx-server-snippet`   |
| location             | `sidecar.wallarm.io/nginx-location-snippet` |

[`disable_acl`][disable-acl-directive-docs] NGINX yönergesi değerini değiştiren annotation örneği:

```yaml hl_lines="18"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/wallarm-mode: block
        sidecar.wallarm.io/nginx-location-snippet: "disable_acl on"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

Birden fazla yönerge belirtmek için `;` sembolünü kullanın, örn.:

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### İçerme (Include) {#include}

Ek bir NGINX yapılandırma dosyasını Wallarm sidecar kapsayıcısına mount etmek için bu dosyadan [ConfigMap oluşturabilir](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) veya [Secret kaynağı](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret) oluşturabilir ve kapsayıcıda oluşturulan kaynağı kullanabilirsiniz.

ConfigMap veya Secret kaynağı oluşturulduktan sonra, aşağıdaki pod bazlı annotation'ları kullanarak [Volume ve VolumeMounts bileşenleri](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) üzerinden kapsayıcıya mount edebilirsiniz:

| Öğe           |  Annotation                                    | Değer tipi  |
|---------------|------------------------------------------------|-------------|
| Volumes       | `sidecar.wallarm.io/proxy-extra-volumes`       | JSON |
| Volume mounts | `sidecar.wallarm.io/proxy-extra-volume-mounts` | JSON |

Kaynak kapsayıcıya mount edildikten sonra, ilgili annotation'da mount edilen dosyanın yolunu geçerek NGINX bağlamını belirtin:

| NGINX config bölümü | Annotation                                  | Değer tipi |
|----------------------|---------------------------------------------|------------|
| http                 | `sidecar.wallarm.io/nginx-http-include`     | Dizi  |
| server               | `sidecar.wallarm.io/nginx-server-include`   | Dizi  |
| location             | `sidecar.wallarm.io/nginx-location-include` | Dizi  |

Aşağıda, NGINX yapılandırmasının `http` seviyesine include edilen, mount edilmiş yapılandırma dosyasının bulunduğu bir örnek verilmiştir. Bu örnek, `nginx-http-include-cm` ConfigMap'inin önceden oluşturulduğunu ve geçerli NGINX yapılandırma yönergeleri içerdiğini varsayar.

```yaml hl_lines="16-19"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/proxy-extra-volumes: '[{"name": "nginx-http-extra-config", "configMap": {"name": "nginx-http-include-cm"}}]'
        sidecar.wallarm.io/proxy-extra-volume-mounts: '[{"name": "nginx-http-extra-config", "mountPath": "/nginx_include/http.conf", "subPath": "http.conf"}]'
        sidecar.wallarm.io/nginx-http-include: "['/nginx_include/http.conf']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Wallarm özelliklerini yapılandırma

Listelenen genel çözüm ayarlarına ek olarak, [Wallarm ile saldırı önleme için en iyi uygulamaları][wallarm-attack-prevention-best-practices-docs] da öğrenmenizi öneririz.

Bu yapılandırma [annotation'lar](pod-annotations.md) ve Wallarm Console UI aracılığıyla gerçekleştirilir.

## Annotation'lar ile diğer yapılandırmalar

Listelenen yapılandırma kullanım senaryolarına ek olarak, birçok başka annotation kullanarak Wallarm sidecar çözümünü uygulama pod'ları için ince ayar yapabilirsiniz.

[Desteklenen pod bazlı annotation'ların listesi burada](pod-annotations.md)