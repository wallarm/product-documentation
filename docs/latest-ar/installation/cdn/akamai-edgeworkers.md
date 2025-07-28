[وثائق-الهجمات-ptrav]:                ../../attacks-vulns-list.md#path-traversal
[صورة-الهجمات-في-واجهة-المستخدم]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Akamai EdgeWorkers مع حزمة الشفرة Wallarm

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs) هو منصة حوسبة على الحافة قوية تتيح تنفيذ منطق مخصص وإيداع وظائف JavaScript خفيفة الوزن على الحافة. بالنسبة للعملاء الذين لديهم واجهات البرمجة التطبيقية API وحركة المرور، Wallarm يقدم حزمة شفرة يمكن ان تضاف على EdgeWorkers لتأمين البنية التحتية.

الحل يتضمن نشر العقدة Wallarm خارجيا وحقن الشفرة المخصصة أو السياسات في المنصة المعينة. هذا يمكن توجيه حركة المرور إلى العقدة الخارجية Wallarm للتحليل والحماية من التهديدات المحتملة. تُشار إليها بوصلات Wallarm، وهي تعمل كرابط أساسي بين منصات مثل Azion Edge، وAkamai Edge، وMuleSoft، وApigee، وAWS Lambda، والعقدة الخارجية Wallarm. تضمن هذه الطريقة التكامل السلس، وتحليل حركة المرور الآمن، وتقليل المخاطر، وأمن المنصة الشامل.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm](../supported-deployment-options.md) المدعومة، هذا الحل هو الموصى به للحالات الاستخدام التالية:

* تأمين واجهات البرمجة التطبيقية API أو حركة المرور التي تعمل على Akamai EdgeWorkers.
* الحاجة إلى حل أمني يقدم رصد شامل للهجمات، والإبلاغ عنها، وحجب الطلبات الخبيثة على الفور.

## القيود

يوجد للحل القيود المعينة وهو يعمل فقط مع الطلبات الواردة:

* لا يعمل اكتشاف الثغرات باستخدام [طريقة الكشف السلبية](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) بشكل صحيح. تحدد الحل إذا كانت واجهة البرمجة التطبيقية API معرضة للخطر أم لا بناءً على ردود الخادم على الطلبات الخبيثة التي تكون مميزة للثغرات التي يستهدفها الاختبار.
* لا يمكن أن [اكتشاف واجهات البرمجة التطبيقية API لـ Wallarm](../../api-discovery/overview.md) يستكشف جرد الواجهات البرمجة التطبيقية API بناءً على حركة المرور الخاصة بك، حيث يعتمد الحل على تحليل الاستجابة.
* الحماية ضد الاستعراض القسري غير متوفرة لأنها تحتاج إلى تحليل كود الاستجابة.

