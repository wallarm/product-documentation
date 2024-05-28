[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# ترقية الوحدة النمطية postanalytics

يرجى اتباع هذه الإرشادات لترقية وحدة postanalytics النمطية الإصدار 4.x المركبة على الخادم المستقل. يكون عليك ترقية الوحدة النمطية postanalytics قبل [ترقية وحدات Wallarm NGINX][docs-module-update].

لترقية الوحدة النمطية التي بلغت نهاية العمر (3.6 أو أقل )، يرجى استخدام [التعليمات الأخرى](older-versions/separate-postanalytics.md).

## طرق الترقية

--8<-- "../include/waf/installation/upgrade-methods.md"

## ترقية باستخدام المثبت الشامل

استخدم الإجراء أدناه لتحديث وحدة postanalytics النمطية 4.x المركبة على الخادم المستقل إلى الإصدار 4.10 باستخدام [المثبت الشامل](../installation/nginx/all-in-one.md).

### متطلبات ترقية باستخدام المثبت الشامل

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### الخطوة 1: إعداد الجهاز النظيف

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### الخطوة 2: إعداد الرمز المميز لـ Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

### الخطوة 3: تنزيل المثبت الشامل لـ Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 4: تشغيل المثبت الشامل لـ Wallarm لتثبيت postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

### الخطوة 5: ترقية وحدة NGINX-Wallarm على الخادم المستقل

بمجرد تثبيت وحدة postanalytics على الخادم المستقل، [قم بترقية وحدة NGINX-Wallarm المرتبطة بها](nginx-modules.md) التي تعمل على خادم آخر.

!!! info "دمج طرق الترقية"
    يمكن استخدام الأساليب اليدوية والتلقائية لترقية الوحدة النمطية NGINX-Wallarm المرتبطة.

### الخطوة 6: إعادة ربط وحدة NGINX-Wallarm بوحدة postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

### الخطوة 7: التحقق من تفاعل وحدات NGINX‑Wallarm وpostanalytics المستقلة

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

### الخطوة 8: إزالة وحدة postanalytics القديمة

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"

## الترقية اليدوية

استخدم الإجراء أدناه لترقية الوحدة النمطية postanalytics 4.x المثبتة على الخادم المستقل إلى الإصدار 4.8 يدويًا.

!!! info "الدعم لـ 4.10"
    لم يتم تحديث حزم DEB/RPM لتثبيت العقدة يدويًا إلى الإصدار 4.10 بعد.

### متطلبات

--8<-- "../include-ar/waf/installation/basic-reqs-for-upgrades.md"

### الخطوة 1: إضافة مستودع Wallarm الجديد

قم بحذف عنوان مستودع Wallarm السابق وأضف مستودعًا به حزم نسخة العُقدة Wallarm الجديدة. يرجى استخدام الأوامر المناسبة للبرنامج المناسب.

**CentOS و Amazon Linux 2.0.2021x وأقل**

=== "CentOS 7 و Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "ألما لينكس، روكي لينكس أو أوراكل لينكس 8.x"
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

1. افتح الملف الذي يُطابق عنوان المستودع Wallarm في المحرر النصي المثبت. **vim** يُستخدم في هذا التعليم.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. علق على عنوان المستودع السابق أو احذفه.
3. أضف عنوان المستودع الجديد:

    === "Debian 10.x (buster)"
        !!! warning "غير مدعوم من قبل NGINX stable و NGINX Plus"
            لا يمكن تثبيت الإصدارات الرسمية لـ NGINX (المستقرة و Plus) و، على التوالي، العُقدة Wallarm 4.4 وما فوق على Debian 10.x (buster). الرجاء استخدم هذا OS فقط إذا [تم تثبيت NGINX من مستودعات Debian/CentOS](../installation/nginx/dynamic-module-from-distr.md).

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

### الخطوة 2: ترقية حزم Tarantool

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
=== "CentOS أو Amazon Linux 2.0.2021x وأقل"
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

### الخطوة 3: تحديث نوع العقدة

!!! info "فقط للعقد التي تم تثبيتها باستخدام نص البرنامج النصي `addnode`"
    اتبع هذه الخطوة فقط إذا كانت عقدة نسخة سابقة متصلة بـ Cloud Wallarm باستخدام النص البرنامجي `addnode`. تم [إزالة](what-is-new.md#removal-of-the-email-password-based-node-registration) هذا النص البرنامجي واستبدل بـ `register-node` ، الذي يتطلب رمزًا لتسجيل العقدة في السحابة.

1. تأكد من أن حسابك Wallarm لديه دور **المشرف** عن طريق الانتقال إلى قائمة المستخدمين في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/settings/users) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/settings/users).

    ![قائمة المستخدمين في واجهة Wallarm][img-wl-console-users]
1. افتح Wallarm Console → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وأنشئ عقدة من نوع **عقدة Wallarm**.

    ![خلق Wallarm node][img-create-wallarm-node]
1. انسخ الرمز المميز الذي تم إنشاؤه.
1. نفذ النص البرنامجي `register-node` لتشغيل العقدة:

    === "السحابة الأمريكية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "السحابة الأوروبية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` هو القيمة المنسوخة من الرمز المميز للعقدة أو الرمز المميز لواجهة برمجة التطبيقات ذو طابع "إنشاء".
    * خيار `--force` يجبر التحديث لبيانات الاعتماد الخاصة بـ Wallarm Cloud المنصوص عليها في الملف `/etc/wallarm/node.yaml`.

### الخطوة 4: اعد تشغيل وحدة postanalytics النمطية

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x أو Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[ترقية وحدات Wallarm NGINX][docs-module-update]