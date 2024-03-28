[link-docs-aws-autoscaling]:        autoscaling-group-guide.md
[link-docs-aws-node-setup]:         ../../../installation/cloud-platforms/aws/ami.md
[link-ssh-keys-guide]:              ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys
[link-security-group-guide]:        ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/aws/ami.md#6-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-launch-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]:      ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]:  #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]:   #2-creating-an-amazon-machine-image

# إنشاء صورة آلة أمازون بواسطة عقدة تصفية Wallarm

يمكنك إعداد التوسع الذاتي لعقد تصفية Wallarm المُنشأة على السحابة الخاصة بأمازون. تتطلب هذه الوظيفة صور للآلات الافتراضية مُجهزة مسبقًا.

يصف هذا الوثيقة إجراء تحضير صورة آلة أمازون(AMI) مع تثبيت عقدة تصفية Wallarm. AMI مطلوب لإعداد توسع التصفية الذاتي للعقد. لرؤية معلومات مفصلة عن إعداد التوسع الذاتي، انتقل إلى هذا [الرابط][link-docs-aws-autoscaling].

لإنشاء AMI بعقدة تصفية Wallarm، قم بإجراء الإجراءات التالية:

1. [إنشاء وتهيئة مثيل عقدة التصفية في السحابة الخاصة بأمازون][anchor-node]
2. [إنشاء AMI على أساس مثيل عقدة التصفية المُهيأ][anchor-ami]


##  1.  إنشاء وتهيئة مثيل عقدة تصفية Wallarm في السحابة الخاصة بأمازون

قبل إنشاء AMI تحتاج إلى إجراء تهيئة أولية لمثيل عقدة تصفية Wallarm واحدة. لتهيئة عقدة التصفية، قم بما يلي:

1.  [إنشاء][link-docs-aws-node-setup] مثيل لعقدة التصفية في السحابة الخاصة بأمازون.
    
    !!! warning "المفتاح الخاص SSH"
        تأكد من وجود لديك إمكانية الوصول إلى المفتاح الخاص SSH (المخزن بتنسيق PEM) الذي [أنشأته][link-ssh-keys-guide] مُسبقًا للاتصال بعقدة التصفية.

    !!! warning "توفير اتصال عقدة التصفية بالإنترنت"
        تتطلب عقدة التصفية الوصول إلى خادم API الخاص ب Wallarm لتشغيلها بشكل صحيح. اختيار خادم API الخاص ب Wallarm يعتمد على السحابة Wallarm التي تستخدمها:
        
        *   إذا كنت تستخدم سحابة الولايات المتحدة، يحتاج مثيلك إلى الوصول إلى `https://us1.api.wallarm.com`.
        *   إذا كنت تستخدم سحابة الاتحاد الأوروبي، يحتاج مثيلك إلى الوصول إلى `https://api.wallarm.com`.
        
    تأكد من اختيارك للVPC والشبكات الفرعية بشكل صحيح و[تهيئة مجموعة الأمان][link-security-group-guide] بطريقة لا تمنع عقدة التصفية من الوصول إلى خوادم API الخاصة ب Wallarm.

2.  [ربط][link-cloud-connect-guide] عقدة التصفية بالسحابة Wallarm.

    !!! warning "استخدم رمزًا للاتصال بالسحابة Wallarm"
        يُرجى ملاحظة أنك تحتاج إلى ربط عقدة التصفية بالسحابة Wallarm باستخدام رمز. يُسمح بربط عدة عقد تصفية بالسحابة Wallarm باستخدام نفس الرمز.
        
        وبالتالي، عند توسيع عقد التصفية ذاتيًا، لن تحتاج إلى ربط كل عقدة تصفية بالسحابة Wallarm يدويًا.

3.  [تهيئة][link-docs-reverse-proxy-setup] عقدة التصفية لتعمل كوكيل عكسي لتطبيق الويب الخاص بك.

4.  [تأكد][link-docs-check-operation] من تهيئة عقدة التصفية بشكل صحيح وحماية تطبيق الويب الخاص بك ضد الطلبات الخبيثة.

بعد الانتهاء من تهيئة عقدة التصفية، أوقف الآلة الافتراضية عن طريق إكمال الإجراءات التالية:

1.  انتقل إلى علامة التبويب **Instances** في لوحة تحكم Amazon EC2.
2.  حدد مثيل عقدة التصفية المُهيأ الخاص بك.
3.  حدد **حالة المثيل** ثم **إيقاف** في قائمة **الإجراءات** المنسدلة.

!!! info "الإيقاف باستخدام أمر `poweroff`"
    يمكنك أيضًا إيقاف الآلة الافتراضية عن طريق الاتصال بها عبر بروتوكول SSH وتشغيل الأمر التالي:
    
    ``` bash
    poweroff
    ```

##  2.  إنشاء صورة آلة أمازون

يمكنك الآن إنشاء صورة للآلة الافتراضية بناءً على مثيل عقدة التصفية المُهيأ. لإنشاء صورة، قم بالخطوات التالية:

1.  انتقل إلى علامة التبويب **Instances** في لوحة تحكم Amazon EC2.
2.  حدد مثيل عقدة التصفية المُهيأ الخاص بك.
3.  أطلق معالج إنشاء الصورة بتحديد **Image** ثم **Create Image** في قائمة **الإجراءات** المنسدلة.

    ![إطلاق معالج إنشاء AMI][img-launch-ami-wizard]
    
4.  ستظهر نافذة **Create Image**. أدخل اسم الصورة في حقل **اسم الصورة**. يمكن ترك الحقول المتبقية دون تغيير.

    ![تهيئة المعلمات في معالج إنشاء AMI][img-config-ami-wizard]
    
5.  اضغط على زر **Create Image** لبدء عملية إنشاء صورة الآلة الافتراضية.
    
    عند انتهاء عملية إنشاء الصورة، سيتم عرض الرسالة المناسبة. انتقل إلى علامة التبويب **AMIs** في لوحة تحكم Amazon EC2 للتأكد من أن الصورة قد تم إنشاؤها بنجاح ولها حالة **متاح**.
    
    ![استكشاف AMI المُنشأة][img-explore-created-ami]

!!! info "رؤية الصورة"
    نظرًا لأن الصورة المُعدة تحتوي على إعدادات مُحددة لتطبيقك ورمز Wallarm، لا يُنصح بتغيير إعداد رؤية الصورة وجعلها عامة (بشكل افتراضي، يتم إنشاء AMIs بإعداد الرؤية **خاص**).

الآن يمكنك [إعداد][link-docs-aws-autoscaling] توسع عقد تصفية Wallarm ذاتيًا في السحابة الخاصة بأمازون باستخدام الصورة المُعدة.