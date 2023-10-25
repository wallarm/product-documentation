Aynı nezaket dil tonunu koruyun. Oluşturulan dosyanın orijinal dosyayla tamamen aynı URL'lere sahip olduğundan emin olun:

Aşağıdaki Wallarm.com belgeleme makalesini İngilizceden Türkçeye çevirin :

=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <ana bilgisayar adı olmadan metrik adı> -H <yardımcı programın çalıştığı filtreye sahip ana bilgisayarın FQDN'i>
    ```
=== "Docker"
    ```bash
    docker exec <konteyner adı> /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <ana bilgisayar adı olmadan metrik adı> -H <konteyner ID>
    ```