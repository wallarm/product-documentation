[tarantool-status]: ../images/tarantool-status.png
[configure-selinux-instr]: configure-selinux.md
[configure-proxy-balancer-instr]: configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]: ../images/check-user-no-2fa.png
[wallarm-token-types]: ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# تنصيب وحدة Postanalytics بشكل منفصل

تشتمل الطلبات المعالجة في Wallarm على مرحلتين، بما في ذلك مرحلة Postanalytics لتحليل الطلبات الإحصائي. تكون Postanalytics مكثفة بالذاكرة، مما قد يتطلب تنفيذها على خادم مخصص لأداء محسن. يوضح هذا المقال كيفية تثبيت وحدة Postanalytics على خادم منفصل.

الخيار لتثبيت وحدة Postanalytics على خادم منفصل متاح للأدوات التالية:

* [الحزم الفردية لـ NGINX المستقر](../installation/nginx/dynamic-module.md)
* [الحزم الفردية لـ NGINX Plus](../installation/nginx-plus.md)
* [الحزم الفردية لـ NGINX المقدم من التفعيل](../installation/nginx/dynamic-module-from-distr.md)
* [المعالج الشامل](../installation/nginx/all-in-one.md)

بشكل افتراضي، تدلك تعليمات Wallarm لتثبيت كلا الوحدتين على نفس الخادم.

## نظرة عامة

يتألف معالجة الطلبات في وحدة Wallarm من مرحلتين:

* المعالجة الأولية في وحدة NGINX-Wallarm، والتي لا تتطلب الذاكرة ويمكن تنفيذها على خوادم الواجهة الأمامية دون تغيير متطلبات الخادم.
* تحليل إحصاءات الطلبات المعالجة في وحدة Postanalytics التي تتطلب الذاكرة.

المخططات أدناه تصور تواصل الوحدة في سيناريوين: عند التثبيت على نفس الخادم وعلى خوادم مختلفة.

