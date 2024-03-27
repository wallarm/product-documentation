تم الانتهاء من التوزيع حاليًا. قد يحتاج عقد التصفية إلى بعض الإعدادات الإضافية بعد التوزيع.

يتم تحديد إعدادات Wallarm باستخدام [توجيهات NGINX][wallarm-nginx-directives] أو واجهة المستخدم للوحة التحكم Wallarm. يجب تعيين التوجيهات في الملفات التالية على نموذج Wallarm:

* `/etc/nginx/sites-enabled/default` يحدد إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` يحدد الإعداد العام لعقدة تصفية Wallarm
* `/etc/nginx/conf.d/wallarm-status.conf` يحدد إعداد خدمة مراقبة عقدة التصفية
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

يمكنك تعديل الملفات المذكورة أو إنشاء ملفات إعداد خاصة بك لتحديد تشغيل NGINX وWallarm. يُنصح بإنشاء ملف إعداد منفصل يحتوي على كتلة `server` لكل مجموعة من النطاقات التي ينبغي معالجتها بنفس الطريقة (مثل `example.com.conf`). للاطلاع على معلومات مفصلة حول العمل مع ملفات إعداد NGINX، يرجى الانتقال إلى [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).

!!! info "إنشاء ملف إعداد"
    عند إنشاء ملف إعداد مخصص، تأكد من أن NGINX يستمع للاتصالات الواردة على منفذ خالٍ.

فيما يلي بعض الإعدادات النموذجية التي يمكنك تطبيقها إذا لزم الأمر:

* [تحجيم عقدة Wallarm تلقائيًا][autoscaling-docs]
* [عرض العنوان الحقيقي للعميل][real-ip-docs]
* [تخصيص الموارد لعقد Wallarm][allocate-memory-docs]
* [تحديد وقت معالجة الطلب الفردي][limiting-request-processing]
* [تحديد وقت انتظار رد الخادم](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [تحديد الحجم الأقصى للطلب](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [تسجيل عقدة Wallarm][logs-docs]