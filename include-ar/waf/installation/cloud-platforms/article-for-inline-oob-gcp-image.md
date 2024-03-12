# تشغيل Wallarm من صورة آلة GCP

تقدم هذه المقالة تعليمات لنشر Wallarm على GCP باستخدام [الصورة الرسمية للآلة](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). يمكن نشر الحل إما [في الخط][inline-docs] أو [خارج النطاق][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. ربط النموذج بسحابة Wallarm

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 6. تكوين إرسال المرور إلى نموذج Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 7. اختبار عملية Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. ضبط الحل المنشور

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"