بشكل افتراضي، العقدة Wallarm المُdeployed لا تحلل الحركة الواردة.

اعتمادًا على النهج المختار لنشر Wallarm ([مباشر][inline-docs] أو [Out-of-Band][oob-docs])، قم بتهيئة Wallarm لإما توجيه حركة المرور أو معالجة مرآة حركة المرور.

قم بأداء التهيئة التالية في [ملف التهيئة](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) NGINX على الجهاز الذي تم تثبيت العقدة عليه:

=== "مباشر"
    1. حدد عنوان IP لـ Wallarm لتوجيه حركة المرور المشروعة إليه. يمكن أن يكون عنوان IP لنسخة تطبيق، أو موازن تحميل، أو اسم DNS، إلخ، اعتمادًا على هيكلتك.
    
        للقيام بذلك، قم بتعديل قيمة `proxy_pass`، على سبيل المثال يجب أن يرسل Wallarm الطلبات المشروعة إلى `http://10.80.0.5`:

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
    1. لكي تقوم العقدة Wallarm بتحليل حركة المرور الواردة، قم بضبط توجيه `wallarm_mode` إلى وضع `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        وضع المراقبة هو الوضع الموصى به للنشر الأول وتجربة الحل. Wallarm يوفر أيضًا أوضاع الحجب الآمن والحجب، [اقرأ المزيد][waf-mode-instr].
=== "Out-of-Band"
    1. لكي تقبل العقدة Wallarm حركة المرور المعكوسة، قم بضبط التهيئة التالية في قطاع `server` NGINX:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # قم بتغيير 222.222.222.22 إلى عنوان الخادم المعكوس
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * يُطلب توجيها `set_real_ip_from` و `real_ip_header` لعرض Wallarm Console [عناوين IP للمهاجمين][proxy-balancer-instr].
        * توجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات باستثناء النسخ المستلمة من حركة المرور المعكوسة.
    1. لكي تقوم العقدة Wallarm بتحليل حركة المرور المعكوسة، قم بضبط توجيه `wallarm_mode` إلى وضع `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        بما أن الطلبات الخبيثة [لا يمكن][oob-advantages-limitations] حظرها، الوضع الوحيد [المقبول][waf-mode-instr] من Wallarm هو المراقبة. بالنسبة للنشر المباشر، هناك أيضًا أوضاع حجب آمن وحجب ولكن حتى إذا قمت بتعيين توجيه `wallarm_mode` لقيمة مختلفة عن المراقبة، تستمر العقدة في مراقبة حركة المرور وتسجيل حركة المرور الخبيثة فقط (بخلاف التوجيه المحدد للإيقاف).