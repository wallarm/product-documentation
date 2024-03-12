[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Akamai EdgeWorkers مع Wallarm Code Bundle

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs) هي منصة قوية لحوسبة الأطراف تتيح تنفيذ منطق مخصص ونشر وظائف JavaScript خفيفة على طرف المنصة. للعملاء الذين يقومون بتشغيل واجهات برمجة التطبيقات والمرور عبر Akamai EdgeWorkers، توفر Wallarm حزمة كود يمكن نشرها على Akamai EdgeWorkers لتأمين بنيتها التحتية.

تشمل الحل نشر عقدة Wallarm خارجيًا وحقن الكود المخصص أو السياسات داخل المنصة المحددة. هذا يمكن المرور ليتم توجيهه إلى عقدة Wallarm الخارجية لتحليله والحماية من التهديدات المحتملة. يطلق عليها موصلات Wallarm، وهي تعتبر الحلقة الأساسية بين المنصات مثل Azion Edge، Akamai Edge، Mulesoft، Apigee، و AWS Lambda، وعقدة Wallarm الخارجية. هذا النهج يضمن التكامل السلس، تحليل المرور الآمن، التخفيف من المخاطر، وأمن المنصة بشكل عام.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](../supported-deployment-options.md)، تعتبر هذه الحل الأنسب للحالات التالية:

* تأمين واجهات برمجة التطبيقات أو المرور الجاري على Akamai EdgeWorkers.
* الحاجة إلى حل أمان يقدم مراقبة شاملة للهجمات، التقارير، والحجب الفوري للطلبات الخبيثة.

## القيود

يحتوي الحل على بعض القيود حيث يعمل فقط مع الطلبات الواردة:

* لا يعمل الكشف عن الثغرات الأمنية باستخدام طريقة [الكشف السلبي](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) بشكل صحيح. يحدد الحل ما إذا كانت واجهة برمجة التطبيقات معرضة للخطر أم لا بناءً على ردود الخادم على الطلبات الخبيثة النموذجية للثغرات الأمنية التي يختبرها.
* [اكتشاف واجهة برمجة التطبيقات في Wallarm](../../api-discovery/overview.md) لا يمكنه استكشاف جرد واجهة برمجة التطبيقات بناءً على المرور الخاص بك، حيث يعتمد الحل على تحليل الاستجابة.
* [الحماية ضد التصفح القسري](../../admin-en/configuration-guides/protecting-against-bruteforce.md) غير متاحة حيث تتطلب تحليل رمز الاستجابة.

