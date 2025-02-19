[img-zabbix-hosts]:           ../../images/monitoring/zabbix-hosts.png
[img-zabbix-items]:           ../../images/monitoring/zabbix-items.png
[img-zabbix-widget]:          ../../images/monitoring/zabbix-widget.png
[img-global-view-0]:          ../../images/monitoring/global-view-0-value.png
[img-global-view-16]:         ../../images/monitoring/global-view-16-value.png

[doc-zabbix-parameters]:      collectd-zabbix.md#4-add-custom-parameters-to-the-zabbix-agent-configuration-file-on-the-filter-node-host-to-get-the-metrics-you-need

#   Zabbix'te Filter Node Metrikleri ile Çalışma

Zabbix web arayüzü giriş sayfasına erişmek için `http://10.0.30.30` adresine gidin. Standart kullanıcı adı (`Admin`) ve şifre (`zabbix`) kullanarak web arayüzüne giriş yapın. 

`node.example.local` filter node'unun metriklerini izlemek için, aşağıdaki adımları izleyin:

1.  Aşağıdaki adımları izleyerek yeni bir host oluşturun:
    1.  *Configuration → Hosts* sekmesine gidin ve *Create host* düğmesine tıklayın.
    2.  Filter node hostunun tam nitelikli alan adını *Host name* alanına girin (`node.example.local`).
    3.  Hostu yerleştirmek istediğiniz grubu *Groups* alanından seçin (örneğin, ön tanımlı “Linux servers” grubunu kullanabilir veya özel bir grup oluşturabilirsiniz).
    4.  Filter node hostunun IP adresini (*Agent interfaces* parametre grubunda) girin (`10.0.30.5`). Varsayılan port değeri (`10050`) değiştirilmeden bırakılmalıdır.
      
        
        !!! info "Alan adı kullanarak bağlanma"
            Gerekirse, Zabbix agent'a bağlanmak için bir alan adı ayarlayabilirsiniz. Bunun için ilgili ayarları uygun şekilde değiştirin.
        
      
    5.  Gerekirse diğer ayarları yapılandırın.
    6.  *Enabled* onay kutusunun işaretli olduğundan emin olun.
    7.  *Add* düğmesine tıklayarak host oluşturma işlemini tamamlayın.
    
    ![Configuring a Zabbix host][img-zabbix-hosts]
   
2.  Filter node hostu için izlenmesi gereken metrikleri ekleyin. Tek bir metrik eklemek için aşağıdaki adımları izleyin:
    1.  *Configuration → Hosts* sekmesinde oluşturulan hostun adı olan `node.example.local` üzerine tıklayın.
    2.  Host verilerinin bulunduğu bir sayfa açılacaktır. *Items* sekmesine geçin ve *Create item* düğmesine tıklayın. 
    3.  *Name* alanına bir metrik adı girin (örneğin, `Wallarm NGINX Attacks`).
    4.  *Type*, *Host interface* ve *Type of information* parametrelerini değiştirmeden bırakın.
    5.  *Key* alanına, [Zabbix agent configuration][doc-zabbix-parameters] sayfasında `UserParameter=` ile belirtilen metrik anahtar adını girin (örneğin, `wallarm_nginx-gauge-abnormal`).
    6.  Gerekirse, metrik değerinin güncellenme frekansını ve diğer parametreleri ayarlayın.
    7.  *Enabled* onay kutusunun işaretli olduğundan emin olun.
    8.  *Add* düğmesine tıklayarak metrik ekleme işlemini tamamlayın.
    
    ![Adding a metric][img-zabbix-items]

3.  Eklenen metriklerin görselleştirilmesini yapılandırın:
    1.  Dashboard'a erişmek için web arayüzünün sol üst köşesindeki Zabbix logosuna tıklayın. 
    2.  Dashboard üzerinde değişiklik yapmak için *Edit dashboard* düğmesine tıklayın:
        1.  *Add widget* düğmesine basarak bir widget ekleyin.
        2.  *Type* açılır listesinden gerekli widget tipini (örneğin, “Plain Text”) seçin.
        3.  *Name* alanına uygun bir isim girin.
        4.  Gerekli metrikleri *Items* listesine ekleyin (örneğin, yeni oluşturulan `Wallarm NGINX Attacks`).
        5.  *Show text as HTML* ve *Dynamic Items* onay kutularının işaretli olduğundan emin olun.
        6.  *Add* düğmesine tıklayarak *Add widget* sihirbazını tamamlayın.
        
        ![Adding widget with the metric][img-zabbix-widget]
      
    3.  Dashboard üzerinde yaptığınız değişiklikleri *Save changes* düğmesine tıklayarak kaydedin.

4.  İzleme işlemini kontrol edin: 
    1.  Zabbix widget'ındaki işlenen istek sayısının, filter node üzerindeki `wallarm-status` çıktısıyla eşleştiğinden emin olun.
    
        1.  İstatistik servisi varsayılan yapılandırmada ise `curl http://127.0.0.8/wallarm-status` komutunu çalıştırın. 
        2.  Aksi takdirde, yukarıdaki komuta benzer doğru komutu oluşturmak için `/etc/nginx/conf.d/wallarm-status.conf` yapılandırma dosyasına bakın (`all-in-one installer` için `/etc/nginx/wallarm-status.conf`).
        ```
        {"requests":64,"attacks":16,"blocked":0,"abnormal":64,"tnt_errors":0,"api_errors":0,"requests_lost":0,"segfaults":0,"memfaults":0,"softmemfaults":0,"time_detect":0,"db_id":46,"custom_ruleset_id":4,"proton_instances": { "total":2,"success":2,"fallback":0,"failed":0 },"stalled_workers_count":0,"stalled_workers":[] }
        ```

        ![Viewing the metric value][img-global-view-0]

    2.  Filter node tarafından korunan bir uygulamada test saldırısı gerçekleştirin. Bunu yapmak için, uygulamaya `curl` aracı veya bir tarayıcı kullanarak kötü niyetli bir istek gönderebilirsiniz.
        
        --8<-- "../include/monitoring/sample-malicious-request.md"
        
    3.  İstek sayacının hem `wallarm-status` çıktısında hem de Zabbix widget'ında arttığından emin olun:
    
        --8<-- "../include/monitoring/wallarm-status-output-padded-latest.md"

        ![Viewing the changed metric value][img-global-view-16]

Zabbix dashboard'u şimdi `node.example.local` filter node'una ait `wallarm_nginx/gauge-abnormal` metrik değerini göstermektedir.
