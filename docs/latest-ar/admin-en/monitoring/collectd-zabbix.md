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

#   تصدير القياسات لـ Zabbix عبر أداة `collectd-nagios`

يوفر هذا المستند مثالاً لتصدير قياسات عقدة فلترة Wallarm إلى نظام المراقبة [Zabbix][link-zabbix] باستخدام أداة [`collectd-nagios`][link-collectd-nagios].

##  سير عمل المثال

--8<-- "../include/monitoring/metric-example.md"


![سير عمل المثال][img-zabbix-scheme]

يُستخدم النظام التالي في هذا المستند:
*   يتم نشر عقدة فلترة Wallarm على مضيف يمكن الوصول إليه عبر عنوان IP `10.0.30.5` واسم النطاق الكامل `node.example.local`.
    
    يتم نشر [عميل Zabbix][link-zabbix-agent] إصدار 4.0 LTS على المضيف الذي:

    *   يقوم بتنزيل قياسات عقدة الفلتر باستخدام أداة `collectd-nagios`.
    *   يستمع للاتصالات الواردة عبر منفذ `10050/TCP` (وبالتالي ستتم [الفحوصات السلبية][link-zabbix-passive] باستخدام Zabbix Appliance).
    *   يمرر قيم القياسات إلى Zabbix Appliance.
    
*   على مضيف مخصص بعنوان IP `10.0.30.30` (يُشار إليه فيما يلي باسم Docker host)، يتم نشر [Zabbix Appliance][link-zabbix-app] إصدار 4.0 LTS على شكل حاوية Docker.
    
    يشمل Zabbix Appliance
    
    *   خادم Zabbix الذي يقوم بالاستفسار دوريًا عن عميل Zabbix المثبت على مضيف عقدة الفلتر للحصول على معلومات حول أي تغييرات في القياسات المراقبة).
    *   واجهة إدارة ويب خادم Zabbix، متاحة عبر منفذ `80/TCP`.

    
    
##  تكوين تصدير القياسات إلى Zabbix


!!! info "المتطلبات الأولية"
    يُفترض أن:

    *   تم تكوين خدمة `collectd` للعمل عبر جلسة توصيل Unix (انظر [هنا][doc-unixsock] للتفاصيل).
    *   تم تثبيت [Docker Community Edition][link-docker-ce] مسبقًا على `10.0.30.30` Docker host.
    *   تم نشر عقدة الفلتر `node.example.local` بالفعل، وتكوينها، وإتاحتها لمزيد من التكوين (على سبيل المثال، عبر بروتوكول SSH)، وتعمل.


### نشر Zabbix

لنشر Zabbix Appliance إصدار 4.0 LTS، نفذ الأمر التالي على Docker host:

``` bash
docker run --name zabbix-appliance -p 80:80 -d zabbix/zabbix-appliance:alpine-4.0-latest
```

الآن لديك نظام مراقبة Zabbix يعمل.

### نشر عميل Zabbix

قم بتثبيت عميل Zabbix إصدار 4.0 LTS على مضيف مع عقدة الفلتر:
1.  قم بالاتصال بعقدة الفلتر (على سبيل المثال، باستخدام بروتوكول SSH). تأكد من أنك تعمل كـ `root` أو حساب آخر بامتيازات المشرف.
2.  قم بربط مستودعات Zabbix (استخدم إدخال "تثبيت مستودع Zabbix" من [التعليمات][link-zabbix-repo] لنظام التشغيل الخاص بك).
3.  قم بتثبيت عميل Zabbix بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/install-zabbix-agent.md"

4.  قم بتكوين عميل Zabbix للعمل مع Zabbix Appliance. للقيام بذلك، قم بإجراء التغييرات التالية على ملف التكوين `/etc/zabbix/zabbix_agentd.conf`:
   
    ```
    Server=10.0.30.30			    # عنوان IP لـ Zabbix
    Hostname=node.example.local		# FQDN للمضيف مع عقدة الفلتر
    ```
    
