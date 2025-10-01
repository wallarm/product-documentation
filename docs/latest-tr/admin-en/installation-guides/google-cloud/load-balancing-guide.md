[link-doc-asg-guide]:               creating-autoscaling-group.md  
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md
[link-lb-comparison]:               https://cloud.google.com/load-balancing/docs/load-balancing-overview
[link-creating-instance-group]:     creating-autoscaling-group.md
[link-backup-resource]:             https://cloud.google.com/load-balancing/docs/target-pools#backupPool
[link-health-check]:                https://cloud.google.com/load-balancing/docs/health-checks
[link-session-affinity]:            https://cloud.google.com/load-balancing/docs/target-pools#sessionaffinity
[link-test-attack]:                 ../../../admin-en/uat-checklist-en.md#node-registers-attacks
[link-network-service-tier]:        https://cloud.google.com/network-tiers/docs/

[img-backend-configuration]:        ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/backend-configuration.png
[img-creating-lb]:                  ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-load-balancer.png
[img-creating-tcp-lb]:              ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-tcp-load-balancer.png
[img-new-frontend-ip-and-port]:     ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/frontend-configuration.png
[img-checking-attacks]:             ../../../images/admin-guides/test-attacks-quickstart.png


# GCP üzerinde gelen isteklerin yük dengelenmesini yapılandırma

Otomatik ölçekleme etkinleştirilmiş [yapılandırılmış][link-doc-asg-guide] bir managed instance group'a sahip olduğunuza göre, gelen HTTP ve HTTPS bağlantılarını instance group içindeki birden fazla filtreleme düğümü arasında dağıtan bir Load Balancer oluşturup yapılandırmanız gerekir.

Google Cloud Platform üzerinde şu Load Balancer türlerini yapılandırabilirsiniz:
*   HTTP(S) Load Balancer
*   TCP Load Balancer
*   UDP Load Balancer

!!! info "Load Balancer'lar arasındaki farklar"
    Load Balancer'lar arasındaki farklar hakkında ayrıntılı bilgi için bu [bağlantıya][link-lb-comparison] gidin. 

Bu doküman, OSI/ISO ağ modelinin taşıma katmanında trafiği dağıtan TCP Load Balancer'ın nasıl yapılandırılıp kullanılacağını göstermektedir.

Instance group'unuz için bir TCP Load Balancer'ı aşağıdaki adımları tamamlayarak oluşturun: 

1.  Menünün **Network services** bölümündeki **Load balancing** sayfasına gidin ve **Create load balancer** düğmesine tıklayın.

2.  **TCP load balancing** kartında **Start configuration** düğmesine tıklayın.

3.  Aşağıdaki ayarlarda gerekli seçenekleri seçin:

    1.  Yük dengeleyicinin istemcilerden sunucunuza gelen istekleri kontrol etmesi için, **Internet facing or internal only** ayarında **From Internet to my VMs** seçeneğini seçin.
    
    2.  **Multiple regions or single region** ayarında **Single region only** seçeneğini seçin.
    
        !!! info "Farklı bölgelerde bulunan kaynaklar için trafik dengeleme"
            Bu rehber, tek bir bölgede bulunan bir instance group için yük dengeleyici yapılandırmasını açıklamaktadır.
            
            Birden fazla bölgede bulunan birkaç kaynak için trafiği dengelemeniz gerekiyorsa **Multiple regions (or not sure yet)** seçeneğini seçin.

    ![Bir yük dengeleyici oluşturma][img-creating-lb]

    **Continue** düğmesine tıklayın.

4.  **Name** alanına yük dengeleyicinin adını girin.

