# نشر Wallarm كوكيل في AWS VPC

توضح هذه المثال كيفية نشر Wallarm كوكيل مضمن داخل AWS Virtual Private Cloud (VPC) القائم باستخدام [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

توفر حلول وكيل Wallarm طبقة إضافية وظيفية للشبكة تعمل كموجه متقدم لحركة مرور HTTP مع وظائف أمان WAF وAPI.

يمكنك رؤية مرونة الحل بالعمل من خلال تجربة [الحل المتقدم للوكيل](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced).

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](https://docs.wallarm.com/installation/supported-deployment-options)، يُوصى باستخدام وحدة Terraform لنشر Wallarm على AWS VPC في **حالات الاستخدام** التالية:

* تقع البنية التحتية القائمة لديك على AWS.
* تستفيد من ممارسة البنية التحتية ككود (IaC). تتيح وحدة Terraform الخاصة بـWallarm إدارة وتوفير تلقائي لعقدة Wallarm على AWS، مما يعزز الكفاءة والتناسق.

## المتطلبات

* تثبيت Terraform 1.0.5 أو أعلى [محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **المدير** [الدور](https://docs.wallarm.com/user-guides/settings/users/#user-roles) في واجهة Wallarm في [السحابة](https://docs.wallarm.com/about-wallarm/overview/#cloud) الأمريكية أو الأوروبية
* الوصول إلى `https://us1.api.wallarm.com` عند العمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` عند العمل مع سحابة Wallarm الأوروبية. يرجى التأكد من أن الوصول غير محظور بواسطة جدار الحماية

## هيكل الحل

![مخطط وكيل Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

يتضمن مثال حل وكيل Wallarm ما يلي:

* موازن التحميل الخاص بالتطبيقات المتاحة للإنترنت يوجه حركة المرور إلى عقد Wallarm.
* تعقد Wallarm التي تحلل حركة المرور وتعمل كوكيل لأي طلبات أخرى. العناصر المقابلة في المخطط هي النماذج A، B، C من النماذج الحاسوبية EC2.

    يعمل المثال بعقد Wallarm في وضع المراقبة الذي يحدد السلوك الموصوف. يمكن أيضًا لعقد Wallarm أن تعمل في أوضاع أخرى تهدف إلى حجب الطلبات الضارة وإعادة توجيه الطلبات المشروعة فقط. لمعرفة المزيد حول أوضاع عقد Wallarm، استخدم [توثيقنا](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* الخدمات التي تعمل كوكيل عقد Wallarm لطلباتها. يمكن أن تكون الخدمة من أي نوع، مثل:

    * تطبيق AWS API Gateway المتصل بـVPC عبر نقاط نهاية VPC (يغطي نشر Wallarm Terraform المقابل في [المثال لـAPI Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * النماذج الحاسوبية التي تعمل في مجمع EKS (يُوصى بتكوين Internal Load Balancer أو خدمة NodePort لهذه الحالة)
    * أي خدمة خلفية أخرى

    بشكل افتراضي، ستعمل عقد Wallarm على توجيه حركة المرور إلى `https://httpbin.org`. خلال إطلاق هذا المثال، ستتمكن من تحديد أي نطاق خدمة آخر أو مسار متاح من AWS Virtual Private Cloud (VPC) لتوجيه حركة المرور إليه.

    خيار تكوين الوحدة `https_redirect_code = 302` سيتيح لك إعادة توجيه طلبات HTTP إلى HTTPS بأمان بواسطة AWS ALB.

سيتم نشر جميع العناصر المدرجة (ما عدا الخادم الموكّل) بواسطة وحدة `wallarm` المثال المقدمة.

## مكونات الكود

يحتوي هذا المثال على مكونات الكود التالية:

* `main.tf`: التكوين الرئيسي لوحدة `wallarm` لنشرها كحل وكيل. ينتج التكوين AWS ALB وعقد Wallarm.
* `ssl.tf`: تكوين تحميل SSL/TLS الذي يصدر تلقائيًا شهادة جديدة من AWS Certificate Manager (ACM) للنطاق المحدد في متغير `domain_name` ويربطها بـAWS ALB.

    لتعطيل الميزة، قم بإزالة أو التعليق على ملفات `ssl.tf` و `dns.tf`، وأيضًا التعليق على خيارات `lb_ssl_enabled`, `lb_certificate_arn`, `https_redirect_code`, `depends_on` في تعريف وحدة `wallarm`. بتعطيل الميزة، ستتمكن من استخدام ميناء HTTP (80) فقط.
* `dns.tf`: تكوين AWS Route 53 الذي يوفر سجل DNS لـAWS ALB.

    لتعطيل الميزة، اتبع الملاحظة أعلاه.

## تشغيل مثال حل وكيل Wallarm AWS

1. قم بالتسجيل في واجهة Wallarm على [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
1. افتح واجهة Wallarm → **العقد** وأنشئ عقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المولد.
1. انسخ مستودع الكود المثالي إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. حدد قيم المتغيرات في خيارات `default` في ملف `examples/proxy/variables.tf` من المستودع الذي تم نسخه واحفظ التغييرات.
1. حدد بروتوكول وعنوان الخادم الموكّل في `examples/proxy/main.tf` → `proxy_pass`.

    بشكل افتراضي، ستعمل Wallarm على توجيه حركة المرور إلى `https://httpbin.org`. إذا كانت القيمة الافتراضية تلبي احتياجاتك، اتركها كما هي.
1. قم بنشر المجمع بتنفيذ الأوامر التالية من دليل `examples/proxy`:

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

يتركز تكوين مجموعة التوسيع التلقائي AWS المقدمة على أعلى موثوقية وسلاسة الخدمة. قد يكون الإنشاء والإنهاء المتكرر لنماذج EC2 أثناء تهيئة مجموعة التوسيع التلقائي AWS ناتجًا عن فشل في الفحوصات الصحية.

لمعالجة القضية، يرجى مراجعة وإصلاح الإعدادات التالية:

* رمز عقدة Wallarm له قيمة صالحة تم نسخها من واجهة Wallarm
* تكوين NGINX صالح
* أسماء النطاقات المحددة في تكوين NGINX تم حلها بنجاح (مثل قيمة `proxy_pass`)


**الطريقة القصوى** إذا كانت الإعدادات المذكورة أعلاه صالحة، يمكنك محاولة العثور على سبب المشكلة من خلال تعطيل فحوصات الصحة ELB يدويًا في إعدادات مجموعة التوسيع التلقائي. سيحافظ ذلك على النماذج الحاسوبية نشطة حتى لو كان التكوين الخدمي غير صالح، ولن تعاد تشغيل النماذج. ستتمكن من استكشاف السجلات وتصحيح الخدمة بدلاً من التحقيق في المشكلة خلال بضع دقائق.

## المراجع

* [شهادات AWS ACM](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [AWS VPC مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)