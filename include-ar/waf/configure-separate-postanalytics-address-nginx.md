أضف عناوين خوادم postanalytics إلى الملف `/etc/nginx/conf.d/wallarm.conf`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # تم التغاضي

wallarm_tarantool_upstream wallarm_tarantool;
```

* يجب تحديد قيمة `max_conns` لكل من خوادم Tarantool الواقعة في المنبع لمنع إنشاء اتصالات زائدة.
* لا يجب أن تكون قيمة `keepalive` أقل من عدد خوادم Tarantool.
* السطر `# wallarm_tarantool_upstream wallarm_tarantool;` معلق بشكل افتراضي - يرجى حذف `#`.