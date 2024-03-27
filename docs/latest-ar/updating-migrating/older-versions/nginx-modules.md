[wallarm-status-instr]: ../../admin-en/configure-statistics-service.md
[ptrav-attack-docs]: ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]: ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]: ../../admin-en/configure-logging.md
[proxy-balancer-instr]: ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]: ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]: ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]: ../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]: ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]: ../../images/check-users.png 
[img-create-wallarm-node]: ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]: ../../installation/custom/custom-nginx-version.md
[nginx-process-time-limit-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../../user-guides/ip-lists/overview.md
[wallarm-token-types]: ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[sqli-attack-docs]: ../../attacks-vulns-list.md#sql-injection
[xss-attack-docs]: ../../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]: ../../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# ترقية وحدات Wallarm NGINX المنتهية الصلاحية

توصف هذه التعليمات الخطوات لترقية وحدات Wallarm NGINX المنتهية الصلاحية (الإصدار 3.6 وأقل) إلى الإصدار 4.10. وحدات Wallarm NGINX هي الوحدات المثبتة وفقًا لواحدة من التعليمات البرمجية التالية:

* [الحزم الفردية لـ NGINX مستقرة](../../installation/nginx/dynamic-module.md)
* [الحزم الفردية لـ NGINX Plus](../../installation/nginx-plus.md)
* [الحزم الفردية لـ NGINX الموفرة بواسطة التوزيع](../../installation/nginx/dynamic-module-from-distr.md)