هناك أيضا قيود ناشئة عن [محددات منتج EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/limitations) و [http-request](https://techdocs.akamai.com/edgeworkers/docs/http-request):

* الطريقة المدعومة الوحيدة لتسليم حركة المرور هي TLS المُحسَّن.
* أقصى حجم لرأس الاستجابة هو 8000 بايت.
* أقصى حجم للجسم هو 1 MB.
* الطرق HTTP غير المدعومة: `CONNECT`, `TRACE`, `OPTIONS` (الطرق المدعومة: `GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`).
* الرؤوس غير المدعومة: `connection`, `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailers`, `transfer-encoding`, `host`, `content-length`, `vary`, `accept-encoding`, `content-encoding`, `upgrade`.

## المتطلبات

للمتابعة مع النشر، تأكد من توفر الشروط التالية:

* فهم تكنولوجيا Akamai EdgeWorkers
* واجهات برمجة التطبيقات API أو حركة المرور التي تعمل عبر Akamai EdgeWorkers.

## النشر

لاضافة الحماية لواجهات برمجة التطبيقات API على Akamai EdgeWorkers بواسطة Wallarm، أتبع هذه الخطوات:

1. انشر عقدة Wallarm باستخدام واحدة من الخيارات المتاحة للنشر.
1. احصل على حزمة الشفرة Wallarm وشغلها على Akamai EdgeWorkers.

### 1. نشر عقدة Wallarm

عند استخدام Wallarm على Akami EdgeWorkers، حركة المرور من خلال الطريق [في-خط](../inline/overview.md).

1. اختر واحدة من [حلول نشر العقدة Wallarm المدعومة أو الأعمال الفنية](../supported-deployment-options.md#in-line) للنشر في-خط واتبع التعليمات الواردة للنشر.
1. قم بتكوين العقدة التي تم نشرها باستخدام القالب التالي:

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

        ### SSL configuration here

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

    يرجى التأكد من التركيز على التكوينات التالية:

    * شهادات TLS / SSL لحركة المرور HTTPS: لتمكين العقدة Wallarm من التعامل مع حركة المرور HTTPS الآمنة، قم بتكوين شهادات TLS / SSL بالتوافق. سيعتمد التكوين على الطريقة المختارة للنشر. على سبيل المثال، إذا كنت تستخدم NGINX، يمكنك الاطلاع على [مقالته](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) للحصول على التوجيه.
    * [تكوين وضع تشغيل Wallarm](../../admin-en/configure-wallarm-mode.md).
1. بمجرد الانتهاء من النشر، قم بتدوين عنوان IP للعينة عقدة حيث ستحتاجه لاحقا لتعيين العنوان لتحويل الطلبات الواردة.

### 2. احصل على حزمة الشفرة Wallarm وشغلها على Akamai EdgeWorkers

للحصول على و [تشغيل](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) حزمة الشفرة Wallarm على Akamai EdgeWorkers، اتبع هذه الخطوات:

1. اتصل [support@wallarm.com](mailto:support@wallarm.com) للحصول على حزمة الشفرة Wallarm.
1. [أضف](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract) EdgeWorkers إلى عقدك على Akamai.
1. [أنشئ](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id) رقم معرف EdgeWorker.
1. افتح الرقم المعرف الذي تم إنشاؤه، اضغط على **Create Version** و [ارفع](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) حزمة الشفرة Wallarm.
1. **فِعِّل** الإصدار الذي تم إنشاؤه، في البداية في بيئة المرحلة.
1. بعد التأكد من أن كل شيء يعمل بشكل صحيح، كرر نشر الإصدار في البيئة الإنتاج.
1. في **Akamai Property Manager**، اختر أو أنشئ ملكية جديدة حيث تريد تثبيت Wallarm.
1. [أنشئ](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1) سلوكًا جديدًا مع EdgeWorker الذي تم إنشاؤه حديثًا، وادعه على سبيل المثال **Wallarm Edge** وأضف المعايير التالية:

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    does not exist
    ```
1. أنشئ سلوكًا آخر  **Wallarm Node** مع **Origin Server** يشير إلى [العقدة التي تم نشرها مسبقا](#1-nشر-عقدة-wallarm). امزج **Forward Host Header** إلى **Origin Hostname** وأضف المعايير التالية:

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    exist
    ```
1. أضف متغير الخاصية الجديد `PMUSER_WALLARM_MODE` مع [القيمة](../../admin-en/configure-wallarm-mode.md) `monitoring` (افتراضي) أو `block`. 

    اختر **Hidden** لإعدادات الأمان.
1. حفظ الإصدار الجديد ونشره في البداية إلى بيئة المرحلة، و[ثم](https://techdocs.akamai.com/api-acceleration/docs/test-stage) إلى الإنتاج.

## الاختبار

لاختبار وظائف السياسة المنشأة، اتبع هذه الخطوات:

1. أرسل الطلب مع الاختبار الهجوم [Path Traversal][وثائق-الهجمات-ptrav] لواجهة برمجة التطبيق API الخاصة بك:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. افتح Wallarm Console → قسم **Attacks** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من أن الهجوم يظهر في القائمة.
    
    ![الهجمات في الواجهة][صورة-الهجمات-في-واجهة-المستخدم]

    إذا تم ضبط وضع العقدة Wallarm على الحجب، سيتم حجب الطلب أيضا.

## هل تحتاج إلى مساعدة؟

إذا واجهت أي مشاكل أو تحتاج إلى مساعدة بشأن نشر Wallarm الذي تم وصفه بالتعاون مع Akamai EdgeWorkers، يمكنك التواصل مع فريق [دعم Wallarm](mailto:support@wallarm.com). هم متواجدون لتقديم الإرشاد والمساعدة في حل أي مشاكل قد تواجهها أثناء عملية التنفيذ.
