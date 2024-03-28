# نشر NGINX Ingress Controller مع خدمات Wallarm المدمجة

توفر هذه التعليمات البرمجية الخطوات لنشر متحكم الوصول (ingress) NGINX-المستند إلى Wallarm في تجمع K8s. تشمل الحلول الوظيفة الافتراضية لـ[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) مع خدمات Wallarm المدمجة.

هذه الحلول تتضمن الهندسة المعمارية التالية:

![Solution architecture][nginx-ing-image]

الحل مُنشر من خلال الرسم البياني لـHelm الخاص بـ Wallarm.

## حالات الاستخدام

من بين جميع خيارات نشر Wallarm المدعومة، يُفضل هذا الحل للحالات التالية:

* لا يوجد متحكم الوصول وطبقة الأمان التي توجه الحركة إلى موارد الوصول المتوافقة مع [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx).
* أنت تستخدم حاليا Community Ingress NGINX Controller وتبحث عن حل أمان يقدم كل من وظائف المتحكم القياسية وميزات الأمان المحسنة. في هذه الحالة، يمكنك الانتقال بسهولة إلى متحكم الوصول Wallarm-NGINX المفصل في هذه التعليمات. ببساطة، قم بترحيل التكوين الحالي الخاص بك إلى نشر جديد لإكمال التبديل.

    في حالة الاستخدام المتزامن لكل من متحكم الوصول الحالي والمتحكم Wallarm، راجع [دليل سلسلة متحكم الوصول](chaining-doc) للحصول على تفاصيل التكوين.

