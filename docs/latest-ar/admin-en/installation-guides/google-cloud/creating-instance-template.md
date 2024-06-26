# إنشاء قالب نموذج لعقدة التصفية على GCP

[img-creating-template]:                ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]:                  ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]:                  create-image.md
[link-creating-instance-group]:         creating-autoscaling-group.md

سيتم استخدام قالب نموذج لعقدة التصفية لاحقًا كأساس عند إنشاء مجموعة نماذج مدارة. لإنشاء قالب نموذج لعقدة التصفية، قم بما يلي:

1.  توجه إلى صفحة **قوالب النماذج** ضمن قسم **حوسبة النماذج** في القائمة وانقر على زر **إنشاء قالب نموذج**.
    
    ![إنشاء قالب نموذج][img-creating-template]
    
2.  أدخل اسم القالب في حقل **الاسم**.
3.  اختر نوع الآلة الافتراضية لإطلاق آلة افتراضية بها عقدة التصفية من حقل **نوع الآلة**.

    !!! warning "اختر نوع النموذج المناسب"
        اختر نفس نوع النموذج الذي استخدمته عند تكوين عقدة التصفية بادئ الأمر (أو نوعًا أقوى).
        
        استخدام نوع نموذج أقل قوة قد يؤدي إلى مشاكل في عملية عقدة التصفية.

4.  انقر على زر **تغيير** في إعداد **القرص التمهيدي**. في النافذة التي تظهر، توجه إلى تبويب **الصور المخصصة** واختر اسم المشروع الذي أنشأت فيه صورة الآلة الافتراضية من قائمة الانسدال **إظهار الصور من**. اختر [الصورة المُنشأة مسبقًا][link-creating-image] من قائمة الصور المتاحة للمشروع وانقر على زر **تحديد**.

    ![اختيار صورة][img-selecting-image]
    
5.  ليكون النماذج المعتمدة على القالب مطابقة للنموذج الأساسي، قم بتهيئة جميع المعايير المتبقية بنفس الطريقة التي هيأت بها العوامل عند [إنشاء نموذجك الأساسي][link-creating-image].
    
    !!! info "تهيئة جدار الحماية"
        تأكد من أن جدار الحماية لا يحجب حركة البيانات HTTP إلى القالب المُنشأ. لتمكين حركة بيانات HTTP، حدد خانة الاختيار **السماح بحركة بيانات HTTP**.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6.  انقر على زر **إنشاء** وانتظر حتى ينتهي عملية إنشاء قالب.

بعد إنشاء قالب النموذج، يمكنك المضي قدمًا مع [إنشاء مجموعة نماذج مدارة][link-creating-instance-group] مع تمكين التوسع التلقائي.