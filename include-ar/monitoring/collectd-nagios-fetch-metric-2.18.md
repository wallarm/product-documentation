=== "لينكس"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <اسم المقياس بدون اسم المضيف> -H <FQDN للمضيف المحتوي على عقدة الفلتر التي تعمل عليها الأداة>
    ```
=== "دوكر"
    ```bash
    docker exec <اسم الحاوية> /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <اسم المقياس بدون اسم المضيف> -H <معرف الحاوية>
    ```