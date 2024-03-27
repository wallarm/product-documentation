[img-zabbix-scheme]:        ../../images/monitoring/zabbix-scheme.png

[link-zabbix]:              https://www.zabbix.com/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-zabbix-agent]:        https://www.zabbix.com/zabbix_agent
[link-zabbix-passive]:      https://www.zabbix.com/documentation/4.0/manual/appendix/items/activepassive
[link-zabbix-app]:          https://hub.docker.com/r/zabbix/zabbix-appliance
[link-docker-ce]:           https://docs.docker.com/install/
[link-zabbix-repo]:         https://www.zabbix.com/download
[link-allowroot]:           https://www.zabbix.com/documentation/4.0/manual/appendix/config/zabbix_agentd
[link-sed-docs]:            https://www.gnu.org/software/sed/manual/sed.html#sed-script-overview
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-metric]:              available-metrics.md#number-of-requests

[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

#   تصدير قياسات إلى زابيكس من خلال أداة `collectd-nagios`

يوفر هذا المستند مثالًا على تصدير قياسات عُقد الفلتر إلى نظام المراقبة [زابيكس][link-zabbix] باستخدام أداة [`collectd-nagios`][link-collectd-nagios].

##  مخطط العمل المثالي

--8<-- "../include/monitoring/metric-example.md"


![مخطط العمل المثالي][img-zabbix-scheme]

تُستخدم الخطة التالية للنشر في هذا المستند:
*   يتم نشر عُقدة فلتر Wallarm على مضيف يمكن الوصول إليه عبر عنوان IP `10.0.30.5` واسم المجال الكامل `node.example.local`.
    
    يحتوي المضيف على [عميل زابيكس][link-zabbix-agent] 4.0 LTS الذي

    *   يقوم بتنزيل قياسات عُقدة الفلتر باستخدام أداة `collectd-nagios`.
    *   يستمع إلى الاتصالات الواردة على منفذ `10050/TCP` (وبهذا ستتم عمليات التحقق [السلبية][link-zabbix-passive] باستخدام زابيكس أبلاينس).
    *   يمرر قيم القياسات إلى زابيكس أبلاينس. 
    
*   على مضيف مخصص بعنوان IP `10.0.30.30` (يُشار إليه فيما يلي باسم مضيف دوكر)، يتم نشر [زابيكس أبلاينس][link-zabbix-app] 4.0 LTS في شكل حاوية دوكر.
    
    يتضمن زابيكس أبلاينس
    
    *   خادم زابيكس الذي يقوم بولّ قياسات من عميل زابيكس المثبت على مضيف عُقدة الفلتر بشكل دوري للحصول على معلومات حول أي تغييرات في المقاييس المراقبة).
    *   واجهة إدارة خادم زابيكس المتاحة على منفذ `80/TCP`.

    
    
##  تكوين تصدير القياسات إلى زابيكس


!!! info "المتطلبات المسبقة"
    يُفترض أن

    *   خدمة `collectd` تم تكوينها للعمل عبر سوكيت نطاق يونكس (انظر [هنا][doc-unixsock] للتفاصيل).
    *   [دوكر كوميونيتي إديشن][link-docker-ce] مُثبّت بالفعل على مضيف دوكر `10.0.30.30`.
    *   عُقدة الفلتر `node.example.local` مُثبّتة بالفعل، مُكوّنة، متاحة لإعدادها (على سبيل المثال، عبر بروتوكول SSH)، وتعمل.


### نشر زابيكس

لنشر زابيكس أبلاينس 4.0 LTS، نفذ الأمر التالي على مضيف دوكر:

``` bash
docker run --name zabbix-appliance -p 80:80 -d zabbix/zabbix-appliance:alpine-4.0-latest
```

الآن لديك نظام مراقبة زابيكس يعمل.

### نشر عميل زابيكس

قم بتثبيت عميل زابيكس 4.0 LTS على مضيف بعُقدة الفلتر:
1.  قم بالاتصال بعُقدة الفلتر (على سبيل المثال، باستخدام بروتوكول SSH). تأكد من أنك تعمل كـ `root` أو حساب آخر بامتيازات المشرف.
2.  اتصل بمستودعات زابيكس (استخدم مدخل "تثبيت مستودع زابيكس" من [التعليمات][link-zabbix-repo] لنظام التشغيل الخاص بك).
3.  ثبت عميل زابيكس بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/install-zabbix-agent.md"

