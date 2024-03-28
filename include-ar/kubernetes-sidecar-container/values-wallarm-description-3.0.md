```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: Always
  # نقطة نهاية واجهة برمجة التطبيقات لـ Wallarm: 
  # "api.wallarm.com" للسحابة الأوروبية
  # "us1.api.wallarm.com" للسحابة الأمريكية
  wallarm_host_api: "api.wallarm.com"
  # اسم المستخدم للمستخدم بدور النشر
  deploy_username: "username"
  # كلمة المرور للمستخدم بدور النشر
  deploy_password: "password"
  # المنفذ الذي يقبل الحاوية علىه الطلبات الواردة،
  # يجب أن تكون القيمة مطابقة لـ ports.containerPort
  # في تعريف حاوية التطبيق الرئيسية الخاصة بك
  app_container_port: 80
  # وضع فلترة الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات ولكن دون حظرها
  # "safe_blocking" لحظر الطلبات الخبيثة القادمة من عناوين IPs المدرجة بالقائمة الرمادية
  # "block" لمعالجة كل الطلبات وحظر الطلبات الخبيثة
  mode: "block"
  # كمية الذاكرة بالجيجابايت لبيانات تحليل الطلبات
  tarantool_memory_gb: 2
```