## المتطلبات

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "انظر أيضا"
    * [ما هو Ingress؟](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [تثبيت Helm](https://helm.sh/docs/intro/install/)

## القيود المعروفة

* العمل بدون وحدة postanalytics غير مدعوم. 
* قد يؤدي التقليل من وحدة postanalytics إلى فقدان جزئي لبيانات الهجوم.

## التثبيت

1. [تثبيت](#step-1-installing-the-wallarm-ingress-controller) المتحكم Wallarm Ingress.
2. [تمكين](#step-2-enabling-traffic-analysis-for-your-ingress) تحليل الحركة لـ Ingress الخاصة بك.
3. [التحقق من](#step-3-checking-the-wallarm-ingress-controller-operation) عملية المتحكم Wallarm Ingress.

### الخطوة 1: تثبيت Wallarm Ingress Controller

لتثبيت Wallarm Ingress Controller:

1. أنشئ رمز عقدة تصفية من [النوع المناسب][node-token-types]:

    === "رمز API (Helm chart 4.6.8 وما فوق)"
        1. افتح Wallarm Console → **الإعدادات** → **رموز API** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
        1. البحث أو الإنشاء رمز API بدور المصدر `Deploy`.
        1. نسخ هذا الرمز.
    === "رمز العقدة"
        1. افتح Wallarm Console → **العقد** في إما [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
        1. إنشاء عقدة تصفية بنوع **عقدة Wallarm** ونسخ الرمز المُنتج.
            
            ![إنشاء عقدة Wallarm][nginx-ing-create-node-img]
1. قم بإنشاء مساحة الأسماء Kubernetes لنشر الرسم البياني Helm مع المتحكم Wallarm Ingress:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. أضف [مستودع الرسم البياني Wallarm](https://charts.wallarm.com/):
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```

1. أنشاء الملف `values.yaml` مع [تكوين Wallarm][configure-nginx-ing-controller-docs]. مثال على الملف بالتكوين الأدنى أدناه.

    عند استخدام رمز API، حدد اسم مجموعة العقدة في المعلمة `nodeGroup`. سيتم تعيين عقدتك إلى هذه المجموعة، والتي تظهر في قسم العقد **Nodes** في Wallarm Console. اسم المجموعة الافتراضي هو `defaultIngressGroup`.

    === "US Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
            # nodeGroup: defaultIngressGroup
        ```
    === "EU Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
        ```
    
    يمكنك أيضا تخزين رمز العقدة Wallarm في أسرار Kubernetes وسحبها إلى الرسم البياني Helm. [اقرأ المزيد][controllerwallarmexistingsecret-docs]

    !!! info "النشر من التسجيلات الخاصة بك"    
        يمكنك الكتابة فوق عناصر ملف `values.yaml` لتثبيت المتحكم Wallarm Ingress من الصور المخزنة [في تسجيلاتك الخاصة](#deployment-from-your-own-registries).

1. تثبيت حزم Wallarm:

    ``` bash
    helm install --version 4.10.3 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` هو اسم الإصدار Helm للمتحكم الرسم البياني لـ Ingress
    * `<KUBERNETES_NAMESPACE>` هو مساحة أسماء Kubernetes التي أنشأتها للمتحكم الرسم البياني لـ Wallarm Ingress
    * `<PATH_TO_VALUES>` هو المسار إلى الملف `values.yaml`

### الخطوة 2: تمكين تحليل الحركة لـ Ingress الخاصة بك

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application="<APPLICATION_ID>"
```
* `<YOUR_INGRESS_NAME>` هو اسم Ingress الخاص بك
* `<YOUR_INGRESS_NAMESPACE>` هو مكان أسماء Ingress الخاص بك
* `<APPLICATION_ID>` هو عدد موجب فريد لكل [تطبيقاتك أو مجموعات التطبيقات][application-docs]. سيتيح لك هذا الحصول على إحصائيات منفصلة والتمييز بين الهجمات المستهدفة للتطبيقات المقابلة

### الخطوة 3: التحقق من عملية Wallarm Ingress Controller

1. الحصول على قائمة الأقدام:
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    يجب على كل أقدام عرض الاتي: **STATUS: Running** و **READY: N/N**. على سبيل المثال:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. ارسال الطلب مع الهجوم الاختباري [Path Traversal][ptrav-attack-docs] إلى خدمة Ingress Controller:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    إذا كانت العقدة التصفية تعمل في وضع `block`، سيتم إرجاع الرمز `403 Forbidden` في الرد على الطلب وسيتم عرض الهجوم في Wallarm Console → **الهجمات**.

## نشر ARM64

مع إصدار هيلم Helm لـ NGINX Ingress controller الإصدار 4.8.2، تم تقديم التوافق مع معالج ARM64. في البداية مجهزة لبنىة المعالجات x86، ينطوي النشر على عقد ARM64 على تعديل معلمات الرسم البياني Helm.

في إعدادات ARM64، غالبًا ما تحمل عقد Kubernetes تسمية `arm64`. لمساعدة المجدول Kubernetes في تخصيص الحمل العملي لـ Wallarm لنوع العقدة المناسب، ارجع إلى هذه التسمية باستخدام `nodeSelector`، أو `tolerations`، أو قواعد التوافق في تكوين الرسم البياني Helm الخاص بـ Wallarm.

أدناه مثال على رسم هيلم Helm لـ Wallarm بالنسبة لـ Google Kubernetes Engine (GKE)، الذي يستخدم تسمية `kubernetes.io/arch: arm64` للعقد الأصلح. هذا القالب قابل للتعديل للتوافق مع غيرها من الإعدادات السحابية، مع احترام اصناف ARM64 الخاصة بها.

=== "nodeSelector"
    ```yaml
    controller:
      nodeSelector:
        kubernetes.io/arch: arm64
      admissionWebhooks:
        nodeSelector:
          kubernetes.io/arch: arm64
        patch:
          nodeSelector:
            kubernetes.io/arch: arm64
      wallarm:
        tarantool:
          nodeSelector:
            kubernetes.io/arch: arm64
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # if using EU Cloud, comment out this line
        # If using an API token, uncomment the following line and specify your node group name
        # nodeGroup: defaultIngressGroup
    ```
=== "tolerations"
    ```yaml
    controller:
      tolerations:
        - key: kubernetes.io/arch
          operator: Equal
          value: arm64
          effect: NoSchedule
      admissionWebhooks:
        patch:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
      wallarm:
        tarantool:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # if using EU Cloud, comment out this line
        # If using an API token, uncomment the following line and specify your node group name
        # nodeGroup: defaultIngressGroup
    ```

## نشر من التسجيلات الخاصة بك

إذا لم تكن تستطيع سحب الصور Docker من المستودع العام Wallarm بسبب بعض الأسباب، على سبيل المثال بسبب سياسة الأمان الخاصة بشركتك تحد من استخدام أي موارد خارجية، بدلا من ذلك يمكنك:

1. نسخ هذه الصور إلى سجلك الخاص.
1. تثبيت Wallarm NGINX-based Ingress controller باستخدامها.

تستخدم الصور Docker التالية بواسطة الرسم البياني Helm لنشر Ingress Controller المبني على NGINX:

* [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
* [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)

لتثبيت Wallarm NGINX-based Ingress controller باستخدام الصور المخزنة في سجلك، تجاوز ملف `values.yaml` الخاص برسم Wallarm Ingress controller Helm chart:

```yaml
controller:
  image:
    ## The image and tag for wallarm nginx ingress controller
    ##
    registry: <YOUR_REGISTRY>
    image: wallarm/ingress-controller
    tag: <IMAGE_TAG>
  wallarm:
    helpers:
      ## The image and tag for the helper image
      ##
      image: <YOUR_REGISTRY>/wallarm/node-helpers
      tag: <IMAGE_TAG>
```

ثم قم بالتثبيت باستخدام `values.yaml` المعدل الخاص بك.

## التعريف 

بعد تثبيت والتحقق من Wallarm Ingress controller بنجاح، يمكنك إجراء تكوينات متقدمة للحل مثل:

* [الإبلاغ الصحيح عن عنوان IP العام للمستخدم النهائي][best-practices-for-public-ip]
* [إدارة حظر عناوين IP][ip-lists-docs]
* [الاعتبارات المتعلقة بالتوفر العالي][best-practices-for-high-availability]
* [رصد مراقبة الوصول][best-practices-for-ingress-monitoring]

للعثور على المعلمات المستخدمة للتكوين المتقدم والتعليمات المناسبة، يرجى اتباع ال[رابط][configure-nginx-ing-controller-docs].