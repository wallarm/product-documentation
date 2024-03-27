```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.2.1-1
     pullPolicy: Always
  # نقطة نهاية API الخاصة بـ Wallarm:
  # "api.wallarm.com" للسحابة الأوروبية
  # "us1.api.wallarm.com" للسحابة الأمريكية
  wallarm_host_api: "api.wallarm.com"
  # اسم المستخدم للشخص ذو دور النشر
  deploy_username: "username"
  # كلمة سر الشخص ذو دور النشر
  deploy_password: "password"
  # المنفذ الذى يستقبل الحاوية عليه الطلبات الواردة،
  # يجب أن تكون القيمة متطابقة مع ports.containerPort
  # في تعريف حاوية التطبيق الرئيسي الخاص بك
  app_container_port: 80
  # وضع تصفية الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات ولكن بدون حظرها
  # "safe_blocking" لحظر الطلبات الضارة الصادرة من IPs المُدرجة في القائمة الرمادية
  # "block" لمعالجة جميع الطلبات وحظر الضار منها
  mode: "block"
  # كمية الذاكرة بالجيجابايت لبيانات تحليل الطلبات
  tarantool_memory_gb: 2
```