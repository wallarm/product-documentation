[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom
[doc-selinux]:                  configure-selinux.md

# تكوين صوت الإحصاءات 

للحصول على إحصائيات حول العقدة الفلاترة، استخدم الأمر `wallarm_status`، الذي يتم كتابته في ملف تهيئة NGINX.

## تكوين صوت الإحصاءات 

!!! تحذير "مهم"

    من الأفضل بكثير تهيئة خدمة الإحصاءات في ملف خاص بها، تجنب الأمر `wallarm_status` في ملفات إعداد NGINX الأخرى، لأن الأخيرة قد تكون غير آمنة. يقع ملف التهيئة لـ `wallarm-status` في:

    * `/etc/nginx/wallarm-status.conf` للمثبت الموحد
    * `/etc/nginx/conf.d/wallarm-status.conf` للتثبيتات الأخرى
    
    بالإضافة الى ذلك، ننصح بشدة بعدم تغيير أي من الأسطر الحالية لتهيئة `wallarm-status` الأفتراضية حيث قد يفسد عملية تحميل البيانات المترية إلى سحابة Wallarm.

عند استخدام الأمر، يمكن إعطاء الإحصائيات بتنسيق JSON أو بتنسيق متوافق مع [Prometheus][link-prometheus]. الاستخدام:

```
wallarm_status [مُفتَح|مُغلَق] [تنسيق=جسون|prometheus];
``` 

!!! معلومات
    يمكن تهيئة الأمر في سياق `الخادم` و/ أو `الموقع`.

    البديهية `format` لديها قيمة `json` بشكل افتراضي في معظم خيارات الإنشاء باستثناء صورة Docker المستندة على NGINX؛ عند استدعاء نقطة النهاية `/wallarm-status` من خارج الحاوية، يعود بمتغيرات في تنسيق Prometheus.
    
### التكوين الافتراضي

بشكل افتراضي، خدمة إحصاءات العقدة الفلترة لديها التكوين الأكثر أمانًا. ملف التكوين `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` للمثبت الموحد) يبدو كما يلي:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # الوصول متاح فقط لعناوين الكمبيوتر العقدة الفلترة   
  deny all;

  wallarm_mode off;
  disable_acl "on";   # يتم تعطيل فحص مصادر الطلب ، ويتم السماح للأي بي المدرج في القائمة السوداء بطلب خدمة wallarm-status. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### تحديد عناوين IP المسموح لها بطلب الإحصاءات

عند تهيئة الأمر `wallarm_status`، يمكنك تحديد عناوين IP التي يمكنك منها طلب الإحصاءات. بشكل افتراضي، يتم رفض الوصول من أي مكان باستثناء عناوين IP `127.0.0.1` و`::1`، التي تسمح بتنفيذ الطلب فقط من الخادم الذي تم تثبيت Wallarm عليه.

للسماح بالطلبات من خادم آخر، أضف الأمر `allow` مع عنوان IP للخادم المطلوب في التكوين. على سبيل المثال:

```diff
...
server_name localhost;

allow 127.0.0.0/8;
+ allow 10.41.29.0;
...
```

بمجرد تغيير الإعدادات، أعد تشغيل NGINX لتطبيق التغييرات:

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### تغيير عنوان IP و/ أو منفذ عنوان الإحصاءات

لتغيير عنوان IP و/ أو المنفذ لخدمة الإحصاءات، اتبع التعليمات أدناه.

!!! معلومات "تغيير منفذ خدمة الإحصاءات على صورة Docker المستندة على NGINX"
    لتغيير المنفذ الافتراضي لخدمة الإحصاءات على [صورة Docker المستندة على NGINX](installation-docker-en.md)، ابدأ الحاوية مع متغير `NGINX_PORT` تم تعيينه على المنفذ الجديد. لا يتطلب ذلك أي تغييرات أخرى.

1. افتح ملف `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` للمثبت الموحد) وحدد ما يلي:

    * عنوان الخدمة الجديد في أمر الاستماع.
    * إذا كان مطلوبًا، قم بتغيير الأمر `allow` للسماح بالوصول من عناوين غير عناوين الحلقة الخلفية (يسمح ملف التهيئة الافتراضي فقط بالوصول إلى عناوين الحلقة الخلفية).
