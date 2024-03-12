# نشر Wallarm كبروكسي لـ Amazon API Gateway

هذا المثال يوضح كيفية حماية [Amazon API Gateway](https://aws.amazon.com/api-gateway/) بإستخدام Wallarm، الذي يُنشر كبروكسي داخلي إلى AWS الشبكة الخاصة الافتراضية (VPC) باستخدام [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

يوفر حل بروكسي Wallarm طبقة شبكة وظيفية إضافية تعمل كموجه لحركة الـ HTTP المتقدمة مع وظائف الأمان لـ WAF وAPI. يمكنه توجيه الطلبات إلى تقريباً أي نوع خدمة بما في ذلك Amazon API Gateway دون تقييد قدراته.

## حالات الإستخدام

من بين كل [خيارات نشر Wallarm المدعومة](https://docs.wallarm.com/installation/supported-deployment-options)، يُوصى بوحدة Terraform لنشر Wallarm على AWS VPC في هذه **حالات الإستخدام**:

* بنيتك التحتية الحالية متواجدة على AWS.
* أنت تستفيد من ممارسة البنية التحتية ككود (IaC). تسمح وحدة Terraform الخاصة بـ Wallarm بإدارة وتوفير عقدة Wallarm على AWS بشكل آلي، مما يعزز الكفاءة والاتساق.

## الشروط

* Terraform 1.0.5 أو أعلى [مُثبت محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **المدير** [role](https://docs.wallarm.com/user-guides/settings/users/#user-roles) في واجهة Wallarm في السحابة الأوروبية أو الأمريكية [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)
* الوصول إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأوروبية. يرجى التأكد من أن الوصول ليس محظورًا بواسطة جدار حماية

## هيكل الحل

![مخطط بروكسي Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

حل بروكسي Wallarm المثال له المكونات التالية:

* موزع الحمل المواجه للإنترنت يوجه حركة المرور إلى عقد Wallarm.
* عقد Wallarm التي تحلل الحركة وتحيل أي طلبات إلى API Gateway.

    يتم تشغيل عقد Wallarm في هذا المثال في وضع المراقبة مما يقود السلوك الموصوف. يمكن لعقد Wallarm أيضاً أن تعمل في أوضاع أخرى بما في ذلك تلك التي تهدف إلى حظر الطلبات الضارة وإعادة توجيه تلك المشروعة فقط. لمعرفة المزيد عن أوضاع عقد Wallarm، استخدم [وثائقنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* API Gateway التي تقوم عقد Wallarm بتحويل الطلبات إليها. يتمتع API Gateway بالإعدادات التالية:

    * تم تعيين مسار `/demo/demo`.
    * تم تكوين وهمية واحدة.
    * أثناء نشر وحدة Terraform هذه، يمكنك اختيار نوع نهاية "إقليمية" أو "خاصة" [endpoint type for the API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html). يتم تقديم مزيد من التفاصيل حول هذه الأنواع والترحيل بينهما أدناه.

    يرجى ملاحظة أن المثال المقدم ينشر Amazon API Gateway منتظم، لذا فإن عمليته لن تتأثر بعقد Wallarm.

جميع المكونات المدرجة بما في ذلك API Gateway سيتم نشرها بواسطة وحدة `wallarm` المقدمة.

## مكونات الكود

يحتوي هذا المثال على المكونات الكودية التالية:

* `main.tf`: التكوين الرئيسي لوحدة `wallarm` التي سيتم نشرها كحل بروكسي. ينتج التكوين AWS ALB وعقد Wallarm.
* `apigw.tf`: التكوين الذي ينتج Amazon API Gateway القابل للوصول تحت مسار `/demo/demo` مع تكامل وهمية واحدة مُكون. أثناء نشر الوحدة النمطية، يمكنك أيضاً اختيار نوع نهاية "إقليمية" أو "خاصة" (راجع التفاصيل أدناه).
* `endpoint.tf`: تكوين نهاية VPC AWS لنوع "خاص" من نهاية API Gateway.

## الفرق بين نهايات API Gateway "الإقليمية" و"الخاصة"

المتغير `apigw_private` يحدد نوع نهاية API Gateway:

* مع الخيار "الإقليمي"، ستقدم عقد Wallarm الطلبات إلى خدمة [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) المتاح للجمهور.
* مع الخيار "الخاص" - إلى نقاط نهاية AWS VPC المرفقة بخدمة `execute-api`. **لنشر الإنتاج، الخيار "الخاص" هو الأوصى به.**

### المزيد من الخيارات لتقييد الوصول إلى API Gateway

تمكن Amazon أيضًا من تقييد الوصول إلى API Gateway الخاص بك بغض النظر عن نوع نهاية "الخاصة" أو "الإقليمية" كما يلي:

* باستخدام [سياسات الموارد](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) مع أي من نوعي النهايتين المحددين.
* إدارة الوصول بواسطة [عناوين IP المصدر](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)، إذا كان نوع النهاية "خاص".
* إدارة الوصول بواسطة [VPC و/أو النهاية](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)، إذا كان نوع النهاية "خاص" والذي يفترض بالفعل أن API Gateway غير متاح من الشبكات العامة.

### الترحيل بين أنواع نهايات API Gateway

يمكنك تغيير نوع نهاية API Gateway دون إعادة إنشاء المكون ولكن يرجى مراعاة ما يلي:

* بمجرد تغيير النوع من "إقليمي" إلى "خاص"، ستصبح النهايات العامة خاصة وبالتالي غير متاحة من الموارد العامة. ينطبق ذلك على نهايات `execute-api` وأسماء النطاقات.
* بمجرد تغيير النوع من "خاص" إلى "إقليمي"، سيتم فصل نقاط نهاية AWS VPC المستهدفة إلى API Gateway على الفور وسيصبح API Gateway غير متاح.
* نظرًا لأن NGINX من الإصدار المجتمعي لا يمكنه اكتشاف تغييرات اسم DNS تلقائيًا، يجب أن يتبع تغيير نوع النهاية إعادة تشغيل NGINX يدويًا على عقد Wallarm.

    يمكنك إعادة تشغيل العقد، إعادة إنشائها أو تشغيل `nginx -s reload` في كل عقدة.

إذا كنت تغير نوع النهاية من "إقليمي" إلى "خاص":

1. أنشئ نهاية VPC AWS وربطها بـ `execute-api`. ستجد المثال في ملف التكوين `endpoint.tf`.
1. قم بتبديل نوع نهاية API Gateway وحدد نهاية VPC AWS في تكوين API Gateway. بمجرد الانتهاء، سيتوقف تدفق الحركة.
1. تشغيل `nginx -s reload` في كل عقدة Wallarm أو إعادة إنشاء كل عقدة Wallarm. بمجرد الانتهاء، سيتم استعادة تدفق الحركة.

لا يُوصى بتغيير نوع النهاية من "خاص" إلى "إقليمي" ولكن إذا فعلت:

1. قم بإزالة النهاية المطلوبة للعمل في الوضع "الخاص" وبعد ذلك فقط، قم بتبديل نهاية API Gateway إلى "إقليمي".
1. تشغيل `nginx -s reload` في كل عقدة Wallarm أو إعادة إنشاء كل عقدة Wallarm. بمجرد الانتهاء، سيتم استعادة تدفق الحركة.

**للإنتاج، يُوصى بتغيير API Gateway الخاص بك إلى "خاص"**، وإلا فإن حركة المرور من عقد Wallarm إلى API Gateway ستمر عبر الشبكة العامة ويمكن أن تنتج رسومًا إضافية.

## تشغيل مثال حل Wallarm AWS البروكسي لـ API Gateway

1. قم بالتسجيل للوصول إلى واجهة Wallarm في [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح واجهة Wallarm → **العقد** وأنشئ العقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المُولد.
1. انسخ مستودع الكود المحتوي على المثال إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. حدد قيم المتغيرات في الخيارات `default` في ملف `examples/apigateway/variables.tf` بالمستودع المنسوخ واحفظ التغييرات.
1. نشر الحزمة بتنفيذ الأوامر التالية من داخل الدليل `examples/apigateway`:

    ```
    terraform init
    terraform apply
    ```

لإزالة البيئة المنشورة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [AWS VPC مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway الواجهات الخاصة](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [سياسات API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [أمثلة على سياسات API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [أنواع API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)