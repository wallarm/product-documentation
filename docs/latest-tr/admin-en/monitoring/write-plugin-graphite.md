[img-write-plugin-graphite]: ../../images/monitoring/write-plugin-graphite.png

[doc-grafana]:                  working-with-grafana.md

[link-docker-ce]:               https://docs.docker.com/install/
[link-docker-compose]:          https://docs.docker.com/compose/install/
[link-collectd-naming]:         https://collectd.org/wiki/index.php/Naming_schema
[link-write-plugin]:            https://www.collectd.org/documentation/manpages/collectd.conf.html#plugin_write_graphite

#   `collectd` Yazma Eklentisi Üzerinden Graphite'a Metric Gönderme

Bu belge, metriclerin Graphite'a dışa aktarılması için `write_graphite` yazma eklentisinin kullanımına dair bir örneği gözler önüne serer.

##  Örnek İş Akışı

--8<-- "../include-tr/monitoring/metric-example.md"

![Örnek iş akışı][img-write-plugin-graphite]

Bu belgedeki dağıtım şeması aşağıdaki gibidir:
*   Wallarm filtre düğümü, `10.0.30.5` IP adresi ve `node.example.local` tam adı (FQDN) üzerinden erişilebilir bir konakta dağıtılmaktadır.

    Filtre düğümündeki `collectd` için `write_graphite` eklentisi şu şekilde yapılandırılmıştır:

      *   Tüm metrikler, `2003/TCP` portu üzerinden dinleyen `10.0.30.30` sunucusuna gönderilir.
      *   Bazı Wallarm-özel `collectd` eklentileri birden fazla [örneği][link-collectd-naming] destekler, bu yüzden `write_graphite` eklentisi `SeparateInstances` parametresini `true` olarak içerir. `true` değeri, eklentinin birden fazla örnekle çalışabileceği anlamına gelir.
    
    Eklenti seçeneklerinin tam listesi [burada][link-write-plugin]dır.
    
*   Hem `graphite`, hem de `grafana` servisleri `10.0.30.30` IP adresine sahip ayrı bir konakta Docker konteynerları olarak dağıtılır.
    
    Graphite ile `graphite` servisi şu şekilde yapılandırılmıştır:

      *   `collectd`'nin filtre düğümü metriklerini göndereceği `2003/TCP` portu üzerinden gelen bağlantıları dinler.
      *   Grafana ile iletişimin gerçekleşeceği `8080/TCP` portu üzerinden gelen bağlantıları dinler.
      *   Servis, `grafana` servisi ile `sample-net` Docker ağını paylaşır.

    Grafana ile `grafana` servisi şu şekilde yapılandırılmıştır:

      *   Grafana web konsolu `http://10.0.30.30:3000` adresinde bulunur.
      *   Servis, `graphite` servisi ile `sample-net` Docker ağını paylaşır.

##  Metriclerin Graphite'a Aktarılmasının Yapılandırılması

--8<-- "../include-tr/monitoring/docker-prerequisites.md"

### Graphite ve Grafana'nın Yerleştirilmesi

Graphite ve Grafana'yı Docker konuğunda yerleştirin:
1.  İçeriği aşağıdaki gibi olan bir `docker-compose.yaml` dosyası oluşturun:
    
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
    
2.  Servisleri oluşturmak için `docker-compose build` komutunu çalıştırın.
    
3.  `docker-compose up -d graphite grafana` komutunu çalıştırarak servisleri çalıştırın.
    
Bu noktada, Graphite çalışıyor ve `collectd` tarafından gönderilen metricleri alma konumunda ve Grafana da, Graphite'da saklanan verileri izlemeye ve görselleştirmeye hazır olmalıdır.

### `collectd`'nin Yapılandırılması

`collectd`'yi metricleri Graphite'a indirmek üzere yapılandırın:
1.  Filtre düğümüne bağlanın (örneğin, SSH protokolünü kullanarak). `root` veya başka bir süper kullanıcı ayrıcalıklarına sahip hesapta oturum açtığınızdan emin olun.
2.  İçeriği aşağıdaki gibi olan `/etc/collectd/collectd.conf.d/export-to-graphite.conf` adlı bir dosya oluşturun:
    
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
    
    Aşağıdaki unsurlar burada yapılandırılır:
    
    1.  Metriclerin toplandığı konak adı (`node.example.local`).
    2.  Metriclerin gönderilmesi gereken sunucu (`10.0.30.30`).
    3.  Sunucu portu (`2003`) ve protokol (`tcp`).
    4.  Veri aktarım mantığı: bir eklenti örneğinin verileri, başka bir örneğin verilerinden ayrılır (`SeparateInstances true`).
    
3.  İlgili komutu çalıştırarak `collectd` servisini yeniden başlatın:

    --8<-- "../include-tr/monitoring/collectd-restart-2.16.md"

Şimdi Graphite filtre düğümünün tüm metriklerini alacak. İlgilendiğiniz metrikleri görselleştirebilir ve onları [Grafana ile][doc-grafana] izleyebilirsiniz.