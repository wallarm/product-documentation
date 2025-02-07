# Wallarm Platformuyla Başlangıç

Wallarm, API'lerinizi güvenlik açıkları ve kötü niyetli aktivitelerden koruyan kapsamlı bir API güvenliği sunar. Platformu kullanmaya başlamanıza yardımcı olmak için, kayıt olmadan önce keşif yapabileceğiniz bir Playground, kayıt sırasında **Free tier** ve sorunsuz bir deneyim için uzman desteği sunuyoruz.

## Playground'da Wallarm'ı Öğrenin

Kayıt olmadan ve bileşenleri ortamınıza dağıtmadan önce Wallarm'ı keşfetmek için, [Wallarm Playground](https://playground.wallarm.com/?utm_source=wallarm_docs_quickstart)'u kullanın.

Playground'da, sanki gerçek verilerle doluymuş gibi Wallarm Console görünümüne erişebilirsiniz. Wallarm Console, işlenen trafiğe ait verileri gösteren ve platformun ince ayarlarını yapmanıza olanak tanıyan ana Wallarm platform bileşenidir. Dolayısıyla, Playground ile ürünün nasıl çalıştığını öğrenebilir, deneyebilir ve salt-okunur modda kullanımına dair faydalı örnekler görebilirsiniz.

![Playground](../images/playground.png)

Wallarm çözümünün trafiğiniz üzerindeki yeteneklerini denemek için, [Free tier hesabı oluşturun](#self-signup-and-free-tier).

## Self-signup ve Free tier

Wallarm'a kayıt olduğunuzda, Wallarm Console'da bir hesap oluşturursunuz; bu hesap, Wallarm platformunda gezinme ve yapılandırma işlemleri için merkezi bir merkez görevi görür. Console arayüzü [Wallarm Cloud](../about-wallarm/overview.md#cloud) üzerinde barındırılmaktadır.

Wallarm, veritabanları, API uç noktaları, müşteri hesapları ve daha fazlası açısından farklılık gösteren ayrı Amerikan ve Avrupa bulut örneklerini yönetir. Bu nedenle, ilk adım olarak kullanmak istediğiniz Cloud'u seçmelisiniz.

1. Wallarm Cloud'unuzu seçin:

    || US Cloud | EU Cloud |
    | -- | -------- | -------- |
    | **Signup link** | https://us1.my.wallarm.com/signup | https://my.wallarm.com/signup |
    | **Fiziksel konum** | USA | Netherlands |
    | **Wallarm Console URL** | https://us1.my.wallarm.com/ | https://my.wallarm.com/ |
    | **Wallarm API Endpoint** | `https://us1.api.wallarm.com/` | `https://api.wallarm.com/` |
1. [US](https://us1.my.wallarm.com/signup) veya [EU](https://my.wallarm.com/signup) Wallarm Cloud'undaki kayıt bağlantısını takip edin ve kişisel bilgilerinizi girin.
1. E-postanıza gönderilen onay mesajındaki bağlantıyı takip ederek hesabınızı doğrulayın.

Bir hesap kaydedilip doğrulandıktan sonra, ayda 500 bin istek üzerinde Wallarm çözümünün gücünü ücretsiz olarak keşfetmenizi sağlayan **Free tier** otomatik olarak tanımlanır.

Devam etmek için, [ilk Wallarm filtering node'unuzu](#start-securing-your-traffic) dağıtın.

## Dağıtım Gerektirmeden API'nizi Tanıyın

Kurumunuzun dış API'lerinin tam listesini bilmek, izlenmeyen veya belgelenmemiş API'lerin kötü niyetli saldırılar için potansiyel giriş noktalarına dönüşebileceği göz önüne alındığında, potansiyel güvenlik risklerini azaltmada ilk adımdır.

Wallarm'ın [API Attack Surface Management (AASM)](../api-attack-surface/overview.md)'e abone olarak, tüm dış hostlarınızı ve API'lerini hemen keşfedin ve şunları elde edin:

* Dış hostlarınızın listesi.
* Hostlarınızın koruma puanı - Wallarm, bulunan alt domain/host'ları web ve API hizmetlerine yönelik saldırılara karşı otomatik olarak test eder ve koruma seviyelerini değerlendirir.
* Hostlarınız için sızmış kimlik bilgileri - Wallarm, seçtiğiniz domain'leri ve kamuya açık kaynakları aktif olarak tarayarak kimlik bilgisi sızıntılarını (API tokenları ve anahtarları, şifreler, client secret'lar, kullanıcı adları, e-postalar ve diğerleri) tespit eder.

Tüm bunları, Wallarm içerisindeki bileşene abone olarak kolayca elde edersiniz – bilginizi almak için hiçbir dağıtım yapmanız gerekmez.

Başlamak için aşağıdakilerden birini yapın:

* [sales@wallarm.com](mailto:sales@wallarm.com) adresiyle iletişime geçin veya 
* Fiyat bilgilerini alın ve AASM'yi Wallarm'ın resmi sitesinde [buradan](https://www.wallarm.com/product/aasm) etkinleştirin.

## Rehberli Deneme

Rehberli bir deneme seçeneğini tercih edebilirsiniz; bu süreçte Sales Engineer ekibimiz, tüm onboarding süreciniz boyunca size yardımcı olacaktır. Ürünün değerini 2 haftalık süre zarfında gösterecek ve Wallarm filtering instance'larını trafiğinizi filtrelemeniz için dağıtmanızda destek sağlayacaktır.

Bu denemeyi talep etmek için lütfen [sales@wallarm.com](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.) adresine e-posta gönderin.

## Trafiğinizi Güvence Altına Almaya Başlayın

Wallarm hesabınızı oluşturduktan sonra, sonraki adım [Wallarm filtering node'unuzun](../about-wallarm/overview.md#filtering-node) dağıtımını başlatmaktır. Bu temel bileşen, gelen trafiğinizi işler ve filtreler; böylece Wallarm'ın trafik analizi, saldırı önleme ve zafiyet tespiti yeteneklerini mümkün kılar.

[Bir Wallarm node dağıtım seçeneği seçin](../installation/supported-deployment-options.md)