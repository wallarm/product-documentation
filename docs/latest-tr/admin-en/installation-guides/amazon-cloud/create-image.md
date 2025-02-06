[link-docs-aws-autoscaling]:        autoscaling-group-guide.md
[link-docs-aws-node-setup]:         ../../../installation/cloud-platforms/aws/ami.md
[link-ssh-keys-guide]:              ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws
[link-security-group-guide]:        ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/aws/ami.md#7-configure-sending-traffic-to-the-wallarm-instance
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-launch-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]:      ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]:  #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]:   #2-creating-an-amazon-machine-image

#   Wallarm filtering node ile AMI Oluşturma

Amazon cloud üzerinde dağıtılan Wallarm filtering node'lar için otomatik ölçeklendirme (auto scaling) kurabilirsiniz. Bu işlev, önceden hazırlanmış sanal makine görüntülerini gerektirir.

Bu doküman, Wallarm filtering node'un yüklü olduğu bir Amazon Machine Image (AMI) hazırlanma prosedürünü açıklamaktadır. AMI, filtering node otomatik ölçeklendirme kurulumu için gereklidir. Otomatik ölçeklendirme kurulumu hakkında detaylı bilgi için bu [link][link-docs-aws-autoscaling]'e geçin.

Wallarm filtering node ile bir AMI oluşturmak için şu işlemleri gerçekleştirin:

1.  [Amazon cloud üzerinde filtering node örneğinin oluşturulması ve yapılandırılması][anchor-node]
2.  [Yapılandırılmış filtering node örneğine dayalı olarak bir AMI oluşturulması][anchor-ami]

##  1.  Amazon Cloud Üzerinde Wallarm filtering node Örneğinin Oluşturulması ve Yapılandırılması

Bir AMI oluşturmadan önce, tek bir Wallarm filtering node'un başlangıç yapılandırmasını yapmanız gerekmektedir. Filtering node'u yapılandırmak için şunları yapın:

1.  [Amazon Cloud'da filtering node örneği oluşturun][link-docs-aws-node-setup].
    
    !!! warning "Private SSH key"
        Filtering node'a bağlanmak için daha önce [oluşturduğunuz][link-ssh-keys-guide] ve PEM formatında saklanan özel SSH anahtarına erişiminiz olduğundan emin olun.

    !!! warning "Provide the filtering node with an internet connection"
        Filtering node'un doğru çalışması için Wallarm API sunucusuna erişim gerekmektedir. Kullanmakta olduğunuz Wallarm Cloud'a bağlı olarak Wallarm API sunucusunun seçimi değişir:
        
        *   US Cloud kullanıyorsanız, node'unuza `https://us1.api.wallarm.com` adresine erişim yetkisi verilmelidir.
        *   EU Cloud kullanıyorsanız, node'unuza `https://api.wallarm.com` adresine erişim yetkisi verilmelidir.
        
    Doğru VPC ve alt ağları seçtiğinizden ve filtering node'un Wallarm API sunucularına erişimini engellemeyecek şekilde [güvenlik grubu yapılandırmanızı][link-security-group-guide] sağladığınızdan emin olun.

2.  Filtering node'u [Wallarm Cloud'a bağlayın][link-cloud-connect-guide].

    !!! warning "Use a token to connect to the Wallarm Cloud"
        Lütfen filtering node'un Wallarm Cloud'a bir token kullanılarak bağlanması gerektiğini unutmayın. Aynı token ile birden fazla filtering node'un Wallarm Cloud'a bağlanmasına izin verilmektedir.
        
        Böylece, filtering nodes otomatik ölçeklendirme sırasında her bir filtering node'u manuel olarak Wallarm Cloud'a bağlamanız gerekmeyecektir.

3.  Filtering node'u web uygulamanız için bir ters proxy olarak [yapılandırın][link-docs-reverse-proxy-setup].

4.  Filtering node'un doğru yapılandırıldığından ve web uygulamanızı kötü niyetli isteklere karşı koruduğundan [emin olun][link-docs-check-operation].

Filtering node yapılandırmasını tamamladıktan sonra, sanal makineyi kapatmak için aşağıdaki adımları izleyin:

1.  Amazon EC2 kontrol panelindeki **Instances** sekmesine gidin.
2.  Yapılandırılmış filtering node örneğinizi seçin.
3.  **Actions** açılır menüsünden **Instance State**'e ve ardından **Stop**'a tıklayın.

!!! info "Turning off with the `poweroff` command"
    Sanal makineyi SSH protokolü üzerinden bağlanarak ve aşağıdaki komutu çalıştırarak da kapatabilirsiniz:
    
    ``` bash
    poweroff
    ```

##  2.  Bir Amazon Machine Image Oluşturma

Artık yapılandırılmış filtering node örneğine dayalı bir sanal makine görüntüsü oluşturabilirsiniz. Bir görüntü oluşturmak için aşağıdaki adımları izleyin:

1.  Amazon EC2 kontrol panelindeki **Instances** sekmesine gidin.
2.  Yapılandırılmış filtering node örneğinizi seçin.
3.  **Actions** açılır menüsünden **Image** seçeneğini ve ardından **Create Image**'i seçerek görüntü oluşturma sihirbazını başlatın.

    ![Launching the AMI creation wizard][img-launch-ami-wizard]
    
4.  **Create Image** formu görünecektir. **Image name** alanına görüntü adını girin. Kalan alanları değiştirmeden bırakabilirsiniz.

    ![Configuring parameters in the AMI creation wizard][img-config-ami-wizard]
    
5.  Sanal makine görüntüsü oluşturma işlemini başlatmak için **Create Image** butonuna tıklayın.
    
    Görüntü oluşturma işlemi tamamlandığında ilgili mesaj görüntülenecektir. Görüntünün başarılı bir şekilde oluşturulduğundan ve **Available** durumunda olduğundan emin olmak için Amazon EC2 kontrol panelindeki **AMIs** sekmesine gidin.
    
    ![Exploring the created AMI][img-explore-created-ami]

!!! info "Image visibility"
    Hazırlanan görüntü, uygulamanıza ve Wallarm token'a özgü ayarlar içerdiğinden, görüntü görünürlüğü ayarını değiştirip herkese açık hale getirmeniz önerilmez (varsayılan olarak, AMI'ler **Private** görünürlük ayarı ile oluşturulur).

Artık hazırlanan görüntüyü kullanarak Amazon cloud üzerinde Wallarm filtering node'larının otomatik ölçeklendirmesini [kurabilirsiniz][link-docs-aws-autoscaling].