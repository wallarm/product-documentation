[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# تحديث وحدة تحكم الدخول NGINX مع وحدات Wallarm المدمجة

توصف هذه التعليمات الخطوات لتحديث وحدة تحكم الدخول NGINX القائمة على Wallarm من الإصدار 4.x إلى الإصدار الجديد مع عقدة Wallarm 4.10.

لترقية العقدة التي انتهى دورها (3.6 أو أقل)، يرجى استخدام [تعليمات مختلفة](older-versions/ingress-controller.md).

## المتطلبات

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## الخطوة 1: تحديث مستودع مخططات Wallarm Helm

```bash
helm repo update wallarm
```

## الخطوة 2: التحقق من جميع التغييرات القادمة في مخطط K8s

لتجنب تغيير غير متوقع في سلوك وحدة تحكم الدخول، تحقق من جميع التغييرات القادمة في مخطط K8s باستخدام [Helm Diff Plugin](https://github.com/databus23/helm-diff). يظهر هذا البرنامج الفرق بين مخططات K8s لإصدار وحدة تحكم الدخول المُنشَر والإصدار الجديد.

لتثبيت وتشغيل البرنامج:

1. تثبيت البرنامج:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. تشغيل البرنامج:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: اسم إصدار Helm مع مخطط وحدة تحكم الدخول
    * `<NAMESPACE>`: الفضاء الذي تم فيه نشر وحدة تحكم الدخول
    * `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد إعدادات وحدة تحكم الدخول 4.10 - يمكنك استخدام الواحد الذي تم إنشاؤه لتشغيل إصدار وحدة تحكم الدخول السابق
3. تأكد من أنه لا توجد تغييرات يمكن أن تؤثر على استقرار الخدمات الجارية وافحص الأخطاء من stdout بعناية.

    إذا كان stdout فارغًا، تأكد من أن ملف `values.yaml` صالح.

## الخطوة 3: ترقية وحدة تحكم الدخول

ترقية وحدة تحكم الدخول NGINX المنشورة:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.2 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: اسم إصدار Helm مع مخطط وحدة تحكم الدخول
* `<NAMESPACE>`: الفضاء الذي تم فيه نشر وحدة تحكم الدخول
* `<PATH_TO_VALUES>`: المسار إلى ملف `values.yaml` الذي يحدد إعدادات وحدة تحكم الدخول 4.10 - يمكنك استخدام الواحد الذي تم إنشاؤه لتشغيل إصدار وحدة تحكم الدخول السابق

## الخطوة 4: اختبار وحدة تحكم الدخول بعد الترقية

1. التأكد من تم تحديث إصدار مخطط Helm:

    ```bash
    helm list -n <NAMESPACE>
    ```

    حيث `<NAMESPACE>` هو الفضاء الذي نُشر فيه مخطط Helm مع وحدة تحكم الدخول.

    يجب أن يتوافق إصدار المخطط مع `wallarm-ingress-4.10.2`.
1. الحصول على قائمة الوحدات المحمولة:
    
    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    يجب أن يكون حالة كل وحدة **STATUS: Running** أو **READY: N/N**. على سبيل المثال:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

1. إرسال طلب باستخدام هجوم [Path Traversal](../attacks-vulns-list.md#path-traversal) لاختبار عنوان وحدة تحكم الدخول Wallarm:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    التحقق من أن حل الإصدار الأحدث يعالج الطلب الضار كما فعل في الإصدار السابق.