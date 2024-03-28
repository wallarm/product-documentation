يتفاعل العقدة المرشحة مع سحابة Wallarm. لتوصيل العقدة بالسحابة:

1. افتح وحدة التحكم Wallarm → **العقد** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/nodes) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/nodes) وأنشئ عقدة من نوع **عقدة Wallarm**.

    ![إنشاء عقدة Wallarm][img-create-wallarm-node]
1. انسخ الرمز المولد.
1. قم بتشغيل السكربت `register-node` على جهاز حيث تقوم بتثبيت العقدة المرشحة:
    
    === "سحابة الولايات المتحدة"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "سحابة الاتحاد الأوروبي"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` هو قيمة الرمز المنسوخ.

    !!! info "استخدام رمز واحد لعدة تثبيتات"
        يمكنك استخدام رمز واحد في عدة تثبيتات بغض النظر عن [المنصة][deployment-platform-docs] المختارة. يسمح ذلك بتجميع العقد المنطقي في واجهة المستخدم لوحدة التحكم Wallarm. مثال: تقوم بنشر عدة عقد Wallarm في بيئة التطوير، كل عقدة على جهازها الخاص المملوك لمطور معين.