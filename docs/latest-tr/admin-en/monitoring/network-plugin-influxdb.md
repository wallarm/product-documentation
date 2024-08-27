[img-network-plugin-influxdb]:     ../../images/monitoring/network-plugin-influxdb.png

[doc-grafana]:                     working-with-grafana.md

[link-collectd-networking]:        https://collectd.org/wiki/index.php/Networking_introduction
[link-network-plugin]:             https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-typesdb]:                    https://www.collectd.org/documentation/manpages/types.db.html
[link-typesdb-file]:               https://github.com/collectd/collectd/blob/master/src/types.db

#   `collectd` Ağ Eklentisi Üzerinden InfluxDB'ye Metrik Aktarımı

Bu belge, Ağ eklentisini kullanarak metrikleri InfluxDB zamansal veritabanına aktarma örneği sağlar. Ayrıca InfluxDB'de toplanan metrikleri nasıl görselleştireceğinizi Grafana ile de gösterir.

##  Örnek İş Akışı

--8<-- "../include-tr/monitoring/metric-example.md"

![Örnek İş Akışı][img-network-plugin-influxdb]

Bu belgede aşağıdaki dağıtım şeması kullanılmıştır:
*   Wallarm filtre düğümü, `10.0.30.5` IP adresi ve `node.example.local` tamamen nitelendirilmiş alan adı ile erişilebilir bir ana bilgisayara dağıtılmıştır.
    
    Filtre düğümündeki `collectd` için `network` eklentisi, tüm metriklerin `25826/UDP` bağlantı noktasındaki `10.0.30.30` InfluxDB sunucusuna gönderileceği şekilde ayarlanmıştır.
    
    !!! info "Ağ eklentisi özellikleri"
        Lütfen bu eklentinin UDP üzerinden çalıştığını unutmayın ([örnekleri kullanma][link-collectd-networking] ve `network` eklentisi [belgeleri][link-network-plugin] bakınız).
    
    
*   Hem `influxdb` hem grafana hizmetleri, `10.0.30.30` IP adresine sahip ayrı bir ana bilgisayarda Docker konteynerları olarak dağıtılmıştır.

    Aşağıdaki şekilde yapılandırılmış olan InfluxDB veritabanına sahip `influxdb` hizmeti:

      * Bir `collectd` veri kaynağı oluşturulmuştur (InfluxDB terminolojisine göre `collectd` girişi), `25826/UDP` bağlantı noktasını dinler ve gelen metrikleri `collectd` adlı veritabanında yazar.
      * InfluxDB API ile iletişim `8086/TCP` bağlantı noktası üzerinden gerçekleşir.
      * Hizmet, `grafana` hizmeti ile `sample-net` Docker ağı paylaşır.
    
    
    
    Aşağıdaki şekilde yapılandırılan Grafana'ya sahip `grafana` hizmeti:
    
      * Grafana web konsolu `http://10.0.30.30:3000` adresinde mevcuttur.
      * Hizmet, `influxdb` hizmeti ile `sample-net` Docker ağı paylaşır.

##  Metriklerin InfluxDB'ye Aktarımının Yapılandırılması

--8<-- "../include-tr/monitoring/docker-prerequisites.md"

### InfluxDB ve Grafana'nın Dağıtımı

Docker ana bilgisayarında InfluxDB ve Grafana'nın dağıtımını gerçekleştirin:
1.  Örneğin, `/tmp/influxdb-grafana` adında bir çalışma dizini oluşturun ve o dizine gidin:
    
    ```
    mkdir /tmp/influxdb-grafana
    cd /tmp/influxdb-grafana
    ```
    
2.  InfluxDB veri kaynağı çalışması için, `collectd` değer türlerini içeren `types.db` adında bir dosyaya ihtiyacınız olacak.
    
    Bu dosya, `collectd` tarafından kullanılan veri kümesi özelliklerini tanımlar. Bu veri kümeleri, ölçülebilir türlerin tanımlarını içerir. Bu dosya hakkında ayrıntılı bilgi [burada][link-typesdb] mevcuttur.
    
    `collectd` projesinin GitHub deposundan [`types.db` dosyasını indirin][link-typesdb-file] ve çalışma dizinine yerleştirin.
    
3.  Aşağıdaki komutu çalıştırarak temel InfluxDB yapılandırma dosyasını elde edin: 
    
    ```
    docker run --rm influxdb influxd config > influxdb.conf
    ```
    
4.  `influxdb.conf` InfluxDB yapılandırma dosyasındaki `[[collectd]]` bölümünde `enabled` parametresinin değerini `false` dan `true` ya değiştirerek `collectd` veri kaynağını etkinleştirin.
    
    Diğer parametreleri olduğu gibi bırakın.
   
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
    
5.  Çalışma dizininde, aşağıdaki içerikle bir `docker-compose.yaml` dosyası oluşturun:
   
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

    `volumes:` ayarlarına göre InfluxDB, 
    1.  Veritabanı için çalışma dizinini kullanacaktır.
    2.  Çalışma dizininde yer alan `influxdb.conf` yapılandırma dosyasını kullanacaktır.
    3.  Çalışma dizininde yer alan ölçülebilir değerlerin türlerini içeren `types.db` dosyasını kullanacaktır.  
    
6.  `docker-compose build` komutunu yürüterek hizmetleri oluşturun.
    
7.  `docker-compose up -d influxdb grafana` komutunu yürüterek hizmetleri çalıştırın.
    
8.  İlgili InfluxDB veri kaynağı için `collectd` adında bir veritabanı oluşturmak üzere aşağıdaki komutu yürütün:
   
    ```
    curl -i -X POST http://10.0.30.30:8086/query --data-urlencode "q=CREATE DATABASE collectd"
    ```
    
    InfluxDB sunucusu aşağıdakine benzer bir yanıt döndürmelidir:
   
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
    
Bu noktada, InfluxDB çalışıyor olmalı, `collectd` den metrikleri almak için hazır olmalı ve Grafana, InfluxDB'de saklanan verileri izlemek ve görselleştirmek için hazır olmalı.

### `collectd` Yapılandırılması

`collectd` yi, metrikleri InfluxDB'ye aktarmak üzere yapılandırın:
1. Filtre düğümüne bağlanın (örneğin, SSH protokolünü kullanabilirsiniz). Root veya başka bir süper kullanıcı ayrıcalıklarına sahip bir hesap ile giriş yaptığınızdan emin olun.
2. `/etc/collectd/collectd.conf.d/export-to-influxdb.conf` adında aşağıdaki içerikli bir dosya oluşturun:
   
    ```
    LoadPlugin network
    
    <Plugin "network">
        Server "10.0.30.30" "25826"
    </Plugin>
    ```
    
    Aşağıdaki varlıklar burada yapılandırılır:

    1.  Metrikleri göndermek için sunucu (`10.0.30.30`)
    2.  Sunucunun dinlediği bağlantı noktası (`25826/UDP`)
    
3. `collectd` hizmetini, uygun komutu çalıştırarak yeniden başlatın:

    --8<-- "../include-tr/monitoring/collectd-restart-2.16.md"

Şimdi InfluxDB, filtre düğümünün tüm metriklerini alır. İlgilendiğiniz metrikleri görselleştirebilir ve onları [Grafana ile][doc-grafana] izleyebilirsiniz.