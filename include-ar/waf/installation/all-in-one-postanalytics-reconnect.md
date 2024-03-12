على الجهاز اللي محمل عليه موديول NGINX-Wallarm، في [ملف تكوين](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) NGINX، حدد عنوان سيرفر موديول postanalytics:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # محذوف

wallarm_tarantool_upstream wallarm_tarantool;
```

* قيمة `max_conns` يجب تحديدها لكل سيرفرات Tarantool لمنع تكوين اتصالات زائدة.
* قيمة `keepalive` يجب أن لا تكون أقل من عدد سيرفرات Tarantool.
* السطر `# wallarm_tarantool_upstream wallarm_tarantool;` معلق بشكل افتراضي - الرجاء حذف `#`.

بمجرد تغيير ملف التكوين، أعد تشغيل NGINX/NGINX Plus على سيرفر موديول NGINX-Wallarm:

=== "ديبيان"
    ```bash
    sudo systemctl restart nginx
    ```
=== "أوبونتو"
    ```bash
    sudo service nginx restart
    ```
=== "سينتوس"
    ```bash
    sudo systemctl restart nginx
    ```
=== "ألما لينكس، روكي لينكس أو أوراكل لينكس 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "آر إتش إي إل 8.x"
    ```bash
    sudo systemctl restart nginx
    ```