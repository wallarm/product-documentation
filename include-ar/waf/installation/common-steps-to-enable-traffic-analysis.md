بشكل افتراضي، لا يقوم العقد Wallarm المُنشر بتحليل حركة المرور الواردة.

اعتمادًا على الطريقة المختارة لنشر Wallarm ([داخل الخط][inline-docs] أو [خارج الخط][oob-docs])، قم بتهيئة Wallarm لإما توجيه حركة المرور أو معالجة نسخة حركة المرور المعكوسة.

قم بأداء التهيئة التالية في الملف `/etc/nginx/conf.d/default.conf` على الجهاز الذي تم تثبيت العقدة عليه:

=== "داخل الخط"
    1. قم بتعيين عنوان IP لـ Wallarm لتوجيه حركة المرور الشرعية إليه. يمكن أن يكون عنوان IP لنسخة تطبيق، موازن الحمل، أو اسم DNS، إلخ، اعتمادًا على بنية تطبيقك.
    
        للقيام بذلك، عدل قيمة `proxy_pass`، على سبيل المثال، يجب أن يرسل Wallarm الطلبات الشرعية إلى `http://10.80.0.5`:

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
    1. لتحليل Wallarm لحركة المرور الواردة، قم بتعيين الأمر `wallarm_mode` إلى `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        وضع المراقبة هو الوضع الموصى به للنشر الأول واختبار الحل. Wallarm يوفر أيضًا أوضاع الحجب الآمن والحجب، [اقرأ المزيد][waf-mode-instr].
=== "خارج الخط"
    1. لقبول Wallarm الحركة المعكوسة، قم بتعيين التهيئة التالية في كتلة `server` في NGINX:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # قم بتغيير 222.222.222.22 إلى عنوان خادم المعكس
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * تُعد أوامر `set_real_ip_from` و `real_ip_header` مطلوبة لعرض Wallarm Console [عناوين IP للمهاجمين][proxy-balancer-instr].
        * تُعد أوامر `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات باستثناء النسخ المستلمة من الحركة المعكوسة.
    1. لتحليل Wallarm للحركة المعكوسة، قم بتعيين أمر `wallarm_mode` إلى `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        بما أن الطلبات الخبيثة [لا يمكن][oob-advantages-limitations] حظرها، الوضع الوحيد [المقبول][waf-mode-instr] من Wallarm هو المراقبة. بالنسبة للنشر داخل الخط، هناك أيضًا أوضاع الحجب الآمن والحجب لكن حتى إذا قمت بتعيين أمر `wallarm_mode` إلى قيمة مختلفة عن المراقبة، تستمر العقدة في مراقبة حركة المرور وتسجيل فقط الحركة المرورية الضارة (بخلاف الوضع المعيّن على إيقاف).