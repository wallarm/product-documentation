[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:     ../using-extension.md

# FAST Uzantılarının Örnekleri: Genel Bakış

Güvenlik açığı bulunan web uygulaması [OWASP Juice Shop][link-juice-shop], FAST uzantı mekanizmasının yeteneklerini göstermek için kullanılacaktır.

Bu uygulama, çeşitli şekillerde [dağıtılabilir][link-juice-shop-deploy] (örneğin, Docker, Node.JS veya Vagrant kullanarak).

Uygulamaya gömülü güvenlik açıklarını listeleyen OWASP Juice Shop dokümantasyonunu görmek için aşağıdaki [link][link-juice-shop-docs] bağlantısına gidin.

!!! warning "Güvenlik Açığı Bulunan Bir Uygulama ile Çalışma"
    Önerimiz, OWASP Juice Shop'un çalıştığı hosta internet erişimi veya gerçek veriler (örneğin, giriş/parola çiftleri) sağlamamanızdır.

“OWASP Juice Shop” hedef uygulamasını güvenlik açıklarına karşı test etmek için aşağıdaki adımları izleyin:

1.  [Web uygulamasını inceleyin][link-app-examination] ve davranışlarını öğrenin.
2.  [Örnek bir modifiye uzantısı oluşturun.][link-mod-extension]
3.  [Örnek bir değişiklik yapmayan uzantı oluşturun.][link-non-mod-extension]
4.  [Oluşturulan uzantıları kullanın.][link-using-extension]

!!! info "İstek Öğeleri Açıklama Söz Dizimi"
    Bir FAST uzantısı oluştururken, uygulamaya gönderilen HTTP isteğinin yapısını ve uygulamadan alınan HTTP yanıtının yapısını iyi anlamanız gerekmektedir. Bu, üzerinde çalışmanız gereken istek öğelerini points kullanarak doğru şekilde tanımlamanızı sağlar.
    
    Detaylı bilgileri görmek için bu [link][link-points] bağlantısına gidin.