1. أرسل الطلب مع اختبار هجمات [SQLI][sqli-attack-docs] و[XSS][xss-attack-docs] إلى عنوان المورد المحمي:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. افتح واجهة Wallarm → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/search) أو [السحابة الأوروبية](https://my.wallarm.com/search) وتأكد من عرض الهجمات في القائمة.
    ![الهجمات في الواجهة][attacks-in-ui-image]