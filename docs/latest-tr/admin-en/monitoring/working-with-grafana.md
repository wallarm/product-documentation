[img-influxdb-query-graphical]:     ../../images/monitoring/grafana-influx-1.png
[img-influxdb-query-plaintext]:     ../../images/monitoring/grafana-influx-2.png
[img-query-visualization]:          ../../images/monitoring/grafana-query-visualization.png
[img-grafana-0-attacks]:            ../../images/monitoring/grafana-0-attacks.png
[img-grafana-16-attacks]:           ../../images/monitoring/grafana-16-attacks.png

[link-grafana]:                     https://grafana.com/

[doc-network-plugin-influxdb]:      network-plugin-influxdb.md
[doc-network-plugin-graphite]:      write-plugin-graphite.md
[doc-gauge-abnormal]:                available-metrics.md#number-of-requests
[doc-available-metrics]:            available-metrics.md

[anchor-query]:                     #fetching-the-required-metrics-from-the-data-source
[anchor-verify-monitoring]:         #verifying-monitoring

# Grafana'da Filter Node Metrics İle Çalışma

Eğer metriklerin InfluxDB veya Graphite'e aktarımını yapılandırdıysanız, [Grafana][link-grafana] ile bu metrikleri görselleştirebilirsiniz.


!!! info "Birkaç varsayım"
    Bu doküman, [InfluxDB][doc-network-plugin-influxdb] veya [Graphite][doc-network-plugin-graphite] yanısıra Grafana'yı dağıttığınızı varsayar.
    
    Örnek olarak, `node.example.local` filter nodu tarafından işlenen istek sayısını gösteren [`curl_json-wallarm_nginx/gauge-abnormal`][doc-gauge-abnormal] metriği kullanılmaktadır.
    
    Ancak, [desteklenen herhangi bir metrik][doc-available-metrics]i izleyebilirsiniz.

Tarayıcınızda, Grafana web konsolunu açmak için `http://10.0.30.30:3000` adresine gidin ve ardından standart kullanıcı adı (`admin`) ve parola (`admin`) ile konsola giriş yapın.

Grafana kullanarak bir filter nodu izlemek için aşağıdaki adımları izlemelisiniz:
1.  Bir veri kaynağı bağlayın.
2.  Veri kaynağından gerekli metrikleri çekin.
3.  Metrik görselleştirmesini yapılandırın.

Aşağıdaki veri kaynaklarından birini kullandığınız varsayılmaktadır:
*   InfluxDB
*   Graphite

## Veri Kaynağı Bağlama

### InfluxDB

InfluxDB sunucusunu veri kaynağı olarak bağlamak için aşağıdaki adımları uygulayın:
1.  Grafana konsolunun ana sayfasında, *Add data source* düğmesine tıklayın.
2.  Veri kaynağı tipi olarak “InfluxDB”yi seçin.
3.  Gerekli parametreleri doldurun:
    *   Name: InfluxDB
    *   URL: `http://influxdb:8086`
    *   Database: `collectd`
    *   User: `root`
    *   Password: `root`
4.  *Save & Test* düğmesine tıklayın.



### Graphite

Graphite sunucusunu veri kaynağı olarak bağlamak için aşağıdaki adımları uygulayın:
1.  Grafana konsolunun ana sayfasında, *Add data source* düğmesine tıklayın.
2.  Veri kaynağı tipi olarak “Graphite”ı seçin.
3.  Gerekli parametreleri doldurun:
    *   Name: Graphite
    *   URL: `http://graphite:8080`.
    *   Version: açılır listeden en yeni sürümü seçin.
4.  *Save & Test* düğmesine tıklayın.


!!! info "Veri Kaynağı Durumunu Kontrol Etme"
    Bir veri kaynağı başarıyla bağlandıysa, “Data source is working” mesajı görünmelidir.


### İleri İşlemler

Grafana'nın metrikleri izlemesi için aşağıdaki işlemleri gerçekleştirin:
1.  Konsolun sol üst köşesindeki *Grafana* simgesine tıklayarak ana sayfaya dönün.
2.  *New Dashboard* düğmesine tıklayarak yeni bir gösterge paneli oluşturun. Ardından, gösterge paneline metrik çekebilmek için [bir sorgu ekleyin][anchor-query] ve *Add Query* düğmesine tıklayın.

## Veri Kaynağından Gerekli Metrikleri Çekme

### InfluxDB

