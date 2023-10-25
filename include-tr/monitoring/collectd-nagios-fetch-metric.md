Dilin nezaket tonunu koruyun. Oluşturulan dosyanın orijinal dosyayla tamamen aynı URL'lere sahip olduğundan emin olun:

Aşağıdaki Wallarm.com belgeleme makalesini İngilizceden Türkçeye çevirin:

=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <host adı olmadan metrik adı> -H <yardımcı programın çalıştığı filtre düğümüne sahip ana bilgisayarın FQDN'si>
    ```
=== "Docker"
    ```bash
    docker exec <konteyner adı> /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <host adı olmadan metrik adı> -H <konteyner ID>
    ```