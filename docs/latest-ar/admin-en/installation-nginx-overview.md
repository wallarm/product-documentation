#   نظرة عامة على خيارات التثبيت

[img-postanalytics-options]:    ../images/installation-nginx-overview/postanalytics-options.png
[img-nginx-options]:            ../images/installation-nginx-overview/nginx-options.png

[anchor-mod-overview]:              #modules-overview
[anchor-mod-installation]:          #installing-and-configuring-the-modules
[anchor-mod-inst-nginx]:            #module-for-nginx
[anchor-mod-inst-nginxplus]:        #module-for-nginx-plus
[anchor-mod-inst-postanalytics]:    #postanalytics-module

[link-ig-nginx]:                    ../installation/nginx/dynamic-module.md
[link-ig-nginx-distr]:              ../installation/nginx/dynamic-module-from-distr.md
[link-ig-nginxplus]:                ../installation/nginx-plus.md

<!-- !!!!! TO MOVE -->

يتألف عقد تصفية Wallarm المستخدم مع NGINX أو NGINX Plus من الوحدات النمطية التالية:
*   الوحدة النمطية التي تتصل بـ NGINX (NGINX Plus)
*   وحدة التحليلات اللاحقة

يعتمد ترتيب تثبيت وتهيئة الوحدات النمطية على طريقة تثبيتك لـ NGINX أو NGINX Plus.

يحتوي هذا المستند على الأقسام التالية:

*   [نظرة عامة على الوحدات النمطية][anchor-mod-overview]
*   [روابط][anchor-mod-installation] إلى تعليمات تثبيت وتكوين الوحدة النمطية المحددة

##  نظرة عامة على الوحدات النمطية

عند استخدام عقدة التصفية لمعالجة الطلبات، يتم معالجة حركة المرور الواردة تتابعاً عبر المعالجة الأولية ومن ثم المعالجة بواسطة وحدات Wallarm النمطية.

1.  يتم أداء المعالجة الأولية لحركة المرور بواسطة الوحدة النمطية التي تتصل بـ [NGINX][anchor-mod-inst-nginx] أو [NGINX Plus][anchor-mod-inst-nginxplus] المثبت بالفعل في النظام.
2.  يتم إجراء معالجة حركة المرور الإضافية بواسطة [وحدة التحليلات اللاحقة][anchor-mod-inst-postanalytics]، والتي تحتاج إلى كمية كبيرة من الذاكرة للعمل بشكل صحيح. لذلك، يمكنك اختيار أحد خيارات التثبيت التالية:
    *   تثبيتها على نفس الخوادم مثل NGINX/NGINX Plus (إذا سمحت تكوينات الخادم بهذا)
    *   تثبيتها على مجموعة من الخوادم المنفصلة عن NGINX/NGINX Plus

![خيارات تثبيت وحدة التحليلات اللاحقة][img-postanalytics-options]

##  تثبيت وتكوين الوحدات النمطية

### وحدة لـ NGINX

!!! تحذير "اختيار الوحدة النمطية للتثبيت"
    تعتمد إجراءات تثبيت واتصال وحدة Wallarm على طريقة تثبيت NGINX التي تستخدمها.

يمكن توصيل وحدة Wallarm لـ NGINX من خلال إحدى طرق التثبيت التالية (الروابط إلى تعليمات لكل خيار من خيارات التثبيت مدرجة في الأقواس):

![خيارات تثبيت وحدة NGINX][img-nginx-options]

*   بناء NGINX من ملفات المصدر ([تعليمات][link-ig-nginx])
*   تثبيت حزم NGINX من مستودع NGINX ([تعليمات][link-ig-nginx])
*   تثبيت حزم NGINX من مستودع Debian ([تعليمات][link-ig-nginx-distr])
*   تثبيت حزم NGINX من مستودع CentOS ([تعليمات][link-ig-nginx-distr])

### وحدة لـ NGINX Plus

[هذه][link-ig-nginxplus] التعليمات تصف كيفية اتصال Wallarm بوحدة NGINX Plus.

### وحدة التحليلات اللاحقة

تقع تعليمات تثبيت وتكوين وحدة التحليلات اللاحقة (إما على نفس الخادم مع NGINX/NGINX Plus أو على خادم منفصل) في قسم تثبيت وحدة [NGINX][anchor-mod-inst-nginx] وقسم تثبيت الوحدة [NGINX Plus][anchor-mod-inst-nginxplus].