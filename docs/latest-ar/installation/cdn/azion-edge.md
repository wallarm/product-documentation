[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# جدار الحماية من Azion Edge مع وظائف Wallarm

تمكن [وظائف Azion Edge](https://www.azion.com/en/products/edge-functions/) من تنفيذ الشفرة المخصصة على حافة الشبكة، ما يسمح بتطبيق قواعد مخصصة لمعالجة الطلبات. من خلال دمج شفرة Wallarm المخصصة، يمكن توجيه الحركة الواردة إلى عقدة Wallarm لتحليلها وتصفيتها. يعزز هذا الإعداد من تدابير الأمان الموفرة بالفعل بواسطة [جدار حماية Azion Edge](https://www.azion.com/en/products/edge-firewall/). توفر هذه الوثيقة تعليمات حول كيفية دمج عقدة Wallarm مع Azion Edge لحماية الخدمات العاملة على Azion Edge.

تتضمن الحل إنشاء عقدة Wallarm خارجيًا وإدخال شفرة أو سياسات مخصصة في المنصة المحددة. يتيح هذا توجيه الحركة إلى العقدة الخارجية Wallarm لتحليلها وحمايتها من التهديدات المحتملة. يطلق على هذه العقد واصلات Wallarm، والتي تعد الرابط الأساسي بين منصات مثل Azion Edge وAkamai Edge وMuleSoft وApigee وAWS Lambda، والعقدة الخارجية Wallarm. يضمن هذا النهج دمجًا سلسًا، تحليل حركة آمن، تقليل المخاطر، وأمان النظام الأساسي بشكل عام.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](../supported-deployment-options.md)، يُوصى بهذا الحل للحالات الاستخدام التالية:

* تأمين API أو الحركة العاملة على Azion Edge.
* الحاجة إلى حل أمان يوفر ملاحظة شاملة للهجمات وتقارير وحجب فوري للطلبات الضارة.

## القيود

للحل قيود معينة حيث يعمل فقط مع الطلبات الواردة:

* لا يعمل اكتشاف الثغرات الأمنية باستخدام طريقة [الكشف السلبي](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) بشكل صحيح. يحدد الحل ما إذا كانت واجهة برمجة التطبيقات (API) معرضة للخطر أم لا بناءً على استجابات الخادم للطلبات الضارة التي تعتبر نموذجية للثغرات الأمنية التي يختبرها.
* لا يمكن لـ [اكتشاف واجهة برمجة التطبيقات من Wallarm](../../api-discovery/overview.md) استكشاف مخزون واجهة برمجة التطبيقات بناءً على حركتك، حيث يعتمد الحل على تحليل الاستجابات.
* [الحماية ضد التصفح القسري](../../admin-en/configuration-guides/protecting-against-bruteforce.md) غير متوفرة لأنها تتطلب تحليل رمز الاستجابة.

## المتطلبات

للمضي قدمًا في النشر، تأكد من استيفائك للمتطلبات التالية:

* فهم تقنيات Azion Edge
* APIs أو حركة عاملة على Azion Edge.

## النشر

لتأمين APIs على Azion Edge بواسطة Wallarm، اتبع هذه الخطوات:

1. نشر عقدة Wallarm باستخدام إحدى خيارات النشر المتاحة.
1. الحصول على شفرة Wallarm لوظائف Edge وتشغيلها على Azion.

### 1. نشر عقدة Wallarm

عند استخدام Wallarm على Azion Edge، يكون تدفق الحركة [في الخط](../inline/overview.md).

1. اختيار أحد [حلول نشر عقدة Wallarm المدعومة أو الأصول](../supported-deployment-options.md#in-line) للنشر في الخط واتباع التعليمات الخاصة بالنشر المقدمة.
1. تكوين العقدة المنشورة باستخدام القالب التالي:

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

    يرجى الانتباه إلى التكوينات التالية:

    * شهادات TLS/SSL لحركة HTTPS: لتمكين عقدة Wallarm من التعامل مع حركة HTTPS الآمنة، قم بتكوين شهادات TLS/SSL وفقًا لذلك. سيعتمد التكوين الخاص على طريقة النشر المختارة. على سبيل المثال، إذا كنت تستخدم NGINX، يمكنك الرجوع إلى [مقاله](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) للحصول على إرشادات.
    * تكوين [وضع تشغيل Wallarm](../../admin-en/configure-wallarm-mode.md).
1. بمجرد اكتمال النشر، احفظ ملاحظة عنوان IP لمثيل العقدة حيث ستحتاج إليه لاحقًا لضبط عنوان إعادة توجيه الطلبات الواردة.

### 2. الحصول على شفرة Wallarm لوظائف Edge وتشغيلها على Azion

للحصول على شفرة Wallarm لوظائف Azion Edge وتشغيلها، اتبع هذه الخطوات:

1. التواصل مع [support@wallarm.com](mailto:support@wallarm.com) للحصول على شفرة Wallarm.
1. على Azion Edge، اذهب إلى **الفوترة والاشتراكات** وفعل الاشتراك في **تسريع التطبيق** و**وظائف Edge**.
1. إنشاء **تطبيق Edge** جديد واحفظه.
1. افتح التطبيق المُنشأ → **الإعدادات الرئيسية** وفعل **تسريع التطبيق** و**وظائف Edge**.
1. انتقل إلى **النطاقات** وانقر على **إضافة نطاق**.
1. انتقل إلى **وظائف Edge**، انقر على **إضافة وظيفة** واختر نوع `جدار حماية Edge`.
1. الصق شفرة Wallarm محل `wallarm.node.tld` بعنوان [عقدة Wallarm التي تم نشرها مسبقًا](#1-deploy-a-wallarm-node).
1. اذهب إلى **جدار حماية Edge** → **إضافة مجموعة قواعد** → اكتب **الاسم** → حدد **النطاقات** وشغل **وظائف Edge**.
1. انتقل إلى علامة التبويب **الوظائف**، انقر على **إضافة وظيفة** واختر الوظيفة المُنشأة مسبقًا.
1. انتقل إلى علامة التبويب **محرك القواعد** → **قاعدة جديدة** واضبط معايير لتصفية الحركة بواسطة Wallarm:

    * لتحليل وتصفية جميع الطلبات، حدد `إذا بدأ عنوان URI للطلب بـ /`.
    * في **السلوكيات**، اختر `ثم تشغيل وظيفة` واختر الوظيفة التي تم إنشاؤها مسبقًا.

## الاختبار

لتجربة وظيفة السياسة المنشورة، اتبع هذه الخطوات:

1. إرسال الطلب مع هجوم اختبار [اختراق مسار الطلب][ptrav-attack-docs] إلى واجهة برمجة التطبيقات الخاصة بك:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. افتح واجهة Wallarm → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    
    ![الهجمات في الواجهة][attacks-in-ui-image]

    إذا تم ضبط وضع عقدة Wallarm على الحجب، سيتم حجب الطلب أيضًا.

## هل تحتاج إلى مساعدة؟

إذا واجهت أي مشاكل أو احتجت إلى مساعدة مع النشر الموضح لـ Wallarm بالتعاون مع Azion Edge، يمكنك التواصل مع فريق دعم [Wallarm](mailto:support@wallarm.com). هم متوفرون لتوفير الإرشاد والمساعدة في حل أية مشكلات قد تواجهها خلال عملية التنفيذ.