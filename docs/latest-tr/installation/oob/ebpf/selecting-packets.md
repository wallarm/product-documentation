# Yansıtma için Kaynakların Seçilmesi

[Wallarm eBPF çözümü](deployment.md) trafik yansısı üzerinde çalışır ve trafik yansısının kapsamı üzerinde kontrol sağlar. Kubernetes namespace, pod ve container bazında paket yansısı oluşturmanıza olanak tanır. Bu kılavuz, seçim sürecini nasıl yöneteceğinizi açıklar.

!!! warning "4.10 sürümü ile sınırlıdır"
    Wallarm eBPF tabanlı çözüm şu anda yalnızca [Wallarm Node 4.10](/4.10/installation/oob/ebpf/deployment/) içinde sunulan özellikleri desteklemektedir.

Paketleri yansıtma için seçmek amacıyla kullanılabilecek birkaç yöntem vardır:

* Belirli bir namespace içindeki pod'ların tüm trafiğini yansıtmak için ilgili namespace'e `wallarm-mirror` etiketini uygulayın.
* Belirli bir pod'un trafiğini yansıtmak için `mirror.wallarm.com/enabled` açıklamasını (annotation) uygulayın.
* Wallarm Helm chart'ının `values.yaml` dosyasındaki `config.agent.mirror.filters` ayarını yapılandırın. Bu yapılandırma ile yansıtmayı namespace, pod, container veya node seviyelerinde etkinleştirebilirsiniz.

## Etiket kullanarak bir namespace için yansıtma

Yansıtmayı namespace seviyesinde kontrol etmek için, hedef Kubernetes namespace'ine `wallarm-mirror` etiketini uygulayın ve değerini `enabled` veya `disabled` olarak ayarlayın, örn.:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

## Açıklama kullanarak bir pod için yansıtma

Yansıtmayı pod seviyesinde kontrol etmek için `mirror.wallarm.com/enabled` açıklamasını kullanın ve değerini `true` veya `false` olarak ayarlayın, örn.:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

## `values.yaml` kullanarak bir namespace, pod, container veya node için yansıtma

`values.yaml` dosyasındaki `config.agent.mirror.filters` bloğu, trafik yansıtma seviyeleri üzerinde ince ayar yapmanıza olanak sağlar. Bu yaklaşım aşağıdaki varlıklar için yansıtmayı kontrol etmenizi sağlar:

* Namespace - `filters.namespace` parametresi ile
* Pod - pod etiketleriyle `filters.pod_labels` veya pod açıklamalarıyla `filters.pod_annotations` parametresi ile
* Node - `filters.node_name` parametresi ile
* Container - `filters.container_name` parametresi ile

### Bir namespace seçme

Belirli bir namespace için trafik yansıtmayı etkinleştirmek için adını `filters.namespace` parametresinde belirtin. Örneğin, `my-namespace` Kubernetes namespace'i için trafik yansıtmayı etkinleştirmek üzere:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: 'my-namespace'
```

### Bir pod seçme

Trafik yansıtma için bir pod'u, pod'un etiketleri ve açıklamalarıyla seçebilirsiniz. Şöyle yapabilirsiniz:

=== "Pod'u etikete göre seçme"
    Belirli bir etikete sahip pod için trafik yansıtmayı etkinleştirmek üzere `pod_labels` parametresini kullanın.
    
    Örneğin, `environment: production` etiketine sahip bir pod için trafik yansıtmayı etkinleştirmek üzere:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
    ```

    Pod'u tanımlamak için birden fazla etiket gerekiyorsa, birkaç etiket belirtebilirsiniz. Örneğin, aşağıdaki yapılandırma, `environment: production AND (team: backend OR team: ops)` etiketlerine sahip pod'ların trafiğini Wallarm eBPF'in yansıtıp analiz etmesini sağlar:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
                team: 'backend,ops'
    ```
=== "Pod'u açıklamaya göre seçme"
    Belirli bir açıklamaya sahip pod için trafik yansıtmayı etkinleştirmek üzere `pod_annotations` parametresini kullanın.
    
    Örneğin, `app.kubernetes.io/name: myapp` açıklamasına sahip bir pod için trafik yansıtmayı etkinleştirmek üzere:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
    ```

    Pod'u tanımlamak için birden fazla açıklama gerekiyorsa, birkaç açıklama belirtebilirsiniz. Örneğin, aşağıdaki yapılandırma, şu açıklamalara sahip pod'ların trafiğini Wallarm eBPF'in yansıtıp analiz etmesini sağlar:
    
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

