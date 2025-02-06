# Wallarm Sidecar Özelleştirme

Bu makale, bazı yaygın özelleştirme kullanım durumları için örnekler sunarak [Wallarm Kubernetes Sidecar solution](deployment.md) güvenli ve etkili bir şekilde nasıl özelleştirileceğini anlatmaktadır.

## Yapılandırma Alanı

Wallarm Sidecar çözümü, standart Kubernetes bileşenlerine dayandığından, çözüm yapılandırması büyük ölçüde Kubernetes yığını yapılandırmasına benzer. Wallarm Sidecar çözümünü, `values.yaml` dosyası üzerinden küresel olarak ve her uygulama pod'una özgü anotasyonlar aracılığıyla yapılandırabilirsiniz.

### Küresel Ayarlar

Küresel yapılandırma seçenekleri, Wallarm kontrolörü tarafından oluşturulan tüm sidecar kaynakları için geçerlidir ve [default Helm chart values](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) dosyasında ayarlanır. Özel `values.yaml` sağlayarak `helm install` veya `helm upgrade` sırasında bu ayarların üzerine yazabilirsiniz.

Küresel yapılandırma seçeneklerinin sayısı sınırsızdır. Çözüm tamamen değiştirilmiş bir Pod yapısına ve dolayısıyla hatalı çalışmaya yol açabileceğinden, çözümün özelleştirilmesinde dikkatli olunmalıdır. Küresel ayarları değiştirirken Helm ve Kubernetes dokümantasyonuna başvurun.

