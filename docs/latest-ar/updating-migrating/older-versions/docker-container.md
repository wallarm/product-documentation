[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]:    ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# تحديث صورة Docker NGINX- أو Envoy-based المستندة إلى نهاية العمر 

توجد هذه التعليمات البرامجية لوصف الخطوات التي تحتاج إلى اتباعها لتحديث الصورة التنفيذية النشطة لبرنامج Docker NGINX- أو Envoy-based (الإصدار 3.6 وما دونه) إلى الإصدار 4.10.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## متطلبات

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## الخطوة 1: إبلاغ الدعم الفنى لـ Wallarm بأنك تقوم بترقية وحدات العقدة الفلترية (فقط إذا كنت تقوم بترقية العقدة 2.18 أو أقل)

إذا كنت تقوم بترقية العقدة 2.18 أو أقل، فالرجاء إبلاغ [الدعم الفني لـ Wallarm](mailto:support@wallarm.com) بأنك تقوم بترقية وحدات العقدة الفلترية إلى 4.10 واطلب تمكين منطق القائمة IP الجديدة لحساب Wallarm الخاص بك. عند تمكين المنطق الجديد للقائمة IP، يرجى التأكد من توفر القسم [**قوائم IP**](../../user-guides/ip-lists/overview.md) في واجهة Wallarm.

## الخطوة 2: تعطيل وحدة التحقق من التهديدات النشطة (فقط إذا كنت تقوم بترقية العقدة 2.16 أو أقل)

إذا كنت تقوم بترقية العقدة Wallarm 2.16 أو أقل، فيُرجى تعطيل وحدة [التحقق من التهديدات النشطة](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) من خلال واجهة Wallarm Console → **الثغرات الأمنية** → **تكوين**.

