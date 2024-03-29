!!! تحذير "خطأ "لا يمكن التحقق من التوقيعات
    إذا انتهت صلاحية مفاتيح GPG المضافة، سيتم إرجاع الخطأ التالي:

    ```
    W: خطأ GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Release:لا يمكن التحقق من التوقيعات التالية لأن المفتاح العمومي غير متاح: NO_PUBKEY 1111FQQW999
    E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Release' غير موقع.
    N: لا يمكن إجراء التحديث من مستودع كهذا بشكل آمن، ولذلك يتم تعطيله بشكل افتراضي.
    N: انظر إلى صفحة الرجل apt-secure(8) لتفاصيل إنشاء المستودع وتكوين المستخدم.
    ```

    لحل المشكلة، يرجى استيراد مفاتيح GPG الجديدة لحزم Wallarm ومن ثم ترقية الحزم باستخدام الأوامر التالية:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```