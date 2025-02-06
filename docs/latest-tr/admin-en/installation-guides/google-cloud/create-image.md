```markdown
[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-instance-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#6-configure-sending-traffic-to-the-wallarm-instance
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

#   Google Cloud Platform üzerinde Wallarm filtering node ile bir imaj oluşturma

Google Cloud Platform (GCP) üzerinde dağıtılan Wallarm filtering node'larının otomatik ölçeklenmesini ayarlamak için önce sanal makine imajlarına ihtiyacınız vardır. Bu doküman, Wallarm filtering node'unun kurulu olduğu sanal makine imajını hazırlama prosedürünü anlatmaktadır. Otomatik ölçekleme kurulumu ile ilgili detaylı bilgi için [bu bağlantıya][link-docs-gcp-autoscaling] geçiniz.

GCP üzerinde Wallarm filtering node içeren bir imaj oluşturmak için aşağıdaki prosedürleri uygulayın:
1.  [Google Cloud Platform üzerinde filtering node örneğini oluşturma ve yapılandırma][anchor-node].
2.  [Yapılandırılmış filtering node örneği temelinde sanal makine imajı oluşturma][anchor-gcp].

##  1.  Google Cloud Platform üzerinde filtering node örneğini oluşturma ve yapılandırma

Bir imaj oluşturmadan önce, tek bir Wallarm filtering node'unun ilk yapılandırmasını yapmanız gerekmektedir. Filtering node'u yapılandırmak için aşağıdakileri uygulayın:
1.  GCP üzerinde bir filtering node örneğini [oluşturun ve yapılandırın][link-docs-gcp-node-setup].

    !!! warning "Filtering node'a internet bağlantısı sağlayın"
        Filtering node'un düzgün çalışabilmesi için Wallarm API sunucusuna erişim gerekmektedir. Hangi Wallarm Cloud'u kullandığınıza bağlı olarak, Wallarm API sunucusunun seçimi aşağıdaki gibidir:
        
        * US Cloud kullanıyorsanız, node'unuza `https://us1.api.wallarm.com` adresine erişim izni verilmelidir.
        * EU Cloud kullanıyorsanız, node'unuza `https://api.wallarm.com` adresine erişim izni verilmelidir.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2.  Filtering node'u [Wallarm Cloud ile bağlayın][link-cloud-connect-guide].

    !!! warning "Wallarm Cloud ile bağlantı kurmak için bir token kullanın"
        Filtering node'u Wallarm Cloud'a bağlarken bir token kullanmanız gerektiğini unutmayın. Aynı token ile birden fazla filtering node'unun Wallarm Cloud'a bağlanmasına izin verilmektedir.
       
        Böylece, filtering node'lar otomatik ölçeklenirken her birini elle bağlamanıza gerek kalmaz.

3.  Filtering node'u, web uygulamanız için ters proxy (reverse proxy) olarak çalışacak şekilde [yapılandırın][link-docs-reverse-proxy-setup].

4.  Filtering node'unun doğru yapılandırıldığından ve web uygulamanızı kötü amaçlı isteklere karşı koruduğundan emin olun [kontrol edin][link-docs-check-operation].

Filtering node'unuz yapılandırıldıktan sonra, sanal makineyi aşağıdaki adımlarla kapatın:
1.  Menüde **Compute Engine** bölümündeki **VM Instances** sayfasına gidin.
2.  **Connect** sütununun sağındaki menü düğmesine tıklayarak açılır menüyü açın.
3.  Açılır menüden **Stop** seçeneğini seçin.

![Sanal makinenin kapatılması][img-vm-instance-poweroff]

!!! info "`poweroff` komutu kullanılarak kapatma"
    SSH protokolüyle sanal makineye bağlanıp aşağıdaki komutu çalıştırarak da kapatabilirsiniz:
    
    ``` bash
 	poweroff
 	```

##  2.  Bir sanal makine imajı oluşturma

Artık yapılandırılmış filtering node örneğine dayalı bir sanal makine imajı oluşturabilirsiniz. Bir imaj oluşturmak için aşağıdaki adımları uygulayın:
1.  Menüde **Compute Engine** bölümündeki **Images** sayfasına gidin ve **Create image** düğmesine tıklayın.
2.  **Name** alanına imaj adını girin.
3.  **Source** açılır listesinden **Disk**'i seçin.
4.  **Source disk** açılır listesinden [önceden oluşturulan][anchor-node] sanal makine örneğinin adını seçin.

    ![İmaj oluşturma][img-create-image]

5.  Sanal makine imajı oluşturma işlemini başlatmak için **Create** düğmesine tıklayın.

İmaj oluşturma işlemi tamamlandığında, kullanılabilir imajların listesinin yer aldığı bir sayfaya yönlendirileceksiniz. İmajın başarılı bir şekilde oluşturulduğunu ve listede yer aldığını kontrol edin.

![İmajların listesi][img-check-image]

Artık hazırlanan imajı kullanarak Google Cloud Platform üzerindeki Wallarm filtering node'larının [otomatik ölçeklenmesini][link-docs-gcp-autoscaling] ayarlayabilirsiniz.
```