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

!!! تحذير "الشروط المطلوبة"
    من الضروري أن تتوافق على الشروط التالية لمعاملات `max_conns` و `keepalive`:
    
    * قيمة معامل `keepalive` لا يجب أن تكون أقل من عدد خوادم Tarantool.
    * يجب تحديد قيمة معامل `max_conns` لكل من خوادم Tarantool العلوية لمنع إنشاء اتصالات زائدة.

    سلسلة `# wallarm_tarantool_upstream wallarm_tarantool;` معلقة بشكل افتراضي - يرجى حذف `#`.