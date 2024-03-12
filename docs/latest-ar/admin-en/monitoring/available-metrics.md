[doc-nagios-details]:       fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[doc-lom]:                  ../../glossary-en.md#custom-ruleset-the-former-term-is-lom

[anchor-tnt]:               #number-of-requests-not-analyzed-by-the-postanalytics-module
[anchor-api]:               #number-of-requests-not-passed-to-the-wallarm-api
[anchor-metric-1]:          #indication-that-the-postanalytics-module-drops-requests

# المقاييس المتاحة

* [صيغة المقياس](#metric-format)
* [أنواع مقاييس Wallarm](#types-of-wallarm-metrics)
* [مقاييس NGINX و مقاييس وحدة Wallarm NGINX](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [مقاييس Postanalytics](#postanalytics-module-metrics)

!!! warning "التغييرات الفاصلة بسبب القياسات التي تم حذفها"
    بدءا من الإصدار 4.0، لا يقوم العقدة Wallarm بجمع القياسات التالية:

    * `curl_json-wallarm_nginx/gauge-requests` - يمكنك استخدام القياس [`curl_json-wallarm_nginx/gauge-abnormal`](#number-of-requests) بدلاً من ذلك
    * `curl_json-wallarm_nginx/gauge-attacks`
    * `curl_json-wallarm_nginx/gauge-blocked`
    * `curl_json-wallarm_nginx/gauge-time_detect`
    * `curl_json-wallarm_nginx/derive-requests`
    * `curl_json-wallarm_nginx/derive-attacks`
    * `curl_json-wallarm_nginx/derive-blocked`
    * `curl_json-wallarm_nginx/derive-abnormal`
    * `curl_json-wallarm_nginx/derive-requests_lost`
    * `curl_json-wallarm_nginx/derive-tnt_errors`
    * `curl_json-wallarm_nginx/derive-api_errors`
    * `curl_json-wallarm_nginx/derive-segfaults`
    * `curl_json-wallarm_nginx/derive-memfaults`
    * `curl_json-wallarm_nginx/derive-softmemfaults`
    * `curl_json-wallarm_nginx/derive-time_detect`

## شكل المقياس

تحتوي مقاييس `collectd` على الشكل التالي:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

متوفرة وصف مفصل لتنسيق المقياس في هذا [الرابط](../monitoring/intro.md#how-metrics-look).

!!! note
    * في قائمة المقاييس المتوفرة أدناه، يتم حذف اسم المضيف (جزء `host /`).
    * عند استخدام أداة `collectd_nagios`، يجب حذف اسم المضيف، يتم تعيينه بشكل منفصل باستخدام المعلمة `-H` ([المزيد حول استخدام هذه الأداة][doc-nagios-details]).

## أنواع مقاييس Wallarm

أدناه توجد الأنواع المسموحة من مقاييس Wallarm. يتم تخزين النوع في معلمة مقياس `type`.

* `gauge` هو العرض العددي للقيمة التي تم قياسها. يمكن أن ترتفع القيمة وتتناقص أيضا.

* `derive` هو معدل تغيير القيمة المقاسة منذ القياس السابق (القيمة المشتقة). يمكن أن ترتفع القيمة وتتناقص أيضا.

* `counter` هو مشابه لمقياس `gauge`. يمكن أن ترتفع القيمة فقط.

## مقاييس NGINX و مقاييس وحدة Wallarm NGINX

### عدد الطلبات

عدد جميع الطلبات التي تمت معالجتها بواسطة عقدة الفلتر منذ تثبيتها.

* **المقياس:** `curl_json-wallarm_nginx/gauge-abnormal`
* **قيمة المقياس:**
    * `0` للوضع `off` [mode](../configure-wallarm-mode.md#available-filtration-modes)
    * `>0` لوضع `monitoring`/`safe_blocking`/`block` [mode](../configure-wallarm-mode.md#available-filtration-modes)
* **توصيات الاستكشاف والتصحيح:**
    1. تحقق مما إذا كانت إعدادات عقدة الفلتر صحيحة.
    2. تحقق من عملية عقدة الفلتر وفقا لـ [التعليمات](../installation-check-operation-en.md). يجب أن تزيد القيمة بـ `1` بعد إرسال هجوم الاختبار الواحد.

### عدد الطلبات المفقودة

عدد الطلبات التي لم يتم تحليلها بواسطة وحدة postanalytics ولم يتم تمريرها إلى واجهة برمجة تطبيقات Wallarm. يتم تطبيق قواعد الحظر على هذه الطلبات، ولكن الطلبات غير مرئية في حساب Wallarm الخاص بك وليست محسوبة عند تحليل الطلبات التالية. العدد هو مجموع [`tnt_errors`][anchor-tnt] و [`api_errors`][anchor-api].

* **المقياس:** `curl_json-wallarm_nginx/gauge-requests_lost`
* **قيمة المقياس:** `0`، مجموع [`tnt_errors`][anchor-tnt] و [`api_errors`][anchor-api]
* **توصيات الاستكشاف والتصحيح:** اتبع الإرشادات لـ [`tnt_errors`][anchor-tnt] و [`api_errors`][anchor-api]

#### عدد الطلبات غير المحللة بواسطة وحدة البوست-أناليتكس

عدد الطلبات التي لم يتم تحليلها بواسطة وحدة البوست-أناليتكس. يتم جمع هذا المقياس إذا تم تكوين إرسال الطلبات إلى وحدة البوست-أناليتكس ([`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)). يتم تطبيق قواعد الحظر على هذه الطلبات، ولكن الطلبات غير مرئية في حساب Wallarm الخاص بك وليست محسوبة عند تحليل الطلبات التالية.

* **المقياس:** `curl_json-wallarm_nginx/gauge-tnt_errors`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والتصحيح:**
    * احصل على سجلات NGINX و Tarantool وتحليل الأخطاء إن وجدت.
    * تحقق مما إذا كان عنوان خادم Tarantool صحيحًا ([`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)).
    * تحقق من أنه تم تخصيص ذاكرة كافية [لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * اتصل بـ [Wallarm support team](mailto:support@wallarm.com) وقدم البيانات أعلاه إذا لم يتم حل المشكلة.

#### عدد الطلبات غير المرسلة إلى واجهة برمجة تطبيقات Wallarm

عدد الطلبات التي لم يتم تمريرها إلى واجهة برمجة تطبيقات Wallarm. يتم جمع هذا المقياس إذا تم تكوين إرسال الطلبات إلى Wallarm API ([`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)). يتم تطبيق قواعد الحظر على هذه الطلبات، ولكن الطلبات غير مرئية في حساب Wallarm الخاص بك وليست محسوبة عند تحليل الطلبات التالية.

* **المقياس:** `curl_json-wallarm_nginx/gauge-api_errors`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والتصحيح:**
    * احصل على سجلات NGINX و Tarantool وتحليل الأخطاء إن وجدت.
    * تحقق مما إذا كانت إعدادات Wallarm API صحيحة ([`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)).
    * تحقق من أنه تم تخصيص ذاكرة كافية [لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * اتصل بـ [Wallarm support team](mailto:support@wallarm.com) وقدم البيانات أعلاه إذا لم يتم حل المشكلة.

### عدد القضايا أكملت عملية NGINX بشكل غير طبيعي

عدد القضايا التي أدت إلى اكتمال غير طبيعي لعملية NGINX. السبب الأكثر شيوعا للاكتمال غير الطبيعي هو خطأ حرج في NGINX.

* **المقياس:** `curl_json-wallarm_nginx/gauge-segfaults`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والتصحيح:**
    1. اجمع البيانات حول الحالة الحالية باستخدام أحد البرامج النصية التالية:

        * `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` إذا تم تثبيت عقدة التصفية باستخدام برنامج التثبيت الكل في واحد ، صورة Docker المستندة إلى NGINX ، AMI أو صورة السحابة GCP
        * `/usr/share/wallarm-common/collect-info.sh` للخيارات الأخرى للتوزيع

    2. قدم الملف المُنشأ إلى [Wallarm support team](mailto:support@wallarm.com) للتحقيق.

### عدد الحالات التي تخطت حد الذاكرة الافتراضية

عدد الحالات عندما تم تجاوز حد الذاكرة الافتراضية.

* **المقياس:**
    * `curl_json-wallarm_nginx/gauge-memfaults` إذا تم تجاوز الحد في نظامك
    * `curl_json-wallarm_nginx/gauge-softmemfaults` إذا تم تجاوز الحد لـ proton.db +lom ([`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit)) 
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والتصحيح:**
    1. اجمع البيانات حول الحالة الحالية باستخدام أحد البرامج النصية التالية:

        * `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` إذا تم تثبيت عقدة التصفية باستخدام برنامج التثبيت الكل في واحد ، صورة Docker المستندة إلى NGINX ، AMI أو صورة السحابة GCP
        * `/usr/share/wallarm-common/collect-info.sh` للخيارات الأخرى للتوزيع

    2. قدم الملف المُنشأ إلى [Wallarm support team](mailto:support@wallarm.com) للتحقيق.

### عدد أخطاء proton.db

عدد أخطاء proton.db باستثناء تلك التي حدثت بسبب الحالات عندما تم تجاوز [حد الذاكرة الافتراضية](#number-of-situations-exceeding-the-virtual-memory-limit).

* **المقياس:** `curl_json-wallarm_nginx/gauge-proton_errors`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والتصحيح:**
    1. قم بنسخ رمز الخطأ من سجلات NGINX (`wallarm: proton error: <ERROR_NUMBER>`).
    1. اجمع البيانات حول الحالة الحالية باستخدام أحد البرامج النصية التالية:

        * `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` إذا تم تثبيت عقدة التصفية باستخدام برنامج التثبيت الكل في واحد ، صورة Docker المستندة إلى NGINX ، AMI أو صورة السحابة GCP
        * `/usr/share/wallarm-common/collect-info.sh` للخيارات الأخرى للتوزيع

    1. قدم البيانات المجمعة إلى [Wallarm support team](mailto:support@wallarm.com) للتحقيق.

### الإصدار من proton.db

إصدار proton.db قيد الاستخدام.

* **المقياس:** `curl_json-wallarm_nginx/gauge-db_id`
* **قيمة المقياس:** لا حدود

### الوقت الأخير لتحديث ملف proton.db

الوقت الأخير لتحديث ملف proton.db.

* **المقياس:** `curl_json-wallarm_nginx/gauge-db_apply_time`
* **قيمة المقياس:** لا حدود

### نسخة المجموعة المخصصة (الاسم السابق هو LOM)

إصدار [المجموعة المخصصة][doc-lom] قيد الاستخدام.

* **المقياس:** `curl_json-wallarm_nginx/gauge-custom_ruleset_id`

    (في Wallarm node 3.4 وأقل، `curl_json-wallarm_nginx/gauge-lom_id`. سيتم عدم استخدام القياس مع الاسم السابق قريبا.)
* **قيمة المقياس:** لا حدود

### الوقت الأخير لتحديث المجموعة المخصصة (الاسم السابق هو LOM)

الوقت الأخير لتحديث [المجموعة المخصصة][doc-lom].

* **المقياس:** `curl_json-wallarm_nginx/gauge-custom_ruleset_apply_time`

    (في Wallarm node 3.4 وأقل، `curl_json-wallarm_nginx/gauge-lom_apply_time`. سيتم عدم استخدام القياس مع الاسم السابق قريبا.)
* **قيمة المقياس:** لا حدود

### أزواج proton.db و LOM

#### عدد أزواج proton.db و LOM

عدد الأزواج proton.db و[LOM][doc-lom] قيد الاستخدام.

* **المقياس:** `curl_json-wallarm_nginx/gauge-proton_instances-total`
* **قيمة المقياس:** `>0`
* **توصيات الاستكشاف والتصحيح:**
    1. تحقق مما إذا كانت إعدادات عقدة الفلتر صحيحة.
    2. تحقق مما إذا كان المسار إلى ملف proton.db محدد بشكل صحيح ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. تحقق مما إذا كان المسار إلى ملف LOM محدد بشكل صحيح ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### عدد الأزواج proton.db و LOM المحملة بنجاح

عدد الأزواج proton.db و[LOM][doc-lom] التي تم تحميلها وقراءتها بنجاح.

* **المقياس:** `curl_json-wallarm_nginx/gauge-proton_instances-success`
* **قيمة المقياس:** معادلة [`proton_instances-total`](#number-of-protondb-and-lom-pairs)
* **توصيات الاستكشاف والتصحيح:**
    1. تحقق مما إذا كانت إعدادات عقدة الفلتر صحيحة.
    2. تحقق مما إذا كان المسار إلى ملف proton.db محدد بشكل صحيح ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. تحقق مما إذا كان المسار إلى ملف LOM محدد بشكل صحيح ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### عدد الأزواج proton.db و LOM المحملة من الملفات المحفوظة الأخيرة

عدد الأزواج proton.db و[LOM][doc-lom] التي تم تنزيلها من الملفات المحفوظة الأخيرة. تحتفظ هذه الملفات بالأزواج المحملة بنجاح الأخيرة. إذا تم تحديث الأزواج ولكن لم يتم تنزيلها، فإن البيانات من الملفات المحفوظة الأخيرة تُستخدم.

* **المقياس:** `curl_json-wallarm_nginx/gauge-proton_instances-fallback`
* **قيمة المقياس:** `>0`
* **توصيات الاستكشاف والتصحيح:**
    1. تحقق مما إذا كانت إعدادات عقدة الفلتر صحيحة.
    2. تحقق مما إذا كان المسار إلى ملف proton.db محدد بشكل صحيح ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. تحقق مما إذا كان المسار إلى ملف LOM محدد بشكل صحيح ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### عدد أزواج proton.db و LOM غير النشطة

عدد الأزواج proton.db و[LOM][doc-lom] المتصلة التي لم يمكن قراءتها.

* **المقياس:** `curl_json-wallarm_nginx/gauge-proton_instances-failed`
* **قيمة المقياس:** `0`
* **توصيات الاستكشاف والتصحيح:**
    1. تحقق مما إذا كانت إعدادات عقدة الفلتر صحيحة.
    2. تحقق مما إذا كان المسار إلى ملف proton.db محدد بشكل صحيح ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. تحقق مما إذا كان المسار إلى ملف LOM محدد بشكل صحيح ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

## مقاييس وحدة Postanalytics

### المعرف الخاص بالطلب المعالج الأخير

ID الخاص بالطلب المعالج الأخير. يمكن أن ترتفع القيمة وتنخفض.

* **المقياس:**
    * `wallarm-tarantool/counter-last_request_id` إذا ارتفعت القيمة
    * `wallarm-tarantool/gauge-last_request_id` إذا ارتفعت القيمة أو تناقصت
* **قيمة المقياس:** لا حدود
* **توصيات الاستكشاف والتصحيح:** إذا كان هناك طلبات واردة ولكن القيمة لا تتغير، فتحقق مما إذا كانت إعدادات عقدة الفلتر صحيحة

### الطلبات المحذوفة

#### تلميح الطلبات المحذوفة

تصميم الإشارة يدل على أن الطلبات التي كانت تحتوي على هجمات تم حذفها من وحدة postanalytics ولكن لم يتم إرسالها إلى [السحابة](../../about-wallarm/overview.md#cloud).

* **المقياس:** `wallarm-tarantool/gauge-export_drops_flag`
* **قيمة المقياس:**
    * `0` إذا لم تتم إزالة الطلبات
    * `1` إذا تم حذف الطلبات (لا يوجد ذاكرة كافية، يرجى اتباع الإرشادات أدناه)
* **توصيات الاستكشاف والتصحيح:**
    * [تخصيص المزيد من الذاكرة لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * قم بتثبيت وحدة postanalytics في عقدة خادم منفصلة وذلك باتباع هذه [الإرشادات](../installation-postanalytics-en.md).

#### عدد الطلبات المحذوفة

عدد الطلبات التي كانت تحتوي على هجمات تم حذفها من وحدة postanalytics ولكن لم يتم إرسالها إلى [السحابة](../../about-wallarm/overview.md#cloud). لا يؤثر عدد الهجمات في الطلب في القيمة. يمكن استخدام المقياس [`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests) عند تكوين المراقبة المراسلات.

* **المقياس:** `wallarm-tarantool/gauge-export_drops`
* **قيمة المقياس:** `0`
* **معدل التغيير:** `wallarm-tarantool/derive-export_drops`
* **توصيات الاستكشاف والتصحيح:**
    * [تخصيص المزيد من الذاكرة لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * قم بتثبيت وحدة postanalytics في عقدة خادم منفصلة وذلك باتباع هذه [الإرشادات](../installation-postanalytics-en.md).

### تأخير تصدير الطلب (في الثواني)

التأخير بين تسجيل طلب وحدة postanalytics وتنزيل المعلومات حول الهجمات التي تم اكتشافها إلى سحابة Wallarm.

* **المقياس:** `wallarm-tarantool/gauge-export_delay`
* **قيمة المقياس:**
    * أمثل إذا كان `<60`
    * التحذير إذا كان `>60`
    * حرجة إذا كان `>300`
* **توصيات الاستكشاف والتصحيح:**
    * اقرأ سجلات من الملف `/var/log/wallarm/export-attacks.log` أو `/opt/wallarm/var/log/wallarm/export-attacks-out.log` [وفقا لطريقة تثبيت العقدة](../configure-logging.md) وتحليل الأخطاء. يمكن أن يتسبب زيادة القيمة في سرعة ناقل الشبكة المنخفضة من عقدة الفلتر إلى خدمة API التابعة لـ Wallarm.
    * تحقق من أنه تم تخصيص ذاكرة كافية [لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool). يتزايد المقياس [`tnt_errors`][anchor-tnt] أيضاً عند تجاوز الذاكرة المخصصة.

### الوقت المستغرق لتخزين الطلبات في وحدة Postanalytics (في الثواني)

الوقت الذي تخزنه وحدة postanalytics للطلبات. تعتمد القيمة على كمية الذاكرة المخصصة لوحدة postanalytics وعلى حجم وخصائص الطلبات HTTP التي تمت معالجتها. كلما كان الفاصل الزمني أقصر، كانت خوارزميات الكشف أسوأ - لأنها تعتمد على البيانات التاريخية. ونتيجة لذلك، إذا كانت الفواصل قصيرة جدًا، فيمكن للمهاجم إجراء هجمات قوة الغزو بشكل أسرع ودون أن يلاحظ. في هذه الحالة، سيتم الحصول على بيانات أقل حول تاريخ سلوك المهاجم.

* **المقياس:** `wallarm-tarantool/gauge-timeframe_size`
* **قيمة المقياس:**
    * أمثل إذا كان `>900`
    * التحذير إذا كان `<900`
    * حرجة إذا كان `<300`
* **توصيات الاستكشاف والتصحيح:**
    * [تخصيص المزيد من الذاكرة لـ Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * قم بتثبيت وحدة postanalytics في عقدة خادم منفصلة وذلك باتباع هذه [الإرشادات](../installation-postanalytics-en.md).
