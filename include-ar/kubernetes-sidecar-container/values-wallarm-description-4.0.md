```
wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: Always
  # نقطة نهائية لـ API الخاصة بـ Wallarm:
  # "api.wallarm.com" لسحابة الاتحاد الأوروبي
  # "us1.api.wallarm.com" لسحابة الولايات المتحدة
  wallarm_host_api: "api.wallarm.com"
  # رمز التوكن لنود Wallarm
  wallarm_api_token: "token"
  # المنفذ الذي يقبل الحاوية طلبات الواردة عليه،
  # يجب أن تكون القيمة مطابقة لـ ports.containerPort
  # في تعريف حاوية التطبيق الرئيسية الخاصة بك
  app_container_port: 80
  # وضع تصفية الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات دون حجبها
  # "safe_blocking" لحجب الطلبات الضارة الصادرة من IPs مدرجة في القائمة الرمادية
  # "block" لمعالجة جميع الطلبات وحجب الضار منها
  mode: "block"
  # كمية الذاكرة بجيجابايت لبيانات تحليل الطلبات
  tarantool_memory_gb: 2
```