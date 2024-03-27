بشكل افتراضي، العقدة المُوَزَّعة من Wallarm لا تقوم بتحليل الحركة الواردة.

اعتمادًا على طريقة نشر Wallarm المختارة (سواء [عبر الخط][inline-docs] أو [خارج الخط][oob-docs])، قم بضبط Wallarm لإما توجيه الحركة إلكترونيًا أو معالجة مرآة الحركة.

قم بأداء الضبط التالي في الملف `/etc/nginx/sites-enabled/default` على نسخة Wallarm:

=== "عبر الخط"
    1. ضع عنوان IP حتى يقوم Wallarm بتوجيه الحركة الشرعية إليه. يُمكن أن يكون عنوان IP لنسخة من التطبيق، أو موزّع الحمل، أو اسم DNS، إلخ، اعتمادًا على بُنيتك.

        للقيام بذلك، عدّل قيمة `proxy_pass`، مثلًا يجب أن يرسل Wallarm الطلبات الشرعية إلى `http://10.80.0.5`:

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
    1. لتحليل العقدة Wallarm للحركة الواردة، ضع توجيه `wallarm_mode` إلى `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        وضع المراقبة هو الوضع الموصى به للنشر الأول واختبار الحل. Wallarm يوفر أيضًا أوضاع الحجب الآمن والحجب، [اقرأ المزيد][wallarm-mode].
=== "خارج الخط"
    1. لتقبل عقدة Wallarm الحركة المعكوسة، ضع التوجيه التالي في كتلة `server` الخاصة بـNGINX:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # غيِّر 222.222.222.22 إلى عنوان خادم المرايا
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * توجيهات `set_real_ip_from` و `real_ip_header` مطلوبة ليعرض لوحة معلومات Wallarm [عناوين IP الخاصة بالمهاجمين][real-ip-docs].
        * توجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات باستثناء النسخ المستلمة من الحركة المعكوسة.
    1. لتحليل عقدة Wallarm الحركة المعكوسة، ضع توجيه `wallarm_mode` إلى `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        بما أن الطلبات الضارة [لا يمكن][oob-advantages-limitations] حجبها، الوضع الوحيد [المقبول][wallarm-mode] من Wallarm هو المراقبة. بالنسبة للنشر عبر الخط، هناك أيضًا أوضاع الحجب الآمن والحجب ولكن حتى إذا تم ضبط توجيه `wallarm_mode` إلى قيمة تختلف عن المراقبة، تستمر العقدة في مراقبة الحركة وتسجيل الحركة الضارة فقط (بخلاف الوضع المضبوط على إيقاف).