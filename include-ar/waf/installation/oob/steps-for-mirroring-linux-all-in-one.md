بشكل افتراضي، لا يقوم عقد Wallarm المستخدم بتحليل حركة المرور الواردة.

قم بإجراء التكوين التالي في ملف [تكوين NGINX](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) على الجهاز الذي تم تثبيت العقد عليه لتهيئة Wallarm لمعالجة حركة المرور المعكوسة:

1. لكي يقبل عقد Wallarm حركة المرور المعكوسة، قم بإعداد التكوين التالي في قطعة `server` الخاصة بNGINX:

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

    * تُعد التوجيهات `set_real_ip_from` و`real_ip_header` مطلوبتين لتتمكن لوحة تحكم Wallarm من [عرض عناوين IP للمهاجمين](proxy-balancer-instr).
    * تُعد التوجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات باستثناء النسخ التي تُستلم من حركة المرور المعكوسة.
2. لكي يحلل عقد Wallarm حركة المرور المعكوسة، قم بإعداد توجيه `wallarm_mode` إلى `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    بما أنه لا يمكن [حظر](oob-advantages-limitations) الطلبات الضارة، فإن الوضع الوحيد [المقبول](waf-mode-instr) من Wallarm هو الرصد. بالنسبة للنشر في الخط، توجد أيضًا أوضاع الحظر الآمن والحظر ولكن حتى إذا قمت بتعيين توجيه `wallarm_mode` إلى قيمة مختلفة عن الرصد، يستمر العقد في مراقبة حركة المرور وتسجيل حركة المرور الضارة فقط (بخلاف الوضع الذي تم ضبطه على إيقاف).