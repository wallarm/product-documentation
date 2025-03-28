[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# تثبيت كوحدة ديناميكية لـ NGINX Stable

تصف هذه التعليمات الخطوات لتثبيت عقدة التصفية Wallarm كوحدة ديناميكية للنسخة المفتوحة المصدر من NGINX `الثابتة` والتي تم تثبيتها من مستودع NGINX. ستقوم العقدة بتحليل حركة المرور بشكل مباشر.

!!! info "تثبيت شامل"
    ابتداءً من عقدة Wallarm 4.6، يوصى باستخدام [التثبيت الشامل](all-in-one.md) الذي يؤتمت جميع الأنشطة المدرجة في الخطوات أدناه ويجعل نشر العقدة أسهل بكثير.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-stable-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. تمكين Wallarm لتحليل حركة المرور

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## 7. إعادة تشغيل NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال حركة المرور إلى عقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 9. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. ضبط الحل المنشور بدقة

تم تثبيت الوحدة الديناميكية Wallarm بالإعدادات الافتراضية لـ NGINX `الثابتة`. قد تتطلب عقدة التصفية بعض الإعدادات الإضافية بعد النشر.

يتم تحديد إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة Wallarm Console. يجب ضبط التوجيهات في الملفات التالية على الجهاز مع عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العامة

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و `test.com.conf`). المعلومات أكثر تفصيلاً حول ملفات تكوين NGINX متاحة في [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح في الرابط[link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة البيانات Tarantool

أدناه هناك بعض من الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تكوين وضع التصفية][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين الحل الديناميكي لحل DNS في NGINX][dynamic-dns-resolution-nginx]

## القيود

* [كشف التقديم الاعتمادي][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم يتم تحديث الحزم إلى إصدار 4.10 بعد.