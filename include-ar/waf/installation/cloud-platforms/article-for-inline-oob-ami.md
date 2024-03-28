# نشر Wallarm باستخدام صورة آلة أمازون

توفر لكم هذه المقالة تعليمات لنشر Wallarm على AWS باستخدام [صورة آلة أمازون (AMI) الرسمية](https://aws.amazon.com/marketplace/pp/B073VRFXSD). يمكن نشر الحل إما [على الخط][inline-docs] أو [خارج الخط][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. ربط النسخة بسحابة Wallarm

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 7. تهيئة إرسال الحركة إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 8. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. ضبط الحل المنشور بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"