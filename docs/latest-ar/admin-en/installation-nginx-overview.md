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

عقدة تصفية وولارم، التي تُستخدم مع NGINX أو NGINX Plus، تتكون من الوحدات التالية:
*   الوحدة التي تتصل بـNGINX (NGINX Plus)
*   وحدة التحليلات اللاحقة

ترتيب تثبيت وتكوين الوحدات يعتمد على طريقتك في تنصيب NGINX أو NGINX Plus.

يحتوي هذا المستند على الأقسام التالية:

*   [نظرة عامة على الوحدات][anchor-mod-overview]
*   [روابط][anchor-mod-installation] لتعليمات تثبيت وتكوين الوحدات المحددة

##  نظرة عامة على الوحدات

عند استخدام عقدة التصفية لمعالجة الطلبات، يمر الحركة الواردة بشكل تسلسلي عبر المعالجة الأولية ثم المعالجة بواسطة وحدات وولارم.

1.  يتم أداء المعالجة الأولية للحركة بواسطة الوحدة التي تتصل بـ [NGINX][anchor-mod-inst-nginx] أو [NGINX Plus][anchor-mod-inst-nginxplus] المثبتة بالفعل في النظام.
2.  يتم إجراء مزيد من المعالجة للحركة بواسطة [وحدة التحليلات اللاحقة][anchor-mod-inst-postanalytics]، التي تتطلب كمية كبيرة من الذاكرة للعمل بشكل صحيح. لذلك، يمكنك اختيار أحد خيارات التثبيت التالية:
    *   يتم التثبيت على نفس الخوادم كـ NGINX/NGINX Plus (إذا سمحت إعدادات الخادم بذلك)
    *   يتم التثبيت على مجموعة من الخوادم منفصلة عن NGINX/NGINX Plus

![خيارات تثبيت وحدة التحليلات اللاحقة][img-postanalytics-options]

##  تثبيت وتكوين الوحدات

### وحدة لـ NGINX

!!! تحذير "اختيار الوحدة للتثبيت"
    إجراءات تثبيت وتوصيل وحدة وولارم تعتمد على طريقة تثبيت NGINX التي تستخدمها.

يمكن توصيل وحدة وولارم لـ NGINX بإحدى طرق التثبيت التالية (الروابط للتعليمات لكل من خيارات التثبيت مذكورة في القوس):

![خيارات تثبيت وحدة لـ NGINX][img-nginx-options]

*   بناء NGINX من ملفات المصدر ([التعليمات][link-ig-nginx])
*   تثبيت حزم NGINX من مستودع NGINX ([التعليمات][link-ig-nginx])
*   تثبيت حزم NGINX من مستودع Debian ([التعليمات][link-ig-nginx-distr])
*   تثبيت حزم NGINX من مستودع CentOS ([التعليمات][link-ig-nginx-distr])

### وحدة لـ NGINX Plus

[هذه][link-ig-nginxplus] التعليمات تصف كيفية توصيل وولارم بوحدة NGINX Plus.

### وحدة التحليلات اللاحقة

تعليمات حول تثبيت وتكوين وحدة التحليلات اللاحقة (إما على نفس الخادم مع NGINX/NGINX Plus أو على خادم منفصل) موجودة في قسم تثبيت وحدة [NGINX][anchor-mod-inst-nginx] وتثبيت وحدة [NGINX Plus][anchor-mod-inst-nginxplus].