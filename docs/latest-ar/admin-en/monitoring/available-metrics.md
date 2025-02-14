[doc-nagios-details]:       fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility
[doc-lom]:                  ../../glossary-en.md#custom-ruleset-the-former-term-is-lom
[anchor-tnt]:               #number-of-requests-not-analyzed-by-the-postanalytics-module
[anchor-api]:               #number-of-requests-not-passed-to-the-wallarm-api
[anchor-metric-1]:          #indication-that-the-postanalytics-module-drops-requests

# المقاييس المتاحة

* [تنسيق المقياس](#metric-format)
* [أنواع المقاييس في Wallarm](#types-of-wallarm-metrics)
* [تقاييس NGINX وتقاييس وحدة NGINX Wallarm](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [تقاييس وحدة البوستاناليتيكس](#postanalytics-module-metrics)

!!! warning "التغييرات المكسرة بسبب حذف المقاييس"
    بدءًا من الإصدار 4.0، لا يقوم العقدة Wallarm بجمع المقاييس التالية:
    
    * `wallarm_nginx/gauge-requests` - يمكنك استخدام المقياس [`wallarm_nginx/gauge-abnormal`](#number-of-requests) بدلاً من ذلك
    * `wallarm_nginx/gauge-attacks`
    * `wallarm_nginx/gauge-blocked`
    * `wallarm_nginx/gauge-time_detect`
    * `wallarm_nginx/derive-requests`
    * `wallarm_nginx/derive-attacks`
    * `wallarm_nginx/derive-blocked`
    * `wallarm_nginx/derive-abnormal`
    * `wallarm_nginx/derive-requests_lost`
    * `wallarm_nginx/derive-tnt_errors`
    * `wallarm_nginx/derive-api_errors`
    * `wallarm_nginx/derive-segfaults`
    * `wallarm_nginx/derive-memfaults`
    * `wallarm_nginx/derive-softmemfaults`
    * `wallarm_nginx/derive-time_detect`

## تنسيق المقياس

للمقاييس `collectd` نظرة عامة كالتالي:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

الحصول على وصف تفصيلي لتنسيق المقياس من هذا [الرابط](../monitoring/intro.md#how-metrics-look).

!!! note
    * في القائمة أدناه للمقاييس المتاحة، تم حذف اسم المضيف (جزء `host/`).
    * عند استخدام أداة `collectd_nagios`، يجب حذف اسم المضيف. يتم تعيينه بشكل منفصل باستخدام العامل `-H` ([مزيد من المعلومات حول استخدام هذه الأداة][doc-nagios-details]).

## أنواع المقاييس في Wallarm

الأنواع المسموحة لمقاييس Wallarm موضحة أدناه. يتم تخزين النوع في العامل `type` للمقياس.

* `gauge` يعتبر تمثيلًا رقميًا للقيمة المقاسة. يمكن أن تزيد القيمة وتقل.

* `derive` هو معدل التغير في القيمة المقاسة منذ القياس السابق (القيمة المشتقة). يمكن أن تزيد القيمة وتقل.

* `counter` مشابه للمقياس `gauge`. يمكن أن تزيد القيمة فقط.

## تقاييس NGINX وتقاييس وحدة NGINX Wallarm

### عدد الطلبات

عدد كل الطلبات التي تمت معالجتها بواسطة العقدة المرشحة منذ تثبيتها.

* **المقياس:** `wallarm_nginx/gauge-abnormal`
* **قيمة المقياس:**
    * `0` للنمط `off` [mode](../configure-wallarm-mode.md#available-filtration-modes)
    * `>0` للنمط `monitoring`/`safe_blocking`/`block` [mode](../configure-wallarm-mode.md#available-filtration-modes)
* **توصيات الاستكشاف والحل:**
    1. تحقق مما إذا كانت إعدادات العقدة المرشحة صحيحة.
    2. تحقق من عملية العقدة المرشحة كما هو موضح في [التعليمات](../installation-check-operation-en.md). يجب أن تزيد القيمة بمقدار `1` بعد إرسال هجوم اختبار واحد.

### عدد الطلبات المفقودة

عدد الطلبات التي لم يتم تحليلها بواسطة وحدة البوستاناليتيكس ولم يتم تمريرها إلى Wallarm API. يتم تطبيق قواعد الحجب على هذه الطلبات، لكن الطلبات لن تظهر في حساب Wallarm الخاص بك ولن يتم أخذها في الاعتبار عند تحليل الطلبات اللاحقة. العدد هو مجموع [`tnt_errors`][anchor-tnt] و [`api_errors`][anchor-api].

* **المقياس:** `wallarm_nginx/gauge-requests_lost`
* **قيمة المقياس:** `0`، مجموع [`tnt_errors`][anchor-tnt] و [`api_errors`][anchor-api]
* **توصيات الاستكشاف والحل:** اتبع التعليمات ل [`tnt_errors`][anchor-tnt] و [`api_errors`][anchor-api]

#### عدد الطلبات التي لم يتم تحليلها بواسطة وحدة البوستاناليتيكس

عدد الطلبات التي لم يتم تحليلها بواسطة وحدة البوستاناليتيكس. يتم جمع هذا المقياس إذا كانت إرسال الطلبات إلى وحدة البوستاناليتيكس مكونة ([`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)). يتم تطبيق قواعد الحجب على هذه الطلبات، لكن الطلبات لن تظهر في حساب Wallarm الخاص بك ولن يتم أخذها في الاعتبار عند تحليل الطلبات اللاحقة.

* **المقياس:** `wallarm_nginx/gauge-tnt_errors`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والحل:**
    * احصل على سجلات NGINX و Tarantool وتحليل الأخطاء إذا وجدت.
    * تحقق مما إذا كان عنوان الخادم Tarantool صحيحاً ([`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)).
    * تحقق مما إذا كانت الذاكرة كافية مخصصة لـ [Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * اتصل بفريق دعم [Wallarm](mailto:support@wallarm.com) وأوفر البيانات أعلاه إذا لم يتم حل القضية.

#### عدد الطلبات التي لم يتم تمريرها إلى Wallarm API

عدد الطلبات التي لم يتم تمريرها إلى Wallarm API. يتم جمع هذا المقياس إذا كان تمرير الطلبات إلى Wallarm API مكونًا ([`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)). يتم تطبيق قواعد الحجب على هذه الطلبات، لكن الطلبات لن تظهر في حساب Wallarm الخاص بك ولن يتم أخذها في الاعتبار عند تحليل الطلبات اللاحقة.

* **المقياس:** `wallarm_nginx/gauge-api_errors`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والحل:**
    * احصل على سجلات NGINX و Tarantool وتحليل الأخطاء إذا وجدت.
    * تحقق مما إذا كانت إعدادات Wallarm API صحيحة ([`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)).
    * تحقق مما إذا كانت الذاكرة كافية مخصصة لـ [Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * اتصل بفريق دعم [Wallarm](mailto:support@wallarm.com) وأوفر البيانات أعلاه إذا لم يتم حل القضية.

### عدد المشكلات التي أدت إلى إنهاء عملية العامل NGINX بشكل غير طبيعي

عدد المشكلات التي أدت إلى إنهاء عملية العامل NGINX بشكل غير طبيعي. السبب الأكثر شيوعًا للإنهاء غير الطبيعي هو خطأ خطير في NGINX.

* **المقياس:** `wallarm_nginx/gauge-segfaults`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والحل:**
    1. جمع بيانات حول الحالة الحالية باستخدام أحد السكربتات التالية:

        * `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` إذا تم تثبيت العقدة الفرشاة مع المثبت الكل في واحد، صورة Docker المستندة إلى NGINX، AMI أو صورة السحابة GCP
        * `/usr/share/wallarm-common/collect-info.sh` لبقية خيارات التوزيع
    
    2. قدم الملف الذي تم إنشاؤه لفريق دعم [Wallarm](mailto:support@wallarm.com) للتحقيق.

### عدد الحالات التي تجاوزت الحد من الذاكرة الافتراضية

عدد الحالات عندما تجاوزت الحد من الذاكرة الافتراضية.

* **المقياس:**
    * `wallarm_nginx/gauge-memfaults` إذا تجاوز الحد في نظامك
    * `wallarm_nginx/gauge-softmemfaults` إذا تجاوز الحد ل proton.db +lom ([`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit)) 
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والحل:**
    1. جمع بيانات حول الحالة الحالية باستخدام أحد السكربتات التالية:
        
        * `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` إذا تم تثبيت العقدة الفرشاة مع المثبت الكل في واحد، صورة Docker المستندة إلى NGINX، AMI أو صورة السحابة GCP
        * `/usr/share/wallarm-common/collect-info.sh` لبقية خيارات التوزيع

    2. قدم الملف الذي تم إنشاؤه لفريق دعم [Wallarm](mailto:support@wallarm.com) للتحقيق.

### عدد أخطاء proton.db 

عدد أخطاء proton.db باستثناء تلك التي حدثت بسبب الحالات التي [تجاوزت الحد من الذاكرة الافتراضية](#number-of-situations-exceeding-the-virtual-memory-limit).

* **المقياس:** `wallarm_nginx/gauge-proton_errors`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والحل:**
    1. نسخ رمز الخطأ من سجلات NGINX (`wallarm: proton error: <ERROR_NUMBER>`).
    1. جمع بيانات حول الحالة الحالية باستخدام أحد السكربتات التالية:
        
        * `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` إذا تم تثبيت العقدة الفرشاة مع المثبت الكل في واحد، صورة Docker المستندة إلى NGINX، AMI أو صورة السحابة GCP
        * `/usr/share/wallarm-common/collect-info.sh` لبقية خيارات التوزيع

    1. قدم البيانات المجمعة لفريق دعم [Wallarm](mailto:support@wallarm.com) للتحقيق.

### نسخة من proton.db

هي النسخة من proton.db في الاستخدام.

* **المقياس:** `wallarm_nginx/gauge-db_id`
* **قيمة المقياس:** لا حدود

### وقت آخر تحديث لملف proton.db

وقت Unix للتحديث الأخير لملف proton.db.

* **المقياس:** `wallarm_nginx/gauge-db_apply_time`
* **قيمة المقياس:** لا حدود

### نسخة من مجموعة القواعد المخصصة (الاسم السابق هو LOM)

هي نسخة من مجموعة القواعد المخصصة[custom ruleset][doc-lom] في الاستخدام.

* **المقياس:** `wallarm_nginx/gauge-custom_ruleset_id`

    (في العقدة Wallarm 3.4 وما دونها, `wallarm_nginx/gauge-lom_id`. لا يزال المقياس بالاسم السابق مجمعاً ولكنه سيتم إهماله قريباً.)
* **قيمة المقياس:** لا حدود

### وقت آخر تحديث لمجموعة القواعد المخصصة (الاسم السابق هو LOM)

وقت Unix للتحديث الأخير لمجموعة القواعد المخصصة [custom ruleset][doc-lom].

* **المقياس:** `wallarm_nginx/gauge-custom_ruleset_apply_time`

    (في العقدة Wallarm 3.4 وما دونها, `wallarm_nginx/gauge-lom_apply_time`. لا يزال المقياس بالاسم السابق مجمعاً ولكنه سيتم إهماله قريباً.)
* **قيمة المقياس:** لا حدود

### أزواج من proton.db و LOM

#### عدد أزواج من proton.db و LOM

عدد من أزواج proton.db و [LOM][doc-lom] في الاستخدام.

* **المقياس:** `wallarm_nginx/gauge-proton_instances-total`
* **قيمة المقياس:** `>0`
* **توصيات الاستكشاف والحل:**
    1. تحقق مما إذا كانت إعدادات العقدة المرشحة صحيحة.
    2. تحقق مما إذا كان المسار إلى ملف proton.db محدد بشكل صحيح ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. تحقق مما إذا كان المسار إلى ملف LOM محدد بشكل صحيح ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### عدد أزواج من proton.db و LOM التي تم تنزيلها بنجاح

عدد من أزواج proton.db و [LOM][doc-lom] التي تم تنزيلها وقراءتها بنجاح.

* **المقياس:** `wallarm_nginx/gauge-proton_instances-success`
* **قيمة المقياس:** تساوي [`proton_instances-total`](#number-of-protondb-and-lom-pairs)
* **توصيات الاستكشاف والحل:**
    1. تحقق مما إذا كانت إعدادات العقدة المرشحة صحيحة.
    2. تحقق مما إذا كان المسار إلى ملف proton.db محدد بشكل صحيح ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. تحقق مما إذا كان المسار إلى ملف LOM محدد بشكل صحيح ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### عدد أزواج من proton.db و LOM تم تنزيلها من الملفات المحفوظة الأخيرة

عدد من أزواج proton.db و [LOM][doc-lom] تم تنزيلها من الملفات المحفوظة الأخيرة. تحتفظ هذه الملفات بالأزواج المحملة بنجاح الأخيرة. إذا تم تحديث الأزواج ولكن لم يتم تنزيلها، يتم استخدام البيانات من الملفات المحفوظة الأخيرة.

* **المقياس:** `wallarm_nginx/gauge-proton_instances-fallback`
* **قيمة المقياس:** `>0`
* **توصيات الاستكشاف والحل:**
    1. تحقق مما إذا كانت إعدادات العقدة المرشحة صحيحة.
    2. تحقق مما إذا كان المسار إلى ملف proton.db محدد بشكل صحيح ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. تحقق مما إذا كان المسار إلى ملف LOM محدد بشكل صحيح ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### عدد الأزواج من proton.db و LOM غير النشطة

عدد من الأزواج المتصلة من proton.db و [LOM][doc-lom] التي لا يمكن قراءتها.

* **المقياس:** `wallarm_nginx/gauge-proton_instances-failed`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والحل:**
    1. تحقق مما إذا كانت إعدادات العقدة المرشحة صحيحة.
    2. تحقق مما إذا كان المسار إلى ملف proton.db محدد بشكل صحيح ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. تحقق مما إذا كان المسار إلى ملف LOM محدد بشكل صحيح ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

## تقاييس وحدة البوستاناليتكس

### معرف الطلب الأخير المعالج 

معرف الطلب الأخير المعالج. يمكن أن ترتفع القيمة وتقل.

* **المقياس:** 
    * `wallarm-tarantool/counter-last_request_id` إذا كانت القيمة قد ارتفعت
    * `wallarm-tarantool/gauge-last_request_id` إذا كانت القيمة قد ارتفعت أو قلت
* **قيمة المقياس:** لا حدود
* **توصيات الاستكشاف والحل:** إذا كانت الطلبات الداخلة متاحة ولكن القيمة لا تتغير، فتحقق مما إذا كانت إعدادات العقدة المرشحة صحيحة

### الطلبات المحذوفة

#### دلالة على الطلبات المحذوفة

العلم الذي يشير إلى أن الطلبات التي تحتوي على هجمات تم حذفها من وحدة البوستاناليتيكس ولكن لم يتم إرسالها إلى ال[سحابة](../../about-wallarm/overview.md#cloud).

* **المقياس:** `wallarm-tarantool/gauge-export_drops_flag`
* **قيمة المقياس:** 
    * `0` إذا لم يكن هناك طلبات محذوفة
    * `1` إذا تم حذف طلبات (ليس هناك ذاكرة كافية، يرجى اتباع التعليمات أدناه)
* **توصيات الاستكشاف والحل:**
    * [خصص الذاكرة أكثر لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * قم بتثبيت وحدة البوستاناليتيكس في مجموعة خوادم منفصلة بتتبع هذه [التعليمات](../installation-postanalytics-en.md).

#### عدد الطلبات المحذوفة

عدد الطلبات ذات الهجمات التي حذفت من وحدة البوستاناليتيكس ولم يتم إرسالها إلى ال[سحابة](../../about-wallarm/overview.md#cloud). لا تؤثر عدد الهجمات في الطلب على القيمة. يتم جمع المقياس إذا كان [`wallarm-tarantool/gauge-export_drops_flag: 1`](#indication-of-deleted-requests).

يوصى باستخدام مقياس [`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests) عند تكوين الإشعارات حول المراقبة.

* **المقياس:** `wallarm-tarantool/gauge-export_drops`
* **قيمة المقياس:** `0`
* **معدل التغيير:** `wallarm-tarantool/derive-export_drops`
* **توصيات الاستكشاف والحل:**
    * [خصص الذاكرة أكثر لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * قم بتثبيت وحدة البوستاناليتيكس في مجموعة خوادم منفصلة بتتبع ال [تعليمات](../installation-postanalytics-en.md).

### تأخير تصدير الطلب (بالثواني)

التأخير بين تسجيل الطلب من قبل وحدة البوستاناليتيكس وتحميل المعلومات حول الهجمات المكتشفة إلى سحابة Wallarm.

* **المقياس:** `wallarm-tarantool/gauge-export_delay`
* **قيمة المقياس:**
    * مثلى إذا كان `<60`
    * تحذير إذا كان `>60`
    * حرج إذا كان `>300`
* **توصيات الاستكشاف والحل:**
    * اقرأ السجلات من الملف `/var/log/wallarm/export-attacks.log` أو `/opt/wallarm/var/log/wallarm/export-attacks-out.log` [اعتمادًا على وسيلة تثبيت العقدة](../configure-logging.md) وتحليل الأخطاء. يمكن أن يتسبب قيم أعلى في ذلك بسبب عدمولى الناقل شبكة من العقدة المرشحة إلى خدمة API لـ Wallarm.
    * تحقق مما إذا كانت الذاكرة كافية مخصصة لـ [Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool). المقياس [`tnt_errors`][anchor-tnt] أيضا يرتفع عند تجاوز الذاكرة المخصصة.

### وقت تخزين الطلبات في وحدة البوستاناليتيكس (بالثواني)

الوقت الذي تخزن فيه وحدة البوستاناليتيكس الطلبات. تعتمد القيمة على كمية الذاكرة المخصصة لوحدة البوستاناليتيكس وعلى حجم وخصائص الطلبات HTTP المعالجة. كلما كان الفاصل الزمني أقصر، كلما كان أداء خوارزميات الكشف أسوأ - لأنها تعتمد على البيانات التاريخية. ونتيجة لذلك، إذا كانت الفواصل زمنية قصيرة جدا، يمكن للمهاجم أن ينفذ هجمات القوة الغاشمة بشكل أسرع ودون أن يلاحظ. في هذه الحالة، ستحصل على بيانات أقل حول تاريخ سلوك المهاجم.

* **المقياس:** `wallarm-tarantool/gauge-timeframe_size`
* **قيمة المقياس:**
    * مثلى إذا كان `>900`
    * تحذير إذا كان `<900`
    * حرج إذا كان `<300`
* **توصيات الاستكشاف والحل:**
    * [خصص الذاكرة أكثر لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * قم بتثبيت وحدة البوستاناليتيكس في مجموعة خوادم منفصلة بتتبع ال [تعليمات](../installation-postanalytics-en.md).