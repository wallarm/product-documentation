[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux
[doc-monitoring]:   monitoring/intro.md

# تكوين SELinux

لو الميكانيزم بتاع [SELinux][link-selinux] شغال على جهاز مع نود فلترة، ممكن يتداخل مع النود ده ويخليه ما يشتغلش:
* قيم RPS (طلبات كل ثانية) و APS (هجمات كل ثانية) للنود مش حتترسل لسحابة Wallarm.
* مش حينفع نرسل مؤشرات النود لأنظمة المراقبة عن طريق بروتوكول TCP (شوف [“مراقبة نود الفلترة”][doc-monitoring]).

SELinux متركب وشغال بشكل افتراضي على توزيعات Linux اللي بتعتمد على RedHat (زي CentOS أو Amazon Linux 2.0.2021x وأقل). كمان ممكن تركيب SELinux على توزيعات Linux تانية زي Debian أو Ubuntu.

لازم إما تعطل SELinux أو تكون SELinux عشان ما يأثرش على عمل نود الفلترة.

## تحقق من حالة SELinux

نفذ الأمر ده:

``` bash
sestatus
```

راجع الإخراج:
* `حالة SELinux: مفعل`
* `حالة SELinux: معطل`

## تكوين SELinux

اسمح لأداة `collectd` إنها تستخدم سوكيت TCP عشان نود الفلترة يشتغل مع SELinux مفعل. عشان كده، نفذ الأمر ده:

``` bash
setsebool -P collectd_tcp_network_connect 1
```

تحقق لو تم تنفيذ الأمر ده بنجاح عن طريق تشغيل الأمر ده:

``` bash
semanage export | grep collectd_tcp_network_connect
```

الإخراج المفروض يحتوي على السلسة دي:
```
boolean -m -1 collectd_tcp_network_connect
```

## تعطيل SELinux 

عشان تخلي حالة SELinux معطلة
*   إما تنفذ أمر `setenforce 0` (SELinux حيتعطل لحد الإقلاع الجاي) أو
*   تضبط قيمة المتغير `SELINUX` على `معطل` في ملف `/etc/selinux/config`، وبعدين تعيد التشغيل (SELinux حيتعطل بشكل دائم).