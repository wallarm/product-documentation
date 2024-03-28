!!! info "القيم الصالحة لمتغير `ALLOWED_HOSTS`"
    متغير `ALLOWED_HOSTS` يقبل صيغ الاستضافة التالية:

    * الأسماء المؤهلة بالكامل (مثلاً `node.example.local`)
    * قيمة تبدأ بنقطة (مثلاً `.example.local`) والتي تُعرف كبطاقة وحشية للنطاق الفرعي
    * قيمة `*` التي تطابق أي شيء (في هذه الحالة، يُسجل جميع الطلبات بواسطة عقدة FAST)
    * مجموعة من عدة قيم، على سبيل المثال: `"(node.example.local|example.com)"`
    * تعبير منتظم في [الصياغة التي يدعمها NGINX](http://nginx.org/en/docs/http/server_names.html#regex_names)

    لمزيد من المعلومات حول قيم متغير `ALLOWED_HOSTS`، يرجى الانتقال إلى هذا [الرابط][link-allowed-hosts].