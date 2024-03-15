[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# NGINX-tabanlı Wallarm Ingress Denetleyicisinin İnce Ayarı

Wallarm Ingress denetleyicisi için mevcut ince ayarlama seçeneklerini öğrenin ve Wallarm çözümünden en iyi şekilde yararlanın.

!!! info "NGINX Ingress Denetleyicisi için resmi belgeleme"
    Wallarm Ingress Denetleyicisinin ince ayarı, [resmi belgelenme](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/) ile açıklanan NGINX Ingress Denetleyicisine oldukça benzer. Wallarm ile çalışırken, orijinal NGINX Ingress Denetleyicisini ayarlamak için tüm seçenekler mevcuttur.

## Helm Grafik için Ek Ayarlar

Ayarlar [`values.yaml`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml) dosyasında tanımlanır. Varsayılan olarak, dosya aşağıdaki gibi görünür:

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
    metrics:
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## List of IP addresses at which the stats-exporter service is available
        ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    synccloud:
      resources: {}
    collectd:
      resources: {}
```

Bu ayarı değiştirmek için, 'helm install'ın `--set` seçeneğini kullanmanızı öneririz (Ingress denetleyicisini yüklüyorsanız) veya 'helm upgrade' (yüklü Ingress denetleyicisi parametrelerini güncelliyorsanız). Örneğin:

=== "Ingress denetleyicisi kurulumu"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Ingress denetleyicisi parametrelerinin güncellenmesi"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

Aşağıda ayarlayabileceğiniz ana parametrelerin bir açıklaması verilmiştir. Diğer parametreler varsayılan değerlerle gelir ve nadiren değiştirilmesi gereklidir.

### controller.wallarm.enabled

Wallarm işlevlerini etkinleştirmenizi veya devre dışı bırakmanızı sağlar.

**Varsayılan değer**: `false`

### controller.wallarm.apiHost

Wallarm API uç noktası. Şunlar olabilir:

* [ABD bulutu](../about-wallarm/overview.md#us-cloud) için `us1.api.wallarm.com`.
* [AB bulutu](../about-wallarm/overview.md#eu-cloud) için `api.wallarm.com`.

**Varsayılan Değer**: `api.wallarm.com`

### controller.wallarm.token

Bir filtreleme düğümü belirteci değeri. Wallarm API'ye erişim için gereklidir.

Belirteç, bu [türlerden][node-token-types] biri olabilir:

* **API belirteci (önerilir)** - UI organizasyonu için dinamik olarak düğüm grupları eklemeyi/kaldırmayı veya ek güvenlik için belirteç yaşam döngüsünü kontrol etmek isterseniz idealdir. Bir API belirteci oluşturmak için:

    Bir API belirteci oluşturmak için:
    
    1. Wallarm Konsolu'na gidin → **Ayarlar** → **API belirtecileri** [ABD Bulutu](https://us1.my.wallarm.com/settings/api-tokens) veya [AB Bulutu](https://my.wallarm.com/settings/api-tokens).
    1. **Dağıt** kaynak rolü ile bir API belirteci oluşturun.
    1. Düğüm dağıtımı sırasında, oluşturulan belirteci kullanın ve `controller.wallarm.nodeGroup` parametresi ile grup adını belirtin. Farklı API belirtecileri kullanarak bir grupla birden çok düğüm ekleyebilirsiniz.
* **Düğüm belirteci** - Zaten hangi düğüm gruplarının kullanılacağını biliyorsanız uygundur.

    Bir düğüm belirteci oluşturmak için:
    
    1. Wallarm Konsolu'na gidin → **Düğümler** [ABD Bulutu](https://us1.my.wallarm.com/nodes) veya [AB Bulutu](https://my.wallarm.com/nodes).
    1. Bir düğüm oluşturun ve düğüm grubuna bir ad verin.
    1. Düğüm dağıtımı sırasında, her biri o gruba dahil etmek istediğiniz düğüm için grubun belirtecini kullanın.

Parametre [`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret) ise yoksayılır.

**Varsayılan değer**: `belirtilmemiş`

### controller.wallarm.nodeGroup

Helm grafik sürümü 4.6.8'den itibaren, yeni dağıtılan düğümleri eklemek istediğiniz filtreleme düğümlerinin grubunun adını belirtir. Bu şekilde düğüm gruplama, düğümleri **Dağıt** rolüyle Cloud'a oluşturup bağladığınızda mevcuttur (değer `controller.wallarm.token` parametresinde geçerlidir).

**Varsayılan değer**: `defaultIngressGroup`

### controller.wallarm.existingSecret

Helm grafik sürümü 4.4.1'den itibaren, bir Wallarm düğüm belirteci değerini Kubernetes sırlarından çekmek için bu yapılandırma bloğunu kullanabilirsiniz. Bu, ayrı sır yönetimi olan ortamlar için yararlıdır (ör. dış sırlar operatörü kullanıyorsunuz).

