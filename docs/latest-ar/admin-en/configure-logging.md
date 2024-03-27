[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-monitor-node]:         monitoring/intro.md
[doc-lom]:                  ../user-guides/rules/rules.md#ruleset-lifecycle


#   العمل مع سجلات العقدة التصفية

توجهك هذه المقالة حول كيفية العثور على ملفات السجل لعقدة التصفية Wallarm.

=== "مثبت All-in-one، صورة Docker المستندة إلى NGINX، صور السحابة"
    بالنسبة للتثبيتات عبر [المثبت المتكامل](../installation/nginx/all-in-one.md), [صورة Docker المستندة إلى NGINX](installation-docker-en.md), [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md) و [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md), يتم تواجد ملفات السجل ضمن الدليل `/opt/wallarm/var/log/wallarm`.

    إليك تفصيل لملفات السجل التي ستواجهها والنوع من المعلومات التي يحتوي كل منها:

    *   `brute-detect-out.log`: سجل جلب العدادات ذات الصلة بالهجوم العنيف على العقدة التصفية في العنقود.
    *   `export-attacks-out.log`: سجل تصدير بيانات الهجمات من وحدة postanalytics إلى سحابة Wallarm.
    *   `export-counters-out.log`: سجل تصدير بيانات العدادات (انظر [“مراقبة العقدة التصفية”][doc-monitor-node]).
    *   `export-environment-out.log`: سجل جمع إصدارات الحزمة المثبتة لـ Wallarm وتحميل هذه البيانات إلى سحابة Wallarm ليتم عرضها في تفاصيل العقدة التصفية في وحدة تحكم Wallarm. يتم تشغيل هذه العمليات مرة واحدة في الساعة.
    *   `syncnode-out.log`: سجل مزامنة العقدة التصفية مع سحابة Wallarm (يشمل هذا جلب ملفات [LOM][doc-lom] وproton.db من السحابة).
    *   `tarantool-out.log`: سجل عمليات وحدة postanalytics.
    *   `sync-ip-lists-out.log` (يطلق عليه اسم `sync-blacklist-out.log` في إصدارات العقدة السابقة): سجل مزامنة العقدة التصفية مع عناوين IP المضافة إلى [قوائم الـ IP](../user-guides/ip-lists/overview.md) كأجسام منفردة أو شبكات فرعية.
    *   `sync-ip-lists-source-out.log` (يطلق عليه اسم `sync-mmdb-out.log` في إصدارات العقدة السابقة): سجل مزامنة العقدة التصفية مع عناوين IP المسجلة في البلدان والمناطق ومراكز البيانات من [قوائم الـ IP](../user-guides/ip-lists/overview.md).
    *   `appstructure-out.log` (فقط في حاويات Docker): سجل نشاط وحدة [API Discovery](../api-discovery/overview.md).
    *   `registernode_loop-out.log` (فقط في حاويات Docker): سجل نشاط النص البرمجي للمغلف الذي يشغل النص البرمجي `register-node` طالما أنه ناجح.
    *   `weak-jwt-detect-out.log`: سجل اكتشاف [ثغرة الأمان JWT](../attacks-vulns-list.md#weak-jwt).
    *   `detect-cred-stuffing-out.log`: سجل [كشف الاقتناء البسيط للشهادات التعريفية](../about-wallarm/credential-stuffing.md).
=== "طرق التثبيت الأخرى"
    بالنسبة للتثبيتات باستخدام طرق أخرى، مثل [حزم DEB/RPM](../installation/nginx/dynamic-module.md)، توجد ملفات السجل ضمن الدليل `/var/log/wallarm`.

    إليك تفصيل لملفات السجل التي ستواجهها والنوع من المعلومات التي يحتوي كل منها:

    *   `brute-detect.log`: سجل جلب العدادات ذات الصلة بالهجوم العنيف على العقدة التصفية في العنقود.
    *   `export-attacks.log`: سجل تصدير بيانات الهجمات من وحدة postanalytics إلى سحابة Wallarm.
    *   `export-counters.log`: سجل تصدير بيانات العدادات (انظر [“مراقبة العقدة التصفية”][doc-monitor-node]).
    *   `export-environment.log`: سجل جمع إصدارات الحزمة المثبتة لـ Wallarm وتحميل هذه البيانات إلى سحابة Wallarm ليتم عرضها في تفاصيل العقدة التصفية في وحدة تحكم Wallarm. يتم تشغيل هذه العمليات مرة واحدة في الساعة. 
    *   `syncnode.log`: سجل مزامنة العقدة التصفية مع سحابة Wallarm (يشمل هذا جلب ملفات [LOM][doc-lom] وproton.db من السحابة).
    *   `tarantool.log`: سجل عمليات وحدة postanalytics.
    *   `sync-ip-lists.log` (يطلق عليه اسم `sync-blacklist.log` في إصدارات العقدة السابقة): سجل مزامنة العقدة التصفية مع عناوين IP المضافة إلى [قوائم الـ IP](../user-guides/ip-lists/overview.md) كأجسام منفردة أو شبكات فرعية.
    *   `sync-ip-lists-source.log` (يطلق عليه اسم `sync-mmdb.log` في إصدارات العقدة السابقة): سجل مزامنة العقدة التصفية مع عناوين IP المسجلة في البلدان والمناطق ومراكز البيانات من [قوائم الـ IP](../user-guides/ip-lists/overview.md).
    *   `appstructure.log` (فقط في حاويات Docker): سجل نشاط وحدة [API Discovery](../api-discovery/overview.md).
    *   `registernode_loop.log` (فقط في حاويات Docker): سجل نشاط النص البرمجي للمغلف الذي يشغل النص البرمجي `register-node` طالما أنه ناجح.
    *   `weak-jwt-detect.log`: سجل اكتشاف [ثغرة الأمان JWT](../attacks-vulns-list.md#weak-jwt).


##  تكوين السجل المُطوَّر للعقدة التصفية المستندة إلى NGINX

تقوم NGINX بكتابة سجلات الطلبات التي تمت معالجتها (سجلات الوصول) في ملف سجل منفصل، بالاستخدام `combined` كتنسيق سجل معرف مسبقا.

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

يمكنك تعريف تنسيق سجل خاص واستخدامه عن طريق تضمين متغير واحد أو عدة أحد __[المتغيرات الخاصة بعقدة التصفية](#filter-node-variables)__ (بالإضافة إلى متغيرات NGINX الأخرى إذا لزم الأمر). سيسمح ملف سجل NGINX بتشخيص العقدة التصفية بشكل أسرع.

### متغيرات العقدة التصفية

يمكنك استخدام المتغيرات الخاصة بعقدة التصفية الآتية عند تعريف تنسيق سجل NGINX:

|الاسم|النوع|القيمة|
|---|---|---|
|`request_id`|سلسلة الرموز|مُعرف الطلب<br> يكون له الشكل التالي: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`|عائم|الوقت بالثواني الذي يستغرقه المعالج في الجهاز الذي به العقدة التصفية لمعالجة الطلب.|
|`wallarm_request_mono_time`|عائم|الوقت بالثواني الذي يستغرقه المعالج لمعالجة الطلب + الوقت في الطابور. على سبيل المثال، إذا كان الطلب في الطابور لمدة 3 ثوانٍ وتمت معالجته بواسطة المعالج لمدة ثانية واحدة، فعندها: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|عدد صحيح|حجم الطلب المتسلسل بالبايت|
|`wallarm_is_input_valid`|عدد صحيح|صحة الطلب<br>`0`: الطلب صحيح. تم التحقق من الطلب بواسطة العقدة التصفية وتتوافق مع قواعد LOM.<br>`1`: الطلب غير صحيح. تم التحقق من الطلب بواسطة العقدة التصفية ولا تتوافق مع قواعد LOM.|
| `wallarm_attack_type_list` | سلسلة الرموز | أنواع الهجمات[doc-vuln-list] المكتشفة في الطلب مع المكتبة [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton). تتوفر الأنواع في تنسيق نصي:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>إذا كُشِفْتْ عن عدة أنواع هجمات في الطلب، يتم سردها مع الرمز `|`. على سبيل المثال: إذا تم اكتشاف هجمات XSS و SQLi، تكون قيمة المتغير `xss|sqli`. |
|`wallarm_attack_type`|عدد صحيح|أنواع الهجمات[doc-vuln-list] المكتشفة في الطلب مع المكتبة [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton). تتوفر الأنواع في تنسيق سلسلة بت:<ul><li>`0x00000000`: لا هجوم: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x20000`: mass_assignment: `"131072"`</li><li>`0x80000`: ssrf: `"524288"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>إذا كُشِفْتْ عن عدة أنواع هجمات في الطلب، يتم تلخيص القيم. على سبيل المثال: إذا تم اكتشاف هجمات XSS و SQLi، تكون قيمة المتغير `6`. |

### مثال على الضبط

لنفترض أنك بحاجة لتحديد تنسيق السجل المُطوَّر الذي يحمل الاسم `wallarm_combined` والذي يشمل المتغيرات الآتية:
*   جميع المتغيرات المستخدمة في تنسيق `combined`
*   جميع متغيرات العقدة التصفية

للقيام بذلك، اتبع الإجراءات الآتية:

1.  الأسطر أدناه تصف التنسيق المرغوب للسجل. قم بإضافتها إلى الكتلة `http` في ملف تكوين NGINX.

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list';
    ```

2.  قم بتمكين التنسيق المُطوَّر للسجل عن طريق إضافة المديرية الآتية إلى نفس الكتلة كما في الخطوة الأولى:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    ستتم كتابة سجلات الطلبات التي تمت معالجتها في التنسيق `wallarm_combined` داخل الملف `/var/log/nginx/access.log`.
    
    !!! info "السجل الشرطي"
        مع المديرية المذكورة أعلاه، سيتم تسجيل جميع الطلبات التي تمت معالجتها في ملف السجل، بما في ذلك هؤلاء الذين ليسوا ذات صلة بالهجوم.

        يمكنك تكوين سجل شرطي لكتابة السجلات فقط للطلبات التي هي جزء من هجوم (قيمة المتغير `wallarm_attack_type` ليست صفرا لهذه الطلبات). للقيام بذلك، أضف شرطًا إلى المديرية المذكورة سابقًا: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`

        قد يكون هذا مفيدًا إذا كنت ترغب في تقليل حجم ملف السجل، أو إذا كنت تدمج عقدة التصفية مع واحدة من [حلول SIEM](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1).          
        
3.  قم بإعادة تشغيل NGINX عن طريق تشغيل أحد الأوامر الآتية بحسب نظام التشغيل الذي تستخدمه:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

!!! info "معلومات تفصيلية"
    لرؤية معلومات تفصيلية حول تكوين السجل في NGINX، الرجاء الانتقال إلى هذا [الرابط][link-nginx-logging-docs].