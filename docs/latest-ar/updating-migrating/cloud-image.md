# ترقية صورة العقدة السحابية

تصف هذه التعليمات خطوات ترقية صورة العقدة السحابية 4.x المُنشرة على AWS أو GCP إلى الإصدار 4.10.

لترقية العقدة التي وصلت إلى نهاية الخدمة (3.6 أو أقل)، يُرجى استخدام [تعليمات مختلفة](older-versions/cloud-image.md).

## المتطلبات

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## الخطوة 1: إطلاق نسخة جديدة بعقدة تصفية 4.10

1. افتح صورة عقدة تصفية Wallarm من سوق السحاب الإلكتروني وتابع لإطلاق الصورة:
      * [سوق أمازون](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [سوق GCP](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. في خطوة الإطلاق، قم بتعيين الإعدادات التالية:

      * اختر إصدار الصورة `4.10.x`
      * بالنسبة لـ AWS، اختر [مجموعة الأمان المُنشأة](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) في حقل **إعدادات مجموعة الأمان**
      * بالنسبة لـ AWS، اختر اسم [زوج المفاتيح المُنشأ](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys) في حقل **إعدادات زوج المفاتيح**
3. أكد إطلاق النسخة.
4. بالنسبة لـ GCP، قم بتكوين النسخة باتباع هذه [التعليمات](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance).

## الخطوة 2: ربط عقدة التصفية بـ Wallarm Cloud

1. اتصل بنسخة عقدة التصفية عبر SSH. التعليمات الأكثر تفصيلاً للاتصال بالنسخ متوفرة في وثائق المنصة السحابية:
      * [وثائق AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [وثائق GCP](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. أنشئ عقدة Wallarm جديدة واتصل بها بـ Wallarm Cloud باستخدام التوكن المُنشأ كما ورد في التعليمات للمنصة السحابية:
      * [AWS](../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## الخطوة 3: مراجعة التحديثات الهندسية الأخيرة

قدم التحديث الأخير [تغييرات هندسية](what-is-new.md#optimized-cloud-images) قد تؤثر على المستخدمين، خاصةً أولئك الذين يغيرون ملفات التكوين الافتراضية للعقدة. يُرجى التعرف على هذه التغييرات لضمان التكوين واستخدام الصورة الجديدة بشكل صحيح.

## الخطوة 4: نسخ إعدادات عقدة التصفية من الإصدار السابق إلى الإصدار الجديد

انسخ إعدادات معالجة وتوجيه الطلبات من ملفات التكوين للإصدار السابق من عقدة Wallarm إلى ملفات الإصدار 4.10 لعقدة التصفية:

* `/etc/nginx/nginx.conf` وملفات أخرى ذات إعدادات NGINX
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات خدمة مراقبة عقدة التصفية
* `/etc/environment` مع متغيرات البيئة
* أي ملفات تكوين مخصصة أخرى لمعالجة وتوجيه الطلبات، مع مراعاة [التغييرات الهندسية](what-is-new.md#optimized-cloud-images) الأخيرة

المعلومات التفصيلية حول العمل مع ملفات تكوين NGINX متوفرة في [وثائق NGINX الرسمية](https://nginx.org/docs/beginners_guide.html).

قائمة توجيهات عقدة التصفية متوفرة [هنا](../admin-en/configure-parameters-en.md).

## الخطوة 5: إعادة تشغيل NGINX

أعد تشغيل NGINX لتطبيق الإعدادات:

```bash
sudo systemctl restart nginx
```

## الخطوة 6: اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 7: إنشاء صورة الجهاز الافتراضي بناءً على عقدة التصفية 4.10 في AWS أو GCP

لإنشاء صورة الجهاز الافتراضي بناءً على عقدة التصفية 4.10، يُرجى اتباع التعليمات لـ [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) أو [GCP](../admin-en/installation-guides/google-cloud/create-image.md).

## الخطوة 8: حذف نسخة عقدة Wallarm السابقة

إذا تم تكوين واختبار الإصدار الجديد من عقدة التصفية بنجاح، قم بإزالة النسخة وصورة الجهاز الافتراضي مع الإصدار السابق لعقدة التصفية باستخدام وحدة تحكم إدارة AWS أو GCP.