أضف عنوان الخادم لـ postanalytics إلى `/etc/nginx-wallarm/conf.d/wallarm.conf`:

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
    يجب تحقيق الشروط التالية لمعلمتي `max_conns` و `keepalive`:
    
    * يجب ألا تقل قيمة معلمة `keepalive` عن عدد خوادم Tarantool.
    * يجب تحديد قيمة معلمة `max_conns` لكل من خوادم Tarantool العليا لمنع إنشاء اتصالات زائدة.

    السطر `# wallarm_tarantool_upstream wallarm_tarantool;` معلق بشكل افتراضي - يرجى حذف `#`.