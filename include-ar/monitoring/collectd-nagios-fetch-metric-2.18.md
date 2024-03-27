=== "لينكس"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <اسم المتريك بدون اسم الهوست> -H <FQDN للهوست اللي عليه نود الفلتر اللي شغال عليه الأداة>
    ```
=== "دوكر"
    ```bash
    docker exec <اسم الكونتينر> /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <اسم المتريك بدون اسم الهوست> -H <معرف الكونتينر>
    ```