[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../custom/custom-nginx-version.md
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png

# تركيبها كموديول متحرك لـ NGINX Stable

توصف هذه الإرشادات خطوات تركيب عقدة التصفية Wallarm كموديول متحرك للنسخة المصدر المفتوحة من NGINX `stable` التي تم تركيبها من مخزن NGINX.

!!! info "تركيب كلي"
    ابتداءً من عقدة Wallarm 4.6، يُنصح باستخدام [تركيب كلي](all-in-one.md) الذي يؤتمت جميع الأنشطة المدرجة في الخطوات أدناه ويجعل توزيع العقدة أسهل بكثير.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-stable-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. تفعيل Wallarm لتحليل المرور

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. إعادة تشغيل NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. تكوين إرسال المرور إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. اختبار عملية عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. ضبط الحل الموزع

تم تركيب موديول Wallarm الحركي بالإعدادات الافتراضية لـ NGINX `stable`. قد تتطلب عقدة التصفية بعض الضبط الإضافي بعد التوزيع.

تُحدد إعدادات Wallarm باستخدام [توجيهات NGINX](../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب ضبط التوجيهات في الملفات التالية على الآلة التي تحتوي على عقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` بإعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` بإعدادات عقدة التصفية العامة

    يُستخدم الملف للإعدادات المطبقة على جميع المجالات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تكوين جديدة لكل مجموعة نطاق (على سبيل المثال، `example.com.conf` و `test.com.conf`). متوفر مزيد من المعلومات التفصيلية حول ملفات تكوين NGINX في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` بإعدادات مراقبة عقدة Wallarm. متوفر وصف مفصل ضمن ال[رابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` بإعدادات قاعدة بيانات Tarantool

أدناه هناك بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [ضبط وضع الترشيح][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [ضبط الدقة الديناميكية لـ DNS في NGINX][dynamic-dns-resolution-nginx]

## القيود

* [كشف اختراق بيانات الاعتماد][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم يتم تحديث الحزم إلى الإصدار 4.10 بعد