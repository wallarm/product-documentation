=== "لينكس"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <اسم المقياس بدون اسم المضيف> -H <FQDN للمضيف الذي عليه عقدة الفلتر والذي عليه يعمل الأداة>
    ```
=== "دوكر"
    ```bash
    docker exec <اسم الحاوية> /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <اسم المقياس بدون اسم المضيف> -H <معرف الحاوية>
    ```