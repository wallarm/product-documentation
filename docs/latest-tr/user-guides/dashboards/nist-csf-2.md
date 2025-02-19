# NIST CSF 2.0 Dashboard (Beta)

[NIST siber güvenlik çerçevesi (CSF)](https://www.nist.gov/cyberframework), National Institute of Standards and Technology tarafından oluşturulan, etkili bir güvenlik stratejisi için ana sütunları tanımlar. Wallarm'ın hizmetleri, müşterilerimize kapsamlı koruma sağlayarak NIST sütunlarının çoğuyla uyum içerisindedir. Dashboard'umuz bu uyumu gösterir ve platformun özelliklerini yapılandırmanıza yardımcı olur.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4rynq5qejumh" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Tespit Et

Wallarm, şirketinizin iş manzarasını, kaynaklarını ve potansiyel güvenlik açıklarını anlamak için tasarlanmış araçlar sunar. Bu araçlar, saldırı yüzeyinizi aydınlatır ve varlıkları risk puanlarına göre sıralamanıza yardımcı olur:

* [API attack surface management](../../api-attack-surface/overview.md), API'lerinizin sunduğu genel saldırı yüzeyini listelemenize, değerlendirmenize ve yönetmenize olanak tanıyan bir yetenek setidir.
* [API Discovery](../../api-discovery/overview.md), uygulamanızın REST API'sinin gerçek zamanlı kullanıma dayalı olarak tam bir envanterini oluşturur; zombie, yetim ve gölge API'leri etkin bir şekilde tespit eder.
* [API risk scoring](../../api-discovery/risk-score.md): Wallarm, API uç noktalarınıza veri ifşası ve güvenlik açığı varlığı gibi faktörlere dayalı otomatik risk puanları atar; ayrıca bu faktörlerin önem derecesini ayarlamanıza olanak tanıyarak özelleştirme sağlar.

## Koruma

Wallarm, bilinen ve ortaya çıkan birçok tehdide karşı sağlam koruma sunar:

* [Application and API Protection (WAAP)](../../about-wallarm/waap-overview.md), ortamlardaki uygulamalar ve API'ler için gelişmiş güvenlik sağlar. REST, SOAP, GraphQL ve diğer birçok API protokolünü destekleyen bu hizmet, OWASP Top 10 ve sonrasını ele almak için derinlemesine paket incelemesi yapar.
* API Threat Prevention, [zararlı botları engelleyerek](../../api-abuse-prevention/overview.md) API'lere yetkisiz erişimi ve kötüye kullanımı durdurmaya odaklanır, [credential stuffing](../../about-wallarm/credential-stuffing.md) ve sahte hesap oluşturmayı önler ve yalnızca meşru kullanıcılara erişim izni verir.
* API Specification Enforcement, API'lerinizin OpenAPI spesifikasyonlarına uymasını sağlar; uç nokta açıklamaları ile gerçek REST API istekleri arasındaki uyumsuzlukları tespit eder. Uyuşmazlık bulunduğunda, önceden tanımlanmış güvenlik önlemlerini otomatik olarak uygular.

## Tespit (Detect)

Anormallikleri, tehlike işaretlerini ve diğer olası olumsuz olayları tespit etmek için Wallarm, varlıkların sürekli izlenmesine büyük önem verir:

* [Vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md): Wallarm, gerçek İnternet trafiğini kullanarak proaktif bir şekilde güvenlik açıklarını tespit eder ve raporlar. Saldırgan girişimlerini analiz ederek ve istismar testleri yaparak, hem mevcut hem de potansiyel zayıflıkları ortaya çıkarır; böylece gerçek zamanlı güvenlik izleme sağlar.
* [API leaks](../../api-attack-surface/security-issues.md#api-leaks): Wallarm'ın Security Issues Detection modülü, halka açık depoları tarayarak açığa çıkmış API tokenlarını tespit eder. Sızıntı tespit edildiğinde Wallarm sizi uyarır, böylece hızlı analiz ve müdahale imkanı sunar.
* [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md): Wallarm'ın Threat Replay Testing özelliği, saldırganları kendi penetrasyon test uzmanlarınıza dönüştürür. İlk saldırı girişimlerini analiz eder, ardından aynı saldırının başka yollarla nasıl istismar edilebileceğini keşfeder. Bu, orijinal saldırganların bile tespit edemediği ortamınızdaki zayıf noktaları ortaya çıkarır.
<!--* [OpenAPI Security Testing](../../fast/openapi-security-testing.md) API güvenlik kontrollerini yazılım geliştirme yaşam döngüsü içerisinde CI/CD boru hatlarıyla Docker üzerinden sorunsuz entegrasyon sağlayarak otomatikleştirir. OpenAPI spesifikasyonunuzda tanımlanan uç noktalardaki güvenlik açıklarını ortaya çıkarmak için test istekleri oluşturur, böylece API üretime geçmeden önce güvenlik sorunlarının giderilmesine olanak tanır.-->

## Müdahale Et

Wallarm'ın donanımı, tespit edilen güvenlik tehditlerine uygun şekilde müdahale etmenizi sağlar:

* API'lerinize zararlı etkinliklerin ulaşmasını önlemek için [aktif engelleme](../../admin-en/configure-wallarm-mode.md).
* API risk yönetimi: Wallarm, tespit edilen güvenlik açıklarının durumlarını hızlıca [güncelleyebilmenizi](../vulnerabilities.md#vulnerability-lifecycle) sağlayarak yönetimi kolaylaştırır.
* [Entegrasyonlar ve uyarılar](../settings/integrations/integrations-intro.md), güvenlik uyarılarını SIEM, SOAR ve diğer sistemlerinize yönlendirmenizi sağlar.