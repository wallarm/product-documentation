[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# NGINX tabanlı Wallarm Ingress Controller'ın İnce Ayarı

Wallarm çözümünden en iyi şekilde yararlanmak için self-hosted Wallarm Ingress controller için mevcut ince ayar seçeneklerini öğrenin.

!!! info "NGINX Ingress Controller için resmi dokümantasyon"
    Wallarm Ingress Controller'ın ince ayarı, [resmi dokümantasyonda](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/) açıklanan NGINX Ingress Controller'ın ince ayarına oldukça benzerdir. Wallarm ile çalışırken orijinal NGINX Ingress Controller'ı yapılandırmaya yönelik tüm seçenekler kullanılabilir.

## Helm Chart için Ek Ayarlar

Ayarlar [`values.yaml`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml) dosyasında tanımlıdır. Varsayılan olarak, dosya aşağıdaki gibidir:

```yaml
controller:
  wallarm:
    enabled: false
    apiHost: api.wallarm.com
    apiPort: 443
    apiSSL: true
    token: ""
    nodeGroup: defaultIngressGroup
    existingSecret:
      enabled: false
      secretKey: token
      secretName: wallarm-api-token
    postanalytics:
      kind: Deployment
      service:
        annotations: {}
      arena: "2.0"
      serviceAddress: "[::]:3313"
      livenessProbe:
        failureThreshold: 3
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      tls:
        enabled: false
      #  certFile: "/root/test-tls-certs/server.crt"
      #  keyFile: "/root/test-tls-certs/server.key"
      #  caCertFile: "/root/test-tls-certs/ca.crt"
      #  mutualTLS:
      #    enabled: false
      #    clientCACertFile: "/root/test-tls-certs/ca.crt"
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wallarm-appstructure:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wallarm-antibot:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    metrics:
      port: 18080
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## stats-exporter servisinin erişilebilir olduğu IP adresleri listesi
        ## Bkz: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    init:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wcliController:
      logLevel: warn
      commands:
        apispec:
          logLevel: INFO
        blkexp:
          logLevel: INFO
        botexp:
          logLevel: WARN
        cntexp:
          logLevel: ERROR
        cntsync:
          logLevel: INFO
        credstuff:
          logLevel: INFO
        envexp:
          logLevel: INFO
        ipfeed:
          logLevel: INFO
        iplist:
          logLevel: INFO
        jwtexp:
          logLevel: INFO
        metricsexp:
          logLevel: INFO
        mrksync:
          logLevel: INFO
        register:
          logLevel: INFO
        reqexp:
          logLevel: INFO
        syncnode:
          logLevel: INFO
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wcliPostanalytics:
      logLevel: warn
      commands:
        apispec:
          logLevel: INFO
        blkexp:
          logLevel: INFO
        botexp:
          logLevel: WARN
        cntexp:
          logLevel: ERROR
        cntsync:
          logLevel: INFO
        credstuff:
          logLevel: INFO
        envexp:
          logLevel: INFO
        ipfeed:
          logLevel: INFO
        iplist:
          logLevel: INFO
        jwtexp:
          logLevel: INFO
        metricsexp:
          logLevel: INFO
        mrksync:
          logLevel: INFO
        register:
          logLevel: INFO
        reqexp:
          logLevel: INFO
        syncnode:
          logLevel: INFO
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    apiFirewall:
      enabled: true
      config:
        ...
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
      metrics:
        enabled: false
        port: 9010
        endpointPath: /metrics
        host: ":9010"
        service:
          servicePort: 9010
        serviceMonitor:
          ## ServiceMonitor kaynağının oluşturulmasını etkinleştirir
          enabled: false
          ## Prometheus örneğiyle eşleşmek için kullanılan ekstra etiketler
          additionalLabels: {}
          # -- ServiceMonitor'a eklenecek açıklamalar (annotations)
          annotations: {}
          ## İş adını almak için kullanılacak etiket
          ## jobLabel: "app.kubernetes.io/name"
          namespace: ""
          namespaceSelector: {}
          ## Varsayılan: yalnızca .Release.Namespace veya namespaceOverride'ı scrape et
          ## Tüm ad alanlarını scrape etmek için aşağıdakini kullanın:
          ## namespaceSelector:
          ##   any: true
          scrapeInterval: 30s
          # honorLabels: true
          targetLabels: []
          relabelings: []
          metricRelabelings: []
validation:
  enableCel: false
  forbidDangerousAnnotations: false
```

Bu ayarı değiştirmek için, `helm install` (Ingress controller kurulumu) veya `helm upgrade` (kurulu Ingress controller parametrelerinin güncellenmesi) komutlarının `--set` seçeneğini kullanmanızı öneririz. Örneğin:

=== "Ingress controller kurulumu"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Ingress controller parametrelerini güncelleme"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

Aşağıda yapılandırabileceğiniz başlıca parametrelerin açıklaması verilmiştir. Diğer parametreler varsayılan değerlerle gelir ve nadiren değiştirilmesi gerekir.

### controller.wallarm.enabled

Wallarm işlevlerini etkinleştirmenize veya devre dışı bırakmanıza olanak tanır.

**Varsayılan değer**: `false`

### controller.wallarm.apiHost

Wallarm API uç noktası. Şunlardan biri olabilir:

* [US Cloud](../about-wallarm/overview.md#cloud) için `us1.api.wallarm.com`.
* [EU Cloud](../about-wallarm/overview.md#cloud) için `api.wallarm.com`,

**Varsayılan değer**: `api.wallarm.com`

### controller.wallarm.token

Bir filtreleme node token değeri. Wallarm API'ye erişim için gereklidir.

Token, şu [türlerden][node-token-types] biri olabilir:

* **API token (önerilir)** - UI organizasyonu için node gruplarını dinamik olarak ekleyip/çıkarmanız gerekiyorsa veya ek güvenlik için token yaşam döngüsünü kontrol etmek istiyorsanız idealdir. Bir API token oluşturmak için:

    Bir API token oluşturmak için:
    
    1. Wallarm Console → **Settings** → **API tokens** bölümüne [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde gidin.
    1. **Node deployment/Deployment** kullanım türüyle bir API token oluşturun.
    1. Node dağıtımı sırasında, oluşturulan token'ı kullanın ve `controller.wallarm.nodeGroup` parametresiyle grup adını belirtin. Farklı API token'ları kullanarak bir gruba birden fazla node ekleyebilirsiniz.
* **Node token** - Kullanılacak node gruplarını zaten bildiğiniz durumlar için uygundur.

    Bir node token oluşturmak için:
    
    1. Wallarm Console → **Nodes** bölümüne [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde gidin.
    1. Bir node oluşturun ve node grubu adını belirleyin.
    1. Node dağıtımı sırasında, o gruba dahil etmek istediğiniz her node için grubun token'ını kullanın.

[`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret) ise bu parametre yok sayılır.

**Varsayılan değer**: `belirtilmemiş`

### controller.wallarm.nodeGroup

Helm chart 4.6.8 sürümünden itibaren, yeni dağıtılan node'ları eklemek istediğiniz filtreleme node grubu adını belirtir. Bu şekilde gruplama yalnızca, **Node deployment/Deployment** kullanım türüne sahip bir API token ile node'lar oluşturup Cloud'a bağladığınızda kullanılabilir (değeri `controller.wallarm.token` parametresiyle iletilir).

**Varsayılan değer**: `defaultIngressGroup`

### controller.wallarm.existingSecret

Helm chart 4.4.1 sürümünden itibaren, bu yapılandırma bloğunu kullanarak Wallarm node token değerini Kubernetes secret'larından çekebilirsiniz. Ayrı giz yönetimi olan ortamlarda (ör. harici bir secrets operator kullanıyorsanız) faydalıdır.

Node token'ı K8s secret'larında saklamak ve Helm chart'a çekmek için:

1. Wallarm node token ile bir Kubernetes secret oluşturun:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>`, Wallarm Ingress controller'lı Helm yayını için oluşturduğunuz Kubernetes namespace'idir
    * `wallarm-api-token`, Kubernetes secret adıdır
    * `<WALLARM_NODE_TOKEN>`, Wallarm Console UI'dan kopyalanan Wallarm node token değeridir

    Harici bir secrets operator kullanıyorsanız, bir secret oluşturmak için [uygun dokümantasyonu](https://external-secrets.io) izleyin.
1. `values.yaml` dosyasında aşağıdaki yapılandırmayı ayarlayın:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**Varsayılan değer**: `existingSecret.enabled: false`; bu durumda Helm chart, Wallarm node token'ını `controller.wallarm.token` değerinden alır.

### controller.wallarm.postanalytics.arena

Postanalytics servisi için ayrılan bellek miktarını belirtir. Son 5-15 dakikaya ait istek verilerini saklamak için yeterli bir değer ayarlanması önerilir.

**Varsayılan değer**: `2.0`

[NGINX Node 5.x ve öncesinde](../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics), parametrenin adı `controller.wallarm.tarantool.arena` idi. Yükseltme sırasında yeniden adlandırma gerekir.

### controller.wallarm.postanalytics.serviceAddress

**wstore**'un gelen bağlantıları kabul ettiği adres ve portu belirtir.

6.3.0 sürümünden itibaren desteklenir.

**Varsayılan değer**: `[::]:3313` - tüm IPv4 ve IPv6 arayüzlerinde 3313 portunu dinler. Bu, 6.3.0'dan önceki sürümlerde de varsayılan davranıştı.

### controller.wallarm.postanalytics.tls

Postanalytics modülüne güvenli bağlantı sağlamak için TLS ve karşılıklı TLS (mTLS) ayarlarını yapılandırır (opsiyonel):

```yaml
controller:
  wallarm:
    postanalytics:
      tls:
        enabled: false
      #  certFile: "/root/test-tls-certs/server.crt"
      #  keyFile: "/root/test-tls-certs/server.key"
      #  caCertFile: "/root/test-tls-certs/ca.crt"
      #  mutualTLS:
      #    enabled: false
      #    clientCACertFile: "/root/test-tls-certs/ca.crt"
```

6.2.0 sürümünden itibaren desteklenir.

| Parametre | Açıklama | Gerekli mi? |
| --------- | -------- | ----------- |
| `enabled` | Postanalytics modülüne bağlantı için SSL/TLS'yi etkinleştirir veya devre dışı bırakır. Varsayılan olarak `false` (devre dışı). | Evet |
| `certFile` | Filtering Node'un, postanalytics modülüne SSL/TLS bağlantısı kurarken kendini kimlik doğrulaması için kullandığı istemci sertifikasının yolunu belirtir. | `mutualTLS.enabled` `true` ise Evet |
| `keyFile` | `certFile` ile sağlanan istemci sertifikasına karşılık gelen özel anahtarın yolunu belirtir. | `mutualTLS.enabled` `true` ise Evet |
| `caCertFile` | Postanalytics modülü tarafından sunulan TLS sertifikasını doğrulamak için kullanılan güvenilir Sertifika Yetkilisi (CA) sertifikasının yolunu belirtir. | Özel bir CA kullanılıyorsa Evet |
| `mutualTLS.enabled` | Hem Filtering Node hem de postanalytics modülünün birbirinin kimliğini sertifikalarla doğruladığı karşılıklı TLS'yi (mTLS) etkinleştirir. Varsayılan olarak `false` (devre dışı). | Hayır |
| `mutualTLS.clientCACertFile` | Filtering Node tarafından sunulan TLS sertifikasını doğrulamak için kullanılan güvenilir Sertifika Yetkilisi (CA) sertifikasının yolunu belirtir. | Özel bir CA kullanılıyorsa Evet |

### controller.wallarm.metrics.enabled

Bu anahtar, bilgi ve metrik toplamayı [açıp kapatır](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md). Kubernetes kümesinde [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) yüklüyse, ek bir yapılandırma gerekmez.

**Varsayılan değer**: `false`

### controller.wallarm.apiFirewall

[API Specification Enforcement](../api-specification-enforcement/overview.md) yapılandırmasını kontrol eder; 4.10 sürümünden itibaren kullanılabilir. Varsayılan olarak etkinleştirilmiştir ve aşağıda gösterildiği gibi yapılandırılmıştır. Bu özelliği kullanıyorsanız, bu değerleri değiştirmemeniz önerilir.

```yaml
controller:
  wallarm:
    apiFirewall:
      ### API Firewall işlevselliğini etkinleştir/devre dışı bırak (true|false)
      ###
      enabled: true
      readBufferSize: 8192
      writeBufferSize: 8192
      maxRequestBodySize: 4194304
      disableKeepalive: false
      maxConnectionsPerIp: 0
      maxRequestsPerConnection: 0
      config:
        mainPort: 18081
        healthPort: 18082
        specificationUpdatePeriod: 1m
        unknownParametersDetection: true
        #### TRACE|DEBUG|INFO|WARNING|ERROR
        logLevel: DEBUG
        ### TEXT|JSON
        logFormat: TEXT
      ...
```

Node 5.1.0 itibarıyla, aşağıdakiler sunulur (varsayılan değerler yukarıdaki örnekte gösterilmiştir):

| Ayar | Açıklama |
| ---- | -------- |
| `readBufferSize` | İstek okuma için bağlantı başına arabellek boyutu. Bu aynı zamanda maksimum header boyutunu sınırlar. İstemcileriniz çok KB'lık RequestURI'ler ve/veya çok KB'lık header'lar (örneğin, BÜYÜK çerezler) gönderiyorsa bu arabelleği artırın. |
| `writeBufferSize` | Yanıt yazımı için bağlantı başına arabellek boyutu. |
| `maxRequestBodySize` | Maksimum istek gövdesi boyutu. Sunucu, bu sınırı aşan gövdelere sahip istekleri reddeder. |
| `disableKeepalive` | Keep-alive bağlantılarını devre dışı bırakır. Bu seçenek `true` olarak ayarlanırsa, sunucu ilk yanıtı gönderdikten sonra tüm gelen bağlantıları kapatır. |
| `maxConnectionsPerIp` | IP başına izin verilen eşzamanlı istemci bağlantılarının maksimum sayısı. `0` = `sınırsız`. |
| `maxRequestsPerConnection` | Bağlantı başına hizmet verilen isteklerin maksimum sayısı. Sunucu son istekten sonra bağlantıyı kapatır. Son yanıta `Connection: close` header'ı eklenir. `0` = `sınırsız`. |

### controller.wallarm.apiFirewall.metrics

6.5.1 sürümünden itibaren, [API Specification Enforcement](../api-specification-enforcement/overview.md) modülü Prometheus uyumlu metrikleri sunabilir.

Etkinleştirildiğinde, metrikler varsayılan olarak `http://<host>:9010/metrics` adresinde kullanılabilir.

| Ayar | Açıklama |
| ---- | -------- |
| `enabled` | API Specification Enforcement modülü için Prometheus metriklerini etkinleştirir.<br>Varsayılan: `false` (devre dışı). |
| `port` | API Specification Enforcement modülünün metrikleri sunduğu portu tanımlar. Bu değeri değiştirirseniz, `controller.wallarm.apiFirewall.metrics.service.servicePort` değerini de güncelleyin.<br>Varsayılan: `9010`. |
| `endpointPath` | API Specification Enforcement metrik uç noktasının HTTP yolunu tanımlar.<br>Varsayılan: `metrics`. |
| `host` | Metrik sunucusunu bağlamak için IP adresi ve port.<br>Varsayılan: `:9010` (port 9010'da tüm arayüzler). |

```yaml
controller:
  wallarm:
    apiFirewall:
      metrics:
        enabled: false
        port: 9010
        endpointPath: /metrics
        host: ":9010"
        service:
          servicePort: 9010
```

### controller.wallarm.apiFirewall.metrics.serviceMonitor

Prometheus Operator kullanıyorsanız (örneğin, kube-prometheus-stack'in bir parçası olarak), [API Specification Enforcement metriklerini](#controllerwallarmapifirewallmetrics) scrape etmek için chart'ın otomatik olarak bir `ServiceMonitor` kaynağı oluşturmasını yapılandırabilirsiniz.

`serviceMonitor` yapılandırma seçenekleri 6.5.1 sürümünden itibaren mevcuttur.

Varsayılan değerlerle yapılandırma seçenekleri:

```yaml
controller:
  wallarm:
    apiFirewall:
      metrics:
        ...
        serviceMonitor:
          ## ServiceMonitor kaynağının oluşturulmasını etkinleştirir
          enabled: false
          ## Prometheus örneğiyle eşleşmek için kullanılan ekstra etiketler
          additionalLabels: {}
          # -- ServiceMonitor'a eklenecek açıklamalar (annotations)
          annotations: {}
          ## İş adını almak için kullanılacak etiket
          ## jobLabel: "app.kubernetes.io/name"
          namespace: ""
          namespaceSelector: {}
          ## Varsayılan: yalnızca .Release.Namespace veya namespaceOverride'ı scrape et
          ## Tüm ad alanlarını scrape etmek için aşağıdakini kullanın:
          ## namespaceSelector:
          ##   any: true
          scrapeInterval: 30s
          # honorLabels: true
          targetLabels: []
          relabelings: []
          metricRelabelings: []
```

### controller.wallarm.container_name.extraEnvs

Çözüm tarafından kullanılan Docker konteynerlerine iletilecek ekstra ortam değişkenleri. 4.10.6 sürümünden itibaren desteklenir.

Aşağıdaki örnek, `https_proxy` ve `no_proxy` değişkenlerinin Docker konteynerlerine nasıl geçirileceğini gösterir. Bu kurulum, giden HTTPS trafiğini belirlenmiş bir proxy üzerinden yönlendirir; yerel trafik ise onu atlar. Bu tür bir yapılandırma, Wallarm API'si ile olanlar gibi dış haberleşmelerin güvenlik nedeniyle bir proxy üzerinden geçirilmesi gereken ortamlarda önemlidir.

```yaml
controller:
  wallarm:
    apiHost: api.wallarm.com
    enabled: "true"
    token:  <API_TOKEN>
    init:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
```

### validation.enableCel

`Ingress` kaynaklarının [Doğrulayıcı Kabul Politikaları](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/) kullanılarak doğrulanmasını etkinleştirir.

Bu özellik için gereklidir:

* Kubernetes v1.30 veya üzeri
* Wallarm Helm chart sürümü 5.3.14+ (5.x serisi) veya 6.0.2+

`true` olarak ayarlandığında, Helm chart aşağıdakileri dağıtır:

* Tüm `Ingress` kaynakları (`networking.k8s.io/v1`) için CEL kurallarını tanımlayan `ValidatingAdmissionPolicy ingress-safety-net`
* Bu kuralları `cluster-wide` olarak `Deny` eylemiyle çalıştıran `ValidatingAdmissionPolicyBinding ingress-safety-net-binding`

Varsayılan kurallar, tipik olarak `nginx -t` ile tespit edilen yaygın yanlış yapılandırmaları yakalar:

* Joker ana bilgisayar adlarını yasaklama (ör. `*.example.com`)
* Bir Ingress içindeki tüm host değerlerinin benzersiz olmasını sağlama
* Her HTTP yolunun bir servis adı ve port içerdiğini doğrulama
* Tüm yolların `/` ile başlamasını gerektirme
* Yaygın boyut/zaman/boolean annotation formatlarını doğrulama (`proxy-buffer-size`, `proxy-read-timeout`, `ssl-redirect`)

Doğrulama, Ingress oluşturma veya güncelleme sırasında gerçekleşir ve yanlış yapılandırılmış kaynaklar reddedilir.

Bu mekanizma, [CVE-2025-1974](https://nvd.nist.gov/vuln/detail/CVE-2025-1974) nedeniyle şu anda [upstream NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx)'da devre dışı olan şablon testinin yerini alır.

**Varsayılan değer**: `false`

**Doğrulama kurallarını özelleştirme**

Varsayılan kural setini [Common Expression Language (CEL)](https://github.com/google/cel-spec) kullanarak genişletebilir veya değiştirebilirsiniz:

1. İstenen sürümün [Wallarm Helm chart'ını indirin](https://github.com/wallarm/helm-charts/tree/main/wallarm-ingress).
1. `templates/ingress-safety-vap.yaml` dosyasındaki kuralları değiştirin.
1. Chart'ı, [standart dağıtım talimatlarına](installation-kubernetes-en.md) göre değiştirilmiş dizinden dağıtın.

### validation.forbidDangerousAnnotations

Açıkça tehlikeli NGINX Ingress annotation'larını `server-snippet` ve `configuration-snippet` engelleyen ek bir CEL kuralını etkinleştirir.

Tüm snippet annotation'larına izin vermek saldırı yüzeyini genişletir: Ingress oluşturma veya güncelleme iznine sahip herhangi bir kullanıcı güvensiz veya kararsız davranışlar ekleyebilir.

Bu özellik için gereklidir:

* Kubernetes v1.30 veya üzeri
* Wallarm Helm chart sürümü 6.3.0+
* [`validation.enableCel`](#validationenablecel) `true` olarak ayarlanmış olmalı

!!! info "Node 6.2.0 ve öncesindeki davranış"
    Node 6.2.0 ve önceki sürümlerde, [`validation.enableCel`](#validationenablecel) `true` olduğunda açıkça tehlikeli `server-snippet` ve `configuration-snippet` varsayılan olarak engellenir.

**Varsayılan değer**: `false` (açıkça tehlikeli `server-snippet` ve `configuration-snippet` annotation'larının engellenmesi devre dışıdır)

## Global Controller Settings 

[ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/) aracılığıyla uygulanır.

Standart olanların yanı sıra, aşağıdaki ek parametreler desteklenir:

* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_wstore_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_wstore_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Ingress Annotation'ları

Bu annotation'lar, Ingress'in bireysel örneklerinin işlenmesine yönelik parametreleri ayarlamak için kullanılır.

[Standart olanlara ek olarak](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), aşağıdaki ek annotation'lar desteklenir:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode), varsayılan: `"off"`
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### Annotation'ı Ingress kaynağına uygulama

Ayarları Ingress'inize uygulamak için lütfen aşağıdaki komutu kullanın:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>`, Ingress'inizin adıdır
* `<YOUR_INGRESS_NAMESPACE>`, Ingress'inizin namespace'idir
* `<ANNOTATION_NAME>`, yukarıdaki listeden annotation adıdır
* `<VALUE>`, yukarıdaki listeden annotation değeridir

### Annotation örnekleri

#### Engelleme sayfası ve hata kodunun yapılandırılması

`nginx.ingress.kubernetes.io/wallarm-block-page` annotation'ı, aşağıdaki nedenlerle engellenen isteğe verilecek yanıtta döndürülen engelleme sayfasını ve hata kodunu yapılandırmak için kullanılır:

* İstek, şu türde kötü amaçlı yükler içerir: [girdi doğrulama saldırıları](../attacks-vulns-list.md#attack-types), [vpatch saldırıları](../user-guides/rules/vpatch-rule.md) veya [düzenli ifadelere dayalı olarak tespit edilen saldırılar](../user-guides/rules/regex-rule.md).
* Yukarıdaki listeden kötü amaçlı yükler içeren istek, [gri listeye alınmış IP adresinden](../user-guides/ip-lists/overview.md) gelmiştir ve node, istekleri güvenli engelleme [modunda](configure-wallarm-mode.md) filtreler.
* İstek, [yasaklı listede (denylist) olan IP adresinden](../user-guides/ip-lists/overview.md) gelmiştir.

Örneğin, herhangi bir engellenen isteğe verilecek yanıtta varsayılan Wallarm engelleme sayfasını ve 445 hata kodunu döndürmek için:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[Engelleme sayfası ve hata kodu yapılandırma yöntemleri hakkında daha fazla bilgi →](configuration-guides/configure-block-page-and-code.md)

#### libdetection modunu yönetme

!!! info "**libdetection** varsayılan modu"
    **libdetection** kütüphanesinin varsayılan modu `on` (etkin) değerindedir.

[**libdetection**](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) modunu aşağıdaki seçeneklerden biriyle kontrol edebilirsiniz:

* Aşağıdaki [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) annotation'ını Ingress kaynağına uygulayarak:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection off;"
    ```

    `wallarm_enable_libdetection` için kullanılabilir değerler `on`/`off`'tur.
* `controller.config.server-snippet` parametresini Helm chart'a geçirerek:

    === "Ingress controller kurulumu"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        Doğru Ingress controller kurulumu için [diğer parametreler](#additional-settings-for-helm-chart) de gereklidir. Lütfen bunları da `--set` seçeneğiyle iletin.
    === "Ingress controller parametrelerini güncelleme"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

    `wallarm_enable_libdetection` için kullanılabilir değerler `on`/`off`'tur.