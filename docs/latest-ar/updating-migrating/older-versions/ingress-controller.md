[nginx-process-time-limit-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../../user-guides/ip-lists/overview.md
[ip-list-docs]: ../../user-guides/ip-lists/overview.md
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.md

# ترقية نهاية عمر واجهة تحكم NGINX Ingress المتكاملة مع وحدات Wallarm

تصف هذه التعليمات الخطوات لترقية Wallarm Ingress Controller المنتهي العمر (الإصدار 3.6 وأدناه) إلى الإصدار الجديد مع Wallarm node 4.10.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "الإصدار المحدث لواجهة تحكم Community Ingress NGINX"
    إذا كنت تقوم بترقية العقدة من الإصدار 3.4 أو أقل، يرجى ملاحظة أن الإصدار من واجهة تحكم Community Ingress NGINX الذي يعتمد عليه واجهة تحكم Wallarm Ingress قد تم ترقيته من 0.26.2 إلى 1.9.5.
    
    نظرًا لأن عملية واجهة تحكم Community Ingress NGINX 1.9.5 تغيرت بشكل ملحوظ، يجب ضبط التهيئة لتتكيف مع هذه التغييرات أثناء ترقية واجهة تحكم Wallarm Ingress.

    تحتوي هذه التعليمات على قائمة إعدادات واجهة تحكم Community Ingress NGINX التي قد تحتاج إلى تغييرها. ومع ذلك، يرجى وضع خطة فردية لنقل التكوين بناءً على [ملاحظات الإصدار لواجهة تحكم Community Ingress NGINX](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md).

## متطلبات

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## الخطوة 1: أبلغ Wallarm technical support بالترقية

إذا كانت الترقية للعقدة 2.18 أو أقل، فـابلغ [دعم فني Wallarm](mailto:support@wallarm.com) أنك تقوم بتحديث وحدات فرز العقدة إلى 4.10 واطلب تمكين منطق قوائم الأي بي الجديدة لحساب Wallarm الخاص بك.

عند تمكين منطق قوائم الأي بي الجديدة، يرجى فتح Wallarm Console والتأكد من أن القسم [**قوائم الأي بي**](../../user-guides/ip-lists/overview.md) متاح.

## الخطوة 2: تعطيل وحدة التحقق من التهديد النشط (فقط إذا كانت الترقية للعقدة 2.16 أو أقل)

إذا كانت الترقية لـ Wallarm node 2.16 أو أقل، يرجى تعطيل وحدة [التحقق من التهديد النشط](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) في Wallarm Console → **الثغرات الأمنية** → **تكوين**.

يمكن أن يتسبب تشغيل الوحدة في [إيجادات كاذبة](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. يقلل تعطيل الوحدة من هذا المخاطر.

## الخطوة 3: حدّث منفذ الواجهة البرمجية للتطبيق API

--8<-- "../include/waf/upgrade/api-port-443.md"

## الخطوة 4: حدّث مستودع Wallarm Helm

=== "إذا كان يتم استخدام مستودع Helm"
    ```bash
    helm repo update wallarm
    ```
=== "إذا كان يتم استخدام مستودع GitHub المستنسخ"
    أضف [مستودع Wallarm Helm](https://charts.wallarm.com/) الذي يحتوي على جميع إصدارات الرسم البياني باستخدام الأمر أدناه. يرجى استخدام مستودع Helm للعمل التالي مع واجهة تحكم Wallarm Ingress.

    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## الخطوة 5: حدّث التكوين `values.yaml`

للانتقال إلى واجهة تحكم Wallarm Ingress 4.10، حدّث التكوين التالي المحدد في الملف `values.yaml`:

* التكوين القياسي لواجهة تحكم Community Ingress NGINX
* تكوين وحدة Wallarm

### التكوين القياسي لواجهة تحكم Community Ingress NGINX

1. تحقق من [ملاحظات الإصدار على واجهة تحكم Community Ingress NGINX](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) 0.27.0 وأعلى وحدد الإعدادات التي يجب تغييرها في الملف `values.yaml`.
2. حدّث الإعدادات المحددة في الملف `values.yaml`.

هناك الإعدادات التالية التي يجب على الأرجح تغييرها:

* [تقرير صحيح لعنوان الأي بي العام لمستخدم النهاية](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md) إذا تم إرسال الطلبات عبر موزع الحمل قبل إرسالها إلى واجهة تحكم Wallarm Ingress.

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [تكوين IngressClasses](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/). تم ترقية الإصدار من API الكوبرنتيس المستخدم في واجهة التحكم Ingress الجديدة التي تتطلب تكوين IngressClasses عبر المعلمات `.controller.ingressClass`, `.controller.ingressClassResource` و `.controller.watchIngressWithoutClass`.

    ```diff
    controller:
    +  ingressClass: waf-ingress
    +  ingressClassResource:
    +    name: waf-ingress
    +    default: true
    +  watchIngressWithoutClass: true
    ```
* [مجموعة معلمات ConfigMap (`.controller.config`)](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/), مثلاً: 

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
* [التحقق من بناء جملة Ingress عبر "admission webhook"](https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration) الآن مُمكَّن بشكل افتراضي.

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "تعطيل التحقق من بناء الجملة لـ Ingress"
        يُوصى بتعطيل التحقق من بناء الجملة لـ Ingress فقط إذا كان يفسد استقرار تشغيل أجسام Ingress. 
* [تنسيق التسمية](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). إذا وضع ملف `values.yaml` قواعد تجانس الحمولات، قم بتغيير تنسيق التسمية في هذه القواعد، مثلاً:

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

### تكوين وحدة Wallarm

قم بتغيير مجموعة تكوين وحدة Wallarm المضبوطة في ملف `values.yaml` كما يلي:

* إذا كانت الترقية من الإصدار 2.18 أو أقل، قم بـ[ترحيل](../migrate-ip-lists-to-node-3.md) تكوين قائمة الأي بي. هناك المعلمات التالية المحتمل حذفها من `values.yaml`:

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    نظرًا لأن منطق الجوهر لقوائم الأي بي تغير بشكل كبير في Wallarm node 3.x، يلزم ضبط التكوين المناسب لقائمة الأي بي.
* تأكد أن السلوك المتوقع للإعدادات المدرجة أدناه يتوافق مع [المنطق المتغير لوضعي الترشيح `off` و `monitoring`](what-is-new.md#filtration-modes):
      
      * [تعليمات `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [قاعدة الترشيح العامة المكونة في Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد الترشيح الهدفية نقطة النهاية المكونة في Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)

      إذا لم يتوافق السلوك المتوقع مع منطق وضع الترشيح المتغير، فالرجاء ضبط [تعليمات Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) و [الإعدادات الأخرى](../../admin-en/configure-wallarm-mode.md) للتغييرات المطلقة.
* التخلص من [تكوين الخدمة المراقبة بشكل صريح](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md). في إصدار واجهة تحكم Wallarm Ingress الجديدة، يتم تمكين الخدمة المراقبة بشكل افتراضي ولا تتطلب أي تكوين إضافي.

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
* إذا كانت الصفحة `&/usr/share/nginx/html/wallarm_blocked.html` المكونة عبر ConfigMap تعود إلى طلبات محظورة، [اضبط تكوينها](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) على التغييرات المطلقة.

    في إصدار العقدة الجديد، لدى الصفحة العادية للحظر بواسطة Wallarm [واجهة مستخدم محدثة](what-is-new.md#new-blocking-page) بدون شعار و عنوان بريد الكتروني للدعم محدد بشكل افتراضي.
* إذا كنت قد قمت بتخصيص كشف الهجوم `overlimit_res` من خلال توجيهات NGINX [`wallarm_process_time_limit`][nginx-process-time-limit-docs] و[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]، يرجى [نقل](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule) هذه الإعدادات إلى القاعدة وحذفها من الملف `values.yaml`.

## الخطوة 6: نقل تكوين كشف الهجوم `overlimit_res` من التوجيهات إلى القاعدة

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## الخطوة 7: تحقق من جميع التغييرات المرتقبة لوثائق K8s

لتجنب تغيير سلوك واجهة تحكم Ingress بشكل غير متوقع، تحقق من جميع التغييرات المرتقبة لوثائق K8s باستخدام [Helm Diff Plugin](https://github.com/databus23/helm-diff). يوفر هذا البرنامج المساعد الفرق بين وثائق K8s لإصدار واجهة تحكم Ingress المنشر والجديد.

لتثبيت وتشغيل البرنامج المساعد:

1. قم بتثبيت البرنامج المساعد:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. قم بتشغيل البرنامج المساعد:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم الإصدار Helm للرسم البياني لـ Ingress controller
    * `<NAMESPACE>`: الفضاء الاسمي الذي يتم نشر Ingress controller فيه
    * `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد [إعدادات واجهة تحكم Ingress 4.10](#step-5-update-the-valuesyaml-configuration)
3. تأكد أن أي تغييرات لا يمكن أن تؤثر على استقرار الخدمات الجارية ودرس الأخطاء بعناية من stdout.

    إذا كان stdout فارغًا، تأكد من أن ملف `values.yaml` صالح.

يرجى ملاحظة التغييرات التالية للتكوين:

* الحقل الثابت، مثل محددات التوزيع و/أو StatefulSet.
* تسميات الحمولة. التغييرات يمكن أن تؤدي إلى إنهاء عملية NetworkPolicy، على سبيل المثال:

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
* تكوين Prometheus ذو التسميات الجديدة، على سبيل المثال:

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
* تحليل جميع التغييرات الأخرى.

## الخطوة 8: ترقية واجهة التحكم Ingress

هناك ثلاث طرق لترقية واجهة تحكم Wallarm Ingress. اعتمادًا على ما إذا كان هناك موزع حمل مثبت في بيئتك، قم باختيار الطريقة للترقية:

* تثبيت واجهة تحكم Ingress موقتة
* إعادة إنشاء الإصدار بشكل عادي
* إعادة إنشاء الإصدار دون التأثير على موزع الحمل

!!! warning "استخدام بيئة التطوير أو minikube"
    إذا كانت Wallarm Ingress تم تركيبها في بيئة التطوير الخاصة بك، يوصى بترقيتها أولاً. مع تشغيل جميع الخدمات بشكل صحيح في بيئة التطوير، يمكنك الانتقال إلى إجراء الترقية في بيئة الإنتاج.

    إلا إذا كان يُوصى بـ[تركيب واجهة تحكم Wallarm Ingress 4.10](../../admin-en/installation-kubernetes-en.md) مع التكوين المحدث باستخدام minikube أو خدمة أخرى أولاً. تأكد من أن جميع الخدمات تعمل كما هو متوقع ثم قم بترقية واجهة التحكم Ingress في بيئة الإنتاج.

    يساعد هذا النهج على تجنب توقف الخدمات في بيئة الإنتاج.

### الطريقة 1: تثبيت واجهة تحكم Ingress موقتة

من خلال استخدام هذه الطريقة، يمكنك تثبيت واجهة تحكم Ingress 4.10 ككيان إضافي في بيئتك والتحويل إلى الحركة تدريجياً. تساعد على تجنب حتى توقف الخدمات مؤقتاً وتضمن الهجرة الآمنة.

1. قم بنسخ تكوين IngressClass من ملف `values.yaml` للإصدار السابق إلى ملف `values.yaml` لواجهة التحكم Ingress 4.10.

    مع هذا التكوين، ستتعرف واجهة التحكم Ingress على أجسام الوصول ولكن لن تقوم بمعالجة حركة مرورها.
2. قم بتثبيت واجهة تحكم Ingress 4.10:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم لإصدار Helm لرسم البياني لواجهة التحكم Ingress
    * `<NAMESPACE>`: الفضاء الاسمي حيث يتم تثبيت واجهة التحكم Ingress
    * `<PATH_TO_VALUES>`: المسار إلى الملف `values.yaml` الذي يحدد [إعدادات واجهة تحكم Ingress 4.10](#step-5-update-the-valuesyaml-configuration)
3. تأكد من أن جميع الخدمات تعمل بشكل صحيح.
4. قم بتحويل الحمولة إلى واجهة تحكم Ingress الجديدة تدريجيًا.

### الطريقة 2: إعادة إنشاء الإصدار بشكل عادي

**إذا كان موزع الحمل وواجهة التحكم Ingress غير موصوفة في نفس رسم الأخطية المصاحب في Helm chart**، يمكنك ببساطة إعادة إنشاء الإصدار. سيستغرق الأمر عدة دقائق وواجهة التحكم Ingress ستكون غير متاحة لهذا الوقت.

!!! warning "إذا كان يوجد تكوين لموزع الحمل في Helm chart"
    إذا كان يوجد تكوين لموزع الحمل إلى جانب واجهة التحكم Ingress في Helm chart، يمكن أن يؤدي إعادة إبداع الإصدار إلى توقف طويل لموزع الحمل (يعتمد على مزود الحوسبة السحابية). قد يتم تغيير عنوان الأي بي لموزع الحمل بعد الترقية إذا لم يتم تعيين عنوان ثابت.

    يرجى تحليل جميع المخاطر الممكنة إذا كنت تستخدم هذه الطريقة.

لإعادة إنشاء إصدار واجهة التحكم Ingress:

=== "Helm CLI"
    1. حذف الإصدار السابق:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: اسم الإصدار Helm للرسم البياني لـ Ingress controller

        * `<NAMESPACE>`: الفضاء الاسمي الذي يتم نشر Ingress controller فيه

        يرجى عدم استخدام الخيار `--wait` عند تنفيذ الأمر لأنه يمكن أن يزيد من وقت الترقية.

    2. قم بإنشاء إصدار جديد مع واجهة التحكم Ingress 4.10:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.3 -f `<PATH_TO_VALUES>`
        ```

        * `<RELEASE_NAME>`: اسم لإصدار Helm لرسم البياني لواجهة التحكم Ingress

        * `<NAMESPACE>`: الفضاء الاسمي حيث يتم تثبيت واجهة التحكم Ingress

        * `<PATH_TO_VALUES>`: المسار إلى الملف `values.yaml` الذي يحدد [إعدادات واجهة تحكم Ingress 4.10](#step-5-update-the-valuesyaml-configuration)
=== "Terraform CLI"
    1. حدد الخيار `wait = false` في تكوين Terraform لتقليل وقت الترقية:
        
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
    
    3. قم بإنشاء الإصدار الجديد مع واجهة التحكم Ingress 4.10:

        ```bash
        terraform apply -target=helm_release.release
        ```

### الطريقة 3: إعادة إنشاء الإصدار من دون التأثير على موزع الحمل

عند استخدام موزع الحمل المكون من الموفر السحابي، يوصى بترقية واجهة التحكم Ingress بهذه الطريقة لأنها لا تؤثر على موزع الحمل.

سوف يستغرق إعادة إبداع الإصدار عدة دقائق وواجهة التحكم Ingress ستكون غير متاحة لهذا الوقت.

1. الحصول على الأجسام التي يجب حذفها (ما عدا موزع الحمل):

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    لتثبيت الأداة `yq`، يرجى استخدام [التعليمات](https://pypi.org/project/yq/).

    سيتم إخراج الأجسام التي يجب حذفها إلى ملف `objects-to-remove.txt`.
2. حذف الأجسام المدرجة وإعادة إنشاء الإصدار:

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.3 -f `<PATH_TO_VALUES>`
    ```

    لتقليل وقت توقف الخدمة، فإنه لا يُوصى بتنفيذ الأوامر بشكل منفصل.
3. تأكد من أن جميع الأجسام مكونة بشكل صحيح:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    يجب أن يقول الناتج أن جميع الأجسام موجودة بالفعل.

هناك المعلمات التالية التي يتم تمريرها في الأوامر:

* `<RELEASE_NAME>`: اسم الإصدار Helm للرسم البياني لـ Ingress controller
* `<NAMESPACE>`: الفضاء الاسمي الذي يتم نشر Ingress controller فيه
* `<PATH_TO_VALUES>`: المسار إلى الملف `values.yaml` الذي يحدد [إعدادات واجهة تحكم Ingress 4.10](#step-5-update-the-valuesyaml-configuration)

## الخطوة 9: اختبار واجهة التحكم Ingress المُرقاة

1. التحقق من أن الإصدار الخاص برسم الأخطية في Helm تم تحديثه:

    ```bash
    helm ls
    ```

    يجب أن يتوافق إصدار الرسم البياني مع `wallarm-ingress-4.10.3`.
2. احصل على قائمة الحمولات التي تحدد اسم واجهة التحكم Ingress في `<INGRESS_CONTROLLER_NAME>`:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    يجب أن يكون حالة كل حمولة **الحالة: التشغيل** أو **جاهز: N/N**. على سبيل المثال:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

3. أرسل الطلب مع الاختبار [Path Traversal](../../attacks-vulns-list.md#path-traversal) الهجوم إلى عنوان واجهة التحكم Ingress:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    إذا كانت العقدة تعمل في وضع `block`، سيرد الرمز `403 Forbidden` كرد على الطلب وسيتم عرض الهجوم في Wallarm Console → **الهجمات**.

## الخطوة 10: ضبط التعليمات البرمجية لـ Ingress حسب التغييرات المطلقة

قم بضبط التعليمات البرمجية التالية لـ Ingress وفقًا للتغييرات المطلقة في واجهة التحكم Ingress 4.10:

1. إذا كانت الترقية من الإصدار 2.18 أو أقل، قم بـ[ترحيل](../migrate-ip-lists-to-node-3.md) تكوين قائمة الأي بي. نظرًا لأن منطق الجوهر لقوائم الأي بي تغير بشكل كافٍ في Wallarm node 3.x، يجب ضبط التكوين الموائم لقائمة الأي بي من خلال تغيير التعليمات البرمجية لـ Ingress (إذا تم تطبيقه).
1. تأكد أن السلوك المتوقع للإعدادات المدرجة أدناه يتوافق مع [المنطق المتغير لوضعي الترشيح `off` و `monitoring`](what-is-new.md#filtration-modes):
      
      * [تعليمات `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [قاعدة الترشيح العامة المكونة في Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد الترشيح الهدفية نقطة النهاية المكونة في Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)

      إذا لم يتوافق السلوك المتوقع مع منطق وضع الترشيح المتغير، فالرجاء ضبط [تعليمات Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) للتغييرات المطلقة.
1. إذا كان الإصدار مشفر بـ `nginx.ingress.kubernetes.io/wallarm-instance`، قم بتغيير هذا التعليم مع البرمجة إلى `nginx.ingress.kubernetes.io/wallarm-application`.

    فقط اسم التعليمات تغير، بينما بقي منطقها كما هو. سيتم إهمال التعليمات بالاسم السابق قريبًا لذا يُوصى بتغيير اسمها قبل ذلك.
1. إذا كانت الصفحة `&/usr/share/nginx/html/wallarm_blocked.html` المكونة عبر تعليمات Ingress تمرة إلى طلبات محظورة، [اضبط تكوينها](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) على التغييرات المطلقة.

    في إصدار تحديث العقدة، لدى الصفحة المعاد حظرها من Wallarm [واجهة مستخدم محدثة](what-is-new.md#new-blocking-page) من دون شعار وعنوان البريد الإلكتروني المدعوم مخصص بشكل افتراضي.

## الخطوة 11: إعادة تمكين وحدة التحقق من التهديد النشط (فقط إذا كانت الترقية للعقدة 2.16 أو أقل)

تعلم [التوصيات على إعداد وحدة التحقق من التهديد النشط](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) وقم بإعادة تمكينها إذا كان مطلوبًا.

بعد فترة، تأكد من أن تشغيل الوحدة لا يسبب إيجادات كاذبة. إذا تم اكتشاف الإيجادات الكاذبة، يرجى الاتصال بـ [دعم فني Wallarm](mailto:support@wallarm.com).