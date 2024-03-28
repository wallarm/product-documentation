بشكل افتراضي، العقدة المنصوبة من Wallarm لا تحلل الحركة المرورية الواردة.

اعتمادًا على نهج نشر Wallarm المختار ([داخل الخط][inline-docs] أو [خارج النطاق][oob-docs])، قم بتهيئة Wallarm لإما توجيه الحركة المرورية أو معالجة نسخة مرآة من الحركة المرورية.

قم بإجراء التهيئة التالية في ملف `/etc/nginx/sites-enabled/default` على نسخة Wallarm:

=== "داخل الخط"
    1. حدد عنوان IP لـ Wallarm لتوجيه الحركة المرورية الصالحة إليه. يمكن أن يكون عنوان IP لنسخة تطبيق، أو موزع حمولة، أو اسم DNS، الخ، حسب تصميمك.
    
        للقيام بذلك، عدل قيمة `proxy_pass`، مثلًا يجب على Wallarm إرسال الطلبات الصالحة إلى `http://10.80.0.5`:

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
    1. لكي تحلل عقدة Wallarm الحركة المرورية الواردة، اضبط التوجيه `wallarm_mode` إلى `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        وضع المراقبة هو الوضع الموصى به للنشر الأولي واختبار الحل. Wallarm يوفر أيضا وضعيات الحظر الآمن والحظر، [اقرأ المزيد][wallarm-mode].
=== "خارج النطاق"
    1. لكي تقبل عقدة Wallarm الحركة المرورية المعكوسة، اضبط التكوين التالي في كتلة `server` لـ NGINX:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # قم بتغيير 222.222.222.22 إلى عنوان الخادم العاكس
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * التوجيهات `set_real_ip_from` و `real_ip_header` ضرورية لجعل وحدة تحكم Wallarm [تعرض عناوين IP للمهاجمين][real-ip-docs].
        * التوجيهات `wallarm_force_response_*` ضرورية لتعطيل تحليل جميع الطلبات باستثناء النسخ المتلقاة من الحركة المرورية المعكوسة.
    1. لكي تحلل عقدة Wallarm الحركة المرورية المعكوسة، اضبط التوجيه `wallarm_mode` إلى `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        بما أن الطلبات الضارة [لا يمكن][oob-advantages-limitations] حظرها، فإن الوضع الوحيد [الذي][wallarm-mode] يقبله Wallarm هو المراقبة. بالنسبة للنشر داخل الخط، هناك وضعيات حظر آمنة وحظر أيضًا ولكن حتى إذا قمت بضبط التوجيه `wallarm_mode` إلى قيمة مختلفة عن المراقبة، تواصل العقدة مراقبة الحركة المرورية وتسجل فقط الحركة المرورية الضارة (بجانب الوضع المضبوط على إيقاف).