[وثائق-قوائم-الآي-بي]: ../user-guides/ip-lists/overview.md

# ترقية وحدة التحكم Kong Ingress مع تكامل وحدات Wallarm

تصف هذه التعليمات الخطوات لترقية وحدة التحكم Kong Ingress التي تعتمد على Wallarm والمُنشرة بالإصدار 4.x إلى الإصدار الجديد مع وحدة Wallarm الإصدار 4.6.

## المتطلبات

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## الخطوة 1: تحديث مستودع Helm الخاص بـWallarm

```bash
helm repo update wallarm
```

## الخطوة 2: مراجعة جميع التغييرات القادمة لتوثيق K8s

لتجنب التغييرات غير المتوقعة في سلوك وحدة التحكم Ingress، مراجعة جميع التغييرات القادمة لتوثيق K8s باستخدام [إضافة Helm Diff](https://github.com/databus23/helm-diff). تُخرج هذه الإضافة الفروق بين توثيق K8s لإصدار وحدة التحكم Ingress المُنشر والإصدار الجديد.

لتثبيت وتشغيل الإضافة:

1. تثبيت الإضافة:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. تشغيل الإضافة:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم إصدار Helm الذي يحتوي على توثيق Ingress
    * `<NAMESPACE>`: الفضاء الاسمي الذي تم فيه نشر توثيق Ingress بواسطة Helm
    * `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد إعدادات Ingress 4.6 - يمكن استخدام الذي تم إنشاؤه لتشغيل إصدار Ingress السابق
3. التأكد من أنه لا توجد تغييرات قد تؤثر على استقرار الخدمات المشغلة وفحص الأخطاء ظاهرةً بدقة.

    إذا كان المخرج فارغًا، التأكد من صحة ملف `values.yaml`.

## الخطوة 3: ترقية وحدة التحكم Ingress

الترقية لوحدة التحكم Kong Ingress المُنشرة:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: اسم إصدار Helm الذي يحتوي على توثيق Ingress
* `<NAMESPACE>`: الفضاء الاسمي الذي تم فيه نشر توثيق Ingress بواسطة Helm
* `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد إعدادات Ingress 4.6 - يمكن استخدام الذي تم إنشاؤه لتشغيل إصدار Ingress السابق

## الخطوة 4: اختبار وحدة التحكم Ingress بعد الترقية

1. التأكد من ترقية إصدار توثيق Helm:

    ```bash
    helm list -n <NAMESPACE>
    ```

    حيث `<NAMESPACE>` هو الفضاء الاسمي الذي تم فيه نشر توثيق Ingress بواسطة Helm.

    إصدار التوثيق يجب أن يتطابق مع `kong-4.6.3`.
1. الحصول على تفاصيل حزمة Wallarm للتحقق من بدء تشغيلها بنجاح:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    يجب أن تُظهر كل حزمة التالي: **جاهز: N/N** و **الحالة: يعمل**، على سبيل المثال:

    ```
    NAME                                                      جاهز   الحالة    إعادة التشغيل   العمر
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     يعمل   0          91د
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     يعمل   0          91د
    ```
1. إرسال هجمات اختبار [Path Traversal](../attacks-vulns-list.md#path-traversal) إلى خدمة Kong Ingress Controller:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    التحقق من معالجة الحل بالإصدار الجديد للطلب الضار كما كان في الإصدار السابق.