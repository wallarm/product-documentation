[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom
[doc-selinux]:                  configure-selinux.md

# إعدادات خدمة الإحصائيات

للحصول على إحصائيات حول العقدة المرشحة، استخدم الأمر `wallarm_status`، والذي يتم كتابته في ملف التكوين NGINX.

## تهيئة خدمة الإحصائيات

!!! warning "مهم"
    
    يوصى بشدة بتكوين خدمة الإحصائيات في ملفها الخاص، مواجهة الأمر `wallarm_status` في ملفات تجهيز NGINX الأخرى، لأن الأخير قد يكون أمرًا غير آمن. يقع ملف التكوين لـ `wallarm-status` في:

    * `/etc/nginx/wallarm-status.conf` للمثبت للكل في واحد
    * `/etc/nginx/conf.d/wallarm-status.conf` للتثبيتات الأخرى
    
    أيضًا، يشدد على عدم تغيير أي من الخطوط الحالية للتكوين `wallarm-status` الافتراضي حيث يمكن أن يفسد عملية تحميل بيانات القياس إلى السحابة Wallarm.

عند استخدام الأمر، يمكن إعطاء الإحصائيات في تنسيق JSON أو في تنسيق متوافق مع [Prometheus][link-prometheus]. الاستخدام:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    يمكن تكوين الأمر في سياق `server` و/أو `location`.

    القيمة الافتراضية للمعلمة `format` هي `json` في معظم خيارات التوظيف باستثناء صورة Docker على أساس NGINX؛ عندما يتم استدعاء `/wallarm-status` من خارج الحاوية، يعيد بيانات المقاييس بتنسيق Prometheus.

### التكوين الافتراضي

بشكل افتراضي، خدمة الإحصائيات للعقدة المرشحة لديها التكوين الأكثر أمانًا. يبدو ملف التكوين `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` للمثبت للكل في واحد) كما يلي:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # يتاح الوصول فقط للعناوين المعادة للعقدة المرشحة
  deny all;

  wallarm_mode off;
  disable_acl "on";   # تم تعطيل التحقق من مصادر الطلب، يُسمح للأي بي المرفوض طلب خدمة wallarm-status. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### الحد من عناوين الأي بي المسموح بطلب الإحصائيات منها

عند تكوين الأمر `wallarm_status`، يمكنك تحديد عناوين IP التي يمكنك طلب الإحصاءات منها. بشكل افتراضي، يتم رفض الوصول من أي مكان باستثناء عناوين الأي بي `127.0.0.1` و`::1`، التي تسمح بتنفيذ الطلب فقط من الخادم الذي تم فيه تثبيت Wallarm.

للسماح بالطلبات من خادم آخر، أضف أمر `allow` مع عنوان الأي بي للخادم المطلوب في التكوين. على سبيل المثال:

```diff
...
server_name localhost;

allow 127.0.0.0/8;
+ allow 10.41.29.0;
...
```

حالما تغير الإعدادات، أعد تشغيل NGINX لتطبيق التغييرات:

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### تغيير عنوان الأي بي و/أو منفذ خدمة الإحصائيات

لتغيير عنوان IP و/أو منفذ خدمة الإحصائيات، اتبع التعليمات أدناه.

!!! info "تغيير منفذ خدمة الإحصائيات على صورة Docker القائمة على NGINX"
    لتغيير النقطة الافتراضية لخدمة الإحصائيات على [صورة Docker القائمة على NGINX](installation-docker-en.md)، ابدأ الحاوية مع متغير `NGINX_PORT` مُعيّنًا إلى النقطة الجديدة. لا يتطلب أي تغييرات أخرى.

1. افتح ملف `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` للمثبت للكل في واحد) وحدد ما يلي:

    * عنوان الخدمة الجديد في الأمر `listen`.
    * إذا كان مطلوبًا، قم بتغيير الأمر `allow` للسماح بالوصول من العناوين غير العائدة للتكرار (ملف التكوين الافتراضي يسمح بالوصول فقط إلى العناوين المتكررة).
