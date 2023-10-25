# Ayrı Ortamlarda Filtre Düğümünün Nasıl Çalıştığı

Uygulama, birkaç farklı ortama: üretim, sahnelendirme, test, geliştirme vb. dağıtılabilir. Bu talimatlar, farklı ortamlar için bir filtre düğümünü yönetme yolları hakkında bilgi verir.

## Bir Ortam Nedir
Bir ortamın tanımı, şirketten şirkete farklılık gösterebilir ve bu talimatın amacı için aşağıdaki tanım kullanılır.

Bir **ortam** farklı amaçlara hizmet eden izole bir bilgi işlem kaynakları kümesi veya alt kümesidir (üretim, sahnelendirme, test, geliştirme vb. gibi) ve aynı veya farklı bir politika kümesi kullanılarak yönetilir (ağ/yazılım yapılandırmaları, yazılım sürümleri, izleme, değişiklik yönetimi vb. açısından) aynı veya farklı ekipler (SRE, QA, Geliştirme vb.) tarafından.

En iyi uygulamalar perspektifinden, tek bir ürün dikeyinde kullanılan tüm ortamlar arasında Wallarm düğümlerinin konfigürasyonunu senkronize tutmanız önerilir (geliştirme, test, sahnelendirme ve üretim aşamaları).

## İlgili Wallarm Özellikleri

Farklı ortamlar için farklı filtre düğümü yapılandırmalarını yönetmenizi ve filtre düğümü değişikliklerini aşamalı olarak uygulamanızı sağlayan üç ana özellik vardır:

* [Kaynak belirleme](#resource-identification)
* [Ayrı Wallarm hesapları ve alt hesapları](#separate-wallarm-accounts-and-sub-accounts)
* [Filtre düğümü işlem modu](../../configure-wallarm-mode.md)

### Kaynak Tanımlama

Belirlenen bir ortam için filtre düğümünü yapılandırmanın iki yolu vardır:

* Her ortam için Wallarm benzersiz kimlikleri,
* ortamların farklı URL alan adları (zaten mimarinizde yapılandırılmışsa).

#### Kimlikle Ortam Belirleme

Uygulamalar kavramı, farklı korunan ortamlara farklı kimlikler atamanızı ve her ortam için filtre düğümü kurallarını ayrı ayrı yönetmenizi sağlar.

Bir filtre düğümü yapılandırırken, Uygulamalar kavramını kullanarak ortamlarınız için Wallarm kimliklerini ekleyebilirsiniz. Kimlikleri ayarlamak için:

1. Wallarm hesabınızda **Ayarlar** → **Uygulamalar** bölümünde ortam adları ve kimliklerini ekleyin.

    ![Eklenmiş ortamlar](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/added-applications.png)
2. Bir filtre düğümünde kimlik yapılandırmasını belirtin:

    *  Linux tabanlı, Kubernetes yan arabası ve Docker tabanlı dağıtımlar için [`wallarm_application`](../../configure-parameters-en.md#wallarm_application) yönergesini kullanma;
    *  Kubernetes NGINX Ingress controller dağıtımları için [`nginx.ingress.kubernetes.io/wallarm-application`](../../configure-kubernetes-en.md#ingress-annotations) ek açıklamasını kullanma. Şimdi, yeni bir filtre düğümü kuralı oluştururken, kuralın özel uygulama kimliklerinin bir setine atanacağını belirtebilirsiniz. Attribüt olmadan, yeni bir kural otomatik olarak bir Wallarm hesabındaki tüm korunan kaynaklara uygulanır.

![Kimlik için kural oluşturma](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-id.png)

#### Alan Adıyla Ortam Belirleme

Her ortam, `HOST` HTTP istek başlığında iletilen farklı URL alan adlarını kullanıyorsa, alan adlarını her ortamın benzersiz belirleyicileri olarak kullanmak mümkündür.

Özelliği kullanmak için, lütfen her yapılandırılmış filtre düğümü kuralı için uygun `HOST` başlık işaretçisi ekleyin. Aşağıdaki örnekte, kural yalnızca `HOST` başlığı `dev.domain.com` olan istekler için tetiklenecektir:

![HOST için kural oluşturma](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-host.png)

### Ayrı Wallarm Hesapları ve Alt Hesaplar

Farklı ortamların filtre düğümü yapılandırmasını izole etmenin kolay bir yolu, her ortam veya ortam grubu için ayrı Wallarm hesapları kullanmaktır. Bu en iyi uygulama, birçok bulut hizmeti sağlayıcısı tarafından önerilir, bu arada Amazon AWS.

Birkaç Wallarm hesabını yönetmeyi basitleştirmek için, mantıksal bir `ana` Wallarm hesabı oluşturabilir ve diğer kullanılan Wallarm hesaplarını `ana` hesaba alt hesaplar olarak atayabilirsiniz. Bu şekilde, organizasyonunuza ait tüm Wallarm hesaplarını yönetmek için tek bir konsol kullanıcı arayüzü ve API kimlik bilgisi seti kullanılabilir.

Bir `ana` hesap ve alt hesapları etkinleştirmek için lütfen [Wallarm'ın Teknik Destek](mailto:support@wallarm.com) ekibi ile iletişime geçin. Bu özellik ayrı bir Wallarm kurumsal lisansı gerektirir.

!!! uyarı "Bilinen kısıtlamalar" 
    * Aynı Wallarm hesabına bağlı tüm filtreleme düğümleri, aynı dizi trafik filtrasyon kurallarını alacaktır. Hala uygun [uygulama kimlikleri veya benzersiz HTTP istek başlıkları](#resource-identification) kullanarak farklı uygulamalar için farklı kurallar uygulayabilirsiniz.
    * Eğer filtreleme düğümü otomatik olarak bir IP adresini engellemeye karar verirse (örneğin, IP adresinden üç veya daha fazla tespit edilen saldırı vektörü nedeniyle) sistem, bir Wallarm hesabındaki tüm uygulamalar için IP’yi engelleyecektir.