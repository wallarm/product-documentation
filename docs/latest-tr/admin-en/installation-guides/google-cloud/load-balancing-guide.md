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


#   GCP'de Gelen İstek Dengelemelerini Ayarlama 

Artık oto ölçekleme özelliği etkinleştirilmiş yönetilen bir örnek grubu [yapılandırdınız][link-doc-asg-guide], o zaman örnek grubundaki birkaç filtreleme düğümü arasında gelen HTTP ve HTTPS bağlantılarını dağıtan bir Yük Dengeleyici oluşturmanız ve yapılandırmanız gerekiyor.

Google Cloud Platform'da aşağıdaki türde Yük Dengeleyicileri yapılandırabilirsiniz:
*   HTTP(S) Yük Dengeleyicisi
*   TCP Yük Dengeleyicisi
*   UDP Yük Dengeleyicisi

!!! bilgi "Yük Dengeleyicileri Arasındaki Farklar"
    Yük Dengeleyicileri arasındaki farklılıklar hakkında ayrıntılı bilgi için bu [bağlantıya][link-lb-comparison] gidin.

Bu belge, OSI/ISO ağ modelinin taşıma seviyesinde trafik dağıtan TCP Yük Dengeleyicisinin nasıl yapılandırılacağını ve kullanılacağını göstermektedir.

Örnek grubunuz için aşağıdaki eylemleri tamamlayarak bir TCP Yük Dengeleyicisi oluşturun:

1.  Menünün **Ağ hizmetleri** bölümündeki **Yük dengelemesi** sayfasına gidin ve **Yük dengeleyici oluştur** düğmesini tıklayın.

2.  **TCP yük dengelemesi** kartındaki **Yapılandırmaya başla** düğmesini tıklayın.

3.  Aşağıdaki ayarlarda gereken seçenekleri belirleyin:

    1.  Yük dengeleyicinin istemciden sunucunuza gelen istekleri kontrol edeceği şekilde **Internetin İnternetten Vm'lerime** seçeneğini belirleyin **Internet yüzlerini veya sadece iç** ayarında.
    
    2.  **Çoklu bölgeler veya tek bölge** ayarında **Yalnızca tek bölge** seçeneğini belirleyin.
    
        !!! bilgi "Farklı bölgelerde bulunan kaynaklar için trafik dengeleme"
            Bu kılavuz, tek bir bölgede bulunan bir örnek grubu için yük dengeleyicinin yapılandırılmasını anlatır.
            
            Çoklu bölgelerde bulunan birkaç kaynak için trafik dengelemesi söz konusu olduğunda, **Çoklu bölgeler (veya henüz emin değilim)** seçeneğini belirleyin.

    ![Yük Dengeleyicisi oluşturmak][img-creating-lb]

    **Devam** düğmesini tıklayın.

4.  **Ad** alanına yük dengeleyicisi adını girin.

5.  Yük dengeleyicisinin gelen istekleri yönlendireceği arka uç olarak [oluşturulan örnek grubunu][link-creating-instance-group] kullanmak için **Arka uç yapılandırması**nı tıklayın.

6.  Formu aşağıdaki bilgilerle doldurun:

    1.  Örnek grubunun bulunduğu bölgeyi **Bölge** açılır listesinden seçin.
    
    2.  **Arkadan uçlar** ayarındaki **Mevcut örnek gruplarını seçin** sekmesine gidin ve **Bir örnek grubu ekleyin** açılır listesinden örnek grubunun adını seçin.
    
    3.  Gerekirse, **Yedek Havuz** açılır listesinden **Bir yedek havuz oluştur** seçeneğini belirleyerek yedek havuzu belirtin.
    
        !!! bilgi "Bir yedek havuzun kullanılması"
            Önceki ayarı seçilen örnek grubu kullanılamazsa, bir yedek havuz istekleri işler. Yedek bir havuzun nasıl yapılandırılacağı hakkında ayrıntılı bilgi için bu [bağlantıya][link-backup-resource] gidin.
            
            Bu belge, yedek havuz yapılandırmasını açıklamamaktadır.
    
    4.  Gerekirse, **Sağlık kontrolü** açılır listesinden **Bir sağlık kontrolü oluştur** seçeneğini belirleyerek grup örneklerinin kullanılabilirlik kontrolünü yapılandırın. Makine kullanılabilirlik kontrolü hakkında ayrıntılı bilgi için bu [bağlantıya][link-health-check] gidin.
    
        !!! bilgi "Kullanılabilirlik kontrolü"
            Kullanılabilirlik kontrolü bu belgenin kapsamında yapılandırılmamıştır. Bu yüzden, burada **Sağlık kontrolü** açılır listesindeki **Sağlık kontrolü yok** seçeneği seçilmiştir.
    
    5.  Gerekirse, **Oturum yoğunluğu** açılır listesinden ilgili seçeneği belirleyerek istek işleme için bir örneği seçme yöntemini yapılandırın. İstek işleme için bir örneği seçme hakkında ayrıntılı bilgi bu [bağlantıda][link-session-affinity] mevcuttur.
    
        !!! bilgi "Bir örneği seçme yöntemini yapılandırma"
            İstek işleme için bir örneği seçme yöntemi bu belgenin kapsamında değildir. Bu yüzden, burada **Oturum yoğunluğu** açılır listesindeki **Yok** seçeneği seçilmiştir.
    
        ![Arka uç yapılandırması][img-backend-configuration]

