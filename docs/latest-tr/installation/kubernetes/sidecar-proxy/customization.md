# Wallarm Sidecar'ın Özelleştirilmesi

Bu makale, ortak özelleştirme kullanım senaryoları için örnekler sağlayarak size [Wallarm Kubernetes Sidecar çözümü](deployment.md) 'nün güvenli ve etkili bir şekilde özelleştirilmesi hakkında talimatlar verir.

## Yapılandırma alanı

Wallarm Sidecar çözümü, standart Kubernetes bileşenlerine dayanır, bu nedenle çözüm yapılandırması büyük ölçüde Kubernetes yığını yapılandırmasına benzer. Wallarm Sidecar çözümünü global olarak `values.yaml` aracılığıyla ve bir uygulama kabuğu temelinde annotationlar aracılığıyla yapılandırabilirsiniz.

### Global ayarlar

Global yapılandırma seçenekleri, Wallarm denetleyicisi tarafından oluşturulan tüm servis yanıtı kaynaklarına uygulanır ve [varsayılan Helm tablo değerlerinde](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) ayarlanır. `helm install` veya `helm upgrade` yaparken özel `values.yaml` sağlayarak bunları geçebilirsiniz.

Kullanılabilir global yapılandırma seçeneklerinin sayısı sınırsızdır. Çözümü özelleştirirken dikkatli olunmalıdır çünkü bu, sonuç kabuğunun tamamının değiştirilmesine ve sonuç olarak yanlış çözüm işlevine izin verir. Global ayarları değiştirirken Helm ve Kubernetes belgelerine başvurun.

