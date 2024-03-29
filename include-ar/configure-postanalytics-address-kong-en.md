أضف عنوان الخادم لـpostanalytics إلى `/etc/kong/nginx-wallarm.template`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# محذوف

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "الشروط المطلوبة"
    يجب أن تتحقق الشروط التالية لمعاملات `max_conns` و`keepalive`:
    
    * يجب ألا تكون قيمة معامل `keepalive` أقل من عدد خوادم Tarantool.
    * يجب تحديد قيمة معامل `max_conns` لكل من خوادم Tarantool العلوية لمنع إنشاء اتصالات مفرطة.

    يتم التعليق على السلسلة `# wallarm_tarantool_upstream wallarm_tarantool;` بشكل افتراضي - يرجى حذف `#`.