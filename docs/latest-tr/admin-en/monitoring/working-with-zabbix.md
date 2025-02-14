[img-zabbix-hosts]:           ../../images/monitoring/zabbix-hosts.png
[img-zabbix-items]:           ../../images/monitoring/zabbix-items.png
[img-zabbix-widget]:          ../../images/monitoring/zabbix-widget.png
[img-global-view-0]:          ../../images/monitoring/global-view-0-value.png
[img-global-view-16]:         ../../images/monitoring/global-view-16-value.png
[doc-zabbix-parameters]:      collectd-zabbix.md#4-add-custom-parameters-to-the-zabbix-agent-configuration-file-on-the-filter-node-host-to-get-the-metrics-you-need


# Zabbix'te Filtre Düğüm Metriclerini İzlemek

Zabbix web arayüzüne erişmek için `http://10.0.30.30` adresine gidin. Standart kullanıcı adı (`Admin`) ve parola (`zabbix`) kullanarak web arayüzüne giriş yapın.

`node.example.local` filtre düğümünün metriklerini izlemek için aşağıdaki eylemleri gerçekleştirin:

1.  Aşağıdaki adımlarla yeni bir host oluşturun:
    1.  *Yapılandırma → Hostlar* sekmesine gidin ve *Host oluştur* düğmesine basın.
    2.  *Host adı* alanına filtre düğümü hostunun tam nitelikli etki alanı adını doldurun (`node.example.local`).
    3. *Gruplar* alanından hostun yerleştirileceği grupları seçin (örneğin, önceden tanımlanmış "Linux sunucuları" grubunu veya özel bir grup oluşturabilirsiniz).
    4.  Filtre düğümü hostunun IP adresini(`10.0.30.5`), *Ajan arayüzleri* parametre grubuna doldurun. Varsayılan port değeri (`10050`)değiştirilmez bırakılır.
    
       
       !!! info "Domain adı kullanarak bağlanma"
           Gerekirse, Zabbix ajanına bağlanmak için bir domain adı belirleyebilirsiniz. Bunu gerçekleştirmek için ilgili ayarları uygun bir şekilde değiştiriniz.
       
           
    5.  Gerekirse, diğer ayarları yapılandırın.
    6.  *Etkin* kutusunun işaretli olduğundan emin olun.
    7.  *Ekle* düğmesine tıklayarak host oluşturma işlemini tamamlayın.
    
    ![Zabbix hostunu yapılandırma][img-zabbix-hosts]

2.  Filtre düğümü host için izlenecek metrikleri ekleyin. Tek bir metrik eklemek için aşağıdaki adımları izleyin:
    1.  *Yapılandırma → Hostlar* sekmesindeki hostlar listesinde oluşturulan `node.example.local` hostunun adına tıklayın.
    2.  Host bilgileri ile ilgili bir sayfa açılacak. *Öğeler* sekmesine geçin ve *Öğe oluştur* düğmesine tıklayın.
    3.  *Ad* alanına bir metrik adı girin (örneğin, `Wallarm NGINX Attacks`).
    4.  *Tür*, *Host arabirimi* ve *Bilgi türü* parametrelerini aynı bırakın.
    5.  Metriğin anahtar adını [Zabbix ajanı yapılandırması][doc-zabbix-parameters]nda belirtildiği gibi `UserParameter=` bölümünde *Anahtar* alanına girin (örneğin, `wallarm_nginx-gauge-abnormal`).
    6.  Gerekirse, metrik değerinin güncelleme sıklığını ve diğer parametreleri ayarlayın.
    7.  *Etkin* kutusunun işaretli olduğundan emin olun.
    8.  *Ekle* düğmesine tıklayarak metriği eklemeyi tamamlayın.
    
    ![Metrik Ekleme][img-zabbix-items]

3.  Eklenen metriklerin görselleştirilmesini yapılandırın:
    1.  Panoya erişmek için web arayüzünün sol üst köşesindeki Zabbix logosuna tıklayın.
    2.  Paneldeki değişiklikleri yapmak için *Paneli düzenle* düğmesine tıklayın:
        1.  *Widget ekle* düğmesine tıklayarak bir widget ekleyin.
        2.  *Tür* açılır listesinden gereken widget türünü seçin (örneğin, "Düz Metin").
        3.  *Ad* alanına uygun bir isim doldurun.
        4.  *Öğeler* listesine gereken metriği ekleyin (örneğin, yeni oluşturulan `Wallarm NGINX Attacks`).
        5. *Metni HTML olarak Söyle* ve *Dinamik Öğeler* kutularının işaretli olduğundan emin olun.
        6. *Widget ekle* sihirbazını *Ekle* düğmesine tıklayarak tamamlayın.

        ![Metrik ile widget ekleme][img-zabbix-widget]
      
    3.  Paneldeki değişiklikleri *Değişiklikleri kaydet* düğmesine tıklayarak kaydedin.

4.  İzleme işleminizi kontrol edin: 
    1.  Zabbix widgetındaki güncel işlenen isteklerin sayısının filtre düğümünde `wallarm-status` çıktısıyla eşleştiğinden emin olun.

        --8<-- "../include-tr/monitoring/wallarm-status-check-padded-latest.md"

        ![Metrik değerini görüntüleme][img-global-view-0]

    2.  Filtre düğümü tarafından korunan bir uygulamaya bir test saldırısı gerçekleştirin. Bunu yapmak için, `curl` yardımcı programı veya bir tarayıcı ile uygulamaya kötü amaçlı bir istek gönderebilirsiniz.

        --8<-- "../include-tr/monitoring/sample-malicious-request.md"
        
    3.  İstek sayacının hem `wallarm-status` çıktısında hem de Zabbix widget'ında arttığından emin olun.

        --8<-- "../include-tr/monitoring/wallarm-status-output-padded-latest.md"

        ![Değişen metrik değerini görüntüleme][img-global-view-16]

Zabbix paneli şimdi `wallarm_nginx/gauge-abnormal` metriğini `node.example.local` filtrel düğümünde görüntülüyor.