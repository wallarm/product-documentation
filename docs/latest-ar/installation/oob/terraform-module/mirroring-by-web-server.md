# نشر Wallarm OOB لـ NGINX وEnvoy ومرايا مشابهة باستخدام وحدة Terraform

تعرض هذه المقالة **مثالًا** عن كيفية نشر Wallarm على AWS كحل خارج النطاق باستخدام [وحدة Terraform الخاصة بـ Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/). يُتوقع أن يقوم NGINX وEnvoy وIstio و/أو Traefik بتوفير ميزة مرايا الحركة.

## حالات الاستخدام

من بين كافة [خيارات نشر Wallarm المدعومة](https://docs.wallarm.com/installation/supported-deployment-options)، يُوصى باستخدام وحدة Terraform لنشر Wallarm على AWS VPC في هذه **حالات الاستخدام**:

* تتواجد البنية التحتية الحالية لديك على AWS.
* تستفيد من ممارسة البنية التحتية كرموز (IaC). تسمح وحدة Terraform الخاصة بـ Wallarm بإدارة وتوفير تجهيز تلقائي لعقدة Wallarm على AWS، مما يعزز الكفاءة والاتساق.

## المتطلبات

* Terraform 1.0.5 أو أحدث [مُثبت محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **المدير** [الدور](https://docs.wallarm.com/user-guides/settings/users/#user-roles) في وحدة تحكم Wallarm في سحابة الولايات المتحدة أو الاتحاد الأوروبي [السحابة](https://docs.wallarm.com/about-wallarm/overview/#cloud)
* الوصول إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأوروبية. يرجى التأكد من عدم حجب الوصول بواسطة جدار الحماية

## هندسة الحل

![Wallarm للحركة المعكوسة](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

المكونات الرئيسية لحل Wallarm هذا هي كالآتي:

* جهاز توجيه الحمل المواجه للإنترنت يوجه الحركة إلى عقد Wallarm. يُتوقع أن يكون جهاز توجيه الحمل قد تم نشره بالفعل، وحدة `wallarm` لن تقوم بإنشاء هذا المورد.
* أي خادم ويب أو بروكسي (مثل NGINX، Envoy) يخدم الحركة من جهاز توجيه الحمل ويرايا الطلبات HTTP إلى نقطة نهاية ALB الداخلية وخدمات الخلفية. يُتوقع أن يكون المكون المستخدم لمرايا الحركة قد تم نشره بالفعل، وحدة `wallarm` لن تقوم بإنشاء هذا المورد.
* ALB داخلي يقبل طلبات HTTPS المعكوسة من خادم ويب أو بروكسي ويوجهها إلى عقد Wallarm.
* عقدة Wallarm تقوم بتحليل الطلبات من ALB الداخلي وترسل بيانات الحركة الخبيثة إلى سحابة Wallarm.

    يعمل المثال على تشغيل عقد Wallarm في وضع الرصد الذي يحدد السلوك الموصوف. إذا قمت بتغيير [الوضع](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) إلى قيمة أخرى، تواصل العقد مراقبة الحركة فقط حيث أن طريقة [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) لا تسمح بحظر الهجمات.

سيتم نشر آخر مكونين بواسطة وحدة `wallarm` الموفرة كمثال.

## مكونات الرمز

يحتوي هذا المثال على المكونات الرئيسية التالية للرمز:

* `main.tf`: التكوين الرئيسي لوحدة `wallarm` ليتم نشرها كحل مرايا. ينتج التكوين ALB داخلي في AWS وحالات Wallarm.

## تشغيل مثال حل مرايا Wallarm

لتشغيل مثال حل مرايا Wallarm، تحتاج إلى تكوين مرايا طلبات HTTP ثم نشر الحل.

### 1. تكوين مرايا طلبات HTTP

مرايا الحركة هي ميزة تقدمها العديد من خوادم الويب والبروكسي. يوفر الرابط أدناه التوثيق حول كيفية تكوين مرايا الحركة مع بعضها [الرابط](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring).

### 2. نشر مثال حل مرايا Wallarm

1. اشترك في وحدة تحكم Wallarm في [سحابة الاتحاد الأوروبي](https://my.wallarm.com/nodes) أو [سحابة الولايات المتحدة](https://us1.my.wallarm.com/nodes).
1. افتح وحدة تحكم Wallarm → **العقد** وأنشئ عقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المولد.
1. قم بنسخ مستودع التعليمات البرمجية المثالية إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. حدد قيم المتغيرات في خيارات `الافتراضي` في ملف `examples/mirror/variables.tf` في المستودع المنسوخ واحفظ التغييرات.
1. نفذ الأوامر التالية من دليل `examples/mirror` لنشر الحزمة:

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