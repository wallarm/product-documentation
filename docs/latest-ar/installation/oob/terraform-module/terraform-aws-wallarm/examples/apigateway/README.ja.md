# تنزيل Wallarm كوكيل لـ Amazon API Gateway

هذا المثال يوضح كيفية استخدام [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/) لتنزيل Wallarm كوكيل مضمّن في AWS Virtual Private Cloud (VPC) لحماية [Amazon API Gateway](https://aws.amazon.com/api-gateway/).

تقدم حلول البروكسي من Wallarm طبقة شبكة إضافية تعمل كموجه لحركة الHTTP المتقدمة مع ميزات WAF وأمان الAPI. يمكنها توجيه الطلبات إلى معظم أنواع الخدمات بما في ذلك Amazon API Gateway، دون أي قيود.

## الخصائص الرئيسية

* تقوم Wallarm بمعالجة حركة المرور في الوضع المتزامن الذي يتيح التخفيف الفوري للتهديدات دون تقييد ميزات Wallarm (`preset=proxy`).
* تتم تنزيل حلول Wallarm كطبقة شبكة منفصلة يمكن التحكم بها بشكل مستقل عن API Gateway.

## الهندسة المعمارية للحل

![Wallarm Proxy Scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

حل البروكسي المعروض من Wallarm يتضمن المكونات التالية:

* موازن تحميل تطبيقات يمكنه الوصول إلى الإنترنت لتوجيه الحركة إلى مثيلات العقدة Wallarm.
* مثيلات العقدة Wallarm التي تحلل الحركة وتعمل كوكيل لجميع الطلبات إلى بوابة الAPI.

    في هذا المثال، تعمل العقدة Wallarm في وضع المراقبة لمعالجة السلوك الموضح. يمكن أيضاً أن تعمل العقدة Wallarm في وضعيات أخرى تستهدف تصفية الطلبات الضارة وإعادة توجيه الطلبات الشرعية فقط. لمزيد من التفاصيل حول أوضاع العقدة Wallarm، يرجى الرجوع إلى [التوثيق](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* بوابة الAPI التي يعمل عليها الوكيل Wallarm Node. الإعدادات لبوابة الAPI هي:

    * مخصص الطريق `/demo/demo`.
    * الهزل المفرد معدّ.
    * خلال النشر باستخدام وحدة Terraform هذه، يمكنك اختيار نوع النقاط المؤقتة "الإقليمية" أو "الخاصة" لبوابة الAPI. يتم توفير التفاصيل حول هذه الأنواع والانتقال بينها أدناه.

    يرجى ملاحظة أن الأمثلة المقدمة التي تقوم بتنزيل Amazon API Gateway العادي لا تتأثر بعملية عقدة Wallarm.

تتم نشر جميع المكونات المذكورة بواسطة وحدة `wallarm` المثل المقدمة.

## مكونات الكود 

تتضمن هذا المثال المكونات التالية من الكود:

* `main.tf`: الإعداد الأساسي لوحدة `wallarm` التي تنزل كحل للبروكسي. يقوم الإعداد بإنشاء ALB AWS ومثيل Wallarm.
* `apigw.tf`: الإعدادات التي تنشئ Amazon API Gateway الذي يمكن الوصول إليه من الطريق `/demo/demo`. تم إعداد هزل مفرد. تستطيع أيضاً اختيار نوع النقاط المؤقتة "الإقليمية" أو "الخاصة" خلال تنفيذ الوحدة (أنظر التفاصيل أدناه).
* `endpoint.tf`: إعدادات AWS VPC Endpoint. على سبيل المثال، هو لنوع "خاص" من نقاط النهاية لبوابة الAPI.

## الفرق بين نقاط النهاية "الإقليمية" و"الخاصة" لبوابة الAPI 

المتغير `apigw_private` يحدد نوع نقطة النهاية لبوابة الAPI:

* مع الخيار "الإقليمية"، يرسل مثيل العقدة Wallarm طلبات إلى خدمة `execute-api` لبوابة الAPI المتاحة للجمهور.
* مع الخيار "الخاص"، يرسل طلبات إلى نقطة النهاية لـ AWS VPC التي تمت متصلة بخدمة `execute-api`. **يُوصى باستخدام الخيار "الخاص" في التنزيلات الإنتاجية.**

### الخيارات الأخرى لتحديد الوصول إلى بوابة الAPI

تقدم Amazon القدرة على تحديد الوصول إلى بوابة الAPI بغض النظر عن نوع النقطة المؤقتة "الخاصة" أو "الإقليمية"، كما يلي:

* بالاستفادة من الـ [سياسات الموارد](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)، يمكن تحديد أي من النوعين من نقاط النهاية.
* إذا كان نوع النقطة المؤقتة "خاص"، يمكن التحكم في الوصول بناءً على [البادئة المصدر](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html).
* إذا كانت نقطة النهاية من النوع "خاص"، ويُفترض أن بوابة الAPI ليست متاحة من الشبكة العامة بالتصميم، يمكن التحكم في الوصول بناءً على الـ [VPC و/أو النقاط المؤقتة](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html).

### الانتقال بين أنواع نقاط النهاية لـ API Gateway

يمكنك تغيير نوع نقطة النهاية لـ API Gateway بدون إعادة إنشاء المكونات، ولكن يجب أن تأخذ في الاعتبار العناصر التالية:

* عند تغيير النوع من "إقليمي" إلى "خاص"، يصبح النقطة المؤقتة العامة خاصة، وبالتالي ليست متاحة من الموارد العامة. هذا ينطبق على كلا من النقطة المؤقتة `execute-api` واسم النطاق.
* عند تغيير النوع من "خاص" إلى "إقليمي"، تتم فصل نقطة النهاية AWS VPC التي تستهدف بوابة الAPI الخاصة بك بشكل فوري، وبوابة الAPI تصبح غير متاحة.
* نظراً لأن نسخة المجتمع NGINX لا تستطيع تكتشف تغيير اسم DNS تلقائياً، يجب أن يتم نوع النقاط المؤقتة بعد إعادة تشغيل NGINX يدوياً في كل مثيل من مثيلات العقدة Wallarm.

    يمكنك إعادة تشغيل المثيلات، أو إعادة إنشائها، أو تنفيذ `nginx -s reload` في كل مثيل.

عندما تغيير نوع النقاط المؤقتة من "إقليمي" إلى "خاص":

1. أنشئ نقطة النهاية AWS VPC وقم بربطها بـ `execute-api`. يوجد مثال في ملف الإعدادات `endpoint.tf`.
1. قم بتبديل نوع نقطة النهاية لـ API Gateway وقم بتحديد نقطة النهاية AWS VPC في إعدادات بوابة الAPI. عند الانتهاء، ستتوقف حركة المرور.
1. قم بتنفيذ `nginx -s reload` في كل عقدة Wallarm أو ببساطة أعد إنشاء كل عقدة Wallarm. عند الانتهاء، ستعود حركة المرور.

ليس من المستحسن تغيير نوع نقاط النهاية من "خاص" إلى "إقليمي"، ولكن إذا كنت تريد القيام بذلك:

1. قم بحذف نقاط النهاية المطلوبة التي تديرها نفسك في الوضع "الخاص"، ثم قم بتغيير نوع نقطة النهاية لـ API Gateway إلى "إقليمي".
1. قم بتنفيذ `nginx -s reload` في كل عقدة Wallarm أو ببساطة أعد إنشاء كل عقدة Wallarm. عند الانتهاء، ستعود حركة المرور.

**في البيئة الإنتاجية، نوصي بتغيير نقطة النهاية لـ API Gateway إلى "خاص"**. إذا لم تقم بذلك، ستتم إرسال حركة المرور من عقدة Wallarm إلى بوابة الAPI عبر الشبكة العامة وقد تتحمل تكاليف إضافية.

## المتطلبات

* تثبيت Terraform 1.0.5 أو أعلى على الجهاز محلياً. ([تحميل من هنا](https://learn.hashicorp.com/tutorials/terraform/install-cli))
* وصول إلى حساب بدور "المدير" في Wallarm Console. ([السحابة الأوروبية](https://my.wallarm.com/) أو [السحابة الأمريكية](https://us1.my.wallarm.com/))
* إذا كنت تعمل في السحابة Wallarm الأوربية، القدرة على الوصول إلى `https://api.wallarm.com`. إذا كنت تعمل في سحابة Wallarm الأمريكية، القدرة على الوصول إلى  `https://us1.api.wallarm.com`. تأكد أن لا يتم حظر الوصول بواسطة الجدار الناري.

## مثال على تنفيذ حل بروكسي Wallarm AWS لـ API Gateway

1. سجل الدخول إلى Wallarm Console على [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح Wallarm Console → **وحدات** وأنشئ وحدة من نوع **وحدة Wallarm**.
1. انسخ الرمز المميز لوحدة التي تم إنشاؤها.
1. إنسخ مخزون الكود في الجهاز المحلي الذي يحتوي على الجملة:
   
    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. ضبط قيم المتغيرات في الخيارات الافتراضية ملف `variables.tf` فى مخزون الكود التي نُسِخت، ثم احفظ التغييرات.
1. نفّذ الأوامر التالية لاستند في الدليل `examples/apigateway` وشغّل المخدومات:
   
    ```
    terraform init
    terraform apply
    ```
لإزالة البيئة التي تم نشرها، استخدم الأمر التالي:

```
terraform destroy
```
## مراجع

* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway Private APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gateway Policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gateway Policies examples](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gateway Types](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)
