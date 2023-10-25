# Çoklu Kiracılığa Genel Bakış

**Çoklu kiracılık** özelliği, Wallarm'ı birkaç bağımsız şirket altyapısını veya izole ortamları aynı anda korumak için kullanma imkanı sunar.

Bir **Kiracı** ([**kiracı hesabı**](#tenant-accounts)), aşağıdaki unsurları temsil eder:

* Bağımsız bir şirket (**müşteri**) eğer Wallarm bir ortak olarak entegre edilirse.
* Izole bir ortam eğer Wallarm bir müşteri olarak entegre edilirse.

--8<-- "../include-tr/waf/features/multi-tenancy/partner-client-term.md"

## Çoklu Kiracılık ile Ele Alınan Sorunlar

Çoklu kiracılık özelliği, aşağıdaki konuları ele alır:

* **Wallarm ortağı olun**. Ortak, sistem altyapısı içerisinde bir filtreleme düğümü kuran ve müşterilerine saldırı hafifletme hizmeti sağlayan bir organizasyondur.

    Her müşteriye, tüm hesap verilerinin izole edildiği ve sadece belirli kullanıcılar tarafından erişilebilen ayrı bir Wallarm Console hesabı tahsis edilir.
* **Korunan ortamlardaki verileri birbirinden izole edin**. Bir ortam, ayrı bir uygulama, veri merkezi, API, üretim veya staging ortamı vb. olabilir.
    
    İlgili sorun örnekleri:

    * Wallarm düğümü, izole ekipler tarafından yönetilen üretim ve sahne ortamlarına gönderilen istekleri filtreler. Gereklilik, sadece belirli bir ortamı yöneten ekiplerin verilerine erişim sağlamaktır.
    * Wallarm düğümleri, izole ekipler tarafından yönetilen ve farklı bölgelerde bulunan birkaç veri merkezine konuşlandırılır, biri Avrupa'da, diğeri Asya'da. Gereklilik, yalnızca belirli bir veri merkezini yöneten kullanıcıların verilerine erişim sağlamaktır.

    Her müşteriye, tüm hesap verilerinin izole edildiği ve sadece belirli kullanıcılar tarafından erişilebilen ayrı bir Wallarm Console hesabı tahsis edilir.

## Wallarm bileşenlerinin özelleştirilmesi

Wallarm, Wallarm Konsolu ve bazı diğer bileşenlerin özelleştirilmesine izin verir. Çoklu kiracılık kullanılıyorsa, aşağıdaki özelleştirme seçenekleri kullanışlı olabilir:

* Wallarm Konsolu'na marka ekleyin
* Wallarm Konsolu'nu özel bir alan adında barındırın
* Müşterilerden veya meslektaşlardan mesajlar alacak teknik destek e-posta adresinizi ayarlayın

## Kiracı Hesapları

Kiracı hesapları aşağıdaki özelliklerle karakterizedir:

* Kiracı hesaplarını Wallarm Konsolu'nda doğru bir şekilde gruplandırmak için, her kiracı hesabı, izole ortamlara sahip bir ortak veya müşteriyi belirten global bir hesaba bağlanır.
* Kullanıcılara her kiracı hesabına ayrı ayrı erişim sağlanır.
* Her kiracı hesabının verileri izole edilir ve yalnızca hesaba eklenen kullanıcılar tarafından erişilebilir.
* **Global** [rollere](../../user-guides/settings/users.md#user-roles) sahip kullanıcılar yeni kiracı hesapları oluşturabilir ve tüm kiracı hesaplarının verilerini görüntüleyebilir ve düzenleyebilir.

Kiracı hesapları, aşağıdaki yapıya göre oluşturulur:

![!Kiracı hesap yapısı](../../images/partner-waf-node/accounts-scheme.png)

* **Global hesap**, yalnızca bir ortak veya bir müşteri tarafından kiracı hesapları gruplandırmak için kullanılır.
* **Teknik kiracı hesabı**, kiracı hesaplarına erişim sağlamaları için [global kullanıcıları](../../user-guides/settings/users.md#user-roles) eklemek için kullanılır. Global kullanıcılar genellikle Wallarm ortak şirketlerin çalışanları veya izole ortamlar için çoklu kiracılık kullanan Wallarm müşterileridir.
* **Kiracı hesapları**, aşağıdakileri yapmak için kullanılır:

    * Kiracılara, tespit edilen saldırıların verilerine ve trafik filtrasyon ayarlarına erişim sağlamak.
    * Kullanıcılara belirli bir kiracı hesabının verilerine erişim sağlamak.

[Global kullanıcılar](../../user-guides/settings/users.md#user-roles) şunları yapabilir:

* Wallarm Konsolu'ndaki hesaplar arasında geçiş yapabilir.
* Kiracıların [aboneliklerini ve kotalarını](../../about-wallarm/subscription-plans.md) izleyebilir.

![!Wallarm Konsolu'nda Kiracı Seçici](../../images/partner-waf-node/clients-selector-in-console.png)

* `Teknik kiracı`, bir teknik kiracı hesabıdır
* `Kiracı 1` ve `Kiracı 2`, kiracı hesaplarıdır

## Çoklu Kiracılık Ayarları

Çoklu kiracılık özelliği varsayılan olarak etkin değildir. Bu özelliği etkinleştirmek ve ayarlamak için:

1. Abonelik planınıza **Çoklu Kiracı Sistemi** özelliğini eklemek için [sales@wallarm.com](mailto:sales@wallarm.com) adresine talepte bulunun.
2. Wallarm Konsolu'nda kiracı hesaplarını [ayarlayın](configure-accounts.md).
3. Çoklu kiracı Wallarm düğümünü [konuşlandırın ve ayarlayın](deploy-multi-tenant-node.md).