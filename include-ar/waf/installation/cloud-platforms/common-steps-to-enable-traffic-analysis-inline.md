بشكل افتراضي، لا يقوم العقدة المُنشأة لـ Wallarm بتحليل حركة المرور الواردة. لبدء تحليل حركة المرور، قم بتكوين Wallarm لتوجيه حركة المرور عبر ملف `/etc/nginx/sites-enabled/default` على نسخة Wallarm:

1. حدد عنوان IP لـ Wallarm لتوجيه حركة المرور المشروعة إليه. يمكن أن يكون عنوان IP لنسخة تطبيق، موزع الحمل أو اسم DNS، إلخ، بحسب هندستك.

    للقيام بذلك، قم بتعديل قيمة `proxy_pass`، على سبيل المثال يجب على Wallarm إرسال الطلبات المشروعة إلى `http://10.80.0.5`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;

        ...

        location / {
            proxy_pass http://10.80.0.5; 
            ...
        }
    }
    ```
1. لكي تقوم العقدة Wallarm بتحليل حركة المرور الواردة، حدد توجيه `wallarm_mode` إلى `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    وضع المراقبة هو الوضع الموصى به للتنشير الأول واختبار الحل. توفر Wallarm أوضاع حجب آمنة كذلك، [اقرأ المزيد][wallarm-mode].