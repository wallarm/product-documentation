![img-wl-console-users]:             ../../images/check-user-no-2fa.png
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
[versioning-policy]:               ../../updating-migrating/versioning-policy.md#version-list
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
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
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# تثبيت كوحدة ديناميكية لإصدار NGINX المقدم من التوزيع

توصف هذه التعليمات الخطوات لتثبيت عقدة تصفية Wallarm كوحدة ديناميكية لإصدار المصدر المفتوح من NGINX المثبت من مستودعات Debian/CentOS.

!!! info "تثبيت شامل"
    ابتداءً من عقدة Wallarm 4.6، يُنصح باستخدام [تثبيت شامل](all-in-one.md) الذي يُوَتِمّ جميع الأنشطة المذكورة أدناه ويجعل نشر العقدة أسهل بكثير.

يمكن الحصول على NGINX المصدر المفتوح من nginx.org أو المستودعات الافتراضية لـ Debian/CentOS بناءً على متطلباتك، وتفضيلات إصدار NGINX، وسياسات إدارة المستودع. توفر Wallarm حزمًا لكل من إصدارات [nginx.org](dynamic-module.md) والإصدارات التي يوفرها التوزيع. هذا الدليل يركز على NGINX من مستودعات Debian/CentOS.

## حالات الاستخدام

--8<-- "../include/waf/installation/linux-packages/nginx-distro-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. تمكين Wallarm لتحليل حركة المرور

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

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

## 7. تكوين إرسال حركة المرور إلى عقدة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 9. تعديل الحل المنتشر

يتم تثبيت الوحدة الديناميكية Wallarm بإعدادات افتراضية لإصدار `stable` من NGINX. قد تتطلب عقدة التصفية بعض التهيئات الإضافية بعد الانتشار.

تُعرَّف إعدادات Wallarm باستخدام [توجيهات NGINX](../../admin-en/configure-parameters-en.md) أو واجهة مستخدم Wallarm Console. يجب تعيين التوجيهات في الملفات التالية على الجهاز الحاوي لعقدة Wallarm:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العامة

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو أنشئ ملفات تهيئة جديدة لكل مجموعة نطاقات (على سبيل المثال، `example.com.conf` و `test.com.conf`). المزيد من المعلومات التفصيلية حول ملفات تهيئة NGINX متاحة في [وثائق NGINX الرسمية](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح في [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تهيئة وضع الترشيح][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [تكوين الحل الديناميكي لاستكشاف DNS في NGINX][dynamic-dns-resolution-nginx]

## القيود

* [اكتشاف حشو البيانات][cred-stuffing-docs] غير مدعوم حاليًا، حيث لم يتم تحديث الحزم إلى الإصدار 4.10 بعد.