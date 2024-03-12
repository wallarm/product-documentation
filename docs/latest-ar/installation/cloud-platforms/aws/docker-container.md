# نشر صورة وارم دوكر على AWS

هذا الدليل السريع يوفر الخطوات لنشر [صورة Docker لعقدة Wallarm المبنية على NGINX](https://hub.docker.com/r/wallarm/node) على منصة السحابة Amazon باستخدام [خدمة الحاوية المرنة Amazon (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/).

!!! warning "حدود التعليمات"
    هذه التعليمات لا تغطي تكوين توازن الحمولة و autoscaling للعقدة. إذا كنت تعد هذه المكونات بنفسك، نوصي بمراجعة الجزء المناسب من [تعليمات AWS](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/).

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/aws-ecs-use-cases.md"

## المتطلبات

* حساب AWS ومستخدم بصلاحيات *admin*
* AWS CLI 1 أو AWS CLI 2 مثبتة بالشكل الصحيح ومكونة بشكل صحيح [تثبيت](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) و [إعداد](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
* الوصول إلى الحساب بدور *المسؤول* والتوثيق الثنائي المعطل في وحدة تحكم Wallarm لـ [الغيم الأمريكي](https://us1.my.wallarm.com/) أو [الغيم الأوروبي](https://my.wallarm.com/)

## خيارات تكوين حاوية دوكر لعقدة وارم

--8<-- "../include/waf/installation/docker-running-options.md"

## نشر الحاوية المكونة لعقدة فيلترة وارم من خلال متغيرات البيئة فقط

لنشر العقدة المكونة لعقدة فلترة وارم من خلال متغيرات البيئة فقط، يتم استخدام وحدة تحكم إدارة AWS وCLI AWS.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتسجيل الدخول إلى [وحدة تحكم إدارة AWS](https://console.aws.amazon.com/console/home) → قائمة **الخدمات** → **خدمة الحاوية المرنة** .
1. انتقل إلى إنشاء الكتلة باستخدام الزر **إنشاء كتلة**:
      1. حدد القالب **EC2 Linux + الشبكة**.
      2. حدد اسم الكتلة، مثلا: `wallarm-cluster`.
      3. إذا لزم الأمر، قم بتعيين إعدادات أخرى وفقاً لـ [تعليمات AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html).
      4. حفظ الكتلة.
1. قم بتشفير البيانات الحساسة المطلوبة للاتصال بوارم الغيم (رمز العقدة) باستخدام [مدير سر AWS](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) أو [مدير نظم AWS → متجر البارامترات](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html).

    في هذه التعليمات، يتم تخزين البيانات الحساسة في مدير سر AWS.

    !!! warning "الوصول إلى تخزين البيانات الحساسة"
        للسماح للحاوية دوكر بقراءة البيانات الحساسة المشفرة، يرجى التأكد من أن إعدادات AWS تفي بالمتطلبات التالية:
        
        * يتم تخزين البيانات الحساسة في المنطقة المستخدمة لتشغيل حاوية Docker.
        * سياسة IAM **SecretsManagerReadWrite** مرتبطة بالمستخدم المحدد في معلمة `executionRoleArn` من التعريف المهمة. [المزيد من التفاصيل حول إعداد السياسات IAM →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. أنشئ الملف JSON المحلي التالي بـ [تعريف المهمة](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) ( يحدد تعريف المهمة سيناريو تشغيل حاوية Docker):

    === "إذا كنت تستخدم وارم الغيم الأمريكي"
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
                "image": "registry-1.docker.io/wallarm/node:4.10.1-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```
    === "إذا كنت تستخدم وارم الغيم الأوروبي"
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
                "image": "registry-1.docker.io/wallarm/node:4.10.1-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [معرف حسابك في AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * تعيين كائن `البيئة` يحدد متغيرات البيئة التي يجب تمريرها إلى حاوية Docker في تنسيق نصي. يتم وصف مجموعة من متغيرات البيئة المتاحة في الجدول أدناه. يوصى بتمرير المتغير `WALLARM_API_TOKEN` في كائن `الأسرار`.
    * يحدد كائن `الأسرار` متغيرات البيئة التي يجب تمريرها إلى حاوية Docker كروابط إلى تخزين البيانات الحساسة. يعتمد تنسيق القيم على التخزين المحدد (راجع المزيد من التفاصيل في الوثائق لـ [مدير السر AWS](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) أو [مدير النظام AWS → متجر البارامترات](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html).

        يوصى بتمرير المتغير `WALLARM_API_TOKEN` في كائن `السر`.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * توصف جميع معلمات ملف التكوين في [وثائق AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).
1. قم بتسجيل تعريف المهمة بناءً على ملف التكوين JSON باستخدام الأمر [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html):

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: المسار إلى ملف JSON مع تعريف المهمة على الجهاز المحلي.
    * `<JSON_FILE_NAME>`: اسم وامتداد الملف JSON مع تعريف المهمة.
1. قم بتشغيل المهمة في الكتلة باستخدام الأمر [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html):

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: اسم الكتلة التي تم إنشاؤها في الخطوة الأولى. على سبيل المثال, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: اسم تعريف المهمة المنشأ. يجب أن يتوافق القيمة مع قيمة المعلمة `family` المحددة في ملف JSON مع تعريف المهمة. على سبيل المثال, `wallarm-api-security-node`.
1. افتح وحدة تحكم إدارة AWS → **خدمة الحاوية المرنة** → الكتلة مع المهمة الجارية → **Tasks** وتأكد من أن المهمة معروضة في القائمة.
1. [اختبر عملية فلترة العقدة](#testing-the-filtering-node-operation).

## نشر حاوية Wallarm قائمة على Docker مع تصميم عبر الملف المثبت

لنشر العقدة المكونة لعقدة فلترة وارم من خلال متغيرات البيئة وملف مثبت، يتم استخدام وحدة تحكم إدارة AWS وCLI AWS.

في هذه التعليمات، يتم تحميل ملف التكوين من نظام الملفات [AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html). يمكنك مراجعة طرق أخرى لتحميل الملف في [وثائق AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html).

لنشر الحاوية مع متغيرات البيئة وملف التكوين المحمل من AWS EFS:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتسجيل الدخول إلى [وحدة تحكم إدارة AWS](https://console.aws.amazon.com/console/home) → قائمة **الخدمات** → **خدمة الحاوية المرنة**.
1. انتقل إلى إنشاء الكتلة باستخدام الزر **إنشاء كتلة**:

    * **قالب**: `EC2 Linux + الشبكة`.
    * **اسم الكتلة**: `wallarm-cluster` (كمثال).
    * **نموذج التمويل**: `عند الطلب للحالة`.
    * **نوع الواجهة الأمامية لEC2**:  `t2.micro`.
    * **عدد الواجهات الأمامية**: `1`.
    * **مُعرّف الخدمات المتكاملة على EC2**: `صورة AMI الأمثل لـ Amazon Linux 2 Amazon ECS`.
    * **ثنائية المفاتيح**: [ثنائية المفاتيح](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) للاتصال SSH بالواجهة الأمامية. ستحتاج إلى الاتصال بالواجهة الأمامية عبر SSH لتحميل ملف التكوين إلى التخزين.
    * يمكن ترك الإعدادات الأخرى كما هي الافتراضية. عند تغيير الإعدادات الأخرى، يوصى باتباع التعليمات حول إعداد [AWS EFS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html).
1. قم بتكوين تخزين AWS EFS باتباع الخطوات 2-4 من [تعليمات AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html).
1. في الخطوة الرابعة من تعليمات AWS، قم بإنشاء ملف التكوين `الافتراضي` وضع الملف في الدليل الذي يخزن الملفات للتحميل افتراضيا. يجب أن يغطي الملف `الافتراضي` تكوين العقدة للفلترة. مثال على الملف مع الإعدادات الدنيا:

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

    [مجموعة مباشرات العقدة للفلترة التي يمكن تحديدها في ملف التكوين →][nginx-waf-directives]
1. قم بتشفير البيانات الحساسة المطلوبة للاتصال بوارم الغيم (رمز العقدة) باستخدام [مدير السر AWS](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) أو [مدير النظام AWS → متجر البارامترات](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html).

    في هذه التعليمات، يتم تخزين البيانات الحساسة في مدير سر AWS.

    !!! warning "الوصول إلى تخزين البيانات الحساسة"
        للسماح للحاوية دوكر بقراءة البيانات الحساسة المشفرة، يرجى التأكد من أن إعدادات AWS تفي بالمتطلبات التالية:
        
        * يتم تخزين البيانات الحساسة في المنطقة المستخدمة لتشغيل حاوية Docker.
        * سياسة IAM **SecretsManagerReadWrite** مرتبطة بالمستخدم المحدد في معلمة `executionRoleArn` من التعريف المهمة. [المزيد من التفاصيل حول إعداد السياسات IAM →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. أنشئ الملف JSON المحلي التالي بـ [تعريف المهمة](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) ( يحدد تعريف المهمة سيناريو تشغيل حاوية Docker):

    === "إذا كنت تستخدم وارم الغيم الأمريكي"
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
                "image": "registry-1.docker.io/wallarm/node:4.10.1-1"
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
    === "إذا كنت تستخدم وارم الغيم الأوروبي"
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
                "image": "registry-1.docker.io/wallarm/node:4.10.1-1"
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

    * `<AWS_ACCOUNT_ID>`: [معرف حسابك في AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `<PATH_FOR_MOUNTED_CONFIG>`: دليل الحاوية لتحميل ملف التكوين فيه. يمكن تحميل ملفات التكوين إلى الدلائل التالية في الحاوية التي تستخدمها NGINX:

        * `/etc/nginx/conf.d` — الإعدادات العامة
        * `/etc/nginx/sites-enabled` — إعدادات المضيف الافتراضي
        * `/var/www/html` — الملفات الثابتة

        يجب أن تكون تعاريف فلترة العقدة في الملف `/etc/nginx/sites-enabled/default`.
    
    * `<NAME_FROM_VOLUMES_OBJECT>`: اسم كائن `المجلدات` الذي يحتوي على تكوين تخزين ملف EFS المثبت (القيمة يجب أن تكون الأمثل مثل `<VOLUME_NAME>`).
    * `<VOLUME_NAME>`: اسم كائن `المجلدات` الذي يحتوي على تكوين تخزين ملف EFS المثبت.
    * `<EFS_FILE_SYSTEM_ID>`: معرف نظام الملفات EFS الذي يحتوي على الملف الذي يجب تحميله على الحاوية. يتم عرض المعرّف في وحدة تحكم إدارة AWS → **الخدمات** → **EFS** → **نظم الملفات**.
    * تعيين كائن `البيئة` يحدد متغيرات البيئة التي يجب تمريرها إلى حاوية Docker في تنسيق نصي. يتم وصف مجموعة من متغيرات البيئة المتاحة في الجدول أدناه. يوصى بتمرير المتغير `WALLARM_API_TOKEN` في كائن `الأسرار`.
    * يحدد كائن `الأسرار` мتغيرات البيئة التي يجب تمريرها إلى حاوية Docker كروابط إلى تخزين البيانات الحساسة. يعتمد تنسيق القيم على التخزين المحدد (راجع المزيد من التفاصيل في الوثائق لـ [مدير السر AWS](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) أو [مدير النظام AWS → متجر البارامترات](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html).

        يوصى بتمرير المتغير `WALLARM_API_TOKEN` في كائن `الأسرار`.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * توصف جميع معلمات ملف التكوين في [وثائق AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).
1. قم بتسجيل تعريف المهمة بناءً على ملف التكوين JSON باستخدام الأمر [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html):

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: المسار إلى ملف JSON مع تعريف المهمة على الجهاز المحلي.
    * `<JSON_FILE_NAME>`: اسم وامتداد الملف JSON مع تعريف المهمة.
1. قم بتشغيل المهمة في الكتلة باستخدام الأمر [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html):

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: اسم الكتلة التي تم إنشاؤها في الخطوة الأولى. على سبيل المثال, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: اسم تعريف المهمة المنشأ. يجب أن يتوافق القيمة مع قيمة المعلمة `family` المحددة في ملف JSON مع تعريف المهمة. على سبيل المثال, `wallarm-api-security-node`.
1. افتح وحدة تحكم إدارة AWS → **خدمة الحاوية المرنة** → الكتلة مع المهمة الجارية → **Tasks** وتأكد من أن المهمة معروضة في القائمة.
1. [اختبر عملية فلترة العقدة](#testing-the-filtering-node-operation).

## اختبار عملية فلترة العقدة

1. في وحدة تحكم إدارة AWS، افتح المهمة الجارية وانسخ عنوان IP للحاوية من حقل **الرابط الخارجي**.

    ![اعداد الواجهة الأمامية للحاوية][aws-copy-container-ip-img]

    إذا كان عنوان IP فارغًا، يرجى التأكد من أن الحاوية في حالة **RUNNING**.

2. أرسل الطلب مع الهجوم الاختباري [Path Traversal][ptrav-attack-docs] إلى العنوان المنسوخ:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. افتح وحدة تحكم وارم → **الهجمات** في ال[غيم الأمريكي](https://us1.my.wallarm.com/attacks) أو ال[غيم الأوروبي](https://my.wallarm.com/attacks) وتأكد من أن هجوماً معروضاً في القائمة.
    ![Attacks in UI][attacks-in-ui-image]

يتم عرض التفاصيل حول الأخطاء التي وقعت أثناء نشر الحاوية في تفاصيل المهمة في وحدة تحكم إدارة AWS. إذا كانت الحاوية غير متاحة، يرجى التأكد من تمرير البارامترات المطلوبة للعقدة للفلترة بقيم صحيحة إلى الحاوية.