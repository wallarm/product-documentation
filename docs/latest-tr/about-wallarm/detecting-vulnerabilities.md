[allowlist-scanner-addresses]: ../user-guides/ip-lists/overview.md

# Güvenlik Açıklarının Tespiti

Uygulama geliştirilirken veya uygulanırken yapılan ihmal ya da yetersiz bilgi nedeniyle, uygulama saldırılara karşı savunmasız hale gelebilir. Bu makalede, Wallarm platformunun uygulama güvenlik açıklarını nasıl tespit ettiğini öğrenecek ve sistem güvenliğinizi artırma şansı yakalayacaksınız.

## Güvenlik açığı nedir?

Güvenlik açığı, bir uygulama geliştirilirken veya uygulanırken ihmal veya yetersiz bilgi nedeniyle yapılan hatadır. Bu açıktan faydalanan bir saldırgan, uygulama içinde ayrıcalık sınırlarını aşarak (yani yetkisiz işlemler gerçekleştirerek) sisteme zarar verebilir.

## Güvenlik açıklarının tespit yöntemleri

Uygulamadaki aktif güvenlik açıklarını tararken, Wallarm saldırı belirtileri içeren istekleri korunan uygulama adresine gönderir ve gelen yanıtları analiz eder. Yanıt, bir veya birden fazla önceden tanımlanmış güvenlik açığı belirtisi ile eşleşiyorsa, Wallarm aktif güvenlik açığını kaydeder.

Örneğin: `/etc/passwd` içeriğini okumak için gönderilen isteğe yanıt olarak `/etc/passwd` içeriği dönerse, korunan uygulama Path Traversal saldırılarına karşı savunmasız sayılır. Wallarm, bu güvenlik açığını uygun tipte kaydedecektir.

Uygulamadaki güvenlik açıklarını tespit etmek için Wallarm aşağıdaki yöntemlerle saldırı belirtileri içeren istekler gönderir:

* **Pasif tespit**: Gerçek trafik (hem istekler hem de yanıtlar) analiz edilerek güvenlik açıkları belirlenir. Bu, gerçek bir açığın kullanıldığı bir güvenlik olayı sırasında ya da isteklerin, doğrudan açığın kullanılmadığı halde, örneğin ele geçirilmiş JWT’ler gibi güvenlik açığı belirtileri göstermesi durumunda gerçekleşebilir.
* **Threat Replay Testing**: Saldırganları penetrasyon test uzmanlarına dönüştürmenizi, uygulamalarınız/API’lerinizdeki potansiyel güvenlik açıklarını tespit etmenizi sağlar. Bu modül, gerçek trafik verilerinden alınan saldırı verilerini kullanarak uygulama uç noktalarını test eder. Varsayılan olarak bu yöntem devre dışıdır.
* **Vulnerability Scanner**: Şirketin dışa açık varlıkları, tipik güvenlik açıkları açısından taranır.
* **API Discovery insights**: GET isteklerinin sorgu parametreleri arasında PII aktarımı tespit edildiğinde, [API Discovery](../api-discovery/overview.md) modülü açığı belirler.

### Pasif tespit

Pasif tespit, gerçek trafik (hem istekler hem de yanıtlar) analiz edilerek güvenlik açıklarının tespit edilmesidir. Güvenlik açıkları, kötü niyetli bir isteğin hatayı kullanması yoluyla ortaya çıkan güvenlik olayları sırasında veya isteklerin, doğrudan açığın kullanılmaması halinde fakat örneğin ele geçirilmiş JWT’ler gibi güvenlik açığı belirtileri göstermesi sırasında tespit edilebilir.

Pasif güvenlik açığı tespiti varsayılan olarak aktiftir.

### Threat Replay Testing <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarm'un Threat Replay Testing özelliği, saldırganları kendi penetrasyon test uzmanlarınıza dönüştürür. İlk saldırı girişimlerini analiz eder ve aynı saldırının başka hangi yollarla kullanılabileceğini araştırır. Bu sayede, orijinal saldırganların dahi fark etmediği zayıf noktalar ortaya çıkar. [Read more](../vulnerability-detection/threat-replay-testing/overview.md)

Threat Replay Testing özellikleri:

* **Gerçek zamanlı test**: Canlı saldırı verilerini kullanarak mevcut ve gelecekteki potansiyel zayıf noktaları belirler, sizi hackerlardan bir adım önde tutar.
* **Güvenli & akıllı simülasyon**: Testlerde hassas kimlik doğrulama detaylarını atlar, zararlı kodları temizler. Maksimum güvenlik için saldırı tekniklerini simüle eder, gerçek zarara yol açmaz.
* **Güvenli üretim dışı testler**: Gerçek üretim verilerini kullanarak, fakat sistem aşırı yüklemesi veya veri sızması gibi riskler olmadan [staging ya da geliştirme ortamında güvenlik açığı kontrolleri yapmanızı](../vulnerability-detection/threat-replay-testing/setup.md) sağlar.

### Vulnerability Scanner <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### Çalışma Prensibi

Vulnerability Scanner, şirketin dışa açık tüm varlıklarını tipik güvenlik açıkları açısından tarar. Scanner, sabit IP adreslerinden uygulama adreslerine istek gönderir ve bu isteklere `X-Wallarm-Scanner-Info` başlığını ekler.

#### Konfigürasyon