### Bir node seçme

Belirli bir Kubernetes node'u için trafik yansıtmayı etkinleştirmek üzere, node adını `filters.node_name` parametresinde belirtin. Örneğin, `my-node` Kubernetes node'u için trafik yansıtmayı etkinleştirmek üzere:

```yaml
config:
  agent:
    mirror:
      filters:
        - node_name: 'my-node'
```

### Bir container seçme

Belirli bir Kubernetes container'ı için trafik yansıtmayı etkinleştirmek üzere, container adını `filters.container_name` parametresinde belirtin. Örneğin, `my-container` Kubernetes container'ı için trafik yansıtmayı etkinleştirmek üzere:

```yaml
config:
  agent:
    mirror:
      filters:
        - container_name: 'my-container'
```

### Değişiklikleri uygulama

`values.yaml` dosyasını değiştirir ve dağıtılmış chart'ınızı yükseltmek (upgrade) isterseniz, aşağıdaki komutu kullanın:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```

## Etiketler, açıklamalar ve filtreler arasındaki öncelikler

Birden çok seçim yöntemi kullanıldığında ve yansıtma üst düzeyde etkinleştirildiğinde, daha düşük yapılandırma seviyesi önceliklidir.

Yansıtma üst düzeyde devre dışı bırakılırsa, üst düzeyin trafik yansıtmayı devre dışı bırakmada önceliği olduğundan, alt düzey ayarlar hiç uygulanmaz.

Aynı nesne farklı yollarla yansıtma için seçilirse (örn., Wallarm pod'unun açıklaması ve `values.yaml` içindeki filtreler bloğu kullanılarak), öncelik Wallarm pod'unun açıklamasındadır.

## Örnekler

Etiketler, açıklamalar ve filtreler, trafik yansıtma ve analiz seviyesini ayarlamada yüksek derecede esneklik sağlar. Ancak birbirleriyle çakışabilirler. Birlikte nasıl çalıştıklarını anlamanıza yardımcı olacak bazı yapılandırma örnekleri aşağıdadır.

### `values.yaml` içinde çok seviyeli yapılandırma

Şu `values.yaml` yapılandırmasını göz önünde bulundurun:

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

Ayarlanan filtreler şu şekilde uygulanır:

```
namespace: default OR (namespace: my-namespace AND environment: production AND (team: backend
OR team: ops) AND app.kubernetes.io/name: myapp)
```

### Namespace etiketlerini, pod açıklamalarını ve `values.yaml` filtrelerini karıştırma

| Yapılandırma | Sonuç |
| ------------- | ------ |
| <ul><li>`values.yaml` → `config.agent.mirror.allNamespaces` içindeki değer `true` olarak ayarlanır ve</li><li>Namespace etiketi `wallarm-mirror=disabled`</li></ul> | Namespace yansıtılmaz |
| <ul><li>Namespace etiketi `wallarm-mirror=enabled` ve</li><li>Pod açıklaması `mirror.wallarm.com/enabled=false`</li></ul> | Pod yansıtılmaz |
| <ul><li>Namespace etiketi `wallarm-mirror=disabled` ve</li><li>Pod açıklaması `mirror.wallarm.com/enabled=true` ya da trafik yansıtma için başka herhangi bir alt düzey ayar seçilmiştir</li></ul> | Pod yansıtılmaz |
| <ul><li>Namespace etiketi `wallarm-mirror=disabled` ve</li><li>Aynı namespace `values.yaml` → `config.agent.mirror.filters` içinde seçilmiştir</li></ul> | Namespace yansıtılmaz
| <ul><li>Pod açıklaması `mirror.wallarm.com/enabled=false` ve</li><li>Aynı pod `values.yaml` → `config.agent.mirror.filters` içinde seçilmiştir</li></ul> | Pod yansıtılmaz