قد يؤدي استمرار تشغيل الوحدة إلى حدوث [إيجابيات زائفة](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. يقلل تعطيل الوحدة من هذا المخاطرة.

## الخطوة 3: تحديث منفذ API

--8<-- "../include/waf/upgrade/api-port-443.md"

## الخطوة 4: تنزيل الصورة المحدثة لوحدة التصفية

=== "NGINX-based صور"
    ``` bash
    docker pull wallarm/node:4.10.1-1
    ```
=== "Envoy-based صور"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## الخطوة 5: التحول إلى الاتصال بواسطة رمز القسائم مع السحابة Wallarm

مع الإصدار 4.x، تم تحديث الأسلوب المستخدم لربط الحاوية مع السحابة Wallarm كمايلي:

* [تم إهمال الأسلوب الذي يعتمد على "البريد الإلكتروني وكلمة المرور"](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens). في هذا الأسلوب، تم تسجيل العقدة في السحابة Wallarm تلقائيًا بمجرد بدء التشغيل مع اعتماد استخدم بشكل صحيح في متغيرات `DEPLOY_USER` و `DEPLOY_PASSWORD`.
* تم دخول الأسلوب القائم على القسائم. لربط الحاوية بالسحابة، قم بتشغيل الحاوية مع متغير `WALLARM_API_TOKEN` الذي يحتوي على رمز العقدة Wallarm المنسوخ من واجهة المستخدم Wallarm Console.

من الأفضل أن تستخدم الأسلوب الجديد لتشغيل الصورة 4.10. سيتم حذف الأسلوب القائم على "البريد الإلكتروني وكلمة المرور" في الإصدارات المستقبلية، يرجى الترحيل قبل هذا الحدث.

لإنشاء عقدة Wallarm جديدة والحصول على رمزها:

1. قم بفتح واجهة Wallarm Console → **العقدة** نافذة في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وأنشئ العقدة من نوع **العقدة Wallarm**.

    ![إنشاء العقدة Wallarm](../../images/user-guides/nodes/create-cloud-node.png)
1. قم بنسخ الرمز المولد.

## الخطوة 6: نقل القوائم المسموحة والقوائم المرفوضة من الإصدار السابق لـ Wallarm node إلى 4.10 (فقط إذا كنت تقوم بترقية العقدة 2.18 أو أقل)

إذا كنت تقوم بترقية العقدة 2.18 أو أقل، فقم بـ[الترحيل](../migrate-ip-lists-to-node-3.md) لتكوينات القائمة المسموحة والقائمة المرفوضة من الإصدار السابق لـ Wallarm node إلى 4.10.

## الخطوة 7: التبديل عن الخيارات التكوينية المهملة

توجد الخيارات التكوينية التالية المهملة:

* تم تجاهل متغير البيئة `WALLARM_ACL_ENABLE`. إذا تم [ترحيل](../migrate-ip-lists-to-node-3.md) قوائم IP إلى الإصدار الجديد من العقدة، فقم بإزالة هذا المتغير من الأمر `docker run`.
* تم تغيير أسماء التوجيهات NGINX التالية:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    لقد قمنا فقط بتغيير أسماء التوجيهات، وظلت منطقيتها كما هي. سيتم تجاهل التوجيهات ذات الأسماء السابقة قريبًا، لذا نوصيك بإعادة تسميتها قبل ذلك.
    
    يرجى التحقق مما إذا كانت التوجيهات ذات الأسماء السابقة محددة بشكل صريح في ملفات التكوين المثبتة. إذا كان الأمر كذلك، فقم باعادة تسميتها.
* تم تغيير [متغير التسجيل](../../admin-en/configure-logging.md#filter-node-variables) `wallarm_request_time` إلى `wallarm_request_cpu_time`.

    قمنا فقط بتغيير اسم المتغير، بينما ظلت منطقيته كما هي. يتم دعم الاسم القديم مؤقتًا أيضًا، لكنه من الأفضل اعادة تسمية المتغير.
* تم تغيير أسماء المعلمات Envoy التالية:

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * قسم `tsets` → `rulesets`، وبالتالي فإن الإدخالات `tsN` في هذا القسم → `rsN`
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

    قمنا فقط بتغيير أسماء المعلمات، بينما ظلت منطقيتها كما هي. سيتم تجاهل المعلمات ذات الأسماء السابقة قريبًا، لذا نوصيك بإعادة تسميتها قبل ذلك.
    
    يرجى التحقق مما إذا كانت المعلمات ذات الأسماء السابقة محددة بشكل صريح في ملفات التكوين المثبتة. إذا كان الأمر كذلك، فقم بإعادة تسميتها.

## الخطوة 8: تحديث صفحة الحظر Wallarm (إذا كان يتم الترقية إلى الصورة المستندة إلى NGINX)

في الإصدار الجديد من العقدة، تم [تغيير](what-is-new.md#new-blocking-page) صفحة الحظر العينية لـ Wallarm. الشعار والبريد الالكتروني للدعم الموجود على الصفحة الآن فارغ بشكل افتراضي.

إذا تم تكوين الحاوية Docker لإرجاع الصفحة `&/usr/share/nginx/html/wallarm_blocked.html` إلى الطلبات المحظورة، فقم بتغيير هذا التكوين على النحو التالي:

1. [نسخ وتخصيص](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) الإصدار الجديد من الصفحة العينية.
1. [تغيير قاعدة](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) تقديم الصفحة المخصصة وملف تكوين NGINX إلى حاوية Docker جديدة في الخطوة التالية.

## الخطوة 9: مراجعة التحديثات الهندسية الأخيرة (للصورة المستندة إلى NGINX Docker)

أدخل التحديث الأخير [تغييرات هندسية](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) التي قد تؤثر على المستخدمين، وخاصة أولئك الذين يقومون بتثبيت ملفات التكوين المخصصة أثناء تنشيط الحاوية بسبب تغيير مسارات بعض الملفات. يرجى التعرف على هذه التغييرات لضمان التكوين الصحيح واستخدام الصورة الجديدة.

## الخطوة 10: نقل تكوين الكشف عن الهجوم `overlimit_res` من التوجيهات إلى القاعدة

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## الخطوة 11: إيقاف التشغيل للحاوية

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## الخطوة 12: تشغيل الحاوية باستخدام الصورة المحدثة

قم بتشغيل الحاوية باستخدام الصورة المحدثة وإجراء التعديلات اللازمة على مسارات الملفات المحملة إذا قامت بذلك [التغييرات الأخيرة على الصورة](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image).

هناك خياران لتشغيل الحاوية باستخدام الصورة المحدثة:

* **مع متغيرات البيئة** يحدد التكوين الأساسي للعقدة الفلترية
    * [تعليمات لحاوية Docker المستندة على NGINX →](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [تعليمات لحاوية Docker المستندة على Envoy →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **في الملف التكويني المثبت** يحدد التكوين المتقدم للعقدة الفلترية
    * [تعليمات لحاوية Docker المستندة على NGINX →](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [تعليمات لحاوية Docker المستندة على Envoy →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## الخطوة 13: ضبط إعدادات حالة التحكيم البينية للعقدة Wallarm على التغييرات المطلقة في الإصدارات الأخيرة (فقط إذا كنت تقوم بترقية العقدة 2.18 أو أقل)

1. تأكد من أن السلوك المتوقع للإعدادات المدرجة أدناه يتوافق مع [منطق التغيير في وضع الترشيح `off` و `monitoring`](what-is-new.md#filtration-modes):
      * متغير البيئة [`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) أو التوجيه [`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode) من حاوية Docker المستندة على NGINX
      * متغير البيئة [`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables) أو التوجيه [`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) من حاوية Docker المستندة على Envoy
      * [القاعدة العامة للترشيح التي تم تكوينها في نافذة Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد الترشيح مستهدفة المنتهى المكونة في نافذة Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
2. إذا لم يتطابق السلوك المتوقع مع منطق وضع الترشيح المتغيّر، يُرجى ضبط إعدادات وضع الترشيح على التغييرات المطلقة باستخدام [التعليمات](../../admin-en/configure-wallarm-mode.md).

## الخطوة 14: اختبار عملية العقدة الفلترية

--8<-- "../include/waf/installation/test-after-node-type-upgrade.md"

## الخطوة 15: حذف العقدة الفلترية للإصدار السابق

إذا كانت الصورة المنفذة للإصدار 4.10 تعمل بشكل صحيح، فيمكنك حذف العقدة الفلترية للإصدار السابق في قسم واجهة Wallarm Console → **العقدة**.

## الخطوة 16: إعادة تمكين وحدة التحقق من التهديدات النشطة (فقط إذا كنت تقوم بترقية العقدة 2.16 أو أقل)

راجع [التوصية على تعيين وحدة التحقق من التهديدات النشطة](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) وقم بتمكينها مرة أخرى إذا لزم الأمر.

بعد فترة من الزمن، تأكد من عدم حدوث إيجابيات كاذبة بسبب عملية الوحدة. إذا اكتشفت إيجابيات كاذبة، الرجاء الاتصال بـ [الدعم الفني لـ Wallarm](mailto:support@wallarm.com).