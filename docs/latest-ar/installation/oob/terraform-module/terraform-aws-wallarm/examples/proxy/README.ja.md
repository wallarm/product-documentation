# التنصيب Wallarm كوكيل في AWS VPC

يوضح هذا النموذج كيفية تنصيب Wallarm كوكيل بشكل متصل وذلك باستعمال [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/) في AWS Virtual Private Cloud (VPC) الموجود مسبقا.

تقدم حلول الوكيل من Wallarm طبقة شبكة إضافية تعمل كموجه لحركة البروتوكول التشعبي على الإنترنت المتقدمة عن توفير القدرات المتقدمة لجدار الحماية من الهجمات وأمن واجهة البرمجة.

بتجربة [الحل المتقدم للوكيل](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)، يمكنك التحقق من مرونة الحل.

## الميزات الرئيسية

* يقوم Wallarm بمعالجة حركة المرور في الوضع المتزامن دون تقييد ميزات Wallarm وتمكين تخفيف التهديد الفوري (`preset=proxy`).
* يتم تنصيب حلول Wallarm كطبقة شبكة إضافية يمكن التحكم فيها بشكل مستقل عن الطبقات الأخرى، ويمكن وضعها في أي موقع ضمن أي بنية شبكة. الوضع الموصى به هو خلف موزع الحمل المواجه للإنترنت.

## بنية الحل

