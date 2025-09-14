# Gölge, Yetim, Zombi API <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md) modülü, yüklediğiniz spesifikasyonu canlı trafikle karşılaştırarak shadow, orphan ve zombie API'leri otomatik olarak belirler.

|Rogue API türü | Nedir? |
|--|--|
| [Shadow API](#shadow-api) | Bir kuruluşun altyapısında uygun yetkilendirme veya denetim olmaksızın var olan, belgelenmemiş bir API.|
| [Orphan API](#orphan-api) | Trafik almayan, belgelenmiş bir API. |
| [Zombie API](#zombie-api) | Herkesin devre dışı bırakıldığını varsaydığı ancak aslında hâlâ kullanılan kullanımdan kalkmış API'ler. |

![API Discovery - Rogue API'yi vurgulama ve filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## Setup

Rogue API'leri bulmaya başlamak için bir spesifikasyon yüklemeniz, rogue API tespiti için kullanılacak şekilde seçmeniz ve tespit parametrelerini ayarlamanız gerekir.

Hem spesifikasyon hem de API zaman içinde değiştiğinden, aşağıdakileri dikkate alın:

* Karşılaştırma ilk kurulumdan sonra başlar
* [API'de değişiklikler](track-changes.md) bulunursa karşılaştırma yeniden başlar
* Onun için yeni ayarları kaydederseniz karşılaştırma yeniden başlar
* Yeni dosya seçerseniz (ada veya tam URI'ye göre) karşılaştırma yeniden başlar
* URI'den yüklenen dosya değişmişse ve **Regularly update the specification** (her saat) seçeneği işaretliyse karşılaştırma yeniden başlar

    URI kullanılamayabilir veya güncellenen spesifikasyon dosyası API spesifikasyon sözdizimine uygun olmayabilir; otomatik güncelleme sırasında bir hata oluşabilir. Bu tür hatalar hakkında bildirim almak için, yapılandırdığınız [**Integrations**](../user-guides/settings/integrations/integrations-intro.md) içinde **System related** olaylarını seçin—spesifikasyon yükleme hatalarına ilişkin bildirimler bu kategoriye dahildir.

* Spesifikasyon menüsü → **Restart comparison** üzerinden karşılaştırmayı istediğiniz an yeniden başlatabilirsiniz.

Ayrıca daha önce yüklenmiş spesifikasyonu **API Specifications** → spesifikasyon ayrıntıları penceresi → **Download specification** üzerinden indirebilirsiniz.

### Adım 1: Spesifikasyon yükleme

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/) veya [EU Cloud](https://my.wallarm.com/api-specifications/) içindeki **API Specifications** bölümünde **Upload specification**'ı tıklayın.
1. Spesifikasyon yükleme parametrelerini ayarlayın ve yüklemeyi başlatın.

    ![Spesifikasyon yükleme](../images/api-specification-enforcement/specificaton-upload.png)

Spesifikasyon dosyası, API spesifikasyon sözdizimine uygunluk açısından kontrol edilir ve geçerli değilse yüklenmez. Spesifikasyon dosyası başarıyla yüklenene kadar rogue API tespitini yapılandırmaya başlayamayacağınızı unutmayın.

Spesifikasyonu bir URI'den yüklemeyi ve **Regularly update the specification** (her saat) seçeneğini seçerseniz, düzenli güncelleme sırasında hatalar oluşabilir: URI kullanılamayabilir veya güncellenen spesifikasyon dosyası API spesifikasyon sözdizimine uygun olmayabilir. Bu tür hatalar hakkında bildirim almak için, yapılandırdığınız [**Integrations**](../user-guides/settings/integrations/integrations-intro.md) içinde **System related** olaylarını seçin—spesifikasyon yükleme hatalarına ilişkin bildirimler bu kategoriye dahildir.

### Adım 2: Rogue API tespit parametrelerini ayarlayın

1. **Rogue APIs detection** sekmesini tıklayın.

    !!! info "API spesifikasyon zorlaması"
        Rogue API tespitinin yanı sıra, spesifikasyonlar [API specification enforcement](../api-specification-enforcement/overview.md) için de kullanılabilir.

1. **Use for rogue APIs detection** seçeneğini işaretleyin.
1. **Applications** ve **Hosts** seçin - yalnızca seçilen host'larla ilişkili uç noktalar rogue API'ler için aranacaktır.

    ![API Discovery - Rogue API'leri bulmak için API spesifikasyonunu yükleme](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

### Devre dışı bırakma

Rogue API tespiti, yüklenen spesifikasyona veya **Use for rogue APIs detection** seçeneği işaretli birden çok spesifikasyona dayanır. Bu seçeneğin işaretini bazı spesifikasyonlar için kaldırmanın veya bu spesifikasyonu silmenin şu sonuçlara yol açacağını dikkate alın:

* Bu spesifikasyona dayalı rogue API tespitinin durması ve 
* Daha önce bu spesifikasyona dayanarak bulunan rogue API'lere ait **tüm verilerin kaldırılması**

## Bulunan Rogue API'leri görüntüleme

Karşılaştırma tamamlandığında, **API Specifications** listesindeki her spesifikasyon için rogue (shadow, orphan ve zombie) API sayısı görüntülenecektir.

![API Specifications bölümü](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

Ayrıca rogue API'ler **API Discovery** bölümünde de görüntülenir. Seçilen karşılaştırmalarla ilişkili yalnızca shadow, orphan ve/veya zombie API'leri görmek ve kalan uç noktaları filtrelemek için **Rogue APIs** filtresini kullanın.

![API Discovery - Rogue API'yi vurgulama ve filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

Bu tür uç noktaların ayrıntılarında, **Specification conflicts** bölümünde, shadow/zombie/orphan tespitinde kullanılan spesifikasyon(lar) belirtilir.

Shadow API'ler ayrıca [API Discovery Dashboard](dashboard.md) üzerinde en riskli uç noktalar arasında görüntülenir.

## Spesifikasyon sürümleri ve zombie API'ler

Shadow ve orphan API'lerin aksine, [zombie API'ler](#zombie-api) farklı spesifikasyon sürümlerinin karşılaştırılmasını gerektirir:

* [setup](#setup) sırasında **Regularly update the specification** seçeneği işaretlendiyse, spesifikasyonunuzu barındırdığınız URL'ye yeni sürümü koymanız yeterlidir - saatlik plana göre veya spesifikasyon menüsünden **Restart comparison** seçerseniz hemen işlenecektir.
* **Regularly update the specification** seçeneği işaretlenmediyse:

    * URL'den yükleme yapıyor ve orada yeni içerik varsa, sadece **Restart comparison**'ı tıklayın
    * Yerel makineden yükleme yapıyorsanız, spesifikasyon penceresini açın, yeni dosyayı seçin ve değişiklikleri kaydedin. Dosyanın adı farklı olmalıdır.

Yukarıdakilerin tümü yeni içeriği spesifikasyonun bir sonraki sürümü olarak kabul edecektir. Sürümler karşılaştırılacak ve zombie API görüntülenecektir.

## Birden çok spesifikasyonla çalışma

API'nizin farklı yönlerini tanımlamak için birden fazla ayrı spesifikasyon kullanmanız durumunda, bunların birkaçını veya tümünü Wallarm'a yükleyebilirsiniz.

**API Discovery** bölümünde, spesifikasyon karşılaştırmalarını seçmek için **Compare to...** filtresini kullanın - yalnızca bu karşılaştırmalar için **Issues** sütununda özel işaretlerle rogue API'ler vurgulanacaktır.

![API Discovery - Rogue API'yi vurgulama ve filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## Bildirim alma

Yeni keşfedilen rogue API'ler hakkında [SIEM, SOAR, günlük yönetim sistemi veya mesajlaşma aracınıza](../user-guides/settings/integrations/integrations-intro.md) anında bildirim almak için, Wallarm Console'un **Triggers** bölümünde **Rogue API detected** koşuluna sahip bir veya daha fazla tetikleyici (trigger) yapılandırın.

Yeni keşfedilen shadow, orphan veya zombie API'ler hakkında ayrı ayrı ya da hepsi hakkında mesajlar alabilirsiniz. Ayrıca izlemek istediğiniz uygulama veya host'a ve tespitlerinde kullanılan spesifikasyona göre bildirimleri daraltabilirsiniz.

**Bildirimlerin iletilme şekli**
    
* Bulunan her yeni rogue API 1 bildirim mesajı üretir
* Daha önce bir rogue API hakkında bildirim aldıysanız, karşılaştırma kaç kez çalıştırılırsa çalıştırılsın yeniden gönderilmez
* Yüklenen spesifikasyonun ayarlarını güncellerseniz, tüm **orphan** API'lere ilişkin bildirimler yeniden gönderilir (bu, shadow veya zombie API'ler için geçerli değildir)

**Tetikleyici örneği: Slack'te yeni keşfedilen shadow uç noktalar hakkında bildirim**

Bu örnekte, API Discovery `Specification-01` içinde listelenmeyen yeni uç noktalar bulursa (shadow API'ler), bununla ilgili bildirim yapılandırdığınız Slack kanalınıza gönderilir.

![Rogue API detected tetikleyicisi](../images/user-guides/triggers/trigger-example-rogue-api.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console → [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) cloud'daki **Integrations** bölümüne gidin ve [Slack ile entegrasyonu](../user-guides/settings/integrations/slack.md) yapılandırın.
1. **API Discovery** bölümünde uç noktaları seçtiğiniz bir API host'una göre filtreleyin, ardından sonuçları bir spesifikasyon olarak indirin ve adını `Specification-01` koyun.
1. **API Specifications** bölümünde karşılaştırma için `Specification-01`'i yükleyin.
1. **Triggers** bölümünde yukarıda gösterildiği gibi bir tetikleyici oluşturun.
1. Yerel `Specification-01` dosyanızdan bazı uç noktaları silin.
1. **API Specifications** içinde `Specification-01`'inizi karşılaştırma için yeniden yükleyin.
1. Uç noktanızın **Issues** sütununda shadow API işaretini aldığını kontrol edin.
1. Slack kanalınızdaki şu tür mesajları kontrol edin:

    ```
    [wallarm] A new shadow endpoint has been discovered in your API

    Notification type: api_comparison_result

    The new GET example.com/users shadow endpoint has been discovered in your API.

        Client: Client-01
        Cloud: US

        Details:

          application: Application-01
          api_host: example.com
          endpoint_path: /users
          http_method: GET
          type_of_endpoint: shadow
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
          specification_name: Specification-01
    ```

## Rogue API türleri ve riskleri

### Shadow API

**Shadow API**, bir kuruluşun altyapısında uygun yetkilendirme veya denetim olmaksızın var olan, belgelenmemiş bir API'yi ifade eder.

Shadow API'ler işletmeleri riske atar; saldırganlar bunları kritik sistemlere erişmek, değerli verileri çalmak veya operasyonları kesintiye uğratmak için kötüye kullanabilir. Bu risk, API'lerin genellikle kritik verilerin bekçisi olarak hareket etmesi ve çeşitli OWASP API güvenlik açıklarının API güvenliğini atlatmak için istismar edilebilmesi gerçeğiyle daha da artar.

Yüklediğiniz API spesifikasyonları açısından shadow API, gerçek trafikte bulunan (API Discovery tarafından tespit edilen) ancak spesifikasyonunuzda yer almayan bir uç noktadır.

Wallarm ile shadow API'leri buldukça, eksik uç noktaları içerecek şekilde spesifikasyonlarınızı güncelleyebilir ve API envanterinizin tam görünümünde izleme ve güvenlik faaliyetlerini yürütebilirsiniz.

### Orphan API

**Orphan API**, trafik almayan belgelenmiş bir API'yi ifade eder.

Orphan API'lerin varlığı, şu adımları içeren bir doğrulama sürecinin nedeni olabilir:

* Trafiğin gerçekten alınmadığını mı yoksa Wallarm düğümlerine görünmediğini mi anlamak için Wallarm trafik kontrol ayarlarının incelenmesi (tüm trafik düğümlerden geçmeyecek şekilde konuşlandırılmış olabilir; bu hatalı trafik yönlendirmesi olabilir veya üzerine düğüm koymanın unutulduğu başka bir Web Gateway bulunuyor olabilir vb.).
* Belirli uygulamaların belirli uç noktalarda trafik almaması gerekip gerekmediğinin veya bir yanlış yapılandırmanın söz konusu olup olmadığının belirlenmesi.
* Eskimiş uç noktalar hakkında karar verilmesi: önceki uygulama sürümlerinde kullanılan ancak mevcut sürümde kullanılmayanlar—güvenlik kontrol çabasını azaltmak için spesifikasyondan silinmeli mi?

### Zombie API

**Zombie API**, herkesin devre dışı bırakıldığını varsaydığı ancak aslında hâlâ kullanılan kullanımdan kalkmış API'leri ifade eder.

Zombie API riskleri, belgelenmemiş (shadow) API'lerle benzerdir ancak çoğu zaman daha kötüdür; çünkü devre dışı bırakılma gerekçesi genellikle daha kolay ihlal edilebilen güvensiz tasarımlardır.

Yüklediğiniz API spesifikasyonları açısından zombie API, spesifikasyonunuzun önceki sürümünde bulunan ancak mevcut sürümde bulunmayan (yani bu uç noktanın silinmesi amaçlanmış) ancak gerçek trafikte hâlâ bulunan (API Discovery tarafından tespit edilen) bir uç noktadır.

Wallarm ile zombie API bulmak, bu tür uç noktaları gerçekten devre dışı bırakmak için uygulamalarınızın API yapılandırmasını yeniden kontrol etme nedeni olabilir.