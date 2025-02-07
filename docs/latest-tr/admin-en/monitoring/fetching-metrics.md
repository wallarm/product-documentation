```markdown
#   Metriklerin Alınması

Bu talimatlar, bir filtre düğümünden metrik toplamanın yollarını açıklar.

##  `collectd`'den Doğrudan Metrik Aktarımı

`collectd` tarafından toplanan metrikleri, `collectd` veri akışlarıyla çalışmayı destekleyen araçlara doğrudan aktarabilirsiniz.


!!! warning "Ön Koşullar"
    Tüm sonraki adımlar süper kullanıcı (örneğin, `root`) olarak gerçekleştirilmelidir.


### `collectd` Ağ Eklentisi Üzerinden Metrik Aktarımı

[network plugin][link-network-plugin]'ü `collectd` ile yapılandırın ve bağlayın:

=== "Docker imajı, cloud imajı, tek parça yükleyici"
    1.  Aşağıdaki yapılandırmayı `/opt/wallarm/etc/collectd/wallarm-collectd.conf` dosyasına ekleyin:
    
        ```
        LoadPlugin network
        
        <Plugin "network">
          Server "Server IPv4/v6 address or FQDN" "Server port"
        </Plugin>
        ```

        Bu yapılandırmada belirtildiği gibi, eklenti `collectd` başlatıldığında yüklenecek, istemci modunda çalışacak ve filtre düğümünün metrik verilerini belirtilen sunucuya gönderecektir.
    1.  `collectd` istemcisinden veri alacak bir sunucuyu yapılandırın. Gerekli yapılandırma adımları seçilen sunucuya bağlıdır (örnekler için [`collectd`][link-collectd-networking] ve [InfluxDB][link-influxdb-collectd]'a bakın).
    
    
        !!! info "Ağ Eklentisi ile Çalışma"
            Ağ eklentisi UDP üzerinden çalışır (bkz. [eklenti belgeleri][link-network-plugin-docs]). Metrik toplamanın çalışabilmesi için sunucunun UDP üzerinden iletişime izin verdiğinden emin olun.
    1.  Aşağıdaki komutu çalıştırarak `wallarm` servisini yeniden başlatın:

        ```bash
        sudo systemctl restart wallarm
        ```
=== "Diğer kurulumlar"
    1.  `/etc/collectd/collectd.conf.d/` dizininde, `.conf` uzantılı (örn., `export-via-network.conf`) bir dosya oluşturun ve aşağıdaki içeriği ekleyin:

        ```
        LoadPlugin network
        
        <Plugin "network">
          Server "Server IPv4/v6 address or FQDN" "Server port"
        </Plugin>
        ```

        Bu dosyada belirtildiği gibi, eklenti `collectd` başlatıldığında yüklenecek, istemci modunda çalışacak ve filtre düğümünün metrik verilerini belirtilen sunucuya gönderecektir.
    1.  `collectd` istemcisinden veri alacak bir sunucuyu yapılandırın. Gerekli yapılandırma adımları seçilen sunucuya bağlıdır (örnekler için [`collectd`][link-collectd-networking] ve [InfluxDB][link-influxdb-collectd]'a bakın).
    
    
        !!! info "Ağ Eklentisi ile Çalışma"
            Ağ eklentisi UDP üzerinden çalışır (bkz. [eklenti belgeleri][link-network-plugin-docs]). Metrik toplamanın çalışabilmesi için sunucunun UDP üzerinden iletişime izin verdiğinden emin olun.
    1.  Uygun komutu çalıştırarak `collectd` servisini yeniden başlatın:

        --8<-- "../include/monitoring/collectd-restart-2.16.md"

!!! info "Örnek"
    Ağ eklentisi kullanılarak InfluxDB'ye metrik aktarımını ve metriklerin Grafana ile görselleştirilmesini anlatan bir [örneğe][doc-network-plugin-example] bakın.

### `collectd` Yazma Eklentileri ile Metrik Aktarımı

`collectd` [yazma eklentileri][link-plugin-table] aracılığıyla metrik aktarımını yapılandırmak için ilgili eklentinin belgelerine bakın.


!!! info "Örnek"
    Yazma eklentilerini kullanarak metrik aktarımı hakkında temel bilgi almak için Grafana ile metriklerin görselleştirilmesini içeren [Graphite üzerinden metrik aktarım örneğine][doc-write-plugin-example] bakın.

##  `collectd-nagios` Aracı Kullanılarak Metrik Aktarımı

Bu yöntemi kullanarak metrik aktarımı yapmak için:

1.  Linux üzerinde bir filtre düğümüne sahip bir ana bilgisayarda aşağıdaki uygun komutu çalıştırarak `collectd-nagios` aracını yükleyin (Linux üzerinde kurulu bir filtre düğümü için):

    --8<-- "../include/monitoring/install-collectd-utils.md"

    !!! info "Docker imajı"
        Filtre düğümü Docker imajı, önceden yüklü `collectd-nagios` aracını içerir.

2.  Bu aracı, süper kullanıcı (örneğin, `root`) adına ya da normal kullanıcı olarak yükseltilmiş yetkilerle çalıştırabileceğinizden emin olun. İkinci durumda, kullanıcıyı `sudoers` dosyasına `NOPASSWD` yönergesi ile ekleyin ve `sudo` aracını kullanın.

    !!! info "Docker konteyneri ile Çalışma"
        Filtre düğümünün bulunduğu Docker konteynerinde `collectd-nagios` aracını çalıştırırken yükseltilmiş yetkilere gerek yoktur.

3.  [`UnixSock`][link-unixsock] eklentisini, `collectd` metriklerini Unix domain socket üzerinden iletmesi için bağlayın ve yapılandırın. Bunu yapmak için, aşağıdaki içeriğe sahip `/etc/collectd/collectd.conf.d/unixsock.conf` dosyasını oluşturun:

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4.  Uygun komutu çalıştırarak `collectd` servisini yeniden başlatın:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

5.  Uygun komutu çalıştırarak gerekli metrik değerini alın:

    --8<-- "../include/monitoring/collectd-nagios-fetch-metric.md"

    !!! info "Docker konteynerinin ID'sini Alma"
        Konteyner tanımlayıcısının değerini `docker ps` komutunu çalıştırarak (bkz. “CONTAINER ID” sütunu) bulabilirsiniz.

!!! info "collectd-nagios Aracı için Eşik Değerlerinin Ayarlanması"
    Gerekirse, `collectd-nagios` aracının `WARNING` veya `CRITICAL` durumunu döndüreceği değer aralığını, ilgili `-w` ve `-c` seçeneklerini kullanarak belirtebilirsiniz (ayrıntılı bilgi araç [belgesinde][link-nagios-plugin-docs] mevcuttur).
   
**Aracın kullanımı için örnekler:**
*   Linux ana bilgisayar olan `node.example.local` üzerinde filtre düğümü ile `collectd-nagios` çağrıldığı andaki `curl_json-wallarm_nginx/gauge-abnormal` metrik değerini almak için aşağıdaki komutu çalıştırın:
  
    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
    ```
       
