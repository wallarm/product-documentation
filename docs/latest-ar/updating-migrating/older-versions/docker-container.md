[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]: ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]: ../../admin-en/configure-logging.md
[proxy-balancer-instr]: ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]: ../../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]: ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../../user-guides/ip-lists/overview.md
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]: ../../user-guides/ip-lists/overview.md

# ترقية صورة Docker التي تعتمد على NGINX أو Envoy والتي وصلت إلى نهاية العمر الافتراضي

هذه التعليمات تصف الخطوات لترقية الصورة العاملة التي تعتمد على Docker NGINX أو Envoy والتي وصلت إلى نهاية العمر الافتراضي (الإصدار 3.6 والأقل) إلى الإصدار 4.10.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## المتطلبات

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## الخطوة 1: أبلغ الدعم الفني لـWallarm بأنك تقوم بترقية وحدات العقدة الفلترة (فقط إذا كنت تقوم بترقية العقدة 2.18 أو أقل)

إذا كنت تقوم بترقية العقدة 2.18 أو أقل، يرجى إبلاغ [الدعم الفني لـWallarm](mailto:support@wallarm.com) بأنك تقوم بترقية وحدات العقدة الفلترة إلى 4.10 وطلب تمكين منطق القائمة الجديدة لحساب Wallarm الخاص بك. عند تمكين منطق القائمة الجديد، يرجى التأكد من أن القسم [**القائمات الفرعية**](../../user-guides/ip-lists/overview.md) من Wallarm Console متاح.

## الخطوة 2: تعطيل وحدة التحقق من التهديدات النشطة (فقط إذا كنت تقوم بترقية العقدة 2.16 أو أقل)

إذا كنت تقوم بترقية Wallarm node 2.16 أو أقل، يرجى تعطيل وحدة [التحقق من التهديدات النشطة](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) في Wallarm Console → **الثغرات الأمنية**→ **اضبط**.

