[status-إحصائيات-walram]:             ../admin-en/configure-statistics-service.md
[تعليمات-ذاكرة]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[تعليمات-waf]:                     ../admin-en/configure-parameters-en.md
[وثائق-هجمات-ptrav]:                ../attacks-vulns-list.md#path-traversal
[صورة-هجمات-في-واجهة-المستخدم]:              ../images/admin-guides/test-attacks-quickstart.png
[وثائق-حد-زمن-nginx]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[وثائق-حظر-حد-زمن-nginx]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[وثائق-قواعد-الكشف-عن-تجاوز-الحد]:           ../user-guides/rules/configure-overlimit-res-detection.md
[وثائق-القائمة-الرمادية]:                     ../user-guides/ip-lists/overview.md
[تعليمات-وضع-waf]:                   ../admin-en/configure-wallarm-mode.md

# تحديث صورة العقدة السحابية

هذه التعليمات تصف الخطوات لتحديث صورة العقدة السحابية 4.x المُنشورة على AWS أو GCP إلى الإصدار 4.10.

لتحديث العقدة المنتهية صلاحيتها (3.6 أو أقل)، الرجاء استخدام [تعليمات مختلفة](older-versions/cloud-image.md).

## المتطلبات

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## الخطوة 1: إطلاق نسخة جديدة مع عقدة التصفية 4.10

1. افتح صورة عقدة التصفية Wallarm على سوق المنصة السحابية وابدأ في إطلاق الصورة:
      * [سوق أمازون](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [سوق GCP](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. في خطوة الإطلاق، قم بتعيين الإعدادات التالية:

      * اختر نسخة الصورة `4.10.x`
      * بالنسبة لـ AWS، اختر [مجموعة الأمان التي تم إنشاؤها](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) في حقل **إعدادات مجموعة الأمان**
      * بالنسبة لـ AWS، اختر اسم [زوج المفاتيح الذي تم إنشاؤه](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys) في حقل **إعدادات زوج المفاتيح**
3. أكد إطلاق النسخة.
4. بالنسبة لـ GCP، قم بتكوين النسخة من خلال هذه [التعليمات](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance).

## الخطوة 2: ربط عقدة التصفية بسحابة Wallarm

1. قم بالتواصل مع نسخة عقدة التصفية عبر SSH. تتوفر تعليمات أكثر تفصيلاً للاتصال بالنسخ في وثائق منصة السحابة:
      * [وثائق AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [وثائق GCP](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. أنشئ عقدة Wallarm جديدة وقم بربطها بسحابة Wallarm باستخدام رمز التوليد كما هو موصوف في التعليمات لمنصة السحابة:
      * [AWS](../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## الخطوة 3: مراجعة التحديثات الهندسية الأخيرة

أدخل التحديث الأخير [تغييرات هندسية](what-is-new.md#optimized-cloud-images) قد تؤثر على الاستخدام، خاصةً الذين يغيرون ملفات التكوين الافتراضية للعقدة. يرجى التعرف على هذه التغييرات لضمان التكوين الصحيح واستخدام الصورة الجديدة.

## الخطوة 4: نسخ إعدادات عقدة التصفية من النسخة السابقة إلى النسخة الجديدة

انسخ إعدادات معالجة وتوجيه الطلبات من ملفات التكوين التالية للنسخة السابقة من العقدة Wallarm إلى ملفات النسخة 4.10 لعقدة التصفية:

* `/etc/nginx/nginx.conf` وملفات أخرى بإعدادات NGINX
* `/etc/nginx/conf.d/wallarm-status.conf` بإعدادات خدمة رصد العقدة
* `/etc/environment` بالمتغيرات البيئية
* أي ملفات تكوين مخصصة أخرى لمعالجة وتوجيه الطلبات، مع مراعاة [التغييرات الهندسية](what-is-new.md#optimized-cloud-images) الأخيرة

تتوفر معلومات مفصلة عن العمل مع ملفات تكوين NGINX في [وثائق NGINX الرسمية](https://nginx.org/docs/beginners_guide.html).

قائمة توجيهات عقدة التصفية متوفرة [هنا](../admin-en/configure-parameters-en.md).

## الخطوة 5: إعادة تشغيل NGINX

أعد تشغيل NGINX لتطبيق الإعدادات:

```bash
sudo systemctl restart nginx
```

## الخطوة 6: اختبار عمل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 7: إنشاء صورة الآلة الافتراضية بناءً على عقدة التصفية 4.10 في AWS أو GCP

لإنشاء صورة الآلة الافتراضية بناءً على عقدة التصفية 4.10، يرجى اتباع التعليمات لـ [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) أو [GCP](../admin-en/installation-guides/google-cloud/create-image.md).

## الخطوة 8: حذف نسخة عقدة Wallarm السابقة

إذا تم تكوين النسخة الجديدة من عقدة التصفية بنجاح وتجربتها، قم بإزالة النسخة وصورة الآلة الافتراضية بالنسخة السابقة من عقدة التصفية باستخدام واجهة إدارة AWS أو GCP.