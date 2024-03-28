# وحدة Wallarm لـ AWS باستخدام Terraform

[Wallarm](https://www.wallarm.com/) هي المنصة التي يختارها فرق التطوير والأمن والتشغيل لبناء واجهات برمجة التطبيقات السحابية الأصلية بأمان، ومراقبتها للتهديدات الحديثة، والحصول على تنبيهات عند ظهور تهديدات. سواء كنت تحمي بعض التطبيقات القديمة أو واجهات برمجة التطبيقات السحابية الأصلية الجديدة كلياً، توفر Wallarm المكونات الأساسية لحماية عملك ضد التهديدات الناشئة.

هذا المستودع يحتوي على الوحدة النمطية لنشر Wallarm على [AWS](https://aws.amazon.com/) باستخدام Terraform.

![مخطط وكيل Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

من خلال تطبيق وحدة Wallarm باستخدام Terraform، قدمنا الحل الذي يمكّن من خياري نشر Wallarm الأساسيين: خيارات الأمان الوكيل والمرآة. يتم التحكم في خيار النشر بسهولة عن طريق متغير `preset` لوحدة Wallarm. يمكنك تجربة كلا الخيارين من خلال نشر [الأمثلة المقدمة](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples) أو تكوين الوحدة نفسها.

## متطلبات

* Terraform الإصدار 1.0.5 أو أعلى [مثبت محلياً](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **المدير** في واجهة Wallarm على السحابة الأوروبية [EU Cloud](https://my.wallarm.com/) أو السحابة الأمريكية [US Cloud](https://us1.my.wallarm.com/)
* الوصول إلى `https://api.wallarm.com` عند العمل مع Wallarm Cloud الأوروبية أو إلى `https://us1.api.wallarm.com` عند العمل مع Wallarm Cloud الأمريكية. يرجى التأكد من عدم حظر الوصول بواسطة جدار ناري

## كيفية استخدام هذه الوحدة؟

يحتوي هذا المستودع على البنية التالية للمجلدات:

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): يحتوي هذا المجلد على الوحدات الفرعية المطلوبة لنشر وحدة Wallarm.
* [`examples`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): يعرض هذا المجلد أمثلة على طرق مختلفة لاستخدام الوحدة من مجلد `modules` لنشر Wallarm.

لنشر Wallarm للإنتاج باستخدام هذا المستودع:

1. سجّل للحصول على واجهة Wallarm في السحابة الأوروبية [EU Cloud](https://my.wallarm.com/signup) أو السحابة الأمريكية [US Cloud](https://us1.my.wallarm.com/signup).
1. افتح واجهة Wallarm → **العقد** وأنشئ عقدة من نوع **عقدة Wallarm**.
1. انسخ رمز العقدة المُنشأ.
1. أضف كود وحدة `wallarm` إلى تكوين Terraform الخاص بك:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."

      host       = "api.wallarm.com" # أو "us1.api.wallarm.com"
      token      = "..."

      instance_type = "..."

      ...
    }
    ```
1. حدد رمز العقدة المنسوخ في متغير `token` وقم بتكوين المتغيرات الضرورية الأخرى.

## كيف يتم صيانة هذه الوحدة؟

يتم صيانة وحدة Wallarm لـ AWS بواسطة [فريق Wallarm](https://www.wallarm.com/).

إذا كانت لديك أسئلة أو طلبات ميزات متعلقة بوحدة Wallarm لـ AWS، لا تتردد في إرسال بريد إلكتروني إلى [support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question).

## الرخصة

يتم إصدار هذا الكود تحت [رخصة MIT](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE).

حقوق النشر &copy; 2022 Wallarm, Inc.