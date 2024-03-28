# نشر صورة Docker لـ Wallarm على AWS

يقدم هذا الدليل السريع الخطوات لنشر [صورة Docker للعقدة Wallarm باستخدام NGINX](https://hub.docker.com/r/wallarm/node) على منصة السحابة Amazon باستخدام [خدمة الحاويات المرنة من Amazon (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/).

!!! تحذير "قيود التعليمات"
    هذه التعليمات لا تغطي تكوين التوازن الحمولي وتكبير العقدة تلقائيًا. إذا كنت تقوم بإعداد هذه المكونات بنفسك, نوصي أن تراجع جزءاً مناسباً من [تعليمات AWS](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/aws-ecs-use-cases.md"

## المتطلبات

* حساب AWS ومستخدم بصلاحيات **مدير** 
* AWS CLI 1 أو AWS CLI 2 [مثبت](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) و [مكون](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) بشكل صحيح
* الوصول إلى الحساب بدور **المدير** وتعطيل التوثيق ذو العاملين في وحدة تحكم Wallarm لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)

## خيارات تكوين حاوية Docker للعقدة Wallarm

--8<-- "../include/waf/installation/docker-running-options.md"

##  نشر حاوية Docker للعقدة Wallarm المكونة عبر المتغيرات البيئية

لنشر العقدة الفلترة لـ Wallarm المحسنة في حاوية عبر المتغيرات البيئية فقط، يتم استخدام وحدة تحكم AWS و AWS CLI.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتسجيل الدخول إلى [وحدة تحكم AWS](https://console.aws.amazon.com/console/home) → قائمة **الخدمات** → **خدمة الحاويات المرنة**.
1. انتقل إلى إنشاء الكتلة عبر الزر **إنشاء الكتلة** :
      1. حدد القالب **EC2 Linux + Networking**.
      2. حدد اسم الكتلة، على سبيل المثال: `wallarm-cluster`.
      3. إذا كان لازماً، قم بتعيين الإعدادات الأخرى بتتبع [تعليمات AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html).
      4. حفظ الكتلة.
1. قم بتشفير البيانات الحساسة المطلوبة للاتصال بـ Cloud Wallarm (رمز العقدة) باستخدام [إدارة الأسرار AWS](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) أو [نظام AWS Manager → متجر البارامتر](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html).

    في هذه التعليمات، يتم تخزين البيانات الحساسة في إدارة الأسرار AWS.

    !!! تحذير "الوصول إلى تخزين البيانات الحساسة"
        للسماح للحاوية Docker بقراءة البيانات الحساسة المشفرة، يرجى التأكد من أن إعدادات AWS تلبي الشروط التالية:

        * البيانات الحساسة مخزنة في المنطقة المستخدمة لتشغيل حاوية Docker.
        * سياسة IAM **SecretsManagerReadWrite** مرتبطة بالمستخدم المحدد في البارامتر `executionRoleArn` لتعريف المهمة. [المزيد من التفاصيل عن إعداد سياسات IAM →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. قم بإنشاء الملف الـ JSON المحلي التالي بـ[تعريف المهمة](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) (يحدد تعريف المهمة سيناريو تشغيل الحاوية Docker) :

    === "إذا كنت تستخدم سحابة Wallarm الأمريكية"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                    {
                        "hostPort": 80,
                        "containerPort": 80,
                        "protocol": "tcp"
                    }
                ],
                "essential": true,
                "environment": [
                    {
                        "name": "WALLARM_API_HOST",
                        "value": "us1.api.wallarm.com"
                    },
                    {
                        "name": "NGINX_BACKEND",
                        "value": "<HOST_TO_PROTECT_WITH_WALLARM>"
                    },
                    {
                        "name": "WALLARM_LABELS",
                        "value": "group=<GROUP>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.10.2-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```
    === "إذا كنت تستخدم سحابة Wallarm الأوروبية"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                    {
                        "hostPort": 80,
                        "containerPort": 80,
                        "protocol": "tcp"
                    }
                ],
                "essential": true,
                "environment": [
                    {
                        "name": "NGINX_BACKEND",
                        "value": "<HOST_TO_PROTECT_WITH_WALLARM>"
                    },
                    {
                        "name": "WALLARM_LABELS",
                        "value": "group=<GROUP>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.10.2-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [معرف حساب AWS الخاص بك](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * يكون الكائن `environment` مجموعة المتغيرات البيئية التي يجب تمريرها إلى حاوية Docker في شكل نصي. يتم توصيف مجموعة المتغيرات البيئية المتاحة في الجدول أدناه. يوصى بتمرير المتغير `WALLARM_API_TOKEN` في الكائن `secrets`.
    * يضبط الكائن `secret` المتغيرات البيئية التي يجب تمريرها إلى حاوية Docker كروابط لتخزين البيانات الحساسة. يعتمد شكل القيم على التخزين المحدد (انظر المزيد من التفاصيل في [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) أو [AWS Systems Manager → متجر البارامتر](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) التوثيق).

        يُوصى بتمرير المتغير `WALLARM_API_TOKEN` في الكائن `secrets`.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * توضح جميع معلمات الملف التكويني في [توثيق AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).
1. قم بتسجيل تعريف المهمة استناداً إلى الملف التكويني JSON باستخدام الأمر [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html):

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: الرابط إلى الملف JSON مع تعريف المهمة على الجهاز المحلي.
    * `<JSON_FILE_NAME>`: اسم وإمتداد الملف JSON مع تعريف المهمة.
1. تشغيل المهمة في الكتلة استخدام الامر [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html):

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: اسم الكتلة التي تم إنشاؤها في الخطوة الأولى. على سبيل المثال، `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: اسم تعريف المهمة المُنشأ. يجب أن تتوافق القيمة مع قيمة البارامتر `family` المحددة في الملف JSON مع تعريف المهمة. على سبيل المثال، `wallarm-api-security-node`.
1. افتح وحدة تحكم AWS → **خدمة الحاويات المرنة** → الكتلة مع المهمة المُشغلة → **المهام** وتأكد من عرض المهمة في القائمة.
1. [اختبار تشغيل العقدة الفلترة](#testing-the-filtering-node-operation).

## نشر حاوية Docker للعقدة Wallarm المكونة من خلال الملف المثبت

لنشر العقدة الفلترة لـ Wallarm المحسنة في حاوية عن طريق المتغيرات البيئية والملف المثبت، يتم استخدام وحدة تحكم AWS و AWS CLI.

في هذه التعليمات، يتم تركيب الملف التكويني من [نظام الملفات AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html). يمكنك مراجعة الأساليب الأخرى لتركيب الملف في [التوثيق AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html).

لنشر الحاوية مع المتغيرات البيئية وملف التكوين المركب من AWS EFS:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتسجيل الدخول إلى [وحدة تحكم AWS](https://console.aws.amazon.com/console/home) → القائمة **الخدمات** → **خدمة الحاويات المرنة**.
1. انتقل إلى إنشاء الكتلة بواسطة الزر **إنشاء الكتلة**:

    * **قالب**: `EC2 Linux + Networking`.
    * **اسم الكتلة**: `wallarm-cluster` (كمثال).
    * **نموذج الإعداد**: `على الطلب الفوري`.
    * **نوع الحالة EC2**: `t2.micro`.
    * **عدد الحالات**: `1`.
    * **معرّف EC2 AMI**: `صورة AMI TTL منتظمة من Amazon Linux 2`.
    * **زوج المفاتيح**: [زوج المفاتيح](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) للاتصال SSH بالحالة. سوف تحتاج إلى الاتصال بالحالة عبر SSH لتحميل ملف التكوين إلى التخزين.
   * يمكن ترك الإعدادات الأخرى وفقًا للإعدادات الافتراضية. عند تغيير الإعدادات الأخرى، يُوصى باتباع [التعليمات المتعلقة بإعداد AWS EFS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html).
1. قم بتكوين تخزين AWS EFS وفقاً لخطوات 2-4 من [التعليمات AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html).
1. في الخطوة الرابعة من التعليمات AWS، قم بإنشاء ملف التكوين `default` ووضع الملف في الدليل الذي يخزن الملفات للتعليق بشكل افتراضي. يجب أن يغطي ملف `default` الضبط الفلترة. مثال على الملف مع الإعدادات الدنيا:

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

    [مجموعة التوجيهات الفلترة التي يمكن توضيحها في ملف التكوين →][nginx-waf-directives]
1. قم بتشفير البيانات الحساسة المطلوبة للاتصال بـ Cloud Wallarm (رمز العقدة) باستخدام [إدارة الأسرار AWS](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) أو [نظام AWS Manager → متجر البارامتر](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html).

    في هذه التعليمات، يتم تخزين البيانات الحساسة في إدارة الأسرار AWS.

    !!! تحذير "الوصول إلى تخزين البيانات الحساسة"
        للسماح للحاوية Docker بقراءة البيانات الحساسة المشفرة، يرجى التأكد من أن إعدادات AWS تلبي الشروط التالية:

        * البيانات الحساسة مخزنة في المنطقة المستخدمة لتشغيل حاوية Docker.
        * سياسة IAM **SecretsManagerReadWrite** مرتبطة بالمستخدم المحدد في البارامتر `executionRoleArn` لتعريف المهمة. [المزيد من التفاصيل عن إعداد سياسات IAM →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. قم بإنشاء الملف الـ JSON المحلي التالي بـ[تعريف المهمة](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) (يحدد تعريف المهمة سيناريو تشغيل الحاوية Docker) :

    === "إذا كنت تستخدم سحابة Wallarm الأمريكية"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                    {
                        "hostPort": 80,
                        "containerPort": 80,
                        "protocol": "tcp"
                    }
                ],
                "essential": true,
                "mountPoints": [
                    {
                        "containerPath": "<PATH_FOR_MOUNTED_CONFIG>",
                        "sourceVolume": "<NAME_FROM_VOLUMES_OBJECT>"
                    }
                ],
                "environment": [
                    {
                        "name": "WALLARM_API_HOST",
                        "value": "us1.api.wallarm.com"
                    },
                    {
                        "name": "WALLARM_LABELS",
                        "value": "group=<GROUP>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.10.2-1"
                }
            ],
            "volumes": [
                {
                    "name": "<VOLUME_NAME>",
                    "efsVolumeConfiguration": {
                        "fileSystemId": "<EFS_FILE_SYSTEM_ID>",
                        "transitEncryption": "ENABLED"
                    }
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```
    === "إذا كنت تستخدم سحابة Wallarm الأوروبية"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                    {
                        "hostPort": 80,
                        "containerPort": 80,
                        "protocol": "tcp"
                    }
                ],
                "essential": true,
                "mountPoints": [
                    {
                        "containerPath": "/etc/nginx/sites-enabled",
                        "sourceVolume": "default"
                    }
                ],
                "environment": [
                    {
                        "name": "WALLARM_LABELS",
                        "value": "group=<GROUP>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.10.2-1"
                }
            ],
            "volumes": [
                {
                    "name": "default",
                    "efsVolumeConfiguration": {
                        "fileSystemId": "<EFS_FILE_SYSTEM_ID>",
                        "transitEncryption": "ENABLED"
                    }
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [معرف حساب AWS الخاص بك](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `<PATH_FOR_MOUNTED_CONFIG>`: دليل الحاوية لتركيب ملف التكوين عليها. يمكن تثبيت ملفات التكوين على الدلائل التالية المستخدمة من قبل NGINX:

        * `/etc/nginx/conf.d` — الإعدادات العامة
        * `/etc/nginx/sites-enabled` — إعدادات المضيف الافتراضي
        * `/var/www/html` — الملفات الثابتة

        يجب أن يتم وصف التوجيهات الفلترة في ملف `/etc/nginx/sites-enabled/default`.
    
    * `<NAME_FROM_VOLUMES_OBJECT>`: اسم الكائن `volumes` الذي يحتوي على تكوين تخزين الملف المثبت في AWS EFS (يجب أن تكون القيمة نفسها باسم `<VOLUME_NAME>`).
    * `<VOLUME_NAME>`: اسم الكائن `volumes` الذي يحتوي على تكوين تخزين الملف المثبت في AWS EFS.
    * `<EFS_FILE_SYSTEM_ID>`: معرف نظام الملفات EFS الذي يحتوي على الملف الذي يجب تثبيته على الحاوية. يتم عرض المعرف في وحدة تحكم AWS → **الخدمات** → **EFS** → **أنظمة الملف**.
    * يكون الكائن `environment` مجموعة المتغيرات البيئية التي يجب تمريرها إلى حاوية Docker في شكل نصي. يتم توصيف مجموعة المتغيرات البيئية المتاحة في الجدول أدناه. يوصى بتمرير المتغير `WALLARM_API_TOKEN` في الكائن `secrets`.
    * يضبط الكائن `secret` المتغيرات البيئية التي يجب تمريرها إلى حاوية Docker كروابط لتخزين البيانات الحساسة. يعتمد شكل القيم على التخزين المحدد (انظر المزيد من التفاصيل في [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) أو [AWS Systems Manager → متجر البارامتر](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) التوثيق).

        يُوصى بتمرير المتغير `WALLARM_API_TOKEN` في الكائن `secrets`.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * توضح جميع معلمات الملف التكويني في [توثيق AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).
1. قم بتسجيل تعريف المهمة استناداً إلى الملف التكويني JSON باستخدام الأمر [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html):

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: الرابط إلى الملف JSON مع تعريف المهمة على الجهاز المحلي.
    * `<JSON_FILE_NAME>`: اسم وإمتداد الملف JSON مع تعريف المهمة.
1. تشغيل المهمة في الكتلة استخدام الامر [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html):

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: اسم الكتلة التي تم إنشاؤها في الخطوة الأولى. على سبيل المثال، `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: اسم تعريف المهمة المُنشأ. يجب أن تتوافق القيمة مع قيمة البارامتر `family` المحددة في الملف JSON مع تعريف المهمة. على سبيل المثال، `wallarm-api-security-node`.
1. افتح وحدة تحكم AWS → **خدمة الحاويات المرنة** → الكتلة مع المهمة المُشغلة → **المهام** وتأكد من عرض المهمة في القائمة.
1. [اختبار تشغيل العقدة الفلترة](#testing-the-filtering-node-operation).

## اختبار تشغيل العقدة الفلترة

1. في وحدة تحكم AWS، افتح المهمة المشتغلة وانسخ عنوان IP الخاص بالحاوية من الحقل **الرابط الخارجي**.

    ![Settig up container instance][aws-copy-container-ip-img]

    إذا كان عنوان IP فارغاً، يرجى التأكد من أن الحاوية في حالة **التشغيل**.

2. أرسل الطلب مع الهجوم Path Traversal إلى العنوان المنسوخ:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. افتح وحدة تحكم Wallarm → **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من أن الهجوم مُعروض في القائمة.
    ![Attacks in UI][attacks-in-ui-image]

تتم عرض التفاصيل حول الأخطاء التي حدثت أثناء نشر الحاوية في تفاصيل المهمة في وحدة تحكم AWS. إذا كانت الحاوية غير متاحة، يرجى التأكد من تمرير المعلمات المطلوبة للعقدة الفلترة مع القيم الصحيحة إلى الحاوية.
