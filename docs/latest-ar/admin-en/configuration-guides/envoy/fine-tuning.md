# خيارات التهيئة للعقدة القائمة على Envoy في Wallarm

[link-lom]: ../../../user-guides/rules/rules.md

[anchor-process-time-limit]: #processtimelimit
[anchor-tsets]: #filtering-mode-settings

تستخدم Envoy مرشحات قابلة للتبديل محددة في ملف تهيئة Envoy لمعالجة الطلبات الواردة. تصف هذه المرشحات الإجراءات المطلوب تنفيذها على الطلب. على سبيل المثال، يتم استخدام مرشح `envoy.http_connection_manager` لتوجيه طلبات HTTP. يحتوي هذا المرشح على مجموعة خاصة به من مرشحات HTTP التي يمكن تطبيقها على الطلب.

تم تصميم وحدة Wallarm كمرشح HTTP لـ Envoy. يتم وضع الإعدادات العامة للوحدة في قسم مخصص لمرشح HTTP `wallarm`:

```
listeners:
   - address:
     filter_chains:
     - filters:
       - name: envoy.http_connection_manager
         typed_config:
           http_filters:
           - name: wallarm
             typed_config:
              "@type": type.googleapis.com/wallarm.Wallarm
              <تهيئة وحدة Wallarm>
              ...  
```

!!! warning "تمكين معالجة جسم الطلب"
    لتمكين وحدة Wallarm من معالجة جسم الطلب HTTP، يجب وضع مرشح المخزن قبل العقدة المرشحة في سلسلة مرشح HTTP الخاصة بـ Envoy. على سبيل المثال:
    
    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <الحجم الأقصى للطلب (بالبايت)>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <تهيئة وحدة Wallarm>
        ...
    ```
    
    إذا تجاوز حجم الطلب الوارد قيمة المعلمة `max_request_bytes`، فسيتم إسقاط هذا الطلب وسوف يقوم Envoy بإرجاع رمز الاستجابة `413` (“حجم الحمولة كبير جدًا”).

## إعدادات تصفية الطلبات

القسم `rulesets` من الملف يحتوي على المعلمات المتعلقة بإعدادات تصفية الطلبات:

```
rulesets:
- name: rs0
  pdb: /etc/wallarm/proton.db
  custom_ruleset: /etc/wallarm/custom_ruleset
  key: /etc/wallarm/private.key
  general_ruleset_memory_limit: 0
  enable_libdetection: "on"
  ...
- name: rsN:
  ...
```

الإدخالات `rs0` ... `rsN` هي مجموعات معلمات واحدة أو أكثر. يمكن أن تحمل المجموعات أي اسم (حتى يمكن الإشارة إليها لاحقًا عبر المعلمة [`ruleset`](#ruleset_param) في القسم `conf`). يجب أن تكون هناك مجموعة واحدة على الأقل موجودة في تهيئة العقدة المرشحة (على سبيل المثال، بالاسم `rs0`).

لا يحتوي هذا القسم على قيم افتراضية. تحتاج إلى تحديد القيم بشكل صريح في ملف التكوين.

!!! info "مستوى التعريف"
    يمكن تعريف هذا القسم على مستوى العقدة المرشحة فقط.

المعلمة | الوصف | القيمة الافتراضية
--- | ---- | -----
`pdb` | المسار إلى ملف `proton.db`. يحتوي هذا الملف على الإعدادات العالمية لتصفية الطلبات، التي لا تعتمد على بنية التطبيق. |/etc/wallarm/proton.db
`custom_ruleset` | المسار إلى ملف [القواعد المخصصة][link-lom] الذي يحتوي على معلومات حول التطبيق المحمي وإعدادات العقدة المرشحة. | /etc/wallarm/custom_ruleset
`key` | المسار إلى الملف بالمفتاح الخاص Wallarm المستخدم لتشفير/فك تشفير ملفات proton.db والقواعد المخصصة. | /etc/wallarm/private.key
`general_ruleset_memory_limit` | الحد للكمية القصوى من الذاكرة التي يمكن استخدامها من قبل نسخة واحدة من proton.db والقواعد المخصصة. إذا تم تجاوز الحد الذاكرة أثناء معالجة بعض الطلبات، سيحصل المستخدم على خطأ 500. يمكن استخدام اللاحقات التالية في هذه المعلمة:<ul><li>`k` أو `K` لكيلوبايت</li><li>`m` أو `M` لميجابايت</li><li>`g` أو `G` لجيجابايت</li></ul>تعني القيمة `0` إيقاف الحد. | `0`
`enable_libdetection` | تمكين / تعطيل التحقق الإضافي من هجمات الحقن SQL باستخدام [مكتبة **libdetection**](../../../about-wallarm/protecting-against-attacks.md#library-libdetection). إذا لم تؤكد المكتبة الحمولة الخبيثة، يتم اعتبار الطلب شرعي. تسمح استخدام مكتبة **libdetection** بتقليل عدد النتائج الإيجابية الكاذبة بين هجمات الحقن SQL.<br><br>بشكل افتراضي، تكون مكتبة **libdetection** مكونة. من أجل أفضل كشف عن الهجمات، نوصي بالإبقاء على تمكين المكتبة.<br><br>عند تحليل الهجمات باستخدام مكتبة **libdetection**، قد يزيد كمية الذاكرة التي يستهلكها NGINX وعمليات Wallarm بنحو 10%. | `on`

## إعدادات وحدة Postanalytics

قسم `tarantool` من العقدة المرشحة يحتوي على المعلمات المتعلقة بوحدة postanalytics:

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

إدخال `server` هو مجموعة معلمات تصف إعدادات خادم Tarantool.

!!! info "مستوى التعريف"
    يمكن تعريف هذا القسم على مستوى العقدة المرشحة فقط.

المعلمة | الوصف | القيمة الافتراضية
--- | ---- | -----
`uri` | النص المحتوي على بيانات الاعتماد المستخدمة للاتصال بخادم Tarantool. تنسيق النص هو `عنوان IP` أو `اسم النطاق:منفذ`. | `localhost:3313`
`max_packets` | الحد لعدد الطلبات المتسلسلة التي سيتم إرسالها إلى Tarantool. لإزالة الحد، حدد `0` كقيمة المعلمة. | `512`
`max_packets_mem` | الحد للحجم الإجمالي (بالبايت) للطلبات المتسلسلة التي سيتم إرسالها إلى Tarantool. | `0` (الحجم غير محدود)
`reconnect_interval` | الفترة (بالثواني) بين محاولات إعادة الاتصال بـ Tarantool. تعني قيمة `0` أن العقدة المرشحة ستحاول إعادة الاتصال بالخادم في أسرع وقت ممكن إذا أصبح الخادم غير متاح (غير مستحسن). | `1`

## الإعدادات الأساسية

قسم `conf` من التهيئة Wallarm يحتوي على المعلمات التي تؤثر على عمليات العقدة المرشحة الأساسية:

```
conf:
  ruleset: rs0
  mode: "monitoring"
  mode_allow_override: "off"
  application: 42
  process_time_limit: 1000
  process_time_limit_block: "attack"
  request_memory_limit: 104857600
  wallarm_status: "off"
  wallarm_status_format: "json"
  parse_response: true
  unpack_response: true
  parse_html_response: true
