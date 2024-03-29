بشكل افتراضي، لا يقوم عقد Wallarm بتحليل حركة المرور الواردة.

اعتمادًا على نهج تطبيق Wallarm المختار ([داخل الخط][inline-docs] أو [خارج الخط][oob-docs])، قم بتكوين Wallarm إما لتوجيه حركة المرور أو معالجة مرآة حركة المرور.

قم بإجراء التكوين التالي في [ملف التكوين](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) الخاص بـ NGINX على الجهاز الذي تم تثبيت عقدة عليه:

=== "داخل الخط"
    1. حدد عنوان IP ليوجه Wallarm حركة المرور المشروعة إليه. يمكن أن يكون عنوان IP لنسخة تطبيق، موازن حمل، أو اسم DNS، وغير ذلك، وفقًا لهندسة الشبكة لديك.

        للقيام بذلك، عدّل قيمة `proxy_pass`، مثلًا ينبغي أن يرسل Wallarm الطلبات المشروعة إلى `http://10.80.0.5`:

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
    1. ليقوم عقد Wallarm بتحليل حركة المرور الواردة، حدد توجيه `wallarm_mode` على `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        يُعتبر وضع المراقبة الخيار الموصى به للتطبيق الأول واختبار الحل. Wallarm يوفر أيضًا وضعي الحظر الآمن والحظر، [اقرأ المزيد][waf-mode-instr].
=== "خارج الخط"
    1. ليقبل عقد Wallarm حركة المرور المعكوسة، حدد التكوين التالي في قسم `server` NGINX:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # غير 222.222.222.22 إلى عنوان الخادم المعكوس
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * يُطلب توجيها `set_real_ip_from` و `real_ip_header` لعرض عناوين IP للمهاجمين في [واجهة Wallarm][proxy-balancer-instr].
        * يُطلب توجيهات `wallarm_force_response_*` لتعطيل تحليل كافة الطلبات عدا النسخ المتلقاة من حركة المرور المعكوسة.
    1. ليحلل عقد Wallarm حركة المرور المعكوسة، حدد توجيه `wallarm_mode` على `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        بما أنه لا يمكن حظر الطلبات الضارة [لا يمكن][oob-advantages-limitations]، الوضع [الوحيد][waf-mode-instr] الذي يقبله Wallarm هو المراقبة. بالنسبة للتطبيق داخل الخط، هناك أيضًا وضعي الحظر الآمن والحظر ولكن حتى إذا كان توجيه `wallarm_mode` محددًا على قيمة تختلف عن المراقبة، يستمر العقد في مراقبة حركة المرور ويسجل فقط حركة المرور الضارة (بصرف النظر عن الوضع المحدد على إيقاف).