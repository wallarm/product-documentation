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

# الترقية إلى إصدار أحدث من صورة العقدة السحابية لـ EOL

توضح هذه التعليمات الخطوات التي يجب اتخاذها لترقية صورة العقدة السحابية التي تم الاستغناء عنها (الإصدار 3.6 والإصدارات الأقل) المنشورة على AWS أو GCP إلى 4.10.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## متطلبات

--8<-- "../include-ar/waf/installation/basic-reqs-for-upgrades.md"

## الخطوة 1: التواصل مع الدعم الفني لـ Wallarm بأنك تقوم بترقية الوحدات النمطية للعقدة الفلترة (فقط إذا كنت تقوم بترقية العقدة الإصدار 2.18 أو الإصدار الأقل)

إذا كنت تقوم بترقية العقدة 2.18 أو الإصدار الأقل، يرجى إعلام [الدعم الفني لـ Wallarm](mailto:support@wallarm.com) بأنك تقوم بترقية وحدات العقدة الفلترة إلى الإصدار الأخير وطلب تمكين منطق القائمة الشبكية IP الجديدة لحسابك في Wallarm. عند تمكين منطق قائمة IP الجديدة، يرجى التأكد من اتاحة القسم [**قوائم IP**](../../user-guides/ip-lists/overview.md) في لوحة التحكم Wallarm.

## الخطوة 2: تعطيل وحدة التحقق من التهديد النشط (فقط في حال ترقية العقدة 2.16 أو الإصدارات الأقل)

إذا كنت تقوم بترقية العقدة Wallarm 2.16 أو الإصدار الأقل، يرجى تعطيل وحدة [التحقق من التهديد النشط](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) في لوحة التحكم Wallarm → **الثغرات الأمنية** → **تكوين**.

