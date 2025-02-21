[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# NGINX Tabanlı Wallarm Ingress Controller İnce Ayarları

Wallarm çözümünden en iyi şekilde yararlanmak için kendi kendine barındırılan Wallarm Ingress Controller için mevcut ince ayar seçeneklerini öğrenin.

!!! info "NGINX Ingress Controller için Resmi Dokümantasyon"
    Wallarm Ingress Controller’ın ince ayarları, [resmi dokümantasyonda](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/) açıklanan NGINX Ingress Controller ile oldukça benzerdir. Wallarm ile çalışırken, orijinal NGINX Ingress Controller kurulumu için mevcut tüm seçenekler kullanılabilir.

## Helm Chart için Ek Ayarlar

Ayarlar, [`values.yaml`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml) dosyasında tanımlıdır. Varsayılan olarak, dosya aşağıdaki gibi görünür:

```
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
    tarantool:
      kind: Deployment
      service:
        annotations: {}
      replicaCount: 1
      arena: "1.0"
      livenessProbe:
        failureThreshold: 3
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    wallarm-appstructure:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    wallarm-antibot:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    metrics:
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## İstatistiklerin dışarı aktarımının sağlandığı IP adresleri listesi
        ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    addnode:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    cron:
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    collectd:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    apiFirewall:
      enabled: true
      config:
        ...
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
```

Bu ayarı değiştirmek için, Ingress controller kurulumu yapıyorsanız `helm install` veya zaten kurulmuş Ingress controller parametrelerini güncelliyorsanız `helm upgrade` komutundaki `--set` seçeneğini kullanmanızı öneririz. Örneğin:

=== "Ingress controller kurulumu"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Ingress controller parametrelerini güncelleme"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

Aşağıda, ayarlanabilecek ana parametrelerin açıklaması verilmiştir. Diğer parametreler varsayılan değerlerle gelir ve nadiren değiştirilir.

### controller.wallarm.enabled

Wallarm işlevlerini etkinleştirmenizi veya devre dışı bırakmanızı sağlar.

**Varsayılan değer**: `false`

### controller.wallarm.apiHost

Wallarm API uç noktası. Şu değerleri alabilir:

* [US cloud](../about-wallarm/overview.md#cloud) için `us1.api.wallarm.com`.
* [EU cloud](../about-wallarm/overview.md#cloud) için `api.wallarm.com`.

**Varsayılan değer**: `api.wallarm.com`

### controller.wallarm.token

Filtreleme node token değeridir. Wallarm API’ye erişim sağlamak için gereklidir.

Token, aşağıdaki [türlerden][node-token-types] biri olabilir:

* **API token (önerilen)** - UI organizasyonu için dinamik olarak node grupları ekleyip/çıkaracaksanız veya ek güvenlik için token yaşam döngüsünü kontrol etmek istiyorsanız idealdir. API token oluşturmak için:

    API token oluşturmak için:
    
    1. Wallarm Console → **Settings** → **API tokens** bölümüne gidin, [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden.
    1. **Deploy** kaynak rolü ile bir API token oluşturun.
    1. Node dağıtımı sırasında, oluşturulan tokenı kullanın ve `controller.wallarm.nodeGroup` parametresi ile grup adını belirtin. Farklı API tokenları kullanarak aynı gruba birden fazla node ekleyebilirsiniz.
* **Node token** - Kullanılacak node gruplarını zaten biliyorsanız uygundur.

    Node token oluşturmak için:
    
    1. Wallarm Console → **Nodes** bölümüne gidin, [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden.
    1. Bir node oluşturun ve node grubuna bir ad verin.
    1. Node dağıtımı sırasında, o gruptaki node’lar için grubun tokenını kullanın.

Parametre, [`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret) ayarı yapılmışsa göz ardı edilir.

**Varsayılan değer**: `not specified`

### controller.wallarm.nodeGroup

Helm chart’ın 4.6.8 sürümünden itibaren, bu ayar, yeni dağıtılan node’ların ekleneceği filtreleme node gruplarının adını belirtir. Bu şekilde node gruplandırması, yalnızca **Deploy** rolüne sahip bir API tokenı kullanılarak Cloud’a node oluşturup bağladığınızda kullanılabilir (değeri `controller.wallarm.token` parametresine aktarılır).

**Varsayılan değer**: `defaultIngressGroup`

### controller.wallarm.existingSecret

Helm chart’ın 4.4.1 sürümünden itibaren, bu yapılandırma bloğunu, Kubernetes secret’larından Wallarm node token değerini çekmek için kullanabilirsiniz. Ayrı secret yönetimi olan ortamlarda (örneğin, harici secrets operatörü kullanıyorsanız) faydalıdır.

Node token değerini K8s secret’larına kaydetmek ve Helm chart’a çekmek için:

1. Wallarm node token ile bir Kubernetes secret oluşturun:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>`, Wallarm Ingress controller için Helm release’ine oluşturduğunuz Kubernetes namespace’idir.
    * `wallarm-api-token`, Kubernetes secret adıdır.
    * `<WALLARM_NODE_TOKEN>`, Wallarm Console UI’dan kopyaladığınız Wallarm node token değeridir.

    Harici bir secret operatörü kullanıyorsanız, [ilgili dokümantasyona](https://external-secrets.io) başvurun.
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

**Varsayılan değer**: `existingSecret.enabled: false` – bu değer, Helm chart’ın `controller.wallarm.token` üzerinden Wallarm node tokenını almasını sağlar.

### controller.wallarm.tarantool.replicaCount

Postanalytics için çalışan pod sayısını belirtir. Postanalytics, davranışa dayalı saldırı tespiti için kullanılır.

**Varsayılan değer**: `1`

### controller.wallarm.tarantool.arena

Postanalytics servisi için ayrılan bellek miktarını belirler. Son 5-15 dakikalık istek verilerini depolayabilecek yeterli bir değer ayarlanması önerilir.

**Varsayılan değer**: `1.0`

### controller.wallarm.metrics.enabled

Bu anahtar, [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) Kubernetes kümesinde kuruluysa ek yapılandırma gerektirmeyen, bilgi ve metrik toplama işlemini [açıp kapatır](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md).

**Varsayılan değer**: `false`

### controller.wallarm.apifirewall

Sürüm 4.10’dan itibaren kullanılabilen [API Specification Enforcement](../api-specification-enforcement/overview.md) yapılandırmasını kontrol eder. Varsayılan olarak, aşağıda gösterildiği gibi etkinleştirilmiş ve yapılandırılmıştır. Bu özelliği kullanıyorsanız, bu değerleri değiştirmemeniz önerilir.

```yaml
controller:
  wallarm:
    apiFirewall:
      ### API Firewall işlevselliğini etkinleştirir veya devre dışı bırakır (true|false)
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

[node 5.1.0](../updating-migrating/node-artifact-versions.md#510-2024-11-06_1) sürümünden itibaren, aşağıdakiler sunulmaktadır (örnekteki varsayılan değerlere bakınız):

| Ayar | Açıklama |
| ------- | ----------- |
| `readBufferSize` | İstek okuma için bağlantı başına tampon boyutu. Bu, maksimum header boyutunu da sınırlar. İstemcileriniz çok KB büyüklüğünde RequestURI ve/veya çok KB header gönderiyorsa (örneğin, büyük cookie’ler) bu tamponu artırın. |
| `writeBufferSize` | Yanıt yazma için bağlantı başına tampon boyutu. |
| `maxRequestBodySize` | Maksimum istek gövdesi boyutu. Sunucu, bu limiti aşan gövdeye sahip istekleri reddeder. |
| `disableKeepalive` | Keep-alive bağlantılarını devre dışı bırakır. Bu seçenek `true` olarak ayarlanırsa, sunucu istemciye ilk yanıtı gönderdikten sonra tüm gelen bağlantıları kapatır. |
| `maxConnectionsPerIp` | IP başına izin verilen maksimum eş zamanlı istemci bağlantısı. `0` = `sınırsız`. |
| `maxRequestsPerConnection` | Bağlantı başına hizmet verilen maksimum istek sayısı. Son isteğin ardından sunucu bağlantıyı kapatır. Son yanıta `Connection: close` header’ı eklenir. `0` = `sınırsız`. |

### controller.wallarm.container_name.extraEnvs

Çözüm tarafından kullanılan Docker konteynerlerine geçirilecek ek ortam değişkenleri. Sürüm 4.10.6’dan itibaren desteklenmektedir.

Aşağıdaki örnekte, Docker konteynerlerine `https_proxy` ve `no_proxy` değişkenlerinin nasıl geçirileceği gösterilmiştir. Bu yapılandırma, dış HTTPS trafiğini belirlenmiş bir proxy üzerinden yönlendirirken, yerel trafiğin bypass edilmesini sağlar. Bu tür yapılandırma, Wallarm API gibi dış iletişimlerin güvenlik nedeniyle bir proxy üzerinden yapılması gereken ortamlarda önemlidir.

```yaml
controller:
  wallarm:
    apiHost: api.wallarm.com
    enabled: "true"
    token:  <API_TOKEN>
    addnode:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
    cron:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
        - name: no_proxy
          value: "localhost"
    collectd:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
        - name: no_proxy
          value: "localhost"
```

## Global Controller Ayarları

[ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/) aracılığıyla uygulanır.

Standart ayarların yanı sıra, aşağıdaki ek parametreler de desteklenir:

* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Ingress Anotasyonları

Bu anotasyonlar, Ingress’in bireysel örnekleri için parametrelerin ayarlanmasında kullanılır.

[Standart olanların dışında](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), aşağıdaki ek anotasyonlar desteklenir:

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

### Ingress Kaynağına Anotasyon Uygulama

Ayarları Ingress’e uygulamak için lütfen aşağıdaki komutu kullanın:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>`, Ingress’inizin adıdır.
* `<YOUR_INGRESS_NAMESPACE>`, Ingress’inizin bulunduğu namespace’dir.
* `<ANNOTATION_NAME>`, yukarıdaki listeden anotasyon adıdır.
* `<VALUE>`, yukarıdaki listeden anotasyon değeridir.

### Anotasyon Örnekleri

#### Engelleme Sayfası ve Hata Kodu Yapılandırması

`nginx.ingress.kubernetes.io/wallarm-block-page` anotasyonu, aşağıdaki nedenlerden dolayı istek engellendiğinde yanıtta döndürülecek engelleme sayfası ve hata kodunu yapılandırmak için kullanılır:

* İstek, şunlardan biri olan kötü amaçlı yükler içeriyorsa: [input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md) veya [düzenli ifadeye dayalı saldırılar](../user-guides/rules/regex-rule.md).
* Yukarıdaki listeden kötü amaçlı yük içeren istek, güvenli engelleme [mode](configure-wallarm-mode.md)'nda node tarafından filtrelenirken [graylisted IP adresinden](../user-guides/ip-lists/overview.md) geliyorsa.
* İstek, [denylisted IP adresinden](../user-guides/ip-lists/overview.md) geliyorsa.

Örneğin, herhangi bir engellenen isteğe yanıt olarak varsayılan Wallarm engelleme sayfasını ve 445 hata kodunu döndürmek için:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[Engelleme sayfası ve hata kodu yapılandırma yöntemleri hakkında daha fazla detay →](configuration-guides/configure-block-page-and-code.md)

#### libdetection Modunun Yönetimi

!!! info "**libdetection** varsayılan modu"
    **libdetection** kütüphanesinin varsayılan modu `on` (etkin)’dir.

[**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection) modunu aşağıdaki seçeneklerden biriyle kontrol edebilirsiniz:

* Ingress kaynağına aşağıdaki [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) anotasyonunu uygulayarak:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection off;"
    ```

    `wallarm_enable_libdetection` için mevcut değerler `on`/`off`’dur.
* Helm chart’a `controller.config.server-snippet` parametresini geçirerek:

    === "Ingress controller kurulumu"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        Doğru Ingress controller kurulumu için [diğer parametreler](#additional-settings-for-helm-chart) de gereklidir. Lütfen bunları da `--set` seçeneğinde belirtin.
    === "Ingress controller parametrelerini güncelleme"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

    `wallarm_enable_libdetection` için mevcut değerler `on`/`off`’dur.