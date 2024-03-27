# تنصيب Wallarm عن طريق صورة جهاز GCP

المقال ده بيوفر التعليمات لتنصيب Wallarm على GCP باستخدام [الصورة الرسمية للجهاز](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). يمكن تنصيب الحل إما [داخل الخط][inline-docs] أو [خارج النطاق][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.6.md"

## 5. تفعيل Wallarm لتحليل المرور

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. إعادة تشغيل NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. تهيئة إرسال المرور إلى نسخة Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. تعديل دقيق في الحل المنصب

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"