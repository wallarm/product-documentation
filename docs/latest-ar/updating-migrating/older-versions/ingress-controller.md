[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md

# ترقية وحدة تحكم NGINX Ingress المدمجة بوحدات Wallarm المنتهية الصلاحية

تتعرض هذه التعليمات البرمجية لخطوات الترقية من الإصدار 3.6 أو الأقل من وحدة تحكم Wallarm Ingress المنتهية الصلاحية، إلى الإصدار الجديد للوحدة.
--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "الإصدار المحدث لوحدة تحكم Ingress NGINX المجتمعية"
    إذا قمت بالترقية من الإصدار 3.4 أو الأقل، يرجى ملاحظة أن الإصدار الذي تم الترقية إليه من وحدة تحكم Ingress NGINX المجتمعية المعتمدة على وحدة تحكم Wallarm Ingress ، كان قد تمت ترقيته من 0.26.2 إلى 1.9.5.
    
بما أن عملية وحدة تحكم Ingress NGINX المجتمعية 1.9.5 تعرض لتغييرات كبيرة ، يجب ضبط التكوين الخاص بها لتتلاءم مع هذه التغييرات أثناء ترقية وحدة تحكم Wallarm Ingress.

هذه التعليمات البرمجية تحتوي على قائمة بإعدادات وحدة تحكم Ingress NGINX المجتمعية ، التي قد تحتاج على الأرجح إلى عمل تغييرات فيها. على أي حال، يرجى وضع خطة فردية لنقل التكوين استنادًا إلى [ملاحظات الإصدار الخاصة بوحدة تحكم Ingress NGINX المجتمعية](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md).

## المتطلبات
--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## الخطوة 1: أخبر الدعم الفني في Wallarm بأنك تقوم بترقية وحدات العقدة التصفية (فقط إذا كنت تقوم بترقية العقدة 2.18 أو أقل)

إذا كنت تقوم بترقية العقدة النسخة 2.18 أو ما هو أقل، أخبر [الدعم الفني في Wallarm](mailto:support@wallarm.com) أنك تقوم بتحديث وحدات العقدة التصفية إلى 4.10 واطلب تمكين منطق قوائم العناوين IP الجديدة لحساب Wallarm الخاص بك.

عند تمكين منطق قوائم العناوين IP الجديدة ، الرجاء فتح وحدة تحكم Wallarm وتأكد من أن القسم [**قوائم العناوين IP**](../../user-guides/ip-lists/overview.md) متاح.

## الخطوة 2: تعطيل وحدة التحقق من التهديد الفعال (فقط إذا كنت تقوم بترقية العقدة 2.16 أو أقل)

إذا كنت تقوم بترقية Wallarm العقدة 2.16 أو ما هو أقل ، يرجى تعطيل وحدة [التحقق من التهديد الفعال](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) في وحدة تحكم Wallarm → **الثغرات الأمنية** → **تكوين**.

يمكن أن تسبب عملية الوحدة [الوهميات الإيجابية](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. إيقاف تشغيل الوحدة يقلل من هذا المخاطر.

## الخطوة 3: تحديث منفذ API

--8<-- "../include/waf/upgrade/api-port-443.md"

## الخطوة 4: تحديث مستودع خرائط Helm الخاص بـ Wallarm

=== "إذا كنت تستخدم مستودع Helm"
    ```bash
    helm repo update wallarm
    ```
=== "إذا كنت تستخدم مستودع GitHub المستنسخ"
    قم بإضافة [مستودع Wallarm Helm](https://charts.wallarm.com/) الذي يحتوي على جميع إصدارات الخريطة باستخدام الأمر الموجود أدناه. يرجى استخدام مستودع Helm لاستمرار العمل مع وحدة تحكم Wallarm Ingress.
    
    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## الخطوة 5: تحديث التكوين `values.yaml`

للترحيل إلى وحدة تحكم Wallarm Ingress 4.10 ، قم بتحديث التكوين التالي المحدد في ملف `values.yaml`:

* التكوين القياسي لوحدة تحكم Ingress NGINX المجتمعية
* تكوين وحدة Wallarm

### التكوين القياسي لوحدة تحكم Ingress NGINX المجتمعية

1. تحقق من [ملاحظات الإصدار على وحدة تحكم Ingress NGINX المجتمعية](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) الإصدار 0.27.0 أو الإصدار الأعلى وتحديد الإعدادات التي يجب تغييرها في ملف `values.yaml`.
2. قم بتحديث الإعدادات المعرفة في ملف `values.yaml`.

توجد الإعدادات التالية التي يجب على الأرجح تغييرها:

* [الإبلاغ الصحيح عن عنوان IP العام للمستخدم النهائي](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md) إذا تم تمرير الطلبات عبر موزع التحميل قبل إرسالها إلى وحدة تحكم Wallarm Ingress.

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```

* [تكوين IngressClasses](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/). تمت ترقية الإصدار من واجهة برمجة التطبيقات Kubernetes المستخدمة في الوحدة التحكم Ingress الجديدة ، التي تتطلب تكوين IngressClasses عبر معلمات `.controller.ingressClass`, و `.controller.ingressClassResource` و `.controller.watchIngressWithoutClass`.

    ```diff
    controller:
    +  ingressClass: waf-ingress
    +  ingressClassResource:
    +    name: waf-ingress
    +    default: true
    +  watchIngressWithoutClass: true
    ```

* [مجموعة معلمات ConfigMap (`.controller.config`) ](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/) ، على سبيل المثال:

    ```diff
    controller:
    config:
    +  allow-backend-server-header: "false"
      enable-brotli: "true"
      gzip-level: "3"
      hide-headers: Server
      server-snippet: |
        proxy_request_buffering on;
        wallarm_enable_libdetection on;
    ```
  
* [التحقق من صياغة Ingress عبر "webhook القبول"] (https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration) تم تفعيله الآن بشكل افتراضي
    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "تعطيل التحقق من صياغة Ingress"
        يوصى بتعطيل التحقق من صياغة Ingress فقط إذا كان يعرض عملية الكائنات Ingress للاعتراض.
+ [تنسيق التصنيف](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). إذا قام ملف `values.yaml` بتعيين قواعد التنافر في الحد، قم بتغيير تنسيق التصنيف في هذه القاعدة، على سبيل المثال:

    ```diff
    controller:
      affinity:
        podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
        - podAffinityTerm:
            labelSelector:
                matchExpressions:
    -            - key: app
    +            - key: app.kubernetes.io/name
                operator: In
                values:
                - waf-ingress
    -            - key: component
    +            - key: app.kubernetes.io/component
                operator: In
                values:
    -              - waf-ingress
    +              - controller
    -            - key: release
    +            - key: app.kubernetes.io/instance
                operator: In
                values:
                - waf-ingress-ingress
            topologyKey: kubernetes.io/hostname
            weight: 100
    ```

### تكوين الوحدة النمطية لـ Wallarm

قم بتغيير مجموعة تكوين الوحدة النمطية Wallarm محددة في ملف `values.yaml` على النحو التالي:

* إذا كنت تقوم بالترقية من الإصدار 2.18 أو أقل ، [قم بالترحيل](../migrate-ip-lists-to-node-3.md) من تكوين قائمة ال IP. الإعدادات التالية ربما ستحتاج إلى يتم حذفها من `values.yaml` :

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    بحكم أن منطق النواة الأساسي لقائمة العناوين IP تغير بشكل كبير في Wallarm node الإصدار 3.x، يتطلب ضبط تكوين قائمة العناوين IP بشكل مناسب.
* تأكد أن السلوك المتوقع للإعدادات المدرجة أدناه يتطابق مع [منطق الأطوار `off` و `monitoring` الجديد للترشيح](what-is-new.md#filtration-modes):
      
      * [المديرية `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [القاعدة العامة للترشيح المكونة في وحدة تحكم Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد ترشيح مستهدفة لنقاط النهاية مكونة في وحدة تحكم Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)

      إذا لم يتطابق السلوك المتوقع مع منطق الأطوار المتغير للترشيح ، يرجى ضبط التعليمات البرمجية التوضيحية [Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) و [الإعدادات الأخرى](../../admin-en/configure-wallarm-mode.md) على التغييرات المطلقة.

* التخلص من [تكوين خدمة الرصد الصريح](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md). في جديد Wallarm وحدة التحكم Ingress ، خدمة الرصد مفعلة بشكل افتراضي ولا تتطلب أي تكوين إضافي.

    ```diff
    controller:
    wallarm:
      enabled: true
      tarantool:
        resources: {}
    -  metrics:
    -    enabled: true
    -    service:
    -      annotations: {}
    ```
* إذا كانت صفحة `&/usr/share/nginx/html/wallarm_blocked.html` من خلال تكوين ConfigMap تتم العودة إلى طلبات المنع ، [قم بتعديل تكوينها](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) إلى التغييرات المفعلة.

    في الإصدار الجديد للعقدة ، [لديها](what-is-new.md#new-blocking-page) صفحة حجب العينة المحدثة من Wallarm لديها واجهة مستخدم محدثة بدون شعار ودعم البريد الإلكتروني على الفور.
* إذا كنت قد قمت بتخصيص كشف هجوم `overlimit_res` عبر [`wallarm_process_time_limit`][nginx-process-time-limit-docs] و [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX يرجى [التحويل](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule) من هذه الإعدادات إلى القاعدة وقم بحذفها من ملف `values.yaml`.

## الخطوة 6: نقل تكوين كشف الهجوم `overlimit_res` من التوجيهات إلى القاعدة

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## الخطوة 7: تحقق من جميع التغييرات القادمة لوثائق K8s

 لتجنب تغييرات غير متوقعة في سلوك وحدة التحكم Ingress ، تحقق من جميع التغييرات القادمة في وثائق K8s باستخدام [Helm Diff Plugin](https://github.com/databus23/helm-diff). هذا المكون يخرج الفرق بين وثائق K8s للإصدار المنشأ لوحدة التحكم Ingress و الجديد.

لتثبيت وتشغيل المكون الإضافي:

1. قم بتثبيت المكون الإضافي:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. قم بتشغيل المكون الإضافي:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم إصدار Helm للرسم البياني لوحدة التحكم Ingress
    * `<NAMESPACE>`: نطاق الوحدة التحكم Ingress المنشأ
    * `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد [إعدادات وحدة التحكم Ingress 4.10](#step-5-update-the-valuesyaml-configuration)
3. تأكد من عدم وجود تغييرات يمكن أن تؤثر على استقرار الخدمات العاملة وفحص الأخطاء بعناية من stdout.

    إذا كان stdout فارغًا ، تأكد من صلاحية ملف `values.yaml`.

يرجى ملاحظة التغييرات في التكوين التالي:

* الحقل ثابت ، على سبيل المثال محددات النشر و / أو StatefulSet.
* تصنيفات النقاط. يمكن أن تؤدي التغييرات إلى إنهاء التشغيل الشبكي NetworkPolicy ، على سبيل المثال:

    ```diff
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    spec:
      egress:
      - to:
        - namespaceSelector:
            matchExpressions:
            - key: name
              operator: In
              values:
              - kube-system # ${NAMESPACE}
          podSelector:
            matchLabels: # RELEASE_NAME=waf-ingress
    -         app: waf-ingress
    +         app.kubernetes.io/component: "controller"
    +         app.kubernetes.io/instance: "waf-ingress"
    +         app.kubernetes.io/name: "waf-ingress"
    -         component: waf-ingress
    ```
* تكوين Prometheus مع تصنيفات جديدة ، على سبيل المثال:

    ```diff
     - job_name: 'kubernetes-ingress'
       kubernetes_sd_configs:
       - role: pod
         namespaces:
           names:
             - kube-system # ${NAMESPACE}
       relabel_configs: # RELEASE_NAME=waf-ingress
         # Selectors
    -    - source_labels: [__meta_kubernetes_pod_label_app]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_release]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_instance]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_component]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_component]
           action: keep
    -      regex: waf-ingress
    +      regex: controller
         - source_labels: [__meta_kubernetes_pod_container_port_number]
           action: keep
           regex: "10254|18080"
           # Replacers
         - action: replace
           target_label: __metrics_path__
           regex: /metrics
         - action: labelmap
           regex: __meta_kubernetes_pod_label_(.+)
         - source_labels: [__meta_kubernetes_namespace]
           action: replace
           target_label: kubernetes_namespace
         - source_labels: [__meta_kubernetes_pod_name]
           action: replace
           target_label: kubernetes_pod_name
         - source_labels: [__meta_kubernetes_pod_name]
           regex: (.*)
           action: replace
           target_label: instance
           replacement: "$1"
    ```
* تحليل كل التغييرات الأخرى.

## الخطوة 8: ترقية وحدة التحكم Ingress

هناك ثلاث طرق لترقية وحدة تحكم Wallarm Ingress. باعتماد على ما إذا كان هناك موزع تحميل مستنصب على بيئتك ، حدد طريقة الترقية:

* نشر وحدة تحكم Ingress مؤقتة
* إعادة إنشاء الإصدار بشكل عادي لوحدة التحكم Ingress
* إعادة إنشاء الإصدار لوحدة التحكم Ingress دون التأثير على موزع التحميل

!!! warning "استخدام البيئة المرحلية أو minikube"
   إذا كانت وحدة تحكم Wallarm Ingress مثبتة على بيئتك المرحلية ، يوصى بترقيتها أولاً. بمجرد نجاح كل الخدمات في البيئة المرحلية ، يمكنك البدء في عملية الترقية في البيئة الإنتاجية.

   ما لم يتم توصيةك بـ [تثبيت Wallarm Ingress المراقب 4.10](../../admin-en/installation-kubernetes-en.md) مع التكوين المحدث باستخدام minikube أو خدمة أخرى أولاً. التأكد من أن جميع الخدمات تعمل كما هو متوقع ثم قم بترقية وحدة التحكم Ingress في البيئة الإنتاجية.

ويساعد هذا النهج على تجنب توقف الخدمات عن العمل في البيئة الإنتاجية.

### الطريقة 1: نشر وحدة تحكم Ingress مؤقتة

باستخدام هذه الطريقة ، يمكنك نشر وحدة Ingress 4.10 ككيان إضافي في بيئتك والتحويل التدريجي للحركة إليه. هذا يساعد على تفادي توقف الخدمات حتى وقت قصير ويضمن الترحيل الآمن.

1. انسخ تكوين IngressClass من ملف `values.yaml` للإصدار السابق إلى ملف `values.yaml` لـ Ingress 4.10.

    بهذا التكوين ، ستتعرف وحدة التحكم Ingress على كائنات Ingress ولكنها لن تعالج حركة مرورها.
2. نشر وحدة التحكم Ingress 4.10:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم الإصدار للرسم البياني لوحدة التحكم Ingress
    * `<NAMESPACE>`: النطاق لنشر وحدة التحكم Ingress
    * `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد [إعدادات وحدة التحكم Ingress 4.10](#step-5-update-the-valuesyaml-configuration)
3. تأكد من أن جميع الخدمات تعمل بشكل صحيح.
4. قم بالتبديل التدريجي للحمولة إلى وحدة التحكم Ingress الجديدة.

### الطريقة 2: إعادة إنشاء الإصدار بشكل عادي لوحدة التحكم Ingress

**إذا كان موزع التحميل ووحدة التحكم Ingress ليست موضحة بالرسم البياني Helm نفسه** ، يمكنك ببساطة إعادة إنشاء الإصدار Helm. ستستغرق العملية بضع دقائق وسوف تكون وحدة التحكم Ingress غير متوفرة لهذا الوقت.

!!! warning "إذا كان الرسم البياني Helm يضعت كونفيجريشن لموزع التحميل"
   إذا كنت تستخدم وضع config خاص بموزع التحميل بالإضافة إلى وحدة التحكم Ingress ، يمكن أن تؤدي إعادة إنشاء الإصدار إلى توقف الخدمة على الخادم لفترة طويلة (يعتمد على موفر الخدمة السحابية). قد يتغير عنوان IP لموزع التحميل بعد الترقية إذا لم يتم تعيين عنوان ثابت.

   يرجى تحليل جميع المخاطر المحتملة عند استخدام هذه الطريقة.

نقاش إجراءات إعادة إنشاء الاصدار لوحدة التحكم Ingress:

=== "Helm CLI"
    1. حذف الإصدار السابق:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: اسم الإصدار Helm للرسم البياني لوحدة التحكم Ingress
        * `<NAMESPACE>`: النطاق الذي تم تنشيص وحدة التحكم Ingress

        يرجى عدم استخدام الخيار `--wait` عند تنفيذ الأمر حيث أنه يمكن أن يزيد من وقت الترقية.
    2. قم بإنشاء إصدار جديد مع undelayer Wallarm Ingress 4.10:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.2 -f <PATH_TO_VALUES>
        ```

        * `<RELEASE_NAME>`: اسم الإصدار للرسم البياني لوحدة التحكم Ingress
        * `<NAMESPACE>`: النطاق لنشر وحدة التحكم Ingress
        * `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد [إعدادات وحدة التحكم Ingress 4.10](#step-5-update-the-valuesyaml-configuration)
=== "Terraform CLI"
    1. قم بتعيين الخيار `wait = false` في التكوين Terraform لتقليل وقت الترقية:
        
        ```diff
        resource "helm_release" "release" {
          ...

        + wait = false

          ...
        }
        ```
    
    2. حذف الإصدار السابق:

        ```bash
        terraform taint helm_release.release
        ```
    
    3. إنشاء الإصدار الجديد مع undelayer Wallarm Ingress 4.10:

        ```bash
        terraform apply -target=helm_release.release
        ```

### الطريقة 3: إعادة إنشاء وحدة التحكم Ingress ولكن دون التأثير على موزع التحميل.

عند استخدام موزع التحميل الذي يتكون من موفر الخدمة السحابية ، يوصى بترقية وحدة التحكم Ingress بهذه الطريقة لأنها لا تؤثر على موزع التحميل.

ستستغرق إعادة إنشاء الإصدار بضع دقائق وسوف تكون وحدة التحكم Ingress غير متوفرة لهذا الوقت.

1. الحصول على كائنات ليتم حذفها (باستثناء موزع التحميل):

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

لتثبيت الأداة `yq`، من فضلك استخدم [الإرشادات](https://pypi.org/project/yq/).

سيتم إخراج الكائنات ليتم حذفها في ملف `objects-to-remove.txt`.

2. حذف كائنات مدرجة وإعادة إنشاء الإصدار:

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.2 -f `<PATH_TO_VALUES>`
    ```

لتقليل توقف الخدمة عن العمل ، ننصحك بعدم تنفيذ الأوامر بشكل منفصل.
3. التأكد من أن جميع الكائنات ثم انشاؤها:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

جميع الكائنات يجب أن تكون موجودة بالفعل. تتم اجراء هذا تحدث للبارمترات التي تمر بالأوامر:

* `<RELEASE_NAME>`: اسم الإصدار Helm للرسم البياني لوحدة التحكم Ingress
* `<NAMESPACE>`: النطاق الذي تم تنشيص وحدة التحكم Ingress
* `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد [إعدادات وحدة التحكم Ingress 4.10](#step-5-update-the-valuesyaml-configuration)

## الخطوة 9: اختبر وحدة التحكم Ingress المحدثة

1. تأكد أن الاصدر الخاص نسخة الخريطةتم تحديثها:

    ```bash
    helm ls
    ```

    يجب أن يطابق الرسم البياني لاصدره `wallarm-ingress-4.10.2`.
2. احصل على قائمة بالنقاط معتبرا أسماء وحدة التحكم في Wallarm Ingress `<INGRESS_CONTROLLER_NAME>` :
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    يجب أن يكون لكل نقطة الوضع **STATUS: Running** أو **READY: N/N**. على سبيل المثال:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

3. أرسل الطلب مع حتى ار معتمدة [Path Traversal](../../attacks-vulns-list.md#path-traversal) من آدرس وحدة التحكم Wallarm Ingress:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    إذا كانت العقدة التصفية تعمل في الوضع `block` ، سيتم إرجاع الرمز `403 Forbidden` كرد على الطلب وسيتم عرض الهجوم في واجهة Wallarm Console → **الهجمات**.

## الخطوة 10: ضبط التجاه االمبرمجية الخاصة Ingress الى التغيرات القادة.

قم بضبط التالي التعليمات البرمجية Ingress الى التغيرات التي اطلقت في Ingress 4.10:

1. إذا كنت تقوم بالترقية من الإصدار 2.18 أو أقل ، [قم بالترحيل](../migrate-ip-lists-to-node-3.md) من تكوين قائمة ال IP. منذ ان تغير منطق النواة الأساسي لقائمة العناوين IP بشكل كبير في Wallarm node الإصدار 3.x، يتطلب ضبط تكوين قائمة العناوين IP الشكل المناسب بتغيير Ingress التوجيه البرمجي (اذا كان مطبق).
2. تأكد أن السلوك المتوقع للإعدادات المدرجة أدناه يتطابق مع [منطق الأطوار `off` و`monitoring` الجديد للترشيح](what-is-new.md#filtration-modes):
      
      * [المديرية `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [القاعدة العامة للترشيح المكونة في وحدة تحكم Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد ترشيح مستهدفة لنقاط النهاية مكونة في وحدة تحكم Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)

      إذا لم يتطابق السلوك المتوقع مع منطق الأطوار المتغير للترشيح ، يرجى ضبط التعليمات البرمجية التوضيحية [Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) على التغييرات المطلقة.
1. إذا كانت Ingress  مشهرة ب `nginx.ingress.kubernetes.io/wallarm-instance` ، قم بإعادة تسمية  التعليمة البرمجية لتصبح `nginx.ingress.kubernetes.io/wallarm-application`.

   تغير اسم التعليمة البرمجية فقط ونفس منطقها لا يزال قائمًا. سيتم تقديم العلامة التوضيحية بالاسم السابق قريبًا ، لذا يوصى بإعادة تسميتها قبل ذلك.
1. إذا كانت صفحة `&/usr/share/nginx/html/wallarm_blocked.html` من خلال التعليمات البرمجية Ingress تعود إلى طلبات المنع ، [قم بتعديل تكوينها](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) إلى التغييرات المفعلة.

    في الإصدار الجديد للعقدة ، [لديها](what-is-new.md#new-blocking-page) صفحة حجب العينة المحدثة من Wallarm لديها واجهة مستخدم محدثة بدون شعار ودعم البريد الإلكتروني على الفور.

## الخطوة 11: إعادة تمكين وحدة التحقق من التهديد الفعال (فقط إذا كنت تقوم بترقية العقدة 2.16 أو أقل)

تعرف على  [التوصية بشأن إعداد وحدة التحقق من التهديد الفعال](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) وأعد تشغيلها إذا لزم الأمر.

بعد فترة، تأكد من أن عملية الوحدة لا تسبب الايجابيات الوهمية. إذا اكتشفت الايجابيات الوهمية ، يرجى الاتصال بـ [الدعم الفني في Wallarm](mailto:support@wallarm.com).