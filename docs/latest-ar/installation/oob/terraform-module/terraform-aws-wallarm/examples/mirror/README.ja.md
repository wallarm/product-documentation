# استخدام موديل Wallarm Terraform لتنزيل حلول Wallarm Out-of-Band على AWS مع NGINX، Envoy وأمثالها من التحويلات

في هذا المقال، سنعرض **مثالاً** على استخدام [موديل Wallarm Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/) لتنزيل Wallarm كحل Out-of-Band على AWS. من المتوقع أن يوفر NGINX، Envoy، Istio و/أو Traefik تحويلات للحركة.

## الخصائص الأساسية

* Wallarm يوفر معالجة الحركة في وضع غير متزامن (`preset=mirror`) دون التأثير على تدفق الحركة الحالي، مما يجعل هذا النهج أكثر أمانًا.
* حل Wallarm يتم نزيله كطبقة شبكة مستقلة يمكن التحكم بها بشكل منفصل عن طبقات الشبكة الأخرى، وهذا يمكنك من وضع هذه الطبقة في تقريبًا أي موقع من مواقع الشبكة. الموقع الموصى به هو داخل الشبكة الخاصة.

## هندسة الحل

![Wallarm لحركة المرور المعكوسة](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

حل Wallarm الموضح في هذا المثال يشمل المكونات التالية:

* توجيه حركة المرور إلى مثيلات عقد Wallarm من خلال موازنة الحمل المواجهة للإنترنت. يُفترض أن موازن الحمل قد تم نشره بالفعل، والموديل `wallarm` لا يقوم بإنشاء هذا المورد.
* أي خادم ويب أو بروكسي (مثل NGINX، Envoy) يقدم حركة المرور من موازن الحمل ويقوم بتحويل الطلبات الواردة إلى نهاية نقطة ALB الداخلية والخدمات الخلفية. يُفترض أن المكون المستخدم لتحويل حركة المرور قد تم نشره بالفعل، والموديل `wallarm` لا يقوم بإنشاء هذا المورد.
* ALB الداخلية التي تقبل الطلبات المعكوسة من الخادم الويب أو بروكسي وترسلها إلى مثيلات عقد Wallarm.
* عقد Wallarm تحلل الطلبات الواردة من ALB الداخلية وترسل بيانات حركة المرور الخبيثة إلى سحابة Wallarm.

   في هذا المثال، تُشغّل العقد في وضع المراقبة. تغيير [الوضع](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) إلى قيمة أخرى لا يؤدي إلى تغيير في السلوك لأن النهج [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) لا يسمح بحجب الهجمات.

المكونين الأخيرين يتم نشرهما بواسطة موديل `wallarm` المقدم.

## مكونات الكود

هذا المثال يشمل المكونات التالية للكود:

* `main.tf` : الإعدادات الرئيسية لموديل `wallarm` المستخدم كحل لتحويل الحركة. هذه الإعدادات تنتج ALB داخلي ومثيلات لعقد Wallarm.

## إعداد تحويل الطلبات HTTP

تحويل حركة المرور هو ميزة يوفرها العديد من خوادم الويب والبروكسي. [الرابط](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring) يوفر توثيقًا حول كيفية إعداد تحويل حركة المرور على بعض الخوادم.

## القيود

على الرغم من كون الحل الموضح في هذا المثال هو الحل الأكثر فعالية لـ Out-of-Band Wallarm، هناك بعض القيود الخاصة بالنهج غير المتزامن:

* تحليل حركة المرور يتقدم بغض النظر عن تدفق الحركة الفعلي، لذا عقد Wallarm لا تحجب الطلبات الخبيثة فورًا.
* هذا الحل يتطلب مكونات إضافية، مثل خوادم ويب أو بروكسي توفر تحويل حركة المرور أو أدوات مماثلة (مثل NGINX، Envoy، Istio، Traefik، وحدات Kong المخصصة، إلخ).

## تشغيل مثال حل Wallarm مع تحويل الحركة

1. اشترك في وحدة تحكم Wallarm من [EU Cloud](https://my.wallarm.com/nodes) أو [US Cloud](https://us1.my.wallarm.com/nodes).
1. افتح وحدة التحكم → **Nodes** وأنشئ عقدة من نوع **Wallarm node**.
1. انسخ رمز العقدة المنشأ.
1. انسخ مستودع الأمثلة إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. في ملف `examples/mirror/variables.tf` بالمستودع المنسوخ، اضبط قيم المتغيرات باستخدام خيار `default` واحفظ التغييرات.
1. من داخل الدليل `examples/mirror`، قم بتنفيذ الأوامر التالية لتنزيل البنية التحتية:

    ```
    terraform init
    terraform apply
    ```

لحذف البيئة المنشورة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [VPC AWS مع شبكة فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)