هناك أيضًا قيود ناتجة عن [قيود منتج EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/limitations) و[http-request](https://techdocs.akamai.com/edgeworkers/docs/http-request):

* الطريقة المدعومة الوحيدة لتوصيل المرور هي TLS المحسن.
* الحجم الأقصى لرأس الاستجابة هو 8000 بايت.
* الحجم الأقصى للجسم هو 1 ميغابايت.
* طرق HTTP غير مدعومة: `CONNECT`, `TRACE`, `OPTIONS` (الطرق المدعومة: `GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`).
* الرؤوس غير المدعومة: `connection`, `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailers`, `transfer-encoding`, `host`, `content-length`, `vary`, `accept-encoding`, `content-encoding`, `upgrade`.

## المتطلبات

للمضي قدماً في النشر، تأكد من أنك تفي بالمتطلبات التالية:

* فهم تقنيات Akamai EdgeWorkers
* واجهات برمجة التطبيقات أو المرور يجري من خلال Akamai EdgeWorkers.

## النشر

لتأمين واجهات برمجة التطبيقات على Akamai EdgeWorkers مع Wallarm، اتبع هذه الخطوات:

1. نشر عقدة Wallarm باستخدام أحد خيارات النشر المتاحة.
1. الحصول على حزمة كود Wallarm وتشغيلها على Akamai EdgeWorkers.

### 1. نشر عقدة Wallarm

عند استخدام Wallarm على Akamai EdgeWorkers، تدفق المرور [مباشر](../inline/overview.md).

1. اختر إحدى [حلول نشر عقدة Wallarm المدعومة أو الأدوات](../supported-deployment-options.md#in-line) للنشر المباشر واتبع التعليمات المقدمة.
1. قم بتكوين العقدة المنشورة باستخدام القالب التالي:

    ```
    server {
        listen 80;

        server_name _;

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    server {
        listen 443 ssl;

        server_name yourdomain-for-wallarm-node.tld;

        ### تكوين SSL هنا

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }


    server {
        listen unix:/tmp/wallarm-nginx.sock;
        
        server_name _;
        
        wallarm_mode monitoring;
        #wallarm_mode block;

        real_ip_header X-EDGEWRK-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    يرجى الانتباه إلى الإعدادات التالية:

    * شهادات TLS/SSL للمرور الآمن HTTPS: لتمكين عقدة Wallarm من التعامل مع المرور الآمن HTTPS، قم بتكوين شهادات TLS/SSL بشكل مناسب. ستعتمد التكوينات المحددة على طريقة النشر المختارة. على سبيل المثال، إذا كنت تستخدم NGINX، يمكنك الرجوع إلى [مقالته](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) للحصول على إرشادات.
    * تكوين [وضع تشغيل Wallarm](../../admin-en/configure-wallarm-mode.md).
1. بمجرد اكتمال النشر، قم بتسجيل ملاحظة عنوان IP للعقدة حيث ستحتاج إليه لاحقًا لضبط عنوان توجيه الطلبات الواردة.

### 2. الحصول على حزمة كود Wallarm وتشغيلها على Akamai EdgeWorkers

للحصول على حزمة كود Wallarm و[تشغيلها](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) على Akamai EdgeWorkers، اتبع هذه الخطوات:

1. اتصل بـ [support@wallarm.com](mailto:support@wallarm.com) للحصول على حزمة كود Wallarm.
1. [أضف](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract) EdgeWorkers إلى عقدك على Akamai.
1. [إنشاء](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id) معرّف EdgeWorker.
1. افتح المعرّف المُنشأ، اضغط على **إنشاء إصدار** و[ارفع](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) حزمة كود Wallarm.
1. **فعّل** الإصدار المُنشأ، في البداية في بيئة المرحلة.
1. بعد التأكد من أن كل شيء يعمل بشكل صحيح، كرر نشر الإصدار في بيئة الإنتاج.
1. في **مدير خصائص Akamai**، اختر أو أنشئ خاصية جديدة حيث ترغب في تثبيت Wallarm.
1. [إنشاء](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1) سلوك جديد مع EdgeWorker الذي تم إنشاؤه حديثًا، ويمكنك تسميته على سبيل المثال **Wallarm Edge** وإضافة المعايير التالية:

    ```
    إذا 
    رأس الطلب
    X-EDGEWRK-REAL-IP 
    غير موجود
    ```
1. إنشاء سلوك آخر **Wallarm Node** بـ **خادم الأصل** يشير إلى [العقدة المنشورة مسبقًا](#1-نشر-عقدة-wallarm). قم بتبديل **إعادة توجيه رأس المضيف** إلى **اسم المضيف الأصلي** وإضافة المعايير التالية:

    ```
    إذا 
    رأس الطلب
    X-EDGEWRK-REAL-IP 
    موجود
    ```
1. أضف متغير خاصية جديد `PMUSER_WALLARM_MODE` بـ [القيمة](../../admin-en/configure-wallarm-mode.md) `monitoring` (الافتراضي) أو `block`.
    
    اختر **مخفي** لإعدادات الأمان.
1. احفظ الإصدار الجديد ونشره في البداية إلى بيئة المرحلة، و[ثم](https://techdocs.akamai.com/api-acceleration/docs/test-stage) إلى الإنتاج.

## الاختبار

لاختبار وظائف السياسة المنشورة، اتبع الخطوات التالية:

1. إرسال طلب باستخدام هجوم [Path Traversal][ptrav-attack-docs] الاختباري إلى واجهة برمجة التطبيقات الخاصة بك:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. افتح وحدة التحكم في Wallarm → قسم **الهجمات** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/attacks) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    
    ![الهجمات في الواجهة][attacks-in-ui-image]

    إذا كان وضع عقدة Wallarm مضبوط على الحجب، سيتم حجب الطلب أيضًا.

## هل تحتاج إلى مساعدة؟

إذا واجهت أي مشكلات أو كنت بحاجة إلى مساعدة في النشر الموصوف لـ Wallarm بالتعاون مع Akamai EdgeWorkers، يمكنك التواصل مع فريق [دعم Wallarm](mailto:support@wallarm.com). هم متاحون لتقديم الإرشادات والمساعدة في حل أي مشاكل قد تواجهها خلال عملية التنفيذ.