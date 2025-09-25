[link-aasm-security-issue-risk-level]:  security-issues.md#issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# API Attack Surface Discovery <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarm'ın [API Attack Surface Management](overview.md) çözümünün bir bileşeni olan **API Attack Surface Discovery** (**AASD**), seçtiğiniz alan adlarını tarayarak tüm harici host'larını ve bunların API'lerini keşfeder, Web ve API tabanlı saldırılara karşı korumalarını değerlendirir ve eksik WAF/WAAP çözümlerini belirler. Wallarm içinde abone olarak çalışır - herhangi bir şey dağıtmanız gerekmez. Bu makale bileşene genel bir bakış sunar.

![API Attack Surface Discovery](../images/api-attack-surface/aasm-api-surface.png)

## Ele alınan konular

### Sağlanan yetenekler

Kuruluşunuzun harici API'lerinin tam listesini bilmek, izlenmeyen veya belgelenmemiş API'lerin kötü amaçlı saldırılar için potansiyel giriş noktaları haline gelebileceği güvenlik risklerini azaltmanın ilk adımıdır.

Wallarm'ın **API Attack Surface Discovery** bileşeni aşağıdakileri sağlayarak bu sorunları çözmeye yardımcı olur:

* [Seçili alan adlarınız](setup.md) için harici host'ların otomatik tespiti.
* Bulunan host'ların açık portlarının otomatik tespiti.
* Bulunan host'ların API'lerinin otomatik tespiti.

    Tespit edilebilecek **API türleri** (protokoller): JSON-API, GraphQL, XML-RPC, JSON-RPC, OData, gRPC, WebSocket, SOAP, WebDav, HTML WEB.

    HTML WEB — tarayıcılarla insan erişimine yönelik tasarlanmış bir HTML Web sayfası. Statik bir HTML Web sayfası olabilir ya da API'lere erişebilen bir uygulamanın tek bir HTML sayfası olabilir.

* Bulunan host'lar için otomatik [security posture](#security-posture) değerlendirmesi.
* Tüm API yüzeyinin genel WAAP skoru.
* Güvenlik satıcısı, veri merkezi ve konuma göre varlık özetleri.

    Bir host'un birden fazla IP adresi olabileceğinden, varlık istatistikleri veri merkezleri ve coğrafi konum bazında host bazında değil IP adresi bazında değerlendirilir. CDN'lerin kullanımı nedeniyle varlıkların konumu temsil niteliği taşımayabilir.

* Bulunan host'lar için güvenlik sorunlarının otomatik tespiti.

Tüm bunlara Wallarm içinde bileşene abone olarak sahip olursunuz - herhangi bir dağıtım yapmanız gerekmez ve analiz edilmiş verilere anında erişirsiniz.

### Eski Scanner'ın değiştirilmesi

API Attach Surface Discovery (AASD) yetenekleri, eski Wallarm Scanner'ın tüm işlevselliğini kapsadığından ve - [Security Issues](security-issues.md) ile birlikte - çok daha fazlasını sunduğundan, 7 Mayıs 2025 itibarıyla Scanner devre dışı bırakılmıştır.

![Old Scanner](../images/user-guides/scanner/check-scope.png)

Eski Scanner'ın devre dışı bırakılması şunları içerir:

* Eski Scanner'ı kullanan tüm müşterilere AASD erişimi sağlanması
* Eski Scanner'daki tüm konfigürasyonun Wallarm destek tarafından AASD'ye taşınması
* AASD tarafından host ve API'lerin otomatik olarak yeniden keşfedilmesi ve bunlara ilişkin genişletilmiş verilerin sunulması
* Host ve API'ler için otomatik güvenlik sorunu tespiti
* 7 Mayıs 2025'ten önce eski Scanner tarafından bulunan zafiyetler, [data retention policy](../about-wallarm/data-retention-policy.md) uyarınca Vulnerabilities bölümünde gösterilmeye devam eder

## Bulunan host'lara ilişkin veriler

Alan adlarınız için host'lar bulunduğunda, Wallarm Console içinde **API Attack Surface** bölümüne gidin. Listeden host'a tıklayarak şunları görün: 

* Host için bulunan açık portlar
* Host için bulunan API'ler
* Host'un [değerlendirilen](#security-posture) WAAP skoruna ilişkin ayrıntılar

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(60.65% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/dqmlj6dzflgq?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Security posture

Wallarm, harici ağ çevrenizin security posture durumunu otomatik olarak değerlendirir ve durumunu 0 (en kötü) ile 100 (en iyi) koruma arasında **Total score** olarak yansıtır.

![API yüzeyi - koruma skoru](../images/api-attack-surface/aasm-api-surface-protection-score.png)

Toplam skor, aşağıdakileri içeren karmaşık, tescilli bir formülle hesaplanır:

* **WAAP kapsam skoru**, harici web ve API servislerinin WAF/WAAP çözümleriyle kapsanmasını yansıtır. Skor, WAF/WAAP güvenliğiyle korunan HTTP/HTTPS portlarının payı olarak hesaplanır.
* **Ortalama WAAP skoru**, harici host'ların web ve API saldırılarına karşı dayanıklılığını temsil eder. Skor, AASM'nin engelleme modunda aktif WAAP çözümleri belirlediği ve WAAP skorunun hatasız değerlendirildiği tüm host'lar arasında ortalama skor olarak hesaplanır.

    Belirli bir uç noktanın WAAP skoru, Wallarm tarafından test edilmesinin sonucudur ve şu şekilde hesaplanır:

    ```
    ((AppSec + FalsePositive) / 2 + APISec) / 2
    ```

    * `AppSec` - SQL injection, XSS ve komut enjeksiyonu gibi web saldırılarına karşı dayanıklılık.
    * `APISec` - GraphQL, SOAP ve gRPC protokollerini hedefleyenler dahil API saldırılarına karşı dayanıklılık.
    * `FalsePositive` - meşru istekleri yanlışlıkla tehdit olarak algılamadan doğru şekilde izin verme yeteneği.

    Her host için, ayrıntılı WAAP skoru değerlendirme raporunu PDF formatında indirebilirsiniz.

* **Ek metrikler** olarak TLS kapsamı, güvenlik sorunlarının varlığı ve tespit edilen güvenlik sorunları.

## API saldırı yüzeyi raporları

Alan adlarınız için keşfedilen harici host'lar ve onların API'leri hakkında ayrıntılı bir DOCX raporu alabilirsiniz. Bu rapor ayrıca bu API'ler için tespit edilen [güvenlik sorunları](security-issues.md) ile ilgili seçeceğiniz bilgileri de içerecektir.

Bunun yanı sıra, API yüzeyiniz hakkında tablo görünümünde (CSV) bilgi alabilirsiniz; şu şekilde düzenlenmiş:

* Host'lar (her host için bir satır)
* Portlar (her port için bir satır)
* API'ler (her API için bir satır)

![API yüzeyi - raporlar](../images/api-attack-surface/aasm-reports.png)

Bir diğer seçenek de, makine tarafından okunabilir formatta API yüzeyi hakkında bilgiler içeren JSON rapordur.

Güvenlik sorunları hakkında [ayrı bir rapor](security-issues.md#security-issue-reports) da alabilirsiniz.

## Bildirimler

--8<-- "../include/api-attack-surface/aasm-notifications.md"