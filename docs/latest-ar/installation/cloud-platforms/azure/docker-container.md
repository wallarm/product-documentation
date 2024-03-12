# نشر صورة دوكر لوالارم فى ازور

توفر هذه الدليل السريع الخطوات اللازمة لنشر [صورة دوكر لعقدة والارم المبنية على NGINX](https://hub.docker.com/r/wallarm/node) على منصة سحابة مايكروسوفت ازور باستخدام خدمة [**حالات الحاويات** في ازور](https://docs.microsoft.com/en-us/azure/container-instances/).

!!! warning "قيود التعليمات"
    هذه التعليمات لا تغطي تكوين توازن الحمل وتوسيع العقدة تلقائياً. إذا قمت بتكوين هذه المكونات بنفسك، ننصحك بقراءة الوثائق عن [بوابة تطبيقات ازور](https://docs.microsoft.com/en-us/azure/application-gateway/overview).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## المتطلبات

* اشتراك ازور نشط
* [تثبيت في أمر CLI ازور](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* الوصول إلى الحساب بدور **المسؤول** والمصادقة المزدوجة غير مفعلة في لوحة تحكم والارم للـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)

## خيارات ضبط حاوية دوكر لعقدة والارم

--8<-- "../include/waf/installation/docker-running-options.md"

## نشر حاوية دوكر لعقدة والارم المضبوطة من خلال متغيرات البيئة

لنشر حاوية عقدة والارم المضبوطة فقط من خلال متغيرات البيئة، يمكن استخدام الأدوات التالية:

* [أمر CLI ازور](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [بوابة ازور](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [أمر PowerShell ازور](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [نموذج ARM](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [أمر CLI دوكر](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

في هذه التعليمات، يتم نشر الحاوية باستخدام أمر CLI ازور.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. سجل الدخول إلى أمر CLI ازور باستخدام الأمر [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login):

    ```bash
    az login
    ```
1. أنشئ مجموعة موارد باستخدام الأمر [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create). على سبيل المثال، أنشئ المجموعة `myResourceGroup` في منطقة شرق الولايات المتحدة بالأمر التالي:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. حدد متغير البيئة المحلي مع رمز العقدة والارم ليتم استخدامه لربط النموذج بسحابة والارم:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. أنشئ مورد ازور من حاوية دوكر لعقدة والارم باستخدام الأمر [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create):

    === "أمر لسحابة والارم الأمريكية"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name waf-node \
            --dns-name-label wallarm-waf \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.10.1-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "أمر لسحابة والارم الأوروبية"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name waf-node \
            --dns-name-label wallarm-waf \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.10.1-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_LABELS='group=<GROUP>'
         ```
        
    * `--resource-group`: اسم مجموعة الموارد المُنشأة في الخطوة الثانية.
    * `--name`: اسم الحاوية.
    * `--dns-name-label`: علامة DNS لاسم الحاوية.
    * `--ports`: المنفذ الذي يستمع إليه عقدة التصفية.
    * `--image`: اسم صورة دوكر لعقدة والارم.
    * `--environment-variables`: متغيرات البيئة مع تكوين عقدة التصفية (المتغيرات المتاحة مذكورة في الجدول أدناه). يُرجى ملاحظة أنه لا ينصح بمرور قيمة `WALLARM_API_TOKEN` صراحةً.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. افتح [بوابة ازور](https://portal.azure.com/) وتأكد من ظهور المورد المُنشأ في قائمة الموارد.
1. [اختبر تشغيل عقدة التصفية](#testing-the-filtering-node-operation).

## نشر حاوية دوكر لعقدة والارم المضبوطة من خلال ملف مُثبت

لنشر حاوية عقدة والارم المضبوطة من خلال متغيرات البيئة وملف مُثبت، يمكن استخدام أداة [أمر CLI ازور](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) فقط.

لنشر الحاوية بمتغيرات البيئة وملف التكوين المثبت:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. سجل الدخول إلى أمر CLI ازور باستخدام الأمر [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login):

    ```bash
    az login
    ```
1. أنشئ مجموعة موارد باستخدام الأمر [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create). على سبيل المثال، أنشئ المجموعة `myResourceGroup` في منطقة شرق الولايات المتحدة بالأمر التالي:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. أنشئ ملف تكوين مع إعدادات عقدة التصفية محليًا. مثال على الملف بأقل الإعدادات:

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

    [مجموعة من توجيهات عقدة التصفية التي يمكن تحديدها في ملف التكوين →][nginx-waf-directives]
1. قم بتحديد ملف التكوين بإحدى الطرق المناسبة لتثبيت أحجام البيانات في ازور. كل الطرق موضحة في [**قسم تثبيت أحجام البيانات** من وثائق ازور](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files).

    في هذه التعليمات، يتم تثبيت ملف التكوين من مستودع الجيت.
1. حدد متغير البيئة المحلي مع رمز عقدة والارم ليتم استخدامه لربط النموذج بسحابة والارم:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. أنشئ مورد ازور من حاوية دوكر لعقدة والارم باستخدام الأمر [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create):

    === "أمر لسحابة والارم الأمريكية"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name waf-node \
            --dns-name-label wallarm-waf \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.10.1-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "أمر لسحابة والارم الأوروبية"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name waf-node \
            --dns-name-label wallarm-waf \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.10.1-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_LABELS='group=<GROUP>'
         ```

    * `--resource-group`: اسم مجموعة الموارد المُنشأة في الخطوة الثانية.
    * `--name`: اسم الحاوية.
    * `--dns-name-label`: علامة DNS لاسم الحاوية.
    * `--ports`: المنفذ الذي يستمع إليه عقدة التصفية.
    * `--image`: اسم صورة دوكر لعقدة والارم.
    * `--gitrepo-url`: URL لمستودع الجيت الذي يحتوي على ملف التكوين. إذا كان الملف موجودًا في جذر المستودع، فأنت بحاجة فقط إلى تمرير هذا المعامل. إذا كان الملف موجودًا في دليل منفصل بمستودع الجيت، فمن فضلك قم بتمرير مسار الدليل أيضًا في معامل `--gitrepo-dir` (مثال،<br>`--gitrepo-dir ./dir1`).
    * `--gitrepo-mount-path`: دليل الحاوية لتثبيت ملف التكوين إليه. يمكن تثبيت ملفات التكوين في الدلائل التالية المُستخدمة بواسطة NGINX:

        * `/etc/nginx/conf.d` — الإعدادات العامة
        * `/etc/nginx/sites-enabled` — إعدادات مضيف افتراضي
        * `/var/www/html` — الملفات الثابتة

        يجب وصف توجيهات عقدة التصفية في ملف `/etc/nginx/sites-enabled/default`.
    
    * `--environment-variables`: متغيرات البيئة التي تحتوي على إعدادات لعقدة التصفية وربط سحابة والارم (المتغيرات المتاحة موضحة في الجدول أدناه). يُرجى ملاحظة أنه لا ينصح بمرور قيمة `WALLARM_API_TOKEN` صراحةً.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. افتح [بوابة ازور](https://portal.azure.com/) وتأكد من ظهور المورد المُنشأ في قائمة الموارد.
1. [اختبر تشغيل عقدة التصفية](#testing-the-filtering-node-operation).

## اختبار تشغيل عقدة التصفية

1. افتح المورد المُنشأ على بوابة ازور وانسخ قيمة **FQDN**.

    ![ضبط مثيل الحاوية][copy-container-ip-azure-img]

    إذا كان حقل **FQDN** خاليًا، من فضلك تأكد بأن الحاوية في حالة **تشغيل**.

2. أرسل الطلب مع الهجوم الاختباري [اختراق المسار][ptrav-attack-docs] إلى النطاق المنسوخ:

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. افتح لوحة تحكم والارم → **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    ![الهجمات في واجهة المستخدم][attacks-in-ui-image]

تفاصيل الأخطاء التي حدثت أثناء نشر الحاوية معروضة في علامة التبويب **الحاويات** → **السجلات** لتفاصيل المورد على بوابة ازور. إذا كان المورد غير متوفر، من فضلك تأكد من مرور المعلمات المطلوبة لعقدة التصفية بالقيم الصحيحة إلى الحاوية.