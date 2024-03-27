# تثبيت Wallarm كبروكسي لـ Amazon API Gateway

في هذا المثال، يُظهر لك كيفية استخدام [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/) لتثبيت Wallarm كبروكسي مضمن في AWS Virtual Private Cloud (VPC) وحماية [Amazon API Gateway](https://aws.amazon.com/api-gateway/). 

توفر حلول بروكسي Wallarm طبقة شبكة إضافية تعمل كموجه مرور HTTP متقدم مزود بوظائف WAF وأمان API. يمكنها توجيه الطلبات إلى معظم أنواع الخدمات بما في ذلك Amazon API Gateway ، دون أي قيود على وظائفها.

## الخصائص الرئيسية

* تعالج Wallarm حركة المرور في الوضع المتزامن ، الذي يتيح تخفيف التهديدات فوراً دون تقييد وظائف Wallarm (`preset=proxy`).
* يتم تثبيت حل Wallarm كطبقة شبكة منفصلة يمكن التحكم فيها بشكل مستقل عن API Gateway.

## البنية التحتية للحل

![مخطط بروكسي Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

حل بروكسي Wallarm الموضح هنا يتضمن المكونات التالية:

* موزع حمولة تطبيق صالح للإنترنت يوجه حركة المرور إلى نسخة وحدة Wallarm.
* نسخة وحدة Wallarm تحلل حركة المرور وتعمل كبروكسي لكل الطلبات المتجهة إلى البوابة البرمجية.

    في هذا المثال، تعمل نسخة وحدة Wallarm في الوضع المراقب الذي يتناول السلوك المطلوب. يمكن لنسخة وحدة Wallarm أيضاً العمل في أوضاع أخرى تهدف إلى حظر الطلبات الضارة وتمرير الطلبات الشرعية فقط. لمزيد من التفاصيل عن أوضاع وحدة Wallarm، يمكنك الرجوع إلى [توثيق](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* بوابة برمجية يعمل عليها بروكسي وحدة Wallarm. تشمل البوابة البرمجية الإعدادات التالية:

    * تم تعيين المسار `/demo/demo` لها.
    * تم تعيين الدمج الواحد لها.
    * أثناء تثبيت الوحدة المكملة لـ Terraform، يمكنك اختيار النوع "الإقليمي" أو "الخاص" لنقاط نهاية [البوابة البرمجية](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html). يتم تقديم تفاصيل عن هذه الأنواع والتحول بينهما أدناه.

    يرجى ملاحظة أن الأمثلة المقدمة للبوابة البرمجية بشكل عام لا تتأثر بعمل البوابة البرمجية لوحدة Wallarm.

يتم نشر جميع المكونات المذكورة بواسطة وحدة `wallarm` المثال المقدمة.

## مكونات الكود

هذا المثال يحتوي على مكونات الكود التالية:

* `main.tf`: الإعداد الرئيسي لوحدة 'wallarm' التي يتم تثبيتها كحل بروكسي. تولد الإعدادات AWS ALB ونسخة وحدة Wallarm.
* `apigw.tf`: إعداد يولد بوابة برمجية من Amazon يمكن الوصول إليها عبر المسار `/demo/demo`. تم تعيين الدمج الواحد. يمكنك أيضاً اختيار النوع "الإقليمي" أو "الخاص" لنقاط النهاية خلال تثبيت الوحدة المكملة (انظر التفاصيل أدناه).
* `endpoint.tf`: إعدادات نقاط نهاية AWS VPC. هذا هو نقطة النهاية 'الخاصة' لخدمة البوابة البرمجية.

## الفرق بين نقاط نهاية البوابة البرمجية 'الإقليمية' و 'الخاصة'

تحدد المتغير `apigw_private` نوع نقاط النهاية للبوابة البرمجية:

* مع الخيار "الإقليمي"، ترسل نسخة وحدة Wallarm الطلبات إلى خدمة [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) للبوابة البرمجية المتاحة علنيا.
* مع الخيار "الخاص", ترسل الطلبات إلى نقاط النهاية لـ AWS VPC المتصلة بخدمة 'execute-api'. ** يوصى باستخدام الخيار "الخاص" في التثبيتات المنتجة.**

### خيارات أخرى للحد من الوصول إلى البوابة البرمجية

يمكن في Amazon تقييد الوصول إلى البوابة البرمجية غضاء عن نوع نقاط النهاية 'الخصوصية' أو 'الإقليمية' كالتالي:

* استخدام [سياسات الموارد](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) لتحديد أي نوعين من نقاط النهاية.
* إذا كان نوع النقاط النهاية 'private' يمكنك إدارة الوصول عبر [IP المصدر](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html).
* إذا كان نوع نقاط النهاية 'private' ومن المتوقع أن لا يكون API Gateway متاحاً بشكل عام، يمكنك إدارة الوصول عبر [VPC و/أو نقاط النهاية](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html).

### الانتقال بين نقاط النهاية للبوابة البرمجية

يمكنك تغيير نوع نقاط النهاية للبوابة البرمجية دون إعادة إنشاء المكونات ولكن يرجى النظر في ما يلي:

* عند التغيير من "الإقليمي" إلى "الخاص", سيصبح نقاط النهاية العامة خاصه وبالتالي لن يتمكنوا من الوصول للموارد العامة. هذا ينطبق على كل من نقاط النهايه 'execute-api' واسم النطاق.
* عند التغيير من "الخاص" إلى "الإقليمي"، سيتم فصل نقطة النهاية لـ AWS VPC المرتبطة ب بوابتك البرمجية مباشرة، وبالتالي لن تكون البوابة البرمجية متاحة.
* نسخة NGINX للمجتمع لا تستطيع الكشف تلقائياً عن تغيير اسم DNS، لذا يجب أن يتبع تغيير نوع نقاط النهاية إعادة تشغيل NGINX يدوياً في نسخ الوحدات لـ Wallarm.

    يمكنك إعادة تشغيل النسخ أو إعادة إنشائها أو تنفيذ `nginx -s reload` في كل نسخة.

التالي هو الإجراء لتغيير نوع نقاط النهاية من 'إقليمي' إلى 'خاص':

1. أنشئ نقطة النهاية لـ AWS VPC وقم بالاتصال بها في 'execute-api'. توجد أمثلة في ملف الإعداد 'endpoint.tf'.
1. انقل نوع نقاط النهاية للبوابة البرمجية وحدد نقاط النهاية لـ AWS VPC في إعدادات البوابة البرمجية. بمجرد الانتهاء، سيتوقف تدفق حركة المرور.
1. أعد تشغيل NGINX أو ببساطة أعد إنشاء كل نسخة لـ Wallarm. بمجرد الانتهاء تعود حركة المرور إلى العمل.

ليس من النصائح تغيير نوع نقاط النهاية من "خاص" إلى "إقليمي"، ولكن إذا قمت بذلك:

1. قم بحذف نقاط النهاية التي تحتاجها في الوضع "الخاص" الذي تعمل به ، ثم حول نوع نقاط النهاية لبوابة API إلى "إقليمي".
1. أعد تشغيل NGINX أو ببساطة أعد إنشاء كل نسخة لـ Wallarm. بمجرد الانتهاء تعود حركة المرور إلى العمل.

** ينصح في البيئة المتكاملة بتحويل البوابة البرمجية إلى الوضع "الخاص". إذا لم تقم بذلك، سيتم إرسال حركة المرور من نسخة Wallarm إلى البوابة البرمجية عبر الشبكة العامة ، مما قد يتسبب في فرض رسوم إضافية. **

## متطلبات

* تركيب Terraform 1.0.5 أو أعلى على جهازك ([التنزيل من هنا](https://learn.hashicorp.com/tutorials/terraform/install-cli))
* الوصول إلى الحساب الذي لديه دور **المشرف** لـ Wallarm Console ([السحابة الأوروبية](https://my.wallarm.com/) أو [السحابة الأمريكية](https://us1.my.wallarm.com/))
* إذا كنت تعمل في سحابة Wallarm الأوروبية ، يجب أن يكون بإمكانك الوصول إلى `https://api.wallarm.com`؛ إذا كنت تعمل في سحابة Wallarm الأمريكية، يجب أن يكون بإمكانك الوصول إلى `https://us1.api.wallarm.com`. تأكد من أن جدار الحماية لا يحظر وصولك.

## مثال تشغيل حل Wallarm AWS بروكسي للبوابة البرمجية

1. قم بالتسجيل في Wallarm Console لـ[السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح Wallarm Console → **الوحدات** وأنشئ وحدة من نوع **نسخه وحدة Wallarm**.
1. انسخ الرمز المميز للوحدة التي تم إنشاؤها.
1. أنسخ المستودع الذي يحتوي على الكود المثال:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. قم بتعيين قيم المتغيرات في الخيارات الافتراضية لملف `examples/apigateway/variables.tf` في المستودع الذي تم نسخه، ثم احفظ التغييرات.
1. تنفيذ الأوامر التالية لتثبيت الكود من دليل `examples/apigateway`:

    ```
    terraform init
    terraform apply
    ```

لإزالة البيئة التي تم تثبيتها, استخدم الأمر التالي:

```
terraform destroy
```

## مراجع

* [AWS VPC مع الشبكات الفرعية العامة والخاصة (الترجمة الطبيعية)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [البوابة البرمجية الخاصة لـ API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [سياسات API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [أمثلة سياسات API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [أنواع API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)