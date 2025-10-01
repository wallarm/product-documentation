# EOL bir düğümü yükseltirken Wallarm düğümünde neler yeni

Bu sayfa, kullanım dışı bırakılmış sürümlerin (3.6 ve altı) düğümünü 5.0 sürümüne yükseltirken sunulan değişiklikleri listeler. Listelenen değişiklikler hem standart (müşteri) hem de çok kiracılı Wallarm düğümleri için geçerlidir.

!!! warning "Wallarm düğümleri 3.6 ve altı kullanım dışı"
    3.6 ve altındaki Wallarm düğümlerinin [kullanım dışı](../versioning-policy.md#version-list) olması nedeniyle yükseltilmesi önerilir.

    5.x sürümündeki Wallarm düğümünde düğüm yapılandırması ve trafik filtrelemesi önemli ölçüde basitleştirilmiştir. 5.x düğümünün bazı ayarları daha eski sürümlerin düğümleriyle **uyumlu değildir**. Modülleri yükseltmeden önce lütfen değişiklikler listesini ve [genel önerileri](../general-recommendations.md) dikkatle inceleyin.

## All-in-one yükleyici ve DEB/RPM paketlerinin kullanım dışı bırakılması

Artık, Wallarm düğümünü çeşitli ortamlarda NGINX için dinamik modül olarak kurarken ve yükseltirken, kurulumu kolaylaştırmak ve standart hale getirmek için tasarlanmış **all-in-one yükleyici** kullanılır. Bu yükleyici, işletim sisteminizi ve NGINX sürümünüzü otomatik olarak tanımlar ve gerekli tüm bağımlılıkları kurar.

Yükleyici, aşağıdaki işlemleri otomatik olarak gerçekleştirerek süreci basitleştirir:

1. İşletim sisteminizi ve NGINX sürümünüzü kontrol eder.
1. Algılanan işletim sistemi ve NGINX sürümü için Wallarm depolarını ekler.
1. Bu depolardan Wallarm paketlerini kurar.
1. Kurulan Wallarm modülünü NGINX’inize bağlar.
1. Sağlanan belirteci kullanarak filtreleme düğümünü Wallarm Cloud’a bağlar.

[All-in-one yükleyici ile düğümün nasıl yükseltileceğine dair ayrıntılar →](nginx-modules.md)

Düğüm kurulumu için DEB/RPM paketleri artık "kullanım dışı" durumundadır.

## collectd’nin kaldırılması

Önceden tüm filtreleme düğümlerine kurulan collectd servisi ilgili eklentileriyle birlikte kaldırılmıştır. Metri̇kler artık Wallarm’ın yerleşik mekanizmalarıyla toplanıp gönderilmekte, böylece harici araçlara bağımlılık azalmaktadır.

Prometheus ve JSON formatlarında aynı metrikleri sağlayarak collectd’nin yerini alan [`/wallarm-status` uç noktasını](../../admin-en/configure-statistics-service.md) kullanın.

Bu değişikliğin bir sonucu olarak, yapılandırma kurallarında da aşağıdakiler değişmiştir:

* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` collectd yapılandırma dosyası artık kullanılmamaktadır.
* Daha önce metrikleri bir ağ eklentisi üzerinden iletmek için collectd kullandıysanız, örneğin:

    ```
    LoadPlugin network

    <Plugin "network">
        Server "<Server IPv4/v6 address or FQDN>" "<Server port>"
    </Plugin>
    ```

    artık Prometheus üzerinden `/wallarm-status` kazımasına (scraping) geçmelisiniz.

## API Sessions

API ekonomisine uyarlanmış benzersiz bir güvenlik özelliği sunuyoruz - [API Sessions](../../api-sessions/overview.md). Bu ekleme, kullanıcıların API’leriniz ve uygulamalarınızla nasıl etkileşim kurduğuna dair şeffaflık sağlayarak, API’leriniz genelindeki saldırılar, anomaliler ve kullanıcı davranışlarına görünürlük kazandırır.

![!API Sessions bölümü - izlenen oturumlar](../../images/api-sessions/api-sessions.png)

Saldırganlar, eylemlerini meşru kullanıcı davranışlarıyla harmanlayarak çoğu zaman savunmasız uç noktaları istismar eder. Bu oturumların nasıl geliştiğine dair tam bağlam olmadan, kalıpları veya tehditleri belirlemek, birden çok araç ve sistemi içeren zaman alıcı bir süreç haline gelir. Kuruluşlar API düzeyinde uygun bir görünürlüğe sahip değildir.

API Sessions ile güvenlik ekipleri artık tüm ilgili etkinlikleri kullanıcı oturumuna göre gruplanmış olarak görebilir ve saldırı dizilerine, kullanıcı anormalliklerine ve normal davranışlara benzersiz bir görünürlük sunar. Eskiden saatler veya günler süren araştırmalar artık Wallarm Console’dan sadece birkaç dakikada doğrudan gerçekleştirilebilir.

Ana özellikler:

* Saldırılar, anomaliler ve kullanıcı davranışlarına görünürlük: Bir oturumda yapılan her isteği görüntüleyin ve analiz edin, saldırı vektörlerini ve şüpheli kalıpları takip edin.
* Hem eski hem modern oturumlar için destek: Uygulamalarınız cookie tabanlı oturumlara veya JWT/OAuth’a dayansa da Wallarm API Sessions tam uyumluluk ve görünürlük sağlar.
* Bireysel saldırılar ve bunların ait olduğu oturumlar arasında sorunsuz gezinme.

API Sessions ile güvenlik ekipleri artık kolayca:

* Potansiyel saldırı yollarını ve tehlikeye atılmış kaynakları anlamak için tehdit aktörlerinin tam etkinliğini araştırabilir.
* Gölge veya zombi API’lere nasıl erişildiğini belirleyerek belgelendirilmemiş veya güncel olmayan API’lardan kaynaklanan riskleri azaltabilir.
* Güvenlik soruşturmaları sırasında işbirliğini teşvik etmek için temel içgörüleri meslektaşlarla paylaşabilir.

[Daha fazla bilgi](../../api-sessions/overview.md)

## API Sessions’ta yanıt parametreleri

!!! tip ""
    [NGINX Node 5.3.0 ve üstü](../node-artifact-versions.md) ve [Native Node 0.12.0 ve üstü](../native-node/node-artifact-versions.md)

Wallarm’ın [API Sessions](../../api-sessions/overview.md) özelliği, kullanıcı aktiviteleri dizilerine görünürlük sağlar. Bu eklemeyle yalnızca istek değil, aynı zamanda her oturum içinde yanıt bilgileri de kullanılabilir:

* Kullanıcı aktivitelerine net ve tam bir görünüm sağlayarak, yanıtların istenen başlık ve parametrelerini ilgili isteklerin içinde görüntülenecek şekilde yapılandırabilirsiniz.
* Oturumlar için gruplama anahtarları olarak yanıt parametrelerini kullanabilirsiniz (bkz. [örnek](../../api-sessions/setup.md#grouping-keys-example)); bu, isteklerin oturumlara gruplanmasını daha isabetli hale getirir.

![!API Sessions - gruplama anahtarlarının çalışmasına örnek](../../images/api-sessions/api-sessions-grouping-keys.png)

## Rate limits

Uygun hız sınırlamasının (rate limiting) olmaması, saldırganların hizmet reddi (DoS) ile sonuçlanabilecek yüksek hacimli istekler başlatmasına veya sistemi aşırı yüklemesine olanak tanıdığı için API güvenliği açısından önemli bir sorun olmuştur; bu da meşru kullanıcıları olumsuz etkiler.

Wallarm’ın rate limiting özelliği ile güvenlik ekipleri, hizmetin yükünü etkin şekilde yönetebilir ve yanlış alarmları önleyerek hizmetin meşru kullanıcılar için erişilebilir ve güvenli kalmasını sağlar. Bu özellik, geleneksel IP tabanlı hız sınırlamanın yanı sıra JSON alanları, base64 kodlu veriler, cookie’ler, XML alanları ve daha fazlası dahil olmak üzere istek ve oturum parametrelerine dayalı çeşitli bağlantı limitleri sunar.

Örneğin, her kullanıcı için API bağlantılarını sınırlayarak dakikada binlerce istek yapmalarını engelleyebilirsiniz. Bu durum sunucularınıza ağır yük bindirir ve hizmetin çökmesine neden olabilir. Rate limiting uygulayarak sunucularınızı aşırı yüklenmeden koruyabilir ve tüm kullanıcıların API’ye adil erişimini sağlayabilirsiniz.

Wallarm Console UI → **Rules** → **Advanced rate limiting** içinde, kullanım senaryonuza uygun hız limit kapsamını, oran, patlama (burst), gecikme ve yanıt kodunu belirterek hız limitlerini kolayca yapılandırabilirsiniz.

[Rate limit yapılandırma rehberi →](../../user-guides/rules/rate-limiting.md)

Rate limiting kuralı, özelliği kurmanın önerilen yöntemi olsa da, yeni NGINX yönergelerini kullanarak da hız limitlerini ayarlayabilirsiniz:

* [`wallarm_rate_limit`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit)
* [`wallarm_rate_limit_enabled`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_enabled)
* [`wallarm_rate_limit_log_level`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_log_level)
* [`wallarm_rate_limit_status_code`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_status_code)
* [`wallarm_rate_limit_shm_size`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_shm_size)

## Credential stuffing tespiti <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm, credential stuffing girişimleri için gerçek zamanlı tespit ve bildirimler sunar. Credential stuffing, çalınmış veya zayıf kullanıcı adı/e‑posta ve parola çiftlerinin, kullanıcı hesaplarına yasa dışı erişim sağlamak amacıyla web sitesi giriş formlarına otomatik olarak gönderilmesidir; artık yakından izlenmektedir. Bu özellik, kimlik bilgileri tehlikeye atılmış hesapları belirlemenize ve hesap sahiplerini bilgilendirme ve hesap erişimini geçici olarak askıya alma gibi aksiyonlar alarak güvence altına almanıza olanak tanır.

[Credential Stuffing Detection nasıl yapılandırılır](../../about-wallarm/credential-stuffing.md)

![Saldırılar - credential stuffing](../../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

!!! info "Credential stuffing tespitini destekleyen seçili yapıtlar"
    All-in-one yükleyici, NGINX Ingress Controller, NGINX tabanlı Docker imajı ve bulut imajları (AMI, GCP Image) gibi sınırlı sayıda yapıt artık yeni tanıtılan credential stuffing tespiti özelliğini desteklemektedir.

## GraphQL API koruması <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm, varsayılan olarak GraphQL’de düzenli saldırıları (SQLi, RCE, [vb.](../../attacks-vulns-list.md)) tespit eder. Ancak, protokolün bazı yönleri, aşırı bilgi ifşası ve DoS ile ilgili [GraphQL’e özgü](../../attacks-vulns-list.md#graphql-attacks) saldırıların uygulanmasına olanak tanır.

Wallarm, bu saldırılara karşı koruma sunar. Koruma, kuruluşunuzun GraphQL politikasını — GraphQL istekleri için bir dizi limit — yapılandırarak etkinleştirilir. Belirlenen limitlerden herhangi birini aşan isteklere, etkin filtreleme moduna göre filtreleme düğümü tarafından işlem yapılır — yalnızca politika ihlallerini kaydeder veya bu girişimleri kaydeder ve engeller.

İşlevselliği kullanmaya başlamak için Wallarm Console’da en az bir [**Detect GraphQL attacks** kuralı](../../api-protection/graphql-rule.md#) oluşturmanız gerekir.

[GraphQL API Protection nasıl yapılandırılır](../../api-protection/graphql-rule.md)

![GraphQL eşik değerleri](../../images/user-guides/rules/graphql-rule.png)

## Mitigation Controls

Tüm Wallarm saldırı azaltma ayarları için birleşik bir yönetim merkezi — [**Mitigation Controls**](../../about-wallarm/mitigation-controls-overview.md) — sunuyoruz. Mitigation controls ile:

* Tüm Wallarm azaltma ayarlarını tek bir yerden görüntüleyip yönetebilirsiniz.
* Tümünü birleşik bir şekilde yönetirsiniz (tüm kontroller benzer yapılandırma UI’ı ve seçeneklerine sahiptir).
* Her bir kontrolün mevcut modunun hızlı bir genel görünümünü elde edersiniz: aktif mi? sadece izliyor mu yoksa engelliyor mu?
* Her bir kontrol tarafından yakalanan saldırıların hızlı bir özetini alırsınız.

![UI’de Mitigation Controls sayfası](../../images/user-guides/mitigation-controls/mc-main-page.png)

## Dosya yükleme kısıtlama politikası

Wallarm artık yüklenen dosyaların boyutunu doğrudan kısıtlamak için araçlar sunuyor. Bu, [OWASP API Top 10 2023](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) listesinde yer alan en ciddi API güvenlik risklerinden biri olan [sınırsız kaynak tüketimini](../../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) önlemeye yönelik önlemlerin bir parçasıdır.

Abonelik planınıza bağlı olarak, yükleme kısıtlamaları mitigation control veya kural aracılığıyla uygulanır. Tam istek veya seçili bir noktası için dosya boyutu kısıtlamaları belirleyebilirsiniz.

![Dosya yükleme kısıtlama MC - örnek](../../images/api-protection/mitigation-controls-file-upload-1.png)

### Enumeration attack protection

!!! tip ""
    [NGINX Node 6.1.0 ve üstü](../node-artifact-versions.md) ve [Native Node 0.14.1 ve üstü](../native-node/node-artifact-versions.md)

[Enumeration saldırılarına](../../attacks-vulns-list.md#enumeration-attacks) karşı yeni koruma seviyesi enumeration mitigation controls ile birlikte gelir:

* [Enumeration attack protection](../../api-protection/enumeration-attack-protection.md)
* [BOLA enumeration protection](../../api-protection/enumeration-attack-protection.md)
* [Forced browsing protection](../../api-protection/enumeration-attack-protection.md)
* [Brute force protection](../../api-protection/enumeration-attack-protection.md)

Daha önce bu koruma için kullanılan tetikleyicilerle karşılaştırıldığında, mitigation controls:

* Hangi parametrelerin enumeration girişimleri için izleneceğini seçmeye olanak tanır.
* Hangi isteklerin sayılacağını gelişmiş ve sofistike biçimde filtrelemenize imkan verir.
* [API Sessions](../../api-sessions/overview.md) ile derin entegrasyon sağlar: tespit edilen saldırılar ilgili oturum içinde görüntülenir, size neler olup bittiğine ve neden oturum aktivitelerinin saldırı olarak işaretlenip engellendiğine dair tam bağlam sunar.

![BOLA koruması mitigation control - örnek](../../images/user-guides/mitigation-controls/mc-bola-example-01.png)

### DoS protection

!!! tip ""
    [NGINX Node 6.1.0 ve üstü](../node-artifact-versions.md) ve [Native Node 0.14.1 ve üstü](../native-node/node-artifact-versions.md)

[ Sınırsız kaynak tüketimi](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md), en ciddi API güvenlik risklerini içeren [OWASP API Top 10 2023](../../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) listesine dahil edilmiştir. Kendi başına bir tehdit olmakla (aşırı yüklemeden dolayı hizmetin yavaşlaması veya tamamen durması), bu aynı zamanda örneğin enumeration saldırıları gibi farklı saldırı türlerinin de temelini oluşturur. Belirli bir zaman diliminde çok fazla isteğe izin verilmesi bu risklerin başlıca nedenlerinden biridir.

Wallarm, API’nize aşırı trafiği engellemeye yardımcı olmak için yeni [**DoS protection**](../../api-protection/dos-protection.md) mitigation control’ünü sağlar.

![DoS protection - JWT örneği](../../images/api-protection/mitigation-controls-dos-protection-jwt.png)

### Varsayılan kontroller

Wallarm, etkinleştirildiğinde Wallarm platformunun tespit kabiliyetlerini önemli ölçüde artıran bir [varsayılan mitigation controls](../../about-wallarm/mitigation-controls-overview.md#default-controls) seti sunar. Bu kontroller, çeşitli yaygın saldırı kalıplarına karşı güçlü koruma sağlamak üzere önceden yapılandırılmıştır. Mevcut varsayılan mitigation controls şunları içerir:

* [GraphQL koruması](../../api-protection/graphql-rule.md)
* Kullanıcı kimlikleri, nesne kimlikleri ve dosya adları için [BOLA (Broken Object Level Authorization) enumeration koruması](../../api-protection/enumeration-attack-protection.md#bola)
* Parolalar, OTP’ler ve kimlik doğrulama kodları için [Brute force koruması](../../api-protection/enumeration-attack-protection.md#brute-force)
* [Forced browsing koruması](../../api-protection/enumeration-attack-protection.md#forced-browsing) (404 yoklama)
* [Enumeration attack protection](../../api-protection/enumeration-attack-protection.md#generic-enumeration), şunlar dahil:
    
    * Kullanıcı/e‑posta enumerasyonu
    * SSRF (Server-Side Request Forgery) enumerasyonu
    * User-agent rotasyonu

## Sınırsız kaynak tüketimine karşı koruma

!!! tip ""
    [NGINX Node 6.3.0 ve üstü](../node-artifact-versions.md) ve şu anda [Native Node](../../installation/nginx-native-node-internals.md#native-node) tarafından desteklenmemektedir.

Wallarm’ın [API Abuse Prevention](../../api-abuse-prevention/overview.md) özelliği, [sınırsız kaynak tüketimini](../../attacks-vulns-list.md#unrestricted-resource-consumption) engelleme olanağı sunar — otomatik bir istemcinin uygun sınırlar olmadan aşırı API veya uygulama kaynaklarını tükettiği kötüye kullanım davranışı. Buna, çok sayıda zararsız isteğin gönderilmesi, işlemci, bellek veya bant genişliğinin tüketilmesi ve meşru kullanıcılar için hizmet bozulması neden olabilir.

![API Abuse prevention profili](../../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

Bu tür otomatik tehditleri tespit etmek için, API Abuse Prevention üç yeni [dedektör](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works) seti sunar:

* **Yanıt süresi anomali**: API yanıt gecikmesindeki anormal kalıpları tanımlar; bu durum otomatik kötüye kullanım veya arka uç istismar girişimlerinin sinyali olabilir.
* **Aşırı istek tüketimi**: API’ye anormal derecede büyük istek yükleri gönderen istemcileri belirler; bu, arka uç işlem kaynaklarının kötüye kullanımını işaret edebilir.
* **Aşırı yanıt tüketimi**: ömürleri boyunca aktarılan toplam yanıt verisi hacmine dayanarak şüpheli oturumları işaretler. Tekil isteklere odaklanan dedektörlerden farklı olarak, bu dedektör, yavaş damlatma veya dağıtılmış kazıma saldırılarını belirlemek için tüm oturum boyunca yanıt boyutlarını toplar.

## API Specification Enforcement

Bu son güncellemede, API Specification Enforcement özelliğini sunuyoruz. Bu, gelen trafiği filtreleyerek yalnızca API spesifikasyonlarınıza uyan isteklerin geçmesine izin verir. İstemciler ve uygulamalarınız arasına konumlanan Wallarm düğümünü kullanarak, spesifikasyonlarınızdaki uç nokta açıklamalarını gerçek API istekleriyle karşılaştırır. Tanımsız uç nokta isteği veya yetkisiz parametre içeren istekler gibi tutarsızlıklar, yapılandırıldığı şekilde engellenir veya izlenir.

Bu, potansiyel saldırı girişimlerini engelleyerek güvenliği güçlendirir ve ayrıca aşırı yüklenmeleri ve kötüye kullanımları önleyerek API performansını optimize eder.

Ek olarak, bu güncelleme bazı dağıtım seçenekleri için özelliğin çalışmasını teknik olarak kontrol etmeyi sağlayan yeni parametreler getirir:

* All-in-one yükleyici için: [`wallarm_enable_apifw`](../../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX yönergesi.
* NGINX Ingress Controller için: [`controller.wallarm.apifirewall`](../../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) değer grubu.
* NGINX tabanlı Docker imajı için: `WALLARM_APIFW_ENABLE` ortam değişkeni.

[API Specification Enforcement nasıl yapılandırılır](../../api-specification-enforcement/setup.md)

![Spesifikasyon - güvenlik politikalarını uygulamak için kullanın](../../images/api-specification-enforcement/api-specification-enforcement-events.png)

## Yeni saldırı türlerinin tespiti

Wallarm yeni saldırı türlerini tespit eder:

* [Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/) (BOLA), Insecure Direct Object References (veya IDOR) olarak da bilinir, en yaygın API güvenlik açıklarından biri haline gelmiştir. Bir uygulama IDOR / BOLA güvenlik açığı içerdiğinde, hassas bilgilerin veya verilerin saldırganlara ifşa edilmesi olasılığı yüksektir. Saldırganların tek yapması gereken, API çağrısındaki kendi kaynaklarının kimliğini, başka bir kullanıcıya ait bir kaynağın kimliğiyle değiştirmektir. Uygun yetkilendirme kontrollerinin olmaması, saldırganların belirtilen kaynağa erişmesine olanak tanır. Dolayısıyla, bir nesnenin kimliğini alan ve nesne üzerinde herhangi bir işlem yapan her API uç noktası saldırı hedefi olabilir.

    Bu güvenlik açığının istismarını önlemek için, Wallarm düğümü uç noktalarınızı BOLA saldırılarına karşı korumak için kullanabileceğiniz [yeni bir tetikleyici](../../admin-en/configuration-guides/protecting-against-bola.md) içerir. Tetikleyici, belirli bir uç noktaya yönelik istek sayısını izler ve tetikleyicideki eşikler aşıldığında bir BOLA saldırı olayı oluşturur.
* [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)

    Mass Assignment saldırısı sırasında, saldırganlar HTTP istek parametrelerini program kodundaki değişkenlere veya nesnelere bağlamaya çalışır. Bir API savunmasızsa ve bağlamaya izin veriyorsa, saldırganlar, açığa çıkarılması amaçlanmayan hassas nesne özelliklerini değiştirebilir; bu da ayrıcalık yükselmesine, güvenlik mekanizmalarının atlanmasına ve daha fazlasına yol açabilir.
* [SSRF](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)

    Başarılı bir SSRF saldırısı, saldırgana saldırıya uğrayan web sunucusu adına istek yapma olanağı sağlayabilir; bu, kullanılan ağ bağlantı noktalarının ortaya çıkarılmasına, dahili ağların taranmasına ve yetkilendirmenin atlanmasına yol açabilir.

## API Discovery ve API Sessions’ta hassas iş akışları

!!! tip ""
    [NGINX Node 5.3.0 ve üstü](../node-artifact-versions.md) ve [Native Node 0.10.1 ve üstü](../native-node/node-artifact-versions.md)

Hassas iş akışı yeteneği ile Wallarm’ın [API Discovery](../../api-discovery/overview.md) özelliği, kimlik doğrulama, hesap yönetimi, faturalama ve benzeri kritik işlevler gibi belirli iş akışları ve işlevler için kritik olan uç noktaları otomatik olarak tanımlayabilir.

Bu, hassas iş akışlarıyla ilgili uç noktaların düzenli olarak izlenmesini ve güvenlik açıkları veya ihlaller açısından denetlenmesini ve geliştirme, bakım ve güvenlik çalışmaları için önceliklendirilmesini sağlar.

![API Discovery - Hassas iş akışları](../../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

Tanımlanan hassas iş akışları Wallarm’ın [API Sessions](../../api-sessions/overview.md) özelliğine yayılır: bir oturumun istekleri, API Discovery’de hassas iş akışları için önemli olarak etiketlenen uç noktaları etkiliyorsa, bu oturum otomatik olarak bu iş akışını etkiliyor olarak [etiketlenecektir](../../api-sessions/exploring.md#sensitive-business-flows).

Oturumlara hassas iş akışı etiketleri atandıktan sonra, belirli bir iş akışına göre filtrelemek mümkün hale gelir; bu da analizi en önemli olan oturumların seçilmesini kolaylaştırır.

![!API Sessions - hassas iş akışları](../../images/api-sessions/api-sessions-sbf-no-select.png)

## Tam teşekküllü GraphQL ayrıştırıcı

!!! tip ""
    [NGINX Node 5.3.0 ve üstü](../node-artifact-versions.md) ve [Native Node 0.12.0 ve üstü](../native-node/node-artifact-versions.md)

Tam teşekküllü [GraphQL ayrıştırıcı](../../user-guides/rules/request-processing.md#gql), GraphQL istekleri içinde girdi doğrulama saldırılarının (örn. SQL enjeksiyonları) tespitini önemli ölçüde iyileştirerek **daha yüksek doğruluk ve minimum yalancı pozitif** sağlar.

Ana faydalar:

* Girdi doğrulama saldırılarının (örn. SQL enjeksiyonları) **iyileştirilmiş tespiti**
* **Ayrıntılı parametre içgörüleri**: GraphQL istek parametrelerinin değerlerini API Sessions içinde çıkarın ve görüntüleyin, bunları oturum bağlam parametreleri olarak kullanın.

    ![!API Sessions yapılandırması - GraphQL istek parametresi](../../images/api-sessions/api-sessions-graphql.png)

* **Kesin saldırı arama**: argümanlar, direktifler ve değişkenler gibi belirli GraphQL istek bileşenlerindeki saldırıları kesin biçimde belirleyin.
* **Gelişmiş kural uygulaması**: belirli GraphQL istek parçalarına ayrıntılı koruma kuralları uygulayın. Bu, istenen GraphQL istek bölümlerinde belirli saldırı türleri için istisnalar tanımlayarak ince ayar yapmayı ve yapılandırmayı mümkün kılar.

    ![Bir kuralın GraphQL istek noktasına uygulanmasına örnek"](../../images/user-guides/rules/rule-applied-to-graphql-point.png)

## JSON Web Token gücünü kontrol etme

[JSON Web Token (JWT)](https://jwt.io/), API’ler gibi kaynaklar arasında verileri güvenli şekilde değiştirmek için kullanılan popüler bir kimlik doğrulama standardıdır. JWT’nin ele geçirilmesi, kimlik doğrulama mekanizmalarının kırılması saldırganlara web uygulamalarına ve API’lara tam erişim sağladığından, yaygın bir hedeftir. JWT ne kadar zayıfsa, ele geçirilme olasılığı o kadar yüksektir.

Artık, Wallarm [aşağıdaki JWT zayıflıklarını tespit eder](../../attacks-vulns-list.md#weak-jwt):

* Şifrelenmemiş JWT’ler
* Tehlikeye atılmış gizli anahtarlarla imzalanmış JWT’ler

## JSON Web Token’larda saldırı kontrolü

JSON Web Token (JWT), en popüler kimlik doğrulama yöntemlerinden biridir. Bu, JWT içindeki veriler kodlandığından ve isteğin herhangi bir yerinde bulunabileceğinden, (örneğin SQLi veya RCE gibi) saldırıları gerçekleştirmek için favori bir araç haline getirir ve bu saldırıları bulmak çok zordur.

Wallarm düğümü isteğin herhangi bir yerindeki JWT’yi bulur, onu [decode eder](../../user-guides/rules/request-processing.md#jwt) ve uygun [filtreleme modu](../../admin-en/configure-wallarm-mode.md) kapsamında bu kimlik doğrulama yöntemi üzerinden yapılan herhangi bir saldırı girişimini engeller.

## Desteklenen kurulum seçenekleri

* Community Ingress NGINX Controller 1.11.8 tabanlı Wallarm Ingress controller.

    [En yeni Wallarm Ingress controller’a geçiş talimatları →](ingress-controller.md)
* [Kullanım dışı](https://www.centos.org/centos-linux-eol/) CentOS 8.x yerine AlmaLinux, Rocky Linux ve Oracle Linux 8.x desteği eklendi.

    Alternatif işletim sistemleri için Wallarm düğüm paketleri CentOS 8.x deposunda tutulacaktır.
* Debian 11 Bullseye desteği eklendi
* Ubuntu 22.04 LTS (jammy) desteği eklendi
* CentOS 6.x (CloudLinux 6.x) desteği kaldırıldı
* Debian 9.x desteği kaldırıldı
* Ubuntu 16.04 LTS (xenial) işletim sistemi desteği kaldırıldı

[Desteklenen kurulum seçeneklerinin tam listesi →](../../installation/supported-deployment-options.md)

## Filtreleme düğümü kurulumu için sistem gereksinimleri

* Wallarm düğüm örneklerinin, saldırı tespit kuralları ve [API spesifikasyonları](../../api-specification-enforcement/overview.md) güncellemelerini indirmek ve [izin listesine alınmış, engelleme listesine alınmış veya gri listeye alınmış](../../user-guides/ip-lists/overview.md) ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak üzere aşağıdaki IP adreslerine erişmesi gerekir.

    --8<-- "../include/wallarm-cloud-ips.md"
* Filtreleme düğümü artık verileri Cloud’a `us1.api.wallarm.com:443` (US Cloud) ve `api.wallarm.com:443` (EU Cloud) üzerinden yükler; önceden `us1.api.wallarm.com:444` ve `api.wallarm.com:444` kullanılıyordu.

    Düğümün dağıtıldığı sunucunun dış kaynaklara erişimi kısıtlıysa ve erişim her bir kaynak için ayrı ayrı tanımlanmışsa, yükseltmeden sonra filtreleme düğümü ile Cloud arasındaki senkronizasyon duracaktır. Yükseltilen düğümün yeni portu kullanan API uç noktasına erişimi olmalıdır.

## Wallarm Cloud’a API token ile birleşik düğüm kaydı

Wallarm düğümünün yeni sürümüyle, Cloud’da e‑posta/parola tabanlı düğüm kaydı kaldırılmıştır. Daha yeni düğüm sürümlerine devam etmek için yeni API token tabanlı düğüm kayıt yöntemine geçmek artık zorunludur.

Yeni sürüm, Wallarm düğümünü Wallarm Cloud’a **API token** ile [herhangi bir desteklenen platformda](../../installation/supported-deployment-options.md) kaydetmenizi sağlar ve Wallarm Cloud’a daha güvenli ve daha hızlı bağlantı sunar:

* Yalnızca düğüm kurulumu izni olan **Deploy** rolüne sahip özel kullanıcı hesaplarına artık gerek yoktur.
* Kullanıcıların verileri Wallarm Cloud’da güvenli bir şekilde saklanır.
* Kullanıcı hesapları için etkinleştirilen iki faktörlü kimlik doğrulama, düğümlerin Wallarm Cloud’a kaydedilmesini engellemez.
* Ayrı sunuculara dağıtılan ilk trafik işleme ve istek sonrası analiz modülleri, Cloud’a tek bir düğüm token’ı ile kaydedilebilir.

Düğüm kayıt yöntemlerindeki değişiklikler, düğüm türlerinde bazı güncellemelerle sonuçlanır:

* Sunucuda düğümü kaydetmek için çalıştırılacak betik `register-node` olarak adlandırılır. Önceden, **cloud node** adlı Wallarm düğümü token ile kaydı destekliyordu ancak `addcloudnode` adlı farklı bir betikle.

    Cloud node’un yeni dağıtım sürecine geçirilmesine gerek yoktur.
* `addnode` betiğine geçirilen "e‑posta/parola" ile kaydı destekleyen **regular düğüm** kullanım dışıdır.

Artık, düğüm kaydı şu şekilde görünür:

1. Wallarm Console → **Settings** → **API tokens** bölümüne gidin.
1. Kullanım türü **Node deployment/Deployment** olan bir [token oluşturun](../../user-guides/settings/api-tokens.md).
1. Düğümün gerekli dağıtım yapıtını, API token’ı ilgili parametrelerde geçirilmiş şekilde çalıştırın.

!!! info "Regular düğüm desteği"
    Regular düğüm türü kullanım dışıdır ve gelecekteki sürümlerde kaldırılacaktır.

## AWS üzerinde Wallarm dağıtımı için Terraform modülü

Artık Wallarm’ı, Kod Olarak Altyapı (IaC) tabanlı ortamdan [AWS](https://aws.amazon.com/) üzerine [Wallarm Terraform modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) ile kolayca dağıtabilirsiniz.

Wallarm Terraform modülü, güvenlik ve hata toleransı için en iyi endüstri standartlarını karşılayan, ölçeklenebilir bir çözümdür. Wallarm’ı **proxy** olarak dağıtmak için tasarlanmıştır.

[AWS için Wallarm Terraform modülü dokümantasyonu](../../installation/cloud-platforms/aws/terraform-module/overview.md)

## Engelleme listesine alınmış kaynaklardan gelen engellenen isteklerin istatistiklerinin toplanması

Wallarm NGINX tabanlı filtreleme düğümleri artık kaynağı engelleme listesinde bulunan istekler engellendiğinde bunun istatistiklerini toplayarak saldırı gücünü değerlendirme yeteneğinizi artırır. Bu, engellenen istek istatistiklerine ve örneklerine erişimi içerir; bu da gözden kaçan etkinliği en aza indirmenize yardımcı olur. Bu verileri Wallarm Console UI’daki **Attacks** bölümünde bulabilirsiniz.

Otomatik IP engelleme kullanırken (ör. brute force tetikleyicisi yapılandırılmışsa), artık hem ilk tetikleyici istekleri hem de bunları izleyen engellenen istek örneklerini analiz edebilirsiniz. Kaynakları manuel olarak engelleme listesine alınmış istekler için, yeni işlevsellik engellenen kaynak eylemlerine görünürlük kazandırır.

**Attacks** bölümü içinde yeni tanıtılan verilere zahmetsizce erişmek için yeni [arama etiketleri ve filtreler](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) ekledik:

* IP adreslerinin, alt ağların, ülkelerin, VPN’lerin ve daha fazlasının manuel olarak engelleme listesine alınması nedeniyle engellenen istekleri belirlemek için `blocked_source` aramasını kullanın.
* Birden fazla payload içeren kötü niyetli istekler gönderen kaynakları engelleme listesine almak için tasarlanmış **Number of malicious payloads** tetikleyicisi tarafından engellenen istekleri belirlemek için `multiple_payloads` aramasını kullanın. Bu, çoklu saldırı faillerinin yaygın bir özelliğidir.
* Ek olarak, `api_abuse`, `brute`, `dirbust` ve `bola` arama etiketleri artık ilgili saldırı türleri için ilgili Wallarm tetikleyicileri tarafından kaynakları otomatik olarak engelleme listesine eklenmiş istekleri de kapsar.

Bu değişiklik, varsayılan olarak işlevi etkinleştirmek için `on` olarak ayarlanmış, ancak devre dışı bırakmak için `off` yapılabilen yeni yapılandırma parametreleri getirir:

* [`wallarm_acl_export_enable`](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) NGINX yönergesi.
* NGINX Ingress controller chart’ı için [`controller.config.wallarm-acl-export-enable`](../../admin-en/configure-kubernetes-en.md#global-controller-settings) değeri.
* Sidecar Controller çözümü için [`config.wallarm.aclExportEnable`](../../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable) chart değeri ve [`sidecar.wallarm.io/wallarm-acl-export-enable`](../../installation/kubernetes/sidecar-proxy/pod-annotations.md) pod etiketi.

## Wallarm AWS imajı, kullanıma hazır `cloud-init.py` betiği ile dağıtılır

Kod Olarak Altyapı (IaC) yaklaşımını izliyorsanız, Wallarm düğümünü AWS’ye dağıtmak için [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) betiğini kullanmanız gerekebilir. Artık Wallarm, AWS bulut imajını kullanıma hazır `cloud-init.py` betiği ile dağıtmaktadır.

Wallarm `cloud-init` betiğinin [özellikleri](../../installation/cloud-platforms/cloud-init.md)

## Çok kiracılı düğüm yapılandırmasının basitleştirilmesi

[Çok kiracılı düğümler](../../installation/multi-tenant/overview.md) için kiracılar ve uygulamalar artık her biri kendi yönergesiyle tanımlanır:

* Bir kiracının benzersiz tanımlayıcısını yapılandırmak için [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) NGINX yönergesi eklendi.
* [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) NGINX yönergesinin davranışı değiştirildi. Artık **yalnızca** bir uygulama kimliğini yapılandırmak için kullanılır.

[Çok kiracılı düğüm yükseltme talimatları](../multi-tenant.md)

## Filtreleme modları

* Yeni **güvenli engelleme** (safe blocking) filtreleme modu.

    Bu mod, yalnızca [gri listelenmiş IP adreslerinden](../../user-guides/ip-lists/overview.md) gelen kötü amaçlı istekleri engelleyerek [yalancı pozitiflerin](../../about-wallarm/protecting-against-attacks.md#false-positives) sayısını önemli ölçüde azaltır.
* İstek kaynaklarının analizi artık yalnızca `safe_blocking` ve `block` modlarında gerçekleştirilir.
    
    * `off` veya `monitoring` modunda çalışan Wallarm düğümü, [engelleme listesinde](../../user-guides/ip-lists/overview.md) bulunan bir IP’den gelen bir isteği tespit ederse, bu isteği engellemez.
    * `monitoring` modunda çalışan Wallarm düğümü, [izin listesine alınmış IP adreslerinden](../../user-guides/ip-lists/overview.md) gelen tüm saldırıları Wallarm Cloud’a yükler.

[Wallarm düğüm modları hakkında daha fazla bilgi →](../../admin-en/configure-wallarm-mode.md)

## İstek kaynağı kontrolü

İstek kaynağı kontrolü için aşağıdaki parametreler kullanım dışıdır:

* IP adresi engelleme listesini yapılandırmak için kullanılan tüm `acl` NGINX yönergeleri ve ortam değişkenleri. IP engelleme listesinin manuel yapılandırılması artık gerekli değildir.

    [Engelleme listesi yapılandırmasına geçiş ayrıntıları →](../migrate-ip-lists-to-node-3.md)

İstek kaynağı kontrolü için yeni özellikler:

* IP adresi izin listesi, engelleme listesi ve gri listeyi tam olarak kontrol etmek için Wallarm Console bölümü.
* Yeni [filtreleme modu](../../admin-en/configure-wallarm-mode.md) `safe_blocking` ve [IP adresi gri listeleri](../../user-guides/ip-lists/overview.md) desteği.

    **Güvenli engelleme** modu, yalnızca gri listelenmiş IP adreslerinden gelen kötü amaçlı istekleri engelleyerek [yalancı pozitiflerin](../../about-wallarm/protecting-against-attacks.md#false-positives) sayısını önemli ölçüde azaltır.

    Otomatik IP adresi gri listelemesi için, yeni yayınlanan [**Number of malicious payloads** tetikleyicisi](../../admin-en/configuration-guides/protecting-with-thresholds.md) kullanılabilir.
* Şirket kaynaklarını güvenlik açıkları için taramak ve ek güvenlik testleri başlatmak için kullanılan [Wallarm’ın güvenlik açığı tarama IP’lerinin](../../admin-en/scanner-addresses.md) otomatik izin listesine alınması. Bu adreslerin manuel izne alınması artık gerekli değildir.
* Bir alt ağ, Tor ağı IP’leri, VPN IP’leri, belirli bir ülkede, bölgede veya veri merkezinde kayıtlı bir IP adres grubu için izin listeleme, engelleme listeleme veya gri listeleme yeteneği.
* Belirli uygulamalar için istek kaynaklarını izin listeleme, engelleme listeleme veya gri listeleme yeteneği.
* İstek kaynağı analizini devre dışı bırakmak için yeni `disable_acl` NGINX yönergesi.

    [`disable_acl` NGINX yönergesi hakkında ayrıntılar →](../../admin-en/configure-parameters-en.md#disable_acl)

[IP’leri izin listesine, engelleme listesine ve gri listeye ekleme ayrıntıları →](../../user-guides/ip-lists/overview.md)

## API envanteri keşfi için yeni modül

Yeni Wallarm düğümleri, uygulama API’sini otomatik olarak tanımlayan **API Discovery** modülü ile dağıtılır. Modül varsayılan olarak devre dışıdır.

[API Discovery modülü hakkında ayrıntılar →](../../api-discovery/overview.md)

## libdetection kütüphanesi ile gelişmiş saldırı analizi

Wallarm tarafından gerçekleştirilen saldırı analizi, ek bir saldırı doğrulama katmanı eklenerek geliştirilmiştir. Tüm form faktörlerdeki Wallarm düğümü, varsayılan olarak etkinleştirilmiş libdetection kütüphanesi ile dağıtılır. Bu kütüphane, tüm [SQLi](../../attacks-vulns-list.md#sql-injection) saldırılarının ikincil, tamamen dilbilgisi tabanlı doğrulamasını gerçekleştirerek SQL enjeksiyonları arasında tespit edilen yalancı pozitiflerin sayısını azaltır.

!!! warning "Bellek kullanımı artışı"
    **libdetection** kütüphanesi etkinleştirildiğinde, NGINX ve Wallarm süreçleri tarafından tüketilen bellek miktarı yaklaşık %10 artabilir.

[Wallarm’ın saldırıları nasıl tespit ettiğine dair ayrıntılar →](../../about-wallarm/protecting-against-attacks.md)

## `overlimit_res` saldırı tespiti ince ayarını etkinleştiren kural

[`overlimit_res` saldırı tespiti ince ayarına olanak tanıyan yeni kuralı](../../user-guides/rules/configure-overlimit-res-detection.md) sunduk.

NGINX yapılandırma dosyaları aracılığıyla `overlimit_res` saldırı tespiti ince ayarı artık kullanım dışı kabul edilir:

* Kural, daha önce `wallarm_process_time_limit` NGINX yönergesinin yaptığı gibi tek bir istek işleme süresi limiti ayarlamanıza izin verir.
* Kural, `overlimit_res` saldırılarını [düğüm filtreleme moduna](../../admin-en/configure-wallarm-mode.md) uygun şekilde engellemeye veya geçirmeye izin verir; bu, `wallarm_process_time_limit_block` NGINX yönergesinin yapılandırılması yerine geçer.

Listelenen yönergeler ve parametreler kullanım dışıdır ve gelecekteki sürümlerde silinecektir. `overlimit_res` saldırı tespiti yapılandırmasını yönergelerden kurala taşımanız önerilir. İlgili talimatlar her bir [düğüm dağıtım seçeneği](../general-recommendations.md#update-process) için sağlanmıştır.

Listelenen parametreler yapılandırma dosyalarında açıkça belirtilmiş ve kural henüz oluşturulmamışsa, düğüm istekleri yapılandırma dosyalarında ayarlandığı şekilde işler.

## Optimize edilmiş ve daha güvenli NGINX tabanlı Docker imajı

[Wallarm’ın NGINX tabanlı filtreleme düğümünün Docker imajı](../../admin-en/installation-docker-en.md), gelişmiş güvenlik ve optimizasyon için elden geçirilmiştir. Başlıca güncellemeler:

* Docker imajı artık daha güvenli ve hafif bir yapıt sağlamak için Debian yerine Alpine Linux üzerine inşa edilmektedir. Lütfen daha önce dahil olan `auth-pam` ve `subs-filter` NGINX modüllerinin artık Docker imajına paketlenmediğini unutmayın.
* Önceki 1.14.x sürümü yerine NGINX’in en son kararlı sürümü olan 1.28.0’a güncellendi. 1.14.x’teki güvenlik açıklarının çoğu Debian ekibi tarafından yamalanmış olsa da (önceki imaj Debian 10.x tabanlıydı), 1.28.0’a yükseltme kalan güvenlik açıklarını da gidererek güvenliği iyileştirir.

      NGINX yükseltmesi ve Alpine Linux’a geçiş, NGINX 1.28.0’da uygulanan Alpine özel yama sayesinde HTTP/2 Rapid Reset Güvenlik Açığı’nı (CVE-2023-44487) çözer.

* ARM64 mimariye sahip işlemciler için destek; kurulum sırasında otomatik olarak algılanır.
* Docker konteyneri içinde tüm işlemler artık önceki `root` kullanıcı kurulumu yerine `wallarm` adlı non-root kullanıcıyı kullanır. Bu, NGINX sürecini de etkiler.
* [`/wallarm-status`](../../admin-en/configure-statistics-service.md) uç noktası, Docker konteynerinin dışından erişildiğinde JSON yerine Prometheus formatında metrikleri dışa aktarmak üzere güncellendi. Bu işlev için [`WALLARM_STATUS_ALLOW`](../../admin-en/installation-docker-en.md#wallarm-status-allow-env-var) ortam değişkeninin uygun şekilde ayarlanması gerektiğini unutmayın.
* Docker imajı artık iç dizin yapısını değiştiren [all-in-one yükleyici](../../installation/nginx/all-in-one.md) kullanılarak oluşturulmaktadır:

      * Günlük dosyası dizini: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * Wallarm düğümünün Cloud’a bağlanması için kimlik bilgilerini içeren dosyaların bulunduğu dizin: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
* `/usr/share` dizininin yolu → `/opt/wallarm/usr/share`.
      
      Bu, `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html` konumunda bulunan [örnek engelleme sayfası](../../admin-en/configuration-guides/configure-block-page-and-code.md) için yeni bir yol getirir.

Yeni yayınlanan ürün özellikleri, yeni formatlı NGINX tabanlı Docker imajı tarafından da desteklenmektedir.

## Optimize edilmiş bulut imajları

[Amazon Machine Image (AMI)](../../installation/cloud-platforms/aws/ami.md) ve [Google Cloud Machine Image](../../installation/cloud-platforms/gcp/machine-image.md) optimize edilmiştir. Başlıca güncellemeler:

* Bulut imajları artık gelişmiş güvenlik için kullanım dışı Debian 10.x (buster) yerine en son kararlı sürüm olan Debian 12.x (bookworm) kullanır.
* Önceki 1.14.x sürümü yerine NGINX’in daha yeni sürümü 1.22.1’e güncellendi.
* ARM64 mimariye sahip işlemciler için destek; kurulum sırasında otomatik olarak algılanır.
* Bulut imajları artık iç dizin yapısını değiştiren [all-in-one yükleyici](../../installation/nginx/all-in-one.md) kullanılarak oluşturulmaktadır:

      * Düğüm kayıt betiği: `/usr/share/wallarm-common/register-node` → `/opt/wallarm/usr/share/wallarm-common/cloud-init.py`.
      * Günlük dosyası dizini: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * Wallarm düğümünün Cloud’a bağlanması için kimlik bilgilerini içeren dosyaların bulunduğu dizin: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
      * `/usr/share` dizininin yolu → `/opt/wallarm/usr/share`.
      
          Bu, `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html` konumunda bulunan [örnek engelleme sayfası](../../admin-en/configuration-guides/configure-block-page-and-code.md) için yeni bir yol getirir.
      
      * Global Wallarm filtreleme düğümü ayarlarını içeren `/etc/nginx/conf.d/wallarm.conf` dosyası kaldırılmıştır.

Yeni formatlı bulut imajları da yeni yayınlanan ürün özelliklerini desteklemektedir.

## Yeni engelleme sayfası

`/usr/share/nginx/html/wallarm_blocked.html` örnek engelleme sayfası güncellendi. Yeni düğüm sürümünde, yeni bir düzeni vardır ve logo ile destek e‑postası özelleştirmesini destekler.
    
Yeni düzenli engelleme sayfasının varsayılan görünümü şu şekildedir:

![Wallarm engelleme sayfası](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[Engelleme sayfası kurulumu hakkında daha fazla bilgi →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## Temel düğüm kurulumu için yeni parametreler

* Wallarm NGINX tabanlı Docker konteynerine geçirilecek yeni ortam değişkenleri:

    * `WALLARM_APPLICATION`, Wallarm Cloud’da kullanılacak korunan uygulamanın tanımlayıcısını ayarlamak için.
    * `NGINX_PORT`, NGINX’in Docker konteyneri içinde kullanacağı portu ayarlamak için.

    [Wallarm NGINX tabanlı Docker konteynerini dağıtma talimatları →](../../admin-en/installation-docker-en.md)
* Wallarm Cloud ile filtreleme düğümlerinin senkronizasyonunu yapılandırmak için `node.yaml` dosyasının yeni parametreleri: `api.local_host` ve `api.local_port`. Yeni parametreler, Wallarm API’sine gönderilecek istekler için yerel bir IP adresi ve ağ arayüzü portu belirtmenize olanak tanır.

    Wallarm Cloud ve filtreleme düğümü senkronizasyonu kurulumu için `node.yaml` parametrelerinin [tam listesine bakın →](../../admin-en/configure-cloud-node-synchronization-en.md#access-parameters)

## NGINX tabanlı Wallarm Docker konteyneri için IPv6 bağlantılarının devre dışı bırakılması

NGINX tabanlı Wallarm Docker imajı artık yeni `DISABLE_IPV6` ortam değişkenini destekler. Bu değişken, NGINX’in IPv6 bağlantılarını işlemesini engellemenizi ve yalnızca IPv4 bağlantılarını işlemesini sağlar.

## Yeniden adlandırılan parametreler, dosyalar ve metrikler

* Aşağıdaki NGINX yönergeleri yeniden adlandırıldı:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    Önceki adlara sahip parametreler hâlâ desteklenmektedir ancak gelecekteki sürümlerde kullanım dışı bırakılacaktır. Parametre mantığı değişmemiştir.
* Ingress [annotasyon](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance`, `nginx.ingress.kubernetes.io/wallarm-application` olarak yeniden adlandırıldı.

    Önceki ada sahip annotasyon hâlâ desteklenmektedir ancak gelecekteki sürümlerde kullanım dışı bırakılacaktır. Annotasyon mantığı değişmemiştir.
* Özel kurallar kümesi derlemesini içeren `/etc/wallarm/lom` dosyasının adı `/etc/wallarm/custom_ruleset` olarak değiştirildi. Yeni düğüm sürümlerinin dosya sisteminde yalnızca yeni adlı dosya bulunur.

    [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) NGINX yönergesinin varsayılan değeri uygun şekilde değiştirildi. Yeni varsayılan değer `/etc/wallarm/custom_ruleset`’tir.
* Özel anahtar dosyası `/etc/wallarm/license.key`, `/etc/wallarm/private.key` olarak yeniden adlandırıldı. Varsayılan olarak yeni ad kullanılır.

## İstatistik servisinin parametreleri

* Prometheus metriği `wallarm_custom_ruleset_id`, `format` niteliğinin eklenmesiyle geliştirilmiştir. Bu yeni nitelik, özel kurallar kümesi formatını temsil eder. Bu arada, ana değer özel kurallar kümesi derleme sürümü olmaya devam eder. Güncellenmiş `wallarm_custom_ruleset_id` değerine bir örnek:

    ```
    wallarm_custom_ruleset_id{format="51"} 386
    ```
* Wallarm istatistik servisi, [Wallarm rate limiting](#rate-limits) modülü verileri ile yeni `rate_limit` parametrelerini döndürür. Yeni parametreler reddedilen ve geciktirilen istekleri kapsar ve ayrıca modülün çalışmasıyla ilgili herhangi bir sorunu gösterir.
* Engelleme listesine alınmış IP’lerden gelen isteklerin sayısı artık istatistik servisi çıktısında, yeni `blocked_by_acl` parametresinde ve mevcut `requests`, `blocked` parametrelerinde görüntülenir.
* Servis, Wallarm düğümleri tarafından kullanılan [özel kurallar kümesi](../../glossary-en.md#custom-ruleset-the-former-term-is-lom) formatını işaret eden bir başka yeni parametre `custom_ruleset_ver` döndürür.
* Aşağıdaki düğüm istatistik parametreleri yeniden adlandırıldı:

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    Yeni düğüm sürümlerinde, `http://127.0.0.8/wallarm-status` uç noktası geçici olarak hem kullanım dışı hem de yeni parametreleri döndürür. Kullanım dışı parametreler gelecekteki sürümlerde servis çıktısından kaldırılacaktır.

[İstatistik servisi hakkında ayrıntılar →](../../admin-en/configure-statistics-service.md)

## Düğüm günlük formatını yapılandırmak için yeni değişkenler

Aşağıdaki [düğüm günlük değişkenleri](../../admin-en/configure-logging.md#filter-node-variables) değiştirildi:

* `wallarm_request_time`, `wallarm_request_cpu_time` olarak yeniden adlandırıldı

    Bu değişken, isteği işlerken CPU’nun harcadığı süreyi saniye cinsinden ifade eder.

    Önceki ada sahip değişken kullanım dışıdır ve gelecekteki sürümlerde kaldırılacaktır. Değişken mantığı değişmemiştir.
* `wallarm_request_mono_time` eklendi

    Bu değişken, isteği işlerken CPU’nun harcadığı süre + kuyruktaki süre toplamını saniye cinsinden ifade eder.

## Engelleme listesindeki IP’lerden gelen isteklerde saldırı aramasını atlayarak performansı artırma

Yeni [`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) yönergesi, [engelleme listesinde](../../user-guides/ip-lists/overview.md) bulunan IP’lerden gelen isteklerin analizinde saldırı arama aşamasını atlayarak Wallarm düğüm performansını artırmanıza olanak tanır. Bu yapılandırma seçeneği, (ör. tüm ülkeler gibi) çok sayıda engelleme listesi IP’sinin yoğun trafik ürettiği ve çalışma makinesinin CPU’sunu ağır yüklediği durumlarda faydalıdır.

## Düğüm örnekleri için kolay gruplama

Artık, kurulumları için kullanım türü `Node deployment/Deployment` olan tek bir [**API token**](../../user-guides/settings/api-tokens.md) ve `WALLARM_LABELS` değişkeninin `group` etiketi ile düğüm örneklerini kolayca gruplandırabilirsiniz.

Örneğin: 

```bash
docker run -d -e WALLARM_API_TOKEN='<API TOKEN WITH DEPLOY ROLE>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_LABELS='group=<GROUP>' -p 80:80 wallarm/node:6.5.1
```
...düğüm örneğini `<GROUP>` örnek grubuna yerleştirir (mevcutsa; değilse oluşturulur).

## Giderilen güvenlik açıkları

Yeni sürümler, Wallarm dağıtım yapıtlarındaki çok sayıda yüksek ve kritik şiddette güvenlik açığını, önceden savunmasız bileşenlerin değiştirilmesiyle gidererek yazılımın güvenlik durumunu iyileştirmektedir.

Giderilen güvenlik açıkları arasında [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327), [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920) ve diğerleri bulunmaktadır.

## HTTP/2 akış uzunluğu kontrol yönergesi

HTTP/2 akışlarının maksimum uzunluğunu kontrol etmek için [`wallarm_http_v2_stream_max_len`](../../admin-en/configure-parameters-en.md#wallarm_http_v2_stream_max_len) yönergesi tanıtıldı. Bu, uzun ömürlü gRPC bağlantılarında aşırı bellek tüketimini önlemeye yardımcı olur.

Bu değişkeni bir [Docker konteynerinde](../../admin-en/installation-docker-en.md) kullanmak için, NGINX yapılandırma dosyanızda belirtin ve dosyayı konteynere mount edin.

## Account Takeover, Scraping ve Security Crawlers için ayrı arama etiketleri

`account_takeover`, `scraping` ve `security_crawlers` saldırı türleri için ayrı [arama etiketleri](../../user-guides/search-and-filters/use-search.md) tanıtıldı; bu, önceki genel `api_abuse` etiketine kıyasla özgüllüğü artırır.

## Bağlayıcılar ve TCP trafik aynası için Native Node

NGINX’ten bağımsız olarak çalışan Wallarm Node için yeni bir dağıtım seçeneği olan Native Node’u tanıtmaktan heyecan duyuyoruz. Bu çözüm, NGINX’in gerekli olmadığı veya platformdan bağımsız bir yaklaşımın tercih edildiği ortamlar için geliştirilmiştir.

Şu anda aşağıdaki dağıtımlar için uyarlanmıştır:

* MuleSoft, Cloudflare, CloudFront, Broadcom Layer7 API Gateway, Fastly bağlayıcıları ile hem istek hem de yanıt analizi
* Kong API Gateway ve Istio Ingress bağlayıcıları
* TCP trafik aynası analizi

[Daha fazla bilgi](../../installation/nginx-native-node-internals.md#native-node)

## Postanalytics için Tarantool’un wstore ile değiştirilmesi

Wallarm Düğümü artık yerel postanalytics işlemleri için Tarantool yerine **Wallarm tarafından geliştirilmiş bir servis olan wstore** kullanıyor. Sonuç olarak:

* [All-in-one yükleyici](../../installation/nginx/all-in-one.md), [AWS](../../installation/cloud-platforms/aws/ami.md)/[GCP](../../installation/cloud-platforms/gcp/machine-image.md) imajları:

    * Ayrı bir sunucuya dağıtıldığında postanalytics modülü sunucu adresini tanımlayan `wallarm_tarantool_upstream` NGINX yönergesi, [`wallarm_wstore_upstream`](../../admin-en/configure-parameters-en.md#wallarm_wstore_upstream) olarak yeniden adlandırıldı.

        Kullanım dışı uyarısı ile geriye dönük uyumluluk korunur:

        ```
        2025/03/04 20:43:04 [warn] 3719#3719: "wallarm_tarantool_upstream" directive is deprecated, use "wallarm_wstore_upstream" instead in /etc/nginx/nginx.conf:19
        ```
    * [Günlük dosyası](../../admin-en/configure-logging.md) yeniden adlandırıldı: `/opt/wallarm/var/log/wallarm/tarantool-out.log` → `/opt/wallarm/var/log/wallarm/wstore-out.log`.
    * Yeni wstore yapılandırma dosyası `/opt/wallarm/wstore/wstore.yaml`, `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` gibi eski Tarantool yapılandırma dosyalarının yerini alır.
    * `/opt/wallarm/etc/wallarm/node.yaml` içindeki `tarantool` bölümü artık `wstore`. Kullanım dışı uyarısı ile geriye dönük uyumluluk korunur.
* [Docker imajı](../../admin-en/installation-docker-en.md):

    * Yukarıdaki değişikliklerin tümü konteyner içinde uygulanır.
    * Önceden Tarantool için bellek, `TARANTOOL_MEMORY_GB` ortam değişkeni ile ayrılıyordu. Artık bellek ayrımı aynı prensibi izler ancak yeni bir değişken kullanır: `TARANTOOL_MEMORY_GB` → `SLAB_ALLOC_ARENA`.
    * Konteynerin dizin yapısı Alpine Linux kurallarına uyacak şekilde ayarlandı. Özellikle:

        * `/etc/nginx/modules-available` ve `/etc/nginx/modules-enabled` içeriği `/etc/nginx/modules`’a taşındı.
        * `/etc/nginx/sites-available` ve `/etc/nginx/sites-enabled` içeriği `/etc/nginx/http.d`’ye taşındı.
    
    * `/wallarm-status` servisi için izin verilen IP adreslerini belirleyen varsayılan `allow` değeri artık 127.0.0.8/8 yerine 127.0.0.0/8’dir.
* [Kubernetes Ingress Controller](../../admin-en/installation-kubernetes-en.md):
    
    * Tarantool artık ayrı bir pod değildir, wstore ana `<CHART_NAME>-wallarm-ingress-controller-xxx` pod’u içinde çalışır.
    * Helm değerleri yeniden adlandırıldı: `controller.wallarm.tarantool` → `controller.wallarm.postanalytics`.
* [Kubernetes Sidecar Controller](../../installation/kubernetes/sidecar-proxy/deployment.md):

    * Helm değerleri yeniden adlandırıldı: `postanalytics.tarantool.*` → [`postanalytics.wstore.*`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L625).
    * Sidecar dağıtımı için Helm chart’tan aşağıdaki Docker imajları kaldırıldı:

        * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
        * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
        * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
        * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
        
        Bu imajların yerini artık ilgili servisleri çalıştıran [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers) imajı aldı.

Açıklanan değişiklikler aşağıda sağlanan Düğüm yükseltme talimatlarına dahil edilmiştir.

## Yükseltme süreci

1. [Modüllerin yükseltilmesine yönelik önerileri](../general-recommendations.md) inceleyin.
2. Kurulu modülleri, Wallarm düğümünüzün dağıtım seçeneğine yönelik talimatları izleyerek yükseltin:

      * **All-in-one yükleyici** ile [NGINX, NGINX Plus için modüllerin yükseltilmesi](nginx-modules.md)

        Yükseltme sürecini iyileştirmek ve basitleştirmek için, tüm düğüm sürümlerinin yükseltilmesi Wallarm’ın all-in-one yükleyicisi kullanılarak gerçekleştirilir. Bireysel Linux paketleri ile manuel yükseltme artık desteklenmemektedir.

      * [NGINX modülleriyle Docker konteynerinin yükseltilmesi](docker-container.md)
      * [Entegre Wallarm modülleri ile NGINX Ingress controller’ın yükseltilmesi](ingress-controller.md)
      * [Cloud node imajı](cloud-image.md)
      * [Multi-tenant düğüm](multi-tenant.md)
3. Önceki Wallarm düğüm sürümlerinden izin listesi ve engelleme listesi yapılandırmasını en son sürüme [taşıyın](../migrate-ip-lists-to-node-3.md).

----------

[Wallarm ürünlerindeki ve bileşenlerindeki diğer güncellemeler →](https://changelog.wallarm.com/)