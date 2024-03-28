# تنصيب Wallarm من صورة آلة GCP

توفر هذه المقالة تعليمات لتنصيب Wallarm على GCP باستخدام [الصورة الرسمية للآلة](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). يمكن نشر الحل إما [ضمن الشبكة][inline-docs] أو [خارج النطاق][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.8.md"

## 5. تمكين Wallarm لتحليل الحركة

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. إعادة تشغيل NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. تهيئة إرسال الحركة إلى نموذج Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. تعديل دقيق للحل المنصب

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"