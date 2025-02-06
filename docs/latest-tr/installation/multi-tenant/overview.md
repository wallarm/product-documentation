# Çok Kiracılılık Genel Bakış

**Çok kiracılılık** özelliği, Wallarm kullanılarak birkaç bağımsız şirket altyapısının veya izole edilmiş ortamların aynı anda korunmasına olanak tanır.

**Kiracı** ([**kiracı hesabı**](#tenant-accounts)) aşağıdaki varlıkları temsil eder:

* Wallarm'u partner olarak entegre ederken bağımsız bir şirket (**müşteri**).
* Wallarm'u müşteri olarak entegre ederken izole edilmiş bir ortam.

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## Çok kiracılılık ile ele alınan sorunlar

Çok kiracılılık özelliği aşağıdaki sorunları ele almaktadır:

* **Wallarm Partneri Olun**. Partner, müşterilerine saldırı azaltma sağlamak amacıyla kendi sistem altyapısına bir filtreleme düğümü kuran bir organizasyondur.

    Her müşteriye Wallarm Console'da ayrı bir hesap tahsis edilir; böylece hesap verileri izole edilir ve yalnızca seçilen kullanıcılar tarafından erişilebilir.
* **Korunan ortamlardaki verileri birbirinden izole edin**. Bir ortam, ayrı bir uygulama, veri merkezi, API, üretim veya staging ortamı vb. olabilir.

    İlgili sorun örnekleri:

    * Wallarm node, izole ekipler tarafından yönetilen üretim ve staging ortamlarına gönderilen istekleri filtreler. Gerek olan şey, yalnızca belirli bir ortamı yöneten ekiplerin o ortama ait verilere erişebilmesini sağlamaktır.
    * Wallarm node'ları, izole ekipler tarafından yönetilen ve farklı bölgelerde bulunan – biri Avrupa'da, diğeri Asya'da – birkaç veri merkezine dağıtılmıştır. Gerek olan şey, yalnızca belirli bir veri merkezini yöneten kullanıcıların o merkeze ait verilere erişebilmesini sağlamaktır.

    Her müşteriye Wallarm Console'da ayrı bir hesap tahsis edilir; böylece hesap verileri izole edilir ve yalnızca seçilen kullanıcılar tarafından erişilebilir.

## Wallarm Bileşenlerinin Özelleştirilmesi

Wallarm, Wallarm Console ve diğer bazı bileşenlerin özelleştirilmesine olanak tanır. Çok kiracılılık kullanılıyorsa, aşağıdaki özelleştirme seçenekleri faydalı olabilir:

* Wallarm Console'un markalaştırılması
* Wallarm Console'un özel bir domain üzerinde barındırılması
* Teknik destek ekibinizin, müşterilerden veya çalışma arkadaşlarından gelen mesajları alabilmesi için e-posta adresinin ayarlanması

## Kiracı Hesapları

Kiracı hesapları aşağıdaki özelliklerle tanımlanır:

* Wallarm Console'da kiracı hesaplarını doğru şekilde gruplamak için, her kiracı hesabı, partner veya izole edilmiş ortamları olan bir müşteriyi işaret eden global hesaba bağlanır.
* Kullanıcılara her kiracı hesabına ayrı ayrı erişim sağlanır.
* Her kiracı hesabının verileri izole edilir ve yalnızca hesaba eklenen kullanıcıların erişimine açıktır.
* **Global** [rolleri](../../user-guides/settings/users.md#user-roles) olan kullanıcılar, yeni kiracı hesapları oluşturabilir ve tüm kiracı hesaplarının verilerini görüntüleyip düzenleyebilir.

Kiracı hesapları aşağıdaki yapıya göre oluşturulur:

![!Tenant account structure](../../images/partner-waf-node/accounts-scheme.png)

* **Global account** yalnızca partner veya müşteri tarafından kiracı hesaplarını gruplamak için kullanılır.
* **Technical tenant account**; kiracı hesaplarına erişim sağlamak amacıyla [global users](../../user-guides/settings/users.md#user-roles) eklemek için kullanılır. Global users genellikle Wallarm partner şirketlerinin veya izole edilmiş ortamlar için çok kiracılılık kullanan Wallarm müşterilerinin çalışanlarıdır.
* **Tenant accounts** şu amaçlarla kullanılır:

    * Kiracılara, tespit edilen saldırılara ilişkin verilere ve trafik filtreleme ayarlarına erişim sağlamak.
    * Kullanıcılara belirli kiracı hesabının verilerine erişim sağlamak.

[Global users](../../user-guides/settings/users.md#user-roles) şu işlemleri yapabilir: 

* Wallarm Console'da hesaplar arasında geçiş yapmak.
* Kiracıların [aboneliklerini ve kotalarını](../../about-wallarm/subscription-plans.md) izlemek.

![!Tenant selector in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console.png)

* `Technical tenant` teknik tenant hesabıdır
* `Tenant 1` ve `Tenant 2` kiracı hesaplarıdır

## Çok Kiracılılık Yapılandırması

Çok kiracılılık özelliği varsayılan olarak etkin değildir. Özelliği etkinleştirmek ve yapılandırmak için:

1. Abonelik planınıza **Multi-tenant system** özelliğinin eklenmesi için [sales@wallarm.com](mailto:sales@wallarm.com) adresine talep gönderin.
2. Wallarm Console'da kiracı hesaplarını [yapılandırın](configure-accounts.md).
3. Çok tenant Wallarm node'unu [dağıtın ve yapılandırın](deploy-multi-tenant-node.md).