* Scanner, Wallarm Console → **Vulnerabilities** → **Configure** üzerinden [etkinleştirilebilir veya devre dışı bırakılabilir](../user-guides/vulnerabilities.md#configuring-vulnerability-detection). Varsayılan olarak Scanner aktiftir.
* Scanner’ın tespit edebileceği [güvenlik açıkları listesi](../user-guides/vulnerabilities.md#configuring-vulnerability-detection), Wallarm Console → **Vulnerabilities** → **Configure** bölümünden yapılandırılabilir. Varsayılan durumda, Vulnerability Scanner mevcut tüm güvenlik açıklarını tespit eder.
* Her varlık için [Scanner tarafından gönderilen istek limiti](../user-guides/scanner.md#limiting-vulnerability-scanning), Wallarm Console → **Scanner** → **Configure** kısmından ayarlanabilir.
* Eğer trafiği otomatik olarak filtreleyip engelleyen ek tesisatlar (yazılım veya donanım) kullanıyorsanız, Wallarm Scanner için [IP adreslerinin](../admin-en/scanner-addresses.md) allowlist’e eklenmesi önerilir. Bu, Wallarm bileşenlerinin kaynaklarınızı kesintisiz bir şekilde güvenlik açıkları açısından taramasını sağlar.

    Wallarm, Scanner IP adreslerini manuel olarak allowlist’e eklemenizi gerektirmez – Wallarm node 3.0’dan itibaren Scanner IP adresleri otomatik olarak allowlist’e eklenir.

### API Discovery insights

[API Discovery](../api-discovery/overview.md) modülü tarafından tespit edilen uç noktalar, GET isteklerinin sorgu parametrelerinde Kişisel Tanımlanabilir Bilgileri (PII) aktardığında (bkz. [CWE-598](https://cwe.mitre.org/data/definitions/598.html)), Wallarm bu uç noktaları [information exposure](../attacks-vulns-list.md#information-exposure) açığına sahip olarak tanır.

## Yanlış Pozitifler

**Yanlış pozitif**, saldırı belirtileri meşru bir istekte tespit edildiğinde veya meşru bir unsur güvenlik açığı olarak değerlendirildiğinde ortaya çıkar. [Saldırı tespitinde yanlış pozitifler hakkında daha fazla bilgi →](protecting-against-attacks.md#false-positives)

Güvenlik açığı taramalarında, korunan uygulamanın özelliklerinden ötürü yanlış pozitifler meydana gelebilir. Benzer isteklere verilen benzer yanıtlar, bir korunan uygulamada aktif bir güvenlik açığının varlığını işaret edebilirken, başka bir korunan uygulamada beklenen bir davranış olabilir.

Bir güvenlik açığı için yanlış pozitif tespit edilirse, Wallarm Console üzerinden açığa uygun bir işaret ekleyebilirsiniz. Yanlış pozitif olarak işaretlenen güvenlik açığı kapatılır ve tekrar kontrol edilmez.

Tespit edilen güvenlik açığı, korunan uygulamada mevcut olup düzeltilemiyorsa, [**Create a virtual patch**](../user-guides/rules/vpatch-rule.md) kuralını uygulamanızı öneririz. Bu kural, tespit edilen güvenlik açığı tipini kullanan saldırıları engelleyerek güvenlik olaylarını önler.

## Tespit Edilen Güvenlik Açıklarının Yönetimi

Tespit edilen tüm güvenlik açıkları, Wallarm Console → **Vulnerabilities** bölümünde görüntülenir. Güvenlik açıklarını arayüz üzerinden şu şekilde yönetebilirsiniz:

* Güvenlik açıklarını görüntüleme ve analiz etme
* Güvenlik açığının durumunu doğrulamak için kontroller yapma: hâlâ aktif mi yoksa uygulama tarafından düzeltilmiş mi
* Güvenlik açıklarını kapatma veya yanlış pozitif olarak işaretleme

![Güvenlik Açıkları bölümü](../images/user-guides/vulnerabilities/check-vuln.png)

Wallarm platformunun [**API Discovery**](../api-discovery/overview.md) modülünü kullanıyorsanız, güvenlik açıkları tespit edilen API uç noktalarıyla ilişkilendirilir, örn.:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

Güvenlik açıklarını yönetme hakkında daha fazla bilgi için, [güvenlik açıklarıyla çalışma](../user-guides/vulnerabilities.md) talimatlarına bakınız.

## Tespit Edilen Güvenlik Açıkları Hakkında Bildirimler

Wallarm, tespit edilen güvenlik açıkları hakkında size bildirim gönderebilir. Bu, uygulamalarınızdaki yeni keşfedilen güvenlik açıklarından haberdar olmanızı ve bunlara hızlıca müdahale etmenizi sağlar. Güvenlik açıklarına müdahale, uygulama tarafında düzeltme yapmayı, yanlış pozitifleri raporlamayı ve sanal yama uygulamayı içerir.

Bildirimleri yapılandırmak için:

1. Bildirim göndermek amacıyla sistemle [native integration](../user-guides/settings/integrations/integrations-intro.md) oluşturun (örn. PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Entegrasyon kartında, mevcut olaylar listesinden **Vulnerabilities detected** seçeneğini işaretleyin.

Tespit edilen güvenlik açığı ile ilgili Splunk bildirimine bir örnek:

```json
{
    summary:"[Test message] [Test partner(US)] New vulnerability detected",
    description:"Notification type: vuln

                New vulnerability was detected in your system.

                ID: 
                Title: Test
                Domain: example.com,
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