[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

#   Google Cloud Platform üzerinde filtreleme düğümü otomatik ölçeklendirmesini ayarlama: Genel Bakış

Varsa trafik dalgalanmalarını karşılayabilmesini sağlamak için Google Cloud Platform (GCP) üzerinde Wallarm filtreleme düğümü için otomatik ölçeklendirmeyi ayarlayabilirsiniz. Otomatik ölçeklendirmeyi etkinleştirmek, trafik önemli ölçüde arttığında bile gelen isteklerin filtreleme düğümleri kullanılarak işlenmesini sağlar.

!!! warning "Önkoşullar"
    Otomatik ölçeklendirmeyi ayarlamak, Wallarm filtreleme düğümüne sahip sanal makinenin imajını gerektirir.
    
    GCP üzerinde Wallarm filtreleme düğümü bulunan sanal makinenin imajını oluşturma hakkında ayrıntılı bilgi için bu [bağlantıya][link-doc-image-creation] gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

Google Cloud Platform üzerinde filtreleme düğümlerini otomatik olarak ölçeklendirmek için aşağıdaki adımları uygulayın:

1.  [Bir Machine Image oluşturun](create-image.md)
1.  Filtreleme düğümü otomatik ölçeklendirmesini ayarlayın:
    1.  [Bir filtreleme düğümü instance template’i oluşturun][link-doc-template-creation];
    2.  [Otomatik ölçeklendirme etkin olan yönetilen bir managed instance group oluşturun][link-doc-managed-autoscaling-group];
1.  [Gelen isteklerin yük dengelemesini ayarlayın][link-doc-lb-guide].

!!! info "Gerekli yetkiler"
    Otomatik ölçeklendirmeyi ayarlamadan önce, GCP hesabınızın `Compute Admin` rolüne sahip olduğundan emin olun.