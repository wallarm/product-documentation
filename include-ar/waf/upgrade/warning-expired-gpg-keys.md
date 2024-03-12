!!! تحذير "خطأ "التوقيعات لا يمكن التحقق منها""
    إذا انتهت صلاحية مفاتيح GPG المضافة، سيتم إرجاع الخطأ التالي:

    ```
    W: خطأ GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: التوقيعات التالية
    لا يمكن التحقق منها لأن المفتاح العمومي غير متوفر: NO_PUBKEY 1111FQQW999
    E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' غير موقع.
    N: تحديث من مثل هذا المستودع لا يمكن أن يتم بأمان، ولذلك يتم تعطيله افتراضيًا.
    N: انظر إلى صفحة رجل apt-secure(8) لتفاصيل إنشاء المستودع وتكوين المستخدم.
    ```

    لحل المشكلة، الرجاء استيراد مفاتيح GPG الجديدة لحزم Wallarm ثم ترقية الحزم باستخدام الأوامر التالية:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```