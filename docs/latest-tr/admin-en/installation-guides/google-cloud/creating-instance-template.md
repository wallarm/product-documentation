# GCP üzerinde filtreleme düğümü için instance şablonu oluşturma

[img-creating-template]:                ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]:                  ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]:                  create-image.md
[link-creating-instance-group]:         creating-autoscaling-group.md

Filtreleme düğümü instance şablonu, yönetilen bir instance grubu oluşturulurken temel olarak kullanılacaktır. Filtreleme düğümü instance şablonu oluşturmak için aşağıdakileri uygulayın:

1.  Menünün **Compute Engine** bölümündeki **Instance templates** sayfasına gidin ve **Create instance template** düğmesine tıklayın.
    
    ![Instance şablonu oluşturma][img-creating-template]
    
2.  **Name** alanına şablon adını girin.
3.  **Machine type** alanından filtreleme düğümü ile başlatılacak sanal makine için kullanılacak sanal makine türünü seçin. 

    !!! warning "Uygun instance türünü seçin"
        Filtreleme düğümünü ilk yapılandırırken kullandığınızla aynı instance türünü (veya daha güçlü birini) seçin.
        
        Daha az güçlü bir instance türü kullanmak, filtreleme düğümünün çalışmasında sorunlara yol açabilir.

4.  **Boot disk** ayarında **Change** düğmesine tıklayın. Açılan pencerede **Custom images** sekmesine gidin ve **Show images from** açılır listesinden sanal makine imajınızı oluşturduğunuz projenin adını seçin. Projenin mevcut imajları listesinden [önceden oluşturulan imajı][link-creating-image] seçin ve **Select** düğmesine tıklayın.

    ![Bir imaj seçme][img-selecting-image]
    
5.  Bu şablona dayalı instance'ların temel instance ile aynı olması için, kalan tüm parametreleri temel instance'ınızı [oluştururken][link-creating-image] parametreleri nasıl yapılandırdıysanız aynı şekilde yapılandırın.
    
    !!! info "Güvenlik duvarını yapılandırma"
        Güvenlik duvarının oluşturulan şablona yönelik HTTP trafiğini engellemediğinden emin olun. HTTP trafiğini etkinleştirmek için **Allow HTTP traffic** onay kutusunu seçin.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6.  **Create** düğmesine tıklayın ve şablon oluşturma işlemi tamamlanana kadar bekleyin. 

Instance şablonunu oluşturduktan sonra, otomatik ölçeklendirme etkinleştirilmiş olarak [yönetilen bir instance grubu oluşturma][link-creating-instance-group] adımına geçebilirsiniz.