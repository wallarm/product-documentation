# القيم الخاصة بـ Wallarm لرسم الخرائط Helm لـ Sidecar

هذا المستند يصف قيم الخريطة Helm الخاصة بـ Wallarm التي يمكنك تغييرها أثناء [التثبيت Sidecar من Wallarm](deployment.md) أو [الترقية][sidecar-upgrade-docs]. تتواجد القيم الخاصة بـ Wallarm والقيم الأخرى للخريطة لتكوين ال Sidecar Helm chart بشكل عام.

!!! info "أولويات الإعدادات العامة و لكل برمجية"
    الإعدادات الخاصة بكل برمجية [لها الأولوية](customization.md#configuration-area) على قيم الخرائط Helm.

يظهر الجزء الخاص بـ Wallarm من [الـ `values.yaml` الافتراضي](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) كما يلي:

```yaml
config:
  wallarm:
    api:
      token: ""
      host: api.wallarm.com
      port: 443
      useSSL: true
      caVerify: true
      nodeGroup: "defaultSidecarGroup"
      existingSecret:
        enabled: false
        secretKey: token
        secretName: wallarm-api-token
    fallback: "on"
    mode: monitoring
    modeAllowOverride: "on"
    enableLibDetection: "on"
    parseResponse: "on"
    aclExportEnable: "on"
    parseWebsocket: "off"
    unpackResponse: "on"
    ...
postanalytics:
  external:
    enabled: false
    host: ""
    port: 3313
  ...
```

## config.wallarm.api.token

هذا يمثل قيمة الرمز المميز للعقدة الفلترة. إنه مطلوب للوصول إلى Wallarm API.

يمكن أن يكون الرمز المميز أحد هذه الأنواع [الأنواع][node-token-types]:

* **رمز API (مستحسن)** - مثالي إذا كنت بحاجة إلى إضافة أو إزالة مجموعات العقد بشكل ديناميكي لتنظيم الواجهة الرسومية للمستخدم أو إذا كنت ترغب في التحكم في دورة حياة الرمز المميز للأمان الإضافي. لإنشاء رمز API:

    لإنشاء رمز API:
    
    1. اذهب إلى Wallarm Console → **الإعدادات** → **رموز API** في أي من [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. قم بإنشاء رمز API بدور المصدر **Deploy**.
    1. أثناء تثبيت العقدة، استخدم الرمز المميز المُنشأ وقم بتحديد اسم المجموعة باستخدام العنصر `config.wallarm.api.nodeGroup`. يمكنك إضافة عدة عقد إلى مجموعة واحدة باستخدام رموز API مختلفة.
* **رمز العقدة** - مناسب عندما تعرف بالفعل مجموعات العقد التي ستُستخدم.

    لإنشاء رمز للعقدة:
    
    1. اذهب إلى Wallarm Console → **العقد** في أي من [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. قم بإنشاء العقدة وأسم المجموعة الخاصة بالعقدة.
    1. أثناء تثبيت العقدة، استخدم رمز المجموعة لكل عقدة ترغب في تضمينها في تلك المجموعة.

المعلمة تُتجاهل إذا كانت [`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret).

## config.wallarm.api.host

نقطة النهاية لـ Wallarm API. يمكن أن يكون:

* `us1.api.wallarm.com` لـ [السحابة الأمريكية][us-cloud-docs]
* `api.wallarm.com` لـ [السحابة الأوروبية][eu-cloud-docs] (الافتراضي)

## config.wallarm.api.nodeGroup

هذا يحدد اسم مجموعة العقد الفلترة التي ترغب في إضافة العقد المُنشأة حديثًا إليها. تكون تجميع العقد بهذه الطريقة متاحة فقط عندما تقوم بإنشاء وربط العقد بالسحابة باستخدام الرمز المميز لـ API بالدور **Deploy** (يتم تمرير قيمته في العنصر `config.wallarm.api.token`).

**القيمة الافتراضية**: `defaultSidecarGroup`

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

بدءًا من النسخة 4.4.4 من الخريطة Helm، يمكنك استخدام كتلة التكوين هذه لسحب قيمة رمز العقدة من Wallarm من الأسرار Kubernetes. إنه مفيد للبيئات ذات إدارة الأسرار المنفصلة (مثل استخدامك لمشغل الأسرار الخارجي).

لتخزين رمز العقدة في الأسرار K8s وسحبه إلى الخريطة Helm:

1. أنشئ سريّة Kubernetes مع رمز العقدة من Wallarm:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * إذا قمت باتباع تعليمات التثبيت بدون تعديلات، فإن `wallarm-sidecar` هو مكان الاسم Kubernetes الذي تم إنشاؤه للإصدار Helm مع وحدة التحكم Wallarm Sidecar. استبدل الاسم إذا كنت تستخدم فضاء الأسماء المختلف.
    * `wallarm-api-token` هو اسم السرية Kubernetes.
    * `<WALLARM_NODE_TOKEN>` هو قيمة الرمز المميز للعقدة والتي تم نسخها من واجهة Wallarm Console.

    إذا كنت تستخدم بعض المشغلات السرية الخارجية، فاتبع [التعليمات المناسبة لإنشاء سرية](https://external-secrets.io).
1. قم بتعيين التكوين التالي في `values.yaml`:

    ```yaml
    config:
      wallarm:
        api:
          token: ""
          existingSecret:
            enabled: true
            secretKey: token
            secretName: wallarm-api-token
    ```

**القيمة الافتراضية**: `existingSecret.enabled: false` التي تشير إلى الرسم البياني لل Helm sample للحصول على رمز العقدة من Wallarm من `config.wallarm.api.token`.

## config.wallarm.fallback

عند تعيين القيمة إلى `on` (الافتراضي)، تكون لدى خدمات NGINX القدرة على دخول الوضع الطارئ. إذا لم يتم تحميل proton.db أو مجموعة القواعد المخصصة من سحابة Wallarm بسبب عدم توفرها، يعطل هذا الإعداد وحدة Wallarm ويبقي NGINX قيد التشغيل.

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

الوضع العام [لترشيح الحركة][configure-wallarm-mode-docs]. القيم الممكنة:

* `monitoring` (افتراضي)
* `safe_blocking`
* `block`
* `off`

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

يدير [القدرة على تجاوز القيم `wallarm_mode` عبر الإعدادات في السحابة][filtration-mode-priorities-docs]. القيم الممكنة:

* `on` (افتراضي)
* `off`
* `strict`

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

هل ترغب في التحقق بالإضافة من هجمات SQL Injection باستخدام مكتبة [libdetection][libdetection-docs]. القيم الممكنة:

* `on` (افتراضي)
* `off`

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

هل ترغب في تحليل ردود التطبيق للاعتداءات. القيم الممكنة:

* `on` (افتراضي)
* `off`

تحليل الاستجابة مطلوب للكشف عن الثغرات خلال [الكشف السلبي][passive-detection-docs] و [التحقق من التهديد النشط][active-threat-verification-docs].

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

يتيح `on` / يعطل `off` إرسال الإحصائيات حول الطلبات من [انكار الوصول][denylist-docs] IPs من العقدة إلى السحابة.

* مع `config.wallarm.aclExportEnable: "on"` (افتراضي) ستظهر الإحصائيات على الطلبات من IP المدرجة في القائمة السوداء في القسم [**الهجمات**][denylist-view-events-docs].
* مع `config.wallarm.aclExportEnable: "off"` لن تظهر الإحصائيات على الطلبات من IP المدرجة في القائمة السوداء.

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

لـ Wallarm دعم كامل لـ WebSockets. بشكل افتراضي، لا يتم تحليل رسائل WebSockets للاعتداءات. لفرض الميزة، فعل خطة الاشتراك[API Security][subscriptions-docs] واستخدم هذا الإعداد.

القيم الممكنة:

* `on`
* `off` (افتراضي)

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

هل ترغب في فك ضغط البيانات المضغوطة العائدة في رد التطبيق:

* `on` (افتراضي)
* `off`

[**توصيف البرمجية**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## postanalytics.external.enabled

يحدد ما إذا كان سيتم استخدام وحدة Wallarm postanalytics (Tarantool) المثبتة على مضيف خارجي أو تلك التي تم تثبيتها أثناء تثبيت حل Sidecar.

يتم دعم هذه الميزة بدءًا من إصدار 4.6.4 من Helm.

القيم الممكنة:

* `false` (افتراضي): استخدم وحدة postanalytics التي تم تثبيتها بواسطة حل Sidecar.
* `true`: إذا تم تمكينه، يرجى تزويد العنوان الخارجي لوحدة postanalytics في القيم `postanalytics.external.host` و `postanalytics.external.port`.

  إذا تم تعيينها إلى `true`، فإن حل Sidecar لا يقوم بتشغيل وحدة postanalytics، ولكنه يتوقع الوصول إليها في `postanalytics.external.host` و `postanalytics.external.port` المحددة.

## postanalytics.external.host

المجال أو عنوان IP لوحدة postanalytics المثبت بشكل منفصل. هذا الحقل مطلوب إذا تم تعيين `postanalytics.external.enabled` على `true`.

يتم دعم هذه الميزة بدءًا من إصدار 4.6.4 من Helm.

القيم المثالية: `tarantool.domain.external` أو `10.10.0.100`.

يجب أن يكون المضيف المحدد قابلاً للوصول من مجموعة Kubernetes حيث يتم نشر الخريطة Helm للـ Sidecar.

## postanalytics.external.port

المنفذ TCP الذي تعمل عليه وحدة Wallarm postanalytics. بشكل افتراضي، يستخدم المنفذ 3313 حيث يتم نشر الحل Sidecar على هذا المنفذ.

إذا تم تعيين `postanalytics.external.enabled` إلى `true`، حدد المنفذ الذي تعمل عليه الوحدة على المضيف الخارجي المحدد.