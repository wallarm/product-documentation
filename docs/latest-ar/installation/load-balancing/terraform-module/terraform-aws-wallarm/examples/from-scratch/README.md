# مثال على نشر وحدة Wallarm AWS Terraform: حل البروكسي من الصفر

يوضح هذا المثال كيفية نشر Wallarm كبروكسي داخلي لسحابة خاصة افتراضية (VPC) تابعة لـ AWS باستخدام وحدة Terraform. بعكس أمثلة نشر البروكسي [العادي](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) أو [المتقدم](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)، سيقوم تكوين هذا المثال بإنشاء موارد VPC مباشرةً خلال هذا النشر باستخدام [وحدة AWS VPC Terraform](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/). لذلك يُسمى هذا المثال بـ "حل البروكسي من الصفر".

هذه هي خيار النشر **الموصى به** إذا:

* لم يكن لديك شبكات فرعية، NATs، جداول التوجيه، وغيرها من موارد VPC مُعدة. يقوم مثال النشر هذا بتشغيل [وحدة AWS VPC Terraform](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) بالإضافة إلى وحدة Wallarm Terraform لإنشاء موارد VPC ودمج Wallarm معها.
* تريد تعلم كيفية دمج وحدة Wallarm مع AWS VPC، وموارد VPC والمتغيرات المطلوبة لهذا الدمج.

## الخصائص الرئيسية

* Wallarm يعالج الحركة في الوضع المتزامن الذي لا يقيد قدرات Wallarm ويتيح التخفيف الفوري من التهديدات (`preset=proxy`).
* يتم نشر حل Wallarm كطبقة شبكة منفصلة تمكنك من التحكم فيها بشكل مستقل عن الطبقات الأخرى ووضع الطبقة في موقع تقريبًا أي هيكل شبكي. الموقع الموصى به هو خلف موازن تحميل يواجه الإنترنت.
* هذا الحل لا يتطلب تكوين ميزات DNS و SSL.
* يقوم بإنشاء موارد VPC ويدمج تلقائيًا بروكسي Wallarm الداخلي إلى VPC المُنشأ بينما يتطلب مثال البروكسي العادي وجود موارد VPC وطلب معرفاتها.
* المتغير الوحيد المطلوب لتشغيل هذا المثال هو `token` مع رمز نقطة نهاية Wallarm.

## هندسة الحل

![مخطط بروكسي Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

لهذا المثال نفس الهندسة كحل البروكسي [العادي](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy):

* سيتم نشر موارد AWS VPC بما في ذلك الشبكات الفرعية، NATs، جداول التوجيه، EIPs، إلخ. تلقائيًا بواسطة وحدة [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) خلال تشغيل هذا المثال. لا يتم عرضها على المخطط المُقدم.
* موازن تحميل التطبيقات يواجه الإنترنت يوجه الحركة إلى مثيلات نقطة نهاية Wallarm. سيتم نشر هذا المكون بواسطة وحدة `wallarm` المُقدمة كمثال.
* مثيلات نقطة نهاية Wallarm تحلل الحركة وتوجه أي طلبات أخرى. العناصر المقابلة على المخطط هي مثيلات EC2 A، B، C. سيتم نشر هذا المكون بواسطة وحدة `wallarm` المُقدمة كمثال.

    يتم تشغيل مثيلات نقطة نهاية Wallarm في وضع الرصد الذي يحرك السلوك الموصوف. يمكن أيضًا تشغيل مثيلات نقطة نهاية Wallarm في أوضاع أخرى تهدف إلى حظر الطلبات الضارة وإرسال الطلبات المشروعة فقط إلى الأمام. للتعرف على المزيد حول أوضاع نقطة نهاية Wallarm، استخدم [وثائقنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* الخدمات التي توجه نقاط النهاية في Wallarm الطلبات إليها. يمكن أن تكون الخدمة من أي نوع، مثلًا:

    * تطبيق AWS API Gateway متصل بـ VPC عبر نقاط نهاية VPC (يُوصى بتكوين موازن التحميل الداخلي أو خدمة NodePort في هذه الحالة)
    * AWS S3
    * عقد EKS تعمل في عنقود EKS (يُوصى بتكوين موازن التحميل الداخلي أو خدمة NodePort لهذه الحالة)
    * أي خدمة خلفية أخرى

    بشكل افتراضي، ستوجه نقاط نهاية Wallarm الحركة إلى `https://httpbin.org`. خلال تشغيل هذا المثال، ستكون قادرًا على تحديد أي نطاق خدمة أو مسار آخر متاح من AWS Virtual Private Cloud (VPC) لتوجيه الحركة إليه.

## مكونات الكود

يحتوي هذا المثال على ملف التكوين `main.tf` الوحيد مع الإعدادات وحدة التالية:

* إعدادات وحدة [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) لإنشاء موارد AWS VPS.
* وحدة `wallarm` مع تكوين Wallarm ليتم نشرها كحل بروكسي. ينتج التكوين موازن تحميل AWS ALB ومثيلات Wallarm.

## المتطلبات

* Terraform 1.0.5 أو أعلى [مثبت محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **المدير** في وحدة تحكم Wallarm في [سحابة الاتحاد الأوروبي](https://my.wallarm.com/) أو [سحابة الولايات المتحدة](https://us1.my.wallarm.com/)
* الوصول إلى `https://api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأوروبية أو إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأمريكية. يرجى التأكد من أن الوصول ليس محظورًا بواسطة جدار حماية

## تشغيل مثال حل Wallarm AWS البروكسي

1. اشترك في وحدة تحكم Wallarm في [سحابة الاتحاد الأوروبي](https://my.wallarm.com/nodes) أو [سحابة الولايات المتحدة](https://us1.my.wallarm.com/nodes).
1. افتح وحدة التحكم Wallarm → **العقد** وأنشئ العقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المُنشأ.
1. انسخ مستودع الكود المثال إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. اضبط قيم المتغيرات في خيارات `default` في ملف `examples/from-scratch/variables.tf` للمستودع المُنسوخ واحفظ التغييرات.
1. نشر المجموعة بتنفيذ الأوامر التالية من دليل `examples/from-scratch`:

    ```
    terraform init
    terraform apply
    ```

لإزالة البيئة المُنشرة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [وثائق Wallarm](https://docs.wallarm.com)
* [وحدة Terraform التي تنشئ موارد VPC على AWS](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws)
* [AWS VPC مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)