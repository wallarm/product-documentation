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

# Filtreleme Düğümü İzleme

Wallarm filtreleme düğümünün durumunu (hem [NGINX ve Native](../../installation/nginx-native-node-internals.md)) düğüm tarafından sağlanan metrikler kullanarak izleyebilirsiniz. Bu makale, her filtreleme düğümüne kurulu olan [`collectd`][link-collectd] servisi tarafından toplanan metriklerle nasıl çalışılacağını anlatmaktadır. `collectd` servisi, verileri aktarmanın birkaç yolunu sağlar ve birçok izleme sistemi için metrik kaynağı olarak görev yapabilir; size filtreleme düğümlerinin durumunu kontrol etme imkanı sunar.

`collectd` metriklerine ek olarak, Wallarm, Prometheus ile uyumlu metrik formatı ve temel JSON metriklerini de sunar. Bu formatlar hakkında bilgi edinmek için [ayrı makaleye](../configure-statistics-service.md) bakın.

##  Neden İzleme Gereklidir

Wallarm modülünde meydana gelen arıza veya istikrarsız çalışma, filtreleme düğümü tarafından korunan bir uygulamaya yapılan kullanıcı isteklerinde kısmi veya tam hizmet reddine yol açabilir.

Postanalytics modülündeki arıza veya istikrarsız çalışma ise aşağıdaki işlevlerin erişilemez hale gelmesine neden olabilir:
*   Saldırı verilerinin Wallarm Cloud'a yüklenmesi. Sonuç olarak, saldırılar Wallarm portalında gösterilmeyecektir.
*   Davranışsal saldırıların tespiti (bkz. [brute-force attacks][av-bruteforce]).
*   Korunan uygulamanın yapısı hakkında bilgi edinilmesi.

Wallarm modülü ve postanalytics modülü, postanalytics modülü [ayrı kurulmuş olsa bile][doc-postanalitycs] izlenebilir.

!!! info "Terminoloji Anlaşması"

    Wallarm modülü ve postanalytics modülünü izlemek için aynı araçlar ve yöntemler kullanıldığından, aksi belirtilmedikçe bu kılavuz boyunca her iki modüle de “filtreleme düğümü” denilecektir.
    
    Filtreleme düğümünün izlenmesinin nasıl kurulacağına dair tüm belgeler aşağıdakiler için uygundur:

    *   ayrı kurulmuş Wallarm modülleri,
    *   ayrı kurulmuş postanalytics modülleri ve
    *   birlikte kurulmuş Wallarm ve postanalytics modülleri.

##  Ön Koşullar

İzlemenin çalışabilmesi için aşağıdakilerin sağlanması gerekmektedir:

*   [Wallarm NGINX düğümleri](../../installation/nginx-native-node-internals.md#nginx-node) için, NGINX filtreleme düğümüne istatistik döndürmelidir (`wallarm_status on`)
*   Filtreleme modu, `monitoring`/`safe_blocking`/`block` [modunda](../configure-wallarm-mode.md#available-filtration-modes) olmalıdır.
  
Varsayılan olarak, bu servise `http://127.0.0.8/wallarm-status` adresinden erişilebilir. Adres, eğer [değiştirildiyse](../configure-statistics-service.md#changing-an-ip-address-andor-port-of-the-statistics-service) farklı olabilir.

##  Metrik Formatı

### `collectd` Metrik Formatı

Bir `collectd` metrik tanımlayıcısı aşağıdaki formata sahiptir:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

Burada
*   `host`: Metrik alınan ana makinenin Tam Nitelikli Alan Adı (FQDN)
*   `plugin`: Metrik alınan eklentinin adı,
*   `-plugin_instance`: Varsa eklenti örneği,
*   `type`: Metrik değer tipidir. Kabul edilen tipler:
    *   `counter`
    *   `derive`
    *   `gauge` 
    
    Değer tipleri hakkında detaylı bilgi [burada][link-data-source] mevcuttur.

*   `-type_instance`: Varsa tipin örneği. Tip örneği, metriğin alınmak istendiği değere eşdeğerdir.

Metrik formatlarının tam tanımı [burada][link-collectd-naming] mevcuttur.

### Wallarm'a Özgü `collectd` Metrik Formatı

Filtreleme düğümü, Wallarm'a özgü metrikleri toplamak için `collectd` kullanır.

Wallarm modülü ile kullanılan NGINX metrikleri aşağıdaki formata sahiptir:

```
host/wallarm_nginx/type-type_instance
```

Postanalytics modülü metrikleri ise aşağıdaki formata sahiptir:

```
host/wallarm-tarantool/type-type_instance
```


!!! info "Metrik Örnekleri"
    `node.example.local` ana makinesi üzerindeki bir filtreleme düğümü için:

    * `node.example.local/wallarm_nginx/gauge-abnormal` işlenen istek sayısının metrikidir;
    * `node.example.local/wallarm-tarantool/gauge-export_delay` Tarantool aktarım gecikmesinin (saniye cinsinden) metriğidir.
    
    İzlenebilecek metriklerin tam listesine [buradan][doc-available-metrics] ulaşabilirsiniz.

##  Metriklerin Toplanma Yöntemleri

Filtreleme düğümünden metrikleri toplamanın birkaç yöntemi vardır:
*   `collectd` servisinden doğrudan veri ihracatı yaparak:
    *   [ `collectd` için Network eklentisi aracılığıyla][doc-network-plugin].
    
        Bu [eklenti][link-network-plugin], `collectd`'in filtreleme düğümünden verileri [`collectd`][link-collectd-networking] sunucusuna veya [InfluxDB][link-influxdb] veritabanına aktarmasına olanak tanır.
        
        
        !!! info "InfluxDB"
            InfluxDB, `collectd` ve diğer veri kaynaklarından metriklerin toplanması ve ardından görselleştirilmesi için kullanılabilir (örneğin, InfluxDB'de depolanan metrikleri görselleştirmek amacıyla [Grafana][link-grafana] izleme sistemi ile).
        
    *   [ `collectd` için yazma eklentilerinden biri aracılığıyla][doc-write-plugins].
  
        Örneğin, toplanan verileri `write_graphite` eklentisi kullanarak [Graphite][link-graphite]'e aktarabilirsiniz.
  
        
        !!! info "Graphite"
            Graphite, izleme ve görselleştirme sistemleri için veri kaynağı olarak kullanılabilir (örneğin, [Grafana][link-grafana]).
        
  
    Bu yöntem, aşağıdaki filtreleme düğümü dağıtım türleri için uygundur:

    *   Bulut ortamlarında: Amazon AWS, Google Cloud;
    *   Linux üzerinde, NGINX/NGINX Plus platformları için.

*   [ `collectd-nagios` aracılığıyla veri ihracatı yaparak][doc-collectd-nagios].
  
    Bu [araç][link-collectd-nagios], `collectd`'den verilen metrik değerini alır ve bunu [Nagios‑uyumlu formatta][link-nagios-format] sunar.
  
    Bu aracı kullanarak metrikleri [Nagios][link-nagios] veya [Zabbix][link-zabbix] izleme sistemlerine aktarabilirsiniz.
  
    Bu yöntem, nasıl dağıtıldığından bağımsız olarak herhangi bir Wallarm filtreleme düğümü tarafından desteklenir.
  
*   Metrik belirlenmiş eşik değerine ulaştığında `collectd`'den bildirim gönderimi yaparak.
  
    Bu yöntem, nasıl dağıtıldığından bağımsız olarak herhangi bir Wallarm filtreleme düğümü tarafından desteklenir.