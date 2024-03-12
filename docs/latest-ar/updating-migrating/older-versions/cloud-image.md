[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md

# ترقية صورة نود سحابية منتهية الصلاحية

تشرح هذه التعليمات الخطوات لترقية صورة نود سحابية منتهية الصلاحية (الإصدار 3.6 وأقل) المنشورة على AWS أو GCP إلى 4.10.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## المتطلبات

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## الخطوة 1: إبلاغ دعم فني Wallarm بأنك تقوم بترقية وحدات نود التصفية (فقط إذا كنت ترقي نود إصدار 2.18 أو أقل)

إذا كنت ترقي النود إصدار 2.18 أو أقل، يرجى إبلاغ [دعم فني Wallarm](mailto:support@wallarm.com) بأنك تقوم بترقية وحدات نود التصفية إلى أحدث إصدار واطلب تفعيل منطق قائمة الـ IP الجديد لحسابك في Wallarm. عند تمكين منطق قائمة الـ IP الجديد، يرجى التأكد من توفر قسم [**قوائم الـ IP**](../../user-guides/ip-lists/overview.md) في واجهة Wallarm.

## الخطوة 2: تعطيل وحدة التحقق من التهديدات النشطة (فقط إذا كنت ترقي نود إصدار 2.16 أو أقل)

إذا كنت ترقي نود Wallarm إصدار 2.16 أو أقل، يرجى تعطيل وحدة [التحقق من التهديدات النشطة](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) في واجهة Wallarm → **الثغرات الأمنية** → **تكوين**.

يمكن أن يسبب تشغيل الوحدة [إيجابيات مزيفة](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. تقليل هذا الخطر يمكن تحقيقه بتعطيل الوحدة.

## الخطوة 3: تحديث منفذ API

--8<-- "../include/waf/upgrade/api-port-443.md"

## الخطوة 4: مراجعة التحديثات الهندسية الأخيرة

لقد قدم التحديث الأخير [تغييرات هندسية](what-is-new.md#optimized-cloud-images) قد تؤثر على المستخدمين، وخاصة أولئك الذين يغيرون ملفات التكوين الافتراضية للنود. يرجى التعرف على هذه التغييرات لضمان التكوين الصحيح واستخدام الصورة الجديدة.

## الخطوة 5: إطلاق نسخة جديدة بنود التصفية 4.10

انسخ الإعدادات لمعالجة وتوجيه الطلبات من ملفات التكوين الخاصة بالنسخة السابقة من نود Wallarm إلى ملفات نود التصفية 4.10:

1. افتح صورة نود Wallarm على سوق السحاب وتابع إلى إطلاق الصورة:
      * [سوق أمازون](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [سوق GCP](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. في خطوة الإطلاق، اضبط الإعدادات التالية:

      * اختر إصدار الصورة `4.10.x`
      * بالنسبة لـ AWS، اختر [مجموعة الأمان المُنشأة](../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) في حقل **إعدادات مجموعة الأمان**
      * بالنسبة لـ AWS، اختر اسم [زوج المفاتيح المُنشأ](../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys) في حقل **إعدادات زوج المفاتيح**
3. أكد إطلاق النسخة.
4. بالنسبة لـ GCP، قم بتكوين النسخة وفقًا لهذه [التعليمات](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance).

## الخطوة 6: تعديل إعدادات نمط تصفية نود Wallarm وفقًا للتغييرات التي أُصدرت في الإصدارات الأخيرة (فقط إذا كنت ترقي نود إصدار 2.18 أو أقل)

1. تأكد من أن السلوك المتوقع للإعدادات المدرجة أدناه يتوافق مع [منطق التغيير لأنماط التصفية `off` و `monitoring`](what-is-new.md#filtration-modes):
      * [التوجيه `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [القاعدة العامة للتصفية المكونة في واجهة Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد التصفية الموجهة للنقطة النهائية المكونة في واجهة Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
2. إذا لم يتطابق السلوك المتوقع مع منطق أنماط التصفية المتغيرة، يرجى تعديل إعدادات نمط التصفية وفقًا للتغييرات المُصدرة باستخدام [التعليمات](../../admin-en/configure-wallarm-mode.md).

## الخطوة 7: ربط نود التصفية بسحابة Wallarm

1. قم بالاتصال بنسخة نود التصفية عبر SSH. يتوفر المزيد من التعليمات التفصيلية للاتصال بالنسخ في توثيق منصة السحاب:
      * [توثيق AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [توثيق GCP](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. أنشئ نود Wallarm جديد وربطه بسحابة Wallarm باستخدام الرمز المُنشأ كما هو موضح في التعليمات لمنصة السحاب:
      * [AWS](../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## الخطوة 8: نسخ إعدادات نود التصفية من الإصدار السابق إلى الإصدار الجديد

1. انسخ الإعدادات لمعالجة وتوجيه الطلبات من ملفات التكوين الخاصة بالنسخة السابقة من نود Wallarm إلى ملفات نود التصفية 4.10:
      * `/etc/nginx/nginx.conf` وملفات أخرى بإعدادات NGINX
      * `/etc/nginx/conf.d/wallarm-status.conf` بإعدادات خدمة مراقبة نود التصفية

        تأكد من تطابق محتوى الملفات المنسوخة مع [التكوين الآمن الموصى به](../../admin-en/configure-statistics-service.md#configuring-the-statistics-service).

      * `/etc/environment` بمتغيرات البيئة
      * أي ملفات تكوين مخصصة أخرى لمعالجة وتوجيه الطلبات، مع الأخذ في الاعتبار التغييرات الهندسية الأخيرة [التغييرات الهندسية الأخيرة](what-is-new.md#optimized-cloud-images)
1. إعادة تسمية التوجيهات NGINX التالية إذا كانت محددة صراحةً في ملفات التكوين:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    لقد قمنا بتغيير أسماء التوجيهات فقط، منطقها يظل كما هو. سيتم إيقاف التوجيهات بأسمائها القديمة قريبًا، لذا نوصي بإعادة تسميتها الآن.
1. إذا كان تكوين [تنسيق السجل الموسع](../../admin-en/configure-logging.md#filter-node-variables)، يرجى التحقق مما إذا كانت متغير `wallarm_request_time` محددًا صراحة في التكوين.

      إذا كان الأمر كذلك، يرجى إعادة تسميته إلى `wallarm_request_cpu_time`.

      لقد قمنا بتغيير اسم المتغير فقط، منطقه يظل كما هو. يتم دعم الاسم القديم مؤقتًا أيضًا، ولكن يُنصح بإعادة تسمية المتغير.
1. إذا كنت ترقي نود إصدار 2.18 أو أقل، [قم بترحيل](../migrate-ip-lists-to-node-3.md) تكوين القائمة البيضاء وقائمة الحظر من إصدار نود Wallarm السابق إلى 4.10.
1. إذا كانت الصفحة `&/usr/share/nginx/html/wallarm_blocked.html` تُعاد إلى الطلبات المحظورة، [انسخ وخصص](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) نسختها الجديدة.

      في الإصدار الجديد من النود، تم [تغيير](what-is-new.md#new-blocking-page) صفحة حظر عينة Wallarm. الشعار والبريد الإلكتروني للدعم على الصفحة الآن فارغان افتراضيًا.

متاحة المعلومات التفصيلية حول العمل مع ملفات تكوين NGINX في [توثيق NGINX الرسمي](https://nginx.org/docs/beginners_guide.html).

قائمة توجيهات نود التصفية متاحة [هنا](../../admin-en/configure-parameters-en.md).

## الخطوة 8: نقل تكوين اكتشاف الهجوم `overlimit_res` من التوجيهات إلى القاعدة

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## الخطوة 9: إعادة تشغيل NGINX

أعد تشغيل NGINX لتطبيق الإعدادات:

```bash
sudo systemctl restart nginx
```

## الخطوة 10: اختبار تشغيل نود Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 11: إنشاء صورة الآلة الافتراضية بناءً على نود التصفية 4.10 في AWS أو GCP

لإنشاء صورة الآلة الافتراضية بناءً على نود التصفية 4.10، يرجى اتباع التعليمات لـ [AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md) أو [GCP](../../admin-en/installation-guides/google-cloud/create-image.md).

## الخطوة 12: حذف نسخة نود Wallarm السابقة

إذا تم تكوين الإصدار الجديد من نود التصفية بنجاح واختباره، قم بإزالة النسخة وصورة الآلة الافتراضية بالإصدار السابق من نود التصفية باستخدام وحدة تحكم إدارة AWS أو GCP.

## الخطوة 13: إعادة تفعيل وحدة التحقق من التهديدات النشطة (فقط إذا كنت ترقي نود إصدار 2.16 أو أقل)

تعرف على [التوصية بإعداد وحدة التحقق من التهديدات النشطة](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) وأعد تفعيلها إذا لزم الأمر