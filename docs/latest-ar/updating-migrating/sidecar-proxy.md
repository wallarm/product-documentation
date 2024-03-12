[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# ترقية جانبية Wallarm

توضح هذه التعليمات الخطوات لتحديث جانبية Wallarm 4.x إلى النسخة الجديدة مع عقدة Wallarm 4.8.

!!! info "الدعم لـ 4.10"
    لم يتم تحديث مخطط Helm لنشر جانبية التحكم إلى الإصدار 4.10 بعد.

## المتطلبات

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## الخطوة 1: تحديث مستودع Helm لـ Wallarm

```bash
helm repo update wallarm
```

## الخطوة 2: التحقق من كل التغييرات المتوقعة في مخططات K8s

لتجنب تغييرات غير متوقعة في سلوك الجانبية، قم بالتحقق من جميع التغييرات المتوقعة في مخططات K8s باستخدام [إضافة Helm Diff](https://github.com/databus23/helm-diff). تقوم هذه الإضافة بإظهار الفرق بين مخططات K8s لنسخة الجانبية المنشورة والنسخة الجديدة.

لتثبيت وتشغيل الإضافة:

1. تثبيت الإضافة:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. تشغيل الإضافة:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.8.1 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم إصدار Helm مع مخطط الجانبية
    * `<NAMESPACE>`: مساحة الاسم التي تم نشر الجانبية إليها
    * `<PATH_TO_VALUES>`: مسار ملف `values.yaml` الذي يعرف إعدادات الجانبية 4.8 - يمكنك استخدام الذي تم إنشاؤه لتشغيل نسخة الجانبية السابقة
3. تأكد من أنه لا توجد تغييرات يمكن أن تؤثر على استقرار الخدمات الجارية وقم بفحص الأخطاء الصادرة من stdout بعناية.

    إذا كان stdout فارغًا، تأكد من صحة ملف `values.yaml`.

## الخطوة 3: ترقية حل الجانبية

ترقية المكونات المنشورة من حل الجانبية:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.8.1 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: اسم إصدار Helm مع مخطط الجانبية المنشور
* `<NAMESPACE>`: مساحة الاسم التي تم نشر الجانبية إليها
* `<PATH_TO_VALUES>`: مسار ملف `values.yaml` الذي يعرف إعدادات الجانبية 4.8 - يمكنك استخدام الذي تم إنشاؤه لتشغيل نسخة الجانبية السابقة

## الخطوة 4: اختبار حل الجانبية بعد الترقية

1. تأكد من ترقية نسخة مخطط Helm:

    ```bash
    helm list -n wallarm-sidecar
    ```

    حيث `wallarm-sidecar` هي مساحة الاسم التي تم نشر الجانبية إليها. يمكنك تغيير هذه القيمة إذا كانت مساحة الاسم مختلفة.

    يجب أن تتوافق نسخة المخطط مع `wallarm-sidecar-1.1.5`.
1. احصل على تفاصيل لوحة التحكم Wallarm للتحقق من أنها بدأت بنجاح:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    يجب أن تعرض كل حاوية الآتي: **READY: N/N** و **STATUS: Running**، على سبيل المثال:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. أرسل اختبار [هجوم تحقيق المسار](../attacks-vulns-list.md#path-traversal) إلى عنوان مجموعة تطبيقات:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    يجب أن تحمل الحاوية المطلوبة لصاقة `wallarm-sidecar: enabled`.

    تحقق من أن حل النسخة الجديدة يعالج الطلب الخبيث كما كان في النسخة السابقة.