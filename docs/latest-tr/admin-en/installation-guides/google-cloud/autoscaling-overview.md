# Google Cloud Platform'da Filtreleme Düğümü Otomatik Ölçeklendirmesini Kurma: Genel Bakış

Google Cloud Platform (GCP) üzerinde Wallarm filtreleme düğümü otomatik ölçeklendirmesini kurarak, filtreleme düğümlerinin herhangi bir trafik dalgalanmasını (varsa) karşılayacak kapasitede olmasını sağlayabilirsiniz. Otomatik ölçeklendirmeyi etkinleştirmek, trafik önemli ölçüde arttığında bile, uygulamaya gelen isteklerin filtreleme düğümleri aracılığıyla işlenmesini mümkün kılar.

!!! warning "Ön Koşullar"
    Otomatik ölçeklendirmeyi kurabilmek için Wallarm filtreleme düğümüne sahip sanal makinenin imajının oluşturulması gerekmektedir.
    
    GCP üzerinde Wallarm filtreleme düğümüne sahip sanal makinenin imajının oluşturulmasıyla ilgili detaylı bilgi için bu [link][link-doc-image-creation]'a bakınız.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

Google Cloud Platform üzerinde filtreleme düğümlerini otomatik ölçeklendirmek için aşağıdaki adımları izleyin:

1.  [Create a Machine Image](create-image.md)
1.  Filtreleme düğümü otomatik ölçeklendirmesini yapılandırın:
    1.  [Create a filtering node instance template][link-doc-template-creation];
    2.  [Create a managed instance group with auto scaling enabled][link-doc-managed-autoscaling-group];
1.  [Set up incoming requests balancing][link-doc-lb-guide].

!!! info "Gerekli Yetkiler"
    Otomatik ölçeklendirmeyi yapılandırmadan önce, GCP hesabınızın `Compute Admin` rolüne sahip olduğundan emin olun.