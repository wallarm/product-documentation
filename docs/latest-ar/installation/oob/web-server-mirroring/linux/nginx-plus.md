# تثبيت الوحدة الديناميكية لـ Wallarm OOB لـ NGINX Plus باستخدام حزم لينكس

تصف هذه التعليمات الخطوات لتثبيت Wallarm كوحدة ديناميكية [OOB](../overview.md) لـ NGINX Plus.

تدعم Wallarm أنظمة التشغيل التالية:

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x وأقل
* AlmaLinux, Rocky Linux أو Oracle Linux 8.x
* RHEL 8.x

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-plus-use-cases.md"

## الشروط المطلوبة

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. تمكين Wallarm لتحليل الزيارات

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. إعادة تشغيل NGINX Plus

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال الزيارات إلى نموذج Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 9. اختبار عمل نموذج Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. تعديل وضبط الحل المُنشر

يتم تثبيت الوحدة الديناميكية لـ Wallarm بالإعدادات الافتراضية لـ NGINX Plus. قد يتطلب النموذج مرشحًا بعض الإعدادات الإضافية بعد النشر.

تُعرف إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب ضبط التوجيهات في الملفات التالية على الجهاز الذي يحتوي على نموذج Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات النموذج المرشح العالمية

    يُستخدم الملف للإعدادات التي يتم تطبيقها على جميع المجالات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم ملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاق (على سبيل المثال، `example.com.conf` و `test.com.conf`). تتوفر معلومات أكثر تفصيلاً حول ملفات تكوين NGINX في [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة نموذج Wallarm. يتوفر الوصف التفصيلي ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة البيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"