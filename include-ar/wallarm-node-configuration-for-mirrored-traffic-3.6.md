لكي يتمكن عقدة Wallarm من معالجة حركة المرور المعكوسة، قم بتعيين التكوين التالي:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#غير 222.222.222.22 إلى عنوان خادم التوجيه
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* يُطلب توجيه [`real_ip_header`](../../using-proxy-or-balancer-en.md) لكي تعرض وحدة التحكم Wallarm عناوين IP للمهاجمين.
* تُطلب التوجيهات `wallarm_force_response_*` لتعطيل تحليل جميع الطلبات باستثناء نسخ المستلمة من حركة المرور المعكوسة.
* بما أن الطلبات الخبيثة لا يمكن [أن تُحظر](overview.md#limitations-of-mirrored-traffic-filtration)، فإن عقدة Wallarm تقوم دائماً بتحليل الطلبات في [وضع](../../configure-wallarm-mode.md) المراقبة حتى لو تم تعيين توجيه `wallarm_mode` أو Wallarm Cloud على وضع الحظر الآمن أو العادي (باستثناء الوضع المُعطل).

يدعم معالجة حركة المرور المعكوسة عقد NGINX فقط. يمكنك تعيين التكوين المقدم كما يلي:

* عند تثبيت العقدة من حزم DEB/RPM - في ملف تكوين NGINX `/etc/nginx/conf.d/default.conf`.
* عند نشر العقدة من صورة سحابية في [AWS](../../installation-ami-en.md) أو [GCP](../../installation-gcp-en.md) - في ملف تكوين NGINX `/etc/nginx/nginx.conf`.
* عند نشر العقدة من [صورة Docker](../../installation-docker-en.md) - قم بتوصيل الملف بالتكوين المقدم إلى الحاوية.
* عند تشغيل العقدة كـ[متحكم Ingress](../../installation-kubernetes-en.md) - قم بتوصيل خريطة التكوين بالتكوين المقدم إلى pod.