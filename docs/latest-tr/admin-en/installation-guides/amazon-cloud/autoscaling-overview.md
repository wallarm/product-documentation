# AWS'de filtering node auto scaling yapılandırmasının genel bakışı

Wallarm filtering node auto scaling'i, filtering node'ların trafik dalgalanmalarını karşılayabilmesini sağlamak amacıyla yapılandırabilirsiniz. Auto scaling'i etkinleştirmek, trafik önemli ölçüde arttığında bile filtering node'ların uygulamaya gelen istekleri işleyebilmesini sağlar.

Amazon bulutu aşağıdaki auto scaling yöntemlerini destekler:
*   AWS Autoscaling:
    AWS tarafından toplanan metriklere dayalı yeni auto scaling teknolojisi.
    
    AWS Auto Scaling hakkında detaylı bilgi için bu [link][link-doc-aws-as] adresine gidin.

*   EC2 Autoscaling:
    Ölçeklendirme kurallarını tanımlamak için özel değişkenler oluşturulmasına olanak tanıyan eski auto scaling teknolojisi.
    
    EC2 Auto Scaling hakkında detaylı bilgi için bu [link][link-doc-ec2-as] adresine gidin.
    
!!! info "Auto scaling yöntemleri hakkında bilgi"
    Amazon tarafından sağlanan auto scaling yöntemleri hakkındaki detaylı SSS (FAQ) için bu [link][link-doc-as-faq] adresine gidin.

Bu kılavuz, EC2 Auto Scaling kullanarak filtering node'ların auto scaling'ini yapılandırmanın nasıl yapılacağını açıklamaktadır, ancak ihtiyaç duyulması halinde AWS Auto Scaling de kullanılabilir.

!!! warning "Önkoşullar"
    Auto scaling kurulumu için Wallarm filtering node içeren bir sanal makine imajı (Amazon Machine Image, AMI) gereklidir.
    
    Filtering node içeren bir AMI oluşturma hakkında detaylı bilgi için bu [link][link-doc-ami-creation] adresine gidin.

!!! info "Özel SSH anahtarı"
    Filtering node'a bağlanmak için daha önce oluşturduğunuz, PEM formatında saklanan özel SSH anahtarına erişiminizin olduğundan emin olun.

Amazon bulutunda filtering node auto scaling'i etkinleştirmek için aşağıdaki adımları izleyin:

1.  [Bir Amazon Machine Image oluşturun](create-image.md)
1.  [Filtering node auto scaling'i yapılandırın][link-doc-asg-guide]
    1.  [Bir Launch Template oluşturun][link-doc-create-template]
    2.  [Bir Auto Scaling Group oluşturun][link-doc-create-asg]
1.  [Gelen isteklerin dengelemesini yapılandırın][link-doc-lb-guide]
    1.  [Bir load balancer oluşturun][link-doc-create-lb]
    2.  [Oluşturulan balancer'ı kullanmak için bir Auto Scaling Group yapılandırın][link-doc-set-up-asg]