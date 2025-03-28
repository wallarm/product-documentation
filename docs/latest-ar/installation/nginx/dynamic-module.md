[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# تثبيت كوحدة ديناميكية لإصدار NGINX المستقر

تصف هذه التعليمات الخطوات لتثبيت عقدة تصفية Wallarm كوحدة ديناميكية للإصدار المفتوح المصدر من NGINX `المستقر` الذي تم تثبيته من مستودع NGINX.

!!! info "تثبيت شامل"
    بدءًا من عقدة Wallarm 4.6، يُنصح باستخدام [التثبيت الشامل](all-in-one.md) الذي يؤتمت جميع الأنشطة المدرجة في الخطوات أدناه ويجعل نشر العقدة أسهل بكثير.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-stable-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. تمكين Wallarm لتحليل الزيارات

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. إعادة تشغيل NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال الزيارات إلى عقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. ضبط الحل المنتشر

تم تثبيت الوحدة الديناميكية Wallarm بالإعدادات الافتراضية لـ NGINX `المستقر`. قد تتطلب عقدة التصفية بعض التكوينات الإضافية بعد النشر.

تُعرف إعدادات Wallarm باستخدام [توجيهات NGINX](../../admin-en/configure-parameters-en.md) أو واجهة المستخدم Wallarm Console. يجب تعيين التوجيهات في الملفات التالية على الجهاز الذي يحتوي على عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات النطاقات المختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و`test.com.conf`). متوفرة معلومات أكثر تفصيلًا حول ملفات تكوين NGINX في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. يتوفر الوصف التفصيلي داخل [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تكوين وضع التصفية][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين الحل DNS الديناميكي في NGINX][dynamic-dns-resolution-nginx]

## القيود

* [كشف اختراق الأوراق الاعتماد][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم يتم تحديث الحزم إلى الإصدار 4.10 بعد