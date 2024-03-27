إضافة عنوان الخادم لـ postanalytics إلى `/etc/kong/nginx-wallarm.template`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# تم حذف جزء من الكود

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! تحذير "الشروط المطلوبة"
    يُطلب أن تتحقق الشروط التالية لمعاملي `max_conns` و `keepalive`:
    
    * يجب ألا تكون قيمة معامل `keepalive` أقل من عدد خوادم Tarantool.
    * يجب تحديد قيمة معامل `max_conns` لكل من خوادم Tarantool المتصلة upstream لمنع إنشاء اتصالات مفرطة.

    تم التعليق على السطر `# wallarm_tarantool_upstream wallarm_tarantool;` افتراضيًا - الرجاء حذف `#`.