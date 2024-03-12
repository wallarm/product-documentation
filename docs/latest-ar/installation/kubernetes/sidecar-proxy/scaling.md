# توسيع وتوافر عالٍ لـ Wallarm Sidecar

تتركز هذه الدليل على التفاصيل الدقيقة للتوسيع، والتوافر العالي (HA)، والتخصيص الصحيح لموارد [حل Wallarm Sidecar][sidecar-docs]. عن طريق تكوين هذه بفعالية، يمكنك تعزيز الموثوقية والأداء لـ Wallarm Sidecar، مع ضمان الحد الأدنى من الفترة التحت القائمة ومعالجة الطلبات بكفاءة.

يتم تصنيف التهيئة على نطاق واسع إلى قسمين:

* الإعدادات المخصصة للتحكم في خطة Wallarm Sidecar
* إعدادات لحمل العمل التطبيقي مع sidecar المثبت

تعتمد التوسيع والتوفر العالي لـ Wallarm Sidecar على ممارسات Kubernetes القياسية. لفهم الأساسيات قبل تطبيق توصياتنا، إذا فكرت في استكشاف هذه الروابط الموصى بها:

* [توسيع الوحدات الأفقية في Kubernetes (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [الكتل ذات التوافر العالي في Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [تعيين موارد وحدة المعالجة المركزية (CPU) للحاويات والوحدات](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## التوسع في خطة التحكم Wallarm Sidecar

حل Wallarm Sidecar [يتألف من مكونين: وحدة تحكم وتحليل ما بعد (Tarantool)][sidecar-arch-docs]. يتطلب كل منهما تكوينات توسع فردية، تتضمن معلمات Kubernetes مثل `replicas`، `requests`، و`podAntiAffinity`.

### وحدة التحكم

تعمل وحدة التحكم Sidecar كخطاف قبول تحويل، حيث تقوم بحقن حاويات  sidecar في وحدة التطبيق. في معظم الحالات، لا يلزم توسيع HPA. لنشر التوافر العالي، فكر في الإعدادات التالية لملف `values.yaml`:

* استخدم أكثر من نموذج واحد من وحدة sidecar. يمكن التحكم في هذا من خلال سمة [`controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L877).
* اختياريا، قم بتعيين [`controller.resources.requests.cpu` و `controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L1001) لضمان الاحتفاظ بالموارد لوحدة التحكم في وحدة Pod.
* اختياريا، استخدم القلة التكافؤية لتوزيع pods الوحدة التحكم عبر العقد المختلفة لتوفير المرونة في حالة فشل العقدة.

فيما يلي مثال على القسم `controller` المعدل في ملف `values.yaml`، والذي يتضمن هذه التوصيات:

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

### تحليل ما بعد (Tarantool)

يتعامل مكون postanalytics مع حركة مرور جميع حاويات sidecar المثبتة في حمل العمل التطبيقي ، لا يمكن توسيع هذا المكون عن طريق HPA.

لشركة التوافر العالي، يمكنك ضبط عدد النسخ يدويا باستخدام الإعدادات الآتية في ملف `values.yaml`:

* استخدم أكثر من نموذج واحد لوحدة الترانتول. يمكن التحكم في هذا من خلال سمة [`postanalytics.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L382).
* قم بتكوين [`postanalytics.tarantool.config.arena`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L610C7-L610C7) بالجيجابايتات (GB) بناء على حجم حركة المرور المتوقعة للتطبيق العمل. هذا الإعداد يحدد الذاكرة القصوى التي سيراعيها تراتنول. للحصول على إرشادات الحساب، قد تجد السامي لتوصياتنا لخيارات النشر الأخرى مفيدة [نفس توصياتنا لخيارات النشر الأخرى][tarantool-memory-recommendations].
* محاذاة [`postanalytics.tarantool.resources.limits` و `postanalytics.tarantool.resources.requests`](https://github.com/wallarm/sidecar/blob/4eb1a4c4f8d20989757c50c40e192eb7eb1f2169/helm/values.yaml#L639) مع configuration الأرينا. ضع الحدود في أو أعلى من قيمة الأرينا للتعامل مع الطلب الذروة وتجنب تعطل الذاكرة. ضمان طلبات الوفاء أو تجاوز قيمة الأرينا للأداء المثالي لـ Tarantool. للحصول على معلومات أكثر، راجع [توثيق كوبرنيتس](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).
* اختياريا، قم بتعيين `resources.requests` و `resources.limits` لجميع الحاويات الأخرى في قسم `postanalytics` لضمان التخصيص المخصص للموارد لبود Tarantool. تشمل هذه الحاويات `postanalytics.init`، `postanalytics.cron`, `postanalytics.appstructure`, و `postanalytics.antibot`.
* اختياريا، تنفيذ عدم التكافؤ ضد pod لتوزيع pods postanalytics عبر العقد المختلفة لتوفير المرونة في حالة فشل العقدة.

فيما يلي مثال على القسم `postanalytics` المعدل في ملف `values.yaml`، والذي يتضمن هذه التوصيات:

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

## توسيع حمل العمل التطبيقي مع الحاويات sidecar المثبتة

عند استخدام توسيع الوحدات الأفقية (HPA) لإدارة حمل العمل التطبيقي، من الضروري تكوين `resources.requests` لكل حاوية في الوحدة بما في ذلك تلك التي يتم حقنها بواسطة Wallarm Sidecar.

### الاحتياجات الأساسية

لإنشاء [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) بنجاح على الوحدات الحاويات Wallarm، تأكد من تلبية هذه الاحتياجات الأساسية:

* [خادم المقاييس](https://github.com/kubernetes-sigs/metrics-server#readme) مُعد ومهيأ في تجمع Kubernetes الخاص بك.
* [`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) مكونة لجميع الواحدات في وحدة التطبيق، بما في ذلك وحدات البداية التهيئة.

    يجب تحديد تخصيص الموارد لوحدة التطبيق في ظهورها. بالنسبة لحاويات التي تم حقنها بواسطة Wallarm، يتم توضيح إعدادات الواحدات أدناه، مع إمكانية التخصيص سواء [على أساس عام أو لكل وحدة][sidecar-conf-area].

### التخصيص العام عبر قيم الرسم البياني Helm

| نمط نشر الوحدة | اسم الوحدة        | قيمة الرسم البياني                                         |
|-------------------|-----------------------|--------------------------------------------------|
| [الانقسام، الفردي][single-split-deployment]     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| انقسام             | sidecar-helper        | config.sidecar.containers.helper.resources       |
| الانقسام، الفردي     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| انقسام             | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

مثال على قيم الرسم البياني لحلم لإدارة الموارد (الطلبات والحدود) على أساس عام:

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

### التخصيص لكل وحدة عبر توضيحات الوحدة

| نمط نشر الوحدة | اسم الوحدة        | التوضيح                                                             |
|-------------------|-----------------------|------------------------------------------------------------------------|
| [الفردي، الانقسام][single-split-deployment]     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| انقسام             | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| الفردي، الانقسام     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| انقسام             | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

مثال على توضيحات لإدارة الموارد (الطلبات والحدود) على أساس لكل وحدة (مع تمكين نمط الوحدة `فردي`):

```yaml hl_lines="16-24"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: تطبيقي
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: تطبيقي
  template:
    metadata:
      labels:
        app: تطبيقي
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

في الأسفل هو مثال على ملف`values.yaml` للرسم البياني Wallarm بالإعدادات المذكورة أعلاه المطبقة. يفترض هذا المثال أن الموارد للحاويات التي تم ضخها من قبل Wallarm يتم نسبتها على أساس عالمي.

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