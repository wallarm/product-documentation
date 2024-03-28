# مثال على توظيف وحدة Wallarm AWS Terraform: حل الوكيل المتقدم

يستعرض هذا المثال كيفية توظيف Wallarm كوكيل مضمّن مع إعدادات متقدمة في سحابة خاصة افتراضية (VPC) موجودة لدى AWS باستخدام وحدة Terraform. يشبه كثيرًا [توظيف الوكيل البسيط](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) لكن مع عرض بعض خيارات تهيئة متقدمة مستخدمة بكثرة.

للبدء بسهولة مع هذا المثال، اطّلع أولًا على [مثال الوكيل البسيط](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy).

يوفر حل Wallarm الوكيل المتقدم (كما هو الحال مع الوكيل البسيط) طبقة شبكية وظيفية إضافية تعمل كموجه متقدم لحركة مرور HTTP مع وظائف أمان WAF وAPI.

## الخصائص الرئيسية

يختلف حل الوكيل المتقدم عن البسيط كما يلي:

* الحل لا ينشئ أي موازن حمولة (`lb_enabled=false`) لكنه لا يزال ينشئ مجموعة هدف يمكنك إلحاقها لاحقًا بموازن حمولة موجود.

    يمكن أن يساعد ذلك في التحول إلى نهج معالجة حركة المرور المتزامنة بسلاسة.
* يتم تحديد تهيئة NGINX وWallarm ليس فقط في المتغيرات القياسية ولكن أيضًا في قطع NGINX `global_snippet`، `http_snippet` و `server_snippet`.
* بمجرد انتهاء سكربت تهيئة عقدة Wallarm (cloud-init)، سيقوم السكربت `post-cloud-init.sh` المخصص بوضع صفحة الفهرس HTML المخصصة في دليل النسخة `/var/www/mysite/index.html`.
* يرتبط المكدس الموظف بسياسة AWS IAM الإضافية التي تمكن الوصول إلى AWS S3 للقراءة فقط.

    إذا استخدمت هذا المثال "كما هو"، فلن تكون هناك حاجة إلى الوصول المقدم. على الرغم من ذلك، يحتوي ملف `post-cloud-init.sh` على مثال غير نشط لطلب ملفات من AWS S3 والتي تتطلب عادةً وصولًا خاصًا. إذا قمت بتنشيط شفرة S3 من ملف `post-cloud-init.sh`، ستحتاج إلى تحديد سياسات وصول IAM الخاصة بـ AWS S3 في المتغير `extra_policies`.
* يسمح الحل بالاتصالات الواردة إلى عقد Wallarm من منفذ شبكة داخلي إضافي، 7777. وهذا ما يتم تهيئته مع المتغير `extra_ports` و`http_snippet.conf`.

    للسماح بمنفذ 7777 لـ `0.0.0.0/0`، يمكنك استخدام المتغير `extra_public_ports` إضافيًا (اختياريًا).
* عقدة Wallarm تعالج حركة المرور في وضع الحظر.

## هيكل الحل

![مخطط وكيل Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

لحل وكيل Wallarm المتقدم مكونات كما يلي:

* مجموعة هدف ملحقة بمجموعة توسعة تلقائية بدون موازن حمولة.
* نسخ عقد Wallarm التي تحلل حركة المرور، تحظر الطلبات الخبيثة وتنقل الطلبات المشروعة إلى ما بعدها.

    يعمل المثال بتشغيل عقد Wallarm في وضع الحظر الذي يوجه السلوك الموصوف. يمكن لعقد Wallarm أيضًا التشغيل في أوضاع أخرى تهدف فقط إلى مراقبة حركة المرور دون حظر الطلبات الخبيثة. لمعرفة المزيد عن أوضاع عقدة Wallarm، استخدم [التوثيق الخاص بنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* تعمل عقد Wallarm كوكيل لحركة المرور إلى `https://httpbin.org`.

    خلال إطلاق هذا المثال، ستتمكن من تحديد نطاق خدمة أو مسار آخر متاح من AWS Virtual Private Cloud (VPC) لتوجيه حركة المرور إليه.

سيتم توظيف جميع المكونات المذكورة (باستثناء الخادم الموكل إليه) بواسطة وحدة `wallarm` المقدمة.

## مكونات الشفرة

يحتوي هذا المثال على المكونات الشفرة التالية:

* `main.tf`: التهيئة الرئيسية لوحدة `wallarm` التي سيتم توظيفها كحل وكيل متقدم.
* `global_snippet.conf`: مثال على تهيئة NGINX المخصصة التي ستُضاف إلى تهيئة NGINX العالمية باستخدام المتغير `global_snippet`. قد تتضمن التهيئة المركبة توجيهات مثل `load_module`، `stream`، `mail` أو `env`.
* `http_snippet.conf`: تهيئة NGINX المخصصة لإضافتها إلى سياق `http` في NGINX باستخدام المتغير `http_snippet`. قد تتضمن التهيئة المركبة توجيهات مثل `map` أو `server`.
* `server_snippet.conf`: تهيئة NGINX المخصصة لإضافتها إلى سياق `server` في NGINX باستخدام المتغير `server_snippet`. قد تستحدث تهيئة القطع هذه منطق `if` في NGINX والإعدادات `location` المطلوبة.

    سيتم تطبيق هذه التهيئة على منفذ 80 فقط. لفتح منفذ آخر، حدد توجيه `server` الموافق في `http_snippet`.

    في ملف `server_snippet.conf`، ستجد أيضًا مثالًا على تهيئة أكثر تعقيدًا.
* `post-cloud-init.sh`: السكربت المخصص الذي يضع صفحة الفهرس HTML المخصصة في دليل النسخة `/var/www/mysite/index.html`. سيتم تنفيذ السكربت بعد تهيئة عقدة Wallarm (سكربت cloud-init).

    في ملف `post-cloud-init.sh`، ستجد أيضًا أوامر المثال لوضع محتوى AWS S3 في دليل النسخة. إذا استخدمت هذا الخيار، لا تنسى تحديد سياسة وصول S3 في المتغير `extra_policies`.

## تشغيل مثال حل وكيل Wallarm AWS

1. سجّل للحصول على وحدة التحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح وحدة التحكم Wallarm → **العقد** وأنشئ عقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المُنشأ.
1. انسخ مستودع الشفرة الذي يحتوي على مثال الشفرة إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. حدد قيم المتغيرات في خيارات `default` في ملف `examples/advanced/variables.tf` للمستودع المنسوخ واحفظ التغييرات.
1. حدد بروتوكول وعنوان الخادم الموكل إليه في `examples/advanced/main.tf` → `proxy_pass`.

    بشكل افتراضي، سيعمل Wallarm كوكيل لحركة المرور إلى `https://httpbin.org`. إذا كانت القيمة الافتراضية تلبي احتياجاتك، اتركها كما هي.
1. نوظّف المكدس بتنفيذ الأوامر التالية من دليل `examples/advanced`:

    ```
    terraform init
    terraform apply
    ```

لإزالة البيئة الموظفة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [إرفاق موازن حمولة AWS بمجموعة توسعة تلقائية](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)
* [AWS VPC مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [التوثيق الخاص بـ Wallarm](https://docs.wallarm.com)