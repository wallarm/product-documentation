# نشر Wallarm Sidecar

لتأمين التطبيق المنشور كـ Pod في Kubernetes cluster، يمكنك تشغيل العقدة القائمة على NGINX لـ Wallarm أمام التطبيق كـ sidecar controller. سيقوم Wallarm sidecar controller بترشيح حركة الشبكة الواردة إلى Pod التطبيق عن طريق السماح فقط للطلبات المشروعة والتخفيف من الخبيثة.

**المزايا الرئيسية** لحل Wallarm Sidecar:

* يبسط حماية الميكرو سيرفيس المتفرقة ونسخها والشرائح عن طريق تقديم تنسيق النشر المشابه للتطبيقات
* متوافق بشكل كامل مع أي Ingress controller
* يعمل بثبات تحت الأحمال العالية التي تكون شائعة عادة لنهج service mesh
* يتطلب التكوين الأدنى للخدمة لتأمين تطبيقاتك؛ فقط أضف بعض التعليمات التوضيحية والتسميات لـ Pod التطبيق لحمايته
* يدعم وضعين لنشر الحاوية Wallarm: للأحمال المتوسطة مع خدمات Wallarm تعمل في حاوية واحدة وللأحمال العالية مع تقسيم خدمات Wallarm إلى عدة حاويات
* يقدم كيان مخصص لـ postanalytics module الذي هو خلفية تحليلات البيانات المحلية لحل Wallarm sidecar الذي يستهلك معظم الذاكرة

!!! info "إذا كنت تستخدم حل Wallarm Sidecar السابق"
    إذا كنت تستخدم الإصدار السابق من حل Wallarm Sidecar، نوصي بالانتقال إلى الإصدار الجديد. بالإصدار الجديد، قمنا بتحديث مجموعة حلولنا الفرعية للاستفادة من قدرات Kubernetes الجديدة وثروة من ردود العملاء. الحل الجديد لا يتطلب تغييرات كبيرة في Kubernetes manifest، لحماية التطبيق، فقط قم بنشر الرسم البياني وأضف التسميات والتعليمات التوضيحية إلى الجزء الرئيسي.

    للحصول على المساعدة في الانتقال إلى حل Wallarm Sidecar v2.0، يرجى الاتصال بـ [دعم فني Wallarm](mailto:support@wallarm.com).

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة][deployment-platform-docs]، يعتبر هذا الحل الأكثر توصية للحالات الاستخدام التالية:

* أنت تبحث عن حل الأمان ليتم نشره على البنية التحتية مع Ingress controller الموجودة بالفعل (مثلاً AWS ALB Ingress Controller) الذي يحول دون نشر [Wallarm NGINX-based][nginx-ing-controller-docs] أو [Wallarm Kong-based Ingress controller][kong-ing-controller-docs]
* بيئة الثقة الصفرية التي تتطلب أن تكون كل ميكرو سيرفيس (بما في ذلك واجهات البرمجة الداخلية) محمية بحل الأمان

## تدفق حركة الشبكة

تدفق حركة الشبكة مع Wallarm Sidecar:

![تدفق حركة الشبكة مع Wallarm Sidecar][traffic-flow-with-wallarm-sidecar-img]

## هندسة الحل

تم ترتيب حل Wallarm Sidecar بواسطة أوبجكتات Deployment التالية:

* **Sidecar controller** (`wallarm-sidecar-controller`) هو [mutating admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) الذي يحقن موارد Wallarm sidecar في Pod مع تكوينه على أساس قيم Helm chart وتعليمات التوضيح للغرفة والاتصال بـ Wallarm Cloud.

    في المرة التي يبدأ فيها Node جديد بـ `wallarm-sidecar: enabled` في Kubernetes، يقوم الكنترولر تلقائيًا بحقن حاوية إضافية ترشح حركة المرور الواردة إلى الغرفة.
* **Postanalytics module** (`wallarm-sidecar-postanalytics`) هو بيانات التحليلات المحلية لحل Wallarm sidecar. يستخدم الوحدة تخزين Tarantool في الذاكرة ومجموعة من الحاويات المساعدة (مثل collectd، خدمات تصدير الهجوم).

![اوبجكتات نشر Wallarm][sidecar-deployment-objects-img]

Wallarm Sidecar لديه 2 مراحل معيارية في دورة حياته:

1. في المرحلة **الأولية**، يقوم الكنترولر بحقن موارد Wallarm sidecar في Pod مع تكوينه بناءً على قيم Helm chart وتعليمات توضيح الغرفة والاتصال بـ Wallarm Cloud.
1. في مرحلة **التشغيل**، يحلل الحل ويقوم بتحويل طلبات تقديم الخدمات عن طريق تنفيذ postanalytics module.

## المتطلبات

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## النشر

لنشر حل Wallarm Sidecar:

1. قم بتوليد رمز العقدة المرشح.
1. اعمل على نشر رسم البياني Helm لـ Wallarm.
1. قم بارتباط Wallarm Sidecar بـ Pod التطبيق.
1. اختبر تشغيل Wallarm Sidecar.

### الخطوة 1: توليد رمز العقدة المرشح

