[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[oob-docs]:                         ../installation//oob/overview.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring


# ترقية Wallarm NGINX الوحدات

تصف هذه التعليمات الخطوات لترقية Wallarm NGINX الوحدات 4.x المثبتة من الحزم الفردية إلى الإصدار 4.10. هذه هي الوحدات التي تم تثبيتها وفقًا لإحدى التعليمات البرمجية التالية:

* [حزم فردية لـ NGINX ثابت](../installation/nginx/dynamic-module.md)
* [حزم فردية لـ NGINX Plus](../installation/nginx-plus.md)
* [حزم فردية لـ NGINX المقدمة من التوزيع](../installation/nginx/dynamic-module-from-distr.md)

لترقية الفرع نهاية الحياة (3.6 أو أقل) ، يرجى استخدام [تعليمات مختلفة](older-versions/nginx-modules.md).

## وسائل الترقية

--8<-- "../include/waf/installation/upgrade-methods.md"

## الترقية باستخدام المثبت الشامل

استخدم الإجراء أدناه لترقية Wallarm NGINX الوحدات 4.x إلى الإصدار 4.10 باستخدام [المثبت الشامل](../installation/nginx/all-in-one.md).

### متطلبات الترقية باستخدام المثبت الشامل

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### إجراء الترقية

* إذا تم تثبيت وحدات الفلترة ووحدات postanalytics على نفس الخادم، فاتبع التعليمات أدناه لترقية الكل.

    ستحتاج إلى تشغيل وحدة من الإصدار الأحدث باستخدام المثبت الشامل على جهاز نظيف، واختبار أنه يعمل بشكل جيد وإيقاف السابق وتكوين حركة المرور لتتدفق عبر الجهاز الجديد بدلاً من السابق.

* إذا تم تثبيت وحدات الفلترة و postanalytics على خوادم مختلفة، **أولاً** قم بترقية وحدة postanalytics و**ثم** وحدة الفلترة باستخدام هذه [التعليمات](../updating-migrating/separate-postanalytics.md).

### الخطوة 1: إعداد جهاز نظيف

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### الخطوة 2: تثبيت NGINX والتبعيات

--8<-- "../include/waf/installation/all-in-one-nginx.md"

### الخطوة 3: إعداد Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

### الخطوة 4: تحميل مثبت Wallarm الشامل

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 5: تشغيل مثبت Wallarm الشامل

#### وحدة تصفية العقد وpostanalytics على نفس الخادم

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

#### وحدة تصفية العقد وpostanalytics على خوادم مختلفة

!!! warning "تسلسل الخطوات لترقية وحدات الفلترة وpostanalytics"
    إذا تم تثبيت وحدة الفلترة ووحدة postanalytics على خوادم مختلفة ، فيجب ترقية حزم postanalytics قبل تحديث حزمة وحدة الفلترة.

1. قم بترقية وحدة postanalytics باتباع هذه [التعليمات](separate-postanalytics.md).
1. ترقية وحدة تصفية العقد:

    === "API token"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh filtering
        ```        

        تضع المتغير `WALLARM_LABELS` المجموعة التي سيتم إضافة العقدة إليها (تستخدم لتجميع العقدات بطريقة منطقية في واجهة Wallarm Console UI).

    === "Node token"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo sh wallarm-4.10.1.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo sh wallarm-4.10.1.aarch64-glibc.sh filtering
        ```

### الخطوة 6: نقل تكوين NGINX وpostanalytics من قديم لجهاز العقدة الجديد

قم بنقل تكوين NGINX المتعلق بالعقدة وتكوين postanalytics من الملفات التكوين على الجهاز القديم إلى الملفات على الجهاز الجديد. يمكنك القيام بذلك من خلال نسخ التوجيهات المطلوبة.

**ملفات المصدر**

على جهاز قديم، اعتمادا على نظام التشغيل وإصدار NGINX، قد تكون ملفات التهيئة NGINX تقع في دلائل مختلفة ولها أسماء مختلفة. الأكثر شيوعًا هي الأتية:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة العقدة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]

