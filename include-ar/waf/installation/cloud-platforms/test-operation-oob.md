1. الطلب مع هجوم اختبار [Path Traversal][ptrav-attack-docs] إلى عنوان إما خادم الويب أو الخادم الوكيل الذي يعكس حركة المرور أو الجهاز الذي يحتوي على عقدة Wallarm:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. افتح واجهة Wallarm → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    ![الهجمات في الواجهة][attacks-in-ui-image]

نظرًا لأن Wallarm OOB يعمل في وضع المراقبة، فإن عقدة Wallarm لا تحجب الهجوم ولكنها تسجله.