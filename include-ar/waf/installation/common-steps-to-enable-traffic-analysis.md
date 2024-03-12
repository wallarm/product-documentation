بشكل افتراضي، لا يقوم عقدة Wallarm المُنشرة بتحليل حركة المرور الواردة.

بناءً على نهج نشر Wallarm المختار ([داخل الخط][inline-docs] أو [خارج نطاق البث][oob-docs])، قم بضبط Wallarm لإما بروكسي حركة المرور أو معالجة مرآة حركة المرور.

قم بإجراء التكوين التالي في ملف `/etc/nginx/conf.d/default.conf` على الآلة التي تم تثبيت العقدة عليها:

=== "داخل الخط"
    1. قم بتعيين عنوان IP لـ Wallarm لتوجيه حركة المرور المشروعة إليه. يمكن أن يكون عنوان IP لنسخة التطبيق، موزع الحمل، أو اسم DNS، إلخ، حسب بنيتك.
    
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
    1. لكي يحلل عقدة Wallarm حركة المرور الواردة، قم بتعيين توجيهة `wallarm_mode` إلى `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        وضع المراقبة هو الوضع الموصى به لأول نشر واختبار الحل. توفر Wallarm أوضاع حجب آمنة وحجب أيضاً، [اقرأ المزيد][waf-mode-instr].
=== "خارج نطاق البث"
    1. لكي تقبل عقدة Wallarm حركة المرور المعكوسة، قم بتعيين التكوين التالي في كتلة `server` NGINX:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # غيّر 222.222.222.22 إلى عنوان الخادم المعكس
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * يتطلب توجيه `set_real_ip_from` و `real_ip_header` ليُظهر لوحة تحكم Wallarm [عناوين IP للمهاجمين][proxy-balancer-instr].
        * توجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل كل الطلبات باستثناء النسخ التي تم تلقيها من حركة المرور المعكوسة.
    1. لكي تحلل عقدة Wallarm حركة المرور المعكوسة، قم بتعيين توجيهة `wallarm_mode` إلى `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        بما أنه لا يُمكن حظر الطلبات الضارة [لا يمكن][oob-advantages-limitations]، فإن الوضع الوحيد [الوضع][waf-mode-instr] الذي تقبله Wallarm هو المراقبة. بالنسبة للنشر داخل الخط، هناك أيضاً أوضاع حجب آمن وحجب لكن حتى لو قمت بتعيين توجيهة `wallarm_mode` إلى قيمة مختلفة عن المراقبة، تواصل العقدة مراقبة حركة المرور وتسجل فقط حركة المرور الضارة (بجانب الوضع المعين على إيقاف).