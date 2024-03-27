لكي يتمكن عقدة Wallarm من تحليل حركة المرور المعكوسة، قم بضبط الإعداد التالي:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#غيّر 222.222.222.22 إلى عنوان خادم المرآة
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* تعليمة [`real_ip_header`](../../using-proxy-or-balancer-en.md) مطلوبة لتمكن لوحة تحكم Wallarm من عرض عناوين IP الخاصة بالمهاجمين.
* توجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات باستثناء النسخ التي تم استقبالها من حركة المرور المعكوسة.
* نظرًا لأنه [لا يمكن](overview.md#limitations-of-mirrored-traffic-filtration) حظر الطلبات الضارة، فإن عقدة Wallarm دائمًا تحلل الطلبات في [وضع](../../configure-wallarm-mode.md) المراقبة حتى لو تم ضبط توجيه `wallarm_mode` أو Wallarm Cloud على الوضع الآمن أو وضع الحظر المعتاد (باستثناء الوضع المضبوط على إيقاف).

يدعم تحليل حركة المرور المعكوسة فقط بواسطة العقد المبنية على NGINX. يمكنك ضبط الإعداد المقدم كما يلي:

* إذا كنت تثبت العقدة من حزم DEB/RPM - في ملف إعدادات NGINX `/etc/nginx/conf.d/default.conf`.
* إذا كنت تنشر العقدة من صورة سحابة [AWS](../../installation-ami-en.md) أو [GCP](../../installation-gcp-en.md) - في ملف إعدادات NGINX `/etc/nginx/nginx.conf`.
* إذا كنت تنشر العقدة من [صورة Docker](../../installation-docker-en.md) - قم بتركيب الملف بالإعداد المقدم إلى الحاوية.
* إذا كانت العقدة تعمل كـ [Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md) أو [متحكم دخول](../../installation-kubernetes-en.md) - قم بتركيب ConfigMap بالإعداد المقدم إلى pod.