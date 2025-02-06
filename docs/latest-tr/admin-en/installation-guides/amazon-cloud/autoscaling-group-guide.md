# Filtreleme Düğümü Otomatik Ölçeklendirme Ayarlama

!!! info "Gerekli Yetkiler"
    Otomatik ölçeklendirmeyi ayarlamadan önce, Amazon AWS hesabınızın aşağıdaki yetkilerden birine sahip olduğundan emin olun:
    
    *   `AutoScalingFullAccess`
    *   `AutoScalingConsoleFullAccess`

Filtreleme düğümü otomatik ölçeklendirmesini ayarlamak için aşağıdaki adımları izleyin:
1.  [Başlatma Şablonu Oluşturma][anchor-lt]
2.  [Otomatik Ölçeklendirme Grubu Oluşturma][anchor-asg]

## 1. Başlatma Şablonu Oluşturma

Bir Başlatma Şablonu, bir Amazon Machine Image (AMI) dağıtımı sırasında kullanılacak örnek tipini tanımlar ve bazı genel sanal makine parametrelerini ayarlar.

Bir Başlatma Şablonu oluşturmak için aşağıdaki adımları izleyin:

1.  Amazon EC2 kontrol panelindeki **Launch Templates** sekmesine gidin ve **Create launch template** butonuna tıklayın.

2.  **Launch template name** alanına şablon adını girin.

3.  [Önceden oluşturulmuş][link-doc-ami-creation] Amazon Machine Image’i seçin. Bunu yapmak için **Search for AMI** bağlantısına tıklayın ve **My AMIs** kataloğundan gerekli resmi seçin.

4.  **Instance type** listesinden, filtreleme düğümü sanal makinesini başlatmak için kullanılacak örnek tipini seçin.

    !!! warning "Uygun Örnek Tipini Seçin"
        Filtreleme düğümünü ilk yapılandırdığınızda kullandığınız veya daha güçlü bir örnek tipini seçin.
        
        Daha az güçlü bir örnek tipi, filtreleme düğümü çalışmasında sorunlara yol açabilir. 

5.  **Key pair name** listesinden, filtreleme düğümüne erişim için [önceden oluşturulmuş][link-ssh-keys-guide] SSH anahtar çifti adını seçin.

6.  **Security Groups** listesinden [önceden oluşturulmuş][link-security-group-guide] Güvenlik Grubunu seçin.

7.  **Create launch template** butonuna tıklayın.

    ![Creating a Launch Template][img-create-lt-wizard]
    
Şablon oluşturma işlemi tamamlanana kadar bekleyin.

Başlatma Şablonunu oluşturduktan sonra, Otomatik Ölçeklendirme Grubu oluşturma işlemine devam edebilirsiniz.

## 2. Otomatik Ölçeklendirme Grubu Oluşturma

!!! info "Otomatik Ölçeklendirme Yöntemi Seçimi"
    Bu bölüm, EC2 Otomatik Ölçeklendirme yöntemi kullanılarak bir Otomatik Ölçeklendirme Grubunun oluşturulma sürecini açıklamaktadır. 

    AWS Otomatik Ölçeklendirme yöntemini de kullanabilirsiniz. 

    Amazon’un otomatik ölçeklendirme yöntemleri ile ilgili detaylı SSS’ye bakmak için bu [bağlantıya][link-doc-as-faq] gidin.

Bir Otomatik Ölçeklendirme Grubu oluşturmak için aşağıdaki adımları izleyin:

1.  Amazon EC2 kontrol panelindeki **Auto Scaling Groups** sekmesine gidin ve **Create Auto Scaling Group** butonuna tıklayın.

2.  **Launch Template** seçeneğini seçin, ardından listeden [önceden oluşturulmuş][anchor-lt] Başlatma Şablonunu seçin ve **Next Step** butonuna tıklayın. 

    ![Creating an Auto Scaling Group][img-create-asg-wizard]
    
3.  İstediğiniz Otomatik Ölçeklendirme Grubu adını **Group name** alanına girin.

4.  **Launch Template Version** listesinden Başlatma Şablonunun **Latest** sürümünü seçin.

5.  **Fleet Composition** seçeneklerinden birini seçerek Otomatik Ölçeklendirme Grubu için gerekli örnek tipini belirleyin.

    Eğer bu kılavuzu izleyerek bir Başlatma Şablonu oluşturduysanız ve sanal makineleri başlatmak için bir örnek tipi belirtildiyse, **Adhere to the launch template** seçeneğini kullanabilirsiniz.
    
    !!! info "Uygun Örnek Tipini Seçin"
        İlk yapılandırmada kullandığınız veya daha güçlü bir örnek tipini seçin. Daha az güçlü bir örnek tipi, filtreleme düğümü çalışmasında sorunlara neden olabilir.

6.  **Group size** alanına başlangıç Otomatik Ölçeklendirme Grubu boyutunu (örneğin, iki örnek) girin.

7.  **Network** açılır listesinden doğru VPC’yi seçin.

