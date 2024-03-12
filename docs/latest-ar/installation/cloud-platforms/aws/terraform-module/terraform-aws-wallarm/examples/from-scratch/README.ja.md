# نموذج نشر عينة وحدة Wallarm AWS Terraform: حل Proxy من الصفر

في هذا المثال، نوضح كيفية نشر Wallarm كبروكسي داخلي في AWS Virtual Private Cloud (VPC) باستخدام وحدة Terraform. على عكس الأمثلة [العادية](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) أو [المتقدمة](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) لنشر البروكسي، يستخدم هذا المثال وحدة [AWS VPC Terraform](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) لإنشاء الموارد الخاصة بـ VPC مباشرة أثناء النشر. لذا، يُطلق على هذا المثال "حل Proxy من الصفر".

إليك الخيارات **الموصى بها** للنشر:

* في حالة عدم تكوين الشبكات الفرعية، NAT، جداول التوجيه، وموارد VPC الأخرى بالفعل. في هذا النشر، نبدأ وحدة AWS VPC Terraform مع وحدة Terraform الخاصة بـ Wallarm لإنشاء موارد VPC ودمجها مع Wallarm.
* إذا كنت ترغب في معرفة كيف تتكامل وحدة Wallarm مع AWS VPC وكيفية تكوين الموارد والمتغيرات المطلوبة لـ VPC.

## الميزات الرئيسية

* Wallarm يعالج حركة المرور في الوقت الفعلي (باستخدام `preset=proxy`) دون تقييد ميزات Wallarm، مما يمكن من التخفيف الفوري للتهديدات.
* يتم نشر حل Wallarm كطبقة شبكية مستقلة، قابلة للتحكم بشكل مستقل عن طبقات الشبكة الأخرى، مما يتيح وضع الطبقة في تقريبًا أي موقع هيكلي للشبكة. الموقع الموصى به هو خلف موازن الحمل الموجه للإنترنت.
* هذا الحل لا يتطلب تكوين DNS وSSL.
* يتم إنشاء موارد VPC ودمج البروكسي الداخلي لـ Wallarm في VPC المنشأ تلقائيًا، بينما في أمثلة البروكسي العادية، تكون موارد VPC موجودة مسبقًا وتتطلب تحديد المعرفات.
* العنصر الوحيد المطلوب لتشغيل هذا المثال هو `token` والذي يحتوي على رمز النود لـ Wallarm.

## هندسة الحل

![مخطط البروكسي Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

يتمتع هذا المثال بنفس هندسة [حل البروكسي العادي](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy):

* موارد AWS VPC مثل الشبكات الفرعية، NAT، جداول التوجيه، EIP وغيرها يتم نشرها تلقائيًا بواسطة وحدة [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) في بداية هذا المثال. لا يظهرون في الخطة المقدمة.
* موازن تحميل التطبيق الموجه للإنترنت الذي يوجه حركة المرور إلى نود Wallarm. يتم نشر هذا المكون بواسطة وحدة `wallarm` الخاصة بالمثال.
* نود Wallarm الذي يحلل حركة المرور ويعمل كبروكسي لجميع الطلبات. العناصر المقابلة في الخطة هي مثيلات EC2 A، B، C. يتم نشر هذا المكون بواسطة وحدة `wallarm` الخاصة بالمثال.

في المثال، يعمل نود Wallarm في وضع الرصد، مما يقود السلوك الموضح. يمكن تشغيل نود Wallarm في أوضاع أخرى، بما في ذلك تلك المصممة لحظر الطلبات الخبيثة وتمرير تلك المشروعة فقط. لمزيد من المعلومات حول أوضاع نود Wallarm، يرجى زيارة [وثائقنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* الخدمة التي يقوم نود Wallarm ببروكسي الطلبات إليها. يمكن أن تكون الخدمة من أي نوع. على سبيل المثال:
  
    * تطبيق AWS API Gateway المتصل بـ VPC عبر نقطة نهاية VPC (تغطي الوحدة النمطية لـ Terraform الخاصة بـ Wallarm المقابلة لنشر API Gateway في [مثال API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * عقد EKS العاملة في مجموعة EKS (في هذه الحالة، يوصى بتكوين Internal Load Balancer أو NodePort Service)
    * أي خدمة خلفية أخرى

بشكل افتراضي، يقوم نود Wallarm بتوجيه حركة المرور إلى `https://httpbin.org`. في بداية هذا المثال، يمكنك تحديد أي نطاق أو مسار خدمة آخر متاح من AWS Virtual Private Cloud (VPC) كوجهة لحركة المرور البروكسي.

## مكونات الكود

يحتوي هذا المثال على ملف تكوين `main.tf` الوحيد مع الإعدادات التالية:

* تكوين وحدة [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) لإنشاء موارد AWS VPS.
* إعدادات Wallarm لنشر حل البروكسي على أنه حل بروكسي يولد AWS ALB ومثيلات Wallarm.

## المتطلبات

* تثبيت Terraform 1.0.5 أو نسخة أعلى محليًا [على الجهاز](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى حساب بدور **المدير** في وحدة تحكم Wallarm، سواء في [السحابة الأوروبية](https://my.wallarm.com/) أو [السحابة الأمريكية](https://us1.my.wallarm.com/)
* وجود الوصول إلى `https://api.wallarm.com` إذا كنت تستخدم سحابة Wallarm في الاتحاد الأوروبي، أو `https://us1.api.wallarm.com` إذا كنت تستخدم سحابة Wallarm في الولايات المتحدة، مع التأكد من عدم حظر الوصول بواسطة جدار حماية.

## تنفيذ نموذج نشر حل البروكسي لـ Wallarm AWS

1. قم بالتسجيل في وحدة تحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح وحدة تحكم Wallarm → **النودات** وأنشئ نودًا من نوع **نود Wallarm**.
1. انسخ رمز النود المُنشأ.
1. قم بنسخ مستودع الكود للمثال إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. في ملف `variables.tf` داخل مجلد المثال المنسوخ `examples/from-scratch`، قم بضبط قيم المتغيرات في خيار `default` واحفظ التغييرات.
1. من داخل دليل `examples/from-scratch`، قم بتنفيذ الأوامر التالية لنشر الاستك:

    ```
    terraform init
    terraform apply
    ```

لحذف البيئة المنشورة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [وثائق Wallarm](https://docs.wallarm.com)
* [وحدة Terraform التي تنشئ موارد VPC على AWS](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)
* [AWS VPC بشبكات عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)