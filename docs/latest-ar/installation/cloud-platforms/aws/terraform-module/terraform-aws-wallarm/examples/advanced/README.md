# مثال عن تنفيذ وحدة Wallarm AWS Terraform: حل البروكسي المتقدم

هذا المثال يوضح كيفية نشر Wallarm كبروكسي مدمج بإعدادات متقدمة داخل شبكة AWS الخاصة الافتراضية (VPC) باستخدام وحدة Terraform. يشبه كثيرًا [نشر البروكسي البسيط](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) ولكن مع بعض خيارات الإعداد المتقدمة المعروضة.

لبداية أسهل مع هذا المثال، اطلع على [مثال البروكسي البسيط](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) أولًا.

حل Wallarm البروكسي المتقدم (كذلك البروكسي البسيط) يوفر طبقة شبكة وظيفية إضافية تعمل كموجه متقدم لحركة مرور HTTP مع وظائف أمان WAF وAPI.

## الخصائص الرئيسية

الحل البروكسي المتقدم يختلف عن البسيط كما يلي:

* الحل لا يُنشئ أي موازن تحميل (`lb_enabled=false`) ولكن لا يزال يُنشئ مجموعة هدف يمكنك بعد ذلك إرفاقها بموازن تحميل موجود.

    يمكن أن يساعد ذلك على الانتقال سلسًا إلى نهج معالجة حركة المرور المتزامنة.
* يتم تحديد تكوين NGINX وWallarm ليس فقط في المتغيرات القياسية ولكن أيضًا في قطع الـ NGINX`global_snippet`، `http_snippet` و `server_snippet`.
* بمجرد انتهاء سكريبت تهيئة عقدة Wallarm (cloud-init)، سيضع السكريبت الخاص `post-cloud-init.sh` صفحة الفهرس HTML المخصصة في دليل النسخة `/var/www/mysite/index.html`.
* يُرتبط المكدس المنشور بسياسة AWS IAM الإضافية التي تُمكن الوصول إلى AWS S3 للقراءة فقط.

    إذا كنت تستخدم هذا المثال "كما هو"، فلن تكون هناك حاجة إلى الوصول المقدم. على أية حال، يحتوي ملف `post-cloud-init.sh` على مثال غير نشط لطلب الملفات من AWS S3 التي عادةً ما تتطلب وصولاً خاصًا. إذا كنت ستنشط شيفرة S3 من ملف `post-cloud-init.sh`، ستحتاج إلى تحديد سياسات وصول IAM لـ AWS S3 في المتغير `extra_policies`.
* الحل يسمح بالاتصالات الواردة إلى نسخ Wallarm من منفذ الشبكة الداخلي الإضافي، 7777. يتم تكوين ذلك مع المتغير `extra_ports` و`http_snippet.conf`.

    للسماح بالمنفذ 7777 لـ `0.0.0.0/0`، يمكنك استخدام المتغير `extra_public_ports` بشكل اختياري.
* عقدة Wallarm تعالج حركة المرور في وضع الحجب.

## بنية الحل

![مخطط البروكسي Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

مثال حل البروكسي Wallarm المتقدم له العناصر التالية:

* مجموعة الهدف مرفقة بمجموعة توسع تلقائي بدون موازن تحميل.
* نسخ Wallarm لتحليل حركة المرور، حجب الطلبات الضارة و الوكالة للطلبات الشرعية أكثر.

    المثال يُشغل نسخ Wallarm في وضع الحجب الذي يحرك السلوك الموصوف. يمكن أن تعمل نسخ Wallarm أيضًا في أوضاع أخرى بما في ذلك تلك الموجهة فقط لمراقبة حركة المرور دون حجب الطلبات الضارة. لمعرفة المزيد عن أوضاع نسخ Wallarm، استخدم [توثيقنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* نسخ Wallarm تُوكل حركة المرور إلى `https://httpbin.org`.

    خلال إطلاق هذا المثال، ستكون قادرًا على تحديد أي نطاق خدمة آخر أو مسار متاح من شبكة AWS الخاصة الافتراضية (VPC) لوكالة حركة المرور إليه.

جميع العناصر المدرجة (باستثناء الخادم الموكل) سيتم نشرها بواسطة وحدة `wallarm` المثال المقدمة.

## مكونات الشفرة

هذا المثال يحتوي على مكونات الشفرة التالية:

* `main.tf`: التكوين الرئيسي لوحدة `wallarm` التي سيتم نشرها كحل بروكسي متقدم.
* `global_snippet.conf`: مثال على تكوين NGINX المخصص الذي سيتم إضافته إلى تكوين NGINX العالمي باستخدام المتغير `global_snippet`. يمكن أن تشمل التكوين المُركَّب على التوجيهات مثل `load_module`، `stream`، `mail` أو `env`.
* `http_snippet.conf`: تكوين NGINX المخصص الذي سيتم إضافته إلى سياق NGINX `http` باستخدام المتغير `http_snippet`. يمكن أن تشمل التكوين المُركَّب على التوجيهات مثل `map` أو `server`.
* `server_snippet.conf`: تكوين NGINX المخصص الذي سيتم إضافته إلى سياق NGINX `server` باستخدام المتغير `server_snippet`. يمكن أن يقدم التكوين لقطة منطق NGINX `if` وإعدادات `location` المطلوبة.

    سيتم تطبيق هذا التكوين للقطة فقط على المنفذ 80. لفتح منفذ آخر، حدد التوجيه `server` المقابل في `http_snippet`.

    في ملف `server_snippet.conf`، ستجد أيضًا مثال تكوين أكثر تعقيدًا.
* `post-cloud-init.sh`: السكريبت الخاص الذي يضع صفحة الفهرس HTML المخصصة في دليل النسخة `/var/www/mysite/index.html`. سيتم تنفيذ السكريبت بعد تهيئة العقدة Wallarm (سكريبت cloud-init).

    في ملف `post-cloud-init.sh`، ستجد أيضًا أوامر المثال لوضع محتوى AWS S3 في دليل النسخة. إذا كنت تستخدم هذا الخيار، لا تنس تحديد سياسة وصول S3 في المتغير `extra_policies`.

## تشغيل مثال حل البروكسي Wallarm AWS

1. اشترك في وحدة تحكم Wallarm على [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح وحدة تحكم Wallarm → **Nodes** وأنشئ العقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المولد.
1. استنسخ المستودع الذي يحتوي على شفرة المثال إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. حدد قيم المتغير في الخيارات `default` في ملف `examples/advanced/variables.tf` للمستودع المُستنسَخ واحفظ التغييرات.
1. حدد بروتوكول الخادم الموكل والعنوان في `examples/advanced/main.tf` → `proxy_pass`.

    بشكل افتراضي، ستوكل Wallarm حركة المرور إلى `https://httpbin.org`. إذا كانت القيمة الافتراضية تلبي احتياجاتك، اتركها كما هي.
1. نشر المكدس بتنفيذ الأوامر التالية من دليل `examples/advanced`:

    ```
    terraform init
    terraform apply
    ```

لإزالة بيئة المنشورة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [إرفاق موازن تحميل AWS بمجموعة توسع تلقائي](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)
* [AWS VPC مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [توثيق Wallarm](https://docs.wallarm.com)