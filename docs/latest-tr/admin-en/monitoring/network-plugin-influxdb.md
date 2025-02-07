[img-network-plugin-influxdb]:     ../../images/monitoring/network-plugin-influxdb.png

[doc-grafana]:                     working-with-grafana.md

[link-collectd-networking]:        https://collectd.org/wiki/index.php/Networking_introduction
[link-network-plugin]:             https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-typesdb]:                    https://www.collectd.org/documentation/manpages/types.db.html
[link-typesdb-file]:               https://github.com/collectd/collectd/blob/master/src/types.db

#   `collectd` Network Plugin vasıtasıyla InfluxDB'ye Metrik Aktarımı

Bu belge, Network eklentisini kullanarak metriklerin InfluxDB zaman serisi veritabanına aktarılması için bir örnek sunmaktadır. Ayrıca, InfluxDB'de toplanan metriklerin Grafana kullanılarak nasıl görselleştirileceğini de gösterecektir.

##  Örnek İş Akışı

--8<-- "../include/monitoring/metric-example.md"

![Örnek İş Akışı][img-network-plugin-influxdb]

Bu belgede aşağıdaki dağıtım şeması kullanılmaktadır:
*   Wallarm filter düğümü, `10.0.30.5` IP adresi ve `node.example.local` tam nitelikli alan adı üzerinden erişilebilen bir ana bilgisayarda konuşlandırılmıştır.
    
    Filter düğümündeki `collectd` için `network` eklentisi, tüm metriklerin `10.0.30.30` adresindeki InfluxDB sunucusuna `25826/UDP` portu üzerinden gönderilecek şekilde yapılandırılmıştır.
    
      
    !!! info "Network eklenti özellikleri"
        Lütfen eklentinin UDP üzerinden çalıştığını unutmayın (bkz. `network` eklentisinin [örnek kullanımları][link-collectd-networking] ve [dokümantasyonu][link-network-plugin]).
    
    
*   `influxdb` ve grafana servislerinin her ikisi de, `10.0.30.30` IP adresine sahip ayrı bir ana bilgisayarda Docker konteynerleri olarak dağıtılmıştır.

    InfluxDB veritabanına sahip `influxdb` servisi aşağıdaki şekilde yapılandırılmıştır:

      * `collectd` veri kaynağı oluşturulmuştur (InfluxDB terminolojisine göre `collectd` girişi); bu kaynak `25826/UDP` portunu dinler ve gelen metrikleri `collectd` adlı veritabanına yazar.
      * InfluxDB API ile iletişim `8086/TCP` portu üzerinden gerçekleşir.
      * Servis, `grafana` servisi ile `sample-net` Docker ağını paylaşır.
    
    
    
    Grafana içeren `grafana` servisi aşağıdaki şekilde yapılandırılmıştır:
    
      * Grafana web konsoluna `http://10.0.30.30:3000` adresinden erişilebilir.
      * Servis, `influxdb` servisi ile `sample-net` Docker ağını paylaşır.

##  InfluxDB'ye Metrik Aktarımının Yapılandırılması

--8<-- "../include/monitoring/docker-prerequisites.md"

### InfluxDB ve Grafana'nın Dağıtılması

Docker ana bilgisayarında InfluxDB ve Grafana'yı dağıtın:
1.  Örneğin, `/tmp/influxdb-grafana` adlı bir çalışma dizini oluşturun ve bu dizine geçin:
    
    ```
    mkdir /tmp/influxdb-grafana
    cd /tmp/influxdb-grafana
    ```
    
2.  InfluxDB veri kaynağının çalışabilmesi için, `collectd` değer tiplerini içeren `types.db` adlı bir dosyaya ihtiyacınız olacak.
    
    Bu dosya, `collectd` tarafından kullanılan veri seti özelliklerini tanımlar. Bu veri setleri ölçülebilir tip tanımlamalarını içerir. Bu dosya hakkında ayrıntılı bilgi [burada][link-typesdb] mevcuttur.
    
    `collectd` projesinin GitHub deposundan [``types.db`` dosyasını][link-typesdb-file] indirin ve çalışma dizinine yerleştirin.
    
3.  Aşağıdaki komutu çalıştırarak temel InfluxDB yapılandırma dosyasını alın:
    
    ```
    docker run --rm influxdb influxd config > influxdb.conf
    ```
    
4.  `influxdb.conf` InfluxDB yapılandırma dosyasında, `[[collectd]]` bölümündeki `enabled` parametresinin değerini `false`'dan `true`'ya değiştirerek `collectd` veri kaynağını etkinleştirin.
    
    Diğer parametreleri değiştirmeyin.
   
    Bölüm aşağıdaki gibi görünmelidir:
   
    ```
    [[collectd]]
      enabled = true
      bind-address = ":25826"
      database = "collectd"
      retention-policy = ""
      batch-size = 5000
      batch-pending = 10
      batch-timeout = "10s"
      read-buffer = 0
      typesdb = "/usr/share/collectd/types.db"
      security-level = "none"
      auth-file = "/etc/collectd/auth_file"
      parse-multivalue-plugin = "split"  
    ```
    
