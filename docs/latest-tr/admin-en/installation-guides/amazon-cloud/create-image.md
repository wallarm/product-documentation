[link-docs-aws-autoscaling]: autoscaling-group-guide.md
[link-docs-aws-node-setup]: ../../../installation/cloud-platforms/aws/ami.md
[link-ssh-keys-guide]: ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys
[link-security-group-guide]: ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group
[link-cloud-connect-guide]: ../../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]: ../../../installation/cloud-platforms/aws/ami.md#6-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]: ../../installation-check-operation-en.md

[img-launch-ami-wizard]: ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]: ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]: ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]: #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]: #2-creating-an-amazon-machine-image

# Wallarm filtreleme nodu ile AMI oluşturma

Amazon bulutunda konuşlandırılan Wallarm filtreleme düğümleri için otomatik ölçeklendirme ayarlayabilirsiniz. Bu işlev, önceden hazırlanmış sanal makine görüntülerini gerektirir.

Bu belge, Wallarm filtreleme düğümünün yüklendiği bir Amazon Makine Görüntüsü (AMI) hazırlama prosedürünü anlatmaktadır. Filtreleme düğümünün otomatik ölçeklendirme ayarını yapmak için AMI gereklidir. Otomatik ölçeklendirmeyi ayarlama hakkında ayrıntılı bilgi için, bu [bağlantıya][link-docs-aws-autoscaling] ilerleyin.

Wallarm filtreleme düğümü ile bir AMI oluşturmak için aşağıdaki prosedürleri gerçekleştirin:

1.  [Amazon bulutunda filtreleme düğümü örneğini oluşturma ve yapılandırma][anchor-node]
2.  [Yapılandırılmış filtreleme düğümü örneği temelinde bir AMI oluşturma][anchor-ami]


##  1.  Amazon Bulutta Wallarm Filtreleme Düğümü Örneğinin Oluşturulması ve Yapılandırılması

Bir AMI oluşturmadan önce, tek bir Wallarm filtreleme düğümünün başlangıç ​​yapılandırmasını yapmanız gerekir. Bir filtreleme düğümünü yapılandırmak için aşağıdakileri yapın:

1.  Amazon bulutunda bir filtreleme düğümü örneği [oluşturun][link-docs-aws-node-setup]. 
    
    !!! warning "Özel SSH anahtarı"
        Filtreleme düğümüne bağlanmak için daha önce [oluşturduğunuz][link-ssh-keys-guide] (PEM formatında saklanan) özel SSH anahtarına sahip olduğunuzdan emin olun.

    !!! warning "Filtre düğümüne internet bağlantısı sağlayın"
        Filtreleme düğümü, uygun bir işlem için Wallarm API sunucusuna erişim gerektirir. Wallarm API sunucusunun seçimi, kullandığınız Wallarm Buluta bağlıdır:
        
        *   ABD Bulutunu kullanıyorsanız, düğümünüze `https://us1.api.wallarm.com` adresine erişim izni verilmesi gerekir.
        *   EU Bulutunu kullanıyorsanız, düğümünüze `https://api.wallarm.com` adresine erişim izni verilmesi gerekmektedir.
        
    Filtreleme düğümünün Wallarm API sunucularına erişimini engelleme olasılığına karşı doğru VPC ve alt ağları seçtiğinizden ve bir güvenlik grubunu [yapılandırdığınız][link-security-group-guide]dan emin olun.

2.  Filtreleme düğümünü Wallarm Buluta [bağlayın][link-cloud-connect-guide].

    !!! warning "Wallarm Buluta bağlanmak için bir token kullanın"
        Filtreleme düğümünü Wallarm Buluta bir token kullanarak bağlamanız gerektiğini unutmayın. Birden çok filtreleme düğümünün aynı tokenı kullanarak Wallarm Buluta bağlanmasına izin verilir.
        
        Böylece, filtreleme düğümlerinin otomatik ölçeklendirmesi durumunda, her bir filtreleme düğümünü Wallarm Buluta manuel olarak bağlama ihtiyacınız olmayacak.

3.  Filtreleme düğümünü web uygulamanız için bir ters proxy olarak [yapılandırın][link-docs-reverse-proxy-setup].

4.  Filtreleme düğümünün doğru bir şekilde yapılandırıldığını ve web uygulamanızı kötü amaçlı isteklere karşı [koruduğundan][link-docs-check-operation] emin olun.

Filtre düğümünü yapılandırmayı bitirdikten sonra, aşağıdaki etkinliklerle sanal makineyi kapatın:

1.  Amazon EC2 kontrol panelindeki **Örnekler** sekmesine gidin.
2.  Yapılandırmış olduğunuz filtreleme düğümü örneğinizi seçin.
3.  **Eylemler** açılır menüsünde **Durum Örneği** ve ardından **Durdur** seçeneğini seçin.

!!! info "`poweroff` komutu ile kapatma"
    SSH protokolü aracılığıyla buna bağlanarak sanal makineyi de kapatabilirsiniz ve aşağıdaki komutu çalıştırınız:
    
    ``` bash
    poweroff
    ```

##  2.  Amazon Makine Görüntüsü Oluşturma

Şimdi, yapılandırılmış filtreleme düğümü örneği temelinde bir sanal makine görüntüsü oluşturabilirsiniz. Bir görüntü oluşturmak için aşağıdaki adımları gerçekleştirin:

1.  Amazon EC2 kontrol panelindeki **Örnekler** sekmesine gidin.
2.  Yapılandırmış olduğunuz filtreleme düğümü örneğinizi seçin.
3.  **Eylemler** açılır menüsünde **Görüntü** ve ardından **Görüntü Oluştur** seçeneğini seçerek görüntü oluşturma sihirbazını başlatın.

    ![AMI oluşturma sihirbazının başlatılması][img-launch-ami-wizard]
    
4.  **Görüntü Oluştur** formu belirecektir. **Görüntü adı** alanına görüntü adını girin. Diğer alanları olduğu gibi bırakabilirsiniz.

    ![AMI oluşturma sihirbazında parametrelerin yapılandırılması][img-config-ami-wizard]
    
5.  Sanal makine görüntüsü oluşturma işlemini başlatmak için **Görüntü Oluştur** düğmesine tıklayın.
    
    Görüntü oluşturma işlemi bittiğinde, ilgili mesaj görüntülenir. Görüntünün başarıyla oluşturulduğundan ve **Kullanılabilir** durumda olduğundan emin olmak için Amazon EC2 kontrol panelindeki **AMIs** sekmesine gidin.
    
    ![Oluşturulan AMI'nın incelenmesi][img-explore-created-ami]

!!! info "Görüntü görünürlüğü"
    Hazırlanan görüntü, uygulamanıza özgü ayarları ve Wallarm tokenini içerdiğinden, görüntü görünürlüğü ayarını değiştirmeniz ve onu halka açık yapmanız önerilmez (varsayılan olarak, AMI'ler **Özel** görünürlük ayarıyla oluşturulur).

Şimdi, hazırlanan görüntüyü kullanarak Amazon bulutta Wallarm filtreleme düğümlerinin otomatik ölçeklendirmesini [kurabilirsiniz][link-docs-aws-autoscaling].