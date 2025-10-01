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


# AWS üzerinde filtreleme düğümü otomatik ölçeklendirme yapılandırmasına genel bakış

Varsa trafik dalgalanmalarını karşılayabileceklerinden emin olmak için Wallarm filtering node otomatik ölçeklendirmesini yapılandırabilirsiniz. Otomatik ölçeklendirmeyi etkinleştirmek, trafik önemli ölçüde arttığında bile uygulamaya gelen isteklerin filtering node'lar kullanılarak işlenmesini sağlar.

Amazon bulutu aşağıdaki otomatik ölçeklendirme yöntemlerini destekler:
*   AWS Autoscaling:
    AWS tarafından toplanan metriklere dayanan yeni otomatik ölçeklendirme teknolojisi.
    
    AWS Auto Scaling hakkında ayrıntılı bilgi için bu [bağlantıya][link-doc-aws-as] gidin. 

*   EC2 Autoscaling:
    Ölçeklendirme kurallarını tanımlamak için özel değişkenler oluşturmanıza olanak tanıyan eski otomatik ölçeklendirme teknolojisi.
    
    EC2 Auto Scaling hakkında ayrıntılı bilgi için bu [bağlantıya][link-doc-ec2-as] gidin. 
    
!!! info "Otomatik ölçeklendirme yöntemleri hakkında bilgi"
    Amazon tarafından sunulan otomatik ölçeklendirme yöntemleriyle ilgili ayrıntılı SSS için bu [bağlantıya][link-doc-as-faq] gidin. 

Bu kılavuz, filtering node'ların otomatik ölçeklendirmesini EC2 Auto Scaling kullanarak nasıl yapılandıracağınızı açıklar; gerekirse AWS Auto Scaling'i de kullanabilirsiniz.

!!! warning "Önkoşullar"
    Otomatik ölçeklendirmeyi ayarlamak için Wallarm filtering node içeren bir sanal makine imajı (Amazon Machine Image, AMI) gereklidir.
    
    Filtering node içeren bir AMI oluşturma hakkında ayrıntılı bilgi için şu [bağlantıyla][link-doc-ami-creation] devam edin.

!!! info "Özel SSH anahtarı"
    Filtering node'a bağlanmak için daha önce oluşturduğunuz özel SSH anahtarına (PEM biçiminde saklanan) erişiminiz olduğundan emin olun.

Amazon bulutunda filtering node otomatik ölçeklendirmesini etkinleştirmek için aşağıdaki adımları uygulayın:

1.  [Bir Amazon Machine Image oluşturun](create-image.md)
1.  [Filtering node otomatik ölçeklendirmesini ayarlayın][link-doc-asg-guide]
    1.  [Bir Launch Template oluşturun][link-doc-create-template]
    2.  [Bir Auto Scaling Group oluşturun][link-doc-create-asg]
1.  [Gelen isteklerin dengelenmesini ayarlayın][link-doc-lb-guide]
    1.  [Bir yük dengeleyici oluşturun][link-doc-create-lb]
    2.  [Oluşturulan dengeleyiciyi kullanmak için bir Auto Scaling Group yapılandırın][link-doc-set-up-asg]