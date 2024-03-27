# تثبيت Wallarm من صورة أمازون للجهاز

يقدم هذا المقال تعليمات لتثبيت Wallarm على AWS باستخدام [صورة أمازون الرسمية للجهاز (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). يمكن تثبيت الحل إما [داخل الخط][inline-docs] أو [خارج الخط][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. ربط النسخة بسحابة Wallarm

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 7. تكوين إرسال الحركة إلى نسخة Wallarm 

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 8. اختبار عملية Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. ضبط الحل المثبت بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"