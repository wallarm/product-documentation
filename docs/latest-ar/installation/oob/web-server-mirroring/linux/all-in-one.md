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

# التثبيت بواسطة المثبت كل في واحد

هذه التعليمات تصف الخطوات لتثبيت Wallarm كوحدة نمطية ديناميكية [OOB](../overview.md) باستخدام **المثبت كل في واحد** المصمم لتبسيط وتوحيد عملية تثبيت عقدة Wallarm كوحدة نمطية ديناميكية لـ NGINX في بيئات متنوعة. يقوم هذا المثبت تلقائيًا بتحديد إصدارات نظام التشغيل وNGINX لديك، وتثبيت جميع الاعتماديات الضرورية.

بالمقارنة مع حزم Linux الفردية التي تقدمها Wallarm لـ [NGINX](nginx-stable.md), [NGINX Plus](nginx-plus.md), و[NGINX المقدم من التوزيع](nginx-distro.md), فإن **المثبت كل في واحد** يبسط العملية بأداء الإجراءات التالية تلقائيًا:

1. التحقق من نظام التشغيل وإصدار NGINX لديك.
1. إضافة مستودعات Wallarm لنظام التشغيل وإصدار NGINX المكتشف.
1. تثبيت حزم Wallarm من هذه المستودعات.
1. ربط الوحدة النمطية Wallarm المثبتة بـ NGINX الخاص بك.
1. ربط عقدة التصفية بـ Wallarm Cloud باستخدام الرمز المميز المقدم.

![المثبت كل في واحد مقارنةً بالتثبيت اليدوي](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## حالات الاستخدام

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## الخطوة 1: تثبيت NGINX والاعتماديات

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## الخطوة 2: تحضير رمز Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

## الخطوة 3: تنزيل مثبت Wallarm كل في واحد

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## الخطوة 4: تشغيل مثبت Wallarm كل في واحد

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

الأوامر في الخطوات التالية متشابهة لتثبيتات x86_64 وARM64.

## الخطوة 5: تمكين عقدة Wallarm لتحليل حركة المرور

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux-all-in-one.md"

## الخطوة 6: إعادة تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## الخطوة 7: تهيئة إرسال حركة المرور إلى عقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## الخطوة 8: اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## الخطوة 9: تنقيح الحل المُطبق

يتم تثبيت وحدة Wallarm الديناميكية بالإعدادات الافتراضية. قد تحتاج عقدة التصفية إلى بعض التهيئة الإضافية بعد النشر.

يتم تعريف إعدادات Wallarm باستخدام [توجيهات NGINX](../../../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب تعيين التوجيهات في الملفات التالية على جهاز بعقدة Wallarm:

* `/etc/nginx/nginx.conf` مع إعدادات NGINX
* `/etc/nginx/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف الدقيق متوفر ضمن [الرابط][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` مع إعدادات الإضافة `collectd` التي تجمع الإحصائيات من Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تخصيص الموارد لعقد Wallarm][memory-instr]
* [تسجيل متغيرات عقدة Wallarm][logging-instr]
* [استخدام موازنة أو خادم وكيل خلف عقدة التصفية][proxy-balancer-instr]
* [تحديد وقت معالجة الطلب الواحد في توجيه `wallarm_process_time_limit`][process-time-limit-instr]
* [تحديد وقت الانتظار للرد من الخادم في توجيه NGINX `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [تحديد الحجم الأقصى للطلب في توجيه NGINX `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [تكوين الحل بدقة DNS ديناميكي في NGINX][dynamic-dns-resolution-nginx]

## خيارات التشغيل

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## البدء في التثبيت من جديد

إذا كنت بحاجة إلى حذف تثبيت عقدة Wallarm والبدء من جديد، اتبع الخطوات أدناه.

!!! warning "تأثير البدء في التثبيت من جديد"
    البدء في التثبيت من جديد يتضمن إيقاف وحذف خدمات Wallarm الجارية، وبالتالي إيقاف تصفية حركة المرور حتى إعادة التثبيت. يجب توخي الحذر في بيئات حركة المرور الإنتاجية أو الحيوية، حيث يترك هذا حركة المرور غير مُصفَّاة وعُرضة للمخاطر.

    لترقية عقدة موجودة (على سبيل المثال، من 4.8 إلى 4.10)، انظر إلى [تعليمات الترقية](../../../../updating-migrating/all-in-one.md).

1. إنهاء عمليات Wallarm وإزالة ملفات التكوين:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. تابع عملية إعادة التثبيت باتباع التعليمات الإعدادية من [الخطوة الثانية](#step-2-prepare-wallarm-token).