### تكوين جمع القياسات باستخدام عميل Zabbix

قم بالاتصال بعقدة الفلتر (على سبيل المثال، باستخدام بروتوكول SSH) وقم بتكوين جمع القياسات باستخدام عميل Zabbix. للقيام بذلك، قم بتنفيذ الخطوات التالية على مضيف مع عقدة الفلتر:

####    1.  تثبيت أداة `collectd_nagios`
    
نفذ الأمر المناسب:

--8<-- "../include/monitoring/install-collectd-utils.md"


####    2.  تكوين أداة `collectd-nagios` للعمل بامتيازات مرتفعة نيابةً عن مستخدم `zabbix`
   
استخدم أداة [`visudo`][link-visudo] لإضافة السطر التالي إلى ملف `/etc/sudoers`:
    
```
zabbix ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
```
    
هذا يسمح لمستخدم `zabbix` بتشغيل أداة `collectd-nagios` بامتيازات المشرف باستخدام أداة `sudo` دون الحاجة إلى تقديم كلمة مرور.


!!! info "تشغيل `collectd-nagios` بامتيازات المشرف"
    يجب تشغيل الأداة بامتيازات المشرف لأنها تستخدم جلسة توصيل `collectd` عبر Unix لاستلام البيانات. فقط المشرف يمكنه الوصول إلى هذه الجلسة.
    
    كبديل لإضافة مستخدم `zabbix` إلى قائمة `sudoers`، يمكنك تكوين عميل Zabbix للعمل كـ `root` (قد يشكل هذا خطراً أمنياً، لذا لا يُنصح به). يمكن تحقيق ذلك عن طريق تفعيل خيار [`AllowRoot`][link-allowroot] في ملف تكوين العميل.
        
####    3.  التأكد من أن مستخدم `zabbix` يمكنه الحصول على قيم القياسات من `collectd`
    
قم بتشغيل الأمر التالي للاختبار على عقدة الفلتر:
    
``` bash
sudo -u zabbix sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```

هذا الأمر يدعو مستخدم `zabbix` للحصول على قيمة القياس [`wallarm_nginx/gauge-abnormal`][link-metric] للمضيف `node.example.local` مع عقدة الفلتر.
    
**مثال على إخراج الأمر:**

```
OKAY: 0 critical, 0 warning, 1 okay \|\| value=0.000000\;\;\;\;
```
    
####    4.  إضافة معلمات مخصصة إلى ملف تكوين عميل Zabbix على مضيف عقدة الفلتر للحصول على القياسات اللازمة
    
على سبيل المثال، لإنشاء معلمة مخصصة `wallarm_nginx-gauge-abnormal` التي تتوافق مع القياس `wallarm_nginx/gauge-abnormal` لعقدة فلترة بالاسم الكامل `node.example.local`، أضف السطر التالي إلى ملف التكوين:
   
```
UserParameter=wallarm_nginx-gauge-abnormal, sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local \|\| sed -n "s/.*value\=\(.*\)\;\;\;\;.*/\1/p"
```
!!! info "استخراج قيمة قياس"
    لاستخراج قيمة قياس تأتي بعد `value=` في إخراج أداة `collectd-nagios` (مثلاً، `OKAY: 0 critical, 0 warning, 1 okay \|\| value=0.000000\;\;\;\;`)، يتم إرسال هذا الإخراج إلى أداة `sed` التي تنفذ نص `sed` لإزالة الأحرف غير الضرورية.
    
    راجع [وثائق `sed`][link-sed-docs] لمزيد من المعلومات عن صيغة نصوصها.

####    5.  بعد إضافة جميع الأوامر الضرورية إلى ملف تكوين عميل Zabbix، أعد تشغيل العميل

--8<-- "../include/monitoring/zabbix-agent-restart-2.16.md"

##  اكتمل الإعداد

الآن يمكنك مراقبة معلمات المستخدم الخاصة بقياسات محددة لـ Wallarm باستخدام Zabbix.