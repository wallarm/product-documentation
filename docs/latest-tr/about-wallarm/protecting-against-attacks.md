[rule-creation-options]:    ../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# Saldırı Tespit Prosedürü

Wallarm platformu API trafiğini sürekli analiz eder ve kötü amaçlı istekleri gerçek zamanlı olarak etkisiz hale getirir. Bu makalede, Wallarm'ın saldırılara karşı koruduğu kaynak türlerini, trafikte saldırıları tespit yöntemlerini ve tespit edilen tehditleri nasıl takip edip yöneteceğinizi öğreneceksiniz.

## Saldırı nedir ve saldırının bileşenleri nelerdir?

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.18% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/pmaofaxiwniz?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

<a name="attack"></a>**Saldırı**, aşağıdaki özelliklere göre gruplanmış tek bir hit veya birden fazla hit'tir:

* Aynı saldırı türü, kötü amaçlı payload içeren parametre ve hit'lerin gönderildiği adres. Hit'ler aynı veya farklı IP adreslerinden gelebilir ve tek bir saldırı türü içinde kötü amaçlı payload değerleri farklı olabilir. Yeni hit, son hit'ten itibaren bir saat içinde gelmelidir - aksi halde ayrı bir saldırıya gidecektir.

    Bu hit gruplama yöntemi temeldir ve tüm hit'lere uygulanır.

