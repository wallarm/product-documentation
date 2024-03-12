[doc-nginx-install]: ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-address-eu-cloud.md
[doc-us-scanner-ip-addresses]: scanner-address-us-cloud.md
[acl-access-phase]:            #wallarm_acl_access_phase

# خيارات التكوين لعقدة Wallarm على أساس NGINX

تعرف على خيارات التعديل المتاحة لوحدات Wallarm NGINX للحصول على أقصى استفادة من حل Wallarm.

!!! info "التوثيق الرسمي لـ NGINX"
    إن التكوين الخاص بـ Wallarm مشابه جدًا لتكوين NGINX. [راجع التوثيق الرسمي لـ NGINX](https://www.nginx.com/resources/admin-guide/). جنبًا إلى جنب مع خيارات التكوين الخاصة بـ Wallarm، لديك كامل القدرات التكوينية لـ NGINX.

## توجيهات Wallarm

### الغاء_acl

هو يُسمح بتعطيل تحليل مصادر الطلبات. إذا تم تعطيلها (`on`)، فإن العقدة المُصفى لا تقوم بتنزيل [قوائم IP](../user-guides/ip-lists/overview.md) من Wallarm Cloud وتتجاوز تحليل مصدر IPs الطلب.

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.

    القيمة الافتراضية هي `off`.

### wallarm_acl_access_phase

يجبر هذا التوجيه العقدة المبنية على NGINX لـ Wallarm على حظر الطلبات القادمة من [IPs في القائمة السوداء](../user-guides/ip-lists/overview.md) في مرحلة الوصول إلى NGINX وهو يعني:

* مع `wallarm_acl_access_phase on`، تقوم العقدة Wallarm بحظر أي طلبات من IPs في القائمة السوداء على الفور في أي [وضع ترشيح](configure-wallarm-mode.md) دون البحث عن علامات هجوم في الطلبات من IPs في القائمة السوداء.

    هذه هي القيمة **الافتراضية والموصى بها** حيث تجعل القوائم السوداء تعمل بشكل قياسي وتقلل بشكل كبير من حمولة وحدة المعالجة المركزية للعقدة.

* مع `wallarm_acl_access_phase off`، تحلل العقدة Wallarm الطلبات للعلامات الهجومية أولاً ومن ثم إذا كانت تعمل في الوضع `block` أو `safe_blocking` تحجب الطلبات القادمة من IPs في القائمة السوداء.

    في وضع الفلترة `off`, لا تحلل العقدة الطلبات ولا تتحقق من القوائم السوداء.

    في وضع فلترة `monitoring`, تبحث العقدة عن علامات الهجوم في جميع الطلبات ولكنها لا تحجبها أبدًا حتى لو كان IP المصدر في القائمة السوداء.

    إن سلوك العقدة Wallarm مع `wallarm_acl_access_phase off` يزيد بشكل كبير من حمولة وحدة المعالجة المركزية للعقدة.

!!! info "القيمة الافتراضية والتفاعل مع التوجيهات الأخرى"
    **قيمة الافتراضية**: `on` (بدءًا من العقدة Wallarm 4.2)

    يمكن تعيين التوجيه فقط داخل كتلة http في ملف تكوين NGINX.

    * مع [`disable_acl on`](#disable_acl), لا يتم معالجة قوائم IP ولذا فإن تمكين `wallarm_acl_access_phase` ليس له معنى.
    * لديه التوجيه `wallarm_acl_access_phase` أولوية على [`wallarm_mode`](#wallarm_mode) مما يؤدي إلى حظر طلبات من IPs في القائمة السوداء حتى لو كان وضع العقدة المُصفى هو `off` أو `monitoring` (مع `wallarm_acl_access_phase on`).

### wallarm_acl_export_enable

يتيح التوجيه تمكين `on` / تعطيل `off` إرسال إحصائيات حول الطلبات من [IPs في القائمة السوداء](../user-guides/ip-lists/overview.md) من العقدة إلى السحابة.

* مع `wallarm_acl_export_enable on` ستتم [عرض](../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) الإحصائيات على الطلبات من IPs في القائمة السوداء في قسم **الهجمات**.
* مع `wallarm_acl_export_enable off` لن تتم عرض الإحصائيات حول الطلبات من IPs في القائمة السوداء.

!!! info
    يتم تعيين هذه القيمة داخل كتلة http.
    
    **القيمة الافتراضية**: `on`

### wallarm_api_conf

مسار إلى ملف `node.yaml`، الذي يحتوي على متطلبات الوصول إلى Wallarm API.

**مثال**: 
```
wallarm_api_conf /etc/wallarm/node.yaml

# الصورة الخاصة ب Docker NGINX-based ، الصورة السحابية وجميع التثبيتات all-in-one
# wallarm_api_conf /opt/wallarm/etc/wallarm/node.yaml
```

يتم استخدامه لتحميل الطلبات المتسلسلة من العقدة المُصفى مباشرة إلى Wallarm API (Cloud) بدلاً من تحميلها في وحدة postanalytics (Tarantool).
**ترسل فقط الطلبات التي بها هجمات إلى الواجهة البرمجية للتطبيقات.** لا يتم حفظ الطلبات التي ليس بها هجمات.

**مثال على محتوى ملف node.yaml:**
``` bash
# بيانات اعتماد الاتصال بالواجهة البرمجية للتطبيقات

hostname: <بعض الاسماء>
uuid: <بعض uuid>
secret: <بعض secret>

# معلمات الاتصال بالواجهة البرمجية للتطبيقات (المعلمات أدناه تُستخدم بشكل افتراضي)

api:
  host: api.wallarm.com
  port: 443
  ca_verify: true
```

### wallarm_application

معرّف فريد للتطبيق المحمي الذي سيتم استخدامه في Wallarm Cloud. يمكن أن تكون القيمة رقمًا صحيحًا موجبًا باستثناء `0`.

يمكن تعيين معرفات فريدة لكلٍ من نطاقات التطبيق ومسارات النطاق، على سبيل المثال:

=== "مُعرِّفات للنطاقات"
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
=== "مُعرِّفات لمسارات النطاق"
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

[مزيد من التفاصيل حول إعداد التطبيقات →](../user-guides/settings/applications.md)

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.

    **القيمة الافتراضية**: `-1`.

### wallarm_block_page

يتيح لك إعداد الرد على الطلب المحظور.

[مزيد من التفاصيل حول تكوين الصفحة الخاصة بالحظر ورمز الخطأ →](configuration-guides/configure-block-page-and-code.md)

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.

### wallarm_block_page_add_dynamic_path

يتم استخدام هذا التوجيه لتجهيز سجل حظر يحتوي على متغيرات NGINX في رمزه والمسار إلى هذه الصفحة المحظورة يتم أيضًا تعيينه باستخدام المتغير. خلاف ذلك، لا يُستخدم التوجيه.

[مزيد من التفاصيل حول تكوين الصفحة الخاصة بالحظر ورمز الخطأ →](configuration-guides/configure-block-page-and-code.md)

!!! info
    يمكن تعيين التوجيه داخل كتلة `http` لملف تكوين NGINX.

### wallarm_cache_path

دليل يتم فيه إنشاء كتالوج النسخ الاحتياطي لتخزين نسخة من proton.db وملف custom ruleset عند بدء الخادم. يجب أن يكون هذا الدليل قادرًا على الكتابة للعميل الذي يقوم بتشغيل NGINX.

!!! info
    يتم تكوين هذا المعلم داخل الكتلة http فقط.

### wallarm_custom_ruleset_path

مسار إلى ملف [custom ruleset](../user-guides/rules/rules.md) الذي يحتوي على معلومات حول التطبيق المحمي وإعدادات العقدة المُصفى.

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    
    **القيمة الافتراضية**:
    
    * `/opt/wallarm/etc/wallarm/custom_ruleset` لصور ال Docker NGINX-based ، الصور السحابية وجميع التثبيتات all-in-one
    * `/etc/wallarm/custom_ruleset` للتراكيب التثبيت الأخرى

<!-- ### wallarm_enable_apifw

التوجيه يُفعل `on` / يُعطل `off` [الرقابة السياسية لواجهة البرمجة API](../api-policy-enforcement/overview.md) ، المتاح من الإصدار 4.10 فما بعد. الرجاء ملاحظة أن تفعيل هذا الميزة لا يحل محل الاشتراك المطلوب والتكوين من خلال واجهة Wallarm Console.

تتوفر هذه التوجيه حاليًا فقط لعقد NGINX التي تم نشرها بواسطة [all-in-one installer](../installation/nginx/all-in-one.md).

!!! info
    يمكن تعيين هذا المعلم داخل كتل `server`.

    **القيمة الافتراضية**: `on`. -->

### wallarm_enable_libdetection

بكل سهولة/تعطيل التحقق من الهجمات الإضافية عن طريق مكتبة **libdetection**. باستخدام **libdetection** ، يضمن ضعف الكشف عن الهجمات ويقلل من عدد المواقع الخاطئة التي تم التقاطها.

هو يتم تمكين تحليل الطلبات مع مكتبة **libdetection** بشكل افتراضي في جميع [خيارات النشر](../installation/supported-deployment-options.md). لتقليل عدد المواقع الخاطئة، فإننا نوصي بالبقاء في التحليل.

[معلومات أكثر على **libdetection** →](../about-wallarm/protecting-against-attacks.md#library-libdetection)

!!! warning "زيادة استهلاك الذاكرة"
    عند تحليل الهجمات باستخدام مكتبة libdetection، قد تزيد كمية الذاكرة المستهلكة من NGINX وعمليات Wallarm بحوالي 10٪.

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.

    القيمة الافتراضية هي `on` لجميع [خيارات النشر](../installation/supported-deployment-options.md).

### wallarm_fallback

مع القيمة التي تم تعيينها على `on`, لدى NGINX القدرة على الدخول في وضع الطوارئ. إذا لم يتمكن من تنزيل proton.db أو custom ruleset، يتم تعطيل وحدة Wallarm للكتل http، والخادم، والموقع، التي يفشل في تنزيل البيانات. يستمر NGINX في التشغيل.

!!! info
    القيمة الافتراضية هي `on`.

    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.


### wallarm_force

تعيين تحليل الطلبات وإنشاء قواعد مخصصة استنادًا إلى حركة المرور المُستعرضة لـ NGINX. انظر [تحليل الحركة المُستعرضة مع NGINX](../installation/oob/web-server-mirroring/overview.md).

### wallarm_general_ruleset_memory_limit

قم بتعيين الحد الأقصى لكمية الذاكرة التي يمكن استخدامها في نسخة واحدة من proton.db والقواعد المخصصة.

إذا تم تجاوز الحد الذاكرة أثناء معالجة بعض الطلبات، سوف يحصل المستخدم على خطأ 500.

يمكن استخدام اللاحقات التالية في هذا المعلم:
* `k` أو `K` للكيلوبايت
* `m` أو `M` للميجابايت
* `g` أو `G` للجيجابايت

قيمة الـ **0** تقوم بإيقاف الحد.

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، و/أو الموقع.
    
    **القيمة الافتراضية**: `1` جيجا بايت

### wallarm_global_trainingset_path

!!! warning "تم الاعتراف بالتوجيه"
    ابتداءً من Wallarm node 3.6 ، يرجى استخدام أمر التوجيه [`wallarm_protondb_path`](#wallarm_protondb_path) بدلاً من ذلك. فقط قم بتغيير اسم التوجيه، لم يتغير منطقه.

### wallarm_file_check_interval

يحدد الفاصل الزمني بين التحقق من بيانات جديدة في proton.db وملف القواعد المخصصة. يتم تحديد الوحدة القياس في اللاحقة على النحو التالي:
* بدون لاحقة للدقائق
* `s` للثواني
* `ms` للمللي ثانية

!!! info
    هذا المعلم يتم تكوينه داخل الكتلة http.
    
    **القيمة الافتراضية**: `1` (دقيقة واحدة)

### wallarm_instance

!!! warning "تم الإعتراف بالتوجيه"
    * إذا كان التوجيه مستخدمًا لتعيين معرّف فريد للتطبيق المحمي، فقط قم بإعادة تسميته إلى [`wallarm_application`](#wallarm_application).
    * لتعيين معرف فريد للمستأجر للعقد الذاتية المتعددة، بدلاً من `wallarm_instance`، استخدم التوجيه [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid).

    عند تحديث التكوين الذي استخدمته لعقدة الترشيح الخاصة بك للإصدار الذي يسبق 4.0:

    * إذا قمت بترقية العقدة المُصفى بدون ميزة المتعددة الإشتراكات ولديك أي `wallarm_instance` تم استخدامه لتعيين معرف فريد للتطبيق المحمي، فقط قم بإعادة تسميته إلى `wallarm_application`.
    * إذا قمت بترقية العقدة المُصفى للمتعددة الإشتراكات، فعتبر أن جميع `wallarm_instance` لتكون `wallarm_application` ، ثم أعد كتابة التكوين كما هو موضح في [تعليمات أعادة التكوين المتعددة الإشتراكات](../updating-migrating/older-versions/multi-tenant.md#step-3-reconfigure-multitenancy).

### wallarm_key_path

مسار إلى مفتاح Wallarm الخاص المستخدم للتشفير / فك التشفير لـ proton.db وملفات custom ruleset.

!!! info
    **القيمة الافتراضية**:
    
    * `/opt/wallarm/etc/wallarm/private.key` للصور الخاصة ب Docker NGINX-based ، والصور السحابية، وجميع التثبيتات all-in-one
    * `/etc/wallarm/private.key` للتراكيب التثبيت الأخرى

### wallarm_local_trainingset_path

!!! warning "تم الإعتراف بالتوجيه"
    ابتداءً من Wallarm node 3.6 ، يرجى استخدام أمر التوجيه [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path) بدلاً من ذلك. فقط قم بتغيير اسم التوجيه، لم يتغير منطقه.

### wallarm_memlimit_debug

يحدد هذا التوجيه ما إذا كانت وحدة Wallarm NGINX تنشئ ملف `/tmp/proton_last_memlimit.req` الذي يحتوي على تفاصيل الطلب عند تجاوز حد الذاكرة. هذا يمكن أن يكون لا غنى عنه لتصحيح المشكلات المتعلقة بمعالجة حد الذاكرة للطلب.

!!! info
    حاليًا، هذا التوجيه متاح فقط لعقد NGINX التي تم نشرها باستخدام [all-in-one installer](../installation/nginx/all-in-one.md) الإصدار 4.8.8 أو أعلى.

    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    
    **القيمة الافتراضية**: `on`.

### wallarm_mode

وضع معالجة حركة المرور:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include/wallarm-modes-description-latest.md"

يمكن تقييد استخدام `wallarm_mode` بواسطة التوجيه `wallarm_mode_allow_override`.

[تعليمات مفصلة حول تكوين وضع الفلترة →](configure-wallarm-mode.md)

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    
    **القيمة الافتراضية** تعتمد على طريقة نشر العقدة المُصفى (يمكن أن تكون `off` أو `monitoring`)

### wallarm_mode_allow_override

يدير القدرة على تجاوز قيم ["wallarm_mode"](ــwallarm_mode) عبر قواعد الترشيح المُنزّلة من Wallarm Cloud (custom ruleset):

- `off` - يتم تجاهل القواعد المخصصة.
- `strict` - يمكن أن تقوي القواعد المخصصة فقط على وضع التشغيل.
- `on` - يمكن للقواعد المخصصة أن تعزز وتبرد وضع التشغيل.

على سبيل المثال، مع `wallarm_mode monitoring` و `wallarm_mode_allow_override strict` المُعدّ، يمكن استخدام Wallarm Console لتمكين حظر بعض الطلبات، ولكن يتعذر تعطيل تحليل هجوم بالكامل.

[تعليمات مفصلة حول تكوين وضع الفلترة →](configure-wallarm-mode.md)

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    
    **القيمة الافتراضية**: `on`


### wallarm_parse_response

عما إذا كان يجب تحليل ردود التطبيق. يتطلب تحليل الرد للكشف عن الثغرات أثناء [الكشف السلبي](../about-wallarm/detecting-vulnerabilities.md#passive-detection) و [التحقق من الاختراقات النشطة](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification). 

القيم الممكنة هي `on` (تم تمكين تحليل الاستجابة) و `off` (تم تعطيل تحليل الاستجابة).

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخدمة، والموقع.
    
    **القيمة الافتراضية**: `on`

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

توفر Wallarm الدعم الكامل لـ WebSockets تحت خطة الاشتراك في أمان API. بشكل افتراضي، لا تتم تحليل رسائل WebSockets الخاصة بالهجمات.

لفرض الميزة، يجب تنشيط خطة الاشتراك في امان API واستخدم توجيه `wallarm_parse_websocket`.

القيم الممكنة:

- `on`: تم تمكين تحليل الرسالة.
- `off`: تم تعطيل تحليل الرسالة.

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخدمة، والموقع.
    
    **القيمة الافتراضية**: `off`

### wallarm_parser_disable

تسمح بتعطيل المُحللات. يتوافق قيم التوجيه مع اسم المُحلل الذي سيتم تعطيله:

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
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.

### wallarm_process_time_limit

!!! warning "تم الاعتراف بالتوجيه"
    بدءًا من الإصدار 3.6، يوصى بضبط دقيق لكشف الهجمات `overlimit_res` عن طريق [قاعدة **ضبط دقيق كشف هجمات overlimit_res**](../user-guides/rules/configure-overlimit-res-detection.md).
    
    يتم دعم التوجيه `wallarm_process_time_limit` مؤقتًا ولكن سيتم إزالته في الإصدارات المستقبلية.

يحدد الحد الزمني لمعالجة طلب واحد من قبل العقدة Wallarm.

إذا تجاوز الوقت الحد، يتم تسجيل خطأ في السجل ويتم وضع علامة على الطلب على أنه هجوم `overlimit_res`. اعتمادًا على قيمة `wallarm_process_time_limit_block` ، يمكن أن يتم حظر الهجوم، أو مراقبته أو تجاهله.

القيمة محددة بالمللي ثانية بدون وحدات، على سبيل المثال:

```bash
wallarm_process_time_limit 1200; # 1200 مللي ثانية
wallarm_process_time_limit 2000; # 2000 مللي ثانية
```

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    
    **القيمة الافتراضية**: 1000ms (ثانية واحدة).

### wallarm_process_time_limit_block

!!! warning "تم الاعتراف بالتوجيه"
    بدءًا من الإصدار 3.6، يوصى بضبط دقيق لكشف الهجمات `overlimit_res` عن طريق [قاعدة **ضبط دقيق كشف هجمات overlimit_res**](../user-guides/rules/configure-overlimit-res-detection.md).
    
    يتم دعم التوجيه `wallarm_process_time_limit_block` مؤقتًا ولكن سيتم إزالته في الإصدارات المستقبلية.

القدرة على إدارة حظر الطلبات، التي تتجاوز الحد الزمني المحدد في التعيين [`wallarm_process_time_limit`](#wallarm_process_time_limit):

- `on`: الطلبات تقطع دائمًا ما لم يكن `wallarm_mode off`
- `off`: يتم تجاهل الطلبات دائمًا

    !!! warning "خطر تجاوز الحماية"
        يجب استخدام القيمة `off` بحذر حيث يقوم هذا القيمة بتعطيل الحماية من الهجمات `overlimit_res`.
        
        من الأفضل استخدام القيمة `off` فقط في المواقع التي هي بحاجة إلى ذلك بدقة ، على سبيل المثال حيث يتم رفع الملفات الكبيرة، وحيث لا يوجد خطر تجاوز الحماية و استغل الثغرات.
        
        **من الغير المستحسن** بشدة تعيين `wallarm_process_time_limit_block` لـ `off` عالميًا لـ http أو الخادم.

- `attack`: يعتمد على وضع حظر الهجوم المُعد في توجيه `wallarm_mode`:
    - `off`: الطلبات ليست معالجة.
    - `monitoring`: يتم تجاهل الطلبات ولكن التفاصيل حول هجمات `overlimit_res` يتم تحميلها إلى Wallarm Cloud ويتم عرضها في Wallarm Console.
    - `safe_blocking`: فقط الطلبات الأصلية من [graylisted](../user-guides/ip-lists/overview.md) عناوين IP هي محظورة والتفاصيل حول جميع الهجمات `overlimit_res` يتم تحميلها إلى Wallarm Cloud ويتم عرضها في واجهة Wallarm Console.
    - `block`: الطلبات هي محظورة.

بغض النظر عن قيمة التوجيه، تتم تحميل طلبات من نوع الهجوم `overlimit_res` إلى Wallarm Cloud ما لم [`wallarm_mode off;`](#wallarm_mode).

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    
    **القيمة الافتراضية**: `wallarm_process_time_limit_block attack`

### wallarm_protondb_path

مسار إلى [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) file الذي يحتوي على الإعدادات العالمية لترشيح الطلب، التي لا تعتمد على بنية التطبيق.

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    
    **القيمة الافتراضية**:
    
    * `/opt/wallarm/etc/wallarm/proton.db` للصور الخاصة ب Docker NGINX-based ، الصور السحابية وجميع التثبيتات all-in-one
    * `/etc/wallarm/proton.db` لتراكيب التثبيت الأخرى 

### wallarm_rate_limit

تعيين تكوين الحد الأقصى للسرعة بالتنسيق التالي:

```
wallarm_rate_limit <KEY_TO_MEASURE_LIMITS_FOR> rate=<RATE> burst=<BURST> delay=<DELAY>;
```

* `KEY_TO_MEASURE_LIMITS_FOR` - مفتاح تريد قياس الحدود له. يمكن أن يحتوي على نص, [متغيرات NGINX](http://nginx.org/en/docs/varindex.html) وتواجدهم.

    على سبيل المثال: `"$remote_addr +login"` للحد من الطلبات القادمة من نفس IP والموجهة إلى نقطة النهاية `/login`.
* `rate=<RATE>` (مطلوب) - الحد الأقصى للسرعة ، يمكن أن يكون `rate=<number>r/s` أو `rate=<number>r/m`.
* `burst=<BURST>` (اختياري) - الحد الأقصى لعدد الطلبات الزائدة المؤونة بمجرد تجاوز ال RPS / RPM المحدد وللمعالجة بمجرد عودة السرعة إلى الحالة الطبيعية. `0` بشكل افتراضي.
* `delay=<DELAY>` - إذا كانت قيمة `<BURST>` مختلفة عن `0` ، يمكنك التحكم في ما إذا كان يجب الاحتفاظ بـ RPS / RPM المحدد بين تنفيذ الطلبات الزائدة المؤونة. `nodelay` يشير إلى معالجة جميع الطلبات الزائدة المؤونة في وقت واحد، دون تأخير الحد الأقصى للسرعة. تشير القيمة العددية  إلى معالجة العدد المحدد في وقت واحد من الطلبات الزائدة المؤونة، وتتم معالجة الطلبات الأخرى مع التأخير المحدد في RPS / RPM.

مثال:

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    **القيمة الافتراضية:** لا شيء.

    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، location.


### wallarm_rate_limit_enabled

يمكنك تمكين / تعطيل Wallarm rate limiting.

إذا كان `off` ، فلا تعمل أي من قاعدة الحد المعدلة لـ Wallarm (المستحسن) ولا التوجيه `wallarm_rate_limit`.

!!! info
    **القيمة الافتراضية:** `on` ولكن بشكل افتراضي لا تعمل الحد المعدلة لـ Wallarm ما لم يتم تكوين إما قاعدة [rate limiting](../user-guides/rules/rate-limiting.md) (المستحسن) أو توجيه `wallarm_rate_limit`.

### wallarm_rate_limit_log_level

مستوى تسجيل الطلبات المرفوضة من قبل التحكم الحد الأقصى للسرعة. يمكن أن يكون: `info`, `notice`, `warn`, `error`.

!!! info
    **القيمة الافتراضية:** `error`.
    
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، الlocation.


### wallarm_rate_limit_status_code

الرمز للإرجاع في الرد على الطلبات المرفوضة من وحدة Wallarm للحد الأقصى للسرعة

!!! info
    **القيمة الافتراضية:** `503`.
    
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، الlocation.


### wallarm_rate_limit_shm_size

تعيين الحد الأقصى لكمية الذاكرة المشتركة التي يمكن أن تستهلكها وحدة Wallarm للحد الأقصى للسرعة.

مع طول المفتاح المتوسط ​​64 بايت (حرف)، وقيمة `wallarm_rate_limit_shm_size` 64MB، يمكن للوحدة التعامل مع حوالي 130,000 مفتاح فريد في وقت واحد. زيادة الذاكرة بمقدار اثنين تضاعف قدرة الوحدة بطريقة خطية.

المفتاح هو قيمة فريدة لنقطة الطلب التي تستخدمها الوحدة لقياس الحدود. على سبيل المثال، إذا كانت الوحدة تحد الاتصالات على أساس عناوين IP ، يتم اعتبار كل عنوان IP فريد كمفتاح واحد. مع القيمة الافتراضية للتوجيه، يمكن للوحدة معالجة الطلبات القادمة من ~ 130,000 IPs مختلفة في وقت واحد.

!!! info
    **القيمة الافتراضية:** `64m` (64 ميجابايت).
    
    يمكن تعيين هذا المعلم في الكتلة http فقط.

### wallarm_request_chunk_size

تحدد الحجم الأقصى لجزء من الطلب الذي يتم معالجته خلال تكرار واحد. يمكنك إعداد قيمة مخصصة للتوجيه `wallarm_request_chunk_size` بالبايت عن طريق تعيين عدد صحيح له. يدعم التوجيه اللاحقات التالية أيضًا:
* `k` أو `K` للكيلوبايت
* `m` أو `M` للميجابايتية
* `g` أو `G` للجيجابايت

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    **القيمة الافتراضية**: `8k` (8 كيلوبايت).

### wallarm_request_memory_limit

قم بتعيين الحد الأقصى لكمية الذاكرة التي يمكن استخدامها لمعالجة طلب واحد.

إذا تجاوزت الحد، ستتوقف معالجة الطلب وسوف يحصل المستخدم على خطأ 500.

يمكن استخدام اللاحقات التالية في هذا المعلم:
* `k` أو `K` للكيلوبايت
* `m` أو `M` للميجابايت
* `g` أو `G` للجيجابايتة

قيمة الـ **0** تقوم بإيقاف الحد.

بشكل افتراضي، الحدود متوقفة. 

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، و/أو الموقع.


### wallarm_stalled_worker_timeout

تعيين الحد الزمني لمعالجة طلب واحد للعامل NGINX بالثواني.

إذا تجاوز الوقت الحد، يتم كتابة بيانات حول العمال NGINX في المعلمات `stalled_workers_count` و `stalled_workers` [الإحصائية](configure-statistics-service.md##working-with-the-statistics-service).

!!! info
    يمكن تعيين هذا المعلم داخل الكتل http، والخادم، والموقع.
    
    **القيمة الافتراضية**: `5` (ثوان خمسة)

### wallarm_status

يتحكم في [خدمة إحصاءات Wallarm](configure-statistics-service.md).

قيمة التوجيه لديها التنسيق التالي:

```
wallarm_status [on|off] [format=json|prometheus];
```

من الجيد جدًا تكوين خدمة الإحصاءات في ملفها الخاص، دون التوجيه `wallarm_status` في ملفات إعدادات NGINX الأخرى، لأن الأخير قد يكون غير آمن. ملف التكوين لـ `wallarm-status` يقع في:

* `/etc/nginx/wallarm-status.conf` لـ all-in-one installer
* `/etc/nginx/conf.d/wallarm-status.conf` للتثبيتات الأخرى

علاوة على ذلك، ينصح بشدة عدم تغيير أي من الخطوط الموجودة للتكوين `wallarm-status` الافتراضي حيث قد يفسد عملية تحميل البيانات المتريكية إلى سحابة Wallarm.

!!! info
    التوجيه يمكن تكوينه في السياقات NGINX `server` و / أو `location`.

    التوجيه `format` لديه القيمة `json` by default.

### wallarm_tarantool_upstream

مع `wallarm_tarantool_upstream`، يمكنك موازنة الطلبات بين عدة خوادم postanalytics.

**Example:**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# تم حذف بعض المحتوى

wallarm_tarantool_upstream wallarm_tarantool;
```

راجع أيضًا [Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html).

!!! warning "الشروط المطلوبة"
    من اللازم تلبية الشروط التالية للحصول على النتائج `max_conns` و `keepalive`:

    * يجب ألا تكون قيمة `keepalive` أقل من عدد خوادم Tarantool.
    * يجب تحديد قيمة `max_conns` على كل من خوادم ترنتول العلوية لمنع إنشاء اتصالات زائدة.

!!! info
    يتم تكوين هذا المعلم داخل الكتلة http.

### wallarm_upstream_backend

طريقة لإرسال الطلبات المتسلسلة. يمكن إرسال الطلبات إلى Tarantool أو إلى واجهة البرمجة للتطبيقات.

قيمة التوجيه الممكنة:
*   `tarantool`
*   `api`

اعتمادًا على التوجيهات الأخرى، سيتم تعيين القيمة الافتراضية على النحو التالي:
*   `tarantool` - ما لم يكن هناك توجيه `wallarm_api_conf` في التكوين.
*   `api` - ما لم يكن هناك توجيه `wallarm_api_conf` ، ولكن هناك توجيه `wallarm_tarantool_upstream` في التكوين.

!!! note
    إذا كان التوجيه `wallarm_api_conf` و `wallarm_tarantool_upstream` موجودان في التكوين في الوقت نفسه، سيحدث خطأ في التكوين من النوع **توجيه عوضي خلفي غامض لـ wallarm** .

!!! info
    يتم تكوين هذا المعلم داخل الكتلة http فقط.


### wallarm_upstream_connect_attempts

تعرف عدد إعادة الاتصالات الفورية إلى Tarantool أو Wallarm API.
إذا تم إنهاء اتصال بـ Tarantool أو API ، فلن يحدث محاولات الاتصال مرة أخرى. ولكن على عكسه عندما لا يكون هناك اتصالات أكثر وطابور الطلبات المتسلسلة ليس فارغًا.

!!! note
    قد تحدث إعادة الاتصال من خلال خادم آخر، لأن نظام الـ “upstream” مسؤول عن اختيار الخادم.
    
    يتم تكوين هذا المعلم داخل الكتلة http فقط.


### wallarm_upstream_reconnect_interval

تعرف الفترة الزمنية بين محاولات إعادة الاتصال إلى Tarantool أو Wallarm API بعد أن يتجاوز عدد المحاولات غير الناجحة حاجز `wallarm_upstream_connect_attempts`.

!!! info
    يتم تكوين هذا المعلم داخل الكتلة http فقط.


### wallarm_upstream_connect_timeout

تعرف مهلة الاتصال بـ Tarantool أو Wallarm API.

!!! info
    يتم تكوين هذا المعلم داخل الكتلة http فقط.


### wallarm_upstream_queue_limit

تعرف الحد الأقصى لعدد الطلبات المتسلسلة.
الإعداد المتزامن للمعلم `wallarm_upstream_queue_limit` وعدم تعيين المعلم `wallarm_upstream_queue_memory_limit` يعني أن لا يوجد حد لهذا الأخير.

!!! info
    يتم تكوين هذا المعلم داخل الكتلة http فقط.


### wallarm_upstream_queue_memory_limit

تعرف الحد الأقصى للحجم الكلي للطلبات المتسلسلة.
إعداد معامل `wallarm_upstream_queue_memory_limit` مع معدل معامل `wallarm_upstream_queue_limit`، يعني أن لا يوجد حد للأخير.

!!! info
    **القيمة الافتراضية:** `100m`.
    
    يتم تكوين هذا المعلم داخل الكتلة http فقط.


### wallarm_status

يتحكم في [خدمة الإحصائيات Wallarm](configure-statistics-service.md).

القيمة الافتراضية للتحميل:

```
wallarm_status [on|off] [format=json|prometheus];
```

كما يوصى بتكوين الخدمات التحليلات في ملفها الخاص، تجنبًا لتوجيه `wallarm_status` في ملفات خدمات nginx، وذلك لأن الأخيرة قد تكون غير آمنة. ملف التكوين لـ `wallarm-status` موجود في:

* `/etc/nginx/wallarm-status.conf` لـ all-in-one installer
* `/etc/nginx/conf.d/wallarm-status.conf` لأنواع التثبيت الأخرى.

تتم إدارتها بعدم تغيير أي من الخطوط الحالية للتكوين `wallarm-status` الافتراضية، حيث قد يؤدي ذلك إلى تلف عملية التحميل البيانات المقياس إلى الخادم Wallarm.

!!! info
    يمكن تكوين هذا التوجيه في `server` و/أو `location` بيئات تكوين NGINX.

    يكون لديها القيمة الافتراضية `json`.