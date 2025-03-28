#[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
#[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
#[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
#[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
#[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
#[logging-instr]:                    ../admin-en/configure-logging.md
#[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
#[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
#[configure-selinux-instr]:          ../admin-en/configure-selinux.md
#[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
#[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
#[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
#[img-wl-console-users]:             ../images/check-users.png 
#[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
#[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
#[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
#[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
#[graylist-docs]:                     ../user-guides/ip-lists/overview.md
#[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
#[oob-docs]:                         ../installation//oob/overview.md
#[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
#[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
#[web-server-mirroring-examples]:    ../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md

# ترقية وحدات Wallarm NGINX

تصف هذه التعليمات الخطوات لترقية وحدات Wallarm NGINX 4.x المثبتة من الحزم الفردية إلى الإصدار 4.10. هذه هي الوحدات المثبتة وفقًا لواحدة من التعليمات التالية:

* [حزم فردية لـ NGINX مستقر](../installation/nginx/dynamic-module.md)
* [حزم فردية لـ NGINX Plus](../installation/nginx-plus.md)
* [حزم فردية لـ NGINX المقدمة من التوزيعة](../installation/nginx/dynamic-module-from-distr.md)

لترقية النود القديم (3.6 أو أقل)، يرجى استخدام [التعليمات المختلفة](older-versions/nginx-modules.md).

## طرق الترقية

--8<-- "../include/waf/installation/upgrade-methods.md"

## الترقية باستخدام المثبت الشامل

استخدم الإجراء أدناه لترقية وحدات Wallarm NGINX 4.x إلى الإصدار 4.10 باستخدام [المثبت الشامل](../installation/nginx/all-in-one.md).

### متطلبات الترقية باستخدام المثبت الشامل

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### إجراء الترقية

* إذا تم تثبيت وحدات النود التصيفية و postanalytics على نفس الخادم، فاتبع الإرشادات أدناه لترقية الكل.

    ستحتاج إلى تشغيل نود من الإصدار الأحدث باستخدام المثبت الشامل على جهاز نظيف، اختبر أنه يعمل بشكل جيد وأوقف الأول وقم بتهيئة حركة المرور لتمر عبر الجهاز الجديد بدلاً من الجهاز السابق.

* إذا تم تثبيت وحدات النود التصيفية و postanalytics على خوادم مختلفة، **قم أولا** بترقية وحدة postanalytics و **بعد ذلك** وحدة التصفية باستخدام هذه [الإرشادات](../updating-migrating/separate-postanalytics.md).

### الخطوة 1: إعداد الجهاز النظيف

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### الخطوة 2: تثبيت NGINX والتبعيات

--8<-- "../include/waf/installation/all-in-one-nginx.md"

### الخطوة 3: تحضير الرمز الشريطي لـ Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

### الخطوة 4: تنزيل المثبت الشامل لـ Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 5: تشغيل المثبت الشامل لـ Wallarm

#### وحدة التصنيف (Filtering node) وpostanalytics على نفس الخادم

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

#### وحدة التصنيف (Filtering node) وpostanalytics على خوادم مختلفة

!!! warning "تسلسل الخطوات لترقية وحدات التصنيف وpostanalytics"
    إذا تم تثبيت وحدات التصنيف وpostanalytics على خوادم مختلفة، فيجب عليك ترقية حزم postanalytics قبل تحديث حزم التصنيف.

1. قم بترقية وحدة postanalytics باتباع هذه [الإرشادات](separate-postanalytics.md).
1. ترقية وحدة التصنيف (Filtering node):

    === "API token"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo env WALLARM_LABELS='group=<المجموعة>' sh wallarm-4.10.2.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo env WALLARM_LABELS='group=<المجموعة>' sh wallarm-4.10.2.aarch64-glibc.sh filtering
        ```        

        تضبط النسق `WALLARM_LABELS` للمجموعة التي ستضاف إليها النود (تعتمد لتجميع النود منطقياً في واجهة المستخدم لـ Wallarm Console).

    === "Node التوكن"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo sh wallarm-4.10.2.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo sh wallarm-4.10.2.aarch64-glibc.sh filtering
        ```

### الخطوة 6: نقل تكوين NGINX و postanalytics من محترف النود القديم إلى الجديد

قم بنقل تكوين النود المتعلق بـ NGINX و postanalytics من الملفات التكوينية على الجهاز القديم إلى الملفات على الجهاز الجديد. يمكنك أن تفعل ذلك بنسخ التوجيهات المطلوبة.

