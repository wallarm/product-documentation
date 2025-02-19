# Wallarm'e Özgü Wallarm eBPF Helm Chart Değerleri

Bu doküman, [deployment](deployment.md) sırasında veya eBPF çözümü yükseltildiğinde değiştirilebilen Wallarm'e özgü Helm chart değerleri hakkında bilgi sağlar. Bu değerler, Wallarm eBPF Helm chart'ın genel yapılandırmasını kontrol eder.

Varsayılan `values.yaml` dosyasının, değiştirmeniz gerekebilecek Wallarm'e özgü kısmı aşağıdaki gibi görünmektedir:

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

Wallarm Console'da [US](https://us1.my.wallarm.com/nodes) veya [EU](https://my.wallarm.com/nodes) Cloud üzerinde oluşturulan Wallarm node token'ı. Wallarm API'ye erişmek için gereklidir.

## config.api.host

Wallarm API uç noktası. Aşağıdakilerden biri olabilir:

* [US cloud](../../../about-wallarm/overview.md#cloud) için `us1.api.wallarm.com`
* [EU cloud](../../../about-wallarm/overview.md#cloud) için `api.wallarm.com` (varsayılan)

## config.api.port

Wallarm API uç nokta portu. Varsayılan olarak `443`.

## config.api.useSSL

Wallarm API'ye erişimde SSL kullanılıp kullanılmayacağını belirtir. Varsayılan olarak `true`.

## config.mutualTLS

eBPF agent'ten gelen trafiğin güvenliğini Wallarm [processing node](deployment.md#how-it-works) tarafından doğrulatmaya yarayan mTLS desteğini etkinleştirir. Varsayılan olarak `false` (devre dışı).

Bu parametre, Helm chart sürüm 0.10.26'dan itibaren desteklenmektedir.

## config.agent.mirror.allNamespaces

Tüm namespace'ler için trafik yansımayı etkinleştirir. Varsayılan değer `false`.

!!! warning "true olarak ayarlanması önerilmez"
    Bu değerin `true` olarak ayarlanması, veri çoğaltmasına ve artan kaynak kullanımına neden olabilir. `values.yaml` içindeki namespace etiketleri, pod anotasyonları veya `config.agent.mirror.filters` kullanılarak yapılan [seçici yansıtma](selecting-packets.md) tercih edilmelidir.

## config.agent.mirror.filters

Trafik yansıtmanın seviyesini kontrol eder. İşte `filters` parametresine bir örnek:

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

[Detaylar için daha fazla bilgi](selecting-packets.md)

## config.agent.loadBalancerRealIPHeader

Bir load balancer'ın orijinal istemci IP adresini iletmek için kullandığı header adını belirtir. Doğru header adını belirlemek için load balancer dokümantasyonunuza bakınız. Varsayılan olarak `X-Real-IP`.

`loadBalancerRealIPHeader` ve `loadBalancerTrustedCIDRs` parametreleri, Wallarm eBPF'in Kubernetes kümesi dışındaki bir L7 load balancer (örneğin AWS ALB) üzerinden yönlendirilen trafiğin kaynak IP'sini doğru bir şekilde belirlemesini sağlar.

## config.agent.loadBalancerTrustedCIDRs

Güvenilir L7 load balancer'lar için CIDR aralıklarının beyaz listesini tanımlar. Örnek:

```yaml
config:
  agent:
    loadBalancerTrustedCIDRs:
      - 10.10.0.0/24
      - 192.168.0.0/16
```

Helm kullanarak bu değerleri güncellemek için:

```
# Listeye tek bir öğe eklemek için:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24'

# Listeye birden fazla öğe eklemek için:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24,config.agent.loadBalancerTrustedCIDRs[1]=192.168.0.0/16'
```

## processing.metrics

Wallarm node [metrics service](../../../admin-en/configure-statistics-service.md) yapılandırmasını kontrol eder. Varsayılan olarak, servis devre dışıdır.

Servisi etkinleştirirseniz, `port`, `path` ve `scrapeInterval` için varsayılan değerleri korumanız önerilir:

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

Wallarm eBPF daemonSet'in dağıtıldığı Kubernetes düğümlerini kontrol eder. Varsayılan olarak, her düğüme dağıtılır.

## Değişikliklerin Uygulanması

`values.yaml` dosyasında değişiklik yaptıysanız ve dağıtılmış chart'ınızı yükseltmek istiyorsanız, aşağıdaki komutu kullanınız:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```