# فحص عملية عقدة التصفية

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.md

إذا تم تكوين كل شيء بشكل صحيح، تقوم وولارم بتصفية الطلبات وإعادة توجيه الطلبات المفلترة وفقًا لإعدادات ملف التكوين.

لفحص العملية بشكل صحيح، يجب أن:

1. تنفيذ طلب `wallarm-status`.
2. إجراء هجوم اختباري.

    
## 1. تنفيذ طلب `wallarm-status`

يمكنك الحصول على إحصائيات تشغيل عقدة التصفية بطلب URL `/wallarm-status`.

قم بتشغيل الأمر:

```
curl http://127.0.0.8/wallarm-status
```

سيكون المخرج كالتالي:

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

هذا يعني أن خدمة إحصائيات عقدة التصفية تعمل وتعمل بشكل صحيح.

!!! info "خدمة الإحصائيات"
    يمكنك قراءة المزيد عن خدمة الإحصائيات وكيفية تكوينها [هنا][doc-stat-service].

## 2. إجراء هجوم اختباري

لفحص ما إذا كانت وولارم تكتشف الهجمات بشكل صحيح، أرسل طلب مؤذي إلى الموارد المحمية.

على سبيل المثال:

```
http://<resource_URL>/etc/passwd
```

تجب أن تكتشف وولارم في الطلب [اختراق المسار](../attacks-vulns-list.md#path-traversal).

الآن سيزيد عداد عدد الهجمات عند تنفيذ طلب لـ `wallarm-status`، مما يعني أن عقدة التصفية تعمل بشكل طبيعي.

لمعرفة المزيد عن إعدادات عقدة تصفية وولارم، انظر فصل [خيارات التكوين][doc-configure-parameters].