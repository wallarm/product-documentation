# Çok kiracılılığa Genel Bakış

**Çok kiracılılık** özelliği, Wallarm'ı aynı anda birden fazla bağımsız şirket altyapısını veya izole ortamı korumak için kullanmanıza olanak tanır.

**Kiracı** ([**kiracı hesabı**](#tenant-accounts)) aşağıdaki varlıkları temsil eder:

* Wallarm'ı bir iş ortağı olarak entegre ediyorsanız bağımsız bir şirket (**müşteri**).
* Wallarm'ı bir müşteri olarak entegre ediyorsanız izole bir ortam.

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## Çok kiracılılığın ele aldığı sorunlar

Çok kiracılılık özelliği aşağıdaki sorunları ele alır:

* **Wallarm ortağı olmak**. İş ortağı, müşterilerine saldırı azaltma sağlamak için sistem altyapılarına bir filtreleme düğümü kuran kuruluştur.

    Her müşteri için Wallarm Console içinde ayrı bir hesap tahsis edilir; böylece tüm verileri izole edilir ve yalnızca bu müşterinin kullanıcıları tarafından erişilebilir olur.

* **Korumalı ortamlar üzerindeki verileri birbirinden izole etmek**. Bir ortam; ayrı bir uygulama, veri merkezi, API, üretim veya hazırlık (staging) ortamı vb. olabilir.

    İlgili örnekler:

    * Wallarm düğümü, izole ekipler tarafından yönetilen üretim ve hazırlık (staging) ortamlarına gönderilen istekleri filtreler. Gereksinim: Yalnızca belirli bir ortamı yöneten ekiplerin o ortama ait verilere erişebilmesini sağlamak.
    * Wallarm düğümleri, izole ekiplerce yönetilen ve farklı bölgelerde bulunan (biri Avrupa'da, diğeri Asya'da) birden fazla veri merkezine dağıtılmıştır. Gereksinim: Yalnızca belirli bir veri merkezini yöneten kullanıcıların o merkeze ait verilere erişebilmesini sağlamak.

    Her ortam için Wallarm Console içinde ayrı bir hesap tahsis edilecektir; böylece tüm verileri izole edilir ve yalnızca seçilen kullanıcılar tarafından erişilebilir olur.

    !!! info "İzole olmayan ortamlar"
        Ortamları izole etmeniz gerekmiyorsa, çok kiracılılık yerine bu ortamlar için ayarları ve görüntüleme yeteneklerini ayırmak üzere [applications](../../user-guides/settings/applications.md) kullanabilirsiniz. Bu, ortamları tüm kullanıcılarının erişebildiği tek bir hesap içinde düzenler.

## Wallarm bileşenlerinin özelleştirilmesi

Wallarm, Wallarm Console ve bazı diğer bileşenlerin özelleştirilmesine olanak tanır. Çok kiracılılığı kullanıyorsanız, aşağıdaki özelleştirme seçenekleri faydalı olabilir:

* Wallarm Console'u markalaştırmak
* Wallarm Console'u özel bir alan adında barındırmak
* Müşterilerden veya çalışma arkadaşlarından iletileri almak için teknik destek e‑posta adresini ayarlamak

## Kiracı hesapları {#tenant-accounts}

Kiracı hesaplarının özellikleri şunlardır:

* Kiracı hesaplarını Wallarm Console'da doğru şekilde gruplamak için, her kiracı hesabı bir küresel hesaba bağlanır; bu, bir iş ortağını veya izole ortamları olan bir müşteriyi ifade eder.
* Kullanıcılara her kiracı hesabına ayrı ayrı erişim sağlanır.
* Her kiracı hesabının verileri izole edilir ve yalnızca hesaba eklenen kullanıcılar tarafından erişilebilir olur.
* **global** [roller](../../user-guides/settings/users.md#user-roles) ile kullanıcılar yeni kiracı hesapları oluşturabilir ve tüm kiracı hesaplarının verilerini görüntüleyip düzenleyebilir.

Kiracı hesapları aşağıdaki yapıya göre oluşturulur:

![!Kiracı hesap yapısı](../../images/partner-waf-node/accounts-scheme.png)

* **Global hesap**, kiracı hesaplarını yalnızca bir iş ortağı veya müşteri bazında gruplamak için kullanılır.
* **Teknik kiracı hesabı**, [global users](../../user-guides/settings/users.md#user-roles) eklemek ve onlara kiracı hesaplarına erişim sağlamak için kullanılır. Global users genellikle Wallarm iş ortağı şirketlerinin çalışanları veya izole ortamlar için çok kiracılılığı kullanan Wallarm müşterileridir.
* **Kiracı hesapları** şunlar için kullanılır:

    * Kiracılara tespit edilen saldırılara ilişkin verilere ve trafik filtreleme ayarlarına erişim sağlamak.
    * Kullanıcılara belirli bir kiracı hesabının verilerine erişim sağlamak.

[Global users](../../user-guides/settings/users.md#user-roles) şunları yapabilir: 

* Wallarm Console'da hesaplar arasında geçiş yapmak.
* Kiracıların [aboneliklerini ve kotalarını](../../about-wallarm/subscription-plans.md) izlemek.

![!Wallarm Console'da kiracı seçici](../../images/partner-waf-node/clients-selector-in-console.png)

* `Technical tenant` bir teknik kiracı hesabıdır
* `Tenant 1` ve `Tenant 2` kiracı hesaplarıdır

## Çok kiracılılık yapılandırması

Çok kiracılılık özelliği varsayılan olarak devre dışıdır. Özelliği etkinleştirmek ve yapılandırmak için:

1. Abonelik planınıza "Multi-tenant system" özelliğini ekletmek için [sales@wallarm.com](mailto:sales@wallarm.com) adresine talep gönderin.
2. Kiracı hesaplarını Wallarm Console'da [yapılandırın](configure-accounts.md).
3. Çok kiracılı Wallarm düğümünü [dağıtın ve yapılandırın](deploy-multi-tenant-node.md).