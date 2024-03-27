# تنصيب موديول والارم دايناميكي OOB لـ NGINX الثابت باستخدام حزم لينكس

هذه التعليمات تصف الخطوات لتنصيب والارم كموديول [OOB](../overview.md) دايناميكي باستخدام حزم لينكس لـ NGINX `الثابت` من nginx.org.

والارم يدعم أنظمة التشغيل التالية:

* ديبيان 11.x (بولسي)
* أوبونتو 18.04 LTS (بيونك)
* أوبونتو 20.04 LTS (فوكال)
* أوبونتو 22.04 LTS (جامي)
* سنتوس 7.x
* أمزون لينكس 2.0.2021x وأقل
* ألما لينكس، روكي لينكس أو أوراكل لينكس 8.x
* RHEL 8.x

## استخدام الحالات

--8<-- "../include/waf/installation/linux-packages/nginx-stable-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. تفعيل والارم لتحليل الحركة

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. إعادة تشغيل NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال الحركة إلى نسخة والارم

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 9. اختبار تشغيل نود والارم

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. ضبط الحل المنصوب بدقة

الموديول الدايناميكي لوالارم بالإعدادات الافتراضية يتم تنصيبه لـ NGINX `الثابت`. قد يتطلب النود المُصفِي بعض الضبط الإضافي بعد النشر.

تعريف إعدادات والارم يتم استخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم والارم. يجب تعيين التوجيهات في الملفات التالية على الآلة مع النود والارم:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات النود المُصفِي العالمية

    يُستعمل الملف لإعدادات تطبق على كل النطاقات. لتطبيق إعدادات مختلفة لمجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات التكوين الجديدة لكل مجموعة نطاق (مثل `example.com.conf` و `test.com.conf`). معلومات أكثر تفصيلا حول ملفات تكوين NGINX متوفرة في [وثائق NGINX الرسمية](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة النود والارم. الوصف التفصيلي متوفر ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات تارانتول

بالأسفل هناك بعض من الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين حل DNS ديناميكي في NGINX][dynamic-dns-resolution-nginx]