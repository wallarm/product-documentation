# نشر Wallarm على AWS باستخدام Terraform

توفر Wallarm [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/) لنشر العقدة إلى [AWS](https://aws.amazon.com/) من البيئة المتوافقة مع Terraform. استخدم هذه التعليمات لاستكشاف الوحدة وتجربة أمثلة النشر المقدمة.

عن طريق تنفيذ وحدة Terraform الخاصة بـ Wallarm ، قدمنا الحل الذي يتيح خيارين أساسيين لنشر Wallarm: **[داخل الخط](../../../inline/overview.md) (الذي هو الوكيل في هذه طريقة النشر)** وحلول الأمان [**Out‑of‑band (mirror)**](../../../oob/overview.md). يتم التحكم بسهولة في خيار النشر عبر متغير وحدة Wallarm `preset`.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm](../../../supported-deployment-options.md) المدعومة ، يوصى بوحدة Terraform لنشر Wallarm في هذه الحالات:

* بنية البيانات الحالية موجودة على AWS.
* أنت تستفيد من ممارسة البنية كرمز (IaC). تتيح وحدة Terraform الخاصة بـ Wallarm إدارة وتوفير العقدة Wallarm تلقائيًا على AWS ، مما يعزز الكفاءة والاتساق.

## المتطلبات

