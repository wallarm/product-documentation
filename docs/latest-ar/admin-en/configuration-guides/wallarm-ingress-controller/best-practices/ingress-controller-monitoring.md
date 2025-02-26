# مراقبة وحدة التحكم في الدخول المبنية على NGINX

--8<-- "../include/ingress-controller-best-practices-intro.md"

تمت تغطية الجوانب العامة لمراقبة وحدة التحكم في الدخول NGINX بشكل جيد على الإنترنت. توفر Wallarm مجموعة إضافية من المقاييس التي يجب مراقبتها في بيئة حرجة. خدمة المقاييس `/wallarm-metrics` معطلة بشكل افتراضي.

لتمكين الخدمة، ضع `controller.wallarm.metrics.enabled` على `true`:

```
controller:
  wallarm:
    metrics:
      enabled: true
```

فيما يلي قائمة بالمقاييس الخاصة بـWallarm بتنسيق Prometheus والمتاحة عبر نقطة النهاية المعرضة حديثًا:

```
# HELP wallarm_requests عدد الطلبات
# TYPE wallarm_requests gauge
wallarm_requests 2
# HELP wallarm_attacks عدد طلبات الهجوم
# TYPE wallarm_attacks gauge
wallarm_attacks 0
# HELP wallarm_blocked عدد الطلبات المحظورة
# TYPE wallarm_blocked gauge
wallarm_blocked 0
# HELP wallarm_blocked_by_acl عدد الطلبات المحظورة بواسطة acl 
# TYPE wallarm_blocked_by_acl gauge
wallarm_blocked_by_acl 0
# HELP wallarm_acl_allow_list طلبات مرت من خلال قائمة السماح
# TYPE wallarm_acl_allow_list gauge
wallarm_acl_allow_list 0
# HELP wallarm_abnormal عدد الطلبات غير الطبيعية
# TYPE wallarm_abnormal gauge
wallarm_abnormal 2
# HELP wallarm_tnt_errors عدد أخطاء الكتابة في tarantool 
# TYPE wallarm_tnt_errors gauge
wallarm_tnt_errors 0
# HELP wallarm_api_errors عدد أخطاء الكتابة في الAPI
# TYPE wallarm_api_errors gauge
wallarm_api_errors 0
# HELP wallarm_requests_lost عدد الطلبات المفقودة
# TYPE wallarm_requests_lost gauge
wallarm_requests_lost 0
# HELP wallarm_overlimits_time عدد مرات تجاوز الحد
# TYPE wallarm_overlimits_time gauge
wallarm_overlimits_time 0
# HELP wallarm_segfaults عدد أخطاء تجزئة الذاكرة
# TYPE wallarm_segfaults gauge
wallarm_segfaults 0
# HELP wallarm_memfaults عدد الأحداث التي تم الوصول فيها لحد الذاكرة الافتراضي
# TYPE wallarm_memfaults gauge
wallarm_memfaults 0
# HELP wallarm_softmemfaults عدد الأحداث التي تم الوصول فيها لحد ذاكرة الطلب
# TYPE wallarm_softmemfaults gauge
wallarm_softmemfaults 0
# HELP wallarm_proton_errors عدد أحداث أخطاء libproton غير المتعلقة بالذاكرة 
# TYPE wallarm_proton_errors gauge
wallarm_proton_errors 0
# HELP wallarm_time_detect_seconds الوقت المستغرق للكشف
# TYPE wallarm_time_detect_seconds gauge
wallarm_time_detect_seconds 0
# HELP wallarm_db_id معرّف ملف proton.db
# TYPE wallarm_db_id gauge
wallarm_db_id 71
# HELP wallarm_lom_id معرّف ملف LOM
# TYPE wallarm_lom_id gauge
wallarm_lom_id 386
# HELP wallarm_custom_ruleset_id معرّف ملف مجموعة القواعد المخصصة
# TYPE wallarm_custom_ruleset_id gauge
wallarm_custom_ruleset_id{format="51"} 386
# HELP wallarm_custom_ruleset_ver إصدار تنسيق ملف مجموعة القواعد المخصصة
# TYPE wallarm_custom_ruleset_ver gauge
wallarm_custom_ruleset_ver 51
# HELP wallarm_db_apply_time وقت تطبيق ملف proton.db
# TYPE wallarm_db_apply_time gauge
wallarm_db_apply_time 1674548649
# HELP wallarm_lom_apply_time وقت تطبيق ملف LOM
# TYPE wallarm_lom_apply_time gauge
wallarm_lom_apply_time 1674153198
# HELP wallarm_custom_ruleset_apply_time وقت تطبيق ملف مجموعة القواعد المخصصة
# TYPE wallarm_custom_ruleset_apply_time gauge
wallarm_custom_ruleset_apply_time 1674153198
# HELP wallarm_proton_instances عدد مثيلات بروتون
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 5
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds الوقت الذي توقف فيه العامل في libproton
# TYPE wallarm_stalled_worker_time_seconds gauge
wallarm_stalled_worker_time_seconds{pid="3169104"} 25

# HELP wallarm_startid معرّف بدء فريد
# TYPE wallarm_startid gauge
wallarm_startid 3226376659815907920
```

توفر هذه [الوثيقة](../../../configure-statistics-service.md) معلومات مفصلة حول إعداد المراقبة وقائمة المقاييس المتاحة.