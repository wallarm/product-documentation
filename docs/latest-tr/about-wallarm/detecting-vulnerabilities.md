# Güvenlik Açıklarını Tespit Etme

Bir uygulamayı oluştururken veya uygularken ihmalkârlık ya da yetersiz bilgi nedeniyle saldırılara karşı savunmasız olabilir. Bu makalede, Wallarm platformunun uygulama güvenlik açıklarını nasıl tespit ettiğini ve sistem güvenliğini güçlendirmenize nasıl olanak tanıdığını öğreneceksiniz.

## Güvenlik açığı nedir?

Güvenlik açığı, bir uygulama oluşturulurken veya uygulanırken ihmalkârlık ya da yetersiz bilgi nedeniyle yapılan bir hatadır. Bir saldırgan, bir uygulama içinde yetki sınırlarını aşmak (ör. yetkisiz işlemler gerçekleştirmek) için güvenlik açığından yararlanabilir.

## Güvenlik açığı tespit yöntemleri

Uygulama, aktif güvenlik açıkları açısından taranırken Wallarm, korunan uygulamanın adresine saldırı işaretleri taşıyan istekler gönderir ve uygulama yanıtlarını analiz eder. Yanıt, önceden tanımlanmış bir veya daha fazla güvenlik açığı işaretiyle eşleşirse, Wallarm aktif güvenlik açığını kaydeder.

Örneğin: `/etc/passwd` içeriğini okumak için gönderilen isteğin yanıtı gerçekten `/etc/passwd` içeriğini dönerse, korunan uygulama Path Traversal saldırılarına karşı savunmasızdır. Wallarm, uygun türle bir güvenlik açığı kaydedecektir.

Uygulamadaki güvenlik açıklarını tespit etmek için Wallarm aşağıdaki yöntemleri kullanır:

* **Pasif tespit**: gerçek trafiği (istekler ve yanıtlar) analiz ederek güvenlik açıklarını tanımlar. Bu, gerçek bir açığın istismar edildiği bir güvenlik olayı sırasında veya istekler doğrudan istismar olmadan, örneğin ele geçirilmiş JWT’ler gibi güvenlik açığı belirtileri gösterdiğinde gerçekleşebilir.
* **Threat Replay Testing**: saldırganları kendi sızma test uzmanlarınıza dönüştürür ve uygulama/API’lerinizi güvenlik açıkları için yoklarken faaliyetlerinden olası güvenlik sorunlarını keşfetmenizi sağlar. Bu modül, trafikteki gerçek saldırı verilerini kullanarak uygulama uç noktalarını yoklayıp olası güvenlik açıklarını bulur. Varsayılan olarak bu yöntem devre dışıdır.
* **API Attack Surface Management (AASM)**: API’larıyla birlikte harici host’ları keşfeder, her biri için eksik WAF/WAAP çözümlerini ve güvenlik açıklarını belirler.
* **API Discovery içgörüleri**: [API Discovery](../api-discovery/overview.md) modülünün GET isteklerinin sorgu parametrelerinde Kişisel Tanımlanabilir Bilgiler (PII) aktarımı nedeniyle bulduğu güvenlik açığı.

### Pasif tespit

Pasif tespit, istekler ve yanıtlar dahil olmak üzere gerçek trafiği analiz ederek güvenlik açıklarını tanımlamaya karşılık gelir. Kötü amaçlı bir isteğin bir açığı başarıyla istismar ettiği bir güvenlik olayı sırasında hem olay hem de güvenlik açığı tespit edilebilir. Ya da istekler, doğrudan istismar olmaksızın, örneğin ele geçirilmiş JWT’ler gibi güvenlik açığı belirtileri gösterdiğinde.

Pasif güvenlik açığı tespiti varsayılan olarak etkindir.

### Threat Replay Testing <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarm’ın Threat Replay Testing özelliği saldırganları kendi sızma test uzmanlarınıza dönüştürür. İlk saldırı girişimlerini analiz eder, ardından aynı saldırının istismar edilebileceği diğer yolları keşfeder. Bu, orijinal saldırganların bile bulamadığı zayıf noktaları ortaya çıkarır. [Daha fazla bilgi](../vulnerability-detection/threat-replay-testing/overview.md)

Threat Replay Testing’in yetenekleri:

* **Gerçek zamanlı test**: Canlı saldırı verilerini kullanarak mevcut ve gelecekte ortaya çıkabilecek zayıf noktaları saptar, sizi saldırganların bir adım önünde tutar.
* **Güvenli ve akıllı simülasyon**: Testlerde hassas kimlik doğrulama ayrıntılarını atlar ve zararlı kodu çıkarır. Gerçek zarara yol açmadan maksimum güvenlik için saldırı tekniklerini simüle eder.
* **Güvenli üretim dışı testler**: Gerçek üretim verilerini kullanarak ancak sistem aşırı yüklenmesi veya veri ifşası gibi riskler olmadan [sahneleme (staging) veya geliştirme ortamında güvenlik açığı kontrolleri çalıştırmanızı sağlar](../vulnerability-detection/threat-replay-testing/setup.md).

### API Attack Surface Management (AASM)

#### Nasıl çalışır