1. أضف معلمة `status_endpoint` مع قيمة العنوان الجديد إلى ملف `/etc/wallarm/node.yaml` (`/opt/wallarm/etc/wallarm/node.yaml` بالنسبة لصورة Docker القائمة على NGINX وصور السحابة والمثبت للكل في واحد)، على سبيل المثال:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. أعد تشغيل NGINX لتطبيق التغييرات:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. بالنسبة للعقد المرشحة المُنتشرة عبر المثبت الشامل أو صور السحابة، افتح ملف `/opt/wallarm/env.list` وقم بإلحاق متغير `NGINX_PORT` بقيمة نقطة خدمة الجديدة (إذا تم تغييرها)، على سبيل المثال:

    ```
    NGINX_PORT=8082
    ```
1. إذا تم استخدام عنوان أي بي غير قياسي أو نقطة لـ Tarantool، قم بتصحيح ملف تكوين Tarantool بالتحديد. موقع هذا الملف يعتمد على نوع توزيع نظام التشغيل لديك:

    === "توزيعات قائمة على DEB"
        ```bash
        /etc/collectd/collectd.conf.d/wallarm-tarantool.conf

        # إذا كانت تستخدم المثبت الشامل:
        /opt/wallarm/etc/collectd/collectd.conf.d/wallarm-tarantool.conf
        ```
    === "توزيعات قائمة على RPM"
        ```bash
        /etc/collectd.d/wallarm-tarantool.conf

        # بالنسبة للمثبت الشامل:
        /opt/wallarm/etc/collectd.d/wallarm-tarantool.conf
        ```
    === "صورة AMI، أو صورة GCP، أو صورة Docker القائمة على NGINX"
        ```bash
        /opt/wallarm/etc/collectd/collectd.conf.d/wallarm-tarantool.conf
        ```

إذا تم تثبيت SELinux على مضيف العقدة المرشحة، تأكد من أن SELinux إما [مُعدّة أو معطلة][doc-selinux]. للبساطة، يفترض هذا المستند أن SELinux معطلة.

اعلم أن إخراج `wallarm-status` المحلي سوف يتم إعادة تعيينه بعد تطبيق الإعدادات أعلاه.

### الحصول على الإحصائيات بتنسيق Prometheus

معظم خيارات التوزيع تقدم الإحصائيات بالتنسيق JSON افتراضيًا. صورة Docker القائمة على NGINX هي الاستثناء؛ عندما يتم استدعاء نقطة النهاية `/wallarm-status` من خارج الحاوية، يعيد المقاييس بتنسيق Prometheus.

للحصول على الإحصائيات بتنسيق Prometheus من خيارات التوزيع العقدة التي تعتبر JSONهي القيمة الافتراضية:

1. أضف التكوين التالي إلى ملف `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` للمثبت للكل في واحد):


    ```diff
    ...

    location /wallarm-status {
      wallarm_status on;
    }

    + location /wallarm-status-prometheus {
    +   wallarm_status on format=prometheus;
    + }

    ...
    ```

    !!! warning "لا تحذف أو تغير التكوين الافتراضي لـ `/wallarm-status`"
        الرجاء عدم حذف أو تغيير التكوين الافتراضي للموقع `/wallarm-status`. التشغيل الافتراضي لهذه النقطة حاسم لتحميل البيانات الصحيحة إلى السحابة Wallarm.
1. قم بإعادة تشغيل NGINX لتطبيق التحديثات:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. استدعي النقطة المنتهية الجديدة للحصول على مقاييس Prometheus:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

##  العمل مع خدمة الإحصائيات

للحصول على الإحصائيات للعقدة المرشحة، قم بعمل طلب من أحد عناوين الأي بي المسموح بها (انظر أعلاه):

