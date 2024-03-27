# تنصيب Wallarm من صورة الآلة الأمازونية

هذا المقال يوفر تعليمات لتنصيب Wallarm على AWS باستخدام [الصورة الأمازونية الرسمية (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). يمكن تنصيب الحل إما [بشكل مباشر][inline-docs] أو [خارج النطاق][oob-docs].

## استخدامات

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. تفعيل Wallarm لتحليل المرور

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. إعادة تشغيل NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. تهيئة إرسال المرور إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. التعديل الدقيق للحل المنصوب

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"