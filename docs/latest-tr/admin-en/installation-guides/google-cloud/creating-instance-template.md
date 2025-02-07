# GCP'de Filtreleme Düğümü Örnek Şablonu Oluşturma

[img-creating-template]:                ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]:                  ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]:                  create-image.md
[link-creating-instance-group]:         creating-autoscaling-group.md

Filtreleme düğümü örnek şablonu, daha sonra yönetilen bir örnek grubunu oluştururken temel olarak kullanılacaktır. Filtreleme düğümü örnek şablonunu oluşturmak için aşağıdakileri yapın:

1.  Menünün **Compute Engine** bölümündeki **Instance templates** sayfasına gidin ve **Create instance template** butonuna tıklayın.
    
    ![Creating an instance template][img-creating-template]
    
2.  Şablon adını **Name** alanına girin.
3.  Filtreleme düğümü ile sanal makine başlatmak için kullanılacak sanal makine türünü **Machine type** alanından seçin. 

    !!! warning "Doğru örnek türünü seçin"
        Başlangıçta filtreleme düğümünü yapılandırırken kullandığınızla aynı (ya da daha güçlü) örnek türünü seçin.
        
        Daha az güçlü bir örnek türü kullanmak, filtreleme düğümünün çalışmasında sorunlara yol açabilir.

4.  **Boot disk** ayarında bulunan **Change** butonuna tıklayın. Açılan pencerede, **Custom images** sekmesine gidin ve **Show images from** açılır listesinden sanal makine imajınızı oluşturduğunuz projenin adını seçin. Projedeki mevcut imajlar listesinden [önceden oluşturulmuş imajı][link-creating-image] seçin ve **Select** butonuna tıklayın.

    ![Selecting an image][img-selecting-image]
    
5.  Örnek şablonuna dayalı örneklerin temel örnekle aynı olması için, kalan tüm parametreleri [temel örneğinizi oluşturduğunuz gibi][link-creating-image] yapılandırın.
    
    !!! info "Güvenlik duvarını yapılandırma"
        Oluşturulan şablonun HTTP trafiğini engellemediğinden emin olun. HTTP trafiğini etkinleştirmek için **Allow HTTP traffic** onay kutusunu seçin.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6.  **Create** butonuna tıklayın ve şablon oluşturma işleminin tamamlanmasını bekleyin.

Örnek şablonu oluşturduktan sonra, otomatik ölçeklendirme etkinleştirilmiş [yönetilen bir örnek grubunu][link-creating-instance-group] oluşturmaya devam edebilirsiniz.