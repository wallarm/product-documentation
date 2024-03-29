[docs-ip-lists]: ../user-guides/ip-lists/overview.md

# تحديث وحدة Wallarm الجانبية

تصف هذه التعليمات الخطوات لتحديث وحدة Wallarm الجانبية من إصدار 4.x إلى الإصدار الجديد مع نقطة Wallarm 4.8.

!!! info "الدعم للإصدار 4.10"
    لم يتم تحديث مخطط Helm لنشر وحدة التحكم الجانبية للإصدار 4.10 بعد.

## المتطلبات

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## الخطوة 1: تحديث مستودع مخططات Helm الخاص بـ Wallarm

```bash
helm repo update wallarm
```

## الخطوة 2: اطلع على كافة التغييرات القادمة في مخططات K8s

لتجنب تغييرات غير متوقعة في سلوك الوحدة الجانبية، اطلع على كافة التغييرات القادمة في مخططات K8s باستخدام [إضافة Helm Diff](https://github.com/databus23/helm-diff). تعرض هذه الإضافة الفروق بين مخططات K8s للإصدار المنشور من الوحدة الجانبية والإصدار الجديد.

لتثبيت وتشغيل الإضافة:

1. ثبت الإضافة:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. قم بتشغيل الإضافة:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.8.1 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم إصدار Helm الذي يحتوي على مخطط الوحدة الجانبية
    * `<NAMESPACE>`: المجال الذي يتم نشر الوحدة الجانبية فيه
    * `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد إعدادات الوحدة الجانبية 4.8 - يمكن استخدام الذي تم إنشاؤه لتشغيل الإصدار السابق من الوحدة الجانبية
3. تأكد من عدم وجود تغييرات قد تؤثر على استقرار الخدمات الجارية وفحص الأخطاء من stdout بعناية.

    إذا كان stdout فارغًا، تأكد من صحة ملف `values.yaml`.

## الخطوة 3: ترقية حل الوحدة الجانبية

قم بترقية المكونات المنشورة لحل الوحدة الجانبية:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.8.1 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: اسم إصدار Helm الذي يحتوي على مخطط الوحدة الجانبية المنشور
* `<NAMESPACE>`: المجال الذي يتم نشر الوحدة الجانبية فيه
* `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد إعدادات الوحدة الجانبية 4.8 - يمكن استخدام الذي تم إنشاؤه لتشغيل الإصدار السابق من الوحدة الجانبية

## الخطوة 4: اختبر حل الوحدة الجانبية بعد الترقية

1. تأكد من ترقية إصدار مخطط Helm:

    ```bash
    helm list -n wallarm-sidecar
    ```

    حيث `wallarm-sidecar` هو المجال الذي يتم نشر الوحدة الجانبية فيه. يمكنك تغيير هذه القيمة إذا كان المجال مختلفًا.

    يجب أن يتطابق إصدار المخطط مع `wallarm-sidecar-1.1.5`.
1. احصل على تفاصيل طائرة التحكم لـWallarm للتحقق من بدء تشغيلها بنجاح:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    يجب أن يظهر كل بود الآتي: **جاهز: N/N** و**حالة: يعمل**, مثل:

    ```
    NAME                                             جاهز   حالة      إعادة التشغيل   عمر
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     يعمل      0                91د
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     يعمل      0                91د
    ```
1. أرسل هجوم [اختراق المسار](../attacks-vulns-list.md#path-traversal) الاختباري إلى عنوان تجمع التطبيق:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    يجب أن يكون لدى وحدة التطبيق المطلوبة الوسم `wallarm-sidecar: enabled`.

    تحقق من أن حل الإصدار الأحدث يعالج الطلب الخبيث كما فعل في الإصدار السابق.