[link-collectd]:            https://collectd.org/

[av-bruteforce]:            ../../attacks-vulns-list.md#brute-force-attack
[doc-postanalitycs]:        ../installation-postanalytics-en.md

[link-collectd-naming]:     https://collectd.org/wiki/index.php/Naming_schema
[link-data-source]:         https://collectd.org/wiki/index.php/Data_source
[link-collectd-networking]: https://collectd.org/wiki/index.php/Networking_introduction
[link-influxdb]:            https://www.influxdata.com/products/influxdb-overview/
[link-grafana]:             https://grafana.com/
[link-graphite]:            https://github.com/graphite-project/graphite-web
[link-network-plugin]:      https://collectd.org/wiki/index.php/Plugin:Network
[link-write-plugins]:       https://collectd.org/wiki/index.php/Table_of_Plugins
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios]:              https://www.nagios.org/
[link-zabbix]:              https://www.zabbix.com/
[link-nagios-format]:       https://nagios-plugins.org/doc/guidelines.html#AEN200
[link-selinux]:             https://www.redhat.com/en/topics/linux/what-is-selinux

[doc-available-metrics]:    available-metrics.md
[doc-network-plugin]:       fetching-metrics.md#exporting-metrics-via-the-collectd-network-plugin
[doc-write-plugins]:        fetching-metrics.md#exporting-metrics-via-the-collectd-write-plugins
[doc-collectd-nagios]:      fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility
[doc-collectd-notices]:     fetching-metrics.md#sending-notifications-from-collectd

[doc-selinux]:  ../configure-selinux.md

# Filtreleme düğümü izlemenin giriş

Filtre düğümünün durumunu, düğümün sunduğu metrikleri kullanarak izleyebilirsiniz. Bu makale, her Wallarm filtre düğümünde kurulu olan [`collectd`][link-collectd] hizmeti tarafından toplanan metriklerle nasıl işlem yapılacağını tanımlar. `collectd` hizmeti, verileri aktarmak için birçok yol sunar ve birçok izleme sistemi için metrik kaynağı olarak hizmet edebilir, filtre düğümlerinin durumu üzerinde kontrol sağlayacak şekilde.

`collectd` metriklerine ek olarak, Wallarm size Prometheus ile uyumlu metrik formatı ve temel JSON metrikleri sunar. Bu formatlar hakkında [ayrı bir makalede](../configure-statistics-service.md) okuyabilirsiniz.

!!! uyarı "CDN düğümündeki izleme hizmetinin desteği"
    Lütfen `collectd` hizmetinin [Wallarm CDN düğümleri](../../installation/cdn-node.md) tarafından desteklenmediğini unutmayın.

##  İzlemenin Gerekli Olması

Hatalı veya istikrarsız çalışan Wallarm modülü, filtre düğümü tarafından korunan bir uygulamaya kullanıcı taleplerine tam veya kısmi hizmet reddi yol açabilir.

Postanalytics modülünde hatalı veya istikrarsız çalışma, aşağıdaki işlevlerin erişilemezliğine yol açabilir:
*   Saldırı verilerini Wallarm bulutuna yükleme. Sonuç olarak, saldırılar Wallarm portalında görüntülenmeyecektir.
*   Davranışsal saldırıları tespit etme (bkz. [brute-force saldırıları][av-bruteforce]).
*   Korunan uygulamanın yapısı hakkında bilgi almak.

Wallarm modülünü ve postanalytics modülünü, sonuncusu [ayrıca yüklendiyse][doc-postanalitycs] bile izleyebilirsiniz.



!!! bilgi "Terminoloji anlaşması"

    Wallarm modülünü ve postanalytics modülünü izlemek için aynı araçlar ve yöntemler kullanılır; bu nedenle bu rehber boyunca her iki modül de aksi belirtilmedikçe "filtre düğümü" olarak adlandırılacaktır.
    
    Filtre düğümünün izlenmesini ayarlamak için tüm belgeler uygundur

    *   ayrı ayrı dağıtılmış Wallarm modülleri,
    *   ayrı ayrı dağıtılmış postanalytics modülleri, ve
    *   birlikte dağıtılmış Wallarm ve postanalytics modülleri.


##  İzleme için Ön Gereksinimler

