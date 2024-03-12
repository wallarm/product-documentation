# ترقية صورة دوكر القائمة على NGINX أو Envoy

هذه الإرشادات تصف الخطوات لترقية صورة دوكر القائمة على NGINX أو Envoy من الإصدار 4.x إلى الإصدار 4.10.

!!! تحذير "استخدام بيانات الاعتماد لعقدة Wallarm الموجودة بالفعل"
    نحن لا نوصي باستخدام عقدة Wallarm الموجودة بالفعل من الإصدار السابق. يُرجى اتباع هذه التعليمات لإنشاء عقدة تصفية جديدة بالإصدار 4.10 ونشرها كحاوية دوكر.

لترقية العقدة التي انتهى عمرها الافتراضي (3.6 أو أقل)، يرجى استخدام [تعليمات مختلفة](older-versions/docker-container.md).

## المتطلبات

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## الخطوة 1: تنزيل صورة العقدة التصفية المحدثة

=== "صورة مبنية على NGINX"
    ``` bash
    docker pull wallarm/node:4.10.1-1
    ```
=== "صورة مبنية على Envoy"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## الخطوة 2: مراجعة التحديثات الهندسية الأخيرة (لصورة دوكر القائمة على NGINX)

قدم التحديث الأخير [تغييرات هندسية](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) قد تؤثر على الاستخدام، خصوصًا لأولئك الذين يقومون بتركيب ملفات التكوين المخصصة أثناء بدء تشغيل الحاوية بسبب تغييرات في مسارات بعض الملفات. يُرجى التعرف على هذه التغييرات لضمان التكوين الصحيح واستخدام الصورة الجديدة.

## الخطوة 3: إيقاف تشغيل الحاوية الجارية

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## الخطوة 4: تشغيل الحاوية باستخدام الصورة الجديدة

1. انتقل إلى وحدة التحكم في Wallarm → **العقد** وإنشاء **عقدة Wallarm**.

    ![إنشاء عقدة Wallarm](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. انسخ الرمز المولد.
1. قم بتشغيل الصورة المحدثة باستخدام الرمز المنسوخ وإجراء التعديلات اللازمة على مسارات الملفات المركبة إذا لزم ذلك بناءً على [التغييرات الأخيرة في الصورة](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image).
    
    هناك خياران لتشغيل الحاوية باستخدام الصورة المحدثة:

    * **مع المتغيرات البيئية** التي تحدد التكوين الأساسي لعقدة التصفية
        * [الإرشادات الخاصة بحاوية دوكر القائمة على NGINX →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
        * [الإرشادات الخاصة بحاوية دوكر القائمة على Envoy →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
    * **في الملف التكويني المركب** الذي يحدد تكوين عقدة التصفية المتقدمة
        * [الإرشادات الخاصة بحاوية دوكر القائمة على NGINX →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
        * [الإرشادات الخاصة بحاوية دوكر القائمة على Envoy →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## الخطوة 5: اختبار عملية تصفية العقدة

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 6: حذف عقدة التصفية للإصدار السابق

إذا كانت الصورة المُنشرة للإصدار 4.10 تعمل بشكل صحيح، يمكنك حذف عقدة التصفية للإصدار السابق في وحدة التحكم في Wallarm → **العقد**.