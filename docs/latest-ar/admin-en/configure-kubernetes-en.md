[link-helm-chart-details]:  https://github.com/wallarm/ingress-chart#configuration
[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# التكوين الدقيق لـ Wallarm Ingress Controller المستند إلى NGINX 

تعرف على خيارات التكوين الدقيق المتاحة لوحدة التحكم Wallarm Ingress للحصول على الحد الأقصى من حل Wallarm.

!!! info "التوثيق الرسمي لـ NGINX Ingress Controller"
    التكوين الدقيق لـ Wallarm Ingress Controller مشابه إلى حد كبير لـ NGINX Ingress Controller والذي ذكر في [التوثيق الرسمي](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/). عند العمل مع Wallarm، تكون جميع الخيارات لإعداد نص الأصلي NGINX Ingress Controller متاحة.

## إعدادات إضافية لـ Helm Chart

يتم تعريف الإعدادات في ملف [`values.yaml`](https://github.com/wallarm/ingress-chart/blob/master/wallarm-ingress/values.yaml). بشكل افتراضي، يظهر الملف على النحو التالي:

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

        ## List of IP addresses at which the stats-exporter service is available
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

لتغيير هذا الإعداد، نوصي باستخدام الخيار `--set` من `helm install` (إذا كان يتم تثبيت وحدة التحكم Ingress) أو `helm upgrade` (إذا كان يتم تحديث معلمات وحدة التحكم Ingress المثبتة). على سبيل المثال:

=== "تثبيت وحدة التحكم Ingress"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "تحديث معلمات وحدة التحكم Ingress"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

يتم تقديم وصف للمعلمات الرئيسية التي يمكنك إعدادها أدناه. تأتي المعلمات الأخرى بقيم افتراضية ونادراً ما تحتاج إلى تغييرها؛ تتوفر أوصافها في هذا [الرابط][link-helm-chart-details].

### controller.wallarm.enabled

يتيح لك تمكين أو تعطيل وظائف Wallarm.

**القيمة الافتراضية**: `false`

### controller.wallarm.apiHost

نقطة النهاية لواجهة Wallarm API. يمكن أن يكون:

* `us1.api.wallarm.com` لـ [US cloud](../about-wallarm/overview.md#us-cloud).
* `api.wallarm.com` لـ [EU cloud](../about-wallarm/overview.md#eu-cloud),

**القيمة الافتراضية**: `api.wallarm.com`

### controller.wallarm.token

قيمة رمز العقدة التصفية. هو مطلوب للوصول إلى واجهة Wallarm API.

يمكن أن يكون الرمز أحد هذه [الأنواع][node-token-types]:

* **رمز API (موصى به)** - مثالي إذا كنت بحاجة إلى إضافة / إزالة مجموعات العقدة بشكل ديناميكي لتنظيم واجهة المستخدم أو إذا كنت ترغب في التحكم في دورة حياة الرمز لزيادة الأمان. لتوليد رمز API:

    لتوليد رمز API:

    1. اذهب إلى وحدة تحكم Wallarm → **Settings** → **API tokens** في إما [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) أو [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. أنشئ رمز API بدور **Deploy**.
    1. أثناء نشر العقدة، استخدم الرمز المولد وحدد اسم المجموعة باستخدام المعلمة `controller.wallarm.nodeGroup`. يمكنك إضافة العديد من العقد إلى مجموعة واحدة باستخدام رموز API مختلفة.
* **رمز العقدة** - مناسب عندما تعرف بالفعل المجموعات العقدة التي ستُستخدم.

    لتوليد رمز العقدة:

    1. اذهب إلى وحدة تحكم Wallarm → **Nodes** في إما [US Cloud](https://us1.my.wallarm.com/nodes) أو [EU Cloud](https://my.wallarm.com/nodes).
    1. أنشئ عقدة وسمِ مجموعة العقدة.
    1. أثناء نشر العقدة، استخدم رمز المجموعة عند كل عقدة تريد تضمينها في تلك المجموعة.

يتم تجاهل المعلمة إذا كانت [`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret).

**القيمة الافتراضية**: `لم يُحدد`

### controller.wallarm.nodeGroup

بدءًا من إصدار Helm chart 4.6.8، يُحدد هذا اسم مجموعة العقد التصفية التي تريد إضافة العقد المنشورة حديثًا إليها. إن تجميع العقد بهذه الطريقة متاح فقط عندما تقوم بإنشاء وربط العقد بالسحابة باستخدام رمز API بدور **Deploy** (يتم تمرير قيمته في المعلمة `controller.wallarm.token`).

**القيمة الافتراضية**: `defaultIngressGroup`

### controller.wallarm.existingSecret

بدءًا من إصدار Helm chart 4.4.1 ، يمكنك استخدام كتلة التكوين هذه لسحب قيمة رمز العقدة Wallarm من أسرار Kubernetes. من المفيد للبيئات ذات الإدارة المنفصلة للأسرار (مثل إذا كنت تستخدم عامل أسرار خارجي).

لتخزين رمز العقدة في أسرار K8s وسحبه إلى الرسم البياني لـ Helm:

1. قم بإنشاء سر Kubernetes مع رمز العقدة Wallarm:
    
    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>` هو الفضاء الاسمي Kubernetes الذي قمت بإنشائه للإصدار Helm مع وحدة التحكم Wallarm Ingress
    * `wallarm-api-token` هو اسم سر Kubernetes
    * `<WALLARM_NODE_TOKEN>` هو قيمة رمز العقدة Wallarm المنسوخة من واجهة المستخدم Wallarm Console

    إذا كنت تستخدم بعض عامل الأسرار الخارجي، اتبع [الوثائق المناسبة لإنشاء سر](https://external-secrets.io).
1. ضع التكوين التالي في `values.yaml`:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**القيمة الافتراضية**: `existingSecret.enabled: false` التي تنطلق إلى الرسم البياني البياني للحصول على رمز العقدة Wallarm من `controller.wallarm.token`.

### controller.wallarm.tarantool.replicaCount

عدد الأحداث المتداولة لـ postanalytics. يتم استخدام postanalytics للكشف عن الهجمات المستندة إلى السلوك.

**القيمة الافتراضية**: `1`

### controller.wallarm.tarantool.arena

تحدد كمية الذاكرة المخصصة لخدمة postanalytics. يوصى بتحديد قيمة كافية لتخزين بيانات الطلب للـ 5-15 دقيقة الأخيرة.

**القيمة الافتراضية**: `0.2`

### controller.wallarm.metrics.enabled

هذا التبديل [يتحول بين](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) جمع المعلومات والمقاييس. إذا تم تثبيت [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) في مجموعة Kubernetes، لا يتطلب التكوين الإضافي.

**القيمة الافتراضية**: `false`

<!--
### controller.wallarm.apifirewall

Controls the configuration of [API Policy Enforcement](../api-policy-enforcement/overview.md), available starting from release 4.10. By default, it is enabled and configured as shown below. If you are using this feature, it is recommended to keep these values unchanged.

```yaml
controller:
  wallarm:
    apiFirewall:
      ### Enable or disable API Firewall functionality (true|false)
      ###
      enabled: true
      config:
        mainPort: 18081
        healthPort: 18082
        specificationUpdatePeriod: 1m
        unknownParametersDetection: true
        #### TRACE|DEBUG|INFO|WARNING|ERROR
        logLevel: DEBUG
        ### TEXT|JSON
        logFormat: TEXT
      ...
```
-->

## إعدادات الوحدة التحكم العالمية 

مستندًا عبر [ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/).

بجانب المعياريات ، يتم دعم المعلمات الإضافية التالية:

* `enable-wallarm` - يتيح وحدة Wallarm في NGINX
* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## التعليقات المنسوبة لـ Ingress

تُستخدم هذه التعليقات لضبط معلمات لمعالجة مثيلات فردية لـ Ingress.

[Besides the standard ones](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), الإعدادات الإضافية المدعومة هي:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode), القيمة الافتراضية: `"off"`
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### تطبيق التعليق المنسوب على مورد Ingress

لتطبيق الإعدادات على Ingress الخاص بك، يرجى استخدام الأمر التالي:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` هو اسم Ingress الخاص بك
* `<YOUR_INGRESS_NAMESPACE>` هو مجال اسم Ingress الخاص بك
* `<ANNOTATION_NAME>` هو اسم التعليق المنسوب من القائمة أعلاه
* `<VALUE>` هو قيمة التعليق المنسوب من القائمة أعلاه

### أمثلة على التعليقات المنسوبة

#### تكوين الصفحة القابلة للحظر ورمز الخطأ

يُستخدم التعليق المنسوب `nginx.ingress.kubernetes.io/wallarm-block-page` لتكوين الصفحة القابلة للحظر ورمز الخطأ المرتجع في الرد على الطلب المحظور للأسباب التالية:

* يحتوي الطلب على أحمال ضارة من الأنواع التالية: [هجمات التحقق من الإدخال](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [هجمات vpatch](../user-guides/rules/vpatch-rule.md), أو [هجمات مكتشفة بناءً على التعبيرات العادية](../user-guides/rules/regex-rule.md).
* الطلب الذي يحتوي على أحمال ضارة من القائمة أعلاه ينشأ من عنوان IP في ال [قائمة الرمادية](../user-guides/ip-lists/overview.md) والعقدة تُصفي الطلبات في [وضع](configure-wallarm-mode.md) الحظر الآمن.
* الطلب ينشأ من [denylisted IP address](../user-guides/ip-lists/overview.md).

على سبيل المثال، لإرجاع صفحة الحظر الافتراضية لـ Wallarm ورمز الخطأ 445 في الرد على أي طلب تم حظره:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[المزيد من التفاصيل حول أساليب تكوين الصفحة المحظورة ورمز الخطأ →](configuration-guides/configure-block-page-and-code.md)

#### إدارة وضع libdetection

!!! info "وضع **libdetection** الافتراضي"
    الوضع الافتراضي لمكتبة **libdetection** هو `on` (مكَّن).

يمكنك التحكم في وضع [**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection) باستخدام أحد الخيارات:
* تطبيق التعليق المنسوب  [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) التالي على مورد Ingress:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection on/off;"
    ```

* أضف المعلمة `controller.config.server-snippet` إلى الرسم البياني لـ Helm:

    === "تثبيت وحدة التحكم Ingress"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        هناك أيضًا [معلمات أخرى](#additional-settings-for-helm-chart) مطلوبة لتثبيت وحدة التحكم Ingress بشكل صحيح. يرجى تمريرها في الخيار `--set` أيضًا.
    === "تحديث معلمات وحدة التحكم Ingress"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
