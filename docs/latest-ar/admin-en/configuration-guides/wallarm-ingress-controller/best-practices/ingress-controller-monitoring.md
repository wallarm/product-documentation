# مراقبة واجهة NGINX للتحكم فى الدخول

--8<-- "../include/ingress-controller-best-practices-intro.md"

جُلّ جوانب مراقبة واجهة التحكم في الدخول الخاصة بـ NGINX تم تغطيتها بالفعل على الإنترنت. تقدم وولارم مجموعة إضافية من مقاييس المراقبة التي يجب مراقبتها في بيئة حرجة. خدمة المقاييس `/wallarm-metrics` معطلة بشكل افتراضي.

لتفعيل الخدمة، اضبط `controller.wallarm.metrics.enabled` على `true`:

```
controller:
  wallarm:
    metrics:
      enabled: true
```

فيما يلي قائمة بمقاييس وولارم المحددة في تنسيق Prometheus المتاحة عبر نقطة النهاية المعرضة حديثًا:

```
# HELP wallarm_requests عدد الطلبات
# TYPE wallarm_requests gauge
wallarm_requests 2
# HELP wallarm_attacks عدد طلبات الهجوم
# TYPE wallarm_attacks gauge
wallarm_attacks 0
# HELP wallarm_blocked عدد الطلبات المحجوبة
# TYPE wallarm_blocked gauge
wallarm_blocked 0
# HELP wallarm_blocked_by_acl عدد الطلبات المحجوبة بواسطة ACL
# TYPE wallarm_blocked_by_acl gauge
wallarm_blocked_by_acl 0
# HELP wallarm_acl_allow_list الطلبات التي تمت الموافقة عليها بواسطة قائمة السماح
# TYPE wallarm_acl_allow_list gauge
wallarm_acl_allow_list 0
# HELP wallarm_abnormal عدد الطلبات الغير طبيعية
# TYPE wallarm_abnormal gauge
wallarm_abnormal 2
# HELP wallarm_tnt_errors عدد أخطاء الكتابة لـ tarantool
# TYPE wallarm_tnt_errors gauge
wallarm_tnt_errors 0
# HELP wallarm_api_errors عدد أخطاء الكتابة لـ API
# TYPE wallarm_api_errors gauge
wallarm_api_errors 0
# HELP wallarm_requests_lost عدد الطلبات المفقودة
# TYPE wallarm_requests_lost gauge
wallarm_requests_lost 0
# HELP wallarm_overlimits_time عدد تجاوزات الوقت
# TYPE wallarm_overlimits_time gauge
wallarm_overlimits_time 0
# HELP wallarm_segfaults عدد أخطاء التجزئة
# TYPE wallarm_segfaults gauge
wallarm_segfaults 0
# HELP wallarm_memfaults عدد الأحداث التي تم الوصول فيها لحد الذاكرة الافتراضية
# TYPE wallarm_memfaults gauge
wallarm_memfaults 0
# HELP wallarm_softmemfaults عدد أحداث الوصول لحد ذاكرة الطلبات
# TYPE wallarm_softmemfaults gauge
wallarm_softmemfaults 0
# HELP wallarm_proton_errors عدد أحداث أخطاء libproton غير المتعلقة بالذاكرة
# TYPE wallarm_proton_errors gauge
wallarm_proton_errors 0
# HELP wallarm_time_detect_seconds الوقت الذي تم قضاؤه في الكشف
# TYPE wallarm_time_detect_seconds gauge
wallarm_time_detect_seconds 0
# HELP wallarm_db_id معرف ملف proton.db
# TYPE wallarm_db_id gauge
wallarm_db_id 71
# HELP wallarm_lom_id معرف ملف LOM
# TYPE wallarm_lom_id gauge
wallarm_lom_id 386
# HELP wallarm_custom_ruleset_id معرف ملف مجموعة القواعد المخصصة
# TYPE wallarm_custom_ruleset_id gauge
wallarm_custom_ruleset_id{format="51"} 386
# HELP wallarm_custom_ruleset_ver إصدار تنسيق ملف مجموعة القواعد المخصصة
# TYPE wallarm_custom_ruleset_ver gauge
wallarm_custom_ruleset_ver 51
# HELP wallarm_db_apply_time وقت تفعيل ملف proton.db
# TYPE wallarm_db_apply_time gauge
wallarm_db_apply_time 1674548649
# HELP wallarm_lom_apply_time وقت تفعيل ملف LOM
# TYPE wallarm_lom_apply_time gauge
wallarm_lom_apply_time 1674153198
# HELP wallarm_custom_ruleset_apply_time وقت تفعيل ملف مجموعة القواعد المخصصة
# TYPE wallarm_custom_ruleset_apply_time gauge
wallarm_custom_ruleset_apply_time 1674153198
# HELP wallarm_proton_instances عدد حالات proton
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 5
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds الوقت الذي توقف فيه عامل في libproton
# TYPE wallarm_stalled_worker_time_seconds gauge
wallarm_stalled_worker_time_seconds{pid="3169104"} 25

# HELP wallarm_startid معرف البدء الفريد
# TYPE wallarm_startid gauge
wallarm_startid 3226376659815907920
```

تُقدم المعلومات المفصلة عن إعداد المراقبة وقائمة المقاييس المتاحة في هذا [التوثيق](../../../monitoring/intro.md).