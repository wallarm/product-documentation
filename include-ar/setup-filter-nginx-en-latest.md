تحتوي الملفات التالية على إعدادات NGINX وعقدة فلترة Wallarm:

* `/etc/nginx/nginx.conf` يُعرّف تكوين NGINX
* `/etc/nginx/conf.d/wallarm.conf` يُعرّف التكوين العالمي لعقدة فلترة Wallarm
* `/etc/nginx/conf.d/wallarm-status.conf` يُعرّف تكوين خدمة مراقبة عقدة الفلترة

يمكنك إنشاء ملفات تكوين خاصة بك لتعريف عمل NGINX وWallarm. يُنصح بإنشاء ملف تكوين منفصل يحتوي على `server` لكل مجموعة من النطاقات التي يجب معالجتها بنفس الطريقة.

لرؤية معلومات تفصيلية حول العمل مع ملفات تكوين NGINX، انتقل إلى [وثائق NGINX الرسمية](https://nginx.org/en/docs/beginners_guide.html).

تعرّف تعليمات Wallarm منطق عمل عقدة فلترة Wallarm. لرؤية قائمة التعليمات Wallarm المتاحة، انتقل إلى صفحة [خيارات تكوين Wallarm](configure-parameters-en.md).

**مثال على ملف تكوين**

لنفترض أنك بحاجة إلى تكوين الخادم ليعمل في الظروف التالية:
* يتم معالجة حركة مرور HTTP فقط. لا يتم معالجة طلبات HTTPS.
* النطاقات التالية تتلقى الطلبات: `example.com` و`www.example.com`.
* يجب تمرير جميع الطلبات إلى الخادم `10.80.0.5`.
* يُعتبر جميع الطلبات الواردة أقل من 1MB في الحجم (الإعداد الافتراضي).
* معالجة الطلب لا تستغرق أكثر من 60 ثانية (الإعداد الافتراضي).
* يجب أن تعمل Wallarm في وضع المراقبة.
* العملاء يصلون إلى عقدة الفلترة مباشرةً، بدون موازن تحميل HTTP وسيط.

!!! info "إنشاء ملف تكوين"
    يمكنك إنشاء ملف تكوين NGINX مخصص (مثل `example.com.conf`) أو تعديل ملف تكوين NGINX الافتراضي (`default.conf`).
    
    عند إنشاء ملف تكوين مخصص، تأكد من أن NGINX يستمع إلى الاتصالات الواردة على المنفذ الحر.


لتلبية الشروط المذكورة، يجب أن يكون محتوى ملف التكوين كما يلي:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # النطاقات التي يتم معالجة حركة المرور لها
      server_name example.com; 
      server_name www.example.com;

      # تشغيل وضع مراقبة معالجة حركة المرور
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # ضبط العنوان لتوجيه الطلب
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```