## المتطلبات

* حساب على GCP
* الوصول إلى الحساب بدور **المدير** والمصادقة الثنائية معطلة في واجهة Wallarm للسحابة [الأمريكية](https://us1.my.wallarm.com/) أو [الأوروبية](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com:444` للعمل مع السحابة الأمريكية لـWallarm أو إلى `https://api.wallarm.com:444` للعمل مع السحابة الأوروبية لـWallarm. إذا كان يمكن تهيئة الوصول فقط عبر خادم الوكيل، فيرجى استخدام [التعليمات][wallarm-api-via-proxy]
* تنفيذ جميع الأوامر على نسخة Wallarm كمستخدم فائق (مثل `root`)

## 1. إطلاق نسخة عُقدة التصفية

### إطلاق النسخة عبر واجهة Google Cloud

لإطلاق نسخة عُقدة التصفية عبر واجهة Google Cloud، يرجى فتح [صورة عُقدة Wallarm في Google Cloud Marketplace](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) واضغط على **GET STARTED**.

سيتم إطلاق النسخة مع عُقدة تصفية مثبتة مسبقًا. لرؤية معلومات مفصلة حول إطلاق النُسخ في Google Cloud، يرجى الانتقال إلى [وثائق منصة Google Cloud الرسمية][link-launch-instance].

### إطلاق النسخة عبر Terraform أو أدوات أخرى

عند استخدام أداة مثل Terraform لإطلاق نسخة عُقدة التصفية باستخدام صورة GCP الخاصة بـWallarm، قد تحتاج إلى تقديم اسم هذه الصورة في تكوين Terraform.

* يكون لاسم الصورة الصيغة التالية:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* لإطلاق النسخة مع إصدار عُقدة التصفية 4.6، يرجى استخدام اسم الصورة التالي:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

للحصول على اسم الصورة، يمكنك أيضًا اتباع هذه الخطوات:

1. تثبيت [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. تنفيذ الأمر [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) مع الوسائط التالية:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. نسخ قيمة الإصدار من اسم أحدث صورة متوفرةوالصق القيمة المنسوخة في صيغة اسم الصورة المقدم. على سبيل المثال، سيكون لصورة عُقدة التصفية إصدار 4.6 الاسم التالي:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. تكوين نسخة عُقدة التصفية

قم بتنفيذ الإجراءات التالية لتكوين نسخة عُقدة التصفية المطلقة:

1. انتقل إلى صفحة **VM instances** في قسم **Compute Engine** من القائمة.
2. اختر نسخة عُقدة التصفية المطلقةواضغط على زر **Edit**.
3. اسمح بأنواع حركة المرور الواردة المطلوبة بتحديد الخانات المناسبة في إعداد **Firewalls**.
4. إذا لزم الأمر، يمكنك تقييد الاتصال بالنسخة باستخدام مفاتيح SSH الخاصة بالمشروع واستخدام زوج مفاتيح SSH مخصص للاتصال بهذه النسخة. للقيام بذلك، قم بتنفيذ الإجراءات التالية:
    1. حدد خانة **Block project-wide** في إعداد **SSH Keys**.
    2. اضغط على زر **Show and edit** في إعداد **SSH Keys** لتوسيع الحقل لإدخال مفتاح SSH.
    3. قم بإنشاء زوج من مفاتيح SSH العامة والخاصة. على سبيل المثال، يمكنك استخدام أدوات `ssh-keygen` و`PuTTYgen`.
       
        ![إنشاء مفاتيح SSH باستخدام PuTTYgen][img-ssh-key-generation]

    4. انسخ المفتاح المفتوح بتنسيق OpenSSH من واجهة مولد المفاتيح المستخدم (في المثال الحالي، يجب نسخ المفتاح العام من منطقة **Public key for pasting into OpenSSH authorized_keys file** في واجهة PuTTYgen) والصقه في الحقل الذي يحتوي على تلميح **Enter entire key data**.
    5. احفظ المفتاح الخاص. سيكون مطلوبًا للاتصال بالنسخة المُكونة في المستقبل.
5. اضغط على زر **Save** في أسفل الصفحة لتطبيق التغييرات. 

## 3. الاتصال بنسخة عُقدة التصفية عبر SSH

لرؤية معلومات مفصلة حول طرق الاتصال بالنسخ، انتقل إلى هذا [الرابط](https://cloud.google.com/compute/docs/instances/connecting-to-instance).

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. ربط عُقدة التصفية بسحابة Wallarm

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"