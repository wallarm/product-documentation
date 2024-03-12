[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

!!! info "دخول API"
    اختيار API لعقدة التصفية بتاعتك بيعتمد على السحابة اللي بتستخدمها. من فضلك، اختار API بناءً على ده:
    
    * لو بتستخدم <https://my.wallarm.com/>, العقدة بتاعتك هتحتاج دخول لـ `https://api.wallarm.com:444`.
    * لو بتستخدم <https://us1.my.wallarm.com/>, العقدة بتاعتك هتحتاج دخول لـ `https://us1.api.wallarm.com:444`.
    
    اتأكد إن الدخول مش محظور بسبب جدار الحماية.

العقدة بتتفاعل مع سحابة Wallarm.

علشان توصل العقدة بالسحابة باستخدام إعدادات حسابك في السحابة، اتبع الخطوات دي:

1.  اتأكد إن حساب Wallarm بتاعك عنده دور **المدير** أو **النشر** ممكن والتحقق بخطوتين معطّل, كده هتقدر توصل عقدة التصفية بالسحابة.
     
    تقدر تتأكد من الباراميترات دي من خلال الدخول على قائمة حسابات المستخدم في وحدة التحكم Wallarm.
    
    * لو بتستخدم <https://my.wallarm.com/>, اتجه لـ [الرابط ده][link-wl-console-users-eu] علشان تتأكد من إعدادات المستخدمين.
    * لو بتستخدم <https://us1.my.wallarm.com/>, اتجه لـ [الرابط ده][link-wl-console-users-us] علشان تتأكد من إعدادات المستخدمين.

    ![قائمة المستخدمين في وحدة التحكم Wallarm][img-wl-console-users]

2.  شغّل سكريبت `addnode` على الجهاز اللي هتثبت عليه العقدة التصفية:
    
    !!! info
        لازم تختار السكريبت اللي هتشغله على حسب السحابة اللي بتستخدمها.
    
        * لو بتستخدم <https://us1.my.wallarm.com/>, شغّل السكريبت من تبويب **السحابة الأمريكية** اللي تحت.
        * لو بتستخدم <https://my.wallarm.com/>, شغّل السكريبت من تبويب **السحابة الأوروبية** اللي تحت.
    
    === "السحابة الأمريكية"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "السحابة الأوروبية"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```

علشان تحدد اسم العقدة اللي انشأتها، استخدم خيار `-n <اسم العقدة>`. كمان ممكن تغير اسم العقدة من وحدة التحكم Wallarm → **العقد**.

3.  وفّر بريدك الإلكتروني وكلمة المرور لحساب Wallarm لما يُطلب منك.