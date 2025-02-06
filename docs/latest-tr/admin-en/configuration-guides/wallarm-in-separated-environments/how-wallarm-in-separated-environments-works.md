# Ayri Ortamlarda Filtreleme Düğümü Nasıl Çalışır

Uygulama, üretim, staging, test, geliştirme vb. birkaç farklı ortama dağıtılabilir. Bu talimatlar, farklı ortamlar için bir filtre düğümünü yönetmenin önerilen yolları hakkında bilgi sağlar.

## Bir Ortam Nedir
Bir ortamın tanımı şirketten şirkete farklılık gösterebilir ve bu talimat kapsamında aşağıdaki tanım kullanılmıştır.

Bir **ortam**, farklı amaçlara hizmet eden (örneğin üretim, staging, test, geliştirme vb.) izole edilmiş bir veya alt küme bilgisayar kaynaklarıdır ve bir şirketin aynı veya farklı ekipleri (SRE, QA, Development vb.) tarafından aynı veya farklı politika setleri (ağ/yazılım yapılandırmaları, yazılım sürümleri, izleme, değişiklik yönetimi vb. açısından) kullanılarak yönetilir.

En iyi uygulamalar açısından, tek bir ürün dikeyinde kullanılan tüm ortamlar (geliştirme, test, staging ve üretim aşamaları) arasında Wallarm düğüm yapılandırmalarının senkronize tutulması önerilir.

## İlgili Wallarm Özellikleri

Farklı ortamlar için farklı filtre düğüm yapılandırmalarını yönetmenize ve filtre düğüm değişikliklerini kademeli olarak dağıtmanıza olanak tanıyan üç ana özellik bulunmaktadır:

* [Resource identification](#resource-identification)
* [Separate Wallarm accounts and sub-accounts](#separate-wallarm-accounts-and-sub-accounts)
* [Filter node operation mode](../../configure-wallarm-mode.md)

### Resource Identification

Belirli bir ortam için filtre düğümünü tanımlama kullanarak yapılandırmanın iki yolu vardır:

* Her ortam için Wallarm benzersiz kimlikleri,
* ortamların farklı URL etki alanı adları (eğer mimarinizde zaten yapılandırılmışsa).

#### ID İle Ortam Tanımlaması

Applications kavramı, farklı korunan ortamlara farklı kimlikler atamanıza ve her ortam için filtre düğüm kurallarını ayrı ayrı yönetmenize olanak tanır.

Bir filtre düğümü yapılandırırken Applications kavramını kullanarak ortamlarınız için Wallarm kimliklerini ekleyebilirsiniz. Kimlikleri ayarlamak için:

1. Wallarm hesabınızda → **Settings** → **Applications** bölümüne ortam adlarını ve kimliklerini ekleyin.

    ![Added environments](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/added-applications.png)
2. Bir filtre düğümünde kimlik yapılandırmasını belirtin:

    * Linux‑tabanlı, Kubernetes sidecar ve Docker‑tabanlı dağıtımlar için [`wallarm_application`](../../configure-parameters-en.md#wallarm_application) yönergesi kullanarak;
    * Kubernetes NGINX Ingress denetleyici dağıtımları için [`nginx.ingress.kubernetes.io/wallarm-application`](../../configure-kubernetes-en.md#ingress-annotations) açıklamasını kullanarak. Artık yeni bir filtre düğüm kuralı oluştururken, kuralın belirli uygulama kimlikleri kümesine atanacağını belirtebilirsiniz. Özellik belirtilmediği takdirde, yeni kural otomatik olarak Wallarm hesabındaki tüm korunan kaynaklara uygulanır.

![Creating rule for ID](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-id.png)

#### Etki Alanı İle Ortam Tanımlaması

Her ortam, HTTP isteği başlığında geçirilen farklı URL etki alanı adlarını kullanıyorsa, bu etki alanı adlarını her ortamın benzersiz tanımlayıcıları olarak kullanmak mümkündür.

Özelliği kullanmak için, yapılandırılmış her filtre düğüm kuralı için uygun `HOST` başlığı işaretçisini ekleyiniz. Aşağıdaki örnekte, kural yalnızca `HOST` başlığı `dev.domain.com` olan istekler için tetiklenecektir:

![Creating rule for HOST](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-host.png)

### Separate Wallarm Accounts and Sub-accounts

Farklı ortamların filtre düğümü yapılandırmasını izole etmenin kolay bir yolu, her ortam veya ortam grubu için ayrı Wallarm hesapları kullanmaktır. Bu en iyi uygulama, Amazon AWS dahil olmak üzere birçok bulut servis sağlayıcısı tarafından önerilmektedir.

Birden fazla Wallarm hesabının yönetimini kolaylaştırmak için, mantıksal bir `master` Wallarm hesabı oluşturmak ve kullanılan diğer Wallarm hesaplarını `master` hesabına alt hesap olarak atamak mümkündür. Bu şekilde, kuruluşunuza ait tüm Wallarm hesaplarını yönetmek için tek bir konsol UI ve API kimlik bilgileri seti kullanılabilir.

`master` hesabı ve alt hesapları etkinleştirmek için lütfen [Wallarm's Technical Support](mailto:support@wallarm.com) ekibiyle iletişime geçin. Özellik, ayrı bir Wallarm enterprise lisansı gerektirir.

!!! warning "Bilinen Kısıtlamalar"
    * Aynı Wallarm hesabına bağlı tüm filtre düğümleri aynı trafik filtreleme kurallarını alacaktır. Yine de, uygun [uygulama kimlikleri veya benzersiz HTTP istek başlıkları](#resource-identification) kullanarak farklı uygulamalar için farklı kurallar uygulayabilirsiniz.
    * Eğer filtre düğümü otomatik olarak bir IP adresini engellemeye karar verirse (örneğin, IP adresinden üç veya daha fazla tespit edilen saldırı vektörü nedeniyle) sistem, Wallarm hesabındaki tüm uygulamalar için o IP'yi engelleyecektir.