İzlemenin çalışması için gereklidir:
* NGINX, filtre düğümüne istatistikleri döndürür (`wallarm_status on`),
* Filtrasyon modu, `monitoring`/`safe_blocking`/`block` [modunda](../configure-wallarm-mode.md#available-filtration-modes) olmalıdır.
  
Varsayılan olarak, bu servis `http://127.0.0.8/wallarm-status` adresinden erişilebilir.

İstatistik hizmetini standart olmayan bir adreste kullanılabilir hale getirirseniz:

1. Yeni adres değerini `/etc/wallarm/node.yaml` dosyasına `status_endpoint` parametresiyle ekleyin, örneğin:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. `collectd` yapılandırma dosyasında `URL` parametresini buna göre düzeltin. Bu dosyanın yeri, kullanmış olduğunuz işletim sisteminin dağıtım türüne bağlıdır:

    --8<-- "../include-tr/monitoring/collectd-config-location.md"

Tarantool için standart olmayan bir IP adresi veya port kullanılıyorsa, Tarantool yapılandırma dosyasını buna göre düzeltmeniz gerekecektir. Bu dosyanın konumu, kullanmış olduğunuz işletim sisteminin dağıtım türüne bağlıdır:

--8<-- "../include-tr/monitoring/tarantool-config-location.md"

Filtre düğümü konakta SELinux kuruluysa, SELinux'un ya [yapılandırılmış ya da devre dışı bırakılmış][doc-selinux] olduğundan emin olun. Basitlik için, bu belge SELinux'un devre dışı bırakıldığını varsayar.

##  Metriklerin Nasıl Göründüğü

### `collectd` Metriklerin Nasıl Göründüğü

Bir `collectd` metrik tanımlayıcısı aşağıdaki formatı içerir:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

Nerede
*   `host`: metriğin elde edildiği konuğun Tam Nitelikli Alan Adı (FQDN)
*   `plugin`: metriğin elde edildiği eklentinin adı,
*   `-plugin_instance`: varsa eklentinin örneği,
*   `type`: metrik değerinin tipi. İzin verilen türler:
    *   `counter`
    *   `derive`
    *   `gauge` 
    
    Değer türleri hakkında ayrıntılı bilgi [burada][link-data-source] bulunabilir.

*   `-type_instance`: varsa bir tür örneği. Tür örneği, metriği almak istediğimiz değere eşdeğerdir.

Metrik formatlarının tam bir açıklaması [burada][link-collectd-naming] bulunabilir.

### Wallarm-Özel `collectd` Metriklerin Nasıl Göründüğü

Filtre düğümü, Wallarm-özel metrikleri toplamak için `collectd` kullanır.

Wallarm modülü ile NGINX metrikleri aşağıdaki formatı içerir:

```
host/curl_json-wallarm_nginx/type-type_instance
```

Postanalytics modülünün metrikleri aşağıdaki formatı içerir:

```
host/wallarm-tarantool/type-type_instance
```


!!! bilgi "Metrik Örnekleri"
    `node.example.local` konaklı bir filtre düğümü için:

    * `node.example.local/curl_json-wallarm_nginx/gauge-abnormal` işlenmiş taleplerin metriği;
    * `node.example.local/wallarm-tarantool/gauge-export_delay` Tarantool ihracat gecikmesinin saniye cinsinden metriği.
    
    İzlenebilecek metriklerin tam listesi, [burada][doc-available-metrics] bulunabilir.


##  Metrikleri Almanın Yöntemleri

Filtre düğümünden metrikleri birkaç şekilde toplayabilirsiniz:
*   Verileri doğrudan `collectd` hizmetinden aktararak
    *   [via the Network plugin for `collectd`][doc-network-plugin].
    
        Bu [eklenti][link-network-plugin], `collectd` metriklerini bir filtre düğümünden [`collectd`][link-collectd-networking] sunucusuna veya [InfluxDB][link-influxdb] veritabanına indirmesini sağlar.
        
        
        !!! bilgi "InfluxDB"
            InfluxDB, `collectd` ve diğer veri kaynaklarından metriklerin toplanması için kullanılabilir, ardından görselleştirme (örneğin, InfluxDB'de saklanan metrikleri görselleştirmek için bir [Grafana][link-grafana] izleme sistemi).
        
    *   [via one of the write plugins for `collectd`][doc-write-plugins].
  
        Örneğin, `write_graphite` eklentisini kullanarak toplanan verileri [Graphite][link-graphite]'a aktarabilirsiniz.
  
        
        !!! info "Graphite"
            Graphite, izleme ve görselleştirme sistemleri için bir veri kaynağı olarak kullanılabilir (örneğin, [Grafana][link-grafana]).
        
  
    Bu yöntem, aşağıdaki filtre düğümü dağıtım türleri için uygundur:

    *   bulutlar içinde: Amazon AWS, Google Cloud;
    *   Linux için NGINX / NGINX Plus platformları.

*   [By exporting data via `collectd-nagios`][doc-collectd-nagios].
  
    Bu [utility][link-collectd-nagios], `collectd` dan belirli bir metrik değerini alır ve bu değeri [Nagios uyumlu formatında][link-nagios-format] sunar.
  
    Bu yardımcı programı kullanarak metrikleri [Nagios][link-nagios] veya [Zabbix][link-zabbix] izleme sistemlerine aktarabilirsiniz.
  
    Bu yöntem, düğümün nasıl dağıtıldığına bakılmaksızın herhangi bir Wallarm filtre düğümü tarafından desteklenir.
  
*   [By sending notifications from `collectd`][doc-collectd-notices] when a metric has achieved a predetermined threshold value.

    Bu yöntem, düğümün nasıl dağıtıldığına bakılmaksızın herhangi bir Wallarm filtre düğümü tarafından desteklenir.