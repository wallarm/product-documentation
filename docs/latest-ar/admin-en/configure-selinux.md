[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux

# تكوين SELinux

إذا كان نظام SELinux مُفعلًا على مضيف بوجود عقدة تصفية، قد يتداخل ذلك مع عمل عقدة التصفية مما يجعلها غير قابلة للعمل:
* لن يتم تصدير قيم RPS (طلبات بالثانية) وAPS (هجمات بالثانية) الخاصة بعقدة التصفية إلى سحابة Wallarm.

يتم تثبيت SELinux وتفعيله بشكل افتراضي على توزيعات لينكس القائمة على RedHat (مثل CentOS أو Amazon Linux 2.0.2021x والأقل). يمكن أيضا تثبيت SELinux على توزيعات لينكس أخرى، مثل Debian أو Ubuntu.

من الضروري إما تعطيل SELinux أو تكوينه بحيث لا يعيق عمل عقدة التصفية.

## التحقق من حالة SELinux

نفذ الأمر التالي:

``` bash
sestatus
```

افحص الناتج:
* `SELinux status: enabled`
* `SELinux status: disabled`

## تكوين SELinux

اسمح لأداة `collectd` باستخدام مأخذ TCP لتجعل عقدة التصفية تعمل مع تفعيل SELinux. للقيام بذلك، نفذ الأمر التالي:

``` bash
setsebool -P collectd_tcp_network_connect 1
```

تحقق من نجاح تنفيذ الأمر السابق بتشغيل الأمر التالي:

``` bash
semanage export | grep collectd_tcp_network_connect
```

يجب أن يحتوي الناتج على هذه السلسلة:
```
boolean -m -1 collectd_tcp_network_connect
```

## تعطيل SELinux

لاجراء SELinux في حالة معطلة
* يمكن تنفيذ أمر `setenforce 0` (سيتم تعطيل SELinux حتى إعادة التشغيل التالية) أو
* ضبط قيمة المتغير `SELINUX` على `disabled` في ملف `/etc/selinux/config`، ثم إعادة التشغيل (سيتم تعطيل SELinux بشكل دائم).