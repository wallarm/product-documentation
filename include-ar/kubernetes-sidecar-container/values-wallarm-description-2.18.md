```
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: Always
  # نقطة نهاية واجهة برمجة تطبيقات Wallarm: 
  # "api.wallarm.com" لسحابة الاتحاد الأوروبي
  # "us1.api.wallarm.com" لسحابة الولايات المتحدة
  wallarm_host_api: "api.wallarm.com"
  # اسم المستخدم للمستخدم بدور النشر
  deploy_username: "username"
  # كلمة المرور للمستخدم بدور النشر
  deploy_password: "password"
  # البورت الذى يستقبل الكونتينر عليه الطلبات الواردة،
  # يجب أن تكون القيمة مطابقة لـ ports.containerPort
  # فى تعريف كونتينر التطبيق الرئيسي الخاص بك
  app_container_port: 80
  # وضع تصفية الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات ولكن بدون حظرها
  # "block" لمعالجة جميع الطلبات وحظر المخربة منها
  mode: "block"
  # كمية الذاكرة بالجيجابايت لبيانات تحليل الطلبات
  tarantool_memory_gb: 2
  # تعيين على "true" لتفعيل وظيفة حظر الآي بي
  enable_ip_blocking: "false"
```