قم بتوليد رمز العقدة المرشح من [النوع المناسب][node-token-types] لتوصيل الغرف المكملة إلى Wallarm Cloud:

=== "API token"
    1. افتح Wallarm Console → **الإعدادات** → **API tokens** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز API بدور المصدر `Deploy`.
    1. انسخ هذا الرمز.
=== "رمز العقدة"
    1. افتح Wallarm Console → **عقدة Nodes** في كل من [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [EU Cloud](https://my.wallarm.com/nodes).
    1. أنشئ عقدة مرشحة بنوع **Wallarm node** وانسخ الرمز المولد.
        
      ![إنشاء Wallarm node][create-wallarm-node-img]

### الخطوة 2: نشر الرسم البياني Helm لـ Wallarm

1. أضف [مستودع الرسم البياني Wallarm](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. أنشئ ملف `values.yaml` بـ [تهيئة Wallarm Sidecar](customization.md). المثال على الملف مع التهيئة الدنيا هو في الأسفل.

    عند استخدام رمز API، حدد اسم المجموعة في المعامل `nodeGroup`. ستتم تعيين عقدتك المنشأة للغرف المكملة إلى هذه المجموعة، والتي ستظهر في قسم **عقدة Nodes** في Wallarm Console. اسم المجموعة الافتراضي هو `defaultSidecarGroup`. إذا لزم الأمر، يمكنك تحديد أسماء مجموعات العقدة المرشحة بشكل فردي لـ pods التطبيقات التي يحمونها، باستخدام تعليمة التوضيح [`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group).

    === "US Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
              # nodeGroup: "defaultSidecarGroup"
        ```
    === "EU Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              # nodeGroup: "defaultSidecarGroup"
        ```    
    
    `<NODE_TOKEN>` هو رمز العقدة Wallarm المطلوب تشغيلها في Kubernetes.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. نشر الرسم البياني Helm لـ Wallarm:

    ``` bash
    helm install --version 4.8.1 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` هو الاسم لـ Helm release للرسم البياني Wallarm Sidecar
    * `wallarm-sidecar` هو المجال الاسمي الجديد لنشر Helm release مع الرسم البياني Wallarm Sidecar، يوصى بنشره في مجال اسمي منفصل
    * `<PATH_TO_VALUES>` هو وصلة الطريق إلى ملف `values.yaml`

### الخطوة 3: اربط Wallarm Sidecar بـ Pod التطبيق

لكي يرشح Wallarm حركة الشبكة للتطبيق، أضف التسمية `wallarm-sidecar: enabled` إلى Pod التطبيق المقابل:

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

* إذا تم تعيين تسمية `wallarm-sidecar` على Pod التطبيق إلى `disabled` أو لم يتم تحديدها بصورة صريحة، لن يتم حقن حاوية Wallarm Sidecar في الغرفة وبالتالي Wallarm لن يقوم بترشيح حركة الشبكة.
* إذا تم تعيين تسمية `wallarm-sidecar` على Pod التطبيق إلى `enabled`، سيتم حقن حاوية Wallarm Sidecar في الغرفة وبالتالي Wallarm سيقوم بترشيح الشبكة الواردة.

### الخطوة 4: اختبر تشغيل Wallarm Sidecar

لاختبار تشغيل Wallarm Sidecar بشكل صحيح:

1. احصل على تفاصيل Wallarm control plane للتأكد من نجاح بدايته:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    كل غرفة يجب أن تعرض التالي: **جاهز: N/N** و**حالة: تعمل**، على سبيل المثال:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```

1. احصل على تفاصيل الغرفة التطبيقية للتأكد من تم حقن Wallarm sidecar بنجاح:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    يجب أن يعرض الإخراج **جاهز: 2/2** يشير إلى حقن الحاوية الفرعية بنجاح و**حالة: تعمل** يشير إلى التوصيل الناجح إلى Wallarm Cloud:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. أرسل هجوم اختبار  [Path Traversal][ptrav-attack-docs] إلى عنوان التجمع تطبيق Wallarm مفعل لترشيح حركة الشبكة:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    بما أن Wallarm proxy يعمل في وضع الترشيح **مراقبة**  [filtration mode][filtration-mode-docs] افتراضياً، فإن Wallarm node لن يقوم بحجب الهجوم ولكن سيقوم بتسجيله.

    للتأكد من تسجيل الهجوم، توجه إلى Wallarm Console → **الهجمات**:

    ![الهجمات في الواجهة][attacks-in-ui-image]

## التخصيص

تم حقن الغرف المكملة Wallarm استنادًا إلى [القيم الافتراضية `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) والتكوين الخاص الذي حددته في الخطوة الثانية من النشر.

يمكنك تخصيص سلوك الخدمة الوكيلة Wallarm أكثر من ذلك على كلا من المستوى العالمي ومستوى الغرفة واحصل على الحد الأقصى من حل Wallarm لشركتك.

فقط توجه إلى [دليل تخصيص حل Wallarm proxy](customization.md).

## القيود

* [الكشف عن ضخ الشهادات][cred-stuffing-docs] غير مدعوم حالياً، باعتبار أن الرسم البياني Helm لم يتم تحديثه إلى الإصدار 4.10 بعد.