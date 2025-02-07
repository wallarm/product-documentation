[img-write-plugin-graphite]:    ../../images/monitoring/write-plugin-graphite.png
[doc-grafana]:                  working-with-grafana.md

[link-docker-ce]:               https://docs.docker.com/install/
[link-docker-compose]:          https://docs.docker.com/compose/install/
[link-collectd-naming]:         https://collectd.org/wiki/index.php/Naming_schema
[link-write-plugin]:            https://www.collectd.org/documentation/manpages/collectd.conf.html#plugin_write_graphite

# collectd Yazma Eklentisi ile Metriğin Graphite'a Aktarılması

Bu doküman, metriklerin Graphite'a aktarılması için `write_graphite` yazma eklentisinin kullanılmasına dair bir örnek sunar.

## Örnek İş Akışı

--8<-- "../include/monitoring/metric-example.md"

![Örnek iş akışı][img-write-plugin-graphite]

Bu dokümanda aşağıdaki dağıtım şeması kullanılmaktadır:
*   Wallarm filtre düğümü, `10.0.30.5` IP adresi ve `node.example.local` tam nitelikli alan adı üzerinden erişilebilen bir host üzerinde dağıtılmıştır.

    Filtre düğümündeki `collectd` için `write_graphite` eklentisi aşağıdaki şekilde yapılandırılmıştır:

      *   Tüm metrikler, `2003/TCP` portunu dinleyen `10.0.30.30` sunucusuna gönderilir.
      *   Bazı Wallarm'a özgü `collectd` eklentileri birden fazla [örneği][link-collectd-naming] desteklediğinden, `write_graphite` eklentisi `SeparateInstances` parametresi `true` olarak ayarlanmıştır. `true` değeri, eklentinin birden fazla örnekle çalışabileceği anlamına gelir.
    
    Eklenti seçeneklerinin tam listesine [buradan][link-write-plugin] ulaşabilirsiniz.
    
*   Hem `graphite` hem de `grafana` servisleri, `10.0.30.30` IP adresine sahip ayrı bir host üzerinde Docker konteynerleri olarak dağıtılmıştır.
    
    Graphite ile yapılandırılmış `graphite` servisi aşağıdaki şekilde ayarlanmıştır:

      *   `collectd`'nin filtre düğümü metriklerini göndereceği `2003/TCP` portunda gelen bağlantıları dinler.
      *   Grafana ile iletişimin kurulacağı `8080/TCP` portunda gelen bağlantıları dinler.
      *   Servis, `grafana` servisi ile aynı `sample-net` Docker ağını paylaşır.

    Grafana ile yapılandırılmış `grafana` servisi ise aşağıdaki şekilde ayarlanmıştır:

      *   Grafana web konsoluna `http://10.0.30.30:3000` adresinden ulaşılabilir.
      *   Servis, `graphite` servisi ile aynı `sample-net` Docker ağını paylaşır.

## Metriklerin Graphite'a Aktarımının Yapılandırılması

--8<-- "../include/monitoring/docker-prerequisites.md"

### Graphite ve Grafana'nın Dağıtımı

Docker host'u üzerinde Graphite ve Grafana'yı dağıtın:
1.  Aşağıdaki içeriğe sahip bir `docker-compose.yaml` dosyası oluşturun:
    
    ```
    version: "3"
    
    services:
      grafana:
        image: grafana/grafana
        container_name: grafana
        restart: always
        ports:
          - 3000:3000
        networks:
          - sample-net
    
      graphite:
        image: graphiteapp/graphite-statsd
        container_name: graphite
        restart: always
        ports:
          - 8080:8080
          - 2003:2003
        networks:
          - sample-net
    
    networks:
      sample-net:
    ```
    
2.  `docker-compose build` komutunu çalıştırarak servisleri derleyin.
    
3.  `docker-compose up -d graphite grafana` komutunu çalıştırarak servisleri başlatın.
    
Bu noktada, Graphite çalışmakta olup `collectd`'den metrik almaya hazır, Grafana ise Graphite'da depolanan verileri izleyip görselleştirmeye hazır durumdadır.

### `collectd`'nin Yapılandırılması

Metriklerin Graphite'a aktarılması için `collectd`'yi yapılandırın:

=== "Docker image, cloud image, all-in-one installer"
    1. SSH protokolü gibi bir yöntem kullanarak filtre düğümüne bağlanın. `root` veya süper kullanıcı haklarına sahip başka bir hesap ile oturum açtığınızdan emin olun.
    1. `/opt/wallarm/etc/collectd/wallarm-collectd.conf` dosyasına aşağıdaki yapılandırmayı ekleyin:

        ```
        LoadPlugin write_graphite
        
        <Plugin write_graphite>
          <Node "node.example.local">
            Host "10.0.30.30"
            Port "2003"
            Protocol "tcp"
            SeparateInstances true
          </Node>
        </Plugin>
        ```
      
        Burada aşağıdaki öğeler yapılandırılmıştır:
        
        1.  Metriklerin alındığı ana bilgisayar adı (`node.example.local`).
        2.  Metriklerin gönderileceği sunucu (`10.0.30.30`).
        3.  Sunucu portu (`2003`) ve protokol (`tcp`).
        4.  Veri aktarım mantığı: bir eklenti örneğinin verileri, diğer eklenti örneğinin verilerinden ayrılır (`SeparateInstances true`).
    1. Aşağıdaki komutu çalıştırarak `wallarm` servisini yeniden başlatın:

        ```bash
        sudo systemctl restart wallarm
        ```
=== "Other installations"
    1. SSH protokolü gibi bir yöntem kullanarak filtre düğümüne bağlanın. `root` veya süper kullanıcı haklarına sahip başka bir hesap ile oturum açtığınızdan emin olun.
    1. `/etc/collectd/collectd.conf.d/export-to-graphite.conf` adlı bir dosya oluşturun ve aşağıdaki içeriği ekleyin:

        ```
        LoadPlugin write_graphite
        
        <Plugin write_graphite>
          <Node "node.example.local">
            Host "10.0.30.30"
            Port "2003"
            Protocol "tcp"
            SeparateInstances true
          </Node>
        </Plugin>
        ```
      
        Burada aşağıdaki öğeler yapılandırılmıştır:
        
        1.  Metriklerin alındığı ana bilgisayar adı (`node.example.local`).
        2.  Metriklerin gönderileceği sunucu (`10.0.30.30`).
        3.  Sunucu portu (`2003`) ve protokol (`tcp`).
        4.  Veri aktarım mantığı: bir eklenti örneğinin verileri, diğer eklenti örneğinin verilerinden ayrılır (`SeparateInstances true`).
    1. Uygun komutu çalıştırarak `collectd` servisini yeniden başlatın:

        --8<-- "../include/monitoring/collectd-restart-2.16.md"

Artık Graphite, filtre düğümüne ait tüm metrikleri alacaktır. İlgilendiğiniz metrikleri görselleştirebilir ve onları [Grafana ile][doc-grafana] izleyebilirsiniz.