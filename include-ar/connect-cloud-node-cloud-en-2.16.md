[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                      #connecting-using-your-email-and-password

العقدة الفلترة تتفاعل مع سحابة Wallarm. يوجد طريقتين لربط العقدة بالسحابة:
* [باستخدام رمز العقدة الفلترة][anchor-token]
* [باستخدام بريدك الإلكتروني لحساب Wallarm وكلمة السر الخاصة بك][anchor-credentials]

!!! info "حقوق الدخول المطلوبة"
    تأكد من أن حساب Wallarm الخاص بك يحتوي على دور **المدير** أو **التنشير** مُفعّل والتوثيق الثنائي غير مُفعّل للسماح لك بربط العقدة الفلترة بالسحابة.

    يمكنك مراجعة البارامترات المذكورة أعلاه من خلال التوجه إلى قائمة حسابات المستخدمين في لوحة تحكم Wallarm.
    
    * إذا كنت تستخدم <https://my.wallarm.com/>, توجه إلى [الرابط التالي][link-wl-console-users-eu] لمراجعة إعدادات مستخدمك.
    * إذا كنت تستخدم <https://us1.my.wallarm.com/>, توجه إلى [الرابط التالي][link-wl-console-users-us] لمراجعة إعدادات مستخدمك.
    ![قائمة المستخدمين في لوحة تحكم Wallarm][img-wl-console-users]

#### الربط بإستخدام رمز العقدة الفلترة

لربط العقدة بالسحابة باستخدام الرمز، اتبع الخطوات التالية:

1. أنشئ عقدة جديدة في قسم **العقد** في لوحة تحكم Wallarm.
    1. اضغط زر **إنشاء عقدة جديدة**.
    2. أنشئ **عقدة Wallarm**.
2. انسخ رمز العقدة.
3. قم بتشغيل سكربت `addcloudnode` على الآلة الإفتراضية:
    
    !!! info
        عليك اختيار السكربت الذي ترغب في تشغيله بناءً على السحابة التي تستخدمها.
        
        * إذا كنت تستخدم <https://us1.my.wallarm.com/>, قم بتشغيل السكربت من التبويب **US Cloud** أدناه.
        * إذا كنت تستخدم <https://my.wallarm.com/>, قم بتشغيل السكربت من التبويب **EU Cloud** أدناه.
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. الصق رمز العقدة الفلترة من الحافظة الخاصة بك. 

الآن ستتزامن عقدتك مع السحابة كل ٢ إلى ٤ دقائق وفقًا لتكوين التزامن الافتراضي.

!!! info "تكوين تزامن العقدة الفلترة والسحابة"
    بعد تشغيل سكربت `addcloudnode`، سيتم إنشاء ملف `/etc/wallarm/syncnode` الذي يحتوي على إعدادات تزامن العقدة الفلترة والسحابة. يمكن تغيير إعدادات تزامن العقدة الفلترة والسحابة عبر ملف `/etc/wallarm/syncnode`.
    
    [المزيد من التفاصيل حول تكوين تزامن العقدة الفلترة وسحابة Wallarm →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### الربط بإستخدام بريدك الإلكتروني وكلمة السر

لربط العقدة بسحابة Wallarm باستخدام بيانات حسابك، اتبع الخطوات التالية:

1.  قم بتشغيل سكربت `addnode` على الآلة الإفتراضية:
    
    !!! info
        عليك اختيار السكربت الذي ترغب في تشغيله بناءً على السحابة التي تستخدمها.
        
        * إذا كنت تستخدم <https://us1.my.wallarm.com/>, قم بتشغيل السكربت من التبويب **US Cloud** أدناه.
        * إذا كنت تستخدم <https://my.wallarm.com/>, قم بتشغيل السكربت من التبويب **EU Cloud** أدناه.
    
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2.  قدم بريد حساب Wallarm وكلمة السر الخاصة بك عندما يُطلب منك.

!!! info "وصول API"
    اختيار API لعقدتك الفلترة يعتمد على السحابة التي تستخدمها. الرجاء، اختيار API وفقًا لذلك:
    
    * إذا كنت تستخدم <https://my.wallarm.com/>, تحتاج عقدتك إلى وصول `https://api.wallarm.com:444`.
    * إذا كنت تستخدم <https://us1.my.wallarm.com/>, تحتاج عقدتك إلى وصول `https://us1.api.wallarm.com:444`.
    
    تأكد من أن الوصول ليس محظورًا بجدار حماية.

الآن ستتزامن عقدتك مع السحابة كل ۲ إلى ٤ دقائق وفقًا لتكوين التزامن الافتراضي.

!!! info "تكوين تزامن العقدة الفلترة والسحابة"
    بعد تشغيل سكربت `addnode`, سيتم إنشاء ملف `/etc/wallarm/node.yaml` الذي يحتوي على إعدادات تزامن العقدة الفلترة والسحابة بالإضافة إلى إعدادات أخرى مطلوبة لعمل عقدة Wallarm بشكل صحيح. يمكن تغيير إعدادات تزامن العقدة الفلترة والسحابة عبر ملف `/etc/wallarm/node.yaml` ومتغيرات البيئة النظامية.
    
    [المزيد من التفاصيل حول تكوين تزامن العقدة الفلترة وسحابة Wallarm →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)