# تنصيب Kong Ingress Controller ب Wallarm Services مدموج

لتأمين واجهات برمجة التطبيقات التي يديرها Kong API Gateway، يمكن تنصيب Kong Ingress controller مع خدمات Wallarm والذي يتم دمجهما في نظام كوبرنيتس. الحل يشمل وظائف Kong API Gateway الافتراضية مع طبقة معاكسة للهجمات الخبيثة في الزمن الحقيقي.

يتم نشر الحل من خلال [Wallarm Helm chart](https://github.com/wallarm/kong-charts).

**الميزات الرئيسية** ل Kong Ingress Controller مع خدمات Wallarm المدمجة:

* الكشف عن الهجمات والمعاكسة في الزمن الحقيقي
* الكشف عن الثغرات الأمنية
* اكتشاف مخزون API
* خدمات Wallarm مدمجة بشكل أصيل في كل من إصدارات [Kong API Gateway](https://docs.konghq.com/gateway/latest/) المصدر المفتوح والمؤسسي
* هذا الحل مبني على [Kong Ingress Controller الرسمي لـ Kong API Gateway](https://docs.konghq.com/kubernetes-ingress-controller/latest/) الذي يوفر دعمًا كاملاً لمميزات Kong API Gateway
* دعم لـ Kong API Gateway 3.1.x (لكلٍ من الإصدارات المصدر المفتوح والمؤسسي)
* ضبط دقيق لطبقة Wallarm عن طريق واجهة مستخدم Wallarm Console وعلى أساس كل Ingress عبر التعليقات التوضيحية

    !!! تحذير "دعم التعليقات التوضيحية"
        التعليقات التوضيحية لـ Ingress مدعومة فقط بالحل المبني على Kong Ingress controller المصدر المفتوح. [قائمة التعليقات التوضيحية المدعومة محدودة](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* يوفر كيانًا مخصصًا لوحدة postanalytics التي تعتبر خلفية تحليل البيانات المحلية للحل المستهلكة لمعظم وحدة المعالجة المركزية

## حالات الاستخدام

من بين جميع خيارات نشر Wallarm المدعومة، يُوصى بهذا الحل للحالات **الاستخدام التالية**:

* لا يوجد Ingress controller وطبقة أمنية توجه حركة المرور إلى موارد Ingress التي يديرها Kong.
* أنت تستخدم إما Kong Ingress controller الرسمي المصدر المفتوح أو المؤسسي وتبحث عن حل أمني متوافق مع تراكيب التكنولوجيا الخاصة بك.

    يمكنك استبدال Kong Ingress Controller المنشور بسلاسة بالذي تصفه هذه التعليمات فقط بنقل التهيئة الخاصة بك إلى نشر جديد.

## هندسة الحل

الحل يتبع الهندسة التالية:

![هندسة الحل][kong-ing-controller-scheme]

الحل مبني على Kong Ingress Controller الرسمي، ويتم وصف هندسته في [الوثائق الرسمية لـ Kong](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/).

Kong Ingress Controller مع خدمات Wallarm المدمجة يتم ترتيبها بواسطة أشياء نشر التالية:

* **Ingress controller** (`wallarm-ingress-kong`) الذي يحقن Kong API Gateway وموارد Wallarm في مجموعة كوبرنيتس معتمدًا على قيم مخطط Helm وربط مكونات العقدة ب Wallarm Cloud.
* وحدة **Postanalytics** (`wallarm-ingress-kong-wallarm-tarantool`) تعتبر مركز تحليل البيانات المحلي للحل. تستخدم الوحدة التخزين في الذاكرة Tarantool ومجموعة من الحاويات المساعدة (مثل الخدمات collectd، attack export).

## القيود

الحل الموصوف لـ Enterprise Kong Ingress controller يسمح بضبط طبقة Wallarm بدقة عبر واجهة المستخدم Wallarm Console فقط.

ومع ذلك، بعض ميزات منصة Wallarm تتطلب تغيير ملفات التكوين والتي غير مدعومة في تنفيذ الحل المؤسسي الحالي. هذا يجعل الميزات التالية لـ Wallarm غير متاحة:

* [الميزة المتعددة التنظيم][multitenancy-overview]
* [تكوين التطبيق][applications-docs]
* [إعداد صفحة وكود الحجب المخصص][custom-blocking-page-docs] - غير مدعومة من قبل كل من Kong Ingress controllers مع خدمات Wallarm لكل من المصدر المفتوح والمؤسسي
* [الكشف عن الحشو الاعتمادي][cred-stuffing-detection] - غير مدعومة من قبل كل من Kong Ingress controllers مع خدمات Wallarm لكل من المصدر المفتوح والمؤسسي

بالنسبة لـ Open-Source Kong Ingress controller مع خدمات Wallarm، يدعم خاصية التنظيم المتعدد وتكوين التطبيق على أساس كل Ingress عبر [التعليقات التوضيحية](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).

## متطلبات

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## التنصيب

لتنصيب Kong Ingress Controller مع خدمات Wallarm:

1. أنشئ عقدة Wallarm.
1. نصب مخطط Helm لـ Wallarm مع Kong Ingress Controller وخدمات Wallarm.
1. فعل تحليل حركة المرور لـ Ingress الخاص بك.
1. اختبر Kong Ingress Controller مع خدمات Wallarm المدمجة.

### الخطوة 1: إنشاء عقدة Wallarm

1. افتح واجهة مستخدم Wallarm Console → **العقد** عبر الرابط أدناه:

    * https://us1.my.wallarm.com/nodes للسحابة الأمريكية
    * https://my.wallarm.com/nodes للسحابة الأوروبية
1. أنشئ عقدة تصفية بنوع **عقدة Wallarm** وانسخ الرمز المُنشأ.

    ![إنشاء عقدة Wallarm][create-wallarm-node-img]

### الخطوة 2: تنصيب مخطط Helm لـ Wallarm

1. أضف [مستودع مخطط Wallarm](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. أنشئ ملف `values.yaml` ب [تكوين الحل](customization.md).

    مثال على ملف بالحد الأدنى للتكوين لتشغيل **المصدر المفتوح** لـ Kong Ingress controller مع خدمات Wallarm المدمجة:

    === "السحابة الأمريكية"
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
    === "السحابة الأوروبية"
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
        
    مثال على ملف بالحد الأدنى للتكوين لتشغيل **المؤسسي** لـ Kong Ingress controller مع خدمات Wallarm المدمجة:

    === "السحابة الأمريكية"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG-ENTERPRISE-LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        enterprise:
          enabled: true

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```
    === "السحابة الأوروبية"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG-ENTERPRISE-LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        enterprise:
          enabled: true
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```  
    
    * `<NODE_TOKEN>` هو رمز عقدة Wallarm الذي نسخته من واجهة مستخدم Wallarm Console

        --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
    
    * `<KONG-ENTERPRISE-LICENSE>` هو [رخصة Kong Enterprise](https://github.com/Kong/charts/blob/master/charts/kong/README.md#kong-enterprise-license)
1. نصب مخطط Helm لـ Wallarm:

    ``` bash
    helm install --version 4.6.3 <RELEASE_NAME> wallarm/kong -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` هو اسم الإصدار Helm لمخطط Kong Ingress Controller
    * `<KUBERNETES_NAMESPACE>` هو مساحة الاسم الجديدة لنشر الإصدار Helm بمخطط Kong Ingress Controller
    * `<PATH_TO_VALUES>` هو المسار إلى ملف `values.yaml`

### الخطوة 3: تفعيل تحليل حركة المرور لـ Ingress الخاص بك

إذا كان الحل المنصوب يعتمد على Kong Ingress controller المصدر المفتوح، فعّل تحليل حركة المرور لـ Ingress الخاص بك بتعيين وضع Wallarm إلى `monitoring`:

```bash
kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
```

حيث `<KONG_INGRESS_NAME>` هو اسم مورد K8s Ingress الذي يوجه استدعاءات API إلى الخدمات الدقيقة التي تريد حمايتها.

بالنسبة لـ Enterprise Kong Ingress controller، يتم تفعيل تحليل حركة المرور بوضع المراقبة عالميًا لجميع موارد Ingress افتراضيًا.

### الخطوة 4: اختبار Kong Ingress Controller مع خدمات Wallarm المدمجة

للاختبار أن Kong Ingress Controller مع خدمات Wallarm يعمل بشكل صحيح:

1. احصل على تفاصيل الحاوية Wallarm لفحص إذا كانت قد بدأت بنجاح:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    يجب عرض كل حاوية بالشكل التالي: **جاهز: N/N** و **الحالة: جاري التشغيل**، مثل:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. أرسل هجمات اختبار [اختراق المسار][ptrav-attack-docs] إلى خدمة Kong Ingress Controller:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    نظرًا لأن طبقة Wallarm تعمل بوضع **المراقبة** [أوضاع الفلترة المتاحة][available-filtration-modes-docs]، لن يحجب العقد Wallarm الهجوم ولكن سيتم تسجيله.

    لفحص تسجيل الهجوم، انتقل إلى واجهة مستخدم Wallarm Console → **الهجمات**:

    ![الهجمات في الواجهة][attacks-in-ui-image]

## التخصيص

تم حقن الحاويات Wallarm بناءً على [قيم `values.yaml` الافتراضية](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml) والتكوين المخصص الذي حددته في خطوة التنصيب الثانية.

يمكنك تخصيص سلوكيات كل من Kong API Gateway وWallarm أكثر والحصول على الفائدة القصوى من Wallarm لشركتك.

ما عليك سوى الانتقال إلى [دليل تخصيص حل Kong Ingress Controller](customization.md).