# تنصيب Wallarm من صورة الآلة في GCP

توفر هذه المقالة تعليمات لتنصيب Wallarm على GCP باستخدام [الصورة الرسمية للآلة](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). يمكن تنصيب الحل [مباشرة][inline-docs] أو [خارج النطاق][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. اربط النسخة بسحابة Wallarm

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 6. تهيئة إرسال المرور إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 7. اختبر تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. ضبط الحل المنصب بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"