---
search:
  exclude: true
---

[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[oob-advantages-limitations]:       ../../../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../../../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[download-aio-step]:                #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]:     #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]:               #step-6-restart-nginx
[separate-postanalytics-installation-aio]:  ../../../../admin-en/installation-postanalytics-en.md#all-in-one-automatic-installation

# التوظيف باستخدام الأداة All-in-One

توفر هذه التعليمات الخطوات التي توضح كيفية تثبيت Wallarm كوحدة نمطية ديناميكية [OOB](../overview.md) باستخدام **أداة التثبيت All-in-One** المصممة لتبسيط وتوحيد عملية تثبيت وحدة Wallarm النمطية التي تعمل كوحدة لـ NGINX في مختلف البيئات. تقوم هذه الأداة بتحديد نظام التشغيل وإصدارات NGINX تلقائياً، ثم تثبت جميع الاعتمادات اللازمة.

بالمقارنة بالحزم الفردية لنظام التشغيل Linux التي توفرها Wallarm لـ [NGINX](nginx-stable.md)، و[NGINX Plus](nginx-plus.md)، و[نسخة NGINX الموزعة مسبقًا](nginx-distro.md)، تبسط أداة التثبيت **All-in-One** العملية من خلال القيام تلقائياً بالإجراءات التالية:

1. التحقق من نظام التشغيل وإصدار NGINX الخاص بك.
1. إضافة مستودعات Wallarm لنظام التشغيل وإصدار NGINX المكتشف.
1. تثبيت حزم Wallarm من هذه المستودعات.
1. التوصيل بوحدة Wallarm المثبتة مع NGINX الخاص بك.
1. توصيل العقدة التصفية بـ Wallarm Cloud باستخدام الرمز المميز المقدم.

![الأداة All-in-One مقارنة بالتثبيت اليدوي](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## سيناريوهات الاستخدام

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## الخطوة 1: تثبيت NGINX والاعتمادات اللازمة

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## الخطوة 2: استعد رمز Wallarm المميز

--8<-- "../include/waf/installation/all-in-one-token.md"

## الخطوة 3: تحميل المثبت All-in-One من Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## الخطوة 4: تشغيل المثبت All-in-One من Wallarm

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

أوامر الخطوات اللاحقة هي نفسها للتثبيتات x86_64 و ARM64.

## الخطوة 5: تمكين عقدة Wallarm لتحليل الحركة

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux-all-in-one.md"

## الخطوة 6: إعادة تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## الخطوة 7: تكوين إرسال الحركة إلى عقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## الخطوة 8: تجربة عملية عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 9: ضبط الحل المنصوب بشكل دقيق

تم تثبيت الوحدة النمطية الديناميكية لـ Wallarm مع الإعدادات الافتراضية. قد تحتاج العقدة التصفية إلى بعض التكوينات الإضافية بعد النشر.

يتم تعريف إعدادات Wallarm باستخدام [التوجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة المستخدم الرسومية لـ Wallarm Console. يجب تعيين التوجيهات في الملفات التالية على الجهاز التي تحتوي على العقدة Wallarm:

* `/etc/nginx/nginx.conf` مع إعدادات NGINX
* `/etc/nginx/wallarm-status.conf` مع إعدادات مراقبة العقدة Wallarm. وصف مفصل متاح داخل [الرابط][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` مع الإعدادات للإضافة `collectd` التي تجمع الإحصائيات من Tarantool

أدناه هناك بعض التوجيهات الأنماطية التي يمكنك تطبيقها إذا كانت بحاجة:

* [تخصيص الموارد للعقد Wallarm][memory-instr]
* [تسجيل متغيرات العقد Wallarm][logging-instr]
* [استخدام متوازن للخادم الوسيط وراء العقدة التصفية][proxy-balancer-instr]
* [الحد من وقت معالجة الطلبات الفردية في التوجيه `wallarm_process_time_limit`][process-time-limit-instr]
* [الحد من وقت الانتظار للرد من الخادم في التوجيه `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [الحد من الحجم الأقصى للطلب في التوجيه `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [تكوين الدقة الديناميكية لـ DNS في NGINX][dynamic-dns-resolution-nginx]

## خيارات التشغيل

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## بدء التثبيت من جديد

إذا كنت بحاجة إلى حذف تثبيت العقدة Wallarm والبدء من جديد, فاتبع الخطوات أدناه.

!!! warning "تأثير بدء التثبيت من جديد"
    بدء التثبيت من جديد يشمل إيقاف وحذف الخدمات الجارية لـ Wallarm, مما يعلق تصفية الحركة حتى إعادة التثبيت. كن حذراً في بيئات الإنتاج أو الحركة الحرجة, حيث يترك الحركة غير مصفاة وعرضة للخطر.

    لترقية العقدة الموجودة (مثلاً, من 4.8 إلى 4.10), راجع [تعليمات الترقية](../../../../updating-migrating/all-in-one.md).

1. إنهاء عمليات Wallarm وإزالة ملفات التكوين:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
2. استمر في عملية إعادة التثبيت عن طريق اتباع تعليمات الإعداد من [الخطوة الثانية](#step-2-prepare-wallarm-token).