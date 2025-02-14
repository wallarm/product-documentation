[link-network-plugin]:              https://collectd.org/wiki/index.php/Plugin:Network
[link-network-plugin-docs]:         https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-collectd-networking]:         https://collectd.org/wiki/index.php/Networking_introduction
[link-influx-collectd-support]:     https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-plugin-table]:                https://collectd.org/wiki/index.php/Table_of_Plugins
[link-nagios-plugin-docs]:          https://www.collectd.org/documentation/manpages/collectd-nagios.html
[link-notif-common]:                https://collectd.org/wiki/index.php/Notifications_and_thresholds
[link-notif-details]:               https://www.collectd.org/documentation/manpages/collectd-threshold.html
[link-influxdb-collectd]:           https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-unixsock]:                    https://collectd.org/wiki/index.php/Plugin:UnixSock

[doc-network-plugin-example]:       network-plugin-influxdb.md
[doc-write-plugin-example]:         write-plugin-graphite.md
[doc-zabbix-example]:               collectd-zabbix.md
[doc-nagios-example]:               collectd-nagios.md

#	Göstergeleri Nasıl Getiririz

Bu talimatlar, bir filtreleme düğümünden göstergeleri toplama yollarını açıklamaktadır.

##	`collectd`'den Doğrudan Göstergeleri Aktarmak

`collectd` tarafından toplanan göstergeleri, `collectd` veri akışları ile çalışmayı destekleyen araçlara doğrudan aktarabilirsiniz.


!!! warning "Ön Şartlar"
    Tüm sonraki adımlar bir süper kullanıcı (örneğin, `root`) olarak gerçekleştirilmelidir.


###	`collectd` Ağ Eklentisi ile Göstergeleri Aktarmak

[Network plugin][link-network-plugin]'i `collectd`'e bağlayın ve yapılandırın:
1.	`/etc/collectd/collectd.conf.d/` dizininde, `.conf` uzantılı bir dosya (örn., `export-via-network.conf`) aşağıdaki içerikle oluşturun:

    ```
    LoadPlugin network
    
    <Plugin "network">
      Server "Sunucu IPv4/v6 adresi veya FQDN" "Sunucu portu"
    </Plugin>
    ```

    Bu dosyada belirtildiği gibi, eklenti `collectd` başlatıldığında yüklenecek, istemci modunda çalışacak ve filtre düğümünün gösterge verilerini belirtilen sunucuya gönderecektir.
    
2.	`collectd` istemcisinden veri alacak bir sunucu yapılandırın. Gerekli yapılandırma adımları, seçilen sunucuya bağlıdır ([`collectd`][link-collectd-networking] ve [InfluxDB][link-influxdb-collectd] için örnekler gözden geçirin).
    
    
    !!! info "Network Plugin ile Çalışma"
        Ağ eklentisi UDP üzerinden çalışır ([eklenti belgesi][link-network-plugin-docs] bakın). Gösterge toplamanın işlevsel olması için sunucunun UDP üzerinden iletişime izin verdiğinden emin olun.
         
3.	`collectd` hizmetini, uygun komutu çalıştırarak yeniden başlatın:

    --8<-- "../include-tr/monitoring/collectd-restart-2.16.md"

!!! info "Örnek"
    Göstergeleri Network plugin aracılığıyla InfluxDB'ye aktarma ve ardından Grafana'da göstergelerin görselleştirilmesine yönelik bir örneği [okuyun][doc-network-plugin-example].

###	`collectd` Yazma Eklentileri ile Göstergeleri Aktarmak

Göstergeleri `collectd` [yazma eklentileri][link-plugin-table] üzerinden aktarmayı yapılandırmak için denk gelen eklentinin belgelerine başvurun.


!!! info "Örnek"
    Yazma eklentileri kullanmayı hakkında temel bilgi sahibi olmak için, Grafana'da göstergelerin görselleştirilmesiyle birlikte göstergeleri Graphite'a aktarma [örneğini okuyun][doc-write-plugin-example].

##  `collectd-nagios` Yardımcı Programını Kullanarak Göstergeleri Aktarmak

