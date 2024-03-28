# تخصيص وحدة تحكم كونج المتكاملة مع خدمات Wallarm

توجهكم هذه المقالة إلى تخصيص وحدة تحكم كونج بشكل آمن وفعال مع خدمات Wallarm المتكاملة [كونج-إنج-كونترولر-كاستوميزيشن-دوكس].

## مجال التكوين

تعتمد وحدة تحكم كونج مع خدمات Wallarm المتكاملة على مكونات كوبرنيتس القياسية، وبالتالي فإن تكوين الحل يشابه إلى حد كبير تكوين مجموعة كوبرنيتس.

يمكن تكوين الحل على النحو التالي:

* عالميًا عبر `values.yaml` - يتيح ضبط تكوين النشر العام، بوابة API كونج وبعض إعدادات Wallarm الأساسية. تنطبق هذه الإعدادات على جميع موارد إنجرس التي يقوم الحل بتوجيه حركة المرور إليها.
* عبر تعليقات إنجرس - يتيح الضبط الدقيق لإعدادات Wallarm على أساس كل إنجرس.

    !!! تحذير "دعم التعليق"
        التعليق الخاص بإنجرس مدعوم فقط بالحل القائم على وحدة تحكم إنجرس كونج مفتوح المصدر. [قائمة التعليقات المدعومة محدودة](#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* عبر واجهة استخدام Wallarm Console - يتيح الضبط الدقيق لإعدادات Wallarm.

## تكوين بوابة API كونج

يتم تعيين تكوين وحدة تحكم كونج لبوابة API كونج بواسطة [قيم الرسم البياني هيلم الافتراضية](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml). يمكن تجاوز هذا التكوين بواسطة ملف `values.yaml` المقدم من المستخدم أثناء `helm install` أو `helm upgrade`.

لتخصيص قيم الرسم البياني هيلم الافتراضية، تعرف على [التعليمات الرسمية حول تكوين كونج ووحدة التحكم بإنجرس](https://github.com/Kong/charts/tree/main/charts/kong#configuration).

## تكوين طبقة Wallarm

يمكنك تكوين طبقة Wallarm للحل على النحو التالي:

* ضبط التكوين الأساسي عبر `values.yaml`: الاتصال بـ Wallarm Cloud، تخصيص الموارد، الاحتياطيات.
* الضبط الدقيق لتحليل حركة المرور على أساس كل إنجرس عبر التعليقات (فقط للإصدار مفتوح المصدر): وضع تصفية حركة المرور، إدارة التطبيق، تكوين التعددية، إلخ.
* الضبط الدقيق لتحليل حركة المرور عبر واجهة استخدام Wallarm Console: وضع تصفية حركة المرور، الإخطارات حول الأحداث الأمنية، إدارة مصدر الطلب، تمويه البيانات الحساسة، السماح بأنواع معينة من الهجمات، إلخ.

### التكوين الأساسي عبر `values.yaml`

يوفر ملف `values.yaml` الافتراضي التكوين التالي لـ Wallarm:

```yaml
wallarm:
  image:
    tag: "<WALLARM_NODE_IMAGE_TAG>"
  enabled: true
  apiHost: api.wallarm.com
  apiPort: 443
  apiSSL: true
  token: ""
  fallback: "on"
  tarantool:
    kind: Deployment
    service:
      annotations: {}
    replicaCount: 1
    arena: "0.2"
    livenessProbe:
      failureThreshold: 3
      initialDelaySeconds: 10
      periodSeconds: 10
      successThreshold: 1
      timeoutSeconds: 1
    resources: {}
    podAnnotations:
      sidecar.istio.io/inject: false
  heartbeat:
    resources: {}
  wallarm-appstructure:
    resources: {}
  wallarm-antibot:
    resources: {}
  metrics:
    port: 18080
    enabled: false

    service:
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/path: /wallarm-metrics
        prometheus.io/port: "18080"

      ## -- قائمة العناوين الآي بي التي يتوفر فيها خدمة تصدير الإحصائيات
      ## الرجوع: https://kubernetes.io/docs/user-guide/services/#external-ips
      ##
      externalIPs: []

      # loadBalancerIP: ""
      loadBalancerSourceRanges: []
      servicePort: 18080
      type: ClusterIP
      # externalTrafficPolicy: ""
      # nodePort: ""
  addnode:
    resources: {}
  cron:
    jobs:
      exportEnvironment:
        schedule: "0 */1 * * *"
        timeout: 10m
      exportAttacks:
        schedule: "* * * * *"
        timeout: 3h
      exportCounters:
        schedule: "* * * * *"
        timeout: 11m
      bruteDetect:
        schedule: "* * * * *"
        timeout: 6m
      syncIpLists:
        schedule: "* * * * *"
        timeout: 3h
      exportMetrics:
        schedule: "* * * * *"
        timeout: 3h
      syncIpListsSource:
        schedule: "*/5 * * * *"
        timeout: 3h
      syncMarkers:
        schedule: "* * * * *"
        timeout: 1h
    resources: {}
  exportenv:
    resources: {}
  synccloud:
    wallarm_syncnode_interval_sec: 120
    resources: {}
  collectd:
    resources: {}
```

المعلمات الرئيسية التي قد تحتاج إلى تغييرها هي:

| المعلمة | الوصف | القيمة الافتراضية |
| --- | --- | --- |
| `wallarm.enabled` | يتيح لك تمكين أو تعطيل طبقة Wallarm. | `true` |
| `wallarm.apiHost` | خادم API Wallarm:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul> | `api.wallarm.com` |
| `wallarm.token` | رمز عقدة Wallarm. **مطلوب**. | فارغ |
| `wallarm.fallback` | ما إذا كان سيتم تشغيل خدمات بوابة API كونج إذا فشل بدء تشغيل خدمة Wallarm. | `on`
| `wallarm.tarantool.replicaCount` | عدد الحاويات الجارية لوحدة ما بعد التحليلات Wallarm والتي تعتبر الخلفية التحليلية البيانية المحلية للحل. | `1`
| `wallarm.tarantool.arena` | يحدد كمية الذاكرة المخصصة لوحدة ما بعد التحليلات Wallarm. يُنصح بضبط قيمة كافية لتخزين بيانات الطلبات لآخر 5-15 دقيقة. | `0.2`
| `wallarm.metrics.enabled` | هذا المفتاح يتحكم في جمع المعلومات والإحصائيات. إذا تم تثبيت [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) في مجموعة كوبرنيتس، فلا حاجة لتكوين إضافي. | `false`

المعلمات الأخرى تأتي بقيم افتراضية ونادراً ما تحتاج إلى تغيير.

### الضبط الدقيق لتحليل حركة المرور عبر تعليقات إنجرس (فقط للإصدار مفتوح المصدر)

فيما يلي قائمة التعليقات المدعومة في وحدة تحكم إنجرس كونج مفتوح المصدر مع خدمات Wallarm المتكاملة.

!!! معلومات "أولويات الإعدادات العالمية وإعدادات كل إنجرس"
    تأخذ تعليقات كل إنجرس الأولوية على قيم الرسم البياني هيلم.

| التعليق | الوصف |
|----------- |------------ |
| `wallarm.com/wallarm-mode` | [وضع تصفية حركة المرور][wallarm-mode-docs]: `off` (الافتراضي), `monitoring`, `safe_blocking`, أو `block`. |
| `wallarm.com/wallarm-application` | [معرّف التطبيق Wallarm][applications-docs]. يمكن أن تكون القيمة عددًا صحيحًا موجبًا باستثناء `0`. |
| `wallarm.com/wallarm-parse-response` | ما إذا كان سيتم تحليل استجابات التطبيق للهجمات: `true` (الافتراضي) أو `false`. يُطلب تحليل الاستجابة للكشف عن الثغرات الأمنية خلال [الكشف السلبي][passive-vuln-detection-docs] و[التحقق من التهديدات النشطة][active-threat-ver-docs]. |
| `wallarm.com/wallarm-parse-websocket` | يدعم Wallarm بروتوكول WebSockets بشكل كامل. بشكل افتراضي، لا يتم تحليل رسائل WebSockets بحثًا عن الهجمات. لتفعيل الميزة، قم بتفعيل [خطة الاشتراك في أمان API][subscription-docs] واستخدم هذا التعليق: `true` أو `false` (الافتراضي). |
| `wallarm.com/wallarm-unpack-response` | ما إذا كان سيتم فك ضغط البيانات المضغوطة المرجعة في استجابة التطبيق: `true` (الافتراضي) أو `false`. |
| `wallarm.com/wallarm-partner-client-uuid` | المعرف الفريد للمستأجر لعقدة Wallarm متعددة الإيجارات. يجب أن تكون القيمة سلسلة بتنسيق UUID، مثل `123e4567-e89b-12d3-a456-426614174000`.<br><br>تعرف على كيفية:<ul><li>[الحصول على UUID للمستأجر أثناء إنشاء المستأجر][get-tenant-via-api-docs]</li><li>[الحصول على قائمة UUIDs للمستأجرين الموجودين][get-tenant-uuids-docs]</li></ul> |

### الضبط الدقيق لتحليل حركة المرور عبر واجهة استخدام Wallarm Console

تتيح واجهة استخدام Wallarm Console الضبط الدقيق لتحليل حركة المرور الذي تؤديه طبقة Wallarm على النحو التالي:

* ضبط وضع تصفية حركة المرور
    
    بمجرد تنشيط [الحل](deployment.md)، يبدأ في تصفية جميع الطلبات الواردة في وضع **المراقبة** [mode][available-filtration-modes].

    تتيح واجهة استخدام Wallarm Console تغيير الوضع:

    * [عالميًا لجميع الطلبات الواردة][general-settings-ui-docs]
    * على أساس كل إنجرس باستخدام [القاعدة][wallarm-mode-rule-docs]

    !!! معلومات "أولويات إعدادات كل إنجرس وتلك المحددة في واجهة استخدام Wallarm Console"
        إذا تم تحديد الوضع لحل كونج المفتوح المصدر عبر تعليق `wallarm-mode` وواجهة استخدام Wallarm Console، فإن الأخيرة تأخذ الأسبقية على التعليق.
* ضبط [الإخطارات عن الأحداث الأمنية][integrations-docs]
* [إدارة الوصول إلى واجهات برمجة التطبيقات حسب مصادر الطلب][ip-lists-docs]
* [تخصيص قواعد تصفية حركة المرور][rules-docs]