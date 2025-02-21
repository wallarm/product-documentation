# Wallarm node'da (EOL node yükseltmesi yapılırken) Yenilikler

Bu sayfa, desteklenmeyen versiyonun (3.6 ve altı) node'unun 5.0 versiyonuna kadar yükseltme sırasında mevcut olan değişiklikleri listeler. Listelenen değişiklikler hem normal (client) hem de multi-tenant Wallarm node'ları için geçerlidir. 

!!! warning "Wallarm node'ları 3.6 ve altı desteklenmemektedir"
    Wallarm node'ları 3.6 ve altının yükseltilmesi önerilir çünkü bunlar [deprecated](../versioning-policy.md#version-list).

    Node konfigürasyonu ve trafik filtrasyonu, Wallarm node'un 5.x versiyonunda önemli ölçüde basitleştirildi. Node 5.x'in bazı ayarları eski versiyonlardaki node'larla **uyumsuzdur**. Modülleri yükseltmeden önce, lütfen değişikliklerin listesini ve [genel önerileri](../general-recommendations.md) dikkatlice inceleyin.

## All-in-one yüklüleyici ve DEB/RPM paketlerinin kullanımdan kaldırılması

Artık, çeşitli ortamlarda Wallarm node'unu NGINX için dinamik modül şeklinde kurarken ve yükseltirken, kurulum sürecini kolaylaştırmak ve standartlaştırmak için tasarlanmış **all-in-one yüklüleyici**yi kullanıyorsunuz. Bu yükleyici işletim sisteminizin ve NGINX versiyonunuzun otomatik olarak tanımlanmasını sağlar, ve gerekli tüm bağımlılıkları otomatik olarak yükler.

Yükleyici, aşağıdaki işlemleri otomatik olarak gerçekleştirerek süreci basitleştirir:

1. İşletim sisteminizi ve NGINX versiyonunuzu kontrol etme.
1. Tanımlanan işletim sistemi ve NGINX versiyonu için Wallarm repository'lerini ekleme.
1. Bu repository'lerden Wallarm paketlerini yükleme.
1. Yüklenen Wallarm modülünü NGINX'inize bağlama.
1. Sağlanan token ile filtreleme node'unu Wallarm Cloud'a bağlama.