![خطة وكيل Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

تتضمن أمثلة حلول الوكيل من Wallarm التالي:

* Wallarm Node Instances لتوجيه حركة المرور بواجهة البرمجة معترضة على الإنترنت للتحميل المتوازن.
* Wallarm Node Instances لتحليل حركة المرور والوساطة لأي طلبات. المكونات المتوافقة هي نماذج EC2 العينات أ، ب، ج في المخطط.

    في هذا النموذج، نشغل Wallarm Nodes في وضع الرصد الذي يسبب السلوك الموصوف. يمكن لـWallarm Node أن يعمل أيضا في وضع آخر ، والذي يهدف إلى حجب الطلبات الخبيثة والوساطة للطلبات المشروعة فقط. يرجى معرفة المزيد عن أوضاع Wallarm Node في [الوثائق المتاحة](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* الخدمة التي يتوسط طلباتها Wallarm Node. الخدمة يمكن أن تكون من أي نوع. على سبيل المثال:

    * تطبيق AWS API Gateway الذي يتصل بـ VPC عبر نقطة النهاية في VPC (يشمل تنصيب Terraform من Wallarm المتوافق في [أمثلة API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)).
    * AWS S3
    * EKS Nodes الذي يعمل في EKS Cluster (يوصى باستعمال إعدادات الحمل المتوازن الداخلية او خدمة NodePort لهذه الحالة).
    * الخدمات الخلفية الأخرى

    Wallarm Nodes يتوسط حركة المرور إلى `https://httpbin.org` بشكل افتراضي. في غضون البداية وفق لهذا النموذج، يمكنك تحديد أي من الخدمات الأخرى المتاحة من AWS Virtual Private Cloud (VPC) مع أنواع الطلب والمسارات المتاحة لتوسط حركة المرور.

    `https_redirect_code = 302` خيارات الوحدة للإعداد بواسطة AWS ALB لتوجيه طلبات HTTP بشكل آمن إلى HTTPS.

كل المكونات المدرجة (باستثناء الخادم المتوسط) في `wallarm` وحدة النموذج المعطى هي تم تنصيبها.

## مكونات كود

هذا النموذج يحوي المكونات التالية للكود:

* `main.tf`: الضبط الرئيسي لـ`wallarm` وحدة التي تنصب كحل وكيل. هذا الضبط ينشئ AWS ALB و Wallarm Instances.
* `ssl.tf`: تجهيز SSL/TLS للتحميل بالأمان لـAWS ALB بواسطة تعيين آلي لـAWS Certificate Manager (ACM) الجديدة للنطاق المحدد بـ`variable_name` وربطها بـAWS ALB.
    
    لتعطيل هذه الخاصية، عليك إزالة ملف 'ssl.tf' و 'dns.tf' أو التعليق على هذه الملفات، وكذلك التعليق على الخيارات ضمن تعريفات الوحدة 'wallarm' مثل 'lb_ssl_enabled'، 'lb_certificate_arn'، 'https_redirect_code'، و 'depends_on'. عند تعطيل هذه الخاصية، ستكون قادرة فقط على استخدام منفذ HTTP (80).
* `dns.tf`: إعدادات AWS Route 53 لتقديم خدمة ال DNS لـAWS ALB.

    لتعطيل هذه الخاصية، يرجى التكرم بمراجعة التعليمات السابقة.

## متطلبات

* يجب أن يكون Terraform 1.0.5 أو أعلى [مثبت محليا](https://learn.hashicorp.com/tutorials/terraform/install-cli).
* لديك الوصول إلى حساب بدور **المدير** في واجهة Wallarm Console سواء في [EU Cloud](https://my.wallarm.com/) أو [US Cloud](https://us1.my.wallarm.com/).
* يجب أن تتمكن من الوصول إلى `https://api.wallarm.com` إذا كنت تعمل مع Wallarm Cloud في اوروبا، أو إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع Wallarm Cloud في الولايات المتحدة. يجب التحقق من أن الجدار الناري لا يحظر الوصول.
* لتشغيل النموذج الذي يتضمن خيارات SSL و DNS ، يجب إعداد [Zone Hosting لطريق 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html).

## تشغيل نموذج Wallarm AWS Proxy

1. قم بالتسجيل في واجهة Wallarm Console في [EU Cloud](https://my.wallarm.com/nodes) أو [US Cloud](https://us1.my.wallarm.com/nodes).
1. افتح Wallarm Console → **Nodes** وقم بإنشاء **نوع Wallarm Node** من النقاط.
1. انسخ الرمز الخاص بالنقطة المحدثة.
1. انسخ المستودع الذي يحتوي الكود الخاص بهذا النموذج على جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. أعد القيم المتغيرة في خيار `default` ملف `variables.tf` المتواجد في مجلد المستودع المنسوخ واحفظ التغييرات.
1. أعد بروتوكول الخادم الوكيل والعنوان في `examples/proxy/main.tf` → `proxy_pass`.

    بشكل افتراضي، يتوسط Wallarm حركة المرور إلى `https://httpbin.org`. إذا كانت القيمة الافتراضية تناسب احتياجاتك، فاتركها كما هي.
1. شغل الأوامر التالية من من مجلد `examples/proxy` لتنصيب المكدس:

    ```
    terraform init
    terraform apply
    ```

لحذف البيئة التي تم تثبيتها، استخدم الأمر التالي:

```
terraform destroy
```

## استكشاف الأخطاء وإصلاحها

### Wallarm يقوم بإنشاء وإيقاف النسخ المتشابهة تكرارا

إعدادات AWS Auto Scaling Group المقدمة تركز على تحقيق أعلى مستويات الموثوقية والسلاسة للخدمة. قد يكون إعادة إنشاء وإيقاف نسخ EC2 المتشابهة تكرارا خلال تهيئة AWS Auto Scaling Group نتيجة فشل الفحص الصحي.

لحل هذه المشكلة، تحقق من وقم بتصحيح الإعدادات التالية:

* رمز Wallarm Node هو قيمة صالحة تم نسخها من Wallarm Console UI.
* إعدادات NGINX صالحة.
* النطاق الذي تم تحديده في إعدادات NGINX يمكن حله بشكل صحيح (مثل قيمة `proxy_pass`).

**الحل الحاسم** إذا لم يكن ممكنا حل المشكلة حتى مع التأكد من صحة الإعدادات السابقة، يمكننا تعطيل فحص الصحة من الحمل المتوازن الالكتروني بشكل يدوي في إعدادات المجموعة المتوسطة التلقائي لإيجاد سبب المشكلة. هذا سيؤدي إلى إبقاء النسخ المتشابهة نشطة حتى عند أخفاق إعدادات الخدمة وبالتالي سيتم إعادة بدأ النسخ المتشابهة، مما يزيد من الوقت لفحص السجلات بشكل تفصيلي وتصحيح الخدمة والتي بالتالي سوف يكون من الممكن أن نحل المشكلة في بضع دقئق.

## مراجع

* [شهادات AWS ACM](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [AWS VPC للجمهور والشبكات الفرعية الخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)