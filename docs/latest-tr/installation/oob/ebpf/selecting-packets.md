# Aynalama Kaynaklarını Seçme

[Wallarm eBPF solution](deployment.md) bir trafik aynası üzerinde çalışır ve trafik aynalama kapsamı üzerinde kontrol sağlar. Kubernetes namespace'leri, pod'ları ve konteynerleri kullanarak paket aynalama üretmenize olanak tanır. Bu rehber, seçim sürecinin nasıl yönetileceğini açıklar.

Paketlerin aynalanması için kullanılabilecek birkaç yöntem mevcuttur:

* Bir namespace'e ait tüm pod'ların trafiğini aynalamak için namespace'e `wallarm-mirror` etiketi uygulayın.
* Belirli bir pod'un trafiğini aynalamak için o pod'a `mirror.wallarm.com/enabled` açıklamasını uygulayın.
* Wallarm Helm chart'ının `values.yaml` dosyasındaki `config.agent.mirror.filters` ayarını yapılandırın. Bu yapılandırma, namespace, pod, konteyner veya node seviyelerinde aynalamayı etkinleştirmenizi sağlar.

## Etiket Kullanarak Bir Namespace için Aynalama

Namespace seviyesinde aynalamayı kontrol etmek için, istenen Kubernetes namespace'ine `wallarm-mirror` etiketini uygulayın ve değerini `enabled` veya `disabled` olarak ayarlayın, örneğin:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

## Açıklama Kullanarak Bir Pod için Aynalama

Pod seviyesinde aynalamayı kontrol etmek için, `mirror.wallarm.com/enabled` açıklamasını kullanın ve değerini `true` veya `false` olarak ayarlayın, örneğin:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

## `values.yaml` Kullanarak Bir Namespace, Pod, Konteyner veya Node için Aynalama

`values.yaml` dosyasındaki `config.agent.mirror.filters` bloğu, trafik aynalama seviyeleri üzerinde ince ayar yapmanızı sağlar. Bu yaklaşım, aşağıdaki varlıklar için aynalamayı kontrol etmenize olanak tanır:

* Namespace - `filters.namespace` parametresi kullanılarak
* Pod - Pod'un etiketlerini kullanarak `filters.pod_labels` veya pod'un açıklamalarını kullanarak `filters.pod_annotations`
* Node - `filters.node_name` parametresi kullanılarak
* Konteyner - `filters.container_name` parametresi kullanılarak

### Bir Namespace Seçme

Belirli bir namespace için trafik aynalamayı etkinleştirmek amacıyla, `filters.namespace` parametresinde adını belirtin. Örneğin, `my-namespace` Kubernetes namespace'i için trafik aynalamayı etkinleştirmek:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: 'my-namespace'
```

### Bir Pod Seçme

Bir pod'u, pod'un etiketleri ve açıklamalarıyla seçebilirsiniz. İşte nasıl:

=== "Etiket ile Pod Seçme"
    Belirli bir etikete sahip pod için trafik aynalamayı etkinleştirmek amacıyla, `pod_labels` parametresini kullanın.
    
    Örneğin, `environment: production` etiketine sahip bir pod için trafik aynalamayı etkinleştirmek:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
    ```

    Birden fazla etiket pod'u tanımlamak için gerekiyorsa, birkaç etiket belirtebilirsiniz. Örneğin, aşağıdaki yapılandırma, `environment: production AND (team: backend OR team: ops)` etiketlerine sahip pod'ların trafiğinin Wallarm eBPF tarafından aynalanıp analiz edilmesini sağlar:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
                team: 'backend,ops'
    ```
=== "Açıklama ile Pod Seçme"
    Belirli bir açıklamaya sahip pod için trafik aynalamayı etkinleştirmek amacıyla, `pod_annotations` parametresini kullanın.
    
    Örneğin, `app.kubernetes.io/name: myapp` açıklamasına sahip bir pod için trafik aynalamayı etkinleştirmek:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
    ```

    Pod'u tanımlamak için birden fazla açıklama gerekiyorsa, birkaç açıklama belirtebilirsiniz. Örneğin, aşağıdaki yapılandırma, şu açıklamalara sahip pod'ların trafiğinin Wallarm eBPF tarafından aynalanıp analiz edilmesini sağlar:
    
    ```
    app.kubernetes.io/name: myapp AND (app.kubernetes.io/instance: myapp-instance-main OR
    app.kubernetes.io/instance: myapp-instance-reserve)
    ```

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
                app.kubernetes.io/instance: 'myapp-instance-main,myapp-instance-reserve'
    ```

### Bir Node Seçme

Belirli bir Kubernetes node'u için trafik aynalamayı etkinleştirmek amacıyla, `filters.node_name` parametresinde node adını belirtin. Örneğin, `my-node` Kubernetes node'u için trafik aynalamayı etkinleştirmek:

```yaml
config:
  agent:
    mirror:
      filters:
        - node_name: 'my-node'
