[link-doc-aws-as]:          https://docs.aws.amazon.com/autoscaling/plans/userguide/what-is-aws-auto-scaling.html
[link-doc-ec2-as]:          https://docs.aws.amazon.com/autoscaling/ec2/userguide/GettingStartedTutorial.html
[link-doc-as-faq]:          https://aws.amazon.com/autoscaling/faqs/

[link-doc-ami-creation]:    create-image.md
[link-doc-asg-guide]:       autoscaling-group-guide.md
[link-doc-lb-guide]:        load-balancing-guide.md
[link-doc-create-template]: autoscaling-group-guide.md#1-creating-a-launch-template
[link-doc-create-asg]:      autoscaling-group-guide.md#2-creating-an-auto-scaling-group
[link-doc-create-lb]:       load-balancing-guide.md#1-creating-a-load-balancer
[link-doc-set-up-asg]:      load-balancing-guide.md#2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

# نظرة عامة على إعداد توسيع النطاق التلقائي لعقدة التصفية على AWS

تقدر تضبط توسيع نطاق عقدة التصفية التلقائي في Wallarm علشان تتأكد إن عقد التصفية قادرة على التعامل مع تقلبات المرور، لو فيه أي. تفعيل التوسيع التلقائي يسمح بمعالجة الطلبات الواردة للتطبيق باستخدام عقد التصفية حتى عندما يزيد المرور بشكل كبير.

السحابة الخاصة بأمازون بتدعم الطرق التالية لتوسيع النطاق التلقائي:
* AWS Autoscaling:
    تكنولوجيا توسيع النطاق التلقائي الجديدة على أساس المقاييس اللى بيجمعها AWS.
    
    علشان تشوف معلومات مفصلة عن توسيع النطاق التلقائي في AWS، ادخل على الرابط ده [هنا][link-doc-aws-as]. 

* EC2 Autoscaling:
    تكنولوجيا توسيع النطاق التلقائي القديمة اللى بتسمح بإنشاء متغيرات مخصصة لتحديد قواعد التوسيع.
    
    علشان تشوف معلومات مفصلة عن توسيع النطاق التلقائي في EC2، ادخل على الرابط ده [هنا][link-doc-ec2-as]. 
    
!!! info "معلومات عن طرق توسيع النطاق التلقائي"
    علشان تشوف سؤال وجواب مفصل عن طرق توسيع النطاق التلقائي اللى بتوفرها أمازون، ادخل على الرابط ده [هنا][link-doc-as-faq]. 

الدليل ده بيوضح إزاي تضبط توسيع نطاق عقدة التصفية باستخدام توسيع النطاق التلقائي لـ EC2، لكن كمان تقدر تستخدم توسيع النطاق التلقائي لـ AWS لو احتاجت.

!!! warning "المتطلبات الأساسية"
    صورة آلة افتراضية (Amazon Machine Image, AMI) بعقدة تصفية Wallarm مطلوبة لضبط توسيع النطاق التلقائي.
    
    علشان تشوف معلومات مفصلة عن إنشاء AMI بعقدة التصفية، تابع مع الرابط ده [هنا][link-doc-ami-creation].

!!! info "المفتاح الخاص SSH"
    تأكد إنك معاك الوصول للمفتاح الخاص SSH (المخزن بصيغة PEM) اللى أنشأته قبل كده علشان تتصل بعقدة التصفية.

علشان تفعل توسيع نطاق عقدة التصفية التلقائي في السحابة الخاصة بأمازون، اتبع الخطوات دي:

1. [إنشاء صورة آلة افتراضية لأمازون](create-image.md)
1. [ضبط توسيع نطاق عقدة التصفية التلقائي][link-doc-asg-guide]
    1. [إنشاء قالب إطلاق][link-doc-create-template]
    2. [إنشاء مجموعة توسيع النطاق التلقائي][link-doc-create-asg]
1. [ضبط توازن الطلبات الواردة][link-doc-lb-guide]
    1. [إنشاء موازن حمل][link-doc-create-lb]
    2. [ضبط مجموعة توسيع النطاق التلقائي لاستخدام الموازن المنشأ][link-doc-set-up-asg]