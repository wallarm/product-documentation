# أمثلة على تطبيقات Wallarm AWS Terraform: حل البروكسي من البداية 

في هذا النموذج، نعرض كيفية استخدام Terraform لتوزيع Wallarm كبروكسي داخلي في القارئ الخصوصي الافتراضي (Virtual Private Cloud - VPC) لأمازون. على عكس أمثلة توزيع البروكسي [العادية](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) أو [المتقدمة](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)، تتضمن إعدادات هذا النموذج إنشاء موارد VPC مباشرة أثناء التوزيع باستخدام [وحدة AWS VPC ](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) Terraform, لذا نطلق على هذا النموذج "حل البروكسي من البداية".

الخيارات التالية للتوزيع هي **الموصى بها**:

* إذا لم تكن الشبكات الفرعية، وNAT، وجدول التوجيه، وغيرها من موارد VPC، تم تعيينها. في هذا النموذج من التوزيع، سنبدأ [وحدة AWS VPC وTerraform](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) مع Wallarm لإنشاء موارد VPC والدمج مع Wallarm.
* إذا كنت ترغب في معرفة كيف يتم دمج وحدة Wallarm مع AWS VPC وكيف يمكن إعداد الموارد VPC المطلوبة لهذا الدمج ومتغيرات الوحدة.

## الخصائص الرئيسية

* يعالج Wallarm المرور في وضع التزامن دون تقييد الميزات `Wallarm`(`preset=proxy`).
* يتم توزيع حل Wallarm بشكل طبقة شبكة مستقلة يمكن التحكم فيها بشكل مستقل عن الطبقات الأخرى وتركيبها في معظم مواقع هيكل الشبكة، بحيث يتم تقديم الطبقة. المكان الموصى به هو خلف تحميل البالانسر المتوافق مع الإنترنت.
* لا يحتاج هذا الحل إلى تعيين وظائف DNS وSSL.
* ينشئ موارد VPC ويدمج Wallarm مع البروكسي المضمن المنشأ في VPC بشكل أوتوماتيكي. ومع ذلك، في أمثلة البروكسي العادية، تكون موارد VPC موجودة وتحتاج إلى طلب معرفاتها.
* الكمية اللازمة لتنفيذ هذا النموذج هي 'token' التي تحتوي على رمز العقدة `Wallarm`.

## بنية الحل

![نظام Wallarm بروكسي](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

يحتوي الحل في هذا النموذج على نفس الهيكلية التي في [البروكسي المقترح للحل](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy):

* يتم توزيع العديد من مورد AWS VPC، بما في ذلك الشبكات الفرعية، NAT، جداول التوجيه، EIP، وغيرها بشكل أوتوماتيكي عن طريق الوحدة [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) خلال بداية هذا النموذج. لا يتم عرض العناصر في مخططات مستوى المحاكاة المقترحة.
* حمل التطبيق الشامل الذي يجمع الحركة إلى وحدات نموذجية `Wallarm`. يتم توزيع هذا المكون من خلال وحدة النموذج `wallarm` المقترحة.
* وحدات نموذجية `Wallarm` تحلل الحركة وتقوم بتمرير جميع الطلبات بشكل أوتوماتيكي. على المخطط، تسمى العناصر المقابلة لها بالتحكم في الوحدة النموذجية بهذه الطريقة. يتم توزيع هذا المكون بواسطة الوحدة `wallarm` المقترحة.

	في هذا النموذج، تعمل وحدة `Wallarm` في وضع المراقبة لتوجيه السلوك الموصوف. يمكن تشغيل وحدة `Wallarm` في وضعيات أخرى، بما في ذلك تلك الموجهة لقطع الطلبات الخبيثة وتمرير الطلبات الذاتية فقط. يمكن العثور على تفاصيل وضع الوحدة النموذجية `Wallarm` في [مستندات `Wallarm`](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* الخدمة التي تقوم بتمرير الطلبات من الوحدات النموذجية `Wallarm`. يمكن أن يكون أي نوع من الخدمة، مثل:
  
    * تطبيق AWS API Gateway المتصل بـ VPC عبر نقطة النهاية لـ VPC (يتم تغطية تركيبTerraform الذي يتوافق مع المثال العادي لـ API Gateway في [نموذج ال API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * عقدة EKS في عامل EKS (في هذه الحالة، يُفضل تعيين الرافعة الداخلية أو خدمة NodePort)
    * أي خدمة خلفية أخرى

	بشكل افتراضي، تقوم وحدة النموذج `Wallarm` بتمرير الحركة إلى `https://httpbin.org`. يمكن تحديد أي نطاق أو مسار خدمة آخر يمكن الوصول إليه من AWS VPC بشكل أوتوماتيكي خلال بداية هذا النموذج كجهة توجيه لتمرير الحركة.

## مكونات الرمز

تحتوي هذا النموذج على ملف تركيب `main.tf` الفريد الذي يحتوي على إعدادات الوحدة التالية:

* إعدادات وحدة [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) لإنشاء موارد AWS VPS.
* وحدة `Wallarm` مع إعدادات Wallarm لتوزيع كحل بروكسي ينشأ AWS ALB ووحدات النموذجية Wallarm.

## متطلبات

* تحتاج [ تركيب تيرافورم محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli) على 1.0.5 أو أعلى.
* وجود حساب به وصول إلى الدور **الإداري** على وحدة تحكم `Wallarm`. [EU Cloud](https://my.wallarm.com/) أو [US Cloud](https://us1.my.wallarm.com/)
* لا توجد حواجز تقيد الوصول إلى `https://api.wallarm.com` إذا كنت تستخدم Wallarm Cloud في الاتحاد الأوروبي و `https://us1.api.wallarm.com` إذا كنت تستخدم Wallarm Cloud في الولايات المتحدة.

## تنفيذ نموذج Wallarm AWS بروكسي

1. أنت تحتاج إلى الاشتراك في وحدة تحكم `Wallarm` على [EU Cloud](https://my.wallarm.com/nodes) أو [US Cloud](https://us1.my.wallarm.com/nodes).
1. افتح Wallarm Console → **Nodes** واصنع وحدة نموذجية من النوع **Wallarm node**.
1. انسخ الرمز المنتج للوحدة النموذجية التي تم إنشاؤها.
1. انسخ المستودع الذي يحتوي على رمز 'git clone https://github.com/wallarm/terraform-aws-wallarm.git` 
1. عين قيمة المتغيرات `default` في ملف `examples/from-scratch/variables.tf` في المستودع المُنسخ، واحفظ التغييرات.
1. قم بتنفيذ الأوامر التالية من الدليل `examples/from-scratch` لتوزيع الأسلوب:

    ```
    terraform init
    terraform apply
    ```

أما لإزالة بيئة التوزيع، يمكن استخدام الأمر التالي：

```
terraform destroy
```

## مراجع

* [توثيق Wallarm](https://docs.wallarm.com)
* [وحدة Terraform التي تنشئ موارد VPC على AWS](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)
* [القارئ الخصوصي الافتراضي (VPC) لـ  AWS مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)