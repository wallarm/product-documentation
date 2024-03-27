# تركيب كوحدة ديناميكية لنسخة NGINX الموفرة من النظام

توصف هذه التعليمات الخطوات لتركيب عقدة تصفية Wallarm كوحدة ديناميكية للنسخة المفتوحة المصدر لـNGINX المثبتة من مستودعات Debian/CentOS.

!!! info "التثبيت الشامل"
    بداية من عقدة Wallarm 4.6، يُنصح باستخدام [التثبيت الشامل](all-in-one.md) الذي يُتمم كل الأنشطة المذكورة في الخطوات أدناه ويجعل نشر العقدة أسهل كثيرًا.

يمكن الحصول على NGINX المصدر المفتوخ من nginx.org أو المستودعات الافتراضية لـ Debian/CentOS تبعًا لاحتياجاتك وتفضيلات نسخة NGINX وسياسات إدارة المستودع. Wallarm توفر حزمًا لكلٍ من [nginx.org](dynamic-module.md) والنسخ الموفرة من النظام. هذا الدليل يركز على NGINX من مستودعات Debian/CentOS.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-distro-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. تمكين Wallarm لتحليل الحركة المرورية

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 6. إعادة تشغيل NGINX

--8<-- "../include/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. تكوين إرسال الحركة المرورية إلى عقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 9. ضبط الحل المنشور

تُثبت وحدة Wallarm الديناميكية بإعدادات افتراضية لـ NGINX `stable`. قد تحتاج عقدة التصفية لبعض التكوينات الإضافية بعد النشر.

تتم تعريف إعدادات Wallarm باستخدام [توجيهات NGINX](../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Console Wallarm. يجب تعيين التوجيهات في الملفات التالية على الجهاز الذي توجد عليه عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العامة

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو إنشاء ملفات تكوين جديدة لكل مجموعة نطاق (مثلاً، `example.com.conf` و `test.com.conf`). المزيد من المعلومات المفصلة عن ملفات تكوين NGINX متاحة في [التوثيق الرسمي NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف المفصل متاح داخل [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تكوين وضع التصفية][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين الدقة الديناميكية لل DNS في NGINX][dynamic-dns-resolution-nginx]

## القيود

* [اكتشاف احتيال اعتمادات التسجيل][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم تتم تحديث الحزم إلى الإصدار 4.10 بعد.