Bu yöntemi kullanarak göstergeleri aktarmak için:

1.  Bir filtre düğümüne sahip bir hostta `collectd-nagios` yardımcı programını kurun. Linux'ta kurulu bir filtre düğümü için uygun komutu çalıştırarak bunu yapın:

    --8<-- "../include-tr/monitoring/install-collectd-utils.md"

    !!! info "Docker image"
        Filtre düğümü Docker imajı, önceden kurulu `collectd-nagios` yardımcı programıyla birlikte gelir.

2.  Bu yardımcı programı gerekli ayrıcalıklarla, bir süper kullanıcı adına (örneğin, `root`) veya normal bir kullanıcı olarak çalıştırabileceğinizi doğrulayın. İkinci durumda, kullanıcıyı `NOPASSWD` yönergesi ile `sudoers` dosyasına ekleyin ve `sudo` yardımcı programını kullanın.

    !!! info "Docker container ile çalışma"
        Filtre düğümü içeren bir Docker container'da `collectd-nagios` yardımcı programını çalıştırırken, ayrıcalıkların yükseltilmesi gerekli değildir.

3.  `collectd` göstergelerini Unix domain socket üzerinden aktarmak için [`UnixSock`][link-unixsock] eklentisini bağlayın ve yapılandırın. Bunu yapmak için, `/etc/collectd/collectd.conf.d/unixsock.conf` dosyasını aşağıdaki içerikle oluşturun:

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4.  `collectd` hizmetini, uygun komutu çalıştırarak yeniden başlatın:

    --8<-- "../include-tr/monitoring/collectd-restart-2.16.md"

5.  Uygun komutu çalıştırarak gerekli ölçeği alın:

    --8<-- "../include-tr/monitoring/collectd-nagios-fetch-metric.md"

    !!! info "Docker container kimliğini alma"
        Container tanımlayıcısının değerini `docker ps` komutunu çalıştırarak bulabilirsiniz ( "CONTAINER ID" sütununa bakın).

!!! info "`collectd-nagios` Yardımcı Programı için Eşikleri Ayarlama"
    Gerekirse, `collectd-nagios` yardımcı programının `WARNING` veya `CRITICAL` durumunu döndüreceği değer aralığını belirleyebilirsiniz. Bunun için ilgili `-w` ve `-c` seçeneklerini kullanın (ayrıntılı bilgi yardımcı programın [belgelerinde][link-nagios-plugin-docs] mevcuttur).

**Yardımcı programı kullanma örnekleri:**
*   Filtre düğümü bulunan Linux host `node.example.local` da `collectd-nagios` arandığında `wallarm_nginx/gauge-abnormal` metrik değerini almak için aşağıdaki komutu çalıştırın:
  
    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
       
*   `collectd-nagios` arandığında Docker container'da çalışan `wallarm_nginx/gauge-abnormal` metrik değerini `wallarm-node` adı ve `95d278317794` tanımlayıcısı olan filtre düğümü için almak için, aşağıdaki komutu çalıştırın:
  
    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H 95d278317794
    ```


!!! info "Daha fazla örnekler"
    `collectd-nagios` yardımcı programını kullanmayla ilgili temel bilgileri almak için göstergeleri
    
    *   [Nagios izleme sistemi][doc-nagios-example] ve
    *   [Zabbix izleme sistemi][doc-zabbix-example]na aktarma örneklerini okuyun.

##  `collectd` Bildirimlerini Gönderme

Bildirimler aşağıdaki dosyada yapılandırılır:

--8<-- "../include-tr/monitoring/notification-config-location.md"

Bildirimlerin nasıl çalıştığına dair genel bir açıklama [burada][link-notif-common] mevcuttur.

Bildirimlerin nasıl ayarlanacağına dair daha ayrıntılı bilgi [burada][link-notif-details] mevcuttur.

Olası bildirim gönderme yöntemleri:
*   NSCA ve NSCA-ng
*   SNMP TRAP
*   e-posta mesajları
*   özel komut dosyaları