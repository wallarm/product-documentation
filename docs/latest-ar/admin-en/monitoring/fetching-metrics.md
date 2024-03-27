[link-network-plugin]:              https://collectd.org/wiki/index.php/Plugin:Network
[link-network-plugin-docs]:         https://collectd.org/documentation/manpages/collectd.conf.5.shtml#plugin_network
[link-collectd-networking]:         https://collectd.org/wiki/index.php/Networking_introduction
[link-influx-collectd-support]:     https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-plugin-table]:                https://collectd.org/wiki/index.php/Table_of_Plugins
[link-nagios-plugin-docs]:          https://collectd.org/documentation/manpages/collectd-nagios.1.shtml
[link-notif-common]:                https://collectd.org/wiki/index.php/Notifications_and_thresholds
[link-notif-details]:               https://collectd.org/documentation/manpages/collectd-threshold.5.shtml
[link-influxdb-collectd]:           https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-unixsock]:                    https://collectd.org/wiki/index.php/Plugin:UnixSock

[doc-network-plugin-example]:       network-plugin-influxdb.md
[doc-write-plugin-example]:         write-plugin-graphite.md
[doc-zabbix-example]:               collectd-zabbix.md
[doc-nagios-example]:               collectd-nagios.md

#   إزاي تجيب بيانات القياس

التعليمات دي بتوصف الطرق عشان تجمع بيانات القياس من نقطة تصفية.

##  تصدير بيانات القياس مباشرةً من `collectd`

ممكن تصدر البيانات اللي جمعها `collectd` مباشرةً للأدوات اللي بتدعم العمل مع سيول بيانات `collectd`.


!!! warning "المتطلبات الأساسية"
    كل الخطوات اللي جاية لازم تتعمل من مستخدم بصلاحيات المشرف (مثلاً، `root`).


### تصدير بيانات القياس عن طريق إضافة الشبكة `collectd`

ضبط وربط [إضافة الشبكة][link-network-plugin] بـ `collectd`:
1.  في مجلد `/etc/collectd/collectd.conf.d/`، اعمل ملف بامتداد `.conf` (مثلاً، `export-via-network.conf`) والمحتويات دي:

    ```
    LoadPlugin network
    
    <Plugin "network">
      Server "عنوان IPv4/v6 للسيرفر أو FQDN" "منفذ السيرفر"
    </Plugin>
    ```

    زي ما هو مكتوب في الملف ده، الإضافة هتتحمل عند بدء `collectd`، تشتغل في وضع العميل، وتبعت بيانات قياس نقطة التصفية للسيرفر المحدد.
    
2.  ضبط سيرفر اللي هيستقبل البيانات من عميل `collectd`. الخطوات اللازمة للضبط بتعتمد على السيرفر اللي اخترته (شوف الأمثلة لـ [`collectd`][link-collectd-networking] و [InfluxDB][link-influxdb-collectd]).
    
    
    !!! info "التعامل مع إضافة الشبكة"
        إضافة الشبكة بتشتغل على UDP (شوف [وثائق الإضافة][link-network-plugin-docs]). تأكد إن السيرفر بيسمح بالتواصل عن طريق UDP عشان تكون عملية جمع البيانات فعالة.
         
3.  إعادة تشغيل خدمة `collectd` بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

!!! info "مثال"
    اقرأ [مثال لتصدير بيانات][doc-network-plugin-example] لـ InfluxDB عن طريق الإضافة الشبكية مع تصوير البيانات بعد كده في Grafana.

### تصدير بيانات القياس عن طريق إضافات الكتابة `collectd`

عشان تتمكن من تصدير بيانات القياس عن طريق إضافات الكتابة `collectd`، شوف وثائق الإضافة المتوافقة.


!!! info "مثال"
    عشان تحصل على معلومات أساسية عن استخدام إضافات الكتابة، اقرأ [مثال لتصدير بيانات][doc-write-plugin-example] لـ Graphite مع تصوير البيانات بعد كده في Grafana.

