# تركيب كوحدة ديناميكية لـ NGINX Plus

تصف هذه التعليمات الخطوات لتركيب وحدة تنقية Wallarm كوحدة ديناميكية للإصدار التجاري الرسمي من NGINX Plus.

!!! info "التثبيت شامل"
    بدايةً من وحدة Wallarm 4.6، يُنصح باستخدام [التثبيت الشامل](../installation/nginx/all-in-one.md) الذي يؤتمت كل الأعمال المذكورة في الخطوات أدناه ويجعل من نشر الوحدة أسهل بكثير.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-plus-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. تمكين Wallarm لتحليل الحركة

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. إعادة تشغيل NGINX Plus

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال الحركة إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. اختبار تشغيل وحدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. التعديل الدقيق للحل المنشور

تم تثبيت وحدة Wallarm الديناميكية بالإعدادات الافتراضية لـ NGINX Plus. قد تحتاج وحدة التنقية إلى بعض التكوين الإضافي بعد النشر.

تُعرَّف إعدادات Wallarm باستخدام [توجيهات NGINX](../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب ضبط التوجيهات في الملفات التالية على الجهاز المحتوي على وحدة Wallarm:

* `/etc/nginx/conf.d/default.conf` بإعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` بإعدادات وحدة التنقية العالمية

    يُستخدم الملف للإعدادات المطبقة على كل النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و `test.com.conf`). المزيد من المعلومات التفصيلية حول ملفات تكوين NGINX متاحة في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` بإعدادات مراقبة وحدة Wallarm. الوصف التفصيلي متوفر ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` بإعدادات قاعدة بيانات Tarantool

أدناه بعض من الإعدادات النمطية التي يمكنك تطبيقها إذا لزم الأمر:

* [تكوين وضع الترشيح][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

## القيود

* [اكتشاف عمليات اختراق الاعتمادات][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم يتم تحديث الحزم بعد إلى إصدار 4.10