![قائمة المستخدمين في واجهة Wallarm][img-wl-console-users]

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

!!! info "الوصول إلى API"
    يعتمد اختيار واجهة برمجة التطبيقات لعقدة التصفية الخاصة بك على السحابة التي تستخدمها. يرجى اختيار واجهة برمجة التطبيقات وفقًا لذلك:
    
    * إذا كنت تستخدم <https://my.wallarm.com/>، تتطلب عقدتك الوصول إلى `https://api.wallarm.com:444`.
    * إذا كنت تستخدم <https://us1.my.wallarm.com/>، تتطلب عقدتك الوصول إلى `https://us1.api.wallarm.com:444`.
    
    تأكد من أن الوصول ليس محظورًا بواسطة جدار ناري.

تتفاعل عقدة التصفية مع سحابة Wallarm.

لربط العقدة بالسحابة باستخدام بيانات حساب السحابة الخاصة بك، اتبع الخطوات التالية:

1.  تأكد من أن حسابك في Wallarm يملك دور **المدير** أو **النشر** مفعلًا ومصادقة ثنائية العوامل معطلة، مما يمكنك من ربط عقدة التصفية بالسحابة.
     
    يمكنك التحقق من البارامترات المذكورة أعلاه بالانتقال إلى قائمة حساب المستخدم في واجهة Wallarm.
    
    * إذا كنت تستخدم <https://my.wallarm.com/>، انتقل إلى [الرابط التالي][link-wl-console-users-eu] للتحقق من إعدادات المستخدم.
    * إذا كنت تستخدم <https://us1.my.wallarm.com/>، انتقل إلى [الرابط التالي][link-wl-console-users-us] للتحقق من إعدادات المستخدم.

2.  قم بتشغيل سكريبت `addnode` على جهاز حيث تقوم بتثبيت عقدة التصفية:
    
    !!! info
        يجب أن تختار السكريبت لتشغيله اعتمادًا على السحابة التي تستخدمها.
    
        * إذا كنت تستخدم <https://us1.my.wallarm.com/>, قم بتشغيل السكريبت من علامة التبويب **US Cloud** أدناه.
        * إذا كنت تستخدم <https://my.wallarm.com/>, قم بتشغيل السكريبت من علامة التبويب **EU Cloud** أدناه.
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    لتحديد اسم العقدة المُنشأة، استخدم خيار `-n <اسم العقدة>`. كذلك، يمكن تغيير اسم العقدة في واجهة Wallarm → **العقد**.

3.  قدم بريدك الإلكتروني وكلمة المرور الخاصة بحساب Wallarm عندما يُطلب منك.