يمكن أن يسبب تشغيل الوحدة [الإيجابيات الكاذبة](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. تعطيل الوحدة يقلل من هذا المخاطر.

## الخطوة 3: تحديث منفذ API

--8<-- "../include/waf/upgrade/api-port-443.md"

## الخطوة 4: تنزيل صورة العقدة الفلترة المحدثة

=== "صورة تعتمد على NGINX"
    ``` bash
    docker pull wallarm/node:4.10.2-1
    ```
=== "صورة تعتمد على Envoy"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## الخطوة 5: الانتقال إلى الاتصال القائم على الرمز المميز مع Wallarm Cloud

مع إصدار الإصدار 4.x، تم تحديث النهج لتوصيل الحاوية بـWallarm Cloud كما يلي:

* [تم إهمال النهج القائم على "البريد الإلكتروني وكلمة المرور"](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens). في هذا النهج، تم تسجيل العقدة في Wallarm Cloud تلقائيًا بمجرد بدء تشغيل الحاوية مع إدخال البيانات المعتمدة في المتغيرات `DEPLOY_USER` و`DEPLOY_PASSWORD`.
* تم تضمين النهج القائم على الرمز المميز. لتوصيل الحاوية بالCloud، تشغيل الحاوية مع متغير `WALLARM_API_TOKEN` الذي يحتوي على الرمز المميز للعقدة Wallarm المنسوخ من واجهة المستخدم Wallarm Console.

يوصى باستخدام النهج الجديد لتشغيل الصورة 4.10. سيتم حذف النهج القائم على "البريد الإلكتروني وكلمة المرور" في الإصدارات المستقبلية، يرجى الترحيل قبل ذلك.

لإنشاء عقدة Wallarm جديدة والحصول على الرمز المميز الخاص بها:

1. افتح Wallarm Console → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وقم بإنشاء العقدة من نوع **Wallarm node**.

    ![إنشاء Wallarm node](../../images/user-guides/nodes/create-cloud-node.png)
1. انسخ الرمز المميز المولد.

## الخطوة 6: نقل القوائم البيضاء والقوائم السوداء من الإصدار السابق للعقدة Wallarm إلى الإصدار 4.10 (فقط في حالة ترقية العقدة 2.18 أو أقل)

إذا كنت ترقي العقدة 2.18 أو أقل، [نقل](../migrate-ip-lists-to-node-3.md) تكوين القائمة البيضاء والقائمة السوداء من الإصدار السابق للعقدة Wallarm إلى الإصدار 4.10.

## الخطوة 7: الانتقال من خيارات التكوين المستهجنة

توجد الخيارات التكوينية المستهجنة التالية:

* تم إهمال متغير البيئة `WALLARM_ACL_ENABLE`. إذا تم [نقل](../migrate-ip-lists-to-node-3.md) القوائم الفرعية إلى الإصدار الجديد من العقدة، قم بإزالة هذا المتغير من أمر `docker run`.
* تمت إعادة تسمية التعليمات التوجيهية لـNGINX التالية:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    لم نغير سوى أسماء التعليمات التوجيهية، ويظل منطقها كما هو. ستتم إزالة التعليمات التوجيهية ذات الأسماء القديمة قريبًا، لذا نوصيك بإعادة تسميتها قبل ذلك.
    
    يرجى التحقق مما إذا كانت التعليمات التوجيهية ذات الأسماء القديمة محددة بشكل صريح في ملفات التكوين المثبتة. إذا كان الأمر كذلك، قم بإعادة تسميتها.
* تمت إعادة تسمية متغير التسجيل `wallarm_request_time` إلى `wallarm_request_cpu_time`.

    لم نغير سوى اسم المتغير، ويظل منطقه كما هو. الاسم القديم مدعوم مؤقتًا أيضًا، ولكن ما زال من المستحسن إعادة تسمية المتغير.
* تمت إعادة تسمية العوامل التالية لـEnvoy:

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * القسم `tsets` → `rulesets، وبالتالي الإدخالات` tsN `في هذا القسم →` rsN `
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

    لم نغير سوى أسماء العوامل، ويظل منطقها كما هو. ستتم إزالة العوامل ذات الأسماء القديمة قريبًا، لذا نوصيك بإعادة تسميتها قبل ذلك.
    
    يرجى التحقق مما إذا كانت العوامل ذات الأسماء القديمة محددة بشكل صريح في ملفات التكوين المثبتة. إذا كان الأمر كذلك، قم بإعادة تسميتها.

## الخطوة 8: تحديث صفحة حجب Wallarm (في حالة ترقية صورة تعتمد على NGINX)

في الإصدار الجديد من العقدة، تم [تغيير](what-is-new.md#new-blocking-page) صفحة الحجب النموذجية لـWallarm. الشعار والبريد الإلكتروني للدعم على الصفحة فارغان الآن بشكل افتراضي.

إذا تم تكوين الحاوية Docker لإرجاع الصفحة `&/usr/share/nginx/html/wallarm_blocked.html` للطلبات المحجوبة، قم بتغيير هذا التكوين على النحو التالي:

1. [نسخ وتخصيص](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) الإصدار الجديد من الصفحة النموذجية.
1. [تثبيت](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) الصفحة المخصصة وملف تكوين NGINX لحاوية Docker جديدة في الخطوة التالية.

## الخطوة 9: مراجعة التحديثات المعمارية الأخيرة (للصورة التي تعتمد على Docker و NGINX)

قد [أدخل التعديل الأخير](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) تحديثات معمارية قد تكون لها تأثير على المستخدمين، خاصة أولئك الذين يتعلقون بملفات التكوين المخصصة أثناء بدء تشغيل الحاوية بسبب التغييرات في مسارات بعض الملفات. يرجى التعرف على هذه التغييرات لضمان التكوين السليم واستخدام الصورة الجديدة.

## الخطوة 10: نقل تكوين اكتشاف الهجمات `overlimit_res` من التعليمات التوجيهية إلى القاعدة

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## الخطوة 11: إيقاف تشغيل الحاوية العاملة

```bash
docker stop <اسم الحاوية العاملة>
```

## الخطوة 12: تشغيل الحاوية باستخدام الصورة المحدثة

شغل الحاوية باستخدام صورة محدثة وقم بإجراء التعديلات اللازمة على مسارات الملفات المثبتة إذا كان مطلوبًا بالنظر لـ[التغييرات الأخيرة في الصورة](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image).

هناك خياران لتشغيل الحاوية باستخدام الصورة المحدثة:

* **مع متغيرات البيئة** تحدد التكوين الأساسي للعقدة الفلترة
    * [تعليمات للحاوية ذات التركيب Docker القائم على NGINX →](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [تعليمات للحاوية ذات التركيب Docker القائم على Envoy →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **في الملف التكوين المثبت** يحدد التكوين المتقدم للعقدة الفلترة
    * [تعليمات للحاوية ذات التركيب Docker القائم على NGINX →](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [تعليمات للحاوية ذات التركيب Docker القائم على Envoy →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## الخطوة 13: ضبط إعدادات وضع الترشيح للعقدة Wallarm للتغييرات التي تم إصدارها في الإصدارات الأخيرة (فقط في حالة ترقية العقدة 2.18 أو أقل)

1. تأكد من أن السلوك المتوقع للإعدادات المدرجة أدناه يتوافق مع [المنطق المتغير لأوضاع الترشيح `off` و `monitoring`](what-is-new.md#filtration-modes):
      * متغير البيئة [`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) أو التوجيه [`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode) للحاوية ذات التركيب Docker القائم على NGINX
      * متغير البيئة [`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables) أو التوجيه [`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) للحاوية التي تعتمد على Envoy
      * [قاعدة الترشيح العامة المكونة في Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد الترشيح الموجهة نحو النهاية المكونة في Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
2. إذا لم يتوافق السلوك المتوقع مع منطق وضع الترشيح المتغير، يرجى ضبط إعدادات وضع الترشيح للتغييرات التي تم إصدارها باستخدام [التعليمات](../../admin-en/configure-wallarm-mode.md).

## الخطوة 14: اختبار عملية العقدة الفلترة

--8<-- "../include/waf/installation/test-after-node-type-upgrade.md"

## الخطوة 15: حذف العقدة الفلترة للإصدار السابق

إذا كانت صورة الإصدار 4.10 العاملة تعمل بشكل صحيح، يمكنك حذف العقدة الفلترة للإصدار السابق في قسم Wallarm Console → **العقد**.

## الخطوة 16: إعادة تمكين وحدة التحقق من التهديدات النشطة (فقط إذا كنت تقوم بترقية العقدة 2.16 أو أقل)

تعرف على [التوصية حول إعداد وحدة التحقق من التهديدات النشطة](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) وأعد تمكينها إذا كان مطلوبًا.

بعد فترة، تأكد من أن تشغيل الوحدة لا يسبب إيجابيات كاذبة. إذا اكتشفت إيجابيات كاذبة، يرجى الاتصال بـ[الدعم الفني لـWallarm](mailto:support@wallarm.com).