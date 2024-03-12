[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# تثبيت وحدة بوستاناليتكس المنفصلة

في معالجة الطلبات الخاصة بـ Wallarm، هناك مرحلتان متورطتان، بما في ذلك مرحلة بوستاناليتكس لتحليل الطلبات الإحصائية. تعتبر بوستاناليتكس ذات كثافة ذاكرة، مما قد يتطلب أدائها على خادم مخصص من أجل الأداء المحسّن. يُشرح هذا المقال كيفية تثبيت وحدة بوستاناليتكس على خادم مستقل.

الخيار لتثبيت وحدة بوستاناليتكس على خادم منفصل متاح للآتي من الآثار الفعلية لـ Wallarm:

* [الحزم الفردية للإصدار المستقر NGINX](../installation/nginx/dynamic-module.md)
* [الحزم الفردية لـ NGINX Plus](../installation/nginx-plus.md)
* [الحزم الفردية لـ NGINX المقدم من التوزيعة](../installation/nginx/dynamic-module-from-distr.md)
* [مثبّت كل في واحد](../installation/nginx/all-in-one.md)

بشكل افتراضي، يوجهك تعليمات التثبيت الخاصة بـ Wallarm لتثبيت كلا الوحدتين على نفس الخادم.

## نظرة عامة

تتألف معالجة الطلبات في عقدة Wallarm من مرحلتين:

* المعالجة الأولية في وحدة NGINX-Wallarm، والتي ليست بحاجة إلى الذاكرة ويمكن تنفيذها على خوادم الواجهة الأمامية دون تغيير متطلبات الخادم.
* التحليل الإحصائي للطلبات المعالجة في وحدة البوستانالتكس التي تتطلب الذاكرة.

تصور الخطط أدناه تفاعل الوحدة في سيناريوين: عند التثبيت على نفس الخادم وعلى خوادم مختلفة.

=== "NGINX-Wallarm والبوستانالتكس على خادم واحد"
    ![تدفق المرور بين البوستانالتكس وnginx-wallarm](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "NGINX-Wallarm والبوستانالتكس على خوادم مختلفة"
    ![تدفق المرور بين البوستانالتكس وnginx-wallarm](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## طرق التثبيت

يمكنك تثبيت وحدة البوستانالتكس على خادم منفصل بطريقتين مختلفتين:

* [باستخدام المثبت كل في واحد](#all-zu-in-one-automatic-installation) (متاح بدءًا من عقدة Wallarm 4.6) - يلغي الكثير من الأنشطة ويجعل نشر وحدة البوستانالتكس أسهل بكثير. لذا، هذه هي طريقة التثبيت الموصى بها.
* [بشكل يدوي](#manual-installation) - استخدم هذه الأخيرة للإصدارات القديمة من العقدة.

عند تثبيت وحدتي التصفية والبوستانالتكس بشكل منفصل، يمكنك دمج الأساليب اليدوية والأوتوماتيكية: قم بتثبيت الجزء البوستانالتكس يدويًا ثم الجزء التصفية بإستخدام المثبت كل في واحد، وعلى العكس بالعكس: الجزء البوستانالتكس باستخدام المثبت كل في واحد ثم الجزء التصفية يدويًا.

## التثبيت الأوتوماتيكي كل في واحد

بدءًا من عقدة Wallarm 4.6، لتثبيت البوستانالتكس بشكل منفصل، يوصى باستخدام [تثبيت كل في واحد](../installation/nginx/all-in-one.md#launch-options) الذي يلغي الكثير من الأنشطة ويجعل نشر وحدة بوستانالتكس أسهل بكثير.

### المتطلبات

--8<-- "../include/waf/installation/all-in-one/separate-postanalytics-reqs.md"

### الخطوة 1: قم بتنزيل مثبت Wallarm كل في واحد

لتنزيل نص البيانات التثبيتي لـ Wallarm كل في واحد، قم بتنفيذ الأمر:

=== "الإصدار x86_64"
    ```bash
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.1.x86_64-glibc.sh
    ```
=== "الإصدار ARM64"
    ```bash
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.1.aarch64-glibc.sh
    ```

### الخطوة 2: إعداد رمز Wallarm

لتثبيت العقدة، ستحتاج إلى رمز Wallarm من ال[نوع المناسب][wallarm-token-types]. لإعداد الرمز:

=== "رمز API"

    1. افتح Wallarm Console → **Settings** → **API tokens** في ال[US Cloud](https://us1.my.wallarm.com/settings/api-tokens) أو [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز API مع دور المنبع `Deploy`.
    1. قم بنسخ هذا الرمز.

=== "رمز العقدة"

    1. افتح Wallarm Console → **Nodes** في ال[US Cloud](https://us1.my.wallarm.com/nodes) أو [EU Cloud](https://my.wallarm.com/nodes).
    1. افعل واحدة من التالي:
        * أنشئ العقدة من نوع **Wallarm node** وانسخ الرمز المُنشأ.
        * استخدم مجموعة العقد الموجودة - انسخ الرمز باستخدام قائمة العقد → **Copy token**.

### الخطوة 3: تشغيل مثبت Wallarm كل في واحد لتثبيت البوستانالتكس

لتثبيت البوستانالتكس بشكل منفصل مع المثبت كل في واحد، استخدم:

=== "رمز API"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh postanalytics
    ```        

    تحدد المتغير `WALLARM_LABELS` المجموعة التي ستتم إضافة العقدة إليها (يتم استخدامها لتجميع العقد بطريقة منطقية في واجهة Wallarm Console).

=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo sh wallarm-4.10.1.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم النسخة ARM64:
    sudo sh wallarm-4.10.1.aarch64-glibc.sh postanalytics
    ```

### الخطوة 4: قم بتكوين وحدة البوستانالتكس

#### الموارد والذاكرة

لتغيير كمية الذاكرة التي يستخدمها Tarantool، ابحث عن إعداد `SLAB_ALLOC_ARENA` في ملف `/opt/wallarm/env.list`. يتم تعيينه لاستخدام 1 جيجابايت افتراضيًا. إذا كنت بحاجة إلى تغيير هذا، يمكنك ضبط الرقم ليتوافق مع كمية الذاكرة التي يحتاجها Tarantool فعليًا. للمساعدة في تحديد كمية الذاكرة، راجع [التوصيات](configuration-guides/allocate-resources-for-node.md) الخاصة بنا.

لتغيير الذاكرة المخصصة:

1. افتح للتحرير ملف `/opt/wallarm/env.list`:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. ضبط سمة `SLAB_ALLOC_ARENA` على حجم الذاكرة. يمكن أن يكون القيمة عدد صحيح أو عدد عائم (النقطة `.` هي فاصلة عشرية). على سبيل المثال:

    ```
    SLAB_ALLOC_ARENA=2.0
    ```

#### الكمبيوتر المضيف والمنفذ

بشكل افتراضي، يتم تعيين وحدة البوستانالتكس لقبول الاتصالات على جميع عناوين IPv4 للمضيف (0.0.0.0) باستخدام المنفذ 3313. يُوصى بالاحتفاظ بالتكوين الافتراضي ما لم يكن التغيير ضروريًا.

ومع ذلك، إذا كنت بحاجة إلى تغيير التكوين الافتراضي:

1. افتح للتعديل ملف `/opt/wallarm/env.list`:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. تحديث القيم `HOST` و`PORT` كما هو مطلوب. حدد متغير `PORT` إذا لم يتم تحديده بالفعل، على سبيل المثال:

    ```bash
    # tarantool
    HOST=0.0.0.0
    PORT=3300
    ```
1. افتح للتعديل ملف `/opt/wallarm/etc/wallarm/node.yaml`:

    ```bash
    sudo vim /opt/wallarm/etc/wallarm/node.yaml
    ```
1. أدخل القيم `host` و`port` الجديدة لمعلمات `tarantool`، كما هو موضح أدناه:

    ```yaml
    hostname: <name of postanalytics node>
    uuid: <UUID of postanalytics node>
    secret: <secret key of postanalytics node>
    tarantool:
        host: '0.0.0.0'
        port: 3300
    ```

### الخطوة 5: تمكين الاتصالات الواردة لوحدة البوستانالتكس

تستخدم وحدة البوستانالتكس المنفذ 3313 بشكل افتراضي، ولكن بعض برامج الحماية قد تعترض الاتصالات الواردة على هذا المنفذ.

من أجل ضمان التكامل، قم بالسماح بالاتصالات الواردة على المنفذ 3313 أو منفذك المخصص. هذه الخطوة ضرورية لتكوين وحدة NGINX-Wallarm، التي تم تثبيتها بشكل منفصل، للاتصال بمثيل Tarantool.

### الخطوة 6: إعادة تشغيل خدمات Wallarm

بعد إجراء التغييرات اللازمة، أعد تشغيل خدمات Wallarm على الجهاز الذي يستضيف وحدة بوستانالتكس لتطبيق التحديثات:

```
sudo systemctl restart wallarm.service
```

### الخطوة 7: قم بتثبيت وحدة NGINX-Wallarm على خادم منفصل

بمجرد تثبيت وحدة بوستانالتكس على الخادم المنفصل:

1. قم بتثبيت وحدة NGINX-Wallarm على خادم مختلف وفقًا لل[دليل](../installation/nginx/all-in-one.md).
1. عند تشغيل النص البيانات التثبيتي لوحدة NGINX-Wallarm على خادم منفصل، قم بتضمين الخيار `filtering`، على سبيل المثال:

    === "رمز API"
        ```bash
        # إذا كانت النسخة هي x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh filtering

        # إذا كانت النسخة هي ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh filtering
        ```        

        يُحدد المتغير `WALLARM_LABELS` المجموعة التي سيتم إضافة العقدة إليها (يتم استخدامها لتجميع العقد بطريقة منطقية في واجهة Wallarm Console).

    === "رمز العقدة"
        ```bash
        # إذا كانت النسخة x86_64:
        sudo sh wallarm-4.10.1.x86_64-glibc.sh filtering

        # إذا كانت النسخة ARM64:
        sudo sh wallarm-4.10.1.aarch64-glibc.sh filtering
        ```

### الخطوة 8: قم بتوصيل وحدة NGINX-Wallarm بوحدة بوستانالتكس

على الجهاز الذي يحتوي على وحدة NGINX-Wallarm، في ملف التكوينات الخاص بـ NGINX، حدد عنوان الخادم الخاص بوحدة البوستانالتكس:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* يجب تحديد قيمة `max_conns` لكل من خوادم Tarantool العليا لمنع إنشاء اتصالات زائدة.
* لا يجب أن تكون قيمة `keepalive` أقل من عدد خوادم Tarantool.

بمجرد تغيير ملف التكوين، قم بإعادة تشغيل NGINX/NGINX Plus على خادم وحدة NGINX-Wallarm:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
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

### الخطوة 9: تحقق من تفاعل وحدات NGINX‑Wallarm والبوستانالتكس المنفصلة

للتحقق من تفاعل وحدات NGINX‑Wallarm والبوستانالتكس المنفصلة، يمكنك إرسال الطلب مع الاختبار الهجومي إلى عنوان التطبيق المحمي:

```bash
curl http://localhost/etc/passwd
```

إذا تم تكوين وحدات NGINX‑Wallarm والبوستانالتكس المنفصلة بشكل صحيح، سيتم تحميل الهجوم إلى الـ Cloud الخاص بـ Wallarm وسيتم عرضه في قسم **Attacks** في Wallarm Console:

![هجمات في الواجهة](../images/admin-guides/test-attacks-quickstart.png)

إذا لم يتم تحميل الهجوم الإلى الـ Cloud، فيرجى التحقق من أنه لا توجد أخطاء في تشغيل الخدمات:

* قم بتحليل سجلات وحدة البوستانالتكس

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    إذا كانت هناك سجل مثل `SystemError binary: failed to bind: Cannot assign requested address`، تأكد من أن الخادم يقبل الاتصال على العنوان والمنفذ المحددين.
* على خادم وحدة NGINX‑Wallarm، قم بتحليل سجلات NGINX:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    إذا هناك سجل مثل `[error] wallarm: <address> connect() failed`, تأكد من أن عنوان وحدة البوستانالتكس المنفصلة محدد بشكل صحيح في ملفات تكوين وحدة NGINX‑Wallarm وأن خادم البوستانالتكس المنفصل يقبل الاتصال على العنوان والمنفذ المحددين.
* على الخادم الذي يحتوي على وحدة NGINX‑Wallarm، احصل على الإحصائيات على الطلبات المعالجة باستخدام الأمر الموجود أدناه وتأكد من أن قيمة `tnt_errors` هي 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [الوصف الكامل لكل المعلمات التي تم إعادتها بواسطة خدمة الإحصائيات →](configure-statistics-service.md)

## التثبيت اليدوي

### المتطلبات

--8<-- "../include/waf/installation/linux-packages/separate-postanalytics-reqs.md"

### الخطوة 1: إضفة مستودعات Wallarm

وحدة البوستانالتكس، مثل وحدات Wallarm الأخرى، يتم تثبيتها وتحديثها من المستودعات الخاصة بـ Wallarm. لإضافة المستودعات، استخدم الأوامر بالنسبة لوحدة التحكم الخاصة بك:

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
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

### الخطوة 2: تثبيت حزم لوحدة البوستانالتكس

قم بتثبيت حزمة `wallarm-node-tarantool` من مستودع Wallarm لوحدة البوستانالتكس وقاعدة بيانات Tarantool:

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```

### الخطوة 3: اتصل بوحدة البوستانالتكس بـ Wallarm Cloud

تتفاعل وحدة البوستانالتكس مع Wallarm Cloud. يُطلب إنشاء عقدة Wallarm لوحدة البوستانالتكس وربط هذه العقدة بـ Cloud. عند الاتصال، يمكنك تعيين اسم عقدة البوستانالتكس، حيث سيتم عرضها في واجهة استخدام عقدة Wallarm ووضع العقدة في **مجموعة العقود** المناسبة (تُستخدم لتنظيم العقد بطريقة منطقية في الواجهة الرسومية). يُوصى باستخدام نفس مجموعة العقد لعقدة المعالجة الأولية وعقدة الأداء البوست.

![عقد مجمعة](../images/user-guides/nodes/grouped-nodes.png)

لتوفير الوصول للعقدة، تحتاج إلى إنشاء رمز في جانب الـ Cloud وتحديده على الجهاز المحتوي على حزم العقدة.

لتوصيل عقدة التصفية بوستانالتكس إلى الـ Cloud:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتشغيل النص البيانات register-node على جهاز تقوم فيه بتثبيت العقدة التصفية:

    === "رمز API"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```
        
        * `<TOKEN>` هو القيمة المنسوخة للرمز API مع دور المنبع `Deploy`.
        * `'تحدد المعلمة --labels 'group=<GROUP>' يجعل العقدة الخاصة بك تنضم إلى المجموعة <GROUP> (الموجودة، أو، إذا كانت غير موجودة، سيتم إنشاؤها).

    === "رمز العقدة"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```

        * `<TOKEN>` هو القيمة المنسوخة لرمز العقدة.

    * استخدم `-H us1.api.wallarm.com` للتثبيت في US Cloud، قم بإزالة هذا الخيار للتثبيت في EU Cloud.
    * قد تضيف `-n <HOST_NAME>` كمعلمة لتعيين اسم مخصص لنسخة العقدة الخاصة بك. اسم النسخة النهائي سيكون: `HOST_NAME_NodeUUID`.

### الخطوة 4: قم بتحديث تكوين وحدة البوستانالتكس

ملفات تكوين وحدة البوستانالتكس تقع في المسارات:

* `/etc/default/wallarm-tarantool` لأنظمة التشغيل Debian وUbuntu
* `/etc/sysconfig/wallarm-tarantool` لأنظمة التشغيل CentOS وأمازون لينكس 2.0.2021x والأصدارات الأقل

لفتح الملف في وضع التحرير، رجاءاً استخدم الأمر:

=== "Debian"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
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

تستخدم وحدة بوستانالتكس التخزين في الذاكرة مع Tarantool. بالنسبة لبيئات الإنتاج، يوصى بتوفير كمية أكبر من الذاكرة. إذا كنت تختبر العقدة Wallarm أو لديك حجم خادم صغير، قد يكون الحجم الأقل كافًا.

تتم إعداد حجم الذاكرة المخصصة في الجيجابايت لكل عبر العداد `SLAB_ALLOC_ARENA` في ملف التكوين [`/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool`](#4-update-postanalytics-module-configuration). يمكن أن يكون القيم رقمًا صحيحًا أو رقمًا عائمًا (النقطة `.` هي فاصلة عشرية).

التوصيات التفصيلية حول تخصيص الذاكرة لـ Tarantool موصوحة في هذه [التعليمات](configuration-guides/allocate-resources-for-node.md).

#### عنوان الخادم البوستانالتكس المنفصل

لتعيين عنوان الخادم البوستانالتكس المنفصل:

1. افتح ملف Tarantool في وضع التحرير:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
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

2. احذف التعليقات من المتغيرات `HOST` و`PORT` وقم بتعيينهم على القيم التالية:

    ```bash
    # address and port for bind
    HOST='0.0.0.0'
    PORT=3313
    ```
3. إذا تم تعيين ملف التهيئة الخاص بـ Tarantool لقبول الاتصالات على العناوين IP المختلفة عن `0.0.0.0` أو `127.0.0.1`، دونها فى `/etc/wallarm/node.yaml`:

    ```bash
    hostname: <name of postanalytics node>
    uuid: <UUID of postanalytics node>
    secret: <secret key of postanalytics node>
    tarantool:
        host: '<IP address of Tarantool>'
        port: 3313
    ```

### الخطوة 5: إعادة تشغيل خدمات Wallarm

لتطبيق الإعدادات على وحدة البوستانالتكس:

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

### الخطوة 6: قم بتثبيت وحدة NGINX-Wallarm على خادم منفصل

متى تم تثبيت وحدة البوستانالتكس على الخادم المنفصل، قم بتثبيت وحدات Wallarm الأخرى على خادم مختلف. بالأسفل هام الروابط لوحدة التعليمات المقابلة وأسمائها الجديدة الخاصة بـ NGINX-Wallarm التي تم تحديدها لتثبيت وحدة NGINX-Wallarm:

* [NGINX stable](../installation/nginx/dynamic-module.md)

    في خطوة تثبيت الحزم، حدد `wallarm-node-nginx` و`nginx-module-wallarm`.
* [NGINX Plus](../installation/nginx-plus.md)

    في خطوة تثبيت الحزم، حدد `wallarm-node-nginx` و`nginx-plus-module-wallarm`.
* [توزيعة نسخة الـ NGINX](../installation/nginx/dynamic-module-from-distr.md)

    في خطوة تثبيت الحزم، حدد `wallarm-node-nginx`و `libnginx-mod-http-wallarm/nginx-mod-http-wallarm`.

--8<-- "../include/waf/installation/checking-compatibility-of-separate-postanalytics-and-primary-packages.md"

### الخطوة 7: قم بتوصيل وحدة NGINX-Wallarm بوحدة البوستانالتكس

على الجهاز الذي يحتوي على وحدة NGINX-Wallarm، في ملف تكوينات NGINX، حدد عنوان الخادم الخاص بوحدة البوستانالتكس:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* يجب تحديد قيمة `max_conns` لكل من خوادم Tarantool العليا لمنع إنشاء اتصالات زائدة.
* قيمة `keepalive` يجب أن لا تكون أقل من عدد خوادم Tarantool.
* الجملة `# wallarm_tarantool_upstream wallarm_tarantool;` يتم الغائها بواقع افتراضي - يرجى حذف `#`.

بمجرد تغيير ملف التكوين، قم بإعادة تشغيل NGINX/NGINX Plus على خادم وحدة NGINX-Wallarm:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
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

### الخطوة 8: تحقق من تفاعل وحدات NGINX‑Wallarm والبوستانالتكس المنفصلة

للتحقق من تفاعل وحدات NGINX‑Wallarm والبوستانالتكس المنفصلة، يمكنك إرسال طلب مع الهجوم الاختبار إلى عنوان التطبيق المحمي:

```bash
curl http://localhost/etc/passwd
```

إذا تم تكوين وحدات NGINX‑Wallarm والبوستانالتكس المنفصلة بشكل صحيح، سيتم تحميل الهجوم إلى الـ Cloud الخاص بـ Wallarm وسيتم عرضه في قسم **Attacks** في Wallarm Console:

![هجمات في الواجهة](../images/admin-guides/test-attacks-quickstart.png)

إذا لم يتم تحميل الهجوم إلى الـ Cloud، يرجى التحقق من أنه لا توجد أخطاء في تشغيل الخدمات:

* تأكد من أن خدمة البوستانالتكس `wallarm-tarantool` في الحالة `active`

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![الحالة wallarm-tarantool][tarantool-status]
* قم بتحليل سجلات وحدة البوستانالتكس

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    إذا كانت هناك سجل مثل `SystemError binary: failed to bind: Cannot assign requested address`, تأكد من أن الخادم يقبل الاتصال على العنوان والمنفذ المحددين.
* على خادم وحدة NGINX‑Wallarm، قم بتحليل سجلات NGINX:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    إذا كانت هناك سجل مثل `[error] wallarm: <address> connect() failed`, تأكد من أن عنوان وحدة البوستانالتكس المنفصلة هو مشخص بشكل صحيح في ملفات التهيئة الخاصة بوحدة NGINX‑Wallarm وأن خادم البوستانلاتك المنفصل يقبل الاتصال على العنوان والمنفذ المحددين.
* على الخادم الذي يحتوي على وحدة NGINX‑Wallarm، احصل على الإحصائيات على الطلبات المعالجة باستخدام الأمر الموجود أدناه وتأكد من أن القيمة `tnt_errors` هي 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [الوصف الكامل لكل المعلمات التي تم إعادتها بواسطة خدمة الإحصائيات →](configure-statistics-service.md)

## حماية وحدة البوستانالتكس

!!! التحذير "حماية وحدة البوستانالتكس المثبتة حديثًا"
    نوصي بشدة بحماية وحدة البوستانالتكس التي تم تحثيتها حديثًا بواسطة جدار حماية. وإلا، هناك خطر من الحصول على الوصول غير المصرح به إلى الخدمة التي قد تؤدي إلى:
    
    *   الكشف عن معلومات حول الطلبات المعالجة
    *   إمكانية تنفيذ كود Lua وأوامر نظام التشغيل بشكل تعسفي
   
    يُرجى ملاحظة أن هذا الخطر غير موجود إذا كنت تقوم بتجهيز وحدة البوستانالتكس بجانب وحدة NGINX-Wallarm على نفس الخادم. هذا صحيح لأن وحدة بوستانالتكس ستستمع إلى المنفذ `3313`.
    
    **إليك إعدادات الجدار الناري التي يجب تطبيقها على وحدة البوستانالتكس المثبتة بشكل منفصل:**
    
    *   السماح بحركة مرور HTTPS من وإلى خوادم API الخاصة بـ Wallarm، بحيث يمكن لوحدة البوستانالتكس التفاعل مع هذه الخوادم:
        *   `us1.api.wallarm.com` هو خادم API في US Wallarm Cloud
        *   `api.wallarm.com` هو خادم API في EU Wallarm Cloud
    *   قيد الوصول إلى منفذ `3313` Tarantool عبر بروتوكولات TCP و UDP بواسطة السماح بالاتصالات فقط من عناوين IP لعقد تصفية Wallarm.

## معالجة المشكلات في Tarantool

[معالجة المشكلات في Tarantool](../faq/tarantool.md)