* ترا كوبكوب 1.0.5 أو أعلى [مثبت محليًا](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بدور **مسؤول** [الدور](../../../../user-guides/settings/users.md#user-roles) في Wallarm Console في الولايات المتحدة أو السحابة الأوروبية [السحابة](../../../../about-wallarm/overview.md#cloud)
* الوصول إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع السحابة الأمريكية Wallarm أو إلى `https://api.wallarm.com` إذا كنت تعمل مع السحابة الأوروبية Wallarm. يرجى التأكد من عدم حظر الوصول بواسطة جدار حماية

لن يتضمن هذا الموضوع تعليمات لإنشاء جميع موارد AWS اللازمة لنشر Wallarm, مثل عنقود VPC. للحصول على التفاصيل, يرجى الرجوع إلى [دليل Terraform](https://learn.hashicorp.com/tutorials/terraform/module-use) ذات الصلة.

## كيفية استخدام وحدة Terraform AWS Wallarm؟

لنشر Wallarm للإنتاج باستخدام وحدة Terraform AWS:

1. سجل للحصول على Wallarm Console في [US Cloud](https://us1.my.wallarm.com/signup) أو [EU Cloud](https://my.wallarm.com/signup).
1. قم بفتح Wallarm Console → **العقد** وأنشئ العقدة من نوع **العقدة Wallarm**.

   ![خلق العقدة Wallarm](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. انسخ الرمز المميز للعقدة المنشأ.
1. أضف كود الوحدة `wallarm` إلى تكوين Terraform الخاص بك:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      instance_type = "..."

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."
      token      = "..."

      ...
    }
    ```
1. قم بتعيين قيم المتغير في تكوين الوحدة `wallarm` :

| المتغير  | الوصف | النوع | مطلوب؟ |
| --------- | ----------- | --------- | --------- |
| `instance_type` | [نوع مثيل EC2 من Amazon](https://aws.amazon.com/ec2/instance-types/) لاستخدامه لنشر Wallarm ، على سبيل المثال: `t3.small`. | سلسلة | نعم
| `vpc_id` | [معرف Amazon Virtual Private Cloud](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html) لنشر مثيل Wallarm EC2 لـ. | سلسلة | نعم
| `token` | [رمز العقدة Wallarm](../../../../user-guides/nodes/nodes.md#creating-a-node)المنسوخ من واجهة المستخدم UI لـ Wallarm Console.<br><div class="admonition info"> <p class="admonition-title">استخدام رمز واحد للعديد من التثبيتات</p> <p> يمكن استخدام نفس الرمز في عدة عمليات تثبيت بغض النظر عن المنصة [المنصة](../../../../installation/supported-deployment-options.md) المحددة. وهو ما يتيح تجميعاً منطقياً لمثيلات العقدة في  واجهة المستخدم بـ Wallarm Console. على سبيل المثال: تقوم بنشر العديد من عقد Wallarm إلى بيئة التطوير ، وكل عقدة تكون على جهاز خاص بها تملكه مطور معين. </p></div> | سلسلة | نعم
| **المتغيرات الخاصة بـ Wallarm** | | | |
| `host` | [سيرفر API Wallarm](../../../../about-wallarm/overview.md#cloud). القيم الممكنة:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul> بشكل افتراضي ، `api.wallarm.com`. | سلسلة | لا
`upstream` | [نسخة عقدة Wallarm](../../../../updating-migrating/versioning-policy.md#version-list) لتكون معتمدة. الحد الأدنى المدعوم من الإصدارات هو `4.0`.<br> <br> بشكل افتراضي ، `4.8`. | سلسلة | لا
| `preset` | مخطط نشر Wallarm. القيم الممكنة:<ul><li>`proxy`</li><li>`mirror`</li></ul>بشكل افتراضي ، `proxy`. | سلسلة | لا
| `proxy_pass` | بروتوكول الخادم المكدس والعنوان. ستقوم العقدة Wallarm بمعالجة الطلبات المرسلة إلى العنوان المحدد وتكدس المشروعات الشرعية أيضًا. يمكن تحديد "http" أو "https" كبروتوكول. يمكن تحديد العنوان كاسم نطاق أو عنوان IP ، ومنفذ اختياري. | سلسلة | نعم، إذا كان `preset` هو `proxy`
| `mode` | [وضع تصفية المرور](../../../../admin-en/configure-wallarm-mode.md). القيم الممكنة: `off` ، `monitoring` ، `safe_blocking` ، `block`.<br><br> بشكل افتراضي ، `monitoring`. | سلسلة | لا
|`libdetection` | ما إذا كان يجب [استخدام مكتبة libdetection](../../../../about-wallarm/protecting-against-attacks.md#library-libdetection) خلال تحليل المرور.<br><br>بشكل افتراضي ، `true`. | منطقي | لا
|`global_snippet` | التهيئة المخصصة لتضاف إلى التهيئة العالمية لـ NGINX. يمكنك وضع الملف مع التهيئة في دليل الشيفرة Terraform وتحديد المسار إلى هذا الملف في هذا المتغير.<br><br>ستجد مثالًا على التهيئة المتغيرة في [مثال تنفيذ الحل المتقدم للكدس](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17). | سلسلة | لا
|`http_snippet` | التهيئة المخصصة لتضاف إلى مربع التكوين `http` لـ NGINX. يمكنك وضع الملف مع التهيئة في دليل الشيفرة Terraform وتحديد المسار إلى هذا الملف في هذا المتغير.<br><br>ستجد مثالًا على التهيئة المتغيرة في [مثال تنفيذ الحل المتقدم للكدس](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18). | سلسلة | لا
|`server_snippet` | التهيئة المخصصة لتضاف إلى مربع التكوين `server` لـ NGINX. يمكنك وضع الملف مع التهيئة في دليل الشيفرة Terraform وتحديد المسار إلى هذا الملف في هذا المتغير.<br><br> ستجد مثالًا على التهيئة المتغيرة في [مثال تنفيذ الحل المتقدم للكدس](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19). | سلسلة | لا
|`post_script` | النص البرمجي المخصص لتشغيله بعد ال [نص البرمجي للتهيئة الأولية للعقدة Wallarm (`cloud-init.py`)](../../cloud-init.md). يمكنك وضع الملف مع أي نص برمجي في دليل الشيفرة Terraform وتحديد المسار إلى هذا الملف في هذا المتغير.<br><br>ستجد مثالًا على التهيئة المتغيرة في [مثال تنفيذ الحل المتقدم للكدس](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34). | سلسلة | لا
| **تكوين النشر AWS** | | | |
| `app_name` | بادئة لأسماء موارد AWS التي ستنشئها وحدة Wallarm.<br><br>بشكل افتراضي ، `wallarm`. | سلسلة | لا
| `app_name_no_template` | ما إذا كان يجب استخدام الأحرف الكبيرة والأرقام والأحرف الخاصة في أسماء موارد AWS التي ستنشئها وحدة Wallarm. إذا كان `false` ، فإن أسماء الموارد ستتضمن أحرفًا صغيرة فقط.<br><br>بشكل افتراضي ، `false`. | منطقي | لا
| `lb_subnet_ids` | [قائمة معرفات الشبكات الفرعية لـ AWS Virtual Private Cloud](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html) لنشر ميزان تحميل التطبيق فيها. القيمة المستحسنة هي الشبكات الفرعية العامة المرتبطة بجدول المسار الذي يحتوي على مسار إلى بوابة الإنترنت. | list(string) | لا
| `instance_subnet_ids` | [قائمة معرفات الشبكات الفرعية لـ AWS Virtual Private Cloud](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html) لنشر مثيلات Wallarm EC2 فيها. القيمة الموصى بها هي الشبكات الفرعية الخاصة المكونة للاتصالات الخروجية فقط. | list(string) | لا
| `lb_enabled` | ما إذا كان يجب إنشاء ميزان تحميل تطبيق AWS. سيتم إنشاء مجموعة هدف بأي قيمة تم تمريرها في هذا المتغير ما لم يتم تحديد مجموعة هدف مخصصة في المتغير `custom_target_group`.<br><br>بشكل افتراضي ، `true`. | منطقي | لا
| `lb_internal` | هل يجب جعل ميزان تحميل التطبيق [ميزان تحميل داخلي](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html). بشكل افتراضي ، تكون ALB من النوع الذي يواجه الإنترنت.  إذا كنت تستخدم النهج غير المتزامن للتعامل مع الاتصالات ، فالقيمة الموصى بها هي `true`.<br><br>بشكل افتراضي ، `false`. | منطقي | لا
| `lb_deletion_protection` | هل يجب تمكين الحماية لمنع [ميزان تحميل التطبيق من الحذف عن طريق الخطأ](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection). بالنسبة لعمليات النشر الإنتاجية ، فإن القيمة الموصى بها هي `true`.<br><br>بشكل افتراضي ، `true`. | منطقي | لا
| `lb_ssl_enabled` | هل يجب [التفاوض على اتصالات SSL](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) بين العميل ومتوازن التحميل التطبيق. إذا كان `true` ، فيتطلب متغيران `lb_ssl_policy` و `lb_certificate_arn`. يوصى به لعمليات النشر الإنتاجية.<br><br>بشكل افتراضي ، `false`. | منطقي | لا
| `lb_ssl_policy` | [سياسة الأمان لميزان تحميل التطبيق](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies). | سلسلة | نعم، إذا كان `lb_ssl_enabled` هو `true`
| `lb_certificate_arn` | [اسم المورد الأمازون (ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) للشهادة ACM (AWS Certificate Manager). | سلسلة | نعم، إذا كان `lb_ssl_enabled` هو `true`
| `custom_target_group` | اسم المجموعة الهدف الموجودة لـ [إرفاقها بالمجموعة Auto Scaling المنشأة](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html). بشكل افتراضي ، سيتم إنشاء مجموعة هدف جديدة وإرفاقها. إذا كانت القيمة غير الافتراضية ، سيتم تعطيل إنشاء ALB من AWS. | سلسلة | لا
| `inbound_allowed_ip_ranges` | قائمة بعناوين IP المصدر والشبكات للسماح بالاتصالات الداخلية من المثيلات Wallarm. يرجى الاحتفاظ في الاعتبار أن AWS تقنع حركة مرور ميزان التحميل حتى لو كانت تنشأ من الشبكات الفرعية العامة.<br><br>بشكل افتراضي:<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | لا
| `outbound_allowed_ip_ranges` | قائمة بعناوين IP المصدر والشبكات للسماح بالاتصالات الخارجية من مثيل Wallarm باتجاهها.<br><br>بشكل افتراضي: `"0.0.0.0/0"`. | list(string) | لا
| `extra_ports` | قائمة بالمنافذ الإضافية الداخلية للشبكة للسماح بالاتصالات الداخلية من المثيلات Wallarm. سيتم تطبيق التكوين على مجموعة الأمان. list(number) | لا
| `extra_public_ports` | قائمة بالمنافذ الإضافية للشبكة العامة للسماح بالاتصالات الداخلية من المثيلات Wallarm.| list(number) | لا
| `extra_policies` | سياسات IAM لـ AWS ترتبط مع Wallarm الكومة. أمر يمكن أن يكون مفيدًا أن تستخدم مع متغير `post_script` التي تعمل السيناريو الذي يطلب البيانات من Amazon S3. | list(string) | لا
| `source_ranges` | قائمة بعناوين IP المصدر والشبكات للسماح باتصال ميزان تحميل التطبيق AWS منهم.<br><br>بشكل افتراضي ، `"0.0.0.0/0"`. | list(string) | لا
| `https_redirect_code` | رمز لتوجيه الطلب HTTP إلى HTTPS. القيم الممكنة: <ul><li>`0` - التوجيه معطل</li><li>`301` - توجيه دائم</li><li>`302` - توجيه مؤقت</li></ul>بشكل افتراضي ، `0`. | رقم | لا
| `asg_enabled` | هل يجب إنشاء [مجموعة Auto Scaling من AWS](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html).<br><br>بشكل افتراضي ، `true` | منطقي | لا
| `min_size` | الحد الأدنى لعدد المثيلات في مجموعة Auto Scaling من AWS التي تم إنشاؤها.<br><br>بشكل افتراضي ، `1`. | رقم | لا
| `max_size` | الحد الأقصى لعدد المثيلات في مجموعة Auto Scaling من AWS التي تم إنشاؤها.<br><br>بشكل افتراضي ، `3`. | رقم | لا
| `desired_capacity` | العدد الأولي للمثيلات في مجموعة Auto Scaling من AWS التي تم إنشاؤها. يجب أن يكون أكبر من أو يساوي `min_size` وأقل من أو يساوي `max_size`.<br> <br> بشكل افتراضي ، `1`. | رقم | لا
| `autoscaling_enabled` | ما إذا كان يجب تمكين [توسيع التوازن التلقائي EC2 Amazon](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) لكومة Wallarm.<br><br>بشكل افتراضي ، `false`. | منطقي | لا
| `autoscaling_cpu_target` | متوسط نسبة استخدام وحدة المعالجة المركزية للحفاظ على مجموعة Auto Scaling من AWS فيها. بشكل افتراضي ، `70.0`. | سلسلة | لا
| `ami_id` | [معرف Amazon Machine Image](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html) الذي سيتم استخدامه لنشر مثيل Wallarm. بشكل افتراضي (السلسلة الفارغة) ، يتم استخدام أحدث صورة من المصدر المرجعي. أنت مرحب بك لإنشاء AMI مخصص استنادًا إلى العقدة Wallarm. | سلسلة | لا
| `key_name` | اسم [زوج المفاتيح AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) الذي سيتم استخدامه للاتصال بالعقد Wallarm عبر SSH. بشكل افتراضي ، يتم تعطيل اتصال SSH. | سلسلة | لا
| `tags` | الوسوم لموارد AWS التي ستنشئها وحدة Wallarm.| خريطة (السلسلة) | لا

## تجربة وحدة Wallarm Terraform مع الأمثلة

لقد أعددنا أمثلة على طرق مختلفة لاستخدام وحدة Wallarm ، حتى تتمكن من تجربة ذلك قبل نشره في البيئة الإنتاجية:

* [الوكيل في AWS VPC](proxy-in-aws-vpc.md)
* [الوكيل لـ API Gateway من أمازون](proxy-for-aws-api-gateway.md)
* [OOB لـ NGINX ، Envoy أو تطابق المرايا](oob-for-web-server-mirroring.md)

## مزيد من المعلومات حول Wallarm و Terraform

تدعم Terraform العديد من التكاملات (موفري الخدمة) وتكوينات جاهزة للاستخدام (وحدات) متاحة للمستخدمين عبر السجل [السجل](https://www.terraform.io/registry#navigating-the-registry) العام الذي يتم تعبئته من قبل العديد من البائعين.

إلى هذا السجل ، نشر Wallarm:

* ال [وحدة Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/) لنشر العقدة إلى AWS من البيئة المتوافقة مع Terraform. موضوع هذه المقالة.
* ال [موفر Wallarm](../../../../admin-en/managing/terraform-provider.md) لإدارة Wallarm عبر Terraform.

هؤلاء الاثنان عبارة عن عناصر مستقلة تُستخدم لأغراض مختلفة ولا تتطلب بعضها البعض.

## القيود 
* يتعذر حالياً [اكتشاف تحقق من البيانات الاعتماد](../../../../about-wallarm/credential-stuffing.md)
