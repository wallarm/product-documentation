# تثبيت الوحدة الديناميكية الخارجية لـ Wallarm لإصدارات NGINX المقدمة من التوزيع

تصف هذه التعليمات الخطوات لتثبيت Wallarm كوحدة ديناميكية [خارجية](../overview.md) باستخدام حزم Linux لـ NGINX المقدمة من التوزيع.

يمكن الحصول على NGINX Open Source من nginx.org أو المستودعات الافتراضية لـ Debian/CentOS اعتمادًا على متطلباتك وتفضيلات إصدار NGINX وسياسات إدارة المستودع. توفر Wallarm حزمًا لكل من [nginx.org](nginx-stable.md) والإصدارات المقدمة من التوزيع. يركز هذا الدليل على NGINX من مستودعات Debian/CentOS.

تتوافق وحدة Wallarm مع NGINX المقدمة من التوزيع على أنظمة التشغيل التالية:

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

## 5. تمكين Wallarm لتحليل حركة المرور

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

## 7. تكوين إرسال الحركة إلى كيان Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 8. اختبار تشغيل كيان Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 9. ضبط الحل المنشور بدقة 

تم تثبيت الوحدة الديناميكية Wallarm بالإعدادات الافتراضية لـ NGINX `الثابت`. قد يتطلب كيان التصفية بعض التكوينات الإضافية بعد النشر.

تُعرّف إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة المستخدم لوحة تحكم Wallarm. يجب ضبط التوجيهات في الملفات التالية على الجهاز الذي يحتوي على كيان Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات كيان التصفية العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات النطاقات المختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و `test.com.conf`). المزيد من المعلومات التفصيلية حول ملفات تكوين NGINX متوفرة في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة كيان Wallarm. الوصف التفصيلي متوفر ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

أدناه بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين الحل DNS الديناميكي في NGINX][dynamic-dns-resolution-nginx]