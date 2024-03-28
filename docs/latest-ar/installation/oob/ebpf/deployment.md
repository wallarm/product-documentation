[deployment-platform-docs]:    ../../supported-deployment-options.md

# حلول Wallarm المستندة لـ eBPF (الإصدار التجريبي)

تقدم Wallarm نسخة تجريبية من حل الأمان الخاص بها المستند لـ eBPF التي تستفيد من قوة نواة Linux والتي تتكامل بسلاسة مع بيئات Kubernetes. تشرح هذه المقالة كيفية استخدام ونشر الحل باستخدام الرسم البياني لـ Helm.

## تدفق الحركة

تدفق الحركة مع حل Wallarm المستند لـ eBPF:

![تدفق الحركة eBPF](../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

تم تصميم الحل eBPF لمراقبة حركة المرور باستخدام البروتوكولات التالية:

* HTTP 1.x أو HTTP 2
* Proxy v1 أو Proxy v2

قد تستخدم الحركة تشفير TLS / SSL أو نقل البيانات النصية العادية. تحليل حركة المرور SSL محدود للخوادم التي تستخدم مكتبة OpenSSL المشتركة (على سبيل المثال، NGINX ، HAProxy) ولا يتوفر للخوادم التي تستخدم تنفيذات SSL أخرى مثل Envoy.

## كيف يعمل

يتألف نظام التشغيل Linux من النواة والمساحة المستخدم حيث تدير النواة موارد الأجهزة والمهام الحرجة، في حين تعمل التطبيقات في المساحة المستخدم. ضمن هذه البيئة، يتيح eBPF (الفلتر الحزم Berkeley الموسع) تنفيذ البرامج المخصصة داخل نواة Linux، بما في ذلك تلك التي تركز على الأمان. [اقرأ المزيد عن eBPF](https://ebpf.io/what-is-ebpf/)

باعتبار أن Kubernetes يستغل قدرات النواة لمهام حاسمة مثل عزل العمليات وإدارة الموارد والشبكات، فإنه يخلق بيئة ملائمة لدمج حلول الأمان المستندة لك eBPF. بما يتماشى مع هذا، تقدم Wallarm حل أمان مستند لـ eBPF يتم دمجه بسلاسة مع Kubernetes، مستفيدة من وظائف النواة.

الحل يتألف من عامل ينشئ مرآة لحركة المرور ويعيدها إلى عقدة Wallarm. خلال التنشيط، يمكنك تحديد مستوى المرآة إما على مستوى الفضاء الاسمي أو على مستوى العقدة. تحلل العقدة حركة المرور المتمركزة بحثاً عن التهديدات الأمنية، دون حظر أي نشاط ضار. بدلاً من ذلك، يسجل النشاط المكتشف في سحابة Wallarm، مما يوفر رؤية في أمن الحركة من خلال واجهة المستخدم Wallarm Console.

الشكل التالي يوضح مكونات الحل:

![مكونات eBPF](../../../images/waf-installation/epbf/ebpf-components.png)

يتم نشر العامل eBPF على شكل مجموعة Daemo PulHier.setMaxon 在每个 عقدة عامل Kubernetes. لضمان سلامة الوظائف، يجب أن يعمل حاوية العامل في وضع متميز مع القدرات الأساسية التالية: `SYS_PTRACE` و`SYS_ADMIN`.

علاوة على ذلك، يعالج الحل رموز الاستجابة، مما يخول وحدة [اكتشاف الواجهة البرمجية للتطبيق](../../../api-discovery/overview.md) الأساسية لـ Wallarm لتحديد نقاط النهاية الخاصة بك، وبناء جرد الواجهة البرمجية للتطبيق، وضمان أنه يبقى حديث.

## حالات الاستخدام

من بين كل [خيارات التنشيط الخاصة بـ Wallarm](../../supported-deployment-options.md)، هذا الحل هو الواحد الموصى به للعملية خارج النطاق. من خلال التقاط نسخة متطابقة من حركة المرور بدلاً من العمل بشكل متوازي، تضمن الحل eBPF عدم انقطاع تدفق الحركة. تقلل هذه النهج من التأثير على حركة المرور المباشرة، وتتجنب إدخال تأخيرات إضافية التي قد تؤثر على الزمن المستغرق.

## المتطلبات التقنية

تأكد من تحقيق المتطلبات التقنية الأساسية التالية لنشر حل eBPF بنجاح:

* الإصدار المدعوم من Kubernetes :
  
    * AWS - Kubernetes 1.24 وما فوق
    * Azure - Kubernetes 1.26 وما فوق
    * GCP - أي إصدار من Kubernetes
    * الخادم على الأجهزة الفعلية - Kubernetes 1.22 وما فوق
* تثبيت [cert-manager](https://cert-manager.io/docs/installation/helm/) لتمكين العامل من توجيه حركة المرور المتقاطعة إلى عقدة معالجة Wallarm بطريقة آمنة.
* مدير الحزم [Helm v3](https://helm.sh/).
* الإصدار 5.10 أو 5.15 من نواة Linux مع تمكين BTF (BPF Type Format). مدعوم على Ubuntu، Debian، RedHat، Google COS، أو Amazon Linux 2.
* معالج من نوع x86_64.
* بينما يكون الحل في مرحلة التجربة، لا يمكن تنفيذ المرايا بكفاءة على جميع الموارد في Kubernetes. لذلك، نوصي بتمكين تنفيذ المرايا بشكل خاص لـ NGINX Ingress controllers، Kong Ingress controllers، أو خوادم NGINX العادية في Kubernetes.
* يجب أن يكون لديك حساب المستخدم [**صلاحية المسؤول**](../../../user-guides/settings/users.md#user-roles) إلى واجهة المستخدم Wallarm Console.

إذا كانت حالة الاستخدام الخاصة بك تختلف عن المتطلبات المدرجة، فاتصل بالمهندسين التقنيين في الدعم في [Wallarm enWallarm](mailto:sales@wallarm.com) بتقديم معلومات تقنية مفصلة حول بيئتك لاستكشاف التعديلات المحتملة لتلبية احتياجاتك المحددة.

## الوصول إلى الشبكة

لضمان عملية الحل بشكل صحيح في البيئات التي تحد من الحركة الخروجية، قم بتكوين الوصول إلى الشبكة للسماح بالموارد الخارجية التالية:

* `https://charts.wallarm.com` لإضافة الرسوم البيانية لـ Helm الخاصة بـ Wallarm.
* `https://hub.docker.com/r/wallarm` لاسترجاع صور Wallarm Docker من Docker Hub.
* بالنسبة للمستخدمين الذين يعملون مع سحابة Wallarm الأمريكية، يمكنهم الوصول إلى `https://us1.api.wallarm.com`. بالنسبة لأولئك الذين يستخدمون سحابة Wallarm في الاتحاد الأوروبي، يمكنهم الوصول إلى `https://api.wallarm.com`.

## التنشيط

لنشر حل Wallarm eBPF:

1. قم بإنشاء عقدة Wallarm.
1. قم بتنشيط الرسم البياني لـ Wallarm Helm.
1. قم بتمكين تنفيذ المرايا.
1. اختبر عملية Wallarm eBPF.

### الخطوة 1: إنشاء عقدة Wallarm

1. افتح Wallarm Console → **Nodes** عبر الرابط أدناه:

    * https://us1.my.wallarm.com/nodes للسحابة الأمريكية
    * https://my.wallarm.com/nodes للسحابة الأوروبية
1. قم بإنشاء عقدة تصفية من نوع **Wallarm node** وانسخ الرمز التعريفي المولد لها.
    
    ![!إنشاء عقدة Wallarm](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### الخطوة 2: نشر الرسم البياني لـ Wallarm Helm

1. تأكد من أن بيئتك تفي بالمتطلبات الأعلى وأن [cert-manager](https://cert-manager.io/docs/installation/helm/) مثبت.
1. أضف [مستودع الرسم البياني الخاص بـ Wallarm](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. أنشئ الملف `values.yaml` مع [تكوين الحل Wallarm eBPF](helm-chart-for-wallarm.md).

    مثال على الملف مع التكوين الأدنى:

    === "سحابة الولايات المتحدة"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
            host: "us1.api.wallarm.com"
        ```
    === "سحابة الاتحاد الأوروبي"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
        ```
    
    `<NODE_TOKEN>` هو رمز العقدة Wallarm التي ستتم تشغيلها في Kubernetes.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. قم بتنشيط الرسم البياني لـ Wallarm Helm:

    ``` bash
    helm install --version 0.10.23 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` هو الاسم للإصدار Helm لـ الرسم البياني الخاص بـ Wallarm eBPF
    * `wallarm-ebpf` هو مكان اسم جديد لتنشيط الإصدار Helm الخاص بـ Wallarm eBPF chart، يُنصح بنشره في مكان اسم منفصل
    * `<PATH_TO_VALUES>` هو المسار إلى الملف `values.yaml`

### الخطوة 3: تمكين تنفيذ المرايا

نوصي بتمكين تنفيذ المرايا للاستفادة بشكل فعال من حل Wallarm eBPF لـ NGINX Ingress controller، Kong Ingress controller، أو خوادم NGINX العادية.

بشكل افتراضي، الحل المنشط لا يحلل أي حركة مرور. لتمكين تحليل حركة المرور، تحتاج إلى تمكين تنفيذ المرايا على المستوى المطلوب والذي يمكن أن يكون:

* لمكان اسم
* لعقدة
* لاسم عقدة أو حاوية

هناك طريقتين لتمكين تنفيذ المرايا: باستخدام المرشحات الديناميكية كملصقات للمكان الاسمي أو التوصيفات للعقدة، أو التحكم فيها من خلال كتلة `config.agent.mirror.filters` في الملف `values.yaml`. يمكنك أيضًا دمج هذه الأساليب. [المزيد من التفاصيل](selecting-packets.md)

#### لمكان اسم باستخدام ملصق

لتمكين المرايا لمكان الاسم، قم بضبط ملصق المكان الاسمي `wallarm-mirror` إلى `enabled`:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### للعقدة باستخدام توصيف

لتمكين المرايا للعقدة، قم بوضع توصيف `mirror.wallarm.com/enabled` ل `true`:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### لمكان اسمي، عقدة، حاوية، أو اسم عقدة باستخدام `values.yaml`

للحصول على تحكم أدق، يمكنك استخدام كتلة `config.agent.mirror.filters` في الملف `values.yaml` للـ Wallarm eBPF لتحديد مستوى المرايا. اقرأ [المقال](selecting-packets.md) حول كيفية تكوين المرشحات وكيف يتفاعلون مع ملصقات Wallarm للمكان الاسمي وتوصيفات العقدة.

### الخطوة 4: اختبار عملية Wallarm eBPF

لاختبار أن Wallarm eBPF يعمل بشكل صحيح:

1. احصل على تفاصيل العقدة Wallarm للتحقق من أنه تم بدء تشغيلها بنجاح:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-oob
    ```

    كل عقدة يجب أن تعرض الأتي: **READY: N/N** و **STATUS: Running ،e.g.:

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   4/4     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   4/4     Running   0          30m
    ```
1. أرسل هجوم [اختراق المسار](../../../attacks-vulns-list.md#path-traversal) التجريبي للتطبيق عن طريق استبدال `<LOAD_BALANCER_IP_OR_HOSTNAME>` بالعنوان IP الفعلي أو اسم DNS لناقل الحمولة الذي يقوم بتوجيه الحركة إليه:

    ```bash
    curl https://<LOAD_BALANCER_IP_OR_HOSTNAME>/etc/passwd
    ```

    بما أن حل Wallarm eBPF يعمل وفقًا للنهج الخارجي من النطاق، فإنه لا يحظر الهجمات ولكن يقوم فقط بتسجيلها.

    للتحقق من أن الهجوم قد تم تسجيله، انتقل إلى Wallarm Console → **Events**:

    ![!هجمات في واجهة المستخدم](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## القيود

* لا يقوم الحل بحظر الطلبات الضارة على الفور حيث يستمر تحليل حركة المرور بغض النظر عن تدفق الحركة الفعلي.

    Wallarm فقط تلاحظ الهجمات وتوفر لك ال[تفاصيل في واجهة المستخدم Wallarm Console](../../..//user-guides/events/analyze-attack.md).
* لا يتم دعم اكتشاف الضعف على أساس [الكشف السلبي](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) حيث أن أجسام الاستجابة من الخادم المطلوبة لتحديد الضعف ليست متطابقة.
* بينما الحل في مرحلة التجربة، لا يمكن تنفيذ المرايا بشكل فعال على جميع الموارد في Kubernetes. لذلك، نوصي بتمكين تنفيذ المرايا خاصةً لـ NGINX Ingress controllers، Kong Ingress controllers، أو خوادم NGINX العادية في Kubernetes.
* [اكتشاف سرقة بيانات الاعتماد](../../../about-wallarm/credential-stuffing.md) ليس مدعومًا حاليًا.