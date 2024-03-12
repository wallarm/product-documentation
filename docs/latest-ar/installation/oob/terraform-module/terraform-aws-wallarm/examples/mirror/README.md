# توظيف Wallarm OOB لـ NGINX، Envoy و الميرورينج المشابه باستخدام وحدة Terraform

يُظهر هذا المقال **مثال** على كيفية نشر Wallarm إلى AWS كحل Out-of-Band باستخدام [وحدة Terraform الخاصة بـ Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/). من المتوقع أن يوفر NGINX، Envoy، Istio و/أو Traefik ميزة الميرورينج للترافيك.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](https://docs.wallarm.com/installation/supported-deployment-options)، يُنصح باستخدام وحدة Terraform لنشر Wallarm على AWS VPC في هذه **الحالات**:

* بُنيتك التحتية الحالية موجودة على AWS.
* تستفيد من ممارسة البنية التحتية ككود (IaC). تتيح وحدة Terraform الخاصة بـ Wallarm للإدارة والتوفير التلقائي لعقدة Wallarm على AWS، مما يعزز الكفاءة والاتساق.

## المتطلبات

* Terraform 1.0.5 أو أعلى [مُثبت محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **المسؤول** [الدور](https://docs.wallarm.com/user-guides/settings/users/#user-roles) في واجهة Wallarm في US أو Cloud الاتحاد الأوروبي [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)
* الوصول إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع Cloud Wallarm الأمريكي أو إلى `https://api.wallarm.com` إذا كنت تعمل مع Cloud Wallarm الأوروبي. الرجاء التأكد من عدم حظر الوصول بواسطة جدار حماية

## بنية الحل

![Wallarm للترافيك المُعكس](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

تحتوي هذه المثال لحل Wallarm على المكونات التالية:

* موازن تحميل مواجه للإنترنت يوجه الترافيك إلى عُقد Wallarm. من المتوقع أن يكون موازن التحميل قد نُشر بالفعل، وحدة `wallarm` لن تُنشئ هذا المورد.
* أي خادم ويب أو بروكسي (مثل NGINX، Envoy) يخدم الترافيك من موازن تحميل ويعكس طلبات HTTP إلى نقطة نهاية ALB داخلية وخدمات الخلفية. من المتوقع أن يكون المكون المستخدم لميرورينج الترافيك قد نُشر بالفعل، وحدة `wallarm` لن تُنشئ هذا المورد.
* ALB داخلي يقبل طلبات HTTPS المعكوسة من خادم ويب أو بروكسي ويوجهها إلى عقد Wallarm.
* عُقدة Wallarm تحلل الطلبات من ALB داخلي وترسل بيانات الترافيك الضارة إلى Cloud Wallarm.

    المثال يُشغل عقد Wallarm في وضع المراقبة الذي يُحدد السلوك الموصوف. إذا غيرت [الوضع](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) إلى قيمة أخرى، تستمر العقد في مراقبة الترافيك فقط كما أن نهج [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) لا يسمح بحظر الهجمات.

سيتم نشر آخر مكونين بواسطة وحدة `wallarm` المقدمة كمثال.

## مكونات الكود

يحتوي هذا المثال على المكونات الكودية التالية:

* `main.tf`: التهيئة الرئيسية لوحدة `wallarm` ليتم نشرها كحل ميرور. التهيئة تُنتج ALB داخلي AWS وعقد Wallarm.

## تشغيل مثال حل الميرور Wallarm

لتشغيل مثال حل ميرور Wallarm، تحتاج إلى تكوين ميرورينج طلبات HTTP ثم نشر الحل.

### 1. تكوين ميرورينج طلبات HTTP

ميرورينج الترافيك هي ميزة يوفرها العديد من خوادم الويب والبروكسي. ال[رابط](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring) يقدم التوثيق حول كيفية تكوين ميرورينج الترافيك مع بعضها.

### 2. نشر مثال حل الميرور Wallarm

1. اشترك في واجهة Wallarm في [Cloud الاتحاد الأوروبي](https://my.wallarm.com/nodes) أو [Cloud الأمريكي](https://us1.my.wallarm.com/nodes).
1. افتح واجهة Wallarm → **Nodes** وأنشئ العُقدة من نوع **عُقدة Wallarm**.
1. انسخ رمز العقدة المُنشأ.
1. أنسخ المستودع الذي يحتوي كود المثال إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. قم بضبط قيم المتغيرات في الخيارات `default` في ملف `examples/mirror/variables.tf` من المستودع المُنسخ واحفظ التغييرات.
1. نشر المجموعة بتنفيذ الأوامر التالية من دليل `examples/mirror`:

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