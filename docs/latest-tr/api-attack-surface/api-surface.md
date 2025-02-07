# API Attack Surface Discovery <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarm'ın [API Attack Surface Management](overview.md) bileşeninin **API Attack Surface Discovery** (**AASD**) özelliği, seçtiğiniz alan adlarınızı tarayarak tüm dış ana bilgisayarlarını ve API'larını keşfeder, bunların Web ve API tabanlı saldırılara karşı korumalarını değerlendirir ve eksik WAF/WAAP çözümlerini belirler. Wallarm'da abone olarak çalışır - herhangi bir şey dağıtmanıza gerek yoktur. Bu makale, bileşenin genel görünümünü sunar.

![API Attack Surface Discovery](../images/api-attack-surface/aasm-api-surface.png)

## Ele Alınan Sorunlar

Kuruluşunuzun dış API'larının tam listesini bilmek, potansiyel güvenlik risklerini azaltmanın ilk adımıdır, çünkü izlenmeyen veya belgelenmemiş API'lar kötü niyetli saldırılar için potansiyel giriş noktası olabilir.

Wallarm'ın **API Attack Surface Discovery** bileşeni, aşağıdakileri sağlayarak bu sorunların çözülmesine yardımcı olur:

* Seçtiğiniz alan adları için dış ana bilgisayarların otomatik algılanması.
* Bulunan ana bilgisayarların açık portlarının otomatik algılanması.
* Bulunan ana bilgisayarların API'larının otomatik algılanması.

    Aşağıdaki **API types** (protokoller) algılanabilir: JSON-API, GraphQL, XML-RPC, JSON-RPC, OData, gRPC, WebSocket, SOAP, WebDav, HTML WEB.

    HTML WEB — tarayıcılarla insanlar tarafından erişim için tasarlanmış bir HTML Web sayfasıdır. Bu, statik bir HTML Web sayfası veya uygulamanın tek bir HTML sayfası olabilir; bu durumda, uygulamanın bazı API'larına erişim sağlanabilir.

* Bulunan ana bilgisayarlar için otomatik [security posture](#security-posture) değerlendirmesi.
* Tüm API yüzeyinin genel WAAP puanı.
* Güvenlik sağlayıcısı, veri merkezi ve konuma göre varlık özetleri.

    Bir ana bilgisayarın birden fazla IP adresi olabileceğinden, veri merkezleri ve coğrafi konum bazında varlık istatistikleri IP adresi bazında değerlendirilir, ana bilgisayar bazında değil. CDN'lerin kullanımı nedeniyle, varlıkların konumu temsil edici olmayabilir.

* Bulunan ana bilgisayarlar için güvenlik sorunlarının otomatik algılanması.

Tüm bunları Wallarm'da bileşene abone olarak elde edersiniz - herhangi bir şey dağıtmanıza gerek yoktur ve analiz edilen verilere hemen erişirsiniz.

## Ana Bilgisayarları Aramak İçin Alan Adları

Ana bilgisayarları aramak istediğiniz **root domains** listesini aşağıdaki şekilde tanımlayabilirsiniz:

1. **API Attack Surface** veya **Security Issues** bölümünde, **Configure**'a tıklayın.
2. **Scope** sekmesinde, alan adlarınızı ekleyin.

    Wallarm, ana bilgisayarları ve onların [security issues](security-issues.md) aramaya başlayacaktır. Arama ilerlemesi ve sonuçları **Status** sekmesinde görüntülenecektir.

![AASM - configuring scope](../images/api-attack-surface/aasm-scope.png)

Alan adlarının her 3 günde bir otomatik olarak yeniden tarandığını unutmayın - yeni ana bilgisayarlar otomatik olarak eklenecektir, daha önce listelenip yeniden taramada bulunamayanlar ise listede kalacaktır.

Herhangi bir alan adı için taramayı **Configure** → **Status** bölümünden manuel olarak yeniden başlatabilir, duraklatabilir veya devam ettirebilirsiniz.

## Bulunan Ana Bilgisayarlara Dair Veriler

Alan adlarınız için ana bilgisayarlar bulunduğunda, Wallarm Console'da **API Attack Surface** bölümüne gidin. Listeden bir ana bilgisayara tıklayarak şunları görebilirsiniz:

* Ana bilgisayarın bulunan açık portları
* Ana bilgisayarın bulunan API'ları
* Ana bilgisayarın [değerlendirilmiş](#security-posture) WAAP puanına dair ayrıntılar

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(60.65% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/dqmlj6dzflgq?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Güvenlik Durumu

Wallarm, dış ağ çevrenizin güvenlik durumunu otomatik olarak değerlendirir ve durumunu 0 (en kötü) ile 100 (en iyi) koruma arasında **Total score** olarak yansıtır.

![API surface - protection score](../images/api-attack-surface/aasm-api-surface-protection-score.png)

Genel puan, aşağıdakileri içeren karmaşık bir tescilli formül kullanılarak hesaplanır:

* **WAAP coverage score**: Dış web ve API servislerinin WAF/WAAP çözümleriyle kapsanma oranını yansıtır. Puan, WAF/WAAP güvenliğiyle korunan HTTP/HTTPS portlarının payı olarak hesaplanır.
* **Average WAAP score**: Dış ana bilgisayarların web ve API saldırılarına karşı direncini temsil eder. Puan, AASM'in engelleme modunda etkin WAAP çözümleri tespit ettiği ve WAAP puanının hatasız değerlendirildiği tüm ana bilgisayarlar arasında ortalama puan olarak hesaplanır.

    Belirli bir uç noktanın WAAP puanı, Wallarm tarafından yapılan testin sonucudur; şu şekilde hesaplanır:

    ```
    ((AppSec + FalsePositive) / 2 + APISec) / 2
    ```

    * `AppSec` - SQL enjeksiyonu, XSS ve komut enjeksiyonu gibi web saldırılarına karşı direnç.
    * `APISec` - GraphQL, SOAP ve gRPC protokollerini hedef alanlar da dahil olmak üzere API saldırılarına karşı direnç.
    * `FalsePositive` - meşru istekleri hatalı şekilde tehdit olarak algılamadan doğru bir şekilde izin verme yeteneği.

    Her ana bilgisayar için, PDF formatında ayrıntılı bir WAAP puan değerlendirme raporu indirebilirsiniz.

* **Additional metrics**: TLS kapsama, güvenlik sorunlarının varlığı ve algılanan güvenlik sorunları gibi ek metrikler.