InfluxDB veri kaynağından bir metrik çekmek için aşağıdaki adımları uygulayın:
1.  *Query* açılır listesinden yeni oluşturulmuş “InfluxDB” veri kaynağını seçin.
2.  InfluxDB'ye bir sorgu tasarlayın:
    *   Grafik sorgu tasarımı aracını kullanarak,

        ![Graphical query design tool][img-influxdb-query-graphical]

    *   veya ekran görüntüsünde vurgulanan *Toggle text edit* düğmesine tıklayarak elle düz metin şeklinde bir sorgu yazarak,

        ![Plaintext query design tool][img-influxdb-query-plaintext]



`curl_json-wallarm_nginx/gauge-abnormal` metrikini çekmek için sorgu:
```
SELECT value FROM curl_json_value WHERE (host = 'node.example.local' AND instance = 'wallarm_nginx' AND type = 'gauge' AND type_instance = 'abnormal')    
```



### Graphite

Graphite veri kaynağından bir metrik çekmek için aşağıdaki adımları uygulayın:

1.  *Query* açılır listesinden yeni oluşturulmuş “Graphite” veri kaynağını seçin.
2.  *Series* satırındaki metrik öğesi için *select metric* düğmesine tıklayarak, gerekli metrik öğelerinin sırasıyla seçilmesini sağlayın.

    `curl_json-wallarm_nginx/gauge-abnormal` metrik öğeleri şu şekilde ilerler:

    1.  Sunucu adı, bu değer `write_graphite` eklenti yapılandırma dosyasında belirlendi.
   
        Bu eklentide, `_` karakteri varsayılan olarak ayırıcı görevi gördüğünden, `node.example.local` alan adı sorguda `node_example_local` olarak temsil edilir.
   
    2.  Belirli bir değeri sağlayan `collectd` eklentisinin adı. Bu metrik için eklenti `curl_json`dur.
    3.  Eklenti örneğinin adı. Bu metrik için ad, `wallarm_nginx`tir.
    4.  Değerin türü. Bu metrik için tür `gauge`dur.
    5.  Değerin adı. Bu metrik için ad `abnormal`dur.

### İleri İşlemler

Sorgu oluşturulduktan sonra, ilgili metrik için bir görselleştirme yapılandırın.

## Metrik Görselleştirmesini Yapılandırma

*Query* sekmesinden *Visualization* sekmesine geçin ve metrik için istenen görselleştirmeyi seçin.

`curl_json-wallarm_nginx/gauge-abnormal` metrik için “Gauge” görselleştirmesini kullanmanızı öneririz:
*   Mevcut metrik değerini görüntülemek için *Calc: Last* seçeneğini seçin.
*   Gerekirse eşik değerleri ve diğer parametreleri yapılandırabilirsiniz.

![Configure visualization][img-query-visualization]

### İleri İşlemler

Görselleştirmeyi yapılandırdıktan sonra aşağıdaki adımları gerçekleştirin:
*   Konsolun sol üst köşesindeki *“←”* düğmesine tıklayarak sorgu yapılandırmasını tamamlayın.  
*   Gösterge panelinde yapılan tüm değişiklikleri kaydedin.
*   Grafana'nın metriği başarıyla izlediğini doğrulayın.

## İzlemeyi Doğrulama

Veri kaynaklarından birini bağladıktan ve `curl_json-wallarm_nginx/gauge-abnormal` metrik için sorgu ve görselleştirmeyi yapılandırdıktan sonra, izleme işlemini kontrol edin:
1.  Grafana konsolunun sağ üst köşesindeki açılır listeden beş saniyelik aralıklarla otomatik metrik güncellemelerini etkinleştirin.
2.  Grafana gösterge panelindeki istek sayısının, filter nodundaki `wallarm-status` çıktısı ile eşleştiğinden emin olun:

    --8<-- "../include/monitoring/wallarm-status-check-latest.md"
    
    ![Checking the attack counter][img-grafana-0-attacks]
    
3.  Filter node tarafından korunan bir uygulamaya test saldırısı gerçekleştirin. Bunu yapmak için, uygulamaya `curl` aracı veya bir tarayıcı kullanarak kötü amaçlı bir istek gönderebilirsiniz.

    --8<-- "../include/monitoring/sample-malicious-request.md"
    
4.  Hem `wallarm-status` çıktısında hem de Grafana gösterge panelinde istek sayacının arttığını doğrulayın:

    --8<-- "../include/monitoring/wallarm-status-output-padded-latest.md"

    ![Checking the attack counter][img-grafana-16-attacks]

Artık Grafana gösterge paneli, `node.example.local` filter nodu için `curl_json-wallarm_nginx/gauge-abnormal` metrik değerlerini göstermektedir.