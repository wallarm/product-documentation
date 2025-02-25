# نشر Wallarm على AWS باستخدام Terraform

تقدم Wallarm [وحدة Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/) لنشر العقدة على [AWS](https://aws.amazon.com/) من بيئة متوافقة مع Terraform. استخدم هذه التعليمات لاستكشاف الوحدة وتجربة أمثلة النشر المقدمة.

من خلال تنفيذ وحدة Terraform الخاصة بـ Wallarm ، قدمنا الحل الذي يتيح خيارين رئيسيين لنشر Wallarm: خيارات الأمان **[داخل الخط](../../../inline/overview.md) (التي تعتبر proxy في هذه الطريقة النشر)** و [**خارج النطاق (mirror)**](../../../oob/overview.md). يتم التحكم بسهولة في خيار النشر بواسطة متغير الوحدة `preset` الخاص بـ Wallarm.

## حالات الاستخدام

من بين جميع خيارات نشر Wallarm المدعومة [Wallarm deployment options](../../../supported-deployment-options.md)، يُنصح بوحدة Terraform لنشر Wallarm في هذه **حالات الاستخدام**:

* البنية التحتية الحالية لك تقع على AWS.
* تستفيد من ممارسة البنية كشفرة (IaC). تسمح وحدة Wallarm's Terraform بالإدارة التلقائية والتوفير للعقدة Wallarm على AWS ، مما يعزز الكفاءة والاتساق.

## المتطلبات 

* تثبيت Terraform 1.0.5 أو أعلى [على المستوى المحلي](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* الوصول إلى الحساب بـ **الدور** [المشرف](../../../../user-guides/settings/users.md#user-roles) في Wallarm Console في الولايات المتحدة أو السحابة الأوروبية [Cloud](../../../../about-wallarm/overview.md#cloud)
* الوصول إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع US Wallarm Cloud أو إلى `https://api.wallarm.com` إذا كنت تعمل مع EU Wallarm Cloud. يرجى التأكد من أن الوصول غير محظور بواسطة جدار الحماية

لا يتضمن هذا الموضوع تعليمات لإنشاء جميع موارد AWS اللازمة لنشر Wallarm ، مثل مجموعة VPC. للحصول على التفاصيل، راجع الدليل ذو الصلة [دليل Terraform](https://learn.hashicorp.com/tutorials/terraform/module-use).

## كيفية استخدام وحدة Wallarm AWS Terraform؟

لنشر Wallarm للإنتاج باستخدام وحدة AWS Terraform:

1. اشترك في Wallarm Console في [US Cloud](https://us1.my.wallarm.com/signup) أو [EU Cloud](https://my.wallarm.com/signup).
2. افتح Wallarm Console → **Nodes** وأنشئ العقدة من نوع **Wallarm node**.

![إنشاء عقدة Wallarm](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
3. انسخ رمز العقدة المُستخدم.
4. أضف كود الوحدة `wallarm` إلى تكوين Terraform الخاص بك:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      instance_type = "..."

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."
      token      = "..."

      
    }
    ```
5. قم بتعيين قيم المتغير في تكوين الوحدة `wallarm`:

| المتغير  | الوصف | النوع | مطلوب؟ |
| --------- | ----------- | --------- | --------- |
| `instance_type` | [نوع العينة Amazon EC2](https://aws.amazon.com/ec2/instance-types/) المستخدم لنشر Wallarm، مثلاً: `t3.small`. | string | نعم |
| `vpc_id` | [ID of the AWS Virtual Private Cloud](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html) لنشر Wallarm EC2 العينة. | string | نعم
| `token` | [رمز عقدة Wallarm](../../../../user-guides/nodes/nodes.md#creating-a-node) تم نسخه من واجهة UI لوحة تحكم Wallarm.<br><div class="admonition info"> <p class="admonition-title">استخدام رمز واحد لعدد من التثبيتات</p> <p>يمكنك استخدام هذا الرمز في عدة تثبيتات بغض النظر عن [المنصة](../../../../installation/supported-deployment-options.md) المختارة. يسمح ذلك بتجميع منطقي لعينات العقدة في واجهة UI لوحة تحكم Wallarm. مثال: يمكنك نشر عدة عقد Wallarm إلى بيئة التطوير، كل عقدة على جهازها الخاص المملوكة لمطور معين.</p></div> | string | نعم
| **متغيرات Wallarm ذات الصلة** | | | |
| `host` | [سيرفر API لـ Wallarm](../../../../about-wallarm/overview.md#cloud). القيم الممكنة:<ul><li>`us1.api.wallarm.com` لـ US Cloud</li><li>`api.wallarm.com` لـ EU Cloud</li></ul> بشكل افتراضي، `api.wallarm.com`. | string | لا
| `upstream` | [إصدار عقدة Wallarm](../../../../updating-migrating/versioning-policy.md#version-list) التي ستُنشر. الحد الأدنى المدعوم هو `4.0`.<br><br>بشكل افتراضي, `4.8`. | string | لا
| `preset` | مخطط نشر Wallarm. القيم الممكنة:<ul><li>`proxy`</li><li>`mirror`</li></ul> بشكل افتراضي، `proxy`. | string | لا
| `proxy_pass` | بروتوكول الخادم الذي تم توجيهه والعنوان. ستعالج العقدة Wallarm الطلبات المرسلة إلى العنوان المحدد وستكون شرعية لتوجيهها إلى. يمكن تحديد 'http' أو 'https' كبروتوكول. يمكن تحديد العنوان بواسطة اسم النطاق أو عنوان IP، ومنفذ اختياري. | string | نعم، إذا كان `preset` هو `proxy`
| `mode` | [وضع تصفية حركة المرور](../../../../admin-en/configure-wallarm-mode.md). القيم الممكنة: `off`, `monitoring`, `safe_blocking`, `block`.<br><br>بشكل افتراضي، `monitoring`. | string | لا
|`libdetection` | سواء كانت النية هي [استخدام مكتبة الكشف](../../../../about-wallarm/protecting-against-attacks.md#library-libdetection) خلال تحليل حركة المرور.<br><br>بشكل افتراضي، `true`. | bool |لا
|`global_snippet` | التكوين المخصّص الذي سيتم إضافته إلى التكوين العالمي لـ NGINX. يمكنك وضع الملف الذي يحتوي على التكوين في دليل كود Terraform وتحديد المسار إلى هذا الملف في هذا المتغير.<br><br>ستجد مثالاً على تكوين المتغير في [المثال على نشر الحل الأكثر تقدمًا للـ proxy](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17). | string | لا
|`http_snippet` | التكوين المخصص الذي سيتم إضافته إلى القسم `http` في تكوين NGINX. يمكنك وضع الملف الذي يحتوي على التكوين في دليل كود Terraform وتحديد المسار إلى هذا الملف في هذا المتغير.<br><br>ستجد مثالاً على تكوين المتغير في [المثال على نشر الحل الأكثر تقدمًا للـ proxy](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18). | string | لا
|`server_snippet` | التكوين المخصّص الذي سيتم إضافته إلى القسم `server` في تكوين NGINX. يمكنك وضع الملف الذي يحتوي على التكوين في دليل كود Terraform وتحديد المسار إلى هذا الملف في هذا المتغير<br><br>ستجد مثالاً على تكوين المتغير في [المثال على نشر الحل الأكثر تقدمًا للـ proxy](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19). | string | لا
|`post_script` | البرنامج النصي المخصص الذي سيتم تشغيله بعد [سكريبت تهيئة العقدة Wallarm (`cloud-init.py`)](../../cloud-init.md). يمكنك وضع الملف الذي يحتوي على أي سكريبت في دليل كود Terraform وتحديد المسار إلى هذا الملف في هذا المتغير.<br><br>ستجد مثالاً على تكوين المتغير في [المثال على نشر الحل الأكثر تقدمًا للـ proxy](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34). | string | لا
| **تكوين النشر على AWS** | | | |
| `app_name` | بادئة لأسماء موارد AWS التي ستنشئها وحدة Wallarm.<br><br>بشكل افتراضي، `wallarm`. | string | لا
| `app_name_no_template` | سواء أم لا استخدام أحرف كبيرة، أرقام وأحرف خاصة في أسماء الموارد AWS التي ستنشئها وحدة Wallarm. إذا كان `false`، فإن أسماء الموارد ستتضمن فقط أحرف صغيرة.<br><br>بشكل افتراضي، `false`. | bool | لا
| `lb_subnet_ids` | [قائمة أرقام تعريف فرعيات شبكة الخصوصية الافتراضية AWS](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html) لنشر موزع الحمولة التطبيقي في. القيمة المستحسنة هي الفرعيات العامة المرتبطة بجدول الطرق الذي يحتوي على طريق إلى بوابة الإنترنت. | list(string) | لا
| `instance_subnet_ids` | [قائمة أرقام تعريف فرعيات شبكة الخصوصية الافتراضية AWS](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html) لنشر عينات Wallarm EC2 في. القيمة المستحسنة هي الفرعيات الخاصة المكونة للاتصالات الخروج فقط. | list(string) | لا
| `lb_enabled` | سواء كان من المقرر إنشاء موزع حمولة تطبيق AWS. ستتم إنشاء مجموعة هدف مع أي قيمة ممرة في هذا المتغير إلا إذا تم تحديد مجموعة هدف مخصصة في المتغير `custom_target_group`.<br><br>بشكل افتراضي، `true`. | bool | لا
| `lb_internal` | سواء كان من المقرر جعل موزع الحمولة التطبيقي [موزع حمولة داخلي](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html). بشكل افتراضي، ALB لديه نوع يواجه الإنترنت. إذا كنت تستخدم النهج غير المتزامن للتعامل مع الاتصالات، فالقيمة الموصى بها هي `true`.<br><br>بشكل افتراضي، `false`. | bool | لا
| `lb_deletion_protection` | سواء كان من المقرر تمكين الحماية لـ [موزع الحمولة التطبيقي ليتم منع حذفه بطريق الخطأ](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection). لنشرات التطبيقات الإنتاجية، القيمة المستحسنة هي `true`.<br><br>بشكل افتراضي، `true`. | bool | لا
| `lb_ssl_enabled` | سواء كان من المقرر [تفاوض اتصالات SSL](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) بين عميل وموزع حمولة التطبيق. إذا كان `true`، فإن المتغيرات `lb_ssl_policy` و `lb_certificate_arn` مطلوبة. يُنصح بذلك للنشرات الإنتاجية.<br><br>بشكل افتراضي، `false`. | bool | لا
| `lb_ssl_policy` | [سياسة الأمان لموزع الحمولة التطبيقي](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies). | string | نعم، إذا كان `lb_ssl_enabled` هو `true`
| `lb_certificate_arn` | [اسم المورد الأمازون (ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) من الشهادة ACM (AWS Certificate Manager) . | string | نعم، إذا كان `lb_ssl_enabled` هو `true`
| `custom_target_group` | اسم المجموعة الهدف الحالي لـ [ مرفق للمجموعة المتمددة تلقائيًا المُنشأة](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html). بشكل افتراضي، ستتم إنشاء مجموعة هدف جديدة والمرفقة. إذا كانت القيمة غير الافتراضية، سيتم تعطيل إنشاء ALB. | string | لا
| `inbound_allowed_ip_ranges` | قائمة عناوين IP المصدر والشبكات للسماح باتصالات الداخلية إلى عينات Wallarm من. يرجى مراعاة أن AWS تقنع بحركة مرور موزع الحمولة حتى لو كان مصدرها من الفرعيات العامة.<br><br>بشكل افتراضي:<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | لا
| `outbound_allowed_ip_ranges` | قائمة عناوين IP المصدر والشبكات للسماح باتصالات الخروج من عينة Wallarm.<br><br>بشكل افتراضي: `"0.0.0.0/0"`. | list(string) | لا
| `extra_ports` | قائمة أرقام البرامج النصية الإضافية داخل الشبكة للسماح باتصالات الداخلية إلى عينات Wallarm من. سيتم تطبيق التكوين على مجموعة الأمان. | list(number) | لا
| `extra_public_ports` | قائمة أرقام البرامج النصية الإضافية في الشبكة العامة للسماح باتصالات الداخلية إلى عينات Wallarm من.| list(number) | لا
| `extra_policies` | سياسات IAM AWS التي سيتم ربطها بستك Wallarm. يمكن أن يكون من المفيد استخدامها مع متغير `post_script` والذي يعمل سكريبت يطالب ببيانات من Amazon S3. | list(string) | لا
| `source_ranges` | قائمة عناوين IP المصدر والشبكات للسماح بحركة مرور موزع حمولة التطبيق AWS من.<br><br>بشكل افتراضي، `"0.0.0.0/0"`. | list(string) | لا
| `https_redirect_code` | كود لإعادة توجيه الطلب HTTP إلى HTTPS. القيم الممكنة: <ul><li>`0` - التوجيه معطل</li><li>`301` - إعادة توجيه دائمة</li><li>`302` - إعادة توجيه مؤقتة</li></ul>بشكل افتراضي،  `0`. | number | لا
| `asg_enabled` | سواء كان من المقرر إنشاء [مجموعة توسيع تلقائي AWS](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html).<br><br>بشكل افتراضي، `true` | bool | لا
| `min_size` | العدد الأدنى من العينات في المجموعة المتمددة تلقائياً المنشأة AWS.<br><br>بشكل افتراضي، `1`.| number | لا
| `max_size` | العدد الأقصى من العينات في المجموعة المتمددة تلقائياً المنشأة AWS.<br><br>بشكل افتراضي، `3`.| number | لا
| `desired_capacity` | العدد الأولي من العينات في المجموعة المتمددة تلقائياً المنشأة AWS. يجب أن يكون أكبر من أو مساويًا لـ `min_size` وأقل من أو مساويًا لـ `max_size`.<br><br>بشكل افتراضي، `1`.| number | لا
| `autoscaling_enabled` | سواء كان من المقرر تمكين [Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) لكتلة Wallarm.<br><br>بشكل افتراضي، `false`. | bool | لا
| `autoscaling_cpu_target` | النسبة المئوية المتوسطة لاستخدام الوحدة المركزية للمعالجة للحفاظ على المجموعة المتمددة تلقائياً AWS عند. بشكل افتراضي، `70.0`. | string | لا
| `ami_id` | [رمز تعريف الصورة الأمازون](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html) الذي سيُستخدم لنشر Wallarm. بشكل افتراضي (سلسلة فارغة)، يتم استخدام الصورة الأخيرة من المصدر. أنت مدعو لإنشاء AMI مخصصة على أساس العقدة Wallarm. | string | لا
| `key_name` | اسم [زوج مفاتيح AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) الذي سيُستخدم للاتصال بـ Wallarm عبر SSH. بشكل افتراضي، الاتصال عبر SSH معطل. | string | لا
| `tags` | الوسوم لموارد AWS التي ستنشئها وحدة Wallarm.| map(string) | لا

## تجربة وحدة Wallarm Terraform مع الأمثلة

لقد أعددنا أمثلة لطرق مختلفة لاستخدام وحدة Wallarm، حتى تتمكن من تجربتها قبل النشر على الإنتاج:

* [Proxy في AWS VPC](proxy-in-aws-vpc.md)
* [Proxy لـ Amazon API Gateway](proxy-for-aws-api-gateway.md)

## معلومات إضافية حول Wallarm و Terraform

يدعم Terraform عدد من التكاملات (**المزودين**) والتكوينات الجاهزة للاستخدام (**الوحدات**) المتاحة للمستخدمين عبر الـ [سجلتها](https://www.terraform.io/registry#navigating-the-registry) العامة، التي تكونت بواسطة العديد من البائعين.

إلى هذا السجل، نشرت Wallarm:

* [وحدة Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/) لنشر العقدة على AWS من البيئة المتوافقة مع Terraform. موضحة في المقالة الحالية.
* المزود [Wallarm provider](../../../../admin-en/managing/terraform-provider.md) لإدارة Wallarm عبر Terraform.

هذين الاثنين هما عناصر مستقلة تستخدم لأغراض مختلفة، ولا يتطلبان بعضهما البعض.

## القيود
* [الكشف عن طرق الاستغلال](../../../../about-wallarm/credential-stuffing.md) غير مدعومة حالياً.