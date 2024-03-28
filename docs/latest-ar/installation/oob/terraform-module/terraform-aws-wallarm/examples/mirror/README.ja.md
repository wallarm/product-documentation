# استخدام وحدات Terraform لنشر حل Wallarm OOB لـ NGINX وEnvoy والمرايا المماثلة

تعرض هذه المقالة **مثالًا** على استخدام [وحدات Terraform من Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/) لنشر Wallarm كحل Out-of-Band في AWS. يُتوقع من NGINX وEnvoy وIstio و/أو Traefik تقديم ميزة مرايا الحركة.

## الخصائص الرئيسية

* يعالج Wallarm الحركة في وضع غير متزامن (`preset=mirror`) دون التأثير على تدفق الحركة الحالي، ما يجعل هذا النهج الأكثر أمانًا.
* يُنشر حل Wallarm كطبقة شبكية منفصلة يمكن التحكم بها بشكل مستقل عن الطبقات الأخرى، ويمكن وضع هذه الطبقة في مواقع تقريبًا أي بنية شبكية. الموقع الموصى به هو في الشبكة الخاصة.

## هيكل الحل

![Wallarm للحركة المرآية](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

يشمل حل Wallarm في هذا المثال على المكونات التالية:

* موازن الحمل الذي يواجه الإنترنت يقوم بتوجيه الحركة إلى مثيلات عقدة Wallarm. يُفترض أن موازن الحمل قد تم نشره بالفعل، ولا تقوم وحدة `wallarm` بإنشاء هذا المورد.
* أي خادم ويب أو وكيل يقدم الحركة من موازن الحمل ويعكس طلبات HTTP إلى نقاط النهاية الداخلية ALB وخدمات الخلفية (مثل: NGINX، Envoy). يُفترض أن الأجزاء المستخدمة في مرايا الحركة قد تم نشرها مسبقًا، ولا تقوم وحدة `wallarm` بإنشاء هذا المورد.
* ALB الداخلي الذي يقبل طلبات HTTPS المعكوسة من خادم الويب أو الوكيل ويعيد توجيهها إلى مثيلات عقدة Wallarm.
* عقدة Wallarm التي تحلل الطلبات من ALB الداخلي وترسل بيانات الحركة الخبيثة إلى سحابة Wallarm.

    في هذا المثال، يتم تشغيل عقدة Wallarm في وضع المراقبة كما هو موضح. تغيير [الوضع](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) إلى قيمة أخرى سيستمر في مراقبة الحركة حيث لا يسمح النهج [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) بمنع الهجمات.

يتم نشر آخر مكونين بواسطة وحدة `wallarm` المُقدمة كمثال.

## مكونات الكود

يحتوي هذا المثال على المكونات الكودية التالية:

* `main.tf`: الإعداد الرئيسي لوحدة `wallarm` التي يتم نشرها كحل للمرايا. هذا الإعداد يولد ALB الداخلي ومثيلات Wallarm.

## إعداد مرايا طلبات HTTP

مرايا الحركة هي ميزة يوفرها العديد من خوادم ويب والوكلاء. [الرابط](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring) يقدم وثائق حول كيفية إعداد مرايا الحركة في بعض الخوادم.

## القيود

بالرغم من أن الحل المقدم في المثال هو الأكثر فعالية من حيث وظائف حلول Wallarm Out-of-Band، فهناك بعض القيود المتأصلة في النهج غير المتزامن:

* التحليل الحركي يتقدم بغض النظر عن تدفق الحركة الفعلي، فلن تقوم عقدة Wallarm بحظر الطلبات الضارة على الفور.
* هذا الحل يتطلب مكونات إضافية، وهي خادم ويب أو وكيل يوفر مرايا الحركة أو أدوات مماثلة (مثل: NGINX، Envoy، Istio، Traefik، وحدات Kong المخصصة، إلخ).

## تشغيل حل Wallarm المثالي للمرايا

1. سجل الدخول إلى وحدة تحكم Wallarm عبر [السحابة الأوروبية](https://my.wallarm.com/nodes) أو [السحابة الأمريكية](https://us1.my.wallarm.com/nodes).
2. افتح وحدة تحكم Wallarm → **Nodes** وأنشئ عقدة من نوع **Wallarm node**.
3. انسخ رمز العقدة المُنشأ.
4. انسخ مستودع الأمثلة إلى جهازك:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
5. في ملف `examples/mirror/variables.tf` للمستودع الذي قمت بنسخه، ضع قيم الخيارات الافتراضية للمتغيرات واحفظ التغييرات.
6. نفذ الأوامر التالية من داخل مجلد `examples/mirror` لنشر البنية:


    ```
    terraform init
    terraform apply
    ```

لحذف البيئة المنشورة، استخدم الأمر التالي:

```
terraform destroy
```

## المراجع

* [AWS VPC مع شبكات فرعية عامة وخاصة (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)