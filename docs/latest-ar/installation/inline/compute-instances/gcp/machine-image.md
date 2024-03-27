[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../../installation/supported-deployment-options.md
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../../admin-en/configure-logging.md
[wallarm-mode]:                     ../../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../../admin-en/configure-parameters-en.md#wallarm_force

# تشغيل Wallarm من صورة آلة GCP

المقال ده بيقدم خطوات لتشغيل Wallarm على GCP باستخدام [الصورة الرسمية للآلة](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. ربط عقدة التصفية ب Wallarm Cloud

عقدة النسخة السحابية بتربط بالسحابة عن طريق سكريبت [cloud-init.py][cloud-init-spec]. السكريبت ده بيسجل العقدة مع Wallarm Cloud باستخدام توكن معين، بيضبطه عالميًا على وضع المراقبة [mode][wallarm-mode]، وبيضبط العقدة لتوجيه حركة المرور الشرعية بناءً على علم `--proxy-pass`. إعادة تشغيل NGINX بتكمل الضبط.

شغل سكريبت `cloud-init.py` على النسخة المنشأة من الصورة السحابية كالتالي:

=== "سحابة الولايات المتحدة"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "سحابة الاتحاد الأوروبي"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` بيضبط اسم مجموعة العقدة (موجودة بالفعل، أو، لو مش موجودة، هتتكون). بيتطبق بس لو استخدمتو توكن API.
* `<TOKEN>` هو قيمة التوكن المنسوخة.
* `<PROXY_ADDRESS>` هو عنوان لعقدة Wallarm لتوجيه حركة المرور الشرعية إليه. ممكن يكون عنوان IP لنسخة تطبيق، موازنة الحمل، أو اسم DNS، إلخ، حسب هيكليتك.

## 6. ضبط إرسال الحركة لنسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 7. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. ضبط الحل المنشور بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"