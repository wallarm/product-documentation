[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

#   إعداد تلقائي لمقياس عقد التصفية على منصة Google Cloud: نظرة عامة

يمكنك إعداد تلقائي لمقياس عقد التصفية Wallarm على منصة Google Cloud (GCP) للتأكد من أن عقد التصفية قادرة على التعامل مع تقلبات الحركة (إذا وجدت). يسمح تفعيل التلقائي للمقياس بمعالجة الطلبات الواردة إلى التطبيق باستخدام عقد التصفية حتى عندما تزيد الحركة بشكل كبير.

!!! تحذير "المتطلبات الأساسية"
    إعداد التلقائي للمقياس يتطلب صورة الآلة الافتراضية مع عقدة التصفية Wallarm.
    
    للحصول على معلومات مفصلة حول إنشاء صورة الآلة الافتراضية مع عقدة التصفية Wallarm على GCP، توجه إلى هذا [الرابط][link-doc-image-creation].

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

لتلقائي مقياس عقد التصفية على منصة Google Cloud، قم بالخطوات التالية:

1.  [إنشاء صورة آلة](create-image.md)
1.  إعداد تلقائي لمقياس عقد التصفية:
    1.  [إنشاء قالب عقدة تصفية][link-doc-template-creation];
    2.  [إنشاء مجموعة نماذج مُدارة مع تفعيل التلقائي للمقياس][link-doc-managed-autoscaling-group];
1.  [إعداد التوازن بين الطلبات الواردة][link-doc-lb-guide].

!!! معلومات "الحقوق المطلوبة"
    قبل إعداد التلقائي للمقياس، تأكد من أن حسابك في GCP يمتلك دور `Compute Admin`.