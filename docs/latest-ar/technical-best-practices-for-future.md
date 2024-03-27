# أفضل الممارسات لنشر وصيانة حلول Wallarm

يصيغ هذا المقال أفضل الممارسات لنشر وصيانة حلول Wallarm.


## نشر عقد التصفية ليس فقط في بيئة الإنتاج ولكن أيضًا في الاختبار والمرحلة المؤقتة - الأفضليات التقنية

لا تقيد غالبية عقود خدمة Wallarm عدد عقد Wallarm المنشورة من قبل العميل، لذلك لا يوجد سبب لعدم نشر عقد التصفية في جميع بيئاتك، بما في ذلك التطوير، الاختبار، المرحلة المؤقتة، إلخ.

من خلال نشر واستخدام عقد التصفية في جميع مراحل أنشطتك التطويرية للبرمجيات و/أو تشغيل الخدمة يمكنك الحصول على فرصة أفضل لاختبار كامل سير البيانات بشكل صحيح وتقليل خطر حدوث أي مواقف غير متوقعة في بيئة الإنتاج الحرجة لديك.

## تكوين التقارير الصحيحة لعناوين IP للمستخدمين النهائيين - الأفضليات التقنية، يجب أن تحتوي كل تعليمات النشر على رابط إلى هذا

لعقد التصفية Wallarm الموجودة خلف موازن الحمل أو CDN يرجى التأكد من تكوين عقد التصفية لديك لتقديم تقارير صحيحة عن عناوين IP للمستخدمين النهائيين (وإلا فإن [وظيفة قائمة IP](user-guides/ip-lists/overview.md)، [التحقق من التهديدات النشطة](detecting-vulnerabilities.md#active-threat-verification)، وبعض الميزات الأخرى لن تعمل):

* [تعليمات لعقد Wallarm المبنية على NGINX](../admin-en/using-proxy-or-balancer-en.md) (بما في ذلك صور AWS / GCP وحاوية عقدة Docker)
* [تعليمات لعقد التصفية المنشورة كموجه دخول Kubernetes لـ Wallarm](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## تمكين الرصد الصحيح لعقد التصفية - يجب نقله كتعليمات للرصد وكذلك في الأفضليات التقنية

من الموصى به بشدة تمكين الرصد الصحيح لعقد التصفية Wallarm. الخدمة `collectd` المثبتة مع كل عقدة تصفية Wallarm تجمع المقاييس المدرجة ضمن [الرابط](../admin-en/monitoring/available-metrics.md).

طريقة إعداد رصد عقدة التصفية تعتمد على خيار النشر الخاص بها:

* [تعليمات لعقد Wallarm المبنية على NGINX](../admin-en/monitoring/intro.md) (بما في ذلك صور AWS / GCP والعبوات الجانبية لـ Kubernetes)
* [تعليمات لعقد التصفية المنشورة كموجه دخول Kubernetes لـ Wallarm](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [تعليمات لصور Docker المبنية على NGINX](../admin-en/installation-docker-en.md#monitoring-configuration)

## تنفيذ الوفرة الصحيحة ووظيفية الفشل التلقائي

مثل كل مكون حاسم آخر في بيئة الإنتاج الخاصة بك، يجب أن تكون عقد Wallarm مصممة ومنشورة ومشغلة بمستوى الوفرة والفشل التلقائي الصحيحين. يجب أن يكون لديك **على الأقل عقدتين تصفية Wallarm نشطتين** تتعاملان مع طلبات المستخدمين النهائيين الحرجة. توفر المقالات التالية معلومات ذات صلة حول الموضوع:

* [تعليمات لعقد Wallarm المبنية على NGINX](../admin-en/configure-backup-en.md) (بما في ذلك صور AWS / GCP، حاوية عقدة Docker، والعبوات الجانبية لـ Kubernetes)
* [تعليمات لعقد التصفية المنشورة كموجه دخول Kubernetes لـ Wallarm](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)