1. أضف معلمة `status_endpoint` بقيمة العنوان الجديد إلى ملف `/etc/wallarm/node.yaml` (`/opt/wallarm/etc/wallarm/node.yaml` لصورة Docker المستندة على NGINX، صور السحابة والمثبت الموحد)، على سبيل المثال:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. قم بتصحيح معلمة `URL` وفقًا لذلك في ملف تهميئة [`collectd`](monitoring/intro.md).  يعتمد مكان هذا الملف على نظام التشغيل وطريقة التثبيت التي تستخدمها:

    === "توزيعات التثبيت DEB"
        ```bash
        /etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf

        # للمثبت الموحد:
        /opt/wallarm/etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf
        ```
    === "توزيعات التثبيت RPM"
        ```bash
        /etc/wallarm-collectd.d/nginx-wallarm.conf

        # للمثبت الموحد:
        /opt/wallarm/etc/wallarm-collectd.d/nginx-wallarm.conf
        ```
    === "صورة AMI ، صورة GCP ، أو صورة Docker المستندة على NGINX"
        ```bash
        /opt/wallarm/etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf
        ```
1. أعد تشغيل NGINX لتطبيق التغييرات:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. بالنسبة للعقد الفلترة المثبتة عبر المثبت الموحد أو صور السحابة، افتح ملف `/opt/wallarm/env.list` وأضف متغير `NGINX_PORT` بقيمة منفذ الخدمة الجديدة (إذا تم تغييره) ، على سبيل المثال:

    ```
    NGINX_PORT=8082
    ```
1. إذا تم استخدام عنوان IP غير قياسي أو منفذ لـ Tarantool، قم بتصحيح الملف التشكيلي Tarantool وفقًا لذلك. الموضع الشخصي لهذا الملف يعتمد على نوع النشر نظام التشغيل الذى تمتلكه:

    === "توزيعات الانتشار DEB-based"
        ```bash
        /etc/collectd/collectd.conf.d/wallarm-tarantool.conf

        # في حالة استخدام المثبت ألموحد:
        /opt/wallarm/etc/collectd/collectd.conf.d/wallarm-tarantool.conf
        ```
    === "توزيعات الانتشار RPM-based"
        ```bash
        /etc/collectd.d/wallarm-tarantool.conf

        # بالنسبة للمثبت الموحد:
        /opt/wallarm/etc/collectd.d/wallarm-tarantool.conf
        ```
    === "لصورة AMI ، صورة GCP ، أو صورة Docker المستندة على NGINX"
        ```bash
        /opt/wallarm/etc/collectd/collectd.conf.d/wallarm-tarantool.conf
        ```

إذا كان SELinux مثبتًا على مضيف العقدة الفلترة، تأكد من أن SELinux إما [تم تكوينها أو تعطيلها][doc-selinux]. من أجل البساطة، يفترض هذا المستند أن SELinux مُعطّل.

انتبه إلى أن الإخراج المحلي `wallarm-status` سوف يتم إعادة تعيينه بعد تطبيق الإعدادات المشار إليها أعلاه.

### الحصول على الإحصاءات بتنسيق Prometheus

معظم خيارات الإنشاء تعيد الإحصائيات بتنسيق JSON بشكل افتراضي. الصورة المستندة على Docker هي استثناء؛ عند استدعاء نقطة النهاية `/wallarm-status` من خارج الحاوية، يعيد المتغيرات بتنسيق Prometheus.

للحصول على الإحصائيات بتنسيق Prometheus من خيارات تثبيت العقدة التي تعتبر JSON هي القيمة الافتراضية:

1. أضف التكوين التالي إلى الملف `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` للمثبت الموحد):


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

    !!! تحذير "لا تقم بحذف أو تغيير التهيئة الافتراضية لـ `/wallarm-status`"
        من فضلك لا تقم بحذف أو تغيير التهيئة الافتراضية للـ `/wallarm-status`. العمل الأفتراضي لـ هذه النقطة النهاية هو اقصى أولوية لتحميل البيانات الصحيحة إلى Wallarm Cloud.
1. أعد تشغيل NGINX لتطبيق التغييرات:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. اتصل بنقطة النهاية الجديدة للحصول على مقاييس Prometheus:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

##  العمل مع صوت الإحصاءات

للحصول على إحصائيات العقدة الفلترة، قم بتقديم طلب من واحدة من العناوين IP المسموح بها (انظر أعلاه):

=== "إحصاءات بتنسيق JSON"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    نتيجة لذلك، ستحصل على رد من النوع:

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

    يمكن أن يكون العنوان مختلفًا، يرجى التحقق من ملف `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` للمثبت الموحد) للعنوان الفعلي.

    نتيجة لذلك، ستحصل على رد من النوع:


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

المعلمات الرد التالية متوفرة (مقاييس Prometheus لديها بادئة `wallarm_`):

