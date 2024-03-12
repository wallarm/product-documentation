# Wallarm AWS Terraform موديول

[Wallarm](https://www.wallarm.com/) هي البرنامج المختار من فرق الـ Dev، Sec، و Ops لبناء واجهات برمجة تطبيقات (APIs) سحابية بشكل آمن، رصد التهديدات الحديثة، واستقبال إشعارات عند حدوث تهديدات. سواء كان الهدف هو حماية التطبيقات القائمة أو حماية واجهات برمجة التطبيقات السحابية الجديدة، Wallarm توفر العناصر الأساسية لحماية الأعمال من التهديدات الناشئة.

هذا المستودع يتضمن موديول لنشر Wallarm على [AWS](https://aws.amazon.com/) باستخدام Terraform.

![مخطط بروكسي Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

بتنفيذ موديول Terraform الخاص بـ Wallarm، نحن نقدم حلًا يتيح خيارين رئيسيين لنشر Wallarm وهما الوكيل (proxy) والمرآة (mirror). يمكن التحكم بسهولة في خيارات النشر عبر متغير `preset` الخاص بموديول Wallarm. يمكنك تجربة كلا الخيارين بنشر [الأمثلة المقدمة](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples) أو بإعداد الموديول نفسه.

## المتطلبات

* يجب أن يكون Terraform 1.0.5 أو أحدث [مثبتًا محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى حساب بدور **مدير** في لوحة تحكم Wallarm، ويجب أن يكون موجودًا في السحابة الأوروبية [EU Cloud](https://my.wallarm.com/) أو السحابة الأمريكية [US Cloud](https://us1.my.wallarm.com/)
* إذا كنت تستخدم سحابة Wallarm الأوروبية، يجب أن يكون لديك وصول إلى `https://api.wallarm.com`. وإذا كنت تستخدم السحابة الأمريكية، يجب أن يكون لديك وصول إلى `https://us1.api.wallarm.com`. تأكد من عدم حظر الوصول بواسطة جدار الحماية

## كيف يمكنك استخدام هذا الموديول؟

هذا المستودع يتبع البنية التنظيمية التالية:

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): تحتوي هذه الفولدر على السب موديولات اللازمة لنشر موديول Wallarm.
* [`examples`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): تظهر هذه الفولدر طرق مختلفة لاستخدام موديولات الفولدر `modules` لنشر Wallarm.

لنشر Wallarm في بيئة الإنتاج باستخدام هذا المستودع:

1. سجل في لوحة تحكم Wallarm عبر [EU Cloud](https://my.wallarm.com/signup) أو [US Cloud](https://us1.my.wallarm.com/signup).
1. افتح لوحة تحكم Wallarm وأنشئ عقدة بنوع **عقدة Wallarm** في **العقد**.
1. انسخ رمز العقدة المُنشأ.
1. أضف كود موديول `wallarm` إلى إعدادات Terraform الخاصة بك كما يلي:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."

      host       = "api.wallarm.com" # or "us1.api.wallarm.com"
      token      = "..."

      instance_type = "..."

      ...
    }
    ```
1. حدد رمز العقدة المنسوخ في المتغير `token` واضبط المتغيرات الأخرى الضرورية.

## كيف يتم صيانة هذا الموديول؟

يتم صيانة موديول AWS الخاص بـ Wallarm بواسطة [فريق Wallarm](https://www.wallarm.com/).

إذا كانت لديك أية أسئلة أو طلبات لميزات متعلقة بموديول AWS الخاص بـ Wallarm، لا تتردد في إرسال بريد إلكتروني إلى [support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question).

## الرخصة

يتم إصدار هذا الكود تحت [رخصة MIT](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE).

حقوق الطبع والنشر © 2022 Wallarm, Inc.