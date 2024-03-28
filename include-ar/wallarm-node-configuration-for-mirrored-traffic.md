ليقوم نقطة Wallarm بمعالجة المرور المعكوس، يُرجى تعيين الإعدادات التالية:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#قم بتغيير 222.222.222.22 إلى عنوان خادم المعاكسة
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* من الضروري أن يوجد توجيه [`real_ip_header`](../../using-proxy-or-balancer-en.md) لكي تعرض واجهة Wallarm أرقام IP الخاصة بالمهاجمين.
* التوجيهات `wallarm_force_response_*` مطلوبة لتعطيل تحليل جميع الطلبات باستثناء النسخ المستلمة من المرور المعكوس.
* نظرًا لأنه لا يمكن حظر الطلبات الخبيثة، فإن نقطة Wallarm تقوم بتحليل الطلبات دائمًا في وضع المراقبة [mode](../../configure-wallarm-mode.md) حتى لو تم ضبط توجيه `wallarm_mode` أو قامت Wallarm Cloud بضبط وضع الحظر الآمن أو العادي (باستثناء الوضع المضبوط على إيقاف).

دعم معالجة المرور المعكوس متوفر فقط بواسطة نقاط NGINX. يمكنك تعيين الإعدادات المقدمة كما يلي:

* إذا كنت تقوم بتثبيت النقطة من حزم DEB/RPM - في ملف تكوين NGINX `/etc/nginx/conf.d/default.conf`.
* إذا كنت تقوم بنشر النقطة من صورة السحاب الخاصة ب[AWS](../../installation-ami-en.md) أو [GCP](../../installation-gcp-en.md) - في ملف تكوين NGINX `/etc/nginx/nginx.conf`.
* إذا كنت تقوم بنشر النقطة من [صورة Docker](../../installation-docker-en.md) - قُم بتركيب الملف الحاوي على الإعدادات المقدمة إلى الحاوية.
* إذا كنت تقوم بتشغيل النقطة كـ[Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md) أو [Ingress controller](../../installation-kubernetes-en.md) - قُم بتركيب ConfigMap المحتوي على الإعدادات المقدمة إلى pod.