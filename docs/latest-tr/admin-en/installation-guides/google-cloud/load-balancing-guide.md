[link-doc-asg-guide]:               creating-autoscaling-group.md  
[link-docs-check-operation]:        /admin-en/installation-check-operation-en.md
[link-lb-comparison]:               https://cloud.google.com/load-balancing/docs/load-balancing-overview
[link-creating-instance-group]:     creating-autoscaling-group.md
[link-backup-resource]:             https://cloud.google.com/load-balancing/docs/target-pools#backupPool
[link-health-check]:                https://cloud.google.com/load-balancing/docs/health-checks
[link-session-affinity]:            https://cloud.google.com/load-balancing/docs/target-pools#sessionaffinity
[link-test-attack]:                 ../../installation-check-operation-en.md
[link-network-service-tier]:        https://cloud.google.com/network-tiers/docs/

[img-backend-configuration]:        ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/backend-configuration.png
[img-creating-lb]:                  ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-load-balancer.png
[img-creating-tcp-lb]:              ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-tcp-load-balancer.png
[img-new-frontend-ip-and-port]:     ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/frontend-configuration.png
[img-checking-attacks]:             ../../../images/admin-guides/test-attacks-quickstart.png


#   GCP'de Gelen İstek Dengelemesini Ayarlama

Artık otomatik ölçeklendirme etkinleştirilmiş [yapılandırılmış][link-doc-asg-guide] yönetilen örnek grubuna sahip olduğunuza göre, gelen HTTP ve HTTPS bağlantılarını örnek grubundaki birkaç filtreleme düğümü arasında dağıtan bir Load Balancer oluşturmanız ve yapılandırmanız gerekmektedir.

Google Cloud Platform'da aşağıdaki türde Load Balancer'ları yapılandırabilirsiniz:
*   HTTP(S) Load Balancer
*   TCP Load Balancer
*   UDP Load Balancer

!!! info "Load Balancer'lar Arasındaki Farklar"
    Load Balancer'lar arasındaki farklar hakkında detaylı bilgi için bu [link][link-lb-comparison]'e gidin.

Bu doküman, OSI/ISO ağ modelinin taşıma seviyesinde trafiği dağıtan TCP Load Balancer'ın nasıl yapılandırılacağını ve kullanılacağını göstermektedir.

Örnek grubunuz için bir TCP Load Balancer oluşturmak için şu adımları izleyin:

1.  Menüde **Network services** bölümünde yer alan **Load balancing** sayfasına gidin ve **Create load balancer** düğmesine tıklayın.

2.  **TCP load balancing** kartında yer alan **Start configuration** düğmesine tıklayın.

3.  Aşağıdaki ayarlarda gerekli seçenekleri belirleyin:

    1.  Load balancer'ın istemcilerden sunucunuza gelen istekleri kontrol etmesi için **Internet facing or internal only** ayarında **From Internet to my VMs** seçeneğini seçin.
    
    2.  **Multiple regions or single region** ayarında **Single region only** seçeneğini belirleyin.
    
        !!! info "Farklı Bölgelerde Bulunan Kaynaklar için Trafik Dengeleme"
            Bu kılavuz, tek bir bölgede bulunan bir örnek grubu için load balancer yapılandırmasını anlatmaktadır.
            
            Birden fazla bölgede bulunan kaynakların trafiğini dengelemek durumundaysanız, **Multiple regions (or not sure yet)** seçeneğini seçin.

    ![Creating a load balancer][img-creating-lb]

    **Continue** düğmesine tıklayın.

4.  **Name** alanına load balancer adını girin.

5.  Load balancer'ın gelen istekleri yönlendireceği backend olarak [oluşturulmuş örnek grubunu][link-creating-instance-group] kullanmak için **Backend configuration** seçeneğine tıklayın.

