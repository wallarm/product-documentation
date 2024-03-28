!!! تحذير "خطأ "لا يمكن التحقق من التواقيع"
    إذا انتهت صلاحية المفاتيح GPG المضافة، سيتم إرجاع الخطأ التالي:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release:لم يمكن التحقق من التواقيع التالية لأن المفتاح العام غير متوفر: NO_PUBKEY 1111FQQW999
    E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' غير موقع.
    N: لا يمكن التحديث من مستودع كهذا بأمان، وبالتالي يتم تعطيله بشكل افتراضي.
    N: انظر صفحة الرجل apt-secure(8) لتفاصيل إنشاء المستودع وتكوين المستخدم.
    ```

    لحل المشكلة، يرجى استيراد مفاتيح GPG الجديدة لحزم Wallarm ثم ترقية الحزم باستخدام الأوامر التالية:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```