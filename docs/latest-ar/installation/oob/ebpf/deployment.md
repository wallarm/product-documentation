[deployment-platform-docs]: ../../supported-deployment-options.md

# حل Wallarm القائم على eBPF (الإصدار التجريبي)

تقدم Wallarm إصدارًا تجريبيًا من حلها الأمني القائم على eBPF الذي يستخدم قوة نواة Linux ويدمج بسلاسة مع بيئات Kubernetes. توضح هذه المقالة كيفية استخدام ونشر الحل باستخدام الخريطة Helm.

## تدفق المرور

تدفق المرور مع حل Wallarm القائم على eBPF:

![تدفق المرور في eBPF](../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

الحل eBPF مصمم لمراقبة المرور باستخدام البروتوكولات التالية:

* HTTP 1.x أو HTTP 2
* Proxy v1 أو Proxy v2

قد يستخدم المرور تشفير TLS/SSL أو نقل البيانات النصي العادي. يقتصر تحليل مرور SSL على الخوادم التي تستخدم مكتبة OpenSSL المشتركة (مثل NGINX، HAProxy) ولا يتوفر للخوادم التي تستخدم تنفيذات SSL أخرى مثل Envoy.

## كيف يعمل

يتألف نظام التشغيل Linux من النواة والمساحة المستخدم، حيث تدير النواة موارد الأجهزة والمهام الحرجة، بينما تعمل التطبيقات في مساحة المستخدم. في هذا البيئة، يتيح eBPF (Extended Berkeley Packet Filter) تنفيذ البرامج المخصصة داخل نواة Linux، بما في ذلك تلك المركزة على الأمن. [اقرأ المزيد عن eBPF](https://ebpf.io/what-is-ebpf/)

نظراً لأن Kubernetes يستخدم قدرات نواة Linux للمهام الحرجة مثل عزل العمليات وإدارة الموارد والشبكات، فإنه يخلق بيئة مواتية لدمج الحلول الأمنية القائمة على eBPF. وفقًا لهذا، تقدم Wallarm حلًا أمنيًا قائمًا على eBPF يدمج بسلاسة مع Kubernetes، مستفيدًا من وظائف النواة.

يتكون الحل من وكيل يولد مرآة للمرور ويحيلها إلى العقدة Wallarm. أثناء النشر، يمكنك تحديد مستوى المرآة إما على مستوى الفضاء الأسمي أو مستوى الوعاء. تدقق عقدة Wallarm في المرور المتطابق للأمن، دون حظر أي نشاط ضار. بدلاً من ذلك، يسجل النشاط الذي تم اكتشافه في Cloud Wallarm، مما يوفر الرؤية في أمن المرور من خلال واجهة المستخدم Wallarm Console.

يوضح الرسم البياني التالي مكونات الحل:

![مكونات eBPF](../../../images/waf-installation/epbf/ebpf-components.png)

وكيل eBPF يتم نشره كـ DaemonSet على كل عقدة عامل Kubernetes. لضمان الوظيفة الجيدة، يجب تشغيل وعاء الوكيل في وضع ممتاز مع القدرات الأساسية التالية: `SYS_PTRACE` و `SYS_ADMIN`.

بالإضافة إلى ذلك، يعالج الحل أكواد الرد، مما يمكّن وحدة [اكتشاف API](../../../api-discovery/overview.md) الأساسية في Wallarm لتحديد نقاط نهاية API الخاصة بك، وتشييد مخزون API الخاص بك، وضمان بقائه محدثًا.

## الحالات الاستخدامية

من بين جميع خيارات نشر Wallarm المدعومة [خيارات نشر Wallarm](../../supported-deployment-options.md)، هذا الحل هو الأكثر توصية للعمل خارج النطاق. من خلال التقاط نسخة متطابقة من المرور بدلاً من العمل في الخط، يضمن حل eBPF المستندة على المرور دون انقطاع. تقلل هذه النهج التأثير على المرور المباشر، وتتجنب إدخال تأخيرات إضافية قد تؤثر على الكمون.

## المتطلبات التقنية

تأكد من استيفاء الشروط التقنية الأولية التالية للنشر الناجح لحل eBPF:

* الإصدار التي تدعمها Kubernetes:

    * AWS - Kubernetes 1.24 وما فوق   
    * Azure - Kubernetes 1.26 وما فوق
    * GCP - أي إصدار من Kubernetes
    * الخادم العاري - Kubernetes 1.22 وما فوق
* تثبيت [مدير الشهادات](https://cert-manager.io/docs/installation/helm/) لتمكين الوكيل من تطابق المرور المرآة إلى عقدة معالجة Wallarm بطريقة آمنة.
* إدارة الحزم [Helm v3](https://helm.sh/).
* إصدار نواة Linux 5.10 أو 5.15 مع تمكين BTF (BPF Type Format). يتم دعمه في Ubuntu، Debian، RedHat، Google COS، أو Amazon Linux 2.
* المعالج بالعمارة x86_64.
* بينما الحل في البيتا، ليست جميع الموارد Kubernetes يمكن أن تكون متطابقة بشكل فعال. لذلك، نوصي بتمكين تطابق المرور على وجه التحديد لوحدات التحكم NGINX Ingress، أو وحدات التحكم Kong Ingress، أو خوادم NGINX العادية في Kubernetes.
* يجب أن يكون لحساب المستخدم الخاص بك [وصول **المدير**](../../../user-guides/settings/users.md#user-roles) إلى وحدة التحكم Wallarm.

إذا كانت حالة الاستخدام الخاصة بك تختلف عن المتطلبات المدرجة، اتصل ب [مبرمجي المبيعات](mailto:sales@wallarm.com) التوفير معلومات تقنية مفصلة حول بيئتك لاستكشاف التعديلات المحتملة لتلبية احتياجاتك المحددة.

## الوصول إلى الشبكة

لضمان عمل الحل بشكل صحيح في البيئات ذات المرور الصادر المقيد، قم بتكوين الوصول إلى الشبكة للسماح بالموارد الخارجية التالية:

* `https://charts.wallarm.com` لإضافة خرائط Wallarm Helm.
* `https://hub.docker.com/r/wallarm` لاسترداد صور Docker من Wallarm من Docker Hub
* بالنسبة للمستخدمين الذين يعملون مع Wallarm Cloud الأمريكية، قم بالوصول إلى `https://us1.api.wallarm.com`. بالنسبة لأولئك الذين يستخدمون Wallarm Cloud الأوروبي، قم بالدخول على `https://api.wallarm.com`.

## النشر

لنشر حل Wallarm eBPF:

1. إنشاء العقدة Wallarm.
1. نشر الخريطة Helm Wallarm.
1. تمكين تطابق المرور.
1. اختبار عملية Wallarm eBPF.

### الخطوة 1: إنشاء العقدة Wallarm

1. افتح Wallarm Console → **Nodes** عبر الرابط أدناه:

    * https://us1.my.wallarm.com/nodes بالنسبة لـ Cloud الأمريكية
    * https://my.wallarm.com/nodes بالنسبة لـ Cloud الأوروبية
1. إعداد عقدة الترشيح مع نوع **Wallarm node** ونسخ الرمز المكون.

    ![!انشاء عقدة Wallarm](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### الخطوة 2: نشر الخريطة Helm Wallarm

1. تأكد من أن بيئتك تلبي المتطلبات المذكورة أعلاه وأن [مدير الشهادات](https://cert-manager.io/docs/installation/helm/) مثبت.
1. أضف [مستودع الرسم البياني Wallarm](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. قم بإنشاء ملف `values.yaml` مع [تكوين حل Wallarm eBPF](helm-chart-for-wallarm.md).

    مثال على الملف مع التكوين الأدنى:

    === "US Cloud"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
            host: "us1.api.wallarm.com"
        ```
    === "EU Cloud"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
        ```
    
    `<NODE_TOKEN>` هو رمز العقدة Wallarm التي يتم تشغيلها في Kubernetes.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. نشر الخريطة Helm Wallarm:

    ``` bash
    helm install --version 0.10.26 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` هو الاسم للإصدار Helm من رسم eBPF Wallarm
    * `wallarm-ebpf` هو الفضاء الاسمي الجديد لنشر الإصدار Helm مع الرسم البياني eBPF Wallarm، يوصى بنشره في فضاء اسمي منفصل
    * `<PATH_TO_VALUES>` هو المسار إلى ملف `values.yaml`

### الخطوة 3: تمكين تطابق المرور

نوصي بتمكين تطابق المرور لاستخدام حل Wallarm eBPF بشكل فعال لوحدة التحكم NGINX Ingress، أو وحدة التحكم Kong Ingress، أو خوادم NGINX العادية.

بشكل افتراضي، الحل المنشور لا يحلل أي مرور. لتمكين تحليل المرور، تحتاج إلى تمكين تطابق المرور على المستوى المرغوب، الذي يمكن أن يكون:

* للفضاء الاسمي
* للوعاء
* لاسم العقدة أو الوعاء

هناك طريقتان لتمكين تطابق المرور: باستخدام فلاتر ديناميكية على شكل تسميات الفضاء الاسمي أو تعليمات التوجيه pod، أو التحكم فيه من خلال كتلة `config.agent.mirror.filters` في ملف `values.yaml`. يمكنك أيضًا دمج هذه النهج. [المزيد من التفاصيل](selecting-packets.md)

#### للفضاء الاسمي باستخدام تسمية

لتمكين المرآة للفضاء الاسمي، قم بتعيين تسمية الفضاء الاسمي `wallarm-mirror` إلى `enabled`:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### للوعاء باستخدام تعليمة توجيه

لتمكين المرآة للوعاء، قم بتعيين تعليمة توجيه `mirror.wallarm.com/enabled` إلى `true`:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### للفضاء الاسمي، الوعاء، الوعاء، أو العقدة باستخدام `values.yaml`

للتحكم أكثر دقة، يمكنك استخدام كتلة `config.agent.mirror.filters` في ملف `values.yaml` للرسم البياني Wallarm eBPF لتحديد مستوى المرآة. اقرأ [المقالة](selecting-packets.md) حول كيفية تكوين فلاتر وكيفية التفاعل مع تسميات الفضاء الاسمي Wallarm وتعليمات التوجيه في الوعاء.

### الخطوة 4: اختبار عملية Wallarm eBPF

للاختبار أن Wallarm eBPF تعمل بشكل صحيح:

1. احصل على تفاصيل وعاء Wallarm للتحقق من أنها تم بدءها بنجاح:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-oob
    ```

    يجب عرض الوعاء لكل منهما ما يلي: **READY: N/N** و **STATUS: Running**، على سبيل المثال:

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   4/4     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   4/4     Running   0          30m
    ```
1. أرسل هجوم الاختبار [Path Traversal](../../../attacks-vulns-list.md#path-traversal) للتطبيق عن طريق استبدال `<LOAD_BALANCER_IP_OR_HOSTNAME>` بالعنوان IP الفعلي أو اسم DNS لموزع الحمولة الذي يوجه المرور إليه:

    ```bash
    curl https://<LOAD_BALANCER_IP_OR_HOSTNAME>/etc/passwd
    ```

    نظرًا لأن حل Wallarm eBPF يعمل بنهج خارج النطاق، فإنه لا يحظر الهجمات ولكن فقط يسجلها.

    للتحقق من أن الهجوم تم تسجيله، انتقل إلى Wallarm Console → **Events**:

    ![!الهجمات في الواجهة](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## القيود

* الحل لا يحظر فوريًا الطلبات الخبيثة حيث يتابع تحليل المرور بغض النظر عن تدفق المرور الفعلي.

    Wallarm فقط تلاحظ الهجمات وتوفر لك [التفاصيل في وحدة التحكم Wallarm](../../..//user-guides/events/analyze-attack.md).
* كشف الثغرات الأمنية القائمة على [الكشف السلبي](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) غير متاح حيث أن أجسام الرد من الخادم المطلوبة لتحديد الثغرات الأمنية لا يتم تطابقها.
* بينما الحل ما زال في البيتا، ليست كل موارد Kubernetes يمكن أن تكون متطابقة بشكل فعال. لذلك، نوصي بتمكين تطابق المرور خصيصاً لوحدات التحكم NGINX Ingress، أو وحدات التحكم Kong Ingress، أو خوادم NGINX العادية في Kubernetes.
