# نشر Wallarm كوكيل لبوابة API الخاصة بأمازون

هذا المثال يوضح كيفية حماية [بوابة API الخاصة بأمازون](https://aws.amazon.com/api-gateway/) باستخدام Wallarm مُنشر كوكيل داخلي في الشبكة الخاصة الافتراضية لـ AWS باستخدام [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

حل Wallarm كوكيل يوفر طبقة شبكية وظيفية إضافية تعمل كموجه متقدم لحركة مرور HTTP مع وظائف أمان WAF وAPI. يمكنه توجيه الطلبات إلى معظم أنواع الخدمات بما في ذلك بوابة API الخاصة بأمازون دون تقييد قدراتها.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](https://docs.wallarm.com/installation/supported-deployment-options)، يُوصى باستخدام وحدة Terraform لنشر Wallarm على الشبكة الخاصة الافتراضية لـ AWS في هذه **حالات الاستخدام**:

* بنيتك التحتية القائمة على AWS.
* تستخدم ممارسة البنية التحتية ككود (IaC). تتيح وحدة Terraform الخاصة بـ Wallarm إدارة وتوفير عقدة Wallarm على AWS تلقائيًا، مما يعزز الكفاءة والاتساق.

## المتطلبات

* Terraform 1.0.5 أو أعلى [مُثبت محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب مع دور **المسؤول** [role](https://docs.wallarm.com/user-guides/settings/users/#user-roles) في وحدة تحكم Wallarm في السحابة الأمريكية أو الأوروبية [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)
* الوصول إلى `https://us1.api.wallarm.com` عند العمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` عند العمل مع سحابة Wallarm الأوروبية. الرجاء التأكد من عدم حظر الوصول بواسطة جدار الحماية

## هندسة الحل

![مخطط وكيل Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

حل وكيل Wallarm في هذا المثال يتضمن المكونات التالية:

* موازن التحميل الذي يواجه الإنترنت يوجه الحركة إلى عقد Wallarm.
* عقد Wallarm تحلل الحركة وتوكل أي طلبات إلى بوابة API.

    يعمل هذا المثال بعقد Wallarm في وضع المراقبة الذي يحرك السلوك الموصوف. يمكن لعقد Wallarm أيضًا العمل في أوضاع أخرى تهدف إلى حظر الطلبات الخبيثة وإعادة توجيه الطلبات المشروعة فقط. لمعرفة المزيد عن أوضاع عقد Wallarm، استخدم [وثائقنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* بوابة API التي توكل لها عقد Wallarm الطلبات لديها الإعدادات التالية:

    * تم تعيين المسار `/demo/demo`.
    * تكوين واحد وهمي.
    * خلال نشر وحدة Terraform هذه، يمكنك اختيار نوع النقطة النهائية لبوابة API "الإقليمية" أو "الخاصة". يتم توفير المزيد من التفاصيل حول هذه الأنواع والتحول بينها أدناه.

    يرجى ملاحظة أن المثال المقدم ينشر بوابة API الخاصة بأمازون العادية، لذا لن يتأثر تشغيلها بعقد Wallarm.

سيتم نشر جميع المكونات المذكورة بما في ذلك بوابة API بواسطة وحدة `wallarm` المثال المقدمة.

## مكونات الكود

يحتوي هذا المثال على المكونات البرمجية التالية:

* `main.tf`: التكوين الرئيسي لوحدة `wallarm` المطلوب تنفيذها كحل وكيل. التكوين ينتج AWS ALB وعقد Wallarm.
* `apigw.tf`: التكوين الذي ينتج بوابة API الخاصة بأمازون التي يمكن الوصول إليها تحت المسار `/demo/demo` مع تكوين تكامل وهمي واحد. أثناء نشر الوحدة، يمكنك أيضًا اختيار نوع النقطة النهائية "الإقليمية" أو "الخاصة" (انظر التفاصيل أدناه).
* `endpoint.tf`: تكوين نقطة النهاية الخاصة بـ AWS VPC لنوع النقطة النهائية "الخاصة" لبوابة API.

## الفرق بين نقاط النهاية الإقليمية والخاصة لبوابة API

تحدد المتغير `apigw_private` نوع نقطة النهاية لبوابة API:

* مع خيار "الإقليمية"، سترسل عقد Wallarm طلبات إلى خدمة بوابة API المتاحة للجمهور `execute-api`.
* مع الخيار "الخاص" - إلى نقاط النهاية في AWS VPC المرفقة بخدمة `execute-api`. **لنشر الإنتاج، يُوصى بالخيار "الخاص".**

### المزيد من الخيارات لتقييد الوصول إلى بوابة API

تمكنك أمازون أيضًا من تقييد الوصول إلى بوابتك API بغض النظر عن نوع نقطة النهاية "الخاصة" أو "الإقليمية" على النحو التالي:

* باستخدام [سياسات الموارد](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) مع أي من نوعي النقاط النهائية المحددين.
* إدارة الوصول بواسطة [عناوين IPs المصدر](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)، إذا كان نوع النقطة النهائية "خاص".
* إدارة الوصول بواسطة [VPC و/أو نقطة النهاية](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)، إذا كان نوع النقطة النهائية "خاص" والذي يفترض بالفعل أن بوابة API غير متاحة من الشبكات العامة بتصميمها.

### التحول بين أنواع نقاط النهاية لبوابة API

يمكنك تغيير نوع نقطة النهاية لبوابة API دون إعادة إنشاء المكون ولكن يرجى مراعاة الآتي:

* عند تغيير النوع من "إقليمية" إلى "خاصة"، ستصبح النقاط النهائية العامة خاصة وبالتالي غير متاحة من الموارد العامة. ينطبق هذا على كل من نقاط النهاية `execute-api` وأسماء النطاقات.
* عند تغيير النوع من "خاص" إلى "إقليمية"، سيتم فصل نقاط نهاية AWS VPC المستهدفة لبوابة API الخاصة بك فورًا وستصبح بوابة API غير متاحة.
* بما أن NGINX للإصدار المجتمعي لا يمكنه الكشف تلقائيًا عن تغييرات اسم DNS، يجب أن يتبع تغيير نوع النقطة النهائية إعادة تشغيل يدوية لـ NGINX على عقد Wallarm.

    يمكنك إعادة التشغيل، إعادة إنشاء العقد أو تنفيذ `nginx -s reload` في كل عقدة.

إذا كنت تغير نوع النقطة النهائية من "إقليمية" إلى "خاصة":

1. إنشاء نقطة نهاية AWS VPC وإرفاقها بـ `execute-api`. ستجد المثال في ملف التكوين `endpoint.tf`.
1. تحويل نوع نقطة النهاية لبوابة API وتحديد نقطة نهاية AWS VPC في تكوين بوابة API. بمجرد الانتهاء، سيتوقف تدفق الحركة.
1. تشغيل `nginx -s reload` في كل عقدة Wallarm أو مجرد إعادة إنشاء كل عقدة Wallarm. بمجرد اكتماله، سيتم استعادة تدفق الحركة.

لا يُوصى بتغيير نوع النقطة النهائية من "خاصة" إلى "إقليمية" ولكن إذا فعلت:

1. إزالة نقطة النهاية المطلوبة للتشغيل في وضع "الخاص" ثم فقط تحويل نقطة النهائية لبوابة API إلى "إقليمية".
1. تشغيل `nginx -s reload` في كل عقدة Wallarm أو مجرد إعادة إنشاء كل عقدة Wallarm. بمجرد الانتهاء من ذلك، سيتم استعادة تدفق الحركة.

**للإنتاج، يُوصى بتغيير بوابة API الخاصة بك إلى "خاصة"**، وإلا سيتم تمرير حركة مرور من عقد Wallarm إلى بوابة API عبر الشبكة العامة وقد ينتج عن ذلك رسوم إضافية.

## تشغيل مثال حل وكيل Wallarm AWS لبوابة API

1. سجل للحصول على وحدة تحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح وحدة تحكم Wallarm → **العقد** وأنشئ العقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المُنشأ.
1. انسخ مستودع الكود الذي يحتوي على مثال الكود إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. اضبط قيم المتغيرات في الخيارات `الافتراضية` في ملف `examples/apigateway/variables.tf` للمستودع المنسوخ واحفظ التغييرات.
1. نفذ تشغيل الرزمة بتنفيذ الأوامر التالية من دليل `examples/apigateway`:

    ```
    terraform init
    terraform apply
    ```

لإزالة البيئة المنشورة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [AWS VPC مع الشبكات الفرعية العامة والخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway الخاص](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [سياسات API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [أمثلة على سياسات API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [أنواع API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)