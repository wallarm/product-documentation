لكي تقوم وحدة Wallarm بمعالجة الحركة المرآة، قم بضبط التكوين التالي:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#غير 222.222.222.22 إلى عنوان خادم المرآة
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* يتطلب توجيه [`real_ip_header`](../../using-proxy-or-balancer-en.md) كي تظهر واجهة Wallarm Console عناوين IP للمهاجمين.
* يتطلب التوجيهات `wallarm_force_response_*` لتعطيل تحليل جميع الطلبات ما عدا النسخ المستلمة من الحركة المرآة.
* بما أنه [لا يمكن](overview.md#limitations-of-mirrored-traffic-filtration) حجب الطلبات الضارة، فإن وحدة Wallarm تحلل الطلبات دائمًا في وضع [المراقبة](../../configure-wallarm-mode.md) حتى إذا قام توجيه `wallarm_mode` أو Wallarm Cloud بتعيين الوضع الآمن أو وضع الحجب العادي (باستثناء الوضع المعين للإيقاف).

يدعم معالجة الحركة المرآة فقط بواسطة العقد المبنية على NGINX. يمكنك ضبط التكوين المقدم كما يلي:

* إذا كنت تقوم بتثبيت العقدة من حزم DEB/RPM - في ملف التكوين NGINX `/etc/nginx/conf.d/default.conf`.
* إذا كنت فتقوم بنشر العقدة من صورة السحابة [AWS](../../installation-ami-en.md) أو [GCP](../../installation-gcp-en.md) - في ملف التكوين NGINX `/etc/nginx/nginx.conf`.
* إذا كنت تقوم بنشر العقدة من [صورة Docker](../../installation-docker-en.md) - قم بتركيب الملف بالتكوين المقدم إلى الحاوية.
* إذا كنت تشغل العقدة كـ [متحكم Ingress](../../installation-kubernetes-en.md) - قم بتركيب ConfigMap بالتكوين المقدم إلى الجراب.