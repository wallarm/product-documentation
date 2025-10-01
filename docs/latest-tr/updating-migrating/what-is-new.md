```markdown
# Wallarm Node 5.x ve 0.x Sürümlerinde Neler Yeni?

Bu belge, NGINX Node 5.x ve Native Node 0.x ana sürümleri için değişiklik günlüklerini tanımlamaktadır. Eski ana düğüm sürümlerinden yükseltiyorsanız, bu belgeye güvenebilirsiniz.

Wallarm Node'un küçük sürümlerindeki detaylı değişiklik günlüğü için [NGINX Node artifact inventory](node-artifact-versions.md) veya [Native Node artifact inventory](native-node/node-artifact-versions.md)'na bakın.

## API Oturumları

!!! tip ""
    [NGINX Node 5.1.0 ve üzeri](node-artifact-versions.md) ve [Native Node 0.8.1 ve üzeri](native-node/node-artifact-versions.md)

API ekonomisine özel benzersiz bir güvenlik özelliğini tanıtıyoruz - [API Oturumları](../api-sessions/overview.md). Bu ekleme, saldırılar, anomaliler ve kullanıcı davranışları hakkında API'leriniz genelinde görünürlük sağlayarak, kullanıcıların API'leriniz ve uygulamalarınızla nasıl etkileşime girdiğine dair şeffaflık sunar.

![!API Oturumları bölümü - izlenen oturumlar](../images/api-sessions/api-sessions.png)

Saldırganlar, eylemlerini meşru kullanıcı davranışlarıyla harmanlayarak savunmasız uç noktaları sıkça hedef alır. Bu oturumların tam olarak nasıl gerçekleştiğine dair bağlam olmadan, kalıpları veya tehditleri tespit etmek, çeşitli araçlar ve sistemler içeren zaman alıcı bir sürece dönüşür. Kuruluşlar, API düzeyinde yeterli görünürlüğe sahip değillerdir.

API Oturumları sayesinde, güvenlik ekipleri artık kullanıcı oturumuna göre gruplanmış tüm ilgili etkinlikleri görebilir, saldırı dizilerini, kullanıcı anomalilerini ve normal davranışları eşsiz şekilde gözlemleyebilir. Eskiden saatler veya günler süren incelemeler, artık sadece birkaç dakika içinde Wallarm Konsolu üzerinden gerçekleştirilebilir.

Önemli özellikler:

* Saldırılar, anomaliler ve kullanıcı davranışları hakkında görünürlük: Her oturumda yapılan her isteği inceleyerek saldırı vektörlerini ve şüpheli kalıpları takip edin.
* Hem eski hem de modern oturumları destekleme: Uygulamalarınız cookie tabanlı oturumlara veya JWT/OAuth'a dayansa da, Wallarm API Oturumları tam uyumluluk ve görünürlük sağlar.
* Bireysel saldırılar ile oturumları arasında sorunsuzca geçiş yapma.

API Oturumları ile güvenlik ekipleri artık kolayca:

* Tehdit aktörlerinin tüm etkinliklerini inceleyerek potansiyel saldırı yollarını ve tehlikeye girmiş kaynakları anlayabilir.
* Gölge veya zombi API'lere nasıl erişildiğini belirleyerek, dökümante edilmemiş veya güncelliğini yitirmiş API'lerden kaynaklanan riskleri azaltabilir.
* Güvenlik incelemeleri sırasında işbirliğini teşvik etmek için önemli bulguları meslektaşlarla paylaşabilir.

[Devamını oku](../api-sessions/overview.md)

## API Oturumlarında Yanıt Parametreleri

!!! tip ""
    [NGINX Node 5.3.0 ve üzeri](node-artifact-versions.md), [Native Node](native-node/node-artifact-versions.md) tarafından şu ana kadar desteklenmiyor

Wallarm'ın [API Oturumları](../api-sessions/overview.md), kullanıcı etkinlik dizileri hakkında görünürlük sağlar. Bu ekleme sayesinde, her oturum içinde yalnızca istekler değil, aynı zamanda yanıt bilgileri de mevcut:

* Yanıtların herhangi bir başlığını ve parametresini, ilgili isteklerinde görüntülenecek şekilde yapılandırabilirsiniz; bu sayede kullanıcı etkinliklerine dair net ve eksiksiz bir resim elde edersiniz.
* İstekleri oturumlara gruplandırmayı daha hassas hale getiren oturumlar için gruplama anahtarları olarak yanıt parametrelerini kullanabilirsiniz (bkz. [örnek](../api-sessions/setup.md#grouping-keys-example)).

![!API Oturumları - gruplama anahtarlarının çalışma örneği](../images/api-sessions/api-sessions-grouping-keys.png)

## İstek İşleme Süresinin Sınırlandırılmasında Yenilikler

!!! tip ""
    [NGINX Node 5.1.0 ve üzeri](node-artifact-versions.md) ve [Native Node 0.8.1 ve üzeri](native-node/node-artifact-versions.md)

Wallarm, sistem belleğinin tükenmesini önlemek için isteğin işlenme süresini [sınırlar](../user-guides/rules/configure-overlimit-res-detection.md), bu durum node'un devre dışı kalmasına ve uygulamalarınızın korunmasız kalmasına neden olabilir. Şimdi, bu mekanizmanın şeffaflığı artırıldı:

* Sınırın aşıldığı tüm durumlar kaydedilir ve hemen **Saldırılar** bölümünde `overlimit_res` olayları olarak görüntülenir - bunları kolayca tespit edip analiz edebilirsiniz.
* Sınırın aşıldığı tüm durumlarda, isteklerin işlenmesi durdurulur.
* Sistem davranışının yapılandırılması artık daha kolay - genel yapılandırma **Ayarlar** → **Genel** bölümünde görüntülenir ve oradan değiştirilebilir.
* **İstek işleme süresini sınırla** (önceki adıyla **overlimit_res saldırı tespiti için ince ayar**) kuralı, belirli uç noktalar için farklı yapılandırmalar belirlemek üzere sadeleştirildi.

## API Discovery'de Hassas Veri Tespitinin Özelleştirilmesi

!!! tip ""
    [NGINX Node 5.0.3 ve üzeri](node-artifact-versions.md) ve [Native Node 0.7.0 ve üzeri](native-node/node-artifact-versions.md)

API Discovery, API'leriniz tarafından tüketilen ve taşınan hassas verileri tespit eder ve vurgular. Artık mevcut tespit sürecini [ince ayar yapabilir](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) ve kendi hassas veri kalıplarınızı ekleyebilirsiniz.

Hassas verinin nasıl tespit edileceğini ve hangi hassas verinin tespit edileceğini tanımlamak için kalıplar kullanılır. Varsayılan kalıpları değiştirmek ve kendi kalıplarınızı eklemek için, Wallarm Konsolu'nda **API Discovery** → **Configure API Discovery** → **Sensitive data** bölümüne gidin.

## API Discovery ve API Oturumlarında Hassas İş Akışları

!!! tip ""
    [NGINX Node 5.2.11 ve üzeri](node-artifact-versions.md) ve [Native Node 0.10.1 ve üzeri](native-node/node-artifact-versions.md)

Hassas iş akışı özelliği ile, Wallarm'ın [API Discovery'si](../api-discovery/overview.md), kimlik doğrulama, hesap yönetimi, faturalama gibi belirli iş akışları ve işlevler için kritik olan uç noktaları otomatik olarak tespit edebilir.

Bu, hassas iş akışlarıyla ilgili uç noktaların düzenli olarak izlenmesini ve zafiyet veya ihlallere karşı denetlenmesini sağlar; böylece geliştirme, bakım ve güvenlik çabalarına öncelik verilir.

![API Discovery - Hassas iş akışları](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

Tespit edilen hassas iş akışları, Wallarm'ın [API Oturumları](../api-sessions/overview.md)'na aktarılır: bir oturumdaki istekler, API Discovery'de belirli hassas iş akışları için önemli olarak etiketlenmiş uç noktalardan etkileniyorsa, bu oturum otomatik olarak [etiketlenir](../api-sessions/exploring.md#sensitive-business-flows) ve bu iş akışını etkilediği belirtilir.

Oturumlara hassas iş akışı etiketleri atandıktan sonra, belirli bir iş akışına göre filtreleme yapılabilir; bu da analiz için en önemli olan oturumları seçmeyi kolaylaştırır.

![!API Oturumları - hassas iş akışları](../images/api-sessions/api-sessions-sbf-no-select.png)

## Tam Donanımlı GraphQL Çözücü

!!! tip ""
    [NGINX Node 5.3.0 ve üzeri](node-artifact-versions.md), [Native Node](native-node/node-artifact-versions.md) tarafından şu ana kadar desteklenmiyor

Tam donanımlı [GraphQL çözücüsü](../user-guides/rules/request-processing.md#gql), GraphQL istekleri içindeki giriş doğrulama saldırılarının (örneğin, SQL enjeksiyonları) tespitini önemli ölçüde geliştiren bir iyileştirmedir ve **daha yüksek doğruluk ve minimal yanlış pozitif** sunar.

Ana faydalar:

* **Geliştirilmiş tespit**: Giriş doğrulama saldırılarının (örneğin, SQL enjeksiyonları) tespiti.
* **Detaylı parametre bilgileri**: GraphQL istek parametrelerinin değerlerini API Oturumlarında çıkartır ve oturum bağlamı parametreleri olarak kullanır.

    ![!API Oturumları yapılandırması - GraphQL istek parametresi](../images/api-sessions/api-sessions-graphql.png)

* **Kesin saldırı araması**: Argümanlar, direktifler ve değişkenler gibi belirli GraphQL istek bileşenlerinde saldırıları tam olarak tespit eder.
* **Gelişmiş kural uygulaması**: Belirli GraphQL istek kısımlarına yönelik detaylı koruma kuralları uygular. Bu, GraphQL isteğinin tanımlı bölümlerinde belirli saldırı türlerine karşı hariç tutmaları yapılandırmak için ince ayar yapılmasına olanak tanır.

    ![GraphQL istek noktasına uygulanan kural örneği](../images/user-guides/rules/rule-applied-to-graphql-point.png)

## Konnektörler ve TCP Trafik Aynası için Native Node

NGINX'e bağlı olmaksızın çalışan yeni bir dağıtım seçeneği olan Native Node'u tanıtmaktan heyecan duyuyoruz. Bu çözüm, NGINX'in gerekli olmadığı veya platform bağımsız bir yaklaşımın tercih edildiği ortamlar için geliştirilmiştir.

Şu anda, aşağıdaki dağıtımlar için özelleştirilmiştir:

* MuleSoft, Cloudflare, CloudFront, Broadcom Layer7 API Gateway, Fastly konnektörleri - hem istek hem yanıt analizleriyle
* Kong API Gateway ve Istio Ingress konnektörleri
* TCP trafik aynası analizi

[Devamını oku](../installation/nginx-native-node-internals.md#native-node)

## NGINX Node Teknoloji Yığını Değişiklikleri

[Wallarm NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 5.x, **Ruby tabanlı** uygulamadan **Go dili** tabanlı bir uygulamaya geçiş yapacak şekilde yeniden tasarlandı. Bu sürümle, çözümü şimdi ve gelecekteki geliştirmeler için daha hızlı, daha ölçeklenebilir ve daha kaynak verimli hale getirmeye odaklanıyoruz.

### Ölçümler

Belirli ölçümler açısından, Wallarm postanalytics modülünde aşağıdaki performans iyileştirmeleri yapılmıştır:

* CPU kullanımı 0.5 CPU çekirdeğinden 0.1 CPU çekirdeğine düşürülmüştür.
* Bellek kullanımı, saniyede 500 istek trafiğinde 400 MB azaltılmıştır.

### Dosya Sistemi Değişiklikleri

Teknoloji yığını değişiklikleri ile birlikte, NGINX Node artifact'larının dosya sistemi aşağıdaki şekilde değiştirilmiştir:

* Log dosya sistemi: Önceden, loglar her biri belirli bir betik için ayrı dosyalarda kaydediliyordu. Artık, neredeyse tüm servislerden gelen loglar, `wcli-out.log` adlı tek bir dosyada kaydedilmektedir.
* Tanılama betiği yolu değişikliği: `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` dosyası `/opt/wallarm/collect-info.sh` yoluna taşınmıştır.

### Ek Özellik Tanıtımları

NGINX Node 5.2 sürümünden itibaren, yeni özellikler yalnızca yeni Go tabanlı uygulamaya sahip düğümlerde tanıtılacaktır. Bu yeni özellikler, önceki sürüme (4.10) geri taşınmayacaktır.

## Sürüm Yönetimi Politikasındaki Değişiklikler

NGINX Node teknoloji yığını güncellemeleri ve Native Node'un tanıtılması ile birlikte, [Wallarm Node sürüm yönetimi politikası](versioning-policy.md) güncellenmiştir:

* Wallarm artık en güncel iki ana sürümü, en son küçük sürümleriyle desteklemektedir.
* İki sürüm gerideki sürümler (örneğin, 6.x → 4.x) için destek, yeni bir ana sürüm yayınlandıktan 3 ay sonra sona ermektedir.
* Ana sürümler her 6 ayda bir veya önemli yeni özellikler ve geriye dönük uyumsuz değişiklikler için yayınlanmaktadır.
* Küçük sürümler mevcut işlevsellik içinde iyileştirmelere odaklanarak aylık olarak (+1 artış) yayınlanmaktadır.
* Native Node, Wallarm NGINX Node ile aynı sürüm yönetim desenini izlemektedir; eş zamanlı sürümler ve özellik eşitliği söz konusudur. Ancak, Native Node ana sürüm numaralandırması 0'dan başlamaktadır.

## Hangi Wallarm Düğümlerinin Yükseltilmesi Tavsiye Edilmektedir?

* Güncel Wallarm sürümleriyle uyumlu kalmak ve [yüklenen modülün kullanım dışı kalmasını](versioning-policy.md#version-support-policy) önlemek için 4.8 ve 4.10 sürümündeki Client ve multi-tenant Wallarm NGINX Düğümleri.
* [Desteklenmeyen](versioning-policy.md#version-list) sürümlerdeki (4.6 ve altı) Client ve multi-tenant Wallarm düğümleri.

    Sürüm 3.6 veya altından yükseltme yapıyorsanız, [ayrı listeden](older-versions/what-is-new.md) tüm değişiklikleri öğrenin.

## Yükseltme Süreci

1. [Modül yükseltme için önerileri](general-recommendations.md) gözden geçirin.
2. Wallarm düğüm dağıtım seçeneğinize uygun talimatları izleyerek yüklenen modülleri yükseltin:

    * NGINX Node:
        * [DEB/RPM paketleri](nginx-modules.md)
        * [All-in-one yükleyici](all-in-one.md)
        * [NGINX için modüller içeren Docker konteyneri](docker-container.md)
        * [Wallarm modülleri entegre edilmiş NGINX Ingress Denetleyicisi](ingress-controller.md)
        * [Sidecar denetleyici](sidecar-proxy.md)
        * [Cloud düğüm imajı](cloud-image.md)
        * [Multi-tenant düğüm](multi-tenant.md)
    
    * Native Node:
        * [All-in-one yükleyici](native-node/all-in-one.md)
        * [Helm chart](native-node/helm-chart.md)
        * [Docker imajı](native-node/docker-image.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
```