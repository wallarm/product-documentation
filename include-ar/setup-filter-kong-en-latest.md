يتم تكوين قواعد التصفية والوكالة في ملف `/etc/kong/nginx-wallarm.template`.

لرؤية معلومات تفصيلية حول العمل مع ملفات تكوين NGINX، تابع إلى [التوثيق الرسمي لـNGINX](https://nginx.org/en/docs/beginners_guide.html).

تحدد توجيهات Wallarm منطق عمل عقدة تصفية Wallarm. لرؤية قائمة خيارات تكوين Wallarm المتاحة، تابع إلى صفحة [خيارات تكوين Wallarm](../admin-en/configure-parameters-en.md).

**مثال على ملف التكوين**

لنفترض أنك بحاجة إلى تكوين الخادم للعمل في الظروف التالية:
* يتم معالجة حركة المرور HTTP فقط. لا يتم معالجة طلبات HTTPS.
* النطاقات التالية تستقبل الطلبات: `example.com` و`www.example.com`.
* يجب تمرير جميع الطلبات إلى الخادم `10.80.0.5`.
* يعتبر جميع الطلبات الواردة أقل من 1MB في الحجم (الإعداد الافتراضي).
* معالجة الطلب لا تأخذ أكثر من 60 ثانية (الإعداد الافتراضي).
* يجب أن يعمل Wallarm في وضع المراقبة.
* العملاء يصلون إلى عقدة التصفية مباشرة، بدون موازن تحميل HTTP وسيط.

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
        # تعيين العنوان لتوجيه الطلب
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```