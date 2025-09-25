[link-doc-asg-guide]:               autoscaling-group-guide.md  
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md#node-registers-attacks

[link-aws-lb-comparison]:           https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html?icmpid=docs_elbv2_console#elb-features   

[img-lb-basics]:                    ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-1.png
[img-lb-routing]:                   ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-3.png
[img-checking-operation]:           ../../../images/admin-guides/test-attacks-quickstart.png

[anchor-create]:        #1-creating-a-load-balancer
[anchor-configure]:     #2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

#   AWS üzerinde Yük Dengeleyici Oluşturma

Artık [yapılandırılmış][link-doc-asg-guide] bir filtreleme düğümü Auto Scaling Group’una sahip olduğunuza göre, Auto Scaling Group içindeki birden çok filtreleme düğümü arasında gelen HTTP ve HTTPS bağlantılarını dağıtan bir Yük Dengeleyici oluşturup yapılandırmanız gerekir.

Yük Dengeleyici oluşturma süreci aşağıdaki adımları içerir:
1.  [Yük Dengeleyici Oluşturma][anchor-create]
2.  [Oluşturulan Dengeleyiciyi Kullanmak Üzere Auto Scaling Group Yapılandırma][anchor-configure]

<a id="1-creating-a-load-balancer"></a>
##  1.  Bir Yük Dengeleyici Oluşturma

Amazon bulutunda aşağıdaki Yük Dengeleyici türlerini yapılandırabilirsiniz:
*   Classic Load Balancer
*   Network Load Balancer
*   Application Load Balancer

!!! info "Yük Dengeleyiciler arasındaki farklar"
    Yük Dengeleyiciler arasındaki farklara ilişkin ayrıntılı bilgi için bu [bağlantıya][link-aws-lb-comparison] gidin.

Bu belge, OSI/ISO ağ modelinin taşıma katmanında trafiği dağıtan Network Load Balancer’ın nasıl yapılandırılıp kullanılacağını göstermektedir.

Aşağıdaki adımları izleyerek bir Yük Dengeleyici oluşturun: 
1.  Amazon EC2 panosunda **Load Balancers** sekmesine gidin ve **Create Load Balancer** düğmesine tıklayın.

2.  İlgili **Create** düğmesine tıklayarak bir Network Load Balancer oluşturun.

3.  Temel Yük Dengeleyici parametrelerini yapılandırın:

    ![Genel Yük Dengeleyici parametrelerinin yapılandırılması][img-lb-basics]
    
    1.  Dengeleyicinin adı (**Name** parametresi).
    
    2.  Dengeleyici türü (**Scheme** parametresi). Dengeleyicinin internette erişilebilir olması için **internet-facing** türünü seçin. 
    
    3.  **Listeners** parametre grubunu kullanarak dengeleyicinin dinleyeceği bağlantı noktalarını belirtin.
    
    4.  Dengeleyicinin çalışacağı gerekli VPC ve Availability Zones değerlerini belirtin.
        
        !!! info "Auto Scaling Group uygunluğunu kontrol edin"
            Yük dengeleyicinin düzgün çalışabilmesi için, [daha önce oluşturduğunuz][link-doc-asg-guide] Auto Scaling Group’u içeren VPC ve Availability Zones değerlerini seçtiğinizden emin olun.
        
4.  **Next: Configure Security Settings** düğmesine tıklayarak bir sonraki adıma geçin.

    Gerekirse güvenlik parametrelerini yapılandırın.
    
5.  **Next: Configure Routing** düğmesine tıklayarak sonraki adıma devam edin. 

    Gelen isteklerin Auto Scaling Group içindeki filtreleme düğümlerine yönlendirilmesini yapılandırın.

    ![Gelen bağlantıların yönlendirilmesinin yapılandırılması][img-lb-routing]
    
    1.  Yeni bir hedef grubu oluşturun ve adını **Name** alanında belirtin. Yük Dengeleyici, gelen istekleri belirtilen hedef grupta yer alan örneklere yönlendirecektir (ör. `demo-target`).
        
    2.  İstek yönlendirmede kullanılacak protokol ve bağlantı noktasını yapılandırın. 
    
        Filtreleme düğümü için TCP protokolünü ve 80 ile 443 (HTTPS trafiğiniz varsa) bağlantı noktalarını belirtin.
        
    3.  Gerekirse **Health Checks** parametre grubunu kullanarak sağlık kontrollerini yapılandırın.
    
6.  **Next: Register Targets** düğmesine tıklayarak bir sonraki adıma geçin. 

    Bu adımda herhangi bir işlem yapmanız gerekmez. 
    
7.  **Next: Review** düğmesine tıklayarak bir sonraki adıma geçin.
    
    Tüm parametrelerin doğru belirtildiğinden emin olun ve **Create** düğmesine tıklayarak Yük Dengeleyici oluşturma işlemini başlatın.

!!! info "Yük Dengeleyici başlatılana kadar bekleyin"
    Yük Dengeleyici oluşturulduktan sonra, trafiği almaya hazır hale gelmesi için bir süre geçmesi gerekir.

<a id="2-setting-up-an-auto-scaling-group-for-using-the-created-balancer"></a>
##  2.  Oluşturulan dengeleyiciyi kullanmak üzere bir Auto Scaling Group yapılandırma

Auto Scaling Group’unuzu, daha önce oluşturduğunuz Yük Dengeleyiciyi kullanacak şekilde yapılandırın. Bu, dengeleyicinin grupta başlatılan filtreleme düğümü örneklerine trafiği yönlendirmesine olanak tanır.

Bunu yapmak için aşağıdaki adımları izleyin:
1.  Amazon EC2 panosunda **Auto Scaling Groups** sekmesine gidin ve [daha önce oluşturduğunuz][link-doc-asg-guide] Auto Scaling Group’u seçin.

2.  **Actions** açılır menüsünden *Edit* öğesini seçerek grup yapılandırması düzenleme iletişim kutusunu açın. 

3.  **Target groups** açılır listesinden, Yük Dengeleyiciyi kurarken [oluşturduğunuz][anchor-create] **demo-target** hedef grubunu seçin.

4.  **Save** düğmesine tıklayarak değişiklikleri uygulayın.

Artık dinamik olarak ölçeklenen Wallarm filtreleme düğümleri kümesi, uygulamanıza gelen trafiği işleyecektir.

Dağıtılan filtreleme düğümlerinin çalışmasını kontrol etmek için aşağıdaki adımları uygulayın:

1.  Tarayıcıyı kullanarak dengeleyicinin IP adresine veya alan adına başvurarak uygulamanıza Load Balancer ve Wallarm filtreleme düğümleri üzerinden erişilebildiğinden emin olun.

2.  [Test saldırısı gerçekleştirerek][link-docs-check-operation] Wallarm servislerinin uygulamanızı koruduğundan emin olun.

![Filtreleme düğümünün çalışmasının kontrol edilmesi][img-checking-operation]