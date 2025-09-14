# Wallarm Sidecar'ın Ölçeklendirilmesi ve Yüksek Erişilebilirliği

Bu kılavuz, [Wallarm Sidecar çözümünün][sidecar-docs] ölçeklendirilmesi, Yüksek Erişilebilirlik (HA) ve doğru kaynak tahsisi ayrıntılarına odaklanır. Bu ayarları etkili şekilde yapılandırarak Wallarm Sidecar’ın güvenilirliğini ve performansını artırabilir, minimum kesinti süresi ve verimli istek işleme sağlayabilirsiniz.

Yapılandırma genel olarak iki bölüme ayrılır:

* Wallarm Sidecar denetim düzlemi (control plane) için ayrılmış ayarlar
* Enjekte edilmiş sidecar ile uygulama iş yükü için ayarlar

Wallarm Sidecar’ın ölçeklendirilmesi ve yüksek erişilebilirliği standart Kubernetes uygulamalarına dayanır. Önerilerimizi uygulamadan önce temelleri kavramak için şu önerilen bağlantılara göz atmayı düşünebilirsiniz:

* [Kubernetes Yatay Pod Otomatik Ölçeklendirme (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [Kubernetes'te yüksek erişilebilir kümeler](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [Konteynerlere ve Pod'lara CPU kaynaklarının atanması](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## Wallarm Sidecar denetim düzleminin ölçeklendirilmesi

Wallarm Sidecar çözümü [iki bileşenden oluşur: controller ve postanalytics (wstore)][sidecar-arch-docs]. Her biri için ayrı ölçeklendirme yapılandırmaları gerekir; `replicas`, `requests` ve `podAntiAffinity` gibi Kubernetes parametrelerini içerir.

### Controller

Sidecar Controller, uygulamanın Pod’una sidecar konteynerleri enjekte eden mutating admission webhook olarak çalışır. Çoğu durumda, HPA ile ölçeklendirme gerekmez. HA dağıtımı için `values.yaml` dosyasındaki aşağıdaki ayarları göz önünde bulundurun:

* Sidecar Pod’undan birden fazla örnek kullanın. Bunu [`controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L867) özniteliği ile denetleyin.
* İsteğe bağlı olarak, denetleyici Pod’u için ayrılmış kaynakları sağlamak üzere [`controller.resources.requests.cpu` ve `controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L991) değerlerini belirleyin.
* İsteğe bağlı olarak, bir düğüm arızası durumunda dayanıklılık sağlamak için denetleyici Pod’larını farklı düğümlere dağıtmak amacıyla pod anti-affinity kullanın.

Aşağıda, bu önerileri içeren `values.yaml` dosyasındaki `controller` bölümünün ayarlanmış bir örneği verilmiştir:

```yaml
controller:
  replicaCount: 2
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - controller
          topologyKey: kubernetes.io/hostname
  resources:
    limits:
      cpu: 250m
      memory: 300Mi
    requests:
      cpu: 50m
      memory: 150Mi
```

### Postanalytics (wstore)

postanalytics bileşeni, uygulama iş yükünüze enjekte edilen tüm sidecar konteynerlerinden gelen trafiği işler. Bu bileşen HPA ile ölçeklenemez.

HA dağıtımı için, `values.yaml` dosyasındaki aşağıdaki ayarları kullanarak replika sayısını manuel olarak ayarlayabilirsiniz:

* postanalytics Pod’undan birden fazla örnek kullanın. Bunu [`postanalytics.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L447) özniteliğiyle denetleyin.
* Beklenen uygulama iş yükü trafik hacmine bağlı olarak [`postanalytics.wstore.config.arena`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L625) değerini gigabayt (GB) cinsinden yapılandırın. Bu ayar, wstore’un kullanacağı maksimum belleği belirler. Hesaplama yönergeleri için, [diğer dağıtım seçeneklerine yönelik aynı önerilerimizi][wstore-memory-recommendations] yararlı bulabilirsiniz.

    [NGINX Node 5.x and earlier][what-is-new-wstore] sürümlerinde, parametrenin adı `postanalytics.tarantool.config.arena` idi. Yükseltme sırasında yeniden adlandırma gereklidir.
* [`postanalytics.wstore.resources.limits` ve `postanalytics.wstore.resources.requests`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L654) değerlerini `arena` yapılandırmasıyla hizalayın. Zirve talebi karşılamak ve bellekle ilgili çöküşleri önlemek için `limits` değerini `arena` değerine eşit veya daha yüksek ayarlayın. wstore’un en iyi performansı için `requests` değerinin `arena` değerine eşit veya ondan büyük olduğundan emin olun. Daha fazla bilgi için [Kubernetes belgelerine](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) bakın.

    [NGINX Node 5.x and earlier][what-is-new-wstore] sürümlerinde, parametrelerin adı `postanalytics.tarantool.resources.limits` ve `postanalytics.tarantool.resources.requests` idi. Yükseltme sırasında yeniden adlandırma gereklidir.
* İsteğe bağlı olarak, postanalytics (wstore) Pod’u için ayrılmış kaynak tahsisi sağlamak amacıyla `postanalytics` bölümü içindeki diğer tüm konteynerler için de `resources.requests` ve `resources.limits` ayarlayın. Bu konteynerler `postanalytics.init`, `postanalytics.supervisord` ve `postanalytics.appstructure` içerir.
* İsteğe bağlı olarak, bir düğüm arızası durumunda dayanıklılık sağlamak için postanalytics Pod’larını farklı düğümlere dağıtmak amacıyla pod anti-affinity uygulayın.

Aşağıda, bu önerileri içeren `values.yaml` dosyasındaki `postanalytics` bölümünün ayarlanmış bir örneği verilmiştir:

```yaml
postanalytics:
  replicaCount: 2
  wstore:
    config:
      arena: "2.0"
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 500m
        memory: 2Gi
  init:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  supervisord:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  appstructure:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - postanalytics
          topologyKey: kubernetes.io/hostname
```

## Enjekte edilmiş sidecar konteynerleriyle uygulama iş yükünün ölçeklendirilmesi

Uygulama iş yüklerini yönetmek için Horizontal Pod Autoscaling (HPA) kullanırken, Wallarm Sidecar tarafından enjekte edilenler de dahil olmak üzere Pod’daki her konteyner için `resources.requests` yapılandırmak esastır.

### Önkoşullar

Wallarm konteynerleri için [HPA uygulamasını](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) başarıyla gerçekleştirmek üzere, aşağıdaki önkoşulların sağlandığından emin olun:

* Kubernetes kümenizde [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) dağıtılmış ve yapılandırılmış olmalıdır.
* Uygulama Pod’undaki init konteynerler dahil tüm konteynerler için [`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) yapılandırılmış olmalıdır.

    Uygulama konteyneri için kaynak tahsisi manifestinde belirtilmelidir. Wallarm tarafından enjekte edilen konteynerler için kaynak ayarları aşağıda özetlenmiştir; tahsis hem [genel düzeyde hem de Pod başına][sidecar-conf-area] yapılabilir.

### Helm chart değerleriyle genel tahsis

| Konteyner dağıtım deseni | Konteyner adı        | Chart değeri                                     |
|-------------------|-----------------------|--------------------------------------------------|
| [Split, Single][single-split-deployment]     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| Split             | sidecar-helper        | config.sidecar.containers.helper.resources       |
| Split, Single     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| Split             | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

Kaynakları (requests ve limits) genel olarak yönetmek için Helm chart değerleri örneği:

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

### Pod’un açıklamalarıyla (annotations) Pod başına tahsis

| Konteyner dağıtım deseni | Konteyner adı        | Açıklama                                                             |
|-------------------|-----------------------|------------------------------------------------------------------------|
| [Single, Split][single-split-deployment]     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| Split             | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| Single, Split     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| Split             | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

Pod başına kaynakları (requests ve limits) yönetmek için annotation örneği (`single` konteyner deseni etkin):

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

## Örnek

Aşağıda, yukarıda açıklanan ayarların uygulandığı Wallarm chart’ının `values.yaml` dosyası örneği bulunmaktadır. Bu örnek, Wallarm tarafından enjekte edilen konteynerler için kaynakların genel olarak tahsis edildiğini varsayar.

```yaml
controller:
  replicaCount: 2
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - controller
          topologyKey: kubernetes.io/hostname
  resources:
    limits:
      cpu: 250m
      memory: 300Mi
    requests:
      cpu: 50m
      memory: 150Mi
postanalytics:
  replicaCount: 2
  wstore:
    config:
      arena: "2.0"
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 500m
        memory: 2Gi
  init:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  supervisord:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  appstructure:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - postanalytics
          topologyKey: kubernetes.io/hostname
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