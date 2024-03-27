[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../../../images/installation-ami/common/create_sg.png
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
[autoscaling-docs]:                 ../../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../../admin-en/configure-logging.md
[wallarm-mode]:                     ../../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../../admin-en/configure-parameters-en.md#wallarm_force

# نشر وولارم من صورة أمازون للآلة

هذا المقال يوفر تعليمات لنشر وولارم على AWS باستخدام [الصورة الرسمية لأمازون للآلة (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD).

## استخدامات

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. ربط النسخة بسحابة وولارم

نسخة السحابة من العقد تتصل بالسحابة من خلال سكريبت [cloud-init.py][cloud-init-spec]. هذا السكريبت يسجل العقدة مع سحابة وولارم باستخدام رمز مقدم، يضبطها عالمياً على وضع المراقبة [mode][wallarm-mode]، ويضبط العقدة لتوجيه الحركة المشروعة بناءً على علم `--proxy-pass`. إعادة تشغيل NGINX يكمل الإعداد.

شغل سكريبت `cloud-init.py` على النسخة المُنشأة من صورة السحابة كالآتي:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` يضع اسم مجموعة العقد (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يتم تطبيقه فقط إذا كان يُستخدم رمز API.
* `<TOKEN>` هو قيمة الرمز المنسوخة.
* `<PROXY_ADDRESS>` هو عنوان لعقدة وولارم لتوجيه الحركة المشروعة إليه. يمكن أن يكون عنوان IP لنسخة تطبيق، موازن تحميل، أو اسم DNS، إلخ، بناءً على هندستك.

## 7. تهيئة إرسال الحركة إلى نسخة وولارم

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 8. اختبار تشغيل وولارم

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. تنظيم الحل المنشور بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"