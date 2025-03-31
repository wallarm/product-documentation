# تنصيب Wallarm من صورة GCP الآلية

هذه المقالة توفر الإرشادات لتنصيب Wallarm على GCP باستخدام [الصورة الآلية الرسمية](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. ربط عقدة التصفية بسحابة Wallarm

ترتبط عقدة النموذج السحابي بالسحابة عبر السيناريو [cloud-init.py][cloud-init-spec]. يقوم هذا السيناريو بتسجيل العقدة مع سحابة Wallarm باستخدام الرمز المقدم، يعينها عالميًا على وضع [المراقبة][wallarm-mode]، ويضبط العقدة لتوجيه حركة المرور الشرعية بناءً على علم `--proxy-pass`. يكتمل الإعداد بإعادة تشغيل NGINX.

قم بتشغيل سيناريو `cloud-init.py` على النموذج المُنشأ من صورة السحابة كالآتي:

=== "السحابة الأمريكية"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "السحابة الأوروبية"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` يحدد اسم مجموعة العقد (قائمة أو، إذا لم تكن موجودة، سيتم إنشائها). يطبق هذا فقط إذا كنت تستخدم رمز API.
* `<TOKEN>` هو قيمة الرمز المنسوخ.
* `<PROXY_ADDRESS>` هو عنوان لعقدة Wallarm لوكيل حركة المرور الشرعية إليها. يمكن أن يكون عنوان IP لنموذج تطبيق، موازنة حمل، أو اسم DNS، إلخ، بناءً على هندسة الشبكة الخاصة بك.

## 6. تكوين إرسال حركة المرور إلى نموذج Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 7. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. تعديل التكوين النهائي للحل المنصب

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"