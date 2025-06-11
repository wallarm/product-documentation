[doc-nginx-install]: ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-address-eu-cloud.md
[doc-us-scanner-ip-addresses]: scanner-address-us-cloud.md
[acl-access-phase]:     #wallarm_acl_access_phase

# خيارات الإعداد لعقدة Wallarm المبنية على NGINX

تعلم خيارات التعديل المتاحة للوحدات Wallarm الخاصة بNGINX للحصول على أقصى استخدام من حل Wallarm.

!!! info "وثائق NGINX الرسمية"
   التحكم في الإعداد لـ Wallarm مشابه للغاية للتحكم في الإعداد لـ NGINX. [راجع وثائق NGINX الرسمية](https://www.nginx.com/resources/admin-guide/). بالإضافة إلى خيارات الإعداد الخاصة بـ Wallarm، يمكنك الوصول لكامل قدرات الإعداد في NGINX.

## توجيهات Wallarm

### disable_acl

تتيح تعطيل تحليل أماكن المشتقات للطلبات. إذا تم تعطيلها (`on`)، لن يقوم العقدة الفرعية بتحميل [قوائم IP](../user-guides/ip-lists/overview.md) من سحابة Wallarm وستتجاهل تحليل مصادر IPs للطلب.

!!! info
    يمكن تعيين هذا العامل داخل blocks http، server، و location.

    القيمة الافتراضية هي `off`.

### wallarm_acl_access_phase

تجبر التوجيه عقدة Wallarm المبنية على NGINX على حجب الطلبات الواصلة من [IPs مدرجة في القائمة السوداء](../user-guides/ip-lists/overview.md) في مرحلة الوصول إلى NGINX وهذا يعني:

* بواسطة `wallarm_acl_access_phase on`، ستحجب عقدة Wallarm فورًا أي طلبات من IPs مدرجة في القائمة السوداء في أي [وضع تصفية](configure-wallarm-mode.md) ولن تبحث عن علامات هجوم في الطلبات من IPs المدرجة في القائمة السوداء.

    هذه هي القيمة **الافتراضية والموصى بها** حيث تجعل القوائم السوداء تعمل بطريقة قياسية وتقلل بشكل كبير من حمل وحدة المعالجة المركزية للعقدة.

* بواسطة `wallarm_acl_access_phase off`، ستحلل عقدة Wallarm الطلبات للعثور على علامات الهجوم أولًا ثم إذا كانت تعمل في وضع `block` أو `safe_blocking` ستحجب الطلبات القادمة من IPs مدرجة في القائمة السوداء.

    في وضع التصفية `off`، لا تقوم العقدة بتحليل الطلبات ولا تتحقق من القوائم السوداء.

    في وضع التصفية `monitoring`، تبحث العقدة عن علامات الهجوم في جميع الطلبات ولكنها أبدًا لن تحجبها حتى لو كانت IP المصدر مدرجة في القائمة السوداء.

    سلوك عقدة Wallarm عند `wallarm_acl_access_phase off` يزيد بشكل كبير من حمل وحدة المعالجة المركزية للعقدة.

!!! info "القيمة الافتراضية والتفاعل مع التوجيهات الأخرى"
    **القيمة الافتراضية**: `on` (بداية من عقدة Wallarm 4.2)

     يمكن تعيين التوجيه داخل block http فقط في ملف تكوين NGINX.

    * مع [`disable_acl on`](#disable_acl)، قوائم IP لا يتم معالجتها وتمكين `wallarm_acl_access_phase` لا معنى له.
    * التوجيه `wallarm_acl_access_phase` لديه الأولوية على [`wallarm_mode`](#wallarm_mode) الذي ينتج عنه حجب الطلبات من IPs المدرجة في القائمة السوداء حتى لو كان وضع العقدة الفرعية `off` أو `monitoring` (بواسطة `wallarm_acl_access_phase on`).

### wallarm_acl_export_enable

تتيح التوجيه تمكين `on` / تعطيل `off` إرسال الإحصائيات حول الطلبات من [IPs مدرجة في القائمة السوداء](../user-guides/ip-lists/overview.md) من العقدة إلى السحابة.

* مع `wallarm_acl_export_enable on` سيتم [عرض](../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) الإحصائيات على الطلبات من IPs المدرجة في القائمة السوداء في قسم **الهجمات**.
* مع `wallarm_acl_export_enable off` لن يتم عرض الإحصائيات حول الطلبات من IPs المدرجة في القائمة السوداء.

!!! info
    هذا المعلم معين داخل block http.

    **القيمة الافتراضية**: `on`

### wallarm_api_conf

مسار إلى ملف `node.yaml`، الذي يحتوي على متطلبات الوصول لواجهة برمجة التطبيقات API الخاصة بـ Wallarm.

**مثال**: 

```
wallarm_api_conf /etc/wallarm/node.yaml

# تثبيتات صور Docker المبنية على NGINX ، صور السحابة وجميع التثبيتات في حالة واحدة
# wallarm_api_conf /opt/wallarm/etc/wallarm/node.yaml
```

تُستخدم لتحميل طلبات مسلسلة مباشرةً من العقدة الفرعية إلى واجهة برمجة التطبيقات API لـ Wallarm (السحابة) بدلاً من تحميلها في وحدة postanalytics (Tarantool).
**يتم إرسال الطلبات التي تحتوي على هجمات فقط إلى واجهة برمجة التطبيقات API.** لا يتم حفظ الطلبات دون هجمات.

**مثال على محتوى ملف node.yaml:**

``` bash
# بيانات اعتماد الاتصال بواجهة برمجة التطبيقات API

hostname: <بعض الأسماء>
uuid: <بعض uuid>
secret: <سر بعض>

# معلمات الاتصال بواجهة برمجة التطبيقات API (المعلمات أدناه تُستخدم افتراضيًا)

api:
  host: api.wallarm.com
  port: 443
  ca_verify: true
```

### wallarm_application

معرف فريد للتطبيق المحمي المراد استخدامه في سحابة Wallarm. يمكن أن تكون القيمة عدد صحيح موجب باستثناء `0`.

يمكن تعيين معرفات فريدة لكلاً من نطاقات التطبيق ومسارات النطاق، على سبيل المثال:

=== "معرفات للنطاقات"
    ملف التكوين للنطاق **example.com**:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 1;
        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    ملف التكوين للنطاق **test.com**:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 2;
        location / {
                proxy_pass http://test.com;
                include proxy_params;
        }
    }
    ```
=== "معرفات لمسارات النطاق"
    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...
        
        wallarm_mode monitoring;
        location /login {
                proxy_pass http://example.com/login;
                include proxy_params;
                wallarm_application 3;
        }
        
        location /users {
                proxy_pass http://example.com/users;
                include proxy_params;
                wallarm_application 4;
        }
    }
    ```

[المزيد من التفاصيل عن إعداد التطبيقات →](../user-guides/settings/applications.md)

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

    **القيمة الافتراضية**: `-1`.

### wallarm_block_page

تتيح لك إعداد الرد على الطلب المحجوب.

[مزيد من التفاصيل حول تكوين صفحة الحجب ورمز الخطأ→](configuration-guides/configure-block-page-and-code.md)

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

### wallarm_block_page_add_dynamic_path

يُستخدم هذا التوجيه لتهيئة صفحة الحجب التي لديها متغيرات NGINX في كودها والمسار إلى هذه الصفحة المحجوبة المُعينة أيضا باستخدام المتغير. خلاف ذلك، لا يُستخدم التوجيه.

[مزيد من التفاصيل حول تكوين صفحة الحجب ورمز الخطأ→](configuration-guides/configure-block-page-and-code.md)

!!! info
    يمكن تعيين التوجيه داخل block `http` في ملف تكوين NGINX.

### wallarm_cache_path

دليل فيه يتم إنشاء كتالوج النسخ الاحتياطي لتخزين نسخة من بروتون.دي بي وملف مجموعة القواعد المخصصة عند بدء الخادم. يجب أن يكون هذا الدليل قابل للكتابة للعميل الذي يشغل NGINX.

!!! info
    يتم تكوين هذا المعلم داخل block http فقط.

### wallarm_custom_ruleset_path

مسار إلى الملف [المجموعة القاعدية المخصصة](../user-guides/rules/rules.md) التي تحتوي على معلومات حول التطبيق المحمي وإعدادات العقدة الفرعية.

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

    **القيمة الافتراضية**:
    
    * `/opt/wallarm/etc/wallarm/custom_ruleset` لتثبيتات صور Docker المبنية على NGINX، صور السحابة وجميع التثبيتات في حالة واحدة
    * `/etc/wallarm/custom_ruleset` للآثار التثبيتية الأخرى

### wallarm_enable_libdetection

تمكين/تعطيل التحقق الإضافي من الهجمات SQL Injection عبر مكتبة **libdetection**. استخدام **libdetection** يضمن الكشف المزدوج عن الهجمات ويقلل من عدد الإيجابيات الكاذبة.

تحليل الطلبات بمكتبة **libdetection** مُمكّن بشكل افتراضي في جميع [خيارات الإنشاء](../installation/supported-deployment-options.md). لتقليل عدد الإيجابيات الكاذبة، نوصي بالمحافظة على تمكين التحليل.

[المزيد من التفاصيل على **libdetection** →](../about-wallarm/protecting-against-attacks.md#library-libdetection)

!!! warning "زيادة استهلاك الذاكرة"
    عند تحليل الهجمات باستخدام مكتبة libdetection، قد يزيد مقدار الذاكرة المستهلكة من قبل عمليات NGINX وWallarm بنسبة حوالي 10%.

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

    القيمة الافتراضية هي `on` لجميع [خيارات الإنشاء](../installation/supported-deployment-options.md).

### wallarm_fallback

مع القيمة المُعيَّنة كـ `on`، لدى NGINX القدرة على الدخول في وضع الطوارئ؛ إذا لم يتمكن من تنزيل بروتون.دي بي أو مجموعة القواعد المخصصة، يعطل هذا الإعداد وحدة Wallarm للـ blocks http، server، و location، الذين فشلت البيانات في التنزيل. NGINX يستمر في العمل.

!!! info
    القيمة الافتراضية هي `on`.

    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

### wallarm_force

تعيين تحليل الطلبات وتوليد القواعد المخصصة استنادًا إلى حركة المرور المتناظرة لـ NGINX. انظر [تحليل حركة المرور المتناظرة مع NGINX](../installation/oob/web-server-mirroring/overview.md).

### wallarm_general_ruleset_memory_limit

تعيين حد للكمية القصوى من الذاكرة التي يمكن استخدامها بواسطة نسخة واحدة من بروتون.دي بي وملف مجموعة القواعد المخصصة.

إذا تم تجاوز الحد المعيَّن خلال معاللجة بعض الطلبات، سيلغى المستخدم الخطأ 500.

يمكن استخدام اللاحقات التالية في هذا المعلم:
* `k` أو `K` للكيلوبايت
* `m` أو `M` لميغابايت
* `g` أو `G` لجيغابايت

قيمة **0** توقف الحد.

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و/أو location.

    **القيمة الافتراضية**: `1` غيغابايت

### wallarm_global_trainingset_path

!!! warning "التوجيه مهجور"
    بدءاً من عقدة Wallarm 3.6، يرجى استخدام التوجيه [`wallarm_protondb_path`](#wallarm_protondb_path) بدلاً من ذلك. ما عليك سوى تغيير اسم التوجيه، لم تتغير منطقه.

### wallarm_file_check_interval

تعرف فاستقة بين فحص البيانات الجديدة في بروتون.دي بي وملف مجموعة القواعد المخصصة. تحدد وحدة القياس في اللاحقة على النحو التالي:
* لا لاحقة للدقائق
* `s` للثواني
* `ms` للمللي ثانية

!!! info
    يتم تكوين هذا المعلم فقط داخل block http.

    **القيمة الافتراضية**: `1` (دقيقة واحدة)

### wallarm_instance

!!! warning "التوجيه مهجور"
    * إذا كان التوجيه يُستخدم لتعيين معرف فريد للتطبيق المحمي، فقط أعد تسميته إلى [`wallarm_application`](#wallarm_application).
    * لتعيين معرف فريد للمستأجر للعقد العديدة-المستأجرة، بدلا من `wallarm_instance`، استخدم التوجيه [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid).
    
    عند تحديث التكوين الذي استخدمته للعقدة الفرعية الخاصة بك من الإصدار قبل 4.0:

    * إذا قمت بترقية العقدة الفرعية دون خاصية المتعدد المستأجرين ولديك أي `wallarm_instance` يُستخدم لتعيين معرف فريد للتطبيق المحمي، فقط أعد تسميته إلى `wallarm_application`.
    * إذا قمت بتحديث عقدة الفرعية مع خاصية المتعدد المستأجرين، فافترض أن جميع `wallarm_instance` أن تكون `wallarm_application`، ثم أعد كتابة التكوين كما وصف في [تعليمات إعادة التكوين ذات الأمانة المتعددة](../updating-migrating/older-versions/multi-tenant.md#step-3-reconfigure-multitenancy).

### wallarm_key_path

مسار إلى المفتاح الخاص الخاص بـ Wallarm المُستخدم لتشفير / فك تشفير ملفات بروتون.دي بي ومجموعة القواعد المخصصة.

!!! info
    **القيمة الافتراضية**:
    
    * `/opt/wallarm/etc/wallarm/private.key` لتثبيتات صور Docker المبنية على NGINX، صور السحابة وجميع التثبيتات في حالة واحدة
    * `/etc/wallarm/private.key` لآثار التثبيت الأخرى


### wallarm_local_trainingset_path

!!! warning "التوجيه مهجور"
    بدءاً من عقدة Wallarm 3.6، يرجى استخدام التوجيه [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path) بدلاً من ذلك. ما عليك سوى تغيير اسم التوجيه، لم تتغير منطقه.

### wallarm_memlimit_debug

هذا التوجيه يحدد ما إذا كانت وحدة Wallarm NGINX تولد ملف `/tmp/proton_last_memlimit.req` الذي يحتوي على تفاصيل الطلب عند تجاوز حد الذاكرة. يمكن أن يكون هذا لا غنى عنه لتصحيح مشكلات المعالجة المتعلقة بحد ذاكرة الطلب.

!!! info
    حاليًا هذا التوجيه متاح فقط لعقد NGINX المنشرة مع [المثبت كل في واحد](../installation/nginx/all-in-one.md) الإصدار 4.8.8 أو أعلى.

    يمكن تعيين هذا المعلم داخل blocks http،server، و location.
    
    **القيمة الافتراضية**: `on`.

### wallarm_mode

وضع معالجة حركة المرور:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include/wallarm-modes-description-5.0.md"

يمكن تقييد استخدام `wallarm_mode` بواسطة التوجيه `wallarm_mode_allow_override`.

[تعليمات تفصيلية حول تكوين وضع التصفية →](configure-wallarm-mode.md)

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.
    
    **القيمة الافتراضية** تعتمد على طريقة نشر العقدة الفرعية (يمكن أن تكون `off` أو `monitoring`)

### wallarm_mode_allow_override

تدير القدرة على تجاوز قيم [`wallarm_mode`](#wallarm_mode) عبر قواعد الفلترة التي تم تنزيلها من سحابة Wallarm (مجموعة القواعد المخصصة):

- `off` - يتم تجاهل القواعد المخصصة.
- `strict` - يمكن للقواعد المخصصة فقط تقوية وضع التشغيل.
- `on` - من الممكن تقوية وتخفيف وضع التشغيل.

على سبيل المثال، مع `wallarm_mode monitoring` و `wallarm_mode_allow_override strict` مُعيّنين، يمكن استخدام Wallarm Console لتمكين حجب بعض الطلبات، ولكن لا يمكن تعطيل تحليل الهجوم بالكامل.

[تعليمات تفصيلية حول تكوين وضع التصفية →](configure-wallarm-mode.md)

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.
    
    **القيمة الافتراضية**: `on`


### wallarm_parse_response

ما إذا كان سوف يتم تحليل استجابات التطبيق. تحتاج تحليل الاستجابة للكشف عن الثغرات الأمنية أثناء [الكشف السلبي](../about-wallarm/detecting-vulnerabilities.md#passive-detection) و [توثيق التهديد النشط](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification). 

القيم الممكنة هي `on` (تحليل الاستجابة مُمكّن) و `off` (تحليل الاستجابة معطل).

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

    **القيمة الافتراضية**: `on`

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

يوفر Wallarm الدعم الكامل لـ WebSockets تحت خطة الاشتراك في الأمان API. بشكل افتراضي، رسائل WebSockets لا يتم تحليلها للهجمات.

لإرغام الميزة، قم بتنشيط خطة الاشتراك في الأمان API واستخدم التوجيه `wallarm_parse_websocket`.

القيم الممكنة:

- `on`: تحليل الرسائل مُمكّن.
- `off`: تحليل الرسائل معطل.

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

    **القيمة الافتراضية**: `off`

### wallarm_parser_disable

يتيح تعطيل المحلل. تتوافق قيم التوجيه مع اسم المحلل الذي سيتم تعطيله:

- `cookie`
- `zlib`
- `htmljs`
- `json`
- `multipart`
- `base64`
- `percent`
- `urlenc`
- `xml`
- `jwt`

**مثال**

```
wallarm_parser_disable base64;
wallarm_parser_disable xml;
location /ab {
    wallarm_parser_disable json;
    wallarm_parser_disable base64;
    proxy_pass http://example.com;
}
location /zy {
    wallarm_parser_disable json;
    proxy_pass http://example.com;
}
```

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

### wallarm_proton_log_mask_master

إعدادات لتسجيل التصحيح لعملية السيد NGINX.

!!! warning "استخدام التوجيه"
     تحتاج إلى تكوين التوجيه فقط إذا قيل لك ذلك من قبل عضو فريق الدعم في Wallarm. سيقدمون لك القيمة التي ستستخدم مع التوجيه.

!!! info
    يمكن تكوين هذا المعلم على المستوى الرئيسي فقط.


### wallarm_proton_log_mask_worker

إعدادات التصحيح لعملية NGINX العاملة.

!!! warning "استخدام التوجيه"
    تحتاج إلى تكوين التوجيه فقط إذا قيل لك ذلك من قبل عضو فريق الدعم في Wallarm. سيقدمون لك القيمة التي ستستخدم مع التوجيه.

!!! info
    يمكن تكوين هذا المعلم على المستوى الرئيسي فقط.

### wallarm_protondb_path

مسار إلى ملف [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) الذي يحتوي على الإعدادات العامة لتصفية الطلبات، التي لا تعتمد على هيكل التطبيق.

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

    **القيمة الافتراضية**:
    
    * `/opt/wallarm/etc/wallarm/proton.db` لتثبيتات صور Docker المبنية على NGINX، صور السحابة وجميع التثبيتات في حالة واحدة
    * `/etc/wallarm/proton.db` لآثار التثبيت الأخرى

### wallarm_rate_limit

تعيين تكوين حد السرعة في الشكل التالي:

```
wallarm_rate_limit <المفتاح لقياس الحدود> rate=<معدل> burst=<تفجير> delay=<تأخير>;
```

* `المفتاح لقياس الحدود` - المفتاح الذي تود قياس الحدود له. يمكن أن يحتوي على نص، [متغيرات NGINX](http://nginx.org/en/docs/varindex.html) ومزيجها.

    على سبيل المثال: `"$remote_addr +login"` للحد من الطلبات الواصلة من نفس IP والمستهدفة على المسار `/login`.
* `rate=<معدل>` (مطلوب) - حد السرعة، يمكن أن يكون `rate=<رقم>r/s` أو `rate=<رقم>r/m`.
* `burst=<تفجير>` (اختياري) - العدد الأقصى للطلبات الزائدة للتخزين المؤقت بمجرد تجاوز RPM/RPS المحدد ويتم معالجتها بمجرد عودة السرعة إلى الطبيعي. `0` بشكل افتراضي.
* `delay=<تأخير>` - إذا كانت قيمة `<تفجير>` مختلفة عن `0`، يمكنك التحكم في ما إذا كان سيكون لديك للحفاظ على RPM/RPS المحدد بين تنفيذ الطلبات الزائدة المخزنة ضمن النطاق. يشير `nodelay` إلى التنفيذ المتزامن لجميع الطلبات الزائدة المخزنة ضمن النطاق، دون تأخير حد السرعة. القيمة العددية تعني التحصيل المتزامن للعدد المحدد من الطلبات الزائدة، يتم معالجة البقية بتأخير معين في RPS/RPM.

مثال:

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    **القيمة الافتراضية:** غير موجودة.

    يمكن تعيين هذا المعلم داخل blocks http، server، location.

    إذا قمت بتعيين الحد السرعة [قاعدة حد السرعة](../user-guides/rules/rate-limiting.md) (يُوصى به) يكون للتوجيه `wallarm_rate_limit` أولوية أقل.

### wallarm_rate_limit_enabled

تمكين/تعطيل حد السرعة لـ Wallarm.

إذا `off`، فلا تعمل قاعدة [حد السرعة](../user-guides/rules/rate-limiting.md) (موصى به) ولا التوجيه `wallarm_rate_limit`.

!!! info
    **القيمة الافتراضية:** `on` ولكن حد السرعة لـ Wallarm لن يعمل بدون إعداد إما القاعدة [حد السرعة](../user-guides/rules/rate-limiting.md) (يوصى به) أو التوجيه `wallarm_rate_limit`.

### wallarm_rate_limit_log_level

مستوى التسجيل للطلبات المرفوضة من قبل التحكم بحد السرعة. يمكن أن تكون: `info`، `notice`، `warn`، `error`.

!!! info
    **القيمة الافتراضية:** `error`.

    يمكن تعيين هذا المعلم داخل blocks http، server، location.

### wallarm_rate_limit_status_code

رمز لإرجاع في الاستجابة إلى الطلبات المرفوضة بواسطة وحدة حد السرعة لـ Wallarm.

!!! info
    **القيمة الافتراضية:** `503`.

    يمكن تعيين هذا المعلم داخل blocks http، server، location.

### wallarm_rate_limit_shm_size

تعيين الحد الأقصى لكمية الذاكرة المشتركة التي يمكن استهلاكها بواسطة حد السرعة لـ Wallarm.

مع متوسط طول المفتاح 64 بايتًا (حروف)، و `wallarm_rate_limit_shm_size` من 64MB، يمكن للوحدة التعامل مع حوالي 130,000 مفتاح فريد في وقت واحد. زيادة الذاكرة بمقدار ضعفين يضاعف سعة الوحدة على نحو خطي.

المفتاح هو قيمة فريدة للنقطة الطلب التي تستخدمها الوحدة لقياس الحدود. على سبيل المثال، إذا كانت الوحدة تحد من الاتصالات استنادًا إلى عناوين IP، يعتبر كل عنوان IP فريد مفتاحًا واحدًا. بفضل القيمة الافتراضية للتوجيه، يمكن للوحدة معالجة الطلبات الصادرة من ~130,000 IPs مختلفة متزامنًا.

!!! info
    **القيمة الافتراضية:** `64m` (64 ميجابايت).

    يمكن تعيين هذا المعلم داخل block http فقط.

### wallarm_request_chunk_size

تحدد حجم جزء من الطلب الذي يتم معالجته خلال تكرار واحد. يمكنك تعيين قيمة مخصصة للتوجيه `wallarm_request_chunk_size` في البايتات عبر تعيين أي عدد صحيح له. التوجيه يدعم أيضا اللاحقات التالية:
* `k` أو `K` للكيلوبايت
* `m` أو `M` لميغابايت
* `g` أو `G` لجيغابايت

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.

    **القيمة الافتراضية**: `8k` (8 كيلوبايت).

### wallarm_request_memory_limit

تعيين حد للكمية القصوى من الذاكرة التي يمكن استخدامها لمعالجة طلب واحد.

إذا تم تجاوز الحد، سيلغى معالجة الطلب وسيلغى المستخدم الخطأ 500.

يمكن استخدام اللاحقات التالية في هذا المعلم:
* `k` أو `K` للكيلوبايت
* `m` أو `M` لميغابايت
* `g` أو `G` لجيغابايت

قيمة `0` توقف الحد.

افتراضيا، الحدود معطلة. 

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و/أو location.

### wallarm_stalled_worker_timeout

تعيين حد زمني لمعالجة طلب واحد للعمل عقدة NGINX بالثواني.

إذا تجاوز الزمن الحد، يتم كتابة بيانات حول عمال NGINX إلى القيم `stalled_workers_count` و `stalled_workers` [إحصائيات](configure-statistics-service.md##working-with-the-statistics-service) العوامل.

!!! info
    يمكن تعيين هذا المعلم داخل blocks http، server، و location.
    
    **القيمة الافتراضية**: `5` (خمس ثوانٍ)

### wallarm_status

تتحكم في [خدمة الإحصاءات Wallarm](configure-statistics-service.md).

تحتوي قيمة التوجيه على التنسيق التالي:

```
wallarm_status [on|off] [format=json|prometheus];
```

من الأفضل تكوين خدمة الإحصاءات في ملف خاص بها، وتجنب التوجيه `wallarm_status` في ملفات الإعداد الأخرى NGINX، لأن الأخير قد يكون غير آمن. يقع ملف التكوين `wallarm-status` في:

* `/etc/nginx/wallarm-status.conf` للمثبت كل في واحد
* `/etc/nginx/conf.d/wallarm-status.conf` للتثبيتات الأخرى


إضافة إلى ذلك، ينصح بشدة بعدم تغيير أي من الخطوط الحالية لتكوين `wallarm-status` الافتراضي حيث أنه قد يفسد عملية تحميل بيانات المتريكات إلى سحابة Wallarm.

!!! info
    يمكن تكوين التوجيه في سياق  `server` و/أو `location` في NGINX.

    القيمة الافتراضية للمعلم  `format` هي `json`.

### wallarm_tarantool_upstream

مع `wallarm_tarantool_upstream`، يمكنك موازنة الطلبات بين عدة خوادم postanalytics.

**مثال:**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# متروك

wallarm_tarantool_upstream wallarm_tarantool;
```

انظر أيضًا إلى [وحدة ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html).

!!! warning "الشروط المطلوبة"
    من الضروري تلبية الشروط التالية بالنسبة للعلامات المحددة `max_conns` و `keepalive`:

    * يجب أن تكون قيمة العامل `keepalive` لا تقل عن عدد خوادم Tarantool.
    * يجب تحديد قيمة `max_conns` لكل من خوادم التدفق العلوي Tarantool لمنع إنشاء اتصالات مفرطة.

!!! info
    العامل يُعد في block http فقط.

### wallarm_unpack_response

ما إذا كان سوف يُفك تشفير البيانات المضغوطة المُرجعة في الاستجابة التطبيقية. القيم الممكنة هي `on` (عملية التفكيك مُمكّنة) و `off` (عملية التفكيك معطلة).

هذا المعلم فعّال فقط إذا `wallarm_parse_response on`.

!!! info
    **القيمة الافتراضية**: `on`.

### wallarm_upstream_backend

وسيلة لإرسال الطلبات المُسلسلة. يمكن إرسال الطلبات إما إلى Tarantool أو إلى الواجهة البرمجية للتطبيقات API.

القيم الممكنة للتوجيه:
*   `tarantool`
*   `api`

باعتماد التوجيهات الأخرى، سيتم تعيين القيمة الافتراضية على النحو التالي:
*   `tarantool` - إذا لم يكن هناك توجيه `wallarm_api_conf` في التكوين.
*   `api` - إذا كان هناك توجيه `wallarm_api_conf`، ولكن لا يوجد توجيه `wallarm_tarantool_upstream` في التكوين.

    !!! note
        إذا كان التوجيه `wallarm_api_conf` و `wallarm_tarantool_upstream` موجودين في نفس الوقت في التكوين، ستحدث خطأ في التكوين بشكل غامض في التصميم العلوي لـ wallarm.

!!! info
    يمكن تعيين هذا المعلم داخل block http فقط.


### wallarm_upstream_connect_attempts

تعرف عدد المحاولات الفورية لإعادة الاتصال بـ Tarantool أو واجهة برمجة التطبيقات API.
إذا تم إنهاء الاتصال بـ Tarantool أو الواجهة البرمجية للتطبيقات API، فلن يحدث محاولة لإعادة الاتصال. ومع ذلك، هذا ليس الأمر في حالة عدم وجود المزيد من الاتصالات وطابور الطلبات المُسلسلة ليس فارغًا.

!!! note
    قد تحدث إعادة الاتصال من خلال خادم آخر، لأن النظام الفرعي "التدفق العلوي" هو المسؤول عن اختيار الخادم.

    يمكن تعيين هذا المعلم فقط داخل block http.

### wallarm_upstream_reconnect_interval

تحدد الفاصل بين محاولات إعادة الاتصال بـ Tarantool أو واجهة برمجة التطبيقات API بعد أن تجاوز عدد المحاولات الفاشلة الحد الذي حدده `wallarm_upstream_connect_attempts`.

!!! info
    يمكن تعيين هذا المعلم فقط داخل block http.

### wallarm_upstream_connect_timeout

تعريف وقت المهلة للاتصال بـ Tarantool أو واجهة برمجة التطبيقات API.

!!! info
    يمكن تعيين هذا المعلم فقط داخل block http.

### wallarm_upstream_queue_limit

تحدد حدًا لعدد الطلبات المُسلسلة.
تعيين المعلم `wallarm_upstream_queue_limit` متزامنًا وعدم تعيين المعلم `wallarm_upstream_queue_memory_limit` يعني أن لا يوجد حد على الأخير.

!!! info
    يمكن تعيين هذا المعلم فقط داخل block http.

### wallarm_upstream_queue_memory_limit

تحدد حدًا لإجمالي حجم الطلبات المُسلسلة.
تعيين المعلم `wallarm_upstream_queue_memory_limit` متزامنًا وعدم تعيين المعلم `wallarm_upstream_queue_limit` يعني أن لا يوجد حد على الأخير.

!!! info
    **القيمة الافتراضية**: `100m`.

    يمكن تعيين هذا المعلم فقط داخل block http.

### wallarm_upstream_connect_attempts

تعرف عدد المحاولات الفورية للاتصال بـ Tarantool أو API.
إذا تم إنهاء الاتصال بـ Tarantool أو API، فلن يحدث محاولة لإعادة الاتصال. ومع ذلك، هذا ليس الحال عندما لا تكون هناك المزيد من الاتصالات وطابور الطلبات المُسردة ليست فارغًا.

!!! note
    قد تحدث إعادة التواصل من خلال خادم آخر، لأن النظام الفرعي "upstream" هو المسؤول عن اختيار الخادم.

    يمكن ضبط هذا المعامل فقط داخل block http.

### wallarm_upstream_reconnect_interval

تحدد الفاصل بين محاولات الاتصال بـ Tarantool أو API بعد تجاوز عدد المحاولات الفاشلة الحد الذي حدد في  `wallarm_upstream_connect_attempts`.

!!! info
    يمكن ضبط هذا المعامل فقط داخل block http.

### wallarm_upstream_connect_timeout

تعرف مهلة التواصل إلى Tarantool أو API.

!!! info
    يمكن ضبط هذا المعامل فقط داخل block http.

### wallarm_upstream_queue_limit

تحدد حدًا لعدد الطلبات المُسلسلة.
تعيين المعلم `wallarm_upstream_queue_limit` متزامنًا وعدم تعيين المعلم `wallarm_upstream_queue_memory_limit` يعني أن لا يوجد حد على الأخير.

!!! info
    يمكن ضبط هذا المعامل فقط داخل block http.

### wallarm_upstream_queue_memory_limit

تحدد حدًا لإجمالي حجم الطلبات المُسلسلة.
تعيين المعلم `wallarm_upstream_queue_memory_limit` متزامنًا وعدم تعيين المعلم `wallarm_upstream_queue_limit` يعني أن لا يوجد حد على الأخير.

!!! info
    **القيمة الافتراضية**:`100m`.

    يمكن ضبط هذا المعامل فقط داخل block http.