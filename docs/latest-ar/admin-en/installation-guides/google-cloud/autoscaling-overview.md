[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

#   إعداد توسيع تلقائي لعقد التصفية على منصة Google Cloud: نظرة عامة

يمكنك إعداد توسيع تلقائي لعقد التصفية Wallarm على منصة Google Cloud (GCP) للتأكد من قدرة عقد التصفية على التعامل مع تقلبات حركة المرور (إذا وجدت). يسمح تمكين التوسيع التلقائي بمعالجة الطلبات الواردة إلى التطبيق باستخدام عقد التصفية حتى عندما تزداد حركة المرور بشكل كبير.

!!! warning "المتطلبات الأساسية"
    يتطلب إعداد التوسيع التلقائي صورة الآلة الافتراضية بعقدة التصفية Wallarm.
    
    للحصول على معلومات مفصلة حول إنشاء صورة الآلة الافتراضية بعقدة التصفية Wallarm على GCP، انتقل إلى هذا [الرابط][link-doc-image-creation].

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

لتوسيع تلقائي لعقد التصفية على منصة Google Cloud، قم بالخطوات التالية:

1.  [إنشاء صورة آلة](create-image.md)
1.  إعداد توسيع تلقائي لعقد التصفية:
    1.  [إنشاء قالب لعقدة التصفية][link-doc-template-creation];
    2.  [إنشاء مجموعة من الكيانات المُدارة مع تمكين التوسيع التلقائي][link-doc-managed-autoscaling-group];
1.  [إعداد توازن الطلبات الواردة][link-doc-lb-guide].

!!! info "الحقوق المطلوبة"
    قبل إعداد التوسيع التلقائي، تأكد من أن حساب GCP الخاص بك يمتلك دور `Compute Admin`.