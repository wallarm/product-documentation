[img-collectd-nagios]:      ../../images/monitoring/collectd-nagios.png

[link-nagios]:              https://www.nagios.org/
[link-nagios-core]:         https://www.nagios.org/downloads/nagios-core/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios-core-install]: https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html
[link-nrpe-docs]:           https://github.com/NagiosEnterprises/nrpe/blob/master/README.md
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-collectd-docs]:       https://collectd.org/documentation/manpages/collectd-nagios.1.shtml
[link-nrpe-readme]:         https://github.com/NagiosEnterprises/nrpe
[link-nrpe-pdf]:            https://assets.nagios.com/downloads/nagioscore/docs/nrpe/NRPE.pdf
[link-metric]:              ../../admin-en/monitoring/available-metrics.md#number-of-requests

[doc-gauge-abnormal]:        available-metrics.md#number-of-requests
[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[anchor-header-7]:          #7-add-commands-to-the-nrpe-service-configuration-file-on-the-filter-node-to-get-the-required-metrics

# تصدير المقاييس إلى Nagios عبر أداة `collectd-nagios`

تقدم هذه الوثيقة مثالًا على تصدير مقاييس العقدة الفلترة إلى نظام المراقبة [Nagios][link-nagios] (يوصى بإصدار [Nagios Core][link-nagios-core]؛ ومع ذلك، فإن هذه الوثيقة مناسبة لأي إصدار من Nagios) باستخدام أداة [`collectd-nagios`][link-collectd-nagios].

!!! info "الافتراضات والمتطلبات"
    * يجب تكوين خدمة `collectd` للعمل عبر Unix domain socket (راجع [هنا][doc-unixsock] للتفاصيل).
    * نفترض بأنك قد قمت بالفعل بتثبيت نسخة Nagios Core.

        إذا لم يكن الأمر كذلك، قم بتثبيت Nagios Core (على سبيل المثال، اتبع هذه [التعليمات][link-nagios-core-install]).
    
        يمكنك استخدام نسخة أخرى من Nagios إذا لزم الأمر (على سبيل المثال، Nagios XI).
        
        سيتم استخدام مصطلح "Nagios" هنا للإشارة إلى أي إصدار من Nagios، ما لم يتم تحديد خلاف ذلك.
        
    * يجب أن يكون لديك القدرة على الاتصال بعقدة الفلتر والمضيف Nagios (على سبيل المثال، عبر بروتوكول SSH)، والعمل تحت حساب `root` أو حساب آخر مع حقوق المستخدم الخارق.
    * يجب تثبيت خدمة [Nagios Remote Plugin Executor][link-nrpe-docs] (التي سيتم الإشارة إليها باسم *NRPE* طوال هذا المثال) على عقدة الفلتر.

## سير العمل في المثال

--8<-- "../include/monitoring/metric-example.md"

![سير العمل في المثال][img-collectd-nagios]

تم استخدام مخطط التنصيب التالي في هذه الوثيقة:
* تم تنصيب عقدة فلتر Wallarm على مضيف يمكن الوصول إليه عبر عنوان الـ IP `10.0.30.5` واسم المجال المتأهل بالكامل `node.example.local`.
* تم تثبيت Nagios على مضيف منفصل يمكن الوصول إليه عبر عنوان الـ IP `10.0.30.30`.
* لتنفيذ الأوامر على مضيف بعيد، يتم استخدام البرنامج المساعد NRPE. البرنامج يتألف من
    * خدمة `nrpe` التي يتم تثبيتها على المضيف المراقب بجانب عقدة الفلتر. وهو يستمع على المنفذ NRPE القياسي `5666/TCP`.
    * برنامج `check_nrpe` NRPE Nagios المساعد الذي يتم تثبيته على المضيف Nagios ويتيح لـ Nagios تنفيذ الأوامر على المضيف البعيد حيث يتم تثبيت خدمة `nrpe`.
* سيتم استخدام NRPE لاستدعاء أداة `collectd_nagios` التي توفر المقاييس `collectd` بتنسيق متوافق مع Nagios.

## تكوين تصدير المقاييس إلى Nagios

!!! info "ملاحظة حول هذا المثال للتثبيت"
    توضح هذه الوثيقة كيفية تثبيت وتكوين البرنامج المساعد NRPE عند تثبيت Nagios بالمعلمات الافتراضية (يفترض ان يتم تثبيت Nagios في الدليل`/usr/local/nagios`، ويستخدم المستخدم `nagios` للتشغيل). إذا كنت تقوم بتثبيت غير افتراضي للبرنامج المساعد أو Nagios، فعدل الأوامر والتعليمات المقابلة من الوثيقة حسب الحاجة.

لتكوين تصدير المقاييس من عقدة الفلتر إلى Nagios، اتبع هذه الخطوات:

### 1. قم بتكوين NRPE للتواصل مع المضيف Nagios

للقيام بذلك، على مضيف عقدة الفلتر: 
1. افتح ملف التكوين NRPE (الافتراضي: `/usr/local/nagios/etc/nrpe.cfg`).

2. قم بإضافة عنوان IP أو اسم النطاق المتأهل بالكامل للخادم Nagios إلى توصية `allowed_hosts` في هذا الملف. على سبيل المثال، إذا كان نظام Nagios يستخدم عنوان IP `10.0.30.30`:

    ```
    allowed_hosts=127.0.0.1,10.0.30.30
    ```
3.  أعد تشغيل خدمة NRPE عن طريق تنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/nrpe-restart-2.16.md"

### 2. قم بتثبيت برنامج الـ Nagios NRPE الإضافي على المضيف Nagios

للقيام بذلك، على المضيف Nagios، قم باتخاذ الخطوات التالية:
1. قم بتنزيل وفك ضغط ملفات المصدر للبرنامج المساعد NRPE، وتثبيت الأدوات الضرورية لإنشاء وتثبيت البرنامج المساعد (راجع [توثيق NRPE][link-nrpe-docs] للتفاصيل).
2. اذهب إلى الدليل مع ملفات المصدر للبرنامج المساعد، قم بإنشاء من المصادر، ثم قم بتثبيت البرنامج المساعد.

    الخطوات الدنيا للأخذ هي:
    
    ```
    ./configure
    make all
    make install-plugin
    ```
    
### 3. تأكد من تفاعل الـ NRPE Nagios Plugin بنجاح مع خدمة NRPE

للقيام بذلك، نفذ الأمر التالي على مضيف Nagios:

``` bash
/usr/local/nagios/libexec/check_nrpe -H node.example.local
```

إذا كان NRPE يعمل بشكل طبيعي، يجب أن يحتوي ناتج الأمر على نسخة NRPE (على سبيل المثال، `NRPE v3.2.1`).

### 4. حدد أمر `check_nrpe` لتشغيل البرنامج المكون الإضافي NRPE Nagios بواسطة واحدة من الحجج على مضيف Nagios

للقيام بذلك، قم بإضافة السطور التالية إلى ملف `/usr/local/nagios/etc/objects/commands.cfg`:

    ```
    define command{
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
    }
    ```

### 5. قم بتثبيت أداة `collectd_nagios` على مضيف عقدة الفلتر

قم بتنفيذ أحد الأوامر التالية:

--8<-- "../include/monitoring/install-collectd-utils.md"

### 6. قم بتكوين أداة `collectd-nagios` لتشغيل بصلاحيات مرتفعة نيابة عن المستخدم `nagios`

للقيام بذلك، قم بأخذ الخطوات التالية على مضيف عقدة الفلتر:
1. باستخدام أداة [`visudo`][link-visudo]، قم بإضافة السطر التالي إلى ملف `/etc/sudoers`:

    ```
    nagios ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
    ```
    
    يتيح هذا لمستخدم `nagios` تشغيل أداة `collectd-nagios` بصلاحيات المستخدم الخارق باستخدام `sudo` دون الحاجة لتقديم أي كلمات مرور.

    
    !!! info "تشغيل `collectd-nagios` بصلاحيات المستخدم المستخدم الخارق"
        يجب تشغيل الأداة بصلاحيات المستخدم الخارق لأنها تستخدم مأخذ النطاق الخاص بـ `collectd` Unix لتلقي البيانات. فقط المستخدمون الخارقون يمكنهم الوصول إلى هذا المأخذ.

2. تأكد من أن المستخدم `nagios` يمكنه تلقي قيم المقياس من `collectd` بتنفيذ الأمر الاختباري التالي:
    
    ```
    sudo -u nagios sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
    ```
    
    يتيح هذا الأمر للمستخدم `nagios` الحصول على قيمة متريك [`curl_json-wallarm_nginx/gauge-abnormal`][link-metric] (عدد الطلبات المعالجة) لمضيف `node.example.local`.
    
    **مثال على الناتج الأمر:**
    
    ```
    OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
    ```

3. أضف عنوانًا إلى ملف التكوين الخدمة NRPE بحيث سيكون قادرًا على تنفيذ الأوامر باستخدام أداة الـ `sudo`:
    
    ```
    command_prefix=/usr/bin/sudo
    ```

### 7. قم بإضافة الأوامر إلى ملف تكوين خدمة NRPE على عقدة الفلتر للحصول على المقاييس المطلوبة

على سبيل المثال، لإنشاء أمر يدعى `check_wallarm_nginx_abnormal` سيتلقى المقياس
`curl_json-wallarm_nginx/gauge-abnormal` لعقدة الفلتر مع الاسم المتأهل بالكامل `node.example.local`, أضف السطر التالي إلى ملف تكوين خدمة NRPE:

    ```
    command[check_wallarm_nginx_abnormal]=/usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
    ```

!!! info "كيفية تعيين قيم العتبة للمقياس"
    إذا كان ذلك ضروريًا، يمكنك تحديد نطاق القيم الذي ستعود الأداة `collectd-nagios` بحالة `WARNING` أو `CRITICAL` باستخدام الخيارات المقابلة `-w` و `-c` (متوفر معلومات تفصيلية في وثائق الأداة [التوثيق][link-collectd-docs]).


بعد أن تقوم بإضافة كل الأوامر اللازمة إلى ملف تكوين خدمة NRPE، أعد تشغيل الخدمة بتنفيذ الأمر المناسب:

--8<-- "../include/monitoring/nrpe-restart-2.16.md"

### 8. على مضيف Nagios، استخدم ملفات التكوين لتحديد مضيف عقدة الفلتر وتعريف الخدمات للرصد.

!!! info "الخدمات والمقاييس"
    تفترض هذه الوثيقة أن خدمة واحدة من Nagios تساوي قيمة واحدة.


على سبيل المثال، يمكن القيام بذلك على النحو التالي:
1. قم بإنشاء ملف `/usr/local/nagios/etc/objects/nodes.cfg` بالمحتوى التالي:
    
    ```
    define host{
     use linux-server
     host_name node.example.local
     address 10.0.30.5
    }

    define service {
      use generic-service
      host_name node.example.local
      check_command check_nrpe!check_wallarm_nginx_abnormal
      max_check_attempts 5
      service_description wallarm_nginx_abnormal
    }
    ```

    يعرف هذا الملف المضيف `node.example.local` مع عنوان IP `10.0.30.5` والأمر للتحقق من حالة الخدمة `wallarm_nginx_abnormal`، التي تعني تلقي المقياس `curl_json-wallarm_nginx/gauge-abnormal` من عقدة الفلتر (اذهب للوصف الأمر [`check_wallarm_nginx_abnormal`][anchor-header-7]).

2. أضف السطر التالي إلى ملف تكوين Nagios (افتراضيًا، `/usr/local/nagios/etc/nagios.cfg`):
    
    ```
    cfg_file=/usr/local/nagios/etc/objects/nodes.cfg
    ```
    
    يتعين هذا ليتمكن Nagios من بدء استخدام بيانات ملف `nodes.cfg` عند البدء القادم.

3. قم بإعادة تشغيل خدمة Nagios بتشغيل الأمر المناسب:

--8<-- "../include/monitoring/nagios-restart-2.16.md"

## اكتملت الإعدادات

يقوم الآن Nagios بمراقبة الخدمة المرتبطة بالمقياس المحدد من عقدة الفلتر. إذا لزم الأمر، يمكنك تعريف أوامر وخدمات أخرى للتحقق من المقاييس التي تهمك.


!!! info "معلومات حول NRPE"
    مصادر المعلومات الإضافية حول NRPE:
    
    *   [README][link-nrpe-readme] لـ NRPE على GitHub;
    *   توثيق NRPE ([PDF][link-nrpe-pdf]).
