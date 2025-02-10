[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# API Anahtarları

Wallarm Konsolu → **Ayarlar** → **API anahtarları** alanından, [API istek doğrulaması](../../api/overview.md) için anahtarları yönetebilirsiniz.

![Wallarm API anahtarı][img-api-tokens-edit]

Bu bölüm, **Sadece Okunabilir** ve **API geliştirici** hariç olmak üzere **[tüm roller][user-roles-article]** kullanıcıları için kullanılabilir.

## Anahtarların konfigürasyonu

Kullanıcılar kendi anahtarlarını oluşturabilir ve onları kullanabilir (bu, anahtar değerini görüntülemek ve onu API isteği doğrulamasına dahil etmek anlamına gelir). Her anahtarınız için izinler belirleyebilirsiniz, ancak izinler, kullanıcı izinlerinizden daha geniş olamaz. Opsiyonel olarak, anahtarın son kullanma tarihini belirleyebilirsiniz - belirlenirse, anahtar bu tarihten sonra devre dışı bırakılır. Ayrıca anahtarlarınızı manuel olarak aktif hale getirebilir veya pasif hale getirebilirsiniz.

Anahtar değerini istediğiniz zaman yenileyebilirsiniz.

**Yöneticiler** / **Global Yöneticiler**, şirket hesabındaki tüm anahtarları görüntüleyebilir ve yönetebilir. Kendi özel anahtarlarının yanı sıra, diğer yöneticilerin görüntüleyebileceği/ kullanabileceği paylaşılan anahtarlar da oluşturabilirler. Anahtarlar için izin belirlerken, bu izinleri seçilen rolden almayı seçebilirler:

* Yönetici
* Analist
* API Geliştirici
* Sadece okunabilir
* Hedefleme - Bu roldeki API anahtarları,[Wallarm düğümlerini hedeflemek için](../../user-guides/nodes/nodes.md#creating-a-node) kullanılır
* Özel - manuel izin seçimine geri döner

!!! info "Anahtar gizliliği"
    Başka kullanıcılar (hatta yöneticiler bile) özel anahtarlarınızı kullanamaz (yani, anahtar değerini görüntüleyemez veya kopyalayamaz). Ayrıca, yönetici olmayanlar anahtarlarınızı bile göremez.

Şunları dikkate alın:

* Anahtar sahibi [devre dışı bırakıldıysa](../../user-guides/settings/users.md#disabling-and-deleting-users), tüm anahtarlar özomatik olarak devre dışı bırakılır.
* Anahtar sahibinin izinleri azaltıldıysa, ilgili izinler tüm anahtarlarından kaldırılır.
* Tüm pasif hale getirilen anahtarlar, pasif hale getirilmelerinden bir hafta sonra otomatik olarak silinir.
* Daha önce devre dışı bırakılan bir anahtarı etkinleştirmek için, onu yeni bir son kullanma tarihi ile kaydedin.

## Küresel rol izinleri ile anahtar oluşturma

Global Yönetici, Global Analist veya Global Salt Okunur gibi global [rollerin](../../user-guides/settings/users.md#user-roles) izinlerine dayanan bir API anahtarı oluşturmak için şu adımları izleyin:

1. Uygun kullanıcı ile [ABD](https://us1.my.wallarm.com/) veya [AB](https://my.wallarm.com/) Wallarm Konsolu'na giriş yapın.
1. Sağ üstte,`?` → **Wallarm API Konsolu** seçeneğini seçin. Wallarm API konsolu açılır:

    * https://apiconsole.us1.wallarm.com/ ABD Bulutu için
    * https://apiconsole.eu1.wallarm.com/ AB Bulutu için

    Wallarm API Konsolu'nun otantikasyon verilerini Wallarm Konsolu'ndan aldığını unutmayın. Wallarm Konsolu'ndaki kullanıcıyı değiştirirseniz, yeni otantikasyon için Wallarm API Konsolu sayfasını yenileyin.
 
1. Aşağıdaki parametrelerle `/v2/api_tokens` rotasına POST isteği gönderin:

    ```bash
    {
    "client_id": <CLIENT_ID>,
    "realname": "<API_ANAHTARI_ICIN_ISIM>",
    "user_id": <USER_ID>,
    "enabled": true,
    "expire_at": "<TOKEN_EXPIRATION_DATE_AND_TIME>",
    "permissions": [
        "<Gerekli Küresel Rol>"
    ]
    }
    ```

    Bu değerlerin anlamları:

    * `<API_ANAHTARI_ICIN_ISIM>` anahtarın amacını açıklaması önerilir.
    * `<USER_ID>` anahtarı sahip olan kullanıcıyı ve `<CLIENT_ID>` bu kullanıcının ait olduğu şirket hesabını belirler.
    
        Bu kimlik bilgilerini `/v1/user` rotasına POST isteği göndererek edinebilirsiniz.

    * `<TOKEN_EXPIRATION_DATE_AND_TIME>` [ISO 8601 formatında](https://www.cl.cam.ac.uk/~mgk25/iso-time.html), örneğin `2033-06-13T04:56:01.037Z`.
    * `<REQUIRED_GLOBAL_ROLE>` olabilir:
        
        * `partner_admin` Küresel Yönetici için
        * `partner_analytic` Küresel Analist için
        * `partner_auditor` Küresel Salt Okunur için

    ??? info "Örnek"
        ```bash
        {
        "client_id": 1010,
        "realname": "Tenant oluşturma için token",
        "user_id": 10101011,
        "enabled": true,
        "expire_at": "2033-06-13T04:56:01.037Z",
        "permissions": [
            "partner_admin"
        ]
        }
        ```

        Bu talep, [tenant oluşturma](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api) için kullanılabilecek Global Yönetici yetkileriyle bir API anahtarı oluşturur.

1. Yanıttan, oluşturulan token'in `id` sini alın ve bu `id` i kullanarak `/v2/api_tokens/{id}/secret` yönlendirmesine GET isteği gönderin.
1. Yanıttan `secret` değerini kopyalayın ve isteği doğrulamak için API anahtarı olarak kullanın.

    !!! info "Wallarm Konsolu'ndan token kopyalama"
        Oluşturulan API anahtarı Wallarm Konsolu'nda görüntülendiği için, ayrıca **Settings** → **API Tokens** menüsünden de kopyalayabilirsiniz.

## Geriye dönük uyumlu anahtarlar

Daha önce istek doğrulama için UUID ve gizli anahtar kullanılıyordu, bu artık anahtarlarla değiştirildi. Kullandığınız UUID ve gizli anahtar otomatik olarak **geriye dönük uyumlu** anahtara dönüştürülür. Bu token ile UUID ve gizli anahtar ile doğrulanan istekler çalışmaya devam eder.

!!! warning "Tokeni yenileyin veya SSO'yu etkinleştirin"
    Geriye dönük uyumlu tokenin değerini yenilerseniz veya bu token’in sahibi için [SSO/strict SSO](../../admin-en/configuration-guides/sso/setup.md) özelliğini etkinleştirirseniz, geriye dönük uyumluluk sona erer - eski UUID ve gizli anahtar ile doğrulanan tüm istekler çalışmayı durdurur.

 Taleplerin `X-WallarmApi-Token` başlık parametresinde geriye dönük uyumlu tokenin oluşturulan değerini de geçirebilirsiniz.

Geriye dönük uyumlu token, kullanıcı rolünün sahip olduğu aynı izinlere sahiptir, bu izinler token penceresinde görünmez ve değiştirilemez. İzinleri kontrol etmek istiyorsanız, geriye dönük uyumlu bir tokeni kaldırmanız ve yeni bir tane oluşturmanız gerekmektedir.

## API anahtarlarına karşı düğüm anahtarları

Bu makalede açıklanan API anahtarlarını, herhangi bir istemciden ve herhangi bir izin kümesiyle Wallarm Cloud API [istek doğrulaması](../../api/overview.md) içinde kullanabilirsiniz.

Wallarm Cloud API'ye erişen işleyenler arasında Wallarm filtreleme düğümü de bulunmaktadır. Wallarm Bulut API'sine filtreleme düğümünün erişimini sağlamak için, API anahtarları dışında düğüm anahtarları da kullanabilirsiniz. [Farkı ve tercih edilecek seçeneği buradan öğrenebilirsiniz →](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "API Anahtarları bazı dağıtım seçeneklerini desteklemiyor"
    API anahtarları şu anda [Kong Ingress controllerlara](../../installation/kubernetes/kong-ingress-controller/deployment.md) ve [Terraform modülü](../../installation/cloud-platforms/aws/terraform-module/overview.md) tabanlı AWS dağıtımlarına karşı kullanılamaz. Bunun yerine düğüm anahtarlarını kullanın.