=== "الإحصائيات بتنسيق JSON"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    وكنتيجة، سوف تحصل على رد من النوع:

    ```
    { "requests":0,"attacks":0,"blocked":0,"blocked_by_acl":0,"acl_allow_list":0,"abnormal":0,
    "tnt_errors":0,"api_errors":0,"requests_lost":0,"overlimits_time":0,"segfaults":0,"memfaults":0,
    "softmemfaults":0,"proton_errors":0,"time_detect":0,"db_id":73,"lom_id":102,"custom_ruleset_id":102,
    "custom_ruleset_ver":51,"db_apply_time":1598525865,"lom_apply_time":1598525870,
    "custom_ruleset_apply_time":1598525870,"proton_instances": { "total":3,"success":3,"fallback":0,
    "failed":0 },"stalled_workers_count":0,"stalled_workers":[],"ts_files":[{"id":102,"size":12624136,
    "mod_time":1598525870,"fname":"\/etc\/wallarm\/custom_ruleset"}],"db_files":[{"id":73,"size":139094,
    "mod_time":1598525865,"fname":"\/etc\/wallarm\/proton.db"}],"startid":1459972331756458216,
    "timestamp":1664530105.868875,"rate_limit":{"shm_zone_size":67108864,"buckets_count":4,"entries":1,
    "delayed":0,"exceeded":1,"expired":0,"removed":0,"no_free_nodes":0},"split":{"clients":[
    {"client_id":null,"requests": 78,"attacks": 0,"blocked": 0,"blocked_by_acl": 0,"overlimits_time": 0,
    "time_detect": 0,"applications":[{"app_id":4,"requests": 78,"attacks": 0,"blocked": 0,
    "blocked_by_acl": 0,"overlimits_time": 0,"time_detect": 0}]}]} }
    ```
