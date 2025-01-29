# نشر صورة Docker التابعة لـ Wallarm على Azure

يقدم هذا الدليل السريع الخطوات اللازمة لنشر [صورة Docker للعقدة التي تعتمد على NGINX لـ Wallarm](https://hub.docker.com/r/wallarm/node) على منصة السحابة Microsoft Azure باستخدام خدمة [**Azure Container Instances**](https://docs.microsoft.com/en-us/azure/container-instances/).

!!! تحذير "قيود التعليمات"
    هذه التعليمات لا تغطي تكوين توازن الحمولة والتطبيق التلقائي للعقدة. إذا قمت بإعداد هذه المكونات بنفسك، نوصي بقراءة التوثيق على  [Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## المتطلبات 

* اشتراك Azure نشط
* [تثبيت Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* الوصول إلى الحساب ذو دور **المسؤول** والذي تم تعطيل التوثيق ثنائي العامل في Wallarm Console لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)

## خيارات تكوين حاوية Docker للعقدة Wallarm

--8<-- "../include/waf/installation/docker-running-options.md"

## نشر حاوية Docker للعقدة Wallarm المكوّنة من خلال المتغيرات البيئية

لنشر العقدة التصفية الخاصة بـ Wallarm المحتواة والتي تم تكوينها فقط من خلال المتغيرات البيئية، يمكنك استخدام الأدوات التالية:

* [Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [ARM template](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

في هذه التعليمات، يتم نشر الحاوية باستخدام Azure CLI.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتسجيل الدخول إلى Azure CLI باستخدام الأمر [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login):

    ```bash
    az login
    ```
1. قم بإنشاء مجموعة موارد باستخدام الأمر [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create). على سبيل المثال، أنشئ الفرقة `myResourceGroup` في منطقة East US بالأمر التالي:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. قم بتعيين المتغير البيئي المحلي برمز العقدة Wallarm الذي سيتم استخدامه لربط الوحدة بالسحابة Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. قم بإنشاء المورد Azure من حاوية Docker الخاصة بالعقدة Wallarm باستخدام الأمر [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create):

    === "الأمر للسحابة Wallarm الأمريكية"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.10.4-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "الأمر للسحابة Wallarm الأوروبية"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.10.4-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_LABELS='group=<GROUP>'
         ```
        
    * `--resource-group`: اسم مجموعة الموارد التي تم إنشاؤها في الخطوة الثانية.
    * `--name`: اسم الحاوية.
    * `--dns-name-label`: تسمية اسم DNS للحاوية.
    * `--ports`: النافذة التي تستمع العقدة التصفية عليها.
    * `--image`: اسم صورة Docker الخاصة بالعقدة Wallarm.
    * `--environment-variables`: المتغيرات البيئية بتكوينات العقدة التصفية (المتغيرات المتاحة مدرجة في الجدول أدناه). يرجى ملاحظة أنه لا يوصى بتمرير قيمة `WALLARM_API_TOKEN` بشكل صريح.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. قم بفتح [Azure portal](https://portal.azure.com/) وتأكد من عرض المورد المنشئ في قائمة الموارد.
1. [اختبر عملية تصفية العقدة](#testing-the-filtering-node-operation).

## نشر حاوية Docker للعقدة Wallarm المكوّنة من خلال الملف المثبت

لنشر العقدة التصفية الخاصة بـ Wallarm المحتواة والتي تم تكوينها من خلال المتغيرات البيئية والملف المثبت، يمكن استخدام [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) فقط.

لنشر الحاوية بالمتغيرات البيئية وملف التكوين المثبت:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتسجيل الدخول إلى Azure CLI باستخدام الأمر [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login):

    ```bash
    az login
    ```
1. قم بإنشاء مجموعة موارد باستخدام الأمر [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create). على سبيل المثال، أنشئ الفرقة `myResourceGroup` في منطقة East US بالأمر التالي:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. قم بإنشاء ملف التكوين المحلي مع إعدادات العقدة التصفية. على سبيل المثال، ملف بالإعدادات القليلة:

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

    [مجموعة التوجيهات التصفية للعقدة التي يمكن تحديدها في ملف التكوين →][nginx-waf-directives]
1. حدد موقع الملف التكوين إحدى الطرق المناسبة لتثبيت أحجام البيانات في Azure. تتم مناقشة جميع الأساليب في قسم [**تثبيت أحجام البيانات** لتوثيقات Azure](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files).

    في هذه التعليمات، يتم تثبيت ملف التكوين من المستودع Git.
1. قم بتعيين المتغير البيئي المحلي برمز العقدة Wallarm الذي سيتم استخدامه لربط الوحدة بالسحابة Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. قم بإنشاء مورد Azure من حاوية Docker الخاصة بالعقدة Wallarm باستخدام الأمر [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create):

    === "الأمر للسحابة Wallarm الأمريكية"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.10.4-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "الأمر للسحابة Wallarm الأوروبية"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.10.4-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_LABELS='group=<GROUP>'
         ```

    * `--resource-group`: اسم مجموعة الموارد التي تم إنشاؤها في الخطوة الثانية.
    * `--name`: اسم الحاوية.
    * `--dns-name-label`: تسمية اسم DNS للحاوية.
    * `--ports`: النافذة التي تستمع العقدة التصفية عليها.
    * `--image`: اسم صورة Docker الخاصة بالعقدة Wallarm.
    * `--gitrepo-url`: URL لمستودع Git الذي يحتوي على ملف التكوين. إذا كان الملف موجودًا في جذر المستودع، فكل ما تحتاج إليه هو تمرير هذا المعلمة فقط. إذا كان الملف موجود في دليل مستودع Git منفصل، يرجى مرور مسار الدليل في المعلمة `--gitrepo-dir` (على سبيل المثال،<br>`--gitrepo-dir ./dir1`).
    * `--gitrepo-mount-path`: دليل الحاوية لتثبيت ملف التكوين عليه. يمكن تثبيت ملفات التكوين على الدلائل التالية من الحاوية التي يستخدمها NGINX:

        * `/etc/nginx/conf.d` — الإعدادات المشتركة
        * `/etc/nginx/sites-enabled` — إعدادات الاستضافة الافتراضية
        * `/var/www/html` — الملفات الثابتة

        يجب وصف توجيهات العقدة التصفية في ملف `/etc/nginx/sites-enabled/default`.
    
    * `--environment-variables`: المتغيرات البيئية التي تحتوي على إعدادات العقدة التصفية واتصال Wallarm Cloud (المتغيرات المتاحة مدرجة في الجدول أدناه). يرجى ملاحظة أنه لا يوصى بتمرير قيمة `WALLARM_API_TOKEN` بصراحة.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. افتح [Azure portal](https://portal.azure.com/) وتأكد من عرض المورد المنشئ في قائمة الموارد.
1. [اختبر عملية تصفية العقدة](#testing-the-filtering-node-operation).

## اختبار عملية تصفية العقدة

1. افتح المورد المنشئ على Azure portal وانسخ قيمة **FQDN**.

    ![Settig up container instance][copy-container-ip-azure-img]

    إذا كان حقل **FQDN** فارغًا، يرجى التأكد من أن الحاوية في الحالة **Running**.

2. أرسل الطلب بالهجوم [Path Traversal][ptrav-attack-docs] الاختباري إلى النطاق المنسوخ:

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. افتح Wallarm Console → **Attacks** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من عرض الهجوم في القائمة.
    ![Attacks in UI][attacks-in-ui-image]

تظهر التفاصيل الخاصة بالأخطاء التي حدثت أثناء نشر الحاوية على التبويب **Containers** → **Logs** من تفاصيل المورد على Azure portal. إذا كان المورد غير متوفر، يرجى التأكد من تمرير الوحدة المطلوبة للعقدة التصفية بقيم صحيحة إلى الحاوية.