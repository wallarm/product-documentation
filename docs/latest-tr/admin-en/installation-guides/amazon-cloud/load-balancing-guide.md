[link-doc-asg-guide]:               autoscaling-group-guide.md  
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[link-aws-lb-comparison]:           https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html?icmpid=docs_elbv2_console#elb-features   

[img-lb-basics]:                    ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-1.png
[img-lb-routing]:                   ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-3.png
[img-checking-operation]:           ../../../images/admin-guides/test-attacks-quickstart.png

[anchor-create]:        #1-creating-a-load-balancer
[anchor-configure]:     #2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

#   AWS üzerinde Yük Dengeleyici Oluşturma

Artık [yapılandırılmış][link-doc-asg-guide] filtre düğümü Auto Scaling Group'una sahip olduğunuzda, gelen HTTP ve HTTPS bağlantılarını Auto Scaling Group'daki birden fazla filtre düğümü arasında dağıtacak bir Yük Dengeleyici oluşturmanız ve yapılandırmanız gerekir.

Yük Dengeleyici oluşturma süreci aşağıdaki adımları içerir:
1.  [Bir Yük Dengeleyici Oluşturma][anchor-create]
2.  [Oluşturulan Dengeleyiciyi Kullanmak İçin Auto Scaling Group Ayarlama][anchor-configure]

##  1.  Bir Yük Dengeleyici Oluşturma

Amazon bulutunda aşağıdaki tipte Yük Dengeleyiciler yapılandırabilirsiniz:
*   Classic Load Balancer
*   Network Load Balancer
*   Application Load Balancer

!!! info "Yük Dengeleyiciler Arasındaki Farklar"
    Yük Dengeleyiciler arasındaki farklara ilişkin ayrıntılı bilgileri görmek için bu [link][link-aws-lb-comparison]'i inceleyin.

Bu belge, OSI/ISO ağ modelinin taşıma katmanında trafiği dağıtan Network Load Balancer'ın yapılandırılmasını ve kullanımını göstermektedir.

Bir Yük Dengeleyici oluşturmak için aşağıdaki işlemleri tamamlayın:
1.  Amazon EC2 kontrol panelindeki **Load Balancers** sekmesine gidin ve **Create Load Balancer** butonuna tıklayın.

2.  İlgili **Create** butonuna tıklayarak bir Network Load Balancer oluşturun.

3.  Temel Yük Dengeleyici parametrelerini yapılandırın:

    ![Genel Yük Dengeleyici parametrelerinin yapılandırılması][img-lb-basics]
    
    1.  Dengeleyicinin adı ( **Name** parametresi).
    
    2.  Dengeleyici tipi ( **Scheme** parametresi). Dengeleyicinin internete açık olması için **internet-facing** tipini seçin.
    
    3.  **Listeners** parametre grubu kullanılarak, dengeleyicinin dinleyeceği portları belirtin.
    
    4.  Dengeleyicinin çalışacağı VPC ve Availability Zone'ları belirtin.
        
        !!! info "Auto Scaling Group Erişilebilirliğini Kontrol Edin"
            Dengeleyicinin düzgün çalışabilmesi için, [önceden oluşturduğunuz][link-doc-asg-guide] Auto Scaling Group'un bulunduğu VPC ve Availability Zone'ları seçtiğinizden emin olun.
        
4.  **Next: Configure Security Settings** butonuna tıklayarak bir sonraki adıma geçin.

    Gerekirse güvenlik parametrelerini yapılandırın.
    
5.  **Next: Configure Routing** butonuna tıklayarak bir sonraki adıma geçin.

    Gelen isteklerin, Auto Scaling Group'daki filtre düğümlerine yönlendirilmesini yapılandırın.

    ![Gelen bağlantıların yönlendirilmesini yapılandırma][img-lb-routing]
    
    1.  Yeni bir hedef grup oluşturun ve **Name** alanında adını belirtin. Yük Dengeleyici, gelen istekleri belirtilen hedef gruptaki instance'lara yönlendirecektir (örn. `demo-target`).
        
    2.  İsteklerin yönlendirilmesi için kullanılacak protokol ve portu yapılandırın.
    
        Filtre düğümü için TCP protokolünü ve 80 ile (HTTPS trafiğiniz varsa) 443 portlarını belirtin.
        
    3.  Gerekirse, **Health Checks** parametre grubunu kullanarak erişilebilirlik kontrollerini yapılandırın.
    
6.  **Next: Register Targets** butonuna tıklayarak bir sonraki adıma geçin.

    Bu adım için herhangi bir işlem yapmanız gerekmez.
    
7.  **Next: Review** butonuna tıklayarak bir sonraki adıma geçin.
    
    Tüm parametrelerin doğru şekilde belirtildiğinden emin olun ve **Create** butonuna tıklayarak Yük Dengeleyici oluşturma sürecini başlatın.

!!! info "Yük Dengeleyici Başlatılana Kadar Bekleyin"
    Yük Dengeleyici oluşturulduktan sonra, trafiği almaya hazır hale gelmesi için bir süre beklenmelidir.

##  2.  Oluşturulan Dengeleyiciyi Kullanmak İçin Auto Scaling Group Ayarlama

Oluşturduğunuz Yük Dengeleyici'yi kullanacak şekilde Auto Scaling Group'unuzu yapılandırın. Bu, dengeleyicinin grupta başlatılan filtre düğümü instance'larına trafik yönlendirmesini sağlayacaktır.

Bunu yapmak için aşağıdaki işlemleri tamamlayın:
1.  Amazon EC2 kontrol panelindeki **Auto Scaling Groups** sekmesine gidin ve daha önce oluşturduğunuz Auto Scaling Group'u ([link-doc-asg-guide]) seçin.

2.  **Actions** açılır menüsünden *Edit* seçeneğini seçerek grup yapılandırma düzenleme penceresini açın.

3.  **Target groups** açılır listesinden, Yük Dengeleyici ayarlanırken oluşturulan **demo-target** hedef grubunu ([anchor-create]) seçin.

4.  **Save** butonuna tıklayarak değişiklikleri uygulayın.

Artık dinamik olarak ölçeklenen Wallarm filtre düğümleri kümesi, uygulamanıza gelen trafiği işleyecektir.

Dağıtılmış filtre düğümlerinin çalışmasını kontrol etmek için aşağıdaki adımları uygulayın:

1.  Uygulamanızın, tarayıcı aracılığıyla dengeleyici IP adresine veya alan adına erişilebildiğinden emin olun.
    
2.  Wallarm servislerinin uygulamanızı koruduğundan emin olmak için [bir test saldırısı gerçekleştirerek][link-docs-check-operation] kontrol edin.

![Filtre düğümü operasyonunun kontrol edilmesi][img-checking-operation]