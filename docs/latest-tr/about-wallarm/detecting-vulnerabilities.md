[allowlist-scanner-addresses]: ../user-guides/ip-lists/allowlist.md

# Zafiyetleri Tespit Etmek

Bir uygulamanın oluşturulması veya implemente edilmesi sırasında ihmal veya yetersiz bilgi nedeniyle, saldırılara karşı savunmasız olabilir. Bu makaleden, Wallarm platformunun sistem güvenliğini artırmanızı sağlayacak şekilde uygulama zafiyetlerini nasıl tespit ettiğini öğreneceksiniz.

## Zafiyet nedir?

Bir zafiyet, bir uygulamanın oluşturulması veya implemente edilmesi sırasında ihmal veya yetersiz bilgi nedeniyle yapılan bir hatadır. Bir zafiyet, bir saldırganın bir uygulama içinde ayrıcalık sınırlarını aşmasını (yani yetkisiz eylemler gerçekleştirmesini) sağlayabilir.

## Zafiyet tespit yöntemleri

Uygulamada aktif zafiyetleri tararken, Wallarm saldırı belirtileriyle korunan uygulama adresine istekler gönderir ve uygulama yanıtlarını analiz eder. Yanıt, bir veya daha fazla önceden belirlenmiş zafiyet belirtisiyle eşleşirse, Wallarm aktif bir zafiyet kaydeder.

Örneğin: `/etc/passwd` içeriğini okumak için gönderilen isteğe yanıt, `/etc/passwd` içeriğini döndürürse, korunan uygulama Yol Geçiş saldırılarına karşı savunmasızdır. Wallarm, uygun bir türle zafiyeti kaydeder.

Uygulamadaki zafiyetleri tespit etmek için Wallarm, aşağıdaki yöntemleri kullanarak saldırı belirtileriyle istekler gönderir:

* **Pasif tespit**: güvenlik olayı nedeniyle zafiyet bulundu.
* **Aktif tehdit doğrulama**: saldırganları penetre testçilerinize dönüştürmenize ve uygulamalarınızı / API'lerinizi zafiyetler için test ettikleri faaliyetlerinden olası güvenlik sorunlarını keşfetmenizi sağlar. Bu modül, gerçek saldırı verileri kullanarak uygulama uç noktalarını deneyerek olası zafiyetleri bulur. Varsayılan olarak bu yöntem devre dışıdır.
* **Zafiyet Tarayıcısı**: şirketin açık varlıkları tipik zafiyetler için taranır.

### Pasif tespit

Pasif tespitle, Wallarm bir güvenlik olayı olduğunda bir zafiyet tespit eder. Eğer bir uygulama zafiyeti bir saldırı sırasında sömürüldüyse, Wallarm güvenlik olayını ve sömürülen zafiyeti kaydeder.

Pasif zafiyet tespiti varsayılan olarak etkindir.

### Aktif tehdit doğrulaması <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarm'ın Aktif Tehdit Doğrulaması, saldırganları kendi penetre testçilerinize dönüştürür. İlk saldırı girişimlerini analiz eder, ardından aynı saldırının başka yollarla nasıl sömürülebileceğine dair diğer yolları araştırır. Bu, orijinal saldırganların bile bulamadığı ortamınızdaki zayıf noktaları ortaya çıkarır. [Daha fazla bilgi](../vulnerability-detection/threat-replay-testing/overview.md)

Aktif Tehdit Doğrulama yetenekleri:

* **Gerçek zamanlı test**: Canlı saldırı verilerini kullanarak mevcut ve potansiyel gelecek zayıf noktaları bulur, sizi hackerların bir adım önünde tutar.
* **Güvenli & akıllı simülasyon**: Hassas kimlik doğrulama detaylarını atlar ve testlerde zararlı kodu kaldırır. Maksimum güvenlik için saldırı tekniklerini simüle eder, gerçek zarar riskini yoktur.
* **Güvenli olmayan üretim testleri**: Gerçek üretim verilerini kullanarak bir sahneleme veya geliştirme kurulumunda [zafiyet kontrollerini çalıştırmanızı](../vulnerability-detection/threat-replay-testing/setup.md) sağlar, ancak sistem aşırı yüklenme veya veri ifşası riskleri gibi riskler olmaz.

