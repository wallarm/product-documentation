# خيارات التكوين لوحدة Wallarm على أساس Envoy

[link-lom]: ../../../user-guides/rules/rules.md

[anchor-process-time-limit]: #processtimelimit
[anchor-tsets]: #filtering-mode-settings

يستخدم Envoy مرشحات قابلة للتوصيل معرفة في ملف التكوين Envoy لمعالجة الطلبات الواردة. تصف هذه المرشحات الإجراءات التي يجب تنفيذها على الطلب. على سبيل المثال، يتم استخدام مرشح 'envoy.http_connection_manager' للوكيل الطلبات HTTP. لهذا المرشح مجموعة خاصة به من مرشحات HTTP التي يمكن تطبيقها على الطلب.

تم تصميم وحدة Wallarm كمرشح HTTP لـ Envoy. يتم وضع الإعدادات العامة للوحدة في قسم مخصص لمرشح ال HTTP 'wallarm': 

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
              <تكوين وحدة Wallarm>
              ...
```

!!! warning "تمكين معالجة جسم الطلب"
    لتمكين وحدة Wallarm من معالجة جسم طلب HTTP، يجب وضع مرشح ال buffer قبل العقدة التي يتم فيها التصفية في سلسلة مرشحات HTTP لـ Envoy. على سبيل المثال:

    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <الحد الأقصى لحجم الطلب (بالبايت)>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <تكوين وحدة Wallarm>
        ...
    ```
    
    إذا تجاوز حجم الطلب الوارد قيمة المعلمة `max_request_bytes`، فسيتم إسقاط هذا الطلب وسيرجع Envoy الرمز الاستجابة `413` (“Payload Too Large”).

## إعدادات تصفية الطلب

تحتوي القسم `rulesets` من الملف على المعلمات ذات الصلة بإعدادات تصفية الطلب:

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