**ملفات المصدر**

على الجهاز القديم، حسب نظام التشغيل وإصدار NGINX، قد تكون ملفات التكوين NGINX موجودة في دلائل مختلفة ولها أسماء مختلفة. الأكثر شيوعا هي:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة نود Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]

وعادةً ما يكون تكوين وحدة postanalytics (إعدادات قاعدة البيانات Tarantool) موجودًا هنا:

* `/etc/default/wallarm-tarantool` أو
* `/etc/sysconfig/wallarm-tarantool`

**ملفات الهدف**

بما أن المثبت الشامل يعمل مع مجموعات مختلفة من نظام التشغيل و إصدارات NGINX، قد يكون على جهاز الجديد لديك [ملفات الهدف](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) لها أسماء مختلفة وتقع في دلائل مختلفة.

### الخطوة 7: إعادة تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

### الخطوة 8: اختبار تشغيل نود Wallarm

لاختبار تشغيل النود الجديد:

1. أرسل الطلب مع اختبار [SQLI][sqli-attack-docs] و [XSS][xss-attack-docs] هجمات إلى عنوان المورد المحمي:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. افتح واجهة Wallarm Console → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من أن الهجمات تظهر في القائمة.
1. بمجرد مزامنة بيانات السحابة المخزنة الخاصة بك (القواعد، قوائم IP) إلى النود الجديد، قم بإجراء بعض الهجمات الاختبارية للتأكد من أن قواعدك تعمل كما هو متوقع.

### الخطوة 9: تكوين إرسال حركة المرور إلى نود Wallarm

اعتمادًا على النهج الذي تم تنفيذه للتشغيل، قم بتنفيذ الإعدادات التالية:

=== "انتشاء"
    تحديث أهداف التوازن الخاصة بك لإرسال الحركة إلى عينة Wallarm. للتفاصيل، يرجى الرجوع إلى وثائق التوازن الخاصة بك.

    قبل إعادة توجيه الحركة بشكل كامل إلى النود الجديد، يوصى أولا بإعادة توجيهها جزئيا والتحقق من أن النود الجديد يتصرف وفقًا للتوقعات.

=== "Out-of-Band"
    قم بتكوين خادم الويب أو الخادم الوكيل (مثل NGINX، Envoy) لمرآة حركة المرور الواردة إلى نود Wallarm. قم بالرجوع إلى وثائق خادم الويب أو خادم الوكيل للحصول على تفاصيل التكوين.

    داخل [الرابط][web-server-mirroring-examples]، ستجد تكوين النموذج لأكثر خوادم الويب وأجهزة توجيه الوكيل شهرة (NGINX, Traefik, Envoy).

### الخطوة 10: حذف النود القديم

1. حذف النود القديم في Wallarm Console → **Nodes** بتحديد نود الخاص بك والنقر على **Delete**.
1. تأكيد الإجراء.
    
    عند حذف النود من السحابة، سوف يتوقف عن ترشيح الطلبات إلى التطبيقات الخاصة بك. لا يمكن التراجع عن حذف النود التصفية. سيتم حذف النود من قائمة النود نهائيًا.

1. حذف الجهاز مع النود القديم أو فقط تنظيفه من مكونات نود Wallarm:

    === "ديبيان"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "أوبونتو"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "سنتْ أو أمازون لينكس 2.0.2021x وأقل"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "روكي لينكس أو أوراكل لينكس 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## الترقية اليدوية

استخدم الإجراء أدناه لترقية وحدات Wallarm NGINX 4.x إلى الإصدار 4.8 يدويًا.

!!! info "الدعم لـ 4.10"
    لم يتم تحديث حزم الـ DEB/RPM لتثبيت النود اليدوي إلى الإطلاق 4.10 بعد

### متطلبات الترقية اليدوية

--8<-- "../include-ar/waf/installation/basic-reqs-for-upgrades.md"

### إجراء الترقية

* إذا تم تثبيت وحدات النود التصيفية و postanalytics على نفس الخادم، فاتبع الإرشادات أدناه لترقية الحزم الكل.
* إذا تم تثبيت وحدات النود التصيفية و postanalytics على خوادم مختلفة، **قم أولا** بترقية وحدة postanalytics باتباع هذه [الإرشادات](separate-postanalytics.md) ثم تنفيذ الخطوات أدناه لوحدات النود التصيفية.

### الخطوة 1: ترقية NGINX إلى الإصدار الأخير

