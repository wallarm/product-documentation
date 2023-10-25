[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#5-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

# Google Cloud Platform'da Wallarm filtreleme düğümü ile bir görüntü oluşturma

Wallarm filtreleme düğümlerinin Google Cloud Platform (GCP) üzerinde otomatik ölçeklenmesini ayarlamak için öncelikle sanal makine görüntülerine ihtiyacınız vardır. Bu belge, Wallarm filtreleme düğümünün yüklü olduğu sanal makinenin görüntüsünü hazırlama prosedürünü açıklar. Otomatik ölçeklemeyi ayarlama hakkında ayrıntılı bilgi için bu [bağlantıya][link-docs-gcp-autoscaling] gidin.

GCP üzerinde Wallarm filtreleme düğümü ile bir görüntü oluşturmak için aşağıdaki işlemleri gerçekleştirin:
1. [Google Cloud Platform üzerinde filtreleme düğümü örneğini oluşturma ve yapılandırma][anchor-node].
2. [Yapılandırılmış filtreleme düğümü örneğinin temel alındığı sanal makine görüntüsünü oluşturma][anchor-gcp].

## 1.  Google Cloud Platform üzerinde filtreleme düğümü örneğini oluşturma ve yapılandırma

Görüntü oluşturmadan önce, tek bir Wallarm filtreleme düğümünün ilk yapılandırmasını gerçekleştirmeniz gerekir. Bir filtreleme düğümünü yapılandırmak için aşağıdakileri yapın:
1. GCP üzerinde bir filtreleme düğümü örneği [oluşturun ve yapılandırın][link-docs-gcp-node-setup].

   !!! warning "Filtreleme düğümüne internet bağlantısı sağlayın"
       Filtreleme düğümünün düzgün çalışması için bir Wallarm API sunucusuna erişim gereklidir. Wallarm API sunucusunun seçimi, kullandığınız Wallarm Cloud'a bağlıdır:
       
       * ABD Bulutunu kullanıyorsanız, düğümünüze `https://us1.api.wallarm.com` adresine erişim izni verilmesi gerekmektedir.
       * EU Bulutunu kullanıyorsanız, düğümünüze `https://api.wallarm.com` adresine erişim izni verilmesi gerekmektedir.
   
   --8<-- "../include-tr/gcp-autoscaling-connect-ssh.md"

2.  Filtreleme düğümünü Wallarm Cloud'a [bağlayın][link-cloud-connect-guide].

    !!! warning "Wallarm Cloud'a bağlanmak için bir belirteç kullanın"
       Filtreleme düğümünü bir belirteç kullanarak Wallarm Buluta bağlamanız gerektiğini lütfen unutmayın. Birden çok filtreleme düğümünün aynı belirteci kullanarak Wallarm Buluta bağlanmasına izin verilir.
      
      Böylece, otomatik ölçeklendiklerinde her bir filtreleme düğümünü Wallarm Buluta manuel olarak bağlamanız gerekmez.

3.  Filtreleme düğümünü, web uygulamanız için bir ters proxy olarak [yapılandırın][link-docs-reverse-proxy-setup].

4.  Filtreleme düğümünün doğru bir şekilde yapılandırıldığını ve web uygulamanızı kötü niyetli isteklere karşı [koruduğundan emin olun][link-docs-check-operation].

Filtreleme düğümünün yapılandırmasını tamamladıktan sonra, aşağıdaki eylemleri gerçekleştirerek sanal makineyi kapatın:
1.  Menünün **Compute Engine** bölümünde **VM Instances** sayfasına gidin.
2.  **Connect** sütununun sağında bulunan menü düğmesine tıklayarak açılır menüyü açın.
3.  Açılır menüdeki **Stop** seçeneğini seçin.

![Sanal makineyi kapatma][img-vm-instance-poweroff]

!!! info "`poweroff` komutu kullanarak kapatma"
    SSH protokolünü kullanarak sanal makineye bağlanarak aşağıdaki komutu çalıştırarak da sanal makineyi kapatma şansınız olabilir:
    
    ``` bash
 	poweroff
 	```

## 2. Sanal makine görüntüsü oluşturma

Artık, yapılandırılmış filtreleme düğümü örneğinin temel alındığı bir sanal makine görüntüsü oluşturabilirsiniz. Bir görüntü oluşturmak için aşağıdaki adımları uygulayın:
1.  Menünün **Compute Engine** bölümünde **Images** sayfasına gidin ve **Create image** düğmesine tıklayın.
2.  **Name** alanına görüntü adını girin.
3.  **Source** açılır listesinden **Disk** seçeneğini seçin.
4.  **Source disk** açılır listesinden [daha önce oluşturulan][anchor-node] sanal makine örneğinin adını seçin.

    ![Görüntü oluşturma][img-create-image]

5.  Sanal makine görüntüsü oluşturma sürecini başlatmak için **Create** düğmesine tıklayın.

Görüntü oluşturma süreci tamamlandığında, mevcut görüntülerin listesini içeren bir sayfaya yönlendirileceksiniz. Görüntünün başarıyla oluşturulduğundan ve listede olduğundan emin olun.

![Görüntüler listesi][img-check-image]

Artık hazırlanan görüntüyü kullanarak Google Cloud Platform üzerinde Wallarm filtreleme düğümlerinin [otomatik ölçeklemesini ayarlayabilirsiniz][link-docs-gcp-autoscaling].