الملفات التالية تحتوي على إعدادات NGINX وعقدة التصفية:

* `/etc/nginx/nginx.conf` يحدد تكوين NGINX
* `/etc/nginx/conf.d/wallarm.conf` يحدد التكوين العالمي لعقدة تصفية Wallarm
* `/etc/nginx/conf.d/wallarm-status.conf` يحدد تكوين خدمة مراقبة عقدة التصفية

يمكنك إنشاء ملفات تكوين خاصة بك لتحديد عملية NGINX و Wallarm. يُنصح بإنشاء ملف تكوين منفصل بكتلة `server` لكل مجموعة من النطاقات التي يجب معالجتها بنفس الطريقة.

للاطلاع على معلومات مفصلة حول العمل مع ملفات تكوين NGINX، يرجى التوجه إلى [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).

تحدد توجيهات Wallarm منطق عمل عقدة تصفية Wallarm. لرؤية قائمة توجيهات Wallarm المتاحة، يرجى التوجه إلى صفحة [خيارات تكوين Wallarm](configure-parameters-en.md).

**مثال على ملف التكوين**

لنفترض أنك بحاجة لتكوين الخادم للعمل في الشروط التالية:
* يتم معالجة حركة المرور HTTP فقط. لا تتم معالجة طلبات HTTPS.
* النطاقات التالية تتلقى الطلبات: `example.com` و `www.example.com`.
* يجب تمرير جميع الطلبات إلى الخادم `10.80.0.5`.
* يُعتبر جميع الطلبات الواردة أقل من 1MB في الحجم (الإعداد الافتراضي).
* لا تستغرق معالجة طلب أكثر من 60 ثانية (الإعداد الافتراضي).
* يجب أن تعمل Wallarm في وضع المراقبة.
* يصل العملاء إلى عقدة التصفية مباشرةً، دون موازن تحميل HTTP وسيط.

!!! info "إنشاء ملف تكوين"
    يمكنك إنشاء ملف تكوين NGINX مخصص (مثل `example.com.conf`) أو تعديل ملف تكوين NGINX الافتراضي (`default.conf`).
    
    عند إنشاء ملف تكوين مخصص، تأكد من أن NGINX يستمع إلى الاتصالات الواردة على المنفذ الخالي.

لتلبية الشروط المذكورة، يجب أن يكون محتوى ملف التكوين على النحو التالي:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # النطاقات التي يتم معالجة حركة المرور لها
      server_name example.com; 
      server_name www.example.com;

      # تشغيل وضع المراقبة لمعالجة حركة المرور
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # إعداد العنوان لتوجيه الطلب
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```