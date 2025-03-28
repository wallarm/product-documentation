[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# تثبيت كوحدة ديناميكية لنسخة NGINX المقدمة من التوزيع

هذه التعليمات توضح الخطوات لتثبيت عقدة تصفية Wallarm كوحدة ديناميكية لنسخة الكود المفتوح من NGINX المثبتة من مستودعات Debian/CentOS. ستقوم العقدة بتحليل حركة المرور بشكل مباشر.

!!! info "التثبيت الشامل"
    ابتداءً من عقدة Wallarm 4.6، يُوصى باستخدام [التثبيت الشامل](all-in-one.md) الذي يُتيح أتمتة جميع الأنشطة المدرجة في الخطوات أدناه ويجعل نشر العقدة أسهل بكثير.

يمكن الحصول على NGINX الكود المفتوح من nginx.org أو المستودعات الافتراضية لـ Debian/CentOS حسب متطلباتك وتفضيلات إصدار NGINX وسياسات إدارة المستودعات. تقدم Wallarm حزمًا لكل من [nginx.org](individual-packages-nginx-stable.md) والأٌصدارات التي يوفرها التوزيع. يركز هذا الدليل على NGINX من مستودعات Debian/CentOS.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-distro-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. تمكين Wallarm لتحليل حركة المرور

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

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

## 7. تكوين إرسال حركة المرور إلى عقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 8. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 9. الضبط الدقيق للحل المنشور

تم تثبيت الوحدة الديناميكية Wallarm بالإعدادات الافتراضية لـ NGINX `stable`. قد تتطلب عقدة التصفية بعض التجهيزات الإضافية بعد النشر.

تتم تعريف إعدادات Wallarm باستخدام [التوجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب ضبط التوجيهات في الملفات التالية على الجهاز الذي يحتوي على عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العالمية

    يُستخدم هذا الملف للإعدادات المُطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو قم بإنشاء ملفات تكوين جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و`test.com.conf`). لمزيد من المعلومات التفصيلية حول ملفات تكوين NGINX متوفرة في [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متوفر ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة البيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [ضبط وضع الترشيح][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين الحل الديناميكي لحل اسم DNS في NGINX][dynamic-dns-resolution-nginx]

## القيود

* [اكتشاف تعبئة بيانات الاعتماد][cred-stuffing-docs] غير مدعوم حاليًا، لأن الحزم لم يتم تحديثها إلى الإصدار 4.10 بعد