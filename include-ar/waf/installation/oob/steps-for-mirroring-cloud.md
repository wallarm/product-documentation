بشكل افتراضي، النود المُنشر من Wallarm مش بيحلل حركة البيانات الواردة.

علشان تبدأ تحليل حركة البيانات، غير ملف `/etc/nginx/sites-enabled/default` على مثيل Wallarm بالطريقة الآتية:

1. علشان نود Wallarm يقبل حركة البيانات المعكوسة، حط الإعدادات دي في `server` الكتلة بتاعت NGINX:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # غير 222.222.222.22 لعنوان السيرفر المعكوس
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * أوامر `set_real_ip_from` و `real_ip_header` مطلوبة علشان Wallarm Console [تعرض عناوين الآي بي بتاعة المهاجمين][real-ip-docs].
    * أوامر `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات إلا النسخ المتلقاة من حركة البيانات المعكوسة.
1. علشان نود Wallarm يحلل حركة البيانات المعكوسة، حط أمر `wallarm_mode` على `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    بما إن الطلبات الخبيثة [مينفعش][oob-advantages-limitations] تتقفل، الوضع الوحيد [المقبول][wallarm-mode] من Wallarm هو المراقبة. للتنصيب الداخلي، فيه كمان أوضاع الحجب الآمن والحجب لكن حتى لو انت حطيت أمر الـ`wallarm_mode` على قيمة مختلفة عن المراقبة، النود بيفضل يراقب حركة البيانات ويسجل بس الحركة الخبيثة (غير لما الوضع محطوط على إيقاف).