بشكل افتراضي، النود المنشورة من Wallarm لا تقوم بتحليل الحركة الواردة. لبدء تحليل الحركة، قم بتهيئة Wallarm لتوجيه الحركة عبر ملف `/etc/nginx/sites-enabled/default` على نسخة Wallarm:

1. حدد عنوان IP لـ Wallarm لتوجيه الحركة المشروعة إليه. يمكن أن يكون عنوان IP لنسخة التطبيق، موزع الحمل، أو اسم DNS، إلخ، حسب هندستك.

    للقيام بذلك، قم بتعديل قيمة `proxy_pass`، مثال: يجب أن يرسل Wallarm الطلبات المشروعة إلى `http://10.80.0.5`:

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
1. لكي يقوم النود من Wallarm بتحليل الحركة الواردة، قم بتعيين توجيه `wallarm_mode` إلى `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    وضع المراقبة هو الوضع الموصى به للإنشاء الأول واختبار الحل. توفر Wallarm وضع الحجب الآمن وأوضاع الحجب كذلك، [اقرأ المزيد][wallarm-mode].