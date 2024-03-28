# تثبيت كوحدة ديناميكية لـ NGINX Plus

تصف هذه التعليمات الخطوات اللازمة لتثبيت عقدة فلترة Wallarm كوحدة ديناميكية للنسخة التجارية الرسمية من NGINX Plus. ستقوم العقدة بتحليل حركة المرور بشكل مباشر.

!!! info "تثبيت شامل"
    ابتداء من عقدة Wallarm 4.6، يُنصح باستخدام [التثبيت الشامل](../../../../installation/nginx/all-in-one.md) الذي يُتمت كل الأنشطة المذكورة في الخطوات أدناه ويجعل نشر العقدة أسهل بكثير.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-plus-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. تمكين Wallarm لتحليل حركة المرور

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## 7. إعادة تشغيل NGINX Plus

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال حركة المرور إلى وحدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 9. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. تعديل الحل الموظف بدقة

تم تثبيت الوحدة الديناميكية Wallarm بالإعدادات الافتراضية لـ NGINX Plus. قد تتطلب عقدة الفلترة بعض التكوين الإضافي بعد النشر.

يتم تحديد إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم وحدة التحكم Wallarm. يجب ضبط التوجيهات في الملفات التالية على الجهاز الذي توجد عليه عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة الفلترة العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة من النطاقات (على سبيل المثال، `example.com.conf` و `test.com.conf`). تتوفر معلومات أكثر تفصيلية حول ملفات تكوين NGINX في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. يتوفر وصف مفصل ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكن تطبيقها إذا لزم الأمر:

* [تكوين وضعية الفلترة][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

## القيود

* [اكتشاف عمليات ملء البيانات ببيانات اعتمادية][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم يتم تحديث الحزم إلى الإصدار 4.10 بعد