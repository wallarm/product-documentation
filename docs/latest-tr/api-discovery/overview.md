# API Discovery Genel Bakış <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm platformunun **API Discovery** modülü, gerçek API kullanımı temelinde uygulamanızın REST API envanterini oluşturur. Modül, gerçek trafik isteklerini sürekli analiz eder ve analiz sonuçlarına göre API envanterini oluşturur.

Oluşturulan API envanteri aşağıdaki unsurları içerir:

* API uç noktaları
* İstek yöntemleri (GET, POST ve diğerleri)
* İstek ve yanıtların zorunlu ve opsiyonel GET, POST ve header parametreleri, bunlar dahil:
    * [Gönderilen her parametredeki verinin tip/formatı](./exploring.md#format-and-data-type)
    * Parametre bilgisinin en son güncellendiği tarih ve saat

!!! info "Yanıt parametrelerinin mevcudiyeti"
    Yanıt parametreleri yalnızca 4.10.1 veya daha yüksek sürümündeki node kullanıldığında mevcuttur.

<div>
    <script src="https://js.storylane.io/js/v1/storylane.js"></script>
    <div class="sl-embed" style="position:relative;padding-bottom:calc(60.95% + 27px);width:100%;height:0;transform:scale(1)">
        <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/cgqrxqwhmgyp" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
    </div>
</div>

## API Discovery ile Ele Alınan Sorunlar

**Gerçek ve eksiksiz bir API envanteri oluşturmak** API Discovery modülünün ele aldığı ana sorundur.

API envanterini güncel tutmak zor bir iştir. Farklı API'leri kullanan birden fazla ekip bulunmakta ve API dokümantasyonu oluşturulurken farklı araç ve süreçlerin kullanılması yaygın bir durumdur. Sonuç olarak, şirketler hangi API'lere sahip olduklarını, hangi verileri açığa çıkardıklarını anlamakta ve güncel API dokümantasyonuna sahip olmakta zorlanırlar.

API Discovery modülü, gerçek trafiği veri kaynağı olarak kullandığından, isteği gerçekten işleyen tüm uç noktaları API envanterine dahil ederek güncel ve eksiksiz API dokümantasyonu elde etmeye yardımcı olur.

**Wallarm tarafından keşfedilen API envanteriniz sayesinde şunları yapabilirsiniz:**

* [Dış ve iç](exploring.md#external-vs-internal) API listesi dahil olmak üzere tüm API portföyünüze tam görünürlük kazanabilirsiniz.
* API'lere giren ve çıkan [verileri](exploring.md#endpoint-details) görebilirsiniz.
* Açık güvenlik açıklarına sahip uç noktaların listesini alabilirsiniz.
* Belirli herhangi bir API uç noktası için son 7 günde gerçekleşen tehditlerin listesini alabilirsiniz.
* Yalnızca saldırıya uğramış API'leri filtreleyip, istek sayısına göre sıralayabilirsiniz.
* [Hassas veriler](#sensitive-data-detection) tüketen ve taşıyan API'leri filtreleyebilirsiniz.
* API envanter yapınızın ve sorunların görselleştirilmiş özetini kullanışlı bir [dashboard](dashboard.md) üzerinden görebilirsiniz.
* Hangi uç noktaların [en olası](risk-score.md) saldırı hedefi olduğunu anlayabilirsiniz.
* [Gölge, yetim ve zombi API'leri](rogue-api.md) bulabilirsiniz.
* Seçilen zaman dilimi içerisinde API'de gerçekleşen [değişiklikleri takip edebilirsiniz](track-changes.md).
* API uç noktalarını [BOLA otomatik koruma durumuna](bola-protection.md) göre filtreleyebilirsiniz.
* Geliştiricilerinize, oluşturulan API envanterine bakma ve indirme konusunda [erişim](../user-guides/settings/users.md#user-roles) sağlayabilirsiniz.

## API Discovery Nasıl Çalışır?

API Discovery, istek istatistiklerine dayanır ve gerçek API kullanımı temelinde güncel API özelliklerini oluşturmak için sofistike algoritmalar kullanır.

### Trafik İşleme

API Discovery, analizi yerel ve Cloud ortamında gerçekleştirmek için hibrit bir yaklaşım kullanır. Bu yaklaşım, istek verilerinin ve hassas verilerin yerel olarak tutulduğu, istatistik analizleri için Cloud gücünün kullanıldığı bir [öncelikli gizlilik sürecini](#security-of-data-uploaded-to-the-wallarm-cloud) mümkün kılar:

1. API Discovery, meşru trafiği yerel olarak analiz eder. Wallarm, istek yapılan uç noktaları ve hangi parametrelerin gönderilip alındığını inceler.
1. Bu verilere göre, istatistikler oluşturulur ve Cloud'a gönderilir.
1. Wallarm Cloud, alınan istatistikleri toplar ve bunlardan bir [API tanımı](exploring.md) oluşturur.

    !!! info "Gürültü tespiti"
        Nadir veya tek seferlik istekler [gürültü olarak belirlenir](#noise-detection) ve API envanterine dahil edilmez.

### Gürültü Tespiti

API Discovery modülü, gürültü tespitini iki ana trafik parametresine dayandırır:

* Uç nokta stabilitesi - Uç noktaya yapılan ilk isteğin anından itibaren 5 dakika içinde en az 5 istek kaydedilmelidir.
* Parametre stabilitesi - Uç noktaya yapılan isteklerde parametrenin görülme oranı yüzde 1'den fazla olmalıdır.

API envanteri, bu limitleri aşan uç noktaları ve parametreleri gösterecektir. Tam API envanterinin oluşturulması için gereken süre, trafik çeşitliliğine ve yoğunluğuna bağlıdır. 

Ayrıca, API Discovery diğer kriterlere dayanarak istekleri filtreler:

* Yalnızca sunucunun 2xx aralığında yanıt verdiği istekler işlenir.
* REST API tasarım prensiplerine uymayan istekler işlenmez.
    
    Bu, yanıtların `Content-Type` başlığı kontrol edilerek yapılır: Eğer başlık `application/json` içermiyorsa (örneğin, `Content-Type: application/json;charset=utf-8`), istek non-REST API olarak kabul edilir ve analiz edilmez.
    
    Eğer başlık mevcut değilse, API Discovery isteği analiz eder.

* `Accept` gibi standart alanlar göz ardı edilir.

### Hassas Veri Tespiti

API Discovery, API'leriniz tarafından tüketilen ve taşınan hassas verileri [tespit edip vurgular](sensitive-data.md):

* IP ve MAC adresleri gibi teknik veriler
* Gizli anahtarlar ve şifreler gibi giriş bilgileri
* Banka kartı numaraları gibi finansal veriler
* Tıbbi lisans numarası gibi medikal veriler
* Tam isim, pasaport numarası veya SSN gibi kişisel tanımlanabilir bilgiler (PII)

API Discovery, tespit sürecini yapılandırma ve kendi hassas veri desenlerinizi ekleme imkanı sağlar (NGINX Node 5.0.3 veya Native Node 0.7.0 veya daha yüksek sürüm gerektirir).

### Hassas İş Akışları

[Hassas iş akışı](sbf.md) yeteneği sayesinde API Discovery, kimlik doğrulama, hesap yönetimi, faturalandırma ve benzeri kritik işlevler gibi belirli iş akışları için hayati öneme sahip uç noktaları otomatik olarak tespit edebilir.

Otomatik tanımlamanın yanı sıra, atanmış hassas iş akışı etiketlerini manuel olarak ayarlayabilir ve tercih ettiğiniz uç noktalar için etiketleri manuel olarak belirleyebilirsiniz.

Uç noktalar hassas iş akışı etiketleriyle atandıktan sonra, tüm keşfedilen uç noktaları belirli bir iş akışına göre filtrelemek mümkün hale gelir; bu da en kritik iş yeteneklerini korumayı kolaylaştırır.

![API Discovery - Filtering by sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)

### Wallarm Cloud'a Yüklenen Verilerin Güvenliği

API Discovery, trafiğin çoğunu yerel olarak analiz eder. Modül, Wallarm Cloud'a yalnızca keşfedilen uç noktaları, parametre adlarını ve çeşitli istatistiksel verileri (varış zamanı, sayı vb.) gönderir. Tüm veriler güvenli bir kanal üzerinden iletilir: İstatistikler Wallarm Cloud'a yüklenmeden önce, API Discovery modülü, istek parametrelerinin değerlerini [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algoritması kullanarak hash'ler.

Cloud tarafında, hash'lenmiş veriler istatistiksel analiz için kullanılır (örneğin, aynı parametrelere sahip isteklerin sayısını ölçerken).

Diğer veriler (uç nokta değerleri, istek yöntemleri ve parametre adları) Wallarm Cloud'a yüklenmeden önce hash'lenmez, çünkü hash'ler orijinal hallerine geri döndürülemez; bu da API envanterinin oluşturulmasını imkansız hale getirirdi.

!!! warning "Önemli"
    Wallarm, parametrelerde belirtilen değerleri Cloud'a göndermez. Yalnızca uç nokta, parametre adları ve bunlara ilişkin istatistikler gönderilir.

## API Discovery demo videosu

API Discovery demo videosunu izleyin:

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/0bRHVtpWkJ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Playground'da API Discovery'yı Deneyin

Modülü, kaydolmadan ve node'u ortamınıza dağıtmadan denemek için [Wallarm Playground'da API Discovery'yı](https://playground.wallarm.com/api-discovery/?utm_source=wallarm_docs_apid) keşfedin.

Playground'da, gerçek verilerle doluymuş gibi API Discovery görünümüne erişebilir, modülün nasıl çalıştığını öğrenip deneyebilir ve salt okunur modda kullanımına dair faydalı örnekler edinebilirsiniz.

![API Discovery – Sample Data](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## API Discovery'yı Etkinleştirme ve Yapılandırma

API Discovery'yı kullanmaya başlamak için, [API Discovery Setup](setup.md) sayfasında açıklandığı gibi etkinleştirin ve yapılandırın.