[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# نشر Wallarm باستخدام صورة آلة أمازون

توفر هذه المقالة تعليمات لنشر Wallarm على AWS من خلال استخدام [صورة آلة أمازون (AMI) الرسمية](https://aws.amazon.com/marketplace/pp/B073VRFXSD).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. ربط النسخة بهواء Wallarm

يتم ربط نسخة السحاب بخدمة Wallarm السحابية باستخدام السكربت [cloud-init.py][cloud-init-spec]. يسجل هذا السكربت النسخة بخدمة Wallarm السحابية باستخدام رمز مُعطى، يضبط النسخة عالمياً على وضع الرصد [mode][wallarm-mode]، ويُعد النسخة لتوجيه حركة المرور الشرعية بناءً على علامة `--proxy-pass`. إعادة تشغيل NGINX تُكمل الإعداد.

قم بتشغيل السكربت `cloud-init.py` على النسخة المُنشأة من صورة السحاب كالتالي:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` يحدد اسم مجموعة للنسخة (موجودة مسبقاً، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يطبق هذا فقط إذا كنت تستخدم رمز API.
* `<TOKEN>` هو قيمة الرمز المنسوخة.
* `<PROXY_ADDRESS>` هو عنوان لنسخة Wallarm لتوجيه حركة المرور الشرعية إليه. يمكن أن يكون عنوان IP لنسخة تطبيق، موازن حمل، أو اسم DNS، الخ، بناءً على هيكليتك.

## 7. تهيئة إرسال حركة المرور إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 8. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. ضبط الحل المنشور بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"