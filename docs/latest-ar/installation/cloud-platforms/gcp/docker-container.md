# نشر صورة Docker للعقدة Wallarm على GCP

توفر هذه الدليل السريع الخطوات المطلوبة لنشر [صورة Docker للعقدة Wallarm المبنية على NGINX](https://hub.docker.com/r/wallarm/node) على Google Cloud Platform باستخدام [مكون Google Compute Engine (GCE)](https://cloud.google.com/compute).

!!! تحذير "حدود التعليمات"
    هذه التعليمات لا تغطي التكوين في توازن الحمولة والتوسع الذاتي للعقدة. إذا كنت تقوم بإعداد هذه المكونات بنفسك، نوصي بقراءة الجزء المناسب من [توثيق GCP](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/google-gce-use-cases.md"

## المتطلبات

* حساب GCP نشط
* [مشروع GCP قد تم إنشاؤه](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* تم تمكين [واجهة برمجة تطبيقات Compute Engine](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d)
* تم تثبيت [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/quickstart) وتكوينه
* الوصول إلى الحساب ذو الدور **Administrator** والمصادقة الثنائية العوامل معطلة في Wallarm Console لـ [US Cloud](https://us1.my.wallarm.com/) أو [EU Cloud](https://my.wallarm.com/)

## خيارات تكوين حاوية Docker للعقدة Wallarm 

--8<-- "../include/waf/installation/docker-running-options.md"

## نشر حاوية Docker للعقدة Wallarm المكونة من خلال المتغيرات البيئية

لنشر عقدة الفلترة المضمنة في حاوية Wallarm المكونة فقط من خلال المتغيرات البيئية، يمكنك استخدام [واجهه GCP Console أو gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). في هذه التعليمات، يتم استخدام gcloud CLI.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتعيين متغير البيئة المحلي مع رمز عقدة Wallarm الذي سيتم استخدامه لربط النسخة بـ Wallarm Cloud:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1.  قم بإنشاء العينة مع حاوية Docker الجاري تشغيلها باستخدام الأمر [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container):

    === "الأمر لـ Wallarm US Cloud"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:4.10.4-1
        ```
    === "الأمر لـ Wallarm EU Cloud"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:4.10.4-1
        ```

    * `<INSTANCE_NAME>`: اسم العينة، على سبيل المثال: `wallarm-node`.
    * `--zone`: [المنطقة](https://cloud.google.com/compute/docs/regions-zones) التي ستستضيف العينة.
    * `--tags`: علامات العينة. تستخدم العلامات لتكوين توفر العينة للموارد الأخرى. في الحالة الحالية، يتم تعيين العلامة `http-server` التي تفتح منفذ 80 للعينة.
    * `--container-image`: الرابط إلى صورة Docker للعقدة الفاصلة.
    * `--container-env`: المتغيرات البيئية مع تكوين العقدة الفاصلة (المتغيرات المتاحة مدرجة في الجدول أدناه). يرجى ملاحظة أنه لا يُنصح بتمرير قيمة `WALLARM_API_TOKEN` صراحة.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * يتم وصف جميع معلمات الأمر `gcloud compute instances create-with-container` في [توثيق GCP](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container).
1. قم بفتح [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) وتأكد من أن العينة معروضة في القائمة.
1.  [اختبر تشغيل العقدة الفاصلة](#testing-the-filtering-node-operation).

## نشر حاوية Docker للعقدة Wallarm المكونة من خلال الملف المثبت

لنشر عقدة الفلترة المضمنة في حاوية Wallarm المكونة من خلال المتغيرات البيئية والملف المثبت، يجب أن تقوم بإنشاء العينة، تحديد ملف تكوين العقدة الفاصلة في نظام الملفات هذه العينة وتشغيل حاوية Docker في هذه العينة. يمكنك تنفيذ هذه الخطوات عبر [واجهه GCP Console أو gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). في هذه التعليمات، يتم استخدام gcloud CLI.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بإنشاء العينة على أساس أي صورة تشغيل لنظام التشغيل من سجل Compute Engine باستخدام الأمر [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create):

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: اسم العينة.
    * `--image`: اسم صورة نظام التشغيل من سجل Compute Engine. العينة المُنشأة ستكون مبنية على هذه الصورة وستتم استخدامها لتشغيل حاوية Docker في وقت لاحق. إذا تم حذف هذه الباراميتر، ستكون العينة مبنية على صورة Debian 10.
    * `--zone`: [المنطقة](https://cloud.google.com/compute/docs/regions-zones) التي ستستضيف العينة.
    * `--tags`: علامات العينة. تستخدم العلامات لتكوين توفر العينة للموارد الأخرى. في الحالة الحالية، يتم تعيين العلامة `http-server` التي تفتح منفذ 80 للعينة.
    * يتم وصف جميع معلمات الأمر `gcloud compute instances create` في [توثيق GCP](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create).
1. قم بفتح [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) وتأكد من أن العينة معروضة في القائمة وأنها في حالة **RUNNING**.
1. قم بالاتصال بالعينة عبر SSH وفقًا لـ [تعليمات GCP](https://cloud.google.com/compute/docs/instances/ssh).
1. قم بتثبيت حزم Docker في العينة وفقًا للـ [تعليمات لنظام التشغيل المناسب](https://docs.docker.com/engine/install/#server).
1. قم بتعيين متغير البيئة المحلي مع رمز عقدة Wallarm الذي سيتم استخدامه لربط العينة بـ Wallarm Cloud:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. في العينة، قم بإنشاء الدليل مع الملف `default` الذي يحتوي على تكوين العقدة الفاصلة (على سبيل المثال، يمكن أن يُسمى الدليل `configs`). مثال على الملف مع الإعدادات القليلة:

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

    [مجموعة من التوجيهات الفاصلة للعقدة التي يمكن تحديدها في ملف التكوين →][nginx-waf-directives]
1. قم بتشغيل حاوية Docker للعقدة Wallarm باستخدام الأمر `docker run` مع المتغيرات البيئية المُمررة والملف التكوين المثبت:

    === "الأمر لـ Wallarm US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.10.4-1
        ```
    === "الأمر لـ Wallarm EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.10.4-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: المسار إلى الملف التكوين الذي تم إنشاؤه في الخطوة السابقة. على سبيل المثال، `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: الدليل للحاوية لتثبيت الملف التكوين. يمكن تثبيت الملفات التكوين على الدلائل التالية المستخدمة بواسطه NGINX:

        * `/etc/nginx/conf.d` — الإعدادات الشائعة
        * `/etc/nginx/sites-enabled` — إعدادات الاستضافة الافتراضية
        * `/var/www/html` — الملفات الثابتة

        يجب وصف توجيهات العقدة الفاصلة في الملف `/etc/nginx/sites-enabled/default`.
    
    * `-p`: منفذ يستمع إليه العقدة الفاصلة. القيمة يجب أن تكون نفس منفذ العينة..
    * `-e`: এর মাধ্যমে ফিল্টারিং নোড কনফিগারেশনের পরিবেশ চলকগুলি (নিম্ন তালিকাভুক্ত চলকগুলি উপলব্ধ). অনুগ্রহ করে মনে রাখবেন যে `WALLARM_API_TOKEN` এর মান সরাসরি পাস করার জন্য প্রস্তাব দেওয়া হয়নি।

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1.  [اختبار تشغيل العقدة الفاصلة](#testing-the-filtering-node-operation)。

## اختبار تشغيل العقدة الفاصلة

1. قم بفتح [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) وانسخ عنوان IP للعينة من عمود **External IP**.

    ![إعداد عينة الحاوية][copy-container-ip-gcp-img]

    إذا كان عنوان IP فارغًا، تأكد من أن العينة في حالة **RUNNING**.

2. أرسل الطلب مع هجوم اختبار [Path Traversal][ptrav-attack-docs] إلى العنوان المنسوخ:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. قم بفتح Wallarm Console → **Attacks** في [US Cloud](https://us1.my.wallarm.com/attacks) أو [EU Cloud](https://my.wallarm.com/attacks) وتأكد من أن الهجوم معروض في القائمة.
    ![الهجمات في واجهة المستخدم][attacks-in-ui-image]

تتم عرض التفاصيل حول الأخطاء التي حدثت أثناء نشر الحاوية في القائمة **View logs** للعينة. إذا كانت العينة غير متاحة، يرجى التأكد من أن التكوين الفاصلة للعقدة المطلوبة مع القيم الصحيحة تُمرَر إلى الحاوية.