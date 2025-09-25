[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:     ../using-extension.md


#   FAST Uzantıları Örnekleri: Genel Bakış

FAST uzantı mekanizmasının yeteneklerini göstermek için güvenlik açıkları barındıran [OWASP Juice Shop][link-juice-shop] web uygulaması kullanılacaktır.

Bu uygulama birden fazla şekilde [dağıtılabilir][link-juice-shop-deploy] (örneğin Docker, Node.JS veya Vagrant kullanılarak).

İçerdiği güvenlik açıklarını listeleyen OWASP Juice Shop dokümantasyonunu görmek için şu [bağlantıya][link-juice-shop-docs] gidin.

!!! warning "Güvenlik açığı barındıran bir uygulama ile çalışma"
    OWASP Juice Shop'un çalıştığı ana makineye internet erişimi veya gerçek veriler (örneğin, kullanıcı adı/şifre çiftleri) sağlamaktan kaçınmanızı öneririz.

“OWASP Juice Shop” hedef uygulamasını güvenlik açıklarına karşı test etmek için aşağıdaki adımları uygulayın:

1.  [Web uygulamasını inceleyin][link-app-examination] ve davranışına aşina olun.
2.  [Örnek bir değiştirici uzantı oluşturun.][link-mod-extension]
3.  [Örnek bir değişiklik yapmayan uzantı oluşturun.][link-non-mod-extension]
4.  [Oluşturulan uzantıları kullanın.][link-using-extension]

!!! info "İstek öğelerinin açıklama sözdizimi"
    Bir FAST uzantısı oluştururken, noktaları kullanarak çalışmanız gereken istek öğelerini doğru şekilde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir.
    
    Ayrıntılı bilgi için bu [bağlantıya][link-points] gidin.