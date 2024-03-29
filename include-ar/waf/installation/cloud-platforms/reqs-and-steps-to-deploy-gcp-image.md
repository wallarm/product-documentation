## المتطلبات

* حساب على GCP
* الوصول للحساب بدور **المدير** وتعطيل التوثيق الثنائي في واجهة Wallarm لـ[السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com:444` للعمل مع سحابة Wallarm الأمريكية أوإلى `https://api.wallarm.com:444` للعمل مع سحابة Wallarm الأوروبية. إذا تم تكوين الوصول عبر خادم الوكيل فقط، استخدم [التعليمات][wallarm-api-via-proxy]
* تنفيذ جميع الأوامر على نسخة Wallarm بصفتك المستخدم الأعلى (مثل `root`)

## 1. إطلاق نسخة عقدة الفلترة

### إطلاق النسخة عبر واجهة Google Cloud

لإطلاق نسخة عقدة الفلترة عبر واجهة Google Cloud، يرجى فتح [صورة عقدة Wallarm على سوق Google Cloud](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) والنقر على **GET STARTED**.

سيتم إطلاق النسخة مع عقدة فلترة مثبتة مسبقاً. لرؤية معلومات مفصلة حول إطلاق النسخ في Google Cloud، يرجى المتابعة إلى [الوثائق الرسمية لمنصة Google Cloud][link-launch-instance].

### إطلاق النسخة عبر Terraform أو أدوات أخرى

عند استخدام أداة مثل Terraform لإطلاق نسخة عقدة الفلترة باستخدام صورة Wallarm GCP، قد تحتاج إلى توفير اسم هذه الصورة في تكوين Terraform.

* يكون لاسم الصورة الشكل التالي:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* لإطلاق النسخة مع إصدار عقدة الفلترة 4.10، يرجى استخدام اسم الصورة التالي:

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

للحصول على اسم الصورة، يمكنك أيضاً اتباع هذه الخطوات:

1.  تثبيت [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2.  تنفيذ الأمر  [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) بالمعاملات التالية:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-10-*'" --no-standard-images
    ```
3.  نسخ قيمة الإصدار من اسم أحدث صورة متوفرة ولصق القيمة المنسوخة في شكل اسم الصورة الموفر. على سبيل المثال، سيكون لصورة إصدار عقدة الفلترة 4.10 الاسم التالي:

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

## 2. تكوين نسخة عقدة الفلترة

نفذ الإجراءات التالية لتكوين نسخة عقدة الفلترة المطلقة:

1.  الانتقال إلى صفحة **VM instances** في قسم **Compute Engine** من القائمة.
2.  اختيار نسخة عقدة الفلترة المطلقة والنقر على زر **Edit**.
3.  السماح بأنواع حركة المرور الواردة المطلوبة بوضع علامات في المربعات المقابلة في إعداد **Firewalls**.
4.  إذا لزم الأمر، يمكن تقييد الاتصال بالنسخة بمفاتيح SSH الخاصة بالمشروع واستخدام زوج مفاتيح SSH مخصص للاتصال بهذه النسخة. للقيام بذلك، نفذ الإجراءات التالية:
    1.  وضع علامة في مربع **Block project-wide** في إعداد **SSH Keys**.
    2.  النقر على زر **Show and edit** في إعداد **SSH Keys** لتوسيع الحقل المخصص لإدخال مفتاح SSH.
    3.  إنشاء زوج من مفاتيح SSH العامة والخاصة. على سبيل المثال، يمكن استخدام أدوات `ssh-keygen` و`PuTTYgen`.
       
        ![توليد مفاتيح SSH باستخدام PuTTYgen][img-ssh-key-generation]

    4.  نسخ مفتاح عام بتنسيق OpenSSH من واجهة مولد المفاتيح المستخدم (في المثال الحالي، يجب نسخ المفتاح العام من منطقة **Public key for pasting into OpenSSH authorized_keys file** في واجهة PuTTYgen) ولصقه في الحقل الذي يحتوي على تلميح **Enter entire key data**.
    5.  حفظ المفتاح الخاص. سيكون مطلوباً للاتصال بالنسخة المكونة في المستقبل.
5.  النقر على زر **Save** في أسفل الصفحة لتطبيق التغييرات.

## 3. الاتصال بنسخة عقدة الفلترة عبر SSH

لرؤية معلومات مفصلة حول طرق الاتصال بالنسخ، تابع إلى هذا [الرابط](https://cloud.google.com/compute/docs/instances/connecting-to-instance).

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. توليد رمز لربط النسخة بسحابة Wallarm

تحتاج النسخة المحلية من عقدة الفلترة Wallarm إلى الاتصال بسحابة Wallarm باستخدام رمز Wallarm من [النوع المناسب][wallarm-token-types]. يسمح رمز API بإنشاء مجموعة عقد في واجهة Wallarm Console، مما يساعد في تنظيم نسخ العقد بفعالية.

![مجموعات العقد][img-grouped-nodes]

قم بتوليد رمز على النحو التالي:

=== "رمز API"

    1. افتح Wallarm Console → **الإعدادات** → **رموز API** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز API بدور المصدر `Deploy`.
    1. انسخ هذا الرمز.
=== "رمز العقدة"

    1. افتح Wallarm Console → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. قم بإحدى الخطوات التالية: 
        * إنشاء عقدة من نوع **عقدة Wallarm** ونسخ الرمز المولد.
        * استخدام مجموعة عقد موجودة - نسخ الرمز باستخدام قائمة العقدة → **نسخ الرمز**.