على الجهاز الذي يحتوي على وحدة NGINX-Wallarm، في [ملف التكوين](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) الخاص بـ NGINX، حدد عنوان خادم وحدة postanalytics:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* يجب تحديد قيمة `max_conns` لكل من خوادم Tarantool العليا لمنع إنشاء اتصالات زائدة.
* لا يجب أن تكون قيمة `keepalive` أقل من عدد خوادم Tarantool.
* يتم التعليق على سطر الأوامر `# wallarm_tarantool_upstream wallarm_tarantool;` بشكل افتراضي - يرجى حذف `#`.

بمجرد تغيير ملف التكوين، أعد تشغيل NGINX/NGINX Plus على جهاز وحدة NGINX-Wallarm:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```