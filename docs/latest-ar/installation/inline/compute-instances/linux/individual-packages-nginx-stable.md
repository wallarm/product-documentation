# تثبيت كموديول ديناميكي لـ NGINX Stable

توضح هذه التعليمات الخطوات لتثبيت عقدة تصفية Wallarm كموديول ديناميكي لإصدار المصدر المفتوح من NGINX `stable` التي تم تثبيتها من مستودع NGINX. ستقوم العقدة بتحليل حركة المرور بشكل مباشر.

!!! info "التثبيت الشامل"
    ابتداءً من عقدة Wallarm 4.6، يُنصح باستخدام [التثبيت الشامل](all-in-one.md) الذي يؤتمت كل الأنشطة المذكورة في الخطوات أدناه ويجعل نشر العقدة أسهل بكثير.

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

## 8. تهيئة إرسال حركة المرور إلى عقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 9. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. تعديل الحل المنشور

تم تثبيت موديول Wallarm الديناميكي بإعدادات الافتراضية لـ NGINX `stable`. قد تتطلب عقدة التصفية بعض التهيئة الإضافية بعد النشر.

يتم تعريف إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب تعيين التوجيهات في الملفات التالية على الجهاز الذي يحتوي على عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات.  لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تهيئة جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و`test.com.conf`). يتوفر مزيد من المعلومات التفصيلية حول ملفات تهيئة NGINX في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح في [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تهيئة وضع التصفية][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تهيئة تحليل DNS الديناميكي في NGINX][dynamic-dns-resolution-nginx]

## القيود

* [اكتشاف حشو البيانات الاعتمادية][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم يتم تحديث الحزم للإصدار 4.10 بعد