7.  İstemcilerin isteklerini gönderecekleri IP adreslerini ve portları belirtmek için **Ön uç yapılandırması** düğmesini tıklayın.

8.  Yeni IP adresleri ve portların oluşturulması için formu gereken verilerle doldurun:

    1.  Gerekirse, yeni IP adresi ve port çiftinin adını **Ad** alanına girin.
    
    2.  **Ağ Hizmeti Katmanı** ayarında gerekli ağ hizmet katmanını seçin. Ağ hizmet katmanları hakkında ayrıntılı bilgi için bu [bağlantıya][link-network-service-tier] gidin;
    
    3.  Yük dengeleyicisinin istekleri alacağı IP adresini **IP** açılır listesinden seçin.
    
        1.  Sanal makine her başlatıldığında yük dengeleyicisinin yeni bir IP adresi almasını isterseniz **Geçici** seçeneğini seçin.
        
        2.  Yük dengeleyiciniz için statik bir IP adresi oluşturmak için **IP adresi oluştur** seçeneğini seçin. 
        
        Beliren formda, yeni IP adresinin adını **Ad** alanına girin ve **Rezerve Et** düğmesini tıklayın.
            
    4.  Yük dengeleyicisinin istekleri alacağı portu **Port** alanına girin.

        !!! bilgi "Portu seçme"
            Bu belgede, HTTP protokolü üzerinden istekleri almak için `80` portu belirtilmiştir.
    
    ![Yeni ön uç IP ve port oluşturma formu][img-new-frontend-ip-and-port]
    
    Yapılandırılan IP adresi ve port çiftini oluşturmak için **Tamam** düğmesini tıklayın.
    
    !!! bilgi "Gerekli ön uç portlar"
        Bu belgede, dengeleyici HTTP protokolü üzerinden istekleri alacak şekilde yapılandırılmıştır. Eğer örnek grubunuz HTTPS protokolü üzerinden istekleri alıyorsa, `443` portunu belirten başka bir IP adresi ve port çifti oluşturun.

9.  Yapılandırılan yük dengeleyiciyi oluşturmak için **Oluştur** düğmesini tıklayın.

    ![Bir TCP yük dengeleyicisi oluşturmak][img-creating-tcp-lb]
    
Yük dengeleyicisi oluşturma işlemi tamamlanana ve yük dengeleyicisi daha önce oluşturduğunuz örnek grubuna bağlanana kadar bekleyin.

Oluşturduğunuz TCP dengeleyicisi, Backend hizmetini (önceden oluşturduğunuz örnek grubu için oluşturulan backend ile birlikte çalışan) kullandığından, dengeleyicinin ona bağlanabilmesi için örnek grubuna yapılandırma değişiklikleri gerekmez.

Şimdi, dinamik olarak ölçeklenen Wallarm filtreleme düğümleri seti, uygulamanıza gelecek trafiği işleyecektir.

Dağıtılan filtreleme düğümlerinin işlemesini kontrol etmek için aşağıdaki adımları gerçekleştirin:
1.  Tarayıcınızı kullanarak dengeleyici IP adresine veya alan adına başvurarak uygulamanızın yük dengeleyici ve Wallarm filtreleme düğümleri üzerinden erişilebilir olduğunu doğrulayın.
2.  Wallarm servislerinin uygulamanızı koruduğunu doğrulayın, [bir test saldırısını gerçekleştirin][link-test-attack].

![Wallarm web arayüzündeki «Olaylar» sekmesi][img-checking-attacks]