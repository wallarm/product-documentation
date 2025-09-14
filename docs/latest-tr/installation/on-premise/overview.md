# Wallarm Yerinde (On-Premises) Çözüm Genel Bakış

Wallarm, ortaklar, büyük işletmeler ve güvenlik altyapıları üzerinde tam kontrol gerektiren tüm kuruluşlar için yerinde bir çözüm sunar. Bu dağıtım modeli, hem Filtering Nodes hem de Wallarm Cloud bileşenini tamamen kendi ortamınızda barındırmanıza olanak tanır.

Bu doküman, çözümün mimarisi, temel bileşenleri ve dağıtım modellerine genel bir bakış sunar — organizasyonunuz için Wallarm Yerinde (On-Premises) çözümünün uygunluğunu değerlendirmenize yardımcı olmak için.

## Çözüm bileşenlerine genel bakış

Wallarm mimarisi [iki ana bileşen](../../about-wallarm/overview.md#how-wallarm-works) üzerine kuruludur:

* Trafik akışınıza entegre olarak gelen istekleri kötü amaçlı aktiviteler için inceleyen **Filtering Node**.
* Filtering Nodes’tan gelen verileri işleyen ve yapılandırma ile güvenlik olaylarını araştırmak için kontrol düzleminiz olan Wallarm Console UI’yi barındıran **Wallarm Cloud**.

Yerinde çözümde her iki bileşen de **tamamen müşteri tarafından barındırılır ve yönetilir**.

Yerinde çözümde hem [satır içi](../../installation/inline/overview.md) hem de [bant dışı](../../installation/oob/overview.md) Node dağıtım yaklaşımları desteklenir. Her iki durumda da Filtering Node, trafiği keser veya yansıtır ve analiz ve koordinasyon için yerel Wallarm Cloud bileşenine metaveri gönderir.

=== "Satır içi trafik akışı"
    ![!](../../images/waf-installation/on-premise/inline-flow.png)
=== "Bant dışı trafik akışı"
    ![!](../../images/waf-installation/on-premise/oob-flow.png)

## Yerinde dağıtımda Filtering Node

Yerinde kurulumda, Filtering Nodes için [tüm standart self-hosted dağıtım seçenekleri](../supported-deployment-options.md) desteklenir. Normal dağıtım talimatlarını izleyebilirsiniz.

Filtering Nodes, Wallarm Cloud’dan ayrı örnekler üzerinde dağıtılmalıdır.

## Yerinde dağıtımda Wallarm Cloud

Wallarm Cloud bileşeni, dahili altyapınız içinde dağıtılır ve Internet’ten ve dahili ağın diğer bölümlerinden bir güvenlik duvarı ile ayrılmış, **izole bir ağ segmentinde ve ayrı güvenli sunucularda** bulunmalıdır.

Tek başına sanal veya fiziksel sunucularda çalışacak şekilde tasarlanmıştır ve hem tek düğümlü hem de küme mimarilerini destekler.

### Dağıtım katmanları

Wallarm Cloud sistemi, Wallarm’ın yazılım kurucu aracı tarafından dağıtılan ve yönetilen aşağıdaki katmanlardan oluşturulmuştur:

* Kubernetes kümesi
* Kubernetes için dağıtık blok depolama
* Veritabanları
* MinIO
* Yapılandırma ve dağıtım araçları
* ~20 Wallarm iç mikroservisi

### Dağıtım mimarileri

Bir Wallarm Cloud örneğinin nasıl dağıtılacağı ve yönetileceğine ilişkin temel mimariler şunlardır:

1. **Standalone** - Tek düğümlü dağıtım. Yalnızca test ve değerlendirme için uygundur, yedeklilik veya hata toleransı yoktur.
2. **Küme**. Üretim kullanımı için tasarlanmış çok düğümlü Kubernetes dağıtımı. Küme en az 3 düğüm gerektirir ve bir düğümün arızasını tolere edebilir — birden fazla düğümün devre dışı kalması çoğunluğu (quorum) bozar.

    Wallarm Cloud düğümleri aynı ağda/alt ağda konumlandırılmalıdır — küme düğümleri arasında veri ve yapılandırmayı eşzamanlamak için ağı kullanırlar.

**Kümeli dağıtımda**, etkin Wallarm Cloud düğümleri arasında trafiği dağıtmak için bir ağ yük dengeleyici gereklidir. İki desteklenen seçenek vardır:

* Cloud örneği dağıtımının bir parçası olarak sağlanan yerleşik yazılım yük dengeleyicisi

    Bunu kullanmak için aynı özel alt ağ içinde bir Sanal IP (VIP) tahsis etmeniz gerekir. Yerel ağ, mevcut sunuculara ek IP adresleri tahsis etmeyi (ARP ve RARP protokol seviyesinde) desteklemelidir.
* Müşteri tarafından yönetilen harici yük dengeleyici

    Bağımsız dengeleyici hem TCP hem de UDP katmanı yük dengelemeyi ve Wallarm Cloud düğümlerinin durumunu doğrulamak için TCP sağlık kontrollerini desteklemelidir.

![!](../../images/waf-installation/on-premise/cluster-arch.png)

### Yönetim çalışma istasyonu

Wallarm Cloud bileşenini kurmak ve yönetmek için ayrı bir yönetim çalışma istasyonu gereklidir.

Bu makine kümenin parçası değildir ve yalnızca kurulum, yapılandırma, güncellemeler ve felaket kurtarma gibi idari görevler için kullanılır. [Gereksinimleri](deployment.md#management-workstation) karşılamalıdır.

Yönetim çalışma istasyonu, Wallarm’ın yerinde yönetim aracı **wctl**’yi çalıştırır ve dağıtım ve bakım sırasında kullanılan gerekli yapılandırma dosyalarını saklar.

### Katman yönetimi sorumlulukları

Aşağıdaki diyagram, Wallarm Cloud sisteminin hangi katmanlarının **wctl** aracılığıyla yönetildiğini ve hangilerinin müşteri yönetimi gerektirdiğini göstermektedir:

![!](../../images/waf-installation/on-premise/wctl-client-managed-components.png)

### Yüksek kullanılabilirlik ve otomatik devretme

Bir Wallarm Cloud örneği küme modunda dağıtıldığında, örnekten aşağıdaki yetenekler beklenebilir:

* Tek bir Wallarm Cloud düğümünün arızalanması durumunda, sistem arızayı tespit edip kurtarırken Wallarm Cloud örneği en fazla 5 dakikaya kadar hizmet bozulması yaşayabilir (ancak bu mutlaka gerçekleşmeyebilir).  
* Bir düğüm kesintisinden sonra, Longhorn veri depolama alt sistemi verileri hayatta kalan düğümlere yeniden dengelemeye ve bozulmuş birimleri geri yüklemeye başlamadan önce yaklaşık 10 dakika bekler.  
* Bozulmuş bir Wallarm Cloud kümesine yeni bir düğüm eklendikten sonra, sistemin küme içindeki veri ve iş yükünü yeniden dengelemesi 30–40 dakika sürebilir. Bu süre zarfında sistem kısa (1–2 dakika) bir hizmet bozulması dönemi yaşayabilir.

### Staging ortamı

Yeni yazılım sürümlerini ve üretime uygulamadan önce büyük yapılandırma değişikliklerini test etmek için Wallarm Cloud bileşeninin ayrı bir **staging** örneğini kurmanızı öneririz.

İdeal olarak, staging ortamı üretim kurulumunu (ağ, sunucular, yazılım) yansıtmalı ve bakım veya test sırasında karışıklığı önlemek için izolasyonlu bir ağda, net bir adlandırma ile dağıtılmalıdır.

## Filtering Node ve Wallarm Cloud bağımlılığı

Wallarm Filtering Node bileşeninin işlevselliği, [Wallarm Cloud Çalışmıyor](../../faq/wallarm-cloud-down.md) dokümanında açıklandığı gibi Wallarm Cloud bileşeninin erişilebilirliğine ve işlevselliğine bağlıdır.

Wallarm Cloud bileşeninin dağıtımını planlarken, bahsedilen bağımlılıkları göz önünde bulundurmak ve tüm Wallarm API Security sisteminin doğru işlevselliğini etkileyen yedeklilik, yüksek kullanılabilirlik, izleme ve diğer unsurlar için uygun seviyelerde tasarım yapmak önemlidir.

## Wallarm API

Bir Wallarm Cloud örneği, müşterinin zafiyetleri, saldırıları, olayları vb. yönetmek gibi farklı görevleri programlı olarak gerçekleştirmek için kullanabileceği [bir API uç noktaları seti](../../api/overview.md) sunar.

Yerinde Wallarm Cloud dağıtımları aşağıdaki URL kullanılarak bir SwaggerUI arayüzü sağlar:

```
https://apiconsole.<WALLARM_CLOUD_INSTANCE_DOMAIN>
```

## Lisanslama

Her yerinde Wallarm Cloud örneği, Wallarm tarafından sağlanan bir lisans anahtarı gerektirir. Anahtar şunları tanımlar:

* Lisans geçerlilik süresi
* Etkin ürün özellikleri
* Aylık API trafik hacmi (RPM)

Lisans süresi dolarsa veya aylık API trafiği izin verilen RPM hacmini aşarsa:

* Filtering Nodes, lisans süresi dolmadan önce Node üzerine yüklenen kuralları kullanarak trafiği filtrelemeye devam eder
* Filtering Nodes, API saldırılarını ve oturumlarını Wallarm Cloud’a yüklemeyi durdurur; bu nedenle yeni olaylar Console UI’de görünmez
* Sistem API oturumlarını analiz etmeyi ve yeni API Abuse Prevention kuralları üretmeyi durdurur

Wallarm lisansı sona ermek üzereyken veya mevcut RPM lisanslı hacme yaklaşırken sistem otomatik olarak e-posta bildirimleri gönderir.

Yerinde çözüme erişmek için lütfen [Wallarm Satış Ekibi](mailto:sales@wallarm.com) ile iletişime geçin.

## Sınırlamalar

Yerinde Wallarm çözümü şu işlevleri şu anda desteklemez:

* [AASM (API Attack Surface Management)](../../api-attack-surface/overview.md) özelliği

    Özellik yerinde sürümde mevcut olmasa da, müşteriler yine de Wallarm’ın bulut tabanlı hizmetinde bir hesap oluşturabilir ve yukarıdaki talimatları izleyerek AASM ürününü etkinleştirebilir.
* [Telegram](../../user-guides/settings/integrations/telegram.md) ile entegrasyon (entegrasyona ihtiyacınız varsa lütfen [Satış Ekibi](mailto:sales@wallarm.com) ile iletişime geçin)

## Veri saklama ve otomatik silme

Varsayılan olarak, Wallarm Cloud [genel olarak erişilebilir veri saklama politikasını](https://docs.wallarm.com/about-wallarm/data-retention-policy/) izler.

Disk depolama boyutu genellikle önceden yapılandırıldığı ve kolayca değiştirilemediği için, Wallarm Cloud, sistem olası bir disk taşması tespit ederse veritabanındaki eski kullanıcı oturumlarına, saldırılara, Hits ve olaylara ait verileri silmek için otomatik bir sürece sahiptir.

Bu durumda, sistem yöneticisi ek disk depolama kapasitesi eklemek için bir süreci planlayıp yürütmeyi değerlendirmesi yönünde uyarı içeren bir e-posta bildirimi alır.