[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:       ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:         ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:    /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:          ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                     ../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[platform]:                         ../supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[download-aio-step]:                #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]:     #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]:               #step-6-restart-nginx
[separate-postanalytics-installation-aio]:  ../../admin-en/installation-postanalytics-en.md#all-in-one-automatic-installation

# التنصيب باستخدام المثبِّت الشامل

هذا **المثبِّت الشامل** مُصمَّم لتبسيط وتوحيد عملية تثبيت عقدة Wallarm كوحدة ديناميكية ل NGINX في بيئات متعددة. هذا المثبِّت يتعرف تلقائيًا على نسخة نظام التشغيل وNGINX الخاص بك، ويثبت جميع التبعيات اللازمة.

في مقارنة بالحزم الفردية من Linux التي تقدمها Wallarm for [NGINX](dynamic-module.md), [NGINX Plus](../nginx-plus.md), و [NGINX المقدم من التوزيع](dynamic-module-from-distr.md), المثبِّت الشامل يبسط العملية من خلال تنفيذ الأعمال التالية تلقائيًا:

1. التحقق من نسخة نظام التشغيل و NGINX الخاص بك.
1. إضافة المستودعات Wallarm للنسخة المكتشفة لنظام التشغيل و NGINX.
1. تثبيت حزم Wallarm من هذه المستودعات.
1. ربط الوحدة المثبتة Wallarm ب NGINX الخاص بك.
1. ربط العقدة الفرعية بـ Wallarm Cloud باستخدام الرمز المقدم.

![مقارنة الكل في واحد باليدوي](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## حالات الاستخدام

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## الخطوة الأولى: تثبيت NGINX والتبعيات

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## الخطوة الثانية: تجهيز رمز Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

## الخطوة الثالثة: تنزيل مثبت Wallarm الشامل

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## الخطوة الرابعة: تشغيل مثبت Wallarm الشامل

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

الأوامر في الخطوات الأخرى هي نفسها لتثبيتات x86_64 و ARM64.

## الخطوة الخامسة: تمكين العقدة لتحليل الحركة

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-all-in-one.md"

## الخطوة السادسة: إعادة تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## الخطوة السابعة: تكوين إرسال الحركة إلى العقدة

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## الخطوة الثامنة: اختبار تشغيل العقدة

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة التاسعة: ضبط الحل المستخدم حسب الحاجة

وحدة Wallarm الدينامكية مع الإعدادات الافتراضية مثبتة. قد تتطلب العقدة الفرعية بعض التهيئة الإضافية بعد التنصيب.

تحدد إعدادات Wallarm باستخدام [توجيهات NGINX](../../admin-en/configure-parameters-en.md) أو واجهة المستخدم الرسومية لـ Wallarm Console. يجب تعيين التوجيهات في الملفات التالية على الجهاز الذي به العقدة:

* `/etc/nginx/nginx.conf` مع إعدادات NGINX
* `/etc/nginx/wallarm-status.conf` مع إعدادات رصد العقدة. الوصف التفصيلي متاح في ال[رابط][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` مع إعدادات الـ 'collectd' الذي يجمع الإحصائيات من Tarantool

أدناه توجد بعض الإعدادات النمطية التي يمكنك تطبيقها إذا كانت مطلوبة:

* [تكوين نمط الترشيح][waf-mode-instr]
* [تخصيص الموارد لعقد Wallarm][memory-instr]
* [تسجيل متغيرات العقدة][logging-instr]
* [استخدام موازن الحمولة لخادم الوكيل خلف العقدة الفرعية][proxy-balancer-instr]
* [تحديد الوقت الأقصى لمعالجة الطلب الواحد في التوجيه `wallarm_process_time_limit`][process-time-limit-instr]
* [تحديد الوقت الأقصى لانتظار الرد من الخادم في توجيه NGINX `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [تحديد الحجم الأقصى للطلب في توجيه NGINX `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [تكوين التحليل الديناميكي ل DNS في NGINX][dynamic-dns-resolution-nginx]

## خيارات التشغيل

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## إعادة البدء في التثبيت

إذا كنت بحاجة إلى حذف تثبيت العقدة والبدء من جديد، اتبع الخطوات أدناه.

!!! تحذير "تأثير إعادة البدء في التثبيت"
    ينطوي إعادة البدء في التثبيت على إيقاف وحذف الخدمات Wallarm المشتغلة حاليًا، وبالتالي توقف الترشيح الحركة حتى إعادة التثبيت. كن حذرًا في بيئات الإنتاج أو الحركة الحرجة، حيث يترك الحركة غير مُرَشَّحَة ومعرضة للخطر.
    
    لترقية العقدة الموجودة (مثل من 4.8 إلى 4.10)، راجع [تعليمات الترقية](../../updating-migrating/all-in-one.md).

1. إنهاء عمليات Wallarm وإزالة ملفات التكوين:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. استمر في عملية إعادة التثبيت عن طريق اتباع تعليمات الإعداد من ال[خطوة الثانية](#step-2-prepare-wallarm-token).