```

### Bir Konteyner Seçme

Belirli bir Kubernetes konteyneri için trafik aynalamayı etkinleştirmek amacıyla, `filters.container_name` parametresinde konteyner adını belirtin. Örneğin, `my-container` Kubernetes konteyneri için trafik aynalamayı etkinleştirmek:

```yaml
config:
  agent:
    mirror:
      filters:
        - container_name: 'my-container'
```

### Değişikliklerin Uygulanması

`values.yaml` dosyasını değiştirdiyseniz ve dağıtılmış chart'ınızı yükseltmek istiyorsanız, aşağıdaki komutu kullanın:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```

## Etiketler, Açıklamalar ve Filtreler Arasındaki Öncelikler

Birden fazla seçim yöntemi kullanıldığında ve üst seviyede aynalama etkinleştirildiğinde, daha alt yapılandırma seviyesi öncelik kazanır.

Eğer üst seviyede aynalama devre dışı bırakılırsa, alt ayarlar tamamen uygulanmaz, çünkü üst seviye trafik aynalamayı devre dışı bırakırken önceliklidir.

Aynı nesne farklı yollarla aynalama için seçilmişse (örneğin, Wallarm pod'unun açıklaması ile `values.yaml` filtre bloğu kullanılarak), Wallarm pod'unun açıklaması öncelik kazanır.

## Örnekler

Etiketler, açıklamalar ve filtreler, trafik aynalama ile analizi seviyesinin ayarlanmasında yüksek esneklik sağlar. Ancak, birbiriyle örtüşebilirler. İşte birlikte nasıl çalıştıklarını anlamanıza yardımcı olacak bazı yapılandırma örnekleri.

### `values.yaml` Dosyasında Çok Seviyeli Yapılandırma

Aşağıdaki `values.yaml` yapılandırmasını göz önünde bulundurun:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: "default"
        - namespace: 'my-namespace'
          pod_labels:
            environment: 'production'
            team: 'backend,ops'
          pod_annotations:
            app.kubernetes.io/name: 'myapp'
```

Belirlenen filtreler şu şekilde uygulanır:

```
namespace: default OR (namespace: my-namespace AND environment: production AND (team: backend
OR team: ops) AND app.kubernetes.io/name: myapp)
```

### Namespace Etiketleri, Pod Açıklamaları ve `values.yaml` Filtrelerinin Birleştirilmesi

| Yapılandırma | Sonuç |
| ------------- | ------ |
| <ul><li>`values.yaml` → `config.agent.mirror.allNamespaces` değeri `true` olarak ayarlanmışsa ve</li><li>Namespace etiketi `wallarm-mirror=disabled` ise</li></ul> | Namespace aynalanmaz |
| <ul><li>Namespace etiketi `wallarm-mirror=enabled` ise ve</li><li>Pod açıklaması `mirror.wallarm.com/enabled=false` ise</li></ul> | Pod aynalanmaz |
| <ul><li>Namespace etiketi `wallarm-mirror=disabled` ise ve</li><li>Pod açıklaması `mirror.wallarm.com/enabled=true`, veya trafik aynalamak için başka bir alt seviye ayarı seçilmişse</li></ul> | Pod aynalanmaz |
| <ul><li>Namespace etiketi `wallarm-mirror=disabled` ise ve</li><li>Aynı namespace `values.yaml` → `config.agent.mirror.filters` içinde seçilmişse</li></ul> | Namespace aynalanmaz |
| <ul><li>Pod açıklaması `mirror.wallarm.com/enabled=false` ise ve</li><li>Aynı pod `values.yaml` → `config.agent.mirror.filters` içinde seçilmişse</li></ul> | Pod aynalanmaz |