يمكن أن يتسبب تشغيل الوحدة في حصول [تحذيرات إيجابية زائفة](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. يقلل تعطيل الوحدة من هذا المخاطر.

## الخطوة 3: تحديث بوابة واجهة برمجة التطبيقات

--8<-- "../include/waf/upgrade/api-port-443.md"

## الخطوة 4: مراجعة أحدث التحديثات الهندسية

قدم التحديث الأخير [تغييرات في الهندسة المعمارية](what-is-new.md#optimized-cloud-images) قد يتأثر بها المستخدمون، خاصة الذين يقومون بتغيير ملفات التكوين الافتراضية للعقدة. يرجى التعرف على هذه التغييرات لضمان التكوين الصحيح واستخدام الصورة الجديدة بشكل صحيح.

## الخطوة 5: إطلاق عُقدة فلترة جديدة مع الإصدار 4.10

نسخ إعدادات معالجة وتوكيل الطلبات من ملفات التكوين التالية لإصدار العقدة Wallarm السابق إلى ملفات العقدة الفلترة 4.10:

1. افتح صورة العقدة الفلترة Wallarm على سوق النظام السحابي وانتقل إلى إطلاق الصورة:
      * [سوق أمازون](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [سوق GCP](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. في خطوة الإطلاق، قم بتعيين الإعدادات التالية:

      * اختر نسخة الصورة `4.10.x`
      * لـ AWS، حدد [المجموعة الأمنية المنشأة](../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) في حقل **إعدادات المجموعة الأمنية**
      * لـ AWS، حدد اسم [الزوج المفتاح المنشأ](../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys) في حقل **إعدادات الزوج المفتاح**
3. قم بتأكيد إطلاق العُقدة.
4. لـ GCP، قم بتكوين العُقدة وفقًا لهذه [التعليمات](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance).

## الخطوة 6: ضبط إعدادات نمط التصفية للعقدة Wallarm لتكون متوافقة مع التغييرات المفعلة في الإصدارات الأخيرة (فقط في حال ترقية العقدة 2.18 أو الإصدارات الأقل)

1. تأكد من أن السلوك المتوقع للإعدادات المدرجة أدناه يتوافق مع [المنطق المتغير لأوضاع التصفية `off` و `monitoring`](what-is-new.md#filtration-modes):
      * [موجهة `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [قاعدة التصفية العامة المكونة في لوحة التحكم Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد التصفية الموجهة للنقطة النهائية المكونة في لوحة التحكم Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
2. إذا لم يكن السلوك المتوقع يتوافق مع منطق نمط التصفية المتغير، يرجى ضبط إعدادات نمط التصفية لتكون متوافقة مع التغييرات المفعلة باستخدام [التعليمات](../../admin-en/configure-wallarm-mode.md).

## الخطوة 7: ربط العقدة الفلترة بـ Wallarm Cloud

1. قم بالاتصال بالعُقدة الفلترة عبر SSH. تتوفر تعليمات أكثر تفصيلاً حول الاتصال بالعُقدة في وثائق النظام السحابي:
      * [وثائق AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [وثائق GCP](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. قم بإنشاء عُقدة Wallarm جديدة وربطها بـ Wallarm Cloud باستخدام الرمز المستخدم كموضح في التعليمات الخاصة بالنظام السحابي:
      * [AWS](../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## الخطوة 8: نسخ إعدادات العقدة الفلترة من الإصدار السابق إلى الإصدار الجديد

1. قم بنسخ إعدادات معالجة وتوكيل الطلبات من ملفات التكوين التالية لإصدار العقدة السابق من Wallarm إلى ملفات العقدة الفلترة 4.10:
      * `/etc/nginx/nginx.conf` وغيرها من الملفات ذات الإعدادات NGINX
      * `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات خدمة مراقبة العقدة الفلترة

        تأكد من أن محتويات الملفات المنسوخة تتوافق مع [التكوين الآمن الموصى به](../../admin-en/configure-statistics-service.md#configuring-the-statistics-service).

      * `/etc/environment` بالمتغيرات البيئية
      * أي ملفات تكوين أخرى مخصصة لمعالجة وتوكيل الطلبات، مع مراعاة التغييرات الهندسية [الحديثة](what-is-new.md#optimized-cloud-images)
1. قم بإعادة تسمية الأوامر التالية لـ NGINX إذا تم تحديدها بوضوح في ملفات التكوين:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    قمنا فقط بتغيير أسماء الأوامر، مع الحفاظ على المنطق الأصلي. ستُهمل تدريجيًّا الأوامر ذات الأسماء السابقة، لذلك يوصى بإعادة تسميتها.

1. إذا تم تكوين [تنسيق السجل الموسع](../../admin-en/configure-logging.md#filter-node-variables)، يرجى التحقق مما إذا كان المتغير `wallarm_request_time` محددًا بوضوح في التكوين.

      إذا كان الأمر كذلك، يرجى تغيير اسمه إلى `wallarm_request_cpu_time`.

      لقد قمنا فقط بتغيير اسم المتغير، مع الحفاظ على المنطق الأصلي. يتم دعم الاسم القديم مؤقتًا أيضًا، ولكن يفضل بعد ذلك تغيير اسم المتغير.
1. إذا كنت تقوم بترقية العقدة الإصدار 2.18 أو الإصدارات الأقل، قم بـ[الترحيل](../migrate-ip-lists-to-node-3.md) من الإصدار السابق لـ Wallarm إلى الإصدار 4.10.
1. إذا كان الكود `&/usr/share/nginx/html/wallarm_blocked.html` يتم إرجاعه للطلبات المحظورة، قم بنسخ وتخصيص الإصدار [الجديد](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

      في الإصدار الجديد للعُقدة، تم تغيير الصفحة النموذجية لحظر Wallarm. الشعار والبريد الإلكتروني للدعم المباشر على الصفحة الآن فارغة بشكل افتراضي.

معلومات مفصلة حول العمل مع ملفات التكوين الخاصة بـ NGINX متاحة في [وثائق NGINX الرسمية](https://nginx.org/docs/beginners_guide.html).

[قائمة توجيهات العقدة الفلترة متاحة هنا](../../admin-en/configure-parameters-en.md).

## الخطوة 9: الانتقال من التكوين المباشر لكشف الهجمات `overlimit_res` إلى تحديده بالواعي للقواعد

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## الخطوة 10: إعادة تشغيل NGINX

أعد تشغيل NGINX لتطبيق الإعدادات:

```bash
sudo systemctl restart nginx
```

## الخطوة 11: اختبار تشغيل العقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 12: إنشاء صورة الجهاز الافتراضي استنادًا إلى العقدة الفلترة 4.10 في AWS أو GCP

لإنشاء صورة الجهاز الافتراضي استنادًا إلى العقدة الفلترة 4.10، يُرجى اتباع التعليمات المُناسبة لـ [AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md) أو [GCP](../../admin-en/installation-guides/google-cloud/create-image.md).

## الخطوة 13: حذف المثيل السابق لعقدة Wallarm

إذا تم تكوين الإصدار الجديد من العقدة الفلترة بنجاح وتم اختباره، فعليك إزالة المثيل والصورة الظاهرة للجهاز بها الإصدار السابق من العقدة الفلترة بإستخدام واجهة التحكم AWS أو GCP.

## الخطوة 14: إعادة تمكين وحدة التحقق من التهديد النشط (فقط في حال ترقية العقدة 2.16 أو الإصدارات الأقل)

اطلع على [التوصية حول إعداد وحدة التحقق من التهديد النشط](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) وأعد تمكينها إذا لزم الأمر.

بعد فترة، تأكد من أن تشغيل الوحدة لا يتسبب في تحذيرات إيجابية زائفة. في حالة اكتشاف تحذيرات إيجابية زائفة، يُرجى الاتصال بـ [الدعم الفني لـ Wallarm](mailto:support@wallarm.com).