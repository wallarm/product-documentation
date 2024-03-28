[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#5-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

# إنشاء صورة بواسطة عقدة تصفية Wallarm على منصة Google Cloud

لإعداد القياس التلقائي لعقد التصفية Wallarm الموزعة على منصة Google Cloud (GCP)، أنت بحاجة أولاً إلى صور آلات افتراضية. تصف هذه الوثيقة إجراء تحضير صورة الآلة الافتراضية بعقدة تصفية Wallarm مثبتة. للحصول على معلومات مفصلة حول إعداد القياس التلقائي، يرجى الاطلاع على [هذا الرابط][link-docs-gcp-autoscaling].

لإنشاء صورة بعقدة تصفية Wallarm على GCP، قم بالإجراءات التالية:
1. [إنشاء وتكوين عقدة التصفية على منصة Google Cloud][anchor-node].
2. [إنشاء صورة آلة افتراضية استنادًا إلى عقدة التصفية المكونة][anchor-gcp].

## 1. إنشاء وتكوين عقدة التصفية على منصة Google Cloud

قبل إنشاء صورة، تحتاج إلى إجراء تكوين أولي لعقدة تصفية Wallarm واحدة. لتكوين عقدة تصفية، قم بما يلي:
1. [إنشاء وتكوين][link-docs-gcp-node-setup] عقدة تصفية على GCP.

    !!! warning "توفير اتصال بالإنترنت لعقدة التصفية"
        عقدة التصفية تتطلب الوصول إلى خادم API Wallarm للعمل بشكل صحيح. اختيار خادم API Wallarm يعتمد على Cloud Wallarm الذي تستخدمه:
        
        * إذا كنت تستخدم US Cloud، تحتاج العقدة إلى الوصول إلى `https://us1.api.wallarm.com`.
        * إذا كنت تستخدم EU Cloud، تحتاج العقدة إلى الوصول إلى `https://api.wallarm.com`.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2. [ربط][link-cloud-connect-guide] عقدة التصفية بـ Wallarm Cloud.

    !!! warning "استخدم رمزًا للربط بـ Wallarm Cloud"
        يرجى ملاحظة أنه يتعين عليك ربط عقدة التصفية بـ Wallarm cloud باستخدام رمز. يُسمح بربط عقد متعددة بـ Wallarm cloud باستخدام الرمز نفسه.
       
        وبذلك، لن تحتاج إلى ربط كل عقدة التصفية يدويًا بـ Wallarm Cloud عندما تقوم بالقياس التلقائي.

3. [تكوين][link-docs-reverse-proxy-setup] عقدة التصفية لتعمل كوكيل عكسي لتطبيق الويب الخاص بك.

4. [التأكد][link-docs-check-operation] من أن عقدة التصفية مكونة بشكل صحيح وتحمي تطبيق الويب الخاص بك ضد الطلبات الخبيثة.

بعد أن تنتهي من تكوين عقدة التصفية، أوقف تشغيل الآلة الافتراضية من خلال إكمال الإجراءات التالية:
1. انتقل إلى صفحة **VM Instances** في قسم **Compute Engine** من القائمة.
2. افتح القائمة المنسدلة بالنقر على زر القائمة على يمين عمود **Connect**.
3. حدد **Stop** في القائمة المنسدلة.

![إيقاف تشغيل الآلة الافتراضية][img-vm-instance-poweroff]

!!! info "إيقاف التشغيل باستخدام أمر `poweroff`"
    يمكنك أيضًا إيقاف تشغيل الآلة الافتراضية بالاتصال بها عبر بروتوكول SSH وتشغيل الأمر التالي:
    
    ``` bash
 	poweroff
 	```

## 2. إنشاء صورة آلة افتراضية

يمكنك الآن إنشاء صورة آلة افتراضية استنادًا إلى عقدة التصفية المكونة. لإنشاء صورة، اتبع الخطوات التالية:
1. انتقل إلى صفحة **Images** في قسم **Compute Engine** من القائمة وانقر على زر **Create image**.
2. أدخل اسم الصورة في حقل **Name**.
3. حدد **Disk** من القائمة المنسدلة **Source**.
4. حدد اسم نسخة الآلة الافتراضية [المُنشأة مسبقًا][anchor-node] من القائمة المنسدلة **Source disk**.

    ![إنشاء صورة][img-create-image]

5. انقر على زر **Create** لبدء عملية إنشاء صورة الآلة الافتراضية.

بمجرد انتهاء عملية إنشاء الصورة، سيتم توجيهك إلى صفحة تحتوي على قائمة الصور المتاحة. تأكد من تم إنشاء الصورة بنجاح وأنها موجودة في القائمة.

![قائمة الصور][img-check-image]

الآن يمكنك [ضبط القياس التلقائي][link-docs-gcp-autoscaling] لعقد التصفية Wallarm على منصة Google Cloud باستخدام الصورة المعدة.