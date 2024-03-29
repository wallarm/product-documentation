```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.2.1-1
     pullPolicy: Always
  # واجهة برمجة تطبيقات Wallarm: 
  # "api.wallarm.com" للسحابة الأوروبية
  # "us1.api.wallarm.com" للسحابة الأمريكية
  wallarm_host_api: "api.wallarm.com"
  # اسم المستخدم للمستخدم ذي دور النشر
  deploy_username: "username"
  # كلمة مرور المستخدم ذي دور النشر
  deploy_password: "password"
  # المنفذ الذي يقبل خلاله الحاوية الطلبات الواردة،
  # يجب أن تكون القيمة مطابقة لports.containerPort
  # في تعريف حاوية التطبيق الرئيسية الخاصة بك
  app_container_port: 80
  # وضع تصفية الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات ولكن دون حظرها
  # "safe_blocking" لحظر الطلبات الضارة القادمة من عناوين IP المدرجة في القائمة الرمادية
  # "block" لمعالجة جميع الطلبات وحظر الضار منها
  mode: "block"
  # كمية الذاكرة بالجيجابايت لبيانات تحليل الطلبات
  tarantool_memory_gb: 2
```