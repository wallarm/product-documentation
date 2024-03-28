!!! تحذير "الخطأ "لا يمكن التحقق من التواقيع"
    إذا انتهت صلاحية مفاتيح GPG المضافة، سيتم إرجاع الخطأ التالي:

    ```
    W: خطأ GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.2/ الإصدار:لا يمكن التحقق من التواقيع التالية لأن المفتاح العام غير متوفر: NO_PUBKEY 1111FQQW999
    E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.2/ الإصدار' غير موقع.
    N: لا يمكن القيام بالتحديث من مستودع كهذا بأمان، ولذلك يتم تعطيله بشكل افتراضي.
    N: انظر إلى صفحة رجل apt-secure(8) لتفاصيل إنشاء المستودع وتكوين المستخدم.
    ```

    لحل المشكلة، يرجى استيراد مفاتيح GPG الجديدة لحزم Wallarm ثم تحديث الحزم باستخدام الأوامر التالية:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```