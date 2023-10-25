[link-doc-ami-creation]:        create-image.md
[link-doc-lb-guide]:            load-balancing-guide.md

[link-ssh-keys-guide]:          ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys
[link-security-group-guide]:    ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group

[link-doc-as-faq]:              https://aws.amazon.com/autoscaling/faqs/

[img-create-lt-wizard]:         ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/create-launch-template.png
[img-create-asg-wizard]:        ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/create-asg-with-template.png
[img-asg-wizard-1]:             ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/asg-wizard-1.png
[img-asg-increase-policy]:      ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/group-size-increase.png
[img-asg-decrease-policy]:      ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/group-size-decrease.png
[img-alarm-example]:            ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/alarm-example.png
[img-check-asg-in-cloud]:       ../../../images/cloud-node-status.png

[anchor-lt]:    #1-creating-a-launch-template
[anchor-asg]:   #2-creating-an-auto-scaling-group

#   Filtreleme düğümü otomatik ölçeklendirmesini ayarlama

!!! info "Gerekli haklar"
    Otomatik ölçeklendirmeyi ayarlamadan önce, Amazon AWS hesabınızın aşağıdaki haklardan birine sahip olduğunu kontrol edin:
    
    *   `AutoScalingFullAccess`
    *   `AutoScalingConsoleFullAccess`

Filtreleme düğümü otomatik ölçeklendirmesini ayarlamak için aşağıdaki adımları izleyin:
1.  [Bir Başlangıç Şablonu Oluşturma][anchor-lt]
2.  [Bir Otomatik Ölçeklendirme Grubu Oluşturma][anchor-asg]

##  1.  Bir Başlangıç Şablonu Oluşturma

Bir Başlangıç Şablonu, bir Amazon Makine İmajı (AMI) dağıtımı sırasında kullanılacak örneğin türünü tanımlar ve genel sanal makine parametrelerinin bazılarını ayarlar.

Aşağıdaki adımları izleyerek bir Başlangıç Şablonu oluşturun:

1.  Amazon EC2 kontrol panelinde **Başlangıç Şablonları** sekmesine gidin ve **Başlangıç şablonu oluştur** düğmesine tıklayın.

2.  Şablon adını **Başlangıç şablonu adı** alanına girin.

3.  [Daha önce oluşturulmuş][link-doc-ami-creation] Amazon Machine Image'ı seçin. Bunu yapmak için **AMI için ara** bağlantısını tıklayın ve **Benim AMI'larım** kataloğundan gereken imajı seçin.

4.  **Örnek türü** listesinden bir filtreleme düğümü sanal makinesini başlatmak için kullanılacak örneğin türünü seçin.

    !!! warning "Doğru örnek türünü seçin"
        İlk olarak filtre düğümünü yapılandırırken kullandığınız örnek türünü veya daha güçlü bir türü seçin.
        
        Daha az güçlü bir örnek türünün kullanılması filtreleme düğümünün çalışmasında sorunlara yol açabilir.

5.  Filtreleme düğümüne erişmek için [daha önce oluşturulmuş][link-ssh-keys-guide] SSH anahtarları çiftinin adını **Anahtar çifti adı** listesinden seçin.

6.  **Güvenlik Grupları** listesinden [daha önce oluşturulmuş][link-security-group-guide] Güvenlik Grubunu seçin.

7.  **Başlangıç şablonu oluştur** düğmesine tıklayın.

    ![Bir Başlangıç Şablonu Oluşturma][img-create-lt-wizard]
    
Şablon oluşturma işlemi tamamlanana kadar bekleyin.

Başlangıç Şablonunu oluşturduktan sonra, bir Otomatik Ölçeklendirme Grubunun oluşturulmasıyla devam edebilirsiniz.

##  2.  Bir Otomatik Ölçeklendirme Grubu Oluşturma

!!! info "Otomatik ölçeklendirme yöntemini seçme"
    Bu bölüm, EC2 Otomatik Ölçeklendirme yöntemini kullanarak bir Otomatik Ölçeklendirme Grubu oluşturma sürecini açıklar. 

    Ayrıca AWS Otomatik Ölçeklendirme yöntemini de kullanabilirsiniz. 

    Amazon'dan otomatik ölçeklendirme yöntemleri hakkında ayrıntılı bir SSS'yi görmek için bu [bağlantıya][link-doc-as-faq] gidin.

