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

# Grafana'da Filtre Düğüm Metrikleriyle Çalışma

Eğer InfluxDB veya Graphite'da metrikleri dışa aktarmayı yapılandırdıysanız, bu metrikleri [Grafana][link-grafana] ile görselleştirebilirsiniz. 

!!! info "Birkaç varsayım"
    Bu belge, Grafana'yı [InfluxDB][doc-network-plugin-influxdb] veya [Graphite][doc-network-plugin-graphite] ile birlikte dağıtmanızı varsayar.
    
    Örnekte, `node.example.local` filtre düğümü tarafından işlenen isteklerin sayısını gösteren [`wallarm_nginx/gauge-abnormal`][doc-gauge-abnormal] metriği kullanılır.
    
    Ancak, herhangi bir [desteklenen metriği][doc-available-metrics] izleyebilirsiniz.

Tarayıcınızda, `http://10.0.30.30:3000` adresine giderek Grafana web konsolunu açın, ardından konsola standart kullanıcı adı (`admin`) ve şifre (`admin`) kullanarak giriş yapın.

Grafana'yı kullanarak bir filtre düğümünü izlemek için aşağıdakilere ihtiyacınız olacaktır:
1.  Bir veri kaynağını bağlayın.
2.  Veri kaynağından gereken metrikleri alın.
3.  Metrik görselleştirmeyi ayarlayın.

Aşağıdaki veri kaynaklarından birini kullandığınız varsayılır:
*   InfluxDB
*   Graphite

##  Bir Veri Kaynağına Bağlanma

### InfluxDB

Bir InfluxDB sunucusunu veri kaynağı olarak bağlamak için takip eden adımları uygulayın:
1.  Grafana konsolunun ana sayfasında, *Veri kaynağı ekle* düğmesine tıklayın.
2.  Veri kaynağı türü olarak “InfluxDB” seçin.
3.  Gereken parametreleri doldurun:
    *   İsim: InfluxDB
    *   URL: `http://influxdb:8086`
    *   Veritabanı: `collectd`
    *   Kullanıcı: `root`
    *   Şifre: `root`
4.  *Kaydet ve Test et* düğmesine tıklayın.

### Graphite

Bir Graphite sunucusunu veri kaynağı olarak bağlamak için takip eden adımları uygulayın:
1.  Grafana konsolunun ana sayfasında, *Veri kaynağı ekle* düğmesine tıklayın.
2.  Veri kaynağı türü olarak “Graphite” seçin.
3.  Gereken parametreleri doldurun:
    *   İsim: Graphite
    *   URL: `http://graphite:8080`.
    *   Version: sürüm listesinden en güncel olanını seçin.
4.  *Kaydet ve Test et* düğmesine tıklayın.

!!! info "Veri Kaynağı Durumunu Kontrol Etme"
    Eğer bir veri kaynağı başarıyla bağlandıysa, "Veri kaynağı çalışıyor" mesajı gözükmelidir.

### İleri Adımlar

Grafana'nın metrikleri izlemeye başlamasını sağlamak için aşağıdaki işlemleri gerçekleştirin:
1.  Konsolun sol üst köşesindeki *Grafana* simgesine tıklayarak ana sayfaya dönün.
2.  *Yeni Gösterge Tablosu* düğmesine tıklayarak yeni bir gösterge tablosu oluşturun. Ardından *Sorgu Ekle* düğmesine tıklayarak gösterge tablonuza bir metrik getirmek için [bir sorgu ekleyin][anchor-query].

##  Veri Kaynağından Gerekli Metriklerin Alınması

### InfluxDB

Bir metriği InfluxDB veri kaynağından almak için aşağıdakileri yapın:
1.  *Sorgu* açılır menüsünden yeni yaratılan "InfluxDB" veri kaynağını seçin.
2.  InfluxDB için bir sorgu tasarlayın.
    *   Ya grafiksel sorgu tasarım aracını kullanarak,

        ![Grafiksel sorgu tasarım aracı][img-influxdb-query-graphical]

    *   Ya da bir sorguyu düz metin olarak manuel olarak doldurarak (bunu yapmak için aşağıdaki ekran görüntüsünde belirtilen *Yazı düzenlemeyi değiştir* düğmesine tıklayın).

        ![Yazılı sorgu tasarım aracı][img-influxdb-query-plaintext]


