#   كيفية جلب القياسات

هذه التعليمات تصف الطرق لجمع القياسات من عقدة التصفية.

##  تصدير القياسات مباشرة من `collectd`

يمكنك تصدير القياسات التي جمعها `collectd` مباشرة إلى الأدوات التي تدعم العمل مع تيارات بيانات `collectd`.

!!! warning "المتطلبات الأولية"
    يجب أداء جميع الخطوات التالية كمستخدم ذو امتيازات عالية (على سبيل المثال، `root`).

### تصدير القياسات عبر ضافة `collectd network`

قم بتكوين وتوصيل [ضافة الشبكة][link-network-plugin] بـ `collectd`:
1.  في دليل `/etc/collectd/collectd.conf.d/`، أنشئ ملفًا بامتداد `.conf` (على سبيل المثال، `export-via-network.conf`) والمحتوى التالي:

    ```
    LoadPlugin network
    
    <Plugin "network">
      Server "عنوان IPv4/v6 للخادم أو FQDN" "منفذ الخادم"
    </Plugin>
    ```

    كما هو مذكور في هذا الملف، سيتم تحميل الضافة عند بدء `collectd`، وتشغيلها في وضع العميل، وإرسال بيانات القياسات من عقدة التصفية إلى الخادم المحدد.
    
2.  تكوين خادم سيستقبل البيانات من عميل `collectd`. الخطوات الضرورية للتكوين تعتمد على الخادم المختار (انظر الأمثلة لـ [`collectd`][link-collectd-networking] و [InfluxDB][link-influxdb-collectd]).
    
    
    !!! info "العمل مع ضافة الشبكة"
        تعمل ضافة الشبكة عبر بروتوكول UDP (انظر إلى [وثائق الضافة][link-network-plugin-docs]). تأكد من أن الخادم يسمح بالاتصالات عبر UDP حتى تكون جمع القياسات فعالة.
         
3.  أعد تشغيل خدمة `collectd` بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

!!! info "مثال"
    اقرأ [مثالًا عن تصدير القياسات][doc-network-plugin-example] إلى InfluxDB عبر ضافة الشبكة مع تصور القياسات بعد ذلك في Grafana.

### تصدير القياسات عبر ضافات كتابة `collectd`
لتكوين تصدير القياسات عبر [ضافات الكتابة `collectd`][link-plugin-table]، اطلع على وثائق الضافة المناسبة.


!!! info "مثال"
    للحصول على معلومات أساسية حول استخدام ضافات الكتابة، اقرأ [مثالًا عن تصدير القياسات][doc-write-plugin-example] إلى Graphite مع تصور القياسات بعد ذلك في Grafana.

##  تصدير القياسات باستخدام أداة `collectd-nagios`

لتصدير القياسات باستخدام هذه الطريقة:

1.  قم بتثبيت أداة `collectd-nagios` على مضيف يحتوي على عقدة تصفية بتشغيل الأمر المناسب (لعقدة تصفية مثبتة على Linux):

    --8<-- "../include/monitoring/install-collectd-utils.md"

    !!! info "صورة Docker"
        تأتي صورة Docker لعقدة التصفية مع أداة `collectd-nagios` مثبتة مسبقًا.

2.  تأكد من أنه يمكنك تشغيل هذه الأداة بصلاحيات مرتفعة إما نيابة عن مستخدم ذو امتيازات عالية (على سبيل المثال، `root`) أو كمستخدم عادي. في الحالة الأخيرة، أضف المستخدم إلى ملف `sudoers` بمديرية `NOPASSWD`، واستخدم أداة `sudo`.

    !!! info "العمل مع حاوية Docker"
        عند تشغيل أداة `collectd-nagios` في حاوية Docker التي تحتوي على عقدة التصفية، لا يلزم رفع الصلاحيات.

3.  وصّل وقم بتكوين ضافة [`UnixSock`][link-unixsock] لنقل قياسات `collectd` عبر مقبس نطاق Unix. لهذا، أنشئ ملف `/etc/collectd/collectd.conf.d/unixsock.conf` بالمحتوى التالي:

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4.  أعد تشغيل خدمة `collectd` بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

5.  احصل على قيمة القياس اللازم بتشغيل الأمر المناسب:

    --8<-- "../include/monitoring/collectd-nagios-fetch-metric.md"

    !!! info "الحصول على معرف حاوية Docker"
        يمكنك العثور على قيمة معرف الحاوية بتشغيل أمر `docker ps` (انظر إلى عمود "CONTAINER ID").

!!! info "تحديد عتبات لأداة `collectd-nagios`"
    إذا لزم الأمر، يمكنك تحديد نطاق قيم لتعود الأداة `collectd-nagios` بحالة `WARNING` أو `CRITICAL` باستخدام الخيارات `-w` و`-c` المناسبة (المعلومات التفصيلية متوفرة في [وثائق الأداة][link-nagios-plugin-docs]).
   
**أمثلة على استخدام الأداة:**
*   للحصول على قيمة قياس `wallarm_nginx/gauge-abnormal` (في وقت تشغيل `collectd-nagios`) على مضيف Linux `node.example.local` به عقدة التصفية، قم بتشغيل الأمر التالي:
  
    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
       
*   للحصول على قيمة قياس `wallarm_nginx/gauge-abnormal` (في وقت تشغيل `collectd-nagios`) لعقدة التصفية العاملة في حاوية Docker بالاسم `wallarm-node` والمعرف `95d278317794`، قم بتشغيل الأمر التالي:
  
    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H 95d278317794
    ```


!!! info "المزيد من الأمثلة"
    للحصول على معلومات أساسية حول استخدام أداة `collectd-nagios`، اقرأ الأمثلة عن تصدير القياسات
    
    *   [إلى نظام المراقبة Nagios][doc-nagios-example] و
    *   [إلى نظام المراقبة Zabbix][doc-zabbix-example].


##  إرسال الإشعارات من `collectd`

يتم تكوين الإشعارات في الملف التالي:

--8<-- "../include/monitoring/notification-config-location.md"

وصف عام لكيفية عمل الإشعارات متوفر [هنا][link-notif-common].

معلومات أكثر تفصيلًا حول كيفية إعداد الإشعارات متوفرة [هنا][link-notif-details].

الطرق الممكنة لإرسال الإشعارات:
*   NSCA و NSCA-ng
*   SNMP TRAP
*   رسائل بريد إلكتروني
*   سكريبتات مخصصة