# Amazon S3

[Amazon S3](https://aws.amazon.com/s3/?nc1=h_ls)، أو خدمة التخزين البسيطة من أمازون، هي خدمة تخزين سحابية قابلة للتطوير يقدمها خدمات ويب من أمازون (AWS). تُستخدم لعدة أغراض بما في ذلك النسخ الاحتياطي للبيانات، الأرشفة، توزيع المحتوى، استضافة المواقع، وتخزين بيانات التطبيقات. يمكنك إعداد وولارم لإرسال ملفات بمعلومات عن الضربات التي تم اكتشافها إلى سطل أمازون S3 الخاص بك. سيتم إرسال المعلومات في ملفات بصيغة JSON كل ١٠ دقائق.

حقول البيانات لكل ضربة:

* `time` - تاريخ ووقت اكتشاف الضربة بصيغة الطابع الزمني ليونكس
* `request_id`
* `ip` - IP المهاجم
* نوع مصدر الضربة: `datacenter`, `tor`, `remote_country`
* `application_id`
* `domain`
* `method`
* `uri`
* `protocol`
* `status_code`
* `attack_type`
* `block_status`
* `payload` 
* `point`
* `tags`

سيتم حفظ الملفات في سطل S3 الخاص بك باستخدام قاعدة التسمية `wallarm_hits_{timestamp}.json` أو `wallarm_hits_{timestamp}.jsonl`. الصيغة، إما مصفوفة JSON أو JSON محددة بسطر جديد (NDJSON)، ستعتمد على اختيارك أثناء إعداد التكامل.

## إعداد التكامل

عند إعداد التكامل مع Amazon S3، تحتاج إلى تحديد الطريقة التي ستستخدمها للتفويض:

* **عبر ARN الدور (موصى به)** - استخدام الأدوار مع خيار ID الخارجي لمنح الوصول إلى الموارد موصى به [من قبل AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console) كطريقة تزيد من الأمان وتمنع هجمات "النائب الحائر". وولارم يوفر مثل هذه الهوية الفريدة لحساب مؤسستك.
* **عبر مفتاح الوصول السري** - طريقة أكثر شيوعًا، أبسط، تتطلب [مفتاح وصول](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html) مشترك لمستخدم IAM الخاص بك في AWS. إذا اخترت هذه الطريقة، يُنصح باستخدام مفتاح وصول لمستخدم IAM منفصل بإذن كتابة إلى السطل S3 المستخدم في التكامل فقط.

لإعداد تكامل Amazon S3:

1. إنشاء سطل Amazon S3 لوولارم وفقًا لـ[التعليمات](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html).
1. أداء خطوات مختلفة تبعًا لطريقة التفويض المختارة.

    === "Role ARN"

        1. في واجهة مستخدم AWS، انتقل إلى S3 → سطلك → علامة التبويب **خصائص** وانسخ كود **المنطقة AWS** و **Amazon Resource Name (ARN)** لسطلك.

            على سبيل المثال، `us-west-1` كمنطقة و `arn:aws:s3:::test-bucket-json` كـ ARN.

        1. في واجهة مستخدم وولارم، افتح قسم **التكاملات**.
        1. اضغط على كتلة **AWS S3** أو اضغط على زر **إضافة تكامل** واختر **AWS S3**.
        1. أدخل اسم التكامل.
        1. أدخل كود منطقة AWS الذي تم نسخه مسبقًا لسطل S3 الخاص بك.
        1. أدخل اسم سطل S3 الخاص بك.
        1. انسخ معرف حساب وولارم المقدم.
        1. انسخ الـID الخارجي المقدم.
        1. في واجهة مستخدم AWS، بادر بإنشاء [دور جديد](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) ضمن IAM → **إدارة الوصول** → **الأدوار**.
        1. اختر **حساب AWS** → **حساب AWS آخر** كنوع للكيان الموثوق به.
        1. الصق معرف حساب **وولارم**.
        1. اختر **تطلب ID خارجي** والصق ID الخارجي المقدم من وولارم.
        1. اضغط **التالي** وأنشئ سياسة لدورك:

            ```json
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "VisualEditor0",
                        "Effect": "Allow",
                        "Action": "s3:PutObject",
                        "Resource": "<YOUR_S3_BUCKET_ARN>/*"
                    }
                ]
            }
            ```
        1. أكمل إنشاء الدور وانسخ ARN الخاص بالدور.
        1. في واجهة مستخدم وولارم، حوار إنشاء التكامل الخاص بك، في علامة التبويب **Role ARN**، الصق ARN الخاص بدورك.

            ![تكامل Amazon S3](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "Secret access key"

        1. في واجهة مستخدم AWS، انتقل إلى S3 → سطلك → علامة التبويب **خصائص** وانسخ كود **منطقة AWS**، على سبيل المثال `us-west-1`.
        1. انتقل إلى IAM → اللوحة الرئيسية → **إدارة مفاتيح الوصول** → قسم **مفاتيح الوصول**.
        1. احصل على معرف مفتاح الوصول الذي تخزنه في مكان ما أو قم بإنشاء مفتاح جديد/استعادة مفتاح مفقود كما هو موضح [هنا](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/). على أي حال، ستحتاج إلى مفتاحك النشط ومعرفه.
        1. في واجهة مستخدم وولارم، افتح قسم **التكاملات**.
        1. اضغط على كتلة **AWS S3** أو اضغط على زر **إضافة تكامل** واختر **AWS S3**.
        1. أدخل اسم التكامل.
        1. أدخل كود منطقة AWS الذي تم نسخه مسبقًا لسطل S3 الخاص بك.
        1. أدخل اسم سطل S3 الخاص بك.
        1. في علامة التبويب **مفتاح الوصول السري**، أدخل معرف مفتاح الوصول والمفتاح نفسه.

1. اختر صيغة بيانات وولارم: إما مصفوفة JSON أو JSON محددة بسطر جديد (NDJSON).
1. تأكد من أن قسم **الإشعارات الدورية**، الضربات في آخر ١٠ دقائق مختارة ليتم إرسالها. إذا لم يتم اختيارها، لن يتم إرسال البيانات إلى سطل S3.
1. اضغط **اختبار التكامل** للتحقق من صحة التكوين، توفر سحابة وولارم، وصيغة الإشعار.

    لتكامل Amazon S3، يرسل اختبار التكامل ملف JSON بالبيانات إلى سطلك. هنا مثال على ملف JSON بالبيانات عن الضربات التي تم اكتشافها في آخر ١٠ دقائق:

    === "مصفوفة JSON"
        ```json
        [
        {
            "time":"1687241470",
            "request_id":"d2a900a6efac7a7c893a00903205071a",
            "ip":"127.0.0.1",
            "datacenter":"unknown",
            "tor":"none",
            "remote_country":null,
            "application_id":[
                -1
            ],
            "domain":"localhost",
            "method":"GET",
            "uri":"/etc/passwd",
            "protocol":"none",
            "status_code":499,
            "attack_type":"ptrav",
            "block_status":"monitored",
            "payload":[
                "/etc/passwd"
            ],
            "point":[
                "uri"
            ],
            "tags":{
                "lom_id":7,
                "libproton_version":"4.4.11",
                "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
                "wallarm_mode":"monitoring",
                "final_wallarm_mode":"monitoring"
            }
        },
        {
            "time":"1687241475",
            "request_id":"b457fccec9c66cdb07eab7228b34eca6",
            "ip":"127.0.0.1",
            "datacenter":"unknown",
            "tor":"none",
            "remote_country":null,
            "application_id":[
                -1
            ],
            "domain":"localhost",
            "method":"GET",
            "uri":"/etc/passwd",
            "protocol":"none",
            "status_code":499,
            "attack_type":"ptrav",
            "block_status":"monitored",
            "payload":[
                "/etc/passwd"
            ],
            "point":[
                "uri"
            ],
            "tags":{
                "lom_id":7,
                "libproton_version":"4.4.11",
                "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
                "wallarm_mode":"monitoring",
                "final_wallarm_mode":"monitoring"
            }
        }
        ]
        ```
    === "JSON محددة بسطر جديد (NDJSON)"
        ```json
        {"time":"1687241470","request_id":"d2a900a6efac7a7c893a00903205071a","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        {"time":"1687241475","request_id":"b457fccec9c66cdb07eab7228b34eca6","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        ```
1. اضغط **إضافة تكامل**.

للتحكم في كمية البيانات المخزنة، يُنصح بإعداد حذف تلقائي للعناصر القديمة من سطل Amazon S3 الخاص بك كما هو موضح [هنا](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html).

## تعطيل وحذف تكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"