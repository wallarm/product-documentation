تم تكوين قواعد التصفية والوكالة في ملف `/etc/kong/nginx-wallarm.template`.

للاطلاع على معلومات مفصلة حول التعامل مع ملفات تهيئة NGINX، انتقل إلى [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).

تحدد توجيهات Wallarm منطق تشغيل عقدة تصفية Wallarm. للاطلاع على قائمة خيارات تهيئة Wallarm المتوفرة، انتقل إلى صفحة [خيارات تهيئة Wallarm](../admin-en/configure-parameters-en.md).

**مثال على ملف التهيئة**

لنفترض أنك تحتاج إلى تهيئة الخادم للعمل في الشروط التالية:
* يتم معالجة حركة المرور HTTP فقط. لا يتم معالجة طلبات HTTPS.
* النطاقات التالية تتلقى الطلبات: `example.com` و `www.example.com`.
* يجب تمرير جميع الطلبات إلى الخادم `10.80.0.5`.
* يعتبر جميع الطلبات الواردة أقل من 1MB في الحجم (الإعداد الافتراضي).
* لا يستغرق معالجة طلب أكثر من 60 ثانية (الإعداد الافتراضي).
* يجب أن يعمل Wallarm في وضع المراقبة.
* العملاء يصلون إلى عقدة التصفية مباشرةً، بدون موازن حمل HTTP وسيط.

لتلبية الشروط المذكورة، يجب أن يكون محتوى ملف التهيئة كالتالي:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # النطاقات التي يتم معالجة حركة المرور الخاصة بها
      server_name example.com; 
      server_name www.example.com;

      # تفعيل وضع المراقبة لمعالجة حركة المرور
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # تحديد العنوان لتوجيه الطلب
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```