5.  [Oluşturduğunuz instance group'u][link-creating-instance-group] backend olarak kullanmak için **Backend configuration**'a tıklayın; yük dengeleyici gelen istekleri buna yönlendirecektir.

6.  Formu aşağıdaki verilerle doldurun:

    1.  **Region** açılır listesinden instance group'un bulunduğu bölgeyi seçin.
    
    2.  **Backends** ayarında **Select existing instance groups** sekmesine gidin ve **Add an instance group** açılır listesinden instance group'un adını seçin.
    
    3.  Gerekirse, **Backup Pool** açılır listesinden **Create a backup pool** seçeneğini seçerek yedek havuzu (backup pool) belirtin. 
    
        !!! info "Yedek havuz kullanımı"
            Seçtiğiniz instance group kullanılamadığında istekleri bir yedek havuz işler. Yedek havuz yapılandırması hakkında ayrıntılı bilgi için bu [bağlantıya][link-backup-resource] gidin.
            
            Bu doküman yedek havuz yapılandırmasını açıklamaz.
    
    4.  Gerekirse, **Health check** açılır listesinden **Create a health check** seçeneğini belirleyerek grup instance'larının kullanılabilirlik denetimini yapılandırın. Makine kullanılabilirlik denetimi hakkında ayrıntılı bilgi için bu [bağlantıya][link-health-check] gidin.
    
        !!! info "Kullanılabilirlik denetimi"
            Bu dokümanın kapsamı dahilinde kullanılabilirlik denetimi yapılandırılmamıştır. Bu nedenle burada **Health check** açılır listesinde **No health check** seçeneği seçilmiştir.
    
    5.  Gerekirse, **Session affinity** açılır listesinden ilgili seçeneği seçerek isteği işleyecek instance'ı seçme yöntemini yapılandırın. İstek işleme için instance seçimi hakkında ayrıntılı bilgi bu [bağlantıda][link-session-affinity] mevcuttur.
    
        !!! info "Bir instance seçme yönteminin yapılandırılması"
            İsteği işleyecek instance'ı seçme yöntemi bu dokümanın kapsamı dışındadır. Bu nedenle burada **Session affinity** açılır listesinde **None** seçeneği seçilmiştir.
    
        ![Backend yapılandırma][img-backend-configuration]

7.  İstemcilerin isteklerini göndereceği IP adreslerini ve portları belirtmek için **Frontend configuration** düğmesine tıklayın.

8.  Yeni IP adresleri ve portların oluşturulmasına yönelik formu gerekli verilerle doldurun:

    1.  Gerekirse, yeni IP adresi ve port çiftinin adını **Name** alanına girin.
    
    2.  **Network Service Tier** ayarında gerekli ağ hizmet katmanını seçin. Ağ hizmet katmanları hakkında ayrıntılı bilgi için bu [bağlantıya][link-network-service-tier] gidin;
    
    3.  Yük dengeleyicinin istek alacağı IP adresini **IP** açılır listesinden seçin.
    
        1.  Yük dengeleyicinin her sanal makine başlatılışında yeni bir IP adresi almasını istiyorsanız **Ephemeral** seçeneğini seçin.
        
        2.  Yük dengeleyiciniz için statik bir IP adresi oluşturmak üzere **Create IP address** seçeneğini seçin. 
        
        Açılan formda yeni IP adresinin adını **Name** alanına girin ve **Reserve** düğmesine tıklayın.
            
    4.  **Port** alanına yük dengeleyicinin istek alacağı portu girin. 
    
        !!! info "Port seçimi"
            Bu dokümanda, HTTP protokolü üzerinden istek almak için `80` portu belirtilmiştir.
    
    ![Yeni frontend IP ve port oluşturma formu][img-new-frontend-ip-and-port]
    
    Yapılandırılan IP adresi ve port çiftini oluşturmak için **Done** düğmesine tıklayın.
    
    !!! info "Gerekli frontend portları"
        Bu dokümanda dengeleyici, HTTP protokolü üzerinden istek alacak şekilde yapılandırılmıştır. Instance group'unuz HTTPS protokolü üzerinden istek alıyorsa, `443` portunu belirten ek bir IP adresi ve port çifti oluşturun.

9.  **Create** düğmesine tıklayarak yapılandırılan yük dengeleyiciyi oluşturun.

    ![TCP yük dengeleyici oluşturma][img-creating-tcp-lb]
    
Yük dengeleyici oluşturma işlemi tamamlanana ve yük dengeleyici daha önce oluşturduğunuz instance group'a bağlanana kadar bekleyin.

Oluşturulan TCP dengeleyici Backend service kullandığından (instance group'unuz için oluşturulan backend ile birlikte çalışır), dengeleyicinin bağlanabilmesi için instance group üzerinde herhangi bir yapılandırma değişikliği gerekmez.

Artık dinamik olarak ölçeklenen Wallarm filtreleme düğümleri kümesi, uygulamanıza gelen trafiği işleyecektir.

Dağıtılan filtreleme düğümlerinin çalışmasını kontrol etmek için aşağıdaki adımları uygulayın:
1.  Tarayıcınızla dengeleyicinin IP adresine veya alan adına giderek, uygulamanızın yük dengeleyici ve Wallarm filtreleme düğümleri üzerinden erişilebilir olduğundan emin olun.
2.  [Test saldırısı gerçekleştirerek][link-test-attack] Wallarm servislerinin uygulamanızı koruduğundan emin olun.

![Wallarm web arayüzündeki «Events» sekmesi][img-checking-attacks]