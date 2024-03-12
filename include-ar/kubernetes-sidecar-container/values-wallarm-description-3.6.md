```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: Always
  # نقطة نهاية واجهة برمجة تطبيقات Wallarm: 
  # "api.wallarm.com" للسحابة الأوروبية
  # "us1.api.wallarm.com" لسحابة الولايات المتحدة
  wallarm_host_api: "api.wallarm.com"
  # اسم المستخدم للمستخدم بدور النشر
  deploy_username: "username"
  # كلمة المرور للمستخدم بدور النشر
  deploy_password: "password"
  # البورت الذى يقبل الحاوية الطلبات الواردة عليه،
  # يجب أن تكون القيمة مطابقة ل ports.containerPort
  # في تعريف حاوية التطبيق الرئيسية الخاصة بك
  app_container_port: 80
  # وضع تصفية الطلب
  # "off" لتعطيل معالجة الطلب
  # "monitoring" لمعالجة الطلبات ولكن دون حظرها
  # "safe_blocking" لحظر الطلبات الضارة الصادرة عن عناوين IP مدرجة في القائمة الرمادية
  # "block" لمعالجة جميع الطلبات وحظر الضارة منها
  mode: "block"
  # كمية الذاكرة بالجيجابايت لبيانات تحليل الطلب
  tarantool_memory_gb: 2
```