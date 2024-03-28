# التحقق من عمل العقدة الفلترة

[doc-configure-parameters]: ../admin-en/configure-parameters-en.md
[doc-stat-service]: ../admin-en/configure-statistics-service.md

إذا تم تكوين كل شيء بشكل صحيح، فإن Wallarm تقوم بفلترة الطلبات وتوجيه الطلبات المُفلترة وفقًا لإعدادات ملف التكوين.

للتحقق من العملية الصحيحة، يجب عليك:

1. تنفيذ طلب `wallarm-status`.
2. تشغيل هجوم اختباري.


## 1. تنفيذ طلب `wallarm-status`

يمكنك الحصول على إحصائيات عمليات العقدة الفلترة بطلب URL `/wallarm-status`.

قم بتشغيل الأمر:

```
curl http://127.0.0.8/wallarm-status
```

سيكون الإخراج مثل:

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

هذا يعني أن خدمة إحصائيات العقدة الفلترة تعمل بشكل صحيح.

!!! info "خدمة الإحصائيات"
    يمكنك قراءة المزيد حول خدمة الإحصائيات وكيفية تكوينها [هنا][doc-stat-service].

## 2. تشغيل هجوم اختباري

للتحقق من قيام Wallarm بكشف الهجمات بشكل صحيح، أرسل طلبًا ضارًا إلى المورد المحمي.

على سبيل المثال:

```
http://<resource_URL>/etc/passwd
```

يجب على Wallarm أن تكشف في الطلب [اختراق المسار](../attacks-vulns-list.md#path-traversal).

الآن، سيزيد عداد عدد الهجمات عند تنفيذ طلب `wallarm-status`، مما يعني أن العقدة الفلترة تعمل بشكل طبيعي.

للتعرف على المزيد حول إعدادات عقدة فلترة Wallarm، راجع فصل [خيارات التكوين][doc-configure-parameters].