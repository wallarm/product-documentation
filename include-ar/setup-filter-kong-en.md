تُكون قواعد التصفية والوكالة مُهيأة في ملف `/etc/kong/nginx-wallarm.template`.

لرؤية معلومات مفصلة حول العمل مع ملفات التهيئة الخاصة بـ NGINX، يُرجى الانتقال إلى [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).

تُعرف تعليمات Wallarm منطق عمل عقدة التصفية Wallarm. لرؤية قائمة الخيارات التهيئية لـ Wallarm المتاحة، يُرجى الانتقال إلى صفحة [خيارات تهيئة Wallarm](../admin-en/configure-parameters-en.md).

**مثال على ملف التهيئة**

لنفترض أنك تحتاج إلى تهيئة الخادم للعمل في الظروف التالية:
* فقط حركة الـ HTTP يتم معالجتها. لا يتم معالجة طلبات HTTPS.
* النطاقات التالية تتلقى الطلبات: `example.com` و `www.example.com`.
* يجب تمرير جميع الطلبات إلى الخادم `10.80.0.5`.
* جميع الطلبات الواردة تُعتبر أقل من 1MB في الحجم (إعداد افتراضي).
* معالجة طلب لا تستغرق أكثر من 60 ثانية (إعداد افتراضي).
* يجب أن يعمل Wallarm في وضع المراقبة.
* العملاء يصلون إلى عقدة التصفية مباشرة، بدون موازن تحميل HTTP وسيط.

لتلبية الشروط المذكورة، يجب أن يكون محتوى ملف التهيئة كالتالي:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # النطاقات التي يتم معالجة الحركة لها
      server_name example.com; 
      server_name www.example.com;

      # تشغيل وضع المراقبة لمعالجة الحركة
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # تحديد عنوان لإعادة توجيه الطلب
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```