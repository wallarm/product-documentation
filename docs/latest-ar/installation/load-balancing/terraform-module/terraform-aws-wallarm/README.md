# Wallarm AWS Terraform Module

[Wallarm](https://www.wallarm.com/) هي المنصة اللي بتختارها فرق Dev و Sec و Ops علشان يبنوا APIs مبنية على الcloud بأمان، يراقبوها ضد التهديدات الحديثة و يتم إنذارهم لما التهديدات دي تظهر. سواء كنت بتحمي بعض التطبيقات القديمة أو APIs الجديدة تمامًا المبنية على الcloud، Wallarm بتوفر العناصر الأساسية علشان تأمن شغلك ضد التهديدات اللي بتظهر.

المستودع ده بيحتوي على الموديول لنشر Wallarm على [AWS](https://aws.amazon.com/) باستخدام Terraform.

![مخطط وكيل Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

بتنفيذ موديول Terraform بتاع Wallarm، قدمنا الحل اللي بيسمح بخيارين أساسيين لنشر Wallarm: حلول الأمان بالوكيل والمرآة. خيار النشر سهل التحكم فيه عن طريق متغير `preset` بتاع موديول Wallarm. ممكن تجرب الخيارين دول عن طريق نشر [الأمثلة الموفرة](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples) أو تهيئة الموديول نفسه.

## المتطلبات

* Terraform 1.0.5 أو أعلى [مثبت محليا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* وصول لحساب بدور **المدير** في وحدة التحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com/) أو [السحابة الأمريكية](https://us1.my.wallarm.com/)
* وصول لـ `https://api.wallarm.com` لو بتشتغل مع سحابة Wallarm الأوروبية أو `https://us1.api.wallarm.com` لو بتشتغل مع سحابة Wallarm الأمريكية. من فضلك تأكد إن الوصول مش محجوب بجدار ناري

## ازاي تستخدم الموديول ده؟

المستودع ده عنده البنية التالية:

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): الفولدر ده بيحتوي على submodules اللازمة لنشر موديول Wallarm.
* [`examples`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): الفولدر ده بيعرض أمثلة لطرق مختلفة لاستخدام الموديول من فولدر `modules` علشان نشر Wallarm.

علشان تنشر Wallarm للإنتاج باستخدام المستودع ده:

1. اشترك في وحدة التحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com/signup) أو [السحابة الأمريكية](https://us1.my.wallarm.com/signup).
1. افتح وحدة التحكم Wallarm → **العقد** و اعمل عقدة من نوع **عقدة Wallarm**.
1. انسخ token العقدة اللي اتولد.
1. أضف كود موديول `wallarm` لتهيئة Terraform بتاعتك:

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
1. حدد token العقدة اللي انسخته في متغير `token` و هيئ الفاريابلز التانية الضرورية.

## الموديول ده بيتحافظ عليه ازاي؟

موديول AWS الخاص ب Wallarm بيتم صيانته من [فريق Wallarm](https://www.wallarm.com/).

لو عندك أسئلة أو طلبات مميزات تخص موديول AWS الخاص ب Wallarm، متترددش تبعت إيميل لـ [support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question).

## الرخصة

الكود ده بيتم إصداره تحت [رخصة MIT](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE).

حقوق النشر &copy; 2022 Wallarm, Inc.