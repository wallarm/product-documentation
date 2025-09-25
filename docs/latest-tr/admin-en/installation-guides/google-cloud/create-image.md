[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#6-configure-sending-traffic-to-the-wallarm-instance
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md#node-registers-attacks

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

#   Google Cloud Platform üzerinde Wallarm filtreleme düğümü içeren bir imaj oluşturma

Google Cloud Platform (GCP) üzerinde dağıtılan Wallarm filtreleme düğümlerinin otomatik ölçeklendirmesini ayarlamak için önce sanal makine imajlarına ihtiyacınız vardır. Bu belge, Wallarm filtreleme düğümü yüklü sanal makinenin imajını hazırlama prosedürünü açıklar. Otomatik ölçeklendirmeyi ayarlama hakkında ayrıntılı bilgi için bu [bağlantıya][link-docs-gcp-autoscaling] gidin.

GCP üzerinde Wallarm filtreleme düğümü içeren bir imaj oluşturmak için aşağıdaki prosedürleri uygulayın:
1.  [Google Cloud Platform üzerinde filtreleme düğümü örneğini oluşturma ve yapılandırma][anchor-node].
2.  [Yapılandırılmış filtreleme düğümü örneği temelinde bir sanal makine imajı oluşturma][anchor-gcp].

##  1.  Google Cloud Platform üzerinde filtreleme düğümü örneğini oluşturma ve yapılandırma

Bir imaj oluşturmadan önce, tek bir Wallarm filtreleme düğümünün ilk yapılandırmasını gerçekleştirmeniz gerekir. Bir filtreleme düğümünü yapılandırmak için aşağıdakileri yapın:
1.  GCP üzerinde bir filtreleme düğümü örneğini [oluşturup yapılandırın][link-docs-gcp-node-setup].

    !!! warning "Filtreleme düğümüne internet bağlantısı sağlayın"
        Filtreleme düğümünün düzgün çalışması için bir Wallarm API sunucusuna erişmesi gerekir. Wallarm API sunucusunun seçimi, kullandığınız Wallarm Cloud'a bağlıdır:
        
        * US Cloud kullanıyorsanız, düğümünüze `https://us1.api.wallarm.com` erişimi verilmelidir.
        * EU Cloud kullanıyorsanız, düğümünüze `https://api.wallarm.com` erişimi verilmelidir.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2.  Filtreleme düğümünü Wallarm Cloud'a [bağlayın][link-cloud-connect-guide].

    !!! warning "Wallarm Cloud'a bağlanmak için bir token kullanın"
        Filtreleme düğümünü Wallarm cloud'a bir token kullanarak bağlamanız gerektiğini lütfen unutmayın. Birden fazla filtreleme düğümünün aynı token'ı kullanarak Wallarm cloud'a bağlanmasına izin verilir.
       
        Böylece, otomatik ölçeklendirme sırasında her bir filtreleme düğümünü Wallarm Cloud'a manuel olarak bağlamanıza gerek kalmayacaktır. 

3.  Filtreleme düğümünü, uygulamalarınız ve API'leriniz için bir ters proxy olarak çalışacak şekilde [yapılandırın][link-docs-reverse-proxy-setup].

4.  Filtreleme düğümünün doğru şekilde yapılandırıldığından ve uygulamalarınızı ile API'lerinizi kötü amaçlı isteklere karşı koruduğundan [emin olun][link-docs-check-operation].

Filtreleme düğümünün yapılandırmasını tamamladıktan sonra, aşağıdaki adımları uygulayarak sanal makineyi kapatın:
1.  Menüdeki **Compute Engine** bölümünde **VM Instances** sayfasına gidin.
2.  **Connect** sütununun sağındaki menü düğmesine tıklayarak açılır menüyü açın.
3.  Açılır menüden **Stop** seçeneğini belirleyin.

![Sanal makineyi kapatma][img-vm-instance-poweroff]

!!! info "`poweroff` komutunu kullanarak kapatma"
    Sanal makineye SSH protokolü ile bağlanıp aşağıdaki komutu çalıştırarak da sanal makineyi kapatabilirsiniz:
    
    ``` bash
 	poweroff
 	```

##  2.  Sanal makine imajı oluşturma

Artık yapılandırılmış filtreleme düğümü örneği temelinde bir sanal makine imajı oluşturabilirsiniz. Bir imaj oluşturmak için aşağıdaki adımları uygulayın:
1.  Menüdeki **Compute Engine** bölümünde **Images** sayfasına gidin ve **Create image** düğmesine tıklayın.
2.  **Name** alanına imaj adını girin.
3.  **Source** açılır listesinden **Disk** öğesini seçin.
4.  **Source disk** açılır listesinden [daha önce oluşturduğunuz][anchor-node] sanal makine örneğinin adını seçin.

    ![Bir imaj oluşturma][img-create-image]

5.  Sanal makine imajı oluşturma sürecini başlatmak için **Create** düğmesine tıklayın.

İmaj oluşturma süreci tamamlandığında, kullanılabilir imajların listesini içeren bir sayfaya yönlendirilirsiniz. İmajın başarıyla oluşturulduğundan ve listede yer aldığından emin olun.

![İmaj listesi][img-check-image]

Artık hazırladığınız imajı kullanarak Google Cloud Platform üzerinde Wallarm filtreleme düğümlerinin [otomatik ölçeklendirmesini yapılandırabilirsiniz][link-docs-gcp-autoscaling].