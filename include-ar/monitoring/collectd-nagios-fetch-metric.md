=== "لينكس"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <اسم المقياس بدون اسم المضيف> -H <FQDN للمضيف الذي يعمل عليه العقدة الفلترة والذي يتم تشغيل الأداة عليه>
    ```
=== "دوكر"
    ```bash
    docker exec <اسم الحاوية> /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <اسم المقياس بدون اسم المضيف> -H <معرّف الحاوية>
    ```