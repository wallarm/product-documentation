[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md
[wallarm-token-types]:          ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../../images/tarantool-status.png
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:    ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md


# تحديث موديول postanalytics المنتهي الخدمة

توصف هذه التعليمات الخطوات لتحديث موديول postanalytics المنتهي الخدمة (الإصدار 3.6 وأقل) المثبت على سيرفر منفصل. يجب تحديث موديول postanalytics قبل [تحديث موديولات Wallarm NGINX][docs-module-update].

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## طرق التحديث

--8<-- "../include/waf/installation/upgrade-methods.md"

## التحديث باستخدام مثبت all-in-one

استخدم الإجراء أدناه لتحديث موديول postanalytics المنتهي الخدمة (الإصدار 3.6 وأقل) المثبت على سيرفر منفصل إلى الإصدار 4.10 باستخدام [مثبت all-in-one](../../installation/nginx/all-in-one.md).

### متطلبات التحديث باستخدام مثبت all-in-one

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### الخطوة 1: إعداد جهاز نظيف

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### الخطوة 2: إعداد توكن Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

### الخطوة 3: تحميل مثبت Wallarm all-in-one

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 4: تشغيل مثبت Wallarm all-in-one لتثبيت postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

### الخطوة 5: تحديث منفذ API 

--8<-- "../include/waf/upgrade/api-port-443.md"

### الخطوة 6: تحديث موديول NGINX-Wallarm على سيرفر منفصل

بمجرد تثبيت موديول postanalytics على السيرفر المنفصل، [قم بتحديث موديول NGINX-Wallarm المرتبط](nginx-modules.md) الجاري تشغيله على سيرفر مختلف.

!!! info "دمج طرق التحديث"
    يمكن استخدام كل من النهج اليدوي والتلقائي لتحديث موديول NGINX-Wallarm المرتبط.

### الخطوة 7: إعادة الاتصال بين موديول NGINX-Wallarm وموديول postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

### الخطوة 8: التحقق من تفاعل موديولات NGINX‑Wallarm و postanalytics المنفصلة

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

### الخطوة 9: إزالة موديول postanalytics القديم

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"

## التحديث اليدوي

استخدم الإجراء أدناه لتحديث موديول postanalytics المنتهي الخدمة (الإصدار 3.6 وأقل) المثبت على سيرفر منفصل يدويًا إلى الإصدار 4.8.

### المتطلبات

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

### الخطوة 1: تحديث منفذ API

--8<-- "../include/waf/upgrade/api-port-443.md"

### الخطوة 2: إضافة مستودع Wallarm جديد

حذف عنوان مستودع Wallarm السابق وإضافة مستودع بحزم إصدارات نود Wallarm الجديدة. الرجاء استخدام الأوامر للمنصة المناسبة.

**CentOS و Amazon Linux 2.0.2021x وأقل**

=== "CentOS 7 و Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "تم إيقاف دعم CentOS 8.x"
        تم إيقاف دعم CentOS 8.x [تم إيقاف دعمها](https://www.centos.org/centos-linux-eol/). يمكنك تثبيت نود Wallarm على نظام التشغيل AlmaLinux، Rocky Linux، Oracle Linux 8.x، أو RHEL 8.x بدلاً من ذلك.

        * [تعليمات التثبيت لـ NGINX `stable`](../../installation/nginx/dynamic-module.md)
        * [تعليمات التثبيت لـ NGINX من مستودعات CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md)
        * [تعليمات التثبيت لـ NGINX Plus](../../installation/nginx-plus.md)
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

1. فتح الملف بعنوان مستودع Wallarm في محرر النصوص المثبت. في هذه التعليمات، يتم استخدام **vim**.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. تعليق أو حذف عنوان المستودع السابق.
3. إضافة عنوان مستودع جديد:

    === "Debian 10.x (buster)"
        !!! warning "غير مدعوم بواسطة NGINX stable و NGINX Plus"
            نسخ NGINX الرسمية (stable و Plus) وبالتالي لا يمكن تثبيت نود Wallarm 4.4 وما فوق على Debian 10.x (buster). الرجاء استخدام هذا نظام التشغيل فقط إذا [تم تثبيت NGINX من مستودعات Debian/CentOS](../../installation/nginx/dynamic-module-from-distr.md).

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

### الخطوة 3: تحديث حزم Tarantool

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

### الخطوة 4: تحديث نوع النود

النود postanalytics المثبت 3.6 أو أقل يحتوي على نوع **regular** المحذوف الآن الذي [تم استبداله بنوع **Wallarm node** الجديد](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

يُنصح بتثبيت نوع النود الجديد بدلاً من النوع المحذوف خلال التهجير إلى الإصدار 4.8. سيتم إزالة نوع نود regular في الإصدارات المستقبلية، يرجى التهجير قبل ذلك.

لتبديل نود postanalytics العادي بنود Wallarm:

1. فتح وحدة تحكم Wallarm → **نود** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وإنشاء نود من نوع **Wallarm node**.

    ![إنشاء نود Wallarm][img-create-wallarm-node]
1. نسخ التوكن المولد.
1. تنفيذ سكربت `register-node` لتشغيل **نود Wallarm**:

    === "السحابة الأمريكية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "السحابة الأوروبية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` هو قيمة توكن النود المنسوخة أو توكن API بدور `Deploy`.
    * الخيار `--force` يفرض إعادة كتابة بيانات الوصول لسحابة Wallarm المحددة في الملف `/etc/wallarm/node.yaml`.

### الخطوة 5: إعادة تشغيل موديول postanalytics

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

[تحديث موديولات Wallarm NGINX][docs-module-update]