*   `requests`: عدد الطلبات التي تمت معالجتها بواسطة العقدة الفلترة.
*   `attacks`: عدد الهجمات المسجلة.
*   `blocked`: عدد الطلبات المحظورة بما في ذلك تلك التي تنشأ من [مدرجة في القائمة السوداء](../user-guides/ip-lists/overview.md) IPs.
*   `blocked_by_acl`: عدد الطلبات التي تم حظرها بسبب [مدرجة في القائمة السوداء](../user-guides/ip-lists/overview.md) مصادر لطلبات.
* `acl_allow_list`: عدد طلبات المنشأ [إختارت من القائمة](../user-guides/ip-lists/overview.md) مصادر الطلب.
*   `abnormal`: عدد الطلبات التي تعتبر غير طبيعية من قبل التطبيق.
*   `tnt_errors`: عدد الطلبات التي لم تتم معالجتها من قبل وحدة بعد التحليل. بالنسبة لهذه الطلبات، يتم تسجيل سبب الحظر، ولكن الطلبات نفسها لا تتم جمعها في الإحصائيات وفحوصات السلوك.
*   `api_errors`: عدد الطلبات التي لم يتم تقديمها لواجهة برمجة التطبيقات لتحليلها بعد ذلك. بالنسبة لهذه الطلبات، تم تطبيق معلمات الحظر (أي طلبات خبيثة تم حظرها إذا كانت النظام تعمل في وضع الحظر)؛ ومع ذلك، لا يتم رؤية البيانات عن هذه الأحداث على واجهة المستخدم. يسم هذا المعلم فقط عندما تعمل عقدة Wallarm مع وحدة بعد التحليل المحلية.
*   `requests_lost`: عدد الطلبات التي لم تتم تحليلها في وحدة بعد التحليل ونقلها إلى واجهة برمجة التطبيقات. بالنسبة لهذه الطلبات، تم تطبيق معلمات الحظر (أي طلبات خبيثة تم حظرها إذا كانت النظام تعمل في وضع الحظر)؛ ومع ذلك، لا يتم رؤية البيانات عن هذه الأحداث على واجهة المستخدم. يسم هذا المعلم فقط عندما تعمل عقدة Wallarm مع وحدة بعد التحليل المحلية.
*   `overlimits_time`: عدد الهجمات من النوع [تجاوز حدود الموارد الحاسوبية](../attacks-vulns-list.md#overlimiting-of-computational-resources) التي تم تحريها بواسطة العقدة الفلترة.
*   `segfaults`: عدد المشاكل التي أدت إلى انتهاء عملية العامل بشكل طارئ.
*   `memfaults`: عدد المشاكل التي تم الوصول فيها إلى حدود الذاكرة الافتراضية.
* `softmemfaults`: عدد المشاكل حيث تم تجاوز حد الذاكرة الافتراضية لـ proton.db + lom ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)).
* `proton_errors`: عدد الأخطاء proton.db باستثناء تلك التي تحدث بسبب الحالات عندما تم تجاوز حد الذاكرة الافتراضية.
*   `time_detect`: الوقت الكلي لتحليل الطلبات.
*   `db_id`: نسخة proton.db.
*   `lom_id`: سيتم عدم دعمه قريبًا، يرجى استخدام `custom_ruleset_id`.
*   `custom_ruleset_id`: نسخة بناء [custom ruleset][gl-lom].

    من دورة الافراج4.8، ويظهر ك `wallarm_custom_ruleset_id{format="51"} 386` بتنسيق Prometheus, with مع `custom_ruleset_ver` بداخل السمة`format` والقيمة الرئيسية هي نسخة بناء القواعد المخصصة.
