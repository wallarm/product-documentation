```
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: Always
  # نقطة نهاية API Wallarm: 
  # "api.wallarm.com" للسحابة الأوروبية
  # "us1.api.wallarm.com" للسحابة الأمريكية
  wallarm_host_api: "api.wallarm.com"
  # اسم المستخدم للمستخدم بدور النشر
  deploy_username: "username"
  # كلمة المرور للمستخدم بدور النشر
  deploy_password: "password"
  # المنفذ الذي يقبل الحاوية طلبات واردة عليه،
  # يجب أن تكون القيمة مطابقة لports.containerPort
  # في تعريف حاوية التطبيق الرئيسية الخاصة بك
  app_container_port: 80
  # وضع تصفية الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات لكن دون الحظر
  # "block" لمعالجة كل الطلبات وحظر المضرة منها
  mode: "block"
  # كمية الذاكرة بجيجابايت لبيانات تحليلات الطلبات
  tarantool_memory_gb: 2
  # تعيين إلى "true" لتفعيل وظيفة حظر الـIP
  enable_ip_blocking: "false"
```