6.  Formu aşağıdaki verilerle doldurun:

    1.  **Region** açılır listesinden örnek grubunun bulunduğu bölgeyi seçin.
    
    2.  **Backends** ayarında yer alan **Select existing instance groups** sekmesine gidin ve **Add an instance group** açılır listesinden örnek grubunun adını seçin.
    
    3.  Gerekirse, **Backup Pool** açılır listesinden **Create a backup pool** seçeneğini seçerek yedek havuzunu belirtin.
    
        !!! info "Yedek Havuz Kullanımı"
            Seçilen örnek grubu kullanılamazsa yedek havuz istekleri işler. Yedek havuz yapılandırması hakkında detaylı bilgi için bu [link][link-backup-resource]'e gidin.
            
            Bu dokümanda yedek havuz yapılandırması açıklanmamaktadır.
    
    4.  Gerekirse, **Health check** açılır listesinden **Create a health check** seçeneğini seçerek grup örneklerinin uygunluk kontrolünü yapılandırın. Makine uygunluk kontrolü hakkında detaylı bilgi için bu [link][link-health-check]'e gidin.
    
        !!! info "Uygunluk Kontrolü"
            Uygunluk kontrolü bu dokümanın kapsamı dışında yapılandırılmıştır. Bu nedenle, burada **No health check** seçeneği seçilmiştir.
    
    5.  Gerekirse, **Session affinity** açılır listesinden ilgili seçeneği seçerek istek işleme için bir örneğin nasıl seçileceğini yapılandırın. İstek işleme için örnek seçme hakkında detaylı bilgi bu [link][link-session-affinity]'de mevcuttur.
    
        !!! info "İstek İşleme için Örnek Seçme Yönteminin Yapılandırılması"
            İstek işleme için örnek seçme yöntemi bu dokümanın kapsamı dışında tutulmuştur. Bu nedenle, burada **None** seçeneği seçilmiştir.
    
        ![Configuring a backend][img-backend-configuration]

7.  İstemcilerin istek göndereceği IP adreslerini ve portları belirtmek için **Frontend configuration** düğmesine tıklayın.

8.  Yeni IP adresleri ve port oluşturma formunu gerekli verilerle doldurun:

    1.  Gerekirse, **Name** alanına yeni IP adresi ve port çiftinin adını girin.
    
    2.  **Network Service Tier** ayarında gerekli ağ hizmet seviyesini seçin. Ağ hizmet seviyeleri hakkında detaylı bilgi için bu [link][link-network-service-tier]'e gidin;
    
    3.  Load balancer'ın istekleri alacağı IP adresini **IP** açılır listesinden seçin.
    
        1.  Her sanal makine başlatıldığında load balancer'ın yeni bir IP adresi almasını istiyorsanız **Ephemeral** seçeneğini seçin.
        
        2.  Load balancer için statik bir IP adresi oluşturmak adına **Create IP address** seçeneğini seçin.
        
        Açılan formda, **Name** alanına yeni IP adresinin adını girin ve **Reserve** düğmesine tıklayın.
            
    4.  Load balancer'ın istekleri alacağı portu **Port** alanına girin.
    
        !!! info "Port Seçimi"
            Bu dokümanda, HTTP protokolü aracılığıyla gelen istekler için `80` portu belirtilmiştir.
    
    ![New frontend IP and port creation form][img-new-frontend-ip-and-port]
    
    Yapılandırılan IP adresi ve port çiftini oluşturmak için **Done** düğmesine tıklayın.
    
    !!! info "Gerekli Frontend Portları"
        Bu dokümanda, load balancer HTTP protokolü ile gelen istekleri almak üzere yapılandırılmıştır. Eğer örnek grubunuz HTTPS protokolü ile istek alıyorsa, `443` portunu belirten başka bir IP adresi ve port çifti oluşturun.

9.  Yapılandırılan load balancer'ı oluşturmak için **Create** düğmesine tıklayın.

    ![Creating a TCP load balancer][img-creating-tcp-lb]
    
Load balancer oluşturma işlemi tamamlanana ve load balancer'ın daha önce oluşturduğunuz örnek gruba bağlanana kadar bekleyin.

Oluşturulan TCP balancer, örnek grubunuz için oluşturulan backend ile birlikte çalışan Backend service'i kullandığından, load balancer'ın örnek gruba bağlanabilmesi için örnek grubunda herhangi bir yapılandırma değişikliği yapmanıza gerek yoktur.

Artık Wallarm filtreleme düğümlerinin dinamik olarak ölçeklenen seti, uygulamanıza gelen trafiği işleyecektir.

Dağıtılmış filtreleme düğümlerinin çalışmasını kontrol etmek için şu adımları izleyin:
1.  Uygulamanızın load balancer ve Wallarm filtreleme düğümleri aracılığıyla erişilebilir olduğundan emin olmak için tarayıcınızda load balancer IP adresini veya alan adını kontrol edin.
2.  Wallarm servislerinin uygulamanızı koruduğundan emin olmak için [test saldırısı gerçekleştirin][link-test-attack].

![The «Events» tab on the Wallarm web interface][img-checking-attacks]