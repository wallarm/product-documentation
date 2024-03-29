لفحص تفاعل وحدة NGINX‑Wallarm ووحدات تحليل بيانات الهجمات المنفصلة، يُمكنك إرسال طلب مع هجوم اختباري إلى عنوان التطبيق المحمي:

```bash
curl http://localhost/etc/passwd
```

إذا تم تكوين وحدة NGINX‑Wallarm ووحدات تحليل بيانات الهجمات المنفصلة بشكل صحيح، سيتم تحميل الهجوم إلى سحابة Wallarm ويُعرض في قسم **الهجمات** بواجهة Wallarm:

![الهجمات في الواجهة][img-attacks-in-interface]

إذا لم يتم تحميل الهجوم إلى السحابة، يرجى التحقق من عدم وجود أخطاء في تشغيل الخدمات:

* تحليل سجلات وحدة تحليل بيانات الهجمات

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    إذا كان هناك سجل مثل `SystemError binary: failed to bind: Cannot assign requested address`، تأكد من أن الخادم يقبل الاتصال على العنوان والمنفذ المحددين.
* على الخادم الذي يحتوي على وحدة NGINX‑Wallarm، تحليل سجلات NGINX:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    إذا كان هناك سجل مثل `[error] wallarm: <address> connect() failed`، تأكد من تحديد عنوان وحدة تحليل بيانات الهجمات المنفصلة بشكل صحيح في ملفات تكوين وحدة NGINX‑Wallarm وأن خادم تحليل بيانات الهجمات المنفصل يقبل الاتصال على العنوان والمنفذ المحددين.
* على الخادم الذي يحتوي على وحدة NGINX‑Wallarm، احصل على إحصائيات الطلبات المعالجة باستخدام الأمر أدناه وتأكد من أن قيمة `tnt_errors` هي 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [وصف جميع البارامترات المُعادة بواسطة خدمة الإحصائيات →][statistics-service-all-parameters]