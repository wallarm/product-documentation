# تخصيص Kong Ingress Controller مع خدمات Wallarm المدمجة

هذا المقال يوجهكم في كيفية تخصيص [Kong Ingress Controller مع خدمات Wallarm المدمجة][kong-ing-controller-customization-docs] بشكل آمن وفعال.

## منطقة التكوين

Kong Ingress Controller مع خدمات Wallarm المدمجة يعتمد على مكونات Kubernetes القياسية، وبالتالي، التكوين الخاص بالحل يشبه إلى حد كبير تكوين مكدس Kubernetes.

يمكنكم تكوين الحل كما يلي:

* عالميًا عبر `values.yaml` - يسمح بتعيين التكوين العام للتوظيف، بوابة Kong API وبعض إعدادات Wallarm الأساسية. تنطبق هذه الإعدادات على جميع موارد Ingress التي يوجه الحل الحركة إليها.
* عبر تعليقات Ingress - يسمح بضبط دقيق لإعدادات Wallarm على أساس كل Ingress.

    !!! تحذير "دعم التعليقات"
        التعليق على Ingress مدعوم فقط بالحل القائم على Open-Source Kong Ingress controller. [قائمة التعليقات المدعومة محدودة](#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* عبر واجهة المستخدم Wallarm Console - يسمح بضبط دقيق لإعدادات Wallarm.

## تكوين Kong API Gateway

يتم تعيين تكوين Kong Ingress Controller لـ Kong API Gateway بواسطة [قيم الرسم البياني Helm الافتراضية](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml). يمكن تجاوز هذا التكوين بواسطة ملف `values.yaml` الذي يوفره المستخدم أثناء `helm install` أو `helm upgrade`.

لتخصيص قيم الرسم البياني Helm الافتراضية، تعلم [التعليمات الرسمية عن تكوين Kong و Ingress Controller](https://github.com/Kong/charts/tree/main/charts/kong#configuration).

## تكوين طبقة Wallarm

يمكنكم تكوين طبقة Wallarm الخاصة بالحل كما يلي:

* تعيين التكوين الأساسي عبر `values.yaml`: الاتصال بـ Wallarm Cloud، تخصيص الموارد، الخيارات الاحتياطية.
* ضبط دقيق لتحليل الحركة على أساس كل Ingress عبر التعليقات (فقط للنسخة المفتوحة المصدر): وضع تصفية الحركة، إدارة التطبيق، تكوين العديد من المستأجرين، إلخ.
* ضبط دقيق لتحليل الحركة عبر واجهة المستخدم Wallarm Console: وضع تصفية الحركة، الإشعارات حول الأحداث الأمنية، إدارة مصدر الطلب، إخفاء البيانات الحساسة، السماح بأنواع معينة من الهجمات، إلخ.

### التكوين الأساسي عبر `values.yaml`

ملف `values.yaml` الافتراضي يوفر التكوين التالي لـ Wallarm:

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

      # clusterIP: ""

      ## -- قائمة عناوين IP التي يتاح عليها خدمة تصدير الإحصائيات
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
        schedule: "* * * *  *"
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

المعايير الرئيسية التي قد تحتاجون إلى تغييرها هي:

| المعيار | الوصف | القيمة الافتراضية |
| --- | --- | --- |
| `wallarm.enabled` | يسمح لكم بتمكين أو تعطيل طبقة Wallarm. | `true` |
| `wallarm.apiHost` | خادم API Wallarm:<ul><li>`us1.api.wallarm.com` لـ Cloud الأمريكي</li><li>`api.wallarm.com` لـ Cloud الأوروبي</li></ul> | `api.wallarm.com` |
| `wallarm.token` | رمز عقدة Wallarm. **مطلوب**. | فارغ |
| `wallarm.fallback` | ما إذا كان سيتم تشغيل خدمات Kong API Gateway إذا فشل تشغيل خدمة Wallarm. | `on`
| `wallarm.tarantool.replicaCount` | عدد الحاويات الجاري تشغيلها لوحدة Wallarm postanalytics التي تعتبر الخلفية التحليلية المحلية للبيانات للحل. | `1`
| `wallarm.tarantool.arena` | يحدد كمية الذاكرة المخصصة لوحدة Wallarm postanalytics. يُنصح بتعيين قيمة كافية لتخزين بيانات الطلب لآخر 5-15 دقيقة. | `0.2`
| `wallarm.metrics.enabled` | هذا المفتاح يتحكم في جمع المعلومات والإحصائيات. إذا تم تثبيت [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) في تجمع Kubernetes، فلا يلزم أي تكوين إضافي. | `false`

تأتي المعايير الأخرى بقيم افتراضية ونادرًا ما تحتاج إلى تغيير.

### ضبط دقيق لتحليل الحركة عبر تعليقات Ingress (للنسخة المفتوحة المصدر فقط)

فيما يلي قائمة بالتعليقات المدعومة في متحكم Ingress المفتوح المصدر مع خدمات Wallarm المدمجة.

!!! معلومات "أولويات إعدادات العالمية وإعدادات كل Ingress"
    تعليقات Ingress الخاصة تأخذ الأسبقية على قيم الرسم البياني Helm.

| التعليق | الوصف | 
|----------- |------------ |
| `wallarm.com/wallarm-mode` | [وضع تصفية الحركة][wallarm-mode-docs]: `off` (الافتراضي)، `monitoring`، `safe_blocking`، أو `block`. |
| `wallarm.com/wallarm-application` | [معرف تطبيق Wallarm][applications-docs]. القيمة يمكن أن تكون عددًا موجبًا باستثناء `0`. |
| `wallarm.com/wallarm-parse-response` | ما إذا كان سيتم تحليل استجابات التطبيق للهجمات: `true` (الافتراضي) أو `false`. تحليل الاستجابة مطلوب للكشف عن الثغرات الأمنية أثناء [الكشف السلبي][passive-vuln-detection-docs] و[التحقق من التهديدات النشطة][active-threat-ver-docs]. |
| `wallarm.com/wallarm-parse-websocket` | Wallarm يدعم بروتوكول WebSockets بشكل كامل. بشكل افتراضي، لا يتم تحليل رسائل WebSockets بحثًا عن هجمات. لتفعيل الميزة، قم بتنشيط [خطة اشتراك الأمان الخاصة بـ API][subscription-docs] واستخدم هذا التعليق: `true` أو `false` (الافتراضي). |
| `wallarm.com/wallarm-unpack-response` | ما إذا كان سيتم فك ضغط البيانات المضغوطة التي تعود في استجابة التطبيق: `true` (الافتراضي) أو `false`. |
| `wallarm.com/wallarm-partner-client-uuid` | المعرف الفريد للمستأجر لعقدة Wallarm المتعددة المستأجرين. القيمة يجب أن تكون سلسلة في تنسيق UUID، مثل `123e4567-e89b-12d3-a456-426614174000`.<br><br>تعرف على كيفية:<ul><li>[الحصول على UUID للمستأجر أثناء إنشاء المستأجر][get-tenant-via-api-docs]</li><li>[الحصول على قائمة UUIDs للمستأجرين الموجودين][get-tenant-uuids-docs]</li></ul> |

### ضبط دقيق لتحليل الحركة عبر واجهة المستخدم Wallarm Console

تمكنكم واجهة المستخدم Wallarm Console من ضبط دقيق لتحليل الحركة الذي تقوم به طبقة Wallarm كما يلي:

* تكوين وضع تصفية الحركة
    
    مرة واحدة [يتم نشر الحل](deployment.md)، يبدأ في ترشيح جميع الطلبات الواردة في وضع **المراقبة** [mode][available-filtration-modes].

    تمكنكم واجهة المستخدم Wallarm Console من تغيير الوضع:

    * [عالميًا لجميع الطلبات الواردة][general-settings-ui-docs]
    * على أساس Ingress باستخدام [القاعدة][wallarm-mode-rule-docs]

    !!! معلومات "أولويات إعدادات Ingress والإعدادات المحددة في واجهة المستخدم Wallarm Console"
        إذا تم تحديد الوضع لحل Kong المبني على المصادر المفتوحة عبر تعليق `wallarm-mode` وواجهة المستخدم Wallarm Console، فإن الأخيرة ستأخذ الأسبقية على التعليق.
* تعيين [الإشعارات على الأحداث الأمنية][integrations-docs]
* [إدارة الوصول إلى APIs بواسطة مصادر الطلب][ip-lists-docs]
* [تخصيص قواعد ترشيح الحركة][rules-docs]