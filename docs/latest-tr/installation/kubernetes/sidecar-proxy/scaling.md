# Wallarm Sidecar Ölçeklendirme ve Yüksek Kullanılabilirlik

Bu rehber, [Wallarm Sidecar solution][sidecar-docs] için ölçeklendirme, Yüksek Kullanılabilirlik (HA) ve kaynakların doğru tahsisi konusundaki nüanslara odaklanmaktadır. Bu ayarları etkili bir şekilde yapılandırarak, Wallarm Sidecar'in güvenilirliğini ve performansını artırabilir, minimum kesinti süresi ve verimli istek işleme sağlayabilirsiniz.

Yapılandırma genel olarak iki bölüme ayrılır:

* Wallarm Sidecar kontrol düzlemi için ayrılmış ayarlar
* Enjekte edilmiş sidecar içeren uygulama iş yükü için ayarlar

Wallarm Sidecar'in ölçeklendirmesi ve yüksek kullanılabilirliği, standart Kubernetes uygulamalarına dayanmaktadır. Önerilerimizi uygulamaya geçmeden önce temelleri kavramak için aşağıdaki bağlantılara göz atabilirsiniz:

* [Kubernetes Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [Highly available clusters in Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [Assigning CPU resources to containers and pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## Wallarm Sidecar Kontrol Düzlemi Ölçeklendirmesi

Wallarm Sidecar çözümü, [controller ve postanalytics (Tarantool) olmak üzere iki bileşenden oluşmaktadır][sidecar-arch-docs]. Her biri, `replicas`, `requests` ve `podAntiAffinity` gibi Kubernetes parametrelerini içeren bireysel ölçeklendirme yapılandırmalarını gerektirir.

### Controller

Sidecar Controller, uygulamanın Pod'una sidecar konteynerler enjekte eden bir mutating admission webhook olarak işlev görür. Çoğu durumda HPA ölçeklendirmesi gerekli değildir. HA dağıtımı için, `values.yaml` dosyasındaki aşağıdaki ayarları göz önünde bulundurun:

* Birden fazla Sidecar Pod örneği kullanın. Bu, [`controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L877) özelliği ile kontrol edilir.
* Opsiyonel olarak, controller Pod'u için rezerve edilmiş kaynakları sağlamak amacıyla [`controller.resources.requests.cpu` ve `controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L1001) ayarlayın.
* Opsiyonel olarak, pod anti-affinity kullanarak controller pod'larını farklı nodelara dağıtın; böylece bir node arızası durumunda dayanıklılık sağlanır.

Aşağıda, bu önerilerin uygulandığı `values.yaml` dosyasındaki `controller` bölümüne dair bir örnek bulunmaktadır:

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
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 32Mi
```

### Postanalytics (Tarantool)

Postanalytics bileşeni, uygulama iş yükünüze enjekte edilen tüm sidecar konteynerlerinden gelen trafiği işler. Bu bileşen, HPA tarafından ölçeklendirilemez.

HA dağıtımı için, `values.yaml` dosyasındaki aşağıdaki ayarları kullanarak el ile replikaların sayısını ayarlayabilirsiniz:

* Birden fazla Tarantool Pod örneği kullanın. Bu, [`postanalytics.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L382) özelliği ile kontrol edilir.
* Beklenen uygulama iş yükündeki trafik hacmine bağlı olarak, Tarantool'un kullanacağı maksimum belleği belirleyen [`postanalytics.tarantool.config.arena`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L610C7-L610C7) ayarını gigabayt (GB) cinsinden yapılandırın. Hesaplama yönergeleri için [tarantool-memory-recommendations] önerilerimize bakabilirsiniz.
* Zirve talebini karşılamak ve bellekle ilgili çökme durumlarını önlemek için `arena` değeriyle uyumlu olacak şekilde [`postanalytics.tarantool.resources.limits` ve `postanalytics.tarantool.resources.requests`](https://github.com/wallarm/sidecar/blob/4eb1a4c4f8d20989757c50c40e192eb7eb1f2169/helm/values.yaml#L639) ayarlarını hizalayın. Tarantool'un optimal çalışması için `requests` değeri en az `arena` değerinde olmalıdır. Detaylı bilgi için [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) sayfasına bakın.
* Opsiyonel olarak, Tarantool Pod'u için özel kaynak tahsisi sağlamak amacıyla `postanalytics` bölümündeki diğer tüm konteynerler için `resources.requests` ve `resources.limits` ayarlarını yapın. Bu konteynerler `postanalytics.init`, `postanalytics.supervisord` ve `postanalytics.appstructure`'ü içerir.
* Opsiyonel olarak, bir node arızası durumunda dayanıklılık sağlamak için postanalytics pod'larını farklı nodelara dağıtmak üzere pod anti-affinity uygulayın.

Aşağıda, bu önerilerin uygulandığı `values.yaml` dosyasındaki `postanalytics` bölümüne dair bir örnek bulunmaktadır:

```yaml
postanalytics:
  replicaCount: 2
  tarantool:
    config:
      arena: "1.0"
    resources:
      limits:
        cpu: 500m
        memory: 1Gi
      requests:
        cpu: 100m
        memory: 1Gi
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

## Enjekte Edilmiş Sidecar Konteynerleri ile Uygulama İş Yükünün Ölçeklendirilmesi

Uygulama iş yüklerini yönetmek için Horizontal Pod Autoscaling (HPA) kullanırken, Wallarm Sidecar tarafından enjekte edilenler dahil olmak üzere Pod içindeki her konteyner için `resources.requests` ayarının yapılandırılması esastır.

### Önkoşullar

Wallarm konteynerleri için [HPA uygulamasını](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) başarıyla gerçekleştirebilmek için şu önkoşulların yerine getirildiğinden emin olun:

* Kubernetes kümenizde [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) dağıtılmış ve yapılandırılmış olmalıdır.
* Uygulama podundaki tüm konteynerler, init konteynerleri de dahil, için [`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) yapılandırılmış olmalıdır.

    Uygulama konteyneri için kaynak tahsisi manifest dosyasında belirtilmelidir. Wallarm tarafından enjekte edilen konteynerler için kaynak ayarları aşağıda belirtilmiştir; bu ayarlar hem [genel hem de pod başına] tahsis edilebilir [sidecar-conf-area].

### Helm Chart Değerleri ile Genel Tahsis

| Konteyner dağıtım deseni   | Konteyner adı         | Chart değeri                                      |
|----------------------------|-----------------------|--------------------------------------------------|
| [Split, Single][single-split-deployment] | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| Split                      | sidecar-helper        | config.sidecar.containers.helper.resources       |
| Split, Single              | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| Split                      | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

Konteynerler için kaynakların (requests & limits) genel yönetimine dair Helm chart değer örneği:

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

### Pod Düzeyinde Anotasyonlarla Tahsis

| Konteyner dağıtım deseni   | Konteyner adı         | Anotasyon                                                             |
|----------------------------|-----------------------|------------------------------------------------------------------------|
| [Single, Split][single-split-deployment] | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| Split                      | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}         |
| Single, Split              | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| Split                      | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

Pod başına kaynak tahsisini (requests & limits) yönetmek için anotasyon örneği (aktif olan `single` konteyner deseniyle):

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

Aşağıda, yukarıda açıklanan ayarların uygulandığı Wallarm Chart'ın `values.yaml` dosyası örneği verilmiştir. Bu örnek, Wallarm tarafından enjekte edilen konteynerler için kaynakların genel olarak tahsis edildiğini varsayar.

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
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 32Mi
postanalytics:
  replicaCount: 2
  tarantool:
    config:
      arena: "1.0"
    resources:
      limits:
        cpu: 500m
        memory: 1Gi
      requests:
        cpu: 100m
        memory: 1Gi
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