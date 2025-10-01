[img-creating-instance-group]:          ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-group.png
[img-create-instance-group-example]:    ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-scalable-instance-group.png
[img-checking-nodes-operation]:         ../../../images/cloud-node-status.png

[link-cpu-usage-policy]:                            https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing
[link-http-load-balancing-policy]:                  https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing#scaling_based_on_https_load_balancing_serving_capacity
[link-stackdriver-monitoring-metric-policy]:        https://cloud.google.com/compute/docs/autoscaler/scaling-stackdriver-monitoring-metrics
[link-multiple-metrics-policy]:                     https://cloud.google.com/compute/docs/autoscaler/multiple-policies
[link-creating-load-balancer]:                      load-balancing-guide.md

# Otomatik ölçekleme etkin bir yönetilen instance grubu oluşturma

Yönetilen bir instance grubu oluşturmak ve otomatik ölçeklemesini yapılandırmak için şu adımları izleyin:

1. Menüdeki **Compute Engine** bölümünde **Instance groups** sayfasına gidin ve **Create instance group** düğmesine tıklayın.

    ![Bir instance grubu oluşturma][img-creating-instance-group]

2. **Name** alanına instance grubu adını girin.

3. **Group type** ayarında **Managed instance group** öğesini seçin.

4. **Autoscaling** açılır listesinden **On** seçeneğini seçerek instance grubu için otomatik ölçeklemeyi etkinleştirin.

5. **Autoscaling policy** açılır listesinden gerekli ölçekleme politikasını seçin.
    
    Ölçekleme politikaları, instance grubunun boyutunu artırma ve azaltma kurallarını içerir. Sistem, politikanın dayandığı metriği kullanıcının tanımladığı hedef düzeyde tutmak için gruba ne zaman instance ekleyip çıkaracağını belirler.
    
    Aşağıdaki politikalardan birini seçebilirsiniz:
    
    1. CPU Usage: Grubun boyutu, gruptaki sanal makinelerin ortalama işlemci yükünü gerekli düzeyde tutacak şekilde kontrol edilir ([CPU usage politika dokümantasyonu][link-cpu-usage-policy]).
    2. HTTP Load Balancing Usage: Grubun boyutu, HTTP trafik dengeleyicisinin yükünü gerekli düzeyde tutacak şekilde kontrol edilir ([HTTP load balancing kullanım politikası dokümantasyonu][link-http-load-balancing-policy]).
    3. Stackdriver Monitoring Metric: Grubun boyutu, Stackdriver Monitoring aracından seçilen metriği gerekli düzeyde tutacak şekilde kontrol edilir ([Stackdriver Monitoring Metric politika dokümantasyonu][link-stackdriver-monitoring-metric-policy]).
    4. Multiple Metrics: Grubun boyutunu değiştirme kararı birden fazla metriğe göre verilir ([multiple metrics politika dokümantasyonu][link-multiple-metrics-policy]). 
    
    Bu kılavuz, otomatik ölçekleme mekanizmasının çalışma prensiplerini göstermek için **CPU usage** politikasını kullanır.
    
    Bu politikayı uygulamak için, **Target CPU usage** alanında gerekli ortalama işlemci yük düzeyini (yüzde olarak) belirtin.
    
    !!! info "Örnek"
        Aşağıdaki yapılandırma, ortalama sanal makine işlemci yükünü yüzde 60 düzeyinde tutmak için instance grubunun boyutunun nasıl kontrol edildiğini açıklar.
        ![Örnek: bir instance grubu oluşturma][img-create-instance-group-example]

6. **Minimum number of instances** alanına minimum instance grubu boyutunu belirtin (örneğin, iki instance).

7. **Maximum number of instances** alanına maksimum instance grubu boyutunu belirtin (örneğin, 10 instance).

8. Yeni eklenen instancetan metrik değerlerinin kaydedilmemesi gereken süreyi **Cool down period** alanında belirtin (örneğin, 60 saniye). Yeni bir instance ekledikten sonra kaynak tüketiminde sıçramalar görürseniz bu gerekli olabilir. 

    !!! info "Soğuma süresi gereksinimleri"
        Cooldown süresi, instancenın başlatılması için gereken süreden daha uzun olmalıdır.

9. Instance grubunun tüm parametrelerinin doğru yapılandırıldığından emin olun ve ardından **Create** düğmesine tıklayın.

Otomatik ölçekleme grubu başarıyla oluşturulduğunda belirtilen sayıda instance otomatik olarak başlatılacaktır.

Otomatik ölçekleme grubunun doğru oluşturulduğunu, grupta başlatılan instance sayısını görüntüleyerek ve bu veri noktasını Wallarm Cloud’a bağlı filtreleme düğümlerinin sayısıyla karşılaştırarak kontrol edebilirsiniz.

Bunu Wallarm Console üzerinden yapabilirsiniz. Örneğin, filtreleme düğümlerine sahip iki instance eşzamanlı çalışıyorsa, Wallarm Console ilgili Wallarm node’u için **Nodes** bölümünde bu sayıyı gösterecektir.

![Wallarm web arayüzünde **Nodes** düğümler sekmesi][img-checking-nodes-operation]

Artık [bir yük dengeleyici oluşturma ve yapılandırma][link-creating-load-balancer] işlemine devam edebilirsiniz.