# تثبيت الوحدة الديناميكية Wallarm OOB لـ NGINX Plus باستخدام حزم Linux

تصف هذه التعليمات خطوات تثبيت Wallarm كوحدة ديناميكية [OOB](../overview.md) لـ NGINX Plus.

تدعم Wallarm أنظمة التشغيل التالية:

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x والأقل
* AlmaLinux, Rocky Linux أو Oracle Linux 8.x
* RHEL 8.x

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-plus-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. تفعيل Wallarm لتحليل المرور

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. إعادة تشغيل NGINX Plus

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال المرور إلى نموذج Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 9. اختبار تشغيل نموذج Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. ضبط الحل المُنشر بدقة

تم تثبيت الوحدة الديناميكية Wallarm بالإعدادات الافتراضية لـ NGINX Plus. قد يتطلب العقدة التصفية بعض التكوين الإضافي بعد النشر.

تُعرَّف إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب ضبط التوجيهات في الملفات التالية على الآلة التي تحتوي على عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العامة

    يُستخدم الملف للإعدادات التي تُطبَّق على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و `test.com.conf`). المزيد من المعلومات التفصيلية حول ملفات تكوين NGINX متوفرة في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متوفر ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

أدناه هناك بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"