# توظيف Wallarm من صورة آلة GCP

تقدم هذه المقالة تعليمات لتوظيف Wallarm على GCP باستخدام [الصورة الآلية الرسمية](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). يمكن توظيف الحل إما [في الخط][inline-docs] أو [خارج النطاق][oob-docs].

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.6.md"

## 5. تفعيل Wallarm لتحليل الزيارات

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. إعادة تشغيل NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. تكوين إرسال الزيارات إلى نموذج Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. تعديل تهيئة الحل الموظف

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"