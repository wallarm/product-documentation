# Shadow, Orphan, Zombie API <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md) modülü, yüklediğiniz spesifikasyonu canlı trafiğe karşılaştırarak otomatik olarak shadow, orphan ve zombie API'leri tespit eder.

|Rogue API türü | Nedir? |
|--|--|
| [Shadow API](#shadow-api) | Organizasyon altyapısı içinde, uygun yetkilendirme veya denetim olmaksızın var olan belgelenmemiş API.|
| [Orphan API](#orphan-api) | Trafik almayan, belgelenmiş API. |
| [Zombie API](#zombie-api) | Herkesin devre dışı bırakıldığını düşündüğü, aslında hala kullanılan deprecated API'ler. |

![API Discovery - rogue API'leri vurgulama ve filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## Setup

Rogue API'lerini bulmaya başlamak için, spesifikasyonu yüklemeniz, rogue API tespitinde kullanılacağını seçmeniz ve tespit parametrelerini ayarlamanız gerekir.

Hem spesifikasyon hem de API zamanla değiştiği için, aşağıdakileri göz önünde bulundurun:

* Karşılaştırma ilk kurulumdan sonra başlar.
* Herhangi bir [API değişikliği](track-changes.md) tespit edilirse karşılaştırma yeniden başlatılır.
* Yeni ayarları kaydettiğinizde karşılaştırma yeniden başlatılır.
* Yeni dosya seçerseniz (isim veya tam URI ile) karşılaştırma yeniden başlatılır.
* URI'den yüklenen dosyada değişiklik varsa ve **Spesifikasyonu düzenli olarak güncelle** (her saat) seçeneği işaretlendiyse karşılaştırma yeniden başlatılır.
* Spesifikasyon menüsü üzerinden **Karşılaştırmayı yeniden başlat** seçeneğini kullanarak karşılaştırmayı istediğiniz an yeniden başlatabilirsiniz.

Ayrıca, daha önce yüklediğiniz spesifikasyonu **API Specifications** → spesifikasyon detay penceresi → **Spesifikasyonu indir** üzerinden indirebilirsiniz.

### Adım 1: Spesifikasyonu yükleyin

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/) veya [EU Cloud](https://my.wallarm.com/api-specifications/) üzerindeki **API Specifications** bölümünde **Upload specification** butonuna tıklayın.
2. Spesifikasyon yükleme parametrelerini ayarlayın ve yüklemeyi başlatın.

    ![Spesifikasyonu yükle](../images/api-specification-enforcement/specificaton-upload.png)

Spesifikasyon dosyası başarıyla yüklenene kadar rogue API tespitini yapılandıramayacağınızı unutmayın.

### Adım 2: Rogue API tespit parametrelerini ayarlayın

1. **Rogue APIs detection** sekmesine tıklayın.

    !!! info "API specification enforcement"
        Rogue API tespitinin yanı sıra, spesifikasyonlar [API specification enforcement](../api-specification-enforcement/overview.md) için de kullanılabilir.

2. **Use for rogue APIs detection** seçeneğini işaretleyin.
3. **Applications** ve **Hosts** seçeneklerini seçin - yalnızca seçilen host'lara ait uç noktalar rogue API'ler için aranacaktır.

    ![API Discovery - API Specifications - rogue API'leri bulmak için API spesifikasyonu yükleniyor](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

### Devre Dışı Bırakma

Rogue API tespiti, **Use for rogue APIs detection** seçeneği işaretli olan yüklenmiş bir veya birkaç spesifikasyona dayanmaktadır. Bu seçeneğin bazı spesifikasyonlar için işaretinin kaldırılması veya ilgili spesifikasyonun silinmesi aşağıdaki sonuçlara yol açacaktır:

* Bu spesifikasyona dayalı rogue API tespitinin durması ve 
* Önceden bu spesifikasyona dayalı olarak tespit edilen rogue API'lere ait **tüm verilerin kaldırılması**

## Bulunan Rogue API'leri Görüntüleme

Karşılaştırma tamamlandığında, **API Specifications** listesindeki her bir spesifikasyon için rogue (shadow, orphan ve zombie) API sayısı görüntülenecektir.

![API Specifications bölümü](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

Ayrıca rogue API'ler **API Discovery** bölümünde görüntülenecektir. Seçilen karşılaştırmalara ait, yalnızca shadow, orphan ve/veya zombie API'leri görmek için **Rogue APIs** filtresini kullanabilir, diğer uç noktaları filtreleyebilirsiniz.

![API Discovery - rogue API'leri vurgulama ve filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

Böyle uç noktaların detaylarında, **Specification conflicts** bölümünde shadow/zombie/orphan tespiti için kullanılan spesifikasyon(lar) belirtilir.

Shadow API'ler [API Discovery Dashboard](dashboard.md)'da en riskli uç noktalar arasında görüntülenmektedir.

## Spesifikasyon sürümleri ve zombie API'ler

Shadow ve orphan API'lerin aksine, [zombie API](#zombie-api) farklı spesifikasyon sürümlerinin karşılaştırılmasını gerektirir:

* Eğer [kurulum](#setup) sırasında **Spesifikasyonu düzenli olarak güncelle** seçeneği işaretlendiyse, spesifikasyonun barındırıldığı URL'e sadece yeni sürümü koymanız yeterli olacaktır - bu işlem saatlik takvimle veya spesifikasyon menüsünden **Karşılaştırmayı yeniden başlat** seçeneğini tıklarsanız hemen işlenecektir.
* **Spesifikasyonu düzenli olarak güncelle** seçeneği işaretlenmediyse:

    * URL'den yükleme yapılıyorsa ve orada yeni içerik varsa, sadece **Karşılaştırmayı yeniden başlat** butonuna tıklayın.
    * Yerel makinadan yükleme yapılıyorsa, spesifikasyon diyaloğunu açın, yeni dosyayı seçin ve değişiklikleri kaydedin. Dosyanın farklı bir adı olmalıdır.

Listelenen tüm durumlar, yeni içeriği spesifikasyonun yeni sürümü olarak kabul edecektir. Sürümler karşılaştırılacak ve zombie API görüntülenecektir.

## Birden Fazla Spesifikasyon ile Çalışma

API'nizin farklı yönlerini tanımlamak için ayrı ayrı birkaç spesifikasyon kullanıyorsanız, bunların birkaçını veya tamamını Wallarm'a yükleyebilirsiniz.

**API Discovery** bölümünde, **Compare to...** filtresini kullanarak spesifikasyon karşılaştırmalarını seçin - rogue API'ler yalnızca bu karşılaştırmalar için **Issues** sütununda özel işaretlerle vurgulanacaktır.

![API Discovery - rogue API'leri vurgulama ve filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## Bildirim Alma

[SIEM, SOAR, log yönetim sistemi veya messenger](../user-guides/settings/integrations/integrations-intro.md) üzerinden yeni keşfedilen rogue API'ler hakkında anında bildirim almak için, Wallarm Console'daki **Triggers** bölümünde **Rogue API detected** koşuluna sahip bir veya daha fazla tetikleyici yapılandırın.

Yeni keşfedilen shadow, orphan veya zombie API'ler veya bunların hepsi hakkında mesaj alabilirsiniz. Ayrıca, izlemek istediğiniz uygulama veya host ve tespitlerinde kullanılan spesifikasyona göre bildirimi daraltabilirsiniz.

**Bildirimlerin gönderim şekli**
    
* Her yeni tespit edilen rogue API 1 bildirim mesajı oluşturur.
* Aynı rogue API hakkında zaten bildirim aldıysanız, karşılaştırma kaç kere çalıştırılırsa çalıştırılsın tekrar gönderilmez.
* Yüklenen spesifikasyonun ayarlarını güncellerseniz, tüm **orphan** API'lere ait bildirimler yeniden gönderilir (bu durum shadow veya zombie API'ler için geçerli değildir).

**Tetikleyici örneği: Slack'de yeni keşfedilen shadow uç noktalar hakkında bildirim**

Bu örnekte, API Discovery `Specification-01` içerisinde listelenmeyen yeni uç noktaları (shadow API'ler) tespit ederse, bu durum Slack kanalınıza yapılandırılmış olan bildirimle gönderilir.

![Rogue API detected trigger](../images/user-guides/triggers/trigger-example-rogue-api.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console → **Integrations** bölümüne [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) cloud üzerinden gidin ve [Slack ile entegrasyon](../user-guides/settings/integrations/slack.md) yapılandırmasını gerçekleştirin.
2. **API Discovery** bölümünde, istediğiniz API host'una göre uç noktaları filtreleyin, ardından sonuçları bir spesifikasyon olarak indirin ve adını `Specification-01` olarak belirleyin.
3. **API Specifications** bölümünde, karşılaştırma için `Specification-01` dosyasını yükleyin.
4. **Triggers** bölümünde, yukarıda gösterildiği gibi bir tetikleyici oluşturun.
5. Yerel `Specification-01` dosyanızdan bazı uç noktaları silin.
6. **API Specifications** bölümünde, karşılaştırma için `Specification-01` dosyanızı yeniden yükleyin.
7. Uç noktanızın **Issues** sütununda shadow API işareti aldığını kontrol edin.
8. Slack kanalınızdaki mesajları kontrol edin. Örneğin:

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

## Rogue API türleri ve riskler

### Shadow API

**Shadow API**, organizasyon altyapısı içinde, uygun yetkilendirme veya denetim olmaksızın var olan belgelenmemiş API'ye atıfta bulunur.

Shadow API'ler, saldırganların kritik sistemlere erişim sağlaması, değerli verileri çalması veya operasyonları aksatması gibi durumlarla işletmeleri riske atabilir; ayrıca API'ler kritik veriye erişimin kapısı olarak işlev gördüğünden ve OWASP API açıklarının API güvenliğini aşmak için kullanılabilmesinden dolayı risk daha da artmaktadır.

Yüklenen API spesifikasyonlarınıza göre, shadow API, gerçek trafikte yer alan (API Discovery tarafından tespit edilen) ancak spesifikasyonunuzda yer almayan uç noktadır.

Wallarm ile shadow API tespit ettikçe, eksik uç noktaları içerecek şekilde spesifikasyonlarınızı güncelleyip, API envanterinizi tam görünümle izleme ve güvenlik faaliyetlerini sürdürebilirsiniz.

### Orphan API

**Orphan API**, trafik almayan, belgelenmiş API'ye atıfta bulunur.

Orphan API'lerin varlığı, şu adımları içerebilecek bir doğrulama sürecinin nedeni olabilir:

* Gerçekten trafik alınıp alınmadığını veya Wallarm düğümleri tarafından trafiğin görünür olup olmadığını (düğümlerin, tüm trafiğin üzerinden geçtiği şekilde dağıtılmaması, yanlış trafik yönlendirmesi veya başka bir Web Gateway'in unutulmuş olması gibi) anlamak için Wallarm trafik kontrol ayarlarının incelenmesi.
* Belirli uç noktaların bazı uygulamalar tarafından hiç trafik almaması mı gerektiğini yoksa bir yapılandırma hatası mı olduğunu belirlemek.
* Artık kullanılmayan uç noktalar üzerine karar vermek: önceki uygulama sürümlerinde kullanılan ancak güncel sürümde kullanılmayan uç noktaların spesifikasyondan silinip silinmemesi, böylece güvenlik kontrol çabalarının azaltılması.

### Zombie API

**Zombie API**, herkesin devre dışı bırakıldığını düşündüğü fakat aslında hala kullanımda olan deprecated API'lere atıfta bulunur.

Zombie API riskleri, belgelenmemiş (shadow) API'lerdeki risklere benzer ancak devre dışı bırakılma nedenlerinin genellikle daha kolay kırılabilen güvensiz tasarımlardan kaynaklanması nedeniyle daha büyük olabilir.

Yüklenen API spesifikasyonlarınıza göre, zombie API, önceki sürümünüzde yer alan, mevcut sürümde bulunmayan (yani, bu uç noktanın silinmesi niyet edilmiş olsa da) ancak gerçek trafikte halen var olan uç noktadır (API Discovery tarafından tespit edilir).

Wallarm ile zombie API tespit etmek, uygulamalarınızın API yapılandırmasını yeniden kontrol etmek için bir neden olabilir; böylece bu uç noktaların gerçekten devre dışı bırakıldığından emin olabilirsiniz.