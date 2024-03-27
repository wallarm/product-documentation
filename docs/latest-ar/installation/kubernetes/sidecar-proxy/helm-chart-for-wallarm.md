# قيم خاصة بوالارم لمخطط هيلم الخاص بال Sidecar

هذا المستند يوضح قيم مخطط هيلم الخاصة بوالارم التي يمكنك تغييرها خلال عملية [النشر أو التحديث لوالارم Sidecar](deployment.md) أو [ترقية][sidecar-upgrade-docs]. قيم والارم الخاصة وقيم المخطط الأخرى مخصصة للتهيئة العالمية لمخطط هيلم الخاص بال Sidecar.

!!! معلومات "أولويات الإعدادات العالمية وإعدادات كل بود"
    تعليمات البود [تأخذ الأسبقية](customization.md#configuration-area) على قيم مخطط هيلم.

القسم الخاص بوالارم من ملف [القيم الافتراضية `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) يبدو كالتالي:

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

قيمة توكن عقدة التصفية. هذه مطلوبة للوصول إلى واجهة برمجة تطبيقات والارم.

التوكن يمكن أن يكون من إحدى [الأنواع][node-token-types]:

* **توكن API (موصى به)** - مثالي إذا كنت تحتاج إلى إضافة/إزالة مجموعات العقد ديناميكيًا لتنظيم واجهة المستخدم أو إذا كنت تريد التحكم في دورة حياة التوكن لأمان أعلى. لإنشاء توكن API:

    لإنشاء توكن API:
    
    1. اذهب إلى واجهة والارم → **الإعدادات** → **توكنات API** إما في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. أنشئ توكن API بدور **النشر**.
    1. أثناء نشر العقدة، استخدم التوكن المُنشأ وحدد اسم المجموعة باستخدام معامل `config.wallarm.api.nodeGroup`. يمكنك إضافة عدة عقد إلى مجموعة واحدة باستخدام توكنات API مختلفة.
* **توكن العقدة** - مناسب عندما تعلم بالفعل المجموعات التي ستستخدم.

    لإنشاء توكن العقدة:
    
    1. اذهب إلى واجهة والارم → **العقد** إما في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. أنشئ عقدة وسم مجموعة العقدة.
    1. أثناء نشر العقدة، استخدم توكن المجموعة لكل عقدة تريد إدراجها في تلك المجموعة.

يتم تجاهل العامل إذا كان [`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret).

## config.wallarm.api.host

نقطة النهاية لواجهة برمجة تطبيقات والارم. يمكن أن تكون:

* `us1.api.wallarm.com` ل[السحابة الأمريكية][us-cloud-docs]
* `api.wallarm.com` ل[السحابة الأوروبية][eu-cloud-docs] (الافتراضي)

## config.wallarm.api.nodeGroup

هذا يحدد اسم مجموعة عقد التصفية التي ترغب في إضافة العقد المنشورة حديثًا إليها. تجميع العقد بهذه الطريقة متاح فقط عندما تقوم بإنشاء وربط العقد بالسحابة باستخدام توكن API بدور **النشر** (قيمته مُمررة في معلم `config.wallarm.api.token`).

**القيمة الافتراضية**: `defaultSidecarGroup`

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

بدءًا من إصدار مخطط هيلم 4.4.4، يمكنك استخدام هذه الكتلة التكوينية لسحب قيمة توكن عقدة والارم من أسرار Kubernetes. هذا مفيد للبيئات التي تتعامل مع الأسرار بشكل منفصل (مثل استخدام عامل خارجي للأسرار).

لتخزين توكن العقدة في أسرار K8s وسحبها إلى مخطط هيلم:

1. أنشئ سر Kubernetes مع توكن عقدة والارم:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * إذا اتبعت تعليمات النشر بدون تعديلات، `wallarm-sidecar` هو مساحة الأسماء Kubernetes المُنشأة لإصدار هيلم مع تحكم والارم Sidecar. استبدل الاسم إذا كنت تستخدم مساحة أسماء مختلفة.
    * `wallarm-api-token` هو اسم السر Kubernetes.
    * `<WALLARM_NODE_TOKEN>` هو قيمة توكن عقدة والارم المنسوخة من واجهة المستخدم الخاصة بوالارم.

    إذا كنت تستخدم عاملًا خارجيًا للأسرار، اتبع [التوثيق الملائم لإنشاء سر](https://external-secrets.io).
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

**القيمة الافتراضية**: `existingSecret.enabled: false` التي توجه مخطط هيلم للحصول على توكن عقدة والارم من `config.wallarm.api.token`.

## config.wallarm.fallback

مع القيمة المُعدة على `on` (الافتراضي)، خدمات NGINX لديها القدرة على الدخول في وضع الطوارئ. إذا لم يتمكن من تنزيل proton.db أو مجموعة القواعد الخاصة من سحابة والارم بسبب عدم توفرها، تُعطل هذه الإعدادات وحدة والارم وتُبقي NGINX تعمل.

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

الوضع العالمي ل[تصفية حركة المرور][configure-wallarm-mode-docs]. القيم الممكنة:

* `monitoring` (الافتراضي)
* `safe_blocking`
* `block`
* `off`

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

يدير [القدرة على تجاوز قيم `wallarm_mode` عبر الإعدادات في السحابة][filtration-mode-priorities-docs]. القيم الممكنة:

* `on` (الافتراضي)
* `off`
* `strict`

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

ما إذا كان سيتم التحقق إضافيًا من هجمات الحقن SQL باستخدام مكتبة [libdetection][libdetection-docs]. القيم الممكنة:

* `on` (الافتراضي)
* `off`

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

ما إذا كان سيتم تحليل استجابات التطبيق بحثًا عن الهجمات. القيم الممكنة:

* `on` (الافتراضي)
* `off`

تحليل الاستجابة مطلوب للكشف عن الثغرات الأمنية أثناء [الكشف السلبي][passive-detection-docs] و[التحقق من التهديدات النشطة][active-threat-verification-docs].

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

يُفعل `on` / يُعطل `off` إرسال إحصائيات حول الطلبات من عناوين IP الموجودة في [القائمة السوداء][denylist-docs] من العقدة إلى السحابة.

* مع `config.wallarm.aclExportEnable: "on"` (الافتراضي) سيتم [عرض][denylist-view-events-docs] إحصائيات الطلبات من عناوين IP الموجودة في القائمة السوداء في قسم **الهجمات**.
* مع `config.wallarm.aclExportEnable: "off"` لن يتم عرض إحصائيات الطلبات من عناوين IP الموجودة في القائمة السوداء.

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

والارم يدعم بروتوكول WebSockets بشكل كامل. بشكل افتراضي، لا يتم تحليل رسائل WebSockets بحثًا عن الهجمات. لتفعيل الميزة، فعل خطة الاشتراك في أمان الواجهة البرمجية [subscription plan][subscriptions-docs] واستخدم هذا الإعداد.

القيم الممكنة:

* `on`
* `off` (الافتراضي)

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

ما إذا كان سيتم فك ضغط البيانات المضغوطة المُرجعة في استجابات التطبيق:

* `on` (الافتراضي)
* `off`

[**تعليمة البود**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## postanalytics.external.enabled

يحدد ما إذا كان سيتم استخدام وحدة والارم postanalytics (Tarantool) المثبتة على مضيف خارجي أو تلك المثبتة أثناء نشر حلول Sidecar.

هذه الميزة مدعومة بدءًا من إصدار هيلم 4.6.4.

القيم الممكنة:

* `false` (الافتراضي): استخدم وحدة postanalytics التي تم نشرها بواسطة حلول Sidecar.
* `true`: إذا تم تفعيلها، يرجى توفير العنوان الخارجي لوحدة postanalytics في قيم `postanalytics.external.host` و `postanalytics.external.port`.

  إذا تم تعيينه على `true`، لا تقوم حلول Sidecar بتشغيل وحدة postanalytics، لكنها تتوقع الوصول إليها في `postanalytics.external.host` و `postanalytics.external.port` المحددين.

## postanalytics.external.host

نطاق أو عنوان IP لوحدة postanalytics المثبتة بشكل منفصل. هذا الحقل مطلوب إذا تم ضبط `postanalytics.external.enabled` على `true`.

هذه الميزة مدعومة بدءًا من إصدار هيلم 4.6.4.

قيم المثال: `tarantool.domain.external` أو `10.10.0.100`.

يجب أن يكون العنوان المُحدد قابلًا للوصول من مجموعة Kubernetes حيث يتم نشر مخطط هيلم الخاص بال Sidecar.

## postanalytics.external.port

المنفذ TCP الذي تعمل عليه وحدة والارم postanalytics. بشكل افتراضي، يتم استخدام المنفذ 3313 حيث يتم نشر الوحدة على هذا المنفذ بواسطة حلول Sidecar.

إذا تم ضبط `postanalytics.external.enabled` على `true`، حدد المنفذ الذي تعمل عليه الوحدة على العنوان الخارجي المُحدد.