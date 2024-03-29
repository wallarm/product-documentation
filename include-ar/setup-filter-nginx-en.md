تحتوي الملفات التالية على إعدادات NGINX وعقدة تصفية Wallarm:

* `/etc/nginx/nginx.conf` يحدد تكوين NGINX
* `/etc/nginx/conf.d/wallarm.conf` يحدد التكوين العالمي لعقدة تصفية Wallarm
* `/etc/nginx/conf.d/wallarm-status.conf` يحدد تكوين خدمة مراقبة عقدة التصفية

يمكنك إنشاء ملفات تكوين خاصة بك لتحديد طريقة عمل NGINX وWallarm. يُنصح بإنشاء ملف تكوين منفصل بكتلة `server` لكل مجموعة من النطاقات التي يجب معالجتها بنفس الطريقة.

لرؤية معلومات مفصلة عن العمل مع ملفات تكوين NGINX، انتقل إلى [الوثائق الرسمية لـNGINX](https://nginx.org/en/docs/beginners_guide.html).

تحدد تعليمات Wallarm منطق عمل عقدة تصفية Wallarm. لرؤية قائمة بالتعليمات المتاحة لـWallarm، انتقل إلى صفحة [خيارات تكوين Wallarm](configure-parameters-en.md).

**مثال على ملف التكوين**

لنفترض أنك بحاجة إلى تكوين الخادم للعمل في الظروف التالية:
* يتم معالجة حركة المرور HTTP فقط. لا يتم معالجة طلبات HTTPS.
* النطاقات التالية تتلقى الطلبات: `example.com` و`www.example.com`.
* يجب تمرير جميع الطلبات إلى الخادم `10.80.0.5`.
* يعتبر جميع الطلبات الواردة أقل من 1MB في الحجم (الإعداد الافتراضي).
* معالجة طلب لا تستغرق أكثر من 60 ثانية (الإعداد الافتراضي).
* يجب أن تعمل Wallarm في وضع المراقبة.
* العملاء يصلون إلى عقدة التصفية مباشرة، بدون موازن تحميل HTTP وسيط.

!!! info "إنشاء ملف تكوين"
    يمكنك إنشاء ملف تكوين NGINX مخصص (مثل `example.com.conf`) أو تعديل ملف تكوين NGINX الافتراضي (`default.conf`).
    
    عند إنشاء ملف تكوين مخصص، تأكد من أن NGINX يستمع إلى الاتصالات الواردة على المنفذ الحر.

لتلبية الشروط المذكورة، يجب أن يكون محتوى ملف التكوين كالتالي:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # النطاقات التي يتم معالجة حركة المرور الخاصة بها
      server_name example.com; 
      server_name www.example.com;

      # تشغيل وضع مراقبة معالجة حركة المرور
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # تحديد عنوان إعادة توجيه الطلب
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```