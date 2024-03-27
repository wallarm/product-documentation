# نشر Wallarm من خلال صورة آلة GCP

يوفر هذا المقال التعليمات لنشر Wallarm على GCP باستخدام [الصورة الرسمية للآلة](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). يمكن نشر الحل إما [بشكل مباشر][inline-docs] أو [خارج نطاق العملية][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.8.md"

## 5. تمكين Wallarm لتحليل الحركة

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. إعادة تشغيل NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. تكوين إرسال الحركة إلى نموذج Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. اختبار عملية Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. ضبط الحل المنشور بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"