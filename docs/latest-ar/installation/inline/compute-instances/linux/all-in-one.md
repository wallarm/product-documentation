# التثبيت باستخدام "المثبت الشامل"

**المثبت الشامل** هو مصمم لتسهيل وتوحيد عملية تثبيت نقطة Wallarm كوحدة ديناميكية لـ NGINX في بيئات متنوعة. يتعرف هذا المثبت تلقائيًا على إصدارات نظام التشغيل وNGINX الخاص بك، ويقوم بتثبيت كل الاعتماديات اللازمة.

مقارنة بالحزم الفردية لـ Linux التي تقدمها Wallarm لـ [NGINX](individual-packages-nginx-stable.md)، و[NGINX Plus](individual-packages-nginx-plus.md)، و[NGINX المُوفَر من التوزيع](individual-packages-nginx-distro.md)، **المثبت الشامل** يُبسطالعملية عن طريق أداء الخطوات التالية تلقائيًا:

1. فحص إصدار نظام التشغيل وNGINX الخاص بك.
1. إضافة مستودعات Wallarm لإصدار نظام التشغيل وNGINX المكتشف.
1. تثبيت حزم Wallarm من هذه المستودعات.
1. ربط وحدة Wallarm المثبتة بنظام NGINX الخاص بك.
1. ربط النقطة الفلترة بسحابة Wallarm باستخدام الرمز المُقدم.

![المثبت الشامل مقارنة بالتثبيت اليدوي](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## حالات الاستخدام

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## الخطوة 1: تثبيت NGINX والاعتماديات

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## الخطوة 2: الاستعداد برمز Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

## الخطوة 3: تحميل "المثبت الشامل" لـ Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## الخطوة 4: تشغيل "المثبت الشامل" لـ Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

الأوامر في الخطوات التالية هي نفسها لتثبيتات x86_64 وARM64.

## الخطوة 5: تفعيل نقطة Wallarm لتحليل الحركة

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## الخطوة 6: إعادة تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## الخطوة 7: تكوين إرسال حركة المرور إلى نقطة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## الخطوة 8: اختبار تشغيل نقطة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 9: ضبط الحل المُنشر بدقة

تم تثبيت الوحدة الديناميكية لـ Wallarm بالإعدادات الافتراضية. قد تحتاج النقطة الفلترة إلى بعض التكوين الإضافي بعد النشر.

يتم تعريف إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة Wallarm Console UI. يجب ضبط التوجيهات في الملفات التالية على الجهاز المزود بنقطة Wallarm:

* `/etc/nginx/nginx.conf` بإعدادات NGINX
* `/etc/nginx/wallarm-status.conf` بإعدادات مراقبة نقطة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` بإعدادات الإضافة `collectd` التي تجمع إحصائيات من Tarantool

فيما يلي بعض الإعدادات النمطية التي يمكن تطبيقها إذا لزم الأمر:

* [تكوين وضع الفلترة][waf-mode-instr]
* [تخصيص الموارد لنقاط Wallarm][memory-instr]
* [تسجيل متغيرات نقطة Wallarm][logging-instr]
* [استخدام موازنة الحمولة أو الخادم الوكيل خلف النقطة الفلترة][proxy-balancer-instr]
* [تحديد وقت معالجة الطلب الفردي في التوجيه `wallarm_process_time_limit`][process-time-limit-instr]
* [تحديد وقت انتظار رد الخادم في توجيه NGINX `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [تحديد الحد الأقصى لحجم الطلب في توجيه NGINX `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [تكوين الحل للإنترنت الديناميكي في NGINX][dynamic-dns-resolution-nginx]

## خيارات الإطلاق

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## البدء من جديد في التثبيت

إذا كنت بحاجة إلى حذف تثبيت نقطة Wallarm والبدء من جديد، اتبع الخطوات التالية.

!!! تحذير "تأثير البدء من جديد في التثبيت"
    البدء من جديد في التثبيت يتضمن إيقاف وحذف خدمات Wallarm الجارية، مما يُوقِف تصفية الحركة حتى إعادة التثبيت. ينبغى توخي الحذر في بيئات الإنتاج أو الحركة الحرجة، حيث أن ذلك يترك الحركة غير مُصفاة وعُرضة للخطر.

    لترقية نقطة موجودة (على سبيل المثال، من 4.8 إلى 4.10)، اطلع على [تعليمات الترقية](../../../../updating-migrating/all-in-one.md).

1. إنهاء عمليات Wallarm وحذف ملفات التكوين:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. استمر في عملية إعادة التثبيت باتباع تعليمات الإعداد من [الخطوة الثانية](#step-2-prepare-wallarm-token).