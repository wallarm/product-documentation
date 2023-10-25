[link-doc-aws-as]:          https://docs.aws.amazon.com/autoscaling/plans/userguide/what-is-aws-auto-scaling.html
[link-doc-ec2-as]:          https://docs.aws.amazon.com/autoscaling/ec2/userguide/GettingStartedTutorial.html
[link-doc-as-faq]:          https://aws.amazon.com/autoscaling/faqs/

[link-doc-ami-creation]:    create-image.md
[link-doc-asg-guide]:       autoscaling-group-guide.md
[link-doc-lb-guide]:        load-balancing-guide.md
[link-doc-create-template]: autoscaling-group-guide.md#1-creating-a-launch-template
[link-doc-create-asg]:      autoscaling-group-guide.md#2-creating-an-auto-scaling-group
[link-doc-create-lb]:       load-balancing-guide.md#1-creating-a-load-balancer
[link-doc-set-up-asg]:      load-balancing-guide.md#2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

# AWS'da filtreleme düğümü otomatik ölçeklendirme yapılandırmasına genel bakış

Wallarm filtreleme düğümü otomatik ölçeklendirmesini, varsa trafik dalgalanmalarını işleyebilen filtreleme düğümlerine sahip olduğunuzdan emin olmak için ayarlayabilirsiniz. Otomatik ölçeklendirmeyi etkinleştirmek, trafik önemli ölçüde arttığında bile uygulamaya gelen istekleri filtreleme düğümleri kullanarak işlemeyi sağlar.

Amazon bulutu, aşağıdaki otomatik ölçeklendirme yöntemlerini destekler:
*   AWS Otomatik Ölçeklendirme:
    AWS tarafından toplanan metriklere dayalı yeni otomatik ölçeklendirme teknolojisi.
    
    AWS Otomatik Ölçeklendirme hakkında detaylı bilgi için, bu [bağlantıya][link-doc-aws-as] ilerleyin.

*   EC2 Otomatik Ölçeklendirme:
    Ölçeklendirme kurallarını tanımlamak için özel değişkenler oluşturmayı sağlayan eski otomatik ölçeklendirme teknolojisi.
    
    EC2 Otomatik Ölçeklendirme hakkında detaylı bilgi için, bu [bağlantıya][link-doc-ec2-as] ilerleyin.
    
!!! info "Otomatik ölçeklendirme yöntemleri hakkında bilgilendirme"
    Amazon tarafından sağlanan otomatik ölçeklendirme yöntemleri hakkında detaylı bir SSS için, bu [bağlantıya][link-doc-as-faq] ilerleyin.

Bu rehber, EC2 Otomatik Ölçeklendirme kullanarak filtreleme düğümlerinin otomatik ölçeklendirmesini nasıl yapılandıracağınızı açıklar, ancak gerektiğinde AWS Otomatik Ölçeklendirme'yi de kullanabilirsiniz.

!!! warning "Ön Koşullar"
    Otomatik ölçeklendirmeyi ayarlamak için Wallarm filtreleme düğümü olan bir sanal makine imajı (Amazon Makine İmajı, AMI) gereklidir.
    
    Filtreleme düğümü olan bir AMI oluşturma hakkında ayrıntılı bilgi için, bu [bağlantı][link-doc-ami-creation] ile devam edin.

!!! info "Özel SSH Anahtarı"
    Filtreleme düğümüne bağlanmak için daha önce oluşturduğunuz özel bir SSH anahtarına (PEM biçiminde saklanan) erişiminiz olduğundan emin olun.

Amazon bulutunda filtreleme düğümü otomatik ölçeklendirmesini etkinleştirmek için, aşağıdaki adımları izleyin:

1.  [Amazon Makine İmajı Oluşturun](create-image.md)
1.  [Filtreleme düğümü otomatik ölçeklendirmesini ayarlayın][link-doc-asg-guide]
    1.  [Bir Başlatma Şablonu oluşturun][link-doc-create-template]
    2.  [Bir Otomatik Ölçeklendirme Grubu oluşturun][link-doc-create-asg]
1.  [Gelen isteklerin dengelenmesini ayarlayın][link-doc-lb-guide]
    1.  [Bir yük dengeleyici oluşturun][link-doc-create-lb]
    2.  [Oluşturulan dengeleyiciyi kullanmak için bir Otomatik Ölçeklendirme Grubu ayarlayın][link-doc-set-up-asg]