1. الطلب بتجربة [هجوم Path Traversal][ptrav-attack-docs] إلى عنوان إما موزع الحمل أو الجهاز الذي يحتوي على عقدة Wallarm:

   ```
   curl http://<ADDRESS>/etc/passwd
   ```

2. افتح واجهة Wallarm → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/search) أو [السحابة الأوروبية](https://my.wallarm.com/search) وتأكد من عرض الهجوم في القائمة.
   ![الهجمات في الواجهة][attacks-in-ui-image]

بما أن Wallarm يعمل في وضع المراقبة، فإن عقدة Wallarm لا تقوم بحجب الهجوم ولكن تقوم بتسجيله.