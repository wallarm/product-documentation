# مثال على تطبيق وحدة Wallarm AWS Terraform: حل الوكيل من البداية

يُظهر هذا المثال كيفية تطبيق Wallarm كوكيل مباشر داخل شبكة AWS الخاصة الافتراضية (VPC) باستخدام وحدة Terraform. بخلاف أمثلة تطبيق الوكيل [العادية](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) أو [المتقدمة](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)، سيقوم هذا الإعداد بإنشاء موارد VPC مباشرةً أثناء تطبيق هذا المثال باستخدام [وحدة AWS VPC Terraform](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/). لذلك يُعرف هذا المثال بـ"حل الوكيل من البداية".

هذا هو خيار التطبيق **الموصى** به إذا كان:

* ليس لديك شبكات فرعية، NATs، جداول توجيه وموارد VPC أخرى معدة. يطلق هذا المثال وحدة [AWS VPC Terraform](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) جنبًا إلى جنب مع وحدة Wallarm Terraform لإنشاء موارد VPC ودمج Wallarm معها.
* ترغب في تعلم طريقة دمج وحدة Wallarm مع AWS VPC، الموارد ومتغيرات الوحدة المطلوبة لهذا الدمج.

## الخصائص الرئيسية

* Wallarm يعالج الحركة المرورية بالوضع المتزامن الذي لا يقيد قدرات Wallarm ويتيح التخفيف الفوري من التهديدات (`preset=proxy`).
* حل Wallarm يُطبق كطبقة شبكة منفصلة تتيح لك التحكم بها بشكل مستقل عن الطبقات الأخرى ووضع الطبقة في أي موضع تقريبًا في بنية الشبكة. الموضع الموصى به هو خلف موازن تحميل يواجه الإنترنت.
* هذا الحل لا يتطلب تكوين ميزات DNS و SSL.
* يقوم بإنشاء موارد VPC ويدمج تلقائيًا الوكيل المباشر Wallarm بالـ VPC المُنشأ بينما يتطلب مثال الوكيل العادي أن تكون موارد VPC موجودة ويطلب معرفاتها.
* المتغير الوحيد المطلوب لتشغيل هذا المثال هو `token` مع رمز عقدة Wallarm.

## هندسة الحل

![مخطط وكيل Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

لهذا المثال نفس الهندسة كما في [حل الوكيل العادي](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy):

* موارد AWS VPC بما في ذلك الشبكات الفرعية، NATs، جداول التوجيه، EIPs، إلخ. سيتم تطبيقها تلقائيًا بواسطة وحدة [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) أثناء إطلاق هذا المثال. هذه الموارد غير معروضة في المخطط المقدم.
* موازن تحميل تطبيقي يواجه الإنترنت يوجه الحركة المرورية إلى عقد Wallarm. سيتم تطبيق هذا المكوِّن بواسطة وحدة `wallarm` المُقدمة.
* عقد Wallarm تحلل الحركة المرورية وتعيد توجيه أي طلبات أبعد من ذلك. العناصر المُقابلة في المخطط هي عقد EC2 A، B، C. سيتم تطبيق هذا المكوِّن بواسطة وحدة `wallarm` المُقدمة.

    يعمل المثال على تشغيل عقد Wallarm في وضع المراقبة الذي يقود السلوك الموصوف. يمكن أيضًا أن تعمل عقد Wallarm في أوضاع أخرى تهدف إلى حظر الطلبات الضارة وتوجيه الطلبات المشروعة فقط أبعد من ذلك. لمعرفة المزيد عن أوضاع عقد Wallarm، استخدم [التوثيق الخاص بنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* الخدمات التي توجه إليها عقد Wallarm الطلبات. يمكن أن تكون الخدمة من أي نوع، مثل:

    * تطبيق AWS API Gateway متصل بـ VPC عبر نقاط نهاية VPC (يُغطى تطبيق Wallarm Terraform المُقابل في [المثال الخاص بـ API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * عقد تعمل ضمن مجموعة EKS (يُوصى بتكوين موازن التحميل الداخلي أو خدمة NodePort في هذه الحالة)
    * أي خدمة خلفية أخرى

    بشكل افتراضي، ستقوم عقد Wallarm بتوجيه الحركة المرورية إلى `https://httpbin.org`. أثناء إطلاق هذا المثال، ستتمكن من تحديد أي نطاق خدمة أو مسار آخر متاح من AWS Virtual Private Cloud (VPC) لتوجيه الحركة المرورية إليه.

## مكونات الشيفرة

هذا المثال يحتوي على ملف تكوين وحيد `main.tf` بالإعدادات التالية للوحدة:

* إعدادات وحدة [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) لإنشاء موارد AWS VPS.
* وحدة `wallarm` مع تكوين Wallarm ليتم تطبيقه كحل وكيل. الشكل يُنتج AWS ALB وعقد Wallarm.

## المتطلبات

* Terraform 1.0.5 أو أعلى [مُثبت محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **المدير** في Wallarm Console في [السحابة الأوروبية](https://my.wallarm.com/) أو [السحابة الأمريكية](https://us1.my.wallarm.com/)
* الوصول إلى `https://api.wallarm.com` عند العمل مع Wallarm Cloud الأوروبية أو إلى `https://us1.api.wallarm.com` عند العمل مع Wallarm Cloud الأمريكية. يُرجى التأكد من أن الوصول غير محجوب بواسطة جدار حماية

## تشغيل مثال حل Wallarm AWS الوكيل

1. سجل للحصول على وحدة تحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح وحدة تحكم Wallarm → **العقد** وأنشئ عقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المنشأ.
1. استنسخ مستودع الشيفرة المثالية إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. حدد قيم المتغيرات في خيارات `default` في ملف `examples/from-scratch/variables.tf` من المستودع المُستنسخ واحفظ التغييرات.
1. طبق المكدس بتنفيذ الأوامر التالية من دليل `examples/from-scratch`:

    ```
    terraform init
    terraform apply
    ```

لإزالة البيئة المُطبقة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [توثيق Wallarm](https://docs.wallarm.com)
* [وحدة Terraform التي تُنشئ موارد VPC على AWS](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws)
* [AWS VPC مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)