يتفاعل العقد الفلتر مع سحابة Wallarm. لربط العقدة بالسحابة:

1. افتح وحدة التحكم Wallarm → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes) وأنشئ العقدة من نوع **عقدة Wallarm**.

    ![إنشاء عقدة Wallarm][img-create-wallarm-node]
1. انسخ الرمز المُنشأ.
1. قم بتشغيل سكربت `register-node` على جهاز حيث تقوم بتثبيت العقدة الفلتر:

    === "السحابة الأمريكية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "السحابة الأوروبية"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` هو قيمة الرمز المنسوخ.

    !!! info "استخدام رمز واحد لعدة تثبيتات"
        يمكنك استخدام رمز واحد في عدة تثبيتات بغض النظر عن ال[منصة][deployment-platform-docs] المختارة. يسمح ذلك بتجميع منطقي لنماذج العقد في واجهة مستخدم وحدة التحكم Wallarm. مثال: تقوم بنشر عدة عقد Wallarm في بيئة تطوير، كل عقدة على جهازها الخاص المملوك لمطور معين.