5.  Çalışma dizininde aşağıdaki içeriğe sahip bir `docker-compose.yaml` dosyası oluşturun:
   
    ```
    version: "3"
    
    services:
      influxdb:
        image: influxdb
        container_name: influxdb
        ports:
          - 8086:8086
          - 25826:25826/udp
        networks:
          - sample-net
        volumes:
          - ./:/var/lib/influxdb
          - ./influxdb.conf:/etc/influxdb/influxdb.conf:ro
          - ./types.db:/usr/share/collectd/types.db:ro
    
      grafana:
        image: grafana/grafana
        container_name: grafana
        restart: always
        ports:
          - 3000:3000
        networks:
          - sample-net
    
    networks:
      sample-net:
    ```

    `volumes:` ayarlarına göre, InfluxDB:
    1.  Veritabanı depolaması için çalışma dizinini kullanacak,
    2.  Çalışma dizininde bulunan `influxdb.conf` yapılandırma dosyasını kullanacak,
    3.  Çalışma dizininde bulunan, ölçülebilir değer tiplerini içeren `types.db` dosyasını kullanacaktır.  
    
6.  `docker-compose build` komutunu çalıştırarak servisleri oluşturun.
    
7.  `docker-compose up -d influxdb grafana` komutunu çalıştırarak servisleri başlatın.
    
8.  Aşağıdaki komutu çalıştırarak ilgili InfluxDB veri kaynağı için `collectd` adlı bir veritabanı oluşturun:
   
    ```
    curl -i -X POST http://10.0.30.30:8086/query --data-urlencode "q=CREATE DATABASE collectd"
    ```
    
    InfluxDB sunucusu benzer bir yanıt döndürmelidir:
   
    ```
    HTTP/1.1 200 OK
    Content-Type: application/json
    Request-Id: 23604241-b086-11e9-8001-0242ac190002
    X-Influxdb-Build: OSS
    X-Influxdb-Version: 1.7.7
    X-Request-Id: 23604241-b086-11e9-8001-0242ac190002
    Date: Sat, 27 Jul 2019 15:49:37 GMT
    Transfer-Encoding: chunked
    
    {"results":[{"statement_id":0}]}
    ```
    
Bu noktada, InfluxDB çalışıyor, `collectd`'den metrikleri almaya hazır durumda ve Grafana, InfluxDB'de depolanan verileri izleyip görselleştirmeye hazırdır.

### `collectd` Yapılandırması

`collectd`'i metrikleri InfluxDB'ye aktarmak üzere yapılandırın:

=== "Docker image, cloud image, all-in-one installer"
    1. Filtre düğümüne bağlanın (örneğin, SSH protokolü kullanarak). Root veya başka bir süper kullanıcı yetkilerine sahip hesapla giriş yaptığınızdan emin olun.
    1. Aşağıdaki yapılandırmayı `/opt/wallarm/etc/collectd/wallarm-collectd.conf` dosyasına ekleyin:
      
        ```
        LoadPlugin network
        
        <Plugin "network">
          Server "Server IPv4/v6 address or FQDN" "Server port"
        </Plugin>
        ```
        
        Burada şu öğeler yapılandırılmaktadır:
    
        1.  Metriklerin gönderileceği sunucu (`10.0.30.30`)
        1.  Sunucunun dinleyeceği port (`25826/UDP`)
        
    1. Aşağıdaki komutu çalıştırarak `wallarm` servisini yeniden başlatın:
    
        ```bash
        sudo systemctl restart wallarm
        ```
=== "Diğer kurulumlar"
    1. Filtre düğümüne bağlanın (örneğin, SSH protokolü kullanarak). Root veya başka bir süper kullanıcı yetkilerine sahip hesapla giriş yaptığınızdan emin olun.
    1. Aşağıdaki içeriğe sahip `/etc/collectd/collectd.conf.d/export-to-influxdb.conf` adında bir dosya oluşturun:
      
        ```
        LoadPlugin network
        
        <Plugin "network">
            Server "10.0.30.30" "25826"
        </Plugin>
        ```
        
        Burada şu öğeler yapılandırılmaktadır:
    
        1.  Metriklerin gönderileceği sunucu (`10.0.30.30`)
        1.  Sunucunun dinleyeceği port (`25826/UDP`)
        
    1. Uygun komutu çalıştırarak `collectd` servisini yeniden başlatın:
    
        --8<-- "../include/monitoring/collectd-restart-2.16.md"

Artık InfluxDB, filtre düğümündeki tüm metrikleri almaktadır. İlgilendiğiniz metrikleri görselleştirebilir ve onları [Grafana ile][doc-grafana] izleyebilirsiniz.