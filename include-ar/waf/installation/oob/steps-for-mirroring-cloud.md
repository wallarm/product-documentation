بشكل افتراضي، العقدة المنشورة لـ Wallarm لا تقوم بتحليل الحركة الواردة.

لبدء تحليل الحركة، قم بتغيير ملف `/etc/nginx/sites-enabled/default` على نموذج Wallarm كالتالي:

1. لكي تقبل عقدة Wallarm الحركة المعكوسة، قم بضبط التوجيه التالي في كتلة `server` لـ NGINX:

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

    * يُطلب من التوجيهات `set_real_ip_from` و `real_ip_header` لكي تعرض واجهة Wallarm Console عناوين IP للمهاجمين.
    * التوجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل كافة الطلبات باستثناء النسخ المستلمة من الحركة المعكوسة.
1. لتحليل عقدة Wallarm للحركة المعكوسة، قم بضبط التوجيه `wallarm_mode` إلى `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    بما أنه لا يمكن منع الطلبات الخبيثة، فإن الوضع الوحيد [المقبول][wallarm-mode] لدى Wallarm هو الرصد. للتنفيذ الخطي، هناك أيضًا أوضاع الحظر الآمنة والحظر ولكن حتى إذا قمت بضبط التوجيه `wallarm_mode` إلى قيمة غير الرصد، تستمر العقدة في رصد الحركة وتسجيل الحركة الخبيثة فقط (بغض النظر عن الوضع المضبوط على إيقاف).