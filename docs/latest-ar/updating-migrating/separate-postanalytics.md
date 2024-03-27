[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# ترقية وحدة ما بعد التحليليات

هذه الإرشادات توضح الخطوات لترقية وحدة ما بعد التحليليات 4.x المُثبتة على خادم منفصل. يجب ترقية وحدة ما بعد التحليليات قبل [ترقية وحدات NGINX التابعة لـ Wallarm][docs-module-update].

لترقية الوحدة التي انتهت صلاحيتها (3.6 أو أقل)، يُرجى استخدام [الإرشادات المختلفة](older-versions/separate-postanalytics.md).

## طرق الترقية

--8<-- "../include/waf/installation/upgrade-methods.md"

## الترقية باستخدام المُثبت الشامل

استخدم الإجراء أدناه لترقية وحدة ما بعد التحليليات 4.x المُثبتة على خادم منفصل إلى الإصدار 4.10 باستخدام [المُثبت الشامل](../installation/nginx/all-in-one.md).

### متطلبات الترقية باستخدام المُثبت الشامل

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### الخطوة 1: إعداد آلة نظيفة

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### الخطوة 2: إعداد رمز Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

### الخطوة 3: تنزيل المُثبت الشامل Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 4: تشغيل المُثبت الشامل Wallarm لتثبيت وحدة ما بعد التحليليات

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

### الخطوة 5: ترقية وحدة NGINX-Wallarm على خادم منفصل

بمجرد تثبيت وحدة ما بعد التحليليات على الخادم المنفصل، [قم بترقية وحدة NGINX-Wallarm ذات الصلة](nginx-modules.md) الجارية على خادم آخر.

!!! info "دمج طرق الترقية"
    يمكن استخدام النهجين اليدوي والتلقائي لترقية وحدة NGINX-Wallarm ذات الصلة.

### الخطوة 6: إعادة الاتصال وحدة NGINX-Wallarm بوحدة ما بعد التحليليات

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

### الخطوة 7: التحقق من تفاعل وحدات NGINX‑Wallarm وما بعد التحليليات المنفصلة

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

### الخطوة 8: إزالة وحدة ما بعد التحليليات القديمة

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"

## الترقية اليدوية

استخدم الإجراء أدناه للترقية اليدوية لوحدة ما بعد التحليليات 4.x المُثبتة على خادم منفصل إلى الإصدار 4.8.

!!! info "دعم الإصدار 4.10"
    حزم DEB/RPM للتثبيت اليدوي للوحدة لم يتم تحديثها بعد إلى إصدار 4.10.

### متطلبات

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

### الخطوة 1: إضافة مستودع Wallarm جديد

قم بحذف عنوان مستودع Wallarm السابق وأضف مستودعًا بعنوان جديد لحزم إصدار Wallarm node. يُرجى استخدام الأوامر للمنصة المناسبة.

**CentOS و Amazon Linux 2.0.2021x وأقل**

=== "CentOS 7 و Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
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

1. افتح الملف الذي يحتوي عنوان مستودع Wallarm في مُحرر النصوص المثبت. في هذا الدليل، يتم استخدام **vim**.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. قم بالتعليق أو حذف عنوان المستودع السابق.
3. أضف عنوان مستودع جديد:

    === "Debian 10.x (buster)"
        !!! warning "غير مدعوم بواسطة NGINX مستقر و NGINX Plus"
            النسخ الرسمية لنسخ NGINX (المستقرة و Plus) و، نتيجة لذلك، لا يمكن تثبيت وحدة Wallarm node الإصدار 4.4 وما فوق على Debian 10.x (buster). يُرجى استخدام هذا النظام التشغيلي فقط إذا [تم تثبيت NGINX من مستودعات Debian/CentOS](../installation/nginx/dynamic-module-from-distr.md).

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
=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum update
    ```

### الخطوة 3: تحديث نوع الوحدة

!!! info "للوحدات المثبتة باستخدام سكربت `addnode` فقط"
    اتبع هذه الخطوة فقط إذا كانت وحدة بإصدار سابق متصلة بـ Wallarm Cloud باستخدام سكربت `addnode`. تم [إزالة](what-is-new.md#removal-of-the-email-password-based-node-registration) هذا السكربت واستبداله بـ `register-node`، والذي يتطلب رمزًا لتسجيل الوحدة في السحابة.

1. تحقق من أن لديك دور **المدير** في حساب Wallarm الخاص بك من خلال التنقل إلى قائمة المستخدمين في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/users) أو [السحابة الأوروبية](https://my.wallarm.com/settings/users).

    ![قائمة المستخدمين في واجهة Wallarm][img-wl-console-users]
1. افتح واجهة Wallarm → **الوحدات** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وأنشئ الوحدة من نوع **وحدة Wallarm**.

    ![إنشاء وحدة Wallarm][img-create-wallarm-node]
1. انسخ الرمز المُنشأ.
1. نفّذ سكربت `register-node` لتشغيل الوحدة:

    === "السحابة الأمريكية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "السحابة الأوروبية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` هو قيمة رمز الوحدة أو رمز API بدور `النشر` المنسوخ.
    * الخيار `--force` يُجبر على إعادة كتابة بيانات الوصول إلى Wallarm Cloud المُحددة في ملف `/etc/wallarm/node.yaml`.

### الخطوة 4: إعادة تشغيل وحدة ما بعد التحليليات

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
=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[ترقية وحدات NGINX التابعة لـ Wallarm][docs-module-update]