```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: دايمًا
  # نقطة نهاية واجهة برمجة التطبيقات لـ Wallarm: 
  # "api.wallarm.com" للسحابة الأوروبية
  # "us1.api.wallarm.com" للسحابة الأمريكية
  wallarm_host_api: "api.wallarm.com"
  # اسم المستخدم للمستخدم ذو دور النشر
  deploy_username: "اسم المستخدم"
  # كلمة مرور المستخدم ذو دور النشر
  deploy_password: "كلمة السر"
  # المنفذ الذي يقبل الحاوية طلبات الواردة عليه،
  # القيمة يجب أن تكون مطابقة لـ ports.containerPort
  # في تعريف حاوية تطبيقك الأساسية
  app_container_port: 80
  # وضع تصفية الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات لكن دون حظرها
  # "safe_blocking" لحظر الطلبات الضارة الصادرة من عناوين IP المدرجة بالقائمة الرمادية
  # "block" لمعالجة كل الطلبات وحظر الضار منها
  mode: "block"
  # كمية الذاكرة بالجيجابايت لبيانات تحليل الطلبات
  tarantool_memory_gb: 2
```