الإدخالات `rs0` ... `rsN` هي مجموعات من المعلمات والتي يمكن أن تكون واحدة أو أكثر. يمكن أن تكون الجماعات بأي اسم (حتى يمكن الإشارة إلى هذه الجماعات في وقت لاحق عبر المعلمة [`ruleset`](#ruleset_param) في القسم `conf`). يجب أن يكون هناك مجموعة واحدة على الأقل موجودة في التكوين العقدة التي يتم فيها التصفية (على سبيل المثال، بالاسم `rs0`).

هذا القسم ليس له قيم افتراضية. تحتاج إلى تحديد القيم بشكل صريح في ملف التكوين.

!!! info "مستوى التعريف"
    يمكن تعريف هذا القسم على مستوى العقدة التي يتم فيها التصفية فقط.

المعلمة | الوصف | القيمة الافتراضية
--- | ---- | -----
`pdb` | المسار إلى ملف `proton.db`. يحتوي هذا الملف على الإعدادات العامة لتصفية الطلب، التي لا تعتمد على هيكل التطبيق. | `/etc/wallarm/proton.db`
`custom_ruleset` | المسار إلى ملف [custom ruleset][link-lom] الذي يحتوي على معلومات حول التطبيق المحمي وإعدادات العقدة التي يتم فيها التصفية. | `/etc/wallarm/custom_ruleset`
`key` | المسار إلى الملف الذي يحتوي على المفتاح الخاص Wallarm المستخدم للتشفير / فك التشفير من الملفات proton.db و custom ruleset. | `/etc/wallarm/private.key`
`general_ruleset_memory_limit` | الحد الأقصى للكمية من الذاكرة التي يمكن استخدامها بواسطة مثيل واحد من proton.db و custom ruleset. إذا تجاوز الحد الذاكري أثناء معالجة بعض الطلبات، سيحصل المستخدم على خطأ 500. يمكن استخدام اللاحقات التالية في هذا المعلمة:<ul><li>`k` أو `K` للكيلوبايت</li><li>`m` أو `M` للميجابايت</li><li>`g` أو `G` لل غيغابايت</li></ul>قيمة `0` تعطل الحد. | `0`
`enable_libdetection` | تمكين / تعطيل التحقق الإضافي من هجمات الSQL Injection باستخدام [مكتبة **libdetection**](../../../about-wallarm/protecting-against-attacks.md#library-libdetection). إذا لم تؤكد المكتبة الحمولة الخبيثة، فإن الطلب يعتبر مشروعًا. يتيح استخدام مكتبة **libdetection** تقليل عدد الإيجابيات الكاذبة بين هجمات الSQL Injection.<br><br>بشكل افتراضي، تم تمكين **libdetection**. للكشف عن الهجمات بشكل أفضل، نوصي بتمكين المكتبة. <br><br>عند تحليل الهجمات باستخدام **libdetection**، قد يزيد مقدار الذاكرة المستهلكة من عمليات NGINX و Wallarm بنسبة حوالي 10 ٪. | `on`

##  إعدادات وحدة Postanalytics 

تحتوي القسم `tarantool` من عقدة التصفية على المعلمات ذات الصلة بوحدة Postanalytics:

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

إدخال `server` يعتبر مجموعة من المعلمات التي تصف الإعدادات لخادم Tarantool.

!!! info "مستوى التعريف"
    يمكن تعريف هذا القسم على مستوى العقدة التي يتم فيها التصفية فقط.

المعلمة | الوصف | القيمة الافتراضية
--- | ---- | -----
`uri` | نص مع بيانات الاعتماد المستخدمة للاتصال بخادم Tarantool. تنسيق السلسلة هو `IP address` أو `domain name: port`. | `localhost: 3313`
`max_packets` | حد عدد الطلبات المسلسلة التي سيتم إرسالها إلى Tarantool. لإزالة الحد، قم بتعيين `0` كقيمة للمعلمة. | `512`
`max_packets_mem` | حد الحجم الإجمالي (بالبايت) للطلبات المسلسلة التي سيتم إرسالها إلى Tarantool. | `0` (الحجم غير محدود) 
`reconnect_interval` | الفاصل الزمني (بالثواني) بين محاولات إعادة الاتصال بـ Tarantool. القيمة `0` تعني أن العقدة التي يتم فيها التصفية ستحاول إعادة الاتصال بالخادم بأسرع ما يمكن إذا أصبح الخادم غير متاح (لا يوصى به). | `1`

##  الإعدادات الأساسية

تحتوي القسم `conf` من تكوين Wallarm على المعلمات التي تؤثر على عمليات العقدة التي يتم فيها التصفية الأساسية:

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
    لمستوى حماية أكثر مرونة، يمكن تجاوز هذا القسم على مستوى الطريق أو المضيف الافتراضي:

    * على مستوى الطريق:

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
    تمتلك المعلمات في القسم `conf` المجاوز على مستوى الطريق الأولوية على المعلمات في القسم المعرف على مستوى المضيف الافتراضي الذي بدوره يمتلك أولوية أعلى من المعلمات المدرجة في القسم على مستوى العقدة التي يتم فيها التصفية.

المعلمة | الوصف | القيمة الافتراضية
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | إحدى مجموعات المعلمة التي يتم تعريفها في القسم `rulesets`. تحدد مجموعة المعلمات هذه القواعد التي سيتم استخدامها لتصفية الطلبات.<br>If this parameter is omitted from the `conf` section of the filtering node, then it should be present in the `conf` section overridden on the route or virtual host level. | -
`mode` | وضع العقدة:<ul><li>`block` - لحظر الطلبات الخبيثة.</li><li>`monitoring` - لتحليل الطلبات ولكن دون حظرها.</li><li>`safe_blocking` - لحظر هذه الطلبات الخبيثة فقط التي تنشأ من [عناوين ال IP في القائمة الرمادية](../../../user-guides/ip-lists/overview.md).</li><li>`monitoring` - لتحليل الطلبات ولكن دون حظرها.</li><li>`off` - لتعطيل تحليل ومعالجة حركة المرور.</li></ul><br>[الوصف التفصيلي لأوضاع التصفية →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | يسمح بتجاوز وضع العقدة التي يتم فيها التصفية التي يتم تعيينها عبر المعلمة `mode` مع [custom ruleset][link-lom]:<ul><li>`off` - تجاهل custom ruleset.</li><li>`strict` - فقط يمكن أن تعزز custom ruleset وضع التشغيل.</li><li>`on` - من الممكن تعزيز وتخفيف وضع التشغيل.</li></ul>على سبيل المثال، إذا كانت المعلمة `mode` مضبوطة على قيمة `monitoring` وكانت المعلمة `mode_allow_override` مضبوطة على القيمة `strict`، فإنه سيكون من الممكن حظر بعض الطلبات (`block`) ولكن لا يمكن تعطيل العقدة التي يتم فيها التصفية بالكامل (`off`). | `off`
<a name="application_param"></a>`application` | التعريف الفريد للبرنامج المحمي المراد استخدامه في Wallarm Cloud. يمكن أن تكون القيمة عدد صحيح موجب باستثناء `0`.<br><br>[المزيد من التفاصيل حول إعداد التطبيقات →](../../../user-guides/settings/applications.md) | `-1`
<a name="partner_client_id_param"></a>`partner_client_uuid` | معرف فريد لـ [المستأجر](../../../installation/multi-tenant/overview.md) لوحدة Wallarm [multi-tenant](../../../installation/multi-tenant/deploy-multi-tenant-node.md). يجب ان تكون القيمة سلسلة في تنسيق [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format)، على سبيل المثال: <ul><li> `11111111-1111-1111-1111-111111111111`</li><li>`123e4567-e89b-12d3-a456-426614174000`</li></ul><p>تعرف كيفية:</p><ul><li>[الحصول على UUID للمستأجر أثناء إنشاء المستأجر →](../../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)</li><li>[الحصول على قائمة UUIDs للمستأجرين الحاليين →](../../../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)</li><ul>| -
<a name="process_time_limit"></a>`process_time_limit` | <div class="admonition warning"> <p class="admonition-title">تم تجاهل هذا المعلمة</p> <p>ابتداء من الإصدار 3.6، يوصى بضبط بدقة كشف الهجوم `overlimit_res` باستخدام <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">القاعدة **ضبط من الهجوم overlimit_res**</a>.<br> سيتم إزالة المعلمة `process_time_limit` المؤقتة ولكن ستتم إزالتها في الإصدارات المستقبلية.</p></div>الحد من وقت العملية لطلب واحد (بالميليثانية). إذا لم يتم معالجة الطلب في الكمية المحددة من الوقت، فسيتم تسجيل رسالة خطأ في ملف السجل وسيتم وضع علامة على الطلب كهجوم `overlimit_res`. | `1000`
<a name="process_time_limit_block"></a>`process_time_limit_block` | <div class="admonition warning"> <p class="admonition-title">تم تجاهل هذا المعلمة</p> <p>ابتداء من الإصدار 3.6، يوصى بضبط بدقة كشف الهجوم `overlimit_res` باستخدام <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">القاعدة **ضبط كشف الهجوم overlimit_res**</a>.<br> سيتم إزالة المعلمة `process_time_limit_block` المؤقتة ولكن ستتم إزالتها في الإصدارات المستقبلية.</p></div>الإجراء الذي يتم اتخاذه عندما يتجاوز وقت معالجة الطلب الحد المحدد عبر المعلمة `process_time_limit`:<ul><li>`off` - دائمًا يتم تجاهل الطلبات.</li><li>`on` - دائمًا يتم حظر الطلبات إلا إذا كان `mode: "off"`.</li><li>`attack` - يعتمد على وضع حظر الهجوم الذي يتم ضبطه عبر المعلمة `mode`:<ul><li>`off` - الطلبات لا تتم معالجتها.</li><li>`monitoring` - الطلبات يتم تجاهلها.</li><li>`block` - الطلبات يتم حظرها.</li></ul></li></ul> | `attack`
`wallarm_status` | سواء كان يتم تمكين [خدمة إحصاءات العقدة التي يتم فيها التصفية](../../configure-statistics-service.md). | `false`
`wallarm_status_format` | تنسيق [إحصاءات العقدة التي يتم فيها التصفية](../../configure-statistics-service.md): `json` أو `prometheus`. | `json`
`disable_acl` | يسمح بتعطيل تحليل أصول الطلبات. إذا تم التعطيل (`on`)، لن تقوم العقدة التي يتم فيها التصفية بتنزيل [قوائم الاIP ](../../../user-guides/ip-lists/overview.md) من Wallarm Cloud وستتجاهل تحليل عناوين IP مصدر الطلب. | `off`
`parse_response` | سواء كان يتم تحليل استجابات التطبيق. مطلوب تحليل الاستجابة لاكتشاف الثغرات الأمنية في أثناء [الكشف السلبي](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) و[التحقق من الهددات النشطة](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification).<br><br>القيم الممكنة هي `true` (تم تمكين تحليل الاستجابة) و `false` (تم تعطيل تحليل الاستجابة). | `true`
`unpack_response` | سواء كان يتم فك ضغط البيانات المضغوطة المسترجعة في استجابة التطبيق. القيم الممكنة هي `true` (تم تمكين الفك) و `false` (تم تعطيل الفك). <br><br>هذا المعلم فعال فقط إذا `parse_response true`. | `true`
`parse_html_response` | سواء كان يتم تطبيق محللات HTML على الكود HTML المستلم في استجابة التطبيق. القيم الممكنة هي `true` (تم تطبيق محلل ال HTML) و `false` (لم يتم تطبيق محلل HTML).<br><br>هذا المعلم فعال فقط إذا `parse_response true`. | `true` 
