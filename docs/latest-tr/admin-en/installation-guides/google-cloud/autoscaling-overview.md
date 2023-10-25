[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

# Google Cloud Platform'da filtreleme düğümünün otomatik ölçeklendirilmesini ayarlama: Genel Bakış

Google Cloud Platform (GCP) üzerinde Wallarm filtering node otomatik ölçeklendirme ayarlayabilir ve bu sayede filtreleme düğümleri trafik dalgalanmalarını (eğer varsa) işlemeye uygun hale getirebilirsiniz. Otomatik ölçeklendirme işlemi, filtreleme düğümlerini kullanarak uygulamaya gelen isteklerin işlenmesine olanak sağlar, hatta trafik önemli ölçüde arttığında bile.

!!! uyarı "Önkoşullar"
    Otomatik ölçeklendirmeyi ayarlamak, sanal makinenin resmini Wallarm filtering node ile gerektirir.
    
    GCP'de sanal makinenin Wallarm filtering node ile bir resmini oluşturma hakkında ayrıntılı bilgi için, bu [bağlantıya][link-doc-image-creation] gidiniz.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

Google Cloud Platform'da filtreleme düğümlerini otomatik olarak ölçeklendirmek için aşağıdaki adımları uygulayın:

1.  [Bir Makine Görüntüsü Oluşturun](create-image.md)
1.  Filtreleme düğümünün otomatik ölçeklendirmesini ayarlayın:
    1.  [Bir filtreleme düğümü örneği şablonu oluşturun][link-doc-template-creation];
    2.  [Otomatik ölçeklendirme etkin bir yönetilen örnek grubu oluşturun][link-doc-managed-autoscaling-group];
1.  [Gelen isteklerin dengelenmesini ayarlayın][link-doc-lb-guide].

!!! bilgi "Gerekli yetkiler"
    Otomatik ölçeklendirme ayarlamadan önce, GCP hesabınızın `Compute Admin` rolüne sahip olduğundan emin olun.