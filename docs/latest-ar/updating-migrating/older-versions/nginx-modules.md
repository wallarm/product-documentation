[wallarm-status-instr]: ../../admin-en/configure-statistics-service.md
[ptrav-attack-docs]: ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]: ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]: ../../admin-en/configure-logging.md
[proxy-balancer-instr]: ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]: ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]: ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]: ../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]: ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]: ../../images/check-users.png 
[img-create-wallarm-node]: ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]: ../../installation/custom/custom-nginx-version.md
[nginx-process-time-limit-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../../user-guides/ip-lists/overview.md
[wallarm-token-types]: ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[sqli-attack-docs]: ../../attacks-vulns-list.md#sql-injection
[xss-attack-docs]: ../../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]: ../../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# ترقية وحدات NGINX Wallarm المنتهية الدعم

توضح هذه التعليمات الخطوات لترقية وحدات NGINX Wallarm المنتهية الدعم (الإصدار 3.6 وأقل) إلى الإصدار 4.10. وحدات NGINX Wallarm هي الوحدات المثبتة طبقًا لأحد التعليمات التالية:

* [حزم منفصلة لـ NGINX مستقر](../../installation/nginx/dynamic-module.md)
* [حزم منفصلة لـ NGINX Plus](../../installation/nginx-plus.md)
* [حزم منفصلة لـ NGINX توفرها التوزيعة](../../installation/nginx/dynamic-module-from-distr.md)

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## أبلغ الدعم الفني لـ Wallarm بأنك تقوم بترقية العقدة المنتهية الدعم

إذا كنت تقوم بترقية وحدات NGINX Wallarm المنتهية الدعم (الإصدار 3.6 وأقل) للإصدار 4.10 ، فأبلغ [الدعم الفني لـ Wallarm](mailto:support@wallarm.com) عن ذلك واطلب المساعدة.

بجانب أي مساعدة أخرى ، طلب تمكين منطق القوائم الفرعية الجديدة لحساب Wallarm الخاص بك. عند تمكين منطق القوائم الفرعية الجديدة ، يرجى فتح وحدة تحكم Wallarm والتأكد من أن قسم [**القوائم الفرعية**](../../user-guides/ip-lists/overview.md) متاح.

## طرق الترقية

--8<-- "../include/waf/installation/upgrade-methods.md"

## الترقية باستخدام المثبت الشامل

استخدم الإجراء أدناه لترقية وحدات NGINX Wallarm المنتهية الدعم (الإصدار 3.6 وأقل) إلى الإصدار 4.10 باستخدام [المثبت الشامل](../../installation/nginx/all-in-one.md).

### متطلبات الترقية باستخدام المثبت الشامل

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### إجراء الترقية

* إذا كانت الوحدة النمطية للتصفية والوحدات النمطية لبرنامج postanalytics مثبتة على نفس الخادم ، فيجب اتباع الإرشادات أدناه لترقية الجميع.

    ستحتاج إلى تشغيل العقدة بالإصدار الأحدث باستخدام المثبت الشامل على جهاز نظيف ، واختبار أنه يعمل بشكل جيد وإيقاف السابق وتكوين حركة المرور للتدفق من خلال الجهاز الجديد بدلاً من الجهاز السابق.

* إذا كانت الوحدة النمطية للتصفية والوحدات النمطية لبرنامج postanalytics مثبتة على خوادم مختلفة ، قم **أولاً** بترقية وحدة postanalytics و**ثم** الوحدة النمطية للتصفية اتباع هذه [الإرشادات](separate-postanalytics.md).

### الخطوة 1: تعطيل وحدة التحقق من التهديد النشط (إذا كنت تقوم بالترقية من العقدة 2.16 أو أقل)

إذا كنت تقوم بترقية Wallarm node 2.16 أو أقل ، فيرجى تعطيل وحدة [التحقق من التهديد النشط](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) في وحدة تحكم Wallarm → **Vulnerabilities** → **Configure**.