[Node'u all-in-one yüklüleyici ile nasıl yükselteceğinize dair detaylar →](nginx-modules.md)

Node kurulumu için olan DEB/RPM paketleri artık "deprecated" durumundadır.

## Silinen metrikler nedeniyle büyük değişiklikler

Wallarm node'u artık aşağıdaki collectd metriklerini toplamıyor:

* `wallarm_nginx/gauge-requests` - bunun yerine [`wallarm_nginx/gauge-abnormal`](../../admin-en/monitoring/available-metrics.md#number-of-requests) metriğini kullanabilirsiniz.
* `wallarm_nginx/gauge-attacks`
* `wallarm_nginx/gauge-blocked`
* `wallarm_nginx/gauge-time_detect`
* `wallarm_nginx/derive-requests`
* `wallarm_nginx/derive-attacks`
* `wallarm_nginx/derive-blocked`
* `wallarm_nginx/derive-abnormal`
* `wallarm_nginx/derive-requests_lost`
* `wallarm_nginx/derive-tnt_errors`
* `wallarm_nginx/derive-api_errors`
* `wallarm_nginx/derive-segfaults`
* `wallarm_nginx/derive-memfaults`
* `wallarm_nginx/derive-softmemfaults`
* `wallarm_nginx/derive-time_detect`

## API Sessions

API ekonomisine özel benzersiz bir güvenlik özelliğini tanıtıyoruz - [API Sessions](../../api-sessions/overview.md). Bu ekleme, saldırılar, anomaliler ve kullanıcı davranışları hakkında API'leriniz genelinde şeffaflık sağlayarak, kullanıcıların API'leriniz ve uygulamalarınızla nasıl etkileşime girdiğine dair görünürlük sunar.

![!API Sessions bölümü - izlenen oturumlar](../../images/api-sessions/api-sessions.png)

Saldırganlar, eylemlerini meşru kullanıcı davranışıyla harmanlayarak zayıf uç noktaları sıkça istismar ederler. Oturumların tam gelişim bağlamı olmadan kalıpların veya tehditlerin tespiti, birden fazla araç ve sistemin kullanıldığı zaman alıcı bir sürece dönüşür. Kuruluşlar, API seviyesinde yeterli görünürlüğe sahip değiller.

API Sessions sayesinde, güvenlik ekipleri artık kullanıcı oturumlarına göre gruplanmış tüm ilgili etkinlikleri görebilir; böylece saldırı dizilerini, kullanıcı anomalilerini ve normal davranışları eşi benzeri görülmemiş şekilde izleyebilirler. Eskiden saatler veya günler süren soruşturmalar artık Wallarm Console üzerinden birkaç dakika içinde gerçekleştirilebilmektedir.

Temel özellikler:

* Saldırılar, anomaliler ve kullanıcı davranışları hakkında görünürlük: Bir oturumda yapılan her isteği görüntüleyerek saldırı vektörlerini ve şüpheli kalıpları analiz edebilirsiniz.
* Hem eski hem modern oturumları destekleme: Uygulamalarınız cookie-tabanlı oturumlara veya JWT/OAuth'a dayanıyor olsun, Wallarm API Sessions tam uyumluluk ve görünürlük sağlar.
* Bireysel saldırılar ile oturumlar arasında sorunsuz geçiş.

API Sessions sayesinde, güvenlik ekipleri artık kolayca:

* Tehdit aktörlerinin tam aktivitelerini inceleyerek potansiyel saldırı yollarını ve tehlikeye düşen kaynakları tespit edebilir.
* Belgelenmemiş veya güncelliğini yitirmiş API'lere yönelik risklerin azaltılmasına katkıda bulunacak şekilde gölge veya zombie API'lere nasıl erişildiğini belirleyebilir.
* Güvenlik soruşturmaları sırasında kilit bilgileri meslektaşlarıyla paylaşabilir.

[Devamını okuyun](../../api-sessions/overview.md)

## API Sessions'da Yanıt Parametreleri

!!! tip ""
    [NGINX Node 5.3.0 ve üstü](../node-artifact-versions.md), şimdilik [Native Node](../native-node/node-artifact-versions.md) tarafından desteklenmiyor

Wallarm'ın [API Sessions](../../api-sessions/overview.md) özelliği, kullanıcı aktiviteleri dizileri hakkında görünürlük sağlar. Bu eklemeyle artık, her oturumda yalnızca istekler değil, yanıt bilgileri de mevcut:

* Yanıtlarla ilgili header ve parametreler, ilgili istekler içerisinde gösterilmek üzere yapılandırılabilir; böylece kullanıcı aktiviteleri hakkında net ve tam resim sunar.
* Oturumları daha hassas şekilde gruplamak için yanıt parametrelerini gruplama anahtarı olarak kullanabilirsiniz (bakınız [örnek](../../api-sessions/setup.md#grouping-keys-example)).

![!API Sessions - çalışırken gruplama anahtarları örneği](../../images/api-sessions/api-sessions-grouping-keys.png)

## Rate limits

Uygun rate limit uygulanamaması, saldırganların çok yüksek hacimde istek göndererek hizmet kesintisine (DoS) neden olabilmesi veya sistemi aşırı yüklemesi gibi durumlara yol açarak meşru kullanıcılar üzerinde olumsuz etki yaratıyordu.

Wallarm'ın rate limiting özelliği sayesinde, güvenlik ekipleri servisin yükünü etkili şekilde yönetebilir ve yanlış alarmların önüne geçebilir; böylece servisin meşru kullanıcılar için erişilebilir ve güvenli kalmasını sağlar. Bu özellik, istek ve oturum parametrelerine bağlı çeşitli bağlantı limitleri sunar: geleneksel IP-tabanlı rate limiting, JSON alanları, base64 kodlanmış veriler, çerezler, XML alanları ve daha fazlası.

Örneğin, her kullanıcı için API bağlantılarını sınırlayabilir, kullanıcıların dakikada binlerce istek göndermesini engelleyebilirsiniz. Böylece sunucularınızda ağır yük oluşmasının ve hizmetin çökmesinin önüne geçebilirsiniz. Rate limiting uygulayarak, tüm kullanıcıların API'ye adil erişimi korunur ve sunucular aşırı yüklenmez.

Wallarm Console UI üzerinden → **Rules** → **Set rate limit** kısmında, kullanım durumunuza uygun olarak rate limit kapsamı, rate, burst, gecikme ve yanıt kodunu belirleyerek rate limitlerini kolayca yapılandırabilirsiniz.

[Rate limit yapılandırması rehberine göz atın →](../../user-guides/rules/rate-limiting.md)

Rate limiting kuralı, özelliği uygulamanın önerilen yöntemi olmakla birlikte, yeni NGINX yönergeleriyle de rate limit yapılandırması yapabilirsiniz:

* [`wallarm_rate_limit`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit)
* [`wallarm_rate_limit_enabled`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_enabled)
* [`wallarm_rate_limit_log_level`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_log_level)
* [`wallarm_rate_limit_status_code`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_status_code)
* [`wallarm_rate_limit_shm_size`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_shm_size)

## Credential stuffing tespiti <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm, credential stuffing girişimlerini gerçek zamanlı tespit edip bildirimde bulunan bir özellik sunmaya başladı. Credential stuffing, çalınmış veya zayıf kullanıcı adı/e-posta ve parola çiftlerinin otomatik olarak web sitesi giriş formlarına gönderilerek kullanıcı hesaplarına yetkisiz erişim sağlanmasıdır; bu durum yakından izlenir. Bu özellik, tehlikeye düşen hesapları belirleyip bunları güvence altına almanızı, örneğin hesap sahiplerini bilgilendirip geçici olarak erişimi askıya almanızı sağlar.

[Credential Stuffing Tespit yapılandırmasını nasıl ayarlayacağınızı öğrenin](../../about-wallarm/credential-stuffing.md)

![Saldırılar - credential stuffing](../../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

!!! info "Credential stuffing tespitini destekleyen seçili artifactler"
    All-in-one yüklüleyici, NGINX Ingress Controller, NGINX tabanlı Docker image ve cloud image (AMI, GCP Image) gibi sınırlı sayıda artifact, yeni tanıtılan credential stuffing tespit özelliğini desteklemektedir.

## GraphQL API koruması <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm, GraphQL içindeki düzenli saldırıları (SQLi, RCE, [vb.](../../attacks-vulns-list.md)) varsayılan olarak tespit eder. Ancak, protokolün bazı yönleri, aşırı bilgi ifşası ve DoS ile ilgili [GraphQL'e özgü](../../attacks-vulns-list.md#graphql-attacks) saldırıların gerçekleştirilmesine olanak tanır.

Wallarm, bu saldırılara karşı koruma sunar. Koruma, kuruluşunuzun GraphQL politikasını - GraphQL istekleri için belirlenen limitler setini - yapılandırarak sağlanır. Belirlenen limitleri aşan istekler, aktif filtrasyon moduna uygun olarak filtreleme node'u tarafından ya yalnızca ihlal olarak kaydedilir, ya da engellenir.

Bu işlevi kullanmaya başlamak için, Wallarm Console'da en az bir [**Detect GraphQL attacks** kuralı](../../api-protection/graphql-rule.md#creating-and-applying-the-rule) oluşturmanız gerekmektedir.

[GraphQL API Korumasını nasıl yapılandıracağınızı öğrenin](../../api-protection/graphql-rule.md)

![GraphQL eşik değerleri](../../images/user-guides/rules/graphql-rule.png)

## API Specification Enforcement

Bu son güncellemede, API Specification Enforcement özelliğini tanıtıyoruz. Bu özellik, API spesifikasyonlarınıza uygun olmayan gelen trafiği filtreler. İstemciler ile uygulamalarınız arasına konumlandırılan Wallarm node'u, spesifikasyonlarınızdaki uç nokta tanımlamaları ile gerçek API isteklerini karşılaştırır. Tanımsız uç nokta istekleri veya yetkisiz parametreler içeren istekler, yapılandırmaya bağlı olarak engellenir veya izlenir.

Bu özellik, potansiyel saldırı girişimlerini engelleyerek güvenliği güçlendirir ve aşırı yüklenmeyi, kötüye kullanımı önleyerek API performansını optimize eder.

Ayrıca, bu güncelleme bazı dağıtım seçenekleri için yeni parametreler tanıtarak, özelliğin operasyonu üzerinde teknik kontrol sağlar:

* All-in-one yüklüleyici için: [`wallarm_enable_apifw`](../../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX yönergesi.
* NGINX Ingress Controller için: [`controller.wallarm.apifirewall`](../../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) değer grubu.
* NGINX tabanlı Docker image için: `WALLARM_APIFW_ENABLE` ortam değişkeni.

[API Specification Enforcement'ı nasıl yapılandıracağınızı öğrenin](../../api-specification-enforcement/setup.md)

![Spesifikasyon - güvenlik politikalarını uygulamak için kullanılır](../../images/api-specification-enforcement/api-specification-enforcement-events.png)

## Yeni saldırı türlerinin tespiti

Wallarm, yeni saldırı türlerini tespit eder:

* [Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/) (BOLA), aynı zamanda Insecure Direct Object References (veya IDOR) olarak bilinen, en yaygın API açıklarından biridir. Bir uygulama IDOR/BOLA açığı içeriyorsa, saldırganlara hassas bilgileri veya verileri ifşa etme olasılığı artar. Saldırganların yapması gereken tek şey, API çağrısında kendi kaynağının ID'sini başka bir kullanıcıya ait kaynak ID'siyle değiştirmektir. Uygun yetkilendirme kontrollerinin eksikliği, saldırganların belirtilen kaynağa erişmesine olanak tanır. Dolayısıyla, bir nesnenin ID'sini alan ve bu nesne üzerinde herhangi bir işlem gerçekleştiren her API uç noktası potansiyel saldırı hedefidir.

    Bu açığın istismarını önlemek için, Wallarm node'u, BOLA saldırılarına karşı uç noktalarınızı korumak amacıyla kullanabileceğiniz [yeni bir trigger](../../admin-en/configuration-guides/protecting-against-bola.md) içerir. Bu trigger, belirtilen bir uç noktaya yapılan istek sayısını izler ve trigger'da belirlenen eşik değer aşıldığında bir BOLA saldırı olayı oluşturur.
* [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)

    Mass Assignment saldırısı sırasında, saldırganlar HTTP istek parametrelerini program kodu değişkenlerine veya objelere bağlamaya çalışır. Eğer bir API bu bağlamaya izin veriyorsa, saldırganlar, ifşa edilmemesi amaçlanan hassas nesne özelliklerini değiştirebilir; bu durum yetki yükselmesine, güvenlik mekanizmalarının aşılmasına ve daha fazlasına neden olabilir.
* [SSRF](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)

    Başarılı bir SSRF saldırısı, saldırgana saldırıya uğrayan web sunucusu adına istek gönderme imkanı tanıyabilir; bu da web uygulamasının kullandığı ağ portlarının ifşası, dahili ağların taranması ve yetkilendirmenin aşılmasına yol açabilir.

## API Discovery ve API Sessions'da Hassas İş Akışları

!!! tip ""
    [NGINX Node 5.3.0 ve üstü](../node-artifact-versions.md) ve [Native Node 0.10.1 ve üstü](../native-node/node-artifact-versions.md)

Hassas iş akışı yeteneği sayesinde, Wallarm'ın [API Discovery](../../api-discovery/overview.md) modülü, kimlik doğrulama, hesap yönetimi, faturalama gibi belirli iş akışları ve fonksiyonlar için kritik olan uç noktaları otomatik olarak tanımlayabilir.

Bu, hassas iş akışlarıyla ilişkili uç noktaların güvenlik açıkları veya ihlaller açısından düzenli izlenmesini ve denetlenmesini sağlar, ayrıca bu uç noktaların geliştirme, bakım ve güvenlik çalışmalarında önceliklendirilmesine olanak tanır.

Tanımlanan hassas iş akışları, Wallarm'ın [API Sessions](../../api-sessions/overview.md) özelliğine aktarılır: Eğer bir oturumun istekleri, API Discovery'de hassas iş akışları için önemli olarak etiketlenen uç noktaları etkiliyorsa, bu oturum otomatik olarak [etiketlenir](../../api-sessions/exploring.md#sensitive-business-flows) ve ilgili iş akışını etkilediği belirlenir.

Bir kez oturumlar hassas iş akışı etiketleriyle atandıktan sonra, belirli bir iş akışına göre filtreleme yapmak mümkün hale gelir; bu da analiz için en önemli oturumları seçmeyi kolaylaştırır.

![!API Sessions - hassas iş akışları](../../images/api-sessions/api-sessions-sbf-no-select.png)

## Tam donanımlı GraphQL parçalayıcı

!!! tip ""
    [NGINX Node 5.3.0 ve üstü](../node-artifact-versions.md), şimdilik [Native Node](../native-node/node-artifact-versions.md) tarafından desteklenmiyor

Tam donanımlı [GraphQL parçalayıcı](../../user-guides/rules/request-processing.md#gql), GraphQL istekleri içindeki girdi doğrulama saldırılarının (örneğin SQL enjeksiyonları) tespitini büyük ölçüde geliştirerek **daha yüksek doğruluk ve minimum yanlış pozitif** sağlar.

Temel faydaları:

* **İyileştirilmiş tespit:** Girdi doğrulama saldırılarının (örneğin SQL enjeksiyonları) daha doğru tespiti.
* **Detaylı parametre bilgisi:** GraphQL istek parametrelerinin değerlerini çıkararak API Sessions içinde gösterir ve bu değerleri oturum bağlamı parametreleri olarak kullanır.

    ![!API Sessions yapılandırması - GraphQL istek parametresi](../../images/api-sessions/api-sessions-graphql.png)

* **Hassas saldırı araması:** GraphQL istek bileşenlerinin, örneğin argümanlar, direktifler ve değişkenler gibi belirli kısımlarında saldırıları kesin olarak tespit eder.
* **Gelişmiş kural uygulaması:** GraphQL isteklerinin belirli kısımlarına yönelik ayrıntılı koruma kuralları uygulamanıza olanak tanır. Bu, belirli saldırı türleri için hassas ayarlamalar ve istisnaların yapılandırılmasını mümkün kılar.

    ![GraphQL istek noktasına uygulanan kural örneği](../../images/user-guides/rules/rule-applied-to-graphql-point.png)

## JSON Web Token gücünü kontrol etme

[JSON Web Token (JWT)](https://jwt.io/) API'ler gibi kaynaklar arasında veri alışverişini güvenli şekilde gerçekleştirmek için kullanılan popüler bir kimlik doğrulama standardıdır. JWT'nin tehlikeye girmesi, saldırganların kimlik doğrulama mekanizmalarını kırarak web uygulamalarına ve API'lere tam erişim sağlaması nedeniyle yaygın bir hedeftir. JWT ne kadar zayıfsa, ele geçirilme ihtimali o kadar artar.

Artık Wallarm, aşağıdaki JWT zayıflıklarını [tespit ediyor](../../attacks-vulns-list.md#weak-jwt):

* Şifrelenmemiş JWT'ler
* Kompromize edilmiş gizli anahtarlarla imzalanmış JWT'ler

## JWT'leri saldırılara karşı kontrol etme

JSON Web Token (JWT), en popüler kimlik doğrulama yöntemlerinden biridir. Bu durum, verinin JWT içinde kodlandığından ve isteğin herhangi bir yerinde bulunabildiğinden, JWT üzerinden yapılan saldırıların (örneğin SQL enjeksiyonu veya RCE) tespitini zorlaştırır.

Wallarm node, istekte bulunan JWT'yi bulur, [decode](../../user-guides/rules/request-processing.md#jwt) eder ve uygun [filtrasyon modu](../../admin-en/configure-wallarm-mode.md) kapsamında bu kimlik doğrulama yöntemi ile yapılan saldırı girişimlerini engeller.

## Desteklenen kurulum seçenekleri

* En son Community Ingress NGINX Controller versiyonuna dayalı Wallarm Ingress controller.

    [En son Wallarm Ingress controller'a geçiş için talimatlar →](ingress-controller.md)
* [deprecated](https://www.centos.org/centos-linux-eol/) CentOS 8.x yerine AlmaLinux, Rocky Linux ve Oracle Linux 8.x desteği eklendi.

    Alternatif işletim sistemleri için Wallarm node paketleri CentOS 8.x repository'sinde saklanacaktır.
* Debian 11 Bullseye desteği eklendi.
* Ubuntu 22.04 LTS (jammy) desteği eklendi.
* CentOS 6.x (CloudLinux 6.x) desteği kaldırıldı.
* Debian 9.x desteği kaldırıldı.
* Ubuntu 16.04 LTS (xenial) desteği kaldırıldı.
* [Wallarm Envoy-based Docker image](../../admin-en/installation-guides/envoy/envoy-docker.md) için kullanılan Envoy versiyonu [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)'e yükseltildi.

[Desteklenen kurulum seçeneklerinin tam listesine bakın →](../../installation/supported-deployment-options.md)

## Filtreleme node kurulumu için sistem gereksinimleri

* Wallarm node instance'ları artık saldırı tespit kuralları ve [API spesifikasyonları](../../api-specification-enforcement/overview.md) güncellemeleri için, ayrıca [allowlist, denylist veya graylist](../../user-guides/ip-lists/overview.md) kapsamındaki ülkeler, bölgeler veya veri merkezleri için hassas IP'lerin alınması adına aşağıdaki IP adreslerine erişim gerektirir.

    --8<-- "../include/wallarm-cloud-ips.md"
* Filtreleme node'u artık dışarıdan erişildiğinde `us1.api.wallarm.com:443` (US Cloud) ve `api.wallarm.com:443` (EU Cloud) kullanarak Cloud'a veri yükler, `us1.api.wallarm.com:444` ve `api.wallarm.com:444` yerine.

    Node'un kurulu olduğu sunucu dış kaynaklara sınırlı erişime sahipse ve her kaynağa ayrı ayrı izin verilmişse, yükseltme sonrası filtreleme node'u ile Cloud arasındaki senkronizasyon duracaktır. Yükseltilmiş node'un, yeni port ile API uç noktasına erişim verilmesi gerekmektedir.

## Wallarm Cloud'da API token'ları ile birleşik node kaydı

Yeni Wallarm node sürümü ile, e-posta-parola tabanlı Wallarm node kayıtları Wallarm Cloud'da kaldırılmıştır. Yeni node versiyonlarıyla devam edebilmek için artık yeni API token tabanlı node kayıt yöntemine geçiş zorunludur.

Yeni sürüm, desteklenen [her platformda](../../installation/supported-deployment-options.md) Wallarm node'unun Wallarm Cloud'a **API token** ile kaydedilmesine olanak tanır; bu, Wallarm Cloud'a daha güvenli ve hızlı bağlantı sağlar:

* Sadece node kurulumu yapmaya izin veren **Deploy** rolüne sahip özel kullanıcı hesapları artık gerekli değildir.
* Kullanıcı verileri Wallarm Cloud'da güvenli şekilde saklanmaya devam eder.
* İki faktörlü doğrulama etkin olan kullanıcı hesapları, node'ların Wallarm Cloud'a kaydedilmesini engellemez.
* Ayrı sunuculara dağıtılmış ilk trafik işleme ve istek postanalytics modülleri, tek bir node token ile Cloud'a kaydedilebilir.

Node kayıt yöntemlerindeki değişiklikler, bazı node tiplerinde güncellemeye neden olmuştur:

* Node'u kaydetmek için sunucuda çalıştırılması gereken script `register-node` olarak adlandırılmıştır. Daha önce, [**cloud node**](/2.18/user-guides/nodes/cloud-node/) token ile kaydı destekliyordu ancak adı `addcloudnode` idi.

    Cloud node'un yeni dağıtım sürecine geçişi gerekli değildir.
* "email-password" ile `addnode` script'ine aktarılmış kayıtı destekleyen [**regular node**](/2.18/user-guides/nodes/regular-node/) kullanımdan kaldırılmıştır.

Artık node kaydı şu şekilde gerçekleşir:

1. Wallarm Console → **Settings** → **API tokens** bölümüne gidin.
1. **Deploy** rolü ile [token oluşturun](../../user-guides/settings/api-tokens.md).
1. API token'in ilgili parametrelerle geçirildiği gerekli node dağıtım artifact'ini çalıştırın.

!!! info "Regular node desteği"
    Regular node tipi kullanımdan kaldırılmıştır ve gelecekteki sürümlerde kaldırılacaktır.

## AWS üzerinde Wallarm'ı dağıtmak için Terraform modülü

Artık [AWS](https://aws.amazon.com/) üzerinde Infrastructure as Code (IaC) tabanlı ortamı kullanarak kolayca Wallarm dağıtabilirsiniz; bunun için [Wallarm Terraform modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanılmaktadır.

Wallarm Terraform modülü, güvenlik ve failover konusunda en iyi endüstri standartlarını karşılayan ölçeklenebilir bir çözümdür. Dağıtım sırasında, trafik akışı gereksinimlerinize bağlı olarak **proxy** veya **mirror** dağıtım seçeneğini seçebilirsiniz.

Temel dağıtım yapılandırmaları ile birlikte AWS VPC Traffic Mirroring gibi gelişmiş çözümlerle uyumlu seçenekler için kullanım örnekleri de hazırlanmıştır.

[AWS için Wallarm Terraform modülü dokümantasyonuna bakın →](../../installation/cloud-platforms/aws/terraform-module/overview.md)

## Denylist kaynaklarından gelen engellenen isteklerin istatistiklerinin toplanması

Wallarm NGINX‑tabanlı filtreleme node'ları artık denylist'e alınan kaynaklardan gelen engellenen isteklerin istatistiklerini toplayarak, saldırı gücünü değerlendirmenize yardımcı olur. Bu, engellenen istek istatistiklerine ve örneklerine erişimi içerir, fark edilmeyen etkinlikleri en aza indirmenize yardımcı olur. Bu verileri Wallarm Console UI'daki **Attacks** bölümünde bulabilirsiniz.

Otomatik IP engelleme (örneğin, brute force trigger ile) kullanıldığında, artık hem tetikleyici istekleri hem de sonrasında engellenen istek örneklerini analiz edebilirsiniz. Manuel denylist'e eklenen kaynaklardan dolayı engellenen istekler için de yeni işlev, engellenen kaynak aktivitelerine yönelik daha iyi görünürlük sağlar.

Yeni [arama etiketleri ve filtreler](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) sayesinde, aşağıdaki veriye kolayca erişebilirsiniz:

* Manuel olarak denylist'e eklenen IP adresleri, alt ağlar, ülkeler, VPN'ler vb. nedeniyle engellenen istekleri tespit etmek için `blocked_source` aramasını kullanın.
* **Number of malicious payloads** trigger'ı kullanarak, çoklu kötü amaçlı payload içeren isteklerin neden olduğu engellenen istekleri belirlemek için `multiple_payloads` aramasını kullanın.
* Ayrıca, `api_abuse`, `brute`, `dirbust` ve `bola` arama etiketleri artık ilgili Wallarm trigger'ları tarafından otomatik denylist'e eklenen kaynaklardan gelen istekleri de kapsamaktadır.

Bu değişiklik, varsayılan olarak etkin (`on`) olan, ancak istenirse `off`'a alınabilecek yeni yapılandırma parametrelerini içerir:

* [`wallarm_acl_export_enable`](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) NGINX yönergesi.
* NGINX Ingress controller chart için [`controller.config.wallarm-acl-export-enable`](../../admin-en/configure-kubernetes-en.md#global-controller-settings) değeri.
* Sidecar Controller çözümü için [`config.wallarm.aclExportEnable`](../../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable) chart değeri ve [`sidecar.wallarm.io/wallarm-acl-export-enable`](../../installation/kubernetes/sidecar-proxy/pod-annotations.md) pod anotaasyonu.

## Hazır `cloud-init.py` script'ine sahip dağıtılmış Wallarm AWS image

Infrastructure as Code (IaC) yaklaşımını takip ediyorsanız, AWS'ye Wallarm node'u dağıtmak için [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) script'ini kullanmanız gerekebilir. Artık Wallarm, AWS cloud image'ini hazır‑to‑use `cloud-init.py` script'i ile dağıtmaktadır.

[Wallarm `cloud-init` script'inin özellikleri →](../../installation/cloud-platforms/cloud-init.md)

## Basitleştirilmiş multi-tenant node yapılandırması

[Multi-tenant node'lar](../../installation/multi-tenant/overview.md) için, tenant'lar ve uygulamalar artık her biri kendi yönergesiyle tanımlanır:

* Tenant'ın benzersiz tanımlayıcısını yapılandırmak için [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) NGINX yönergesi ve [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param) Envoy parametresi eklendi.
* [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) NGINX yönergesi ve [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#application_param) Envoy parametresinin davranışı değiştirildi. Artık **sadece** bir uygulama ID'sini yapılandırmak için kullanılır.

[Multi-tenant node yükseltme talimatlarına bakın →](../multi-tenant.md)

## Filtrasyon modları

* Yeni **safe blocking** filtrasyon modu.

    Bu mod, [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) sayısını önemli ölçüde azaltır; sadece graylist'teki IP adreslerinden gelen kötü amaçlı istekleri engeller.
* İstek kaynaklarının analizi artık sadece `safe_blocking` ve `block` modlarında yapılır.
    
    * Wallarm node'u `off` veya `monitoring` modunda çalışırken, denylist'te bulunan IP'den gelen istek tespit edilse dahi engellenmez.
    * `monitoring` modundaki Wallarm node'u, allowlist'te bulunan IP adreslerinden gelen tüm saldırıları Wallarm Cloud'a gönderir.

[Wallarm node modları hakkında daha fazla detay →](../../admin-en/configure-wallarm-mode.md)

## İstek Kaynağı Kontrolü

İstek kaynağı kontrolü için kullanılan aşağıdaki parametreler, kullanılmaktan kaldırılmıştır:

* IP denylist yapılandırması için kullanılan tüm `acl` NGINX yönergeleri, Envoy parametreleri ve ortam değişkenleri. Manuel IP denylist yapılandırması artık gerekli değildir.

    [Denylist yapılandırması geçişi hakkında detaylar →](../migrate-ip-lists-to-node-3.md)

İstek kaynağı kontrolü için yeni özellikler:

* Wallarm Console'da tam IP allowlist, denylist ve graylist kontrolü.
* Yeni [filtrasyon modu](../../admin-en/configure-wallarm-mode.md) `safe_blocking` ve [IP graylist'leri](../../user-guides/ip-lists/overview.md) desteği.

    **Safe blocking** modu, sadece graylist'teki IP adreslerinden gelen kötü amaçlı istekleri engelleyerek [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) sayısını önemli ölçüde azaltır.

    Otomatik IP graylisting için, yeni yayınlanan [**Number of malicious payloads** trigger](../../admin-en/configuration-guides/protecting-with-thresholds.md) kullanılabilir.
* Wallarm Vulnerability Scanner'ın IP adreslerinin otomatik allowlist'e eklenmesi. Scanner IP'lerin manuel allowlist'e eklenmesine artık gerek yoktur.
* Belirli uygulamalar için istek kaynaklarını allowlist, denylist veya graylist'e ekleme yeteneği.
* İstek kaynağı analizini devre dışı bırakmak için yeni NGINX yönergesi ve Envoy parametresi `disable_acl`.

    [disable_acl NGINX yönergesi hakkında detaylar →](../../admin-en/configure-parameters-en.md#disable_acl)

    [disable_acl Envoy parametresi hakkında detaylar →](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

[IP'lerin allowlist, denylist ve graylist'e eklenmesi hakkında detaylar →](../../user-guides/ip-lists/overview.md)

## API Envanteri Keşfi için Yeni Modül

Yeni Wallarm node'ları, otomatik olarak uygulama API'sini tanımlayan **API Discovery** modülüyle dağıtılmaktadır. Modül varsayılan olarak devre dışıdır.

[API Discovery modülü hakkında detaylar →](../../api-discovery/overview.md)

## Libdetection Kütüphanesi ile Geliştirilmiş Saldırı Analizi

Wallarm tarafından gerçekleştirilen saldırı analizi, ek bir saldırı doğrulama katmanının devreye alınmasıyla güçlendirilmiştir. Tüm form faktörlerinde (Envoy dahil) Wallarm node'ları, libdetection kütüphanesi varsayılan olarak etkin bir şekilde dağıtılmaktadır. Bu kütüphane, tüm [SQLi](../../attacks-vulns-list.md#sql-injection) saldırıları üzerinde ikincil, tam dilbilgisi temelli doğrulama yaparak yanlış pozitiflerin sayısını azaltır.

!!! warning "Bellek tüketiminde artış"
    **libdetection** kütüphanesi etkinleştirildiğinde, NGINX/Envoy ve Wallarm süreçlerinin kullandığı bellek miktarı yaklaşık %10 oranında artabilir.

[Wallarm'ın saldırıları nasıl tespit ettiğine dair detaylar →](../../about-wallarm/protecting-against-attacks.md)

## `overlimit_res` Saldırı Tespit İnce Ayarını Etkinleştiren Kural

Yeni [rule allowing the `overlimit_res` attack detection fine-tuning](../../user-guides/rules/configure-overlimit-res-detection.md) tanıtılmıştır.

NGINX ve Envoy konfigürasyon dosyaları üzerinden `overlimit_res` saldırı tespit ince ayarını yapılandırmak, eskiden `wallarm_process_time_limit` NGINX yönergesi ve `process_time_limit` Envoy parametresinin yaptığı işlevi yerine getirirdi.

* Kural, tek bir istek işleme zaman limiti ayarlanmasına olanak tanır.
* Kural, `overlimit_res` saldırılarını, [node filtrasyon moduna](../../admin-en/configure-wallarm-mode.md) uygun şekilde engeller veya geçilmesine izin verir; bu, `wallarm_process_time_limit_block` NGINX yönergesi ve `process_time_limit_block` Envoy parametresinin yerine geçer.

Listelenen yönergeler ve parametreler kullanımdan kaldırılmıştır ve gelecekteki sürümlerde silinecektir. `overlimit_res` saldırı tespit yapılandırmasını yönergelerden kurala geçirmeniz önerilir. İlgili dağıtım seçeneklerine dair talimatlar [node genel önerilerinde](../general-recommendations.md#update-process) belirtilmiştir.

Eğer listelenen parametreler yapılandırma dosyalarında açıkça belirtilmişse fakat kural henüz oluşturulmamışsa, node istekleri yapılandırmada belirtildiği şekilde işler.

## Optimize Edilmiş ve Daha Güvenli NGINX-Tabanlı Docker Image

[Wallarm'ın NGINX-tabanlı filtreleme node'u için Docker image'ı](../../admin-en/installation-docker-en.md), geliştirilmiş güvenlik ve optimizasyon amacıyla yeniden düzenlenmiştir. Temel güncellemeler:

* Docker image artık Debian yerine Alpine Linux üzerine inşa edilmiştir; bu sayede daha güvenli ve hafif bir artifact sunar. Lütfen, daha önce paketlenen `auth-pam` ve `subs-filter` NGINX modüllerinin artık Docker image ile paketlenmediğini unutmayın.
* Önceki 1.14.x versiyondan sonra en son stabil NGINX versiyonu olan 1.26.2'ye yükseltilmiştir. Debian ekibi tarafından 1.14.x'teki çoğu güvenlik açığı yamalanmış olsa da, 1.26.2'ye yükseltme kalan güvenlik açıklarını giderir.
  
      NGINX yükseltmesiyle birlikte Alpine Linux'a geçiş, HTTP/2 Rapid Reset Güvenlik açığı (CVE-2023-44487) problemini de çözer; bu, NGINX 1.26.2'de Alpine'ya özgü yamanın uygulanması sayesinde gerçekleşir.
* ARM64 mimarili işlemciler desteği, kurulum sırasında otomatik olarak tanımlanır.
* Docker konteyneri içerisinde tüm işlemler artık `wallarm` isimli non-root kullanıcı ile gerçekleştirilir; bu, önceki `root` kullanıcı yapılandırmasından farklıdır. Bu durum NGINX sürecini de etkiler.
* [`/wallarm-status`](../../admin-en/configure-statistics-service.md) uç noktası, JSON yerine Prometheus formatında metrikleri dışa aktaracak şekilde güncellenmiştir. Bu, özellikle Docker konteyneri dışından erişildiğinde geçerlidir. Bu işlev için [`WALLARM_STATUS_ALLOW`](../../admin-en/installation-docker-en.md#wallarm-status-allow-env-var) ortam değişkeninin uygun şekilde ayarlanması gerekir.
* Docker image artık [all-in-one yüklüleyici](../../installation/nginx/all-in-one.md) kullanılarak oluşturulmaktadır; bu durum iç dizin yapısını değiştirir:
  
      * Log dosyası dizini: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * Wallarm node'unun Cloud'a bağlanmak için kullandığı kimlik bilgilerini içeren dosya dizini: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
* `/usr/share` dizinine giden yol → `/opt/wallarm/usr/share`.
      
      Bu, [sample blocking page](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)'in yeni yolu olan `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`'i tanıtır.

Yeni sürüm ürün özellikleri, yeni formatın NGINX-tabanlı Docker image tarafından da desteklenmektedir.

## Optimize Edilmiş Cloud Image'ler

[Amazon Machine Image (AMI)](../../installation/cloud-platforms/aws/ami.md) ve [Google Cloud Machine Image](../../installation/cloud-platforms/gcp/machine-image.md) optimize edilmiştir. Temel güncellemeler:

* Cloud image'ler, deprecated olan Debian 10.x (buster) yerine en son stabil sürüm olan Debian 12.x (bookworm) kullanır; böylece güvenliği artırır.
* Önceki 1.14.x versiyondan daha yeni olan NGINX versiyonu olan 1.22.1'e yükseltilmiştir.
* ARM64 mimarili işlemciler desteği, kurulum sırasında otomatik olarak tanımlanır.
* Cloud image'ler artık [all-in-one yüklüleyici](../../installation/nginx/all-in-one.md) kullanılarak oluşturulmaktadır; bu durum iç dizin yapısını değiştirir:
  
      * Node kayıt script’i: `/usr/share/wallarm-common/register-node` → `/opt/wallarm/usr/share/wallarm-common/cloud-init.py`.
      * Log dosyası dizini: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * Wallarm node'unun Cloud'a bağlanmak için kullandığı kimlik bilgilerini içeren dizin: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
      * `/usr/share` dizinine giden yol: → `/opt/wallarm/usr/share`.
          
          Bu, [sample blocking page](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)'in yeni yolu olan `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`'i tanıtır.
      
      * Global Wallarm filtreleme node ayarlarını içeren `/etc/nginx/conf.d/wallarm.conf` dosyası kaldırılmıştır.

Yeni sürüm ürün özellikleri, yeni format cloud image'leri tarafından da desteklenmektedir.

## Yeni Blocking Page

`/usr/share/nginx/html/wallarm_blocked.html` sample blocking page güncellenmiştir. Yeni node versiyonunda, yeni düzen ve logo ile destek e-posta özelleştirmesini de destekleyecek şekilde tasarlanmıştır.
    
Varsayılan olarak, yeni düzen ile blocking page aşağıdaki gibi görünür:

![Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[Blocking page kurulumu hakkında daha fazla detay →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## Temel Node Kurulumu için Yeni Parametreler

* Wallarm NGINX‑tabanlı Docker konteynerine geçirilecek yeni ortam değişkenleri:

    * Korunan uygulamanın Wallarm Cloud'da kullanılacak tanımlayıcısını ayarlamak için `WALLARM_APPLICATION`.
    * Docker konteyneri içinde NGINX'in kullanacağı portu ayarlamak için `NGINX_PORT`.

    [Wallarm NGINX‑tabanlı Docker konteyneri dağıtım talimatları →](../../admin-en/installation-docker-en.md)
* Wallarm Cloud ve filtreleme node senkronizasyonu için `node.yaml` dosyasının yeni parametreleri: `api.local_host` ve `api.local_port`. Bu parametreler, Wallarm API'ye gönderilecek istekler için yerel IP adresi ve portu belirtir.

    [Node.yaml parametrelerinin tam listesini görmek için →](../../admin-en/configure-cloud-node-synchronization-en.md#access-parameters)

## NGINX‑tabanlı Wallarm Docker Konteyneri için IPv6 Bağlantılarını Devre Dışı Bırakma

NGINX‑tabanlı Wallarm Docker image artık NGINX'in IPv6 bağlantı işlemlerini devre dışı bırakmanızı sağlayacak `DISABLE_IPV6` adlı yeni ortam değişkenini destekler; böylece yalnızca IPv4 bağlantıları işlenir.

## Parametrelerin, Dosyaların ve Metriklerin Yeniden Adlandırılması

Aşağıdaki NGINX yönergeleri ve Envoy parametreleri yeniden adlandırılmıştır:

* NGINX: `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* NGINX: `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
* Envoy: `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
* Envoy: `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
* Envoy: `tsets` bölümü → `rulesets`, ve bu bölümdeki `tsN` girdileri → `rsN`
* Envoy: `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
* Envoy: `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)

Önceki isimli parametreler hala desteklenmekte ancak gelecekteki sürümlerde kullanımdan kaldırılacaktır. Parametre mantığı değişmemiştir.
* Ingress [annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance` artık `nginx.ingress.kubernetes.io/wallarm-application` olarak yeniden adlandırılmıştır.

    Önceki isimli annotation hala desteklenmektedir fakat gelecekteki sürümlerde kaldırılacaktır.
* Özel ruleset build dosyası `/etc/wallarm/lom` artık `/etc/wallarm/custom_ruleset` olarak yeniden adlandırılmıştır. Yeni node versiyonlarının dosya sisteminde yalnızca yeni isimde dosya bulunmaktadır.

    [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) NGINX yönergesi ve [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) Envoy parametresinin varsayılan değerleri uygun şekilde değiştirilmiştir. Yeni varsayılan değer `/etc/wallarm/custom_ruleset`'dir.
* Özel anahtar dosyası `/etc/wallarm/license.key` artık `/etc/wallarm/private.key` olarak yeniden adlandırılmıştır. Yeni isim varsayılan olarak kullanılır.
* Collectd metriği `gauge-lom_id` artık `gauge-custom_ruleset_id` olarak yeniden adlandırılmıştır.

    Yeni node versiyonlarında, collectd servisi hem eski hem yeni metrikleri toplamaktadır. Eski metrik toplama gelecekteki sürümlerde kaldırılacaktır.

    [Tüm collectd metriklerine bakın →](../../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)
* Docker konteynerindeki `/var/log/wallarm/addnode_loop.log` [log dosyası](../../admin-en/configure-logging.md) artık `/var/log/wallarm/registernode_loop.log` olarak yeniden adlandırılmıştır.

## İstatistik Servisi Parametreleri

* Prometheus metriği `wallarm_custom_ruleset_id`, custom ruleset formatını temsil eden `format` niteliği eklenerek geliştirildi. Bu yeni nitelik, temel değerin custom ruleset build versiyonu olmaya devam etmesiyle birlikte kullanılır. Örneğin:

    ```
    wallarm_custom_ruleset_id{format="51"} 386
    ```
* Wallarm istatistik servisi, [Wallarm rate limiting](#rate-limits) modül verisiyle yeni `rate_limit` parametrelerini döner. Bu parametreler, reddedilen ve geciken istekleri kapsar ve modülün çalışma sorunlarını gösterir.
* Denylist'teki kaynaklardan gelen istek sayısı, istatistik servisi çıktısında yeni `blocked_by_acl` parametresinde ve mevcut `requests`, `blocked` parametrelerinde gösterilir.
* Servis, Wallarm node'larının kullandığı [custom ruleset](../../glossary-en.md#custom-ruleset-the-former-term-is-lom) formatını gösteren `custom_ruleset_ver` adlı yeni bir parametre döner.
* Aşağıdaki node istatistik parametreleri yeniden adlandırılmıştır:

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    Yeni node versiyonlarında, `http://127.0.0.8/wallarm-status` uç noktası geçici olarak hem eski hem de yeni parametreleri döner. Eski parametreler gelecekte kaldırılacaktır.

[İstatistik servisi hakkında detaylar →](../../admin-en/configure-statistics-service.md)

## Node Log Formatını Yapılandırmak için Yeni Değişkenler

Aşağıdaki [node loglama değişkenleri](../../admin-en/configure-logging.md#filter-node-variables) değiştirilmiştir:

* `wallarm_request_time` artık `wallarm_request_cpu_time` olarak yeniden adlandırılmıştır.

    Bu değişken, isteğin işlenmesi için CPU tarafından harcanan süreyi (saniye olarak) ifade eder.

    Önceki isimli değişken kullanımdan kaldırılmıştır ve gelecekteki sürümlerde kaldırılacaktır.
* `wallarm_request_mono_time` eklenmiştir.

    Bu değişken, isteğin işlenmesi için harcanan CPU süresi artı kuyruk süresini saniye olarak ifade eder.

## Denylist'teki IP'lerden Gelen İsteklerde Saldırı Aramasını Atlayarak Performansı Artırmak

Yeni [`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) yönergesi, denylist'teki IP'lerden gelen istekler analizinde saldırı arama aşamasının atlanmasına olanak tanır. Bu, yoğun denylist trafiğine sahip ortamlarda CPU yükünü azaltarak performansı artırır.

## Node Instance'larını Kolayca Gruplayabilme

Artık, `Deploy` rolüne sahip bir [**API token**](../../user-guides/settings/api-tokens.md) kullanarak, `WALLARM_LABELS` değişkeni ve `group` etiketi ile node instance'larını kolayca gruplayabilirsiniz.

Örneğin: 

```bash
docker run -d -e WALLARM_API_TOKEN='<API TOKEN WITH DEPLOY ROLE>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_LABELS='group=<GROUP>' -p 80:80 wallarm/node:5.3.0
```

... bu komut, node instance'ını `<GROUP>` — mevcutsa mevcut gruba, yoksa oluşturularak — yerleştirir.

## Gidilen Güvenlik Açıkları

Yeni sürümler, [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327), [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920) ve diğer birçok yüksek ve kritik şiddetteki güvenlik açığını ele alarak, önceki savunmasız bileşenleri değiştirir.

## HTTP/2 Stream Uzunluk Kontrol Yönergesi

HTTP/2 stream'lerinin maksimum uzunluğunu kontrol etmek için [`wallarm_http_v2_stream_max_len`](../../admin-en/configure-parameters-en.md#wallarm_http_v2_stream_max_len) yönergesi tanıtılmıştır. Bu, uzun ömürlü gRPC bağlantılarında aşırı bellek tüketimini önlemeye yardımcı olur.

Docker konteynerinde bu yönergeyi kullanmak için, NGINX konfigürasyon dosyanızda belirtip dosyayı konteynere mount edin.

## Account Takeover, Scraping ve Security Crawlers için Ayrı Arama Etiketleri

`account_takeover`, `scraping` ve `security_crawlers` saldırı türleri için, önceki genel `api_abuse` etiketinin yerine, daha spesifik ayrı [arama etiketleri](../../user-guides/search-and-filters/use-search.md) tanımlanmıştır.

## Connectors ve TCP Trafik Mirror Analizi için Native Node

NGINX'e bağımlı olmayan, bağımsız bir dağıtım seçeneği olan Native Node'u tanıtmaktan heyecan duyuyoruz. Bu çözüm, NGINX gerektirmeyen veya platform bağımsız bir yaklaşım tercih edilen ortamlarda kullanılmak üzere geliştirilmiştir.

Şu anda, aşağıdaki dağıtımlar için özelleştirilmiştir:

* MuleSoft, Cloudflare, CloudFront, Broadcom Layer7 API Gateway, Fastly connectors (istek ve yanıt analizi ile)
* Kong API Gateway ve Istio Ingress connectors
* TCP trafik mirror analizi

[Devamını okuyun](../../installation/nginx-native-node-internals.md#native-node)

## Yükseltme Süreci

1. [Module yükseltmesi için önerileri](../general-recommendations.md) gözden geçirin.
2. Wallarm node dağıtım seçeneğinize yönelik talimatları izleyerek yüklü modülleri yükseltin:
  
      * **All-in-one yüklüleyici** kullanılarak [NGINX, NGINX Plus modüllerinin yükseltilmesi →](nginx-modules.md)
      
        Yükseltme sürecini iyileştirmek ve basitleştirmek amacıyla, tüm node versiyonları Wallarm'ın all-in-one yüklüleyicisi ile yükseltilmektedir. Bireysel Linux paketleri ile manuel yükseltme artık desteklenmemektedir.
      
      * [NGINX veya Envoy modülleri için Docker konteynerinin yükseltilmesi →](docker-container.md)
      * [Wallarm modüllerini entegre eden NGINX Ingress controller'ın yükseltilmesi →](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
      * [Multi-tenant node](multi-tenant.md)
3. Önceki Wallarm node versiyonlarından allowlist ve denylist yapılandırmasını [migrate](../migrate-ip-lists-to-node-3.md) edin.

----------

[Wallarm ürünlerinin ve bileşenlerinin diğer güncellemelerine göz atın →](https://changelog.wallarm.com/)