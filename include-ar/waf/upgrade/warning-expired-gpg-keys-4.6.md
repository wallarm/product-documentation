!!! تحذير "خطأ "تعذر التحقق من التواقيع"
    في حال كانت مفاتيح GPG المضافة قد انتهت صلاحيتها، سيرد الخطأ التالي:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release: لا يمكن التحقق من التواقيع التالية لأن المفتاح العام غير متوفر: NO_PUBKEY 1111FQQW999
    E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release' غير موقع.
    N: لا يمكن إجراء التحديث من مثل هذا المستودع بأمان، ولذلك يتم تعطيلها بشكل افتراضي.
    N: انظر إلى صفحة رجل apt-secure(8) لتفاصيل إنشاء المستودع وتكوين المستخدم.
    ```

    لإصلاح المشكلة، يرجى استيراد مفاتيح GPG الجديدة لحزم Wallarm ثم ترقية الحزم باستخدام الأوامر التالية:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```