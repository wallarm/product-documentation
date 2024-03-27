# تنصيب موديول Wallarm OOB الديناميكي ل NGINX الموفّر من التوزيع

هذه التعليمات تصف الخطوات لتنصيب Wallarm كموديول [OOB](../overview.md) ديناميكي باستخدام حزم لينكس لـ NGINX الموفر من التوزيع.

يمكن الحصول على NGINX الأساسي من nginx.org أو المستودعات الافتراضية لـ Debian/CentOS حسب متطلباتك، تفضيلات إصدار NGINX، وسياسات إدارة المستودع. Wallarm يوفر حزم لكلٍ من [nginx.org](nginx-stable.md) والإصدارات المقدمة من التوزيع. يركز هذا الدليل على NGINX من مستودعات Debian/CentOS.

موديول Wallarm متوافق مع NGINX المقدم من التوزيع على أنظمة التشغيل التالية:

* Debian 10.x (buster)
* Debian 11.x (bullseye)
* CentOS 7.x
* AlmaLinux، Rocky Linux أو Oracle Linux 8.x
* RHEL 8.x

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-distro-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. تمكين Wallarm لتحليل الحركة

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux.md"

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
=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. تهيئة إرسال الحركة إلى مثيل Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 8. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 9. تعديل الحل المنصوب

يُنصب موديول Wallarm الديناميكي بإعدادات افتراضية لـNGINX `stable`. قد تتطلب عقدة التصفية بعض الإعدادات الإضافية بعد التنصيب.

يتم تحديد إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب ضبط التوجيهات في الملفات التالية على الجهاز الذي يحوي عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العامة

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تهيئة جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و `test.com.conf`). المزيد من المعلومات المفصلة عن ملفات تهيئة NGINX متاحة في [وثائق NGINX الرسمية](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

أدناه بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تهيئة الحل DNS الديناميكي في NGINX][dynamic-dns-resolution-nginx]