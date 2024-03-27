# نشر صورة Docker الخاصة ب Wallarm على Alibaba Cloud

يوفر هذا الدليل السريع خطوات نشر [صورة Docker الخاصة بالعقدة المبنية على NGINX من Wallarm](https://hub.docker.com/r/wallarm/node) على منصة Alibaba Cloud باستخدام [خدمة الحوسبة المطاطية من Alibaba Cloud (ECS)](https://www.alibabacloud.com/product/ecs).

!!! تحذير "قيود التعليمات"
    هذه التعليمات لا تغطي تكوين توازن الحمل وتحجيم العقدة تلقائيًا. إذا كنت ستقوم بضبط هذه المكونات بنفسك، نوصي بقراءة [وثائق Alibaba Cloud المناسبة](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## المتطلبات

* الوصول إلى [واجهة Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm)
* الوصول إلى الحساب بدور **المدير** وتعطيل المصادقة الثنائية في واجهة Wallarm Console لـ [سحابة الولايات المتحدة الأمريكية](https://us1.my.wallarm.com/) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/)

## خيارات تكوين حاوية Docker الخاصة بعقدة Wallarm

--8<-- "../include/waf/installation/docker-running-options.md"

## نشر حاوية Docker الخاصة بعقدة Wallarm المكونة من خلال متغيرات البيئة

لنشر عقدة تصفية Wallarm الموضوعة في حاوية والمكونة فقط من خلال متغيرات البيئة، يجب عليك إنشاء نسخة Alibaba Cloud وتشغيل الحاوية Docker في هذه النسخة. يمكنك تنفيذ هذه الخطوات عبر واجهة Alibaba Cloud Console أو [واجهة سطر الأوامر من Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm). في هذه التعليمات، تُستخدم واجهة Alibaba Cloud Console.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. افتح واجهة Alibaba Cloud Console → قائمة الخدمات → **خدمة الحوسبة المطاطية** → **النسخ**.
1. أنشئ النسخة وفقًا لـ [تعليمات Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) والمبادئ التوجيهية أدناه:

    * يمكن أن تكون النسخة مبنية على صورة لأي نظام تشغيل.
    * نظرًا لأن النسخة يجب أن تكون متاحة للموارد الخارجية، يجب تكوين عنوان IP عام أو نطاق في إعدادات النسخة.
    * يجب أن تعكس إعدادات النسخة [الطريقة المستخدمة للاتصال بالنسخة](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. اتصل بالنسخة بإحدى الطرق الموصوفة في [وثائق Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. قم بتثبيت حزم Docker في النسخة وفقًا لـ [التعليمات لنظام التشغيل المناسب](https://docs.docker.com/engine/install/#server).
1. حدد متغير بيئة النسخة مع الرمز المنسوخ لـ Wallarm لاستخدامه لربط النسخة بسحابة Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. شغّل حاوية Docker لعقدة Wallarm باستخدام الأمر `docker run` مع المتغيرات البيئية الممررة وملف التكوين المركب:

    === "أمر لسحابة Wallarm الأمريكية"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.10.1-1
        ```
    === "أمر لسحابة Wallarm الأوروبية"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -p 80:80 wallarm/node:4.10.1-1
        ```
        
    * `-p`: المنفذ الذي تستمع إليه عقدة التصفية. يجب أن يكون القيمة هي نفسها كمنفذ النسخة.
    * `-e`: متغيرات البيئة مع تكوين عقدة التصفية (المتغيرات المتاحة موجودة في الجدول أدناه). يرجى ملاحظة أننا ننصح بعدم تمرير قيمة `WALLARM_API_TOKEN` صراحةً.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [اختبر تشغيل عقدة التصفية](#testing-the-filtering-node-operation).

## نشر حاوية Docker الخاصة بعقدة Wallarm المكونة من خلال ملف مركب

لنشر عقدة تصفية Wallarm الموضوعة في حاوية والمكونة من خلال متغيرات البيئة وملف مركب، يجب عليك إنشاء نسخة Alibaba Cloud، وتحديد موقع ملف تكوين عقدة التصفية في نظام ملفات هذه النسخة، وتشغيل حاوية Docker في هذه النسخة. يمكنك تنفيذ هذه الخطوات عبر واجهة Alibaba Cloud Console أو [واجهة سطر الأوامر من Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm). في هذه التعليمات، تُستخدم واجهة Alibaba Cloud Console.

--8<-- "../include/waf/installation/get-api-or-node-token.md"
            
1. افتح واجهة Alibaba Cloud Console → قائمة الخدمات → **خدمة الحوسبة المطاطية** → **النسخ**.
1. أنشئ النسخة وفقًا لـ [تعليمات Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) والمبادئ التوجيهية أدناه:

    * يمكن أن تكون النسخة مبنية على صورة لأي نظام تشغيل.
    * نظرًا لأن النسخة يجب أن تكون متاحة للموارد الخارجية، يجب تكوين عنوان IP عام أو نطاق في إعدادات النسخة.
    * يجب أن تعكس إعدادات النسخة [الطريقة المستخدمة للاتصال بالنسخة](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. اتصل بالنسخة بإحدى الطرق الموصوفة في [وثائق Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. قم بتثبيت حزم Docker في النسخة وفقًا لـ [التعليمات لنظام التشغيل المناسب](https://docs.docker.com/engine/install/#server).
1. حدد متغير بيئة النسخة مع الرمز المنسوخ لـ Wallarm لاستخدامه لربط النسخة بسحابة Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. داخل النسخة، قم بإنشاء الدليل بالملف `default` الذي يحتوي على تكوين عقدة التصفية (على سبيل المثال، يمكن تسمية الدليل `configs`). مثال على الملف بالإعدادات الأساسية:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        #listen 443 ssl;

        server_name localhost;

        #ssl_certificate cert.pem;
        #ssl_certificate_key cert.key;

        root /usr/share/nginx/html;

        index index.html index.htm;

        wallarm_mode monitoring;
        # wallarm_application 1;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [مجموعة توجيهات عقدة التصفية التي يمكن تحديدها في ملف التكوين →][nginx-waf-directives]
1. شغّل حاوية Docker لعقدة Wallarm باستخدام الأمر `docker run` مع المتغيرات البيئية الممررة وملف التكوين المركب:

    === "أمر لسحابة Wallarm الأمريكية"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.10.1-1
        ```
    === "أمر لسحابة Wallarm الأوروبية"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.10.1-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: مسار ملف التكوين الذي تم إنشاؤه في الخطوة السابقة. على سبيل المثال، `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: دليل الحاوية لتركيب ملف التكوين إليه. يمكن تركيب ملفات التكوين إلى الأدلة التالية المستخدمة بواسطة NGINX:

        * `/etc/nginx/conf.d` — الإعدادات العامة
        * `/etc/nginx/sites-enabled` — إعدادات المضيف الافتراضي
        * `/var/www/html` — الملفات الثابتة

        يجب وصف توجيهات عقدة التصفية في ملف `/etc/nginx/sites-enabled/default`.
    
    * `-p`: المنفذ الذي تستمع إليه عقدة التصفية. يجب أن يكون نفس المنفذ للنسخة.
    * `-e`: متغيرات البيئة مع تكوين عقدة التصفية (المتغيرات المتاحة موجودة في الجدول أدناه). يُفضّل عدم نقل قيمة `WALLARM_API_TOKEN`.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [اختبر تشغيل عقدة التصفية](#testing-the-filtering-node-operation).

## اختبار تشغيل عقدة التصفية

1. افتح واجهة Alibaba Cloud Console → قائمة الخدمات → **خدمة الحوسبة المطاطية** → **النسخ** وانسخ عنوان IP العام للنسخة من عمود **عنوان IP**.

    ![ضبط حاوية النسخة][copy-container-ip-alibaba-img]

    إذا كان عنوان IP فارغًا، يرجى التأكد من أن النسخة في الحالة **الجارية**.

2. أرسل الطلب بالهجوم التجريبي [Path Traversal][ptrav-attack-docs] إلى العنوان المنسوخ:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. افتح واجهة Wallarm Console → **الهجمات** في [سحابة الولايات المتحدة الأمريكية](https://us1.my.wallarm.com/attacks) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    ![الهجمات في واجهة المستخدم][attacks-in-ui-image]

لعرض تفاصيل الأخطاء التي حدثت أثناء نشر الحاوية، الرجاء [الاتصال بالنسخة بإحدى الطرق](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) ومراجعة [سجلات الحاوية][logging-docs]. إذا كانت النسخة غير متاحة، يُرجى التأكد من تمرير معلمات عقدة التصفية المطلوبة بقيم صحيحة إلى الحاوية.