4.  قم بتكوين عميل زابيكس للعمل مع زابيكس أبلاينس. للقيام بذلك، اجعل الإضافات التالية إلى ملف التكوين `/etc/zabbix/zabbix_agentd.conf`:
   
    ```
    Server=10.0.30.30			    # عنوان IP زابيكس
    Hostname=node.example.local		# FQDN لمضيف بعُقدة الفلتر
    ```
    
### تكوين جمع القياسات باستخدام عميل زابيكس

اتصل بعُقدة الفلتر (على سبيل المثال، باستخدام بروتوكول SSH) وقم بتكوين جمع القياسات باستخدام عميل زابيكس. للقيام بذلك، نفذ الخطوات التالية على مضيف بعُقدة الفلتر:

####    1.  تثبيت أداة `collectd_nagios`
    
نفذ الأمر المناسب:

--8<-- "../include/monitoring/install-collectd-utils.md"


####    2.  تكوين أداة `collectd-nagios` للتشغيل بصلاحيات مرتفعة بالنيابة عن مستخدم `zabbix`
   
استخدم أداة [`visudo`][link-visudo] لإضافة السطر التالي إلى ملف `/etc/sudoers`:
    
```
zabbix ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
```
    
هذا يتيح لمستخدم `zabbix` تشغيل أداة `collectd-nagios` بصلاحيات المشرف باستخدام أداة `sudo` دون الحاجة إلى تقديم كلمة مرور.


!!! info "تشغيل `collectd-nagios` بصلاحيات المشرف"
    يجب تشغيل الأداة بصلاحيات المشرف لأنها تستخدم سوكيت نطاق يونكس `collectd` لتلقي البيانات. يمكن للمشرف فقط الوصول إلى هذا السوكيت.
    
    كبديل لإضافة مستخدم `zabbix` إلى قائمة `sudoers`، يمكنك تكوين عميل زابيكس للتشغيل كـ `root` (هذا قد يشكل خطر أمني، لذلك لا يُنصح به). يمكن تحقيق ذلك عن طريق تمكين خيار [`AllowRoot`][link-allowroot] في ملف تكوين العميل.
        
####    3.  التأكد من أن مستخدم `zabbix` يمكنه استقبال قيم القياسات من `collectd`
    
نفذ الأمر التجريبي التالي على عُقدة الفلتر:
    
``` bash
sudo -u zabbix sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
```

يستدعي هذا الأمر مستخدم `zabbix` للحصول على قيمة القياس [`curl_json-wallarm_nginx/gauge-abnormal`][link-metric] لمضيف `node.example.local` بعُقدة الفلتر.
    
**مثال على إخراج الأمر:**

```
OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
```
    
####    4.  إضافة معلمات مخصصة إلى ملف تكوين عميل زابيكس على مضيف عُقدة الفلتر للحصول على القياسات التي تحتاجها
    
على سبيل المثال، لإنشاء معلم مخصص `wallarm_nginx-gauge-abnormal` يتوافق مع قياس `curl_json-wallarm_nginx/gauge-abnormal` لعُقدة فلتر بالاسم الكامل المؤهل `node.example.local`، أضف السطر التالي إلى ملف التكوين:
   
```
UserParameter=wallarm_nginx-gauge-abnormal, sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local | sed -n "s/.*value\=\(.*\);;;;.*/\1/p"
```
!!! info "استخراج قيمة قياس"
    لاستخراج قيمة قياس تأتي بعد `value=` في إخراج أداة `collectd-nagios` (مثل، `OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;`)، يتم توجيه هذه الإخراج إلى أداة `sed` التي تنفذ سكربت `sed` لإزالة الأحرف غير الضرورية.
    
    راجع [وثائق `sed`][link-sed-docs] لمزيد من المعلومات حول بناء جملتها.

####    5.  بعد إضافة جميع الأوامر اللازمة إلى ملف تكوين عميل زابيكس، أعد تشغيل العميل

--8<-- "../include/monitoring/zabbix-agent-restart-2.16.md"

##  اكتمل الإعداد

الآن يمكنك مراقبة المعلمات المستخدمة المتعلقة بقياسات Wallarm المحددة مع زابيكس.