*   `custom_ruleset_ver` (متوفرة بدءًا من الإصدار Wallarm 4.4.3): تنسيق [custom ruleset][gl-lom]: 

    * `4x` - لعقد Wallarm 2.x التي هي [تحليل](../updating-migrating/versioning-policy.md#version-list).
    * `5x` - لعقد Wallarm 4.x و 3.x (الأخيرة هي [تحليل](../updating-migrating/versioning-policy.md#version-list)).
*   `db_apply_time`: وقت Unix لاخر تحديث لملف proton.db.
*   `lom_apply_time`: سيتم عدم دعمه قريبًا، يرجى استخدام `custom_ruleset_apply_time`.
*   `custom_ruleset_apply_time`: وقت Unix لاخر تحديث لملف [custom ruleset](../glossary-en.md#custom-ruleset-the-former-term-is-lom).
*   `proton_instances`: معلومات حول أزواج proton.db + LOM التي تم تحميلها:
    *   `total`: مجموع الأزواج.
    *   `success`: عدد الأزواج التي تم تحميلها بنجاح من سحابة Wallarm.
    *   `fallback`: عدد الأزواج التي تم تنزيلها من الدليل الاحتياطي. يشير هذا إلى أنه كانت هناك مشكلات في تنزيل أحدث proton.db + LOM من السحابة، لكن NGINX استطاع لا زالت قادرة على تحميل إصدارات أقدم من proton.db + LOM من الدليل الاحتياطي عند الأمر [`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback) مضبوط على `فعال`.
    *   `failed`: عدد الأزواج التي فشلت في التهيئة، مما يعني أن NGINX غير قادر على تنزيل proton.db + LOM إما من السحابة أو الدليل الاحتياطي. إذا كانت [`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback) مُمكّنة وحدث ذلك، سيتم تعطيل وحدة Wallarm ، مما يترك وحدة NGINX فقط تعمل. لتشخيص المشكلة، يوصى بفحص سجلات NGINX أو [الاتصال بدعم Wallarm](https://support.wallarm.com/).
*   `stalled_workers_count`: كمية العمال الذين تجاوزوا الحد الزمني لمعالجة الطلب (الحد محدد في الأمر [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)).
*   `stalled_workers`: قائمة العمال الذين تجاوزوا الحد الزمني لمعالجة الطلب (الحد محدد في الأمر [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)) وتم حساب الوقت المستغرق لمعالجة الطلب.
*   `ts_files`: معلومات حول ملف [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom):
    *   `id`: نسخة LOM المستخدمة.
    *   `size`: حجم ملف LOM بالبايت.
    *   `mod_time`: وقت Unix للتحديث الاخير لملف LOM.
    *   `fname`: مسار ملف LOM.
*   `db_files`: معلومات حول ملف proton.db:
    *   `id`: نسخة proton.db المستخدمة.
    *   `size`: حجم ملف proton.db بالبايت.
    *   `mod_time`: وقت Unix للتحديث الاخير لملف proton.db.
    *   `fname`: مسار ملف proton.db.
* `startid`: مُعرّف فريد عشوائي للعقدة الفلترة.
* `timestamp`: الوقت الذي تم فيه معالجة الطلب الوارد الأخير من العقدة (بتنسيق [Unix Timestamp](https://www.unixtimestamp.com/)).
* `rate_limit`: معلومات حول وحدة [wallarm limit rate](../user-guides/rules/rate-limiting.md):
    * `shm_zone_size`: الكمية الإجمالية من الذاكرة المشتركة التي يمكن أن يستهلكها وحدة الحد النسبي wallarm بالبايت (القيمة تعتمد على الأمر [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size)، القيمة الافتراضية هي`67108864`).
    * `buckets_count`: عدد الدلاء (عادةً ما يكون مساويًا لعدد عمال NGINX، 8 هو الحد الأقصى).
    * `entries`: عدد قيم نقاط الطلب الفريدة (مفاتيح) التي تقيس الحدود لها.
    * `delayed`: عدد الطلبات التي تم غرفها بواسطة وحدة الحد النسبي بسبب إعداد `burst`.
    * `exceeded`: عدد الطلبات التي تم رفضها بواسطة وحدة التحكم في الحد النسبي لأنها تجاوزت الحد.
    * `expired`: العدد الإجمالي للمفاتيح التي تمت إزالتها من السلة على أساس منتظم كل 60 ثانية إذا لم يتم تجاوز حد المفاتيح.
    * `removed`: عدد المفاتيح المزعجة التي تمت إزالتها من السلة. اذا كانت القيمة أعلى من `expired`،  يوصى بزيادة قيمة [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size).
    * `no_free_nodes`: القيمة المختلفة عن `0` تشير إلى أن هناك ذاكرة غير كافية مخصصة لوحدة الحد النسبي، ينصح بزيادة قيمة [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size).
* `split.clients`: الإحصاءات الرئيسية على كل [tenant](../installation/multi-tenant/overview.md). إذا لم تكن ميزة الشقق المارٍة مُفعلة، يتم إرجاع الإحصائيات للعميل الوحيد (حسابك) مع القيمة القطمة `"client_id":null`.
* `split.clients.applications`: الإحصاءات الرئيسية على كل [application](../user-guides/settings/applications.md). تعود المعلمات التي لم تكن متضمن في هذا القسم الإحصائيات على جميع التطبيقات.

البيانات لكل ال عدادات تُحتسب من لحظة بد عمل NGINX. إذا تم تثبيت Wallarm في بنية جاهزة مع NGINX، يجب إعادة تشغيل خادم NGINX لبدء جمع الإحصائيات.