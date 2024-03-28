1. نفّذ الأمر `curl http://127.0.0.8/wallarm-status` إذا كانت الإعدادات الافتراضية لخدمة الإحصائيات قيد الاستخدام.
2. وإلا، اطلع على ملف الإعداد `/etc/nginx/conf.d/wallarm-status.conf` لتكوين الأمر الصحيح المشابه لما ذُكر أعلاه.

```
{"requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,"requests_lost":0,"segfaults":0,"memfaults":0,"softmemfaults":0,"time_detect":0,"db_id":46,"custom_ruleset_id":4,"proton_instances": { "total":2,"success":2,"fallback":0,"failed":0 },"stalled_workers_count":0,"stalled_workers":[] }
```