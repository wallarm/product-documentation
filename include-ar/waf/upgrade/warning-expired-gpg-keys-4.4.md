!!! تحذير "خطأ ""لا يمكن التحقق من التواقيع"""
    في حال انتهت صلاحية مفاتيح GPG المضافة، ستظهر الرسالة التالية:

    ```
    W: خطأ GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release:لا يمكن التحقق من التواقيع التالية لأن المفتاح العمومي غير متاح: NO_PUBKEY 1111FQQW999
    E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release' غير موقع.
    N: لا يمكن تحديث من مستودع كهذا بأمان، ولذلك يتم تعطيله افتراضياً.
    N: انظر صفحة الدليل apt-secure(8) للحصول على تفاصيل إنشاء المستودع وتكوين المستخدم.
    ```

    لحل المشكلة، يرجى استيراد مفاتيح GPG الجديدة لحزم Wallarm ثم ترقية الحزم باستخدام الأوامر التالية:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```