`wallarm_nginx/gauge-abnormal` metriği almak için sorgu:
```
SELECT value FROM curl_json_value WHERE (host = 'node.example.local' AND instance = 'wallarm_nginx' AND type = 'gauge' AND type_instance = 'abnormal')    
```

### Graphite

Bir metriği Graphite veri kaynağından almak için aşağıdakileri yapın: 

1.  *Sorgu* açılır menüsünden yeni yaratılan “Graphite” veri kaynağını seçin.
2.  *Seri* hattındaki metriğin öğe için *metriği seç* düğmesine tıklayarak gereken metrik öğelerini sırayla seçin. 

    `wallarm_nginx/gauge-abnormal` metriği öğeleri şu şekildedir:

    1.  `write_graphite` eklenti yapılandırma dosyasında ayarlanan ev sahibi adı.

        Bu eklentide `_` karakteri varsayılan olarak ayırıcı görevi görür; bu nedenle, `node.example.local` geçerli adı sorgulamada `node_example_local` olarak sunulacaktır.
        
    2.  Belirli bir değeri sunan `collectd` eklentisinin adı. Bu metrik için eklenti `curl_json`.
    3.  Eklenti nesnesinin adı. Bu metrik için ad `wallarm_nginx`.
    4.  Değer tipi. Bu metrik için tip `gauge`.
    5.  Değerin adı. Bu metrik için ad `abnormal`.


### İleri Adımlar

Sorgunun oluşturulmasının ardından, ilgili metrik için bir görselleştirme ayarlayın.

##  Metrik Görselleştirmeyi Ayarlama

*Sorgu* sekmesinden *Görselleştirme* sekmesine geçin ve metrik için istediğiniz görselleştirmeyi seçin.

`wallarm_nginx/gauge-abnormal` metriği için "Ölçüm" görselleştirmesi önerilir:
*   Mevcut metrik değerini görüntülemek için *Hesaplama: Son* seçeneğini seçin.
*   Gerekirse, eşikleri ve diğer parametreleri yapılandırabilirsiniz.

![Görselleştirme ayarla][img-query-visualization]

### İleri Adımlar

Görselleştirme ayarlandıktan sonra aşağıdaki adımları uygulayın:
*   Konsolun sol üst köşesindeki *“←”* düğmesine tıklayarak sorgu yapılandırmasını tamamlayın.
*   Gösterge tablosundaki tüm değişiklikleri kaydedin. 
*   Grafana'nın metriği başarıyla izlediğini doğrulayın ve kontrol edin.

##  İzlemeyi Doğrulama

`wallarm_nginx/gauge-abnormal` metriği için veri kaynaklarından birini bağladıktan ve sorguyu ve görselleştirmeyi yapılandırdıktan sonra, izleme işlemini kontrol edin: 
1.  Otomatik metrik güncellemelerini beş saniye aralıklı olacak şekilde etkinleştirin (Grafana konsolunun sağ üst köşesindeki açılır listeden bir değer seçin).
2.  Grafana gösterge tablosundaki güncel istek sayısının, filtre düğümündeki `wallarm-status` çıktısı ile eşleştiğinden emin olun:

    --8<-- "../include-tr/monitoring/wallarm-status-check-latest.md"
    
    ![Saldırı sayaçını kontrol et][img-grafana-0-attacks]
    
3.  Filtre düğümü tarafından korunan bir uygulamaya bir test saldırısı gerçekleştirin. Bunu yapmak için, `curl` yardımcı programı veya bir tarayıcı ile uygulamaya kötü niyetli bir istek gönderebilirsiniz.

    --8<-- "../include-tr/monitoring/sample-malicious-request.md"
    
4.  `wallarm-status` çıktısında ve Grafana gösterge tablosunda istek sayacının arttığını doğrulayın:

    --8<-- "../include-tr/monitoring/wallarm-status-output-padded-latest.md"

    ![Saldırı sayaçını kontrol et][img-grafana-16-attacks]

Grafana gösterge tablosu şimdi `node.example.local` filtre düğümü için `wallarm_nginx/gauge-abnormal` metriğinin değerlerini göstermektedir.