=== "NGINX-Wallarm وPostanalytics على خادم واحد"
    ![تدفق المرور بين Postanalytics وNGINX-Wallarm](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "NGINX-Wallarm وPostanalytics على خوادم مختلفة"
    ![تدفق المرور بين Postanalytics وNGINX-Wallarm](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## طرق التثبيت

يمكنك تثبيت وحدة Postanalytics على خادم منفصل بطريقتين مختلفتين:

* [باستخدام المثبت الشامل](#التثبيت-التلقائي-الشامل) (متاح ابتداءً من وحدة Wallarm 4.6) - يتم تلقائية العديد من الأنشطة ويجعل تنشيط وحدة Postanalytics أسهل بكثير. وبالتالي فإنها طريقة التثبيت الموصى بها.
* [يدويا](#التثبيت-اليدوي) - استخدم لأنواع العقد القديمة.

عند تثبيت وحدة التصفية وPostanalytics بشكل منفصل، يمكنك دمج النهج اليدوي والتلقائي: قم بتثبيت الجزء Postanalytics يدويًا ثم الجزء المرشح باستخدام المثبت الشامل، والعكس: الجزء Postanalytics باستخدام المثبت الشامل ثم الجزء المرشح يدويًا.

## التثبيت الآلي الشامل

اعتبارًا من Wallarm العقدة 4.6، لتثبيت Postanalytics بشكل منفصل، يوصى باستخدام [التثبيت الشامل](../installation/nginx/all-in-one.md#launch-options) الذي يتم تلقائية الكثير من النشاطات ويجعل تنشيط وحدة Postanalytics أسهل بكثير.

### المتطلبات

--8<-- "../include/waf/installation/all-in-one/separate-postanalytics-reqs.md"

### الخطوة 1: تنزيل المثبت Wallarm الشامل

لتنزيل السكريبت المثبت Wallarm الشامل، قم بتنفيذ الأمر:

=== "إصدار x86_64"
    ```bash
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.x86_64-glibc.sh
    ```
=== "إصدار ARM64"
    ```bash
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.aarch64-glibc.sh
    ```

### الخطوة 2: تحضير الرمز المميز لـ Wallarm

لتثبيت العقدة، سوف تحتاج إلى رمز Wallarm من [النوع المناسب][wallarm-token-types]. لتحضير رمز:

=== "رمز API"

    1. افتح Wallarm Console → **الإعدادات** → **رموز API** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز API بدور المصدر `Deploy`.
    1. انسخ هذا الرمز.

=== "رمز العقدة"

    1. افتح Wallarm Console → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. افعل واحدًا من الأتى:
        * أنشئ العقدة من نوع **Wallarm node** وانسخ الرمز المميز المولد.
        * استخدم مجموعة العقد الموجودة - انسخ الرمز باستخدام قائمة العقد → **نسخ الرمز**.

### الخطوة 3: تشغيل المثبت Wallarm الشامل لتثبيت Postanalytics

لتثبيت Postanalytics بشكل منفصل باستخدام المثبت Wallarm الشامل، استخدم:

=== "رمز API"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم الإصدار ARM64
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh postanalytics
    ```        

    يُحدد المتغير `WALLARM_LABELS` المجموعة التي سيتم إضافة العقدة إليها (تُستخدم لتجميع العقد منطقياً في واجهة Wallarm Console UI).

=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo sh wallarm-4.10.2.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم الإصدار ARM64:
    sudo sh wallarm-4.10.2.aarch64-glibc.sh postanalytics
    ```

### الخطوة 4: تكوين وحدة Postanalytics

#### الموارد والذاكرة

لتغيير كمية الذاكرة التي يستخدمها Tarantool، ابحث عن الإعداد `SLAB_ALLOC_ARENA` في ملف `/opt/wallarm/env.list`. يتم تعيينه لاستخدام 1 جيجا بايت افتراضيًا. إذا كنت بحاجة إلى تغيير هذا، يمكنك ضبط الرقم ليتوافق مع كمية الذاكرة التي يحتاجها في الواقع Tarantool. للحصول على مساعدة حول كم مقدار لتعيين، راجع [توصياتنا](configuration-guides/allocate-resources-for-node.md).

لتغيير الذاكرة المخصصة:

1. افتح الملف `/opt/wallarm/env.list` للتحرير:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. ضع السمة `SLAB_ALLOC_ARENA` على حجم الذاكرة. يمكن أن يكون هذا القيمة عدد صحيح أو عائم (النقطة `.` هي فاصلة عشرية). مثلا:

    ```
    SLAB_ALLOC_ARENA=2.0
    ```

#### الاستضافة والمنفذ

بشكل افتراضي، تم تعيين وحدة Postanalytics لقبول الاتصالات على كل عناوين IPv4 من المضيف (0.0.0.0) باستخدام المنفذ 3313. يُوصى بالاحتفاظ بالتهيئة الافتراضية ما لم يكن التغيير ضروريًا.

ومع ذلك، إذا كنت بحاجة إلى تغيير التهيئة الافتراضية:

1. افتح الملف `/opt/wallarm/env.list` للتحرير:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. حدث قيم `HOST` و`PORT` حسب الضرورة. قم بتعريف المتغير `PORT` إذا لم يتم تحديده بالفعل، على سبيل المثال:

    ```bash
    # tarantool
    HOST=0.0.0.0
    PORT=3300
    ```
1. افتح الملف `/opt/wallarm/etc/wallarm/node.yaml` للتحرير:

    ```bash
    sudo vim /opt/wallarm/etc/wallarm/node.yaml
    ```
1. أدخل القيم `host` و`port` الجديدة للمعلمات `tarantool`، كما هو موضح أدناه:

    ```yaml
    hostname: <اسم عقدة postanalytics>
    uuid: <UUID لعقدة postanalytics>
    secret: <مفتاح السر لعقدة postanalytics>
    tarantool:
        host: '0.0.0.0'
        port: 3300
    ```

### الخطوة 5: تمكين الاتصالات الواردة لوحدة Postanalytics

تستخدم وحدة Postanalytics المنفذ 3313 بشكل افتراضي، ولكن بعض منصات السحابة قد تمنع الاتصالات الواردة على هذا المنفذ.

لضمان الاندماج، سمح بالاتصالات الواردة على المنفذ 3313 أو المنفذ المخصص الخاص بك. هذه الخطوة أساسية للوحدة NGINX-Wallarm، التي تم تثبيتها بشكل منفصل، للتواصل مع مثيل Tarantool.

### الخطوة 6: إعادة تشغيل خدمات Wallarm

بعد إجراء التغييرات الضرورية، أعد تشغيل خدمات Wallarm على الجهاز الذي يستضيف وحدة Postanalytics لتطبيق التحديثات:

```
sudo systemctl restart wallarm.service
```

### الخطوة 7: تثبيت وحدة NGINX-Wallarm على خادم منفصل

بمجرد تثبيت وحدة Postanalytics على الخادم المنفصل:

1. قم بتثبيت وحدة NGINX-Wallarm على خادم مختلف وفقًا لـ [الدليل](../installation/nginx/all-in-one.md) المناسب.
1. عند إطلاق سكريبت التثبيت لوحدة NGINX-Wallarm على خادم منفصل، قم بتضمين الخيار `filtering`، على سبيل المثال:

    === "رمز API"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh filtering
        ```        

        يُحدد المتغير `WALLARM_LABELS` المجموعة التي سيتم إضافة العقدة إليها (تُستخدم لتجميع العقد منطقياً في واجهة Wallarm Console UI).

    === "رمز العقدة"
        ```bash
        # إذا كنت تستخدم الإصدار x86_64:
        sudo sh wallarm-4.10.2.x86_64-glibc.sh filtering

        # إذا كنت تستخدم الإصدار ARM64:
        sudo sh wallarm-4.10.2.aarch64-glibc.sh filtering
        ```

### الخطوة 8: اتصال وحدة NGINX-Wallarm بوحدة Postanalytics

على الجهاز الذي يحتوي على وحدة NGINX-Wallarm، في [ملف التهيئة](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) لـ NGINX، حدد عنوان الخادم لوحدة Postanalytics:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* يجب تحديد قيمة `max_conns` لكل من خوادم Tarantool العلوية لمنع إنشاء اتصالات زائدة.
* قيمة `keepalive` لا يجب أن تكون أقل من عدد خوادم Tarantool.

بمجرد تغيير ملف التهيئة، أعد تشغيل NGINX / NGINX Plus على خادم وحدة NGINX-Wallarm:

=== "ديبيان"
    ```bash
    sudo systemctl restart nginx
    ```
=== "أوبونتو"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

### الخطوة 9: تحقق من تفاعل وحدتي NGINX‑Wallarm وPostanalytics المنفصلتين

للتحقق من تفاعل وحدتي NGINX‑Wallarm وPostanalytics المنفصلتين، يمكنك إرسال الطلب مع اختبار الهجوم إلى عنوان التطبيق المحمي:

```bash
curl http://localhost/etc/passwd
```

إذا تم تكوين وحدتي NGINX‑Wallarm وPostanalytics المنفصلتين بشكل صحيح، سيتم تحميل الهجوم إلى سحابة Wallarm ويتم عرضه في قسم **الهجمات** في Wallarm Console:

![الهجمات في الواجهة](../images/admin-guides/test-attacks-quickstart.png)

إذا لم يتم تحميل الهجوم إلى السحابة، يرجى التحقق من عدم وجود أخطاء في تشغيل الخدمات:

* تحليل سجلات وحدة Postanalytics

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    إذا كان هناك مثل هذا السجل `SystemError binary: failed to bind: Cannot assign requested address، make sure that the server accepts connection on specified address and port.
* على الخادم الذي يحتوي على وحدة NGINX‑Wallarm، قم بتحليل سجلات NGINX:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    إذا كان هناك السجل `[error] wallarm: <address> connect() failed`, تأكد من أن عنوان وحدة postanalytics المنفصلة محدد بشكل صحيح في ملفات التهيئة لوحدة NGINX‑Wallarm وأن الخادم المنفصل لوحدة postanalytics يقبل الاتصال على العنوان والمنفذ المحددين.
* على الخادم الذي يحتوي على وحدة NGINX‑Wallarm، احصل على إحصاءات الطلبات المعالجة باستخدام الأمر أدناه وتأكد أن قيمة `tnt_errors` هي 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [وصف جميع المعلمات المرجعة بواسطة خدمة الإحصائيات →](configure-statistics-service.md)

## التثبيت اليدوي

### المتطلبات

--8<-- "../include/waf/installation/linux-packages/separate-postanalytics-reqs.md"

### الخطوة 1: أضف مستودعات Wallarm

تتم تثبيت وحدة Postanalytics، وكذلك وحدات Wallarm الأخرى، وتحدث من مستودعات Wallarm. لإضافة المستودعات، استخدم الأوامر المناسبة لمنصتك:

=== "debian 10.x (buster)"
    ```bash
    sudo apt -y install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

### الخطوة 2: تثبيت حزم وحدة Postanalytics

قم بتثبيت حزمة `wallarm-node-tarantool` من مستودع Wallarm لوحدة Postanalytics وقاعدة بيانات Tarantool:

=== "ديبيان"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "أوبونتو"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "CentOS أو Amazon Linux 2.0.2021x وأقل"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```

### الخطوة 3: ربط وحدة Postanalytics بسحابة Wallarm

تتفاعل وحدة Postanalytics مع سحابة Wallarm. يتعين عليك إنشاء عقدة Wallarm لوحدة Postanalytics وربط هذه العقدة بالسحابة. عند الربط، يمكنك تعيين اسم العقدة Postanalytics، تحت الذي سيتم عرضه في واجهة Wallarm Console UI ووضع العقدة في **مجموعة العقدة** المناسبة (التي تُستخدم لتنظيم عقد منطقيًا في الواجهة الأمامية). يُوصى باستخدام نفس مجموعة العقدة للعقدة التي تعالج حركة البيانات الأولية وللعقدة التي تقوم بخطوة بعد التحليل.

![العقد المجمعة](../images/user-guides/nodes/grouped-nodes.png)

لتزويد العقدة بالوصول، يلزمك توليد رمز على جانب السحابة وتحديده على الجهاز الذي يحتوي على حزم العقدة.

لربط العقدة بعد التحليل مع السحابة:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتشغيل السكريبت `register-node` على جهاز حيث تقوم بتثبيت العقدة التصفية:

    === "رمز API"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```
        
        * `<TOKEN>` هو القيمة المنسوخة من الرمز API مع الدور `Deploy`.
        * يتم استخدام المعلمة `--labels 'group=<GROUP>'` لوضع العقدة الخاصة بك في مجموعة العقدة `<GROUP>` (موجودة، أو، إذا لم تكن موجودة، ستُنشأ).

    === "رمز العقدة"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```

        * `<TOKEN>` هو القيمة المنسوخة من رمز العقدة.

    * استخدم `-H us1.api.wallarm.com` للتثبيت في السحابة الأمريكية، وإزالة هذا الخيار للتثبيت في السحابة الأوروبية.
    * قد تضيف `-n <HOST_NAME>` المعلمة لتعيين اسم مخصص لعينة العقدة الخاصة بك. سيكون الاسم النهائي للعينة: `HOST_NAME_NodeUUID`.

### الخطوة 4: تحديث تكوين وحدة Postanalytics

تقع ملفات تحكم وحدة Postanalytics في المسارات:

* `/etc/default/wallarm-tarantool` لأنظمة التشغيل Debian و Ubuntu
* `/etc/sysconfig/wallarm-tarantool` لأنظمة التشغيل CentOS و Amazon Linux 2.0.2021x وأقل

لفتح الملف في وضع التحرير، يرجى استخدام الأمر:

=== "ديبيان"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "أوبونتو"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x وأقل"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

#### الذاكرة

تستخدم وحدة Postanalytics التخزين في الذاكرة Tarantool. بالنسبة لبيئات الإنتاج، يوصى بامتلاك ذاكرة أكبر. إذا كنت تختبر العقدة Wallarm أو تمتلك حجم خادم صغير، فيمكن أن يكون الحجم الأقل كافيًا.

يتم تعيين حجم الذاكرة المخصصة بالجيجا بايت عبر الأمر `SLAB_ALLOC_ARENA` في [ملف التهيئة `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool`](#4-update-postanalytics-module-configuration). يمكن أن تكون القيمة عددًا صحيحًا أو عائمًا (النقطة `.` هي فاصلة عشرية).

تتم الإشارة إلى التوصيات المفصلة حول تخصيص الذاكرة لـ Tarantool في هذه [التعليمات](configuration-guides/allocate-resources-for-node.md).

#### عنوان الخادم المنفصل لوحدة Postanalytics

لتعيين عنوان الخادم المنفصل لوحدة  Postanalytics:

1. افتح الملف Tarantool في وضع التحرير:

    === "ديبيان"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "أوبونتو"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS أو Amazon Linux 2.0.2021x وأقل"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. قم بإلغاء التعليق على متغيرات `HOST` و`PORT` واضبط لهم القيم التالية:

    ```bash
    # العنوان والمنفذ للربط
    HOST='0.0.0.0'
    PORT=3313
    ```
3. إذا تم إعداد ملف التهيئة لـ Tarantool لقبول الاتصالات على عناوين IP مختلفة عن `0.0.0.0` أو `127.0.0.1`، فيرجى توفير العناوين في `/etc/wallarm/node.yaml`:

    ```bash
    hostname: <اسم عقدة postanalytics>
    uuid: <UUID لعقدة postanalytics>
    secret: <مفتاح السر لعقدة postanalytics>
    tarantool:
        host: '<العنوان IP لـ Tarantool>'
        port: 3313
    ```

### الخطوة 5: إعادة تشغيل خدمات Wallarm

لتطبيق الإعدادات على وحدة Postanalytics:

=== "ديبيان"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "أوبونتو"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "CentOS أو Amazon Linux 2.0.2021x وأقل"
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

### الخطوة 6: تثبيت وحدة NGINX-Wallarm على خادم منفصل

بمجرد تثبيت وحدة Postanalytics على الخادم المنفصل، قم بتثبيت وحدات Wallarm الأخرى على خادم مختلف. فيما يلي الروابط إلى التعليمات المناسبة وأسماء الحزم التي يجب تحديدها لتثبيت وحدة NGINX-Wallarm:

* [NGINX مستقر](../installation/nginx/dynamic-module.md)

    في خطوة تثبيت الحزم، قم بتحديد `wallarm-node-nginx` و`nginx-module-wallarm`.
* [NGINX Plus](../installation/nginx-plus.md)

    في خطوة التثبيت، حدد `wallarm-node-nginx` و`nginx-plus-module-wallarm`.
* [NGINX المقدم من التفعيل](../installation/nginx/dynamic-module-from-distr.md)

    في خطوة التثبيت، حدد `wallarm-node-nginx` و`libnginx-mod-http-wallarm/nginx-mod-http-wallarm`.

--8<-- "../include/waf/installation/checking-compatibility-of-separate-postanalytics-and-primary-packages.md"

### الخطوة 7: ربط وحدة NGINX-Wallarm بوحدة Postanalytics

على الجهاز الذي يحتوي على وحدة NGINX-Wallarm، في [ملف التهيئة](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) لـ NGINX، حدد عنوان الخادم لوحدة Postanalytics:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* يجب تحديد قيمة `max_conns` لكل من خوادم Tarantool العلوية لمنع إنشاء اتصالات زائدة.
* قيمة `keepalive` لا يجب أن تكون أقل من عدد خوادم Tarantool.
* السطر `# wallarm_tarantool_upstream wallarm_tarantool;` معلق بشكل افتراضي - يرجى حذف `#`.

بمجرد تغيير ملف التهيئة، أعد تشغيل NGINX / NGINX Plus على خادم وحدة NGINX-Wallarm:

=== "ديبيان"
    ```bash
    sudo systemctl restart nginx
    ```
=== "أوبونتو"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

### الخطوة 8: تحقق من تفاعل وحدتي NGINX‑Wallarm وPostanalytics المنفصلتين

للتحقق من تفاعل وحدتي NGINX‑Wallarm وPostanalytics المنفصلتين، يمكنك إرسال الطلب مع اختبار الهجوم إلى عنوان التطبيق المحمي:

```bash
curl http://localhost/etc/passwd
```

إذا تم تكوين وحدتي NGINX‑Wallarm وPostanalytics المنفصلتين بشكل صحيح، سيتم تحميل الهجوم إلى سحابة Wallarm ويتم عرضه في قسم **الهجمات** في Wallarm Console:

![الهجمات في الواجهة](../images/admin-guides/test-attacks-quickstart.png)

إذا لم يتم تحميل الهجوم إلى السحابة، يرجى التحقق من عدم وجود أخطاء في تشغيل الخدمات:

* تأكد من أن خدمة postanalytics `wallarm-tarantool` في الحالة `active`

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

   ![wallarm-tarantool status][tarantool-status]
* تحليل سجلات وحدة Postanalytics

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    إذا كان هناك مثل هذا السجل `SystemError binary: failed to bind: Cannot assign requested address`, تأكد من أن الخادم يقبل الاتصال على العنوان والمنفذ المحددين.
* على الخادم الذي يحتوي على وحدة NGINX‑Wallarm، قم بتحليل سجلات NGINX:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    إذا كان هناك السجل `[error] wallarm: <address> connect() failed`, تأكد من أن عنوان وحدة postanalytics المنفصلة محدد بشكل صحيح في ملفات التهيئة لوحدة NGINX‑Wallarm وأن الخادم المنفصل لوحدة postanalytics يقبل الاتصال على العنوان والمنفذ المحددين.
* على الخادم الذي يحتوي على وحدة NGINX‑Wallarm، احصل على إحصاءات الطلبات المعالجة باستخدام الأمر أدناه وتأكد أن قيمة `tnt_errors` هي 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [وصف جميع المعلمات المرجعة بواسطة خدمة الإحصائيات →](configure-statistics-service.md)
    
## حماية وحدة Postanalytics

!!! تحذير "حماية وحدة Postanalytics التي تم تثبيتها حديثًا"
    نوصي بشدة بحماية وحدة Postanalytics التي تم تثبيتها حديثًا باستخدام جدار الحماية. خلاف ذلك، هناك خطر في الحصول على وصول غير مصرح به إلى الخدمة والذي قد يؤدي إلى:
    
    *   الكشف عن معلومات حول الطلبات المعالجة
    *   إمكانية تنفيذ كود Lua وأوامر نظام التشغيل التعسفية
   
    يرجى ملاحظة أن مثل هذا الخطر لا يوجد إذا كانت وحدة Postanalytics تتوافق مع وحدة NGINX-Wallarm على نفس الخادم. هذا يعني أن وحدة Postanalytics ستستمع إلى المنفذ `3313`.
    
    **فيما يلي إعدادات جدار الحماية التي يجب تطبيقها على وحدة Postanalytics التي تم تثبيتها بشكل منفصل:**
    
    *   السماح بحركة مرور HTTPS من وإلى خوادم API Wallarm، بحيث يمكن لوحدة Postanalytics التفاعل مع هذه الخوادم:
        *   `us1.api.wallarm.com` هو خادم API في السحابة الأمريكية Wallarm
        *   `api.wallarm.com` هو خادم API في السحابة الأوروبية Wallarm
    *   احصر الوصول إلى منفذ `3313` Tarantool عبر بروتوكولي TCP و UDP من خلال السماح بالاتصالات فقط من عناوين IP للعقد Wallarm التصفية.

## استكشاف أخطاء Tarantool وإصلاحها

[استكشاف الأخطاء في Tarantool وإصلاحها](../faq/tarantool.md)