ترقية NGINX إلى الإصدار الأخير باستخدام التعليمات ذات الصلة:

=== "NGINX مستقر"

    التوزيعات القائمة على DEB:

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    التوزيعات القائمة على RPM:

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
بالنسبة لـ NGINX Plus، يرجى اتباع [التعليمات الرسمية ](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus).
=== "NGINX من المستودعاتDebian/CentOS"
بالنسبة لـ NGINX [مثبتة من مستودعات Debian/CentOS](../installation/nginx/dynamic-module-from-distr.md)، يرجى تخطي هذه الخطوة. سيتم ترقية الإصدار الحالي لـ NGINX [في وقت لاحق](#step-4-upgrade-wallarm-packages) جنبا إلى جنب مع وحدات Wallarm.

إذا كانت بنيتك تحتاج إلى استخدام إصدار محدد من NGINX، يرجى الاتصال بـ [دعم فنيWallarm](mailto:support@wallarm.com) لبناء وحدة Wallarm لإصدار مخصص من NGINX.

### الخطوة 2: أضف مستودع Wallarm الجديد

حذف عنوان مستودع Wallarm السابق وأضف مستودعًا مع حزمة نسخة النود Wallarm الجديدة. يرجى استخدام الأوامر المناسبة للمنصة الخاصة بك

**CentOS و Amazon Linux 2.0.2021x وأقل**

=== "سنتْ OS 7 وأمازون لينكس 2.0.2021x وأقل"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "ألمالينكس، روكي لينكس أو أوراكل لينكس 8.x"
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

**ديبيان وأوبونتو**

1. افتح الملف المحتوي على عنوان مستودع Wallarm  في المحرر النصي المثبت. في هذه التعليمات، يتم استخدام **vim**.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. اعتبرها غير فعالة أو حذف عنوان المستودع السابق.
3. أضف عنوان المستودع الجديد:

    === "ديبيان 10.x (Buster)"
        !!! warning "غير مدعومة من قبل NGINX مستقر و NGINX Plus"
            الإصدارات الرسمية لـ NGINX (مستقرة و Plus) و، على النتيجة، لا يمكن تثبيت النود الخاصة بـ Wallarm 4.4 وما فوق على ديبيان 10.x (Buster). يرجى استخدام هذا نظام التشغيل فقط إذا كان [NGINX يتم تثبيته من مستودعات Debian/CentOS](../installation/nginx/dynamic-module-from-distr.md).

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/
        ```
    === "ديبيان 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/
        ```
    === "أوبونتو 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/
        ```
    === "أوبونتو 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/
        ```

### الخطوة 3: ترقية حزم Wallarm

#### وحدة التصنيف (Filtering node) وpostanalytics على نفس الخادم

1. نفذ الأمر التالي لترقية وحدات وحدة التصنيف وpostanalytics:

    === "ديبيان"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "أوبونتو"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "سنتْ OS أو أمازون لينكس 2.0.2021x وأقل"
        ```bash
        sudo yum update
        ```
    === "ألمالينكس، روكي لينكس أو أوراكل لينكس 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```

2. إذا طلب مدير الحزم تأكيد لإعادة كتابة محتوى ملف التكوين `/etc/cron.d/wallarm-node-nginx`، أرسل الخيار `Y`.

    يجب تحديث محتوى `/etc/cron.d/wallarm-node-nginx` لتنزيل البرنامج النصي الجديد الذي يعد RPS.

    افتراضيًا، يستخدم مدير الحزم الخيار `N` ولكن هناك حاجة للخيار `Y` لحساب RPS بشكل صحيح.

#### وحدة التصنيف (Filtering node) وpostanalytics على خوادم مختلفة

!!! warning "تسلسل الخطوات لترقية وحدات التصنيف وpostanalytics"
    إذا تم تثبيت وحدات التصنيف وpostanalytics على خوادم مختلفة، فيجب ترقية حزم postanalytics قبل تحديث حزم وحدة التصنيف.

1. قم بترقية حزم postanalytics باتباع هذه [الإرشادات](separate-postanalytics.md).
2. قم بترقية حزم نود Wallarm:

    === "ديبيان"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "أوبونتو"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "سنتْ OS أو أمازون لينكس 2.0.2021x وأقل"
        ```bash
        sudo yum update
        ```
    === "ألمالينكس، روكي لينكس أو أوراكل لينكس 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```
3. إذا طلب مدير الحزم تأكيد لإعادة كتابة محتوى ملف التكوين `/etc/cron.d/wallarm-node-nginx`، أرسل الخيار `Y`.

    يجب تحديث محتوى `/etc/cron.d/wallarm-node-nginx` لتنزيل البرنامج النصي الجديد الذي يعد RPS.

    افتراضيًا، يستخدم مدير الحزم الخيار `N` ولكن هناك حاجة للخيار `Y` لحساب RPS بشكل صحيح.

### الخطوة 4: تحديث نوع النود

!!! info "فقط للعقد المثبتة باستخدام النصي 'addnode'"
    فقط قم باتباع هذه الخطوة إذا كانت نود الإصدار السابق متصلة بـ Wallarm Cloud باستخدام نصي 'addnode'. تم [إزالة](what-is-new.md#removal-of-the-email-password-based-node-registration) هذا النص واستبدل بـ 'register-node'، الذي يحتاج إلى رمز لتسجيل النود في السحابة.

1. تأكد من أن حساب Wallarm الخاص بك لديه دور **المشرف** بالانتقال إلى قائمة المستخدمين في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/users) أو [السحابة الأوروبية](https://my.wallarm.com/settings/users).

    ![قائمة المستخدمين في واجهة Wallarm console][img-wl-console-users]
1. افتح واجهة Wallarm Console → **Nodes** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وأنشئ نود من النوع **Wallarm node**.

    ![إنشاء Wallarm node][img-create-wallarm-node]

    !!! info "إذا تم تثبيت وحدة postanalytics على خادم مستقل"
        إذا تم تثبيت وحدات معالجة حركة المرور الأولية وpostanalytics على خوادم مستقلة، يوصى بتوصيل هذه الوحدات بـ Wallarm Cloud باستخدام نفس رمز النود. ستعرض واجهة المستخدم لـ Wallarm Console كل وحدة بوصفها نموذج نود مستقل، مثال على ذلك:

        ![Node مع عدة نماذج](../images/user-guides/nodes/wallarm-node-with-two-instances.png)

        تم إنشاء نود Wallarm بالفعل خلال [ترقية postanalytics module المنفصل](separate-postanalytics.md). لتوصيل وحدة معالجة حركة المرور الأولية بالسحابة باستخدام نفس بيانات التفويض الخاصة بالنود:

        1. انسخ رمز النود المُولد خلال ترقية postanalytics module المنفصل.
        1. استمر في الخطوة الرابعة في القائمة أدناه.
1. انسخ الرمز المولد.
1. أوقف خدمة NGINX لتقليل خطر حساب RPS غير صحيح:

    === "ديبيان"
        ```bash
        sudo systemctl stop nginx
        ```
    === "أوبونتو"
        ```bash
        sudo service nginx stop
        ```
    === "سنتْ OS أو أمازون لينكس 2.0.2021x وأقل"
        ```bash
        sudo systemctl stop nginx
        ```
    === "ألمالينكس، روكي لينكس أو أوراكل لينكس 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
1. نفذ النصي `register-node` لتشغيل **Wallarm node**:

    === "السحابة الأمريكية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <الرمز المشفر> -H us1.api.wallarm.com --force
        ```
    === "السحابة الأوروبية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <الرمز المشفر> --force
        ```
    
    * `<الرمز المشفر>` هو القيمة المنسوخة من الرمز الشريطي للنود أو رمز API بدور 'Deploy'.
    * خيار `--force` يفرض إعادة كتابة بيانات الوصول إلى السحابة المحددة في الملف `/etc/wallarm/node.yaml`.

### الخطوة 5: تحديث صفحة الحظر لـ Wallarm

في النسخة الجديدة من النود، غيرت صفحة Wallarm sample blocking [تم تغييرها](what-is-new.md#new-blocking-page). الشعار ورسالة الدعم على الصفحة الآن فارغة بشكل افتراضي.

إذا تم تكوين الصفحة `&/usr/share/nginx/html/wallarm_blocked.html` لتعود في الرد على الطلبات المحظورة، [انسخ وقم بتخصيص](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) النسخة الجديدة من الصفحة العينة.

### الخطوة 6: إعادة تشغيل NGINX

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### الخطوة 7: اختبار تشغيل نود Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

### تخصيص الإعدادات

تم تحديث وحدات Wallarm إلى الإصدار 4.8. ستتم تطبيق إعدادات النود التصفية السابقة تلقائيًا على الإصدار الجديد. لإجراء إعدادات إضافية، استخدم [التوجيهات المتاحة](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
