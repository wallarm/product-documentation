# Wallarm Platformu ile Başlarken

Wallarm, uçtan uca API güvenliği sunar; API’lerinizi zafiyetler ve kötü amaçlı faaliyetlere karşı belirler ve korur. Platformu kullanmaya başlamanıza yardımcı olmak için kayıt olmadan önce keşif yapabileceğiniz bir Playground, kayıtla birlikte bir Free Tier ve sorunsuz bir deneyim için uzman desteğine erişim sunuyoruz.

## Playground’da Wallarm’ı Öğrenin

Kayıt olmadan ve ortamınıza herhangi bir bileşen dağıtmadan Wallarm’ı keşfetmek için [Wallarm Playground](https://tour.playground.wallarm.com/?utm_source=wallarm_docs_quickstart) kullanın.

Playground’da, sanki gerçek verilerle doldurulmuş gibi Wallarm Console görünümüne erişebilirsiniz. Wallarm Console, işlenen trafik verilerini gösteren ve platformun ince ayarına olanak tanıyan temel Wallarm platform bileşenidir. Bu nedenle Playground ile ürünün nasıl çalıştığını öğrenebilir ve deneyebilir, yalnızca-okunur modda kullanımına dair faydalı örnekler elde edebilirsiniz.

![Playground](../images/playground.png)

Wallarm çözümünün yeteneklerini kendi trafiğiniz üzerinde denemek için, [Security Edge Free Tier hesabı oluşturun](#self-signup-and-security-edge-free-tier).

## Kendi kendine kayıt ve Security Edge Free Tier

Wallarm’a kaydolurken, Wallarm platformunda gezinmek ve yapılandırmak için merkezi merkez işlevi gören Wallarm Console içinde bir hesap oluşturursunuz. Console UI, [Wallarm Cloud](../about-wallarm/overview.md#cloud) üzerinde barındırılır.

Her yeni hesap otomatik olarak [Security Edge Free Tier](../about-wallarm/subscription-plans.md#security-edge-free-tier) kapsamına alınır ve bu da size aylık **500 bin istek**i ücretsiz sağlar.

1. Wallarm Cloud’unuzu seçin:

    || US Cloud | EU Cloud |
    | -- | -------- | -------- |
    | **Kayıt bağlantısı** | https://us1.my.wallarm.com/signup | https://my.wallarm.com/signup |
    | **Fiziksel konum** | USA | Netherlands |
    | **Wallarm Console URL’si** | https://us1.my.wallarm.com/ | https://my.wallarm.com/ |
    | **Wallarm API Endpoint’i** | `https://us1.api.wallarm.com/` | `https://api.wallarm.com/` |
1. Kayıt bağlantısını takip edin ve kişisel bilgilerinizi girin.
1. Trafiğinizin analizine ücretsiz başlamak için [Security Edge Inline veya Connectors](../installation/security-edge/free-tier.md) yapılandırın:

    ![!](../images/waf-installation/security-edge/onboarding-wizard.png)

## Dağıtım gerektirmeden API’nizi tanıyın

Kuruluşunuzun dışa açık tüm API’lerinin tam listesini bilmek, potansiyel güvenlik risklerini azaltmanın ilk adımıdır; çünkü izlenmeyen veya belgelenmeyen API’ler kötü amaçlı saldırılar için potansiyel giriş noktaları olabilir.

Tüm dış ana bilgisayarlarınızı ve bunların API’lerini anında keşfetmek ve şunları elde etmek için Wallarm’ın [API Attack Surface Management (AASM)](../api-attack-surface/overview.md)’ine abone olun:

* Dış ana bilgisayarlarınızın listesi.
* Ana bilgisayarlarınızın koruma puanı - Wallarm, bulunan alt alan adları/ana bilgisayarların web ve API servislerine yönelik saldırılara karşı dayanıklılığını otomatik olarak test eder ve koruma seviyelerini değerlendirir.
* Ana bilgisayarlarınız için sızdırılmış kimlik bilgileri bilgisi - Wallarm, seçtiğiniz alan adlarını ve herkese açık kaynakları kimlik bilgisi verilerinin (API belirteçleri ve anahtarlar, parolalar, istemci sırları, kullanıcı adları, e-postalar ve diğerleri) sızıntıları için aktif olarak tarar.

Tüm bunları, Wallarm içindeki bileşene abone olarak elde edersiniz - bilgilerinize ulaşmak için herhangi bir şey dağıtmanız gerekmez.

Başlamak için aşağıdakilerden birini yapın:

* [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin veya 
* Wallarm’ın resmi sitesinden fiyat bilgisi alın ve AASM’yi [buradan](https://www.wallarm.com/product/aasm) etkinleştirin.

## Rehberli deneme

Tüm onboarding süreci boyunca Sales Engineer ekibimizin size yardımcı olduğu rehberli bir denemeyi tercih edebilirsiniz. Ürünün değerini 2 haftalık bir dönem boyunca gösterecek ve trafiğinizi filtrelemek için Wallarm filtreleme örneklerini devreye almanıza yardımcı olacaklar.

Bu denemeyi talep etmek için lütfen bize [sales@wallarm.com](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.) adresinden e-posta gönderin.