يمكن أن يتسبب تشغيل الوحدة في [الإيجابيات الكاذبة](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. يقلل تعطيل الوحدة من هذا المخاطر.

### الخطوة 2: إعداد الجهاز النظيف

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### الخطوة 3: تثبيت NGINX والتبعيات

--8<-- "../include/waf/installation/all-in-one-nginx.md"

### الخطوة 4: إعداد رمز Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

### الخطوة 5: تنزيل برنامج التثبيت Wallarm الشامل

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 6: تشغيل برنامج التثبيت Wallarm الشامل

#### وحدة التصفية وبرنامج postanalytics على نفس الخادم

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

#### وحدة التصفية وبرنامج postanalytics على خوادم مختلفة

!!! تحذير "تسلسل الخطوات لتحديث وحدات التصفية وبرامج postanalytics"
إذا كانت وحدة التصفية ووحدات postanalytics مثبتة على خوادم مختلفة ، فيجب تحديث حزم postanalytics قبل تحديث حزم وحده التصفية.

1. قم بترقية وحدة postanalytics باتباع هذه [الإرشادات](separate-postanalytics.md).
1. قم بترقية وحدة التصفية:

    === "API token"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh filtering
        ```        

        تعرض متغير `WALLARM_LABELS` المجموعة التي ستتم إضافة العقدة إليها (يستخدم لتجميع العقد بشكل منطقي في واجهة المستخدم لوحدة تحكم Wallarm).

    === "Node token"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo sh wallarm-4.10.2.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo sh wallarm-4.10.2.aarch64-glibc.sh filtering
        ```

### الخطوة 7: ترحيل القوائم الفرعية السماح والرفض من إصدار Wallarm node السابق إلى 4.10 (فقط إذا كانت العقدة قديمة 2.18 أو أقل)

إذا كنت تقوم بترقية العقدة 2.18 أو أقل ، [قم بالترحيل](../migrate-ip-lists-to-node-3.md) تكوين القائمة الفرعية السماح والقائمة الفارعية الرفض من إصدار Wallarm node السابق إلى الإصدار الأخير.

### الخطوة 8: نقل تكوين NGINX وبرنامج postanalytics من الجهاز القديم للعقدة إلى الجديد

قم بنقل تكوين NGINX المتعلق بالعقدة وتكوين postanalytics من ملفات التكوين على الجهاز القديم إلى ملفات على الجهاز الجديد. يمكنك القيام بذلك عن طريق نسخ التوجيهات المطلوبة.

**الملفات المصدر**

على الجهاز القديم ، حسب نظام التشغيل وإصدار NGINX ، قد يكون موقع ملفات التكوين لـ NGINX في مجلدات مختلفة وله أسماء مختلفة. الأمثلة الأكثر شيوعًا هي التالية:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة Wallarm node. الوصف التفصيلي متاح ضمن[الرابط][wallarm-status-instr]

كما يتم عادة تكوين وحدة postanalytics (إعدادات قاعدة البيانات Tarantool) هنا:

* `/etc/default/wallarm-tarantool` أو
* `/etc/sysconfig/wallarm-tarantool`

**الملفات الهدف**

بما أن المثبت الشامل يعمل مع مجموعات مختلفة من نظام التشغيل وإصدارات NGINX ، على الجهاز الجديد الخاص بك ، قد تكون [الملفات الهدف](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) بها أسماء مختلفة وتقع في مجلدات مختلفة.

عند نقل التهيئة ، تحتاج إلى تنفيذ الخطوات المدرجة أدناه.

#### إعادة تسمية التوجيهات المكررة لـ NGINX

أعد تسمية التوجيهات NGINX التالية إذا تم تحديدها بشكل صريح في ملفات التكوين:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

لقد قمنا فقط بتغيير أسماء التوجيهات ، ومع ذلك فإن المنطق الخاص بهم لا يزال هو نفسه. سيتم إزالة التوجيهات بأسماء سابقة قريبًا ، لذا يوصى بتغييرها قبل ذلك.

#### تحديث متغيرات تسجيل العقدة

تم تنفيذ التغييرات التالية على [متغيرات تسجيل العقدة](../../admin-en/configure-logging.md#filter-node-variables) في الإصدار الجديد للعقدة:

* تمت إعادة تسمية المتغير `wallarm_request_time` إلى `wallarm_request_cpu_time`.

    نحن فقط قمنا بتغيير اسم المتغير ، ولكن معناه لا يزال هو نفسه. يتم دعم الاسم القديم مؤقتًا أيضًا ، ولكن يوصى بتغيير المتغير.
* تمت إضافة المتغير `wallarm_request_mono_time` ـ ضعه في تكوين تنسيق التسجيل إذا كنت بحاجة إلى معلومات التسجيل حول الوقت الكلي الذي يكون مجموع:

    * الوقت في الطابور
    * الوقت بثواني قضاها المعالج في معالجة الطلب

#### ضبط إعدادات وضع التصفية للعقدة Wallarm لتطبيق التغييرات المحدثة في الإصدارات الأحدث

1. تأكد من أن السلوك المتوقع للإعدادات المدرجة أدناه يتوافق مع [المنطق المتغير لأوضاع التصفية `off` و `monitoring`](what-is-new.md#filtration-modes):
    * [توجيه `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
    * [قاعدة التصفية العامة المكونة في وحدة تحكم Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
    * [قواعد التصفية المستهدفة لنقطة النهاية المكونة في وحدة تحكم Wallarm](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
2. إذا لم يتوافق السلوك المتوقع مع المنطق المعدل للوضع التصفية ، فيرجى ضبط إعدادات وضع التصفية لتطبيق التغييرات المحدثة باستخدام [التعليمات](../../admin-en/configure-wallarm-mode.md).

### الخطوة 9: إعداد نقل العقدة المنتهية الدعم إلى جهاز جديد

إذا كانت العقدة المنتهية الدعم ومكون postanalytics مثبتين على نفس الخادم ، فيجب اتباع الإرشادات أدناه لترقية الكل.

    ستحتاج إلى تشغيل العقدة بالإصدار الأحدث باستخدام المثبت الشامل على جهاز نظيف ، واختبار أنه يعمل بشكل جيد وإيقاف السابق وتكوين حركة المرور للتدفق من خلال الجهاز الجديد بدلاً من الجهاز السابق.

### الخطوة 10: انشاء رمز تعريف wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

### الخطوة 11: تنزيل مثبت Wallarm الشامل 

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 12: تشغيل مثبت wallarm الشامل

استخدم هذا الرمز في حالة تشغيل العقدة وpostanalytics على الخادم نفسه 

--8<-- "../include/waf/installation/all-in-one-installer-run.md"


--- 

اذا كانت الوحدة النمطية للتصفية و الوحدة النمطية للبرنامج postanalytics مثبته على خوادم مختلفة فيجب اتباع الخطوات 

!!! تحذير "متسلسلة الخطوات لترقية وحدة التصفية و الوحدات النمطية للبرنامج postanalytics "
     إذا كانت وحدة التصفية ووحدات postanalytics مثبته على خوادم مختلفة ثم يتطلب تحديث وحدة برنامج postanalytics قبل تحديث حزم وحده التصفية

 1. ترقية وحدة postanalytics من الخلال [ الإرشادات الموجودة في الصفحة ](separate-postanalytics.md).
 1. ترقية وحدة التصفية: 

    === "API token"
```bash
# If using the x86_64 version:
sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh filtering

# If using the ARM64 version:
sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh filtering
```        

المتغير `WALLARM_LABELS` هو لتحديد المجموعة التي ستتم اظافة العقده اليها (يستخدم لتجميع العقد في واجهة المستخدم لوحده التحكم Wallarm).

    === "Node token"
```bash
# If using the x86_64 version:
sudo sh wallarm-4.10.2.x86_64-glibc.sh filtering

# If using the ARM64 version:
sudo sh wallarm-4.10.2.aarch64-glibc.sh filtering
```
### الخطوة 13: نقل قوائم الأرقام الفرعية المسموح بها و المرفوضة من الإصدار السابق للعقدة الى 4.10 ( إذا كان الإصدار الاقدم من العقدة هو 2.18 أو أقل )

إذا كنت تقوم بترقية العقدة 2.18 أو أقل ، قم بالترحيل (../migrate-ip-lists-to-node-3.md) الإعدادت القائمة الفرعية المدرجة في قائمة السماح و القائمة الفرعية المدرجة في الرفض من أصدار العقدة الاقدم إلى أحدث إصدار.

### الخطوة 14: نقل التكوينات الموجودة على العقدة القديمة على الماكينة القديمة الى الماكينة الجديدة 

قم بنقل  تكوينات NGINX االمتعلقة بوحده التصفية وتكوينات postanalytics من ملفات التكوين القديمة الموجوده على الجوال القديم الى الملفات الموجوده على الجهاز الجديد . يمكنك القيام بذلك عن طريق نسخ التعليمات المطلوبة. 

**الملفات المصدر**

على الجهاز القديم ، حسب نظام التشغيل والإصدار NGINX ، قد يكون موقع ملفات تكوين NGINX في أماكن مختلفة ولها أسماء مختلفة. والأكثر شيوعًا هي:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات رصد وحده Wallarm. و الوصف التفصيلية متوفر في الخلال [الرابط] [wallarm-status-instr]

تكوين وحدة postanalyticst بشكل عام يتم على النظام (اعدادات قاعدة بيانات Tarantool ):

* `/etc/default/wallarm-tarantool` أو
* `/etc/sysconfig/wallarm-tarantool`

**الملفات الهدف**

بما أن المثبت الشامل يعمل مع مجموعة مختلفة من أنظمة التشغيل وإصدارا
