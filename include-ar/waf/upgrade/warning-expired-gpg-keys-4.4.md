!!! warning "خطأ "التوقيعات لم يتم التحقق منها""
    إذا انتهت صلاحية مفاتيح GPG المضافة، ستُرجَع الخطأ التالي:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release:التوقيعات التالية
    لم يتم التحقق منها لأن المفتاح العمومي غير متاح: NO_PUBKEY 1111FQQW999
    E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release' غير موقع.
    N: لا يمكن إجراء التحديث من مثل هذا المستودع بأمان، وبالتالي يتم تعطيله بشكل افتراضي.
    N: انظر إلى صفحة رجل apt-secure(8) لتفاصيل إنشاء المستودع وتكوين المستخدم.
    ```

    لإصلاح المشكلة، يُرجى استيراد مفاتيح GPG الجديدة لحزم Wallarm ثم ترقية الحزم باستخدام الأوامر التالية:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```