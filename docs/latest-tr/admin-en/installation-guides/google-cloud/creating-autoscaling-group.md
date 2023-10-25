[img-creating-instance-group]: ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-group.png
[img-create-instance-group-example]: ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-scalable-instance-group.png
[img-checking-nodes-operation]: ../../../images/cloud-node-status.png

[link-cpu-usage-policy]: https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing
[link-http-load-balancing-policy]: https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing#scaling_based_on_https_load_balancing_serving_capacity
[link-stackdriver-monitoring-metric-policy]: https://cloud.google.com/compute/docs/autoscaler/scaling-stackdriver-monitoring-metrics
[link-multiple-metrics-policy]: https://cloud.google.com/compute/docs/autoscaler/multiple-policies
[link-creating-load-balancer]: load-balancing-guide.md

# Otomatik ölçeklendirme ile yönetilen bir örnek grubu oluşturma

Yönetilen bir örnek grubu oluşturmak ve otomatik ölçeklendirmesini yapılandırmak için aşağıdaki adımları uygulayın:

1. Menünün **Compute Engine** bölümündeki **Örnek grupları** sayfasına gidin ve **Örnek grubu oluştur** düğmesini tıklayın.

    ![Örnek grubu oluşturma][img-creating-instance-group]

2. **İsim** alanına örnek grubu adını girin.

3. **Grup türü** ayarında **Yönetilen örnek grubu** seçin.

4. **Autoscaling** açılır listesinden **Açık** seçeneğini seçerek örnek grubun otomatik ölçeklendirmesini etkinleştirin.

5. Gereken ölçeklendirme politikasını **Autoscaling politikası** açılır listesinden seçin.

    Ölçeklendirme politikaları, örnek grubun boyutunun artırılması ve azaltılması için kurallar içerir. Sistem, politikanın temelinde olan metriğin kullanıcının tanımladığı hedef seviyede tutulması için grup bir örneği ne zaman ekleyip çıkaracağını belirler.

    Aşağıdaki politikaları seçebilirsiniz:

    1.  CPU Kullanımı: Grubun boyutu, grubun sanal makinelerinin ortalama işlemci yükünün gereken düzeyde tutulmasını kontrol eder ([CPU kullanımı politika belgeleri][link-cpu-usage-policy]).
    2.  HTTP Yük Dengeleme Kullanımı: Grubun boyutu, HTTP trafik dengeleyicinin yükünün gereken düzeyde tutulmasını kontrol eder ([HTTP yük dengeleme kullanımı politika belgeleri][link-http-load-balancing-policy]).
    3.  Stackdriver İzleme Metriği: Grubun boyutu, Stackdriver İzleme aracından seçilen metriğin gereken düzeyde tutulmasını kontrol eder ([Stackdriver İzleme Metrik politika belgeleri][link-stackdriver-monitoring-metric-policy]).
    4.  Çoklu Metrikler: Grubun boyutunun değiştirilmesi kararı, birkaç metriğin temelinde yapılır ([çoklu metrikler politika belgeleri][link-multiple-metrics-policy]).

    Bu rehber, otomatik ölçeklendirme mekanizması ile çalışma prensiplerini göstermek için **CPU kullanımı** politikasını kullanır.

    Bu politikayı uygulamak için, **Hedef CPU kullanımı** alanında gereken ortalama işlemci yük seviyesini belirtin (yüzde olarak).

    !!! info "Örnek"
        Aşağıdaki yapılandırma, ortalama sanal makine işlemcilerinin yükünün yüzde 60 düzeyinde tutulması için örnek grubunun boyutunun kontrolünü tanımlar.
        ![Örnek: bir örnek grubu oluşturma][img-create-instance-group-example]

6. **Minimum örnek sayısı** alanında minimum örnek grubu boyutunu belirtin (örneğin, iki örnek).

7. **Maksimum örnek sayısı** alanında maksimum örnek grubu boyutunu belirtin (örneğin, 10 örnek).

8. **Soğuma dönemi** alanında, yeni eklenen örneğin metrik değerlerinin kaydedilmemesi gereken süreyi belirtin (örneğin, 60 saniye). Bu, yeni bir örnek ekledikten sonra kaynak tüketiminde artışlar gördüyseniz gerekli olabilir.

    !!! info "Soğuma dönemi şartları"
        Soğuma süresi, örneğin başlatılması için gerekli süreden daha uzun olmalıdır.

9. Örnek grubunun tüm parametrelerinin doğru bir şekilde yapılandırıldığından emin olduktan sonra **Oluştur** düğmesini tıklayın.

Otomatik ölçeklendirme grubunun başarılı bir şekilde oluşturulmasının ardından belirtilen sayıda örnek otomatik olarak başlatılır.

Otomatik ölçeklendirme grubunun doğru bir şekilde oluşturulduğunu kontrol etmek için, grubun başlatılan örneklerinin sayısını ve bu veri noktasını Wallarm Cloud'a bağlanan filtreleme düğümlerinin sayısıyla karşılaştırabilirsiniz.

Bunu Wallarm Konsolunu kullanarak yapabilirsiniz. Örneğin, iki örneğin filtreleme düğümleri ile birlikte çalışıyorsa, Wallarm Konsolu bu sayıyı ilgili Wallarm düğümünün **Düğümler** bölümünde görüntüler.

![Wallarm web arabiriminde **Düğümler** düğümü sekmesi][img-checking-nodes-operation]

Artık [bir yük dengeleyicisinin oluşturulması ve yapılandırılması][link-creating-load-balancer] ile devam edebilirsiniz.