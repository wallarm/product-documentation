1. الطلب مع هجوم [Path Traversal][ptrav-attack-docs] إلى عنوان إما الخادم الوكيل أو خادم الويب الذي يعكس المرور أو الآلة التي تحتوي على عقدة Wallarm:

    ```
    curl http://<عنوان>/etc/passwd
    ```
2. افتح واجهة Wallarm → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/search) أو [السحابة الأوروبية](https://my.wallarm.com/search) وتأكد من ظهور الهجوم في القائمة.
    ![الهجمات في الواجهة][attacks-in-ui-image]

بما أن Wallarm OOB يعمل في وضع المراقبة، فإن عقدة Wallarm لا تحظر الهجوم بل تسجله.