# نشر Wallarm كبروكسي في AWS VPC

هذا المثال يوضح كيفية نشر Wallarm كبروكسي داخلي لـ AWS Virtual Private Cloud (VPC) الحالي باستخدام [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

حل بروكسي Wallarm يوفر طبقة وظيفية إضافية كموجه لحركة مرور HTTP المتقدم مع وظائف أمان WAF وAPI.

يمكنك رؤية مرونة الحل بالعمل من خلال تجربة [حل البروكسي المتقدم](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced).

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](https://docs.wallarm.com/installation/supported-deployment-options)، يُوصى بوحدة Terraform لنشر Wallarm على AWS VPC في هذه **حالات الاستخدام**:

* البنية التحتية الحالية لديك تقع على AWS.
* تستخدم ممارسات البنية التحتية ككود (IaC). تسمح وحدة Terraform من Wallarm بالإدارة والتجهيز الآلي لعقدة Wallarm على AWS، مما يعزز الكفاءة والاتساق.

## المتطلبات

* Terraform 1.0.5 أو أعلى [مثبت محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **المدير** [الدور](https://docs.wallarm.com/user-guides/settings/users/#user-roles) في وحدة التحكم Wallarm في سحابة الاتحاد الأوروبي [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)
* الوصول إلى `https://us1.api.wallarm.com` عند العمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` عند العمل مع سحابة Wallarm الأوروبية. يرجى التأكد من عدم حظر الوصول بواسطة جدار الحماية

## هندسة الحل

![مخطط بروكسي Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

حل بروكسي Wallarm في هذا المثال له المكونات التالية:

* موازن تحميل التطبيقات الذي يواجه الإنترنت يقوم بتوجيه الحركة إلى عقد Wallarm.
* عقد Wallarm تحلل الحركة وتقوم بتوكيل أي طلبات أخرى. العناصر المقابلة في المخطط هي A, B, C لمثيلات EC2.

    يعمل المثال بوضع مراقبة عقد Wallarm الذي يحدد السلوك الموصوف. يمكن أيضًا تشغيل عقد Wallarm في أوضاع أخرى تشمل تلك الهادفة إلى منع الطلبات الضارة وتمرير تلك المشروعة فقط. لمعرفة المزيد عن أوضاع عقد Wallarm، استخدم [التوثيق الخاص بنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* الخدمات التي توكل عقد Wallarm الطلبات إليها. يمكن أن تكون الخدمة من أي نوع، مثل:

    * تطبيق AWS API Gateway متصل ب VPC عبر نقاط نهاية VPC (تغطي النشر باستخدام Wallarm Terraform في [المثال لـ API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * عقد EKS تعمل في مجموعة EKS (يُوصى بتكوين موازن التحميل الداخلي أو خدمة NodePort في هذه الحالة)
    * أي خدمة خلفية أخرى

    بشكل افتراضي، ستقوم عقد Wallarm بتمرير الحركة إلى `https://httpbin.org`. خلال هذا الإطلاق المثال، ستتمكن من تحديد أي نطاق أو مسار خدمة آخر متاح من AWS Virtual Private Cloud (VPC) لتوجيه الحركة إليه.

    خيار التكوين `https_redirect_code = 302` سيسمح لك بإعادة توجيه طلبات HTTP إلى HTTPS بأمان بواسطة AWS ALB.

سيتم نشر جميع المكونات المدرجة (باستثناء الخادم الموكل) بواسطة وحدة `wallarm` المقدمة.

## مكونات الكود

هذا المثال يحتوي على مكونات الكود التالية:

* `main.tf`: الإعداد الرئيسي لوحدة `wallarm` التي سيتم نشرها كحل بروكسي. ينتج الإعداد AWS ALB و عقد Wallarm.
* `ssl.tf`: تكوين تفريغ SSL/TLS الذي يصدر تلقائيًا شهادة جديدة من مدير شهادات AWS (ACM) للنطاق المحدد في متغير `domain_name` ويربطها بـ AWS ALB.

    لتعطيل هذه الميزة، قم بإزالة أو التعليق على ملفات `ssl.tf` و `dns.tf`، وكذلك قم بالتعليق على خيارات `lb_ssl_enabled`, `lb_certificate_arn`, `https_redirect_code`, `depends_on` في تعريف وحدة `wallarm`. مع تعطيل الميزة، ستتمكن من استخدام ميناء HTTP (80) فقط.
* `dns.tf`: تكوين AWS Route 53 الذي يوفر سجل DNS لـ AWS ALB.

    لتعطيل الميزة، اتبع الملاحظة أعلاه.

## تشغيل مثال حل بروكسي Wallarm AWS

1. اشترك في وحدة التحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح وحدة التحكم Wallarm → **العقد** وأنشئ العقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المُنشأ.
1. انسخ مستودع الرمز المحتوي على الكود المثالي إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. اضبط قيم المتغيرات في خيارات `default` في ملف `examples/proxy/variables.tf` للمستودع المستنسخ واحفظ التغييرات.
1. اضبط بروتوكول الخادم الموكل وعنوانه في `examples/proxy/main.tf` → `proxy_pass`.

    بشكل افتراضي، ستقوم Wallarm بتوجيه الحركة إلى `https://httpbin.org`. إذا كانت القيمة الافتراضية تلبي احتياجاتك، اتركه كما هو.
1. نشر المكدس بتنفيذ الأوامر التالية من دليل `examples/proxy`:

    ```
    terraform init
    terraform apply
    ```

لإزالة البيئة المنشورة، استخدم الأمر التالي:

```
terraform destroy
```

## استكشاف الأخطاء وإصلاحها

### Wallarm ينشئ وينهي العقد بشكل متكرر

تركيز تكوين مجموعة AWS Auto Scaling المقدم على أعلى موثوقية وسلاسة الخدمة. قد يكون السبب وراء الإنشاء والإنهاء المتكرر لمثيلات EC2 خلال تهيئة مجموعة AWS Auto Scaling ناتجًا عن فشل في فحوصات الصحة.

لمعالجة المشكلة، يرجى مراجعة وإصلاح الإعدادات التالية:

* رمز العقدة Wallarm له قيمة صحيحة تم نسخها من واجهة المستخدم لوحدة التحكم Wallarm
* تكوين NGINX صالح
* تم حل أسماء النطاقات المحددة في تكوين NGINX بنجاح (على سبيل المثال، قيمة `proxy_pass`)

**الطريقة القصوى** إذا كانت الإعدادات المذكورة أعلاه صحيحة، يمكنك محاولة العثور على سبب المشكلة عن طريق تعطيل فحوصات الصحة ELB يدويًا في إعدادات مجموعة الAuto Scaling. سيبقي ذلك العقد نشطة حتى لو كان تكوين الخدمة غير صالح ولن تتم إعادة التشغيل. ستتمكن من استكشاف السجلات وتصحيح الخدمة بدلاً من التحقيق في المشكلة في عدة دقائق.

## المراجع

* [شهادات AWS ACM](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [AWS VPC مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)