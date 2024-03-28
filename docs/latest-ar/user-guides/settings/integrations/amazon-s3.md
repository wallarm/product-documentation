# Amazon S3

[Amazon S3](https://aws.amazon.com/s3/?nc1=h_ls) ، أو Amazon Simple Storage Service ، هو خدمة تخزين سحابية قابلة للتوسعة تقدمها خدمات الويب الأمازونية (AWS). يتم استخدامه لمجموعة متنوعة من الأغراض ، بما في ذلك النسخ الاحتياطي للبيانات ، أرشفة البيانات ، توزيع المحتوى ، استضافة المواقع ، وتخزين بيانات التطبيقات. يمكنك إعداد Wallarm لإرسال الملفات التي تحتوي على معلومات عن الهجمات المكتشفة إلى دلو Amazon S3 الخاص بك. سيتم إرسال المعلومات في ملفات بتنسيق JSON كل 10 دقائق.

حقول البيانات لكل هجوم:

* `time` - تاريخ ووقت استكشاف الهجمة بتنسيق Unix Timestamp
* `request_id`
* `ip` - عنوان IP للمهاجم
* نوع مصدر الهجوم: `datacenter`, `tor`, `remote_country`
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

سيتم حفظ الملفات في دلاء S3 الخاص بك باستخدام اسم الملف `wallarm_hits_{timestamp}.json` أو `wallarm_hits_{timestamp}.jsonl`. سيعتمد تنسيق البيانات ، إما JSON Array أو New Line Delimited JSON (NDJSON) ، على الاختيار الذي قمت به أثناء إعداد التكامل.

## إعداد التكامل

عند إعداد التكامل مع Amazon S3 ، تحتاج إلى تحديد أي طريقة تريد استخدامها للتفويض:

* **عبر ARN الدور (موصى به)** - يوصي AWS باستخدام أدوار التفويض بخيار الهوية الخارجية كطريقة لزيادة الأمان والحد من هجمات "النائب المرتبك". تقدم Wallarm هذه الهوية الفريدة لحساب مؤسستك.
* **عبر مفتاح الوصول السري** - طريقة أكثر شيوعًا وبساطة ، تتطلب مشاركة [مفتاح الوصول](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html) الخاص بمستخدم IAM الخاص بك في AWS. إذا اخترت هذه الطريقة ، يوصى باستخدام مفتاح الوصول لمستخدم IAM منفصل يمتلك فقط إذن كتابة إلى دلاء S3 المستخدم في التكامل.

لإعداد تكامل Amazon S3:

1. قم بإنشاء دلاء Amazon S3 لـ Wallarm تبعًا لـ [التعليمات](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html).
1. قم بإجراء خطوات مختلفة تعتمد على طريقة التفويض المحددة.

    === "Role ARN"

        1. في واجهة المستخدم الرسومية لـ AWS ، انتقل إلى S3 → دلاؤك → علامة التبويب **Properties** وانسخ رمز **AWS Region** الخاص بك و **Amazon Resource Name (ARN)**.

            على سبيل المثال ، `us-west-1` كمنطقة و `arn:aws:s3:::test-bucket-json` كـ ARN.

        1. في واجهة المستخدم لوحة التحكم Wallarm ، افتح قسم **Integrations**.
        1. انقر على كتلة **AWS S3** أو انقر على الزر **Add integration** واختر **AWS S3**.
        1. أدخل اسم التكامل.
        1. أدخل رمز المنطقة الخاصة بـ AWS المنسوخ مسبقًا لدلاء S3 الخاص بك.
        1. أدخل اسم دلائك S3.
        1. انسخ معرف الحساب الخاص بـ Wallarm المقدم.
        1. انسخ الهوية الخارجية المقدمة.
        1. في واجهة المستخدم لـ AWS ، بدء إنشاء [دور جديد](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) تحت IAM → **Access Management** → **Roles**.
        1. اختر **AWS account** → **Another AWS Account** كنوع الكيان الموثوق.
        1. الصق **Account ID** الخاص بـ Wallarm.
        1. اختر **Require external ID** والصق الهوية الخارجية المقدمة من Wallarm.
        1. انقر على **Next** وأنشئ سياسة للدور الخاص بك:

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
        1. في واجهة المستخدم لوحة التحكم Wallarm ، في الحوار الخاص بإنشاء التكامل الخاص بك ، في علامة التبويب **Role ARN** ، الصق ARN الخاص بالدور الخاص بك.

            ![تكامل Amazon S3](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "Secret access key"

        1. في واجهة المستخدم الرسومية لـ AWS ، انتقل إلى S3 → دلاؤك → علامة التبويب **Properties** وانسخ رمز **AWS Region** الخاص بك ، على سبيل المثال `us-west-1`.
        1. انتقل إلى IAM → Dashboard → قسم **Manage access keys** → **Access keys**.
        1. احصل على مُعرّف مفتاح الوصول الذي تخزنه في مكان ما أو قم بإنشاء مفتاح جديد / استعادة المفتاح المفقود كما هو موضح [هنا](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/). على أي حال ، ستحتاج إلى المفتاح النشط ومعرفه.
        1. في واجهة المستخدم لوحة التحكم Wallarm ، افتح قسم **Integrations**.
        1. انقر على كتلة **AWS S3** أو انقر على الزر **Add integration** واختر **AWS S3**.
        1. أدخل اسم التكامل.
        1. أدخل رمز المنطقة الخاص بـ AWS المنسوخ مسبقًا لدلاء S3 الخاص بك.
        1. أدخل اسم دلائك S3.
        1. في علامة التبويب **Secret access key** ، أدخل مُعرّف مفتاح الوصول والمفتاح نفسه.

1. حدد التنسيق للبيانات Wallarm: إما JSON Array أو New Line Delimited JSON (NDJSON).
1. تأكد في قسم **Regular notifications** ، أنه تم اختيار إرسال الهجمات في آخر 10 دقائق. إذا لم يتم اختيارها ، لن يتم إرسال البيانات إلى دلاء S3.
1. انقر على **Test integration** للتحقق من صحة التكوين ، وتوفر الويب السحابي Wallarm ، وتنسيق الإشعارات.

    بالنسبة لـ Amazon S3 ، يرسل اختبار التكامل ملف JSON يحتوي على البيانات إلى دلائك. فيما يلي مثال على ملف JSON الذي يحتوي على بيانات الهجمات المكتشفة في آخر 10 دقائق:

    === "JSON Array"
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
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"time":"1687241470","request_id":"d2a900a6efac7a7c893a00903205071a","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        {"time":"1687241475","request_id":"b457fccec9c66cdb07eab7228b34eca6","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        ```
1. اضغط على **Add integration**.

للتحكم في كمية البيانات المخزنة ، يوصى بإعداد حذف تلقائي للكائنات القديمة من دلائك Amazon S3 كما هو موضح [هنا](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html).

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"