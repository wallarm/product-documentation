```
Wallarm:
  image:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: Always
  # نقطة نهاية واجهة برمجة تطبيقات Wallarm: 
  # "api.wallarm.com" للسحابة الأوروبية
  # "us1.api.wallarm.com" للسحابة الأمريكية
  wallarm_host_api: "api.wallarm.com"
  # اسم مستخدم للشخص بدور "النشر"
  deploy_username: "username"
  # كلمة مرور الشخص بدور "النشر"
  deploy_password: "password"
  # المنفذ الذي يقبل الحاوية الطلبات الواردة عليه،
  # يجب أن تكون القيمة مطابقة لـports.containerPort
  # في تعريف حاوية التطبيق الرئيسية لديك
  app_container_port: 80
  # وضعية تصفية الطلبات:
  # "off" لتعطيل معالجة الطلبات
  # "monitoring" لمعالجة الطلبات دون حظرها
  # "safe_blocking" لحظر الطلبات الضارة القادمة من عناوين IP المدرجة بالقائمة الرمادية
  # "block" لمعالجة جميع الطلبات وحظر الضارة منها
  mode: "block"
  # كمية الذاكرة بالغيغابايت لبيانات تحليلات الطلبات
  tarantool_memory_gb: 2
```