[img-wl-console-users]: ../../images/check-user-no-2fa.png
[wallarm-status-instr]: ../../admin-en/configure-statistics-service.md
[memory-instr]: ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]: ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]: ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.md
[logging-instr]: ../../admin-en/configure-logging.md
[proxy-balancer-instr]: ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]: ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]: ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]: ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]: ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]: ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]: ../../user-guides/ip-lists/overview.md
[versioning-policy]: ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]: ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]: /installation/nginx/dynamic-module/
[img-node-with-several-instances]: ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]: ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]: ../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]: ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]: ../../user-guides/settings/api-tokens.md
[platform]: ../supported-deployment-options.md
[inline-docs]: ../inline/overview.md
[oob-docs]: ../oob/overview.md
[oob-advantages-limitations]: ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]: ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]: ../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]: ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]: ../../user-guides/ip-lists/overview.md
[download-aio-step]: #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]: #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]: #step-6-restart-nginx
[separate-postanalytics-installation-aio]: ../../admin-en/installation-postanalytics-en.md#all-in-one-automatic-installation

# تنصيب باستخدام المنصب الشامل

المنصب الشامل **تصميمه لتيسير وتوحيد عملية تركيب العقدة Wallarm كموديول ديناميكي لـ NGINX في بيئات مختلفة. هذا المنصب يحدد تلقائيًا إصدارات نظام التشغيل و NGINX الخاصة بك ويقوم بتثبيت كل الاعتماديات اللازمة.

مقارنة مع الباقات الفردية التي تقدمها Wallarm لـ [NGINX](dynamic-module.md)، [NGINX Plus](../nginx-plus.md)، و [NGINX الموفرة من التوزيع](dynamic-module-from-distr.md)، يبسط المنصب الشامل العملية بتنفيذ تلقائيًا للإجراءات التالية:

1. فحص إصدار نظام التشغيل و NGINX الخاص بك.
1. إضافة مستودعات Wallarm لنظام التشغيل وإصدار NGINX المكتشف.
1. تركيب الباقات من Wallarm من هذه المستودعات.
1. ربط الموديول Wallarm المثبت بـ NGINX الخاص بك.
1. ربط العقدة الفلترة بـ Wallarm Cloud باستخدام التوكين المقدم.

![الشامل مقارنة بالتجهيز اليدوي](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## احتياجات الاستخدام

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## الخطوة 1: تركيب NGINX والاعتماديات

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## الخطوة 2: تحضير توكين Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

## الخطوة 3: تحميل المنصب الشامل Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## الخطوة 4: تشغيل المنصب الشامل Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

الأوامر في الخطوات التالية هي نفسها لتركيبات x86_64 و ARM64.

## الخطوة 5: تمكين العقدة Wallarm لتحليل المرور

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-all-in-one.md"

## الخطوة 6: إعادة تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## الخطوة 7: تكوين إرسال المرور إلى العقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## الخطوة 8: اختبار تشغيل العقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 9: ضبط الحل المنصب

تم تنصيب الموديول الديناميكي Wallarm بالإعدادات الافتراضية. قد تتطلب العقدة الفلترة بعض التكوينات الإضافية بعد التنصيب.

تُعرَّف إعدادات Wallarm باستخدام [تعليمات NGINX](../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب وضع التوجيهات في الملفات التالية على الآلة التي تحتوي على العقدة Wallarm:

* `/etc/nginx/nginx.conf` مع إعدادات NGINX
* `/etc/nginx/wallarm-status.conf` مع إعدادات مراقبة العقدة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` مع إعدادات الإضافة `collectd` التي تجمع الإحصاءات من Tarantool

أدناه بعض من الضبط الطبيعي الذي يمكنك تطبيقه إذا لزم الأمر:

* [ضبط وضع الترشيح][waf-mode-instr]
* [تخصيص الموارد لعقد Wallarm][memory-instr]
* [تسجيل متغيرات عقدة Wallarm][logging-instr]
* [استخدام موازن الحمل أو الخادم الوكيل خلف العقدة الفلترة][proxy-balancer-instr]
* [تحديد وقت معالجة الطلب الواحد في التوجيه `wallarm_process_time_limit`][process-time-limit-instr]
* [تحديد وقت انتظار الرد من الخادم في توجيه NGINX `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [تحديد الحجم الأقصى للطلب في توجيه NGINX `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [ضبط دقة DNS الديناميكي في NGINX][dynamic-dns-resolution-nginx]

## خيارات الإطلاق

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## البدء في التنصيب من جديد

إذا كنت بحاجة إلى حذف تنصيب العقدة Wallarm والبدء من جديد، اتبع الخطوات أدناه.

!!! تحذير "تأثير البدء في التنصيب من جديد"
    البدء في التنصيب من جديد ينطوي على إيقاف وحذف خدمات Wallarm الجاري تشغيلها، مما يؤدي إلى توقف الترشيح المروري حتى إعادة التنصيب. يجب توخي الحذر في بيئات الإنتاج أو المرور الحرجة، حيث يترك هذا المرور دون ترشيح وعرضة للخطر.

    لترقية عقدة موجودة (على سبيل المثال، من 4.8 إلى 4.10)، انظر [تعليمات الترقية](../../updating-migrating/all-in-one.md).

1. قم بإنهاء عمليات Wallarm وإزالة ملفات التكوين:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. استمر في عملية إعادة التثبيت باتباع التعليمات الخاصة بالإعداد من [الخطوة الثانية](#step-2-prepare-wallarm-token).