# Wallarm eBPF Helm Chart'ının Wallarm'a Özgü Değerleri

Bu belge, eBPF çözümünün [dağıtımı](deployment.md) veya yükseltilmesi sırasında değiştirilebilen Wallarm'a özgü Helm chart değerleri hakkında bilgi sağlar. Bu değerler, Wallarm eBPF Helm chart'ının genel yapılandırmasını kontrol eder.

!!! warning "Sürüm 4.10 ile sınırlı"
    Wallarm eBPF tabanlı çözüm şu anda yalnızca [Wallarm Node 4.10](/4.10/installation/oob/ebpf/deployment/) içinde mevcut özellikleri destekler.

Değiştirmeniz gerekebilecek varsayılan `values.yaml` dosyasının Wallarm'a özgü kısmı aşağıdaki gibidir:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    port: 443
    useSSL: true
  mutualTLS: false
  agent:
    mirror:
      allNamespaces: false
      filters: []
      # - namespace: "default"
      # - namespace: 'my-namespace'
      #   pod_labels:
      #     label_name1: 'label_value_1'
      #     label_name2: 'label_value_2,label_value_3'
      #   pod_annotations:
      #      annotation_name1: 'annotation_value_1'
      #      annotation_name2: 'annotation_value_2,annotation_value_4'
    loadBalancerRealIPHeader: 'X-Real-IP'
    loadBalancerTrustedCIDRs: []
      # - 10.0.0.0/8
      # - 192.168.0.0/16
      # - 172.16.0.0/12
      # - 127.0.0.0/8
      # - fd00::/8
    ...
processing:
  ...
  metrics:
    enabled: false
    ...

  affinity: {}
  # podAntiAffinity:
  #   preferredDuringSchedulingIgnoredDuringExecution:
  #   - weight: 100
  #     podAffinityTerm:
  #       labelSelector:
  #         matchExpressions:
  #         - key: component
  #           operator: In
  #           values:
  #           - mtls-router
  #         - key: app
  #           operator: In
  #           values:
  #           - mtls-router
  #       topologyKey: kubernetes.io/hostname
  nodeSelector:
    kubernetes.io/os: linux
```

## config.api.token

Wallarm Console içinde [US](https://us1.my.wallarm.com/nodes) veya [EU](https://my.wallarm.com/nodes) Cloud'da oluşturulan Wallarm node token'ı. Wallarm API'ye erişim için gereklidir.

## config.api.host

Wallarm API uç noktası. Şunlardan biri olabilir:

* [ABD bulutu](../../../about-wallarm/overview.md#cloud) için `us1.api.wallarm.com`
* [AB bulutu](../../../about-wallarm/overview.md#cloud) için `api.wallarm.com` (varsayılan)

## config.api.port

Wallarm API uç noktası portu. Varsayılan olarak `443`.

## config.api.useSSL

Wallarm API'ye erişirken SSL kullanılıp kullanılmayacağını belirtir. Varsayılan olarak `true`.

## config.mutualTLS

[eBPF ajanından](deployment.md#how-it-works) gelen trafiğin güvenliğini doğrulamak için Wallarm işleme düğümünün mTLS desteğini etkinleştirir. Varsayılan olarak `false` (devre dışı).

Bu parametre Helm chart sürümü 0.10.26'dan itibaren desteklenir.

## config.agent.mirror.allNamespaces

Tüm namespace'ler için trafik yansıtmayı etkinleştirir. Varsayılan değer `false`'tur.

!!! warning "`true` olarak ayarlanması önerilmez"
    Bunu `true` yaparak etkinleştirmek veri çoğalmasına ve artan kaynak kullanımına neden olabilir. Namespace etiketleri, pod açıklamaları veya `values.yaml` içindeki `config.agent.mirror.filters` kullanarak [seçici yansıtmayı](selecting-packets.md) tercih edin.

## config.agent.mirror.filters

Trafik yansıtma düzeyini kontrol eder. `filters` parametresine bir örnek:

```yaml
...
  agent:
    mirror:
      allNamespaces: false
      filters:
        - namespace: "default"
        - namespace: 'my-namespace'
          pod_labels:
            label_name1: 'label_value_1'
            label_name2: 'label_value_2,label_value_3'
          pod_annotations:
            annotation_name1: 'annotation_value_1'
            annotation_name2: 'annotation_value_2,annotation_value_4'
```

[Daha fazla ayrıntı](selecting-packets.md)

## config.agent.loadBalancerRealIPHeader

Bir yük dengeleyicinin orijinal istemci IP adresini iletmek için kullandığı başlık adını belirtir. Doğru başlık adını belirlemek için yük dengeleyicinizin belgelerine bakın. Varsayılan olarak `X-Real-IP`.

`loadBalancerRealIPHeader` ve `loadBalancerTrustedCIDRs` parametreleri, trafik Kubernetes kümesi dışındaki bir L7 yük dengeleyici (örn. AWS ALB) üzerinden yönlendirildiğinde Wallarm eBPF'in kaynak IP'yi doğru şekilde belirlemesini sağlar.

## config.agent.loadBalancerTrustedCIDRs

Güvenilen L7 yük dengeleyiciler için CIDR aralıklarının bir listesini tanımlar. Örnek:

```yaml
config:
  agent:
    loadBalancerTrustedCIDRs:
      - 10.10.0.0/24
      - 192.168.0.0/16
```

Bu değerleri Helm kullanarak güncellemek için:

```
# Listeye tek bir öğe eklemek için:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24'

# Listeye birden fazla öğe eklemek için:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24,config.agent.loadBalancerTrustedCIDRs[1]=192.168.0.0/16'
```

## processing.metrics

Wallarm düğümünün [metrik hizmeti](../../../admin-en/configure-statistics-service.md) yapılandırmasını kontrol eder. Varsayılan olarak hizmet devre dışıdır.

Hizmeti etkinleştirirseniz, `port`, `path` ve `scrapeInterval` için varsayılan değerleri korumanız önerilir:

```yaml
processing:
  ...
  metrics:
    enabled: true
    port: 9090
    path: /metrics
    scrapeInterval: 30s
```

## processing.affinity ve processing.nodeSelector

Wallarm eBPF DaemonSet'inin hangi Kubernetes düğümlerine dağıtılacağını kontrol eder. Varsayılan olarak her düğüme dağıtılır.

## Değişiklikleri uygulama

`values.yaml` dosyasını değiştirir ve dağıtılmış chart'ınızı yükseltmek isterseniz, aşağıdaki komutu kullanın:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```