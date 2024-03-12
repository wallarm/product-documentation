[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# ترقية وحدة التحكم في الدخول Kong مع وحدات Wallarm المدمجة

توضح هذه التعليمات الخطوات لترقية وحدة التحكم في الدخول القائمة على Kong من Wallarm المُنشرة بالإصدار 4.x إلى الإصدار الجديد مع وحدة Wallarm 4.6.

## المتطلبات

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## الخطوة 1: تحديث مستودع Helm الخاص بـ Wallarm

```bash
helm repo update wallarm
```

## الخطوة 2: مراجعة جميع تغييرات مظاهر K8s القادمة

لتجنب تغيير غير متوقع في سلوك وحدة التحكم في الدخول، راجع جميع تغييرات مظاهر K8s القادمة باستخدام [Helm Diff Plugin](https://github.com/databus23/helm-diff). يُظهر هذا الإضافة الفروق بين مظاهر K8s لإصدار وحدة التحكم في الدخول المنشور والإصدار الجديد.

لتثبيت وتشغيل الإضافة:

1. تثبيت الإضافة:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. تشغيل الإضافة:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم إصدار Helm مع مخطط وحدة التحكم في الدخول
    * `<NAMESPACE>`: النيم سبيس الذي يتم نشر مخطط Helm مع وحدة التحكم في الدخول به
    * `<PATH_TO_VALUES>`: مسار ملف `values.yaml` الذي يحدد إعدادات وحدة التحكم في الدخول 4.6 - يمكنك استخدام ذلك الذي تم إنشاؤه لتشغيل إصدار وحدة التحكم في الدخول السابق
3. تأكد من أنه لا توجد تغييرات يمكن أن تؤثر على استقرار الخدمات الجارية وفحص الأخطاء من stdout بعناية.

    إذا كان stdout فارغًا، تأكد من صحة ملف `values.yaml`.

## الخطوة 3: ترقية وحدة التحكم في الدخول

ترقية وحدة التحكم في الدخول Kong المنشورة:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: اسم إصدار Helm مع مخطط وحدة التحكم في الدخول
* `<NAMESPACE>`: النيم سبيس الذي يتم نشر مخطط Helm مع وحدة التحكم في الدخول به
* `<PATH_TO_VALUES>`: مسار ملف `values.yaml` الذي يحدد إعدادات وحدة التحكم في الدخول 6 - يمكنك استخدام ذلك الذي تم إنشاؤه لتشغيل إصدار وحدة التحكم في الدخول السابق

## الخطوة 4: اختبار وحدة التحكم في الدخول المُرقّاة

1. تأكد من ترقية إصدار مخطط Helm:

    ```bash
    helm list -n <NAMESPACE>
    ```

    حيث `<NAMESPACE>` هو النيم سبيس الذي يتم نشر مخطط Helm مع وحدة التحكم في الدخول به.

    يجب أن يتطابق إصدار المخطط مع `kong-4.6.3`.
1. احصل على تفاصيل البود Wallarm للتحقق من بدء تشغيلها بنجاح:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    يجب عرض كل بود كالتالي: **READY: N/N** و **STATUS: Running**، مثل:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. أرسل هجمات [Path Traversal](../attacks-vulns-list.md#path-traversal) الاختبارية إلى خدمة Wallarm Ingress Controller:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    تحقق من معالجة الحل الخاص بالإصدار الأحدث للطلب الخبيث كما كان في الإصدار السابق.