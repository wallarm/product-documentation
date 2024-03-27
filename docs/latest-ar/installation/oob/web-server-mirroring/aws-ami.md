[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../admin-en/configure-parameters-en.md#wallarm_force
[web-server-mirroring-examples]:    overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# نشر وولارم OOB من صورة أمازون

هذا المقال يوفر تعليمات لنشر [وولارم OOB](overview.md) على AWS باستخدام [الصورة الرسمية لآلة أمازون (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). الحل الموصوف هنا مصمم لتحليل حركة مرور معكوسة بواسطة خادم ويب أو بروكسي.

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. ربط النسخة بسحابة وولارم

نسخة السحابة تتصل بسحابة وولارم عبر سكربت [cloud-init.py][cloud-init-spec]. يقوم هذا السكربت بتسجيل العقدة مع سحابة وولارم باستخدام رمز معطى، يضبطها عالميًا على [وضع][wallarm-mode] الرصد، ويضع توجيهات [`wallarm_force`][wallarm_force_directive] في قسم `location /` لـ NGINX لتحليل نسخ حركة المرور المعكوسة فقط. إعادة تشغيل NGINX يكمل الإعداد.

قم بتشغيل سكربت `cloud-init.py` على النسخة المنشأة من صورة السحابة كالتالي:

=== "سحابة أمريكا"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "سحابة أوروبا"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'` يضبط اسم مجموعة عقدة (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يطبق فقط إذا كنت تستخدم رمز API.
* `<TOKEN>` هو قيمة الرمز المنسوخة.

## 7. تكوين خادم ويب أو بروكسي لعكس حركة المرور إلى العقدة وولارم

1. قم بتكوين خادم الويب أو البروكسي (مثل NGINX, Envoy) لعكس حركة المرور الواردة إلى عقدة وولارم. بالنسبة لتفاصيل التكوين، نوصي بالرجوع إلى توثيق خادم الويب أو البروكسي الخاص بك.

    داخل [الرابط][web-server-mirroring-examples]، ستجد تكوين مثالي لأشهر خوادم الويب والبروكسي (NGINX, Traefik, Envoy).
1. ضع التكوين التالي في ملف `/etc/nginx/sites-enabled/default` على النسخة مع العقدة:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # تغيير 222.222.222.22 إلى عنوان خادم العكس
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    توجيهات `set_real_ip_from` و `real_ip_header` مطلوبة لعرض [عناوين IP للمهاجمين][real-ip-docs] في واجهة وولارم.

## 8. اختبار تشغيل وولارم

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 9. ضبط الحل المنشور

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"