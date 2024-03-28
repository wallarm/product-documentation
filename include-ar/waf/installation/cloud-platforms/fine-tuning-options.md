اكتملت عملية النشر الآن. قد يتطلب عقدة التصفية Wallarm بعض الإعدادات الإضافية بعد النشر.

يتم تحديد إعدادات Wallarm باستخدام [توجيهات NGINX][wallarm-nginx-directives] أو واجهة المستخدم الخاصة بوحدة التحكم Wallarm. يجب تعيين التوجيهات في الملفات التالية على نسخة Wallarm:

* `/etc/nginx/sites-enabled/default` يحدد تكوين NGINX
* `/etc/nginx/conf.d/wallarm.conf` يحدد التكوين العالمي لعقدة تصفية Wallarm
* `/etc/nginx/conf.d/wallarm-status.conf` يحدد تكوين خدمة مراقبة عقدة التصفية
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

يمكنك تعديل الملفات المذكورة أو إنشاء ملفات تكوين خاصة بك لتحديد طريقة عمل NGINX وWallarm. يُنصح بإنشاء ملف تكوين منفصل بكتلة `server` لكل مجموعة من المجالات التي يجب معالجتها بنفس الطريقة (مثل `example.com.conf`). للاطلاع على معلومات مفصلة حول العمل مع ملفات تكوين NGINX، يُرجى الانتقال إلى [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).

!!! info "إنشاء ملف تكوين"
    عند إنشاء ملف تكوين مخصص، تأكد من استماع NGINX إلى الاتصالات الواردة على المنفذ الخالي.

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [التوسع التلقائي لعقدة Wallarm][autoscaling-docs]
* [عرض العنوان الحقيقي للعميل][real-ip-docs]
* [تخصيص الموارد لعقد Wallarm][allocate-memory-docs]
* [تحديد زمن معالجة الطلب الفردي][limiting-request-processing]
* [تحديد وقت انتظار رد الخادم](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [تحديد الحجم الأقصى للطلب](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [تسجيل عقدة Wallarm][logs-docs]