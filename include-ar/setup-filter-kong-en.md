قواعد الترشيح و التوكيل مُعدة في ملف `/etc/kong/nginx-wallarm.template`.

لعرض معلومات مفصلة عن العمل مع ملفات تكوين NGINX، تابع إلى [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).

تعريفات Wallarm تحدد منطق عمل عقدة ترشيح Wallarm. لعرض قائمة تعريفات Wallarm المتاحة، تابع إلى صفحة [خيارات تكوين Wallarm](../admin-en/configure-parameters-en.md).

**مثال على ملف التكوين**

لنفترض أنك بحاجة إلى تكوين الخادم ليعمل في الشروط التالية:
* يتم معالجة حركة المرور HTTP فقط. لا يتم معالجة طلبات HTTPS.
* تستقبل النطاقات التالية الطلبات: `example.com` و `www.example.com`.
* يجب تمرير جميع الطلبات إلى الخادم `10.80.0.5`.
* يُعتبر كل الطلبات الواردة أقل من 1MB في الحجم (الإعداد الافتراضي).
* لا يستغرق معالجة الطلب أكثر من 60 ثانية (الإعداد الافتراضي).
* يجب أن يعمل Wallarm في وضع المراقبة.
* يصل العملاء إلى عقدة الترشيح مباشرة، بدون موازنة تحميل HTTP وسيطة.

لتلبية الشروط المذكورة، يجب أن يكون محتوى ملف التكوين كالتالي:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # النطاقات التي يتم معالجة حركة المرور بها
      server_name example.com; 
      server_name www.example.com;

      # تشغيل وضع مراقبة معالجة حركة المرور
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # تعيين العنوان لإعادة توجيه الطلب
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```