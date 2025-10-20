# API Discovery Genel Bakış <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm platformunun **API Discovery** modülü, gerçek API kullanımına dayanarak uygulamanızın REST API envanterini oluşturur. Modül, gerçek trafik isteklerini sürekli olarak analiz eder ve analiz sonuçlarına göre API envanterini oluşturur.

Oluşturulan API envanteri aşağıdaki öğeleri içerir:

* API uç noktaları
* İstek yöntemleri (GET, POST ve diğerleri)
* İstek ve yanıtlardaki gerekli ve isteğe bağlı GET, POST ve başlık parametreleri; şunları içerecek şekilde:
    * Her parametrede gönderilen verinin [Tür/biçimi](./exploring.md#format-and-data-type)    
    * Parametre bilgisinin en son güncellendiği tarih ve saat

!!! info "Yanıt parametrelerinin kullanılabilirliği"
    Yanıt parametreleri yalnızca 4.10.1 veya daha yüksek sürümlü düğüm kullanıldığında mevcuttur.

<div>
    <script src="https://js.storylane.io/js/v1/storylane.js"></script>
    <div class="sl-embed" style="position:relative;padding-bottom:calc(60.95% + 27px);width:100%;height:0;transform:scale(1)">
        <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/cgqrxqwhmgyp" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
    </div>
</div>

## API Discovery’nin ele aldığı sorunlar

**Gerçek ve eksiksiz bir API envanteri oluşturmak**, API Discovery modülünün ele aldığı başlıca sorundur.

API envanterini güncel tutmak zor bir görevdir. Farklı API’leri kullanan birden fazla ekip vardır ve API dokümantasyonunun üretilmesi için farklı araçların ve süreçlerin kullanılması yaygındır. Sonuç olarak, şirketler hangi API’lere sahip olduklarını, hangi verileri açığa çıkardıklarını anlamakta ve API dokümantasyonunu güncel tutmakta zorlanırlar.

API Discovery modülü veri kaynağı olarak gerçek trafiği kullandığından, isteklere gerçekten yanıt veren tüm uç noktaları API envanterine dahil ederek güncel ve eksiksiz API dokümantasyonuna ulaşmanıza yardımcı olur.

**Wallarm, API envanterinizi keşfettikten sonra şunları yapabilirsiniz**:

* [Harici ve dahili](exploring.md#external-vs-internal) API’lerin listesi de dahil olmak üzere tüm API varlıklarınıza tam görünürlük elde edin.
* API’lere giren ve çıkan [verileri](exploring.md#endpoint-details) görün.
* Açık (düzeltimek bekleyen) güvenlik açıklarına sahip uç noktaların listesini alın.
* İstenilen herhangi bir API uç noktası için son 7 gün içinde gerçekleşen tehditlerin bir listesini alın.
* Yalnızca saldırıya uğramış API’leri filtreleyin, hit sayısına göre sıralayın.
* [Hassas verileri](#sensitive-data-detection) tüketen ve taşıyan API’leri filtreleyin.
* API envanterinizin yapısı ve sorunlarına ilişkin görselleştirilmiş özeti kullanışlı bir [gösterge panelinde](dashboard.md) görüntüleyin.
* Hangi uç noktaların bir saldırı hedefi olma [olasılığının en yüksek](risk-score.md) olduğunu anlayın.
* [Gölge, yetim ve zombi API’leri](rogue-api.md) bulun.
* Seçilen zaman aralığında API’de meydana gelen [değişiklikleri izleyin](track-changes.md).
* API uç noktalarını [BOLA otomatik koruma durumu](bola-protection.md) ile filtreleyin.
* Geliştiricilerinize oluşturulan API envanterini inceleme ve indirme için [erişim](../user-guides/settings/users.md#user-roles) sağlayın.

## API Discovery nasıl çalışır?

API Discovery, istek istatistiklerine dayanır ve gerçek API kullanımına göre güncel API spesifikasyonları üretmek için gelişmiş algoritmalar kullanır.

### Trafik işleme

API Discovery, analizleri yerelde ve Bulut’ta gerçekleştirmek için hibrit bir yaklaşım kullanır. Bu yaklaşım, istek verileri ve hassas veriler yerelde tutulurken istatistik analizleri için Bulut’un gücünden yararlanılan [gizlilik-öncelikli bir süreci](#security-of-data-uploaded-to-the-wallarm-cloud) mümkün kılar:

1. API Discovery, meşru trafiği yerelde analiz eder. Wallarm, isteklerin gönderildiği uç noktaları ve hangi parametrelerin iletilip geri döndürüldüğünü inceler.
1. Bu verilere göre istatistikler oluşturulur ve Bulut’a gönderilir.
1. Wallarm Cloud, alınan istatistikleri birleştirir ve bunlara dayanarak bir [API açıklaması](exploring.md) oluşturur.

    !!! info "Gürültü tespiti"
        Seyrek veya tekil istekler [gürültü olarak kabul edilir](#noise-detection) ve API envanterine dahil edilmez.

### Gürültü tespiti

API Discovery modülü, gürültüyü iki ana trafik parametresine göre tespit eder:

* Uç nokta stabilitesi - uç noktaya gelen ilk istekten itibaren 5 dakika içinde en az 5 istek kaydedilmelidir.
* Parametre stabilitesi - uç noktaya gelen isteklerde parametrenin görülme oranı %1’den fazla olmalıdır.

API envanteri, bu eşikleri aşan uç noktaları ve parametreleri gösterecektir. Tam API envanterinin oluşturulması için gereken süre, trafik çeşitliliği ve yoğunluğuna bağlıdır. 

Ayrıca, API Discovery diğer kriterlere dayanarak istekleri filtreler:

* Yalnızca sunucunun 2xx aralığında yanıt verdiği istekler işlenir.
* REST API tasarım ilkelerine uymayan istekler işlenmez.
    
    Bu, yanıtların `Content-Type` başlığı kontrol edilerek yapılır: eğer `application/json` içermiyorsa (ör. `Content-Type: application/json;charset=utf-8`), istek REST API değil kabul edilir ve analiz edilmez.
    
    Başlık yoksa, API Discovery isteği analiz eder.

* `Accept` ve benzerleri gibi standart alanlar ayıklanır.
* `localhost` veya loopback adreslerini hedefleyen istekler işlenmez.

### Hassas veri tespiti

API Discovery, API’lerinizin tükettiği ve taşıdığı hassas verileri [tespit eder ve vurgular](sensitive-data.md):

* IP ve MAC adresleri gibi teknik veriler
* Gizli anahtarlar ve parolalar gibi oturum açma bilgileri
* Banka kartı numaraları gibi finansal veriler
* Tıbbi lisans numarası gibi tıbbi veriler
* Ad soyad, pasaport numarası veya SSN gibi kişisel olarak tanımlanabilir bilgiler (PII)

API Discovery, tespit sürecini yapılandırma ve kendi hassas veri kalıplarınızı ekleme olanağı sağlar (NGINX Node 5.0.3 veya Native Node 0.7.0 ya da üstü gereklidir).

### Hassas iş akışları

[sensitive business flow](sbf.md) özelliği ile API Discovery, kimlik doğrulama, hesap yönetimi, faturalandırma ve benzeri kritik işlevler gibi belirli iş akışları ve işlevleri için kritik olan uç noktaları otomatik olarak belirleyebilir.

Otomatik belirlemenin yanı sıra, atanan hassas iş akışı etiketlerini manuel olarak ayarlayabilir ve seçtiğiniz uç noktalar için etiketleri manuel olarak belirleyebilirsiniz.

Uç noktalara hassas iş akışı etiketleri atandığında, keşfedilen tüm uç noktaları belirli bir iş akışına göre filtrelemek mümkün olur; bu da en kritik iş yeteneklerini korumayı kolaylaştırır.

![API Discovery - Hassas iş akışlarına göre filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)

### Wallarm Cloud’a yüklenen verilerin güvenliği

API Discovery trafiğin büyük kısmını yerelde analiz eder. Modül, Wallarm Cloud’a yalnızca keşfedilen uç noktaları, parametre adlarını ve çeşitli istatistiksel verileri (geliş zamanı, sayıları vb.) gönderir. Tüm veriler güvenli bir kanaldan iletilir: istatistikler Wallarm Cloud’a yüklenmeden önce, API Discovery modülü istek parametrelerinin değerlerini [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algoritmasıyla özetler.

Bulut tarafında, özetlenmiş veriler istatistiksel analiz için kullanılır (örneğin, aynı parametrelere sahip isteklerin nicelenmesinde).

Diğer veriler (uç nokta değerleri, istek yöntemleri ve parametre adları), API envanterinin oluşturulmasını imkansız hale getireceği için Wallarm Cloud’a yüklenmeden önce özetlenmez; zira özetler orijinal haline geri döndürülemez.

!!! warning "Önemli"
    Wallarm, parametrelerde belirtilen değerleri Cloud’a göndermez. Yalnızca uç nokta, parametre adları ve bunlara ilişkin istatistikler gönderilir.

## API Discovery demo videosu

API Discovery demo videosunu izleyin:

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/0bRHVtpWkJ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Playground’da API Discovery’yi denemek

Modülü kaydolmadan ve düğümü ortamınıza dağıtmadan önce bile denemek için, [Wallarm Playground’da API Discovery’yi](https://tour.playground.wallarm.com/api-discovery/?utm_source=wallarm_docs_apid) keşfedin.

Playground’da, sanki gerçek verilerle doldurulmuş gibi API Discovery görünümüne erişebilir; böylece modülün nasıl çalıştığını öğrenip deneyebilir ve salt okunur modda kullanımına dair bazı faydalı örnekler edinebilirsiniz.

![API Discovery – Örnek Veriler](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## API Discovery’yi etkinleştirme ve yapılandırma

API Discovery’yi kullanmaya başlamak için, [API Discovery Kurulumu](setup.md)’nda açıklandığı şekilde etkinleştirip yapılandırın.