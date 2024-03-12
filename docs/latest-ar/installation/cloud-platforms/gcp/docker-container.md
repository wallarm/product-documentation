# نشر صورة دوكر الخاصة ب Wallarm على GCP

هذا الدليل السريع يوفر الخطوات لنشر [صورة دوكر لعُقدة وولارم المبنية على NGINX](https://hub.docker.com/r/wallarm/node) على منصة جوجل السحابية باستخدام [مكون محرك احتساب جوجل (GCE)](https://cloud.google.com/compute).

!!! تحذير "قيود الإرشادات"
    هذه الإرشادات لا تغطي تكوين توازن الحمل وتوسيع نطاق العقدة تلقائيًا. إذا كنت تعمل على إعداد هذه المكونات بنفسك، نوصي بقراءة [وثائق GCP المناسبة](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/google-gce-use-cases.md"

## المتطلبات

* حساب GCP نشيط
* [تم إنشاء مشروع GCP](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* تم تفعيل [واجهة برمجة تطبيقات محرك الحساب](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d)
* [تم تثبيت وتكوين واجهة سطر أوامر جوجل السحابية (gcloud CLI) ](https://cloud.google.com/sdk/docs/quickstart)
* الوصول إلى الحساب بدور **المدير** وتعطيل المصادقة الثنائية في وحدة التحكم وولارم لـ [السحاب الأمريكي](https://us1.my.wallarm.com/) أو [السحاب الأوروبي](https://my.wallarm.com/)

## خيارات تكوين حاوية عقدة وولارم دوكر 

--8<-- "../include/waf/installation/docker-running-options.md"

## نشر حاوية عقدة وولارم دوكر المُكونة من خلال المتغيرات البيئية

لنشر العقدة الفلترة لوولارم المحتواة والمُكونة فقط من خلال المتغيرات البيئية، يمكنك استخدام [وحدة التحكم GCP أو gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). في هذه الإرشادات، يتم استخدام gcloud CLI.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتعيين المتغير البيئي المحلي برمز الوصول لعقدة وولارم لاستخدامه في توصيل النموذج بسحاب وولارم:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. قم بإنشاء نموذج بتشغيل حاوية دوكر باستخدام الأمر [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container):

    === "الأمر لسحاب وولارم الأمريكي"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:4.10.1-1
        ```
    === "الأمر لسحاب وولارم الأوروبي"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:4.10.1-1
        ```

    * `<INSTANCE_NAME>`: اسم النموذج، على سبيل المثال: `wallarm-node`.
    * `--zone`: [المنطقة](https://cloud.google.com/compute/docs/regions-zones) التي ستستضيف النموذج.
    * `--tags`: علامات النموذج. تُستخدم العلامات لتكوين توفر النموذج للموارد الأخرى. في الحالة الحالية، يُعين العلامة `http-server` لفتح المنفذ 80 على النموذج.
    * `--container-image`: رابط صورة دوكر للعقدة الفلترة.
    * `--container-env`: متغيرات بيئية بتكوين العقدة الفلترة ( المتغيرات المتاحة مذكورة في الجدول أدناه). يرجى ملاحظة أنه لا يُنصح بإدخال قيمة `WALLARM_API_TOKEN` صراحةً.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * جميع معاملات الأمر `gcloud compute instances create-with-container` موصوفة في [وثائق GCP](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container).
1. افتح [وحدة التحكم GCP → **محرك الحساب** → نماذج VM](https://console.cloud.google.com/compute/instances) وتأكد من ظهور النموذج في القائمة.
1. [اختبر تشغيل العقدة الفلترة](#testing-the-filtering-node-operation).

## نشر حاوية عقدة وولارم دوكر المُكونة عبر الملف المُعلَق

لنشر العقدة الفلترة لوولارم المحتواة والمُكونة عبر المتغيرات البيئية والملف المُعلَق، يجب إنشاء النموذج، تحديد ملف تكوين العقدة الفلترة في نظام ملفات هذا النموذج وتشغيل حاوية دوكر في هذا النموذج. يمكنك تنفيذ هذه الخطوات عبر [وحدة التحكم GCP أو gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). في هذه الإرشادات، يتم استخدام gcloud CLI.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بإنشاء النموذج باستنادًا إلى أي صورة نظام تشغيل من سجل محرك الحساب باستخدام الأمر [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create):

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: اسم النموذج.
    * `--image`: اسم صورة نظام التشغيل من سجل محرك الحساب. سيتم استناد النموذج المُنشأ على هذه الصورة وسيُستخدم لاحقًا لتشغيل حاوية دوكر. إذا تم حذف هذا المعامل، سيتم استناد النموذج على صورة ديبيان 10.
    * `--zone`: [المنطقة](https://cloud.google.com/compute/docs/regions-zones) التي ستستضيف النموذج.
    * `--tags`: علامات النموذج. تُستخدم العلامات لتكوين توفر النموذج للموارد الأخرى. في الحالة الحالية، يُعين العلامة `http-server` لفتح المنفذ 80 على النموذج.
    * جميع معاملات الأمر `gcloud compute instances create` موصوفة في [وثائق GCP](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create).
1. افتح [وحدة التحكم GCP → **محرك الحساب** → نماذج VM](https://console.cloud.google.com/compute/instances) وتأكد من ظهور النموذج في القائمة وأنه في حالة **RUNNING**.
1. قم بالاتصال بالنموذج عبر SSH باتباع [إرشادات GCP](https://cloud.google.com/compute/docs/instances/ssh).
1. قم بتثبيت حزم دوكر في النموذج باتباع [الإرشادات لنظام التشغيل المناسب](https://docs.docker.com/engine/install/#server).
1. قم بتعيين المتغير البيئي المحلي برمز الوصول لعقدة وولارم لاستخدامه في توصيل النموذج بسحاب وولارم:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. في النموذج، قم بإنشاء الدليل بملف `default` الذي يحتوي على تكوين العقدة الفلترة ( على سبيل المثال، يمكن تسمية الدليل كـ `configs`). مثال للملف بإعدادات دنيا:

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

    [مجموعة توجيهات العقدة الفلترة التي يمكن تحديده في ملف التكوين →][nginx-waf-directives]
1. قم بتشغيل حاوية عقدة وولارم دوكر باستخدام الأمر `docker run` مع تمرير المتغيرات البيئية وتعليق ملف التكوين:

    === "الأمر لسحاب وولارم الأمريكي"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.10.1-1
        ```
    === "الأمر لسحاب وولارم الأوروبي"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.10.1-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: مسار ملف التكوين الذي تم إنشاؤه في الخطوة السابقة. على سبيل المثال، `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: دليل الحاوية لتعليق ملف التكوين إليه. يمكن تعليق ملفات التكوين في الأدلة التالية داخل الحاوية والتي تُستخدم بواسطة NGINX:

        * `/etc/nginx/conf.d` — الإعدادات العامة
        * `/etc/nginx/sites-enabled` — إعدادات المضيف الافتراضي
        * `/var/www/html` — الملفات الثابتة

        يجب وصف توجيهات العقدة الفلترة في ملف `/etc/nginx/sites-enabled/default`.
    
    * `-p`: المنفذ الذي تستمع إليه العقدة الفلترة. يجب أن يكون القيمة نفسها كمنفذ النموذج.
    * `-e`: متغيرات بيئية بتكوين العقدة الفلترة (المتغيرات المتاحة مُدرجة في الجدول أدناه). يرجى ملاحظة أنه لا يُنصح بإدخال قيمة `WALLARM_API_TOKEN` صراحةً.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [اختبر تشغيل العقدة الفلترة](#testing-the-filtering-node-operation).

## اختبار تشغيل العقدة الفلترة

1. افتح [وحدة التحكم GCP → **محرك الحساب** → نماذج VM](https://console.cloud.google.com/compute/instances) وانسخ عنوان الآي بي للنموذج من عمود **الآي بي الخارجي**.

    ![إعداد نموذج الحاوية][copy-container-ip-gcp-img]

    إذا كان عنوان الآي بي فارغًا، يرجى التأكد من أن النموذج في حالة **RUNNING**.

2. أرسل الطلب مع الهجوم التجريبي [اختراق المسار][ptrav-attack-docs] إلى العنوان المنسوخ:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. افتح وحدة التحكم وولارم → **الهجمات** في [السحاب الأمريكي](https://us1.my.wallarm.com/attacks) أو [السحاب الأوروبي](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    ![الهجمات في واجهة المستخدم][attacks-in-ui-image]

يتم عرض التفاصيل حول الأخطاء التي حدثت خلال نشر الحاوية في قائم