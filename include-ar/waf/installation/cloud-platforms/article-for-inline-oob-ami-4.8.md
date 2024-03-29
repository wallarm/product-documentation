# تثبيت Wallarm من خلال صورة آلة أمازون

توفر هذه المقالة تعليمات لتثبيت Wallarm على AWS باستخدام [صورة أمازون الرسمية للآلة (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). يمكن تثبيت الحل إما [داخل الشبكة][inline-docs] أو [خارج الشبكة][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. تمكين Wallarm لتحليل الحركة

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. إعادة تشغيل NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. تكوين إرسال الحركة إلى نموذج Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. ضبط الحل المثبت بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"