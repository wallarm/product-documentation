# توسيع النطاق والتوفر العالي لـ Wallarm Sidecar

يهتم هذا الدليل بالتفاصيل الدقيقة للتوسيع والتوفر العالي (HA) ، وتخصيص النوابل مناسبا لـ[حل Wallarm Sidecar][sidecar-docs]. عن طريق تكوين هذه بشكل فعال ، يمكنك تحسين الثقة والأداء لـ Wallarm Sidecar ، مما يضمن وقت التوقف الأدنى ومعالجة الطلب بشكل فعال.

تتم تصنيف التكوين عادةً في قسمين:

* إعدادات مخصصة لطائرة تحكم Wallarm Sidecar
* إعدادات لحمل العمل التطبيقي مع القطعة المضافة

تعتمد التوسع والتوفرية العالية لـ Wallarm Sidecar على ممارسات Kubernetes القياسية. لفهم الأساسيات قبل تطبيق توصياتنا ، ضع في اعتبارك استكشاف هذه الروابط الموصى بها:

* [توسيع النطاق الأفقي لوحدة البود في Kubernetes (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [الكتل ذات الاستعمال العالي في Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [تحديد موارد وحدة المعالجة المركزية للحاويات والأقراص](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## توسيع طائرة تحكم Wallarm Sidecar

[حل Wallarm Sidecar يتألف من مكونين: متحكم وما بعد التحليل (Tarantool)][sidecar-arch-docs] . كل واحد يتطلب تكوينات توسعة فردية ، تتضمن معلمات Kubernetes مثل `replicas`، `requests`، و `podAntiAffinity`.

### المتحكم Controller

يعمل Sidecar Controller كـ webhook ذو القبول المتحول، حيث يدمج الحاويات الجانبية في Pod التطبيق. في معظم الحالات، ليس من الضروري توسعة HPA. بالنسبة للتوزيع عالي الاستعمال، فكر في الإعدادات التالية لملف `values.yaml`:

* استخدم أكثر من مثيل واحد للPod الجانبي. يمكن التحكم في هذا باستخدام السمة [`controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L877).
* اختيارياً ، ضبط [`controller.resources.requests.cpu` و`controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L1001) لضمان النوابل المحجوزة لـ Pod المتحكم.
* اختيارياً ، استخدم pod anti-affinity لتوزيع أقراص المتحكم عبر أقراص مختلفة لتقديم المرونة في حالة فشل العقدة.

فيما يلي مثال على القسم `controller` المُعدَّل في ملف `values.yaml` ، حيث يتم دمج هذه التوصيات:

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

### ما بعد التحليل (Tarantool)

المكون ما بعد التحليل يتعامل مع حركة المرور من جميع الحاويات الجانبية المُدمجة في حمل عمل تطبيقك. هذا الجزء لا يمكن توسعته بواسطة HPA.

بالنسبة للتوزيع العالي الاستعمال، يمكنك تعديل عدد التكرارات يدويًا باستخدام إعدادات الأتربة الآتية `values.yaml`:

* استخدم أكثر من مثيل واحد لـ Tarantool Pod. يمكن التحكم في هذا بواسطة السمة [`postanalytics.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L382).
* قم بتكوين [`postanalytics.tarantool.config.arena`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L610C7-L610C7) بالجيجابايت (GB) بناء على حجم حركة المرور المتوقعة إلى حمل العمل التطبيقي. يحدد هذا الإعداد الذاكرة القصوى التي سيستخدمها تارنتول. لإرشادات الحساب ، قد تكون مفيدة [نفس التوصيات الخاصة بنا لخيارات التوزيع الأخرى][tarantool-memory-recommendations].
* مراقبة [`postanalytics.tarantool.resources.limits`و`postanalytics.tarantool.resources.requests`](https://github.com/wallarm/sidecar/blob/4eb1a4c4f8d20989757c50c40e192eb7eb1f2169/helm/values.yaml#L639) مع تكوين `arena`. قم بتعيين `limits` على أو أعلى من قيمة `arena` للتعامل مع الطلب الذروة وتجنب الأعطال المرتبطة بالذاكرة. ضمان أن `requests` ترتقي أو تجاوز قيمة `arena` لأداء Tarantool المثالي. لمزيد من المعلومات، راجع [توثيق Kubernetes](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).
* اختيارياً ، قم بتعيين `resources.requests` و `resources.limits` لجميع الحاويات الأخرى ضمن قسم `postanalytics` لضمان التخصيص المُخصّص لموارد Tarantool Pod. تتضمن هذه الحاويات التالية: `postanalytics.init`، `postanalytics.cron`، `postanalytics.appstructure`، و`postanalytics.antibot`.
* اختيارياً ، قم بتنفيذ pod anti-affinity لتوزيع حاويات البود `postanalytics` في أقراص مختلفة لتوفير المرونة في حالة فشل العقدة.

فيما يلي مثال على القسم `postanalytics` المُعدَّل في ملف `values.yaml` ، حيث يتم دمج هذه التوصيات:

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
  cron:
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
  antibot:
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

## توسيع نطاق عبء العمل التطبيقي مع حاويات القطعة المضافة

عند استخدام التوسع الأفقي لـ Pod (HPA) لإدارة أوزان العمل التطبيقية ، من الضروري تكوين `resources.requests` لكل حاوية في Pod بما في ذلك تلك المدمجة بواسطة Wallarm Sidecar.

### متطلبات أساسية

لتطبيق [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) بنجاح لحاويات Wallarm ، تأكد من تحقيق هذه الشروط المسبقة:

* [خادم المقاييس](https://github.com/kubernetes-sigs/metrics-server#readme) مُكوّن ومُدرج في عقدة Kubernetes الخاصة بك.
* تم تكوين [`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) لجميع الحاويات في البود التطبيقي ، بما في ذلك الحاويات الابتدائية.

يجب تحديد توزيع موارد الحاوية التطبيقية في بيان الحاوية. بالنسبة للحاويات التي أدرجتها Wallarm ، يتم توضيح إعدادات الموارد أدناه ، مع إمكانية التخصيص على أساس [العالمي ولكل بود][sidecar-conf-area].

### التوزيع العالمي عبر قيم الرسم البياني Helm

| نمط توزيع الحاوية | اسم الحاوية        | قيمة الرسم البياني                                      |
|-------------------|-----------------------|--------------------------------------------------|
| [Split, Single][single-split-deployment]     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| Split             | sidecar-helper        | config.sidecar.containers.helper.resources       |
| Split, Single     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| Split             | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

مثال على قيم الرسم البياني لـ Helm لإدارة الموارد (الطلبات والحدود) على نطاق عالمي:

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

### تخصيص على أساس كل بود عبر توصيف البود

| نمط توزيع الحاوية | اسم الحاوية        | توصيف |
|-------------------|-----------------------|------------------------------------------------------------------------|
| [Single, Split][single-split-deployment]     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| Split             | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| Single, Split     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| Split             | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

مثال على التوصيفات لإدارة الموارد (الطلبات والحدود) على أساس كل بود (مع تمكين نمط الحاوية `single`):

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

## مثال

أدناه مثال لملف `values.yaml` للرسم البياني لـ Wallarm مع تطبيق الإعدادات المذكورة أعلاه. يفترض هذا المثال أن الموارد للحاويات المدمجة بواسطة Wallarm يتم تخصيصها على نطاق عالمي.

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
  cron:
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
  antibot:
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