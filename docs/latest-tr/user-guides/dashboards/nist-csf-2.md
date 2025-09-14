# NIST CSF 2.0 Panosu (Beta)

Ulusal Standartlar ve Teknoloji Enstitüsü (NIST) tarafından oluşturulan [NIST siber güvenlik çerçevesi (CSF)](https://www.nist.gov/cyberframework), etkili bir güvenlik stratejisi için temel sütunları tanımlar. Wallarm'ın hizmetleri, NIST'in sütunlarının çoğuyla uyumludur ve müşterilerimize kapsamlı koruma sağlar. Panomuz bu uyumu gösterir ve platformun özelliklerinin yapılandırılmasına yardımcı olur.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4rynq5qejumh" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Tanımla

Wallarm, şirketinizin iş ortamını, kaynaklarını ve potansiyel güvenlik zafiyetlerini anlamaya yönelik tasarlanmış araçlar sağlar. Bu araçlar saldırı yüzeyinizi görünür kılar ve varlıkları risk puanlarına göre sıralamanıza yardımcı olur:

* [API saldırı yüzeyi yönetimi](../../api-attack-surface/overview.md), API'lerinizin sunduğu kamusal saldırı yüzeyini envanterlemek, değerlendirmek ve yönetmek için bir dizi yetenek sağlar.
* [API Discovery](../../api-discovery/overview.md), gerçek zamanlı kullanıma dayalı olarak uygulamanızın REST API'sinin hassas bir envanterini oluşturur; zombi, yetim ve gölge API'leri etkin biçimde tanımlar.
* [API risk puanlama](../../api-discovery/risk-score.md): Wallarm, veri ifşası ve zafiyet varlığı gibi faktörlere dayanarak API uç noktalarınıza otomatik olarak risk puanları atar; ayrıca bu faktörlerin önem derecesini ayarlamanıza olanak tanıyarak özelleştirme de sunar.

## Koru

Wallarm, bilinen ve ortaya çıkan geniş bir tehdit yelpazesine karşı sağlam koruma sunar:

* [Application and API Protection (WAAP)](../../about-wallarm/waap-overview.md), farklı ortamlardaki uygulamalar ve API'ler için gelişmiş güvenlik sağlar. REST, SOAP, GraphQL ve daha fazlası dahil çeşitli API protokollerini destekler; OWASP Top 10 ve ötesini ele almak için derin paket inceleme kullanır.
* API Threat Prevention, [kötü niyetli botları engelleme](../../api-abuse-prevention/overview.md), [kimlik bilgisi doldurma](../../about-wallarm/credential-stuffing.md) ve sahte hesap oluşturma saldırılarına karşı koruma sağlama ve yalnızca meşru kullanıcılara erişim izni verme yoluyla API'lere yetkisiz erişimi ve API'lerin kötüye kullanımını durdurmaya odaklanır.
* API Specification Enforcement, uç nokta tanımları ile gerçek REST API istekleri arasındaki tutarsızlıkları tespit ederek API'lerinizin OpenAPI spesifikasyonlarına uymasını sağlar. Tutarsızlıklar belirlendiğinde, önceden tanımlanmış güvenlik önlemlerini otomatik olarak uygular.

## Tespit Et

Anormallikleri, ihlal göstergelerini ve diğer potansiyel olumsuz olayları belirlemek için Wallarm, varlıkların tutarlı biçimde izlenmesine aşağıdaki şekilde odaklanır:

* [Zafiyet tespiti](../../api-attack-surface/security-issues.md): Wallarm, dış ana bilgisayarlarınızı ve API'lerinizi zafiyetler için kontrol eder ve hem acil hem de potansiyel zayıflıkları ortaya çıkarmak üzere raporlar, böylece gerçek zamanlı güvenlik izlemesini mümkün kılar.
* [API sızıntıları](../../api-attack-surface/security-issues.md#api-leaks): Wallarm'ın Security Issues Detection modülü, ifşa edilmiş API jetonlarını belirlemek için genel depoları tarar. Sızıntılar tespit edildiğinde Wallarm sizi uyarır; bu da hızlı analiz ve harekete olanak tanır.
* [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md): Wallarm'ın Threat Replay Testing özelliği, saldırganları adeta kendi sızma testi uzmanlarınıza dönüştürür. İlk saldırı girişimlerini analiz eder, ardından aynı saldırının istismar edilebileceği diğer yolları araştırır. Bu, ilk saldırganların dahi bulamadığı zayıf noktaları ortaya çıkarır.
<!--* [OpenAPI Security Testing](../../fast/openapi-security-testing.md) automates API security checks within the software development lifecycle by seamlessly integrating with CI/CD pipelines via Docker. It creates test requests to expose vulnerabilities in endpoints, as defined in your OpenAPI specification, allowing you to address security issues before the API goes into production.-->

## Yanıt Ver

Wallarm'ın araç seti, tanımlanan güvenlik tehditlerine yerinde şekilde yanıt vermenizi sağlar:

* [Aktif engelleme](../../admin-en/configure-wallarm-mode.md), kötü niyetli faaliyetlerin API'lerinize ulaşmasını engellemek için.
* API risk yönetimi: Wallarm, daha iyi güvenlik gözetimi için [zafiyet durumlarını hızlıca güncellemenizi](../vulnerabilities.md#vulnerability-lifecycle) sağlayarak tespit edilen zafiyetlerin etkin yönetimini mümkün kılar.
* [Entegrasyonlar ve uyarılar](../settings/integrations/integrations-intro.md), güvenlik uyarılarını SIEM, SOAR ve diğer sistemlerinize hazırlamanıza ve yönlendirmenize olanak tanır.