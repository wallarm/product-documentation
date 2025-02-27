[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-lom]:                  ../user-guides/rules/rules.md#ruleset-lifecycle

#   العمل مع سجلات عقدة الفلتر

ترشدك هذه المقالة حول كيفية البحث عن ملفات السجل لعقدة فلتر Wallarm.

=== "المثبت All-in-one ، صورة Docker المستندة إلى NGINX ، صور السحابة"
    بالنسبة للتثبيتات عبر [المثبت All-in-one](../installation/nginx/all-in-one.md), [صورة Docker المستندة إلى NGINX](installation-docker-en.md), [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md) و [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md), يتم توضع ملفات السجل داخل دليل `/opt/wallarm/var/log/wallarm`.

    ها هو تفصيل الملفات السجل التي ستواجهها والنوع من المعلومات التي يحتويها كل منها:

    *   `brute-detect-out.log`: سجل جلب العدادات المتعلقة بالهجوم بالقوة الغاشمة في العقدة الفلتر.
    *   `export-attacks-out.log`: سجل تصدير بيانات الهجمات من الوحدة النمطية postanalytics إلى السحابة Wallarm.
    *   `export-environment-out.log`: سجل جمع إصدارات الحزم Wallarm المثبتة وتحميل هذه البيانات إلى السحابة Wallarm لإظهارها في تفاصيل العقدة الفلتر في وحدة التحكم Wallarm. يتم تشغيل هذه العمليات مرة واحدة في الساعة.
    *   `syncnode-out.log`: سجل مزامنة العقدة الفلتر مع السحابة Wallarm (يتضمن جلب الملفات [LOM][doc-lom] و proton.db من السحابة).
    *   `tarantool-out.log`: سجل عمليات الوحدة النمطية postanalytics.
    *   `sync-ip-lists-out.log` (يُسمى `sync-blacklist-out.log` في الإصدارات السابقة من العقدة): سجل مزامنة العقدة الفلتر مع عناوين IP المضافة إلى [قوائم IP](../user-guides/ip-lists/overview.md) ككائنات فردية أو شبكات فرعية.
    *   `sync-ip-lists-source-out.log` (يُسمى `sync-mmdb-out.log` في الإصدارات السابقة من العقدة): سجل مزامنة العقدة الفلتر مع عناوين IP المسجلة في الدول والمناطق والمراكز البيانات من [قوائم IP](../user-guides/ip-lists/overview.md).
    *   `appstructure-out.log` (في حاويات Docker فقط): سجل نشاط وحدة [اكتشاف API](../api-discovery/overview.md) .
    *   `registernode_loop-out.log` (في حاويات Docker فقط): سجل نشاط البرنامج النصي الغلاف أثناء تشغيل البرنامج النصي `register-node` بينما هو ناجح.
    *   `weak-jwt-detect-out.log`: سجل الكشف عن [الثغرة JWT](../attacks-vulns-list.md#weak-jwt).
    *   `detect-cred-stuffing-out.log`: سجل الكشف عن [credential stuffing](../about-wallarm/credential-stuffing.md).
=== "طرق التثبيت الأخرى"
    عند التثبيت باستخدام طرق أخرى ، مثل [الحزم DEB/RPM](../installation/nginx/dynamic-module.md), يتم توضع ملفات السجل داخل الدليل `/var/log/wallarm`.

    ها هو تفصيل الملفات السجل التي ستواجهها والنوع من المعلومات التي يحتويها كل منها:

    *   `brute-detect.log`: سجل جلب العدادات المتعلقة بالهجوم بالقوة الغاشمة في العقدة الفلتر.
    *   `export-attacks.log`: سجل تصدير بيانات الهجمات من الوحدة النمطية postanalytics إلى السحابة Wallarm.
    *   `export-environment.log`: سجل جمع إصدارات الحزم Wallarm المثبتة وتحميل هذه البيانات إلى السحابة Wallarm لإظهارها في تفاصيل العقدة الفلتر في وحدة التحكم Wallarm. يتم تشغيل هذه العمليات مرة واحدة في الساعة. 
    *   `syncnode.log`: سجل مزامنة العقدة الفلتر مع السحابة Wallarm (يتضمن جلب الملفات [LOM][doc-lom] و proton.db من السحابة).
    *   `tarantool.log`: سجل عمليات الوحدة النمطية postanalytics.
    *   `sync-ip-lists.log` (يُسمى `sync-blacklist.log` في الإصدارات السابقة من العقدة): سجل مزامنة العقدة الفلتر مع عناوين IP المضافة إلى [قوائم IP](../user-guides/ip-lists/overview.md) ككائنات فردية أو شبكات فرعية.
    *   `sync-ip-lists-source.log` (يُسمى `sync-mmdb.log` في الإصدارات السابقة من العقدة): سجل مزامنة العقدة الفلتر مع عناوين IP المسجلة في الدول والمناطق والمراكز البيانات من [قوائم IP](../user-guides/ip-lists/overview.md).
    *   `appstructure.log` (في حاويات Docker فقط): سجل نشاط وحدة [اكتشاف API](../api-discovery/overview.md) .
    *   `registernode_loop.log` (في حاويات Docker فقط): سجل نشاط البرنامج النصي الغلاف أثناء تشغيل البرنامج النصي `register-node` بينما هو ناجح.
    *   `weak-jwt-detect.log`: سجل الكشف عن [الثغرة JWT](../attacks-vulns-list.md#weak-jwt).

##  تكوين التسجيل الممتد للعقدة الفلتر المستندة إلى NGINX

يكتب NGINX سجلات الطلبات المعالجة (سجلات الوصول) في ملف سجل منفصل ، باستخدام تنسيق التسجيل `combined` الذي تم تعريفه مسبقًا بشكل افتراضي.

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

يمكنك تعريف واستخدام تنسيق تسجيل مخصص عن طريق تضمين متغيرات العقدة الفلتر الواحدة أو أكثر (بالإضافة إلى متغيرات NGINX الأخرى إذا لزم الأمر). سيسمح ملف سجل NGINX بتشخيص العقدة الفلتر بشكل أسرع بكثير.

### متغيرات عقدة الفلتر

قد تستخدم المتغيرات المتغيرة التالية لعقدة الفلتر عند تعريف تنسيق التسجيل NGINX:

|الاسم|النوع|القيمة|
|---|---|---|
|`request_id`|String|معرف الطلب <br> يحتوي على النموذج التالي للقيمة: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`|Float|الوقت بالثواني الذي قضاه CPU الجهاز الموجود على العقدة الفلتر في معالجة الطلب.|
|`wallarm_request_mono_time`|Float|الوقت بالثواني الذي قضاه CPU في معالجة الطلب + الوقت في الطابور. على سبيل المثال ، إذا كان الطلب في الطابور لمدة 3 ثوانٍ وتمت معالجته بواسطة CPU لمدة 1 ثانية ، فإن: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|Integer|حجم الطلب المتسلسل بالبايت|
|`wallarm_is_input_valid`|Integer|صالحية الطلب <br>`0`: الطلب صالح. تم التحقق من الطلب بواسطة العقدة الفلتر ويتطابق مع قواعد LOM.<br>`1`: الطلب غير صالح. تم التحقق من الطلب بواسطة العقدة الفلتر ولا يتطابق مع قواعد LOM.|
| `wallarm_attack_type_list` | String | أنواع الهجوم [doc-vuln-list] التي تم اكتشافها في الطلب مع مكتبة [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton). يتم تقديم الأنواع بتنسيق نصي:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>If several attack types are detected in a request, they are listed with the symbol `|`. For example: if XSS and SQLi attacks are detected, the variable value is `xss|sqli`. |
|`wallarm_attack_type`|Integer|[Attack types][doc-vuln-list] detected in the request with the library [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton). Types are presented in bit string format:<ul><li>`0x00000000`: no attack: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x20000`: mass_assignment: `"131072"`</li><li>`0x80000`: ssrf: `"524288"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>If several attack types are detected in a request, the values are summarized. For example: if XSS and SQLi attacks are detected, the variable value is `6`. |

### مثال التكوين

فلنفترض أنك بحاجة إلى تحديد تنسيق التسجيل الممتد المسمى `wallarm_combined` الذي يتضمن المتغيرات التالية:
*   جميع المتغيرات المستخدمة في تنسيق `combined`
*   جميع متغيرات عقدة الفلتر

للقيام بذلك، قم بتنفيذ الإجراءات التالية:

1.  الخطوط أدناه تصف التنسيق المطلوب للتسجيل. أضفها إلى كتلة `http` في ملف تكوين NGINX.

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list';
    ```

2.  قم بتمكين تنسيق التسجيل الممتد بإضافة التوجيه التالي إلى نفس الكتلة كما في الخطوة الأولى:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    ستكتب سجلات الطلبات المعالجة في تنسيق `wallarm_combined` في ملف `/var/log/nginx/access.log`.
    
    !!! info "تسجيل شرطي"
        مع التوجيه المدرج أعلاه ، ستتم تسجيل جميع الطلبات المعالجة في ملف السجل ، بما في ذلك تلك التي ليست ذات صلة بالهجوم.
        
        يمكنك تكوين تسجيل شرطي لتسجيل السجلات فقط للطلبات التي تكون جزءًا من هجوم (قيمة متغير `wallarm_attack_type` ليست صفر لهذه الطلبات). للقيام بذلك ، أضف شرطًا للتوجيه المذكور أعلاه: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        قد يكون هذا مفيدًا إذا كنت ترغب في تقليل حجم ملف السجل ، أو إذا قمت بدمج عقدة فلتر مع واحدة من [حلول SIEM](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1).          
        
3.  قم بإعادة تشغيل NGINX عن طريق تشغيل أحد الأوامر التالية حسب نظام التشغيل الذي تستخدمه:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

!!! info "معلومات مفصلة"
    للاطلاع على معلومات مفصلة حول تكوين التسجيل في NGINX ، انتقل إلى هذا [الرابط][link-nginx-logging-docs].