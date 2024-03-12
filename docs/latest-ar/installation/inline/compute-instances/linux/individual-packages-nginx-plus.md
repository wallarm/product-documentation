# تثبيت كموديول ديناميكي لـ NGINX Plus

توصف هذه التعليمات الخطوات لتثبيت عقدة تصفية وولارم كموديول ديناميكي للنسخة التجارية الرسمية من NGINX Plus. ستقوم العقدة بتحليل حركة المرور بشكل مباشر.

!!! معلومة "تثبيت شامل"
    ابتداءً من عقدة وولارم 4.6، يُنصح باستخدام [تثبيت شامل](../../../../installation/nginx/all-in-one.md) الذي يُتمم جميع الأنشطة المذكورة في الخطوات أدناه بشكل تلقائي ويجعل نشر العقدة أسهل بكثير.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-plus-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. تمكين وولارم لتحليل حركة المرور

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## 7. إعادة تشغيل NGINX Plus

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. توجيه حركة المرور إلى عقدة وولارم

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 9. اختبار تشغيل عقدة وولارم

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. تحسين الحل المنشور

تم تثبيت موديول وولارم الديناميكي بالإعدادات الافتراضية لـ NGINX Plus. قد تتطلب عقدة التصفية بعض الإعدادات الإضافية بعد النشر.

تُعرف إعدادات وولارم باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم وولارم. يجب ضبط التوجيهات في الملفات التالية على الجهاز الذي يحتوي على عقدة وولارم:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و `test.com.conf`). المزيد من التفاصيل حول ملفات تكوين NGINX متوفرة في [وثائق NGINX الرسمية](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة وولارم. الوصف التفصيلي متوفر ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة البيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تكوين وضع التصفية][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

## القيود

* [الكشف عن التزوير ببيانات الاعتماد][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم يتم تحديث الحزم إلى الإصدار 4.10 بعد