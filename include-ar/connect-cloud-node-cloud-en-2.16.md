[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                #connecting-using-your-email-and-password

يتفاعل العقدة التصفية مع سحابة Wallarm. هناك طريقتان لربط العقدة بالسحابة:
* [استخدام رمز عقدة التصفية][anchor-token]
* [استخدام بريدك الإلكتروني وكلمة المرور الخاصة بحساب Wallarm][anchor-credentials]

!!! info "الصلاحيات المطلوبة"
    تأكد من أن حسابك في Wallarm يمتلك دور **المدير** أو **النشر** مفعلاً ومصادقة ثنائية العوامل معطلة، الأمر الذي يسمح لك بربط عقدة التصفية بالسحابة.

    يمكنك التحقق من البارامترات المذكورة أعلاه بالانتقال إلى قائمة حسابات المستخدمين في وحدة تحكم Wallarm.
    
    * إذا كنت تستخدم <https://my.wallarm.com/>، تابع إلى [الرابط التالي][link-wl-console-users-eu] لفحص إعدادات المستخدم الخاصة بك.
    * إذا كنت تستخدم <https://us1.my.wallarm.com/>، تابع إلى [الرابط التالي][link-wl-console-users-us] لفحص إعدادات المستخدم الخاصة بك.
    ![قائمة المستخدمين في وحدة تحكم Wallarm][img-wl-console-users]

#### الربط باستخدام رمز عقدة التصفية

لربط العقدة بالسحابة باستخدام الرمز، اتبع الخطوات التالية:

1. إنشاء عقدة جديدة في قسم **العقد** من وحدة تحكم Wallarm.
    1. اضغط على زر **إنشاء عقدة جديدة**.
    2. أنشئ **عقدة Wallarm**.
2. نسخ رمز العقدة.
3. على الجهاز الافتراضي قم بتشغيل سكريبت `addcloudnode`:
    
    !!! info
        عليك اختيار أي سكريبت تقوم بتشغيله بناءً على السحابة التي تستخدمها.
        
        * إذا كنت تستخدم <https://us1.my.wallarm.com/>، قم بتشغيل السكريبت من علامة تبويب **سحابة الولايات المتحدة** أدناه.
        * إذا كنت تستخدم <https://my.wallarm.com/>، قم بتشغيل السكريبت من علامة تبويب **سحابة الاتحاد الأوروبي** أدناه.
    
    === "سحابة الولايات المتحدة"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "سحابة الاتحاد الأوروبي"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. الصق رمز عقدة التصفية من الحافظة.

الآن، عقدتك ستتزامن مع السحابة كل 2‑4 دقائق وفقًا لتكوين المزامنة الافتراضي.

!!! info "تكوين مزامنة العقدة التصفية والسحابة"
    بعد تشغيل سكريبت `addcloudnode`، سيتم إنشاء الملف `/etc/wallarm/syncnode` الذي يحتوي على إعدادات مزامنة العقدة التصفية والسحابة. يمكن تغيير إعدادات مزامنة العقدة التصفية والسحابة من خلال الملف `/etc/wallarm/syncnode`.
    
    [مزيد من التفاصيل عن تكوين مزامنة العقدة التصفية وسحابة Wallarm →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### الربط باستخدام بريدك الإلكتروني وكلمة المرور

لربط العقدة بسحابة Wallarm باستخدام بيانات حسابك، اتبع الخطوات التالية:

1.  على الجهاز الافتراضي قم بتشغيل سكريبت `addnode`:
    
    !!! info
        عليك اختيار أي سكريبت تقوم بتشغيله بناءً على السحابة التي تستخدمها.
        
        * إذا كنت تستخدم <https://us1.my.wallarm.com/>، قم بتشغيل السكريبت من علامة تبويب **سحابة الولايات المتحدة** أدناه.
        * إذا كنت تستخدم <https://my.wallarm.com/>، قم بتشغيل السكريبت من علامة تبويب **سحابة الاتحاد الأوروبي** أدناه.
    
    === "سحابة الولايات المتحدة"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "سحابة الاتحاد الأوروبي"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2.  قدم بريدك الإلكتروني وكلمة المرور لحساب Wallarm عندما يُطلب منك.

!!! info "الوصول إلى واجهة برمجة التطبيقات"
    اختيار واجهة برمجة التطبيقات لعقدة التصفية يعتمد على السحابة التي تستخدمها. الرجاء، اختر واجهة برمجة التطبيقات وفقًا لذلك:
    
    * إذا كنت تستخدم <https://my.wallarm.com/>، عقدتك تتطلب الوصول إلى `https://api.wallarm.com:444`.
    * إذا كنت تستخدم <https://us1.my.wallarm.com/>، عقدتك تتطلب الوصول إلى `https://us1.api.wallarm.com:444`.
    
    تأكد من أن الوصول ليس محظورًا بواسطة جدار الحماية.

الآن، عقدتك ستتزامن مع السحابة كل 2‑4 دقائق وفقًا لتكوين المزامنة الافتراضي.

!!! info "تكوين مزامنة العقدة التصفية والسحابة"
    بعد تشغيل سكريبت `addnode`، سيتم إنشاء الملف `/etc/wallarm/node.yaml` الذي يحتوي على إعدادات مزامنة العقدة التصفية والسحابة وإعدادات أخرى ضرورية لتشغيل عقدة Wallarm بشكل صحيح. يمكن تغيير إعدادات مزامنة العقدة التصفية والسحابة عبر الملف `/etc/wallarm/node.yaml` ومتغيرات البيئة النظامية.
    
    [مزيد من التفاصيل عن تكوين مزامنة العقدة التصفية وسحابة Wallarm →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)