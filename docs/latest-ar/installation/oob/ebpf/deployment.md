[deployment-platform-docs]:    ../../supported-deployment-options.md

# الحل المعتمد على eBPF من Wallarm (النسخة التجريبية)

تقدم Wallarm نسخة تجريبية من حل الأمان القائم على eBPF الذي يستغل قوة نواة Linux ويندمج بسلاسة مع بيئات Kubernetes. يشرح هذا المقال كيفية استخدام ونشر الحل باستخدام مخطط Helm.

## تدفق البيانات

تدفق البيانات مع حل Wallarm القائم على eBPF:

![تدفق بيانات eBPF](../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

تم تصميم حل eBPF لمراقبة البيانات باستخدام البروتوكولات التالية:

* HTTP 1.x أو HTTP 2
* Proxy v1 أو Proxy v2

قد يستخدم البيانات تشفير TLS/SSL أو نقل بيانات نصية. تحليل بيانات SSL محدود بالخوادم التي تستخدم مكتبة OpenSSL المشتركة (مثل NGINX، HAProxy) وغير متوفر للخوادم التي تستخدم تنفيذات SSL الأخرى مثل Envoy.

## كيف يعمل

يتألف نظام التشغيل Linux من النواة وفضاء المستخدم، حيث تدير النواة موارد الأجهزة والمهام الحرجة، بينما تعمل التطبيقات في فضاء المستخدم. في هذا البيئة، يتيح eBPF (مرشح الحزمة الموسع من بيركلي) تنفيذ برامج مخصصة داخل نواة Linux، بما في ذلك تلك المركزة على الأمان. [اقرأ المزيد عن eBPF](https://ebpf.io/what-is-ebpf/)

لأن Kubernetes يستخدم قدرات نواة Linux للمهام الحاسمة مثل عزل العمليات، إدارة الموارد، والشبكات، فإنه يخلق بيئة مواتية لدمج حلول الأمان القائمة على eBPF. في هذا السياق، تقدم Wallarm حلاً أمنياً قائماً على eBPF يندمج بسلاسة مع Kubernetes، مستفيداً من وظائف النواة.

يتكون الحل من وكيل يولد مرآة للبيانات ويوجهها إلى عقدة Wallarm. أثناء النشر، يمكنك تحديد مستوى المرآة على مستوى النطاق الأسمي أو الوحدة النمطية. تفحص عقدة Wallarm البيانات المتكررة بحثاً عن التهديدات الأمنية، دون حظر أي نشاط ضار. بدلاً من ذلك، يتم تسجيل النشاط المكتشف في Wallarm Cloud، مما يوفر رؤية حول أمان البيانات من خلال واجهة استخدام Wallarm Console.

الرسم التخطيطي التالي يوضح مكونات الحل:

![مكونات eBPF](../../../images/waf-installation/epbf/ebpf-components.png)

يتم نشر وكيل eBPF كـ DaemonSet على كل عُقدة عاملة في Kubernetes. لضمان الوظائف الصحيحة، يجب تشغيل حاوية الوكيل في وضع مميز مع القدرات الأساسية التالية: `SYS_PTRACE` و `SYS_ADMIN`.

علاوة على ذلك، يقوم الحل بمعالجة رموز الاستجابة، مما يمكن وحدة [اكتشاف واجهة برمجة التطبيقات](../../../api-discovery/overview.md) الأساسية في Wallarm من تحديد نقاط نهاية واجهة برمجة التطبيقات الخاصة بك، بناء جرد واجهة برمجة التطبيقات الخاصة بك، وضمان تحديثها باستمرار.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](../../supported-deployment-options.md)، يعتبر هذا الحل هو الخيار الموصى به للتشغيل خارج النطاق. من خلال التقاط نسخة متكررة من البيانات بدلاً من التشغيل الداخلي، يضمن الحل القائم على eBPF تدفق بيانات دون انقطاع. يقلل هذا النهج من التأثير على البيانات الحية، ويتجنب إدخال تأخيرات إضافية قد تؤثر على الكمون.

## المتطلبات التقنية

تأكد من استيفاء المتطلبات التقنية التالية لنشر حل eBPF بنجاح:

* إصدار Kubernetes المدعوم:
  
    * AWS - Kubernetes 1.24 فما فوق
    * Azure - Kubernetes 1.26 فما فوق
    * GCP - أي إصدار من Kubernetes
    * الخادم العاري - Kubernetes 1.22 فما فوق
* تثبيت [cert-manager](https://cert-manager.io/docs/installation/helm/) لتمكين الوكيل من مرآة البيانات الملتقطة إلى عقدة معالجة Wallarm بطريقة آمنة.
* مدير الحزم [Helm v3](https://helm.sh/).
* إصدار نواة Linux 5.10 أو 5.15 مع تفعيل BTF (تنسيق نوع BPF). مدعوم على Ubuntu، Debian، RedHat، Google COS، أو Amazon Linux 2.
* معالج بالعمارة x86_64.
* بينما يكون الحل في النسخة التجريبية، لا يمكن تكرار جميع موارد Kubernetes بفعالية. لذا، نوصي بتمكين مرآة البيانات على وجه التحديد لـ NGINX Ingress controllers، Kong Ingress controllers، أو الخوادم العادية NGINX في Kubernetes.
* يجب أن يكون لديك حساب مستخدم بـ [وصول **المدير**](../../../user-guides/settings/users.md#user-roles) إلى Wallarm Console.

إذا كانت حالة استخدامك تختلف عن المتطلبات المدرجة، اتصل بمهندسي [المبيعات لدينا](mailto:sales@wallarm.com) مع تقديم معلومات تقنية مفصلة عن بيئتك لاستكشاف التعديلات المحتملة لتلبية احتياجاتك الخاصة.

## الوصول إلى الشبكة

لضمان وظائف الحل بشكل صحيح في البيئات ذات حركة المرور الخارجية المقيدة، قم بتكوين الوصول إلى الشبكة للسماح بالموارد الخارجية التالية:

* `https://charts.wallarm.com` لإضافة مخططات Helm من Wallarm.
* `https://hub.docker.com/r/wallarm` لاسترجاع صور Docker من Wallarm من Docker Hub.
* بالنسبة للمستخدمين الذين يعملون مع Wallarm Cloud الأمريكي، الوصول إلى `https://us1.api.wallarm.com`. بالنسبة لأولئك الذين يستخدمون Wallarm Cloud الأوروبي، الوصول إلى `https://api.wallarm.com`.

## النشر

لنشر حل eBPF من Wallarm:

### الخطوة 1: إنشاء عقدة Wallarm

1. افتح Wallarm Console → **العقد** عبر الرابط أدناه:

    * https://us1.my.wallarm.com/nodes للسحابة الأمريكية
    * https://my.wallarm.com/nodes للسحابة الأوروبية
1. أنشئ عقدة ترشيح بنوع **عقدة Wallarm** وانسخ الرمز المولد.
    
    ![!إنشاء عقدة Wallarm](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### الخطوة 2: نشر مخطط Helm من Wallarm

1. تأكد من استيفاء بيئتك للمتطلبات أعلاه وتثبيت [cert-manager](https://cert-manager.io/docs/installation/helm/).
1. أضِف مستودع مخططات Wallarm:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. أنشئ ملف `values.yaml` بتكوين حل eBPF من Wallarm [حلول eBPF](helm-chart-for-wallarm.md).

    مثال على الملف بالتكوين الأدنى:

    === "السحابة الأمريكية"
        ```yaml
        config:
          api:
            token: "<رمز العقدة>"
            host: "us1.api.wallarm.com"
        ```
    === "السحابة الأوروبية"
        ```yaml
        config:
          api:
            token: "<رمز العقدة>"
        ```
    
    `<رمز العقدة>` هو رمز العقدة Wallarm التي ستعمل في Kubernetes.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. نشر مخطط Helm من Wallarm:

    ``` bash
    helm install --version 0.10.23 <اسم الافراج> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <مسار إلى values>
    ```

    * `<اسم الافراج>` هو الاسم لافراج Helm من مخطط eBPF من Wallarm
    * `wallarm-ebpf` هو النطاق الأسمي الجديد لنشر إصدار Helm بمخطط eBPF من Wallarm، ويوصى بنشره في نطاق أسمي منفصل
    * `<مسار إلى values>` هو المسار إلى ملف `values.yaml`

### الخطوة 3: تمكين مرآة البيانات

نوصي بتمكين مرآة البيانات لاستخدام حل Wallarm المعتمد على eBPF بفعالية لـ NGINX Ingress controller، Kong Ingress controller، أو الخوادم العادية NGINX.

افتراضيًا، لا يقوم الحل المنشور بتحليل أي بيانات. لتمكين تحليل البيانات، تحتاج إلى تمكين مرآة البيانات عند المستوى المطلوب، والذي يمكن أن يكون:

* لنطاق أسمي
* لوحدة نمطية
* لاسم عقدة أو حاوية

هناك طريقتان لتمكين مرآة البيانات: باستخدام مرشحات ديناميكية كملصقات لنطاق أسمي أو تعليقات لوحدة نمطية، أو التحكم بها عبر كتلة `config.agent.mirror.filters` في ملف `values.yaml`. يمكنك أيضًا الجمع بين هذه النهج. [المزيد من التفاصيل](selecting-packets.md)

#### لنطاق أسمي باستخدام ملصق

لتمكين المرآة لنطاق أسمي، حدد ملصق النطاق الأسمي `wallarm-mirror` إلى `enabled`:

```
kubectl label ns <النطاق الأسمي> wallarm-mirror=enabled
```

#### لوحدة نمطية باستخدام تعليق

لتمكين المرآة لوحدة نمطية، حدد التعليق `mirror.wallarm.com/enabled` إلى `true`:

```bash
kubectl patch deployment <اسم التنصيب> -n <النطاق الأسمي> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### لنطاق أسمي، وحدة نمطية، حاوية، أو عقدة باستخدام `values.yaml`

للتحكم الأكثر دقة، يمكنك استخدام كتلة `config.agent.mirror.filters` في ملف `values.yaml` لحل eBPF من Wallarm لتحديد مستوى المرآة. اقرأ [المقال](selecting-packets.md) حول كيفية تكوين المرشحات وكيفية تفاعلها مع ملصقات النطاق الأسمي وتعليقات الوحدات النمطية من Wallarm.

### الخطوة 4: اختبار تشغيل Wallarm eBPF

لتقييم تشغيل حل Wallarm eBPF بشكل صحيح:

1. احصل على تفاصيل وحدة Wallarm للتحقق من بدء تشغيلها بنجاح:

    ```bash
    kubectl get pods -n <النطاق الأسمي> -l app.kubernetes.io/name=wallarm-oob
    ```

    يجب عرض كل وحدة نمطية كما يلي: **جاهز: N/N** و **الحالة: جاري التشغيل**، على سبيل المثال:

    ```
    NAME