# نشر عقدة Wallarm بشكل مباشر

يمكن نشر Wallarm بشكل مباشر لتخفيف التهديدات في الوقت الفعلي. في هذه الحالة، يمر الحركة الموجهة إلى الAPIs المحمية عبر مثيلات عقدة Wallarm قبل أن تصل إلى الAPI. لا توجد فرصة للمهاجم لتجاوز عقد Wallarm طالما كانت هي الطريق الوحيد المتاح للمستخدمين النهائيين. تشرح هذه المقالة النهج بالتفصيل.

تقع مثيلات عقدة Wallarm بين العميل والخوادم، حيث تقوم بتحليل حركة المرور الواردة، تخفيف الطلبات الخبيثةووتوجيه الطلبات المشروعة إلى الخادم المحمي.

## حالات الاستخدام

الحل المباشر الخاص بWallarm مناسب لحالات الاستخدام التالية:

* تخفيف الطلبات الخبيثة مثل SQli، حقن XSS، الإساءة للAPI، القوة الغاشمة قبل أن تصل إلى خادم التطبيق.
* الحصول على معرفة بالثغرات الأمنية النشطة في نظامك وتطبيق التصحيحات الافتراضية قبل إصلاح كود التطبيق.
* مراقبة جرد الAPI وتتبع البيانات الحساسة.

## المزايا والمتطلبات الخاصة

تقدم طريقة النشر المباشر لنشر Wallarm مزايا عديدة عن طرق النشر الأخرى، مثل نشر [OOB](../oob/overview.md):

* Wallarm يحجب الطلبات الخبيثة فورًا حيث يتم تحليل الحركة في الوقت الفعلي.
* تعمل جميع ميزات Wallarm، بما في ذلك [اكتشاف الAPI](../../api-discovery/overview.md) و[اكتشاف الثغرات](../../about-wallarm/detecting-vulnerabilities.md) بدون قيود حيث يمكن لـWallarm الوصول إلى كلا من الطلبات الواردة واستجابات الخادم.

لتنفيذ نموذج مباشر، ستحتاج إلى تغيير مسار الحركة في بنيتك التحتية. بالإضافة إلى ذلك، ضع في اعتبارك بعناية [تخصيص الموارد](../../admin-en/configuration-guides/allocate-resources-for-node.md) لعقد Wallarm لضمان الخدمة دون انقطاع.

عند نشر عقد Wallarm على السحاب العام مثل AWS أو GCP لبيئات الإنتاج، من الضروري استخدام مجموعة توسيع تلقائي مكونة بشكل صحيح للحصول على الأداء المثالي والقابلية للتوسع والمرونة (راجع المقالات لـ[AWS](../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) أو [GCP](../../admin-en/installation-guides/google-cloud/autoscaling-overview.md)).

## نماذج النشر وطرق النشر المدعومة

عند الحديث عن نشر Wallarm بشكل مباشر، هناك نموذجان شائعان يجب النظر إليهما: نشر في وحدات حوسبة ونشر في Kubernetes.

يمكنك اختيار نموذج النشر وطريقة النشر بناءً على خصوصيات بنيتك التحتية. إذا كنت بحاجة إلى مساعدة في اختيار النموذج وطريقة النشر المناسبة، يرجى الاتصال بفريق المبيعات لدينا [فريق المبيعات](mailto:sales@wallarm.com) وتزويدهم بمزيد من المعلومات حول بنيتك التحتية للحصول على إرشادات مخصصة.

### تشغيل Wallarm على وحدات الحوسبة

في هذا النموذج، تقوم بنشر Wallarm كجهاز افتراضي ضمن بنيتك التحتية. يمكن تثبيت الجهاز الافتراضي كـVM، وعاء، أو وحدة سحاب.

عند نشر عقدة Wallarm، لديك المرونة لوضعها في مواقع مختلفة ضمن أعلى بنيتك الشبكية. ومع ذلك، النهج الموصى به هو وضع العقدة خلف موازن تحميل عام، أمام خدمات الخلفية الخاصة بك، أو موازن تحميل خاص، يقع عادة قبل الخدمات الخلفية. الرسم التوضيحي التالي يوضح تدفق حركة المرور النموذجي في هذا الإعداد:

![مخطط الترشيح المباشر](../../images/waf-installation/inline/wallarm-inline-deployment-scheme.png)

يمكن تصنيف موازنات الحمل إلى نوعين: L4 وL7. نوع موازن الحمل يحدد كيفية التعامل مع إزالة تشفير SSL، وهو أمر حاسم عند دمج Wallarm في بنيتك التحتية الحالية.

* إذا كنت تستخدم موازن حمل L4، فعادةً ما يتم التعامل مع إزالة تشفير SSL بواسطة خادم ويب موضوع خلف موازن الحمل أو من خلال وسائل أخرى في بنيتك التحتية بدون عقدة Wallarm. ومع ذلك، عند نشر عقدة Wallarm، تحتاج إلى تكوين إزالة تشفير SSL على عقدة Wallarm.
* إذا كنت تستخدم موازن الحمل L7، فعادةً ما يتم التعامل مع إزالة التشفير SSL بواسطة موازن الحمل نفسه، وستتلقى عقدة Wallarm HTTP العادي.

تقدم Wallarm التحف والحلول التالية لتشغيل Wallarm على وحدات الحوسبة:

**خدمات أمازون الويب (AWS)**

* [AMI](compute-instances/aws/aws-ami.md)
* [ECS](compute-instances/aws/aws-ecs.md)
* وحدة Terraform:
    * [Proxy في AWS VPC](compute-instances/aws/terraform-module-for-aws-vpc.md)
    * [Proxy لـAmazon API Gateway](compute-instances/aws/terraform-module-for-aws-api-gateway.md)

**منصة Google Cloud**

* [صورة الجهاز](compute-instances/gcp/machine-image.md)
* [GCE](compute-instances/gcp/gce.md)

**Microsoft Azure**

* [Azure Container Instances](compute-instances/azure/docker-image.md)

**Alibaba Cloud**

* [ECS](compute-instances/alibaba/docker-image.md)

**صور Docker**

* [مبني على NGINX](compute-instances/docker/nginx-based.md)
* [مبني على Envoy](compute-instances/docker/envoy-based.md)

**حزم Linux**

* [حزم فردية لـNGINX المستقر](compute-instances/linux/individual-packages-nginx-stable.md)
* [حزم فردية لـNGINX Plus](compute-instances/linux/individual-packages-nginx-plus.md)
* [حزم فردية لـNGINX المقدم من التوزيع](compute-instances/linux/individual-packages-nginx-distro.md)
* [المثبت الشامل](compute-instances/linux/all-in-one.md)

### تشغيل Wallarm على Kubernetes

إذا كنت تستخدم Kubernetes لإدارة الحاويات، يمكن نشر Wallarm كحل أصيل لـKubernetes. يدمج بسلاسة مع عناقيد Kubernetes، مستفيدًا من الميزات مثل وحدات التحكم في الدخول أو وحدات التحكم الجانبية.

تقدم Wallarm التحف والحلول التالية لتشغيل Wallarm على Kubernetes:

* [وحدة التحكم في الدخول NGINX](../../admin-en/installation-kubernetes-en.md)
* [وحدة التحكم الجانبية](../kubernetes/sidecar-proxy/deployment.md)