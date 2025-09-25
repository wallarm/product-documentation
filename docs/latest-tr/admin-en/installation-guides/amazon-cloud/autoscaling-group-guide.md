[link-doc-ami-creation]:        create-image.md
[link-doc-lb-guide]:            load-balancing-guide.md
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

#   Filtreleme düğümü otomatik ölçeklendirmesini yapılandırma

!!! info "Gerekli yetkiler"
    Otomatik ölçeklendirmeyi yapılandırmadan önce, Amazon AWS hesabınıza aşağıdaki yetkilerden birinin verildiğinden emin olun:
    
    *   `AutoScalingFullAccess`
    *   `AutoScalingConsoleFullAccess`

Filtreleme düğümü otomatik ölçeklendirmesini kurmak için aşağıdaki adımları izleyin:
1.  [Bir Launch Template oluşturma][anchor-lt]
2.  [Bir Auto Scaling Group oluşturma][anchor-asg]

##  1.  Bir Launch Template oluşturma

Bir Launch Template, bir Amazon Machine Image (AMI) dağıtımı sırasında kullanılacak instance türünü tanımlar ve bazı genel sanal makine parametrelerini ayarlar.

Aşağıdaki adımları uygulayarak bir Launch Template oluşturun:

1.  Amazon EC2 panosunda **Launch Templates** sekmesine gidin ve **Create launch template** düğmesine tıklayın.

2.  Şablon adını **Launch template name** alanına girin.

3.  [önceden oluşturduğunuz][link-doc-ami-creation] Amazon Machine Image'ı seçin. Bunu yapmak için **Search for AMI** bağlantısına tıklayın ve **My AMIs** kataloğundan gerekli imajı seçin.

4.  Filtreleme düğümü sanal makinesini başlatmak için kullanılacak instance türünü **Instance type** listesinden seçin.

    !!! warning "Doğru instance türünü seçin"
        Filtreleme düğümünü ilk yapılandırırken kullandığınız instance türüyle aynı ya da daha güçlü bir tür seçin.
        
        Daha az güçlü bir instance türü kullanmak, filtreleme düğümünün çalışmasında sorunlara yol açabilir. 

5.  Filtreleme düğümüne erişmek için önceden oluşturduğunuz SSH anahtar çifti adını **Key pair name** listesinden seçin.

6.  Önceden oluşturduğunuz Security Group'u **Security Groups** listesinden seçin.

7.  **Create launch template** düğmesine tıklayın.

    ![Bir Launch Template oluşturma][img-create-lt-wizard]
    
Şablon oluşturma işlemi tamamlanana kadar bekleyin.

Launch Template'i oluşturduktan sonra, bir Auto Scaling Group oluşturma işlemine geçebilirsiniz.

##  2.  Bir Auto Scaling Group oluşturma

!!! info "Otomatik ölçeklendirme yöntemi seçimi"
    Bu bölüm, EC2 Auto Scaling yöntemi kullanılarak bir Auto Scaling Group oluşturma sürecini açıklar. 

    AWS Auto Scaling yöntemini de kullanabilirsiniz. 

    Amazon’un otomatik ölçeklendirme yöntemlerine ilişkin ayrıntılı SSS için bu [bağlantıya][link-doc-as-faq] gidin.

Bir Auto Scaling Group oluşturmak için aşağıdaki adımları izleyin:

1.  Amazon EC2 panosunda **Auto Scaling Groups** sekmesine gidin ve **Create Auto Scaling Group** düğmesine tıklayın.

2.  **Launch Template** seçeneğini belirleyin, ardından listeden [önceden oluşturduğunuz][anchor-lt] Launch Template'i seçin ve **Next Step** düğmesine tıklayın. 

    ![Bir Auto Scaling Group oluşturma][img-create-asg-wizard]
    
3.  İstediğiniz Auto Scaling Group adını **Group name** alanına girin.

4.  **Launch Template Version** listesinden Launch Template'in **Latest** sürümünü seçin.

5.  **Fleet Composition** seçeneklerinden birini seçerek Auto Scaling Group için gerekli instance türünü belirleyin.

    Bu kılavuzu Launch Template oluştururken izlediyseniz ve sanal makinelerin başlatılacağı instance türünü belirlediyseniz, **Adhere to the launch template** seçeneğini kullanabilirsiniz.
    
    !!! info "Doğru instance türünü seçin"
        Launch Template'inizde bir instance türü belirtilmemişse veya otomatik ölçeklendirme için birden çok farklı instance türü seçmek istiyorsanız **Combine purchase options and instances** seçeneğini de belirleyebilirsiniz.
        
        Filtreleme düğümünü ilk yapılandırırken kullandığınız instance türüyle aynı ya da daha güçlü bir tür seçin. Daha az güçlü bir instance türü kullanmak, filtreleme düğümünün çalışmasında sorunlara yol açabilir.

6.  Başlangıç Auto Scaling Group boyutunu **Group size** alanına girin (örn., iki instance).

7.  **Network** açılır listesinden doğru VPC'yi seçin.

