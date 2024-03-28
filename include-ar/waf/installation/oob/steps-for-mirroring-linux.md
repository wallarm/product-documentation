بشكل افتراضي، العقدة المُنشرة لـ Wallarm لا تقوم بتحليل حركة المرور الواردة.

لتهيئة Wallarm لمعالجة مرآة حركة المرور، قم بالتكوين التالي في ملف `/etc/nginx/conf.d/default.conf` على الجهاز الذي تم تثبيت العقدة عليه:

1. للسماح لعقدة Wallarm باستقبال حركة المرور المعكوسة، قم بتعيين التكوين التالي في كتلة `server` الخاصة بـ NGINX:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # قم بتغيير 222.222.222.22 إلى عنوان خادم المرآة
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * يُطلب من توجيهات `set_real_ip_from` و `real_ip_header` ليتم عرض عناوين IP للمهاجمين في واجهة Wallarm.
    * توجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات باستثناء النسخ المستلمة من حركة المرور المعكوسة.
1. لتحليل عقدة Wallarm لحركة المرور المعكوسة، قم بتعيين توجيه `wallarm_mode` إلى `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    نظرًا لأنه لا يمكن حظر الطلبات الخبيثة، الوضع الوحيد الذي تقبله Wallarm هو التتبع. بالنسبة للتنفيذ في الخط، هناك أيضًا وضعي الحظر الآمن والحظر، ولكن حتى إذا قمت بتعيين توجيه `wallarm_mode` إلى قيمة مختلفة عن التتبع، تستمر العقدة في مراقبة حركة المرور وتسجيل حركة المرور الخبيثة فقط (بصرف النظر عن التعيين للوضع إلى متوقف).