# نشر صورة Docker لـ Wallarm على Alibaba Cloud

يقدم هذا الدليل السريع الخطوات لنشر [صورة Docker للعقدة Wallarm القائمة على NGINX](https://hub.docker.com/r/wallarm/node) على منصة Alibaba Cloud باستخدام [خدمة Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs).

!!! تحذير "قيود الإرشادات"
    هذه الإرشادات لا تغطي تكوين التوازن الحمولة والتوسع الأوتوماتيكي للعقدة. إذا كنت تقوم بإعداد هذه المكونات بنفسك، نوصي بقراءة [وثائق Alibaba Cloud المناسبة](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## المتطلبات

* الوصول إلى [لوحة تحكم Alibaba Cloud](https://account.alibabacloud.com/login/login.htm)
* الوصول إلى الحساب الذي يملك دور **المسؤول** وتم تعطيل المصادقة الثنائية في لوحة تحكم Wallarm لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)

## خيارات تكوين حاوية Docker للعقدة Wallarm

--8<-- "../include/waf/installation/docker-running-options.md"

## نشر حاوية Docker للعقدة Wallarm مكونة من خلال المتغيرات البيئية

لنشر العقدة الفلترة المحتوَّية لـ Wallarm المكونة فقط من خلال المتغيرات البيئية، يجب عليك إنشاء العينة Alibaba Cloud وتشغيل حاوية Docker في هذه العينة. يمكنك تنفيذ هذه الخطوات عبر لوحة تحكم Alibaba Cloud أو [واجهة سطر الأوامر لـ Alibaba Cloud (CLI)](https://www.alibabacloud.com/help/doc-detail/25499.htm). في هذه الإرشادات، يتم استخدام لوحة تحكم Alibaba Cloud.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. افتح لوحة تحكم Alibaba Cloud → قائمة الخدمات → **خدمة الحوسبة المرنة** → **العينات**.
1. أنشئ العينة وفقًا لـ [إرشادات Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) والمبادئ التوجيهية أدناه:

    * يمكن أن تعتمد العينة على صورة أي نظام تشغيل.
    * نظرًا لأن العينة يجب أن تكون متوفرة للموارد الخارجية، يجب تكوين عنوان IP العام أو النطاق في إعدادات العينة.
    * يجب أن تعكس إعدادات العينة [الطريقة المستخدمة للاتصال بالعينة](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. اتصل بالعينة واحدة من الأساليب الموصوفة في [وثائق Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. قم بتثبيت حزم Docker في العينة وفقًا لـ [إرشادات نظام التشغيل المناسب](https://docs.docker.com/engine/install/#server).
1. قم بتعيين متغير البيئة للعينة بالرمز الذي تم نسخه من Wallarm ليتم استخدامه في الاتصال بالسحابة Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. قم بتشغيل حاوية Docker للعقدة Wallarm باستخدام الأمر `docker run` مع المتغيرات البيئية الممررة والملف التكوين المثبت:

    === "أمر Wallarm US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.10.2-1
        ```
    === "أمر Wallarm EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -p 80:80 wallarm/node:4.10.2-1
        ```
        
    * `-p`: المنفذ الذي تستمع إليه العقدة الفلترة. يجب أن يكون القيمة هي نفسها المنفذ الخاص بالعينة.
    * `-e`: المتغيرات البيئية بتكوين العقدة الفلترة (المتغيرات المتاحة مدرجة في الجدول أدناه). يرجى ملاحظة أنه لا يوصى بتمرير قيمة `WALLARM_API_TOKEN` بشكل صريح.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [اختبار تشغيل العقدة الفلترة](#testing-the-filtering-node-operation).

## نشر حاوية Docker للعقدة Wallarm مكونة من خلال الملف المثبت

لنشر العقدة الفلترة المحتوَّية لـ Wallarm المكونة من خلال المتغيرات البيئية والملف المثبت، يجب إنشاء العينة Alibaba Cloud، تحديد موقع ملف تكوين العقدة الفلترة في نظام ملفات هذه العينة وتشغيل حاوية Docker في هذه العينة. يمكنك تنفيذ هذه الخطوات عبر لوحة تحكم Alibaba Cloud أو [واجهة سطر الأوامر لـ Alibaba Cloud (CLI)](https://www.alibabacloud.com/help/doc-detail/25499.htm). في هذه الإرشادات، يتم استخدام لوحة تحكم Alibaba Cloud.

--8<-- "../include/waf/installation/get-api-or-node-token.md"
            
1. افتح لوحة تحكم Alibaba Cloud → قائمة الخدمات → **خدمة الحوسبة المرنة** → **العينات**.
1. أنشئ العينة وفقًا لـ [إرشادات Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) والمبادئ التوجيهية أدناه:

    * يمكن أن تعتمد العينة على صورة أي نظام تشغيل.
    * نظرًا لأن العينة يجب أن تكون متوفرة للموارد الخارجية، يجب تكوين عنوان IP العام أو النطاق في إعدادات العينة.
    * يجب أن تعكس إعدادات العينة [الطريقة المستخدمة للاتصال بالعينة](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. اتصل بالعينة بواحدة من الأساليب الموصوفة في [وثائق Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. قم بتثبيت حزم Docker في العينة وفقًا لـ [إرشادات نظام التشغيل المناسب](https://docs.docker.com/engine/install/#server).
1. قم بتعيين متغير البيئة للعينة بالرمز الذي تم نسخه من Wallarm ليتم استخدامه في الاتصال بالسحابة Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. في العينة، قم بإنشاء الدليل مع الملف `default` الذي يحتوي على تكوين العقدة الفلترة (على سبيل المثال، يمكن تسمية الدليل باسم `configs`). مثال على الملف ذي الإعدادات الدنيا:

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

    [مجموعة من التوجيهات الفلترة التي يمكن تحديدها في الملف التكوين →][nginx-waf-directives]
1. قم بتشغيل حاوية Docker للعقدة Wallarm باستخدام الأمر `docker run` مع المتغيرات البيئية الممررة والملف التكوين المثبت:

    === "أمر Wallarm US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.10.2-1
        ```
    === "أمر Wallarm EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.10.2-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: المسار إلى ملف التكوين الذي تم إنشاؤه في الخطوة السابقة. على سبيل المثال، `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: دليل الحاوية لتثبيت ملف التكوين عليه. يمكن تثبيت ملفات التكوين على الدلائل التالية المستخدمة بواسطة NGINX في الحاوية:

        * `/etc/nginx/conf.d` — الإعدادات العامة
        * `/etc/nginx/sites-enabled` — إعدادات الجهاز الظاهري
        * `/var/www/html` — الملفات الثابتة

        يجب أن تكتب التوجيهات الفلترة في الملف `/etc/nginx/sites-enabled/default`.
    
    * `-p`: المنفذ الذي تستمع إليه العقدة الفلترة. يجب أن يكون القيمة هي نفسها المنفذ الخاص بالعينة.
    * `-e`: المتغيرات البيئية بتكوين العقدة الفلترة (المتغيرات المتاحة مدرجة في الجدول أدناه). يرجى ملاحظة أنه لا يوصى بتمرير قيمة `WALLARM_API_TOKEN` بشكل صريح.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [اختبار تشغيل العقدة الفلترة](#testing-the-filtering-node-operation).

## اختبار تشغيل العقدة الفلترة

1. افتح لوحة تحكم Alibaba Cloud → قائمة الخدمات → **خدمة الحوسبة المرنة** → **العينات** وانسخ عنوان IP العام للعينة من عمود **عنوان IP**.

    ![إعدادات عينة الحاوية][copy-container-ip-alibaba-img]

    إذا كان عنوان IP فارغًا، يرجى التأكد من أن العينة في حالة **التشغيل**.

2. أرسل الطلب مع اختبار الهجوم [Path Traversal][ptrav-attack-docs] إلى العنوان الذي تم نسخه:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. افتح لوحة تحكم Wallarm → **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    ![الهجمات في واجهة المستخدم][attacks-in-ui-image]

لعرض تفاصيل الأخطاء التي حدثت أثناء نشر الحاوية، يرجى [الاتصال بالعينة بأحد الطرق](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) ومراجعة [سجلات الحاوية][logging-docs]. إذا كانت العينة غير متوفرة، يرجى التأكد من أن الوسائط المطلوبة للعقدة الفلترة مع القيم الصحيحة يتم تمريرها إلى الحاوية.