Düğüm belirtecini K8s sırlarında saklamak ve Helm grafiğine çekmek için:

1. Wallarm düğüm belirteci ile bir Kubernetes sırrı oluşturun:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>` Wallarm Ingress denetleyicisi ile oluşturduğunuz Helm sürümü için Kubernetes ad alanıdır
    * `wallarm-api-token` Kubernetes sırrı adıdır
    * `<WALLARM_NODE_TOKEN>` Wallarm Konsolu UI'dan kopyalanan Wallarm düğüm belirteci değeridir

    Bazı dış sır operatörü kullanıyorsanız, sır oluşturmak için [uygun belgelendirmeyi takip edin](https://external-secrets.io).
1. `values.yaml`'da aşağıdaki yapılandırmayı ayarlayın:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**Varsayılan değer**: `existingSecret.enabled: false`, bu Helm grafiğinin Wallarm düğüm belirtecini `controller.wallarm.token` dan alacağını belirtir.

### controller.wallarm.tarantool.replicaCount

Postanalytics için çalışan podların sayısı. Postanalytics, davranışa dayalı saldırı tespiti için kullanılır.

**Varsayılan değer**: `1`

### controller.wallarm.tarantool.arena

Postanalytics hizmeti için ayrılan bellek miktarını belirtir. Son 5-15 dakikalık talep verilerini saklamak için yeterli bir değer ayarlamanız önerilir.

**Varsayılan Değer**: `0.2`

### controller.wallarm.metrics.enabled

Bu anahtar, bilgi ve metrik toplamayı [açar/kapatır](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md). Kubernetes kümesinde [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) kurulu ise, ek yapılandırmaya gerek yoktur.

**Varsayılan Değer**: `false`

## Global Denetleyici Ayarları 

[ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/) aracılığıyla uygulanır.

Standart olanların yanı sıra, aşağıdaki ek parametreler desteklenmektedir:

* `enable-wallarm` - NGINX'teki Wallarm modülünü etkinleştirir
* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Ingress İşaretlemeleri

Bu işaretlemeler, bireysel Ingress örneklerini işlemek için parametreleri ayarlamak için kullanılır.

[Standartların dışında](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), aşağıdaki ek işaretlemeler desteklenmektedir:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode), varsayılan: kapalı
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### İşaretlemenin Ingress kaynağına uygulanması

Ayarları Ingress'inize uygulamak için lütfen aşağıdaki komutu kullanın:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` Ingress'inizin adıdır
* `<YOUR_INGRESS_NAMESPACE>` Ingress'inizin ad alanıdır
* `<ANNOTATION_NAME>` yukarıdaki listeden işaretlemenin adıdır
* `<VALUE>` yukarıdaki listeden işaretlemenin değeridir

### İşaretleme örnekleri

#### Engelleme sayfasının ve hata kodunun yapılandırılması

`nginx.ingress.kubernetes.io/wallarm-block-page` işaretleme, aşağıdaki nedenlerle engellenen talebe yanıt olarak döndürülen engelleme sayfasının ve hata kodunun yapılandırılması için kullanılır:

* Talep, aşağıdaki tipte kötücül yükler içerir: [giriş doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch saldırıları](../user-guides/rules/vpatch-rule.md), veya [düzenli ifadelere dayalı olarak tespit edilen saldırılar](../user-guides/rules/regex-rule.md).
* Yukarıda listelediğimiz kötücül yükleri içeren talep, düğümün talepleri güvenli engelleme [modunda](configure-wallarm-mode.md) filtrelediği [gri listeye eklenmiş IP adresinden](../user-guides/ip-lists/graylist.md) kaynaklandırılmıştır.
* Talep, [reddedilen IP adresinden](../user-guides/ip-lists/denylist.md) kaynaklandırılmıştır.

Örneğin, herhangi bir engellenen talebe yanıt olarak varsayılan Wallarm engelleme sayfasını ve 445 hata kodunu döndürmek için:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[Engelleme sayfası ve hata kodu yapılandırma metotları hakkında daha fazla ayrıntı →](configuration-guides/configure-block-page-and-code.md)

#### libdetection modunun yönetilmesi

!!! info "**libdetection** varsayılan modu"
    **libdetection** kütüphanesinin varsayılan modu 'açık' (etkindir).

[**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection) modunu aşağıdaki seçeneklerden biri kullanılarak kontrol edebilirsiniz:

* Aşağıdaki [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) işaretleme Ingress kaynağına uygulama:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection on/off;"
    ```
* Helm grafiğine `controller.config.server-snippet` parametresini geçirme:

    === "Ingress denetleyicisi kurulumu"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        Ayrıca, doğru Ingress denetleyicisi kurulumu için [diğer parametreler](#additional-settings-for-helm-chart) gerekir. Lütfen onları da `--set` seçeneğinde belirtin.
    === "Ingress denetleyicisi parametrelerinin güncellenmesi"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
