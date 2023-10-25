# GCP'de bir filtreleme düğümü örneği şablonu oluşturma

[img-creating-template]:                ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]:                  ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]:                  create-image.md
[link-creating-instance-group]:         creating-autoscaling-group.md

Bir filtreleme düğümü örneği şablonu, yönetilen bir örnek grubu oluştururken daha sonra baz olarak kullanılacaktır. Bir filtreleme düğümü örneği şablonu oluşturmak için aşağıdaki işlemleri yapın:

1.  Menünün **Hesaplama Motoru** bölümündeki **Örnek Şablonları** sayfasına gidin ve **Örnek Şablonu Oluştur** düğmesine tıklayın.

    ![Bir örnek şablonu oluşturma][img-creating-template]
    
2.  **Ad** alanına şablon adını girin.
3.  **Makine türü** alanından, filtreleme düğümü ile birlikte bir sanal makine başlatmak için kullanılacak sanal makine türünü seçin. 

    !!! warning "Doğru örneğin türünü seçin"
        İlk olarak filtreleme düğümünü yapılandırdığınızda kullandığınız örnekle aynı türü (veya daha güçlü olanını) seçin.
        
        Daha az güçlü bir örnek türü kullanmanız filtreleme düğümünün işleyişinde sorunlara yol açabilir.

4.  **Önyükleme diski** ayarımdaki **Değiştir** düğmesine tıklayın. Açılan pencerede, **Özel resimler** sekmesine gidin ve **Göster hakkindaki resimlerden** açılır listesinden sanal makine resminizi oluşturduğunuz projenin adını seçin. Projenin kullanılabilir resimler listesinden [daha önce oluşturulan resmi][link-creating-image] seçin ve **Seç** düğmesine tıklayın.

    ![Bir resmi seçme][img-selecting-image]
    
5.  Şablon temelli örnekların temel örnekle aynı olması için, kalan tüm parametreleri, [temel örneğinizi oluştururken][link-creating-image] parametreleri yapılandırdığınız gibi aynı şekilde yapılandırın.
    
    !!! info "Güvenlik duvarını yapılandırma"
        Güvenlik duvarının oluşturulan şablona HTTP trafiğini engellemediğinden emin olun. HTTP trafiğini etkinleştirmek için **HTTP Trafiğine İzin Ver** kutusunu işaretleyin.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6.  **Oluştur** düğmesine tıklayın ve şablon oluşturma işleminin tamamlanmasını bekleyin. 

Örnek şablonu oluşturduktan sonra, otomatik ölçeklendirmenin etkinleştirildiği bir [yönetilen örnek grubunun oluşturulması][link-creating-instance-group] ile devam edebilirsiniz.
