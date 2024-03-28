[nginx-process-time-limit-docs]: ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../user-guides/ip-lists/overview.md
[ip-list-docs]: ../user-guides/ip-lists/overview.md
[waf-mode-instr]: ../admin-en/configure-wallarm-mode.md

# ترقية وحدة تحكم NGINX Ingress المدمجة بوحدات Wallarm

تصف هذه التعليمات الخطوات لترقية وحدة تحكم NGINX Ingress المعتمدة على Wallarm من الإصدار 4.x إلى الإصدار الجديد مع عقدة Wallarm 4.10.

لترقية العقدة التي انتهى عمرها الافتراضي (3.6 أو أقل)، يرجى استخدام [التعليمات المختلفة](older-versions/ingress-controller.md).

## المتطلبات

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## الخطوة 1: تحديث مستودع Wallarm Helm chart

```bash
helm repo update wallarm
```

## الخطوة 2: فحص جميع التغييرات القادمة في مخطط K8s

لتجنب تغيير سلوك وحدة التحكم Ingress بشكل غير متوقع، قم بفحص جميع التغييرات القادمة في مخطط K8s باستخدام [Helm Diff Plugin](https://github.com/databus23/helm-diff). يوفر هذا الإضافة الفرق بين مستندات K8s لنسخة وحدة التحكم Ingress المنشورة والنسخة الجديدة.

لتثبيت وتشغيل الإضافة:

1. قم بتثبيت الإضافة:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. تشغيل الإضافة:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم إصدار Helm مع مخطط وحدة التحكم Ingress
    * `<NAMESPACE>`: النطاق الذي تم نشر وحدة التحكم Ingress به
    * `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يعرف إعدادات وحدة التحكم Ingress 4.10 - يمكنك استخدام الواحد الذي تم إنشاؤه لتشغيل نسخة وحدة التحكم Ingress السابقة
3. تأكد من عدم وجود تغييرات يمكن أن تؤثر على استقرار الخدمات الجارية وفحص الأخطاء من stdout بعناية.

    إذا كان stdout فارغًا، تأكد من صحة ملف `values.yaml`.

## الخطوة 3: ترقية وحدة التحكم Ingress

قم بترقية وحدة التحكم NGINX Ingress المنشورة:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: اسم إصدار Helm مع مخطط وحدة التحكم Ingress
* `<NAMESPACE>`: النطاق الذي تم نشر وحدة التحكم Ingress به
* `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يعرف إعدادات وحدة التحكم Ingress 4.10 - يمكنك استخدام الواحد الذي تم إنشاؤه لتشغيل نسخة وحدة التحكم Ingress السابقة

## الخطوة 4: اختبار وحدة التحكم Ingress المُرقاة

1. تأكد من ترقية نسخة مخطط Helm:

    ```bash
    helm list -n <NAMESPACE>
    ```

    حيث `<NAMESPACE>` هو النطاق الذي تم نشر مخطط Helm مع وحدة التحكم Ingress به.

    يجب أن تتوافق نسخة المخطط مع `wallarm-ingress-4.10.3`.
1. احصل على قائمة الحاويات:

    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    يجب أن تكون حالة كل حاوية **STATUS: Running** أو **READY: N/N**. على سبيل المثال:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

1. أرسل طلبًا مع هجوم اختبار [Path Traversal](../attacks-vulns-list.md#path-traversal) إلى عنوان وحدة التحكم Ingress Wallarm:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    تحقق من أن حل الإصدار الجديد يعالج الطلب الضار كما فعل في الإصدار السابق.