[Wallarm'a özgü chart değerlerinin listesine buradan ulaşabilirsiniz](helm-chart-for-wallarm.md)

### Pod Bazında Ayarlar

Pod bazında ayarlar, belirli uygulamalar için çözüm davranışını özelleştirmenize olanak tanır.

Uygulamaya özgü pod ayarları, uygulama Pod'unun anotasyonları aracılığıyla yapılır. Anotasyonlar, küresel ayarların önceliğini alır. Aynı seçenek hem küresel hem de anotasyon yoluyla belirtilmişse, anotasyondaki değer uygulanır.

Desteklenen anotasyon seti sınırlıdır ancak `nginx-*-include` ve `nginx-*-snippet` anotasyonları, çözüm tarafından kullanılacak herhangi bir [özel NGINX yapılandırmasını](#using-custom-nginx-configuration) eklemenize olanak tanır.

[Desteklenen pod anotasyonlarının listesine buradan ulaşabilirsiniz](pod-annotations.md)

## Yapılandırma Kullanım Durumları

Yukarıda da belirtildiği gibi, altyapınıza ve güvenlik çözümü gereksinimlerinize uyacak şekilde çözümü birçok farklı şekilde özelleştirebilirsiniz. En yaygın özelleştirme seçeneklerini uygulamayı kolaylaştırmak için, ilgili en iyi uygulamalar dikkate alınarak açıklamalar yapılmıştır.

### Konteynerlerin Tek ve Ayrılmış Dağıtımı

Wallarm, bir Pod'a Wallarm konteynerlerinin dağıtımı için iki seçenek sunmaktadır:

* Tek dağıtım (varsayılan)
* Ayrılmış dağıtım

![Single and split containers][single-split-containers-img]

Konteyner dağıtım seçeneklerini küresel ve pod bazında ayarlayabilirsiniz:

* Helm chart değeri `config.injectionStrategy.schema`'yı `single` (varsayılan) veya `split` olarak ayarlayarak küresel olarak.
* Uygulama Pod'unun anotasyonu `sidecar.wallarm.io/sidecar-injection-schema`'yı `"single"` veya `"split"` olarak ayarlayarak pod bazında.

!!! info "Postanalytics modülü"
    Lütfen postanalytics modülü konteynerinin [ayrı olarak çalıştığını](deployment.md#solution-architecture) unutmayın; bahsedilen dağıtım seçenekleri yalnızca diğer konteynerlerle ilgilidir.

#### Tek Dağıtım (Varsayılan)

Wallarm konteynerlerinin tek dağıtımıyla, isteğe bağlı iptables içeren init konteyneri dışında yalnızca bir konteyner Pod'da çalışır.

Sonuç olarak, iki çalışma konteyneri bulunmaktadır:

* `sidecar-init-iptables`: Varsayılan olarak başlayan, iptables çalıştıran init konteyneri. Bu konteyneri [devre dışı bırakabilirsiniz](#capturing-incoming-traffic-port-forwarding).
* `sidecar-proxy`: Wallarm modülleri ve bazı yardımcı servislerle NGINX proxy çalıştırır. Bu süreçlerin tamamı [supervisord](http://supervisord.org/) tarafından çalıştırılır ve yönetilir.

#### Ayrılmış Dağıtım

Wallarm konteynerlerinin ayrılmış dağıtımıyla, iki init konteyneri dışında Pod'da iki ek konteyner daha çalışır.

Bu seçenek, tüm yardımcı servisleri `sidecar-proxy` konteynerinden ayırır ve konteyner tarafından yalnızca NGINX servislerinin başlatılmasını sağlar.

Ayrılmış konteyner dağıtımı, NGINX ve yardımcı servisler tarafından tüketilen kaynaklar üzerinde daha ayrıntılı kontrol sağlar. CPU/Bellek/Depolama alanlarının Wallarm ve yardımcı konteynerler arasında bölünmesinin gerekli olduğu yüksek yükteki uygulamalar için önerilen seçenektir.

Sonuç olarak, dört çalışma konteyneri bulunmaktadır:

* `sidecar-init-iptables`: Varsayılan olarak başlayan, iptables çalıştıran init konteyneri. Bu konteyneri [devre dışı bırakabilirsiniz](#capturing-incoming-traffic-port-forwarding).
* `sidecar-init-helper`: Wallarm düğümünü Wallarm Cloud'a bağlamaktan sorumlu, yardımcı servislerin bulunduğu init konteyneri.
* `sidecar-proxy`: NGINX servislerini içeren konteyner.
* `sidecar-helper`: Diğer bazı yardımcı servisleri içeren konteyner.

### Uygulama Konteyneri Portunu Otomatik Algılama

Korunan uygulama portu birçok şekilde yapılandırılabilir. Gelen trafiği doğru şekilde işleyip yönlendirmek için, Wallarm sidecar, uygulama konteynerinin gelen istekleri kabul ettiği TCP portunun farkında olmalıdır.

Varsayılan olarak, sidecar kontrolörü portu aşağıdaki öncelik sırasına göre otomatik olarak algılar:

1. Port, pod anotasyonu `sidecar.wallarm.io/application-port` aracılığıyla tanımlandıysa, Wallarm kontrolörü bu değeri kullanır.
2. Uygulama konteyner ayarları altında `name: http` ile tanımlı bir port varsa, Wallarm kontrolörü bu değeri kullanır.
3. `name: http` ayarında port tanımlı değilse, Wallarm kontrolörü uygulama konteyner ayarlarında ilk bulunan port değerini kullanır.
4. Uygulama konteyner ayarlarında hiç port tanımlı değilse, Wallarm kontrolörü Wallarm Helm chart'ından `config.nginx.applicationPort` değerini kullanır.

Uygulama konteyneri portunun otomatik algılanması beklenildiği gibi çalışmıyorsa, portu açıkça 1. veya 4. seçenek kullanılarak belirtin.

### Gelen Trafiğin Yakalanması (Port Yönlendirme)

Varsayılan olarak, Wallarm sidecar kontrolörü trafiği şu şekilde yönlendirir:

1. Bağlı Pod'un IP'sine ve uygulama konteyneri portuna gelen trafiği yakalar.
2. Bu trafiği, yerleşik iptables özelliklerini kullanarak sidecar konteynerine yönlendirir.
3. Sidecar, kötü niyetli istekleri engeller ve meşru trafiği uygulama konteynerine yönlendirir.

Gelen trafiğin yakalanması, otomatik port yönlendirme için en iyi uygulama olan iptables çalıştıran init konteyneri kullanılarak gerçekleştirilir. Bu konteyner, `NET_ADMIN` yeteneği ile ayrıcalıklı olarak çalıştırılır.

![Default port forwarding with iptables][port-forwarding-with-iptables-img]

Ancak, bu yaklaşım Istio gibi servis mesh ortamlarıyla uyumlu değildir çünkü Istio'nun zaten iptables tabanlı trafik yakalama mekanizması bulunmaktadır. Bu durumda, iptables devre dışı bırakılabilir ve port yönlendirme aşağıdaki şekilde çalışır:

![Port forwarding without iptables][port-forwarding-without-iptables-img]

!!! info "Korumasız Uygulama Konteyneri"
    Eğer iptables devre dışı bırakılırsa, dışa açık uygulama konteyneri Wallarm tarafından korunmayacaktır. Sonuç olarak, saldırganın uygulama konteynerinin IP adresi ve portu hakkında bilgisi varsa, kötü niyetli "east-west" trafiği uygulama konteynerine ulaşabilir.

    East/west trafiği, Kubernetes kümesi içinde (örneğin, servisler arası) akan trafiği ifade eder.

Varsayılan davranışı aşağıdaki şekilde değiştirebilirsiniz:

1. Aşağıdaki yöntemlerden biriyle iptables'ı devre dışı bırakın:

    * Helm chart değeri `config.injectionStrategy.iptablesEnable`'yi `"false"` olarak ayarlayarak küresel olarak.
    * Pod anotasyonu `sidecar.wallarm.io/sidecar-injection-iptables-enable`'yı `"false"` olarak ayarlayarak pod bazında.
2. Servis manifestinizdeki `spec.ports.targetPort` ayarını `proxy` portuna işaret edecek şekilde güncelleyin.

    Eğer iptables tabanlı trafik yakalama devre dışı bırakıldıysa, Wallarm sidecar konteyneri `proxy` isimli bir port yayımlayacaktır. Kubernetes servisi üzerinden `proxy` portuna gelen trafiğin yönlendirilebilmesi için, Servis manifestinizdeki `spec.ports.targetPort` ayarı bu porta işaret etmelidir:

```yaml
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

### SSL/TLS Sonlandırması

Varsayılan olarak, Sidecar çözümü yalnızca HTTP trafiğini kabul eder ve uygulama pod'larına sade HTTP trafiği iletir. SSL/TLS sonlandırmasının, Sidecar çözümünden önce bulunan bir altyapı bileşeni (örn. Ingress/Uygulama Ağ Geçidi) tarafından gerçekleştirildiği varsayılır; bu sayede sidecar çözü, sade HTTP trafiğini işleyebilir.

Ancak, mevcut altyapının SSL/TLS sonlandırmasını desteklemediği durumlar olabilir. Böyle durumlarda, Wallarm sidecar düzeyinde SSL/TLS sonlandırmasını etkinleştirebilirsiniz. Bu özellik Helm chart 4.6.1 sürümünden itibaren desteklenmektedir.

!!! warning "Sidecar çözümü ya SSL ya da sade HTTP trafiği işlemesini destekler"
    Wallarm Sidecar çözümü, ya SSL/TLS ya da sade HTTP trafiği işlemesini destekler. SSL/TLS sonlandırmasını etkinleştirmek, sidecar çözümünün sade HTTP trafiğini işlemeyeceği anlamına gelirken, SSL/TLS sonlandırmasının devre dışı bırakılması yalnızca HTTPS trafiğinin işleneceği anlamına gelir.

SSL/TLS sonlandırmasını etkinleştirmek için:

1. Sidecar'ın SSL/TLS işleyeceği sunucuya ait sunucu sertifikasını (açık anahtar) ve özel anahtarı edinin.
2. Uygulama pod'unun bulunduğu namespace içerisinde, sunucu sertifikasını ve özel anahtarı içeren bir [TLS secret](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) oluşturun.
3. `values.yaml` dosyasında secret mount için `config.profiles` bölümünü ekleyin. Aşağıdaki örnek, birden fazla sertifika mount etme yapılandırmasını göstermektedir.

    İhtiyaçlarınıza göre yorumları dikkate alarak kodu özelleştirin. Sadece bir sertifikaya ihtiyacınız varsa, gereksiz sertifika mount yapılandırmalarını kaldırın.

    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com" # or empty string if using the EU Cloud
        # Other Wallarm settings https://docs.wallarm.com/installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm/
      profiles:
        tls-profile: # Buraya istenilen herhangi bir TLS profil adını belirleyin
          sidecar:
            volumeMounts:
              - name: nginx-certs-example-com # example.com anahtarlarını içeren volume adı
                mountPath: /etc/nginx/certs/example.com # Container içerisinde example.com anahtarlarının mount edileceği yol
                readOnly: true
              - name: nginx-certs-example-io # example.io anahtarlarını içeren volume adı
                mountPath: /etc/nginx/certs/example.io # Container içerisinde example.io anahtarlarının mount edileceği yol
                readOnly: true
            volumes:
              - name: nginx-certs-example-com # example.com anahtarlarını içeren volume adı
                secret:
                  secretName: example-com-certs # example.com backend'i için oluşturulan, açık ve özel anahtarları içeren secret adı
              - name: nginx-certs-example-io # example.io anahtarlarını içeren volume adı
                secret:
                  secretName: example-io-certs # example.io backend'i için oluşturulan, açık ve özel anahtarları içeren secret adı
          nginx:
            # TLS/SSL sonlandırma prosedürünüze özgü NGINX SSL modülü yapılandırması.
            # Ayrıntılar için https://nginx.org/en/docs/http/ngx_http_ssl_module.html adresine bakınız.
            # Bu yapılandırma, Sidecar'ın trafiği sonlandırabilmesi için gereklidir.
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
4. `values.yaml` dosyasındaki değişiklikleri aşağıdaki komutla Sidecar çözümüne uygulayın:

    ```bash
    helm upgrade <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f values.yaml
    ```
5. Uygulama pod'una [buradaki](pod-annotations.md#how-to-use-annotations) gibi `sidecar.wallarm.io/profile: tls-profile` anotasyonunu uygulayın.
6. Yapılandırma uygulandıktan sonra, HTTP yerine HTTPS protokolünü kullanarak [burada](deployment.md#step-4-test-the-wallarm-sidecar-operation) tarif edilen adımları izleyerek çözümü test edebilirsiniz.

Sidecar çözümü, TLS/SSL trafiğini kabul edecek, sonlandıracak ve sade HTTP trafiğini uygulama pod'una iletecektir.

### Admission Webhook İçin Sertifikalar

Sürüm 4.10.7'ten itibaren, admission webhook için kendi sertifikalarınızı oluşturma ve kullanma seçeneğine sahip olursunuz.

Varsayılan olarak, çözüm admission webhook sertifikalarını otomatik olarak, [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) kullanarak oluşturur.

Kendi sertifikalarınızı kullanmak için aşağıdaki seçenekler mevcuttur:

* **cert-manager Kullanımı**: Kümenizde [`cert-manager`](https://cert-manager.io/) kullanıyor ve admission webhook sertifikasının oluşturulması için bunu tercih ediyorsanız, `values.yaml` dosyanızı aşağıdaki şekilde güncelleyin.

    Bu, otomatik olarak `certgen`'i devre dışı bırakacaktır.

    ```yaml
    controller:
      admissionWebhook:
        certManager:
          enabled: true
    ```
* **Manuel Sertifika Yükleme**: Aşağıdaki yapılandırmayı `values.yaml` dosyasına ekleyerek sertifikaları manuel olarak yükleyebilirsiniz. Bu, otomatik olarak `certgen`'i devre dışı bırakacaktır.

    ```yaml
    controller:
      admissionWebhook:
        secret:
          enabled: true
          ca: <base64-encoded-CA-certificate>
          crt: <base64-encoded-certificate>
          key: <base64-encoded-private-key>
    ```

Sürüm 4.10.6 veya daha eski bir sürümden yükseltiyorsanız, lütfen [özel yükseltme talimatlarını][sidecar-upgrade-docs] izleyin. Bu güncelleme, çözümün yeniden kurulmasını gerektiren bir geriye dönük uyumsuzluk getirir.

### Ekstra NGINX Modüllerinin Etkinleştirilmesi

Wallarm sidecar'in Docker görüntüsü, varsayılan olarak aşağıdaki ekstra NGINX modüllerini devre dışı bırakılmış şekilde dağıtılmaktadır:

* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)

Ekstra modülleri yalnızca pod bazında, Pod'un anotasyonu `sidecar.wallarm.io/nginx-extra-modules`'u ayarlayarak etkinleştirebilirsiniz.

Anotasyon değerinin formatı bir dizidir. Ekstra modüllerin etkinleştirildiği örnek:

```yaml
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

### Özel NGINX Yapılandırması Kullanma

Belirli NGINX ayarları için ayrılmış [pod anotasyonları](pod-annotations.md) bulunmuyorsa, bunları pod bazında **snippet** ve **include** olarak belirtebilirsiniz.

#### Snippet

Snippet, NGINX yapılandırmasına tek satırlık değişiklikler eklemenin pratik bir yoludur. Daha karmaşık değişiklikler için [include](#include) kullanımı tavsiye edilir.

Pod anotasyonları aracılığıyla snippet şeklinde özel ayarları belirtmek için aşağıdaki anotasyonları kullanın:

| NGINX yapılandırma bölümü | Anotasyon                                  | 
|---------------------------|--------------------------------------------|
| http                      | `sidecar.wallarm.io/nginx-http-snippet`    |
| server                    | `sidecar.wallarm.io/nginx-server-snippet`  |
| location                  | `sidecar.wallarm.io/nginx-location-snippet`|

NGINX direktifi [`disable_acl`][disable-acl-directive-docs] değerini değiştiren örnek anotasyon:

```yaml
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

Birden fazla direktifi belirtmek için `;` karakterini kullanın, örneğin:

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### Include

Wallarm sidecar konteynerine ek NGINX yapılandırma dosyası mount etmek için, bu dosyadan bir ConfigMap veya [Secret resource](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret) oluşturabilirsiniz ve oluşturulan kaynağı konteynerde kullanabilirsiniz.

ConfigMap veya Secret kaynağı oluşturulduktan sonra, aşağıdaki pod anotasyonlarını kullanarak ilgili kaynağı [Volume ve VolumeMounts bileşenleri](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) ile konteynerin içine mount edebilirsiniz:

| Öğe           | Anotasyon                                    | Değer tipi |
|---------------|----------------------------------------------|------------|
| Volumes       | `sidecar.wallarm.io/proxy-extra-volumes`     | JSON       |
| Volume mounts | `sidecar.wallarm.io/proxy-extra-volume-mounts` | JSON       |

Kaynak konteyner içine mount edildikten sonra, yapılandırmanın ekleneceği NGINX bağlamını, mount edilmiş dosyanın yolunu ilgili anotasyona geçirerek belirtin:

| NGINX yapılandırma bölümü | Anotasyon                                  | Değer tipi |
|---------------------------|--------------------------------------------|------------|
| http                      | `sidecar.wallarm.io/nginx-http-include`    | Array      |
| server                    | `sidecar.wallarm.io/nginx-server-include`  | Array      |
| location                  | `sidecar.wallarm.io/nginx-location-include`| Array      |

Aşağıda, NGINX yapılandırmasının `http` seviyesine eklenen mount edilmiş konfigürasyon dosyası örneği verilmiştir. Bu örnekte, `nginx-http-include-cm` adlı ConfigMap'in önceden oluşturulduğu ve geçerli NGINX yapılandırma direktiflerini içerdiği varsayılmıştır.

```yaml
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

### Wallarm Özelliklerinin Yapılandırılması

Listelenen genel çözüm ayarlarına ek olarak, [Wallarm ile saldırı önleme için en iyi uygulamaları](wallarm-attack-prevention-best-practices-docs) da öğrenmenizi tavsiye ederiz.

Bu yapılandırma, [anotasyonlar](pod-annotations.md) ve Wallarm Console UI üzerinden gerçekleştirilir.

## Anotasyonlar Aracılığıyla Diğer Yapılandırmalar

Listelenen yapılandırma kullanım durumlarına ek olarak, uygulama pod'ları için Wallarm sidecar çözümünü ince ayarlarla düzenlemenize olanak tanıyan birçok başka anotasyon bulunmaktadır.

[Pod anotasyonlarının desteklenen listesini buradan bulabilirsiniz](pod-annotations.md)