# تركيب كوحدة ديناميكية لإصدار NGINX الذي يوفره توزيع

توضح هذه التعليمات الخطوات لتركيب عقدة فلترة Wallarm كوحدة ديناميكية لإصدار المصدر المفتوح من NGINX المثبت من مستودعات Debian/CentOS. ستقوم العقدة بتحليل الحركة على الخط مباشرةً.

!!! info "تركيب كلي في وقت واحد"
    بدءًا من عقدة Wallarm رقم 4.6، يُنصح باستخدام [التركيب الكلي في وقت واحد](all-in-one.md) الذي يؤتمت جميع الأنشطة المدرجة في الخطوات أدناه ويجعل نشر العقدة أسهل بكثير.

يمكن الحصول على NGINX المصدر المفتوح من nginx.org أو المستودعات الافتراضية لـ Debian/CentOS حسب متطلباتك، تفضيلات إصدار NGINX، وسياسات إدارة المستودعات. توفر Wallarm حزمًا لكل من [nginx.org](individual-packages-nginx-stable.md) والإصدارات التي يوفرها التوزيع. تركز هذه الدليل على NGINX من مستودعات Debian/CentOS.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-distro-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. تمكين Wallarm لتحليل الحركة

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

## 7. تكوين إرسال الحركة للوحدة النمطية Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 8. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 9. ضبط الحل المنشور بدقة

تُثبت الوحدة النمطية ديناميكية لـ Wallarm مع الإعدادات الافتراضية لـ NGINX `stable`. قد تتطلب العقدة بعض التهيئة الإضافية بعد النشر.

تُعرف إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب تعيين التوجيهات في الملفات التالية على الجهاز بعقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة الفلترة العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تهيئة جديدة لكل مجموعة نطاق (على سبيل المثال، `example.com.conf` و`test.com.conf`). متوفر مزيد من المعلومات التفصيلية حول ملفات تهيئة NGINX في [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. متوفر وصف تفصيلي داخل [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تهيئة وضع الفلترة][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين القرار الديناميكي لنطاقات DNS في NGINX][dynamic-dns-resolution-nginx]

## القيود

* [اكتشاف انتحال الأوراق الاعتمادية][cred-stuffing-docs] غير مدعوم حالياً، حيث لم تتم تحديث الحزم بعد إلى إصدار 4.10