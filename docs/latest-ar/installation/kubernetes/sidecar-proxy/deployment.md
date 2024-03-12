# نشر وحدة Wallarm الجانبية

لتأمين تطبيق مستضاف كوحدة Pod في مجموعة Kubernetes، يمكنك تشغيل وحدة النود NGINX-المبنية من Wallarm أمام التطبيق كمتحكم جانبي. سيقوم المتحكم الجانبي من Wallarm بتصفية حركة المرور الواردة إلى وحدة Pod الخاصة بالتطبيق بالسماح فقط بالطلبات المشروعة والتخفيف من تأثير الطلبات الخبيثة.

الميزات الأساسية لحل Wallarm الجانبي:

* يسهل حماية الخدمات المصغرة المتميزة ونسخها وشظاياها من خلال توفير شكل النشر الذي يشبه التطبيقات
* متوافق بالكامل مع أي متحكم Ingress
* يعمل بثبات تحت أحمال عالية وهو أمر شائع عادةً مع نهج شبكة الخدمة
* يتطلب الحد الأدنى من تكوين الخدمة لتأمين تطبيقاتك؛ فقط أضف بعض التعليقات التوضيحية والتصنيفات لوحدة Pod الخاصة بالتطبيق لحمايتها
* يدعم وضعين لنشر وحدة الخدمة من Wallarm: للأحمال المتوسطة مع تشغيل خدمات Wallarm في وعاء واحد وللأحمال العالية مع تقسيم خدمات Wallarm إلى عدة أوعية
* يوفر كيانًا مخصصًا لوحدة ما بعد التحليلات وهو الخلفية المحلية لتحليلات البيانات لحل Wallarm الجانبي الذي يستهلك معظم الذاكرة

!!! info "إذا كنت تستخدم حل Wallarm الجانبي السابق"
    إذا كنت تستخدم الإصدار السابق من حل Wallarm الجانبي، نوصيك بالانتقال إلى الإصدار الجديد. مع هذا الإصدار، قمنا بتحديث حل الجانبي لدينا للاستفادة من قدرات Kubernetes الجديدة وثروة من تعليقات العملاء. الحل الجديد لا يتطلب تغييرات جوهرية في وثائق Kubernetes، لحماية تطبيق، فقط قم بنشر المخطط وأضف التصنيفات والتعليقات التوضيحية إلى وحدة Pod.

    للحصول على مساعدة في الانتقال إلى حل Wallarm الجانبي الإصدار 2.0، يرجى الاتصال ب[دعم فني Wallarm](mailto:support@wallarm.com).

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm][deployment-platform-docs] المدعومة، هذا الحل هو الأوصى به للحالات التالية **حالات الاستخدام**:

* أنت تبحث عن حل الأمان ليتم نشره إلى البنية التحتية مع وجود متحكم Ingress موجود (مثل متحكم Ingress AWS ALB) يمنعك من نشر إما [متحكم Ingress المبني على Wallarm NGINX][nginx-ing-controller-docs] أو [متحكم Ingress المبني على Wallarm Kong][kong-ing-controller-docs]
* بيئة عدم الثقة التي تتطلب كل خدمة مصغرة (بما في ذلك واجهات برمجة التطبيقات الداخلية) أن تكون محمية بواسطة حل الأمان

## تدفق الحركة

تدفق الحركة مع وحدة Wallarm الجانبية:

![تدفق الحركة مع وحدة Wallarm الجانبية][traffic-flow-with-wallarm-sidecar-img]

## تركيبة الحل

يتم ترتيب حل وحدة Wallarm الجانبية من خلال الكائنات Deployment التالية:

* **متحكم الجانب** (`wallarm-sidecar-controller`) هو [خطاف القبول المتغير](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) الذي يضيف موارد وحدة Wallarm الجانبية في وحدة Pod معتمدًا على قيم المخطط والتعليقات التوضيحية لوحدة الPod وربط مكونات النود بسحابة Wallarm.

    بمجرد بدء وحدة Pod الجديدة مع تصنيف `wallarm-sidecar: enabled` في Kubernetes، يقوم المتحكم تلقائيًا بإضافة الوعاء الإضافي الذي يقوم بتصفية حركة المرور الواردة إلى وحدة Pod.
* **وحدة ما بعد التحليلات** (`wallarm-sidecar-postanalytics`) هي الخلفية المحلية لتحليلات البيانات لحل Wallarm الجانبي. تستخدم الوحدة التخزين في الذاكرة Tarantool ومجموعة من الحاويات المساعدة (مثل خدمات جمع البيانات، خدمات تصدير الهجمات).

![كائنات نشر Wallarm][sidecar-deployment-objects-img]

لحل وحدة Wallarm الجانبية مرحلتان قياسيتان في دورة حياتها:

1. في المرحلة **الأولية**، يضيف المتحكم وحدة Wallarm الجانبية إلى وحدة الPod معتمدًا على قيم المخطط والتعليقات التوضيحية لوحدة الPod وربط مكونات النود بسحابة Wallarm.
1. في مرحلة **التشغيل**، تقوم الحل بتحليل الطلبات والتوجيه/إعادة توجيهها بمشاركة وحدة ما بعد التحليلات.

## متطلبات

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## النشر

لنشر حل Wallarm الجانبي:

1. توليد رمز النود للتصفية.
1. نشر مخطط Wallarm Helm.
1. إلحاق وحدة Wallarm الجانبية بوحدة Pod الخاصة بالتطبيق.
1. اختبر عملية تشغيل وحدة Wallarm الجانبية.

### الخطوة 1: توليد رمز النود للتصفية

قم بتوليد رمز النود للتصفية من النوع [المناسب][node-token-types] لربط وحدات الجانب الجانبية بسحابة Wallarm:

=== "رمز الواجهة برمجية"
    1. افتح وحدة تحكم Wallarm → **الإعدادات** → **رموز الواجهة برمجية** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز واجهة برمجية بدور المصدر `Deploy`.
    1. انسخ هذا الرمز.
=== "رمز النود"
    1. افتح وحدة تحكم Wallarm → **Nodes** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. قم بإنشاء نود تصفية بنوع **نود Wallarm** وانسخ الرمز المولد.
        
      ![إنشاء نود Wallarm][create-wallarm-node-img]

### الخطوة 2: نشر مخطط Wallarm Helm

1. أضف [مستودع مخطط Wallarm](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. قم بإنشاء ملف `values.yaml` بتكوين وحدة Wallarm الجانبية (customization.md). مثال على الملف بأقل تكوين أدناه.

    عند استخدام رمز واجهة برمجية، حدد اسم مجموعة النود في متغير `nodeGroup`. سيتم تعيين النود التي تم إنشاؤها لوحدات الجانبية إلى هذه المجموعة، المعروضة في قسم **Nodes** في وحدة تحكم Wallarm. اسم المجموعة الافتراضي هو `defaultSidecarGroup`. إذا لزم الأمر، يمكنك في وقت لاحق تعيين أسماء مجموعات النود للتصفية بشكل فردي لوحدات الPods للتطبيقات التي يحميها، باستخدام التوضيح [`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group).

    === "السحابة الأمريكية"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
              # nodeGroup: "defaultSidecarGroup"
        ```
    === "السحابة الأوروبية"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              # nodeGroup: "defaultSidecarGroup"
        ```    
    
    `<NODE_TOKEN>` هو رمز النود Wallarm الذي سيتم تشغيله في Kubernetes.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. قم بنشر مخطط Wallarm Helm:

    ``` bash
    helm install --version 4.8.1 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` هو اسم الإصدار Helm لمخطط Wallarm الجانبي
    * `wallarm-sidecar` هو الفضاء الاسمي الجديد لنشر الإصدار Helm بمخطط Wallarm الجانبي، يُنصح بنشره في فضاء اسمي منفصل
    * `<PATH_TO_VALUES>` هو المسار إلى ملف `values.yaml`

### الخطوة 3: إلحاق وحدة Wallarm الجانبية بوحدة Pod الخاصة بالتطبيق

لتصفية حركة المرور تجاه التطبيق من Wallarm، أضف تصنيف `wallarm-sidecar: enabled` إلى وحدة Pod الخاصة بالتطبيق المناسب:

```bash
kubectl edit deployment -n <APPLICATION_NAMESPACE> <APP_LABEL_VALUE>
```

```yaml hl_lines="15"
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
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

* إذا تم تعيين تصنيف `wallarm-sidecar` لوحدة الPod إما إلى `disabled` أو لم يتم تحديده بشكل صريح، فلن يتم إدخال وعاء Wallarm الجانبي في وحدة Pod وبالتالي لن يتم تصفية حركة المرور من Wallarm.
* إذا تم تعيين تصنيف `wallarm-sidecar` لوحدة الPod إلى `enabled`، يتم إدخال وعاء Wallarm الجانبي في وحدة Pod وبالتالي يتم تصفية حركة المرور الواردة من Wallarm.

### الخطوة 4: اختبار تشغيل وحدة Wallarm الجانبية

للتحقق من أن وحدة Wallarm الجانبية تعمل بشكل صحيح:

1. احصل على تفاصيل طائرة التحكم Wallarm للتحقق من أنها قد تم بدء تشغيلها بنجاح:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    يجب أن يعرض كل وحدة Pod ما يلي: **READY: N/N** و **STATUS: Running**، على سبيل المثال:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. احصل على تفاصيل وحدة Pod الخاصة بالتطبيق للتحقق من إدخال وعاء Wallarm الجانبي بنجاح:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    يجب أن تعرض النتائج **READY: 2/2** تشير إلى الإدخال الناجح لوعاء الجانبي و **STATUS: Running** تشير إلى الاتصال الناجح بسحابة Wallarm:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    my