8.  **Subnets** açılır listesinden doğru alt ağları seçin.

    !!! warning "Filtreleme Düğümüne İnternet Bağlantısı Sağlayın"
        Filtreleme düğümünün düzgün çalışabilmesi için Wallarm API sunucusuna erişim gereklidir. Wallarm API sunucu seçimi, kullandığınız Wallarm Cloud’a bağlıdır:
        
        * US Cloud kullanıyorsanız, düğümünüzün `https://us1.api.wallarm.com` adresine erişim izni olması gerekir.
        * EU Cloud kullanıyorsanız, düğümünüzün `https://api.wallarm.com` adresine erişim izni olması gerekir.

        Doğru VPC ve alt ağları seçtiğinizden ve filtreleme düğümünün Wallarm API sunucularına erişimini engellemeyecek şekilde [bir güvenlik grubu yapılandırdığınızdan][link-security-group-guide] emin olun.

    ![General Auto Scaling Group settings][img-asg-wizard-1]
    
9.  **Next: Configure scaling policies** butonuna tıklayarak **Configure scaling policies** sayfasına gidin.

10. Otomatik ölçeklendirmeyi etkinleştirmek için **Use scaling policies to adjust the capacity of this group** seçeneğini işaretleyin.

11. Minimum ve maksimum Otomatik Ölçeklendirme Grubu boyutunu girin.

    !!! info "Otomatik Ölçeklendirme Grubu Boyutu"
        Altıncı adımda belirtilen başlangıç grup boyutundan daha düşük bir minimum Otomatik Ölçeklendirme Grubu boyutu belirtebilirsiniz.
    
12. **Scale the Auto Scaling group using step or simple scaling policies** seçeneğini işaretleyerek adım adım politika yapılandırma modunu etkinleştirin.

13. **Increase Group Size** parametre grubunu kullanarak grup boyutu artırma politikasını yapılandırın.

    ![Auto Scaling Group size increase policy][img-asg-increase-policy]
    
    1.  Gerekirse, **Name** parametresini kullanarak grup boyutu artırma politikası adını belirtin.

    2.  **Execute policy when** içerisinden, grup boyutunun artırılmasını tetikleyecek olayı seçin. Daha önce hiçbir olay oluşturmadıysanız, bir olay oluşturmak için **Add Alarm** butonuna tıklayın.

    3.  Bir olay adı, izlenecek metrik ve olay gerçekleştiğinde bildirimin ayarlanması gibi seçenekleri belirleyebilirsiniz.
    
        !!! info "Bildirimleri Yapılandırmak için Gerekli Roller"
            Bildirim yapılandırması için Amazon AWS hesabınızın **AutoScalingNotificationAccessRole** rolüne sahip olması gerekir.
        
        !!! info "Örnek"
            Beş dakika içerisinde %60 ortalama işlemci yüküne ulaşıldığında **High CPU utilization** adlı bir olayın tetiklenmesini ayarlayabilirsiniz:
            
            ![An alarm example][img-alarm-example]
        
        !!! info "Amazon Bulutunun Mevcut Standart Metrikleri"
            *   CPU Utilization (yüzde olarak)
            *   Disk Reads (bayt cinsinden)
            *   Disk Writes (bayt cinsinden)
            *   Disk Read Operations sayısı  
            *   Disk Write Operations sayısı 
            *   Network In (bayt cinsinden) 
            *   Network Out (bayt cinsinden)

    4.  Bir olay oluşturmak için **Create Alarm** butonuna tıklayın.
    
    5.  **High CPU Utilization** olayı tetiklendiğinde alınacak aksiyonu seçin. Örneğin, olay tetiklendiğinde **Add** aksiyonunu kullanarak bir örnek eklemek üzere bir otomatik ölçeklendirme politikası yapılandırabilirsiniz.
    
    6.  Yeni bir örnek eklendikten sonra kaynak tüketiminde ani artışlar olursa, olay erken tetiklenebilir. Bunu önlemek için, **Instances need `X` seconds to warm up** parametresini kullanarak saniye cinsinden bir ısınma süresi ayarlayabilirsiniz. Bu süre zarfında hiçbir olay tetiklenmeyecektir.
    
14. Benzer şekilde, **Decrease Group Size** parametre grubunu kullanarak grup boyutu azaltma politikasını yapılandırın.

    ![Group size decrease policy][img-asg-decrease-policy]
    
15. Gerekirse, Otomatik Ölçeklendirme Grubu için bildirimleri ve etiketleri yapılandırın veya **Review** butonuna tıklayarak değişiklikleri gözden geçirin.

16. Tüm parametrelerin doğru belirtildiğinden emin olduktan sonra, **Create Auto Scaling group** butonuna tıklayarak Otomatik Ölçeklendirme Grubu oluşturma işlemini başlatın.

Belirtilen sayıda örnek, Otomatik Ölçeklendirme Grubu başarıyla oluşturulduktan sonra otomatik olarak başlatılacaktır.

Otomatik Ölçeklendirme Grubunun doğru oluşturulduğunu, gruptaki başlatılan örnek sayısını görüntüleyip bu veriyi Wallarm Cloud’a bağlı filtreleme düğümleri sayısıyla karşılaştırarak kontrol edebilirsiniz.

Bunu Wallarm Console kullanarak yapabilirsiniz. Örneğin, iki filtreleme düğümüne sahip örnek eşzamanlı çalışıyorsa, Wallarm Console ilgili Wallarm düğümü için **Nodes** bölümünde bu sayıyı gösterecektir.

![Checking the Auto Scaling Group status][img-check-asg-in-cloud]

Artık bir yük dengeleyicinin [oluşturulması ve yapılandırılması][link-doc-lb-guide] işlemine geçebilirsiniz.