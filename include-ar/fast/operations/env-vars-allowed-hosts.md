[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! info "القيم الصالحة لمتغير `ALLOWED_HOSTS`"
    يقبل متغير `ALLOWED_HOSTS` التنسيقات التالية للمضيفين:

    * الأسماء المؤهلة بالكامل (مثل `node.example.local`)
    * قيمة تبدأ بنقطة (مثل `.example.local`) والتي تعرف على أنها علامة بديلة للنطاق الفرعي
    * قيمة `*` التي تطابق أي شيء (في هذه الحالة، يتم تسجيل جميع الطلبات بواسطة عقدة FAST)
    * مجموعة من القيم على سبيل المثال: `"(node.example.local|example.com)"`
    * تعبير منتظم في [الصيغة التي يدعمها NGINX](http://nginx.org/en/docs/http/server_names.html#regex_names)

    للمزيد من المعلومات حول قيم متغير `ALLOWED_HOSTS`, انتقل إلى هذا [الرابط][link-allowed-hosts].