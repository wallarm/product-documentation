بشكل افتراضي، العقدة Wallarm المُنشرة لا تحلل الحركة الواردة.

قم بإجراء الإعدادات التالية في ملف `/etc/nginx/conf.d/default.conf` على الجهاز الذي تم تثبيت العقدة عليه لضبط Wallarm لمعالجة مرآة الحركة:

1. لكي تقبل العقدة Wallarm الحركة المعكوسة، قم بضبط الإعدادات التالية في كتلة `server` لـ NGINX:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # قُم بتغيير 222.222.222.22 إلى عنوان خادم المراة
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * تُعتبر توجيهات `set_real_ip_from` و `real_ip_header` مطلوبة لكي تعرض واجهة Wallarm [عناوين IP للمهاجمين][proxy-balancer-instr].
    * توجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات باستثناء النسخ المستلمة من الحركة المعكوسة.
1. لكي تحلل العقدة Wallarm الحركة المعكوسة، قم بإعداد توجيه `wallarm_mode` إلى `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    بما أنه لا يمكن [منع][oob-advantages-limitations] الطلبات الضارة، الوضع الوحيد الذي تقبله Wallarm هو مراقبة. بالنسبة للتثبيت في الخط، هناك أيضًا أوضاع الحظر الآمن والحظر ولكن حتى إذا قمت بتعيين توجيه `wallarm_mode` إلى قيمة مختلفة عن مراقبة، تواصل العقدة مراقبة الحركة وتسجل فقط الحركة الضارة (باستثناء الوضع المضبوط على إيقاف).