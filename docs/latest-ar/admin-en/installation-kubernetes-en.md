# تنصيب NGINX Ingress Controller مع خدمات Wallarm المدمجة

هذه التعليمات تقدم لك الخطوات لتنصيب Wallarm NGINX-based Ingress controller على تجمع K8s الخاص بك. الحل يتضمن الوظائف الافتراضية لـ [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) مع خدمات Wallarm المدمجة.

للحل الهندسة التالية:

![هندسة الحل][nginx-ing-image]

يتم نشر الحل من خلال خريطة Helm الخاصة بـ Wallarm.

## حالات الاستخدام

من بين جميع خيارات نشر Wallarm المدعومة [deployment-platform-docs]، هذا الحل هو الموصى به لـ **حالات الاستخدام** التالية:

* لا يوجد Ingress controller وطبقة الأمان التي توجه المرور إلى موارد  Ingress المتوافقة مع [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx).
* أنت حاليًا تستخدم Community Ingress NGINX Controller وتبحث عن حل أمني يقدم كلاً من وظائف التحكم القياسية وميزات الأمان المحسنة. في هذه الحالة، يمكنك التحول بسهولة إلى Wallarm-NGINX Ingress Controller الذي تم تفصيله في هذه التعليمات. ببساطة انقل تكوينك الحالي إلى نشر جديد لإكمال الاستبدال.

    للاستخدام المتزامن لكل من Ingress controller الحالي و controller Wallarm، راجع [دليل تسلسل Ingress Controller][chaining-doc] لتفاصيل التكوين.

## المتطلبات

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "انظر أيضا"
    * [ما هو Ingress؟](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [تنصيب Helm](https://helm.sh/docs/intro/install/)

## القيود المعروفة

* التشغيل دون وحدة postanalytics لا يتم دعمه.
* تقليص وحدة postanalytics قد يؤدي إلى فقدان جزئي لبيانات الهجوم.

## التنصيب

1. [قم بالتنصيب](#step-1-installing-the-wallarm-ingress-controller) لـ Wallarm Ingress controller.
2. [مكن](#step-2-enabling-traffic-analysis-for-your-ingress) تحليل المرور لـ Ingress الخاص بك.
3. [تحقق](#step-3-checking-the-wallarm-ingress-controller-operation) من تشغيل Wallarm Ingress controller.

### الخطوة 1: تنصيب Wallarm Ingress Controller

لتنصيب Wallarm Ingress Controller:

1. قم بتوليد رمز عقدة ترشيح من النوع [المناسب][node-token-types]:

    === "رمز API (خريطة Helm 4.6.8 وما فوق)"
        1. افتح وحدة تحكم Wallarm → **الإعدادات** → **رموز API** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/settings/api-tokens) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/settings/api-tokens).
        1. ابحث أو انشئ رمز API بدور مصدر `Deploy`.
        1. نسخ هذا الرمز.
    === "رمز العقدة"
        1. افتح وحدة تحكم Wallarm → **العقد** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/nodes) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/nodes).
        1. قم بإنشاء عقدة ترشيح بنوع **عقدة Wallarm** وانسخ الرمز المولد.

            ![إنشاء عقدة Wallarm][nginx-ing-create-node-img]
1. قم بإنشاء مساحة أسماء Kubernetes لنشر خريطة Helm مع Wallarm Ingress 

    controller:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. أضف [مستودع خريطة Wallarm](https://charts.wallarm.com/):
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```

1. قم بإنشاء ملف `values.yaml` مع [تكوين Wallarm][configure-nginx-ing-controller-docs]. مثال الملف بالحد الأدنى من التكوين أدناه.

    عند استخدام رمز API، حدد اسم مجموعة العقد في معامل `nodeGroup`. سيتم تعيين عقدتك بهذه المجموعة، التي تظهر في قسم **العقد** في وحدة تحكم Wallarm. اسم المجموعة الافتراضي هو `defaultIngressGroup`.

    === "سحابة الولايات المتحدة"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
            # nodeGroup: defaultIngressGroup
        ```
    === "سحابة الاتحاد الأوروبي"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
        ```
    
    يمكنك أيضًا تخزين رمز عقدة Wallarm في أسرار Kubernetes وسحبه إلى خريطة Helm. [اقرأ المزيد][controllerwallarmexistingsecret-docs]

    !!! info "نشر من مستودعاتك الخاصة"    
        يمكنك تعديل عناصر في ملف `values.yaml` لتنصيب Wallarm Ingress controller من الصور المخزنة [في مستودعاتك الخاصة](#deployment-from-your-own-registries).

1. نصب الحزم Wallarm:

    ``` bash
    helm install --version 4.10.2 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` هو اسم لإصدار Helm لخريطة Ingress controller
    * `<KUBERNETES_NAMESPACE>` هي مساحة أسماء Kubernetes التي قمت بإنشائها لخريطة Helm مع Wallarm Ingress controller
    * `<PATH_TO_VALUES>` هو مسار لملف `values.yaml`