```

!!! info "مستوى التعريف"
    لمستوى حماية أكثر مرونة، يمكن تجاوز هذا القسم على مستوى المسار أو المضيف الافتراضي:

    * على مستوى المسار:

        ```
        routes:
        - match:
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <معلمات القسم>
        ```
        
    * على مستوى المضيف الافتراضي:
        ```
        virtual_hosts:
        - name: <اسم المضيف الافتراضي>
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <معلمات القسم>
        ```
    المعلمات في القسم `conf` المتجاوز على مستوى المسار لها الأولوية على المعلمات المعرفة في القسم على مستوى المضيف الافتراضي الذي بدوره يكون له أولوية أعلى من المعلمات المدرجة في القسم على مستوى العقدة المرشحة.

المعلمة | الوصف | القيمة الافتراضية
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | واحدة من مجموعات المعلمات المعرفة في القسم `rulesets`. تعين هذه المجموعة المعلمات قواعد تصفية الطلبات التي ستُستخدم.<br>إذا تم حذف هذه المعلمة من القسم `conf` للعقدة المرشحة، فيجب أن يكون موجودًا في القسم `conf` المتجاوز على مستوى المسار أو المضيف الافتراضي. | -
`mode` | وضع العقدة:<ul><li>`block` -لحظر الطلبات الخبيثة.</li><li>`monitoring` -لتحليل الطلبات دون حظرها.</li><li>`safe_blocking` -لحظر الطلبات الخبيثة فقط التي تأتي من عناوين IP في [القائمة الرمادية](../../../user-guides/ip-lists/overview.md).</li><li>`monitoring` -لتحليل الطلبات دون حظرها.</li><li>`off` -لتعطيل تحليل ومعالجة الحركة.</li></ul><br>[وصف مفصل لأوضاع التصفية →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | يسمح بتجاوز وضع العقدة المرشحة الذي يتم تعيينه عبر المعلمة `mode` باستخدام [القواعد المخصصة][link-lom]:<ul><li>`off` - يتم تجاهل القواعد المخصصة.</li><li>`strict` - التقواعد المخصصة يمكن أن تقوي فقط وضع التشغيل.</li><li>`on` - من الممكن تعزيز وتليين وضع التشغيل.</li></ul>على سبيل المثال، إذا تم تعيين المعلمة `mode` على قيمة `monitoring` وتم تعيين المعلمة `mode_allow_override` على قيمة `strict`، فسيكون من الممكن حظر بعض الطلبات (`block`) ولكن ليس لإيقاف العقدة المرشحة بالكامل (`off`). | `off`
<a name="application_param"></a>`application` | المعرف الفريد للتطبيق المحمي الذي سيُستخدم في Wallarm Cloud. يمكن أن تكون القيمة عدد صحيح موجب باستثناء `0`.<br><br>[المزيد من التفاصيل حول إعداد التطبيقات →](../../../user-guides/settings/applications.md) | `-1`
<a name="partner_client_id_param"></a>`partner_client_uuid` | المعرف الفريد للـ [المستأجر](../../../installation/multi-tenant/overview.md) لـ [العقدة المتعددة المستأجرين](../../../installation/multi-tenant/deploy-multi-tenant-node.md) في Wallarm. يجب أن تكون القيمة عبارة عن سلسلة في تنسيق [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format)، على سبيل المثال: <ul><li> `11111111-1111-1111-1111-111111111111`</li><li>`123e4567-e89b-12d3-a456-426614174000`</li></ul><p>علم كيف:</p><ul><li>[للحصول على UUID المستأجر أثناء إنشاء المستأجر →](../../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)</li><li>[للحصول على قائمة UUIDs للمستأجرين الموجودين →](../../../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)</li><ul>| -
<a name="process_time_limit"></a>`process_time_limit` | <div class="admonition warning"> <p class="admonition-title">تم إهمال المعلمة</p> <p>ابتداءً من الإصدار 3.6، يوصى بضبط الدقة لكشف الهجمات `overlimit_res` باستخدام <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">القاعدة **ضبط الدقة لكشف الهجمات overlimit_res**</a>.<br> سيتم تقديم دعم مؤقت للمعلمة `process_time_limit` ولكن سيتم إزالتها في الإصدارات المستقبلية.</p></div>حد لوقت معالجة طلب واحد (بالمللي ثانية). إذا لم يمكن معالجة الطلب في الكمية المعرفة من الوقت، فسيتم تسجيل رسالة خطأ في ملف السجل وسيتم وضع علامة على الطلب على أنه هجوم `overlimit_res`. | `1000`
<a name="process_time_limit_block"></a>`process_time_limit_block` | <div class="admonition warning"> <p class="admonition-title">تم إهمال المعلمة</p> <p>ابتداءً من الإصدار 3.6، يوصى بضبط الدقة لكشف الهجمات `overlimit_res` باستخدام <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">القاعدة **ضبط الدقة لكشف الهجمات overlimit_res**</a>.<br> سيتم تقديم دعم مؤقت للمعلمة `process_time_limit_block` ولكن سيتم إزالتها في الإصدارات المستقبلية.</p></div>الإجراء الذي يجب اتخاذه عندما يتجاوز وقت معالجة الطلب الحد المعين عبر المعلمة `process_time_limit`:<ul><li>`off` - الطلبات تتجاهل دائما.</li><li>`on` - الطلبات تحظر دائما ما لم يكن `mode: "off"`.</li><li>`attack` - يعتمد على وضع حظر الهجمات المحدد عبر المعلمة `mode`:<ul><li>`off` - الطلبات لا تتم معالجتها.</li><li>`monitoring` - الطلبات تتجاهل.</li><li>`block` - الطلبات تحظر.</li></ul></li></ul> | `attack`
`wallarm_status` | سواء كان يجب تمكين [خدمة إحصائيات العقدة المرشحة](../../configure-statistics-service.md). | `false`
`wallarm_status_format` | تنسيق [إحصائيات العقدة المرشحة](../../configure-statistics-service.md): `json` أو `prometheus`. | `json`
`disable_acl` | يسمح بتعطيل تحليل أصول الطلبات. إذا تم تعطيلها (`on`)، فإن العقدة المرشحة لا تقوم بتحميل [قوائم IP](../../../user-guides/ip-lists/overview.md) من Cloud Wallarm وتتجاوز تحليل IP الأصلي للطلب. | `off`
`parse_response` | سواء كان يجب تحليل ردود التطبيق. هو مطلوب تحليل الرد لاكتشاف الضعف خلال [الكشف السلبي](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) و[التحقق من التهديد النشط](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification).<br><br>القيم الممكنة هي `true` (تم تمكين تحليل الاستجابة) و `false` (تم تعطيل تحليل الاستجابة). | `true`
`unpack_response` | سواء كان يجب فك ضغط البيانات المضغوطة المرتجعة في رد التطبيق. القيم الممكنة هي `true` (تم تمكين فك الضغط) و `false` (تم تعطيل فك الضغط).<br><br>هذه المعلمة فعالة فقط إذا كان `parse_response true`. | `true`
`parse_html_response` | سواء كان يجب تطبيق المحللات HTML على كود HTML المستلم في رد التطبيق. القيم الممكنة هي `true` (تم تطبيق محلل HTML) و `false` (لم يتم تطبيق محلل HTML).<br><br>هذه المعلمة فعالة فقط إذا كان `parse_response true`. | `true`
