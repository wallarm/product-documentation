[link-docs-aws-autoscaling]:        autoscaling-group-guide.md
[link-docs-aws-node-setup]:         ../../../installation/cloud-platforms/aws/ami.md
[link-cloud-connect-guide]:         ../../../installation/inline/compute-instances/aws/aws-ami.md#4-connect-the-instance-to-the-wallarm-cloud
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md#node-registers-attacks
[img-launch-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]:      ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]:  #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]:   #2-creating-an-amazon-machine-image

#   Wallarm filtreleme düğümü ile bir AMI oluşturma

Amazon bulutunda dağıtılmış Wallarm filtreleme düğümleri için otomatik ölçeklendirme ayarlayabilirsiniz. Bu işlev, önceden hazırlanmış sanal makine görüntüleri gerektirir.

Bu belge, Wallarm filtreleme düğümü yüklü bir AMI hazırlama prosedürünü açıklar. Filtreleme düğümünün otomatik ölçeklendirmesini ayarlamak için AMI gereklidir. Otomatik ölçeklendirmeyi ayarlama hakkında ayrıntılı bilgi için bu [bağlantıya][link-docs-aws-autoscaling] gidin.

Wallarm filtreleme düğümü içeren bir AMI oluşturmak için aşağıdaki işlemleri gerçekleştirin:

1.  [Amazon bulutunda filtreleme düğümü örneğini oluşturma ve yapılandırma][anchor-node]
2.  [Yapılandırılmış filtreleme düğümü örneğini temel alan bir AMI oluşturma][anchor-ami]


##  1.  Amazon Bulutunda Wallarm filtreleme düğümü örneğini oluşturma ve yapılandırma

Bir AMI oluşturmadan önce tek bir Wallarm filtreleme düğümünün başlangıç yapılandırmasını yapmanız gerekir. Bir filtreleme düğümünü yapılandırmak için şunları yapın:

1.  [Amazon bulutunda bir filtreleme düğümü örneği oluşturun][link-docs-aws-node-setup].
    
    !!! warning "Özel SSH anahtarı"
        Filtreleme düğümüne bağlanmak için daha önce oluşturduğunuz (PEM formatında saklanan) özel SSH anahtarına erişiminiz olduğundan emin olun.

    !!! warning "Filtreleme düğümüne internet bağlantısı sağlayın"
        Filtreleme düğümünün düzgün çalışması için Wallarm API server'a erişim gerekir. Kullanmanız gereken Wallarm API server, kullandığınız Wallarm Cloud'a bağlıdır:
        
        *   US Cloud kullanıyorsanız, düğümünüze `https://us1.api.wallarm.com` adresine erişim izni verilmelidir.
        *   EU Cloud kullanıyorsanız, düğümünüze `https://api.wallarm.com` adresine erişim izni verilmelidir.
        
    Doğru VPC ve alt ağları seçtiğinizden ve güvenlik grubunu, filtreleme düğümünün Wallarm API server'lara erişmesini engellemeyecek şekilde yapılandırdığınızdan emin olun.

2.  [Filtreleme düğümünü Wallarm Cloud'a bağlayın][link-cloud-connect-guide].

    !!! warning "Wallarm Cloud'a bağlanmak için bir token kullanın"
        Filtreleme düğümünü Wallarm Cloud'a bir token kullanarak bağlamanız gerektiğini lütfen unutmayın. Birden fazla filtreleme düğümünün Wallarm Cloud'a aynı token ile bağlanmasına izin verilir. 
        
        Böylece filtreleme düğümleri otomatik olarak ölçeklendirildiğinde, her bir filtreleme düğümünü Wallarm Cloud'a elle bağlamanız gerekmez.

3.  [Filtreleme düğümünü][link-docs-reverse-proxy-setup], uygulamalarınız ve API'leriniz için bir ters proxy olarak çalışacak şekilde yapılandırın.

4.  [Filtreleme düğümünün][link-docs-check-operation] doğru şekilde yapılandırıldığından ve uygulamalarınızı ve API'lerinizi kötü amaçlı isteklere karşı koruduğundan emin olun.

Filtreleme düğümünün yapılandırmasını tamamladıktan sonra, aşağıdaki adımları izleyerek sanal makineyi kapatın:

1.  Amazon EC2 panosunda **Instances** sekmesine gidin.
2.  Yapılandırdığınız filtreleme düğümü örneğini seçin.
3.  **Actions** açılır menüsünden önce **Instance State**, ardından **Stop** öğesini seçin.

!!! info "`poweroff` komutuyla kapatma"
    Ayrıca SSH protokolü aracılığıyla bağlanıp aşağıdaki komutu çalıştırarak sanal makineyi kapatabilirsiniz:
    
    ``` bash
    poweroff
    ```

##  2.  Bir Amazon Machine Image oluşturma

Artık yapılandırılmış filtreleme düğümü örneğine dayalı bir sanal makine görüntüsü oluşturabilirsiniz. Bir görüntü oluşturmak için aşağıdaki adımları izleyin:

1.  Amazon EC2 panosunda **Instances** sekmesine gidin.
2.  Yapılandırdığınız filtreleme düğümü örneğini seçin.
3.  **Actions** açılır menüsünden **Image** ve ardından **Create Image** öğelerini seçerek görüntü oluşturma sihirbazını başlatın.

    ![AMI oluşturma sihirbazını başlatma][img-launch-ami-wizard]
    
4.  **Create Image** formu görüntülenecektir. **Image name** alanına görüntü adını girin. Kalan alanları değiştirmeden bırakabilirsiniz.

    ![AMI oluşturma sihirbazında parametreleri yapılandırma][img-config-ami-wizard]
    
5.  Sanal makine görüntüsü oluşturma sürecini başlatmak için **Create Image** düğmesini tıklayın.
    
    Görüntü oluşturma süreci tamamlandığında ilgili mesaj görüntülenir. Görüntünün başarıyla oluşturulduğunu ve durumunun **Available** olduğunu doğrulamak için Amazon EC2 panosunda **AMIs** sekmesine gidin.
    
    ![Oluşturulan AMI'yi inceleme][img-explore-created-ami]

!!! info "Görüntü görünürlüğü"
    Hazırlanan görüntü uygulamanıza özgü ayarları ve Wallarm token'ını içerdiğinden, görüntü görünürlüğü ayarını değiştirip herkese açık yapmanız önerilmez (varsayılan olarak AMI'ler **Private** görünürlük ayarıyla oluşturulur).

Artık hazırlanan görüntüyü kullanarak Amazon bulutunda Wallarm filtreleme düğümlerinin otomatik ölçeklendirmesini [ayarlayabilirsiniz][link-docs-aws-autoscaling].