[Wallarm'a özgü çizelgelerin listesi buradadır](helm-chart-for-wallarm.md)

### Kabuk (Pod) başına ayarlar

Kabuk başına ayarlar, belirli uygulamalar için çözüm davranışının özelleştirilmesine izin verir.

Uygulama kabuğu başına ayarlar, uygulama kabuğunun annotationları aracılığıyla ayarlanır. Annotationlar, global ayarlara üstünlük sağlar. Aynı seçenek global olarak ve annotation aracılığıyla belirtilmişse, annotationdan gelen değer uygulanacaktır.

Desteklenen annotation seti sınırlıdır ama `nginx-*-include` ve `nginx-*-snippet` annotationları herhangi bir [özel NGINX yapılandırmasının çözüm tarafından kullanılmasına izin verir](#using-custom-nginx-configuration).

[Desteklenen kabuk başına annotationların listesi buradadır](pod-annotations.md)

## Yapılandırma kullanım senaryoları

Yukarıda belirtildiği gibi, çözümü altyapınıza ve güvenlik çözümüne gereksinimlerinize uyacak şekilde birçok yönden özelleştirebilirsiniz. En yaygın özelleştirme seçeneklerini uygulamanın daha kolay olması için, onları ilgili en iyi uygulamaları dikkate alarak açıkladık.

### Tek ve bölünmüş konteyner dağıtımı

Wallarm, bir Kabuğa Wallarm konteynerlerinin dağıtılması için iki seçenek sunar:

* Tekil dağıtım (varsayılan olarak)
* Bölünmüş dağıtım

![Tekil ve bölünmüş konteynerler][single-split-containers-img]

Konteyner dağıtım seçeneklerini hem global hem de kabuk başına ayarlayabilirsiniz:

* Genel olarak, Helm tablo değerini `config.injectionStrategy.schema` için `single` (varsayılan) veya `split`'e ayarlama.
* Kabuk başına, uygulamanın ilgili kabuğunun annotationını `sidecar.wallarm.io/sidecar-injection-schema` için `"single"` veya `"split"`'e ayarlama.

!!! bilgi "Postanalytics modulu"
    Lütfen unutmayın ki, postanalytics modülü kabı [ayrı](deployment.md#solution-architecture) çalışır, açıklanan dağıtım seçenekleri yalnızca diğer kablarla ilgilidir.

#### Tekil dağıtım (varsayılan olarak)

Tekil Wallarm konteynerlarının dağıtımıyla, bir Kabukta yalnızca bir konteyner çalışır, **iptables**'nın isteğe bağlı init kabı dışında.

Sonuç olarak, iki çalışan konteyner vardır:

* `sidecar-init-iptables` iptables'ı çalıştıran init kabıdır. Varsayılan olarak, bu kabı başlatır ancak [devre dışı bırakabilirsiniz](#capturing-incoming-traffic-port-forwarding).
* `sidecar-proxy`, Wallarm modülleri ve bazı yardımcı hizmetlerle NGINX proxy'yi çalıştırır. Tüm bu süreçler [supervisord](http://supervisord.org/) tarafından çalıştırılır ve yönetilir.

#### Bölünmüş dağıtım

Bölünmüş Wallarm konteynerlarının dağıtımıyla, iki init kabı dışında bir Kabukta iki ek konteyner çalışır.

Bu seçenek tüm yardımcı hizmetleri `sidecar-proxy` kabından alır ve sadece NGINX hizmetlerinin konteyner tarafından başlatılmasını sağlar.

Bölünmüş konteyner dağıtımı, NGINX hizmetlerinin ve yardımcı hizmetlerin tükettiği kaynaklar üzerinde daha ayrıntılı kontrol sağlar. CPU/Hafıza/Depolama alanları arasında Wallarm ve yardımcı kablar arasında bölme gerektiren, yoğun yük altındaki uygulamalar için önerilen seçenektir.

Sonuç olarak, dört çalışan konteyner vardır:

* `sidecar-init-iptables` iptables'ı çalıştıran init kabıdır. Varsayılan olarak, bu kabı başlatır ancak [devre dışı bırakabilirsiniz](#capturing-incoming-traffic-port-forwarding).
* `sidecar-init-helper`, Wallarm nodunu Wallarm Bulutuna bağlama göreviyle yardımcı hizmetlerle dolu olan init kabıdır.
* `sidecar-proxy`, NGINX servisleri olan kab.
* `sidecar-helper`, bir takım diğer yardımcı servislerle dolu kab.

### Uygulama kabı portunun otomatik keşfi

Korunan uygulama portu, birçok yoldan yapılandırılabilir. Gelen trafiği uygun bir şekilde yönetmek ve iletmek için, Wallarm yanıtının uygulama kabının gelen talepleri kabul eden TCP portunun bilincinde olması gerekmektedir.

Varsayılan olarak, yanıt denetleyicisi portu aşağıdaki öncelik sırasına göre otomatik olarak keşfeder:

1. Port `sidecar.wallarm.io/application-port` kabı annotationı aracılığıyla tanımlanmışsa, Wallarm denetleyicisi bu değeri kullanır.
1. `name: http` uygulama kabı ayarında tanımlanmış bir port varsa, Wallarm denetleyicisi bu değeri kullanır.
1. `name: http` ayarında tanımlanmış bir port yoksa, Wallarm denetleyicisi, uygulama kabı ayarlarında bulunan ilk port değerini kullanır.
1. Uygulama kabı ayarlarında hiç port tanımlanmamışsa, Wallarm denetleyicisi Wallarm Helm chart'tan `config.nginx.applicationPort` değerini kullanır.

Uygulama kabı portu otomatik keşfi beklenildiği gibi çalışmıyorsa, 1. veya 4. seçeneği kullanarak portu açıkça belirtin.

### Gelen trafiği yakalama (port yönlendirme)

Varsayılan olarak, Wallarm yanıt denetleyicisi trafiği aşağıdaki gibi yönlendirir:

1. Bağlı kabın IP'sine ve uygulama kabı portuna gelen trafiği yakalar.
1. Bu trafiği dahili iptables özelliklerini kullanarak yanıt kabasına yönlendirir.
1. Yanıt zararlı talepleri hafifletir ve meşru trafiği uygulama kabına yönlendirir.

Gelen trafiği yakalama, iptables çalıştıran init kabı kullanılarak uygulanır ki bu otomatik port yönlendirmenin en iyi uygulamasıdır. Bu kabı ayrıcalıklı olarak çalıştırılır ve `NET_ADMIN` yeteneği üzerinde çalışır.

![Varsayılan port yönlendirmesi iptables ile][port-forwarding-with-iptables-img]

Ancak, bu yaklaşım, ağ hizmetlerinin önceden iptables tabanlı trafik yakalamayı uyguladığı servis ağı gibi İstio ile uyumsuz olabilir. Bu durumda, iptables'ı devre dışı bırakabilir ve port yönlendirme aşağıdaki şekilde çalışacaktır:

![iptables olmadan port yönlendirme][port-forwarding-without-iptables-img]

!!! info "Korunmayan uygulama kabı"
    Iptables devre dışı bırakılırsa, bir uygulama kabı Wallarm tarafından korunmaz. Sonuç olarak, saldırganın IP adresini ve portunu bildiği takdirde, zararlı "doğu-batı" trafiği uygulama kabına ulaşabilir.

    Doğu/batı trafiği, Kubernetes kümesinde etrafı dolaşan trafiğe denir (örneğin, servis-servis)

Varsayılan davranışı aşağıdaki gibi değiştirebilirsiniz:

1. İptables'ı birkaç yol arasından birinde devre dışı bırakın:

    * Genel olarak, Helm chart değerini `config.injectionStrategy.iptablesEnable` için `"false"`'a ayarlama.
    * Kabuk başına annotasyonu `sidecar.wallarm.io/sidecar-injection-iptables-enable` için `"false"`'a ayarlama.
2. Hizmet manifesto'nuzdaki `spec.ports.targetPort` ayarını, `proxy` portuna işaret etmek üzere güncelleyin.

    İptables tabanlı trafik yakalama devre dışı bırakılırsa, Wallarm yanıt kabı `proxy` adında bir port yayınlayacaktır. Gelen trafiğin Kubernetes servisinden `proxy` portuna geçmesi için, Hizmet manifesto'nuzdaki `spec.ports.targetPort` seçeneği bu porta işaret etmelidir:

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

### Kablar için kaynak tahsisi

Wallarm yanıt kablarının için ayrılan bellek miktarı, talep işleme kalitesi ve hızını belirler. Bellek talepleri ve sınırları için yeterli kaynakları ayırmak için, [örneklerimizi öğrenin][allocate-resources-for-node-docs].

Kaynak tahsisi hem global hem de kabuk seviyesinde izin verilir.

#### Helm chart değerleri aracılığıyla global tahsis

| Konteyner dağıtım deseni | Konteyner adı        | Chart değeri                                      |
|--------------------------|----------------------|---------------------------------------------------|
| [Bölünmüş, Tekil](#single-and-split-deployment-of-containers)     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| Bölünmüş                 | sidecar-helper        | config.sidecar.containers.helper.resources        |
| Bölünmüş, Tekil     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources  |
| Bölünmüş             | sidecar-init-helper   | config.sidecar.initContainers.helper.resources    |

Kaynakları (talepler ve sınırlar) global düzeyde yönetmek için Helm chart değerleri:

```yaml
config:
  sidecar:
    containers:
      proxy:
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
      helper:
        resources:
          requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 300m
              memory: 256Mi
    initContainers:
      helper:
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
          limits:
            cpu: 300m
            memory: 128Mi
      iptables:
        resources:
          requests:
            cpu: 50m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 64Mi
```

#### Kabuğun annotasyonları aracılığıyla kabuk başına tahsis

| Konteyner dağıtım deseni | Konteyner adı        | Annotation                                                             |
|--------------------------|----------------------|------------------------------------------------------------------------|
| [Tekil, Bölünmüş](#single-and-split-deployment-of-containers)     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| Bölünmüş                 | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| Tekil, Bölünmüş    | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| Bölünmüş                 | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

Kaynakları (talepler ve sınırlar) kabuk (pod) başına yönetmek için annotationları (`single` konteyner deseni etkinleştirilmiş):

```yaml hl_lines="16-24"
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
        sidecar.wallarm.io/proxy-cpu: 200m
        sidecar.wallarm.io/proxy-cpu-limit: 500m
        sidecar.wallarm.io/proxy-memory: 256Mi
        sidecar.wallarm.io/proxy-memory-limit: 512Mi
        sidecar.wallarm.io/init-iptables-cpu: 50m
        sidecar.wallarm.io/init-iptables-cpu-limit: 100m
        sidecar.wallarm.io/init-iptables-memory: 32Mi
        sidecar.wallarm.io/init-iptables-memory-limit: 64Mi
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### SSL/TLS sonlandırma

Varsayılan olarak, Sidecar çözümü yalnızca HTTP trafiğini kabul eder ve düz HTTP trafiğini uygulama podlarına iletir. SSL/TLS sonlandırmanın, sidecar çözümünden önce bulunan bir altyapı bileşeni tarafından (örneğin, Giriş/Uygulama Geçidi) gerçekleştirildiği varsayılır ki bu da sidecar çözümünün düz HTTP'yi işlemesine olanak sağlar.

Ancak, mevcut altyapının SSL/TLS sonlandırmayı desteklemediği durumlar olabilir. Böyle durumlarda, Wallarm sidecar seviyesinde SSL/TLS sonlandırmayı etkinleştirebilirsiniz. Bu özellik, Helm tablosunun 4.6.1 versiyonundan itibaren desteklenmektedir.

!!! uyarı "Sidecar çözümü yalnızca SSL veya düz HTTP trafiğini işler"
    Wallarm Sidecar çözümü, SSL/TLS ya da düz HTTP trafiğini işleyebilir. SSL/TLS sonlandırmanın etkinleştirilmesi, yanıt çözümünün düz HTTP trafiğini işlemeyeceği anlamına gelirken, SSL/TLS sonlandırmanın devre dışı bırakılması yalnızca HTTPS trafiğinin işleneceği sonucunu verecektir.

SSL/TLS sonlandırmasını etkinleştirmek için:

1. Sidecar'ın SSL/TLS sonlandıracağı sunucu için ilişkili olan sunucu sertifikasını (açık anahtar) ve özel anahtarı elde edin.
1. Uygulama kabının ad alanında, sunucu sertifikasını ve özel anahtarı içeren bir [TLS sırı](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) oluşturun.
1. `values.yaml` dosyasında, sırrın monte edilmesi için `config.profiles section` ekleyin. Aşağıdaki örnek, birden fazla sertifika monte yapılandırmalarını gösterir.

    İhtiyaçlarınıza göre koda göre özelleştirin. Yalnızca bir sertifikaya ihtiyaç duyuyorsanız, gereksiz sertifika monte yapılandırmalarını kaldırın.

    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com" # ya da Avrupa Bulutu'nun kullanılması durumunda boş bir dize
        # Diğer Wallarm ayarları https://docs.wallarm.com/installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm/
      profiles:
        tls-profile: # Burada herhangi bir istenen TLS profil adını ayarlayın
          sidecar:
            volumeMounts:
              - name: nginx-certs-example-com # example.com anahtarlarını içeren birim'in adı
                mountPath: /etc/nginx/certs/example.com # Kabın birim bağlama noktası içine example.com anahtarları
                readOnly: true
              - name: nginx-certs-example-io # example.io anahtarlarını içeren birim'in adı
                mountPath: /etc/nginx/certs/example.io # Kabın birim bağlama noktası içine example.io anahtarları
                readOnly: true
            volumes:
              - name: nginx-certs-example-com # example.com anahtarlarını içeren birim'in adı
                secret:
                  secretName: example-com-certs # example.com sunucusu için oluşturulmuş sırın adı; herkese açık ve özel anahtarları içerir
              - name: nginx-certs-example-io # example.io anahtarlarını içeren birim'in adı
                secret:
                  secretName: example-io-certs # example.io sunucusu için oluşturulmuş sırın adı; herkese açık ve özel anahtarları içerir
          nginx:
            # Trafik sonlandırma işlemi için NGINX SSL modülü yapılandırması.
            # https://nginx.org/en/docs/http/ngx_http_ssl_module.html dan tariflere bakınız.
            # Sidecar'ın trafik sonlandırmasını gerçekleştirmesi için bu ayar gereklidir.
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
1. Aşağıdaki komutu kullanarak `values.yaml` içindeki değişiklikleri Sidecar çözümüne uygulayın:

    ```bash
    helm upgrade <YAYIN_ADİ> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f values.yaml
    ```
1. Uygulama kabına `sidecar.wallarm.io/profile: tls-profile` annotationunu [uygulayın](pod-annotations.md#how-to-use-annotations).
1. Yapılandırma uygulandıktan sonra, protokolü HTTPS ile değiştirerek [burada](deployment.md#step-4-test-the-wallarm-sidecar-proxy-operation) açıklanan adımlar izleyin ve çözümü test edin.

Yanıt çözümü, TLS/SSL trafiğini kabul eder, sonlandırır ve düz HTTP trafiğini uygulama podlarına iletir.

### Ek NGINX modüllerini etkinleştirme

Wallarm yanıtının Docker imajı, aşağıdaki ek NGINX modülleri ile dağıtılmış ve varsayılan olarak devre dışı bırakılmıştır:

* [ngx_http_auth_digest_module.so](https://github.com/atomx/nginx-http-auth-digest)
* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)
* [ngx_http_influxdb_module.so](https://github.com/influxdata/nginx-influxdb-module)
* [ngx_http_modsecurity_module.so](https://github.com/SpiderLabs/ModSecurity)
* [ngx_http_opentracing_module.so](https://github.com/opentracing-contrib/nginx-opentracing)

Kabın annotation'ı `sidecar.wallarm.io/nginx-extra-modules`'nı ayarlayarak ek modülleri yalnızca belirli bir kabuk üzerinden etkinleştirebilirsiniz.

Annotation'ın değerinin biçimi bir arraydir. Ek modüllerin etkinleştirilmiş olduğu örnek aşağıda bulunabilir:

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

### Özel NGINX yapılandırmasının kullanımı

Özel NGINX ayarları için ayrılmış [kabuk annotionları](pod-annotations.md) yoksa, bunları kabuk başına **snippet** ve **include** aracılığıyla belirtebilirsiniz.

#### Snippet

Snippet'lar, NGINX yapılandırmasına tek satırlık değişiklikler eklemenin kullanışlı bir yoludur. Daha karmaşık değişiklikler için, [include](#include) önerilen seçenektir.

Özel ayarları snippet'lar aracılığıyla belirtmek için, aşağıdaki kabuk annotionlarını kullanın:

| NGINX yapılandırmasyon bölümü | Annotation                                  | 
|---------------------------|--------------------------------------------|
| http                      | `sidecar.wallarm.io/nginx-http-snippet`    |
| server                    | `sidecar.wallarm.io/nginx-server-snippet`  |
| location                  | `sidecar.wallarm.io/nginx-location-snippet`|

[`disable_acl`][disable-acl-directive-docs] NGINX yönerge değerini değiştiren annotation örneği:

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

Bir yönergeyi belirtmek için `;` sembolünü kullanın, örneğin:

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### Include

Ek bir NGINX yapılandırma dosyasını Wallarm yanıt kabına monte etmek için, bu dosyadan [ConfigMap oluşturabilir](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) veya [Secret resource](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret) oluşturabilir ve oluşturulan kaynağı kabada kullanabilirsiniz.

Bir kez ConfigMap veya Secret resource oluşturulduğunda, [Birim ve BirimiMonteEt bileşenleri aracılığıyla](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) kabında monte edebilirsiniz, ardından NGINX bağlamını belirterek monte edilmiş dosyanın yolunu ekleyin, monte edilmiş dosyanın yolunu ilgili annotation içerisinde belirtin:

| NGINX yapılandırmasyon bölümü | Annotation                                  | Değer türü |
|---------------------------|--------------------------------------------|-----------|
| http                      | `sidecar.wallarm.io/nginx-http-include`    | Array  |
| server                    | `sidecar.wallarm.io/nginx-server-include`  | Array  |
| location                  | `sidecar.wallarm.io/nginx-location-include`| Array  |

Aşağıdaki örnek, monte edilmiş yapılandırma dosyasının `http` seviyesinde NGINX tablo'suna dahil edilmesini gösteriyor. Bu örnek, önceden `nginx-http-include-cm` ConfigMap'inin oluşturulmuş olduğunu ve geçerli NGINX yönergelerini içerdiğini varsayar.

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

### Wallarm özelliklerinin yapılandırılması

Listelenen genel çözüm ayarlarına ek olarak, saldırı önleme ile Wallarm [en iyi uygulamalarını da öğrenmenizi öneririz][wallarm-attack-prevention-best-practices-docs].

Bu yapılandırma, [annotationlar](pod-annotations.md) ve Wallarm Konsol UI aracılığıyla gerçekleştirilir.

## Diğer yapılandırmalar annotation'lar aracılığıyla

Listelenen yapılandırma kullanım senaryolarına ek olarak, birçok diğer annotation'ın yardımıyla Wallarm sidecar çözümünü uygulama podlar için ince ayar yapabilirsiniz.

[Desteklenen kabuk başına annotationların listesi buradadır](pod-annotations.md)