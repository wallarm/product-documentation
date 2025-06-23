1. الطلب مع هجوم [اختبار اختراق المسار][ptrav-attack-docs] إلى عنوان إما موزع الحمل أو الجهاز الذي يحتوي على عقدة Wallarm:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. افتح واجهة Wallarm → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    ![الهجمات في الواجهة][attacks-in-ui-image]

بما أن Wallarm يعمل في وضع المراقبة، فإن عقدة Wallarm لا تقوم بحظر الهجوم ولكنها تسجله.