Bir Otomatik Ölçeklendirme Grubu oluşturmak için aşağıdaki adımları izleyin:

1.  Amazon EC2 kontrol panelinde **Otomatik Ölçeklendirme Grupları** sekmesine gidin ve **Otomatik Ölçeklendirme Grubu Oluştur** düğmesine tıklayın.

2.  **Başlangıç Şablonu** seçeneğini seçin, ardından listeden [daha önce oluşturulmuş][anchor-lt] Başlangıç Şablonunu seçin ve **Sonraki Adım** düğmesine tıklayın. 

    ![Bir Otomatik Ölçeklendirme Grubu Oluşturma][img-create-asg-wizard]
    
3.  **Grup adı** alanına istenen Otomatik Ölçeklendirme Grubunun adını girin.

4.  **Başlangıç Şablonu Sürümü** listesinden **En son** Başlangıç Şablonu sürümünü seçin.

5.  Otomatik Ölçeklendirme Grubu için gereken örnek türünü seçin, bir **Fleet Oluşumu** seçeneklerinden birini seçin.

    Başlangıç Şablonu oluştururken bu kılavuzu izlediyseniz ve sanal makinelerin lansmanı için belirli bir örnek türü belirttiyseniz, **Başlangıç şablonunu takip et** seçeneğini kullanabilirsiniz.
    
    !!! info "Doğru örnek türünü seçin"
        Başlangıç Şablonunuzda örnek türü belirtilmemişse veya otomatik ölçeklendirme için çok sayıda farklı örnek türü seçmek isterseniz, **Satın alma seçeneklerini ve örneklere ayarla** seçeneğini de seçebilirsiniz.
        
        İlk olarak filtre düğümünü yapılandırırken kullandığınız aynı örnek türünü veya daha güçlü bir türü seçin. Daha az güçlü bir örnek türünün kullanılması filtreleme düğümünün işleminde sorunlara yol açabilir.

6.  İlk Otomatik Ölçeklendirme Grubu boyutunu **Grup boyutu** alanına girin (örneğin, iki örnek).

7.  **Ağ** açılır listesinden doğru VPC'yi seçin.

8.  **Subnets** açılır listesinden doğru subnetleri seçin.

    !!! warning "Filtreleme düğümüne internet bağlantısı sağlama"
        Filtreleme düğümü, düzgün bir operasyon için Wallarm API sunucusuna erişim gerektirir. Wallarm Bulutunu hangi parça kullandığınıza bağlı olarak Wallarm API sunucusu seçilir:
        
        *  US Cloud'u kullanıyorsanız, düğümünüzün `https://us1.api.wallarm.com` adresine erişim izni olmalıdır.
        *  EU Cloud'u kullanıyorsanız, düğümünüzün `https://api.wallarm.com` adresine erişim izni olmalıdır.

        Doğru VPC ve subnetlerinizi seçtiğinizi ve Filtreleme düğümünün Wallarm API sunucularına erişimini engellemeyecek şekilde bir güvenlik grubunu [yapılandırdığınızdan][link-security-group-guide] emin olun.

    ![Genel Otomatik Ölçeklendirme Grubu ayarları][img-asg-wizard-1]
    
9.  **Ölçekleme politikalarını yapılandır** sayfasına gidin, **Sonraki: Ölçekleme politikalarını yapılandır** düğmesine tıklayın.

10. Otomatik ölçeklendirmeyi etkinleştirmek için **Bu grubun kapasitesini ayarlamak için ölçeklendirme politikalarını kullanın** seçeneğini seçin.

11. Minimum ve maksimum Otomatik Ölçeklendirme Grubu boyutunu girin.

    !!! info "Otomatik Ölçeklendirme Grubu boyutu"
        Minimum Otomatik Ölçeklendirme Grubu boyutu, altıncı adımda belirtilen ilk grup boyutundan daha az olabilir.
    
12. Adım-adım politika yapılandırma modunu etkinleştir, **Ölçeklendirme Otomatik Ölçeklendirme grubunu adım veya basit ölçeklendirme politikalarını kullanarak ölçeklendirme** seçeneğini seçin.