--)include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md(--

## أخبر الدعم الفني لـ Wallarm أنك تقوم بترقية العقدة المنتهية الصلاحية

إذا كنت تقوم بترقية وحدات Wallarm NGINX المنتهية الصلاحية (الإصدار 3.6 وأقل) إلى الإصدار 4.10 ، فأخبر الدعم الفني لـ[Wallarm](mailto:support@wallarm.com) بذلك واطلب المساعدة.

بالإضافة إلى أي مساعدة أخرى ، اطلب تفعيل منطق القوائم البيضاء الجديدة لحساب Wallarm الخاص بك. عند تمكين منطق القوائم البيضاء الجديدة ، يرجى فتح واجهة Wallarm والتأكد من أن القسم [** قوائم الأي بي**](../../user-guides/ip-lists/overview.md) متاح.

## طرق الترقية

--)include/waf/installation/upgrade-methods.md(--

## الترقية بواسطة المثبت الشامل

استخدم الإجراء أدناه لترقية وحدات Wallarm NGINX المنتهية الصلاحية (الإصدار 3.6 وأقل) إلى الإصدار 4.10 باستخدام [المثبت الشامل](../../installation/nginx/all-in-one.md).

### متطلبات الترقية باستخدام المثبت الشامل

--)include/waf/installation/all-in-one-upgrade-requirements.md(--

### إجراء الترقية

* إذا تم تثبيت وحدتي التصفية وpostanalytics على نفس الخادم، فاتبع التعليمات أدناه لترقية الكل.

    ستحتاج إلى تشغيل العقدة من الإصدار الأحدث باستخدام المثبت الشامل على جهاز نظيف، واختبر أنه يعمل بشكل جيد وقم بإيقاف العقدة السابقة وتكوين حركة المرور لتتدفق عبر الجهاز الجديد بدلاً من الجهاز السابق.

* إذا تم تثبيت وحدة التصفية ووحدة postanalytics على خوادم مختلفة، فقم **أولاً** بترقية وحدة postanalytics و**بعد ذلك** بوحدة التصفية باتباع هذه [التعليمات](separate-postanalytics.md).

### الخطوة 1: تعطيل وحدة التحقق من التهديدات النشطة (فقط إذا كانت العقدة 2.16 أو أقل)

إذا كنت تقوم بترقية Wallarm العقدة 2.16 أو أقل ، فيرجى تعطيل وحدة [التحقق من التهديدات النشطة](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) في Wallarm Console → **الثغرات الأمنية** → **تكوين**.

يمكن أن يسبب تشغيل الوحدة [إيجابيات مزيفة](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. يقلل تعطيل الوحدة من هذا المخاطر.

### الخطوة 2: إعداد الجهاز النظيف

--)include/waf/installation/all-in-one-clean-machine.md(--

### الخطوة 3: تثبيت NGINX والاعتماديات

--)include/waf/installation/all-in-one-nginx.md(--

### الخطوة 4: إعداد رمز Wallarm

--)include/waf/installation/all-in-one-token.md(--

### الخطوة 5: تحميل مثبت Wallarm الشامل

--)include/waf/installation/all-in-one-installer-download.md(--

### الخطوة 6: تشغيل مثبت Wallarm الشامل

#### وحدة التصفية وpostanalytics على نفس الخادم

--)include/waf/installation/all-in-one-installer-run.md(--

#### وحدة التصفية وpostanalytics على خوادم مختلفة

!!! تحذير "تسلسل الخطوات لترقية وحدات التصفية وpostanalytics"
    إذا تم تثبيت وحدة التصفية وpostanalytics على خوادم مختلفة ، فمن المطلوب ترقية حزم postanalytics قبل تحديث حزم وحدة التصفية.

1. قم بترقية وحدة postanalytics باتباع هذه [التعليمات](separate-postanalytics.md).
1. قم بترقية وحدة التصفية:

    === "رمز الواجهة البرمجية"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh filtering
        ```        

        تعين المتغير `WALLARM_LABELS` المجموعة التي سيتم إضافة العقدة إليها (يُستخدم لتجميع العقد بشكل منطقي في واجهة المستخدم لـ Wallarm Console).

    === "رمز العقدة"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo sh wallarm-4.10.1.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo sh wallarm-4.10.1.aarch64-glibc.sh filtering
        ```

### الخطوة 7: نقل قوائم السماح وقوائم الحظر من الإصدار السابق لـ Wallarm العقدة إلى 4.10 (فقط إذا كانت العقدة 2.18 أو أقل)

إذا كنت تقوم بترقية العقدة 2.18 أو أقل ، [قم بالنقل](../migrate-ip-lists-to-node-3.md) تهيئة قائمة السماح وقائمة الحظر من الإصدار السابق لـ Wallarm node إلى الإصدار الأحدث.

### الخطوة 8: نقل تكوين NGINX وpostanalytics من العقدة القديمة إلى الجديدة

قم بنقل التكوين المتعلق بالعقدة لـ NGINX وتكوين postanalytics من الملفات التكوينية على الجهاز القديم إلى الملفات على الجهاز الجديد. يمكنك القيام بذلك عن طريق نسخ التعليمات البرمجية المطلوبة.

**ملفات المصدر**

على جهاز قديم ، اعتمادًا على نظام التشغيل والإصدار NGINX ، يمكن أن يتم تواجد ملفات التكوين NGINX في مجلدات مختلفة وأن يكون لديها أسماء مختلفة. الأكثر شيوعًا هم الآتي:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة Wallarm. الوصف التفصيلي متاح من خلال [الرابط][wallarm-status-instr]

أيضا ، يتم تواجد إعدادات postanalytics (الإعدادات Tarantool database) عادة هنا:

* `/etc/default/wallarm-tarantool` أو 
* `/etc/sysconfig/wallarm-tarantool`

**ملفات الهدف**

باعتبار المثبت الشامل يعمل مع مجموعات مختلفة من نظام التشغيل وإصدارات NGINX ، قد تكون الملفات [الهدف](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) على جهازك الجديد لها أسماء مختلفة وتقع في مجلدات مختلفة.

عند نقل التكوين ، ستحتاج إلى تنفيذ الخطوات الواردة أدناه.

#### إعادة تسمية توجيهات NGINX المستهلكة

قم بإعادة تسمية توجيهات NGINX التالية إذا تم تحديدها بشكل صريح في ملفات التكوين:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

لقد قمنا فقط بتغيير أسماء التوجيهات ، بينما ظلت منطقتها هي نفسها. سيتم إلغاء تعريف التوجيهات ذات الأسماء السابقة قريبًا ، لذا من الأفضل أن تقوم بإعادة تسميتها قبل ذلك.

#### تحديث متغيرات تسجيل العقدة

في الإصدار الجديد من العقدة ، تم تنفيذ التغييرات التالية على [متغيرات تسجيل العقدة](../../admin-en/configure-logging.md#filter-node-variables):

* تمت إعادة تسمية متغير `wallarm_request_time` إلى `wallarm_request_cpu_time`.

    نحن فقط غيرنا اسم المتغير ، وما زالت منطقته هي نفسها. الاسم القديم مدعوم مؤقتًا أيضًا ، ولكن من الأفضل إعادة تسمية المتغير.
* تمت إضافة متغير `wallarm_request_mono_time` - ضعه في تهيئة التنسيق اللوج إذا كنت بحاجة إلى معلومات تنسيق تتعلق بالوقت الإجمالي الذي يكون مجموع:

    * الوقت في قائمة الانتظار
    * الوقت بالثواني التي أمضاها المعالج في معالجة الطلب

#### ضبط إعدادات وضع تصفية العقدة Wallarm على التغييرات التي تم إصدارها في الإصدارات الأخيرة

1. تأكد من أن السلوك المتوقع للإعدادات المدرجة أدناه يتوافق مع [منطق التغيير في أوضاع `off` و `monitoring` للتصفية](what-is-new.md#filtration-modes):
      * [توجيه `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [القاعدة العامة للتصفية التي تم تكوينها في Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [قواعد التصفية الموجهة نحو النقاط الطرفية المكونة في Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
2. إذا كان السلوك المتوقع لا يتوافق مع منطق الوضع التغييري ، فيرجى ضبط إعدادات وضع التصفية للتغييرات المطلقة باستخدام [التعليمات](../../admin-en/configure-wallarm-mode.md).

#### نقل تكوين الكشف عن الهجوم `overlimit_res` من التوجيهات إلى القاعدة

--)include/waf/upgrade/migrate-to-overlimit-rule-nginx.md(--

#### تحديث محتوى ملف `wallarm-status.conf`

قم بتحديث محتوى `/etc/nginx/conf.d/wallarm-status.conf` على النحو التالي:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # الوصول متاح فقط لعناوين العقدة المحلية
  deny all;

  wallarm_mode off;
  disable_acl "on";   # تم تعطيل التحقق من مصادر الطلب ، يُسمح للعناوين المستبعدة بالطلب على خدمة wallarm-status. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[المزيد من التفاصيل حول تهيئة الخدمة الإحصائية](../../admin-en/configure-statistics-service.md)

### الخطوة 9: حدث منفذ API

--)include/waf/upgrade/api-port-443.md(--

### الخطوة 10: أعد تمكين وحدة التحقق من التهديدات النشطة (فقط إذا كانت العقدة 2.16 أو أقل)

تعرف على [التوصية بخصوص إعداد وحدة التحقق من التهديدات النشطة](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) وأعد تمكينها إذا كان ذلك مطلوبًا.

بعد فترة من الوقت ، تأكد من أن تشغيل الوحدة لا يسبب إيجابيات مزيفة. إذا اكتشفت إيجابيات مزيفة ، فيرجى الاتصال بـ [الدعم الفني لـ Wallarm](mailto:support@wallarm.com).

### الخطوة 11: إعادة تشغيل NGINX

--)include/waf/installation/restart-nginx-systemctl.md(--

### الخطوة 12: اختبر عملية Wallarm node

لاختبار عملية العقدة الجديدة:

1. أرسل طلبًا بـ SQLI [اختبار] [sqli-attack-docs] و [XSS] [xss-attack-docs] هجمات على عنوان المورد المحمي:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. افتح واجهة Wallarm Console → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من أن الهجمات تظهر في القائمة.
1. بمجرد أن يتم مزامنة بيانات السحابة المخزنة الخاصة بك (القواعد ، قوائم IP) مع العقدة الجديدة ، قم ببعض الهجمات الاختبارية للتأكد من أن قواعدك تعمل كما هو متوقع.

### الخطوة 13: التكوين لإرسال الحركة إلى Wallarm node

اعتمادًا على النهج التوزيعي المستخدم ، قم بتنفيذ التعديلات التالية:

=== "في الخط"
    قم بتحديث أهداف موزع الحمل الخاص بك لإرسال حركة المرور إلى Wallarm. لمزيد من التفاصيل ، يُرجى الرجوع إلى وثائق موزع الحمل الخاص بك.

    قبل إعادة توجيه الحركة بالكامل إلى العقدة الجديدة ، يُوصى أولاً بإعادة توجيهها جزئياً والتحقق من أن العقدة الجديدة تتصرف على النحو المتوقع.

=== "خارج النطاق"
    قم بتكوين خادم الويب أو البروكسي (على سبيل المثال ، NGINX ، Envoy) لتطابق حركة المرور الواردة إلى Wallarm. للحصول على تفاصيل التكوين ، نوصي بالرجوع إلى الوثائق الخاصة بخادم الويب أو البروكسي.

    داخل [الرابط][web-server-mirroring-examples] ، ستجد تكوينًا نموذجيًا لأشهر خوادم الويب والبروكسي (NGINX ، Traefik ، Envoy).

### الخطوة 14: إزالة العقدة القديمة

1. حذف العقدة القديمة في Wallarm Console → **العقد** بتحديد العقدة والنقر على **حذف**.
1. تأكيد العملية.
    
    عند حذف العقدة من السحابة ، سوف تتوقف عن تصفية الطلبات على تطبيقاتك. حذف العقدة التصفية لا يمكن التراجع عنه. ستتم إزالة العقدة من قائمة العقد بشكل دائم.

1. قم بحذف الجهاز مع العقدة القديمة أو مجرد تنظيفه من مكوّنات Wallarm node:

    === "ديبيان"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "أوبونتو"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x والأقل"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## الترقية اليدوية

### متطلبات الترقية اليدوية

--)include/waf/installation/basic-reqs-for-upgrades.md(--

### الإجراء الترقية

* إذا تم تثبيت وحدتي التصفية وpostanalytics على نفس الخادم ، فاتبع التعليمات أدناه لترقية جميع الحزم.
* إذا تم تثبيت وحدة التصفية ووحدة postanalytics على خوادم مختلفة ، **أولاً** قم بترقية وحدة postanalytics باتباع هذه [التعليمات](separate-postanalytics.md) و بعد ذلك قم باتباع الخطوات أدناه لعمليات التصفية.

### الخطوة 1: تعطيل وحدة التحقق من التهديدات النشطة (فقط إذا كانت العقدة 2.16 أو أقل)

إذا كنت تقوم بترقية Wallarm العقدة 2.16 أو أقل ، يرجى تعطيل وحدة [التحقق من التهديدات النشطة](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) في Wallarm Console → **الثغرات الأمنية** → **تكوين**.

يمكن أن يسبب تشغيل الوحدة [إيجابيات مزيفة](../../about-wallarm/protecting-against-attacks.md#false-positives) أثناء عملية الترقية. يقلل تعطيل الوحدة من هذا المخاطر.

### الخطوة 2: تحديث منفذ API

--)include/waf/upgrade/api-port-443.md(--

### الخطوة 3: ترقية NGINX إلى الإصدار الأحدث

قم بترقية NGINX إلى الإصدار الأحدث باستخدام التعليمات ذات الصلة:

=== "NGINX مستقرة"

    توزيعات DEB:

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    توزيعات RPM:

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
    بالنسبة لـ NGINX Plus، يرجى اتباع [التعليمات التحديث الرسمية](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus).
=== "NGINX من مستودع Debian/CentOS"
    بالنسبة لـ NGINX [المثبت من مستودع Debian/CentOS](../../installation/nginx/dynamic-module-from-distr.md)، يرجى تخطي هذه الخطوة. سيتم ترقية الإصدار NGINX المثبت [للخطوة المقبلة](#step-7-upgrade-wallarm-packages) مع وحدات Wallarm.

إذا كانت بنيتك بحاجة إلى استخدام إصدار معين من NGINX ، فيرجى الاتصال بـ[الدعم التقني لـ Wallarm](mailto:support@wallarm.com) لبناء الوحدة Wallarm لإصدار مخصص من NGINX.

### الخطوة 4: إضافة مستودع Wallarm الجديد

قم بحذف عنوان مستودع Wallarm السابق وأضف مستودعًا مع حزمة الإصدار الجديد Wallarm node. يرجى استخدام الأوامر للمنصة المناسبة.

**CentOS و Amazon Linux 2.0.2021x والأقل**

=== "CentOS 7 و Amazon Linux 2.0.2021x والأقل"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! تحذير "تم التوقف عن دعم CentOS 8.x"
        تم التوقف عن دعم CentOS 8.x [تم إيقافه](https://www.centos.org/centos-linux-eol/) . يمكنك تثبيت العقدة Wallarm على نظام تشغيل AlmaLinux ، Rocky Linux ، Oracle Linux 8.x ، أو RHEL 8.x بدلاً من ذلك.

        * [تعليمات التثبيت لـ NGINX `stable`](../../installation/nginx/dynamic-module.md)
        * [تعليمات التثبيت لـ NGINX من مستودعات CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md)
        * [تعليمات التثبيت لـ NGINX Plus](../../installation/nginx-plus.md)
=== "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

**Debian و Ubuntu**

1. افتح الملف الذي يحتوي على عنوان مستودع Wallarm في المحرر النصي المثبت. في هذه التعليمات ، يتم استخدام **vim**.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. ضع تعليقًا على عنوان المستودع السابق أو احذفه.
3. أضف عنوان المستودع الجديد:

    === "Debian 10.x (buster)"
        !!! تحذير "موقوف من قبل NGINX مستقر و NGINX Plus"
            لا يمكن تثبيت الإصدارات الرسمية لـ NGINX (مستقرة و Plus) وبالتالي لا يمكن تثبيت العقدة Wallarm 4.4 وما فوق على Debian 10.x (buster). يُرجى استخدام هذا النظام أصلًا إذا كان [يتم تثبيت NGINX من مستودعات Debian/CentOS](../../installation/nginx/dynamic-module-from-distr.md).

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/
        ```

### الخطوة 5: نقل قوائم السماح وقوائم الحظر من الإصدار السابق لـ Wallarm العقدة إلى 4.8 (فقط إذا كانت العقدة 2.18 أو أقل)

إذا كنت تقوم بترقية العقدة 2.18 أو أقل ، [قم بالنقل](../migrate-ip-lists-to-node-3.md) تهيئة قائمة السماح وقائمة الحظر من الإصدار السابق لـ Wallarm node إلى الإصدار الأحدث.

### الخطوة 6: ترقية حزم Wallarm

#### وحدة التصفية وpostanalytics على نفس الخادم

قم بتنفيذ الأمر التالي لترقية وحدة التصفية ووحدات postanalytics:

=== "ديبيان"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --)include/waf/upgrade/warning-expired-gpg-keys-4.8.md(--

    --)include/waf/upgrade/details-about-dist-upgrade.md(--
=== "أوبونتو"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --)include/waf/upgrade/warning-expired-gpg-keys-4.8.md(--

    --)include/waf/upgrade/details-about-dist-upgrade.md(--
=== "CentOS or Amazon Linux 2.0.2021x والأقل"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum update
    ```

#### وحدة التصفية وpostanalytics على خوادم مختلفة

!!! تحذير "تسلسل الخطوات لترقية وحدات التصفية وpostanalytics"
    إذا تم تثبيت وحدة التصفية وpostanalytics على خوادم مختلفة، فيجب أن تقوم بترقية حزم postanalytics قبل تحديث حزم وحدة التصفية.

1. قم بترقية وحدة postanalytics باتباع هذه [التعليمات](separate-postanalytics.md).
2. قم بتحديث وحدة التصفية:

    === "ديبيان"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --)include/waf/upgrade/warning-expired-gpg-keys-4.8.md(--

        --)include/waf/upgrade/details-about-dist-upgrade.md(--
    === "أوبونتو"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --)include/waf/upgrade/warning-expired-gpg-keys-4.8.md(--

        --)include/waf/upgrade/details-about-dist-upgrade.md(--
    === "CentOS or Amazon Linux 2.0.2021x والأقل"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```

3. إذا طلب منك مدير الحزم تأكيد كتابة محتوى ملف التكوين `/etc/cron.d/wallarm-node-nginx`:

    1. تأكد من أن [نقل قوائم IP](#step-6-migrate-allowlists-and-denylists-from-previous-wallarm-node-version-to-42) قد اكتمل.
    2. أكد أن يتم كتابة الملف بتوجيه `Y`.

        سيطلب منك مدير الحزم تأكيد الكتابة إذا تم [تغيير ملف `/etc/cron.d/wallarm-node-nginx` في الإصدارات السابقة من Wallarm node](/2.18/admin-en/configure-ip-blocking-nginx-en/). منذ أن تغيرت منطق القوائم البيضاء في العقدة Wallarm 3.x، تم تحديث محتوى ملف `/etc/cron.d/wallarm-node-nginx` بالتوازي. لكي تعمل قائمة العناوين المستبعدة بشكل صحيح، يجب أن تستخدم العقدة Wallarm 3.x الملف التكويني المحدث.

        بشكل افتراضي، يستخدم مدير الحزم خيار `N` ولكن يتطلب وجود خيار `Y` لتشغيل قائمة العناوين المستبعدة بشكل صحيح في العقدة Wallarm 3.x.

### الخطوة 7: تحديث نوع العقدة

تحتوي العقدة المنشأة على نوع **منتظم** الذي تم [استبداله الآن بنوع **Wallarm node** الجديد](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

هناك توصية بتثبيت نوع العقدة الجديد بدلاً من القديمة أثناء الانتقال إلى الإصدار 4.8. سيتم إزالة نوع العقدة المنتظمة في الإصدارات المستقبلية، يُرجى الانتقال قبل ذلك.

!!! معلومات "إذا تم تثبيت وحدة postanalytics على خادم مستقل"
    إذا تم تثبيت وحدات المعالجة الأولية للحركة وpostanalytics على خوادم مختلفة، فيُوصى بتوصيل هذه الوحدات إلى السحابة Wallarm باستخدام نفس رمز العقدة. سوف تعرض واجهة المستخدم Wallarm Console كل وحدة كمثيل عقدة مستقل، على سبيل المثال:

    ![عقدة مع عدة مثيلات](../../images/user-guides/nodes/wallarm-node-with-two-instances.png)

    تم إنشاء العقدة Wallarm بالفعل أثناء [ترقية وحدة postanalytics المستقلة](separate-postanalytics.md). لتوصيل وحدة المعالجة الأولية للحركة إلى السحابة باستخدام نفس بيانات الاعتماد الخاصة بالعقدة:

    1. انسخ رمز العقدة الذي تم إنشاؤه أثناء ترقية وحدة postanalytics المستقلة.
    1. انتقل إلى الخطوة الرابعة في القائمة أدناه.

لاستبدال العقدة المنتظمة بالعقدة Wallarm:

1. افتح Wallarm Console → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وأنشئ العقدة من نوع **Wallarm node**.

    ![إنشاء Wallarm node][img-create-wallarm-node]
1. انسخ الرمز الذي تم توليده.
1. قم بإيقاف تشغيل الخدمة NGINX على الخادم الذي يحتوي على العقدة من الإصدار القديم:

    === "ديبيان"
        ```bash
        sudo systemctl stop nginx
        ```
    === "أوبونتو"
        ```bash
        sudo service nginx stop
        ```
    === "CentOS or Amazon Linux 2.0.2021x والأقل"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl stop nginx
        ```

    تتمتع خدمة وقف NGINX بتقليل خطر حساب RPS بشكل غير صحيح.
1. قم بتنفيذ البرنامج النصي `register-node` لتشغيل ** Wallarm node **:

    === "سحابة الولايات المتحدة"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force
        ```
    === "سحابة الاتحاد الأوروبي"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force
        ```
    
    * ` <TOKEN> ` هو القيمة التي تم نسخها لرمز العقدة أو رمز API مع الدور ` Deploy `.
    * تُجبر الخيار ` --force ` على إعادة كتابة بيانات الوصول إلى السحابة المُحددة في الملف ` /etc/wallarm/node.yaml `.

### الخطوة 8: حدث صفحة Wallarm blocking

في الإصدار الجديد من العقدة، تم [تغيير](what-is-new.md#new-blocking-page) صفحة Wallarm blocking العينة. الشعار والبريد الإلكتروني للدعم في الصفحة فارغتين الآن بشكل افتراضي.

إذا كانت الصفحة `&/usr/share/nginx/html/wallarm_blocked.html` قد تم تهيئتها لتعود في استجابة الطلبات المحظورة ، قم بنسخة وتخصيص نسخة جديدة من [الصفحة العينة](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

### الخطوة 9: إعداد NGINX

--)include/waf/upgrade/api-port-443.md(--

### الخطوة 10: أعد تمكين وحدة التحقق من التهديدات النشطة (فقط إذا كانت العقدة 2.16 أو أقل)

تعرف على [التوصية بشأن إعداد وحدة التحقق من التهديدات النشطة](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) وأعد تمكينها إذا كان ذلك مطلوبًا.

بعد فترة من الوقت ، تأكد من أن تشغيل الوحدة لا يسبب إيجابيات مزيفة. إذا اكتشفت إيجابيات مزيفة ، يرجى الاتصال بـ [الدعم الفني لـ Wallarm](mailto:support@wallarm.com).

### الخطوة 11: إعادة تشغيل NGINX

--)include/waf/installation/restart-nginx-systemctl.md(--

### الخطوة 12: اختبر عملية Wallarm node

لاختبار عملية العقدة الجديدة:

1. أرسل طلبًا بـ SQLI [اختبار] [sqli-attack-docs] و [XSS] [xss-attack-docs] هجمات على عنوان المورد المحمي:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. افتح Wallarm Console → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من أن الهجمات تظهر في القائمة.
1. بمجرد أن يتم مزامنة بيانات السحابة المخزنة الخاصة بك (القواعد، قوائم IP) مع العقدة الجديدة، قدم بعض اختبارات الهجمات للتأكد من أن قواعدك تعمل كما هو متوقع.

### Step 13 Configure sending traffic to Wallarm node

اعتمادًا على النهج التوزيعي المستخدم ، قم بتنفيذ التعديلات التالية:

=== "في الخط"
    قم بتحديث أهداف موزع الحمل الخاص بك لإرسال حركة المرور إلى Wallarm. لمزيد من التفاصيل ، يُرجى الرجوع إلى وثائق موزع الحمل الخاص بك.

    قبل إعادة توجيه الحركة بالكامل إلى العقدة الجديدة ، يُوصى أولاً بإعادة توجيهها جزئياً والتحقق من أن العقدة الجديدة تتصرف على النحو المتوقع.

=== "خارج النطاق"
    قم بتكوين خادم الويب أو البروكسي (على سبيل المثال ، NGINX ، Envoy) لتطابق حركة المرور الواردة إلى العقدة Wallarm. للحصول على تفاصيل التكوين ، نوصي بالرجوع إلى الوثائق الخاصة بخادم الويب أو البروكسي.

    داخل [الرابط][web-server-mirroring-examples] ، ستجد تكوينًا نموذجيًا لأشهر خوادم الويب والبروكسي (NGINX ، Traefik ، Envoy).

### الخطوة 14: إزالة العقدة القديمة

1. حذف العقدة القديمة في Wallarm Console → **العقد** بتحديد العقدة والنقر على **حذف**.
1. تأكيد العملية.

    عند حذف العقدة من السحابة ، سوف تتوقف عن تصفية الطلبات على تطبيقاتك. حذف العقدة التصفية لا يمكن التراجع عنه. ستتم إزالة العقدة من قائمة العقد بشكل دائم.

1. قم بحذف الجهاز مع العقدة القديمة أو مجرد تنظيفه من مكوّنات Wallarm node:

    === "ديبيان"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "أوبونتو"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x والأقل"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## التعديلات المخصصة

تم تحديث وحدات Wallarm إلى الإصدار 4.8. سيتم تطبيق إعدادات العقدة السابقة على الإصدار الجديد تلقائيًا. للقيام بإعدادات إضافية ، استخدم [التوجيهات المتاحة](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"