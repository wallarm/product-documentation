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
[download-aio-step]:                #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]:     #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]:               #step-6-restart-nginx
[separate-postanalytics-installation-aio]:  ../../../../admin-en/installation-postanalytics-en.md#all-in-one-automatic-installation

# التركيب باستخدام المثبت المتكامل 

تم تصميم **المثبت المتكامل** لتبسيط وتوحيد عملية تثبيت وحدة Wallarm كوحدة نمطية ديناميكية لـ NGINX في مختلف البيئات. يقوم المثبت هذا بتحديد نظام التشغيل وإصدارات NGINX تلقائيًا، ويثبت جميع الاعتماديات اللازمة.

أما بالمقارنة مع الحزم الفردية لنظام التشغيل اللينكس التي تقدمها Wallarm لـ [NGINX](individual-packages-nginx-stable.md)، و[NGINX Plus](individual-packages-nginx-plus.md)، و[NGINX الموزع](individual-packages-nginx-distro.md)، فإن **المثبت المتكامل** يبسط العملية من خلال تنفيذ التعليمات البرمجية التالية تلقائيًا:

1. التحقق من نظام التشغيل ونسخة NGINX الخاصة بك.
1. إضافة مستودعات Wallarm لنسخة نظام التشغيل وNGINX الذي تم الكشف عنهما.
1. تنصيب حزم Wallarm من هذه المستودعات.
1. ربط وحدة Wallarm المثبتة بـ NGINX الخاص بك.
1. الاتصال بالعقدة التصفية إلى Wallarm Cloud باستخدام الرمز المميز المقدم.

![المثبتات المتكاملة مقابل التثبيت اليدوي](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## استخدام الحالات

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## الخطوة 1: تثبيت NGINX والاعتماديات

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## الخطوة 2: تحضير كود مميز لـ Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

## الخطوة 3: تنزيل مثبت Wallarm المتكامل 

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## الخطوة 4: تشغيل مثبت Wallarm المتكامل 

--8<-- "../include/waf/installation/all-in-one-installer-run.md"
