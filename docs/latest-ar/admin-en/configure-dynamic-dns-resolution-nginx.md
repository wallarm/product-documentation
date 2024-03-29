# تكوين حل النطاقات الديناميكي في NGINX

إذا تم تمرير اسم النطاق في توجيه `proxy_pass` في ملف تكوين NGINX، فإن NGINX سيقوم بحل عنوان IP للمضيف مرة واحدة فقط بعد البدء. إذا قام خادم DNS بتغيير عنوان IP للمضيف، فسيستمر NGINX في استخدام عنوان IP القديم حتى يتم إعادة تحميل أو إعادة تشغيل NGINX. قبل ذلك، سيقوم NGINX بإرسال الطلبات إلى عنوان IP الخطأ.

على سبيل المثال:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

للحل الديناميكي للنطاقات، يمكنك تعيين توجيه `proxy_pass` كمتغير. في هذه الحالة، سيستخدم NGINX عنوان DNS المحدد في توجيه [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) عند حساب المتغير.

!!! تحذير "تأثير حل النطاقات الديناميكي على معالجة الحركة"
    * تبطئ تكوينات NGINX التي تحتوي على توجيه `resolver` ومتغير في توجيه `proxy_pass` من معالجة الطلب نظرًا لوجود خطوة إضافية لحل النطاقات الديناميكي في معالجة الطلب.
    * يعيد NGINX حل اسم النطاق عندما تنتهي مدة صلاحيته (TTL). بإدراج معامل `valid` إلى توجيه `resolver`، يمكنك إخبار NGINX بتجاهل TTL وإعادة حل الأسماء بتردد محدد بدلاً من ذلك.
    * إذا كان خادم DNS غير متاح، لن يقوم NGINX بمعالجة الحركة.

على سبيل المثال:

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! معلومة "حل النطاقات الديناميكي في NGINX Plus"
    يدعم NGINX Plus حل النطاقات الديناميكي افتراضيًا.