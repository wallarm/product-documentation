# ترقية صورة Docker المستندة إلى NGINX أو Envoy

تصف هذه التعليمات الخطوات لترقية صورة Docker المستندة إلى NGINX أو Envoy الجارية من إصدار 4.x إلى الإصدار 4.10.

!!! تحذير "استخدام بيانات اعتماد العقدة Wallarm الموجودة مسبقًا"
    ننصح بعدم استخدام العقدة Wallarm القائمة من الإصدار السابق. يرجى اتباع هذه التعليمات لإنشاء عقدة تصفية جديدة من الإصدار 4.10 ونشرها كحاوية Docker.

لترقية العقدة ذات النهاية المحددة للخدمة (3.6 أو أقل)، يُرجى استخدام [تعليمات مختلفة](older-versions/docker-container.md).

## المتطلبات

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## الخطوة 1: تنزيل صورة العقدة التصفية المُحدثة

=== "صورة المستندة إلى NGINX"
    ``` bash
    docker pull wallarm/node:4.10.4-1
    ```
=== "صورة المستندة إلى Envoy"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## الخطوة 2: مراجعة التحديثات الهندسية الأخيرة (لصورة Docker المستندة إلى NGINX)

قدمت آخر تحديث [تغييرات هندسية](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) قد تؤثر على المستخدمين، خاصةً أولئك الذين يركبون ملفات التكوين المخصصة أثناء بدء تشغيل الحاوية بسبب التغييرات في مسارات بعض الملفات. يرجى التعرف على هذه التغييرات لضمان التكوين والاستخدام الصحيحين للصورة الجديدة.

## الخطوة 3: إيقاف تشغيل الحاوية الجارية

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## الخطوة 4: تشغيل الحاوية باستخدام الصورة الجديدة

1. انتقل إلى Wallarm Console → **Nodes** وأنشئ **عقدة Wallarm**.

    ![إنشاء عقدة Wallarm](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. انسخ الرمز المُنشأ.
1. قم بتشغيل الصورة المُحدثة باستخدام الرمز المنسوخ وقم بإجراء التعديلات اللازمة على مسارات الملفات المُركبة إذا لزم الأمر بسبب [التغييرات الأخيرة في الصورة](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image).
    
    هناك خياران لتشغيل الحاوية باستخدام الصورة المُحدثة:

    * **باستخدام المتغيرات البيئية** التي تحدد تكوين عقدة التصفية الأساسية
        * [تعليمات لحاوية Docker المستندة إلى NGINX →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
        * [تعليمات لحاوية Docker المستندة إلى Envoy →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
    * **في ملف التكوين المُركب** الذي يحدد تكوين عقدة التصفية المتقدمة
        * [تعليمات لحاوية Docker المستندة إلى NGINX →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
        * [تعليمات لحاوية Docker المستندة إلى Envoy →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## الخطوة 5: اختبار تشغيل عقدة التصفية

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 6: حذف عقدة التصفية من الإصدار السابق

إذا كانت الصورة المنشورة من الإصدار 4.10 تعمل بشكل صحيح، يمكنك حذف عقدة التصفية من الإصدار السابق في Wallarm Console → **Nodes**.