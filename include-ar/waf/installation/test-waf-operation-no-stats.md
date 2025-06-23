1. أرسل الطلب مع هجوم [اختراق مسار][ptrav-attack-docs] لعنوان المورد المحمي:

    ```
    curl http://localhost/etc/passwd
    ```
2. افتح واجهة Wallarm → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
   ![الهجمات في الواجهة][attacks-in-ui-image]