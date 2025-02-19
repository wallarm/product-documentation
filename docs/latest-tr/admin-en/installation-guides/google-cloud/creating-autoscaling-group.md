# Otomatik Ölçeklendirme Etkinleştirilmiş Yönetilen Örnek Grubunun Oluşturulması

Yönetilen bir örnek grubu oluşturmak ve otomatik ölçeklendirmeyi yapılandırmak için aşağıdaki adımları izleyin:

1.  Menünün **Compute Engine** bölümündeki **Instance groups** sayfasına gidin ve **Create instance group** butonuna tıklayın.

    ![Creating an instance group][img-creating-instance-group]

2.  **Name** alanına örnek grubunun adını girin.

3.  **Group type** ayarında **Managed instance group** seçeneğini belirleyin.

4.  **Autoscaling** açılır listesinden **On** seçeneğini seçerek örnek grubu için otomatik ölçeklendirmeyi etkinleştirin.

5.  **Autoscaling policy** açılır listesinden gerekli ölçeklendirme politikasını seçin. 
   
    Ölçeklendirme politikaları, örnek grubunun boyutunun artırılması veya azaltılmasıyla ilgili kuralları içerir. Sistem, politikanın esas alındığı metrik, kullanıcının tanımladığı hedef seviyede tutulabilsin diye gruba ne zaman bir örnek ekleyeceğini ya da çıkaracağını belirler.
    
    Aşağıdaki politikalardan birini seçebilirsiniz:
    
    1.  CPU Usage: Grup boyutu, gruptaki sanal makinelerin ortalama işlemci yükünü gerekli seviyede tutmak için kontrol edilir ([CPU usage policy documentation][link-cpu-usage-policy]).
    2.  HTTP Load Balancing Usage: Grup boyutu, HTTP trafik dengeleyicisinin yükünü gerekli seviyede tutmak için kontrol edilir ([HTTP load balancing usage policy documentation][link-http-load-balancing-policy]).
    3.  Stackdriver Monitoring Metric: Grup boyutu, Stackdriver Monitoring aracından seçilen metrik belirlenen seviyede tutmak için kontrol edilir ([Stackdriver Monitoring Metric policy documentation][link-stackdriver-monitoring-metric-policy]).
    4.  Multiple Metrics: Grup boyutunun değiştirilmesi kararı, birden fazla metrik baz alınarak verilir ([multiple metrics policy documentation][link-multiple-metrics-policy]). 
    
    Bu kılavuz, otomatik ölçeklendirme mekanizmasıyla çalışma prensiplerini göstermek amacıyla **CPU usage** politikasını kullanır.
    
    Bu politikayı uygulamak için **Target CPU usage** alanına gerekli ortalama işlemci yükü seviyesini (yüzde olarak) belirtin.
    
    !!! info "Örnek"
        Aşağıdaki yapılandırma, gruptaki sanal makinelerin ortalama işlemci yükünü yüzde 60 seviyesinde tutmak için örnek grubu boyutunun kontrolünü betimler.
        ![Example: creating an instance group][img-create-instance-group-example]

6.  **Minimum number of instances** alanına minimum örnek grubu boyutunu (örneğin, iki örnek) belirtin.

7.  **Maximum number of instances** alanına maksimum örnek grubu boyutunu (örneğin, 10 örnek) belirtin.

8.  Yeni eklenen örnekten metrik değerlerinin kaydedilmemesi gereken süreyi **Cool down period** alanına (örneğin, 60 saniye) girin. Bu, yeni bir örnek eklendikten sonra kaynak tüketiminde ani artışlar görmeniz durumunda gerekli olabilir.

    !!! info "Cool down dönemi gereksinimleri"
        Cool down dönemi, örneğin başlatılması için gereken süreden daha uzun olmalıdır.

9.  Örnek grubunun tüm parametrelerinin doğru yapılandırıldığından emin olduktan sonra **Create** butonuna tıklayın.

Otomatik ölçeklendirme grubunun başarılı bir şekilde oluşturulmasının ardından belirtilen sayıda örnek otomatik olarak başlatılacaktır.

Otomatik ölçeklendirme grubunun doğru oluşturulduğunu, grupta başlatılan örnek sayısını görüntüleyip bu değeri Wallarm Cloud'a bağlı filtreleme düğümlerinin sayısıyla karşılaştırarak kontrol edebilirsiniz.

Bunu, Wallarm Console'u kullanarak yapabilirsiniz. Örneğin, aynı anda iki örnek filtreleme düğümüne sahipse, Wallarm Console ilgili Wallarm düğümünün **Nodes** bölümünde bu sayıyı gösterecektir.

![The **Nodes** nodes tab on the Wallarm web interface][img-checking-nodes-operation]

Artık [load balancer oluşturma ve yapılandırma][link-creating-load-balancer] işlemine geçebilirsiniz.