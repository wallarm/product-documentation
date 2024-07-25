# نشر Kong Ingress Controller مع خدمات Wallarm المدمجة

لتأمين الواجهات البرمجية للتطبيقات (APIs) التي تديرها Kong API Gateway، يمكنك نشر Kong Ingress controller مع خدمات Wallarm المدمجة في تجمع Kubernetes. تتضمن الحلول وظائف Kong API Gateway الافتراضية مع طبقة لمعالجة حركة الشبكة الخبيثة في الوقت الحقيقي.

تتم نشر الحل من [رسم بياني Wallarm Helm](https://github.com/wallarm/kong-charts).

الميزات **الرئيسية** لـ Kong Ingress Controller مع خدمات Wallarm المدمجة:

* [اكتشاف وتخفيف الهجمات](attack-detection-docs) في الوقت الحقيقي
* [اكتشاف الثغرات الأمنية](vulnerability-detection-docs)
* [اكتشاف قائمة APIs](api-discovery-docs)
* خدمات Wallarm مدمجة بشكل أصلي في كل من الإصدارات المفتوحة المصدر و [Kong API Gateway](https://docs.konghq.com/gateway/latest/)
* يعتمد هذا الحل على [Kong Ingress Controller الرسمي لـ Kong API Gateway](https://docs.konghq.com/kubernetes-ingress-controller/latest/) الذي يقدم دعمًا كاملًا لميزات Kong API Gateway
* الدعم لـ Kong API Gateway 3.1.x (لكل من الإصدارات المفتوحة المصدر و)
* ضبط طبقة Wallarm عبر واجهة مستخدم Wallarm وعلى أساس إنجرس وفقًا للتعليقات البرمجية

    !!! تحذير "دعم التعليقات البرمجية"
        يتم دعم التعليقات البرمجية لـ Ingress فقط بواسطة الحل المعتمد على Kong Ingress Controller المفتوح المصدر. [القائمة المحددة للتعليقات البرمجية المدعومة](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* يوفر كيانًا مخصصًا لوحدة postanalytics التي تعتبر البيانات التحليلية الخلفية المحلية للحل والتي تستهلك معظم وحدة المعالجة المركزية (CPU)

## الاستخدام العملي

بين جميع [خيارات نشر Wallarm المدعومة](deployment-platform-docs)، يعتبر هذا الحل الأكثر توصية للحالات العملية التالية:

* لا يوجد Ingress controller وطبقة أمان توجيه حركة المرور إلى موارد Ingress التي يديرها Kong.
* أنت تستخدم إما Kong Ingress controller الرسمي المفتوح المصدر أو الإصدار التجاري وتبحث عن حل أمان متوافق مع مكدس التكنولوجيا الخاص بك.

    يمكنك أن تستبدل بسلاسة Kong Ingress Controller المنشور بواحد توضحه هذه التعليمات فقط عن طريق نقل التكوين الخاص بك إلى نشر جديد.

## بناء الحل

يتألف الحل من البنية التالية:

![بناء الحل][kong-ing-controller-scheme]

تعتمد الحل على Kong Ingress Controller الرسمي، ويتم وصف بنيته في [مستندات Kong الرسمية](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/)

تتم ترتيب Kong Ingress Controller مع خدمات Wallarm المدمجة عن طريق أشياء النشر التالية:

* **Ingress controller** (`wallarm-ingress-kong`) الذي يحقن Kong API Gateway وموارد Wallarm في تجمع K8s مع تهيئته بناءً على قيم الرسم البياني لـ Helm وربط مكونات العقدة بـ Wallarm Cloud.
* وحدة **Postanalytics** (`wallarm-ingress-kong-wallarm-tarantool`) هي الخلفية التحليلية للبيانات المحلية للحل. تستخدم الوحدة التخزين في الذاكرة Tarantool ومجموعة من بعض حاويات المساعدة (مثل collectd، خدمات التصدير الهجومية).

## القيود

الحل الموصوف لـ  Kong Ingress controller يسمح بضبط طبقة Wallarm فقط عبر واجهة مستخدم Wallarm.

ومع ذلك، تتطلب بعض ميزات منصة Wallarm تغيير ملفات التكوين وهي غير مدعومة في تنفيذ الحل  الحالي. يجعل الأمر الميزات التالية من Wallarm غير متاحة:

* [ميزة Multitenancy][multitenancy-overview]
* [تكوين التطبيق][applications-docs]
* [إعداد صفحة وكود الحظر المخصصة][custom-blocking-page-docs] - غير مدعومة من قبل كل من مراقبي الإنترنت  وOpen-Source Kong مع خدمات Wallarm
* [اكتشاف منع البيانات الاعتماد][cred-stuffing-detection] - غير مدعومة من قبل كل من مراقبي الإنترنت  وOpen-Source Kong مع خدمات Wallarm

أما بالنسبة لـ Open-Source Kong Ingress controller مع خدمات Wallarm، يدعم التعدد والتكوين التطبيقي على أساس إنجرس عبر [التعليقات البرمجية](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).

## المتطلبات

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## النشر

لنشر Kong Ingress Controller مع خدمات Wallarm المدمجة:

1. أنشئ العقدة Wallarm.
1. نشر رسم Wallarm Helm مع Kong Ingress Controller وخدمات Wallarm.
1. تمكين تحليل حركة المرور لـ Ingress.
1. اختبار Kong Ingress Controller مع خدمات Wallarm المدمجة.

### الخطوة 1: إنشاء العقدة Wallarm

1. افتح Wallarm Console → **Nodes** عبر الرابط أدناه:

    * https://us1.my.wallarm.com/nodes لـ US Cloud
    * https://my.wallarm.com/nodes لـ EU Cloud
1. أنشئ عقدة تصفية بنوع **عقدة Wallarm** وانسخ الرمز المميز المُنشَأ.

    ![إنشاء عقدة Wallarm][create-wallarm-node-img]

### الخطوة 2: نشر رسم Wallarm Helm

1. أضف [مستودع Wallarm chart](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. أنشئ الملف `values.yaml` ب[تكوين الحل](customization.md).

    مثال على الملف بالتكوين الأدنى لتشغيل **Open-Source** Kong Ingress controller مع خدمات Wallarm المدمجة:

    === "US Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: wallarm/kong-kubernetes-ingress-controller
        ```
    === "EU Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: wallarm/kong-kubernetes-ingress-controller
        ```  
        
    مثال على الملف بالتكوين الأدنى لتشغيل **** Kong Ingress controller مع خدمات Wallarm المدمجة:

    === "US Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG--LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        :
          enabled: true

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```
    === "EU Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG--LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        :
          enabled: true
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```  
    
    * `<NODE_TOKEN>` هو رمز العقدة Wallarm الذي نسخته من واجهة مستخدم Wallarm Console

        --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
    
    * `<KONG--LICENSE>` هو [ترخيص Kong ](https://github.com/Kong/charts/blob/master/charts/kong/README.md#kong--license)
1. نشر رسم Wallarm Helm:

    ``` bash
    helm install --version 4.6.3 <RELEASE_NAME> wallarm/kong -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` هو اسم الإصدار Helm لـ Kong Ingress Controller chart
    * `<KUBERNETES_NAMESPACE>` هو الفضاء الأسمي الجديد لنشر الإصدار Helm مع Kong Ingress Controller chart
    * `<PATH_TO_VALUES>` هو مسار الملف `values.yaml`

### الخطوة 3: تمكين تحليل حركة المرور لـ Ingress

إذا كان الحل المنشور يعتمد على Kong Ingress controller المفتوح المصدر، قم بتمكين تحليل حركة المرور لـ Ingress عن طريق تعيين وضع Wallarm إلى `monitoring`:

```bash
kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
```

حيث `<KONG_INGRESS_NAME>` هو اسم مورد Ingress في K8s توجه من خلاله API calls إلى microservices التي ترغب في حمايتها.

أما بالنسبة لـ  Kong Ingress controller، يتم تمكين تحليل حركة المرور في وضع المراقبة بشكل عام لجميع موارد Ingress بشكل افتراضي.

### الخطوة 4: اختبار Kong Ingress Controller مع خدمات Wallarm المدمجة

لاختبار Kong Ingress controller مع خدمات Wallarm المدمجة حيث يعمل بشكل صحيح:

1. احصل على تفاصيل العقدة Wallarm للتحقق من أنها قد بدأت بنجاح:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    يجب أن يعرض كل جسم التالي: **READY: N/N**و **STATUS: Running**، على سبيل المثال:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. أرسل هجمات اختبار [Path Traversal][ptrav-attack-docs] إلى Kong Ingress Controller Service:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    بما أن طبقة Wallarm تعمل في وضع **الترشيح** [المراقبة][available-filtration-modes-docs]، فإن عقدة Wallarm لن تحظر الهجوم ولكن ستقوم بتسجيله.

    للتحقق من أن الهجوم قد تم تسجيله، انتقل إلى Wallarm Console → **الهجمات**:

    ![الهجمات في الواجهة][attacks-in-ui-image]

## التخصيص

تم حقن وحدات Wallarm بناءً على [القيم الافتراضية لـ `values.yaml`](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml) والتكوين المخصص الذي حددته في الخطوة الثانية من النشر.

يمكنك تخصيص سلوك Kong API Gateway وكذا Wallarm أكثر والاستفادة القصوى من Wallarm لشركتك.

فقط انتقل إلى الدليل التالي [أدلةحلول تنظيم Kong Ingress Controller](customization.md).