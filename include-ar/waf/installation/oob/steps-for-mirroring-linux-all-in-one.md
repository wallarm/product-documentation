بشكل افتراضي، النود المنشورة لـ Wallarm لا تُحلل حركة المرور الواردة.

قم بإجراء التكوين التالي في ملف [تكوين NGINX](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) على الجهاز الذي تم تثبيت النود عليه لضبط Wallarm لمعالجة مرآة حركة المرور:

1. لكي يقبل نود Wallarm حركة المرور المعكوسة، قم بتعيين التكوين التالي في قطعة `server` لNGINX:

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

    * يُطلب من التوجيهات `set_real_ip_from` و `real_ip_header` لعرض عناوين IP للمهاجمين في [Wallarm Console][proxy-balancer-instr].
    * يُطلب من التوجيهات `wallarm_force_response_*` لتعطيل تحليل كل الطلبات ما عدا النسخ التي تم استقبالها من حركة المرور المعكوسة.
1. لكي يحلل نود Wallarm حركة المرور المعكوسة، قم بتعيين توجيه `wallarm_mode` إلى `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    بما أنه لا يمكن [منع][oob-advantages-limitations] الطلبات الضارة، الوضع الوحيد الذي [يقبله][waf-mode-instr] Wallarm هو المراقبة. للتنصيب الفوري، هناك أيضًا أوضاع الحجب الآمن والحجب ولكن حتى لو قمت بضبط توجيه `wallarm_mode` إلى قيمة مختلفة عن المراقبة، يستمر النود في مراقبة حركة المرور وتسجيل فقط حركة المرور الضارة (باستثناء الوضع المضبوط على إيقاف).