8.  **Subnets** açılır listesinden doğru alt ağları (subnet) seçin.

    !!! warning "Filtreleme düğümüne internet bağlantısı sağlayın"
        Filtreleme düğümünün düzgün çalışması için Wallarm API server'a erişmesi gerekir. Kullanmakta olduğunuz Wallarm Cloud'a bağlı olarak Wallarm API server seçimi değişir:
        
        * US Cloud kullanıyorsanız, düğümünüzün `https://us1.api.wallarm.com` adresine erişimi olmalıdır.
        * EU Cloud kullanıyorsanız, düğümünüzün `https://api.wallarm.com` adresine erişimi olmalıdır.

        Doğru VPC ve alt ağları seçtiğinizden ve filtreleme düğümünün Wallarm API server'lara erişimini engellemeyecek şekilde bir security group yapılandırdığınızdan emin olun.

    ![Genel Auto Scaling Group ayarları][img-asg-wizard-1]
    
9.  **Next: Configure scaling policies** düğmesine tıklayarak **Configure scaling policies** sayfasına gidin.

10. Otomatik ölçeklendirmeyi etkinleştirmek için **Use scaling policies to adjust the capacity of this group** seçeneğini belirleyin.

11. Minimum ve maksimum Auto Scaling Group boyutunu girin.

    !!! info "Auto Scaling Group boyutu"
        Altıncı adımda belirtilen başlangıç grup boyutundan minimum Auto Scaling Group boyutunun daha küçük olabileceğini unutmayın.
    
12. **Scale the Auto Scaling group using step or simple scaling policies** seçeneğini belirleyerek adım adım politika yapılandırma modunu etkinleştirin.

13. **Increase Group Size** parametre grubunu kullanarak grup boyutunu artırma politikasını yapılandırın.

    ![Auto Scaling Group boyut artırma politikası][img-asg-increase-policy]
    
    1.  Gerekirse, **Name** parametresini kullanarak grup boyutu artırma politikası adını belirtin.

    2.  Grup boyutunun artırılmasını tetikleyecek olayı belirtmek için **Execute policy when** listesinden olayı seçin. Daha önce herhangi bir olay oluşturmadıysanız, bir olay oluşturmak için **Add Alarm** düğmesine tıklayın.

    3.  Bir olay adı, izlenecek bir metrik ve olay oluşumlarına ilişkin bildirimler ayarlayabilirsiniz.
    
        !!! info "Bildirimleri yapılandırmak için gereken roller"
            Bildirim yapılandırması için Amazon AWS hesabınızda **AutoScalingNotificationAccessRole** bulunmalıdır.
        
        !!! info "Örnek"
            Beş dakika içinde ortalama işlemci yükü yüzde 60’a ulaştığında **High CPU utilization** adlı bir olayın tetiklenmesini ayarlayabilirsiniz:
            
            ![Bir alarm örneği][img-alarm-example]
        
        
        
        !!! info "Amazon bulutunun mevcut standart metrikleri"
            *   CPU Utilization (yüzde olarak)
            *   Disk Reads (bayt cinsinden)
            *   Disk Writes (bayt cinsinden)
            *   Disk Read Operations sayısı  
            *   Disk Write Operations sayısı 
            *   Network In (bayt cinsinden) 
            *   Network Out (bayt cinsinden)

    4.  Bir olay oluşturmak için **Create Alarm** düğmesine tıklayın.
    
    5.  **High CPU Utilization** olayı tetiklendiğinde gerçekleştirilecek işlemi seçin. Örneğin, olay tetiklendiğinde bir instance eklemek için **Add** eylemini kullanan bir otomatik ölçeklendirme politikası yapılandırabilirsiniz.
    
    6.  Yeni bir instance eklendikten sonra kaynak tüketiminde sıçramalar olursa olay erken tetiklenebilir. Bunu önlemek için **Instances need `X` seconds to warm up** parametresini kullanarak saniye cinsinden bir ısınma süresi (warm-up) belirleyebilirsiniz. Bu süre boyunca olay tetiklenmez.
    
14. Benzer şekilde, grup boyutunu azaltma politikasını yapılandırmak için **Decrease Group Size** parametre grubunu kullanın.

    ![Grup boyutu azaltma politikası][img-asg-decrease-policy]
    
15. Gerekirse, Auto Scaling Group için bildirimleri ve etiketleri (tags) yapılandırın veya **Review** düğmesine tıklayarak değişikliklerin gözden geçirilmesine geçin.

16. Tüm parametrelerin doğru belirtildiğinden emin olun ve ardından **Create Auto Scaling group** düğmesine tıklayarak Auto Scaling Group oluşturma işlemini başlatın.

Auto Scaling Group başarıyla oluşturulduktan sonra belirtilen sayıda instance otomatik olarak başlatılacaktır.

Auto Scaling Group'un doğru oluşturulduğunu, grupta başlatılan instance sayısını görüntüleyip bu veriyi Wallarm Cloud'a bağlı filtreleme düğümü sayısıyla karşılaştırarak doğrulayabilirsiniz.

Bunu Wallarm Console kullanarak yapabilirsiniz. Örneğin, aynı anda iki filtreleme düğümlü instance çalışıyorsa, Wallarm Console ilgili Wallarm düğümü için **Nodes** bölümünde bu sayıyı gösterecektir.

![Auto Scaling Group durumunu kontrol etme][img-check-asg-in-cloud]

Artık bir yük dengeleyicinin [oluşturma ve yapılandırma][link-doc-lb-guide] adımlarına geçebilirsiniz.