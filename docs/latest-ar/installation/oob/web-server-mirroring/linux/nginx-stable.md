[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# تثبيت الوحدة النمطية الديناميكية Wallarm OOB لـ NGINX الإصدار `المستقر` باستخدام حزم Linux

توضح هذه التعليمات الخطوات لتثبيت Wallarm كوحدة نمطية [ديناميكية OOB](../overview.md) باستخدام حزم Linux لـ NGINX `المستقر` من nginx.org.

تدعم Wallarm أنظمة التشغيل التالية:

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x وأقل
* AlmaLinux، Rocky Linux أو Oracle Linux 8.x
* RHEL 8.x

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-stable-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. تفعيل Wallarm لتحليل الحركة

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. إعادة تشغيل NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال الحركة إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 9. اختبار تشغيل Node Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. تعديل الحل المُنتشر بدقة

يُثبَت الوحدة النمطية الديناميكية Wallarm بالإعدادات الافتراضية لـ NGINX `المستقر`. قد يتطلب العقدة التصفية بعض الإعدادات الإضافية بعد الانتشار.

يتم تحديد إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب تعيين التوجيهات في الملفات التالية على الجهاز الذي يحتوي على عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات العقدة التصفية العامة

    يُستخدم الملف للإعدادات المُطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و`test.com.conf`). تتوفر معلومات أكثر تفصيلاً حول ملفات تكوين NGINX في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين الحل DNS الديناميكي في NGINX][dynamic-dns-resolution-nginx]