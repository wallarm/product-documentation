[link-helm-chart-details]:  https://github.com/wallarm/ingress-chart#configuration
[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# ضبط مُضبط Wallarm Ingress المُستند إلى NGINX 

تعرف على خيارات الضبط الدقيقة المتاحة لـ Wallarm Ingress للحصول على أقصى استفادة من حل Wallarm.

 !!! معلومات "التوثيق الرسمي لـ NGINX Ingress Controller" 
 ضبط Wallarm Ingress Controller مشابه جدًا لـ NGINX Ingress Controller المُوَصَّف في [التوثيق الرسمي](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/). عند العمل مع Wallarm، تتوفر جميع الخيارات لإعداد NGINX Ingress Controller الأصلي.

## إعدادات إضافية لـ Helm Chart

تم تعريف إعدادات في الملف [`values.yaml`](https://github.com/wallarm/ingress-chart/blob/master/wallarm-ingress/values.yaml). بشكل افتراضي ، يبدو الملف على النحو التالي:

```
controller:
  wallarm:
    enabled: false
    apiHost: api.wallarm.com
    apiPort: 443
    apiSSL: true
    token: ""
    nodeGroup: defaultIngressGroup
    existingSecret:
      enabled: false
      secretKey: token
      secretName: wallarm-api-token
    tarantool:
      kind: Deployment
      service:
        annotations: {}
      replicaCount: 1
      arena: "1.0"
      livenessProbe:
        failureThreshold: 3
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      resources: {}
    metrics:
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## قائمة عناوين IP التي يتوفر فيها خدمة stats-exporter
        ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    synccloud:
      resources: {}
    collectd:
      resources: {}
```

لتغيير هذا الإعداد ، نوصي باستخدام الخيار `--set` من `helm install` (إذا كنت تقوم بتثبيت وحدة التحكم Ingress) أو `helm upgrade` (إذا كنت تقوم بتحديث معلمات وحدة التحكم Ingress المثبتة). على سبيل المثال:

=== "تثبيت وحدة التحكم لـ Ingress"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

=== "تحديث معلمات وحدة التحكم لـ Ingress"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

ويتم توفير وصف للمعايير الرئيسية التي يمكنك إعدادها أدناه. تأتي المعايير الأخرى بقيم افتراضية ونادراً ما تحتاج إلى تغيير ؛ يتم توفير أوصافهم في هذا [link][link-helm-chart-details].

### controller.wallarm.enabled

يتيح لك تمكين أو تعطيل وظائف Wallarm.

**القيمة الافتراضية**: `false`

### controller.wallarm.apiHost

نقطة النهاية الخاصة بـ Wallarm API. يمكن أن يكون:

* `us1.api.wallarm.com` لـ [US cloud](../about-wallarm/overview.md#us-cloud).
* `api.wallarm.com` لـ [EU cloud](../about-wallarm/overview.md#eu-cloud),

**القيمة الافتراضية**: `api.wallarm.com`

### controller.wallarm.token

قيمة رمز عقدة التصفية. مطلوب للوصول إلى Wallarm API.

يمكن أن يكون الرمز أحد هذه [الأنواع][node-token-types]:

* **رمز API (موصى به)** - مثالي إذا كنت بحاجة إلى إضافة / إزالة مجموعات العقد بشكل ديناميكي لتنظيم واجهة المستخدم أو إذا كنت ترغب في التحكم في دورة حياة الرمز من أجل الأمان المضاف. لإنشاء رمز API:

    لإنشاء رمز API:

    1. انتقل إلى Wallarm Console → **الإعدادات** → **API tokens** في ال [سحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. أنشئ رمز API بدور المصدر **Deploy**.
    1. أثناء توزيع العقدة ، استخدم الرمز المُنشأ وحدد اسم المجموعة باستخدام المعلمة `controller.wallarm.nodeGroup`. يمكنك إضافة العديد من العقد إلى مجموعة واحدة باستخدام رموز API مختلفة.

* **Node token** - مناسب عندما تعرف بالفعل مجموعات العقد التي سيتم استخدامها.

    لإنشاء رمز عقدة:
    
    1. انتقل إلى Wallarm Console → **عقد** في ال [سحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. أنشئ عقدة واسم مجموعة العقد.
    1. أثناء توزيع العقدة ، استخدم رمز المجموعة لكل عقدة ترغب في تضمينها في تلك المجموعة.

يتم تجاهل المعلمة إذا كانت [`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret).

**القيمة الافتراضية**: `غير محدد`

### controller.wallarm.nodeGroup

ابتداءً من نسخة Helm chart 4.6.8 ، يحدد هذا اسم مجموعة العقد التي ترغب في إضافة العقد المُوزعة حديثًا إليها. يتوفر تجميع العقد بهذه الطريقة فقط عند إنشاء العقد وتوصيلها بالسحابة باستخدام رمز API بدور **Deploy** (يتم تمرير قيمته في المعلمة `controller.wallarm.token`).

**القيمة الافتراضية**: `defaultIngressGroup`

### controller.wallarm.existingSecret

ابتداءً من نسخة الرسم التوضيحي Helm 4.4.1 ، يمكنك استخدام كتلة التكوين هذه لسحب قيمة عقدة Wallarm من أسرار Kubernetes. إنه مفيد للبيئات ذات إدارة الأمان المنفصلة (مثل استخدامك لمشغل الأسرار الخارجي).

لتخزين العقدة في أسرار K8s وسحبها إلى الرسم التوضيحي لـ Helm:

1. أنشئ سرًا Kubernetes مع العقدة Wallarm :

    ```bash
    kubectl -n<KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>` هو المجال الذي أنشأته لإطلاق Helm مع وحدة التحكم Wallarm Ingress
    * `wallarm-api-token` هو اسم السر لـ Kubernetes
    * `<WALLARM_NODE_TOKEN>` هو قيمة العقدة Wallarm المُنسوخة من واجهة Wallarm Console UI

    إذا كنت تستخدم بعض المُشغل السري الخارجي ، فاتبع [الوثائق المناسبة لإنشاء سر](https://external-secrets.io).
1. قم بتعيين التكوين التالي في `values.yaml`:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**القيمة الافتراضية**: `existingSecret.enabled: false` التي تشير إلى الرسم التوضيحي Helm للحصول على عقدة Wallarm من `controller.wallarm.token`.

### controller.wallarm.tarantool.replicaCount

عدد الأجهزة الظاهرية المشتغلة للبرمجيات النحلية. يُستخدم للكشف عن الهجمات المستندة إلى السلوك.

**القيمة الافتراضية**: `1`

### controller.wallarm.tarantool.arena

يحدد كمية الذاكرة المخصصة لخدمة البرمجيات النحلية. يُفضل إعداد قيمة كافية لتخزين بيانات الطلب في آخر 5-15 دقيقة.

**القيمة الافتراضية**: `0.2`

### controller.wallarm.metrics.enabled

يُصيب هذا المفتاح [تجميع](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) المعلومات وجمع القياسات. إذا تم تثبيت [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) في مجموعة Kubernetes ، فلا يلزم أي تكوين إضافي.

**القيمة الافتراضية**: `false`
<!--
### controller.wallarm.apifirewall

يتحكم في تكوين [ حماية السياسات لـ API](../api-policy-enforcement/overview.md) ، متاح ابتداءً من الإصدار 4.10. بشكل افتراضي ، هو ممكّن ومكون على النحو الموضح أدناه. إذا كنت تستخدم هذه الميزة ، فمن المستحسن الاحتفاظ بتلك القيم دون تغيير.

```yaml
controller:
  wallarm:
    apiFirewall:
      ### تمكين أو تعطيل وظائف جدار الحماية API (true|false)
      ###
      enabled: true
      config:
        mainPort: 18081
        healthPort: 18082
        specificationUpdatePeriod: 1m
        unknownParametersDetection: true
        #### TRACE|DEBUG|INFO|WARNING|ERROR
        logLevel: DEBUG
        ###TEXT|JSON
        logFormat: TEXT
      ...
```
-->

## الإعدادات العامة للمُتحكم 

تم تنفيذها عبر [ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/).

بالإضافة إلى القياسية ، يتم دعم المعلمات الإضافية التالية:

* `enable-wallarm` - يمكن أو يعطل وحدة Wallarm في NGINX
* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## توضيحات Ingress

تُستخدم هذه التوضيحات لإعداد مُعالجات الحالات الفردية لـ Ingress.

[بالإضافة إلى القياسية](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/) ، تُدعم التوضيحات الإضافية التالية:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode) ، القيمة الافتراضية: `"off"`
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### تطبيق التوضيح على مورد Ingress

لتطبيق الإعدادات على Ingress الخاص بك ، يُرجى استخدام الأمر التالي:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` هو اسم Ingress الخاص بك
* `<YOUR_INGRESS_NAMESPACE>` هو المجال الاسمي لـ Ingress الخاص بك
* `<ANNOTATION_NAME>` هو اسم التوضيح من القائمة أعلاه
* `<VALUE>` هو قيمة التوضيح من القائمة أعلاه

### أمثلة التوضيح

#### تكوين صفحة الحظر ورمز الخطأ

يُستخدم التوضيح `nginx.ingress.kubernetes.io/wallarm-block-page` لتكوين صفحة الحظر ورمز الخطأ الذي يُعاد في الرد على الطلب المحظور لأسباب تتضمن:

* الطلب يحتوي على حمولات ضارة من الأنواع التالية: [هجمات التحقق من صحة الإدخال](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)، [هجمات vpatch](../user-guides/rules/vpatch-rule.md)، أو [هجمات تم اكتشافها بناءً على التعبيرات العادية](../user-guides/rules/regex-rule.md).
* يتم توجيه الطلب الذي يحتوي على حمولات ضارة من القائمة أعلاه من عنوان [IP رمادي](../user-guides/ip-lists/overview.md) والعقدة تُنقي الطلبات في وضع الحظر الآمن [الوضع](configure-wallarm-mode.md).
* يتم توجيه الطلب من عنوان [IP من القائمة التالية](../user-guides/ip-lists/overview.md).

على سبيل المثال ، لإرجاع صفحة حظر افتراضية من Wallarm ورمز الخطأ 445 في الرد على أي طلب محظور:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[المزيد من التفاصيل حول طرق تكوين صفحة الحظر ورمز الخطأ →](configuration-guides/configure-block-page-and-code.md)

#### إدارة وضع libdetection

!!! معلومات "إعدادات الوضع الافتراضي لـ libdetection"
 الوضع الافتراضي لمكتبة **libdetection** هو `on` (تمكين).

يمكنك التحكم في وضع [**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection) باستخدام أحد الخيارات:

* تطبيق التوضيح [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) التالي على مورد Ingress:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection on/off;"
    ```
* تمرير المعلمة `controller.config.server-snippet` إلى الرسم التوضيحي لـ Helm:

    === "تثبيت وحدة التحكم لـ Ingress"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        هناك أيضًا [معلمات أخرى](#additional-settings-for-helm-chart) مطلوبة لتثبيت وحدة التحكم Ingress بشكل صحيح. يُرجى تمريرهم في الخيار `--set` أيضًا.
    === "تحديث معلمات وحدة التحكم لـ Ingress"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
