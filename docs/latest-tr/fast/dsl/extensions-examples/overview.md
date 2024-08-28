[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:     ../using-extension.md

#   FAST Uzantılarının Örnekleri: Genel Bakış

Zayıf web uygulaması [OWASP Juice Shop][link-juice-shop] FAST uzantı mekanizmasının yeteneklerini göstermek için kullanılacak.

Bu uygulama, çeşitli yollarla (örneğin, Docker, Node.JS veya Vagrant kullanarak) [dağıtılabilir][link-juice-shop-deploy].

OWASP Juice Shop belgelerini, içerisinde yerleşik olan zayıflıkların listesini görmek için, aşağıdaki [bağlantıya][link-juice-shop-docs] ilerleyin.

!!! warning "Zayıf bir uygulamayla çalışma"
    OWASP Juice Shop'a ev sahipliği yapan makinenin internet erişimi veya gerçek verilere (örneğin, kullanıcı adı/şifre çiftleri) sahip olmasını önlemenizi öneririz.

“OWASP Juice Shop” hedef uygulamasını zayıflıklar için test etmek için aşağıdaki adımları uygulayın:

1.  Web uygulamasını [inceleyin][link-app-examination] ve davranışıyla tanışın.
2.  Bir örnek değiştirici uzantı [oluşturun][link-mod-extension].
3.  Bir örnek değiştirici olmayan uzantı [oluşturun][link-non-mod-extension].
4.  Oluşturulan uzantıları [kullanın][link-using-extension].

!!! info "İstek elementlerinin tanım sözdizimi"
    Bir FAST uzantısı oluştururken, uygulamaya giden HTTP isteğinin yapısını ve uygulamadan alınan HTTP yanıtının yapısını anlamanız ve çalışmak istediğiniz istek elementlerini doğru bir şekilde tanımlamak için noktaları kullanmanız gerekmektedir.
    
    Detaylı bilgi için bu [bağlantıya][link-points] ilerleyin.