# وحدة Wallarm الخاصة بـ AWS في Terraform

يُعد [Wallarm](https://www.wallarm.com/) الاختيار المفضل لفرق التطوير والأمن والعمليات لبناء واجهات برمجة التطبيقات الأصيلة للسحابة بأمان، ومراقبة التهديدات الحديثة، واستلام التنبيهات عند حدوث تهديدات. سواء كنت ترغب في حماية التطبيقات الحالية أو بناء واجهات برمجة التطبيقات الأصلية الجديدة للسحابة، يوفر Wallarm العناصر الأساسية لحماية أعمالك من التهديدات الناشئة.

هذا المستودع يحتوي على وحدات لنشر Wallarm على [AWS](https://aws.amazon.com/) باستخدام Terraform.

![مخطط وكيل Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

من خلال تنفيذ وحدة Wallarm لـ Terraform، نقدم حلاً يسمح بخيارين رئيسيين لنشر Wallarm، الوكيل والمرآة. يمكن التحكم في خيارات النشر بسهولة من خلال متغير `preset` في وحدة Wallarm. يمكنك تجربة كلا الخيارين إما بنشر [الأمثلة المقدمة](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples) أو بتكوين الوحدة النمطية ذاتها.

## المتطلبات

* تم تثبيت Terraform 1.0.5 أو أحدث [محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى حساب في وحدة تحكم Wallarm بدور **المدير**، ويجب أن يكون الحساب موجودًا إما في [السحابة الأوروبية](https://my.wallarm.com/) أو [السحابة الأمريكية](https://us1.my.wallarm.com/)
* إذا كنت تستخدم السحابة الأوروبية لـ Wallarm، فيجب أن يكون لديك الوصول إلى `https://api.wallarm.com`، وإذا كنت تستخدم السحابة الأمريكية لـ Wallarm، فيجب أن يكون الوصول متاحًا إلى `https://us1.api.wallarm.com`. تأكد من أن الوصول غير محظور بواسطة جدار الحماية

## كيف تستخدم هذه الوحدة؟

هيكل المجلدات في هذا المستودع كالتالي:

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): يحتوي هذا المجلد على الوحدات الفرعية اللازمة لنشر وحدة Wallarm.
* [`examples`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): يُظهر هذا المجلد مثالاً على استخدام وحدات المجلد `modules` لنشر Wallarm.

لنشر Wallarm في بيئة الإنتاج باستخدام هذا المستودع:

1. سجل للحصول على حساب في وحدة التحكم الخاصة بـ Wallarm سواء في [السحابة الأوروبية](https://my.wallarm.com/signup) أو [السحابة الأمريكية](https://us1.my.wallarm.com/signup).
1. افتح وحدة التحكم Wallarm وأنشئ نوع النود **نود Wallarm** في قسم **النودات**.
1. انسخ رمز النود المُنشأ.
1. أضف كود وحدة `wallarm` إلى تكوين Terraform الخاص بك كما يلي:

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
1. حدد الرمز المنسوخ في متغير `token` وقم بتعيين المتغيرات الأخرى المطلوبة.

## كيف يتم صيانة هذه الوحدة؟

يتم الصيانة لوحدة Wallarm الخاصة بـ AWS من قبل [فريق Wallarm](https://www.wallarm.com/).

إذا كانت لديك أي أسئلة أو طلبات ميزات متعلقة بوحدة Wallarm الخاصة بـ AWS، فلا تتردد في إرسال بريد إلكتروني إلى [support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question).

## الرخصة

يتم إصدار هذا الكود تحت [رخصة MIT](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE).

حقوق النشر © 2022 Wallarm, Inc.