*   `wallarm-node` adı ve `95d278317794` tanımlayıcısına sahip Docker konteynerinde çalışan filtre düğümü için `collectd-nagios` çağrıldığı andaki `curl_json-wallarm_nginx/gauge-abnormal` metrik değerini almak için aşağıdaki komutu çalıştırın:
  
    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H 95d278317794
    ```


!!! info "Daha Fazla Örnek"
    `collectd-nagios` aracını kullanarak metrik aktarımına dair temel bilgileri aşağıdaki örneklerde bulabilirsiniz:
    
    *   [Nagios izleme sistemi için örnek][doc-nagios-example] ve
    *   [Zabbix izleme sistemi için örnek][doc-zabbix-example].


##  `collectd`'den Bildirim Gönderme

Bildirimler aşağıdaki dosyada yapılandırılmıştır:

--8<-- "../include/monitoring/notification-config-location.md"

Bildirimlerin nasıl çalıştığına dair genel açıklamayı [burada][link-notif-common] bulabilirsiniz.

Bildirimlerin nasıl ayarlanacağına dair daha ayrıntılı bilgiyi [burada][link-notif-details] edinebilirsiniz.

Bildirim göndermenin olası yöntemleri:
*   NSCA ve NSCA-ng
*   SNMP TRAP
*   e-posta mesajları
*   özel betikler
```