Wallarm’ın [API Attack Surface Management](../api-attack-surface/overview.md) (AASM) çözümü, API ekosistemine özel, ajan gerektirmeyen bir tespit çözümüdür; harici host’ları ve API’larını keşfetmek, eksik WAF/WAAP çözümlerini belirlemek ve API Sızıntıları ile diğer güvenlik açıklarını azaltmak için tasarlanmıştır.

#### Yapılandırma

Seçtiğiniz alan adları altındaki host’ları tespit etmek ve bu host’larla ilgili güvenlik sorunlarını aramak için API Attack Surface Management’ı etkinleştirip yapılandırırsınız; ayrıntılar [burada](../api-attack-surface/setup.md) açıklanmıştır.

Tespit edilen host’lar için Wallarm otomatik olarak [güvenlik açıklarını arayacaktır](../api-attack-surface/security-issues.md).

#### Eski Scanner’ın yerine geçmesi

7 Mayıs 2025’ten itibaren, AASM host ve API keşfi için daha gelişmiş ve konforlu bir araç olarak [eski Scanner’ın yerini aldı](../api-attack-surface/api-surface.md#replacement-of-old-scanner).

### API Discovery içgörüleri

[API Discovery](../api-discovery/overview.md) modülünün kimliği belirlenebilen kişisel bilgiler (PII) içeren GET isteklerinin sorgu parametrelerini aktardığını belirlediği uç noktalar için, Wallarm bu uç noktaları [bilgi ifşası](../attacks-vulns-list.md#information-exposure) güvenlik açığına sahip olarak tanır (bkz. [CWE-598](https://cwe.mitre.org/data/definitions/598.html)).

## Yanlış pozitifler

**Yanlış pozitif**, saldırı işaretleri meşru bir istekte tespit edildiğinde veya meşru bir unsur bir güvenlik açığı olarak nitelendirildiğinde oluşur. [Saldırı tespitinde yanlış pozitifler hakkında daha fazla bilgi →](protecting-against-attacks.md#false-positives)

Güvenlik açığı taramasında yanlış pozitifler, korunan uygulamanın özellikleri nedeniyle ortaya çıkabilir. Benzer isteklere verilen benzer yanıtlar, bir korunan uygulamada aktif bir güvenlik açığına işaret ederken başka bir korunan uygulamanın beklenen davranışı olabilir.

Bir güvenlik açığı için yanlış pozitif tespit edilirse, Wallarm Console içinde güvenlik açığına uygun bir işaret ekleyebilirsiniz. Yanlış pozitif olarak işaretlenen bir güvenlik açığı kapatılır ve yeniden kontrol edilmez.

Tespit edilen güvenlik açığı korunan uygulamada mevcutsa ancak düzeltilemiyorsa, [**Create a virtual patch**](../user-guides/rules/vpatch-rule.md) kuralını ayarlamanızı öneririz. Bu kural, tespit edilen güvenlik açığı türünden yararlanan saldırıları engellemeye olanak tanır ve olay riskini ortadan kaldırır.

## Keşfedilen güvenlik açıklarını yönetme

Tespit edilen tüm güvenlik açıkları Wallarm Console → **Vulnerabilities** bölümünde görüntülenir. Güvenlik açıklarını arayüz üzerinden şu şekilde yönetebilirsiniz:

* Güvenlik açıklarını görüntüleyin ve analiz edin
* Güvenlik açığı durum doğrulamasını çalıştırın: hâlâ aktif mi yoksa uygulama tarafında giderildi mi
* Güvenlik açıklarını kapatın veya yanlış pozitif olarak işaretleyin

![Vulnerabilities bölümü](../images/user-guides/vulnerabilities/check-vuln.png)

Wallarm platformunun [**API Discovery** modülünü](../api-discovery/overview.md) kullanıyorsanız, güvenlik açıkları keşfedilen API uç noktalarıyla ilişkilendirilir, örneğin:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

Güvenlik açıklarını yönetme hakkında daha fazla bilgi için, [güvenlik açıklarıyla çalışma](../user-guides/vulnerabilities.md) talimatlarına bakın.

## Keşfedilen güvenlik açıkları hakkında bildirimler

Wallarm, keşfedilen güvenlik açıkları hakkında size bildirim gönderebilir. Bu sayede uygulamalarınızdaki yeni güvenlik açıklarından haberdar olur ve hızlıca tepki verebilirsiniz. Güvenlik açıklarına verilen tepkiler arasında uygulama tarafında düzeltme yapmak, yanlış pozitifleri raporlamak ve sanal yamaları uygulamak yer alır.

Bildirimleri yapılandırmak için:

1. Bildirim göndermek istediğiniz sistemle [yerel entegrasyonu](../user-guides/settings/integrations/integrations-intro.md) oluşturun (örn. PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Entegrasyon kartında, mevcut olaylar listesinden **Vulnerabilities detected** seçin.

Tespit edilen güvenlik açığına ilişkin Splunk bildirimi örneği:

```json
{
    summary:"[Test message] [Test partner(US)] New vulnerability detected",
    description:"Notification type: vuln

                New vulnerability was detected in your system.

                ID: 
                Title: Test
                Domain: example.com
                Path: 
                Method: 
                Discovered by: 
                Parameter: 
                Type: Info
                Threat: Medium

                More details: https://us1.my.wallarm.com/object/555


                Client: TestCompany
                Cloud: US
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
            threat:"Medium",
            type:"Info"
        }
    }
}
```