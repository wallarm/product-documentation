# تثبيت كوحدة ديناميكية لـ NGINX Plus

تصف هذه التعليمات الخطوات لتثبيت عقدة تصفية Wallarm كوحدة ديناميكية للنسخة التجارية الرسمية من NGINX Plus.

!!! info "تثبيت شامل"
    ابتداءً من عقدة Wallarm 4.6، يوصى باستخدام [التثبيت الشامل](../installation/nginx/all-in-one.md) الذي يؤتمت جميع الأنشطة المذكورة في الخطوات أدناه ويجعل نشر العقدة أسهل بكثير.

## الاستخدامات

--8<-- "../include/waf/installation/linux-packages/nginx-plus-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. تمكين Wallarm لتحليل حركة المرور

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. إعادة تشغيل NGINX Plus

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال حركة المرور إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. التهيئة الدقيقة للحل المنشور

تُثبت وحدة Wallarm الديناميكية بالإعدادات الافتراضية لـ NGINX Plus. قد تتطلب عقدة التصفية بعض التكوينات الإضافية بعد النشر.

يتم تعريف إعدادات Wallarm باستخدام [توجيهات NGINX](../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب تحديد التوجيهات في الملفات التالية على الجهاز الذي يحتوي على عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العامة

    يُستخدم الملف للإعدادات المطبقة على جميع المجالات. لتطبيق إعدادات مختلفة على مجموعات مجالات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة مجالات (على سبيل المثال، `example.com.conf` و`test.com.conf`). متوفر مزيد من المعلومات المفصلة حول ملفات تكوين NGINX في [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف المفصل متاح ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تكوين وضع التصفية][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

## القيود

* [اكتشاف اعتمادات تعبئة الاعتمادات][cred-stuffing-docs] غير مدعوم حاليًا، لأنه لم يتم تحديث الحزم إلى الإصدار 4.10 بعد