13. **Grup Boyutunu Artırma** parametre grubunu kullanarak grup boyutu artış politikasını yapılandırın.

    ![Otomatik Ölçeklendirme Grubu boyutu artırma politikası][img-asg-increase-policy]
    
    1.  Gerekirse, **Ad** parametresini kullanarak grup boyutu artış politikası adını belirtin.

    2.  Grup boyutunun artmasını tetikleyecek olayı **Şu olayda politika uygula**'dan seçin. Daha önce herhangi bir olay oluşturmadıysanız, bir olay oluşturmak için **Alarm Ekle** düğmesine tıklayın.

    3.  Bir olay adı, izlenecek bir metrik ve olay oluşumları hakkında bildirimler ayarlayabilirsiniz.
    
        !!! info "Bildirimleri yapılandırma için gerekli roller"
            Bildirimleri yapılandırmak için Amazon AWS hesabınızın **AutoScalingNotificationAccessRole**'a ihtiyacı vardır.
        
        !!! info "Örnek"
            Örneğin **Yüksek CPU Kullanımı** adlı bir olayın, ortalama işlemci yükünün% 60'a ulaştığı durumda tetiklenmesini ayarlayabilirsiniz:
            
            ![Bir alarm örneği][img-alarm-example]
        
        
        
        !!! info "Amazon bulutunun mevcut standart metrikleri"
            *   CPU Kullanımı (yüzde olarak)
            *   Disk Okuma (bayt olarak)
            *   Disk Yazma (bayt olarak)
            *   Disk Okuma İşlemleri sayısı  
            *   Disk Yazma İşlemleri sayısı 
            *   Network Girişi (bayt olarak) 
            *   Network Çıkışı (bayt olarak)

    4.  Bir olay oluşturmak için **Alarm Oluştur** düğmesine tıklayın.
    
    5.  **Yüksek CPU Kullanımı** olayı tetiklendiğinde alınacak eylemi seçin. Örneğin, bir olay tetiklendiğinde otomatik ölçekleme politikasının (kullanarak **Ekle** eylemi) bir örnek eklemesini yapılandırabilirsiniz.
    
    6.  Yeni bir örneğin eklenmesinden sonra kaynak tüketimi atlamaları erken tetiklenirse, bu durumdan kaçınmak için **Örneklere `X` saniye ısınma süresi ihtiyacı vardır** parametresini kullanarak saniye cinsinden bir ısınma süresi ayarlayabilirsiniz. Bu süre zarfında hiçbir olay tetiklenmez.
    
14. Aynı şekilde, grup boyutu azalma politikasını **Grup Boyutunu Azalt** parametre grubunu kullanarak yapılandırın.

    ![Grup boyutu azalma politikası][img-asg-decrease-policy]
    
15. Gerekirse Otomatik Ölçeklendirme Grubu için bildirimleri ve etiketleri yapılandırın veya değişikliklerin incelemesine geçin, **Review** düğmesine tıklayın.

16. Tüm parametrelerin doğru bir şekilde belirtildiğinden emin olun, ardından Otomatik Ölçeklendirme Grubu oluşturma sürecini, **Otomatik Ölçeklendirme grubu oluştur** düğmesine tıklayarak başlatın.

Belirtilen sayıda örnek, Otomatik Ölçeklendirme Grubunun başarılı bir şekilde oluşturulmasının ardından otomatik olarak başlatılır.

Otomatik Ölçeklendirme Grubunun düzgün bir şekilde oluşturulduğunu, grubun başlatılan örneklere sayısına bakarak ve bu verileri Wallarm Bulutuna bağlı filtreleme düğümleri sayısıyla karşılaştırarak kontrol edebilirsiniz.

Bunu Wallarm Konsolu kullanarak yapabilirsiniz. Örneğin, eş zamanlı olarak çalışan iki örneğiniz varsa, Wallarm Konsolu bu numarayı ilgili Wallarm düğümü için **Düğümler** bölümünde gösterir.

![Otomatik Ölçeklendirme Grubu durumunun kontrol edilmesi][img-check-asg-in-cloud]

Artık [yükleme paylaştırıcısının yaratılması ve yapılandırılması][link-doc-lb-guide] ile ilerleyebilirsiniz.