Modül varsayılan olarak devre dışıdır. Aktive etmek için:

1. Aktif bir **Gelişmiş API Güvenliği** [abonelik planınızın](subscription-plans.md#subscription-plans) olduğundan emin olun. Bu modül yalnızca bu plan altında mevcuttur.

    Eğer başka bir planda bulunuyorsanız, lütfen gerekli olan plana geçmek için bizimle [satış ekibimizle](mailto:sales@wallarm.com) irtibata geçin.
1.  Wallarm Konsolu → **Zafiyetler** → **Yapılandır** bölümüne gidin ve [US Cloud](https://us1.my.wallarm.com/vulnerabilities/active?configure=true) veya [EU Cloud](https://my.wallarm.com/vulnerabilities/active?configure=true) için olan linki takip etmekle, **Aktif tehdit doğrulaması** anahtarını açın.

Ayrıca, belirli uç noktalar için [modülün davranışını ayarlama veya özelleştirme](../vulnerability-detection/threat-replay-testing/setup.md#enable) yeteneğine sahip olacaksınız.

### Zafiyet Tarayıcısı <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### Nasıl çalışır

Zafiyet Tarayıcı, şirketin tüm açık varlıklarını tipik zafiyetler için kontrol eder. Tarayıcı, sabit IP adreslerinden uygulama adreslerine istekler gönderir ve isteklere `X-Wallarm-Scanner-Info` başlığını ekler.

#### Yapılandırma

* Tarayıcı, Wallarm Konsolu → **Zafiyetler** → **Yapılandır** bölümünden [etkinleştirilebilir veya devre dışı bırakılabilir](../user-guides/vulnerabilities.md#configuring-vulnerability-detection). Varsayılan olarak, Tarayıcı etkindir.
* Tarayıcının [tespit edebileceği zafiyetlerin listesi](../user-guides/vulnerabilities.md#configuring-vulnerability-detection), Wallarm Konsolu → **Zafiyetler** → **Yapılandır**da yapılandırılabilir. Varsayılan olarak, Zafiyet Tarayıcısı tüm mevcut zafiyetleri tespit eder.
* Her bir varlık için [Tarayıcıdan gönderilen isteklerin limiti](../user-guides/scanner.md#limiting-vulnerability-scanning), Wallarm Konsolu → **Tarayıcı** → **Yapılandır**da yapılandırılabilir.
* Trafik otomatik filtreleme ve bloklama için ek tesislere (yazılım veya donanım) ihtiyaç duyuyorsanız, Wallarm Tarayıcının IP adreslerini kapsayan bir izin listesi oluşturmanız önerilir. Bu, Wallarm bileşenlerinin kaynaklarınızı zafiyetler için sorunsuzca tarayabilmesini sağlar.

    * [Wallarm US Cloud'a kayıtlı Tarayıcı IP adresi](../admin-en/scanner-addresses.md)
    * [Wallarm EU Cloud'a kayıtlı Tarayıcı IP adresi](../admin-en/scanner-addresses.md)

    Ek tesisler kullanmıyorsanız ama Wallarm Tarayıcısını kullanıyorsanız, Tarayıcı IP adreslerini manuel olarak izin vermeye gerek yoktur. Wallarm node 3.0 ile birlikte, Tarayıcı IP adresleri otomatik olarak izin listesine alınmıştır.

## Yanlış pozitifler

**Yanlış pozitif**, meşru bir istekte saldırı belirtilerinin tespit edilmesi veya meşru bir varlığın bir zafiyet olarak nitelendirilmesi durumunda meydana gelir. [Saldırı tespitindeki yanlış pozitifler hakkında daha fazla bilgi →](protecting-against-attacks.md#false-positives)

Zafiyet taraması sırasında yanlış pozitifler, korunan uygulamanın özelliklerinden dolayı meydana gelebilir. Benzer yanıtlar, bir korunan uygulamada bir zafiyeti ve başka bir korunan uygulamanın beklenen davranışını gösterebilir.

Bir zafiyet için yanlış pozitif tespit edildiyse, zafiyete uygun bir işaret ekleyebilirsiniz. Yanlış pozitif olarak işaretlenen bir zafiyet kapatılır ve tekrar kontrol edilmez.

Tespit edilen zafiyetin korunan uygulamada bulunduğunu, ancak düzeltilemediğini belirliyorsanız, [**Sanal bir düzeltme oluştur**](../user-guides/rules/vpatch-rule.md) kuralını ayarlamanızı öneririz.  Bu kural, tespit edilen zafiyet türünü sömüren saldırıları engelleme ve olay riskini ortadan kaldırma yeteneğine sahip olmanızı sağlar.

## Bulunan zafiyetleri yönetmek

Tespit edilen tüm zafiyetler Wallarm Konsolu → **Zafiyetler** bölümünde görüntülenir. Arayüz üzerinden zafiyetleri aşağıdaki şekillerde yönetebilirsiniz:

* Zafiyetleri görüntüleyin ve analiz edin
* Zafiyet durumu doğrulamasını çalıştırın: uygulama tarafında hala aktif mi veya düzeltilmiş mi
* Zafiyetleri kapatın veya onları yanlış pozitif olarak işaretleyin
 
![Zafiyetler bölümü](../images/user-guides/vulnerabilities/check-vuln.png)   
 
Eğer Wallarm platformunun [**API Keşif** modülünü](../api-discovery/overview.md) kullanıyorsanız, zafiyetler keşfedilen API uç noktalarıyla bağlantılıdır, örneğin:

![API Keşfi - Risk skoru](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

Zafiyetleri yönetme hakkında daha fazla bilgi için, [zafiyetlerle çalışma](../user-guides/vulnerabilities.md) talimatlarına bakın.

## Bulunan zafiyetler hakkında bildirimler

Wallarm size bulunan zafiyetler hakkında bildirimler gönderebilir. Bu, uygulamalarınızdaki yeni keşfedilen zafiyetlerin farkında olmanızı ve onlara hızlı bir şekilde yanıt vermenizi sağlar. Zafiyetlere yanıt verme, onları uygulama tarafında düzeltme, yanlış pozitifleri bildirme ve sanal yamalar uygulama içerir.

Bildirimleri yapılandırmak için:

1. Bildirim gönderme sistemine [yerel integrasyon](../user-guides/settings/integrations/integrations-intro.md) oluşturun (ör. PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Integrasyon kartında, **Zafiyetlerin tespit edildiği** listedeki seçimi seçin.

Tespit edilen bir zafiyet hakkındaki Splunk bildiriminin örneği:

```json
{
    summary:"[Test mesajı] [Test partner(US)] Yeni zafiyet tespit edildi",
    description:"Bildirim türü: vuln

                Sisteminizde yeni bir zafiyet tespit edildi.

                ID: 
                Başlık: Test
                Alan Adı: example.com
                Yol: 
                Yöntem: 
                Keşfeden: 
                Parametre: 
                Tür: Bilgi
                Tehdidi: Orta

                Daha fazla detay: https://us1.my.wallarm.com/object/555


                Müşteri: TestCompany
                Bulut: US
                ",
    details:{
        client_name:"TestCompany",
        cloud:"US",
        notification_type:"vuln",
        vuln_link:"https://us1.my.wallarm.com/object/555",
        vuln:{
            domain:"example.com",
            id:null,
            method:null,
            parameter:null,
            path:null,
            title:"Test",
            discovered_by:null,
            threat:"Orta",
            type:"Bilgi"
        }
    }
}
```
