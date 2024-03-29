```
wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: Always
  # نقطة نهاية واجهة برمجة تطبيقات Wallarm: 
  # "api.wallarm.com" للسحابة الأوروبية
  # "us1.api.wallarm.com" للسحابة الأمريكية
  wallarm_host_api: "api.wallarm.com"
  # رمز نود Wallarm
  wallarm_api_token: "token"
  # المنفذ الذي يقبل الحاوية طلبات الواردة عليه،
  # يجب أن تكون القيمة مطابقة لports.containerPort
  # في تعريف حاوية التطبيق الرئيسي الخاص بك
  app_container_port: 80
  # وضع تصفية الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات دون حظرها
  # "safe_blocking" لحظر الطلبات الضارة الصادرة من عناوين IP مدرجة في القائمة الرمادية
  # "block" لمعالجة جميع الطلبات وحظر الضارة منها
  mode: "block"
  # كمية الذاكرة بالجيجابايت لبيانات تحليلات الطلبات
  tarantool_memory_gb: 2
```