=== "الإحصائيات بتنسيق Prometheus"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    المعالج يمكن أن يكون مختلفا، يرجى التأكد من ملف `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` للمثبت للكل في واحد) للعنوان الفعلي.

    وكنتيجة، سوف تحصل على رد من النوع:


    ```
    # HELP wallarm_requests requests count
    # TYPE wallarm_requests gauge
    wallarm_requests 2
    # HELP wallarm_attacks attack requests count
    # TYPE wallarm_attacks gauge
    wallarm_attacks 0
    # HELP wallarm_blocked blocked requests count
    # TYPE wallarm_blocked gauge
    wallarm_blocked 0
    # HELP wallarm_blocked_by_acl blocked by acl requests count
    # TYPE wallarm_blocked_by_acl gauge
    wallarm_blocked_by_acl 0
    # HELP wallarm_acl_allow_list requests passed by allow list
    # TYPE wallarm_acl_allow_list gauge
    wallarm_acl_allow_list 0
    # HELP wallarm_abnormal abnormal requests count
    # TYPE wallarm_abnormal gauge
    wallarm_abnormal 2
    # HELP wallarm_tnt_errors tarantool write errors count
    # TYPE wallarm_tnt_errors gauge
    wallarm_tnt_errors 0
    # HELP wallarm_api_errors API write errors count
    # TYPE wallarm_api_errors gauge
    wallarm_api_errors 0
    # HELP wallarm_requests_lost lost requests count
    # TYPE wallarm_requests_lost gauge
    wallarm_requests_lost 0
    # HELP wallarm_overlimits_time overlimits_time count
    # TYPE wallarm_overlimits_time gauge
    wallarm_overlimits_time 0
    # HELP wallarm_segfaults segmentation faults count
    # TYPE wallarm_segfaults gauge
    wallarm_segfaults 0
    # HELP wallarm_memfaults vmem limit reached events count
    # TYPE wallarm_memfaults gauge
    wallarm_memfaults 0
    # HELP wallarm_softmemfaults request memory limit reached events count
    # TYPE wallarm_softmemfaults gauge
    wallarm_softmemfaults 0
    # HELP wallarm_proton_errors libproton non-memory related libproton faults events count
    # TYPE wallarm_proton_errors gauge
    wallarm_proton_errors 0
    # HELP wallarm_time_detect_seconds time spent for detection
    # TYPE wallarm_time_detect_seconds gauge
    wallarm_time_detect_seconds 0
    # HELP wallarm_db_id proton.db file id
    # TYPE wallarm_db_id gauge
    wallarm_db_id 71
    # HELP wallarm_lom_id LOM file id
    # TYPE wallarm_lom_id gauge
    wallarm_lom_id 386
    # HELP wallarm_custom_ruleset_id Custom Ruleset file id
    # TYPE wallarm_custom_ruleset_id gauge
    wallarm_custom_ruleset_id{format="51"} 386
    # HELP wallarm_custom_ruleset_ver custom ruleset file format version
    # TYPE wallarm_custom_ruleset_ver gauge
    wallarm_custom_ruleset_ver 51
    # HELP wallarm_db_apply_time proton.db file apply time id
    # TYPE wallarm_db_apply_time gauge
    wallarm_db_apply_time 1674548649
    # HELP wallarm_lom_apply_time LOM file apply time
    # TYPE wallarm_lom_apply_time gauge
    wallarm_lom_apply_time 1674153198
    # HELP wallarm_custom_ruleset_apply_time Custom Ruleset file apply time
    # TYPE wallarm_custom_ruleset_apply_time gauge
    wallarm_custom_ruleset_apply_time 1674153198
    # HELP wallarm_proton_instances proton instances count
    # TYPE wallarm_proton_instances gauge
    wallarm_proton_instances{status="success"} 5
    wallarm_proton_instances{status="fallback"} 0
    wallarm_proton_instances{status="failed"} 0
    # HELP wallarm_stalled_worker_time_seconds time a worker stalled in libproton
    # TYPE wallarm_stalled_worker_time_seconds gauge
    wallarm_stalled_worker_time_seconds{pid="3169104"} 25

    # HELP wallarm_startid unique start id
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

المعلمات الاستجابة التالية متاحة (تتضمن مقاييس Prometheus البادئة `wallarm_`):

*   `requests`: عدد الطلبات التي مُعالجتها بواسطة العقدة المرشحة.
*   `attacks`: عدد الهجمات المسجلة.
*   `blocked`: عدد الطلبات المعطلة بما في ذلك تلك التي تأتي من [IPs على القائمة السوداء](../user-guides/ip-lists/overview.md).
*   `blocked_by_acl`: عدد الطلبات التي تم منعها بسبب حجب مصادر الطلبات في [القائمة السوداء](../user-guides/ip-lists/overview.md).
* `acl_allow_list`: عدد الطلبات التي تأتي من مصادر الطلبات في [القائمة البيضاء](../user-guides/ip-lists/overview.md).
*   `abnormal`: عدد الطلبات التي تراها التطبيق غير طبيعية.
*   `tnt_errors`: عدد الطلبات التي لم يتم تحليلها بواسطة وحدة التحليل بعد الطلبات. فيما يخص هذه الطلبات، سجلت أسباب الحجب، ولكن لم يتم احتساب الطلبات ذاتها في الإحصائيات والتحققات السلوكية.
*   `api_errors`: عدد الطلبات التي لم تقدم إلى الواجهة البرمجية للتطبيقات للتحليل الأمامي. فيما يخص هذه الطلبات، تم تطبيق معلمات الحجب (أي ، تم حجب الطلبات الضارة إذا كانت النظام تعمل في الوضع العرقلة)؛ ومع ذلك، ليس مرئيا بيانات حول هذه الأحداث في الواجهة الرسومية. يتم استخدام هذا المعلم فقط عندما يعمل الوحدة الخاصة بواجهة البرمجة للتطبيقات Wallarm مع وحدة التحليل بعد الطلبات المحلية.
*   `requests_lost`: عدد الطلبات التي لم يتم تحليلها بوحدة التحليل بعد الطلبات وتحويلها إلى الواجهة البرمجية للتطبيقات. فيما يخص هذه الطلبات، تم تطبيق معلمات الحجب (أي، تم حجب الطلبات الضارة إذا كانت النظام تعمل في الوضع العرقلة)؛ ومع ذلك، ليس مرئيا بيانات حول هذه الأحداث في الواجهة الرسومية. يتم استخدام هذا المعلم فقط عندما يعمل الوحدة الخاصة بواجهة البرمجة للتطبيقات Wallarm مع وحدة التحليل بعد الطلبات المحلية.
*   `overlimits_time`: عدد الهجمات ذات النوع [التجاوز الحصص المحددة للموارد الحسابية](../attacks-vulns-list.md#overlimiting-of-computational-resources) الذي تم اكتشافها بواسطة العقدة المرشحة.
*   `segfaults`: عدد المشكلات التي أدّت إلى التوقف الطارئ عن عملية العمل.
*   `memfaults`: عدد المشكلات التي تم فيها الوصول إلى حدود الذاكرة الافتراضية.
* `softmemfaults`: عدد المشكلات التي تم فيها تجاوز الحد الأقصى للذاكرة الافتراضية للـ proton.db +lom ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)).
* `proton_errors`: عدد أخطاء proton.db باستثناء تلك التي حدثت بسبب الحالات التي تم فيها الوصول إلى حد الذاكرة الافتراضية.
*   `time_detect`: الوقت الإجمالي لتحليل الطلبات.
*   `db_id`: إصدار proton.db.
*   `lom_id`: سيكون من العتاد قريبا، من فضلك استخدم `custom_ruleset_id`.
*   `custom_ruleset_id`: بناءً على إصدار المجموعة القاعدية المخصصة [القاعدة المخصصة][gl-lom].

    بدءًا من الإصدار 4.8، يظهر بتنسيق Prometheus كـ `wallarm_custom_ruleset_id{format="51"} 386`، مع `custom_ruleset_ver` داخل خاصية `format` والقيمة الرئيسية كونها نسخة بناء القاعدة.
*   `custom_ruleset_ver` (متاح بدءًا من الإصدار 4.4.3 من Wallarm): تنسيق [القاعدة المخصصة][gl-lom]:

    * `4x` - لعقد Wallarm 2.x والتي هي [غير محدثة](../updating-migrating/versioning-policy.md#version-list).
    * `5x` - لعقد Wallarm 4.x و3.x (الأخيرة [غير محدثة](../updating-migrating/versioning-policy.md#version-list)).
*   `db_apply_time`: وقت Unix الخاص بتحديث ملف proton.db.
*   `lom_apply_time`: سيكون من العتاد قريبا، من فضلك استخدم `custom_ruleset_apply_time`.
*   `custom_ruleset_apply_time`: وقت Unix لآخر تحديث لملف [القاعدة المخصصة](../glossary-en.md#custom-ruleset-the-former-term-is-lom).
*   `proton_instances`: معلومات حول proton.db + LOM الأزواج المُحمّلة:
    *   `total`: العدد الكلي للأزواج.
    *   `success`: عدد الأزواج تم تحميلها بنجاح من السحابة Wallarm.
    *   `fallback`: عدد الأزواج تم تنزيلها من الدليل النسخ الاحتياطي. تشير القيمة المكتوبة هنا إلى حدوث مشكلات في تنزيل أحدث proton.db + LOM من السحابة، لكن كان NGINX قادرًا على تحميل أقدم الإصدارات من proton.db + LOM من الدليل النسخ الاحتياطي اعتماداً على الأمر [`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback) المُعيّن على `on`.
    *   `failed`: عدد الأزواج التي فشلت في المبادرة، أي أن NGINX كان غير قادر على تحميل proton.db + LOM من السحابة أو الدليل النسخ الاحتياطي. إذا تم تمكين أمر [`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback) وحدث ذلك، سيتم تعطيل الوحدة النمطية Wallarm، مما سيترك وحدة NGINX فقط قابلة للعمل. لتشخيص القضية، ويوصى بفحص سجلات NGINX أو [الاتصال بدعم Wallarm](https://support.wallarm.com/).
*   `stalled_workers_count`: الكمية (العدد) من العمل الذي يتجاوز حد الزمن (القيمة التي حددت بأمر [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)) لمعالجة الطلب.
*   `stalled_workers`: قائمة العمال الذين تجاوزوا حد الزمن (القيمة التي حددت بأمر [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)) لمعالجة الطلب والمبلغ المستغرق في معالجة الطلب.
*   `ts_files`: معلومات حول ملف [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom):
    *   `id`: إصدار LOM المستخدم.
    *   `size`: حجم ملف LOM بالبايت.
    *   `mod_time`: وقت Unix لتحديث ملف LOM الأخير.
    *   `fname`: مسار ملف LOM.
*   `db_files`: معلومات عن ملف proton.db:
    *   `id`: إصدار proton.db المستخدم.
    *   `size`: حجم ملف proton.db بالبايت.
    *   `mod_time`: وقت Unix لتحديث ملف proton.db الأخير.
    *   `fname`: مسار ملف proton.db.
* `startid`: معرف مُبدأ فريد تم توليده بشكل عشوائي للعقدة المرشحة.
* `timestamp`: وقت مُعالَجَة الطلب الوارد الأخير بواسطة العقدة (بتنسيق [Unix Timestamp](https://www.unixtimestamp.com/)).
* `rate_limit`: معلومات حول وحدة تحديد الحد النسبة من Wallarm:
    * `shm_zone_size`: الإجمالي للذاكرة المشتركة التي يمكن أن تستهلكها وحدة التحكم في الحد النسبة من Wallarm بالبايت (القيمة تعتمد على الأمر [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size)، القيمة الافتراضية هي `67108864`).
    * `buckets_count`: عدد الدلائل (عادة ما يكون مساوياً للعدد العاملات NGINX، القيمة القصوى 8).
    * `entries`: عدد النقاط المطلوبة الفريدة (المفاتيح) تقيس الحدود لها.
    * `delayed`: عدد الطلبات التي تأتي من الدليل النسخ الاحتياطي بسبب تفضيلات `burst`.
    * `exceeded`: عدد الطلبات التي تأتي من الدليل النسخ الاحتياطي لأنها تجاوزت الحد.
    * `expired`: العدد الإجمالي للمفاتيح التي يتم إزالتها من الدليل خلال 60 ثانية العادية إذا لم يتم تجاوز حد هذه المفاتيح.
    * `removed`: عدد المفاتيح التي تمت إزالتها بشكل مُطرد من الدليل. إذا كانت القيمة أعلى من `expired`، يلزم زيادة قيمة [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size).
    * `no_free_nodes`: القيمة المختلفة عن `0` تشير إلى أن هناك ذاكرة غير كافية مُخصصة لوحدة التحديد بوسطة نسبة، يُوصي بزيادة قيمة [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size).
* `split.clients`: الإحصائيات الأساسية على كل [العقار](../installation/multi-tenant/overview.md). إذا لم تكن ميزة العديد من المستأجرين مُفعلة، يتم إرجاع الإحصائيات للمستأجر الوحيد (حسابك) مع القيمة الثابتة `"client_id":null`.
* `split.clients.applications`: الإحصائيات الأساسية عن كل [تطبيق](../user-guides/settings/applications.md). المعلمات التي ليست مضمنة في هذا القسم تقدم الإحصائيات على جميع التطبيقات.

يتم تجميع بيانات جميع العدادات من لحظة بداية NGINX. إذا تم تثبيت Wallarm في بنية جاهزة مع NGINX، يجب إعادة تشغيل الخادم NGINX لبداية جمع الإحصائيات.
