إضافة عناوين خوادم postanalytics للملف `/etc/nginx/conf.d/wallarm.conf`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # محذوف

wallarm_tarantool_upstream wallarm_tarantool;
```

* يجب تحديد قيمة `max_conns` لكل من خوادم Tarantool العلوية لمنع إنشاء اتصالات زائدة.
* يجب ألا تقل قيمة `keepalive` عن عدد خوادم Tarantool.
* السطر `# wallarm_tarantool_upstream wallarm_tarantool;` معلق بشكل افتراضي - من فضلكم، احذفوا `#`.