[link-doc-asg-guide]:               autoscaling-group-guide.md  
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[link-aws-lb-comparison]:           https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html?icmpid=docs_elbv2_console#elb-features   

[img-lb-basics]:                    ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-1.png
[img-lb-routing]:                   ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-3.png
[img-checking-operation]:           ../../../images/admin-guides/test-attacks-quickstart.png

[anchor-create]:        #1-creating-a-load-balancer
[anchor-configure]:     #2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

#   AWS'da Bir Yük Dengeleyici Oluşturmak

Şimdi, [yapılandırılmış][link-doc-asg-guide] filtreleme düğümü Auto Scaling Grubu'nuz olduğunda, Gelen HTTP ve HTTPS bağlantılarını Auto Scaling Grubundan çeşitli filtreleme düğümleri arasında dağıtan bir Yük Dengeleyici oluşturmanız ve yapılandırmanız gerekmektedir.

Yük Dengeleyici oluşturma süreci şu adımları içerir:
1.  [Bir Yük Dengeleyici Oluşturmak][anchor-create]
2.  [Oluşturulan Dengeleyiciyi Kullanmak İçin Bir Auto Scaling Grubu Ayarlamak][anchor-configure]

##  1.  Bir Yük Dengeleyici Oluşturmak

Amazon bulutunda aşağıdaki türlerde Yük Dengeleyicileri yapılandırabilirsiniz:
*   Klasik Yük Dengeleyici
*   Ağ Yük Dengeleyici
*   Uygulama Yük Dengeleyici

!!! info "Yük Dengeleyicilerin farkı"
    Yük Dengeleyiciler arasındaki farklar hakkında ayrıntılı bilgiye ulaşmak için bu [bağlantıya][link-aws-lb-comparison] gidin.

Bu belge, trafik dağıtımını OSI/ISO ağ modelinin taşıma seviyesinde dağıtan Network Load Balancer kullanmayı ve yapılandırmayı göstermektedir.

Aşağıdaki eylemleri tamamlayarak bir Yük Dengeleyici oluşturun: 
1.  Amazon EC2 panelindeki **Load Balancers** sekmesine gidin ve **Create Load Balancer** butonuna tıklayın.

2.  İlgili **Create** butonuna tıklayarak bir Ağ Yük Dengeleyici oluşturun.

3.  Temel Yük Dengeleyici parametrelerini yapılandırın:

    ![Genel Yük balansör parametrelerinin yapılandırılması][img-lb-basics]
    
    1.  Dengeleyicinin adı (the **Name** parametresi).
    
    2.  Dengeleyicinin tipi (the **Scheme** parametresi). Dengeleyicin internet üzerinde kullanılabilir olması için **internet-facing** tipini seçin. 
    
    3.  **Listeners** parametre grubunu kullanarak dengeleyicinin dinlemek üzere portları belirtin.
    
    4.  Dengeleyicinin çalışması gereken VPC ve Uygunluk Bölgelerini belirtin.
        
        !!! info "Auto Scaling Group'un uygunluğunu kontrol edin"
            Load balancer'ın düzgün çalışabilmesi için, daha önce [oluşturulan][link-doc-asg-guide] Auto Scaling Group'u içeren VPC ve Uygunluk Bölgelerini seçtiğinizden emin olun.
        
4.  **Next: Configure Security Settings** butonuna tıklayarak bir sonraki adıma geçin.

    Gerekli ise güvenlik parametrelerini yapılandırın.
    
5.  **Next: Configure Routing** butonuna tıklayarak bir sonraki adıma geçin. 

    Gelen isteklerin Auto Scaling Grubu içindeki filtreleme düğümlerine yönlendirilmesini yapılandırın.

    ![Gelen bağlantıların yönlendirilmesinin yapılandırılması][img-lb-routing]
    
    1.  Yeni bir hedef grup oluşturun ve **Name** alanında adını belirtin. Yük Dengeleyici, gelen istekleri belirtilmiş hedef grup içindeki instance'lara yönlendirecektir (örneğin, `demo-target`).
        
    2.  İstek yönlendirme için kullanılacak olan protokol ve portu yapılandırın. 
    
       Filtreleme düğümü için TCP protokolünü ve 80 ve 443 (HTTPS trafiğiniz varsa) portlarını belirtin.
        
    3.  Gerekirse, **Health Checks** parametre grubunu kullanarak uygunluk kontrollerini yapılandırın.
    
6.  **Next: Register Targets** butonuna tıklayarak bir sonraki adıma geçin. 

    Bu adımda herhangi bir eylem gerekli değildir. 
    
7.  **Next: Review** butonuna tıklayarak bir sonraki adıma geçin.
    
    Tüm parametrelerin doğru bir şekilde belirtildiğinden emin olun ve **Create** butonuna tıklayarak Yük Dengeleyici oluşturma işlemini başlatın.

!!! info "Yük Dengeleyicinin başlatılmasını bekleyin"
    Yük Dengeleyicisi oluşturulduktan sonra, trafiği alabilmesi için biraz zaman geçmelidir.

##  2.  Oluşturulan Dengeleyiciyi Kullanmak İçin Bir Auto Scaling Grubu Ayarlamak

Auto Scaling Grubunuzu, daha önce oluşturduğunuz Yük Dengeleyiciyi kullanacak şekilde yapılandırın. Bu, dengeleyicinin trafiği grupta başlatılan filtreleme düğümü örneklerine yönlendirmesini sağlayacaktır.

Bunu yapmak için, aşağıdaki eylemleri tamamlayın:
1.  Amazon EC2 panelinde **Auto Scaling Groups** sekmesine gidin ve daha önce [oluşturulan][link-doc-asg-guide] Auto Scaling Grubunu seçin.

2.  **Actions** açılır menüsünde *Edit* seçeneğini seçerek grubun yapılandırma düzenleme iletişim kutusunu açın. 

3.  Yük Dengeleyici ayarlanırken [oluşturulan][anchor-create] **demo-target** hedef grubunu **Target groups** açılır listesinde seçin.

4.  **Save** butonuna tıklayarak değişiklikleri uygulayın.

Şimdi, dinamik olarak ölçeklendirilen Wallarm filtreleme düğümleri seti, uygulamanıza gelen trafiği işleyecek.

Konuşlandırılan filtreleme düğümlerinin işlemini kontrol etmek için aşağıdaki adımları gerçekleştirin:

1.  Uygulamanızın, dengeleyicinin IP adresine veya alan adına tarayıcı kullanarak başvurularak, Yük Dengeleyici ve Wallarm filtreleme düğümleri üzerinden erişilebilir olduğundan emin olun.

2.  Wallarm hizmetlerinin uygulamanızı koruduğundan emin olmak için [bir test saldırısı gerçekleştirin][link-docs-check-operation].

![Filtreleme düğümü işleminin kontrolü][img-checking-operation]