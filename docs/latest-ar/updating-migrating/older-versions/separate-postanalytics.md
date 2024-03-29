[docs-module-update]: nginx-modules.md
[img-wl-console-users]: ../../images/check-users.png 
[img-create-wallarm-node]: ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]: ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]: ../../custom/custom-nginx-version.md
[wallarm-token-types]: ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]: ../../images/tarantool-status.png
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]: ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# ترقية وحدة postanalytics المنتهية الصلاحية

توصف هذه التعليمات الخطوات اللازمة لترقية وحدة postanalytics المنتهية الصلاحية (الإصدار 3.6 وأقل) المثبتة على خادم منفصل. يجب ترقية وحدة postanalytics قبل [ترقية وحدات NGINX لـWallarm][docs-module-update].

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## طرق الترقية

--8<-- "../include/waf/installation/upgrade-methods.md"

## الترقية باستخدام المثبت الشامل

استخدم الإجراء أدناه لترقية وحدة postanalytics المنتهية الصلاحية (الإصدار 3.6 وأقل) المثبتة على خادم منفصل إلى الإصدار 4.10 باستخدام [المثبت الشامل](../../installation/nginx/all-in-one.md).

### متطلبات الترقية باستخدام المثبت الشامل

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### الخطوة 1: إعداد الجهاز المستقيم

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### الخطوة 2: إعداد الرمز المميز لـWallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

### الخطوة 3: تحميل مثبت Wallarm الشامل

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 4: تشغيل مثبت Wallarm الشامل لتثبيت postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

### الخطوة 5: تحديث منفذ API

--8<-- "../include/waf/upgrade/api-port-443.md"

### الخطوة 6: ترقية وحدة NGINX-Wallarm على خادم منفصل

بمجرد تثبيت وحدة postanalytics على الخادم المستقل، [قم بترقية وحدتها المتصلة NGINX-Wallarm](nginx-modules.md) التي تعمل على خادم مختلف.

!!! info "جمع طرق الترقية"
    يمكن استخدام الطرق اليدوية والآلية لترقية وحدة NGINX-Wallarm المتصلة.

### الخطوة 7: إعادة توصيل وحدة NGINX-Wallarm بوحدة postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

### الخطوة 8: تحقق من تفاعل وحدات NGINX‑Wallarm وpostanalytics المستقلة

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

### الخطوة 9: إزالة وحدة postanalytics القديمة

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"

## الترقية اليدوية

استخدم الإجراء أدناه لترقية وحدة postanalytics المنتهية الصلاحية (الإصدار 3.6 وأقل) المثبتة على خادم منفصل إلى الإصدار 4.8 يدويًا.

### متطلبات

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

### الخطوة 1: تحديث منفذ API

--8<-- "../include/waf/upgrade/api-port-443.md"

### الخطوة 2: إضافة مستودع Wallarm الجديد

قم بحذف عنوان مستودع Wallarm السابق وأضف مستودعًا بحزمة نسخة العقدة Wallarm الجديدة. يرجى استخدام الأوامر المناسبة للمنصة المتوافقة.

**CentOS و Amazon Linux 2.0.2021x وأقل**

=== "CentOS 7 و Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "تم إيقاف الدعم لـ CentOS 8.x"
        تم إيقاف الدعم لـ CentOS 8.x [تم إيقاف الدعم](https://www.centos.org/centos-linux-eol/). يمكنك تثبيت عقدة Wallarm على نظام التشغيل AlmaLinux, Rocky Linux, Oracle Linux 8.x, أو RHEL 8.x بدلاً من ذلك.

        * [تعليمات التثبيت للنسخة `الثابتة` من NGINX](../../installation/nginx/dynamic-module.md)
        * [تعليمات التثبيت للنسخة NGINX من مستودعات CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md)
        * [تعليمات التثبيت لإصدار NGINX Plus](../../installation/nginx-plus.md)
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

1. افتح الملف الذي يحتوي على عنوان المستودع Wallarm في المحرر النصي المثبت. في هذه التعليمات، سيتم استخدام **vim**.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. قم بتعليق العنوان السابق للمستودع أو حذفه.
3. أضف عنوان مستودع جديد:

    === "Debian 10.x (buster)"
        !!! warning "غير مدعوم من قبل النسخة الثابتة من NGINX و NGINX Plus"
            النسخ الرسمية من NGINX (ثابتة و Plus) و، كنتيجة لذلك، لا يمكن تثبيت وحدة Wallarm 4.4 وما فوق على Debian 10.x (buster). يرجى استخدام هذا النظام التشغيل فقط في حالة [تثبيت NGINX من مستودعات Debian/CentOS](../../installation/nginx/dynamic-module-from-distr.md).

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

### الخطوة 3: ترقية حزم Tarantool

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

### الخطوة 4: تحديث نوع العقدة

تحتوي العقدة postanalytics المنشورة 3.6 أو أقل على النوع المهجور **العادي** الذي [تم الآن استبداله بنوع **عقدة Wallarm** الجديد](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

يوصى بتثبيت النوع الجديد بدلاً من النوع المهجور أثناء الترحيل إلى الإصدار 4.8. سيتم إزالة نوع العقدة العادي في الإصدارات المستقبلية، يرجى الترحيل قبل ذلك.

لاستبدال العقدة postanalytics العادية بعقدة Wallarm:

1. افتح Wallarm Console → **عقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وأنشئ عقدة من نوع **عقدة Wallarm**.

    ![إنشاء عقدة Wallarm][img-create-wallarm-node]
1. انسخ الرمز المميز المُنشأ.
1. نفذ البرنامج النصي `register-node` لتشغيل **عقدة Wallarm**:

    === "السحابة الأمريكية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "السحابة الأوروبية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` هو القيمة المنسوخة لرمز العقدة أو رمز API بدور `التنفيذ`.
    * الخيار `--force` يجبر على إعادة كتابة بيانات الاعتماد للوصول إلى Wallarm Cloud المحددة في ملف `/etc/wallarm/node.yaml`.

### الخطوة 5: إعادة تشغيل وحدة postanalytics

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

[ترقية وحدات NGINX لـWallarm][docs-module-update]