* [Hit'lerin kaynak IP'ye göre gruplanması](../user-guides/events/grouping-sampling.md#grouping-of-hits) etkinse aynı kaynak IP adresi. Diğer hit parametre değerleri farklı olabilir.

    Bu hit gruplama yöntemi, Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb ve Virtual patch saldırı türleri dışındaki tüm hit'ler için çalışır.

    Hit'ler bu yöntemle gruplanıyorsa, saldırı için [**Mark as false positive**](../user-guides/events/check-attack.md#false-positives) düğmesi kullanılamaz.

Listelenen hit gruplama yöntemleri birbirini dışlamaz. Hit'ler her iki yöntemin de özelliklerine sahipse, hepsi tek bir saldırıda gruplanır.

<a name="hit"></a>**Hit**, serileştirilmiş kötü amaçlı bir istektir (orijinal kötü amaçlı istek ve Wallarm node tarafından eklenen meta veriler). Wallarm, tek bir istekte farklı türlerde birden çok kötü amaçlı payload tespit ederse, her birinde tek bir türde payload olacak şekilde birden fazla hit kaydeder.

<a name="malicious-payload"></a>**Kötü amaçlı payload**, orijinal isteğin aşağıdaki öğeleri içeren kısmıdır:

* Bir istekte tespit edilen saldırı işaretleri. Aynı saldırı türünü karakterize eden birden çok saldırı işareti bir istekte tespit edilirse, yalnızca ilk işaret payload'a kaydedilir.
* Saldırı işaretinin bağlamı. Bağlam, tespit edilen saldırı işaretlerinin öncesindeki ve sonrasındaki sembollerin kümesidir. Payload uzunluğu sınırlı olduğundan, bir saldırı işareti payload'un tamamını kaplıyorsa bağlam atlanabilir.

    Saldırı işaretleri [davranışsal saldırıları](../attacks-vulns-list.md#attack-types) tespit etmek için kullanılmadığından, davranışsal saldırıların bir parçası olarak gönderilen isteklerin payload'ları boştur.

[Wallarm'da saldırıları nasıl analiz edeceğinizi öğrenin →](../user-guides/events/check-attack.md)

## Korumalı kaynak türleri

Wallarm node'ları korunan kaynaklara gönderilen HTTP ve WebSocket trafiğini analiz eder:

* HTTP trafik analizi varsayılan olarak etkindir.

    Wallarm node'ları HTTP trafiğini [girdi doğrulama saldırıları](../attacks-vulns-list.md#attack-types) ve [davranışsal saldırılar](../attacks-vulns-list.md#attack-types) için analiz eder.
* WebSocket trafik analizi ek olarak [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket) yönergesiyle etkinleştirilmelidir.

    Wallarm node'ları WebSocket trafiğini yalnızca [girdi doğrulama saldırıları](../attacks-vulns-list.md#attack-types) için analiz eder.

Korumalı kaynağın API'si aşağıdaki teknolojilere dayanabilir (WAAP [abonelik planı](subscription-plans.md#core-subscription-plans) kapsamında sınırlıdır):

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

<a name="attack-handling-process"></a>
## Saldırı işleme süreci

Saldırıları tespit etmek ve işlemek için Wallarm aşağıdaki süreci kullanır:

1. İsteğin hiç işlenip işlenmeyeceğini anlamak için [IP listelerini](../user-guides/ip-lists/overview.md) kontrol eder. Denylist isteği engeller, allowlist izin verir - her ikisi de daha fazla analiz olmadan.
1. İstek formatını belirler ve [ayrıştırır](../user-guides/rules/request-processing.md); her istek parçasına [temel dedektörleri](#basic-set-of-detectors) uygulamak için.
1. İsteğin yönlendirildiği uç noktayı belirler, [özel kuralları](#custom-rules)/[mitigation controls](#mitigation-controls) ve [specific module settings](#specific-module-settings) uygular ve [filtreleme modunu](../admin-en/configure-wallarm-mode.md) anlar.
1. Temel dedektörler, özel kurallar ve belirli modül ayarlarına dayanarak isteğin bir saldırının parçası olup olmadığına karar verir.
1. Karar ve filtreleme moduna uygun olarak isteği işler.

![Saldırı işleme süreci - diyagram](../images/about-wallarm-waf/overview/attack-handling-diagram.png)

Kuralların, mitigation controls, ayarların ve filtreleme modunun üst uç noktadan veya [uygulamadan](../user-guides/settings/applications.md) devralınabileceğini unutmayın. Daha spesifik olan önceliklidir.

## Saldırı tespiti için araçlar

Saldırıları tespit etmek için Wallarm, korunan kaynağa gönderilen tüm istekleri aşağıdaki araçları kullanarak [analiz eder](#attack-handling-process):

* [Temel dedektör seti](#basic-set-of-detectors)
* [Özel kurallar](#custom-rules) / [mitigation controls](#mitigation-controls)
* [Belirli modül ayarları](#specific-module-settings)

<a name="basic-set-of-detectors"></a>
### Temel dedektör seti

Wallarm, farklı saldırı türü işaretlerini token dizileri olarak belirlemek için Wallarm tarafından geliştirilen (**libproton**) temel dedektör setini kullanır; örneğin: [SQL injection saldırı türü](../attacks-vulns-list.md#sql-injection) için `union select`. İstek, setteki diziyle eşleşen bir token dizisi içeriyorsa, bu istek ilgili türde bir saldırı olarak kabul edilir.

Wallarm, yeni saldırı türleri ve halihazırda tanımlanmış saldırı türleri için dedektörler (token dizileri) listesini düzenli olarak günceller.

Wallarm ayrıca SQL injection saldırılarını Wallarm tarafından geliştirilen (**libdetection**) ile doğrular. [Yönetmeyi](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) görün.

<a name="custom-rules"></a>
### Özel kurallar

Özel [kurallar](../user-guides/rules/rules.md), temel dedektör seti tarafından tanımlanan davranışı ince ayarlamak için kullanılır. Kullanıcılar bunları Wallarm Console içinde oluşturur ve kurallar kümesi filtreleme node'una yüklenir.

<a name="mitigation-controls"></a>
### Mitigation controls

[Mitigation controls](../about-wallarm/mitigation-controls-overview.md), Wallarm'ın saldırı korumasını ek güvenlik önlemleriyle genişletir ve Wallarm davranışının ince ayarına olanak tanır.

<a name="specific-module-settings"></a>
### Belirli modül ayarları

Temel dedektörler veya özel kurallarla karşılaştırmanın yanı sıra, istekler şu gibi farklı koruma araçlarının sağladığı ayarlara göre de kontrol edilir:

* [API Abuse Prevention](../api-abuse-prevention/overview.md)
* [API Specification Enforcement](../api-specification-enforcement/overview.md)
* [Credential Stuffing](../about-wallarm/credential-stuffing.md)
* [Tetikleyici tabanlı koruma önlemleri](../user-guides/triggers/triggers.md#what-you-can-do-with-triggers)

Bu araçlardan herhangi biri, belirli bir saldırı veya zafiyet tespitine ve isteğin engellenmesine neden olabilir.

## Belirli saldırı türlerini yok sayma

**Belirli saldırı türlerini yok say** kuralı, belirli istek öğelerinde belirli saldırı türlerinin tespitini devre dışı bırakmaya izin verir.

Varsayılan olarak, Wallarm node'u herhangi bir istek öğesinde herhangi bir saldırı türüne ait işaretler tespit ederse isteği bir saldırı olarak işaretler. Ancak, saldırı işaretleri içeren bazı istekler aslında meşru olabilir (ör. Veritabanı Yöneticisi Forumunda gönderi yayınlayan isteğin gövdesi, [kötü amaçlı SQL komutu](../attacks-vulns-list.md#sql-injection) açıklamasını içerebilir).

Wallarm node'u isteğin standart payload'unu kötü amaçlı olarak işaretlerse bir [yanlış pozitif](#false-positives) oluşur. Yanlış pozitifleri önlemek için, korunan API'nin özelliklerine uyum sağlamak üzere belirli türde özel kurallar kullanılarak standart saldırı tespit kurallarının ayarlanması gerekir. Wallarm bunu yapmak için **Belirli saldırı türlerini yok say** [kuralını](../user-guides/rules/rules.md) sağlar.

**Kuralın oluşturulması ve uygulanması**

--8<-- "../include/rule-creation-initial-step.md"
1. Fine-tuning attack detection → Ignore certain attacks öğelerini seçin.
1. **If request is** bölümünde, kuralın uygulanacağı kapsamı [tanımlayın](../user-guides/rules/rules.md#configuring).
1. Yalnızca belirli saldırıların işaretlerinin (bunları seçin) mı yoksa tüm saldırıların işaretlerinin mi yok sayılacağını belirleyin.
1. **In this part of request** bölümünde, kuralı uygulamak istediğiniz istek noktalarını belirtin.

    Mevcut tüm noktalar [burada](../user-guides/rules/request-processing.md) açıklanmıştır; özel kullanım durumunuza uyanları seçebilirsiniz.

1. [Kural derlemesinin tamamlanmasını](../user-guides/rules/rules.md#ruleset-lifecycle) bekleyin.

**Kural örneği**

Diyelim ki kullanıcı, veritabanı yöneticisi forumunda gönderinin yayınlanmasını onayladığında, istemci `https://example.com/posts/` uç noktasına bir POST isteği gönderiyor. Bu isteğin aşağıdaki özellikleri vardır:

* Gönderi içeriği, istek gövdesindeki `postBody` parametresiyle iletilir. Gönderi içeriği, Wallarm tarafından kötü amaçlı olarak işaretlenebilecek SQL komutlarını içerebilir.
* İstek gövdesi `application/json` türündedir.

[SQL injection](../attacks-vulns-list.md#sql-injection) içeren cURL isteği örneği:

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

Bu nedenle, `https://example.com/posts/` adresine yapılan isteklerin `postBody` parametresindeki SQL injection'ları yok saymanız gerekir.

Bunu yapmak için, **Belirli saldırı türlerini yok say** kuralını ekrandaki ekran görüntüsünde gösterildiği gibi ayarlayın:

![“Belirli saldırı türlerini yok say” kuralı örneği](../images/user-guides/rules/ignore-attack-types-rule-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## İkili veride belirli saldırı işaretlerini yok sayma

Varsayılan olarak, Wallarm node'u gelen istekleri bilinen tüm saldırı işaretleri için analiz eder. Analiz sırasında, Wallarm node'u saldırı işaretlerini normal ikili semboller olarak değerlendirmeyebilir ve ikili veride yanlışlıkla kötü amaçlı payload'lar tespit edebilir.

**Allow binary data** [kuralını](../user-guides/rules/rules.md) kullanarak, ikili veri içeren istek öğelerini açıkça belirtebilirsiniz. Belirtilen istek öğesinin analizi sırasında, Wallarm node'u ikili veri içinde asla iletilemeyecek saldırı işaretlerini yok sayacaktır.

* **Allow binary data** kuralı, ikili veri (ör. arşivlenmiş veya şifrelenmiş dosyalar) içeren istek öğeleri için saldırı tespitinin ince ayarını yapmanıza olanak tanır.

**Kuralın oluşturulması ve uygulanması**

--8<-- "../include/rule-creation-initial-step.md"
1. Fine-tuning attack detection → Binary data processing öğelerini seçin.
1. **If request is** bölümünde, kuralın uygulanacağı kapsamı [tanımlayın](../user-guides/rules/rules.md#configuring).
1. **In this part of request** bölümünde, kuralı uygulamak istediğiniz istek noktalarını belirtin.

    Mevcut tüm noktalar [burada](../user-guides/rules/request-processing.md) açıklanmıştır; özel kullanım durumunuza uyanları seçebilirsiniz.

1. [Kural derlemesinin tamamlanmasını](../user-guides/rules/rules.md#ruleset-lifecycle) bekleyin.

**Kural örneği**

Diyelim ki kullanıcı, sitedeki formu kullanarak ikili dosya içeren bir görsel yüklediğinde, istemci `multipart/form-data` türünde bir POST isteğini `https://example.com/uploads/` adresine gönderir. İkili dosya, gövde parametresi `fileContents` içinde iletilir ve bunu izinli hale getirmeniz gerekir.

Bunu yapmak için, **Allow binary data** kuralını ekran görüntüsünde gösterildiği gibi ayarlayın:

![“Allow binary data” kuralı örneği](../images/user-guides/rules/ignore-binary-attacks-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

<a name="monitoring-and-blocking-attacks"></a>
## Saldırıların izlenmesi ve engellenmesi

**Girdi doğrulama saldırıları**

Wallarm, [girdi doğrulama saldırılarını](../attacks-vulns-list.md#attack-types) aşağıdaki modlarda işleyebilir:

* İzleme modu: saldırıları tespit eder ancak engellemez.
* Safe blocking modu: saldırıları tespit eder, ancak yalnızca [graylisted IP'lerden](../user-guides/ip-lists/overview.md) kaynaklananları engeller. Graylisted IP'lerden gelen meşru istekler engellenmez.
* Engelleme modu: saldırıları tespit eder ve engeller.

Farklı filtreleme modlarının nasıl çalıştığı ve filtreleme modunun genel olarak ve belirli uygulamalar, alan adları veya uç noktalar için nasıl yapılandırılacağına ilişkin ayrıntılı bilgi [burada](../admin-en/configure-wallarm-mode.md) mevcuttur.

**Davranışsal saldırılar**

Wallarm'ın [davranışsal saldırıları](../attacks-vulns-list.md#attack-types) nasıl tespit ettiği ve tespit durumunda nasıl davrandığı, filtreleme modu tarafından değil, bu saldırı türü korumasının [belirli yapılandırması](#specific-module-settings) tarafından tanımlanır.

<a name="false-positives"></a>
## Yanlış pozitifler

**Yanlış pozitif**, meşru bir istekte saldırı işaretleri tespit edildiğinde veya meşru bir varlık zafiyet olarak nitelendirildiğinde ortaya çıkar. [Zafiyet taramasında yanlış pozitiflerle ilgili daha fazla bilgi →](detecting-vulnerabilities.md#false-positives)

İstekleri saldırılar açısından analiz ederken, Wallarm ultra düşük yanlış pozitiflerle optimum API koruması sağlayan standart bir kural seti kullanır. Korunan API'nin özellikleri nedeniyle standart kurallar, meşru isteklerde saldırı işaretlerini yanlışlıkla tanıyabilir. Örneğin: Veritabanı Yöneticisi Forumuna kötü amaçlı SQL sorgusu açıklaması içeren bir gönderi ekleyen istekte bir SQL injection saldırısı tespit edilebilir.

Bu gibi durumlarda, standart kurallar korunan API'nin özelliklerine uyum sağlamak üzere aşağıdaki yöntemlerle ayarlanmalıdır:

* Potansiyel yanlış pozitifleri (tüm saldırıları [`!known` etiketi](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits) ile filtreleyerek) analiz edin ve yanlış pozitifleri doğruluyorsanız belirli saldırıları veya hits öğelerini uygun şekilde [işaretleyin](../user-guides/events/check-attack.md#false-positives). Wallarm, aynı isteklerin tespit edilen saldırı işaretleri için analizini devre dışı bırakan kuralları otomatik olarak oluşturacaktır.
* Belirli isteklerde [belirli saldırı türlerinin tespitini devre dışı bırakın](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types).
* [İkili veride belirli saldırı işaretlerinin tespitini devre dışı bırakın](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data).
* [İsteklere yanlışlıkla uygulanan ayrıştırıcıları devre dışı bırakın](../user-guides/rules/request-processing.md#managing-parsers).

Yanlış pozitifleri belirlemek ve ele almak, API'lerinizi korumak için Wallarm'ın ince ayarının bir parçasıdır. İlk Wallarm node'unu izleme [modunda](#monitoring-and-blocking-attacks) dağıtmanızı ve tespit edilen saldırıları analiz etmenizi öneririz. Bazı saldırılar yanlışlıkla saldırı olarak tanınıyorsa onları yanlış pozitif olarak işaretleyin ve filtreleme node'unu engelleme moduna geçirin.

## Wallarm UI'da Saldırılar

Wallarm, tespit edilen tüm saldırıları ve bunlara ilişkin ayrıntıları gösteren kapsamlı bir kullanıcı arayüzü sunar. Hızlı görselleştirme için saldırı panolarını kullanabilir ve kendi özel bildirimlerinizi ayarlayabilirsiniz.

Ayrıntılar için [Saldırı Analizi](../user-guides/events/check-attack.md) makalesine bakın.

![Saldırı görünümü](../images/user-guides/events/check-attack.png)

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->