##  تصدير بيانات القياس باستخدام أداة `collectd-nagios`

عشان تصدر بيانات القياس باستخدام الطريقة دي:

1.  تثبيت أداة `collectd-nagios` على جهاز مضيف بنقطة تصفية بتنفيذ الأمر المناسب (لنقطة تصفية مثبتة على لينكس):

    --8<-- "../include/monitoring/install-collectd-utils.md"

    !!! info "صورة Docker"
        صورة Docker لنقطة التصفية جايبة معاها أداة `collectd-nagios` مثبتة مسبقًا.

2.  تأكد إنك تقدر تشغل الأداة دي بصلاحيات مرتفعة يإما نيابة عن مستخدم مشرف (على سبيل المثال، `root`) أو كمستخدم عادي. في الحالة الأخيرة، أضف المستخدم لملف `sudoers` مع توجيه `NOPASSWD`، واستخدم أداة `sudo`.

    !!! info "التعامل مع حاوية Docker"
        عند تنفيذ أداة `collectd-nagios` في حاوية Docker مع نقطة التصفية، مش مطلوب رفع الصلاحيات.

3.  ربط وضبط [إضافة `UnixSock`][link-unixsock] لنقل بيانات `collectd` عبر سوكت نطاق Unix. عشان تعمل كده، اعمل ملف `/etc/collectd/collectd.conf.d/unixsock.conf` بالمحتويات دي:

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4.  إعادة تشغيل خدمة `collectd` بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

5.  جمع قيمة القياس اللازمة بتشغيل الأمر المناسب:

    --8<-- "../include/monitoring/collectd-nagios-fetch-metric.md"

    !!! info "جمع مُعرّف حاوية Docker"
        ممكن تجد قيمة مُعرّف الحاوية بتشغيل أمر `docker ps` (شوف عامود “CONTAINER ID”).

!!! info "تحديد عتبات لأداة `collectd-nagios`"
    لو لازم، ممكن تحدد نطاق قيم اللي الأداة `collectd-nagios` هترجع حالة `WARNING` أو `CRITICAL` ليها باستخدام الخيارات المقابلة `-w` و `-c` (المعلومات التفصيلية متوفرة في [وثائق الأداة][link-nagios-plugin-docs]).
   
**أمثلة على استخدام الأداة:**
*   عشان تجيب قيمة القياس `curl_json-wallarm_nginx/gauge-abnormal` (في الوقت اللي كانت فيه أداة `collectd-nagios` متنادية) على الجهاز المضيف لينكس `node.example.local` مع نقطة التصفية، شغل الأمر ده:
  
    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
    ```
       
*   عشان تجيب قيمة القياس `curl_json-wallarm_nginx/gauge-abnormal` (في الوقت اللي كانت فيه أداة `collectd-nagios` متنادية) لنقطة التصفية اللي شغالة في حاوية Docker بإسم `wallarm-node` ومُعرّف `95d278317794`، شغل الأمر ده:
  
    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H 95d278317794
    ```


!!! info "أمثلة أكتر"
    عشان تحصل على معلومات أساسية عن استخدام أداة `collectd-nagios`، اقرأ الأمثلة لتصدير البيانات
    
    *   [لنظام المراقبة Nagios][doc-nagios-example] و
    *   [لنظام المراقبة Zabbix][doc-zabbix-example].


##  إرسال إشعارات من `collectd`

الإشعارات بيتم ضبطها في الملف ده:

--8<-- "../include/monitoring/notification-config-location.md"

شرح عام عن ازاي الإشعارات شغالة متوفر [هنا][link-notif-common].

معلومات أكتر تفصيلية عن ازاي تضبط الإشعارات متوفرة [هنا][link-notif-details].

الطرق الممكنة لإرسال الإشعارات:
*   NSCA و NSCA-ng
*   SNMP TRAP
*   رسائل البريد الإلكتروني
*   سكربتات مخصصة