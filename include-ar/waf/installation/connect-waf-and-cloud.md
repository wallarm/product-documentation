عقدة Wallarm بتتفاعل مع سحابة Wallarm. علشان توصل العقدة الفلترة بالسحابة، اتبع الخطوات التالية:

1. تأكد إن حسابك في Wallarm يمتلك دور **المدير** أو **النشر** مفعل والمصادقة الثنائية معطلة في لوحة تحكم Wallarm.
   
   ممكن تتحقق من الإعدادات المذكورة بالذهاب إلى قائمة المستخدمين في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/users) أو [السحابة الأوروبية](https://my.wallarm.com/settings/users).

   ![قائمة المستخدمين في لوحة تحكم Wallarm][img-wl-console-users]

2. جرّي سكربت `addnode` في نظام مع تثبيت عقدة Wallarm:

    === "السحابة الأمريكية"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "السحابة الأوروبية"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. ادخل البريد الإلكتروني وكلمة السر لحسابك في لوحة تحكم Wallarm.
4. ادخل اسم العقدة الفلترة أو اضغط Enter لاستعمال اسم مولّد تلقائيًا.

    يمكن تغيير الاسم المحدد في لوحة تحكم Wallarm → **العقد** لاحقًا.
5. افتح لوحة تحكم Wallarm  → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وتأكد من إضافة عقدة فلترة جديدة للقائمة.