أيضًا، يتواجد عادة تكوين الوحدة postanalytics (إعدادات قاعدة بيانات Tarantool) هنا:

* `/etc/default/wallarm-tarantool` أو
* `/etc/sysconfig/wallarm-tarantool`

**ملفات الهدف**

حيث أن المثبت الشامل يعمل مع مجموعات مختلفة من نظم التشغيل وإصدارات NGINX، على جهازك الجديد، قد تكون [ملفات الهدف](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) لديها أسماء مختلفة وتكون في دلائل مختلفة.

### الخطوة 7: إعادة تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

### الخطوة 8: اختبار عملية Wallarm node

لاختبار عملية العقدة الجديدة:

1. أرسل الطلب مع هجمات تجريبية [SQLI][sqli-attack-docs] و [XSS][xss-attack-docs] إلى عنوان المورد المحمي:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. افتح Wallarm Console → قسم **الهجمات** في [US Cloud](https://us1.my.wallarm.com/attacks) أو [EU Cloud](https://my.wallarm.com/attacks) وتأكد من أن الهجمات تظهر في القائمة.
1. بمجرد أن يتم مزامنة بيانات المتجر الخاص بك (القواعد، قوائم IP) مع العقدة الجديدة، قم بإجراء بعض الهجمات الاختبارية للتأكد من أن قواعدك تعمل كما هو متوقع.

### الخطوة 9: تكوين إرسال حركة المرور إلى Wallarm node

اعتمادًا على أسلوب النشر المستخدم، قم بالإعدادات التالية:

=== "داخل السطر"
    قم بتحديث الأهداف لتحميل الموازن الخاص بك لإرسال حركة المرور إلى Wallarm instance. للحصول على التفاصيل، يرجى الرجوع إلى تعليمات التعليم البرمجي الخاصة بموازن التحميل الخاص بك.

    قبل إعادة توجيه حركة المرور بشكل كامل إلى العقدة الجديدة، من الأفضل أن تقوم أولا بإعادة توجيه جزء منها والتحقق من أن العقدة الجديدة تتصرف كما هو متوقع.

=== "خارج النطاق"
    قم بتكوين خادم الويب الخاص بك أو خادم الوكيل (على سبيل المثال، NGINX، Envoy) لمراقبة حركة المرور الواردة إلى Wallarm node. بالنسبة لتفاصيل التكوين، نوصي بالرجوع إلى تعليمات خادم الويب الخاص بك أو خادم الوكيل.

    داخل [الرابط][web-server-mirroring-examples]، ستجد تكوين المثال لأكثر خادم ويب وخادم وكيل شعبية (NGINX, Traefik, Envoy).

### الخطوة 10: إزالة العقدة القديمة

1. احذف العقدة القديمة في Wallarm Console → **عقد** بحدد العقدة الخاصة بك وانقر على **حذف**.
1. تأكيد الإجراء.
    
    عندما يتم حذف العقدة من السحابة، سوف يتوقف ترشيح الطلبات لتطبيقاتك. يتم حذف العقدة التصفية ولا يمكن التراجع. سيتم حذف العقدة من قائمة العقد دائمًا.

1. حذف آلة مع العقدة القديمة أو مجرد تنظيفها من مكونات Wallarm node:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## الترقية اليدوية

استخدم الإجراء أدناه لترقية Wallarm NGINX الوحدات 4.x يدويًا إلى الإصدار 4.8.

!!! info "دعم 4.10"
    لم يتم بعد تحديث حزم DEB/RPM لتثبيت العقدة اليدوي إلى اصدار 4.10.

### متطلبات الترقية اليدوية

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

### إجراء الترقية

* إذا تم تثبيت وحدات الفلترة و postanalytics على نفس الخادم، ثم اتبع التعليمات أدناه لترقية كل الحزم.
* إذا تم تثبيت وحدات الفلترة و postanalytics على خوادم مختلفة، **أولاً** قم بترقية وحدة postanalytics باستخدام هذه [التعليمات](separate-postanalytics.md) ومن ثم قم بتنفيذ الخطوات التالية لوحدات الفلترة العقدة.

### الخطوة 1: ترقية NGINX إلى الإصدار الأحدث

قم بترقية NGINX إلى الإصدار الأحدث باستخدام التعليمات البرمجية ذات الصلة:

=== "NGINX ثابت"

    التوزيعات الحزم المدير المثبتة:

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    التوزيعات الحزم المدير المثبتة:

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
    بالنسبة لـ NGINX Plus، يرجى اتباع [تعليمات الترقية الرسمية](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus).
=== "NGINX من Debian/CentOS repository"
    بالنسبة لـ NGINX [المثبتة من Debian/CentOS repository](../installation/nginx/dynamic-module-from-distr.md)، يرجى تجاوز هذه الخطوة. سيتم ترقية إصدار NGINX المثبت [في وقت لاحق](#step-4-upgrade-wallarm-packages) جنبًا إلى جنب مع وحدات Wallarm.

إذا كانت البنية التحتية الخاصة بك تحتاج إلى استخدام إصدار محدد من NGINX، يرجى الاتصال بدعم فني Wallarm[الدعم الفني](mailto:support@wallarm.com) لبناء الوحدة Wallarm لإصدار مخصص من NGINX.

### الخطوة 2: أضف مستودع Wallarm الجديد

قم بحذف عنوان مستودع Wallarm السابق وأضف مستودعاً مع حزمة الإصدار الجديد من Wallarm node. يرجى استخدام الأوامر للمنصة المناسبة.

**CentOS و Amazon Linux 2.0.2021x وأقل**

=== "CentOS 7 و Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
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

1. افتح الملف مع عنوان مستودع Wallarm في المحرر النصي المثبت. في هذه التعليمات، يتم استخدام **vim**.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. علق أو احذف عنوان المستودع السابق.
3. أضف عنوان المستودع الجديد:

    === "Debian 10.x (buster)"
        !!! warning "غير مدعوم بواسطة NGINX ثابت و NGINX Plus"
            لا يمكن تثبيت الإصدارات الرسمية لـ NGINX (ثابتة وPlus) وبالتالي Wallarm node 4.4 وما فوق على Debian 10.x (buster). يرجى استخدام هذا OS فقط إذا تم [تثبيت NGINX من مستودعات Debian/CentOS](../installation/nginx/dynamic-module-from-distr.md).

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

### الخطوة 3: ترقية حزم Wallarm

#### وحدة تصفية العقد وpostanalytics على نفس الخادم

1. نفذ الأمر التالي لتحديث وحدات الفلترة وpostanalytics:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```
2. إذا طلب المدير الحزم للتأكيد على إعادة كتابة محتوى ملف التكوين `/etc/cron.d/wallarm-node-nginx`، أرسل الخيار `Y`.

    يجب تحديث محتوى `/etc/cron.d/wallarm-node-nginx` ليتم تنزيل البرنامج النصي الجديد الذي يحسب RPS.

    بشكل افتراضي، يستخدم مدير الحزم الخيار `N` ولكن الخيار `Y` مطلوب لحساب RPS بشكل صحيح.

#### وحدة تصفية العقد وpostanalytics على خوادم مختلفة

!!! warning "تسلسل الخطوات لترقية وحدات الفلترة وpostanalytics"
    إذا كانت وحدة الفلترة ووحدة postanalytics مثبتة على خوادم مختلفة، فيجب ترقية حزم postanalytics قبل تحديث حزم وحدة الفلترة.

1. قم بترقية حزم postanalytics باتباع هذه [التعليمات](separate-postanalytics.md).
2. قم بترقية حزم Wallarm node:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```
3. إذا طلب مدير الحزم تأكيدًا لكتابة المحتوى في تكوين الملف `/etc/cron.d/wallarm-node-nginx`، أرسل الخيار `Y`.

    يجب تحديث المحتوى `/etc/cron.d/wallarm-node-nginx` يجب أن يتجدد ليتم تنزيل برنامج الكتابة الجديد الذي يحسب RPS.

    بشكل افتراضي، يستخدم مدير الحزم الخيار `N` ولكن الخيار `Y` مطلوبٌ لحساب RPS بشكل صحيح.

### الخطوة 4: تحديث نوع العقدة

!!! info "فقط للعقد التي تم تثبيتها باستخدام النص البرمجي `addnode`"
    اتبع هذه الخطوة فقط إذا كانت عقدة من الإصدار السابق متصلة بـ Wallarm Cloud باستخدام النص البرمجي `addnode`. تم إزالة هذا النص البرمجي[أزالة](what-is-new.md#removal-of-the-email-password-based-node-registration) واستبداله بـ `register-node`، والذي يتطلب رمزًا لتسجيل العقدة في السحابية.

1. تأكد من أن حسابك في Wallarm له دور **المسؤول** عن طريق التنقل إلى قائمة المستخدمين في [US Cloud](https://us1.my.wallarm.com/settings/users) أو [EU Cloud](https://my.wallarm.com/settings/users).

    ![قائمة المستخدمين في Wallarm console][img-wl-console-users]
1. افتح Wallarm Console → **عقد** في [US Cloud](https://us1.my.wallarm.com/nodes) أو [EU Cloud](https://my.wallarm.com/nodes) وقم بإنشاء عقدة من نوع **Wallarm node**.

    ![إنشاء Wallarm node][img-create-wallarm-node]

    !!! info "If the postanalytics module is installed on a separate server"
        إذا تم تثبيت الوحدة الأولية لمعالجة الحركة ووحدة postanalytics على أجهزة خوادم متميزة، يُوصى بتوصيل هذه الوحدات بـ Wallarm Cloud باستخدام نفس رمز العقدة. واجهة المستخدم Wallarm Console UI ستعرض كل وحدة كمثيل عقدة منفصل، على سبيل المثال:

        ![عقدة ولها عدة مثيلات](../images/user-guides/nodes/wallarm-node-with-two-instances.png)

        لقد تم بالفعل إنشاء Wallarm node أثناء [ترقية وحدة postanalytics المتميزة](separate-postanalytics.md). لتوصيل الوحدة الأولية لمعالجة الحركة بالسحابة باستخدام بيانات الاعتماد الخاصة بالعقدة نفسها:

        1. نسخ رمز العقدة الذي تم إنشاؤه أثناء ترقية وحدة postanalytics المتميزة.
        1. انتقل إلى الخطوة الرابعة في القائمة أدناه.
1. انسخ الرمز المُنشأ.
1. أيقف خدمة NGINX للتخفيف من خطر حساب RPS غير صحيح:

    === "Debian"
        ```bash
        sudo systemctl stop nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx stop
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
1. نفذ نص برمجي `register-node` لتشغيل **Wallarm node**:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force
        ```

    * `<TOKEN>` هو القيمة المنسوخة لرمز العقدة أو رمز API بدور `Deploy`.
    * الخيار `--force` يجبر على إعادة كتابة بيانات الوصول إلى Wallarm Cloud المُحددة في ملف `/etc/wallarm/node.yaml`.

### الخطوة 5: تحديث صفحة الحظر Wallarm

في الإصدار الجديد من العقدة، تم تغيير صفحة الحظر العينية Wallarm. الشعار وبريد الدعم الإلكتروني على الصفحة الآن فارغان افتراضيًا.

إذا تم تكوين الصفحة `&/usr/share/nginx/html/wallarm_blocked.html` ليتم إرجاعها في استجابة لطلبات التظليل، [انسخ وتخصص](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) الإصدار الجديد من الصفحة النموذجية.

### الخطوة 6: إعادة تشغيل NGINX

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### الخطوة 7: اختبار عملية Wallarm node

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

### تخصيص الإعدادات

تم تحديث وحدات Wallarm إلى الإصدار 4.8. ستتم تطبيق إعدادات العقدة الفلترة السابقة على الإصدار الجديد تلقائيًا. للقيام بإعدادات إضافية، استخدم [التوجيهات المتاحة](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
